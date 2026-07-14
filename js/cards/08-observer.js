/* ============================================================
   ACT 08 — THE OBSERVER
   A blueprint eye whose pupil follows your cursor and blinks;
   beside it, live telemetry of *you*: your screen, your pointer,
   your time on this page, the frames it has drawn for you.
   ============================================================ */
(()=>{
const {P,DPR}=JDE;
const blue='#0000f2';
const t0=performance.now();
let frames=0,fps=60,lastF=performance.now(),fCount=0;

JDE.card({
  id:'observer',
  act:'08',
  tab:'The Observer',
  theme:'peye',
  html:`
    <p class="eyebrow" style="color:var(--blue)">Fourth wall · status: broken</p>
    <h2 class="display">This page can<br>see you.</h2>
    <div class="telemetry" id="telemetry"></div>`,
  init(){
    /* fps meter independent of card visibility */
    (function meter(){
      fCount++;
      const now=performance.now();
      if(now-lastF>=1000){fps=fCount;fCount=0;lastF=now;}
      requestAnimationFrame(meter);
    })();
    /* telemetry text, 4x/sec */
    setInterval(()=>{
      const tel=document.getElementById('telemetry');
      if(!tel)return;
      const secs=((performance.now()-t0)/1000)|0;
      const mm=String((secs/60)|0).padStart(2,'0'),ss=String(secs%60).padStart(2,'0');
      const max=document.documentElement.scrollHeight-innerHeight;
      const sc=max>0?Math.round(scrollY/max*100):0;
      tel.innerHTML=
        `<div><b>your screen</b> .... ${innerWidth} × ${innerHeight} @ ${DPR}x</div>`+
        `<div><b>your pointer</b> ... ${P.px|0}, ${P.py|0} — we watch it move</div>`+
        `<div><b>time with us</b> ... ${mm}:${ss}</div>`+
        `<div><b>scroll depth</b> ... ${sc}% of the show</div>`+
        `<div><b>frames drawn</b> ... ${frames.toLocaleString()} for your eyes only</div>`+
        `<div><b>render</b> ......... ${fps} fps, live, right now</div>`;
    },250);
  },
  draw(ctx,w,h,t,card){
    frames++;
    ctx.clearRect(0,0,w,h);
    const cx=w*.72,cy=h*.44,R=Math.min(w,h)*.20;
    ctx.strokeStyle=blue;ctx.fillStyle=blue;

    /* blink: quick close every ~4.6s */
    const bp=t%4.6;
    const lid=bp<.28?Math.sin(bp/.28*Math.PI):0;   /* 0 open → 1 closed */

    /* almond outline (two arcs) */
    ctx.lineWidth=1.8;
    ctx.beginPath();
    ctx.moveTo(cx-R*1.6,cy);
    ctx.quadraticCurveTo(cx,cy-R*1.25*(1-lid),cx+R*1.6,cy);
    ctx.quadraticCurveTo(cx,cy+R*1.25*(1-lid*.9),cx-R*1.6,cy);
    ctx.closePath();ctx.stroke();

    if(lid<.92){
      ctx.save();ctx.clip();
      /* iris follows your cursor */
      const rect=card.canvas.getBoundingClientRect();
      const dx=P.px-(rect.left+cx),dy=P.py-(rect.top+cy);
      const d=Math.hypot(dx,dy)||1,off=Math.min(R*.45,d*.08);
      const ix=cx+dx/d*off,iy=cy+dy/d*off;
      /* iris ring + radial lines */
      ctx.lineWidth=1.6;
      ctx.beginPath();ctx.arc(ix,iy,R*.62,0,7);ctx.stroke();
      ctx.lineWidth=.7;ctx.globalAlpha=.6;
      for(let i=0;i<24;i++){
        const a=i/24*Math.PI*2+t*.15;
        ctx.beginPath();
        ctx.moveTo(ix+Math.cos(a)*R*.3,iy+Math.sin(a)*R*.3);
        ctx.lineTo(ix+Math.cos(a)*R*.6,iy+Math.sin(a)*R*.6);
        ctx.stroke();
      }
      ctx.globalAlpha=1;
      /* pupil + glint */
      ctx.beginPath();ctx.arc(ix,iy,R*.26,0,7);ctx.fill();
      ctx.fillStyle='#f2f0e9';
      ctx.beginPath();ctx.arc(ix-R*.08,iy-R*.09,R*.05,0,7);ctx.fill();
      ctx.fillStyle=blue;
      ctx.restore();
    }

    /* dimension ticks + label, schematic style */
    ctx.lineWidth=.7;ctx.setLineDash([4,6]);ctx.globalAlpha=.5;
    ctx.beginPath();ctx.arc(cx,cy,R*1.9,0,7);ctx.stroke();
    ctx.setLineDash([]);ctx.globalAlpha=1;
    ctx.font='11px IBM Plex Mono, monospace';
    ctx.globalAlpha=.7;
    ctx.fillText('SUBJECT: YOU',cx+R*1.4,cy-R*1.6);
    ctx.fillText(lid>.5?'(blinking)':'(tracking)',cx+R*1.4,cy-R*1.6+16);
    ctx.globalAlpha=1;
  },
});
})();
