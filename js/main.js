/*! © 2026 Efnan Yılmaz. Tüm hakları saklıdır. İzinsiz kopyalanamaz, kullanılamaz veya dağıtılamaz. Ayrıntılar: LICENSE */
/* Noctélia — hero animation, rose rain, scroll effects, cart & newsletter */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof gsap !== 'undefined';
if (hasGsap && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
const NS='http://www.w3.org/2000/svg';

/* seeded random so the flower is the same every load */
let seed=7;function rnd(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
const R=(a,b)=>a+rnd()*(b-a);

/* ---------- roses ---------- */
// rain images; buds stay small
const RAINSRC=[
  'assets/img/cicek/gul01.webp','assets/img/cicek/gul02.webp','assets/img/cicek/gul03.webp','assets/img/cicek/gul04.webp','assets/img/cicek/gul05.webp','assets/img/cicek/gul06.webp',
  'assets/img/cicek/gul07.webp','assets/img/cicek/gul08.webp','assets/img/cicek/gul09.webp','assets/img/cicek/gul10.webp','assets/img/cicek/gul11.webp','assets/img/cicek/gul12.webp',
].map(src=>({src,bud:false})).concat(
  ['assets/img/cicek/gonca1.webp','assets/img/cicek/gonca2.webp','assets/img/cicek/gonca3.webp','assets/img/cicek/gonca4.webp'].map(src=>({src,bud:true})));
/* ---------- build the flower ---------- */
function petalPath(L,W){return `M0,0 C${-W},${-L*.22} ${-W*.92},${-L*.72} ${-W*.06},${-L} Q0,${-L*1.02} ${W*.08},${-L*.99} C${W*.9},${-L*.7} ${W},${-L*.24} 0,0Z`}
const rings=[{n:9,L:[176,198],W:54,g:'pg1',off:0},{n:7,L:[128,150],W:46,g:'pg2',off:.5},{n:5,L:[84,98],W:35,g:'pg3',off:.25}];
const petalsG=document.getElementById('petals'), petals=[], pdata=[];
rings.forEach(r=>{for(let i=0;i<r.n;i++){
  const L=R(r.L[0],r.L[1]), W=r.W*R(.88,1.1), rot=(i+r.off)/r.n*360+R(-7,7);
  const g=document.createElementNS(NS,'g');
  const p=document.createElementNS(NS,'path');p.setAttribute('d',petalPath(L,W));p.setAttribute('fill',`url(#${r.g})`);p.setAttribute('stroke','#ffc2c8');p.setAttribute('stroke-opacity','.2');p.setAttribute('stroke-width','.8');
  const s=document.createElementNS(NS,'path');s.setAttribute('d',petalPath(L*.82,W*.42));s.setAttribute('fill','url(#sheen)');s.setAttribute('transform',`translate(${W*.12},${-L*.05})`);
  const v=document.createElementNS(NS,'path');v.setAttribute('d',`M0,-8 Q${W*.1},${-L*.5} ${W*.02},${-L*.9}`);v.setAttribute('stroke','#ffe2e4');v.setAttribute('stroke-opacity','.22');v.setAttribute('stroke-width','1');v.setAttribute('fill','none');
  g.append(p,s,v);petalsG.appendChild(g);petals.push(g);pdata.push({rot});
}});
const st=document.getElementById('stamens');
const cd=document.createElementNS(NS,'circle');cd.setAttribute('r','15');cd.setAttribute('fill','url(#core)');st.appendChild(cd);
for(let i=0;i<22;i++){const a=i/22*Math.PI*2+R(-.1,.1),l=R(20,38),x=Math.cos(a)*l,y=Math.sin(a)*l-l*.35;
  const ln=document.createElementNS(NS,'path');ln.setAttribute('d',`M0,0 Q${x*.4},${y*.6-8} ${x},${y}`);ln.setAttribute('stroke','#d8b06a');ln.setAttribute('stroke-width','1.1');ln.setAttribute('fill','none');
  const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',R(2,3.2));c.setAttribute('fill','#f3d79a');
  st.append(ln,c);}

/* ---------- particles ---------- */
const stage=document.getElementById('stage');
const cvB=document.getElementById('fxBack'),cvF=document.getElementById('fxFront');
const cB=cvB.getContext('2d'),cF=cvF.getContext('2d');
let W=1,H=1,S=1;
let OX=0,OY=0,CW=1,CH=1; // stage origin inside the overhanging canvases
function size(){const d=Math.min(2,window.devicePixelRatio||1);W=stage.clientWidth;H=stage.clientHeight;S=W/600;
  OX=-cvB.offsetLeft;OY=-cvB.offsetTop;CW=cvB.offsetWidth;CH=cvB.offsetHeight;
  [cvB,cvF].forEach(c=>{c.width=Math.round(CW*d);c.height=Math.round(CH*d)});cB.setTransform(d,0,0,d,OX*d,OY*d);cF.setTransform(d,0,0,d,OX*d,OY*d);}
size();if('ResizeObserver' in window)new ResizeObserver(size).observe(stage);else addEventListener('resize',size);

function sprite(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return c}
const glow=sprite(48,48,(x,w)=>{const g=x.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);g.addColorStop(0,'rgba(255,236,190,1)');g.addColorStop(.25,'rgba(240,200,130,.55)');g.addColorStop(1,'rgba(220,170,90,0)');x.fillStyle=g;x.fillRect(0,0,w,w)});
const petalSprites=[['#68060f','#b03e4a','#eb8c96'],['#460105','#931c2a','#c45864'],['#7a0e1a','#c45864','#f7b3ba']].map(cols=>sprite(40,64,(x)=>{
  const g=x.createLinearGradient(0,64,0,0);g.addColorStop(0,cols[0]);g.addColorStop(.55,cols[1]);g.addColorStop(1,cols[2]);x.fillStyle=g;
  x.beginPath();x.moveTo(20,62);x.bezierCurveTo(-2,48,2,14,20,2);x.bezierCurveTo(38,14,42,48,20,62);x.fill();
  x.strokeStyle='rgba(255,230,230,.3)';x.lineWidth=.8;x.beginPath();x.moveTo(20,58);x.quadraticCurveTo(23,30,20,8);x.stroke();}));
const pick=()=>petalSprites[(rnd()*petalSprites.length)|0];

const E={v:.14};
const small=W<500;
const dust=[];for(let i=0;i<(small?110:180);i++)dust.push({a:R(0,6.283),r:R(60,280),sp:R(.18,.5),h:R(-160,70),sz:R(.6,2.5),tw:R(0,6.28),ts:R(1.2,3.4)});
const flying=[];
const CX=299,CY=354; // sprayer nozzle
function spawnPetal(burst){const a=R(0,6.283),rr=burst?R(20,70):R(40,140);
  flying.push({x:CX+Math.cos(a)*rr,y:CY+Math.sin(a)*rr*.6,vx:Math.cos(a)*R(burst?50:15,burst?140:55),vy:Math.sin(a)*R(10,40)-R(20,burst?90:40),rot:R(0,6.28),vr:R(-2,2),sc:R(.35,.8),life:0,max:R(4,6.5),img:pick(),front:rnd()>.3,wob:R(0,6.28)});}
/* ---------- rose rain over the whole hero ---------- */
const hero=document.getElementById('hero');
const rB=document.getElementById('rainBack'),rF=document.getElementById('rainFront');
const xB=rB.getContext('2d'),xF=rF.getContext('2d');
let HW=1,HH=1;
function sizeRain(){const r=hero.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);HW=r.width;HH=r.height;
  [rB,rF].forEach(c=>{c.width=Math.round(HW*d);c.height=Math.round(HH*d)});xB.setTransform(d,0,0,d,0,0);xF.setTransform(d,0,0,d,0,0);}
sizeRain();if('ResizeObserver' in window)new ResizeObserver(sizeRain).observe(hero);
const rainImgs=RAINSRC.map(o=>{const im=new Image();im.src=o.src;return im});
const rain=[],RAIN={on:0};
let accRF=0,accRB=0;
// roses are shot out of the sprayer, grow as they come toward the viewer, then fall across the whole hero
// front ones pass over the copy, back ones behind it (and behind the bottle as they leave the nozzle)
function nozzle(){const s=stage.getBoundingClientRect(),h=hero.getBoundingClientRect();return [s.left-h.left+CX*S,s.top-h.top+CY*S]}
// 'fisfis': roses shoot out of the sprayer; 'yagmur': the spray fills the air, then roses rain from the top over the whole hero
const RAIN_MODE='yagmur';
const SKY=RAIN_MODE==='yagmur';
function spawnDrop(front,anywhere){
  const rose=rnd()<.68, k=(rnd()*rainImgs.length)|0, img=rose?rainImgs[k]:pick();
  const bud=rose&&RAINSRC[k].bud, f=Math.min(1,Math.max(.55,HW/1366)); // smaller on phones
  const w=(rose?(front?R(100,140):R(80,115)):(front?R(42,66):R(34,54)))*(bud?.5:1)*f;
  // front ones head up and right (over the bottle), back ones up and left (behind the headline) so the copy stays readable
  const spin={rot:rose?R(-.5,.5):R(0,6.28),vr:rose?R(-.6,.6):R(-1.5,1.5),wob:R(0,6.28)};
  if(SKY){ // front ones only over the bottle side, so the headline stays clear
    if(HW<900)front=false; // stacked layout on phones: the copy sits above the bottle, keep every flower behind it
    const x=front?R(HW*.45,HW+20):(rnd()<.65?R(-20,HW*.5):R(HW*.5,HW+20)); // back ones lean left to balance the front ones
    rain.push({img,rose,front,w,x,y:anywhere?R(-w,HH*.9):-w,vx:R(-8,8),vy:R(40,80),age:5,fall:R(70,110),...spin});
    return;
  }
  const [x,y]=nozzle(), a=-Math.PI/2+(front?R(-.25,1.3):R(-1.55,.5)), sp=R(300,720)*Math.max(.6,f);
  rain.push({img,rose,front,w,x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,age:0,fall:R(110,170),...spin});
}
const sparks=[];
function sparkle(){const [x,y]=nozzle();
  for(let i=0;i<(small?120:220);i++){const a=R(0,6.283);sparks.push({x,y,vx:Math.cos(a),vy:Math.sin(a)*.8,sp:R(250,1100),life:-R(0,.25),max:R(.7,1.6),s:R(.8,2.2)})}}
function drawRain(dt){
  xB.clearRect(0,0,HW,HH);xF.clearRect(0,0,HW,HH);
  accRF+=dt*RAIN.on*(SKY?(small?1.3:2.2):(small?2:3));while(accRF>1){accRF--;spawnDrop(true)}
  accRB+=dt*RAIN.on*(SKY?(small?2:3.6):(small?2.5:4.5));while(accRB>1){accRB--;spawnDrop(false)}
  for(let i=rain.length-1;i>=0;i--){const d=rain[i];d.age+=dt;
    // gravity + air drag: a light flower soon drifts down at its own slow speed
    d.vy=Math.min(d.vy+520*dt,d.fall);d.vx*=Math.pow(.72,dt);
    d.y+=d.vy*dt;d.x+=(d.vx+Math.sin(t*.9+d.wob)*18*Math.min(1,d.age))*dt;d.rot+=d.vr*dt;
    if(d.y>HH+d.w){rain.splice(i,1);continue}
    if(!(d.img.complete&&d.img.naturalWidth))continue;
    const h=d.w*d.img.naturalHeight/d.img.naturalWidth,c=d.front?xF:xB;
    const g=Math.min(1,.12+d.age*1.8); // grows out of the nozzle
    c.save();c.translate(d.x,d.y);c.rotate(d.rot);c.scale(g,g);
    if(!d.rose)c.scale(.6+.4*Math.abs(Math.sin(t*1.5+d.wob)),1);
    c.drawImage(d.img,-d.w/2,-h/2,d.w,h);c.restore();}
  xF.globalCompositeOperation='lighter';
  for(let i=sparks.length-1;i>=0;i--){const p=sparks[i];p.life+=dt;if(p.life<0)continue;if(p.life>p.max){sparks.splice(i,1);continue}
    const k=p.life/p.max,dist=p.sp*p.life*(1-k*.35),sz=p.s*(1+k*k*5)*4;
    xF.globalAlpha=.8*(1-k);xF.drawImage(mistDot,p.x+p.vx*dist-sz/2,p.y+p.vy*dist-sz/2,sz,sz);}
  xF.globalCompositeOperation='source-over';xF.globalAlpha=1;
}

// perfume mist: droplets spread out from the nozzle and grow as they come toward the viewer
const mistDot=sprite(32,32,(x,w)=>{const g=x.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);g.addColorStop(0,'rgba(255,232,238,1)');g.addColorStop(.35,'rgba(250,190,205,.45)');g.addColorStop(1,'rgba(240,170,190,0)');x.fillStyle=g;x.fillRect(0,0,w,w)});
const mist=[];
function spray(){
  for(let i=0;i<(small?200:340);i++){const a=R(0,6.283);
    mist.push({a,v:R(40,360)*Math.pow(rnd(),.7),s:R(.8,2.6),life:-R(0,.3),max:R(1.2,2.2),cloud:false});}
  for(let i=0;i<10;i++)mist.push({a:R(0,6.283),v:R(10,70),s:R(20,34),life:-i*.05,max:R(2,2.6),cloud:true});
}
function ambientPetal(){flying.push({x:R(40,560),y:-30,vx:R(-10,10),vy:R(14,30),rot:R(0,6.28),vr:R(-1,1),sc:R(.3,.55),life:0,max:R(9,13),img:pick(),front:rnd()>.5,wob:R(0,6.28)});}

let last=performance.now(),t=0,acc=0,amb=0,running=true;
const tilt=-.28,ct=Math.cos(tilt),stn=Math.sin(tilt);
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
  cB.clearRect(-OX,-OY,CW,CH);cF.clearRect(-OX,-OY,CW,CH);
  const e=E.v;
  // petals
  acc+=dt*(e>.45?e*7:0);while(acc>1){acc--;spawnPetal(false)}
  amb+=dt*.35;if(amb>1){amb=0;if(flying.length<40)ambientPetal()}
  for(let i=flying.length-1;i>=0;i--){const p=flying[i];p.life+=dt;if(p.life>p.max||p.y>760){flying.splice(i,1);continue}
    p.vy+=14*dt;p.vx*=.992;p.x+=(p.vx+Math.sin(t*1.6+p.wob)*14)*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;
    const al=Math.min(1,p.life/.4)*Math.min(1,(p.max-p.life)/1.5);
    const c=p.front?cF:cB;c.save();c.globalAlpha=al*(p.front?.95:.6);c.translate(p.x*S,p.y*S);c.rotate(p.rot);c.scale(p.sc*S*(.6+.4*Math.abs(Math.sin(t+p.wob))),p.sc*S);c.drawImage(p.img,-p.img.width/2,-p.img.height/2);c.restore();}
  drawRain(dt);
  // mist
  cF.globalCompositeOperation='lighter';
  for(let i=mist.length-1;i>=0;i--){const m=mist[i];m.life+=dt;if(m.life<0)continue;if(m.life>m.max){mist.splice(i,1);continue}
    const k=m.life/m.max, grow=1+k*k*(m.cloud?7:12), d=m.v*m.life*(1+k*1.6);
    const X=CX+Math.cos(m.a)*d, Y=CY+Math.sin(m.a)*d*.9, sz=m.s*grow*S*4;
    cF.globalAlpha=(m.cloud?.12:.55)*Math.min(1,m.life/.06)*(1-k)*(1-k);
    cF.drawImage(mistDot,X*S-sz/2,Y*S-sz/2,sz,sz);}
  // dust
  cB.globalCompositeOperation='lighter';cF.globalCompositeOperation='lighter';
  for(const d of dust){d.a+=d.sp*dt*(.35+e*1.1);
    const rr=24+(d.r-24)*(.18+.82*e);
    const lx=Math.cos(d.a)*rr, ly=Math.sin(d.a)*rr*.36+d.h*e*.55;
    const X=CX+lx*ct-ly*stn, Y=CY+20+lx*stn+ly*ct;
    const front=Math.sin(d.a)>0;
    const al=(.18+.82*e)*(.35+.65*(.5+.5*Math.sin(t*d.ts+d.tw)));
    const sz=d.sz*(front?1.25:.85)*S*7;
    const c=front?cF:cB;c.globalAlpha=al;c.drawImage(glow,X*S-sz/2,Y*S-sz/2,sz,sz);}
  cB.globalCompositeOperation='source-over';cF.globalCompositeOperation='source-over';cB.globalAlpha=1;cF.globalAlpha=1;
  if(running)requestAnimationFrame(frame);
}
function startFx(){if(!running){running=true;last=performance.now();requestAnimationFrame(frame)}}
function stopFx(){running=false}

if(!hasGsap){ // library failed: show the roses statically
  E.v=.8;petals.forEach((p,i)=>p.setAttribute('transform',`rotate(${pdata[i].rot})`));requestAnimationFrame(frame);return;
}

/* ---------- bloom timeline ---------- */
gsap.set(petals,{svgOrigin:'0 0',rotation:i=>pdata[i].rot-40,scaleX:.3,scaleY:.12,opacity:0});
gsap.set('#stamens',{svgOrigin:'0 0',scale:0});
const bloom=gsap.timeline({repeat:-1,repeatDelay:2.5,paused:true});
let heroAway=false; // true while the scroll has the rose folded or the scene on its way to the pyramid
bloom
 .to('#cap',{y:-215,rotation:0,transformOrigin:'50% 50%',duration:1.35,ease:'power3.inOut'},.9)
 .to('#liquidGlow',{opacity:1,duration:1.3,ease:'sine.inOut'},1.3)
 .to('#halo',{opacity:1.6,duration:1.5},1.5)
 // the sprayer presses itself down and springs back
 .to('#sprey',{y:7,duration:.16,ease:'power2.in'},2.4)
 .to('#sprey',{y:0,duration:.5,ease:'back.out(2)'},2.68)
 .call(()=>{spray();sparkle()},null,2.52)
 .to(E,{v:1,duration:2.2,ease:'power2.out'},2.55)
 .call(()=>{for(let i=0;i<(small?14:24);i++)spawnPetal(true)},null,2.7)
 // the flower blooms out of the mist, sways, then folds back into the sprayer
 .to(petals,{rotation:i=>pdata[i].rot,scaleX:1,scaleY:1,opacity:1,svgOrigin:'0 0',duration:2.1,ease:'expo.out',stagger:.045},2.6)
 .to('#stamens',{scale:1,svgOrigin:'0 0',duration:1.2,ease:'back.out(2.2)'},3.45)
 .to('#flowerSway',{rotation:3,svgOrigin:'300 360',duration:1.5,ease:'sine.inOut',yoyo:true,repeat:1},4.75)
 .to('#stamens',{scale:0,svgOrigin:'0 0',duration:.6,ease:'power2.in'},7.3)
 .to(petals,{rotation:i=>pdata[i].rot+32,scaleX:.3,scaleY:.1,opacity:0,svgOrigin:'0 0',duration:1.3,ease:'power3.in',stagger:{each:.022,from:'end'}},7.4)
 .to(E,{v:.14,duration:1.7,ease:'power1.inOut'},7.6)
 .to('#halo',{opacity:1,duration:1.4},7.8)
 .to('#liquidGlow',{opacity:.25,duration:1},8.1)
 .to('#cap',{y:0,rotation:0,transformOrigin:'50% 50%',duration:1.25,ease:'power3.inOut'},8.7)
 .to({},{duration:.6});


if(reduce){
  gsap.set(petals,{rotation:i=>pdata[i].rot,scaleX:1,scaleY:1,opacity:1});gsap.set('#stamens',{scale:1});
  gsap.set('#cap',{y:-215,rotation:0,transformOrigin:'50% 50%'});
  E.v=.7;running=true;requestAnimationFrame(frame);setTimeout(stopFx,600);
} else {
  requestAnimationFrame(frame);
  // intro
  const intro=gsap.timeline({defaults:{ease:'power4.out'}});
  intro.from('h1.title .ln > span',{yPercent:105,duration:1.2,stagger:.12})
       .from('[data-intro]',{y:24,opacity:0,duration:.9,stagger:.08},.25)
       .from('#stage',{y:40,opacity:0,duration:1.3},.1)
       .add(()=>{if(!heroAway)bloom.play()},.5);
  // pause when hero is off screen
  ScrollTrigger.create({trigger:'#hero',start:'top bottom',end:'bottom top',onToggle:s=>{if(s.isActive){startFx();if(!heroAway&&!bloom.isActive()&&bloom.progress()>0)bloom.resume()}else{stopFx();bloom.pause()}}});
}

/* ---------- header state ---------- */
const head=document.getElementById('top');
addEventListener('scroll',()=>head.classList.toggle('scrolled',scrollY>40),{passive:true});

/* ---------- split headings ---------- */
document.querySelectorAll('[data-split]').forEach(h=>{
  const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return}const o=document.createElement('span');o.style.cssText='display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em';const i=document.createElement('span');i.style.display='inline-block';i.className='w';i.textContent=w;o.appendChild(i);f.appendChild(o)});c.replaceWith(f)}else walk(c)})};
  walk(h);
  if(!reduce)gsap.from(h.querySelectorAll('.w'),{yPercent:110,rotate:4,duration:1.1,ease:'power4.out',stagger:.06,scrollTrigger:{trigger:h,start:'top 88%'}});
});

/* ---------- pyramid: the tier you reach (or point at) lights up, inside the triangle and beside it ---------- */
const pzTiers=[...document.querySelectorAll('.pz-tier')],pzFills=[...document.querySelectorAll('.pz-fill')];
let pzNow=-1;
function pzSet(i){if(i===pzNow)return;pzNow=i;
  pzTiers.forEach((t,k)=>t.classList.toggle('on',k===i));pzFills.forEach((f,k)=>f.classList.toggle('on',k===i));}
pzSet(0);
// scroll walks the tiers top to bottom while the pyramid crosses the middle of the screen
ScrollTrigger.create({trigger:'.pz',start:'top 65%',end:'bottom 45%',onUpdate:s=>pzSet(Math.min(2,Math.floor(s.progress*3)))});
pzTiers.forEach((t,i)=>t.querySelectorAll('.pz-label,.pz-notes').forEach(el=>el.addEventListener('pointerenter',()=>pzSet(i))));
if(!reduce){
  gsap.from('.pz-edge,.pz-sep',{strokeDasharray:1600,strokeDashoffset:1600,duration:2,ease:'power2.inOut',stagger:.2,clearProps:'strokeDasharray,strokeDashoffset',scrollTrigger:{trigger:'.pz',start:'top 80%'}});
}
/* ---------- leaving the hero: the rose folds itself back into the bottle with the first stretch of
   scrolling, then the closed bottle glides down and settles into the pyramid; scrolling back reverses both ---------- */
const stageEl=document.getElementById('stage'),heroBody=document.querySelector('#stage image[href$="sise.webp"]'),pzFlacon=document.querySelector('.pz-bottle .flacon');
if(stageEl&&heroBody&&pzFlacon&&!reduce){
  ScrollTrigger.matchMedia({'all':()=>{
    const head=document.querySelector('header.top'),FOLD=.3,pzBody=pzFlacon.querySelector('.f-body'),plinth=stageEl.querySelector('g[mask="url(#plinthFade)"]');
    // the drifting petals stay behind in the hero; only the bottle makes the journey
    const drift=['#fxBack','#fxFront'].map(q=>document.getElementById(q.slice(1))).filter(Boolean);
    const driftTo=o=>drift.forEach(c=>c.style.opacity=o);
    // the plinth stays behind in the hero: a copy of it stands in the hero's place while the scene is away
    const hold=document.createElement('div');hold.className='stage-hold';
    if(plinth){const ps=document.createElementNS(NS,'svg');ps.setAttribute('viewBox','0 0 600 700');ps.setAttribute('aria-hidden','true');ps.appendChild(plinth.cloneNode(true));hold.appendChild(ps)}
    const layer=document.createElement('div');layer.className='stage-travel';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
    let away=false,fold=null,sw=0,sh=0,ox=0,oy=0,bw=1;
    const measure=()=>{if(away)return;const s=stageEl.getBoundingClientRect(),b=heroBody.getBoundingClientRect();sw=s.width;sh=s.height;ox=b.left-s.left;oy=b.top-s.top;bw=b.width};
    const lerp=(a,b,t)=>a+(b-a)*t;
    // the same closing the bloom plays on its own, but run by the scroll from wherever the rose happens to be
    const makeFold=()=>gsap.timeline({paused:true})
      .to('#stamens',{scale:0,svgOrigin:'0 0',duration:.3,ease:'power2.in'},0)
      .to(petals,{rotation:i=>pdata[i].rot+32,scaleX:.3,scaleY:.1,opacity:0,svgOrigin:'0 0',duration:.7,ease:'power2.in',stagger:{each:.012,from:'end'}},.05)
      .to('#cap',{y:0,rotation:0,transformOrigin:'50% 50%',duration:.45,ease:'power2.inOut'},.55)
      .to('#liquidGlow',{opacity:.25,duration:.5},.4).to('#halo',{opacity:1,duration:.5},.4).to(E,{v:.14,duration:.6},.3);
    function place(p){
      if(p<=0){
        if(away){away=false;hold.replaceWith(stageEl);layer.style.visibility='hidden';if(plinth)plinth.style.opacity=''}
        driftTo('');
        if(fold){fold.progress(0).kill();fold=null}
        if(heroAway){heroAway=false;bloom.resume()}
        return}
      if(!heroAway){heroAway=true;bloom.pause();measure();fold=makeFold()}
      fold.progress(Math.min(1,p/FOLD));
      const q=Math.max(0,(p-FOLD)/(1-FOLD));
      // the scene leaves the hero as soon as scrolling starts, so it can be held on screen while the rose folds
      if(!away){hold.style.width=sw+'px';hold.style.height=sh+'px';stageEl.replaceWith(hold);layer.appendChild(stageEl);
        layer.style.width=sw+'px';layer.style.height=sh+'px';layer.style.visibility='visible';away=true}
      const e=Math.min(1,q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2);
      // from where the stage would sit in the hero (but never pushed up under the header) to where its bottle covers the pyramid's bottle
      const h=hold.getBoundingClientRect(),t=pzBody.getBoundingClientRect(),top=head?head.getBoundingClientRect().bottom:0;
      const k=lerp(1,t.width/bw,e),sy=Math.max(h.top+oy,top+bw*.45+12);
      const bx=lerp(h.left+ox,t.left,e),by=lerp(sy,t.top,e);
      layer.style.transform=`translate(${(bx-ox*k).toFixed(1)}px,${(by-oy*k).toFixed(1)}px) scale(${k.toFixed(4)})`;
      if(plinth)plinth.style.opacity='0';
      driftTo(Math.max(0,1-q*6).toFixed(3));
    }
    pzFlacon.style.opacity='0';
    measure();
    // runs on past the landing point, so the bottle keeps following the pyramid as the page scrolls on
    const st=ScrollTrigger.create({start:2,endTrigger:'.pz',end:'center 58%',onUpdate:s=>place(s.progress),onRefresh:s=>place(s.progress)});
    const follow=()=>{if(st.progress>=1)place(1)};addEventListener('scroll',follow,{passive:true});
    place(st.progress);
    return()=>{st.kill();removeEventListener('scroll',follow);if(away)hold.replaceWith(stageEl);layer.remove();pzFlacon.style.opacity='';if(plinth)plinth.style.opacity='';if(fold){fold.progress(0).kill()}driftTo('');heroAway=false};
  }});
}
/* ---------- story: the nine gold flowers open from the centre outwards as the section scrolls in ---------- */
if(document.querySelector('.story-caps')&&!reduce){
  gsap.fromTo('.story-line .w',{opacity:.16},{opacity:1,ease:'none',stagger:.1,scrollTrigger:{trigger:'.story-line',start:'top 82%',end:'bottom 52%',scrub:true}});
  gsap.from('.story-text,.story-copy .eyebrow',{y:20,autoAlpha:0,duration:1,ease:'power3.out',stagger:.12,scrollTrigger:{trigger:'.story-copy',start:'top 85%'}});
  // scrubbed with the scroll, centre first, so the flowers open and fold back as you move
  const order={each:.08,from:'center'};
  gsap.timeline({scrollTrigger:{trigger:'.story-garden',start:'top 92%',end:'center 72%',scrub:1}})
    .from('.story-caps img',{scale:.2,rotation:-45,y:40,autoAlpha:0,duration:.8,ease:'back.out(1.6)',stagger:order})
    .from('.story-caps span',{autoAlpha:0,y:8,duration:.4,stagger:order},'-=.6');
  gsap.from('.story-sign',{autoAlpha:0,duration:1.2,scrollTrigger:{trigger:'.story-sign',start:'top 92%'}});
}
/* ---------- cards: rise in on scroll ---------- */
document.querySelectorAll('[data-tilt]').forEach((c,i)=>{
  if(!reduce)gsap.from(c,{y:60,autoAlpha:0,duration:1.1,ease:'power3.out',delay:(i%3)*.12,scrollTrigger:{trigger:c,start:'top 92%'}});
});

/* ---------- collection slider: side arrows, keyboard and mouse drag ---------- */
const crTrack=document.getElementById('crTrack');
if(crTrack){
  const cards=[...crTrack.children],prev=document.getElementById('crPrev'),next=document.getElementById('crNext');
  const step=()=>cards[1].offsetLeft-cards[0].offsetLeft;
  const update=()=>{const max=crTrack.scrollWidth-crTrack.clientWidth;
    prev.disabled=crTrack.scrollLeft<4;next.disabled=crTrack.scrollLeft>max-4};
  // the side arrows sit level with the middle of the bottle stage
  const mid=()=>{const st=cards[0].querySelector('.c-stage');if(st)crTrack.parentElement.style.setProperty('--cr-mid',st.offsetHeight/2+'px')};
  crTrack.addEventListener('scroll',update,{passive:true});addEventListener('resize',()=>{update();mid()});update();mid();
  // the arrows turn a whole page: as many cards as fit side by side
  const page=()=>step()*Math.max(1,Math.round((crTrack.clientWidth+10)/step()));
  prev.addEventListener('click',()=>crTrack.scrollBy({left:-page(),behavior:'smooth'}));
  next.addEventListener('click',()=>crTrack.scrollBy({left:page(),behavior:'smooth'}));
  crTrack.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();next.click()}if(e.key==='ArrowLeft'){e.preventDefault();prev.click()}});
  // drag with the mouse; a real drag does not open the card under the pointer
  let down=null,moved=false;
  crTrack.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button)return;down={x:e.clientX,s:crTrack.scrollLeft};moved=false});
  addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down.x;if(!moved&&Math.abs(dx)>6){moved=true;crTrack.classList.add('drag')}if(moved)crTrack.scrollLeft=down.s-dx});
  addEventListener('pointerup',()=>{if(!down)return;down=null;if(moved){crTrack.classList.remove('drag');const i=Math.round(crTrack.scrollLeft/step());crTrack.scrollTo({left:i*step(),behavior:'smooth'})}});
  crTrack.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
}

/* ---------- form ---------- */
document.getElementById('news').addEventListener('submit',e=>{e.preventDefault();const v=document.getElementById('email').value.trim();const m=document.getElementById('formmsg');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){m.textContent='Geçerli bir e-posta adresi yaz, örneğin ad@ornek.com';return}
  m.textContent=window.Noctelia.News.add(v)?'Teşekkürler, listedesin. İlk e-posta yeni koleksiyonla gelecek.':'Bu adres zaten listemizde.';e.target.reset();});

addEventListener('load',()=>ScrollTrigger.refresh());
})();
