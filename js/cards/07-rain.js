/* ============================================================
   ACT 07 — THE RAIN
   Columns of falling glyphs (katakana + digits). Trails come
   free from a translucent fade-fill. Your cursor is a hole in
   the rain — glyphs refuse to render near it. Every ~10s the
   rain dims and a message types itself to whoever is watching.
   ============================================================ */
(()=>{
const {P}=JDE;
const GLYPHS='アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789/<>+=*';
const FS=16;
let cols=null,W=0;
const MSG="WAKE UP — YES, YOU, HOLDING THE SCREEN";
const MSG_CYCLE=10;

JDE.card({
  id:'rain',
  act:'07',
  tab:'The Rain',
  theme:'prain',
  every:2,
  html:`
    <p class="eyebrow">Move your hand — the rain parts around it</p>
    <h2 class="display">Reality is<br>negotiable.</h2>
    <p class="mono-note">wait for the message · it knows you're there</p>`,
  draw(ctx,w,h,t,card){
    if(!cols||W!==w){
      W=w;cols=[];
      for(let i=0;i<Math.ceil(w/FS);i++)
        cols.push({y:Math.random()*-h,v:2.5+Math.random()*4});
      ctx.fillStyle='#020604';ctx.fillRect(0,0,w,h);
    }
    /* fade for trails */
    ctx.fillStyle='rgba(2,6,4,.10)';ctx.fillRect(0,0,w,h);

    const mCyc=t%MSG_CYCLE;
    const msgOn=mCyc>6.2;                     /* last ~3.8s of each cycle */
    const dim=msgOn?.35:1;

    /* cursor position relative to this canvas */
    const r=card.canvas.getBoundingClientRect();
    const hx=P.px-r.left,hy=P.py-r.top;

    ctx.font=FS+'px IBM Plex Mono, monospace';
    for(let i=0;i<cols.length;i++){
      const c=cols[i],x=i*FS;
      c.y+=c.v*2;
      if(c.y>h+40){c.y=Math.random()*-200;c.v=2.5+Math.random()*4;}
      /* the hand-hole: skip drawing near the pointer */
      const dx=x-hx,dy=c.y-hy;
      if(dx*dx+dy*dy<80*80)continue;
      /* head glyph bright, one echo above */
      const g1=GLYPHS[((i*31+(c.y/FS))|0)%GLYPHS.length];
      ctx.fillStyle=`rgba(200,255,220,${.95*dim})`;
      ctx.fillText(g1,x,c.y);
      ctx.fillStyle=`rgba(60,255,140,${.5*dim})`;
      ctx.fillText(GLYPHS[((i*17+(c.y/FS)-1)|0)%GLYPHS.length],x,c.y-FS);
    }

    /* faint ring where the hand parts the rain */
    if(hx>0&&hx<w&&hy>0&&hy<h){
      ctx.strokeStyle='rgba(60,255,140,.18)';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(hx,hy,80,0,7);ctx.stroke();
    }

    /* the message: types itself, glitching, then dissolves */
    if(msgOn){
      const p=Math.min(1,(mCyc-6.2)/1.6);
      const shown=MSG.slice(0,(p*MSG.length)|0);
      ctx.font='700 26px IBM Plex Mono, monospace';
      const tw=ctx.measureText(MSG).width;
      const bx=w/2-tw/2,by=h*.42;
      ctx.fillStyle='rgba(2,6,4,.75)';
      ctx.fillRect(bx-20,by-34,tw+40,52);
      ctx.strokeStyle='rgba(60,255,140,.5)';
      ctx.strokeRect(bx-20,by-34,tw+40,52);
      for(let i=0;i<shown.length;i++){
        const jx=(Math.random()-.5)*(Math.random()<.06?6:0);  /* rare glitch */
        ctx.fillStyle=Math.random()<.03?'#fff':'#3cff8c';
        ctx.fillText(shown[i],bx+i*(tw/MSG.length)+jx,by);
      }
      if(p<1&&(t*8|0)%2)ctx.fillText('▌',bx+shown.length*(tw/MSG.length),by);
    }
  },
});
})();
