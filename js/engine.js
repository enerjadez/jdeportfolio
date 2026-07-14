/* ============================================================
   JDE DECK ENGINE
   One small runtime, many self-contained cards.

   A card is one file in js/cards/ that calls:

     JDE.card({
       id:'mycard',            // section id (deep-linkable: #mycard)
       act:'07',               // label on the tab + frame index
       tab:'The Rain',         // right side of the tab
       theme:'prain',          // css class on the <section>
       nav:'Rain',             // optional — adds a top-nav link
       every:1,                // optional — draw every Nth frame
       inlineCanvas:false,     // true = html supplies <canvas data-card-canvas>
       html:`...`,             // panel-inner content
       init(card){},           // optional — wire buttons, listeners
       resize(w,h,card){},     // optional — rebuild size-dependent state
       draw(ctx,w,h,t,card){}, // the world itself. t = seconds alive.
     });

   The engine owns: DOM build, canvas sizing/DPR, the single rAF
   clock, scroll fold, frame index, boot, cursor. Only the 1–2
   cards actually visible in the sticky stack are drawn. A card
   that throws repeatedly is disabled alone — the deck survives.
   ============================================================ */
window.JDE=(function(){
'use strict';

const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE=matchMedia('(max-width:760px)').matches;
const COARSE=matchMedia('(pointer:coarse)').matches;
const FINE=matchMedia('(pointer:fine)').matches;
const DPR=Math.min(devicePixelRatio||1,1.5);

/* ---- shared pointer state (viewport space) ---- */
const P={x:.5,y:.5,px:innerWidth/2,py:innerHeight/2};
function onPtr(e){
  P.px=e.clientX;P.py=e.clientY;
  P.x=P.px/Math.max(1,innerWidth);P.y=P.py/Math.max(1,innerHeight);
}
addEventListener('pointermove',onPtr,{passive:true});
addEventListener('pointerdown',onPtr,{passive:true});

/* ---- shared value noise ----
   NB: Math.imul keeps the multiplies in 32-bit — the float version
   of this hash silently loses low bits and averages .25, which
   starved every noise field (the old "math looks dead" bug). */
function hash(ix,iy){
  let n=(Math.imul(ix,374761393)+Math.imul(iy,668265263))|0;
  n=Math.imul(n^(n>>>13),1274126177);
  n^=n>>>16;
  return (n>>>0)/4294967296;
}
function noise2(x,y){
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
  const sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
  const a=hash(ix,iy),b=hash(ix+1,iy),c=hash(ix,iy+1),d=hash(ix+1,iy+1);
  return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;
}
function fbm(x,y){return noise2(x,y)*.6+noise2(x*2.1,y*2.1)*.3+noise2(x*4.3,y*4.3)*.1;}

/* ---- the deck ---- */
const defs=[];
const cards=[];
function card(def){defs.push(def);}

function build(){
  const main=document.getElementById('deck');
  const navLinks=document.getElementById('navLinks');
  const frameIndex=document.getElementById('frameIndex');
  for(const def of defs){
    const el=document.createElement('section');
    el.className='panel '+(def.theme||'');
    if(def.id)el.id=def.id;
    el.setAttribute('aria-label',`Act ${def.act} — ${def.tab}`);
    el.innerHTML=
      `<div class="panel-tab"><span>Act ${def.act}</span><span class="dotline"></span><span>${def.tab}</span></div>`+
      `<div class="panel-inner">${def.html||''}</div>`;
    let canvas;
    if(def.inlineCanvas){
      canvas=el.querySelector('canvas[data-card-canvas]');
    }else{
      canvas=document.createElement('canvas');
      canvas.className='art';canvas.setAttribute('aria-hidden','true');
      el.insertBefore(canvas,el.firstChild);
    }
    /* fold dimmer — a plain black overlay is far cheaper to composite
       than a brightness() filter on a full-screen sticky layer */
    const shade=document.createElement('div');
    shade.className='panel-shade';shade.setAttribute('aria-hidden','true');
    el.appendChild(shade);
    main.appendChild(el);
    const c={
      def,el,canvas,shade,
      host:canvas?canvas.parentElement:el,
      ctx:canvas?canvas.getContext('2d'):null,
      w:0,h:0,t:0,every:def.every||1,errs:0,dead:!canvas,
    };
    cards.push(c);
    if(def.nav&&navLinks){
      const a=document.createElement('a');
      a.href='#'+def.id;a.textContent=def.nav;
      navLinks.appendChild(a);
    }
    if(frameIndex){
      const s=document.createElement('span');
      s.textContent=def.act;
      frameIndex.appendChild(s);
    }
    if(def.init){try{def.init(c);}catch(err){console.error('[JDE] init',def.id,err);}}
  }
}

/* ---- canvas sizing ---- */
function ensureSize(c){
  const w=c.host.clientWidth,h=c.host.clientHeight;
  if(w<2||h<2)return false;
  if(c.w!==w||c.h!==h){
    c.w=w;c.h=h;
    c.canvas.width=Math.round(w*DPR);
    c.canvas.height=Math.round(h*DPR);
    c.ctx.setTransform(DPR,0,0,DPR,0,0);
    if(c.def.resize){try{c.def.resize(w,h,c);}catch(err){console.error('[JDE] resize',c.def.id,err);}}
  }
  return true;
}

/* ---- draw one card, with failure isolation ---- */
function drawCard(c){
  if(c.dead||!ensureSize(c))return;
  try{c.def.draw(c.ctx,c.w,c.h,c.t,c);c.errs=0;}
  catch(err){
    console.error('[JDE] draw',c.def.id,err);
    if(++c.errs>5){c.dead=true;console.error('[JDE] card disabled:',c.def.id);}
  }
}

/* ---- scroll: fold covered cards, pick who animates ---- */
let animSet=[0],activeIdx=0,scrollQueued=false;
const bar=()=>document.getElementById('scrollbar');
function onScrollRaw(){
  const vh=innerHeight||600;
  const tops=cards.map(c=>c.el.getBoundingClientRect().top);
  const set=[];let active=0;
  for(let i=0;i<cards.length;i++){
    if(tops[i]<=vh*.5)active=i;
    if(tops[i]>=vh)break;
    const nt=i+1<cards.length?tops[i+1]:1;
    if(nt>0)set.push(i);            /* on screen and not fully covered */
  }
  animSet=set.length?set:[0];
  activeIdx=active;
  if(!REDUCE){
    for(let i=0;i<cards.length;i++){
      const nt=i+1<cards.length?tops[i+1]:vh;
      const covered=Math.min(1,Math.max(0,1-nt/vh));
      const st=cards[i].el.style;
      /* only cards mid-transition carry fold styles — fully buried
         cards are invisible under the stack, so clearing keeps the
         compositor from holding 11 transformed layers alive */
      if(covered>0&&covered<1){
        st.transform=`scale(${1-covered*.07}) translateY(${covered*-18}px)`;
        cards[i].shade.style.opacity=(covered*.5).toFixed(3);
      }else{
        st.transform='';
        cards[i].shade.style.opacity=covered>=1?'0.5':'0';
      }
    }
  }
  const idx=document.querySelectorAll('#frameIndex span');
  idx.forEach((s,i)=>s.classList.toggle('on',i===active));
  const max=document.documentElement.scrollHeight-innerHeight;
  const b=bar();
  if(b&&max>0)b.style.width=(scrollY/max*100)+'%';
}
function onScroll(){
  if(scrollQueued)return;scrollQueued=true;
  requestAnimationFrame(()=>{scrollQueued=false;onScrollRaw();});
}

/* ---- the clock ---- */
let last=0,frameN=0;
function tick(now){
  requestAnimationFrame(tick);
  if(document.hidden)return;
  if(!last){last=now;return;}
  const dt=Math.min(.05,(now-last)/1000);last=now;frameN++;
  for(const i of animSet){
    const c=cards[i];if(!c)continue;
    c.t+=dt;
    if(c.every>1&&frameN%c.every)continue;
    drawCard(c);
  }
}

/* ---- boot sequence — always dismisses, never traps ---- */
function boot(){
  const el=document.getElementById('boot'),lines=document.getElementById('bootLines');
  if(!el)return;
  let done=false;
  const finish=()=>{if(done)return;done=true;el.classList.add('done');el.setAttribute('aria-hidden','true');};
  if(REDUCE){finish();return;}
  const script=[
    '> reality.boot --showcase',
    '> loading wavefunctions ......... ok',
    '> igniting engines .............. ok',
    '> opening singularity ........... ok',
    '> locating the source ........... found',
    `> shuffling ${defs.length} cards ............ ok`,
    '> productivity(reality) += ∞',
  ];
  let i=0;
  const iv=setInterval(()=>{
    if(done){clearInterval(iv);return;}
    if(lines){const d=document.createElement('div');d.textContent=script[i];lines.appendChild(d);}
    if(++i>=script.length){clearInterval(iv);setTimeout(finish,360);}
  },140);
  const skip=()=>{clearInterval(iv);finish();};
  el.addEventListener('click',skip);
  el.addEventListener('touchstart',skip,{passive:true});
  addEventListener('keydown',e=>{if(!done&&(e.key==='Enter'||e.key===' '||e.key==='Escape'))skip();},{once:false});
  setTimeout(finish,2600); /* hard failsafe */
}

/* ---- custom cursor — fine pointers only ---- */
function cursor(){
  if(!(FINE&&!COARSE))return;
  document.body.classList.add('has-cursor');
  const c=document.getElementById('cursor');if(!c)return;
  let x=innerWidth/2,y=innerHeight/2,moving=false;
  function step(){
    x+=(P.px-x)*.24;y+=(P.py-y)*.24;
    c.style.transform=`translate3d(${(x-13)|0}px,${(y-13)|0}px,0)`;
    if(Math.abs(P.px-x)>.4||Math.abs(P.py-y)>.4)requestAnimationFrame(step);
    else moving=false;
  }
  addEventListener('pointermove',()=>{if(!moving){moving=true;requestAnimationFrame(step);}},{passive:true});
  document.addEventListener('pointerover',e=>{
    c.classList.toggle('hot',!!e.target.closest('a,button,.turbine-wrap,input'));
  },{passive:true});
}

/* ---- init ---- */
function init(){
  build();
  boot();
  cursor();
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',()=>{for(const c of cards)c.w=0;onScroll();},{passive:true});
  onScrollRaw();
  if(REDUCE){
    /* static show: one beautiful frame per card, no motion */
    const drawAll=()=>{for(const c of cards)drawCard(c);};
    drawAll();
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(drawAll);
  }else{
    for(const i of animSet)drawCard(cards[i]);
    requestAnimationFrame(tick);
  }
  console.info(`[JDE] deck up · ${cards.length} cards · dpr ${DPR}`);
}

return {card,init,P,noise2,fbm,REDUCE,MOBILE,COARSE,DPR,
        get active(){return activeIdx;},get cards(){return cards;}};
})();
