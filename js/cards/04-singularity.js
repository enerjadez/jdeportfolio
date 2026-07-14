/* ============================================================
   ACT 04 — THE SINGULARITY · slow, heavy, inevitable
   Kepler disk (ω ∝ r^-3/2), lensed starlight, a doomed star
   making one pass every 16 seconds. Gravity shouldn't hurry.
   ============================================================ */
(()=>{
const {MOBILE}=JDE;
let disk=null,stars=null;
const stream=[];
const STAR_CYCLE=16;

JDE.card({
  id:'singularity',
  act:'04',
  tab:'The Singularity',
  theme:'p4',
  html:`
    <p class="eyebrow">Kepler orbits · doppler beaming · lensed starlight</p>
    <h2 class="display" style="font-size:clamp(34px,5.5vw,74px)">Watch it feed.</h2>
    <div class="skill-chips">
      <span>ω ∝ r<sup>-3/2</sup></span><span>photon ring</span><span>gravitational lensing</span>
      <span>doppler beaming</span><span>spaghettification</span>
    </div>`,
  resize(){disk=null;stream.length=0;},
  draw(ctx,w,h,t){
    const cx=w*.5,cy=h*.42,RS=Math.min(w,h)*.09;

    if(!disk){
      disk=[];stars=[];
      const n=MOBILE?450:800;
      for(let i=0;i<n;i++)disk.push({a:Math.random()*Math.PI*2,r:RS*(1.4+Math.pow(Math.random(),1.6)*4.5),z:(Math.random()-.5)*.22});
      for(let i=0;i<140;i++)stars.push({x:Math.random(),y:Math.random(),m:Math.random()});
    }

    ctx.fillStyle='#020208';ctx.fillRect(0,0,w,h);

    /* lensed background stars */
    for(const s of stars){
      let x=s.x*w,y=s.y*h;
      const dx=x-cx,dy=y-cy,d=Math.max(1,Math.hypot(dx,dy));
      const bend=(RS*RS*2.2)/d;
      x+=dx/d*bend;y+=dy/d*bend;
      if(d<RS*1.35)continue;
      ctx.globalAlpha=.25+s.m*.6;ctx.fillStyle='#cdd3ff';
      ctx.fillRect(x,y,s.m>.9?2:1,s.m>.9?2:1);
    }
    ctx.globalAlpha=1;

    /* the doomed star: one slow pass every 16s */
    const oa=(t%STAR_CYCLE)/STAR_CYCLE*Math.PI*2;
    const starX=cx+Math.cos(oa)*w*.42;
    const starY=cy+Math.sin(oa)*h*.30-h*.06;
    const dStar=Math.hypot(starX-cx,starY-cy);
    const doomed=dStar<RS*3.4;
    const eaten=doomed?Math.min(1,(RS*3.4-dStar)/(RS*2)):0;
    const starR=6*(1-eaten*.75);
    const sg=ctx.createRadialGradient(starX,starY,0,starX,starY,starR*4);
    sg.addColorStop(0,'rgba(255,250,230,.95)');sg.addColorStop(.4,'rgba(255,220,150,.4)');sg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sg;ctx.beginPath();ctx.arc(starX,starY,starR*4,0,7);ctx.fill();
    if(doomed&&stream.length<600){
      for(let i=0;i<2;i++)
        stream.push({x:starX,y:starY,a:Math.atan2(starY-cy,starX-cx),r:dStar,life:1});
    }
    ctx.globalCompositeOperation='lighter';
    for(const p of stream){
      p.a+=0.45*Math.pow(RS/Math.max(p.r,RS),1.5);  /* lazy spiral */
      p.r-=0.7;p.life-=.0035;
      if(p.life<=0||p.r<RS*1.1)continue;
      const x=cx+Math.cos(p.a)*p.r,y=cy+Math.sin(p.a)*p.r*.5;
      ctx.fillStyle=`rgba(255,${(200-p.life*60)|0},140,${p.life*.7})`;
      ctx.fillRect(x,y,1.6,1.6);
    }
    for(let i=stream.length-1;i>=0;i--)if(stream[i].life<=0||stream[i].r<RS*1.1)stream.splice(i,1);

    /* accretion disk */
    const tilt=.32;
    for(const p of disk){
      p.a+=0.3*Math.pow(RS/p.r,1.5);
      p.r-=0.005;
      if(p.r<RS*1.15)p.r=RS*(1.6+Math.random()*4.3);
      const x=cx+Math.cos(p.a)*p.r;
      const y=cy+Math.sin(p.a)*p.r*tilt+p.z*p.r;
      const behind=Math.sin(p.a)<0;
      const dop=.5+.5*Math.cos(p.a);
      const heat=Math.min(1,RS*2.2/p.r);
      const G=140+dop*90-heat*30,B=60+dop*160;
      const alpha=(behind?.35:.85)*(.25+heat*.75);
      ctx.fillStyle=`rgba(255,${G|0},${B|0},${alpha})`;
      ctx.fillRect(x,y,behind?1:1.6,behind?1:1.6);
      if(behind&&Math.abs(x-cx)<RS*2.4){
        const ay=cy-Math.sqrt(Math.max(0,(RS*1.28)**2-(x-cx)**2))*.9;
        ctx.fillStyle=`rgba(255,${(180+dop*60)|0},120,${alpha*.8})`;
        ctx.fillRect(x,ay-(p.z*10),1.4,1.4);
      }
    }
    ctx.globalCompositeOperation='source-over';

    /* photon ring + shadow, slow shimmer */
    const shim=.85+Math.sin(t*1.1)*.08;
    const g=ctx.createRadialGradient(cx,cy,RS*.6,cx,cy,RS*1.5);
    g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.72,'rgba(0,0,0,1)');
    g.addColorStop(.8,`rgba(255,190,120,${shim})`);g.addColorStop(.86,'rgba(120,80,255,.25)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,RS*1.5,0,7);ctx.fill();

    ctx.font='11px IBM Plex Mono, monospace';ctx.fillStyle='rgba(255,255,255,.4)';
    ctx.fillText(doomed?'tidal disruption event in progress':'ω ∝ r^-3/2 · a star approaches',cx+RS*1.7,cy);
  },
});
})();
