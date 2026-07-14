/* ============================================================
   ACT 05 — THE SOURCE
   fbm-noise vector field, particles born at one golden point,
   luminous pulse rings that light particles as they pass,
   cursor vortex.
   ============================================================ */
(()=>{
const {P,fbm,MOBILE}=JDE;
let pts=null,W=0,H=0;
let N=MOBILE?900:1500;         /* self-tunes down if the device struggles */
const N_FLOOR=600;
let slow=0,checked=0;
const PULSE_EVERY=2.4,PULSE_SPEED=260;

function spawn(w,h,anywhere){
  const sx=w*.22,sy=h*.62;
  if(anywhere)return {x:Math.random()*w,y:Math.random()*h,life:Math.random()*220};
  const a=Math.random()*Math.PI*2,r=Math.random()*14;
  return {x:sx+Math.cos(a)*r,y:sy+Math.sin(a)*r,life:160+Math.random()*160};
}
function reset(w,h){W=w;H=h;pts=[];for(let i=0;i<N;i++)pts.push(spawn(w,h,true));}

JDE.card({
  id:'source',
  act:'05',
  tab:'The Source',
  theme:'p5',
  html:`
    <p class="eyebrow">Connected to the current</p>
    <h2 class="display">The source of<br>all flow and life.</h2>
    <p class="lede">Thousands of particles riding one continuous field of coherent noise, reborn forever at a single golden point. Pulses ripple outward and light everything they touch. Your hand is a vortex — move it through the stream.</p>
    <div class="flow-legend">
      <div>field ....... θ(x,y,t) = fbm value noise</div>
      <div>pulse ....... c·t rings, every 2.4 s</div>
      <div>your hand ... a vortex in the field</div>
    </div>`,
  resize(w,h){reset(w,h);},
  draw(ctx,w,h,t){
    if(!pts||W!==w||H!==h)reset(w,h);
    const frameStart=performance.now();
    ctx.fillStyle='rgba(3,17,13,.09)';ctx.fillRect(0,0,w,h);

    const sx=w*.22,sy=h*.62;
    const mx=P.x*w,my=P.y*h;
    const pt2=t%PULSE_EVERY,pulseR=pt2*PULSE_SPEED;

    ctx.lineWidth=1;
    for(const p of pts){
      let a=fbm(p.x*.0035+t*.02,p.y*.0035)*Math.PI*4;
      const dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;
      if(d2<160*160)a+=(1-Math.sqrt(d2)/160)*2.4;    /* cursor vortex */
      const vx=Math.cos(a)*1.6,vy=Math.sin(a)*1.6;
      const nx=p.x+vx,ny=p.y+vy;

      const ds=Math.hypot(p.x-sx,p.y-sy);
      const dsn=ds/Math.hypot(w,h);
      const gold=Math.max(0,1-dsn*3.2);
      const band=Math.exp(-Math.pow((ds-pulseR)/26,2)); /* pulse boost */
      const A=.16+gold*.5+band*.7;
      ctx.strokeStyle=`rgba(${(90+gold*165+band*60)|0},${(140+gold*60+band*70)|0},${(120-gold*60+band*80)|0},${Math.min(.95,A)})`;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(nx,ny);ctx.stroke();

      p.x=nx;p.y=ny;p.life--;
      if(p.life<0||p.x<-20||p.x>w+20||p.y<-20||p.y>h+20)Object.assign(p,spawn(w,h,false));
    }

    /* the source: pulsing gold core + the expanding ring itself */
    const pulse=1+Math.sin(t*2.2)*.12;
    const g=ctx.createRadialGradient(sx,sy,0,sx,sy,60*pulse);
    g.addColorStop(0,'rgba(255,230,160,.9)');
    g.addColorStop(.25,'rgba(232,180,74,.45)');
    g.addColorStop(1,'rgba(232,180,74,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy,60*pulse,0,7);ctx.fill();
    ctx.strokeStyle=`rgba(232,180,74,${Math.max(0,.5-pt2*.2)})`;
    ctx.lineWidth=1.2;
    ctx.beginPath();ctx.arc(sx,sy,pulseR,0,7);ctx.stroke();

    /* adaptive quality: if this world costs >14ms a frame on this
       device, shed particles until it doesn't (floor 600) */
    if(N>N_FLOOR){
      if(performance.now()-frameStart>14)slow++;
      if(++checked>=30){
        if(slow>15){N=Math.max(N_FLOOR,(N*.7)|0);pts.length=N;}
        slow=0;checked=0;
      }
    }
  },
});
})();
