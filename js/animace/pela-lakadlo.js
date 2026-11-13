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
