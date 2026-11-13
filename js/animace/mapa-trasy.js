/* Animovaná mapa trasy (plavba do kempu) */
(()=>{const NS='http://www.w3.org/2000/svg',svg=document.getElementById('rmap');if(!svg)return;
const rv=document.getElementById('rvMain'),L=rv.getTotalLength(),trail=document.getElementById('trail'),world=document.getElementById('world'),
canoe=document.getElementById('canoe'),raft=document.getElementById('raft'),camp=document.getElementById('camp'),conf=document.getElementById('confetti'),
stage=document.getElementById('tripStage'),bar=document.getElementById('tripBar'),trip=document.getElementById('trip');
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.append(e);return e};
const near=(x,y)=>{let best=0,bd=1e9;for(let l=0;l<=L;l+=2){const p=rv.getPointAtLength(l),d=(p.x-x)**2+(p.y-y)**2;if(d<bd){bd=d;best=l}}return best};
const CAMP=near(712,565);
const cp=rv.getPointAtLength(CAMP),CX=cp.x+20,CY=cp.y-18;
camp.setAttribute('transform',`translate(${CX} ${CY}) scale(1.35)`);
const stops=[['Vyšší Brod',110,40,22,-14],['Rožmberk n. Vlt.',250,200,-190,34],['Český Krumlov',548,330,30,-28],['Zlatá Koruna',800,705,-158,30],['Boršov n. Vlt.',870,800,-170,-14]];
const sg=document.getElementById('stops');sg.replaceChildren();
const S=stops.map(([n,x,y,dx,dy])=>{const l=near(x,y),p=rv.getPointAtLength(l),g=el('g',{class:'stop'},sg);
  el('circle',{class:'d',cx:p.x,cy:p.y,r:10},g);el('text',{x:p.x+dx,y:p.y+dy},g).textContent=n;
  const t=el('text',{class:'tick',x:p.x-5,y:p.y+5,style:'font-size:13px;fill:#10231a;font-weight:800'},g);t.textContent='✓';
  return{l,g,n}});
let seed=11;const R=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
const pts=[];for(let l=0;l<=L;l+=12){const p=rv.getPointAtLength(l);pts.push([p.x,p.y])}
const farFromRiver=(x,y,m)=>pts.every(([a,b])=>(a-x)**2+(b-y)**2>m*m);
const fg=document.getElementById('forest');fg.replaceChildren();
for(let i=0;i<260;i++){const x=R()*900,y=R()*820;if(!farFromRiver(x,y,46))continue;if(Math.hypot(x-540,y-385)<90)continue;if(Math.hypot(x-CX-50,y-CY)<80)continue;
  const r=4+R()*7;el('circle',{cx:x,cy:y,r,fill:R()<.5?'#1f4130':'#25503a',opacity:.55+R()*.4},fg)}
const cg=document.getElementById('contours');cg.replaceChildren();
for(let k=0;k<9;k++){let d=`M${-50} ${60+k*95}`;for(let x=0;x<=950;x+=90)d+=` Q${x+45} ${60+k*95+(R()-.5)*70} ${x+90} ${60+k*95+(R()-.5)*30}`;el('path',{d},cg)}
trail.style.strokeDasharray=L;trail.style.strokeDashoffset=L;
const place=(g,l,off=0)=>{const p=rv.getPointAtLength(Math.max(0,Math.min(L,l))),q=rv.getPointAtLength(Math.max(0,Math.min(L,l+1)));
  const a=Math.atan2(q.y-p.y,q.x-p.x);g.setAttribute('transform',`translate(${p.x+Math.cos(a+Math.PI/2)*off} ${p.y+Math.sin(a+Math.PI/2)*off}) rotate(${a*180/Math.PI}) scale(${g.id==='canoe'?1.55:1.3})`)};
const easeIO=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const ease=t=>.12*t+.88*easeIO(t);
const smooth=t=>t*t*(3-2*t);
const ZOOM=1.35,TX=420,TY=440;
const setZoom=k=>{const s=1+(ZOOM-1)*k,x=CX+(TX-CX)*k,y=CY+(TY-CY)*k;
  world.setAttribute('transform',`translate(${x} ${y}) scale(${s}) translate(${-CX} ${-CY})`)};
let parts=[];
const COLORS=['#f4a64a','#ffd27d','#5fb7bd','#e9d9bf','#ffffff','#7be0a0'];
function burst(){conf.innerHTML='';parts=[];
  for(let i=0;i<46;i++){const a=-Math.PI/2+(Math.random()-.5)*Math.PI*1.5,v=3+Math.random()*5.5;
    const r=Math.random()<.5,e=r?el('rect',{width:5,height:9,rx:1.5,x:-2.5,y:-4.5,fill:COLORS[i%COLORS.length]},conf):el('circle',{r:2.6+Math.random()*2,fill:COLORS[i%COLORS.length]},conf);
    parts.push({e,x:CX,y:CY-30,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,rot:Math.random()*360,vr:(Math.random()-.5)*20,life:1})}}
function stepParts(){for(const p of parts){if(p.life<=0)continue;p.vy+=.16;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.life-=.011;
  p.e.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${p.rot})`);p.e.setAttribute('opacity',Math.max(0,p.life))}}
const DUR=6500,ZIN=900,HOLD=4200,ZOUT=800;let t0=performance.now(),arrived=false;
const reduce=false;
function reset(){arrived=false;svg.classList.remove('arrived');camp.classList.remove('arrived');canoe.classList.remove('docked');trip.classList.remove('done');
  S.forEach(s=>s.g.classList.remove('on'));conf.innerHTML='';parts=[];setZoom(0)}
let rmV=true;new IntersectionObserver(e=>{rmV=e[0].isIntersecting}).observe(svg);
function frame(now){if(!rmV){t0+=now-(frame.l||now);frame.l=now;requestAnimationFrame(frame);return}frame.l=now;
  let t=now-t0;const TOTAL=DUR+HOLD+ZOUT;
  if(t>TOTAL){t0=now;t=0;reset()}
  const p=reduce?1:Math.min(1,t/DUR),e=ease(p),l=e*CAMP;
  if(p<1){place(canoe,l);canoe.style.opacity=Math.min(1,t/300)}
  else{
    const a=t-DUR,k=Math.min(1,a/500);place(canoe,CAMP,-k*20);
    if(!arrived){arrived=true;svg.classList.add('arrived');camp.classList.add('arrived');canoe.classList.add('docked');trip.classList.add('done');
      stage.textContent='Dorazili jste do kempu ✓';if(!reduce)burst()}
    const zin=reduce?1:smooth(Math.min(1,a/ZIN)),zout=a>HOLD?smooth(Math.min(1,(a-HOLD)/ZOUT)):0;
    setZoom(zin*(1-zout));
    if(a>HOLD){canoe.style.opacity=1-zout;svg.classList.remove('arrived');camp.classList.remove('arrived')}}
  stepParts();
  trail.style.strokeDashoffset=L-l;
  bar.style.width=(e*100)+'%';
  let cur=S[0].n;S.forEach(s=>{if(l>=s.l-2){s.g.classList.add('on');cur=s.n}});
  if(p<1)stage.textContent=cur;
  {const rl=((now/42000+.45)%1)*L;place(raft,rl,10);raft.style.opacity=(Math.abs(rl-CAMP)<90||Math.abs(rl-l)<70||arrived)?0:1}
  requestAnimationFrame(frame)}
requestAnimationFrame(frame)})();
