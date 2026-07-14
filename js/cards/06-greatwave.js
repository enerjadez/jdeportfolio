/* ============================================================
   ACT 06 — THE GREAT WAVE · clean traveling swells
   Every layer moves the SAME direction at its own speed
   (parallax: far = slow, near = fast). Foam curls sit exactly
   on the crest peaks — solved from sin(kx−ωt)=1 — and the
   crest index range is re-solved from the visible window every
   frame, so the foam rides the wave forever instead of
   drifting off-screen (the old bug: fixed n range while the
   crests travel).
   ============================================================ */
(()=>{

/* layer surface: primary traveling sine + a small harmonic locked to it */
function surf(x,w,t,base,amp,k,sp,ph){
  const p=(x/w)*k-t*sp+ph;
  return base-Math.sin(p)*amp-Math.sin(p*2.7+1.3)*amp*.22;
}
function curl(ctx,x,y,size,t,seed){
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t+seed)*.08);
  ctx.beginPath();ctx.moveTo(0,0);
  let px=0,py=0;
  for(let s=0;s<1;s+=.125){
    const a=-.3-s*3.8,r=size*(1-s*.7);
    px=Math.cos(a)*r;py=Math.sin(a)*r+size*.2;
    ctx.lineTo(px,py);
  }
  ctx.strokeStyle='#f1e8d3';ctx.lineWidth=Math.max(1.2,size*.16);ctx.lineCap='round';
  ctx.stroke();
  ctx.fillStyle='#f1e8d3';
  ctx.beginPath();ctx.arc(px,py,Math.max(1.1,size*.1),0,7);ctx.fill();
  ctx.restore();
}

/* base height · amplitude · wavenumber · speed · phase · color · foam? */
const layers=[
  {base:.58,amp:.014,k:8,sp:.22,ph:1.1,col:'#5d84a6',foam:false},
  {base:.66,amp:.026,k:7,sp:.30,ph:3.6,col:'#3f6a8f',foam:false},
  {base:.75,amp:.042,k:6,sp:.40,ph:0.2,col:'#2b5a80',foam:true},
  {base:.86,amp:.058,k:5,sp:.52,ph:4.4,col:'#16344f',foam:true},
  {base:.96,amp:.032,k:7,sp:.66,ph:2.0,col:'#102638',foam:true},
];

JDE.card({
  id:'greatwave',
  act:'06',
  tab:'神奈川 · The Great Wave',
  theme:'p6',
  nav:'Wave',
  html:`
    <p class="eyebrow">After Hokusai · five sine swells, one boat, zero drama</p>
    <h2 class="display">The great wave,<br>recomputed.</h2>
    <span class="hanko">sine · ink · sea</span>`,
  draw(ctx,w,h,t){
    /* sky */
    const sky=ctx.createLinearGradient(0,0,0,h);
    sky.addColorStop(0,'#e9dcbe');sky.addColorStop(.5,'#efe4c9');sky.addColorStop(1,'#e2d3b0');
    ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);

    /* fuji */
    const fx=w*.63,fy=h*.5,fw=w*.10;
    ctx.beginPath();
    ctx.moveTo(fx-fw,fy);ctx.lineTo(fx,fy-fw*.62);ctx.lineTo(fx+fw,fy);
    ctx.closePath();ctx.fillStyle='#5d7791';ctx.fill();
    ctx.beginPath();
    ctx.moveTo(fx-fw*.3,fy-fw*.43);ctx.lineTo(fx,fy-fw*.62);ctx.lineTo(fx+fw*.3,fy-fw*.43);
    ctx.quadraticCurveTo(fx,fy-fw*.34,fx-fw*.3,fy-fw*.43);
    ctx.fillStyle='#f1e8d3';ctx.fill();

    const U=Math.min(w,h),STEP=14;
    for(const L of layers){
      const amp=U*L.amp;
      /* fill */
      ctx.beginPath();ctx.moveTo(-10,h+10);
      for(let x=-10;x<=w+10;x+=STEP)ctx.lineTo(x,surf(x,w,t,h*L.base,amp,L.k,L.sp,L.ph));
      ctx.lineTo(w+10,h+10);ctx.closePath();
      ctx.fillStyle=L.col;ctx.fill();
      /* double cream crest line — woodblock feel */
      for(const [off,al,lw] of [[0,.8,2],[amp*.28,.35,1]]){
        ctx.beginPath();
        for(let x=-10;x<=w+10;x+=STEP){
          const y=surf(x,w,t,h*L.base,amp,L.k,L.sp,L.ph)+off;
          x<=-10?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.strokeStyle=`rgba(241,232,211,${al})`;ctx.lineWidth=lw;ctx.stroke();
      }
      /* foam curls at the true crest peaks.
         sin(p)=1 → p=π/2+2πn with p=(x/w)k−t·sp+ph,
         so x(n)=(w/k)(π/2+2πn+t·sp−ph).
         Solve the n range from x ∈ [−40, w+40] each frame. */
      if(L.foam){
        const TAU=Math.PI*2;
        const nFor=x=>((x/w)*L.k-Math.PI/2-t*L.sp+L.ph)/TAU;
        const n0=Math.ceil(nFor(-40)),n1=Math.floor(nFor(w+40));
        for(let n=n0;n<=n1;n++){
          const x=(w/L.k)*(Math.PI/2+n*TAU+t*L.sp-L.ph);
          const y=surf(x,w,t,h*L.base,amp,L.k,L.sp,L.ph);
          curl(ctx,x,y,amp*.55,t,n*7+L.ph);
        }
      }
    }

    /* boat riding the middle swell */
    const L3=layers[2],amp3=U*L3.amp;
    const bx=w*.5+Math.sin(t*.12)*w*.26;
    const by=surf(bx,w,t,h*L3.base,amp3,L3.k,L3.sp,L3.ph);
    const slope=(surf(bx+12,w,t,h*L3.base,amp3,L3.k,L3.sp,L3.ph)
               -surf(bx-12,w,t,h*L3.base,amp3,L3.k,L3.sp,L3.ph))/24;
    ctx.save();ctx.translate(bx,by-3);ctx.rotate(Math.atan(slope));
    ctx.beginPath();
    ctx.moveTo(-U*.045,0);
    ctx.quadraticCurveTo(0,U*.016,U*.05,-U*.006);
    ctx.quadraticCurveTo(0,U*.004,-U*.045,0);
    ctx.fillStyle='#31261c';ctx.fill();
    ctx.strokeStyle='#f1e8d3';ctx.lineWidth=1;
    for(let i=-2;i<=2;i++){
      ctx.beginPath();ctx.moveTo(i*U*.013,-1);ctx.lineTo(i*U*.013,-U*.008);ctx.stroke();
    }
    ctx.restore();

    /* cartouche */
    const bx2=w-158,by2=64;
    ctx.fillStyle='rgba(241,232,211,.92)';ctx.fillRect(bx2,by2,124,44);
    ctx.strokeStyle='#16344f';ctx.lineWidth=1.4;ctx.strokeRect(bx2,by2,124,44);
    ctx.fillStyle='#16344f';ctx.font='10px IBM Plex Mono, monospace';
    ctx.fillText('KANAGAWA-OKI',bx2+10,by2+18);
    ctx.fillText('y = A·sin(kx − ωt)',bx2+10,by2+33);
  },
});
})();
