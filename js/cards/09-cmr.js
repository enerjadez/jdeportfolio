/* ============================================================
   ACT 09 — CMR AFRICA · the elements
   Earth · Fire · Water · Air · Aether — five forces of insight
   as a living African geometric lattice. Featured real work.
   ============================================================ */
(()=>{
const {P,MOBILE}=JDE;
const ELEMENTS=[
  {name:'Earth',col:'#c45c26',orbit:.22,phase:0,symbol:'hex'},
  {name:'Fire',col:'#e85d04',orbit:.32,phase:1.2,symbol:'tri'},
  {name:'Water',col:'#1d4e89',orbit:.42,phase:2.4,symbol:'wave'},
  {name:'Air',col:'#f4d35e',orbit:.52,phase:3.6,symbol:'chev'},
  {name:'Aether',col:'#f8f1e3',orbit:.14,phase:.5,symbol:'star'},
];
let beads=[],nodes=[];

function reset(w,h){
  const cx=w*.62,cy=h*.48,R=Math.min(w,h)*.38;
  nodes=[];
  for(let ring=1;ring<=4;ring++){
    const n=ring*5;
    for(let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2+ring*.15,r=R*(.2+ring*.15);
      nodes.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r*.72,el:ELEMENTS[ring%5]});
    }
  }
  beads=[];
  for(let i=0;i<(MOBILE?36:60);i++){
    const el=ELEMENTS[i%5];
    beads.push({el,a:Math.random()*7,r:R*(el.orbit+Math.random()*.08),sp:(.4+Math.random()*.6)*(i%2?1:-1)*.35,size:1.2+Math.random()*2});
  }
}
function drawSymbol(ctx,type,x,y,s,col,t){
  ctx.save();ctx.translate(x,y);ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=1.4;
  if(type==='hex'){ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3+t*.1;const px=Math.cos(a)*s,py=Math.sin(a)*s;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.stroke();}
  else if(type==='tri'){ctx.beginPath();for(let i=0;i<3;i++){const a=-Math.PI/2+i*Math.PI*2/3+t*.2;i?ctx.lineTo(Math.cos(a)*s,Math.sin(a)*s):ctx.moveTo(Math.cos(a)*s,Math.sin(a)*s);}ctx.closePath();ctx.stroke();}
  else if(type==='wave'){ctx.beginPath();for(let i=0;i<=12;i++){const u=i/12,px=(u-.5)*s*2.2,py=Math.sin(u*Math.PI*2+t*2)*s*.35;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
  else if(type==='chev'){ctx.beginPath();ctx.moveTo(-s,s*.6);ctx.lineTo(0,-s*.5);ctx.lineTo(s,s*.6);ctx.stroke();}
  else{ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?s*.4:s;i?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.stroke();}
  ctx.restore();
}

JDE.card({
  id:'cmr',
  act:'09',
  tab:'CMR Africa · Elements',
  theme:'pcmr',
  nav:'CMR',
  html:`
    <p class="eyebrow">Featured · Creative Market Research</p>
    <h2 class="display">Where culture<br>becomes signal.</h2>
    <p class="lede">Earth · Fire · Water · Air · Aether — five forces of insight as a living African geometric lattice.</p>
    <div class="element-row" aria-hidden="true">
      <span class="e-earth"><i></i>Earth</span>
      <span class="e-fire"><i></i>Fire</span>
      <span class="e-water"><i></i>Water</span>
      <span class="e-air"><i></i>Air</span>
      <span class="e-aether"><i></i>Aether</span>
    </div>
    <div class="cta-row">
      <a class="btn solid" href="https://cmrafrica.com/" target="_blank" rel="noopener noreferrer">Visit cmrafrica.com →</a>
    </div>`,
  resize(w,h){reset(w,h);},
  draw(ctx,w,h,t,card){
    if(!nodes.length)reset(w,h);
    const cx=w*.62,cy=h*.48,R=Math.min(w,h)*.38;
    const rect=card.canvas.getBoundingClientRect();
    const lx=P.px-rect.left,ly=P.py-rect.top;
    const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.8);
    bg.addColorStop(0,'#2a1810');bg.addColorStop(1,'#0e0806');
    ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    for(let ring=1;ring<=5;ring++){
      ctx.strokeStyle=ELEMENTS[ring%5].col;ctx.globalAlpha=.12+ring*.03;
      ctx.beginPath();ctx.ellipse(cx,cy,R*(.18+ring*.14),R*(.18+ring*.14)*.72,0,0,7);ctx.stroke();
    }
    ctx.globalAlpha=1;
    for(const n of nodes){
      ctx.fillStyle=n.el.col;ctx.globalAlpha=.4;
      ctx.beginPath();ctx.moveTo(n.x,n.y-3);ctx.lineTo(n.x+3,n.y);ctx.lineTo(n.x,n.y+3);ctx.lineTo(n.x-3,n.y);ctx.closePath();ctx.fill();
      const d=Math.hypot(n.x-lx,n.y-ly);
      if(d<R*.28){ctx.globalAlpha=(1-d/(R*.28))*.4;ctx.strokeStyle=n.el.col;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(lx,ly);ctx.stroke();}
    }
    ctx.globalAlpha=1;
    for(const b of beads){
      b.a+=b.sp*.016;
      const x=cx+Math.cos(b.a)*b.r,y=cy+Math.sin(b.a)*b.r*.72;
      const g=ctx.createRadialGradient(x,y,0,x,y,b.size*3);
      g.addColorStop(0,b.el.col);g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,b.size*3,0,7);ctx.fill();
      ctx.globalCompositeOperation='source-over';ctx.fillStyle=b.el.col;ctx.beginPath();ctx.arc(x,y,b.size,0,7);ctx.fill();
    }
    for(let i=0;i<5;i++){
      const el=ELEMENTS[i],a=t*.25+el.phase+i*(Math.PI*2/5),rr=R*.55;
      drawSymbol(ctx,el.symbol,cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.72,14,el.col,t);
    }
    const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,R*.22);
    cg.addColorStop(0,'rgba(248,241,227,.9)');cg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=cg;ctx.beginPath();ctx.arc(cx,cy,R*.22,0,7);ctx.fill();
  },
});
})();
