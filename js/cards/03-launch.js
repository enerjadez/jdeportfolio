/* ============================================================
   ACT 03 — THE LAUNCH · full countdown cycle
   Moon with craters · tower strobes · pad glow · MAX-Q call ·
   velocity telemetry · payload dot sailing across after sep.
   12-second cycle: countdown → ignition → ascent → orbit.
   ============================================================ */
(()=>{
const P=[],SMOKE=[],S=[];
const CYCLE=12,COUNT=3;

JDE.card({
  id:'launch',
  act:'03',
  tab:'The Launch',
  theme:'p3',
  nav:'Launch',
  html:`
    <p class="eyebrow" style="color:var(--flame)">Full launch cycle · countdown → ignition → ascent</p>
    <h2 class="display">Wait for it.</h2>
    <p class="lede" style="max-width:40ch">Every twelve seconds: T-minus count, shockwave, pad smoke, camera shake, main engine burn, orbit. Then we do it again — that's engineering.</p>`,
  resize(){S.length=0;},
  draw(ctx,w,h,t){
    const ct=t%CYCLE;
    const burning=ct>=COUNT;
    const burn=burning?ct-COUNT:0;
    const padY=h*.72;
    const alt=burning?Math.pow(burn,2.2)*26:0;
    const vel=burning?2.2*Math.pow(burn,1.2)*26:0;
    const rx=w*.5,ry=padY-90-alt+(burning?Math.sin(t*40)*Math.min(2,burn):0);

    const shake=burning?Math.max(0,1-burn*1.4)*7:0;
    ctx.save();
    ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);

    /* sky */
    ctx.fillStyle='#07070f';ctx.fillRect(-10,-10,w+20,h+20);

    /* moon: pale disc + craters, drifting very slowly */
    const moonX=w*.16+Math.sin(t*.02)*8,moonY=h*.18;
    const mg=ctx.createRadialGradient(moonX,moonY,10,moonX,moonY,90);
    mg.addColorStop(0,'rgba(220,224,240,.14)');mg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=mg;ctx.beginPath();ctx.arc(moonX,moonY,90,0,7);ctx.fill();
    ctx.fillStyle='#c9cde0';
    ctx.beginPath();ctx.arc(moonX,moonY,34,0,7);ctx.fill();
    ctx.fillStyle='rgba(150,156,180,.5)';
    [[-10,-8,6],[9,4,4],[2,14,5],[-14,10,3],[13,-12,3]].forEach(([dx,dy,r])=>{
      ctx.beginPath();ctx.arc(moonX+dx,moonY+dy,r,0,7);ctx.fill();
    });

    /* stars streak faster the higher we are */
    if(S.length===0)for(let i=0;i<90;i++)S.push({x:Math.random()*w,y:Math.random()*h,v:1+Math.random()*4});
    const streak=1+Math.min(alt*.004,6);
    ctx.strokeStyle='rgba(255,255,255,.5)';
    for(const s of S){
      ctx.globalAlpha=s.v/6;
      ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x,s.y+s.v*2*streak);ctx.stroke();
      s.y+=s.v*1.2*streak;if(s.y>h){s.y=-10;s.x=Math.random()*w;}
    }
    ctx.globalAlpha=1;

    /* ground + tower */
    ctx.strokeStyle='rgba(242,240,233,.5)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,padY+30);ctx.lineTo(w,padY+30);ctx.stroke();
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(rx-80,padY+30);ctx.lineTo(rx-80,padY-170);
    for(let i=0;i<7;i++){
      ctx.moveTo(rx-80,padY+18-i*28);ctx.lineTo(rx-56,padY+2-i*28);
      ctx.moveTo(rx-56,padY+18-i*28);ctx.lineTo(rx-80,padY+2-i*28);
    }
    ctx.stroke();
    /* tower strobes: alternating red beacons */
    const blink=Math.sin(t*6)>0;
    ctx.fillStyle=blink?'rgba(255,60,60,.95)':'rgba(255,60,60,.15)';
    ctx.beginPath();ctx.arc(rx-80,padY-170,3,0,7);ctx.fill();
    ctx.fillStyle=!blink?'rgba(255,60,60,.95)':'rgba(255,60,60,.15)';
    ctx.beginPath();ctx.arc(rx-80,padY-86,3,0,7);ctx.fill();

    /* pad glow while the engine is low: firelight on the ground */
    if(burning&&alt<240){
      const gi=Math.max(0,1-alt/240);
      const pg=ctx.createRadialGradient(rx,padY+28,0,rx,padY+28,220);
      pg.addColorStop(0,`rgba(255,170,60,${.35*gi})`);
      pg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.globalCompositeOperation='lighter';
      ctx.fillStyle=pg;
      ctx.beginPath();ctx.ellipse(rx,padY+28,220,60,0,0,7);ctx.fill();
      ctx.globalCompositeOperation='source-over';
    }

    /* ignition shockwave + flash */
    if(burning&&burn<.9){
      const rr=burn*w*.7;
      ctx.strokeStyle=`rgba(255,190,90,${1-burn/.9})`;
      ctx.lineWidth=3*(1-burn);
      ctx.beginPath();ctx.ellipse(rx,padY+28,rr,rr*.22,0,0,7);ctx.stroke();
      ctx.fillStyle=`rgba(255,240,200,${(1-burn/.9)*.25})`;
      ctx.fillRect(-10,-10,w+20,h+20);
    }

    /* pad smoke */
    if(burning&&alt<200){
      for(let i=0;i<6;i++)
        SMOKE.push({x:rx+(Math.random()-.5)*30,y:padY+22,vx:(Math.random()-.5)*4-(Math.random()<.5?2:-2)*Math.random()*2,vy:-Math.random()*1.2,r:8+Math.random()*10,life:1});
    }
    for(const s of SMOKE){
      s.x+=s.vx;s.y+=s.vy;s.vx*=.985;s.r+=.5;s.life-=.008;
      if(s.life<=0)continue;
      ctx.fillStyle=`rgba(160,160,175,${s.life*.16})`;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill();
    }
    while(SMOKE.length&&SMOKE[0].life<=0)SMOKE.shift();
    while(SMOKE.length>500)SMOKE.shift();

    /* exhaust plume */
    if(burning){
      const nozzleY=ry+120;
      for(let i=0;i<12;i++){
        if(P.length>460)P.shift();
        const spread=(Math.random()-.5)*.6;
        P.push({x:rx+(Math.random()-.5)*10,y:nozzleY,vx:spread*2.4,vy:6+Math.random()*4,life:1,r:3+Math.random()*5});
      }
    }
    ctx.globalCompositeOperation='lighter';
    for(const p of P){
      p.x+=p.vx;p.y+=p.vy;p.vy*=.985;p.vx*=.99;
      p.vy-=.05*(1-p.life);p.life-=.013;p.r+=.28;
      if(p.life<=0)continue;
      const L=p.life;
      const col=L>.8?`rgba(255,255,235,${L})`:L>.55?`rgba(255,160,40,${L*.9})`:L>.3?`rgba(220,60,20,${L*.7})`:`rgba(90,90,110,${L*.35})`;
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
      g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();
    }
    while(P.length&&P[0].life<=0)P.shift();
    ctx.globalCompositeOperation='source-over';

    /* rocket */
    if(ry>-160){
      ctx.save();ctx.translate(rx,ry);
      ctx.strokeStyle='#f2f0e9';ctx.lineWidth=1.5;ctx.fillStyle='#0a0a14';
      ctx.beginPath();
      ctx.moveTo(0,-70);ctx.quadraticCurveTo(22,-30,20,30);
      ctx.lineTo(20,95);ctx.lineTo(-20,95);ctx.lineTo(-20,30);
      ctx.quadraticCurveTo(-22,-30,0,-70);
      ctx.closePath();ctx.fill();ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(20,60);ctx.lineTo(42,105);ctx.lineTo(20,95);
      ctx.moveTo(-20,60);ctx.lineTo(-42,105);ctx.lineTo(-20,95);
      ctx.stroke();
      ctx.beginPath();ctx.moveTo(-12,95);ctx.lineTo(-16,118);ctx.lineTo(16,118);ctx.lineTo(12,95);ctx.stroke();
      ctx.beginPath();ctx.arc(0,-12,9,0,7);ctx.stroke();
      ctx.restore();
    }

    /* payload after separation: a bright dot arcing across the top */
    if(burning&&ry<=-160){
      const px2=w*.2+((burn*60)%(w*.8));
      const py2=h*.12+Math.sin(px2*.01)*10;
      ctx.fillStyle=`rgba(140,220,255,${.5+.5*Math.sin(t*8)})`;
      ctx.beginPath();ctx.arc(px2,py2,2.4,0,7);ctx.fill();
      ctx.strokeStyle='rgba(140,220,255,.25)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(px2-26,py2+2);ctx.lineTo(px2,py2);ctx.stroke();
    }

    ctx.restore(); /* shake */

    /* HUD */
    if(!burning){
      const n=Math.ceil(COUNT-ct);
      ctx.font='700 64px IBM Plex Mono, monospace';
      ctx.fillStyle=`rgba(255,122,26,${.4+.6*Math.abs(Math.sin(ct*Math.PI))})`;
      ctx.fillText(`T-${n}`,w*.5-58,h*.3);
      ctx.font='11px IBM Plex Mono, monospace';
      ctx.fillStyle='rgba(242,240,233,.55)';
      ctx.fillText('guidance internal · pressurization nominal',w*.5-140,h*.3+26);
    }else{
      if(burn>2.6&&burn<4.2){
        ctx.font='700 26px IBM Plex Mono, monospace';
        ctx.fillStyle=`rgba(255,122,26,${.4+.6*Math.abs(Math.sin(t*6))})`;
        ctx.fillText('MAX-Q',w*.5+70,h*.32);
      }
      ctx.font='11px IBM Plex Mono, monospace';
      ctx.fillStyle='rgba(242,240,233,.6)';
      const msg=alt>h?'stage separation confirmed · payload in orbit':'main engine burn · thrust nominal';
      ctx.fillText(`T+${burn.toFixed(1)}s · alt ${(alt|0)}m · vel ${(vel|0)}m/s · ${msg}`,16,h-18);
    }
  },
});
})();
