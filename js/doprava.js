(function(){
var sec=document.getElementById('doprava');if(!sec)return;
var STOPS=[["Vyšší Brod", 1150], ["Rožmberk nad Vltavou", 850], ["Nahořany", 650], ["Kemp Vltava", 550], ["Viking / Pískárna", 500], ["Vltavan / Spolí", 350], ["Centrum", 250], ["Zlatá Koruna", 350], ["Boršov", 900]];if(window.KKC)STOPS.forEach(function(x,i){var p=KKC.p("dop"+(i+1));if(p)x[1]=+p.a}),NS='http://www.w3.org/2000/svg';
var W=480,H=740;
function E(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
/* ---------- geometrie: řeka teče shora dolů, silnice vpravo od ní ---------- */
function rx(y){return 232+58*Math.sin(y*0.0172+0.35)}
function poly(f,dx){var d='';for(var y=-10;y<=H+10;y+=8){d+=(d?' L':'M')+(rx(y)+dx).toFixed(1)+' '+y}return d}
var riverEl=document.getElementById('dpRiver'),roadEl=document.getElementById('dpRoad');
var D_RIVER=poly(rx,0),D_ROAD=poly(rx,78);
['dpRiverBank','dpRiver','dpRiverHl'].forEach(function(id){document.getElementById(id).setAttribute('d',D_RIVER)});
['dpRoadEdge','dpRoad','dpRoadDash'].forEach(function(id){document.getElementById(id).setAttribute('d',D_ROAD)});
var road=roadEl,L=road.getTotalLength(),rv=riverEl,RL=rv.getTotalLength();
var trail=document.getElementById('dpTrail'),van=document.getElementById('dpVan'),camp=document.getElementById('dpCamp'),gS=document.getElementById('dpStops');
var FR=[.045,.14,.235,.33,.43,.535,.64,.82,.955],CAMP=.735;
function rp(f){return rv.getPointAtLength(RL*f)}
/* ---------- zastávky na řece, popisek vlevo ---------- */
var stEls=STOPS.map(function(s,i){var p=rp(FR[i]),g=E('g',{class:'dp-st',tabindex:0,role:'button','aria-label':s[0],transform:'translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')'},gS);
 E('circle',{class:'hit',r:24,fill:'transparent'},g);E('circle',{class:'ring',r:10},g);E('circle',{class:'o',r:8},g);
 var t=E('text',{x:-22,y:5.5,'text-anchor':'end'},g);t.textContent=s[0].replace(' nad Vltavou','');
 g.addEventListener('click',function(){stopAuto();select(i)});
 g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();stopAuto();select(i)}});
 return g});
/* ---------- kemp u silnice ---------- */
var cr=road.getPointAtLength(L*CAMP);
var spur=E('path',{d:'M'+cr.x.toFixed(1)+' '+cr.y.toFixed(1)+' L'+(cr.x+36).toFixed(1)+' '+cr.y.toFixed(1),stroke:'#e9dfc3',fill:'none','stroke-width':7,'stroke-linecap':'round'});
camp.parentNode.insertBefore(spur,camp);
camp.setAttribute('transform','translate('+(cr.x+46).toFixed(1)+' '+cr.y.toFixed(1)+')');
var chips=[].slice.call(sec.querySelectorAll('.dp-chip'));
chips.forEach(function(c){c.addEventListener('click',function(){stopAuto();select(+c.dataset.i)})});
/* ---------- jízda ---------- */
function fmt(n){return Math.round(n).toLocaleString('cs-CZ')+'\u00a0Kč'}
var ang=0,angT=0;
function norm(a){while(a>180)a-=360;while(a<-180)a+=360;return a}
function targetAng(f,dir){var p=road.getPointAtLength(L*f),q=road.getPointAtLength(L*Math.min(1,Math.max(0,f+.003*dir)));return Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI+90}
function place(f,dir,snap){var p=road.getPointAtLength(L*f);angT=targetAng(f,dir);
 if(snap)ang=angT;else ang+=norm(angT-ang)*.22;
 van.setAttribute('transform','translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+') rotate('+ang.toFixed(1)+')')}
function drawTrail(a,b){var pts=[],n=44;for(var k=0;k<=n;k++){var p=road.getPointAtLength(L*(a+(b-a)*k/n));pts.push(p.x.toFixed(1)+' '+p.y.toFixed(1))}trail.setAttribute('d','M'+(cr.x+34).toFixed(1)+' '+cr.y.toFixed(1)+' L'+pts.join(' L'))}
var priceObj={v:0},anim=0,sel=-1,pT=0;
function tweenPrice(to){cancelAnimationFrame(pT);var from=priceObj.v,t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/600),e=1-Math.pow(1-p,3);priceObj.v=from+(to-from)*e;
 document.getElementById('dpPrice').textContent=fmt(priceObj.v);document.getElementById('dpPer').textContent=fmt(priceObj.v/8);if(p<1)pT=requestAnimationFrame(f)})(t0)}
function select(i){if(i===sel)return;sel=i;
 stEls.forEach(function(e,k){e.classList.toggle('on',k===i)});
 chips.forEach(function(c,k){c.classList.toggle('on',k===i);c.setAttribute('aria-selected',k===i)});
 document.getElementById('dpName').textContent=STOPS[i][0];tweenPrice(STOPS[i][1]);
 var target=FR[i],start=CAMP,dir=target>start?1:-1,dur=Math.max(450,Math.abs(target-start)*720),t0=null;cancelAnimationFrame(anim);van.classList.remove('dp-van-idle');
 (function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,pos=start+(target-start)*e;place(pos,dir);drawTrail(start,pos);
  if(p<1)anim=requestAnimationFrame(f);else van.classList.add('dp-van-idle')})(performance.now())}
var auto=null,ai=0;function stopAuto(){clearInterval(auto);auto=null}
place(CAMP,1,true);
var reduce=false;
function start(){select(0);if(reduce)return;ai=0;auto=setInterval(function(){ai=(ai+1)%STOPS.length;select(ai)},1400)}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){start();io.disconnect()}},{threshold:.25});io.observe(sec.querySelector('.dp-map'))}else start();
})();
