/* ============================================================
   ACT 02 — THE MACHINE · turbine + airflow
   Blueprint turbine; air particles get swallowed, spun by the
   blades (tangential kick ∝ rpm), and thrown out the back.
   Hover (or touch and hold) to throttle up.
   ============================================================ */
(()=>{
const {MOBILE}=JDE;
const blue='#0000f2';
let rpm=.25,targetRpm=.25,angle=0;
const air=[];

function spawnAir(w,h){return {x:-10-Math.random()*40,y:Math.random()*h,vx:1.2+Math.random(),vy:0};}

JDE.card({
  id:'machine',
  act:'02',
  tab:'The Machine',
  theme:'p2',
  nav:'Machine',
  inlineCanvas:true,
  html:`
    <div class="grid2">
      <div>
        <p class="eyebrow" style="color:var(--blue)">Blueprint · live geometry</p>
        <h2 class="display" style="font-size:clamp(36px,6vw,80px)">The machine breathes.</h2>
        <p class="lede">Twelve parametric blades, a bolt circle, dimension lines — and the air itself, drawn as streamlines being swallowed and thrown. Hover the turbine to throttle up and watch the flow bend.</p>
        <div class="spec">
          <div><b>blades</b> ....... 12 · swept quads</div>
          <div><b>airflow</b> ...... 240 streamline particles</div>
          <div><b>throttle</b> ..... hover / hold · idle 250 rpm</div>
          <div><b>render</b> ....... canvas 2d · 60 fps</div>
        </div>
      </div>
      <div class="turbine-wrap"><canvas data-card-canvas></canvas></div>
    </div>`,
  init(card){
    const wrap=card.canvas.parentElement;
    const hi=()=>targetRpm=3.4, lo=()=>targetRpm=.25;
    wrap.addEventListener('pointerenter',hi,{passive:true});
    wrap.addEventListener('pointerleave',lo,{passive:true});
    wrap.addEventListener('pointerdown',hi,{passive:true});
    wrap.addEventListener('pointerup',lo,{passive:true});
    wrap.addEventListener('pointercancel',lo,{passive:true});
  },
  draw(ctx,w,h,t){
    rpm+=(targetRpm-rpm)*.045;angle+=rpm*.02;
    ctx.clearRect(0,0,w,h);
    const cx=w/2,cy=h/2,R=Math.min(w,h)*.4;

    /* ---- airflow behind the linework ---- */
    if(air.length===0)for(let i=0;i<(MOBILE?120:240);i++)air.push({...spawnAir(w,h),x:Math.random()*w});
    ctx.lineWidth=1;
    for(const p of air){
      const dx=p.x-cx,dy=p.y-cy,d=Math.hypot(dx,dy);
      const suck=Math.max(0,1-d/(R*2.2));
      p.vx+=suck*.25*(1+rpm*.4);
      p.vy+=(-dy/Math.max(d,1))*suck*.35;
      if(d<R){                                 /* inside: blades grab it */
        const tang=Math.atan2(dy,dx)+Math.PI/2;
        p.vx+=Math.cos(tang)*rpm*.5;
        p.vy+=Math.sin(tang)*rpm*.5;
        p.vx+=.6+rpm*.35;                      /* thrust out the back */
      }
      p.vx*=.96;p.vy*=.96;
      const nx=p.x+p.vx,ny=p.y+p.vy;
      const sp=Math.hypot(p.vx,p.vy);
      ctx.strokeStyle=`rgba(0,0,242,${Math.min(.55,.08+sp*.06)})`;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(nx,ny);ctx.stroke();
      p.x=nx;p.y=ny;
      if(p.x>w+20||p.y<-20||p.y>h+20)Object.assign(p,spawnAir(w,h));
    }

    /* ---- schematic linework ---- */
    ctx.strokeStyle=blue;ctx.fillStyle=blue;
    ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
    ctx.lineWidth=.7;ctx.setLineDash([4,6]);
    ctx.beginPath();ctx.arc(cx,cy,R*1.12,0,7);ctx.stroke();ctx.setLineDash([]);
    ctx.lineWidth=.5;ctx.globalAlpha=.5;
    ctx.beginPath();
    ctx.moveTo(cx-R*1.25,cy);ctx.lineTo(cx+R*1.25,cy);
    ctx.moveTo(cx,cy-R*1.25);ctx.lineTo(cx,cy+R*1.25);
    ctx.stroke();ctx.globalAlpha=1;

    const N=12;
    for(let i=0;i<N;i++){
      const a=angle+i*(Math.PI*2/N);
      ctx.beginPath();
      for(let s=0;s<=1;s+=.1){
        const r=R*.22+s*(R*.72),sweep=a+s*.9;
        const x=cx+Math.cos(sweep)*r,y=cy+Math.sin(sweep)*r;
        s===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      for(let s=1;s>=0;s-=.1){
        const r=R*.22+s*(R*.72),sweep=a+s*.9+.16*(1-s*.5);
        ctx.lineTo(cx+Math.cos(sweep)*r,cy+Math.sin(sweep)*r);
      }
      ctx.closePath();
      ctx.lineWidth=1.1;ctx.globalAlpha=.9;ctx.stroke();
      ctx.globalAlpha=.06;ctx.fill();ctx.globalAlpha=1;
    }

    ctx.lineWidth=1.4;
    ctx.beginPath();ctx.arc(cx,cy,R*.2,0,7);ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,R*.07,0,7);ctx.stroke();
    for(let i=0;i<6;i++){
      const a=angle+i*Math.PI/3;
      ctx.beginPath();ctx.arc(cx+Math.cos(a)*R*.14,cy+Math.sin(a)*R*.14,3,0,7);ctx.stroke();
    }
    ctx.font='11px IBM Plex Mono, monospace';ctx.globalAlpha=.75;
    ctx.fillText(`Ø ${(R*2|0)}px`,cx+R*.82,cy-R*1.02);
    ctx.fillText(`${(rpm*1000|0)} rpm`,cx+R*.82,cy-R*1.02+16);
    ctx.globalAlpha=1;
  },
});
})();
