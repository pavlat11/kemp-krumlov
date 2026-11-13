/* Kemp Krumlov – Animace a efekty: úvodní nadpis, počítadla, pás fotek, PE-LA, pozastavení mimo obrazovku.
   Spojeno z: animace/hero.js, animace/cisla.js, animace/pela.js, animace/pela-lakadlo.js, animace/pas.js, animace/mimo-obrazovku.js */

/* ===== animace/hero.js ===== */
(()=>{
 const root=document.querySelector('.kk2-scope'); if(!root)return;
 const menu=root.querySelector('#menu'), burger=root.querySelector('#burger'), hd=root.querySelector('header');
 menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger?.setAttribute('aria-expanded','false')}));
 let lastY=0; addEventListener('scroll',()=>{const y=scrollY;hd?.classList.toggle('scrolled',y>40);hd?.classList.toggle('hide',y>700&&y>lastY&&!menu?.classList.contains('open'));lastY=y},{passive:true});
 const h=root.querySelector('.hero h1'); if(h&&!h.querySelector('.w')&&!window.KK_BEZ_ANIMACI){let i=0;const walk=n=>[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t)){f.append(t);return}const w=document.createElement('span'),q=document.createElement('span');w.className='w';q.textContent=t;q.style.animationDelay=(.3+i++*.09)+'s';w.append(q);f.append(w)});c.replaceWith(f)}else if(c.nodeType===1)walk(c)});walk(h)}
 const reduce=!!window.KK_BEZ_ANIMACI;
 function sail(pathId,boatId,speed,scale){const p=root.querySelector('#'+pathId),b=root.querySelector('#'+boatId);if(!p||!b||reduce)return;const L=p.getTotalLength();let t0=null;let V=true;new IntersectionObserver(e=>{V=e[0].isIntersecting}).observe(b.ownerSVGElement||b);function f(now){if(!V){requestAnimationFrame(f);return}if(t0===null)t0=now;const k=((now-t0)/speed)%1,l=k*L,a=p.getPointAtLength(l),c=p.getPointAtLength(Math.min(L,l+2));b.setAttribute('transform',`translate(${a.x} ${a.y}) rotate(${Math.atan2(c.y-a.y,c.x-a.x)*180/Math.PI}) scale(${scale})`);requestAnimationFrame(f)}requestAnimationFrame(f)}
 setTimeout(()=>sail('rtPath','rtBoat',9000,1.15),900); (function(){const p=root.querySelector('#wvLine'),b=root.querySelector('#wvBoat');if(!p||!b)return;const L=p.getTotalLength();let t0=null;let V=true;new IntersectionObserver(e=>{V=e[0].isIntersecting}).observe(b.ownerSVGElement||b);function f(now){if(!V){requestAnimationFrame(f);return}if(t0===null)t0=now;const k=((now-t0)/22000)%1,l=k*L,a=p.getPointAtLength(l),c=p.getPointAtLength(Math.min(L,l+2));b.setAttribute('transform','translate('+a.x+' '+a.y+') rotate('+Math.max(-25,Math.min(28,Math.atan2(c.y-a.y,c.x-a.x)*180/Math.PI))+') scale(1.4)');b.classList.toggle('drop',(a.x>388&&a.x<452)||(a.x>986&&a.x<1062));requestAnimationFrame(f)}requestAnimationFrame(f)})();
})();
;

/* ===== animace/cisla.js ===== */
(()=>{const sec=document.querySelector('.kk2-scope .stats-animate');if(!sec)return;const reduce=!!window.KK_BEZ_ANIMACI;let done=false;function run(){if(done)return;done=true;sec.classList.add('stats-in');if(reduce)return;sec.querySelectorAll('b[data-target]').forEach((el,i)=>{const target=parseFloat(el.dataset.target),isDec=String(el.dataset.target).includes('.'),suffix=el.dataset.suffix||'';const dur=950,start=performance.now()+i*110;function tick(now){const p=Math.max(0,Math.min(1,(now-start)/dur)),e=1-Math.pow(1-p,3),v=target*e;if(isDec)el.innerHTML=v.toFixed(1).replace('.',',')+suffix;else if(suffix==='m')el.innerHTML=Math.round(v)+'<small>m</small>';else el.textContent=Math.round(v);if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)})}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){run();io.disconnect()}}),{threshold:.28});io.observe(sec)})();
;

/* ===== animace/pela.js ===== */
(function(){
 var sec=document.getElementById('pela'); if(!sec)return;
 var reduce=!!window.KK_BEZ_ANIMACI;
 function animateNumber(el,delay){
   var target=Number(el.dataset.n||0), pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
   if(reduce){el.textContent=pre+target+suf;return;}
   el.textContent=pre+'0'+suf;
   setTimeout(function(){
     var t0=null,dur=1050;
     function frame(t){
       if(!t0)t0=t; var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);
       el.textContent=pre+Math.round(target*e)+suf;
       if(p<1)requestAnimationFrame(frame); else el.textContent=pre+target+suf;
     }
     requestAnimationFrame(frame);
   },delay);
 }
 function run(){
   sec.classList.add('pela-in');
   sec.querySelectorAll('.pl-stats b[data-n]').forEach(function(el,i){animateNumber(el,120+i*90)});
 }
 if(reduce){run();return;}
 if('IntersectionObserver' in window){
   var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){run();io.disconnect()}},{threshold:.18,rootMargin:'0px 0px -5% 0px'}); io.observe(sec);
 } else run();
})();
;

/* ===== animace/pela-lakadlo.js ===== */
(function(){
var sec=document.getElementById('pela');if(!sec)return;
var reduce=!!window.KK_BEZ_ANIMACI;
var $=function(id){return document.getElementById(id)};

/* postupný nástup bloků při scrollování */
var rs=[].slice.call(sec.querySelectorAll('.pp-r'));
if('IntersectionObserver' in window&&!reduce){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 rs.forEach(function(el){io.observe(el)})}
else rs.forEach(function(el){el.classList.add('in')});

/* 1 den / vícedenní: ceny se plynule přepočítají */
var cards=[].slice.call(sec.querySelectorAll('.pp-boat:not([data-skryta])')),multi=false,tw=new WeakMap();
var hned=false;
function tween(el,to){var from=+(el.dataset.v||to);el.dataset.v=to;
 if(reduce||hned||from===to){el.textContent=to.toLocaleString('cs-CZ');return}
 var t0=null,dur=420;cancelAnimationFrame(tw.get(el)||0);
 (function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(from+(to-from)*e).toLocaleString('cs-CZ');if(p<1)tw.set(el,requestAnimationFrame(f))})(performance.now())}
function render(){
 var best=null,bv=1e9;
 cards.forEach(function(c){var cap=c.querySelectorAll('.pp-pp svg').length,v=(multi?+c.dataset.pm:+c.dataset.p1)/cap;if(v<bv){bv=v;best=c}});
 cards.forEach(function(c){
  var p1=+c.dataset.p1,pm=+c.dataset.pm;
  tween(c.querySelector('.pp-price em'),multi?pm:p1);
  c.querySelector('.pp-price>small').textContent=multi?'cena za den při vícedenním půjčení':'cena za den';
  c.querySelector('.pp-alt').textContent=multi?'1 den: '+p1.toLocaleString('cs-CZ')+' Kč / den':'vícedenní '+pm.toLocaleString('cs-CZ')+' Kč / den';
  c.querySelector('.pp-badge').hidden=c!==best;
  var tx=function(q){var e=c.querySelector(q);return e?e.textContent.trim():''};
  c.setAttribute('aria-label',tx('.pp-bt')+' '+tx('.pp-bi~b,.pp-bt+b')+', cena od '+Math.min(p1,pm).toLocaleString('cs-CZ')+' Kč za den, otevřít pe-la.cz')})}
window.KKPela={render:function(){hned=true;render();hned=false}};
$('ppTg').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;multi=+b.dataset.m>=2;
 [].forEach.call($('ppTg').children,function(x){x.classList.toggle('on',x===b)});render()});
render();

/* mobil: tečky pod posuvníkem lodí */
var track=$('ppBoats'),dots=$('ppDots');
cards.forEach(function(c,i){var d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Loď '+(i+1));
 d.addEventListener('click',function(){track.scrollTo({left:c.offsetLeft-track.offsetLeft-18,behavior:reduce?'auto':'smooth'})});dots.appendChild(d)});
function dotSync(){var step=(cards[1].offsetLeft-cards[0].offsetLeft)||1,i=Math.max(0,Math.min(cards.length-1,Math.round(track.scrollLeft/step)));
 [].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===i)})}
track.addEventListener('scroll',function(){requestAnimationFrame(dotSync)},{passive:true});dotSync();

/* výzva: fotka z webu v pozadí */
var ph=document.querySelector('img[data-img="kemp-reka"]'),cta=$('ppCta');
if(ph&&cta&&ph.getAttribute('src'))cta.style.backgroundImage='url("'+ph.getAttribute('src')+'")';

/* jemný posun fotky v úvodu */
var hero=sec.querySelector('.pl-hero'),img=hero&&hero.querySelector('img');
if(img&&!reduce){var tk=false;
 var par=function(){tk=false;var r=hero.getBoundingClientRect(),vh=innerHeight;if(r.bottom<0||r.top>vh)return;
  var p=Math.min(1,Math.max(0,(vh-r.top)/(vh+r.height)));img.style.objectPosition='50% '+(24+p*34).toFixed(1)+'%'};
 addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(par)}},{passive:true});par()}
})();
;

/* ===== animace/pas.js ===== */
(()=>{const t=document.querySelector('.marquee-track');if(!t)return;
setTimeout(()=>{const x0=t.getBoundingClientRect().left;setTimeout(()=>{
if(Math.abs(t.getBoundingClientRect().left-x0)>1)return;
t.style.animation='none';let x=0,last=performance.now();const w=t.scrollWidth/2;
(function f(n){if(!window.__animPaused)x-=(n-last)*0.046;last=n;if(x<=-w)x+=w;t.style.transform='translate3d('+x+'px,0,0)';requestAnimationFrame(f)})(last)},1500)},800)})();
;

/* ===== animace/mimo-obrazovku.js ===== */
(function(){if(!('IntersectionObserver'in window))return;var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('zz-off',!e.isIntersecting)})},{rootMargin:'0px'});
document.querySelectorAll('section,.marquee,header.kk2-part').forEach(function(el){if(el.closest('section')!==el&&el.closest('section'))return;io.observe(el)})})();
;
