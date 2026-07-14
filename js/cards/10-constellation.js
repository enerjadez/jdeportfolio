/* ============================================================
   ACT 10 — THE CONSTELLATION · comms
   Orbiting bodies with trails, lines linking neighbours and
   your cursor into one constellation; a comet crosses ~9s.
   ============================================================ */
(()=>{
const {P}=JDE;
const blue='#0000f2';
const bodies=[];
for(let i=0;i<7;i++)bodies.push({r:.10+i*.065,sp:.6/(i+1)+.12,a:Math.random()*7,e:.15+Math.random()*.25,trail:[]});

JDE.card({
  id:'comms',
  act:'10',
  tab:'The Constellation',
  theme:'p7',
  nav:'Comms',
  html:`
    <p class="eyebrow" style="color:var(--blue)">Open channel · your cursor joins the sky</p>
    <h2 class="display" style="font-size:clamp(34px,7vw,92px)">Let's build<br><a href="mailto:enerjadezn@gmail.com">an engine →</a></h2>
    <div class="socials">
      <a href="https://github.com/enerjadez" target="_blank" rel="noopener noreferrer">github</a>
      <a href="https://github.com/enerjadez/jdeportfolio" target="_blank" rel="noopener noreferrer">this repo</a>
      <a href="https://cmrafrica.com/" target="_blank" rel="noopener noreferrer">cmr africa</a>
      <a href="mailto:enerjadezn@gmail.com">email</a>
    </div>
    <p class="mono-note">Usually replies within one orbit (≈ 24h). Watch for the comet.</p>`,
  draw(ctx,w,h,t,card){
    ctx.clearRect(0,0,w,h);
    const cx=w*.74,cy=h*.34,base=Math.min(w,h);
    ctx.strokeStyle=blue;ctx.fillStyle=blue;
    const rect=card.canvas.getBoundingClientRect();
    const lx=P.px-rect.left,ly=P.py-rect.top;

    const pos=[];
    for(const b of bodies){
      b.a+=b.sp*.012;
      const rx=base*b.r,ry=base*b.r*(1-b.e);
      ctx.globalAlpha=.2;ctx.lineWidth=.8;
      ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,.4,0,7);ctx.stroke();
      const x=cx+Math.cos(b.a)*rx*Math.cos(.4)-Math.sin(b.a)*ry*Math.sin(.4);
      const y=cy+Math.cos(b.a)*rx*Math.sin(.4)+Math.sin(b.a)*ry*Math.cos(.4);
      b.trail.push([x,y]);if(b.trail.length>26)b.trail.shift();
      ctx.lineWidth=1.4;
      ctx.beginPath();
      b.trail.forEach((p,i)=>{ctx.globalAlpha=i/b.trail.length*.5;i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});
      ctx.stroke();
      ctx.globalAlpha=.95;
      ctx.beginPath();ctx.arc(x,y,3,0,7);ctx.fill();
      pos.push([x,y]);
    }
    /* constellation lines: neighbours + cursor */
    pos.push([lx,ly]);
    ctx.lineWidth=.8;
    for(let i=0;i<pos.length;i++)for(let j=i+1;j<pos.length;j++){
      const d=Math.hypot(pos[i][0]-pos[j][0],pos[i][1]-pos[j][1]);
      if(d<base*.24){
        ctx.globalAlpha=(1-d/(base*.24))*.5;
        ctx.beginPath();ctx.moveTo(pos[i][0],pos[i][1]);ctx.lineTo(pos[j][0],pos[j][1]);ctx.stroke();
      }
    }
    ctx.globalAlpha=.7;
    ctx.beginPath();ctx.arc(cx,cy,5,0,7);ctx.fill();

    /* comet: diagonal pass every 9s */
    const cT=(t%9)/9;
    if(cT<.35){
      const p2=cT/.35;
      const comx=-100+p2*(w+200),comy=h*.15+p2*h*.35;
      ctx.strokeStyle=blue;
      for(let i=0;i<14;i++){
        ctx.globalAlpha=(1-i/14)*.6;
        ctx.beginPath();
        ctx.moveTo(comx-i*14,comy-i*5);ctx.lineTo(comx-(i+1)*14,comy-(i+1)*5);
        ctx.stroke();
      }
      ctx.globalAlpha=1;ctx.fillStyle=blue;
      ctx.beginPath();ctx.arc(comx,comy,3.4,0,7);ctx.fill();
    }
    ctx.globalAlpha=1;
  },
});
})();
