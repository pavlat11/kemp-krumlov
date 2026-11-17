/* PE-LA – napojení webu půjčovny na společnou administraci (náhled bez serveru).
   Načítá se na stránkách test/pela/… (vygenerované z repozitáře PE-LA příkazem php nastroje/nahled.php).
   • texty upravené v administraci (kkt.pela.texty, kkt.pela.texty.en, …) – jen pro jazyk stránky
   • ceny ze SPOLEČNÉHO ceníku kempu (kkt.cenik) – lodě, návoz, doprava, ubytování v kempu
   • galerie z administrace (sekce Galerie při přepnutí na PE-LA)
   • SEO úvodní stránky, editační režim (?edit=1 pro přihlášeného správce)
   Na serveru (Laravel) tento soubor odpadne – texty, ceny i galerii vypíše rovnou server. */
(function(){
'use strict';
var L=window.KK_LANG_PEVNY||'cs',ROOT=window.KK_PELA_ROOT||'';
var BASE=(document.currentScript&&document.currentScript.src||'').replace(/js\/pela-web\.js.*$/,'');
function get(k){if(/^(texty|dtexty|ikony|obrazky|seo|galerie)(\.|$)/.test(k))k='pela.'+k;try{var v=localStorage.getItem('kkt.'+k);return v?JSON.parse(v):null}catch(e){return null}}
var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};

/* ---------- 1) ceny ze společného ceníku ---------- */
/* klíč PE-LA → [položka společného ceníku, sloupec]  (stejná mapa je v repozitáři PE-LA: inc/cenik-sdileny.php) */
var MAPA={kanoe_1den:['kanoe','a'],kanoe_vice:['kanoe','b'],raft4_1den:['raft4','a'],raft4_vice:['raft4','b'],raft6_1den:['raft6','a'],raft6_vice:['raft6','b'],
  raft8_1den:['raft8','a'],raft8_vice:['raft8','b'],baraka_1den:['baraka','a'],baraka_vice:['baraka','b'],
  doprava_vyssi_brod:['dop1','a'],doprava_rozmberk:['dop2','a'],doprava_nahorany:['dop3','a'],doprava_kemp_vltava:['dop4','a'],doprava_viking_piskarna:['dop5','a'],
  doprava_vltavan_spoli:['dop6','a'],doprava_centrum:['dop7','a'],doprava_zlata_koruna:['dop8','a'],doprava_borsov:['dop9','a'],
  navoz_1den_do10_a:['nav1','a'],navoz_1den_do10_b:['nav1','b'],navoz_1den_nad10_a:['nav2','a'],navoz_1den_nad10_b:['nav2','b'],
  navoz_vice_do10:['nav3','a'],navoz_vice_nad10:['nav4','a'],kemp_od:['os','min']};
var NB=' ';
function kurz(){var m=window.KKC&&KKC.data&&KKC.data.mena;return m&&+m.kurz||25}
function kc(k){var m=MAPA[k],p=m&&window.KKC&&KKC.p(m[0]);if(!p)return null;var a=+p.a||0,b=p.b==null||p.b===''?a:+p.b;return m[1]==='b'?b:m[1]==='min'?Math.min(a,b):a}
function cz(n){return Math.round(n).toLocaleString('cs-CZ').replace(/\s/g,NB)}
function eur(n){return String(Math.round(n/kurz()))}
function cena(klice){var v=klice.split(',').map(kc);if(v.some(function(x){return x==null}))return null;
  if(L==='en')return v.map(function(x){return '€'+eur(x)}).join(' / ');
  if(L==='de')return v.map(eur).join(' / ')+NB+'€';
  return v.map(cz).join(' / ')+NB+'Kč'}
/* značky {price:klic} v uložených textech → <span data-pc> */
function znacky(root){
  var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT),n,a=[];
  while((n=w.nextNode()))if(n.data.indexOf('{price:')>=0&&!(n.parentElement&&n.parentElement.closest('[contenteditable=true],script,style,textarea')))a.push(n);
  a.forEach(function(n){var f=document.createDocumentFragment(),pos=0,re=/\{price:([a-z0-9_,]+)\}/g,m;
    while((m=re.exec(n.data))){if(m.index>pos)f.appendChild(document.createTextNode(n.data.slice(pos,m.index)));var s=document.createElement('span');s.setAttribute('data-pc',m[1]);s.textContent=cena(m[1])||'?';f.appendChild(s);pos=re.lastIndex}
    if(pos<n.data.length)f.appendChild(document.createTextNode(n.data.slice(pos)));n.parentNode.replaceChild(f,n)});
}
function ceny(){znacky();$$('[data-pc]').forEach(function(el){var t=cena(el.getAttribute('data-pc'));if(t!=null&&el.textContent!==t)el.textContent=t})}

/* ---------- 2) texty z administrace (jen jazyk stránky; co není upravené, zůstane z šablony PE-LA) ---------- */
var T=get(L==='cs'?'texty':'texty.'+L);
if(T)Object.keys(T).forEach(function(k){$$('[data-t="'+k+'"]').forEach(function(el){el.innerHTML=T[k]})});
ceny();
/* po uložení v editačním režimu se text vrátí se značkami {price:…} → hned je překreslit */
if(window.MutationObserver)new MutationObserver(function(rs){if(rs.some(function(r){var t=r.target;return t&&(t.nodeType===3?t.data:t.textContent||'').indexOf('{price:')>=0}))ceny()}).observe(document.body,{childList:true,subtree:true,characterData:true});

/* ---------- 3) SEO úvodní stránky (česky) ---------- */
var S=get('seo');
if(S&&L==='cs'&&window.KK_PELA_STRANKA==='index'){
  var meta=function(attr,name,val){if(!val)return;var m=document.head.querySelector('meta['+attr+'="'+name+'"]');if(!m){m=document.createElement('meta');m.setAttribute(attr,name);document.head.appendChild(m)}m.setAttribute('content',val)};
  if(S.title)document.title=S.title;meta('name','description',S.description);
  meta('property','og:title',S.ogTitle||S.title);meta('property','og:description',S.ogDescription||S.description);
  if(S.googleVerify)meta('name','google-site-verification',S.googleVerify);
}

/* ---------- 4) galerie z administrace ---------- */
function nactiSkript(src){return new Promise(function(ok,no){var e=document.createElement('script');e.src=BASE+src;e.onload=ok;e.onerror=no;document.body.appendChild(e)})}
function nactiData(){return window.KK&&KK.galerie?Promise.resolve():nactiSkript('js/kk-data.js?v=15')}
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var gal=document.querySelector('#fotogalerie .gallery');
if(gal&&get('galerie'))nactiData().then(function(){return KK.galerie.seznam()}).then(function(f){
  f=f.filter(function(x){return x.viditelna!==false});if(!f.length)return;
  /* popisky původních fotek v jazyce stránky, předpona „Zvětšit:“ */
  var puv={},pred='';$$('.gitem',gal).forEach(function(b){var i=b.querySelector('img');if(!i)return;puv[b.getAttribute('data-full').replace(/^(\.\.\/)+/,'')]=i.alt;if(!pred)pred=(b.getAttribute('aria-label')||'').replace(i.alt,'')});
  gal.innerHTML=f.map(function(x,i){
    var web=!!x.src,mala=web?ROOT+x.src:KK.galerie.url(x,true),velka=web?ROOT+(x.full||x.src):KK.galerie.url(x),
      popis=web&&L!=='cs'&&puv[x.full||x.src]?puv[x.full||x.src]:x.popis||'';
    return '<button class="gitem'+(i>=12?' is-hidden':'')+'" data-full="'+esc(velka)+'" aria-label="'+esc(pred+popis)+'"><img src="'+esc(mala)+'" width="'+(x.w||720)+'" height="'+(x.h||540)+'" loading="lazy" decoding="async" alt="'+esc(popis)+'"><span class="zoom"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg></span></button>'}).join('');
  var more=document.querySelector('#fotogalerie .gallery-more');if(more&&f.length<=12)more.remove();
}).catch(function(){});

/* ---------- 5) editační režim: ?edit=1 a přihlášený uživatel s právem „Upravit web“ ---------- */
var ses=get('session');
var smiUpravit=function(){if(!ses||ses.do<=Date.now())return false;var u=(get('uzivatele')||[]).filter(function(x){return x.id===ses.id})[0];
  if(get('uzivatele')&&(!u||u.aktivni===false))return false;var role=u?u.role:ses.role;if(role==='admin')return true;
  var p=Object.assign({},(get('prava')||{})[role]||{},u&&u.prava||{});return p.pela_upravit!==0};
if(/[?&]edit(=1)?(&|$)/.test(location.search)&&smiUpravit()){
  var l=document.createElement('link');l.rel='stylesheet';l.href=BASE+'css/editace.css?v=9';document.head.appendChild(l);
  var spust=function(){nactiData().then(function(){return nactiSkript('js/editace.js?v=10')})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',spust);else spust();
}

window.KKPelaWeb={ceny:ceny,cena:cena};
})();
