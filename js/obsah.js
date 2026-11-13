/* Kemp Krumlov – použití obsahu z administrace na webu.
   Náhled: změny jsou uložené v tomto prohlížeči (localStorage / IndexedDB).
   Na serveru tento soubor nebude potřeba – texty, SEO i galerii vypíše rovnou server do HTML. */
(function(){
'use strict';
function get(k){try{var v=localStorage.getItem('kk.'+k);return v?JSON.parse(v):null}catch(e){return null}}
var BASE=(document.currentScript&&document.currentScript.src||'').replace(/js\/obsah\.js.*$/,'');

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
var L=window.KK_LANG||'cs';if(L!=='cs')pouzij(get('texty.'+L));

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
  var c=document.head.querySelector('link[rel=canonical]');if(c&&s.canonical)c.href=s.canonical;
  var u=document.head.querySelector('meta[property="og:url"]');if(u&&s.canonical)u.setAttribute('content',s.canonical);
  var ld=document.getElementById('ld-kemp');
  if(ld&&s.firma)try{var j=JSON.parse(ld.textContent),f=s.firma;j.name=f.nazev||j.name;j.telephone=f.telefon||j.telephone;j.email=f.email||j.email;j.priceRange=f.cenovaHladina||j.priceRange;if(s.canonical)j.url=s.canonical;
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
  var l=document.createElement('link');l.rel='stylesheet';l.href=BASE+'css/editace.css?v=4';document.head.appendChild(l);
  document.addEventListener('DOMContentLoaded',function(){nactiData().then(function(){return nactiSkript('js/editace.js?v=4')})});
}
})();
