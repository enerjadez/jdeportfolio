/* ============================================================
   ACT ~~ — THE SIGNAL · finale
   Layered sine ribbons with double-pass glow, drifting star
   specks, hue that slowly breathes. Pointer bends the field.
   ============================================================ */
(()=>{
const {P,MOBILE}=JDE;
const LINES=MOBILE?28:42;
const specks=[];

JDE.card({
  id:'signal',
  act:'~~',
  tab:'The Signal',
  theme:'p8',
  html:`
    <p class="eyebrow">Outro · carrier wave</p>
    <h2 class="display">Thanks for scrolling.</h2>
    <p class="mono-note">© 2026 · JDE · engines by hand, physics by math, magic by both</p>`,
  draw(ctx,w,h,t){
    ctx.clearRect(0,0,w,h);
    /* specks riding upward */
    if(specks.length<70)specks.push({x:Math.random()*w,y:h+10,v:.3+Math.random()*.8,m:Math.random()});
    ctx.fillStyle='#fff';
    for(const s of specks){
      s.y-=s.v;
      ctx.globalAlpha=s.m*.5;
      ctx.fillRect(s.x,s.y,s.m>.85?2:1,s.m>.85?2:1);
    }
    ctx.globalAlpha=1;
    for(let i=specks.length-1;i>=0;i--)if(specks[i].y<-10)specks.splice(i,1);

    const hueBase=225+Math.sin(t*.12)*18;
    for(let l=0;l<LINES;l++){
      const f=l/LINES,baseY=h*.16+f*h*.78,hue=hueBase+f*22;
      /* build the path once */
      const path=new Path2D();
      for(let x=0;x<=w;x+=6){
        const nx=x/w;
        const y=baseY
          +Math.sin(nx*6+t*.9+l*.35)*(14+f*30)*(.6+P.y)
          +Math.sin(nx*13-t*.6+l*.8)*6
          +Math.sin(nx*2.2+t*.25)*24*(P.x-.5)*2;
        x===0?path.moveTo(x,y):path.lineTo(x,y);
      }
      /* glow pass then core pass */
      ctx.strokeStyle=`hsla(${hue},100%,${50-f*14}%,${.05+f*.12})`;
      ctx.lineWidth=5+f*5;ctx.stroke(path);
      ctx.strokeStyle=`hsla(${hue},100%,${62-f*20}%,${.16+f*.55})`;
      ctx.lineWidth=.8+f*1.3;ctx.stroke(path);
    }
  },
});
})();
