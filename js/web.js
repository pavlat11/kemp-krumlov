/* Kemp Krumlov – Základ webu: obsah z administrace, hlavička a menu, jazyk, galerie, fotky v sekcích, kontakt, přístupnost.
   Spojeno z: obsah.js, zaklad.js, fotky-sekci.js, jazyk.js, o-kempu.js, sipka-nahoru.js, galerie.js, pristupnost.js, mobilni-menu.js, kontakt-mapa.js, menu-aktivni.js */

/* ===== obsah.js ===== */
/* Kemp Krumlov – použití obsahu z administrace na webu.
   Náhled: změny jsou uložené v tomto prohlížeči (localStorage / IndexedDB).
   Na serveru tento soubor nebude potřeba – texty, SEO i galerii vypíše rovnou server do HTML. */
(function(){
'use strict';
function get(k){try{var v=localStorage.getItem('kk.'+k);return v?JSON.parse(v):null}catch(e){return null}}
var BASE=(document.currentScript&&document.currentScript.src||'').replace(/js\/[^\/]+\.js.*$/,'');

/* 1) texty */
var t=get('texty');
if(t){
  /* PE-LA: ceny lodí jako obyčejný text "1 den|vícedenní" a animovaná čísla */
  [].forEach.call(document.querySelectorAll('[data-t-ceny]'),function(el){var v=t[el.dataset.tCeny];if(!v)return;var p=String(v).split('|');if(+p[0])el.dataset.p1=+p[0];if(+p[1])el.dataset.pm=+p[1]});
  [].forEach.call(document.querySelectorAll('[data-t-n]'),function(el){var v=t[el.dataset.tN];if(v==null||v==='')return;el.dataset.n=+v;el.textContent=(el.dataset.prefix||'')+(+v)+(el.dataset.suffix||'')});
}
function pouzij(m){if(m)Object.keys(m).forEach(function(k){[].forEach.call(document.querySelectorAll('[data-t="'+k+'"]'),function(el){if(!el.hasAttribute('data-cena'))el.innerHTML=m[k]})})}
pouzij(t);
/* překlad: anglické / německé texty přes české (co chybí, zůstane česky) */
var L=window.KK_LANG||'cs';if(L!=='cs'){var VP=window.KK_PREKLADY&&KK_PREKLADY[L];if(VP)pouzij(VP.texty);pouzij(get('texty.'+L))}

/* 2) SEO */
var s=get('seo');
if(s){
  var meta=function(attr,name,val){if(val===undefined)return;var m=document.head.querySelector('meta['+attr+'="'+name+'"]');if(!m){m=document.createElement('meta');m.setAttribute(attr,name);document.head.appendChild(m)}m.setAttribute('content',val)};
  if(s.title)document.title=s.title;
  meta('name','description',s.description);
  meta('name','robots',s.index===false?'noindex, nofollow':'index, follow');
  meta('property','og:title',s.ogTitle||s.title);meta('property','og:description',s.ogDescription||s.description);
  if(s.ogImage)meta('property','og:image',/^https?:/.test(s.ogImage)?s.ogImage:(s.canonical||'').replace(/\/$/,'')+'/'+s.ogImage.replace(/^\//,''));
  if(s.googleVerify)meta('name','google-site-verification',s.googleVerify);
  if(s.keywords)meta('name','keywords',s.keywords);
  var c=document.head.querySelector('link[rel=canonical]');if(c&&s.canonical)c.href=s.canonical;
  var u=document.head.querySelector('meta[property="og:url"]');if(u&&s.canonical)u.setAttribute('content',s.canonical);
  var ld=document.getElementById('ld-kemp');
  if(ld&&s.firma)try{var j=JSON.parse(ld.textContent),f=s.firma;j.name=f.nazev||j.name;j.telephone=f.telefon||j.telephone;j.email=f.email||j.email;if(s.keywords)j.keywords=s.keywords;if(s.canonical)j.url=s.canonical;
    j.address.streetAddress=f.ulice||j.address.streetAddress;j.address.addressLocality=f.mesto||j.address.addressLocality;j.address.postalCode=f.psc||j.address.postalCode;
    if(f.lat&&f.lng){j.geo.latitude=+f.lat;j.geo.longitude=+f.lng}ld.textContent=JSON.stringify(j)}catch(e){}
}

function nactiSkript(src){return new Promise(function(ok,no){var e=document.createElement('script');e.src=BASE+src;e.onload=ok;e.onerror=no;document.body.appendChild(e)})}
function nactiData(){return window.KK&&KK.galerie?Promise.resolve():nactiSkript('js/kk-data.js?v=4')}

/* 3) galerie z administrace */
if(get('galerie'))document.addEventListener('DOMContentLoaded',function(){
  nactiData().then(function(){return KK.galerie.seznam()}).then(function(f){
    f=f.filter(function(x){return x.viditelna!==false});
    if(f.length&&window.KKGalerie)KKGalerie.vykresli(f.map(function(x){return{src:KK.galerie.url(x),nahled:KK.galerie.url(x,true),popis:x.popis,kat:x.kat,w:x.w,h:x.h}}));
  }).catch(function(){});
});

/* 4) editační režim: ?edit=1 a přihlášený správce */
var ses=get('session');
if(/[?&]edit(=1)?(&|$)/.test(location.search)&&ses&&ses.do>Date.now()){
  var l=document.createElement('link');l.rel='stylesheet';l.href=BASE+'css/editace.css?v=7';document.head.appendChild(l);
  document.addEventListener('DOMContentLoaded',function(){nactiData().then(function(){return nactiSkript('js/editace.js?v=8')})});
}
})();
;

/* ===== zaklad.js ===== */
/* Základ: načítání, hlavička při scrollu, postupné zobrazování sekcí, počítadla */
const reduce=!!window.KK_BEZ_ANIMACI;

addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('done'),reduce?0:600));

setTimeout(()=>document.getElementById('loader').classList.add('done'),2500);

const header=document.querySelector('header'),prog=document.getElementById('progress'),callbar=document.getElementById('callbar'),menu=document.getElementById('menu');

let lastY=0;

/* nejdřív vše přečíst, pak zapsat – a jen jednou za snímek (dřív se rozvržení přepočítávalo při každém posunu) */
const arEl=document.getElementById('areal'),cnEl=document.getElementById('cenik');let scT=0;
function onScrollRun(){scT=0;
  const y=scrollY,vh=innerHeight,sh=document.documentElement.scrollHeight,ar=arEl?arEl.getBoundingClientRect():{top:9e9,bottom:-9e9},cn=cnEl?cnEl.getBoundingClientRect():{top:9e9,bottom:-9e9},menuOpen=menu?.classList.contains('open');
  const onMap=ar.top<90&&ar.bottom>90;
  header?.classList.toggle('scrolled',y>40);
  header?.classList.toggle('onmap',onMap);if(onMap)menu?.classList.remove('open');
  header?.classList.toggle('hide',y>600&&y>lastY&&!(menuOpen&&!onMap));lastY=y;
  if(prog)prog.style.width=(y/(sh-vh)*100)+'%';
  callbar?.classList.toggle('show',y>400&&!(ar.top<vh*.5&&ar.bottom>vh*.5)&&!(cn.top<vh*.6&&cn.bottom>vh*.4))}
function onScroll(){if(!scT)scT=requestAnimationFrame(onScrollRun)}

addEventListener('scroll',onScroll,{passive:true});

onScroll();

menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

const io=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;const el=x.target;
  const sib=[...el.parentElement.children].filter(c=>c.classList.contains('reveal'));
  el.style.transitionDelay=(sib.indexOf(el)*0.07)+'s';el.classList.add('in');
  el.querySelectorAll('[data-count]').forEach(countUp);io.unobserve(el)}),{threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

function countUp(el){if(el.dataset.done)return;el.dataset.done=1;const to=+el.dataset.count,dec=+(el.dataset.dec||0),t0=performance.now(),dur=1600;
  const fmtN=v=>v.toLocaleString('cs-CZ',{minimumFractionDigits:dec,maximumFractionDigits:dec});
  if(reduce){el.textContent=fmtN(to);return}
  const f=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=fmtN(to*e);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
;

/* ===== fotky-sekci.js ===== */
(()=>{const I={"kemp-reka":"img/inl-08.webp","terasa":"img/inl-09.webp","chatky":"img/inl-10.webp","teepee":"img/inl-11.webp"};document.querySelectorAll("img[data-img]").forEach(i=>i.src=I[i.dataset.img])})();
;

/* ===== jazyk.js ===== */
/* Přepínač jazyka. Jazyk určuje js/start.js (?lang=en|de, jinak poslední volba, jinak čeština).
   Zvolením jazyka se stránka načte znovu s ?lang=… – texty se pak vezmou z překladů v administraci
   (co ještě není přeložené, zůstane česky). Na serveru budou jazyky na adresách /en/ a /de/. */
(()=>{const w=document.querySelector('.lang-switch');if(!w)return;
const t=w.querySelector('.lang-current'),flag=t.querySelector('.flag'),name=t.querySelector('.sr-lang'),menu=w.querySelector('.lang-menu');
const KOD={CZ:'cs',EN:'en',DE:'de'},names={CZ:'Čeština',EN:'English',DE:'Deutsch'};
const ted=Object.keys(KOD).find(k=>KOD[k]===(window.KK_LANG||'cs'))||'CZ';
const ukaz=l=>{menu.querySelectorAll('[data-lang]').forEach(x=>{const on=x.dataset.lang===l;x.classList.toggle('active',on);if(on)x.setAttribute('aria-current','true');else x.removeAttribute('aria-current')});flag.className='flag flag-'+l.toLowerCase();if(!name.hasAttribute('data-t')||l!=='CZ')name.textContent=names[l]};
ukaz(ted);
const zavri=()=>{w.classList.remove('open');t.setAttribute('aria-expanded','false')};
t.addEventListener('click',e=>{e.stopPropagation();const o=w.classList.toggle('open');t.setAttribute('aria-expanded',String(o))});
menu.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(!b)return;const l=b.dataset.lang;zavri();if(l===ted)return;
  if(window.KKE&&KKE.neulozeno()&&!confirm('Máte neuložené změny. Přepnout jazyk bez uložení?'))return;
  const kod=KOD[l];try{localStorage.setItem('kk.jazyk',JSON.stringify(kod))}catch(x){}
  const u=new URL(location.href);if(kod==='cs')u.searchParams.delete('lang');else u.searchParams.set('lang',kod);
  if(window.KKE)window.KKE.opust=true;location.href=u.toString()});
document.addEventListener('click',zavri);document.addEventListener('keydown',e=>{if(e.key==='Escape')zavri()});
})();
;

/* ===== o-kempu.js ===== */
(()=>{const ul=document.getElementById('okTl');if(!ul)return;const fill=ul.querySelector('.tl-fill'),boat=ul.querySelector('.tl-boat'),track=ul.querySelector('.tl-track'),items=[...ul.querySelectorAll('.tl-i')];
function upd(){const r=ul.getBoundingClientRect(),vh=innerHeight,tr=track.getBoundingClientRect();const target=vh*.62;const first=items[0].getBoundingClientRect(),last=items[items.length-1].getBoundingClientRect();const y0=first.top+first.height/2,y1=last.top+last.height/2;let p=(target-y0)/(y1-y0);p=Math.max(0,Math.min(1,p));const H=track.clientHeight;const startOff=y0-tr.top,endOff=y1-tr.top;const px=startOff+(endOff-startOff)*p;const f=Math.max(0,Math.min(H,(target-tr.top)<startOff?0:px));fill.style.height=f+'px';boat.style.top=f+'px';boat.style.opacity=(target<y0-40)?0:1;items.forEach(li=>{const b=li.getBoundingClientRect();li.classList.toggle('on',target>=b.top+22)})}
let t=false;function on(){if(t)return;t=true;requestAnimationFrame(()=>{t=false;upd()})}
addEventListener('scroll',on,{passive:true});addEventListener('resize',on);upd();})();
;

/* ===== sipka-nahoru.js ===== */
(function(){var b=document.getElementById('toTop');var rz=false,r=document.getElementById('rezervace');function u(){b.classList.toggle('on',scrollY>700&&!(rz&&innerWidth<900)&&!mp)}var mp=false,am=document.getElementById('areal');if('IntersectionObserver'in window){if(r)new IntersectionObserver(function(e){rz=e[0].isIntersecting;u()},{rootMargin:'-20% 0px -20% 0px'}).observe(r);if(am)new IntersectionObserver(function(e){mp=e[0].isIntersecting;u()},{rootMargin:'-10% 0px -10% 0px'}).observe(am)}addEventListener('scroll',u,{passive:true});addEventListener('resize',u);u();b.addEventListener('click',function(){scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})})})();
;

/* ===== galerie.js ===== */
(function(){
var r=document.getElementById('galerie');if(!r)return;
var grid=r.querySelector('.gl-grid'),lb=document.getElementById('glLb'),im=lb.querySelector('img'),t=lb.querySelector('.t'),n=lb.querySelector('.n'),
    mb=r.querySelector('.gl-more-b'),mw=r.querySelector('.gl-more-w'),LIM=9,cur=0,last=null,filtr='all';
function it(){return [].slice.call(grid.querySelectorAll('.gl-i'))}
function vis(){return it().filter(function(x){return getComputedStyle(x).display!=='none'})}
function priprav(){
  var a=it();a.forEach(function(x,i){x.classList.toggle('extra',i>=LIM)});
  var zbyva=a.length-LIM;
  if(mw){var ukaz=zbyva>0&&filtr==='all'&&grid.classList.contains('lim');mw.hidden=!(zbyva>0);mw.style.display=ukaz?'':'none';if(mb)mb.querySelector('span:last-child').textContent='('+Math.max(0,zbyva)+')'}
  if(zbyva<=0)grid.classList.remove('lim');
}
function show(i){var v=vis();if(!v.length)return;cur=(i+v.length)%v.length;var e=v[cur].querySelector('img');im.src=e.dataset.full||e.src;im.alt=e.alt;t.textContent=e.alt;n.textContent=(cur+1)+' / '+v.length}
function open(el){last=document.activeElement;show(vis().indexOf(el));lb.hidden=false;document.documentElement.style.overflow='hidden';lb.querySelector('.gl-x').focus()}
function close(){lb.hidden=true;document.documentElement.style.overflow='';if(last)last.focus()}
grid.addEventListener('click',function(e){var b=e.target.closest('.gl-i button');if(b)open(b.closest('.gl-i'))});
if(mb)mb.addEventListener('click',function(){grid.classList.remove('lim');mw.style.display='none';mb.setAttribute('aria-expanded','true');var f=it()[LIM];if(f)f.querySelector('button').focus({preventScroll:true})});
lb.querySelector('.gl-x').addEventListener('click',close);lb.querySelector('.gl-p').addEventListener('click',function(){show(cur-1)});lb.querySelector('.gl-n').addEventListener('click',function(){show(cur+1)});
lb.addEventListener('click',function(e){if(e.target===lb)close()});
addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(cur-1);else if(e.key==='ArrowRight')show(cur+1)});
var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){if(sx===null)return;var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>45)show(cur+(d<0?1:-1));sx=null});
r.querySelectorAll('.gl-f button').forEach(function(b){b.addEventListener('click',function(){
  r.querySelectorAll('.gl-f button').forEach(function(x){x.classList.toggle('on',x===b)});filtr=b.dataset.f;
  grid.classList.toggle('all',filtr==='all');
  if(filtr!=='all')grid.classList.remove('lim');else if(mb&&mb.getAttribute('aria-expanded')!=='true')grid.classList.add('lim');
  it().forEach(function(x){x.classList.toggle('hide',filtr!=='all'&&x.dataset.c!==filtr)});priprav();
})});
priprav();
/* vykreslení z dat (administrace / server) */
var esc=function(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
window.KKGalerie={vykresli:function(f){
  grid.innerHTML=f.map(function(x){return '<figure class="gl-i" data-c="'+esc(x.kat)+'"><button type="button" aria-label="Zvětšit: '+esc(x.popis||'fotka')+'"><img src="'+esc(x.nahled||x.src)+'" data-full="'+esc(x.src)+'" alt="'+esc(x.popis)+'" loading="lazy" decoding="async" width="'+(x.w||1536)+'" height="'+(x.h||1024)+'"></button>'+(x.popis?'<figcaption>'+esc(x.popis)+'</figcaption>':'')+'</figure>'}).join('');
  if(mb&&mb.getAttribute('aria-expanded')!=='true')grid.classList.add('lim');
  it().forEach(function(x){x.classList.toggle('hide',filtr!=='all'&&x.dataset.c!==filtr)});priprav();
}};
})();
;

/* ===== pristupnost.js ===== */
(function(){
 var sk=document.querySelector('.skip-link'),ob=document.getElementById('obsah');if(sk&&ob)sk.addEventListener('click',function(e){e.preventDefault();ob.focus();ob.scrollIntoView()});
 /* galerie: fokus zůstane uvnitř otevřeného prohlížeče */
 var lb=document.getElementById('glLb');if(lb)lb.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=[].slice.call(lb.querySelectorAll('button'));var i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}});
})();
;

/* ===== mobilni-menu.js ===== */
(function(){var p=document.getElementById('mnav'),bg=document.getElementById('burger'),menu=document.getElementById('menu');if(!p||!bg||!menu)return;
var IC={"#vodaci": "<path d=\"M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2-1.5 4.5-1.5S19 17 21 17\"/><path d=\"M5 13 12 6l7 7\"/>", "#ubytovani": "<path d=\"M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5\"/>", "#rezervace": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/>", "#areal": "<path d=\"M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z\"/><path d=\"M9 4v14M15 6v14\"/>", "#pela": "<path d=\"M4 20 15 9\"/><path d=\"M14 4c3-1 6 2 5 5l-3 3-5-5z\"/>", "#galerie": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><circle cx=\"9\" cy=\"10\" r=\"2\"/><path d=\"m21 16-5-5-9 8\"/>", "#okoli": "<path d=\"M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z\"/><circle cx=\"12\" cy=\"9\" r=\"2.5\"/>", "#kontakt": "<path d=\"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2\"/>"},l=p.querySelector('.mnav-l');
[].forEach.call(menu.querySelectorAll('a'),function(a,i){var h=a.getAttribute('href'),n=document.createElement('a');n.href=h;n.style.transitionDelay=(.04*i+.05)+'s';n.innerHTML='<i aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(IC[h]||'')+'</svg></i><span>'+a.innerHTML+'</span><svg class="ar" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';l.appendChild(n)});
var last=null;
function open(){last=document.activeElement;p.hidden=false;document.documentElement.classList.add('mnav-open');bg.setAttribute('aria-expanded','true');sync();void p.offsetWidth;p.classList.add('in');p.querySelector('.mnav-x').focus()}
function close(){p.classList.remove('in');document.documentElement.classList.remove('mnav-open');bg.setAttribute('aria-expanded','false');p.hidden=true;if(last&&last.focus)last.focus()}
bg.removeAttribute('onclick');bg.setAttribute('aria-controls','mnav');bg.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();menu.classList.remove('open');open()},true);
p.querySelector('.mnav-x').addEventListener('click',close);
p.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&a.getAttribute('href').charAt(0)==='#'){close()}});
addEventListener('keydown',function(e){if(p.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){var f=[].slice.call(p.querySelectorAll('a,button'));var i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
var an=p.querySelector('.mnav-anim');
function sync(){an.setAttribute('aria-checked',String(!window.__animPaused));var cur=document.querySelector('.lang-menu button.active');var c=cur?cur.dataset.lang:'CZ';[].forEach.call(p.querySelectorAll('.mnav-lang button'),function(b){b.classList.toggle('on',b.dataset.l===c);b.setAttribute('aria-pressed',String(b.dataset.l===c))})}
an.addEventListener('click',function(){if(window.__setAnimPaused)window.__setAnimPaused(!window.__animPaused);sync()});
[].forEach.call(p.querySelectorAll('.mnav-lang button'),function(b){b.addEventListener('click',function(){var o=document.querySelector('.lang-menu button[data-lang="'+b.dataset.l+'"]');if(o)o.click();sync()})});
addEventListener('resize',function(){if(innerWidth>1190&&!p.hidden)close()});
})();
;

/* ===== kontakt-mapa.js ===== */
/* MAPY.CZ – vložení mapy do Kontaktu.
   Na mapy.cz najděte kemp → Sdílet → Vložit mapu do webu → zkopírujte adresu z atributu src="…" (začíná https://frame.mapy.cz/…)
   a vložte ji mezi uvozovky níže. Dokud je prázdné, zobrazí se náhled s odkazem „Otevřít v Mapy.cz“. */
var MAPY_EMBED='https://mapy.com/s/laranobohe';
(function(){var w=document.getElementById('ktMapy');if(!w||!MAPY_EMBED)return;var b=w.querySelector('.kt-mapy-show');
function load(){if(w.classList.contains('on'))return;var f=document.createElement('iframe');f.src=MAPY_EMBED;f.title='Mapa – Kemp Krumlov (Mapy.cz)';f.loading='lazy';f.setAttribute('allowfullscreen','');w.appendChild(f);w.classList.add('on')}
if('IntersectionObserver'in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){load();io.disconnect()}},{rootMargin:'300px'});io.observe(w)}else load();
b.hidden=false;b.addEventListener('click',load)})();
;

/* ===== menu-aktivni.js ===== */
(function(){if(!('IntersectionObserver'in window))return;var L=[].slice.call(document.querySelectorAll('#menu a[href^="#"]')),M=[].slice.call(document.querySelectorAll('.mnav-l a[href^="#"]'));var map={};L.concat(M).forEach(function(a){var id=a.getAttribute('href').slice(1);(map[id]=map[id]||[]).push(a)});
var cur=null;function set(id){if(id===cur)return;cur=id;L.concat(M).forEach(function(a){var on=a.getAttribute('href')==='#'+id;a.classList.toggle('act',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
var vis={},alias={};var io=new IntersectionObserver(function(es){es.forEach(function(e){vis[e.target.id]=e.isIntersecting?e.intersectionRatio:0});var best=null,bv=0;Object.keys(vis).forEach(function(k){if(vis[k]>bv){bv=vis[k];best=k}});set(best&&alias[best]||best)},{rootMargin:'-35% 0px -55% 0px',threshold:[0,.01,.5,1]});
Object.keys(map).forEach(function(id){var el=document.getElementById(id);if(!el)return;if(el.offsetHeight<120){var sec=el.closest('section');if(sec){if(!sec.id)sec.id='sec-'+id;alias[sec.id]=id;el=sec}}io.observe(el)})})();
;
