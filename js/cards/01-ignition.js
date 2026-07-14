/* ============================================================
   ACT 01 — IGNITION · ascii fluid
   A grid of glyphs whose brightness is a drifting fbm field;
   the cursor pours light into it and it flows away like ink.
   ============================================================ */
(()=>{
const {P,fbm,MOBILE}=JDE;
const ramp=' ·.:-=+*/|<>~#';
const CW=MOBILE?15:16,CH=MOBILE?24:26;
let heat=null,cols=0,rows=0;

JDE.card({
  id:'ignition',
  act:'01',
  tab:'Ignition',
  theme:'p1',
  every:2,
  html:`
    <p class="eyebrow">A showcase of magic · everything below is drawn live by math</p>
    <h1 class="display">We boost the productivity of reality.</h1>
    <p class="lede">Systems for individuals and businesses, wired to the source of all flow and life. No images. No video. Just equations, running right now, in your hand. Move your cursor through the glyphs.</p>
    <div class="cta-row">
      <a class="btn solid" href="#machine">Begin the show</a>
      <a class="btn" href="#comms">/-_=+|&lt; transmit -/=</a>
    </div>`,
  draw(ctx,w,h,t){
    const nc=Math.ceil(w/CW),nr=Math.ceil(h/CH);
    if(nc!==cols||nr!==rows){cols=nc;rows=nr;heat=new Float32Array(cols*rows);}

    /* pour heat at cursor cell, let it decay */
    const mcx=(P.x*w/CW)|0,mcy=(P.y*h/CH)|0;
    for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
      const cx2=mcx+dx,cy2=mcy+dy;
      if(cx2>=0&&cx2<cols&&cy2>=0&&cy2<rows)
        heat[cy2*cols+cx2]=Math.min(1,heat[cy2*cols+cx2]+.5/(1+dx*dx+dy*dy));
    }

    ctx.clearRect(0,0,w,h);
    ctx.font='13px IBM Plex Mono, monospace';
    for(let y=0;y<rows;y++){
      for(let x=0;x<cols;x++){
        const i=y*cols+x;
        heat[i]*=.94;
        const n=fbm(x*.09+t*.13,y*.13-t*.05);
        const b=n*.9+heat[i];
        if(b<.42)continue;                     /* dark cells stay empty */
        const gi=Math.min(ramp.length-1,((b-.42)/.58*ramp.length)|0);
        const a=.14+(b-.42)*1.1+heat[i]*.7;
        ctx.fillStyle=`rgba(255,255,255,${Math.min(.95,a)})`;
        ctx.fillText(ramp[gi],x*CW,y*CH+14);
      }
    }
  },
});
})();
