/* Kemp Krumlov – administrace (náhled bez serveru). Data jdou přes ../js/kk-data.js */
(function(){
'use strict';
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var app=$('#app'),WEB='../';
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var txt=function(h){var d=document.createElement('div');d.innerHTML=h;return d.textContent.replace(/\s+/g,' ').trim()};
var pl=function(n,a,b,c){return n===1?a:n>=2&&n<=4?b:c};
var SV=function(p,s){return '<svg viewBox="0 0 24 24" width="'+(s||20)+'" height="'+(s||20)+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'};
var IC={
 uzivatele:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
 ucet:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
 zamek:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 fotky:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
 prehled:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
 upravit:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M11 13h6M11 16h4"/><path d="M6 13h2"/>',
 obsah:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 galerie:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 8"/>',
 seo:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 cenik:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
 rezervace:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',ubytovani:'<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5"/>',pujcovna:'<path d="M2 15c3.5 3.5 16.5 3.5 20 0M5 15l2.5-6h9L19 15M12 9V4"/>',doprava:'<path d="M2 16V7h12v9M14 10h4l4 4v2h-8"/><circle cx="6.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/>',
 lode:'<path d="M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2-1.5 4.5-1.5S19 17 21 17"/><path d="M5 13h14l-2-5H7z"/>',
 nastaveni:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 ven:'<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
 nahoru:'<path d="m15 18-6-6 6-6"/>',dolu:'<path d="m9 18 6-6-6-6"/>',
 oko:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 okoX:'<path d="M17.9 17.9A10 10 0 0 1 12 19c-6.5 0-10-7-10-7a18 18 0 0 1 5.1-5.9M9.9 5.2A9 9 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2M1 1l22 22"/>',
 kos:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
 upl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>'
};
var SEK={web:'Ostatní',hlavicka:'Hlavička a menu','menu-mobil':'Mobilní menu',top:'Úvod (hero)','kemp-v-cislech':'Kemp v číslech','o-kempu':'O kempu a Pro vodáky',ubytovani:'Ubytování',rezervace:'Rezervace',areal:'Mapa kempu',doprava:'Doprava osob',pela:'Půjčovna PE-LA',galerie:'Galerie',okoli:'Okolí',kontakt:'Kontakt',paticka:'Patička',lista:'Spodní lišta (mobil)'};
var toastT;function toast(m,err,akce){var t=$('#toast');t.textContent=m;if(akce){var b=document.createElement('button');b.type='button';b.textContent=akce.t;b.onclick=function(){t.className='toast';akce.fn()};t.appendChild(b)}t.className='toast on'+(err?' err':'')+(akce?' akc':'');clearTimeout(toastT);toastT=setTimeout(function(){t.className='toast'},akce?9000:3500)}
var cas=function(t){var d=new Date(t);return d.toLocaleDateString('cs-CZ',{day:'numeric',month:'numeric'})+' '+d.toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit'})};

/* ---------- zdrojové texty a fotky webu ---------- */
var ZDROJ=null;
function zdroj(){
  if(ZDROJ)return Promise.resolve(ZDROJ);
  return fetch(WEB+'index.html',{cache:'no-store'}).then(function(r){return r.text()}).then(function(h){
    var d=new DOMParser().parseFromString(h,'text/html'),texty=[],cen=0;
    $$('[data-t]',d).forEach(function(e){if(e.hasAttribute('data-cena')){cen++;return}var k=e.dataset.t;if(texty.some(function(x){return x.k===k}))return;texty.push({k:k,sek:k.split('.')[0],html:KK.cisti(e.innerHTML),tag:e.tagName.toLowerCase()})});
    var fotky=$$('#galerie .gl-i',d).map(function(f){var i=$('img',f);return{src:i.getAttribute('src'),popis:i.getAttribute('alt')||'',kat:f.dataset.c||'',w:+i.getAttribute('width')||1536,h:+i.getAttribute('height')||1024}});
    var img=$$('img',d),bezAlt=img.filter(function(i){return !i.hasAttribute('alt')}).length,h1=$$('h1',d).length;
    ZDROJ={texty:texty,ceny:cen,fotky:fotky,bezAlt:bezAlt,h1:h1,obrazky:img.length};return ZDROJ;
  });
}

/* ---------- přihlášení ---------- */
function login(){
  app.innerHTML='<div class="login"><form novalidate aria-labelledby="lt"><div class="logo"><i>'+SV(IC.lode,22)+'</i>Kemp Krumlov</div><h1 id="lt">Administrace</h1><p>Přihlaste se pro správu webu.</p>'+
   '<label class="f">Přihlašovací jméno nebo e-mail<input class="inp" name="u" autocomplete="username" required></label><br>'+
   '<label class="f">Heslo<input class="inp" name="p" type="password" autocomplete="current-password" required aria-describedby="lh"><small id="lh">První přihlášení v náhledu: <b>admin</b> / <b>kemp</b> – heslo si pak změňte.</small></label>'+
   '<p class="err-msg" role="alert" hidden></p><br><button class="btn pri" style="width:100%">Přihlásit se</button></form></div>';
  var f=$('form',app),er=$('.err-msg',app);
  f.addEventListener('submit',function(e){e.preventDefault();er.hidden=true;
    KK.auth.login(f.u.value.trim(),f.p.value).then(function(s){var j=KK.auth.meSync();if(j&&j.vychozi)history.replaceState(null,'','#'+(KK.auth.muze('uzivatele')?'uzivatele':'ucet'));shell(j||s)}).catch(function(x){er.textContent=x.message;er.hidden=false;f.p.setAttribute('aria-invalid','true');f.p.focus()})});
  f.u.focus();
}

/* ---------- jazyk úprav (čeština = originál, ostatní = překlad) ---------- */
function jazykAdm(){var j=KK.LS.get('admin-jazyk','cs');return KK.JAZYKY[j]?j:'cs'}
function jazykVolba(){var j=jazykAdm();return '<div class="row jz" role="group" aria-label="Jazyk úprav">'+Object.keys(KK.JAZYKY).map(function(k){return '<button type="button" class="btn sm gh" data-jz="'+k+'" aria-pressed="'+(k===j)+'">'+KK.JAZYKY[k]+'</button>'}).join('')+'</div>'}
function jazykKlik(m){$$('[data-jz]',m).forEach(function(b){b.addEventListener('click',function(){if(b.dataset.jz===jazykAdm())return;var jd=function(){KK.LS.set('admin-jazyk',b.dataset.jz);neulozeno=null;route()};if(neulozeno&&neulozeno())ptej('Máte neuložené změny\n\nKdyž přepnete jazyk, změny se neuloží.',{ok:'Přepnout bez uložení',ne:'Zůstat'}).then(function(a){if(a)jd()});else jd()})})}

/* ---------- kostra ---------- */
var VIEWS={upravit:upravit,prehled:prehled,galerie:galerie,seo:seo,cenik:cenik,rezervace:rezervace,ubytovani:rezervace,pujcovna:rezervace,doprava:rezervace,nastaveni:nastaveni,uzivatele:uzivatele,ucet:ucet};
var NAV=[['Web',[['prehled','Přehled'],['upravit','Upravit web'],['galerie','Galerie'],['seo','SEO']]],['Provoz',[['rezervace','Rezervace'],['ubytovani','Ubytování'],['pujcovna','Půjčovna lodí'],['doprava','Doprava'],['cenik','Ceník a kapacity']]],['Systém',[['uzivatele','Uživatelé']]]];
function shell(s){
  app.innerHTML='<div class="top"><div class="logo"><i>'+SV(IC.lode,20)+'</i>Administrace</div><button type="button" id="mb" aria-label="Otevřít menu" aria-expanded="false" aria-controls="side">'+SV(IC.menu,22)+'</button></div>'+
  '<div class="app"><nav class="side" id="side" aria-label="Administrace"><div class="logo"><i>'+SV(IC.lode,22)+'</i><span>Kemp Krumlov<small>Administrace</small></span></div>'+
  NAV.map(function(g){var pol=g[1].filter(function(n){return KK.auth.muze(n[0])});if(!pol.length)return '';return '<div class="nav-t">'+g[0]+'</div>'+pol.map(function(n){return '<a class="nv" href="#'+n[0]+'">'+SV(IC[n[0]],19)+n[1]+(n[2]?'<span class="soon">brzy</span>':'')+'</a>'}).join('')}).join('')+
  '<a class="nv" href="'+WEB+'" target="_blank" rel="noopener">'+SV(IC.ven,19)+'Zobrazit web</a>'+
  '<div class="who"><a href="#'+(KK.auth.muze('uzivatele')?'uzivatele':'ucet')+'" class="who-n" title="Můj účet a heslo"><b>'+esc(s.jmeno)+'</b><small>'+esc(KK.ROLE[s.role]||s.role)+'</small></a><button type="button" id="lo">Odhlásit</button></div></nav>'+
  '<main id="main" tabindex="-1"></main></div>';
  var side=$('#side'),mb=$('#mb'),scrim=null;
  function zavri(){side.classList.remove('open');mb.setAttribute('aria-expanded','false');if(scrim){scrim.remove();scrim=null}}
  mb.addEventListener('click',function(){side.classList.add('open');mb.setAttribute('aria-expanded','true');scrim=document.body.appendChild(Object.assign(document.createElement('div'),{className:'scrim'}));scrim.onclick=zavri;$('a',side).focus()});
  side.addEventListener('click',function(e){if(e.target.closest('a.nv'))zavri()});
  $('#lo').addEventListener('click',function(){odejit().then(function(a){if(a)KK.auth.logout().then(login)})});
  onhashchange=route;route();
}
var neulozeno=null;function odejit(){return !neulozeno||!neulozeno()?Promise.resolve(true):ptej('Máte neuložené změny\n\nKdyž odejdete, změny se neuloží.',{ok:'Odejít bez uložení',ne:'Zůstat'})}
/* hezké potvrzovací okno místo confirm(); vrací Promise<true|false>, s o.pole Promise<text|null> */
function ptej(txt,o){o=o||{};return new Promise(function(res){
  var p=String(txt).split('\n\n'),d=document.createElement('dialog'),hot=false;d.className='dlg ptj'+(o.nebezp?' nb':'');d.setAttribute('aria-labelledby','ptjh');
  d.innerHTML='<form method="dialog" novalidate><div class="ptj-i" aria-hidden="true">'+(o.nebezp?'!':'?')+'</div><h2 id="ptjh">'+esc(p[0])+'</h2>'+p.slice(1).map(function(x){return '<p>'+esc(x).replace(/\n/g,'<br>')+'</p>'}).join('')+
    (o.pole!=null?'<input class="inp" aria-labelledby="ptjh" value="'+esc(o.pole)+'" autocomplete="off">':'')+
    '<div class="ptj-b"><button type="button" class="btn gh" data-n>'+(o.ne||'Zrušit')+'</button><button type="submit" class="btn '+(o.nebezp?'dan2':'pri')+'">'+(o.ok||'Ano')+'</button></div></form>';
  document.body.appendChild(d);var inp=$('input',d);
  var konec=function(v){if(hot)return;hot=true;try{d.close()}catch(e){}d.remove();res(v)};
  $('[data-n]',d).addEventListener('click',function(){konec(o.pole!=null?null:false)});
  $('form',d).addEventListener('submit',function(e){e.preventDefault();konec(o.pole!=null?inp.value:true)});
  d.addEventListener('cancel',function(e){e.preventDefault();konec(o.pole!=null?null:false)});
  d.addEventListener('click',function(e){if(e.target===d)konec(o.pole!=null?null:false)});
  d.showModal();(inp||$(o.nebezp?'[data-n]':'[type=submit]',d)).focus();if(inp)inp.select()})}
/* dialog s počty kusů: pol=[[klíč,název,výchozí,max,popisek]] → Promise({klíč:počet}|null) */
function pocty(nad,txt,pol,ok){return new Promise(function(res){
  var d=document.createElement('dialog'),hot=false;d.className='dlg ptj pct';d.setAttribute('aria-labelledby','pcth');
  d.innerHTML='<form method="dialog" novalidate><h2 id="pcth">'+esc(nad)+'</h2>'+(txt?'<p>'+esc(txt)+'</p>':'')+'<div class="pct-g">'+pol.map(function(x){return '<label class="pct-r"><span><b>'+esc(x[1])+'</b>'+(x[4]?'<small>'+esc(x[4])+'</small>':'')+'</span><span class="pct-s"><button type="button" data-d="-1" aria-label="Méně – '+esc(x[1])+'">−</button><input class="inp" type="number" min="0" max="'+x[3]+'" inputmode="numeric" name="'+x[0]+'" value="'+x[2]+'"><button type="button" data-d="1" aria-label="Více – '+esc(x[1])+'">+</button><small>z '+x[3]+'</small></span></label>'}).join('')+'</div>'+
    '<div class="pct-q"><button type="button" class="btn sm gh" data-q="max">Vše</button><button type="button" class="btn sm gh" data-q="0">Nic</button></div><p class="pct-e" role="alert"></p>'+
    '<div class="ptj-b"><button type="button" class="btn gh" data-n>Zrušit</button><button type="submit" class="btn pri">'+esc(ok||'Uložit')+'</button></div></form>';
  document.body.appendChild(d);var f=$('form',d);
  var konec=function(v){if(hot)return;hot=true;try{d.close()}catch(e){}d.remove();res(v)};
  d.addEventListener('click',function(e){var b=e.target.closest('button');if(e.target===d){konec(null);return}if(!b)return;
    if(b.dataset.d){var i=b.parentNode.querySelector('input');i.value=Math.max(0,Math.min(+i.max,(+i.value||0)+(+b.dataset.d)))}
    if(b.dataset.q)$$('input',f).forEach(function(i){i.value=b.dataset.q==='max'?i.max:0});
    if(b.hasAttribute('data-n'))konec(null)});
  f.addEventListener('submit',function(e){e.preventDefault();var o={},n=0,zle=null;$$('input',f).forEach(function(i){var v=Math.round(+i.value||0);if(v<0||v>+i.max)zle=zle||i;o[i.name]=v;n+=v});
    if(zle){$('.pct-e',f).textContent='Počet nemůže být větší než '+zle.max+'.';zle.focus();return}if(!n){$('.pct-e',f).textContent='Zadejte aspoň jeden kus.';return}konec(o)});
  d.addEventListener('cancel',function(e){e.preventDefault();konec(null)});
  d.showModal();var p0=$('input',f);if(p0){p0.focus();p0.select()}})}
var predHash=null;
function route(){
  var v=(location.hash.slice(1)||'prehled').split('/')[0];if(!VIEWS[v])v='prehled';
  var ja=KK.auth.meSync();if(!ja){onhashchange=null;login();return}
  if(!KK.auth.muze(v)){var prvni=['prehled','upravit','galerie','ucet'].filter(function(x){return KK.auth.muze(x)})[0]||'ucet';if(v!==prvni){toast('Do sekce „'+(KK.SEKCE[v]||v)+'“ nemáte přístup.',1);location.replace('#'+prvni);return}}
  if(predHash&&predHash!==location.hash&&neulozeno&&neulozeno()){var cilH=location.hash;history.replaceState(null,'',predHash);odejit().then(function(a){if(a){neulozeno=null;location.hash=cilH}});return}
  predHash=location.hash||'#prehled';neulozeno=null;
  $$('.side a.nv').forEach(function(a){if(a.getAttribute('href')==='#'+v)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  var st=$('#main'),m=st.cloneNode(false);st.replaceWith(m);m.innerHTML='<p class="mut">Načítám…</p>';KK.JAZYK='cs';
  Promise.resolve(VIEWS[v](m,v)).then(function(){var h=$('h1',m);if(h){h.tabIndex=-1;h.focus({preventScroll:true})}document.title=(h?h.textContent+' · ':'')+'Administrace · Kemp Krumlov';scrollTo(0,0)});
}
addEventListener('beforeunload',function(e){if(neulozeno&&neulozeno()){e.preventDefault();e.returnValue=''}});


/* ---------- UPRAVIT WEB (stránka přímo v administraci) ---------- */
function upravit(m){
  var sir={pc:'100%',tab:'820px',mob:'390px'},J=jazykAdm(),LQ='&lang='+J;
  m.innerHTML='<div class="ph" style="margin-bottom:12px"><div><h1>Upravit web</h1><p>Klikněte na text, fotku nebo ikonu a upravte je. Tlačítkem Procházet vypnete úpravy a můžete na webu normálně klikat (kroky rezervace, místa na mapě).</p></div>'+
  '<div class="row" role="group" aria-label="Velikost náhledu"><button type="button" class="btn sm gh" data-w="pc" aria-pressed="true">Počítač</button><button type="button" class="btn sm gh" data-w="tab" aria-pressed="false">Tablet</button><button type="button" class="btn sm gh" data-w="mob" aria-pressed="false">Mobil</button>'+
  '<a class="btn sm gh" href="'+WEB+'?edit=1'+LQ+'" target="_blank" rel="noopener">Nová záložka '+SV(IC.ven,14)+'</a></div></div>'+
  '<div class="row" style="margin:-4px 0 12px;gap:12px;flex-wrap:wrap">'+jazykVolba()+(J!=='cs'?'<span class="mut">Upravujete překlad – klikněte na český text a napište '+(J==='en'?'anglický':'německý')+'. Co nepřeložíte, zůstane česky.</span>':'')+'</div>'+
  '<div class="frame"><iframe id="wf" title="Web Kemp Krumlov v editačním režimu" src="'+WEB+'index.html?edit=1'+LQ+'"></iframe></div>';jazykKlik(m);
  /* jazyk přepnutý přímo v náhledu → srovnat tlačítka */
  $('#wf').addEventListener('load',function(){try{var jw=this.contentWindow.KK_LANG;if(jw&&jw!==jazykAdm()){KK.LS.set('admin-jazyk',jw);$$('[data-jz]',m).forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.jz===jw))})}}catch(e){}});
  var f=$('#wf');
  neulozeno=function(){try{return !!(f.contentWindow.KKE&&f.contentWindow.KKE.neulozeno())}catch(e){return false}};
  $$('[data-w]',m).forEach(function(b){b.addEventListener('click',function(){$$('[data-w]',m).forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});f.style.width=sir[b.dataset.w]})});
}

/* ---------- PŘEHLED ---------- */
function prehled(m){
  return Promise.all([zdroj(),KK.galerie.aktivni()?KK.galerie.seznam():Promise.resolve(null)]).then(function(r){
    var z=r[0],f=r[1]||z.fotky,ch=seoKontrola(KK.seo.nactiSync(),z),okN=ch.filter(function(x){return x[0]==='ok'}).length,h=KK.historie(),jaP=KK.auth.meSync();
    /* REZ_ODKAZY: rezervace se zatím nikde neodkazují (jen přímá adresa #rezervace); pro zapnutí přepnout na true */
    var REZ_ODKAZY=true,R=window.KKR,rez=R&&KK.auth.muze('rezervace'),D0=function(x){var d=new Date(x+'T12:00:00');return d},ISO=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)},
      nd=new Date(),dnes=ISO(nd),DL=['neděle','pondělí','úterý','středa','čtvrtek','pátek','sobota'],DK=['Ne','Po','Út','St','Čt','Pá','So'],MG=['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'];
    var kc=function(n){return Math.round(n).toLocaleString('cs-CZ').replace(/\s/g,' ')+' Kč'};
    var h1='<div class="ph"><div><h1>Dobrý den, '+esc(jaP?jaP.jmeno.split(' ')[0]:'')+'</h1><p>Dnes je '+DL[nd.getDay()]+' '+nd.getDate()+'. '+MG[nd.getMonth()]+' '+nd.getFullYear()+'.</p></div><div class="row">'+
      (REZ_ODKAZY&&rez?'<a class="btn pri" href="#rezervace" data-rn>+ Nová rezervace</a>':'')+'<a class="btn" href="#upravit">'+SV(IC.obsah,18)+'Upravit web</a></div></div>';
    var hes=jaP&&jaP.vychozi?'':'';
    var prov='';
    if(rez){
      R.auto(dnes);
      var A=R.vse().filter(function(x){return x.stav!=='zru'}),H=A.filter(function(x){return x.stav!=='blk'}),vyp=R.vyp();
      var mista=[].concat.apply([],R.SKUPINY.filter(function(g){return R.rezTyp(g.k)}).map(function(g){return g.c.map(function(c){return g.k+'-'+c})})).filter(function(k){return vyp.indexOf(k)<0});
      var obs=function(den){var u={};A.forEach(function(x){if(x.od<=den&&den<x.do)(x.mista||[]).forEach(function(k){u[k]=1})});return mista.filter(function(k){return u[k]}).length};
      var typ=function(t,den){var u={};A.forEach(function(x){if(x.od<=den&&den<x.do)(x.mista||[]).forEach(function(k){u[k]=1})});var L=mista.filter(function(k){return k.split('-')[0]===t});return [L.filter(function(k){return u[k]}).length,L.length]};
      var pri=H.filter(function(x){return x.od===dnes&&x.stav!=='uby'&&x.stav!=='odj'}).length,odj=H.filter(function(x){return x.do===dnes&&x.stav!=='odj'}).length,pop=H.filter(function(x){return x.stav==='pop'}).length,tu=H.filter(function(x){return x.stav==='uby'}).reduce(function(a,x){var o=x.osoby||{};return a+(o.dosp||0)+(o.dite||0)+(o.zak||0)},0);
      var o0=obs(dnes),proc=mista.length?Math.round(o0/mista.length*100):0;
      var tt=[['chatka','Chatky'],['podsad','Podsad. stany'],['teepee','Teepee']].filter(function(t){return R.rezTyp(t[0])}).map(function(t){var x=typ(t[0],dnes);return x[1]?'<span>'+t[1]+' <b>'+x[0]+'/'+x[1]+'</b></span>':''}).join('');
      var TG=REZ_ODKAZY?'a':'div',HR=REZ_ODKAZY?' href="#rezervace"':'';
      var dlz=function(t,dl){return ' data-pv="'+t+'"'+(dl!=null?' data-pvd="'+dl+'"':'')};
      prov='<div class="pv-k">'+
        '<'+TG+' class="card pv-s pv-big"'+HR+dlz('dnes')+'><small>Obsazeno dnes</small><b>'+proc+' %</b><i class="pv-m"><i style="width:'+proc+'%"></i></i><span class="pv-t">'+tt+'</span></'+TG+'>'+
        '<'+TG+' class="card pv-s"'+HR+dlz('dnes')+'><small>Přijíždí dnes</small><b>'+pri+'</b><span>'+(pri?pl(pri,'rezervace čeká','rezervace čekají','rezervací čeká')+' na ubytování':'nikdo')+'</span></'+TG+'>'+
        '<'+TG+' class="card pv-s"'+HR+dlz('dnes')+'><small>Odjíždí dnes</small><b>'+odj+'</b><span>'+(odj?'k odhlášení':'nikdo')+'</span></'+TG+'>'+
        '<'+TG+' class="card pv-s'+(pop?' pv-a':'')+'"'+HR+dlz('dnes')+'><small>Poptávky k potvrzení</small><b>'+pop+'</b><span>'+(pop?'čekají na vaši odpověď':'vše vyřízeno')+'</span></'+TG+'>'+
        '<div class="card pv-s"><small>V kempu teď</small><b>'+tu+'</b><span>'+pl(tu,'ubytovaný host','ubytovaní hosté','ubytovaných hostů')+'</span></div></div>';
      var dny=[],i;for(i=0;i<14;i++){var d=new Date(nd.getFullYear(),nd.getMonth(),nd.getDate()+i,12);dny.push(d)}
      var graf='<div class="card pv-g"><div class="pv-gh"><h2>Obsazenost na 14 dní</h2>'+(REZ_ODKAZY?'<a href="#rezervace"'+dlz('kal')+'>Otevřít kalendář →</a>':'')+'</div><div class="pv-b">'+dny.map(function(d){var x=obs(ISO(d)),p=mista.length?Math.round(x/mista.length*100):0,we=d.getDay()%6===0;return '<div class="pv-c'+(we?' we':'')+(ISO(d)===dnes?' tod':'')+'" title="'+d.getDate()+'. '+(d.getMonth()+1)+'.: obsazeno '+x+' z '+mista.length+' míst"><span class="pv-p">'+p+'</span><i style="height:'+Math.max(2,p)+'%" class="'+(p>=90?'pl':p>=60?'st':'')+'"></i><small>'+DK[d.getDay()]+'<br>'+d.getDate()+'.</small></div>'}).join('')+'</div><p class="mut pv-lg">Procento obsazených chatek, podsadových stanů a teepee na noc.</p></div>';
      var rok=nd.getFullYear(),sez=function(y){var L=H.filter(function(x){return x.od.slice(0,4)===String(y)}),n=0,c=0;L.forEach(function(x){n+=Math.round((D0(x.do)-D0(x.od))/864e5);c+=+x.cena||0});return [L.length,n,c]};
      var s1=sez(rok),s2=sez(rok+1),nov=H.filter(function(x){return x.zdroj==='web'&&x.vytvoreno&&Date.now()-x.vytvoreno<7*864e5}).length;
      var sz='<div class="card pv-z"><h2>Sezóna v číslech</h2><table class="pv-zt"><thead><tr><th></th><th>'+rok+'</th><th>'+(rok+1)+'</th></tr></thead><tbody>'+
        '<tr><th>Rezervací</th><td>'+s1[0]+'</td><td>'+s2[0]+'</td></tr><tr><th>Nocí celkem</th><td>'+s1[1]+'</td><td>'+s2[1]+'</td></tr><tr><th>Za ubytování</th><td>'+kc(s1[2])+'</td><td>'+kc(s2[2])+'</td></tr></tbody></table>'+
        '<p class="mut pv-lg">Bez zrušených rezervací a blokací. Za posledních 7 dní přišlo z webu '+nov+' '+pl(nov,'nová rezervace','nové rezervace','nových rezervací')+'.</p></div>';
      prov+='<div class="grid pv-r">'+graf+sz+'</div>';
    }
    var web='<div class="card"><h2>Stav webu</h2><ul class="pv-l">'+
      '<li class="'+(okN===ch.length?'ok':'warn')+'"><a href="#seo"><b>SEO</b><span>'+(okN===ch.length?'Vše v pořádku':(ch.length-okN)+' '+pl(ch.length-okN,'věc k doplnění','věci k doplnění','věcí k doplnění'))+'</span></a></li>'+
      '<li class="ok"><a href="#galerie"><b>Galerie</b><span>'+f.length+' '+pl(f.length,'fotka','fotky','fotek')+'</span></a></li>'+
      '<li class="'+(jaP&&jaP.vychozi?'warn':'ok')+'"><a href="#'+(KK.auth.muze('uzivatele')?'uzivatele':'ucet')+'"><b>Heslo</b><span>'+(jaP&&jaP.vychozi?'Výchozí – změňte ho':'Nastavené')+'</span></a></li>'+
      '<li class="ok"><a href="'+WEB+'index.html" target="_blank" rel="noopener"><b>Web</b><span>Otevřít v novém okně ↗</span></a></li></ul></div>';
    var hi='<div class="card"><h2>Poslední změny</h2>'+(h.length?'<ul class="hist">'+h.slice(0,6).map(function(x){return '<li><time>'+cas(x.kdy)+'</time><span><b>'+esc(x.co)+'</b> – '+esc(x.popis)+'</span></li>'}).join('')+'</ul>':'<p class="mut">Zatím žádné změny.</p>')+'</div>';
    m.innerHTML=hes+h1+prov+hi;
    m.addEventListener('click',function(e){var a=e.target.closest('[data-pv],[data-rn]');if(!a)return;if(a.dataset.pv){KK.LS.set('rez.tab.ubytovani',a.dataset.pv);if(a.tagName==='A'){e.preventDefault();location.hash='#ubytovani'}}if(a.hasAttribute('data-rn'))sessionStorage.setItem('kkt.rez.nova','1')});
  });
}

/* ---------- OBSAH ---------- */
/* ---------- GALERIE ---------- */
function galerie(m){
  var urls=[];function u(f,n){if(f.src)return WEB+f.src;var x=KK.galerie.url(f,n);urls.push(x);return x}
  return zdroj().then(function(z){return KK.galerie.aktivni()?KK.galerie.seznam():KK.galerie.zalozZWebu(z.fotky)}).then(function(fotky){
    var vyber={};
    m.innerHTML='<div class="ph"><div><h1>Galerie</h1><p>Nahrajte více fotek najednou, upravte popisky a kategorie a přetažením změňte pořadí. Prvních 9 fotek vidí návštěvník hned, ostatní po kliknutí na „Zobrazit další fotky“.</p></div><a class="btn gh" href="'+WEB+'#galerie" target="_blank" rel="noopener">Zobrazit na webu '+SV(IC.ven,16)+'</a></div>'+
    '<div class="drop" id="dz" tabindex="0" role="button" aria-describedby="dzh">'+SV(IC.upl,34)+'<b>Přetáhněte sem fotky</b><span class="mut" id="dzh">nebo je vyberte z počítače či telefonu · JPG, PNG, WebP · fotky se automaticky zmenší a převedou do WebP</span>'+
    '<div class="row"><label class="row" style="font-weight:600" for="dk">Kategorie nových fotek</label><select id="dk" class="inp" style="width:auto;min-height:40px">'+katOpts('')+'</select><button type="button" class="btn pri sm" id="dv">Vybrat fotky</button></div>'+
    '<input type="file" id="df" accept="image/*" multiple hidden></div><ul class="up-list" id="ul" aria-live="polite"></ul>'+
    '<div class="gtools"><label class="row" style="font-weight:600"><input type="checkbox" id="ga" style="width:18px;height:18px;accent-color:#f4a64a"> Vybrat vše</label><span id="gs" class="mut"></span><span class="sp"></span>'+
    '<span class="row" id="gb" hidden><label class="sr" for="gk">Změnit kategorii vybraných</label><select id="gk" class="inp" style="width:auto;min-height:36px"><option value="-">Změnit kategorii…</option>'+katOpts(null)+'</select><button type="button" class="btn sm gh" data-h="0">Skrýt</button><button type="button" class="btn sm gh" data-h="1">Zobrazit</button><button type="button" class="btn sm dan" id="gd">Smazat</button></span></div>'+
    '<div class="ggrid" id="gg" role="list"></div>';
    var gg=$('#gg'),df=$('#df'),dz=$('#dz');
    function katOpts(sel){return (sel===null?'':'')+'<option value=""'+(sel===''?' selected':'')+'>Bez kategorie</option>'+Object.keys(KK.KATEGORIE).map(function(k){return '<option value="'+k+'"'+(sel===k?' selected':'')+'>'+KK.KATEGORIE[k]+'</option>'}).join('')}
    function kresli(){
      urls.forEach(function(x){if(x.indexOf('blob:')===0)URL.revokeObjectURL(x)});urls=[];var vis=0;
      gg.innerHTML=fotky.map(function(f,i){var on=f.viditelna!==false;if(on)vis++;var p=on?vis:0;
        return '<div class="gc'+(on?'':' hid')+(vyber[f.id]?' sel':'')+'" role="listitem" draggable="true" data-id="'+f.id+'"><div class="im" style="background-image:url(\''+esc(u(f,true))+'\')">'+
        '<span class="n'+(on&&p<=9?' first':'')+'">'+(on?p:'skrytá')+'</span><label title="Vybrat"><input type="checkbox" data-a="sel"'+(vyber[f.id]?' checked':'')+' aria-label="Vybrat fotku '+(i+1)+'"></label>'+(on?'':'<span class="badge hb">Skrytá na webu</span>')+'</div>'+
        '<div class="bd"><label class="sr" for="p'+f.id+'">Popisek</label><input class="inp" id="p'+f.id+'" data-a="popis" value="'+esc(f.popis)+'" placeholder="Popisek fotky (pro nevidomé i Google)">'+
        '<label class="sr" for="k'+f.id+'">Kategorie</label><select class="inp" id="k'+f.id+'" data-a="kat">'+katOpts(f.kat||'')+'</select>'+
        '<div class="row"><button type="button" class="btn ic gh" data-a="vl" aria-label="Posunout dopředu"'+(i?'':' disabled')+'>'+SV(IC.nahoru,18)+'</button><button type="button" class="btn ic gh" data-a="vp" aria-label="Posunout dozadu"'+(i<fotky.length-1?'':' disabled')+'>'+SV(IC.dolu,18)+'</button><span class="sp"></span>'+
        '<button type="button" class="btn ic gh" data-a="viz" aria-label="'+(on?'Skrýt na webu':'Zobrazit na webu')+'" title="'+(on?'Skrýt na webu':'Zobrazit na webu')+'">'+SV(on?IC.oko:IC.okoX,18)+'</button><button type="button" class="btn ic dan" data-a="del" aria-label="Smazat fotku">'+SV(IC.kos,18)+'</button></div>'+
        (f.velikost?'<small class="mut">'+f.w+'×'+f.h+' · '+Math.round(f.velikost/1024)+' kB'+(f.puvodni?' (z '+Math.round(f.puvodni/1024)+' kB)':'')+'</small>':'')+'</div></div>'}).join('')||'<div class="empty card">Galerie je prázdná – nahrajte první fotky.</div>';
      var n=Object.keys(vyber).length;$('#gb').hidden=!n;$('#gs').textContent=n?n+' '+pl(n,'vybraná','vybrané','vybraných'):fotky.length+' '+pl(fotky.length,'fotka','fotky','fotek')+' · '+vis+' na webu';
      $('#ga').checked=n&&n===fotky.length;
    }
    function uloz_poradi(){fotky.forEach(function(f,i){f.poradi=i});return KK.galerie.poradi(fotky.map(function(f){return f.id}))}
    function id(e){var c=e.target.closest('.gc');return c&&c.dataset.id}
    function F(i){return fotky.find(function(f){return f.id===i})}
    gg.addEventListener('change',function(e){var i=id(e),a=e.target.dataset.a;if(!i)return;
      if(a==='sel'){if(e.target.checked)vyber[i]=1;else delete vyber[i];kresli();return}
      if(a==='popis'||a==='kat'){var z={};z[a]=e.target.value;Object.assign(F(i),z);KK.galerie.uprav(i,z).then(function(){toast(a==='popis'?'Popisek uložen.':'Kategorie uložena.')})}});
    gg.addEventListener('click',function(e){var b=e.target.closest('button[data-a]');if(!b)return;var i=id(e),ix=fotky.findIndex(function(f){return f.id===i}),a=b.dataset.a;
      if(a==='vl'||a==='vp'){var j=ix+(a==='vl'?-1:1);var t=fotky[ix];fotky[ix]=fotky[j];fotky[j]=t;uloz_poradi().then(function(){kresli();var nb=$('.gc[data-id="'+i+'"] [data-a="'+a+'"]');if(nb&&!nb.disabled)nb.focus();else{nb=$('.gc[data-id="'+i+'"] input');if(nb)nb.focus()}})}
      if(a==='viz'){var f=fotky[ix];f.viditelna=f.viditelna===false;KK.galerie.uprav(i,{viditelna:f.viditelna}).then(function(){kresli();toast(f.viditelna?'Fotka je zase na webu.':'Fotka je skrytá na webu.')})}
      if(a==='del')ptej('Smazat tuto fotku?\n\nZmizí z galerie na webu. Nejde to vrátit.',{ok:'Smazat',nebezp:1}).then(function(ok){if(!ok)return;KK.galerie.smaz([i]).then(function(){var fx=fotky.findIndex(function(x){return x.id===i});if(fx>=0)fotky.splice(fx,1);delete vyber[i];return uloz_poradi()}).then(function(){kresli();toast('Fotka smazána.')})})
    });
    /* přetahování pořadí */
    var dragId=null;
    gg.addEventListener('dragstart',function(e){var c=e.target.closest('.gc');if(!c)return;dragId=c.dataset.id;c.classList.add('drag');e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',dragId)}catch(x){}});
    gg.addEventListener('dragend',function(){dragId=null;$$('.gc',gg).forEach(function(c){c.classList.remove('drag','over')})});
    gg.addEventListener('dragover',function(e){if(!dragId)return;var c=e.target.closest('.gc');if(!c)return;e.preventDefault();$$('.gc.over',gg).forEach(function(x){if(x!==c)x.classList.remove('over')});c.classList.add('over')});
    gg.addEventListener('drop',function(e){if(!dragId)return;e.preventDefault();var c=e.target.closest('.gc');if(!c||c.dataset.id===dragId)return;
      var from=fotky.findIndex(function(f){return f.id===dragId}),to=fotky.findIndex(function(f){return f.id===c.dataset.id});var x=fotky.splice(from,1)[0];fotky.splice(to,0,x);uloz_poradi().then(function(){kresli();toast('Pořadí uloženo.')})});
    /* hromadné akce */
    $('#ga').addEventListener('change',function(e){vyber={};if(e.target.checked)fotky.forEach(function(f){vyber[f.id]=1});kresli()});
    $('#gk').addEventListener('change',function(e){var k=e.target.value;if(k==='-')return;var ids=Object.keys(vyber);Promise.all(ids.map(function(i){F(i).kat=k;return KK.galerie.uprav(i,{kat:k})})).then(function(){toast('Kategorie změněna u '+ids.length+' '+pl(ids.length,'fotky','fotek','fotek')+'.');e.target.value='-';kresli()})});
    $$('#gb [data-h]').forEach(function(b){b.addEventListener('click',function(){var v=b.dataset.h==='1',ids=Object.keys(vyber);Promise.all(ids.map(function(i){F(i).viditelna=v;return KK.galerie.uprav(i,{viditelna:v})})).then(function(){toast(v?'Fotky jsou na webu.':'Fotky jsou skryté.');kresli()})})});
    $('#gd').addEventListener('click',function(){var ids=Object.keys(vyber);ptej('Smazat '+ids.length+' '+pl(ids.length,'fotku','fotky','fotek')+'?\n\nZmizí z galerie na webu. Nejde to vrátit.',{ok:'Smazat',nebezp:1}).then(function(ok){if(!ok)return;KK.galerie.smaz(ids).then(function(){fotky=fotky.filter(function(f){return !vyber[f.id]});vyber={};return uloz_poradi()}).then(function(){kresli();toast('Smazáno.')})})});
    /* nahrávání */
    function nahraj(list){
      list=[].slice.call(list).filter(function(f){return /^image\//.test(f.type)||/\.(jpe?g|png|webp|gif|heic)$/i.test(f.name)});if(!list.length){toast('Vyberte prosím obrázky.',1);return}
      var ul=$('#ul');ul.innerHTML=list.map(function(f,i){return '<li data-i="'+i+'"><span style="min-width:0;flex:0 1 240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(f.name)+'</span><span class="pb"><i></i></span><span class="st">čeká</span></li>'}).join('');
      KK.galerie.pridej(list,$('#dk').value,function(i,s,x){var li=$('li[data-i="'+i+'"]',ul);if(!li)return;
        if(s==='zpracovava'){$('i',li).style.width='60%';$('.st',li).textContent='zmenšuji…'}
        if(s==='hotovo'){li.className='ok';$('.st',li).textContent='hotovo · '+Math.round(x.velikost/1024)+' kB'}
        if(s==='chyba'){li.className='err';$('.st',li).textContent=x&&x.message||'chyba'}})
      .then(function(nove){return KK.galerie.seznam().then(function(a){fotky=a;kresli();toast('Nahráno '+nove.length+' z '+list.length+' '+pl(list.length,'fotky','fotek','fotek')+'.',nove.length<list.length)})});
    }
    $('#dv').addEventListener('click',function(e){e.stopPropagation();df.click()});
    $('#dk').addEventListener('click',function(e){e.stopPropagation()});
    dz.addEventListener('click',function(e){if(e.target===dz||e.target.closest('b,svg,#dzh'))df.click()});
    dz.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target===dz){e.preventDefault();df.click()}});
    df.addEventListener('change',function(){nahraj(df.files);df.value=''});
    ['dragenter','dragover'].forEach(function(t){dz.addEventListener(t,function(e){if(dragId)return;e.preventDefault();dz.classList.add('over')})});
    ['dragleave','drop'].forEach(function(t){dz.addEventListener(t,function(){dz.classList.remove('over')})});
    dz.addEventListener('drop',function(e){if(dragId)return;e.preventDefault();nahraj(e.dataTransfer.files)});
    kresli();
  });
}

/* ---------- SEO ---------- */
function seoKontrola(s,z){
  var L=function(t){return(t||'').length},r=[];
  var tl=L(s.title);r.push([tl>=30&&tl<=60?'ok':tl&&tl<=70?'warn':'err','Titulek má '+tl+' znaků (ideál 30–60).']);
  var dl=L(s.description);r.push([dl>=70&&dl<=160?'ok':dl&&dl<=180?'warn':'err','Popis má '+dl+' znaků (ideál 70–160).']);
  r.push([/krumlov/i.test(s.title)?'ok':'warn','Titulek '+(/krumlov/i.test(s.title)?'obsahuje':'neobsahuje')+' slovo „Krumlov“.']);
  r.push([/^https:\/\//.test(s.canonical)?'ok':'err','Kanonická adresa '+(/^https:\/\//.test(s.canonical)?'je zadaná s https.':'chybí nebo není https.')]);
  r.push([s.ogImage?'ok':'warn','Obrázek pro sdílení '+(s.ogImage?'je vybraný.':'chybí.')]);
  r.push([s.index!==false?'ok':'err',s.index!==false?'Web je povolený k indexování.':'Web je skrytý před vyhledávači!']);
  if(z){r.push([z.h1===1?'ok':'warn','Stránka má '+z.h1+' hlavní nadpis (H1).']);r.push([z.bezAlt?'warn':'ok',z.bezAlt?z.bezAlt+' obrázků nemá popisek (alt).':'Všechny obrázky mají popisek (alt).'])}
  r.push([s.firma.telefon&&s.firma.ulice?'ok':'warn','Údaje o kempu pro Google (adresa, telefon) '+(s.firma.telefon&&s.firma.ulice?'jsou vyplněné.':'chybí.')]);
  return r;
}
function seo(m){
  return Promise.all([zdroj(),KK.galerie.aktivni()?KK.galerie.seznam():Promise.resolve([])]).then(function(r){
    var z=r[0],s=KK.seo.nactiSync(),zm=false;neulozeno=function(){return zm};
    var obr=(r[1].length?r[1].filter(function(f){return f.src}):z.fotky).map(function(f){return f.src});
    var F=function(n,lab,pom,typ,max){return '<label class="f">'+lab+(pom?'<small>'+pom+'</small>':'')+(typ==='ta'?'<textarea class="inp" name="'+n+'" rows="3"></textarea>':'<input class="inp" name="'+n+'"'+(typ?' type="'+typ+'"':'')+'>')+(max?'<span class="cnt" data-c="'+n+'" data-max="'+max+'"></span>':'')+'</label>'};
    m.innerHTML='<div class="ph"><div><h1>SEO</h1><p>Jak se web zobrazí ve vyhledávání Googlu a při sdílení na Facebooku či WhatsAppu. Na serveru se tyto údaje zapíšou přímo do stránky.</p></div></div>'+
    '<form id="sf" class="grid g2" novalidate><div class="grid" style="align-content:start">'+
    '<div class="card"><h2>Vyhledávání</h2><p class="mut">Titulek a popis, které uvidí lidé v Googlu.</p><div class="grid">'+F('title','Titulek stránky','Co nejvýstižněji, důležitá slova na začátek.','',60)+F('description','Popis stránky','Krátké shrnutí, které láká ke kliknutí.','ta',160)+F('keywords','Klíčová slova','Oddělte čárkou. Slova a fráze, podle kterých vás mají lidé najít.','ta')+'<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:-4px"><button type="button" class="btn sm gh" id="kwn">Doplnit návrh</button><span class="mut" id="kwc" style="font-size:12.5px"></span></div>'+F('canonical','Hlavní adresa webu','Adresa, pod kterou má Google web vést.','url')+
    '<label class="row" style="font-weight:700"><input type="checkbox" name="index" style="width:20px;height:20px;accent-color:#f4a64a"> Povolit zobrazení ve vyhledávačích</label></div></div>'+
    '<div class="card"><h2>Sdílení na sociálních sítích</h2><p class="mut">Když nevyplníte, použije se titulek a popis z vyhledávání.</p><div class="grid">'+F('ogTitle','Titulek při sdílení','','',70)+F('ogDescription','Popis při sdílení','','ta',200)+
    '<div><b style="font-size:14px">Obrázek při sdílení</b><div class="ogpick" role="group" aria-label="Obrázek při sdílení">'+obr.map(function(o){return '<button type="button" data-og="'+esc(o)+'" style="background-image:url(\''+esc(WEB+o)+'\')" aria-label="'+esc(o)+'"></button>'}).join('')+'</div></div></div></div>'+
    '<div class="card"><h2>Údaje o kempu pro Google</h2><p class="mut">Google z nich ukazuje adresu, telefon a polohu na mapě (strukturovaná data).</p><div class="grid g2" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">'+
    F('f.nazev','Název')+F('f.telefon','Telefon','','tel')+F('f.email','E-mail','','email')+F('f.ulice','Ulice a číslo')+F('f.mesto','Město')+F('f.psc','PSČ')+F('f.lat','Zeměpisná šířka')+F('f.lng','Zeměpisná délka')+'<div class="f"><b style="font-size:14px">Cenové rozpětí</b><small>Počítá se samo z Ceníku – od nejlevnějšího po nejdražší ubytování.</small><output class="inp" style="display:block;background:#f5f3ec">'+esc(KKC.rozpeti())+'</output></div>'+'</div></div>'+
    '<div class="card"><h2>Google Search Console</h2>'+F('googleVerify','Ověřovací kód','Z Google Search Console → Ověření vlastnictví → značka HTML (jen hodnota content).')+'</div>'+
    '</div><div class="grid" style="align-content:start;position:sticky;top:20px"><div class="card seo-pre"><h2>Náhled v Googlu</h2><div class="serp" aria-hidden="true"><div class="u"><i>K</i><span><b style="font-weight:400">Kemp Krumlov</b><br><span id="pu"></span></span></div><div class="t" id="pt"></div><div class="d" id="pd"></div></div>'+
    '<h2 style="margin-top:6px">Náhled při sdílení</h2><div class="og" aria-hidden="true"><div class="im" id="oi"></div><div class="bx"><small id="ou2"></small><b id="ot"></b><span id="od"></span></div></div></div>'+
    '<div class="card"><h2>Kontrola</h2><ul class="chk" id="ck"></ul></div>'+
    '<div class="row"><button class="btn pri" type="submit">Uložit SEO</button><button class="btn gh" type="button" id="sr">Obnovit výchozí</button></div></div></form>';
    var f=$('#sf');
    function nastav(){['title','description','keywords','canonical','ogTitle','ogDescription','googleVerify'].forEach(function(k){f.elements[k].value=s[k]||''});f.elements.index.checked=s.index!==false;
      Object.keys(s.firma).forEach(function(k){var e=f.elements['f.'+k];if(e)e.value=s.firma[k]||''});}
    function cti(){['title','description','keywords','canonical','ogTitle','ogDescription','googleVerify'].forEach(function(k){s[k]=f.elements[k].value.trim()});s.index=f.elements.index.checked;Object.keys(s.firma).forEach(function(k){var e=f.elements['f.'+k];if(e)s.firma[k]=e.value.trim()})}
    function nahled(){cti();
      $('#pu').textContent=(s.canonical||'').replace(/^https?:\/\//,'').replace(/\/$/,'')||'kemp-krumlov.cz';
      $('#pt').textContent=(s.title||'').length>60?s.title.slice(0,58)+'…':s.title;$('#pd').textContent=(s.description||'').length>160?s.description.slice(0,157)+'…':s.description;
      $('#ot').textContent=s.ogTitle||s.title;$('#od').textContent=s.ogDescription||s.description;$('#ou2').textContent=(s.canonical||'').replace(/^https?:\/\//,'').split('/')[0];
      $('#oi').style.backgroundImage=s.ogImage?'url(\''+WEB+s.ogImage+'\')':'none';
      $$('.ogpick button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.og===s.ogImage))});
      var kw=f.elements.keywords.value.split(',').map(function(x){return x.trim()}).filter(Boolean);$('#kwc').textContent=kw.length?kw.length+' '+pl(kw.length,'slovo','slova','slov'):'';
      $$('.cnt',f).forEach(function(c){var n=f.elements[c.dataset.c].value.length,mx=+c.dataset.max;c.textContent=n+' / '+mx+' znaků';c.className='cnt '+(n===0?'':n<=mx?'ok':n<=mx*1.15?'warn':'err')});
      $('#ck').innerHTML=seoKontrola(s,z).map(function(x){return '<li class="'+x[0]+'"><i>'+(x[0]==='ok'?'✓':'!')+'</i>'+esc(x[1])+'</li>'}).join('');
    }
    f.addEventListener('input',function(){zm=true;nahled()});
    f.addEventListener('click',function(e){var b=e.target.closest('[data-og]');if(b){s.ogImage=b.dataset.og;zm=true;nahled()}});
    $('#kwn').addEventListener('click',function(){var el=f.elements.keywords,ma=el.value.split(',').map(function(x){return x.trim()}).filter(Boolean),lo=ma.map(function(x){return x.toLowerCase()});
      'kemp Český Krumlov, kemp Krumlov, kemp u Vltavy, vodácký kemp, kemp Vltava, chatky Český Krumlov, ubytování Český Krumlov, teepee, podsadové stany, stanování u řeky, kemp pro karavany, půjčovna lodí, sjíždění Vltavy, raft Vltava, kanoe Vltava, PE-LA, Domoradice'.split(', ').forEach(function(x){if(lo.indexOf(x.toLowerCase())<0)ma.push(x)});el.value=ma.join(', ');el.dispatchEvent(new Event('input',{bubbles:true}))});
    f.addEventListener('submit',function(e){e.preventDefault();cti();if(!s.title){toast('Titulek nesmí být prázdný.',1);f.elements.title.focus();return}
      KK.seo.uloz(JSON.parse(JSON.stringify(s))).then(function(){zm=false;toast('SEO uloženo.')})});
    $('#sr').addEventListener('click',function(){ptej('Vrátit SEO na výchozí hodnoty?\n\nPřepíšou se všechny SEO údaje. Projeví se až po uložení.',{ok:'Vrátit výchozí'}).then(function(ok){if(!ok)return;s=JSON.parse(JSON.stringify(KK.SEO_VYCHOZI));nastav();nahled();zm=true})});
    nastav();nahled();
  });
}


/* ---------- CENÍK ---------- */
var POUZITO={stan:1,karavan:1,chatka:1,teepee:1,podsad:1,auto:1,elek:1,pes:1,os:1,dite:1,zak:1};
function cenik(m){
  return KK.cenik.nacti().then(function(ul){
    var C=JSON.parse(JSON.stringify(ul?KKC.doplň(ul):KKC.vychozi)),puv=JSON.stringify(C),M=KKC.mesic;
    /* jazyk: v EN/DE se v polích Název, Poznámka a u služeb píše překlad (n_en, pozn_en …), ceny zůstávají společné */
    var J=jazykAdm(),PR=J!=='cs',VP=(window.KK_PREKLADY&&KK_PREKLADY[J]&&KK_PREKLADY[J].dtexty)||{};
    var pole=function(f){return PR?f+'_'+J:f},hod=function(o,f){return PR?(o[f+'_'+J]||''):(o[f]||'')},
        ph=function(o,f,zal){if(!PR)return zal?' placeholder="'+zal+'"':'';var c=o[f]||'';return ' placeholder="'+esc(VP[c]||c)+'"'};
    neulozeno=function(){return JSON.stringify(C)!==puv};
    var DNY=function(sel){var h='';for(var i=1;i<=31;i++)h+='<option'+(i===sel?' selected':'')+'>'+i+'</option>';return h};
    var MES=function(sel){return M.map(function(x,i){return '<option value="'+(i+1)+'"'+(i+1===sel?' selected':'')+'>'+x+'</option>'}).join('')};
    var md=function(v){return v.split('-').map(Number)};
    /* ceník je rozdělený do bloků: Obecné, Ubytování v kempu, Půjčovna lodí, Doprava */
    var CKG={obecne:['Obecné nastavení','Sezóna, slevy a měna – platí pro celý ceník.','<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'],
      kemp:['Ubytování v kempu','Osoby, ubytování, doplňky a služby v kempu.','<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5"/>'],
      pujc:['Půjčovna lodí','Ceny lodí za den a poplatek za návoz lodí na start.','<path d="M2 15c3.5 3.5 16.5 3.5 20 0M5 15l2.5-6h9L19 15M12 9V4"/>'],
      dop:['Doprava','Doprava osob z kempu na místo vyplutí – cena za auto.','<path d="M2 16V7h12v9M14 10h4l4 4v2h-8"/><circle cx="6.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/>']};
    var ckg=function(k){var g=CKG[k];return '<div class="ckg ckg-'+k+'" id="ckg-'+k+'"><span class="ckg-i">'+SV(g[2],24)+'</span><div><h2>'+g[0]+'</h2><p>'+g[1]+'</p></div></div>'};
    var ckn=function(){return '<nav class="ckn" aria-label="Části ceníku">'+Object.keys(CKG).map(function(k){return '<button type="button" data-ckg="'+k+'">'+SV(CKG[k][2],17)+CKG[k][0]+'</button>'}).join('')+'</nav>'};
    m.addEventListener('click',function(e){var b=e.target.closest('[data-ckg]');if(!b)return;var t=document.getElementById('ckg-'+b.dataset.ckg);if(t)t.scrollIntoView({behavior:'smooth',block:'start'})});
    function kresli(){
      var o=md(C.sezona.otevrenoOd),d=md(C.sezona.otevrenoDo),HZ=C.sezona.hlavniZap!==false,CR=C.sezona.celorocne===true;
      var h='<div class="row" style="margin-bottom:14px;gap:12px;flex-wrap:wrap">'+jazykVolba()+(PR?'<span class="mut">Překlad názvů a poznámek do jazyka '+KK.JAZYKY[J]+'. Prázdné pole = použije se šedý návrh (výchozí překlad), případně čeština. Ceny jsou pro všechny jazyky stejné.</span>':'')+'</div>'+
      '<div class="ph"><div><h1>Ceník a kapacity'+(PR?' – '+KK.JAZYKY[J]:'')+'</h1><p>Jediné místo, kde se mění ceny. Projeví se všude na webu – v úvodu, u ubytování, v ceníku, na mapě kempu a u dopravy – a také ve výpočtu rezervace.</p></div>'+
      '<div class="row"><a class="btn gh" href="'+WEB+'#ubytovani" target="_blank" rel="noopener">Zobrazit web '+SV(IC.ven,16)+'</a><button type="button" class="btn dan" id="cr">Obnovit výchozí ceník</button></div></div>'+
      ckn()+ckg('obecne')+'<div class="grid g2" style="margin-bottom:16px"><div class="card"><h2>Sezóna</h2><p class="mut">Kdy je kemp otevřený a jestli platí vyšší ceny v hlavní sezóně.</p>'+
      '<div class="sw-l"><label class="sw"><input type="checkbox" data-sz="celorocne"'+(CR?' checked':'')+'><span aria-hidden="true"></span>Otevřeno celý rok</label>'+
      '<label class="sw"><input type="checkbox" data-sz="hlavniZap"'+(HZ?' checked':'')+'><span aria-hidden="true"></span>Hlavní sezóna s vyššími cenami</label></div>'+
      (HZ?'':'<p class="mut" style="margin:0 0 12px">Vypnuto: po celý rok platí jedna cena (sloupec Cena). Ceny „Mimo sezónu“ zůstanou uložené pro případ, že sezónu znovu zapnete.</p>')+
      '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">'+(CR?'':'<fieldset class="fs"><legend>Otevřeno od</legend><div class="row"><select class="inp" data-s="od-d" aria-label="Den otevření">'+DNY(o[1])+'</select><select class="inp" data-s="od-m" aria-label="Měsíc otevření">'+MES(o[0])+'</select></div></fieldset>'+
      '<fieldset class="fs"><legend>Otevřeno do (den odjezdu)</legend><div class="row"><select class="inp" data-s="do-d" aria-label="Den uzavření">'+DNY(d[1])+'</select><select class="inp" data-s="do-m" aria-label="Měsíc uzavření">'+MES(d[0])+'</select></div></fieldset>')+
      (HZ?'<fieldset class="fs"><legend>Hlavní sezóna</legend><div class="row"><select class="inp" data-s="h-od" aria-label="Hlavní sezóna od">'+MES(C.sezona.hlavniOd)+'</select><span>–</span><select class="inp" data-s="h-do" aria-label="Hlavní sezóna do">'+MES(C.sezona.hlavniDo)+'</select></div></fieldset>':'')+'</div></div>'+
      '<div class="card"><h2>Slevy za více nocí</h2><p class="mut">Sleva se počítá z celé ceny pobytu. Platí nejvyšší, na kterou má host nárok.</p><div id="sl">'+
      C.slevy.map(function(x,i){return '<div class="row" style="margin-bottom:8px"><label class="row">od <input class="inp num" type="number" min="1" max="60" data-sl="'+i+'" data-f="noci" value="'+x.noci+'" aria-label="Počet nocí"> nocí</label><label class="row">sleva <input class="inp num" type="number" min="0" max="90" data-sl="'+i+'" data-f="proc" value="'+x.proc+'" aria-label="Sleva v procentech"> %</label><button type="button" class="btn ic dan" data-sld="'+i+'" aria-label="Odebrat slevu">'+SV(IC.kos,18)+'</button></div>'}).join('')+
      '</div><button type="button" class="btn sm gh" id="sla">+ Přidat slevu</button></div></div>'+
      '<div class="card" style="margin-bottom:16px"><h2>Měna</h2><p class="mut">Ceny se zadávají v korunách. Na webu si je host může přepnout na eura (v ceníku tlačítkem Kč / €). Anglická a německá verze webu ukazuje eura automaticky.</p>'+
      '<div class="sw-l"><label class="sw"><input type="checkbox" data-mn="eur"'+(C.mena.eur!==false?' checked':'')+'><span aria-hidden="true"></span>Nabízet ceny v eurech</label></div>'+
      (C.mena.eur!==false?'<div class="row" style="gap:16px;flex-wrap:wrap"><label class="row" style="font-weight:700">Kurz: 1 € = <input class="inp num" type="number" min="1" max="100" step="0.1" data-mn="kurz" value="'+C.mena.kurz+'" aria-label="Kurz – kolik korun je 1 euro"> Kč</label>'+
      '<label class="row" style="font-weight:700">Zaokrouhlit na <select class="inp" data-mn="zaokr" aria-label="Zaokrouhlení cen v eurech" style="width:auto">'+[[1,'celá eura'],[0.5,'0,50 €'],[0.1,'0,10 €']].map(function(o){return '<option value="'+o[0]+'"'+(+C.mena.zaokr===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></label></div>'+
      '<p class="mut" style="margin:10px 0 0">Příklad: chatka '+KKC.fmt(C.polozky.filter(function(p){return p.k==='chatka'}).map(function(p){return p.a})[0]||990)+' Kč ≈ '+(Math.round((C.polozky.filter(function(p){return p.k==='chatka'}).map(function(p){return p.a})[0]||990)/C.mena.kurz/C.mena.zaokr)*C.mena.zaokr).toLocaleString('cs-CZ')+' €</p>':'')+'</div>';
      h+=ckg('kemp')+'<section class="card ck" style="margin-bottom:16px"><div class="row" style="margin-bottom:6px"><h2 style="margin:0">Služby v kempu</h2><span class="badge ck-web" title="Zobrazuje se v ceníku na webu">Ceník</span><span class="sp"></span><button type="button" class="btn sm pri" id="sva">+ Přidat službu</button></div>'+
        '<p class="mut" style="margin:0 0 12px">Jen text do ceníku na webu (např. sprcha, úschovna). Do ceny rezervace se nepočítají, cenu napište i s jednotkou.</p>'+
        (C.sluzby.length?'<div class="tw-wrap"><table class="ct"><thead><tr><th>Služba</th><th>Cena a podmínky (text)</th><th><span class="sr">Akce</span></th></tr></thead><tbody>'+C.sluzby.map(function(x,i){return '<tr><td><input class="inp" data-sv="'+i+'" data-f="'+pole('n')+'" value="'+esc(hod(x,'n'))+'"'+ph(x,'n')+' aria-label="Název služby'+(PR?' – '+KK.JAZYKY[J]:'')+'"></td><td><input class="inp" data-sv="'+i+'" data-f="'+pole('t')+'" value="'+esc(hod(x,'t'))+'"'+(PR?ph(x,'t'):' placeholder="např. 20 Kč / 4 min"')+' aria-label="Cena a podmínky – '+esc(x.n)+'"></td><td class="c"><button type="button" class="btn ic dan" data-svd="'+i+'" aria-label="Smazat službu – '+esc(x.n)+'">'+SV(IC.kos,18)+'</button></td></tr>'}).join('')+'</tbody></table></div>':'<p class="mut">Žádné služby – v ceníku na webu se sekce nezobrazí.</p>')+'</section>';
      var kempI=-1;
      Object.keys(C.kategorie).forEach(function(kat){
        var K=C.kategorie[kat],pol=C.polozky.filter(function(p){return p.kat===kat}),dva=K.sloupce.length>1&&(HZ||kat==='lode'),SL=dva||K.sloupce.length<2?K.sloupce:['Cena'],ub=kat==='ubytovani',dop=kat==='doplnky',slu=kat==='sluzby',rez=ub||dop,lod=kat==='lode',dpr=kat==='doprava',oso=kat==='osoby';
        if(kat==='lode')h+=ckg('pujc');if(kat==='doprava')h+=ckg('dop');
        h+='<section class="card ck ck-'+(lod||kat==='navoz'?'pujc':dpr?'dop':'kemp')+'" style="margin-bottom:16px"><div class="row" style="margin-bottom:10px"><h2 style="margin:0">'+esc(K.n)+'</h2>'+(oso||ub||dop?'<span class="badge ck-web" title="Zobrazuje se v ceníku na webu">Ceník</span>':'')+'<span class="sp"></span>'+(K.pevne?'<span class="badge">pevné položky</span>':'<button type="button" class="btn sm pri" data-add="'+kat+'">+ Přidat položku</button>')+'</div>'+
        (dop?'<p class="mut" style="margin:-4px 0 12px">Doplňky se zaškrtnutím „V rezervaci“ si host může přidat v kroku Doplňky.</p>':'')+(oso?'<p class="mut" style="margin:-4px 0 12px">Nová skupina (např. senior, ZTP) se objeví v rezervaci v kroku Kdo jede a v ceníku.</p>':'')+(lod?'<p class="mut" style="margin:-4px 0 12px">Cena za jednu loď a den včetně pádel, vest a barelů. Počty kusů na skladě nastavíte v Rezervace → Nastavení → Půjčovna a zálohy.</p>':'')+(kat==='navoz'?'<p class="mut" style="margin:-4px 0 12px">Připočítá se jednou ke každé rezervaci s loděmi.</p>':'')+(dpr?'<p class="mut" style="margin:-4px 0 12px">Pořadí = pořadí míst na řece po proudu (shora dolů). Kemp leží mezi Centrem a Zlatou Korunou. Nové místo se na mapě dopravy objeví mezi sousedy v seznamu.</p>':'')+(ub?'<p class="mut" style="margin:-4px 0 12px">Lůžka = kolik osob se vejde do jedné jednotky (prázdné = vlastní spaní, např. stan nebo karavan).</p>':'')+
        (function(){kempI=-1;if(dpr)pol.some(function(p,x){if(p.k==='dop8'||p.k==='dop9'){kempI=x;return true}});return ''})()+
        '<div class="tw-wrap"><table class="ct"><thead><tr><th>Název</th><th>Poznámka</th>'+SL.slice(0,dva?2:1).map(function(c){return '<th class="n">'+esc(c)+'</th>'}).join('')+(ub?'<th class="n">Lůžek</th>':'')+(lod?'<th class="n">Osob</th>':'')+(slu?'<th>Za</th>':'')+(rez?'<th>V rezervaci</th>':'')+'<th><span class="sr">Akce</span></th></tr></thead><tbody>'+
        pol.map(function(p,pi){var i=C.polozky.indexOf(p),fix=K.pevne||POUZITO[p.k]||/^dop\d|^(kanoe|raft)/.test(p.k);
          var kemp=dpr&&pi===kempI?'<tr class="ck-kemp"><td colspan="9"><span><i aria-hidden="true">▲</i><b>Kemp Krumlov</b><small>odtud vezeme · výš proti proudu, níž po proudu</small></span></td></tr>':'';
          return kemp+'<tr class="'+(p.skryt===1?'skr':'')+'"><td><input class="inp" data-i="'+i+'" data-f="'+pole('n')+'" value="'+esc(hod(p,'n'))+'"'+ph(p,'n')+' aria-label="Název'+(PR?' – '+KK.JAZYKY[J]:'')+'"'+(PR?'':' required')+'></td><td><input class="inp" data-i="'+i+'" data-f="'+pole('pozn')+'" value="'+esc(hod(p,'pozn'))+'"'+ph(p,'pozn')+' aria-label="Poznámka u '+esc(p.n)+(PR?' – '+KK.JAZYKY[J]:'')+'"></td>'+
          '<td class="n"><label class="kc"><input class="inp num" type="number" min="0" step="10" data-i="'+i+'" data-f="a" value="'+(p.a||0)+'" aria-label="'+esc(p.n)+' – '+esc(SL[0])+'"> Kč</label></td>'+
          (dva?'<td class="n"><label class="kc"><input class="inp num" type="number" min="0" step="10" data-i="'+i+'" data-f="b" value="'+(p.b==null?p.a:p.b)+'" aria-label="'+esc(p.n)+' – '+esc(K.sloupce[1])+'"> Kč</label></td>':'')+
          (lod?'<td class="n"><input class="inp num" type="number" min="1" max="12" data-i="'+i+'" data-f="osob" value="'+(p.osob||'')+'" aria-label="Osob – '+esc(p.n)+'"></td>':'')+(ub?'<td class="n"><input class="inp num" type="number" min="0" max="50" data-i="'+i+'" data-f="luzka" value="'+(p.luzka||'')+'" aria-label="Lůžek – '+esc(p.n)+'"></td>':'')+
          (slu?'<td><input class="inp" data-i="'+i+'" data-f="'+pole('jed')+'" value="'+esc(hod(p,'jed'))+'" aria-label="Jednotka – '+esc(p.n)+'"'+(PR?ph(p,'jed'):' placeholder="den, osoba…"')+'></td>':'')+
          (rez?'<td class="c"><input type="checkbox" class="cb" data-i="'+i+'" data-f="rez"'+(p.rez!==0?' checked':'')+' aria-label="Nabízet v rezervaci – '+esc(p.n)+'"></td>':'')+
          '<td class="c"><span class="row" style="flex-wrap:nowrap;gap:6px;justify-content:flex-end">'+(dpr?'<button type="button" class="btn ic gh" data-mv="'+i+'" data-d="-1" aria-label="Posunout výš – '+esc(p.n)+'"'+(pol.indexOf(p)?'':' disabled')+'>'+SV('<path d="m18 15-6-6-6 6"/>',18)+'</button><button type="button" class="btn ic gh" data-mv="'+i+'" data-d="1" aria-label="Posunout níž – '+esc(p.n)+'"'+(pol.indexOf(p)<pol.length-1?'':' disabled')+'>'+SV('<path d="m6 9 6 6 6-6"/>',18)+'</button>':'')+(p.k==='os'?'':fix&&!K.pevne?'<button type="button" class="btn ic gh" data-hide="'+i+'" aria-label="'+(p.skryt===1?'Zobrazit':'Skrýt')+' – '+esc(p.n)+'" title="Cenu používá text na webu, proto ji nejde smazat – jen skrýt z ceníku a rezervace.">'+SV(p.skryt===1?IC.okoX:IC.oko,18)+'</button>':K.pevne?'':'<button type="button" class="btn ic dan" data-del="'+i+'" aria-label="Smazat – '+esc(p.n)+'">'+SV(IC.kos,18)+'</button>')+'</span></td></tr>'+
          (dop&&!PR&&p.rez!==0?(function(){var UB=C.polozky.filter(function(x){return x.kat==='ubytovani'&&x.skryt!==1}),pro=p.pro||[];return '<tr class="ck-pro"><td colspan="99"><span class="ck-pl">Lze objednat k:</span>'+UB.map(function(u){var on=!pro.length||pro.indexOf(u.k)>=0;return '<button type="button" class="ck-ch'+(on?' on':'')+'" data-pro="'+i+'" data-pk="'+u.k+'" aria-pressed="'+on+'">'+(on?'✓ ':'')+esc(u.n)+'</button>'}).join('')+'<small>'+(pro.length?'U ostatního ubytování bude na webu zašedlý.':'Ke všemu ubytování.')+'</small></td></tr>'})():'')}).join('')+
        '</tbody></table></div></section>';
      });
      h+='<div class="savebar" id="sb" hidden><span id="sbt">Neuložené změny v ceníku</span><span class="row"><button type="button" class="btn sm gh" id="sbz" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.3)">Zahodit</button><button type="button" class="btn sm pri" id="sbu">Uložit ceník</button></span></div>';
      var y=scrollY;m.innerHTML=h;jazykKlik(m);scrollTo(0,y);lista();
    }
    function lista(){var b=$('#sb');if(b)b.hidden=!neulozeno()}
    m.addEventListener('input',function(e){var t=e.target;
      if(t.dataset.i!=null){var p=C.polozky[+t.dataset.i],f=t.dataset.f;
        if(f==='rez')p.rez=t.checked?1:0;else if(f==='a'||f==='b'||f==='luzka'||f==='osob'){var v=t.value===''?(f==='luzka'?0:0):Math.max(0,Math.round(+t.value));if(f==='luzka'||f==='osob'){if(v)p[f]=v;else delete p[f]}else p[f]=v}else p[f]=t.value}
      else if(t.dataset.mn){var mk=t.dataset.mn;if(mk==='eur'){C.mena.eur=t.checked;kresli();var me=$('[data-mn=eur]',m);if(me)me.focus()}else{var mv=+t.value;if(mk==='kurz'&&mv>0)C.mena.kurz=mv;if(mk==='zaokr')C.mena.zaokr=mv}}
      else if(t.dataset.sv!=null){C.sluzby[+t.dataset.sv][t.dataset.f]=t.value}
      else if(t.dataset.sl!=null){C.slevy[+t.dataset.sl][t.dataset.f]=Math.max(0,Math.round(+t.value||0))}
      else if(t.dataset.s){var g=function(x){return $('[data-s="'+x+'"]',m).value},pad=function(n){return('0'+n).slice(-2)};
        if($('[data-s="od-m"]',m)){C.sezona.otevrenoOd=pad(g('od-m'))+'-'+pad(g('od-d'));C.sezona.otevrenoDo=pad(g('do-m'))+'-'+pad(g('do-d'))}if($('[data-s="h-od"]',m)){C.sezona.hlavniOd=+g('h-od');C.sezona.hlavniDo=+g('h-do')}}
      else if(t.dataset.sz){C.sezona[t.dataset.sz]=t.checked;var fz=t.dataset.sz;kresli();var nt=$('[data-sz="'+fz+'"]',m);if(nt)nt.focus()}
      lista()});
    m.addEventListener('change',function(e){if(e.target.matches('input[type=checkbox],select'))m.dispatchEvent(new Event('input'))});
    m.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
      if(b.dataset.add){var kat=b.dataset.add;C.polozky.push({k:'x'+Date.now().toString(36),kat:kat,n:'',pozn:'',a:0,b:(kat==='sluzby'||kat==='doprava')?undefined:0,rez:(kat==='doplnky'||kat==='ubytovani')?1:undefined,jed:kat==='sluzby'?'':undefined,osob:kat==='lode'?4:undefined});kresli();var ins=$$('section.ck',m).filter(function(s){return $('[data-add="'+kat+'"]',s)})[0];var inp=ins&&$$('tbody tr:last-child input[data-f=n]',ins)[0];if(inp)inp.focus()}
      else if(b.dataset.pro){var pp=C.polozky[+b.dataset.pro],UBk=C.polozky.filter(function(x){return x.kat==='ubytovani'&&x.skryt!==1}).map(function(x){return x.k}),cur=(pp.pro&&pp.pro.length?pp.pro:UBk).slice(),ix2=cur.indexOf(b.dataset.pk);if(ix2>=0)cur.splice(ix2,1);else cur.push(b.dataset.pk);if(!cur.length){toast('Aspoň jedno ubytování musí zůstat zaškrtnuté. Když doplněk nechcete nabízet, vypněte „V rezervaci“.',1);return}if(UBk.every(function(k){return cur.indexOf(k)>=0}))delete pp.pro;else pp.pro=cur;kresli()}
      else if(b.dataset.mv){var ix=+b.dataset.mv,d=+b.dataset.d,kt=C.polozky[ix].kat,j=ix+d;while(j>=0&&j<C.polozky.length&&C.polozky[j].kat!==kt)j+=d;if(j>=0&&j<C.polozky.length){var t=C.polozky[ix];C.polozky[ix]=C.polozky[j];C.polozky[j]=t;kresli();var nb=$('[data-mv="'+j+'"][data-d="'+d+'"]',m);if(nb&&!nb.disabled)nb.focus()}}
      else if(b.dataset.del){var p=C.polozky[+b.dataset.del];ptej('Smazat položku „'+(p.n||'bez názvu')+'“?\n\nZ ceníku zmizí až po uložení.',{ok:'Smazat',nebezp:1}).then(function(ok){if(!ok)return;var pi=C.polozky.indexOf(p);if(pi>=0)C.polozky.splice(pi,1);kresli()})}
      else if(b.dataset.hide){var q=C.polozky[+b.dataset.hide];if(q.skryt===1)delete q.skryt;else q.skryt=1;kresli()}
      else if(b.id==='sva'){C.sluzby.push({n:'',t:''});kresli();var si=$$('[data-sv][data-f=n]',m).pop();if(si)si.focus()}
      else if(b.dataset.svd){var sx=C.sluzby[+b.dataset.svd];(sx.n?ptej('Smazat službu „'+sx.n+'“?',{ok:'Smazat',nebezp:1}):Promise.resolve(true)).then(function(ok){if(!ok)return;var si2=C.sluzby.indexOf(sx);if(si2>=0)C.sluzby.splice(si2,1);kresli()})}
      else if(b.id==='sla'){C.slevy.push({noci:(C.slevy.reduce(function(a,x){return Math.max(a,x.noci)},1))+1,proc:5});kresli()}
      else if(b.dataset.sld){C.slevy.splice(+b.dataset.sld,1);kresli()}
      else if(b.id==='sbz'){C=JSON.parse(puv);kresli()}
      else if(b.id==='cr'){ptej('Vrátit celý ceník na výchozí hodnoty?\n\nVšechny vaše ceny a položky se přepíšou. Nejde to vrátit.',{ok:'Vrátit výchozí',nebezp:1}).then(function(ok){if(ok)KK.cenik.obnov().then(function(){C=JSON.parse(JSON.stringify(KKC.vychozi));puv=JSON.stringify(C);kresli();toast('Ceník vrácen na výchozí.')})})}
      else if(b.id==='sbu'){
        var chyba=C.polozky.find(function(p){return !String(p.n).trim()});
        if(chyba){toast('Každá položka musí mít název.',1);var ix=C.polozky.indexOf(chyba),el=$('input[data-i="'+ix+'"][data-f=n]',m);if(el){el.setAttribute('aria-invalid','true');el.focus()}return}
        var o=C.sezona.otevrenoOd,d2=C.sezona.otevrenoDo;if(!C.sezona.celorocne&&d2<=o){toast('Konec sezóny musí být po jejím začátku.',1);return}
        if(C.sezona.hlavniZap!==false&&C.sezona.hlavniDo<C.sezona.hlavniOd){toast('Hlavní sezóna musí končit až po svém začátku.',1);return}
        C.sluzby=C.sluzby.filter(function(x){return String(x.n).trim()});
        C.polozky.forEach(function(p){['b','rez','jed','osob'].forEach(function(k){if(p[k]===undefined)delete p[k]})});
        KK.cenik.uloz(JSON.parse(JSON.stringify(C))).then(function(){puv=JSON.stringify(C);lista();toast('Ceník uložen – ceny se změnily na celém webu i v rezervaci.')})}
    });
    kresli();
  });
}

/* ---------- PŘIPRAVUJEME ---------- */
function pripravujeme(m,v){
  var D={rezervace:['Rezervace','Přehled poptávek ubytování z webu a jejich vyřízení.',['Seznam poptávek s filtrováním (nové, potvrzené, zrušené)','Detail poptávky, potvrzení nebo zamítnutí jedním kliknutím a e-mail hostovi','Kalendář obsazenosti chatek, teepee a podsadových stanů','Ruční zápis rezervace přijaté po telefonu']],
   cenik:['Ceník a kapacity','Jediné místo, kde se mění ceny – projeví se na webu i ve výpočtu rezervace.',['Ceny v sezóně a mimo sezónu (osoby, děti, stany, chatky, teepee, doplňky)','Počty chatek, teepee a podsadových stanů','Termín sezóny a otevírací doba','Slevy za více nocí']]}[v];
  m.innerHTML='<div class="ph"><div><h1>'+D[0]+'</h1><p>'+D[1]+'</p></div><span class="badge warn">Připravujeme</span></div><div class="card soonc"><h2>Co tu bude</h2><ul>'+D[2].map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div>';
}

/* ---------- REZERVACE (kalendář obsazenosti, seznam, nastavení) ---------- */
function rezervace(m,sekV){
  /* čtyři sekce v menu Provoz sdílejí jednu obrazovku: Rezervace (seznam, nastavení), Ubytování (plánek, kalendář), Půjčovna, Doprava */
  var SEK={rezervace:['Rezervace',['sez','nas']],ubytovani:['Ubytování',['dnes','kal']],pujcovna:['Půjčovna lodí',['lod']],doprava:['Doprava',['dop']]},sek=SEK[sekV]?sekV:'rezervace',ST=SEK[sek][1];
  var R=window.KKR,ja=KK.auth.meSync(),adm=ja.role==='admin',W=40,N=21,NW=150;
  var D0=function(s){var p=s.split('-');return new Date(+p[0],p[1]-1,+p[2])},ISO=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
  var ADD=function(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x},KR=function(s){var d=D0(s);return d.getDate()+'. '+(d.getMonth()+1)+'.'};
  var DNY=['Ne','Po','Út','St','Čt','Pá','So'],MES=['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
  var dnes=ISO(new Date()),zac=ADD(D0(dnes),-2),autoN=R.auto(dnes),tab=KK.LS.get('rez.tab.'+sek,ST[0]),denP=dnes,filtr='',sbal={},rozb={};
  if(ST.indexOf(tab)<0)tab=ST[0];
  var F0={stav:'',obd:'bud',typ:'',zdroj:'',raz:'od',od:'',do:''},F=Object.assign({},F0),q='',lim=100,posl=[],VY={};
  /* skupiny v pořadí a směru, jaké si obsluha nastavila */
  var skupiny=function(){var n=R.nast(),po=n.poradi2||[];return R.SKUPINY.filter(function(g){return R.rezTyp(g.k)}).sort(function(a,b){var x=po.indexOf(a.id),y=po.indexOf(b.id);return (x<0?99:x)-(y<0?99:y)})};
  var AKCE={pop:['pot','Potvrdit poptávku'],pot:['uby','Ubytovat hosta (check-in)'],uby:['odj','Odhlásit hosta (check-out)']};
  var noci=function(r){return Math.round((D0(r.do)-D0(r.od))/864e5)};
  var termin=function(r){var n=noci(r);return KR(r.od)+' – '+KR(r.do)+' '+r.do.slice(0,4)+' ('+n+' '+pl(n,'noc','noci','nocí')+')'};
  var mistaTxt=function(r){var a=(r.mista||[]).map(R.nazev);if(r.dalsi){if(r.dalsi.stan)a.push(r.dalsi.stan+'× vlastní stan');if(r.dalsi.karavan)a.push(r.dalsi.karavan+'× karavan')}return a.join(', ')||'—'};
  var kc=function(n){return n?Number(n).toLocaleString('cs-CZ')+' Kč':'—'};
  var bdg=function(s){return '<span class="rs '+s+'">'+R.STAVY[s]+'</span>'};
  var najdi=function(id){return R.vse().filter(function(x){return x.id===id})[0]};
  m.innerHTML='<div class="rz-lay"><div id="rzv"></div><aside id="rd" class="rpan" aria-labelledby="rdt" hidden></aside></div><dialog id="rf" class="dlg rdl" aria-labelledby="rft"></dialog>';
  var box=$('#rzv',m),dd=$('#rd',m),df=$('#rf',m),vicF=false;
  dd.close=function(){if(dd.hidden)return;dd.hidden=true;kresli()};
  var oznac=function(){$$('.sel',box).forEach(function(x){x.classList.remove('sel')});if(!dd.hidden)$$('[data-id="'+dd.dataset.id+'"]',box).forEach(function(x){x.classList.add('sel')})};
  /* změna rezervace se zápisem do její historie */
  var zmen=function(id,z,co){var r0=najdi(id)||{};z.hist=(r0.hist||[]).concat([{t:Date.now(),kdo:ja.jmeno,co:co}]).slice(-30);return R.uprav(id,z)};
  var cas=function(t){var d=new Date(t);return d.getDate()+'. '+(d.getMonth()+1)+'. '+d.getFullYear()+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)};
  var kratM=function(r){var a=(r.mista||[]).map(function(k){return R.nazev(k).replace('Podsadový stan','Stan')});if(r.dalsi){if(r.dalsi.stan)a.push(r.dalsi.stan+'× vl. stan');if(r.dalsi.karavan)a.push(r.dalsi.karavan+'× karavan')}return a.join(', ')||'—'};

  var JL=function(r){return R.jenLode(r)},dniL=function(r){return r.lode?Math.max(1,+r.lode.dni||1):0};
  var LK=function(r){return r.lode&&R.lodePocet(r.lode)?Object.keys(r.lode.kusy).filter(function(k){return +r.lode.kusy[k]>0}).map(function(k){return r.lode.kusy[k]+'× '+((KKC.p(k)||{}).n||k)}).join(', '):''};
  var delka=function(r){var n=noci(r);return JL(r)?dniL(r)+' '+pl(dniL(r),'den','dny','dní')+' · jen lodě':n+' '+pl(n,'noc','noci','nocí')};
  var vybTxt=function(l){var p=R.lodePotreba(l);return p.padla+' '+pl(p.padla,'pádlo','pádla','pádel')+', '+p.vesty+' '+pl(p.vesty,'vesta','vesty','vest')+', '+p.barely+' '+pl(p.barely,'barel','barely','barelů')};
  /* štítky: co všechno rezervace obsahuje */
  var STK=[['uby','Ubytování','<path d="M3 11 12 4l9 7M5 10v10h14V10"/>'],['lod','Lodě','<path d="M2 15c3.5 3.5 16.5 3.5 20 0M5 15l2.5-6h9L19 15M12 9V4"/>'],['dop','Doprava','<path d="M2 16V7h12v9M14 10h4l4 4v2h-8"/><circle cx="6.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/>']];
  var stitky=function(r){if(r.stav==='blk')return '';var m={uby:(r.mista||[]).length||(r.dalsi&&(+r.dalsi.stan||+r.dalsi.karavan)),lod:r.lode&&R.lodePocet(r.lode),dop:r.doprava&&r.doprava.misto};
    var ls=LS(r),LT={vyd:' · vydané',cast:' · část vrácena',vra:' · vrácené'};
    return '<span class="rst">'+STK.filter(function(x){return m[x[0]]}).map(function(x){return '<span class="rst-i '+x[0]+(x[0]==='lod'&&ls?' ls-'+ls:'')+'">'+SV(x[2],13)+x[1]+(x[0]==='lod'&&LT[ls]&&r.stav!=='zru'?LT[ls]:'')+'</span>'}).join('')+'</span>'};
  var pbdg=function(r){var p=r.platba;if(!p||r.stav==='zru'||r.stav==='blk')return '';return '<span class="rpl '+p.stav+'">'+(p.stav==='ceka'?'Záloha do '+KR(p.splatnost):R.PLATBA[p.stav])+'</span>'};
  /* platba: obsluha potvrdí přijetí zálohy – tím se poptávka změní na potvrzenou rezervaci */
  var zaplat=function(id,co){var r=najdi(id);if(!r||!r.platba)return;var sn=snap(),p=Object.assign({},r.platba,{stav:co,kdy:co==='ceka'?null:Date.now()}),z={platba:p},pot=r.stav==='pop'&&co!=='ceka';if(pot)z.stav='pot';
    try{zmen(id,z,co==='vse'?'Zaplaceno celé ('+kc(r.cena)+')':co==='ceka'?'Platba vrácena na nezaplaceno':'Záloha zaplacena ('+kc(p.zaloha)+')'+(pot?' – rezervace potvrzena':''));KK.zaznam('Rezervace',(r.cislo||'')+' '+r.jmeno+' – '+R.PLATBA[co]);kresli();tz(r.jmeno+': '+R.PLATBA[co].toLowerCase()+'.',sn)}catch(x){toast(x.message,1)}};
  /* ---- výdej a vrácení lodí ---- */
  var LS=function(r){return R.lodeStav(r)};
  var lsBdg=function(r){var x=LS(r);if(!x||r.stav==='zru')return '';var po=(x==='vyd'||x==='cast')&&posD(r)<dnes;return '<span class="rls '+x+(po?' po':'')+'">'+R.LSTAV[x]+(po?' · po termínu':'')+'</span>'};
  var polLodi=function(k,ven){var P=[];R.lodeTypy().forEach(function(p){if(k[p.k])P.push([p.k,p.n,ven?k[p.k]:k[p.k],k[p.k]])});Object.keys(R.VYB).forEach(function(x){if(k[x])P.push([x,R.VYB[x],k[x],k[x],'vybavení'])});return P};
  var vydej=function(id){var r=najdi(id);if(!r||!r.lode)return;var pt=R.lodePotreba(r.lode),pol=polLodi(pt).map(function(x){var p=R.lodeTypy().filter(function(t){return t.k===x[0]})[0];x[3]=Math.max(x[2],x[2]+5);return x});
    pocty('Vydat lodě – '+r.jmeno,'Zkontrolujte, co si host skutečně odnáší. Počty jsou předvyplněné podle rezervace.',pol,'Vydat').then(function(k){if(!k)return;var sn=snap(),l=Object.assign({},r.lode,{vydano:{kdy:Date.now(),kdo:ja.jmeno,kusy:k},vraceno:[]});
      try{zmen(id,{lode:l},'Lodě vydány: '+R.lodeKusyTxt(k));KK.zaznam('Rezervace',(r.cislo||'')+' '+r.jmeno+' – lodě vydány');kresli();tz(r.jmeno+': lodě vydány.',sn)}catch(x){toast(x.message,1)}})};
  var vrat=function(id){var r=najdi(id);if(!r||!r.lode||!r.lode.vydano)return;var ven=R.lodeVen(r);
    pocty('Vrátit lodě – '+r.jmeno,'Zadejte, kolik čeho host vrací. Když vrací jen část, zbytek zůstane u něj a vrátí ho později.',polLodi(ven,1),'Uložit vrácení').then(function(k){if(!k)return;var sn=snap(),vr=(r.lode.vraceno||[]).concat([{kdy:Date.now(),kdo:ja.jmeno,kusy:k}]),l=Object.assign({},r.lode,{vraceno:vr}),z={lode:l};
      var zb={};Object.keys(ven).forEach(function(x){var n=ven[x]-(k[x]||0);if(n>0)zb[x]=n});var vse=!Object.keys(zb).length;if(vse&&JL(r)&&r.stav!=='zru')z.stav='odj';
      try{zmen(id,z,'Vráceno: '+R.lodeKusyTxt(k)+(vse?' – vše vráceno':' – zbývá vrátit '+R.lodeKusyTxt(zb)));KK.zaznam('Rezervace',(r.cislo||'')+' '+r.jmeno+' – vrácení lodí');kresli();tz(vse?r.jmeno+': vše vráceno.':r.jmeno+': vráceno, zbývá '+R.lodeKusyTxt(zb)+'.',sn)}catch(x){toast(x.message,1)}})};
  var lodBtn=function(r,sm){var x=LS(r);if(r.stav==='zru'||r.stav==='blk')return '';if(x==='vyd'||x==='cast')return '<button type="button" class="btn sm'+(sm?'':' pri')+'" data-lr="'+r.id+'">Vrátit lodě</button>';if(x==='res'&&r.lode.den<=dnes)return '<button type="button" class="btn sm'+(sm?'':' pri')+'" data-lv="'+r.id+'">Vydat lodě</button>';return ''};
  var zvV=false,kTab='',sbT='poptavka',sbJ='cs',sbF=null,nT='rez';
  /* po změně nabídnout Vrátit zpět: sn = stav rezervací před změnou */
  var snap=function(){return JSON.stringify(R.vse())},tz=function(msg,sn){toast(msg,0,{t:'Vrátit zpět',fn:function(){R.obnov(JSON.parse(sn));KK.zaznam('Rezervace','vráceno zpět: '+msg);kresli();toast('Vráceno zpět.')}})};
  var JZN={cs:'Čeština',en:'English',de:'Deutsch'};
  function sbVzor(){return {jmeno:'Jana Nováková',cislo:'R-2027-014',od:'2027-07-16',do:'2027-07-19',mista:['chatka-4'],dalsi:{stan:1},osoby:{dosp:2,dite:2,zak:0},cena:7310,lode:{den:'2027-07-17',dni:1,kusy:{kanoe:2},odkud:'dop1',kam:'kemp'},doprava:{misto:'dop1',osob:4,cas:'9:00'},platba:{zaloha:2193,splatnost:'2027-06-20',stav:'ceka'},telefon:'+420 777 123 456',email:'jana@example.cz',zprava:'Přijedeme kolem 18. hodiny.',stav:sbT==='rezervace'?'pot':'pop'}}
  function sbHtml(){var T=R.SABL_TYPY.filter(function(x){return x.k===sbT})[0],J=R.SABL_JAZ(sbT);if(J.indexOf(sbJ)<0)sbJ='cs';var s=R.sablona(sbT,sbJ),dis=adm?'':' disabled';
    return '<p class="sb-kdy"><b>'+(T.kdo==='kemp'?'Komu: vám (kempu)':'Komu: hostovi')+'</b> · '+esc(T.kdy)+'</p>'+
      (J.length>1?'<div class="sb-jz" role="tablist" aria-label="Jazyk e-mailu">'+J.map(function(j){var u=R.sablona(sbT,j).upravena;return '<button type="button" role="tab" data-sj="'+j+'" aria-selected="'+(j===sbJ)+'">'+JZN[j]+(u?' <i title="Upraveno">upraveno</i>':'')+'</button>'}).join('')+'</div><p class="mut sb-pz">E-mail odejde v jazyce, ve kterém host vyplnil formulář na webu.</p>':'<p class="mut sb-pz">Upozornění pro kemp je jen v češtině.</p>')+
      '<label class="sb-l">Předmět<input class="inp" id="sbp" value="'+esc(s.predmet)+'"'+dis+'></label>'+
      '<label class="sb-l">Text e-mailu<textarea class="inp" id="sbt" rows="14"'+dis+'>'+esc(s.text)+'</textarea></label>'+
      '<div class="sb-pol"><small>Vložit údaj z rezervace (klikněte, vloží se tam, kde je kurzor):</small><div>'+R.SABL_POLE.map(function(x){return '<button type="button" class="sb-ch" data-sv="{'+x[0]+'}"'+dis+'>'+x[1]+'</button>'}).join('')+'</div></div>'+
      '<div class="row sb-akce">'+(adm?'<button type="button" class="btn pri" data-a="sbuloz">Uložit šablonu</button>'+(s.upravena?'<button type="button" class="btn gh" data-a="sbvych">Vrátit výchozí znění</button>':''):'<p class="mut">Měnit šablony smí jen správce.</p>')+'</div>'+
      '<div class="sb-nh"><small>Náhled e-mailu s ukázkovými údaji</small><div class="sb-nh-p"><span>Předmět:</span> <b id="sbnp"></b></div><iframe class="sb-if" id="sbif" title="Náhled e-mailu"></iframe></div>'}
  function sbNahled(){var p=$('#sbp',box),t=$('#sbt',box);if(!p)return;var v=sbVzor();$('#sbnp',box).textContent=R.dosad(p.value,v,sbJ);var f=$('#sbif',box);f.srcdoc=R.emailHtml(sbT,sbJ,p.value,t.value,v);f.onload=function(){try{f.style.height=(f.contentDocument.documentElement.scrollHeight+4)+'px'}catch(x){}}}
  function sbKresli(){var e=$('#sbed',box);if(!e)return;e.innerHTML=sbHtml();$$('[data-sb]',box).forEach(function(b){b.setAttribute('aria-selected',b.dataset.sb===sbT)});sbNahled()}
  function sbZmena(){var p=$('#sbp',box),t=$('#sbt',box);if(!p)return false;var s=R.sablona(sbT,sbJ);return p.value!==s.predmet||t.value!==s.text}
  function sbPrepni(fn){if(!sbZmena()){fn();return}ptej('Šablona má neuložené změny\n\nChcete je uložit?',{ok:'Uložit',ne:'Zahodit'}).then(function(ok){if(ok)sbUloz(1);fn()})}
  function sbUloz(tichy){var p=$('#sbp',box),t=$('#sbt',box);R.ulozSablonu(sbT,sbJ,{predmet:p.value,text:t.value});KK.zaznam('Rezervace','šablona e-mailu: '+sbT+' ('+sbJ+')');if(!tichy){toast('Šablona uložena.');sbKresli()}}
  function kresli(){
    var A=R.vse(),akt=A.filter(function(r){return r.stav!=='zru'});
    /* po překreslení zůstat tam, kde uživatel byl (stejná záložka) */
    var kO=$('.rk',box),kS=kO&&kTab===tab+'|'+q?[kO.scrollTop,kO.scrollLeft,window.scrollX,window.scrollY]:null,dO=$('.rn-dny',box),dS=dO&&kTab===tab+'|'+q?dO.scrollLeft:null;
    Promise.resolve().then(function(){sbNahled();hromBar();var k=$('.rk',box);if(kS&&k){k.scrollTop=kS[0];k.scrollLeft=kS[1];window.scrollTo(kS[2],kS[3])}var dn=$('.rn-dny',box);if(dS!=null&&dn)dn.scrollLeft=dS;kTab=tab+'|'+q});
    box.innerHTML='<div class="rz-top"><h1>'+SEK[sek][0]+'</h1>'+
'<label class="rq"><span class="sr">Hledat v rezervacích</span>'+SV(IC.seo,18)+'<input type="search" id="rq" class="inp" placeholder="Hledat jméno, telefon, chatku, datum…" value="'+esc(q)+'" autocomplete="off"></label>'+(ST.length<2?'':'<div class="rz-seg" role="group" aria-label="Zobrazení">')+[['dnes','Plánek','<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'],['kal','Kalendář','<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'],['lod','Půjčovna','<path d="M3 15c3 3 15 3 18 0M5 15l2-6h10l2 6M12 9V4"/>'],['dop','Doprava','<path d="M3 16V7h11v9M14 10h4l3 3v3h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>'],['sez','Seznam','<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'],['nas','Nastavení','<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>']].filter(function(t){return ST.length>1&&ST.indexOf(t[0])>=0}).map(function(t){return '<button type="button" aria-pressed="'+(!q&&tab===t[0])+'" data-tab="'+t[0]+'">'+SV(t[2],17)+'<span>'+t[1]+'</span></button>'}).join('')+(ST.length<2?'':'</div>')+
      '<div class="row rz-ak"><button type="button" class="btn pri" data-a="nova">+ Nová rezervace</button></div></div>'+
      (q?vysledky(A):tab==='kal'?kal(akt):tab==='lod'?lodeTab(akt):tab==='dop'?dopTab(akt):tab==='sez'?sez(A):tab==='nas'?nas():prehledDnes(akt));
    if(!dd.hidden){if(najdi(dd.dataset.id))detail(dd.dataset.id);else{dd.hidden=true}}
  }
  function prehledDnes(akt){
    var d=D0(dnes),host=akt.filter(function(r){return r.stav!=='blk'}),DL=['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'],MG=['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'];
    var podle=function(a,b){return a.od<b.od?-1:a.od>b.od?1:0};
    var ukol=function(r){var o=r.osoby||{},os=(o.dosp||0)+(o.dite||0)+(o.zak||0);
      return '<li class="ru"><button type="button" class="ru-t" data-id="'+r.id+'"><b>'+esc(r.jmeno)+'</b><small>'+esc(kratM(r))+' · '+KR(r.od)+' – '+KR(r.do)+(os?' · '+os+' os.':'')+(r.stav==='pop'&&r.vytvoreno?(function(){var c=Math.floor((Date.now()-r.vytvoreno)/864e5);return ' · <em class="ru-c'+(c>=2?' dl':'')+'">čeká '+(c<1?'od dneška':c+' '+pl(c,'den','dny','dní'))+'</em>'})():'')+'</small></button>'+
        (KRAT[r.stav]?'<button type="button" class="btn sm" data-qs="'+r.id+'" data-st="'+AKCE[r.stav][0]+'" aria-label="'+AKCE[r.stav][1]+' – '+esc(r.jmeno)+'">'+KRAT[r.stav]+'</button>':bdg(r.stav))+'</li>'};
    var sloupec=function(n,L,dl,nic){var M=6,cel=rozb[dl];return '<section class="card ruk"><h2>'+n+'<span>'+L.length+'</span></h2>'+(L.length?'<ul>'+(cel?L:L.slice(0,M)).map(ukol).join('')+'</ul>'+(L.length>M?'<button type="button" class="ru-v" data-dl="'+dl+'" aria-expanded="'+!!cel+'">'+(cel?'Zobrazit méně':'Zobrazit všech '+L.length)+'</button>':''):'<p class="mut">'+nic+'</p>')+'</section>'};
    var poc={},G=skupiny(),mapa=G.map(function(g){
      var t=g.c.map(function(c){var k=g.k+'-'+c,r=akt.filter(function(r){return (r.mista||[]).indexOf(k)>=0&&r.od<=denP&&denP<r.do})[0],cis='<span class="rn-c">'+(g.k==='teepee'?'T':c)+'</span>';
        poc[g.k]=poc[g.k]||[0,0];poc[g.k][1]++;
        if(!r&&R.vyp().indexOf(k)>=0){poc[g.k][1]--;return '<div class="rn off" aria-label="'+esc(R.nazev(k))+', vypnuto z rezervace">'+cis+'<b>vypnuto</b></div>'}
        var od1=r?null:akt.filter(function(x){return x.stav!=='blk'&&x.stav!=='odj'&&x.do===denP&&(x.mista||[]).indexOf(k)>=0})[0];
        if(!r)return '<button type="button" class="rn vol" data-m="'+k+'" data-nm="'+k+'" aria-label="'+esc(R.nazev(k))+', volno'+(od1?', ráno odjíždí '+od1.jmeno:'')+'">'+cis+'<b>Volno</b>'+(od1?'<small class="rn-od" title="Ráno odjíždí '+esc(od1.jmeno)+'">odj. '+esc(od1.jmeno)+'</small>':'')+'</button>';
        poc[g.k][0]++;var tu=r.stav==='uby'||r.stav==='blk',o=r.osoby||{},os=(o.dosp||0)+(o.dite||0)+(o.zak||0);
        return '<button type="button" draggable="true" class="rn '+(r.stav==='blk'?'blk':tu?'obs':r.stav==='pop'?'popt':'ceka')+'" data-m="'+k+'" data-id="'+r.id+'" title="'+esc(r.jmeno+' · '+R.nazev(k)+' · '+KR(r.od)+' – '+KR(r.do)+(os?' · '+os+' os.':'')+' · '+R.STAVY[r.stav])+'" aria-label="'+esc(R.nazev(k)+', '+r.jmeno+', '+R.STAVY[r.stav]+', do '+KR(r.do))+'">'+cis+'<b>'+esc(r.jmeno)+'</b>'+(r.stav==='blk'?'<small>blokace do '+KR(r.do)+'</small>':'')+(!tu&&r.od===denP?'<em>přijíždí</em>':'')+'</button>'}).join(''),vol=(t.match(/class="rn vol"/g)||[]).length;
      return {g:g,t:t,vol:vol}});
    /* chatky vpravo nahoře + dole v jednom řádku, oddělené čarou */
    var rad=[];mapa.forEach(function(x){var p=rad[rad.length-1];if(p&&p.length===1&&/^c[nd]$/.test(p[0].g.id)&&/^c[nd]$/.test(x.g.id)&&p[0].g.id!==x.g.id)p.push(x);else rad.push([x])});
    mapa=rad.map(function(R2){var vol=0,cel=0;R2.forEach(function(x){vol+=x.vol;cel+=x.g.c.length});var n=R2.length>1?'Chatky vpravo':R2[0].g.n;
      return '<div class="rn-s"><h3>'+n+(R2.length>1?'<small class="rn-sub">'+R2.map(function(x){return x.g.n.replace('Chatky vpravo ','')}).join(' · ')+'</small>':'')+'<span class="rn-gv'+(vol?'':' nic')+'">'+(vol?vol+' '+pl(vol,'volné','volná','volných'):'plno')+'<small> z '+cel+'</small></span></h3><div class="rn-g">'+R2.map(function(x){return x.t}).join('<span class="rn-del" aria-hidden="true"></span>')+'</div></div>'}).join('');
    var souhrn=[['chatka','chatky'],['podsad','podsadové stany'],['teepee','teepee']].map(function(t){var x=poc[t[0]]||[0,0];return t[1]+' '+x[0]+' z '+x[1]}).join(' · ');
    var jeD=denP===dnes,dp=D0(denP),VM=[].concat.apply([],G.map(function(g){return g.c.map(function(c){return g.k+'-'+c})})).filter(function(k){return R.vyp().indexOf(k)<0});
    var TN=[['chatka','chatky'],['podsad','stany'],['teepee','teepee']].filter(function(t){return VM.some(function(k){return k.split('-')[0]===t[0]})});
    var volD=function(x){var u={},o={n:0};akt.forEach(function(r){if(r.od<=x&&x<r.do)(r.mista||[]).forEach(function(k){u[k]=1})});VM.forEach(function(k){if(!u[k]){var t=k.split('-')[0];o[t]=(o[t]||0)+1;o.n++}});return o};
    var z0=denP<dnes||denP>ISO(ADD(D0(dnes),13))?dp:D0(dnes),pas='';
    var CEL={};VM.forEach(function(k){var t=k.split('-')[0];CEL[t]=(CEL[t]||0)+1});
    var DD=[];for(var i=0;i<14;i++){var x=ADD(z0,i);DD.push({x:x,i:ISO(x),vo:volD(ISO(x))})}
    var bar=function(c,cel){var p=cel?c/cel:0;return c===0?'b0':p<=.25?'b1':p<=.5?'b2':'b3'};
    pas='<table class="rn-tb"><thead><tr><th scope="col"><span class="sr">Typ</span></th>'+DD.map(function(d){var x=d.x,on=d.i===denP;return '<th scope="col" class="'+(on?'on':'')+(d.i===dnes?' dn':'')+(x.getDay()%6===0?' we':'')+'"><button type="button" data-den="'+d.i+'" aria-pressed="'+on+'" aria-label="'+DL[x.getDay()]+' '+x.getDate()+'. '+MG[x.getMonth()]+', volno '+d.vo.n+'"><small>'+(d.i===dnes?'Dnes':DNY[x.getDay()])+'</small>'+x.getDate()+'. '+(x.getMonth()+1)+'.</button></th>'}).join('')+'</tr></thead><tbody>'+
      TN.map(function(t){return '<tr><th scope="row">'+t[1]+'<small>z '+CEL[t[0]]+'</small></th>'+DD.map(function(d){var c=d.vo[t[0]]||0;return '<td class="'+bar(c,CEL[t[0]])+(d.i===denP?' on':'')+(d.i===dnes?' dn':'')+'"><button type="button" data-den="'+d.i+'" tabindex="-1" aria-hidden="true">'+(c||'–')+'</button></td>'}).join('')+'</tr>'}).join('')+'</tbody></table>';
    return '<p class="rz-dat"><b>'+DL[d.getDay()]+' '+d.getDate()+'. '+MG[d.getMonth()]+'</b></p>'+
      '<section class="rn-w'+(zvV?' zv':'')+(jeD?' jd':'')+'"><div class="rn-hd"><h2>'+(jeD?'Kdo kde dnes je':'Kdo kde bude · '+DL[dp.getDay()].toLowerCase()+' '+dp.getDate()+'. '+MG[dp.getMonth()]+(dp.getFullYear()!==d.getFullYear()?' '+dp.getFullYear():''))+'</h2>'+
        '<span class="rn-leg" aria-hidden="true"><i class="obs"></i>Ubytovaný<i class="ceka"></i>Rezervace<i class="popt"></i>Poptávka<i class="vol"></i>Volno<i class="blk"></i>Blokace</span></div>'+
      '<div class="rn-nav"><button type="button" class="btn sm" data-dpos="-1" aria-label="Předchozí den">‹</button><label><span class="sr">Datum</span><input type="date" class="inp" id="rnd" value="'+denP+'"></label><button type="button" class="btn sm" data-dpos="1" aria-label="Další den">›</button>'+(jeD?'':'<button type="button" class="btn sm pri" data-dpos="0">Zpět na dnešek</button>')+'<button type="button" class="btn sm gh rn-zv" data-a="zv" aria-pressed="'+zvV+'">'+SV('<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',16)+' Zvýraznit volná</button>'+'<button type="button" class="btn sm gh" data-a="tisk">'+SV('<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/>',16)+' Tisk ubytování</button>'+
        '</div>'+
      '<p class="rn-dl">Volná místa v dalších dnech <span>· zelená = dost volna, oranžová = málo, červená = plno · kliknutím vyberete den</span></p><div class="rn-dny" role="group" aria-label="Vybrat den">'+pas+'</div>'+
      '<div class="rn-mh"><h3>Místa '+(jeD?'dnes':'· '+DL[dp.getDay()].toLowerCase()+' '+dp.getDate()+'. '+MG[dp.getMonth()])+'</h3></div>'+
      '<div class="rn-sg">'+mapa+'</div>'+
      '<p class="mut rn-p">Hosta přestěhujete přetažením na jiné místo, na obsazené místo se hosté prohodí. Kliknutím na volné místo založíte rezervaci'+(jeD?'.':' od '+KR(denP))+'</p></section>'+
      '<div class="ruk-g">'+sloupec('Přijíždí dnes',host.filter(function(r){return r.od===dnes&&r.stav!=='odj'&&r.stav!=='uby'}),0,'Dnes nikdo nepřijíždí.')+
        sloupec('Odjíždí dnes',host.filter(function(r){return r.do===dnes&&r.stav!=='odj'}),1,'Dnes nikdo neodjíždí.')+
        sloupec('Poptávky k potvrzení',host.filter(function(r){return r.stav==='pop'}).sort(podle),3,'Žádná poptávka nečeká.')+'</div>';
  }
  var rzT,rzW=0;window.addEventListener('resize',function(){clearTimeout(rzT);rzT=setTimeout(function(){if(!document.body.contains(box)||tab!=='kal'||box.clientWidth===rzW)return;rzW=box.clientWidth;kresli()},150)});
  function kal(akt){
    N=+KK.LS.get('rez.dni',31)||31;W=Math.max(N>31?16:26,Math.min(240,Math.floor((box.clientWidth-NW-22)/N)));
    var dny=[],i;for(i=0;i<N;i++)dny.push(ADD(zac,i));var iso=dny.map(ISO),m1=MES[dny[0].getMonth()],m2=MES[dny[N-1].getMonth()];
    var vrst=['repeating-linear-gradient(90deg,transparent 0 '+(W-1)+'px,#ece7dc '+(W-1)+'px '+W+'px)'];
    dny.forEach(function(d,i){var t=iso[i]===dnes,c=t?'rgba(244,166,74,.28)':(d.getDay()%6===0?'#f6f1e6':'');if(c)vrst[t?'unshift':'push']('linear-gradient('+c+','+c+') no-repeat '+i*W+'px 0/'+W+'px 100%')});
    dny.forEach(function(d,i){if(d.getDate()===1&&i)vrst.unshift('linear-gradient(#b9ad94,#b9ad94) no-repeat '+(i*W-1)+'px 0/2px 100%')});
    var bg=vrst.join(','),idx=function(s){return Math.round((D0(s)-zac)/864e5)};
    var pruh=function(r){var a=Math.max(0,idx(r.od)),b=Math.min(N,idx(r.do));if(b<=a)return '';
      return '<button type="button" draggable="true" class="rk-b '+r.stav+(filtr&&filtr!==r.stav?' dim':'')+'" data-id="'+r.id+'" style="left:'+(a*W+2)+'px;width:'+((b-a)*W-4)+'px" aria-label="'+esc(r.jmeno+', '+KR(r.od)+' – '+KR(r.do)+', '+R.STAVY[r.stav])+'">'+esc(r.jmeno)+'</button>'};
    var h='<div class="row rk-nav"><button type="button" class="btn sm gh" data-pos="'+(N>31?-28:-7)+'" aria-label="Zpět">‹</button><b>'+KR(iso[0])+' – '+KR(iso[N-1])+' '+dny[N-1].getFullYear()+'</b><button type="button" class="btn sm gh" data-pos="'+(N>31?28:7)+'" aria-label="Dál">›</button><button type="button" class="btn sm gh" data-pos="0">Dnes</button>'+
      '<label class="row rk-go">Přejít na <input type="date" class="inp" id="rkd" value="'+iso[2]+'"></label>'+
      '<label class="row rk-go">Zobrazit <select class="inp" id="rkn">'+[[7,'1 týden'],[14,'2 týdny'],[21,'3 týdny'],[31,'měsíc'],[62,'2 měsíce'],[92,'3 měsíce']].map(function(o){return '<option value="'+o[0]+'"'+(N===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></label>'+
      '<span class="rk-leg" role="group" aria-label="Zvýraznit stav">'+['pop','pot','uby','blk'].map(function(s){return '<button type="button" class="rs '+s+(filtr===s?' on':'')+'" data-fl="'+s+'" aria-pressed="'+(filtr===s)+'">'+R.STAVY[s]+'</button>'}).join('')+'</span></div>'+
      '<div class="card rk'+(W<30?' uz':'')+(W<22?' uz2':'')+'"><div class="rk-in" style="width:'+(NW+N*W)+'px"><div class="rk-h"><div class="rk-n">'+(m1===m2?m1:m1+' – '+m2)+' '+dny[N-1].getFullYear()+'</div>'+dny.map(function(d,i){return '<div class="rk-d'+(iso[i]===dnes?' td':d.getDay()%6===0?' we':'')+(d.getDate()===1&&i?' m1':'')+'" style="width:'+W+'px"'+(d.getDate()===1?' title="'+MES[d.getMonth()]+'"':'')+'><small>'+DNY[d.getDay()]+'</small><b>'+d.getDate()+'</b></div>'}).join('')+'</div>';
    skupiny().forEach(function(g,gi,GA){var kl=g.c.map(function(c){return g.k+'-'+c}),zav=sbal[g.id];
      var vol=kl.filter(function(k){return !akt.some(function(r){return (r.mista||[]).indexOf(k)>=0&&r.od<=dnes&&dnes<r.do})}).length;
      h+='<div class="rk-g" data-gid="'+g.id+'"><span><button type="button" class="rk-dg" draggable="true" data-dg="'+g.id+'" aria-label="Přesunout skupinu '+g.n+' – táhněte myší, nebo šipkami nahoru a dolů" title="Chytněte a přetáhněte skupinu jinam">⠿</button><button type="button" class="rk-gt" data-g="'+g.id+'" aria-expanded="'+!zav+'"><b>'+g.n+'</b> dnes v noci volné '+vol+' z '+kl.length+' · '+(zav?'rozbalit':'sbalit')+'</button>'+
        '</span></div>';
      if(!zav)kl.forEach(function(k){var vy=R.vyp().indexOf(k)>=0;h+='<div class="rk-r'+(vy?' off':'')+'"><div class="rk-n">'+R.nazev(k).replace('Podsadový stan','Stan')+(vy?'<small>vypnuto</small>':'')+'</div><div class="rk-t" data-m="'+k+'" style="width:'+N*W+'px;background:'+bg+'">'+akt.filter(function(r){return (r.mista||[]).indexOf(k)>=0}).map(pruh).join('')+'</div></div>'})});
    return h+'</div></div><p class="mut rk-p">Rezervaci přesunete přetažením pruhu, pořadí skupin přetažením za úchyt ⠿. Kliknutím na volné políčko založíte novou rezervaci. Den odjezdu je už volný pro dalšího hosta.</p>';
  }
  /* ---- seznam: filtry, řazení, rychlé akce ---- */
  var bez=function(t){return String(t==null?'':t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')};
  var KRAT={pop:'Potvrdit',pot:'Ubytovat',uby:'Odhlásit'};
  var typy=function(r){var t={};(r.mista||[]).forEach(function(k){t[k.split('-')[0]]=1});if(r.dalsi&&(r.dalsi.stan||r.dalsi.karavan))t.vlastni=1;if(r.lode&&R.lodePocet(r.lode))t.lode=1;if(r.doprava&&r.doprava.misto)t.doprava=1;if((r.mista||[]).length||t.vlastni)t.ubyt=1;return t};
  /* co se který den děje s loděmi a dopravou (společné pro Půjčovnu, Dopravu a tisk) */
  var sLod=function(r){return !!(r.lode&&R.lodePocet(r.lode))},posD=function(r){var d=R.lodeDny(r.lode);return d[d.length-1]};
  var denLode=function(akt,x){var S=akt.filter(sLod),o={vyd:S.filter(function(r){return r.lode.den===x}),vra:S.filter(function(r){return posD(r)===x}),voda:S.filter(function(r){return r.lode.den<x&&x<posD(r)})};
    o.jizdy=akt.filter(function(r){return r.doprava&&r.doprava.misto&&(r.doprava.den||(sLod(r)?r.lode.den:r.od))===x}).sort(function(a,b){return (a.doprava.cas||'99').localeCompare(b.doprava.cas||'99','cs',{numeric:true})||R.mistoN(a.doprava.misto).localeCompare(R.mistoN(b.doprava.misto),'cs')});
    o.navoz=o.vyd.filter(function(r){return r.lode.odkud&&r.lode.odkud!=='kemp'});o.svoz=o.vra.filter(function(r){return r.lode.kam&&r.lode.kam!=='kemp'});return o};
  var poMiste=function(L,klic){var m={};L.forEach(function(r){var k=r.lode[klic];(m[k]=m[k]||[]).push(r)});var po=R.mistaReky().map(function(x){return x.k});return Object.keys(m).sort(function(a,b){return po.indexOf(a)-po.indexOf(b)}).map(function(k){var kus={};m[k].forEach(function(r){Object.keys(r.lode.kusy).forEach(function(t){kus[t]=(kus[t]||0)+(+r.lode.kusy[t]||0)})});return {k:k,L:m[k],kusy:kus}})};
  var kusyTxt=function(kus){return Object.keys(kus).filter(function(k){return kus[k]>0}).map(function(k){return kus[k]+'× '+((KKC.p(k)||{}).n||k)}).join(', ')};
  var denNav=function(){return '<div class="row" style="gap:6px"><button type="button" class="btn sm gh" data-dpos="-7" aria-label="O týden zpět">‹‹</button><button type="button" class="btn sm gh" data-dpos="-1" aria-label="O den zpět">‹</button><button type="button" class="btn sm'+(denP===dnes?' pri':' gh')+'" data-dpos="0">Dnes</button><button type="button" class="btn sm gh" data-dpos="1" aria-label="O den dál">›</button><button type="button" class="btn sm gh" data-dpos="7" aria-label="O týden dál">››</button></div>'};
  var tiskBtn=function(t){return '<button type="button" class="btn sm gh" data-a="tisk">'+SV('<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/>',16)+t+'</button>'};
  /* ---- DOPRAVA: jízdy s lidmi, návoz lodí na start a svoz lodí z cíle na vybraný den ---- */
  function dopTab(akt){
    var d0=D0(denP),X=denLode(akt,denP),dny=[],i;for(i=0;i<14;i++)dny.push(ISO(ADD(d0,i)));
    var os=0,au=0;X.jizdy.forEach(function(r){os+=+r.doprava.osob||0;au+=R.aut(r.doprava.osob)});
    var h='<section class="card rv"><div class="row rv-h"><h2 style="margin:0">Doprava · '+(denP===dnes?'dnes':DNY[d0.getDay()]+' '+KR(denP))+'</h2><span class="mut">'+(X.jizdy.length?X.jizdy.length+' '+pl(X.jizdy.length,'jízda','jízdy','jízd')+' · '+os+' '+pl(os,'osoba','osoby','osob')+' · '+au+' '+pl(au,'auto','auta','aut'):'')+'</span><span class="sp"></span>'+denNav()+tiskBtn('Tisk dopravy')+'</div>'+
      '<div class="rd-dny">'+dny.map(function(d){var x=D0(d),Y=denLode(akt,d),n=Y.jizdy.length,l=Y.navoz.length+Y.svoz.length;return '<button type="button" data-den="'+d+'" aria-pressed="'+(d===denP)+'" class="'+(x.getDay()%6?'':'vik')+'"><small>'+DNY[x.getDay()]+' '+x.getDate()+'. '+(x.getMonth()+1)+'.</small><b>'+(n||'–')+'</b><i>'+(n?pl(n,'jízda','jízdy','jízd'):l?'jen lodě':'nic')+'</i></button>'}).join('')+'</div></section>';
    h+='<section class="card rv" style="margin-top:16px"><h2 style="margin:0 0 4px">Doprava osob na start</h2><p class="mut" style="margin:0 0 10px">Koho, v kolik a kam vezete. Jedno auto pojme 8 osob.</p>'+
      (X.jizdy.length?'<div class="tw-wrap"><table class="ct rv-l"><thead><tr><th>Odjezd</th><th>Kam</th><th>Host</th><th class="n">Osob</th><th class="n">Aut</th><th>Lodě</th><th>Platba</th></tr></thead><tbody>'+X.jizdy.map(function(r){return '<tr><td><b class="rd-cas">'+esc(r.doprava.cas||'–')+'</b></td><td><b>'+esc(R.mistoN(r.doprava.misto))+'</b></td><td class="rl-h"><button type="button" class="rl-j" data-id="'+r.id+'">'+esc(r.jmeno)+'</button><small>'+(r.telefon?esc(r.telefon):esc(r.cislo||''))+'</small></td><td class="n">'+(r.doprava.osob||0)+'</td><td class="n">'+R.aut(r.doprava.osob)+'</td><td>'+(esc(LK(r))||'<span class="mut">bez lodí</span>')+'</td><td>'+(pbdg(r)||'<span class="mut">na místě</span>')+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="mut" style="margin:0">Na tento den si dopravu nikdo neobjednal.</p>')+'</section>';
    var blok=function(nad,pop,G,klic,nic){return '<section class="card rv" style="margin-top:16px"><h2 style="margin:0 0 4px">'+nad+'</h2><p class="mut" style="margin:0 0 10px">'+pop+'</p>'+(G.length?'<ul class="rd-m">'+G.map(function(g){return '<li><div><b>'+esc(R.mistoN(g.k))+'</b><span>'+esc(kusyTxt(g.kusy))+'</span></div><small>'+g.L.map(function(r){return '<button type="button" class="lnk" data-id="'+r.id+'">'+esc(r.jmeno)+'</button> ('+esc(LK(r))+')'}).join(', ')+'</small></li>'}).join('')+'</ul>':'<p class="mut" style="margin:0">'+nic+'</p>')+'</section>'};
    h+=blok('Návoz lodí na start','Kam je potřeba ten den zavézt lodě a vybavení.',poMiste(X.navoz,'odkud'),'odkud','Žádný návoz.')+blok('Svoz lodí z cíle','Kde hosté ten den končí a odkud je potřeba lodě odvézt zpět do kempu.',poMiste(X.svoz,'kam'),'kam','Žádný svoz.');
    return h}
  /* ---- PŮJČOVNA: dostupnost lodí a vybavení po dnech + výdej na vybraný den ---- */
  function lodeTab(akt){
    var T=R.lodeTypy(),C=R.lodeCelkem(),dny=[],i,d0=D0(denP);for(i=0;i<14;i++)dny.push(ISO(ADD(d0,i)));
    var ri=function(k){return k in R.VYB},obs=dny.map(function(d){return R.lodeObs(d)}),RD=T.map(function(p){return [p.k,p.n,p.pozn||'']}).concat(Object.keys(R.VYB).map(function(k){return [k,R.VYB[k],'vybavení']}));
    var bun=function(k,j){var c=C[k]||0,v=c-(obs[j][k]||0),cl=v<0?'min':v===0?'nic':c&&v/c<=.2?'malo':'ok';return '<td class="rv-c '+cl+(dny[j]===denP?' ted':'')+'" title="'+esc(RD.filter(function(x){return x[0]===k})[0][1])+' '+KR(dny[j])+': volných '+v+' z '+c+'"><b>'+v+'</b></td>'};
    /* co je právě venku (vydané a nevrácené) */
    var VEN=R.vse().filter(function(r){var x=LS(r);return r.stav!=='zru'&&(x==='vyd'||x==='cast')}).sort(function(a,b){return posD(a).localeCompare(posD(b))||a.jmeno.localeCompare(b.jmeno,'cs')}),venK={};
    VEN.forEach(function(r){var v=R.lodeVen(r);Object.keys(v).forEach(function(k){venK[k]=(venK[k]||0)+v[k]})});
    var k2=R.vse().filter(function(r){return r.stav!=='zru'&&LS(r)==='res'&&r.lode.den===dnes}),po=VEN.filter(function(r){return posD(r)<dnes}).length;
    var h='<section class="card rv rve"><div class="row rv-h"><h2 style="margin:0">Teď venku</h2><span class="mut">'+(VEN.length?VEN.length+' '+pl(VEN.length,'host','hosté','hostů')+(po?' · <b class="zle">'+po+' po termínu</b>':''):'všechno je doma')+'</span><span class="sp"></span>'+(k2.length?'<span class="rve-k">Dnes k výdeji: <b>'+k2.length+'</b></span>':'')+'</div>'+
      '<div class="rve-g">'+RD.map(function(x){var c=C[x[0]]||0,v=venK[x[0]]||0,pr=c?Math.min(100,Math.round(v/c*100)):0;return '<div class="rve-c'+(ri(x[0])?' vb':'')+'"><span>'+esc(x[1])+'</span><b>'+(c-v)+'<small> / '+c+' doma</small></b><i class="rve-b"><i style="width:'+pr+'%"></i></i><em>'+(v?v+' venku':'nic venku')+'</em></div>'}).join('')+'</div>'+
      (VEN.length?'<div class="tw-wrap"><table class="ct rv-l"><thead><tr><th>Host</th><th>Má u sebe</th><th>Vydáno</th><th>Vrátit</th><th>Kde končí</th><th></th></tr></thead><tbody>'+VEN.map(function(r){var p=posD(r)<dnes;
        return '<tr class="'+(p?'rve-po':'')+'"><td class="rl-h"><button type="button" class="rl-j" data-id="'+r.id+'">'+esc(r.jmeno)+'</button><small>'+(r.telefon?'<a href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':esc(r.cislo||''))+'</small></td><td><b>'+esc(R.lodeKusyTxt(R.lodeVen(r)))+'</b>'+(LS(r)==='cast'?'<small class="rv-sm">část už vrátil</small>':'')+'</td><td>'+cas(r.lode.vydano.kdy)+'</td><td>'+(p?'<b class="zle">'+KR(posD(r))+' – po termínu</b>':posD(r)===dnes?'<b>dnes</b>':KR(posD(r)))+'</td><td>'+esc(R.mistoN(r.lode.kam))+'</td><td class="c">'+lodBtn(r,1)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="mut" style="margin:6px 0 0">Žádné lodě nejsou vydané. Výdej potvrdíte tlačítkem „Vydat lodě“ v seznamu níže nebo v detailu rezervace.</p>')+'</section>';
    h+='<section class="card rv" style="margin-top:16px"><div class="row rv-h"><h2 style="margin:0">Dostupnost lodí a vybavení</h2><span class="sp"></span>'+denNav()+'</div>'+
      '<p class="mut" style="margin:4px 0 12px">Číslo = kolik kusů je ten den ještě volných. Počítají se všechny nezrušené rezervace včetně těch, které čekají na zálohu.</p>'+
      '<div class="tw-wrap"><table class="rv-t"><thead><tr><th></th>'+dny.map(function(d){var x=D0(d);return '<th class="'+(d===denP?'ted':'')+(x.getDay()%6?'':' vik')+'"><button type="button" data-den="'+d+'" aria-pressed="'+(d===denP)+'"><small>'+DNY[x.getDay()]+'</small>'+x.getDate()+'. '+(x.getMonth()+1)+'.</button></th>'}).join('')+'<th class="rv-s">Celkem</th></tr></thead><tbody>'+
      RD.map(function(x,ri){return '<tr class="'+(ri===T.length?'rv-odd':'')+'"><th scope="row">'+esc(x[1])+(x[2]?'<small>'+esc(x[2])+'</small>':'')+'</th>'+dny.map(function(d,j){return bun(x[0],j)}).join('')+'<td class="rv-s">'+(C[x[0]]||0)+'</td></tr>'}).join('')+
      '</tbody></table></div><p class="rv-leg"><span class="rv-c ok">dost</span><span class="rv-c malo">dochází</span><span class="rv-c nic">vše půjčené</span><span class="rv-c min">chybí</span></p></section>';
    var L=akt.filter(function(r){return r.lode&&R.lodePocet(r.lode)&&R.lodeDny(r.lode).indexOf(denP)>=0}).sort(function(a,b){var x=(a.doprava&&a.doprava.cas)||'99',y=(b.doprava&&b.doprava.cas)||'99';return x.localeCompare(y,'cs',{numeric:true})||a.jmeno.localeCompare(b.jmeno,'cs')});
    var dd0=D0(denP),lodi=0,osD=0;L.forEach(function(r){if(r.lode.den===denP){lodi+=R.lodePocet(r.lode);if(r.doprava)osD+=+r.doprava.osob||0}});
    h+='<section class="card rv" style="margin-top:16px"><div class="row rv-h"><h2 style="margin:0">'+(denP===dnes?'Dnes':DNY[dd0.getDay()]+' '+KR(denP))+' na vodě</h2><span class="mut">'+(L.length?'vyplouvá '+lodi+' '+pl(lodi,'loď','lodě','lodí')+(osD?' · dopravou jede '+osD+' '+pl(osD,'osoba','osoby','osob'):''):'')+'</span><span class="sp"></span><button type="button" class="btn sm gh" data-a="tisk">'+SV('<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/>',16)+'Tisk výdeje lodí</button></div>'+
      (L.length?'<div class="tw-wrap"><table class="ct rv-l"><thead><tr><th>Host</th><th>Lodě a vybavení</th><th>Trasa</th><th>Doprava osob</th><th>Platba</th><th>Lodě</th></tr></thead><tbody>'+L.map(function(r){var l=r.lode,dn=R.lodeDny(l),zn=l.den===denP?'<em class="rl-z pri">Vyplouvá</em>':dn[dn.length-1]===denP?'<em class="rl-z odj">Vrací lodě</em>':'<em class="rl-z">Na vodě</em>';
        return '<tr><td class="rl-h"><button type="button" class="rl-j" data-id="'+r.id+'">'+esc(r.jmeno)+'</button><small>'+esc(r.cislo||'')+(r.telefon?' · '+esc(r.telefon):'')+'</small>'+zn+'</td><td><b>'+esc(LK(r))+'</b><small class="rv-sm">'+vybTxt(l)+(dn.length>1?' · '+dn.length+' '+pl(dn.length,'den','dny','dní'):'')+'</small></td><td>'+esc(R.mistoN(l.odkud))+' → '+esc(R.mistoN(l.kam))+'</td><td>'+(r.doprava&&l.den===denP?'<b>'+esc(r.doprava.cas||'')+'</b> · '+(r.doprava.osob||0)+' os. · '+R.aut(r.doprava.osob)+' '+pl(R.aut(r.doprava.osob),'auto','auta','aut'):'<span class="mut">—</span>')+'</td><td>'+(pbdg(r)||'<span class="mut">na místě</span>')+'</td><td class="rv-st">'+lsBdg(r)+lodBtn(r,1)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="mut" style="margin:10px 0 0">Na tento den nejsou půjčené žádné lodě.</p>')+'</section>';
    return h}
  function tabulka(L,gf){
    if(!L.length)return '<div class="card rl-0"><b>Nic tu není.</b><span class="mut">Zkuste jiné období, zrušit filtry nebo hledat jinak.</span></div>';
    var mes='',h='<section class="card rl"><div class="tw-wrap"><table class="ct rlt"><thead><tr><th class="rl-x"><input type="checkbox" data-va aria-label="Vybrat vše zobrazené"></th><th>Termín</th><th>Host</th><th>Telefon</th><th>Místa</th><th class="n">Osob</th><th class="n">Cena</th><th>Stav</th><th class="c"><span class="sr">Akce</span></th></tr></thead><tbody>';
    var sk={};if(gf||F.raz==='od')L.forEach(function(r){var d=D0(r.od),k=gf?gf(r):MES[d.getMonth()]+' '+d.getFullYear();sk[k]=(sk[k]||0)+1});
    L.slice(0,lim).forEach(function(r){var d=D0(r.od),mm=MES[d.getMonth()]+' '+d.getFullYear(),n=noci(r),o=r.osoby||{},os=(o.dosp||0)+(o.dite||0)+(o.zak||0),b=r.stav==='blk';
      if(gf)mm=gf(r);if((gf||F.raz==='od')&&mm!==mes){mes=mm;h+='<tr class="rl-m"><th colspan="9" scope="colgroup">'+mm+'<span>'+sk[mm]+'</span></th></tr>'}
      var zn=b?'':r.od===dnes?'<em class="rl-z pri">Přijíždí dnes</em>':r.do===dnes&&r.stav!=='odj'?'<em class="rl-z odj">Odjíždí dnes</em>':'';
      h+='<tr class="'+(r.stav==='zru'||r.stav==='odj'?'skr':'')+(VY[r.id]?' vyb':'')+'"><td class="rl-x"><input type="checkbox" data-vy="'+r.id+'"'+(VY[r.id]?' checked':'')+' aria-label="Vybrat – '+esc(r.jmeno)+'"></td><td class="rl-d"><b>'+KR(r.od)+' – '+KR(r.do)+((gf||F.raz!=='od')?' '+r.do.slice(0,4):'')+'</b><small>'+delka(r)+'</small>'+zn+'</td>'+
        '<td class="rl-h"><button type="button" class="rl-j" data-id="'+r.id+'">'+esc(r.jmeno)+'</button>'+stitky(r)+'<small>'+esc(r.cislo||'')+(r.zdroj==='web'?' · web':'')+(r.zprava?' · <span title="'+esc(r.zprava)+'">✎ poznámka</span>':'')+'</small></td>'+
        '<td class="rl-t">'+(r.telefon?'<a href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'<span class="mut">—</span>')+'</td>'+
        '<td>'+(r.mista||[]).map(function(k){return '<span class="rl-c '+k.split('-')[0]+'">'+R.nazev(k).replace('Podsadový stan','Stan')+'</span>'}).join('')+(r.dalsi&&r.dalsi.stan?'<span class="rl-c">'+r.dalsi.stan+'× vl. stan</span>':'')+(r.dalsi&&r.dalsi.karavan?'<span class="rl-c">'+r.dalsi.karavan+'× karavan</span>':'')+(LK(r)?'<span class="rl-c lod">'+esc(LK(r))+'</span>':'')+(r.doprava?'<span class="rl-c lod">doprava</span>':'')+'</td>'+
        '<td class="n">'+(b?'':os||'—')+'</td><td class="n rl-k">'+(b?'':kc(r.cena))+'</td><td>'+bdg(r.stav)+pbdg(r)+'</td>'+
        '<td class="c">'+(lodBtn(r,1)&&(JL(r)||LS(r)!=='res')?lodBtn(r,1):r.stav==='pop'&&r.platba&&r.platba.stav==='ceka'?'<button type="button" class="btn sm" data-zp="'+r.id+'" aria-label="Záloha zaplacena – '+esc(r.jmeno)+'">Zaplaceno</button>':KRAT[r.stav]?'<button type="button" class="btn sm" data-qs="'+r.id+'" data-st="'+AKCE[r.stav][0]+'" aria-label="'+AKCE[r.stav][1]+' – '+esc(r.jmeno)+'">'+KRAT[r.stav]+'</button>':'')+'</td></tr>'});
    return h+'</tbody></table></div><div id="rhb" class="rhb" hidden></div>'+(L.length>lim?'<p class="rl-v"><span class="mut">Zobrazeno '+lim+' z '+L.length+'</span><button type="button" class="btn gh" data-a="vic">Zobrazit dalších '+Math.min(100,L.length-lim)+'</button></p>':'')+'</section>';
  }
  var radit=function(L){var k=F.raz;return L.sort(function(a,b){if(k==='nove')return (b.vytvoreno||0)-(a.vytvoreno||0);if(k==='jmeno')return bez(a.jmeno).localeCompare(bez(b.jmeno));return a.od<b.od?-1:a.od>b.od?1:(a.jmeno<b.jmeno?-1:1)})};
  function sez(A){
    var tyd=ISO(ADD(D0(dnes),7));
    var L=A.filter(function(r){var o=F.obd;
      if(o==='bud'&&!(r.do>=dnes))return false;if(o==='ted'&&!(r.od<=dnes&&dnes<r.do))return false;if(o==='pri'&&r.od!==dnes)return false;if(o==='odj'&&r.do!==dnes)return false;
      if(o==='tyd'&&!(r.od>=dnes&&r.od<tyd))return false;if(o==='min'&&!(r.do<dnes))return false;
      if(F.od&&r.do<F.od)return false;if(F.do&&r.od>F.do)return false;
      if(F.typ&&!typy(r)[F.typ])return false;if(F.zdroj&&(r.zdroj||'rucne')!==F.zdroj)return false;return true});
    var poc={};L.forEach(function(r){poc[r.stav]=(poc[r.stav]||0)+1});var vse=L.length;
    if(F.stav)L=L.filter(function(r){return r.stav===F.stav});radit(L);
    posl=L;
    var sel=function(f,l,O){return '<label class="rl-f"><span>'+l+'</span><select class="inp" data-f="'+f+'">'+O.map(function(o){return '<option value="'+o[0]+'"'+(F[f]===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></label>'};
    var zmeneno=Object.keys(F0).some(function(k){return F[k]!==F0[k]});
    var noc=0,kcs=0,osb=0;L.forEach(function(r){if(r.stav==='blk')return;noc+=noci(r);kcs+=+r.cena||0;var o=r.osoby||{};osb+=(o.dosp||0)+(o.dite||0)+(o.zak||0)});
    var OB=[['bud','Aktuální a budoucí'],['pri','Přijíždí dnes'],['odj','Odjíždí dnes'],['ted','Právě ubytovaní'],['tyd','Příštích 7 dní'],['min','Minulé'],['','Vše']];
    return '<section class="rl-bar">'+
        '<div class="rz-seg rl-ob" role="group" aria-label="Období">'+OB.map(function(o){return '<button type="button" data-fo="'+o[0]+'" aria-pressed="'+(F.obd===o[0])+'">'+o[1]+'</button>'}).join('')+'</div>'+
        '<div class="rl-fr">'+sel('typ','Obsahuje',[['','Cokoli'],['ubyt','Ubytování'],['lode','Lodě'],['doprava','Doprava'],['chatka','Chatky'],['podsad','Podsadové stany'],['teepee','Teepee'],['vlastni','Vlastní stany a karavany']])+
        sel('raz','Řadit',[['od','Podle příjezdu'],['nove','Nejnovější'],['jmeno','Podle jména']])+
        (vicF||F.zdroj||F.od||F.do?sel('zdroj','Zdroj',[['','Web i obsluha'],['web','Z webu'],['rucne','Zadala obsluha']])+
        '<label class="rl-f"><span>Pobyt od</span><input type="date" class="inp" data-f="od" value="'+F.od+'"></label><label class="rl-f"><span>do</span><input type="date" class="inp" data-f="do" value="'+F.do+'"></label>':'<button type="button" class="btn sm gh" data-a="vicf">+ Další filtry</button>')+
        (zmeneno?'<button type="button" class="btn sm gh rl-x" data-a="frst">Zrušit filtry</button>':'')+'</div>'+
        '<div class="rl-st" role="group" aria-label="Stav"><button type="button" class="rs vse'+(F.stav?'':' on')+'" data-fs="" aria-pressed="'+!F.stav+'">Všechny stavy <b>'+vse+'</b></button>'+
        Object.keys(R.STAVY).filter(function(k){return poc[k]||F.stav===k}).map(function(k){return '<button type="button" class="rs '+k+(F.stav===k?' on':'')+'" data-fs="'+k+'" aria-pressed="'+(F.stav===k)+'">'+R.STAVY[k]+' <b>'+(poc[k]||0)+'</b></button>'}).join('')+'</div></section>'+
      '<div class="rl-sum"><span><b>'+L.length+'</b> '+pl(L.length,'rezervace','rezervace','rezervací')+'</span><span><b>'+noc+'</b> '+pl(noc,'noc','noci','nocí')+'</span><span><b>'+osb+'</b> '+pl(osb,'osoba','osoby','osob')+'</span><span><b>'+kc(kcs)+'</b> celkem</span>'+(L.length?'<button type="button" class="btn sm gh" data-a="csv">'+SV('<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',16)+'Stáhnout do Excelu</button>'+tiskBtn('Tisk seznamu'):'')+'</div>'+tabulka(L);
  }
  /* ---- chytré hledání přes všechny rezervace: jméno, číslo, telefon, e-mail, místo, datum, stav, poznámka ---- */
  function hledej(A,dotaz){
    var t=bez(dotaz).replace(/\+?\d[\d ]{6,}\d/g,function(x){return x.replace(/ /g,'')}).replace(/(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{4}))?/g,function(_,d,m,y){return ' @'+d+'.'+m+'.'+(y||'')+' '}).replace(/(chatk[a-z]*|stan[a-z]*|c\.|cislo)\s*(\d{1,2})(?!\d|\.)/g,function(_,a,n){return ' #'+(a[0]==='s'?'stan':a[0]==='c'&&a[1]==='h'?'chatka':'')+'_'+n+' '}).split(/\s+/).filter(Boolean);
    if(!t.length)return [];
    return A.filter(function(r){
      var tx=bez([r.jmeno,r.cislo,r.email,r.zprava,mistaTxt(r),R.STAVY[r.stav],r.zdroj==='web'?'web':'obsluha rucne',r.kdo,KR(r.od),KR(r.do),r.od,r.do,MES[D0(r.od).getMonth()],MES[D0(r.do).getMonth()]].join(' ')),tel=String(r.telefon||'').replace(/\D/g,'');
      return t.every(function(w){
        if(w[0]==='@'){var p=w.slice(1).split('.'),y1=+r.od.slice(0,4),y2=+r.do.slice(0,4),y;for(y=p[2]?+p[2]:y1;y<=(p[2]?+p[2]:y2);y++){var d=y+'-'+('0'+p[1]).slice(-2)+'-'+('0'+p[0]).slice(-2);if(r.od<=d&&d<=r.do)return true}return false}
        if(w[0]==='#'){var k=w.slice(1).split('_');return (r.mista||[]).some(function(m){var x=m.split('-');return x[1]===k[1]&&(!k[0]||(k[0]==='stan'?x[0]==='podsad':x[0]==='chatka'))})}
        if(/^\+?\d{3,}$/.test(w)&&tel.indexOf(w.replace(/\D/g,''))>=0)return true;
        return tx.indexOf(w)>=0})});
  }
  function vysledky(A){
    var cast=function(r){return r.od<=dnes&&r.do>=dnes?0:r.od>dnes?1:2},GN=['Právě teď v kempu','Budoucí','Minulé'];
    var L=hledej(A,q).sort(function(a,b){var x=cast(a),y=cast(b);if(x!==y)return x-y;if(x===2)return a.do>b.do?-1:a.do<b.do?1:0;return a.od<b.od?-1:a.od>b.od?1:(a.jmeno<b.jmeno?-1:1)});
    return '<div class="row" style="margin-bottom:12px;justify-content:space-between"><h2 style="margin:0;font-size:18px">Výsledky hledání „'+esc(q)+'“: '+L.length+'</h2><button type="button" class="btn sm gh" data-a="qx">Zrušit hledání</button></div>'+
      (L.length?'':'<p class="mut" style="margin:0 0 12px">Hledá se ve všech rezervacích bez ohledu na filtry: jméno, číslo rezervace, telefon, e-mail, poznámka, stav, místo (např. „chatka 12“, „stan 3“, „teepee“) i datum (např. „16. 7.“ najde pobyty, které ten den probíhají). Více slov zúží výsledek.</p>')+tabulka(L,function(r){return GN[cast(r)]});
  }
  function nas(){
    var n=R.nast();
    var ub=(window.KKC?KKC.kat('ubytovani'):[]).filter(function(p){return p.skryt!==1}),vy=R.vyp(),dis=adm?'':' disabled';
    var NT=[['rez','Rezervování'],['pujc','Půjčovna a zálohy'],['mista','Místa a blokace'],['mail','E-maily']].concat(adm?[['data','Testovací data']]:[]);if(!NT.some(function(x){return x[0]===nT}))nT='rez';
    var h='<div class="rnt-tabs" role="tablist" aria-label="Části nastavení">'+NT.map(function(x){return '<button type="button" role="tab" data-nt="'+x[0]+'" aria-selected="'+(x[0]===nT)+'">'+x[1]+'</button>'}).join('')+'</div>';
    if(nT==='rez'){
      var POP={bez:['Bez rezervace','Host jen přijede, na webu se nenabízí k rezervaci.'],poptavka:['Poptávka','Host pošle poptávku, místo se podrží a potvrzujete vy.'],ihned:['Ihned','Rezervace platí hned po odeslání, nic nepotvrzujete.']};
      return h+'<section class="card rjr"><h2>Jak se rezervuje</h2><p class="mut" style="margin:0 0 4px">U každého typu ubytování vyberte jednu možnost. Platí pro nové rezervace z webu.</p>'+
        '<ul class="rjr-l">'+ub.map(function(p){var ma=!!n.rezim[p.k],v=p.rez===0?'bez':ma?n.rezim[p.k]:'poptavka',V=ma?['bez','poptavka','ihned']:['bez','poptavka'];
          return '<li><div><b>'+esc(p.n)+'</b><small>'+POP[v][1]+'</small></div><div class="rjr-s" role="radiogroup" aria-label="'+esc(p.n)+'">'+V.map(function(x){return '<button type="button" role="radio" class="'+x+'" aria-checked="'+(x===v)+'" data-rz="'+p.k+'" data-rv="'+x+'"'+dis+'>'+POP[x][0]+'</button>'}).join('')+'</div></li>'}).join('')+'</ul>'+
        '<dl class="rjr-v"><div><dt>Bez rezervace</dt><dd>Na webu se napíše „stačí přijet“, obsazenost se nehlídá.</dd></div><div><dt class="poptavka">Poptávka</dt><dd>Přijde jako poptávka. Potvrdíte ji, nebo zrušíte.</dd></div><div><dt class="ihned">Ihned</dt><dd>Vznikne rovnou rezervace a místo je obsazené.</dd></div></dl>'+
        '<p class="mut" style="font-size:13.5px;margin:12px 0 0">Když si host vybere víc typů najednou a aspoň u jednoho je Poptávka, přijde celá rezervace jako poptávka.</p>'+(adm?'':'<p class="mut">Změnit to smí jen správce.</p>')+'</section>'}
    if(nT==='pujc'){
      var Z=R.zaloha(),S=R.sklad(),T=R.lodeTypy(),pot={padla:0,vesty:0,barely:0};T.forEach(function(p){var x=S.lode[p.k];['padla','vesty','barely'].forEach(function(k){pot[k]+=(+x.ks||0)*(+x[k]||0)})});
      var ni=function(a,v,lbl,max){return '<input class="inp num" type="number" min="0" max="'+(max||9999)+'" inputmode="numeric" data-sk="'+a+'" value="'+v+'" aria-label="'+esc(lbl)+'"'+dis+'>'};
      return h+'<section class="card rzl"><h2>Zálohy</h2><p class="mut" style="margin:0 0 12px">Host po odeslání rezervace dostane e-mail s výzvou k platbě. Místa i lodě se mu drží do data splatnosti. Když kliknete na „Záloha zaplacena“, rezervace se potvrdí. Když záloha nepřijde, rezervace sama propadne.</p>'+
        '<div class="sw-l"><label class="sw"><input type="checkbox" data-zl="zap"'+(Z.zap?' checked':'')+dis+'><span aria-hidden="true"></span>Vyžadovat zálohu u rezervací z webu</label></div>'+
        (Z.zap?'<div class="rzl-g"><div class="rzl-f"><span>Výše zálohy</span><div class="rjr-s" role="radiogroup" aria-label="Výše zálohy">'+[['proc','Procento z ceny'],['castka','Pevná částka'],['vse','Celá cena předem']].map(function(x){return '<button type="button" role="radio" aria-checked="'+(Z.typ===x[0])+'" data-zt="'+x[0]+'"'+dis+'>'+x[1]+'</button>'}).join('')+'</div></div>'+
        (Z.typ==='vse'?'':'<label class="rzl-f"><span>'+(Z.typ==='proc'?'Kolik procent':'Částka')+'</span><span class="row" style="gap:6px"><input class="inp num" type="number" min="0" max="'+(Z.typ==='proc'?100:999999)+'" step="'+(Z.typ==='proc'?5:100)+'" data-zl="hodnota" value="'+(+Z.hodnota||0)+'"'+dis+'> '+(Z.typ==='proc'?'%':'Kč')+'</span></label>')+
        '<label class="rzl-f"><span>Splatnost (platnost rezervace bez zálohy)</span><span class="row" style="gap:6px"><input class="inp num" type="number" min="0" max="60" data-zl="lhuta" value="'+(+Z.lhuta||0)+'"'+dis+'> '+pl(+Z.lhuta||0,'den','dny','dní')+' od odeslání</span></label>'+
        '<label class="rzl-f s2"><span>Číslo účtu pro zálohy</span><input class="inp" data-zl="ucet" value="'+esc(Z.ucet||'')+'" placeholder="např. 123456789/0100" autocomplete="off"'+dis+'></label></div>'+
        '<p class="mut" style="font-size:13.5px;margin:12px 0 0">Příklad: rezervace za 5 000 Kč → záloha <b>'+kc(R.zalohaCastka(5000))+'</b>, splatnost '+KR(R.splatnost('2099-01-01',dnes))+' (nejpozději v den příjezdu). Variabilní symbol je číslo rezervace.'+(Z.ucet?'':' <b>Číslo účtu zatím chybí</b> – v e-mailu s výzvou bude prázdné.')+'</p>':'<p class="mut" style="margin:0">Vypnuto: nic se neplatí předem, rezervace fungují jako dosud (poptávka / ihned).</p>')+'</section>'+
        '<section class="card rsk" style="margin-top:16px"><h2>Sklad půjčovny</h2><p class="mut" style="margin:0 0 12px">Kolik čeho máte. Podle toho systém hlídá dostupnost na každý den a nepustí rezervaci, na kterou by něco chybělo. Typy lodí a ceny se upravují v Ceníku.</p>'+
        '<div class="tw-wrap"><table class="ct rsk-t"><thead><tr><th>Loď</th><th class="n">Kusů</th><th class="n">Pádel na loď</th><th class="n">Vest na loď</th><th class="n">Barelů na loď</th></tr></thead><tbody>'+
        T.map(function(p){var x=S.lode[p.k];return '<tr><td><b>'+esc(p.n)+'</b><small>'+esc(p.pozn||'')+'</small></td><td class="n">'+ni('lode.'+p.k+'.ks',x.ks,p.n+' – kusů')+'</td><td class="n">'+ni('lode.'+p.k+'.padla',x.padla,p.n+' – pádel',20)+'</td><td class="n">'+ni('lode.'+p.k+'.vesty',x.vesty,p.n+' – vest',20)+'</td><td class="n">'+ni('lode.'+p.k+'.barely',x.barely,p.n+' – barelů',20)+'</td></tr>'}).join('')+'</tbody></table></div>'+
        '<h3 style="margin:18px 0 8px;font-size:15px">Vybavení celkem</h3><div class="rsk-v">'+Object.keys(R.VYB).map(function(k){var malo=S.vyb[k]<pot[k];return '<label class="rzl-f"><span>'+R.VYB[k]+'</span>'+ni('vyb.'+k,S.vyb[k],R.VYB[k]+' celkem')+'<small class="'+(malo?'zle':'')+'">na všechny lodě je potřeba '+pot[k]+'</small></label>'}).join('')+'</div>'+(adm?'':'<p class="mut">Změnit to smí jen správce.</p>')+'</section>'}
    if(nT==='mista'){
      var BL=R.vse().filter(function(r){return r.stav==='blk'&&r.do>dnes}).sort(function(a,b){return a.od<b.od?-1:1}),VSE=[].concat.apply([],R.SKUPINY.map(function(g){return g.c.map(function(c){return g.k+'-'+c})}));
      return h+'<section class="card rco"><h2>Vypnout místa z rezervací</h2><p class="mut" style="margin:0 0 12px">Vypnuté místo se hostům nenabízí a nedá se na něj rezervovat, dokud ho zase nezapnete – třeba chatka pro personál. Klikněte na číslo.</p>'+
        R.SKUPINY.filter(function(g){return R.rezTyp(g.k)}).map(function(g){return '<div class="rco-g"><small>'+g.n+'</small><div>'+g.c.map(function(c){var k=g.k+'-'+c,off=vy.indexOf(k)>=0;return '<button type="button" class="rco-m'+(off?' off':'')+'" data-vm="'+k+'" aria-pressed="'+!off+'" aria-label="'+R.nazev(k)+(off?', vypnuto':', zapnuto')+'"'+dis+'>'+(g.k==='teepee'?'Teepee':c)+'</button>'}).join('')+'</div></div>'}).join('')+
        '<p class="mut" style="font-size:13.5px;margin:12px 0 0">Přeškrtnuté = vypnuté. Rezervace, které už na vypnutém místě jsou, zůstanou.</p></section>'+
        '<section class="card rbl" style="margin-top:16px"><div class="row" style="justify-content:space-between;gap:10px;margin-bottom:6px"><h2 style="margin:0">Blokace na určitý termín</h2>'+(adm?'<button type="button" class="btn gh sm" data-a="blk">Blokovat místa</button>':'')+'</div>'+
        '<p class="mut" style="margin:0 0 12px">Místo se hostům nenabízí jen ve zvolených dnech – třeba oprava nebo akce.</p>'+
        (BL.length?'<ul class="rbl-l">'+BL.map(function(r){var n=noci(r),cely=(r.mista||[]).length>=VSE.length;return '<li><button type="button" data-id="'+r.id+'"><span class="rbl-d">'+KR(r.od)+(n>1?' – '+KR(ISO(ADD(D0(r.do),-1))):'')+' '+r.od.slice(0,4)+'<small>'+n+' '+pl(n,'den','dny','dní')+'</small></span><span class="rbl-t"><b>'+esc(r.jmeno)+'</b><small>'+(cely?'Celý kemp':esc(kratM(r)))+'</small></span></button></li>'}).join('')+'</ul>':'<p class="mut" style="margin:0;font-size:14px">Žádné nadcházející blokace.</p>')+'</section>'}
    if(nT==='mail')
      return h+'<section class="card sb"><h2>Šablony e-mailů</h2><p class="mut" style="margin:0 0 12px">Texty, které se automaticky posílají hostům a vám. Údaje v závorkách (např. {jmeno}) se při odeslání nahradí údaji z rezervace. Odesílat se začnou po spuštění na serveru.</p>'+
        '<label class="sb-l sb-em">E-mail kempu pro upozornění<input class="inp" type="email" id="sbem" placeholder="např. info@kemp-krumlov.cz" value="'+esc(n.emailKemp||'')+'"'+dis+'></label>'+
        '<div class="sb-ty" role="tablist" aria-label="Druh e-mailu">'+R.SABL_TYPY.map(function(x){return '<button type="button" role="tab" data-sb="'+x.k+'" aria-selected="'+(x.k===sbT)+'"><b>'+esc(x.n)+'</b><small>'+(x.kdo==='kemp'?'pro kemp':'pro hosta')+'</small></button>'}).join('')+'</div>'+
        '<div id="sbed">'+sbHtml()+'</div></section>';
    return h+'<section class="card"><h2>Testovací data</h2><p class="mut" style="margin:0 0 12px">'+SV(IC.zamek,16)+' V náhledu jsou rezervace uložené jen v tomto prohlížeči. Host na jiném počítači je neuvidí a jeho rezervace se k vám nedostane. Sdílená obsazenost bude fungovat po spuštění na serveru.</p>'+
      '<div class="row"><button type="button" class="btn gh" data-a="ukazka">Vložit testovací data</button><button type="button" class="btn gh" data-a="vymaz">Smazat všechny rezervace</button></div></section>';
  }
  /* hromadné akce v seznamu */
  var HA=[['pot','Potvrdit',function(r){return r.stav==='pop'}],['uby','Ubytovat',function(r){return r.stav==='pot'}],['odj','Odhlásit',function(r){return r.stav==='uby'}],['zru','Zrušit',function(r){return r.stav==='pop'||r.stav==='pot'}]];
  function vybrane(){var a=R.vse();return a.filter(function(r){return VY[r.id]})}
  function hromBar(){var e=$('#rhb',box);if(!e)return;var V=vybrane();Object.keys(VY).forEach(function(k){if(!V.some(function(r){return r.id===k}))delete VY[k]});
    var va=$('[data-va]',box),cb=$$('[data-vy]',box);if(va){var n=cb.filter(function(c){return c.checked}).length;va.checked=n>0&&n===cb.length;va.indeterminate=n>0&&n<cb.length}
    e.hidden=!V.length;if(!V.length)return;
    e.innerHTML='<b>Vybráno '+V.length+'</b><span class="rhb-a">'+HA.map(function(a){var c=V.filter(a[2]).length;return c?'<button type="button" class="btn sm" data-ha="'+a[0]+'">'+a[1]+' ('+c+')</button>':''}).join('')+
      '<button type="button" class="btn sm gh" data-ha="csv">Export CSV</button>'+(adm?'<button type="button" class="btn sm gh rp-d" data-ha="del">Smazat</button>':'')+'</span><button type="button" class="btn sm gh" data-ha="nic">Zrušit výběr</button>'}
  function hromAkce(k){var V=vybrane();
    if(k==='nic'){VY={};kresli();return}
    if(k==='csv'){csv(V,'vyber');return}
    if(k==='del'){ptej('Smazat '+V.length+' '+pl(V.length,'vybraný záznam','vybrané záznamy','vybraných záznamů')+'?\n\nZmizí z kalendáře, seznamu i historie. Když hosté jen odřekli, použijte raději „Zrušit“.',{ok:'Smazat',nebezp:1}).then(function(ok){if(!ok)return;var sn=snap();V.forEach(function(r){R.smaz(r.id)});KK.zaznam('Rezervace','hromadně smazáno: '+V.length);VY={};kresli();tz('Smazáno: '+V.length+'.',sn)});return}
    var a=HA.filter(function(x){return x[0]===k})[0],C=V.filter(a[2]),mimo=k==='uby'?C.filter(function(r){return r.od!==dnes}).length:k==='odj'?C.filter(function(r){return r.do!==dnes}).length:0;
    var jdi=function(){var sn=snap(),ok=0,chyba='';C.forEach(function(r){try{zmen(r.id,{stav:k},R.STAVY[k]);ok++}catch(x){chyba=x.message}});KK.zaznam('Rezervace','hromadně '+R.STAVY[k]+': '+ok);VY={};kresli();if(ok)tz(R.STAVY[k]+': '+ok+' '+pl(ok,'rezervace','rezervace','rezervací')+'.'+(chyba?' Některé nešly: '+chyba:''),sn);else toast(chyba||'Nic se nezměnilo.',1)};
    if(k==='zru'||mimo)ptej((k==='zru'?'Zrušit '+C.length+' '+pl(C.length,'rezervaci','rezervace','rezervací')+'?\n\nMísta se uvolní. Zrušené rezervace zůstanou v seznamu a jdou obnovit.':a[1]+' '+C.length+' '+pl(C.length,'hosta','hosty','hostů')+'?\n\nU '+mimo+' z nich termín nesedí s dnešním datem ('+KR(dnes)+').'),{ok:a[1],nebezp:k==='zru'}).then(function(ok){if(ok)jdi()});else jdi()}
  function csv(L,nazev){var Q=function(v){v=String(v==null?'':v);return /[";\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
    var rows=[['Číslo','Příjezd','Odjezd','Nocí','Jméno','Telefon','E-mail','Místa','Dospělí','Děti','Cena','Stav','Zdroj','Poznámka','Lodě','Trasa','Doprava osob','Záloha','Platba']].concat(L.map(function(r){var o=r.osoby||{};return [r.cislo||'',r.od,r.do,noci(r),r.jmeno,r.telefon||'',r.email||'',mistaTxt(r),o.dosp||0,(o.dite||0)+(o.zak||0),r.stav==='blk'?'':r.cena||0,R.STAVY[r.stav],r.zdroj==='web'?'web':'obsluha',r.zprava||'',LK(r),r.lode&&LK(r)?R.mistoN(r.lode.odkud)+' → '+R.mistoN(r.lode.kam):'',R.dopravaTxt(r.doprava),r.platba?r.platba.zaloha:'',r.platba?R.PLATBA[r.platba.stav]:'']}));
    var blob=new Blob(['\ufeff'+rows.map(function(x){return x.map(Q).join(';')}).join('\r\n')],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(blob),ln=document.createElement('a');ln.href=u;ln.download='rezervace-'+(nazev?nazev+'-':'')+dnes+'.csv';document.body.appendChild(ln);ln.click();ln.remove();setTimeout(function(){URL.revokeObjectURL(u)},1000)}
  /* jedna volba na typ: bez rezervace (ceník rez:0) / poptávka / ihned (nast.rezim) */
  function rezimTyp(k,v){var on=v!=='bez',p0=KKC.p(k)||{},byl=p0.rez!==0,hot=function(){if(on&&R.nast().rezim[k]){var n=R.nast();n.rezim[k]=v;R.ulozNast(n)}KK.zaznam('Rezervace',(p0.n||k)+': '+(v==='bez'?'bez rezervace':v==='ihned'?'okamžitá rezervace':'poptávka'));kresli();toast(v==='bez'?'Uloženo – na webu bude „stačí přijet“.':'Uloženo – platí pro nové rezervace z webu.')};
    if(on===byl){hot();return}
    KK.cenik.nacti().then(function(c){c=c||JSON.parse(JSON.stringify(KKC.vychozi));var p=(c.polozky||[]).filter(function(x){return x.k===k})[0];if(!p){p=JSON.parse(JSON.stringify(KKC.p(k)));c.polozky.push(p)}p.rez=on?1:0;return KK.cenik.uloz(c)}).then(function(){var p=KKC.p(k);if(p)p.rez=on?1:0;hot()}).catch(function(x){toast(x.message,1)})}
  /* tisk přehledu zvoleného dne: příjezdy, odjezdy + úklid, kdo zůstává */
  /* tisk podle části: Ubytování (příjezdy, odjezdy, úklid), Půjčovna (komu co vydat), Doprava (jízdy, návoz, svoz), Seznam (to, co je vyfiltrované) */
  function tisk(co){co=co||(tab==='lod'?'lod':tab==='dop'?'dop':tab==='sez'&&!q?'sez':'uby');
    var vse=R.vse().filter(function(r){return r.stav!=='zru'&&r.stav!=='blk'}),x=denP,d=D0(x),DL=['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'],den=DL[d.getDay()]+' '+d.getDate()+'. '+(d.getMonth()+1)+'. '+d.getFullYear();
    var os=function(r){var o=r.osoby||{},dt=(o.dite||0)+(o.zak||0);return (o.dosp||0)+(dt?' + '+dt+' d.':'')||'–'};
    var TB=function(L,sl,raz){return L.length?'<table><thead><tr><th style="width:26px"></th>'+sl.map(function(c){return '<th>'+c[0]+'</th>'}).join('')+'</tr></thead><tbody>'+(raz?L.slice().sort(raz):L).map(function(r){return '<tr><td><span class="tk-ch"></span></td>'+sl.map(function(c){return '<td>'+c[1](r)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table>':'<p class="tk-nic">Nic.</p>'};
    var J=['Host',function(r){return '<b>'+esc(r.jmeno)+'</b>'}],T=['Telefon',function(r){return '<span class="tk-nw">'+esc(r.telefon||'')+'</span>'}],O=['Osoby',os],PZ=['Poznámka',function(r){return esc(r.zprava||'')}];
    var PL=['K úhradě',function(r){var p=r.platba;return p?(p.stav==='vse'?'zaplaceno':p.stav==='zal'?'<b>'+kc(Math.max(0,(+r.cena||0)-(+p.zaloha||0)))+'</b>':'<b>'+kc(r.cena)+'</b> (bez zálohy)'):'<b>'+kc(r.cena)+'</b>'}];
    var jm=function(a,b){return a.jmeno.localeCompare(b.jmeno,'cs')},h='';
    if(co==='uby'){
      var akt=vse.filter(function(r){return !JL(r)}),raz=function(a,b){return kratM(a).localeCompare(kratM(b),'cs',{numeric:true})};
      var pri=akt.filter(function(r){return r.od===x}),odj=akt.filter(function(r){return r.do===x}),zus=akt.filter(function(r){return r.od<x&&x<r.do});
      var M=['Místo',function(r){return '<b>'+esc(kratM(r))+'</b>'}],JJ=['Host',function(r){return esc(r.jmeno)}];
      var ukl=[].concat.apply([],odj.map(function(r){return r.mista||[]})).map(function(k){return R.nazev(k).replace('Podsadový stan','Stan')}).sort(function(a,b){return a.localeCompare(b,'cs',{numeric:true})});
      h='<h1>Ubytování · '+den+'</h1>'+
        '<h2>Přijíždí ('+pri.length+')</h2>'+TB(pri,[M,JJ,T,O,['Do',function(r){return KR(r.do)}],['Lodě',function(r){return sLod(r)?'ano':''}],PL,PZ],raz)+
        '<h2>Odjíždí ('+odj.length+')</h2>'+TB(odj,[M,JJ,T,O,PZ],raz)+
        '<h2>Úklid po odjezdu ('+ukl.length+')</h2>'+(ukl.length?'<p class="tk-ukl">'+ukl.map(function(u){return '<span><i class="tk-ch"></i>'+esc(u)+'</span>'}).join('')+'</p>':'<p class="tk-nic">Nic.</p>')+
        '<h2>Zůstávají ('+zus.length+')</h2>'+(zus.length?'<ul class="tk-zus">'+zus.sort(raz).map(function(r){return '<li><b>'+esc(kratM(r))+'</b> '+esc(r.jmeno)+' <small>'+os(r)+' os. · do '+KR(r.do)+'</small></li>'}).join('')+'</ul>':'<p class="tk-nic">Nikdo.</p>')}
    else if(co==='lod'){
      var X=denLode(vse,x),cel={padla:0,vesty:0,barely:0},kus={};X.vyd.forEach(function(r){var p=R.lodePotreba(r.lode);Object.keys(p).forEach(function(k){if(k in cel)cel[k]+=p[k];else kus[k]=(kus[k]||0)+p[k]})});
      var VB=function(k){return [R.VYB[k],function(r){return R.lodePotreba(r.lode)[k]}]},LO=['Lodě',function(r){return '<b>'+esc(LK(r))+'</b>'}];
      h='<h1>Půjčovna – výdej lodí · '+den+'</h1>'+
        '<h2>Připravit celkem</h2>'+(X.vyd.length?'<p class="tk-sum"><span><b>'+esc(kusyTxt(kus))+'</b></span>'+Object.keys(cel).map(function(k){return '<span>'+R.VYB[k]+': <b>'+cel[k]+'</b></span>'}).join('')+'</p>':'<p class="tk-nic">Nic.</p>')+
        '<h2>Komu co vydat ('+X.vyd.length+')</h2>'+TB(X.vyd,[J,T,LO,VB('padla'),VB('vesty'),VB('barely'),['Trasa',function(r){return esc(R.mistoN(r.lode.odkud))+' → '+esc(R.mistoN(r.lode.kam))}],['Vrátí',function(r){return posD(r)===x?'dnes':KR(posD(r))}],['Doprava',function(r){return r.doprava?esc(r.doprava.cas||'ano'):'–'}],PL,['Podpis',function(){return '<span class="tk-pod"></span>'}]],jm)+
        '<h2>Vrací se dnes ('+X.vra.length+')</h2>'+TB(X.vra,[J,T,LO,VB('padla'),VB('vesty'),VB('barely'),['Kde končí',function(r){return esc(R.mistoN(r.lode.kam))}],['Půjčeno',function(r){return r.lode.den===x?'dnes':KR(r.lode.den)}],['V pořádku',function(){return ''}]],jm)+
        (function(){var V=vse.filter(function(r){var s=R.lodeStav(r);return (s==='vyd'||s==='cast')&&posD(r)<x});return V.length?'<h2>Nevrácené po termínu ('+V.length+')</h2>'+TB(V,[J,T,['Má u sebe',function(r){return '<b>'+esc(R.lodeKusyTxt(R.lodeVen(r)))+'</b>'}],['Měl vrátit',function(r){return KR(posD(r))}]],jm):''})()+
        (X.voda.length?'<h2>Na vodě – vícedenní ('+X.voda.length+')</h2><ul class="tk-zus">'+X.voda.sort(jm).map(function(r){return '<li><b>'+esc(r.jmeno)+'</b> '+esc(LK(r))+' <small>vrátí '+KR(posD(r))+'</small></li>'}).join('')+'</ul>':'')}
    else if(co==='dop'){
      var Y=denLode(vse,x),oc=0,ac=0;Y.jizdy.forEach(function(r){oc+=+r.doprava.osob||0;ac+=R.aut(r.doprava.osob)});
      var MS=function(G){return G.length?'<table><thead><tr><th style="width:26px"></th><th>Místo</th><th>Lodě celkem</th><th>Pro koho</th></tr></thead><tbody>'+G.map(function(g){return '<tr><td><span class="tk-ch"></span></td><td><b>'+esc(R.mistoN(g.k))+'</b></td><td><b>'+esc(kusyTxt(g.kusy))+'</b></td><td>'+g.L.map(function(r){return esc(r.jmeno)+' ('+esc(LK(r))+')'}).join(', ')+'</td></tr>'}).join('')+'</tbody></table>':'<p class="tk-nic">Nic.</p>'};
      h='<h1>Doprava · '+den+'</h1>'+
        '<h2>Doprava osob na start ('+Y.jizdy.length+')</h2>'+(Y.jizdy.length?'<p class="tk-sum"><span>Osob: <b>'+oc+'</b></span><span>Aut: <b>'+ac+'</b></span></p>':'')+
        TB(Y.jizdy,[['Odjezd',function(r){return '<b>'+esc(r.doprava.cas||'–')+'</b>'}],['Kam',function(r){return '<b>'+esc(R.mistoN(r.doprava.misto))+'</b>'}],J,T,['Osob',function(r){return r.doprava.osob||0}],['Aut',function(r){return R.aut(r.doprava.osob)}],['Lodě',function(r){return esc(LK(r))}],PZ])+
        '<h2>Návoz lodí na start</h2>'+MS(poMiste(Y.navoz,'odkud'))+'<h2>Svoz lodí z cíle</h2>'+MS(poMiste(Y.svoz,'kam'))}
    else{
      h='<h1>Rezervace – seznam ('+posl.length+')</h1>'+TB(posl.filter(function(r){return r.stav!=='blk'}),[['Termín',function(r){return KR(r.od)+' – '+KR(r.do)+' '+r.do.slice(0,4)}],J,T,['Ubytování',function(r){return JL(r)?'–':esc(kratM(r))}],['Lodě',function(r){return esc(LK(r))||'–'}],['Doprava',function(r){return r.doprava?esc(R.mistoN(r.doprava.misto))+' '+esc(r.doprava.cas||''):'–'}],O,['Cena',function(r){return kc(r.cena)}],['Stav',function(r){return R.STAVY[r.stav]+(r.platba&&r.stav!=='zru'?' · '+R.PLATBA[r.platba.stav].toLowerCase():'')}],PZ])}
    var e=$('#tisk')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'tisk'}));
    e.innerHTML=h+'<p class="tk-pat">Kemp Krumlov · vytištěno '+cas(Date.now())+'</p>';
    window.print()}
  function detail(id){
    var r=najdi(id);if(!r)return;var b=r.stav==='blk',ak=JL(r)&&(r.stav==='pot'||r.stav==='uby')?null:AKCE[r.stav],o=r.osoby||{},deti=(o.dite||0)+(o.zak||0),n=noci(r),byl=dd.hidden;
    var hist=[{t:r.vytvoreno,co:b?'Blokace vytvořena':(r.zdroj==='web'?'Vytvořeno z webu'+(r.jazyk&&r.jazyk!=='cs'?' ('+r.jazyk.toUpperCase()+')':''):'Zadala obsluha'),kdo:r.zdroj==='web'?'':r.kdo}].concat(r.hist||[]);
    dd.innerHTML='<div class="rp-h"><div><small>'+(b?'Blokace místa':'Rezervace '+esc(r.cislo||''))+'</small><h2 id="rdt" tabindex="-1">'+esc(r.jmeno)+'</h2>'+bdg(r.stav)+pbdg(r)+stitky(r)+'</div><button type="button" class="rp-x" data-e="zav" aria-label="Zavřít detail">'+SV('<path d="M6 6l12 12M18 6L6 18"/>',18)+'</button></div>'+
      (b||r.stav==='zru'?'':JL(r)?(function(){var K=['Rezervace','Lodě vydané','Vráceno'],x=LS(r),i=x==='res'?0:x==='vra'?2:1;return '<ol class="rp-kr" aria-label="Postup půjčení">'+K.map(function(t,j){return '<li class="'+(j<i?'ho':j===i?'ted pot':'')+'"'+(j===i?' aria-current="step"':'')+'><i aria-hidden="true">'+(j<i?'✓':j+1)+'</i><span>'+t+'</span></li>'}).join('')+'</ol>'})():(function(){var K=(r.stav==='pop'||r.zdroj==='web'&&(r.hist||[]).some(function(h){return h.co===R.STAVY.pot})?['pop']:[]).concat(['pot','uby','odj']),i=K.indexOf(r.stav);return '<ol class="rp-kr" aria-label="Postup rezervace">'+K.map(function(k,j){return '<li class="'+(j<i?'ho':j===i?'ted '+k:'')+'"'+(j===i?' aria-current="step"':'')+'><i aria-hidden="true">'+(j<i?'✓':j+1)+'</i><span>'+R.STAVY[k]+'</span></li>'}).join('')+'</ol>'})())+
      (JL(r)&&lodBtn(r)&&!(r.stav==='pop'&&r.platba&&r.platba.stav==='ceka')?lodBtn(r).replace('btn sm pri','btn pri rp-a'):r.stav==='pop'&&r.platba&&r.platba.stav==='ceka'?'<button type="button" class="btn pri rp-a" data-zp="zal">Záloha zaplacena – potvrdit</button><button type="button" class="btn sm gh rp-a2" data-st="pot">Potvrdit bez zálohy</button>':ak?'<button type="button" class="btn pri rp-a" data-st="'+ak[0]+'">'+ak[1]+'</button>':'')+
      (b||!(r.telefon||r.email)?'':'<div class="rp-k">'+(r.telefon?'<a class="btn sm gh" href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'')+(r.email?'<a class="btn sm gh" href="mailto:'+esc(r.email)+'">'+esc(r.email)+'</a>':'')+'</div>')+
      '<h3>Pobyt</h3><dl class="rdd"><dt>Termín</dt><dd>'+KR(r.od)+' – '+KR(r.do)+' '+r.do.slice(0,4)+'<small>'+delka(r)+'</small></dd>'+(JL(r)?'':'<dt>Místa</dt><dd>'+esc(kratM(r))+'</dd>')+
      (b?'':'<dt>Osoby</dt><dd>'+(o.dosp||0)+' dosp.'+(deti?', '+deti+' '+pl(deti,'dítě','děti','dětí'):'')+'</dd><dt>Cena</dt><dd>'+kc(r.cena)+'</dd>')+'</dl>'+
      (LK(r)?'<h3>Lodě</h3><dl class="rdd"><dt>Den</dt><dd>'+KR(r.lode.den)+' '+r.lode.den.slice(0,4)+'<small>'+dniL(r)+' '+pl(dniL(r),'den','dny','dní')+'</small></dd><dt>Lodě</dt><dd>'+esc(LK(r))+'<small>'+vybTxt(r.lode)+'</small></dd><dt>Trasa</dt><dd>'+esc(R.mistoN(r.lode.odkud))+' → '+esc(R.mistoN(r.lode.kam))+'</dd><dt>Stav</dt><dd>'+lsBdg(r)+(r.lode.vydano?'<small>vydáno '+cas(r.lode.vydano.kdy)+'</small>':'')+'</dd>'+
        (r.lode.vydano?'<dt>Vydáno</dt><dd>'+esc(R.lodeKusyTxt(r.lode.vydano.kusy))+'</dd>':'')+
        (r.lode.vraceno||[]).map(function(v,i){return '<dt>'+(i?'':'Vráceno')+'</dt><dd>'+esc(R.lodeKusyTxt(v.kusy))+'<small>'+cas(v.kdy)+' · '+esc(v.kdo||'')+'</small></dd>'}).join('')+
        (LS(r)==='vyd'||LS(r)==='cast'?'<dt>Ještě venku</dt><dd><b>'+esc(R.lodeKusyTxt(R.lodeVen(r)))+'</b><small>vrátit '+KR(posD(r))+(posD(r)<dnes?' – po termínu':'')+'</small></dd>':'')+'</dl>'+
        (lodBtn(r)&&!JL(r)?'<div class="rp-pl">'+lodBtn(r)+'</div>':'')+'':'')+
      (r.doprava?'<h3>Doprava osob</h3><dl class="rdd"><dt>Kam</dt><dd>'+esc(R.mistoN(r.doprava.misto))+'</dd><dt>Kolik</dt><dd>'+(r.doprava.osob||0)+' '+pl(r.doprava.osob||0,'osoba','osoby','osob')+' · '+R.aut(r.doprava.osob)+' '+pl(R.aut(r.doprava.osob),'auto','auta','aut')+'</dd>'+(r.doprava.cas?'<dt>Odjezd</dt><dd>'+esc(r.doprava.cas)+' z kempu</dd>':'')+'</dl>':'')+
      (r.platba&&!b?(function(){var p=r.platba,dop=Math.max(0,(+r.cena||0)-(+p.zaloha||0));return '<h3>Platba</h3><dl class="rdd"><dt>Stav</dt><dd>'+pbdg(r)+'</dd><dt>Záloha</dt><dd>'+kc(p.zaloha)+'<small>'+(p.stav==='ceka'?'splatnost '+KR(p.splatnost)+' '+p.splatnost.slice(0,4)+(p.splatnost<dnes?' – po splatnosti':''):p.kdy?'přijato '+cas(p.kdy):'')+'</small></dd>'+(p.stav==='vse'?'':'<dt>Doplatek</dt><dd>'+kc(dop)+'<small>na místě</small></dd>')+'<dt>Var. symbol</dt><dd>'+esc(String(r.cislo||'').replace(/\D/g,''))+'</dd></dl>'+
        (r.stav==='zru'?'':'<div class="rp-pl">'+(p.stav==='zal'?'<button type="button" class="btn sm gh" data-zp="vse">Doplaceno celé</button>':'')+(p.stav!=='ceka'?'<button type="button" class="btn sm gh" data-zp="ceka">Vrátit na nezaplaceno</button>':r.stav!=='pop'?'<button type="button" class="btn sm gh" data-zp="zal">Záloha zaplacena</button>':'')+'</div>')})():'')+
      (r.zprava?'<h3>Poznámka</h3><p class="rp-n">'+esc(r.zprava)+'</p>':'')+
      '<h3>Historie</h3><ol class="rp-hi">'+hist.filter(function(h){return h.t}).map(function(h){return '<li><b>'+esc(h.co)+'</b><small>'+cas(h.t)+(h.kdo?' · '+esc(h.kdo):'')+'</small></li>'}).join('')+'</ol>'+
      '<div class="rp-f"><button type="button" class="btn sm gh" data-e="upr">Upravit</button>'+
      (b?'':r.stav==='zru'?'<button type="button" class="btn sm gh" data-st="pop">Obnovit</button>':'<button type="button" class="btn sm gh" data-st="zru">Zrušit rezervaci</button>')+
      (adm||b?'<button type="button" class="btn sm gh rp-d" data-e="del">Smazat</button>':'')+'</div>';
    dd.dataset.id=id;dd.hidden=false;
    if(byl){if(tab==='kal'&&!q){kresli();return}$('#rdt',dd).focus({preventScroll:true})}
    oznac();
  }
  /* pojistka proti omylu: ubytování / odhlášení v jiný den, než říká rezervace */
  function overDatum(id,st){var r=najdi(id),A=Promise.resolve(true);if(!r)return A;
    var dni=function(a,b){var n=Math.abs(Math.round((D0(a)-D0(b))/864e5));return n+' '+pl(n,'den','dny','dní')};
    if(st==='uby'&&r.od!==dnes)return ptej('Termín nesedí s dnešním datem\n\n'+r.jmeno+' má příjezd '+KR(r.od)+' '+r.od.slice(0,4)+(r.od>dnes?' – to je až za '+dni(r.od,dnes):' – měl přijet už před '+dni(r.od,dnes).replace(/dny$|dní$/,'dny').replace(/den$/,'dnem'))+'.\nDnes je '+KR(dnes)+'\n\nOpravdu ho chcete ubytovat?',{ok:'Přesto ubytovat',nebezp:1});
    if(st==='odj'&&r.do!==dnes)return ptej('Termín nesedí s dnešním datem\n\n'+r.jmeno+' má odjezd '+KR(r.do)+' '+r.do.slice(0,4)+(r.do>dnes?' – pobyt ještě neskončil':' – měl odjet už dřív')+'.\nDnes je '+KR(dnes)+'\n\nOpravdu ho chcete odhlásit?',{ok:'Přesto odhlásit',nebezp:1});
    return A}
  dd.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var id=dd.dataset.id;
    if(b.dataset.zp){zaplat(id,b.dataset.zp);return}
    if(b.dataset.lv){vydej(id);return}if(b.dataset.lr){vrat(id);return}
    if(b.dataset.st){var nst=b.dataset.st;overDatum(id,nst).then(function(ok){if(!ok)return;try{var sn=snap(),r=zmen(id,{stav:nst},R.STAVY[nst]);KK.zaznam('Rezervace',(r.cislo||'')+' '+r.jmeno+' – '+R.STAVY[r.stav]);kresli();tz(r.jmeno+': '+R.STAVY[r.stav]+'.',sn)}catch(x){toast(x.message,1)}})}
    else if(b.dataset.e==='zav')dd.close();
    else if(b.dataset.e==='upr')form(najdi(id));
    else if(b.dataset.e==='del'){var rs=najdi(id);ptej('Smazat '+(rs&&rs.stav==='blk'?'blokaci':'rezervaci')+(rs?' „'+rs.jmeno+'“':'')+'?\n\nZmizí z kalendáře, seznamu i historie. Nejde to vrátit.'+(rs&&rs.stav!=='blk'?'\n\nKdyž host jen odřekl, použijte raději „Zrušit rezervaci“.':''),{ok:'Smazat',nebezp:1}).then(function(ok){if(!ok)return;var sn=snap();R.smaz(id);dd.hidden=true;kresli();tz('Smazáno.',sn)})}});
  function form(r,pre){
    pre=pre||{};var b=r?r.stav==='blk':!!pre.blk,o=(r&&r.osoby)||{},d=(r&&r.dalsi)||{},num=function(n,l,v,ph){return '<label class="f">'+l+'<input class="inp" name="'+n+'" type="number" min="0" inputmode="numeric" value="'+(v||'')+'"'+(ph?' placeholder="'+ph+'"':'')+'></label>'};
    df.innerHTML='<form method="dialog" novalidate><h2 id="rft">'+(r?(b?'Upravit blokaci':'Upravit rezervaci'):(b?(pre.vse?'Zavřít celý kemp':'Blokovat místa'):'Nová rezervace'))+'</h2><div class="rfg">'+
      '<label class="f s2">'+(b?'Důvod blokace':'Jméno hosta')+'<input class="inp" name="jmeno" required autocomplete="off"></label>'+
      (b?'':'<label class="f">Telefon<input class="inp" name="telefon" type="tel" autocomplete="off"></label><label class="f">E-mail<input class="inp" name="email" type="email" autocomplete="off"></label>')+
      '<label class="f">'+(b?'Od':'Příjezd')+'<input class="inp" name="od" type="date" required></label><label class="f">'+(b?'Do (tento den už je volno)':'Odjezd')+'<input class="inp" name="do" type="date" required></label>'+
      (b?'':num('dosp','Dospělí',o.dosp,'nepovinné')+num('dite','Děti',(o.dite||0)+(o.zak||0),'nepovinné')+
        '<fieldset class="f s2 rfst"><legend>Stav</legend><div class="rfst-g">'+(r&&(r.stav==='pop'||r.stav==='odj')?[r.stav,'pot','uby']:['pot','uby']).map(function(s){return '<label class="rfst-o '+s+'"><input type="radio" name="stav" value="'+s+'"><span>'+R.STAVY[s]+'</span></label>'}).join('')+'</div></fieldset>')+
      '<fieldset class="s2 rmf"><legend>Místa <small>přeškrtnutá jsou v termínu obsazená</small></legend>'+(b?'<div class="row rm-vse"><button type="button" class="btn sm gh" data-vse="1">Vybrat celý kemp</button><button type="button" class="btn sm gh" data-vse="0">Zrušit výběr</button></div>':'')+'<div id="rmm"></div></fieldset>'+
      (b?'':'<details class="s2 rfl"'+(r&&r.lode?' open':'')+'><summary>Lodě a doprava osob<small id="rfls"></small></summary><p class="mut rfl-p">Doprava bez lodí: zaškrtněte dopravu, vyberte „Odkud“ jako místo, kam se jede, a den jako „Den vyplutí“.</p><div class="rfg">'+
        '<label class="f">Den vyplutí<input class="inp" name="lden" type="date"></label>'+num('ldni','Na kolik dní',r&&r.lode?r.lode.dni:1)+
        '<div class="s2 rfl-k">'+R.lodeTypy().map(function(p){return '<label class="f">'+esc(p.n)+'<small data-lv="'+p.k+'"></small><input class="inp" name="lk_'+p.k+'" type="number" min="0" inputmode="numeric" value="'+((r&&r.lode&&r.lode.kusy[p.k])||'')+'" placeholder="0"></label>'}).join('')+'</div>'+
        '<label class="f">Odkud<select class="inp" name="lod">'+R.mistaReky().map(function(x){return '<option value="'+x.k+'">'+esc(x.n)+'</option>'}).join('')+'</select></label><label class="f">Kam<select class="inp" name="lkam">'+R.mistaReky().map(function(x){return '<option value="'+x.k+'">'+esc(x.n)+'</option>'}).join('')+'</select></label>'+
        '<label class="s2 rfl-c"><input type="checkbox" class="cb" name="ldop"> Doprava osob na místo vyplutí</label>'+num('ldos','Osob k dopravě',r&&r.doprava?r.doprava.osob:'')+'<label class="f">Odjezd z kempu<input class="inp" name="lcas" placeholder="9:00" autocomplete="off"></label></div></details>'+
        '<label class="f s2">Platba<select class="inp" name="platba"><option value="">Bez zálohy – platí se na místě</option><option value="ceka">Čeká na zálohu</option><option value="zal">Záloha zaplacena</option><option value="vse">Zaplaceno celé</option></select></label>')+
      '<label class="f s2">Poznámka<textarea class="inp" name="zprava" rows="2"></textarea></label></div>'+
      (b?'':'<div class="rfp"><div><b>Cena</b><small id="rfci"></small></div><label class="rfc"><span class="sr">Cena v Kč</span><input class="inp" name="cena" type="number" min="0" inputmode="numeric"><span>Kč</span></label></div>')+
      '<p class="err-msg" role="alert" hidden></p><div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px"><button type="button" class="btn gh" data-z>Zrušit</button><button class="btn pri">Uložit</button></div></form>';
    var f=$('form',df),er=$('.err-msg',f),vyb={};((r&&r.mista)||pre.mista||[]).forEach(function(k){vyb[k]=1});
    f.jmeno.value=r?r.jmeno:'';f.od.value=r?r.od:(pre.od||dnes);f.do.value=r?r.do:(pre.do||ISO(ADD(D0(f.od.value),1)));f.zprava.value=(r&&r.zprava)||'';
    if(!b){f.telefon.value=(r&&r.telefon)||'';f.email.value=(r&&r.email)||'';f.stav.value=r&&r.stav!=='zru'?r.stav:'pot';f.cena.value=(r&&r.cena)||''}
    if(!b){var l0=(r&&r.lode)||{},p0=(r&&r.doprava)||{};f.lden.value=l0.den||'';f.lod.value=l0.odkud||R.mistaReky()[0].k;f.lkam.value=l0.kam||'kemp';f.ldop.checked=!!(r&&r.doprava);if(r&&r.doprava&&!r.lode){f.lod.value=r.doprava.misto;f.lden.value=r.doprava.den||''}f.lcas.value=p0.cas||'';f.platba.value=(r&&r.platba&&r.platba.stav)||''}
    /* lodě a doprava z formuláře */
    var lodeZ=function(){if(b)return null;var k={},n=0;R.lodeTypy().forEach(function(p){var v=Math.max(0,Math.round(+f['lk_'+p.k].value||0));if(v){k[p.k]=v;n+=v}});if(!n)return null;return {den:f.lden.value||f.od.value,dni:Math.max(1,Math.round(+f.ldni.value||1)),kusy:k,odkud:f.lod.value,kam:f.lkam.value}};
    var doprZ=function(){var l=lodeZ(),m=l?l.odkud:f.lod.value;if(!f.ldop.checked||!m||m==='kemp')return null;return {misto:m,osob:+f.ldos.value||((+f.dosp.value||0)+(+f.dite.value||0)),cas:f.lcas.value.trim(),den:l?l.den:(f.lden.value||f.od.value)}};
    var lodInfo=function(){if(b)return;var den=f.lden.value||f.od.value,dni=Math.max(1,Math.round(+f.ldni.value||1)),v=den?R.lodeVolno(den,dni,r&&r.id):{};$$('[data-lv]',f).forEach(function(e){var x=v[e.dataset.lv];e.textContent=x==null?'':' · volných '+Math.max(0,x)});var l=lodeZ(),ch=l?R.lodeChybi(l,r&&r.id):[];$('#rfls',f).textContent=l?' · '+R.lodePocet(l)+' '+pl(R.lodePocet(l),'loď','lodě','lodí')+(ch.length?' · chybí vybavení':''):' · žádné';$('#rfls',f).classList.toggle('zle',!!ch.length)};
    var rucne=!!(r&&r.cena);
    var spocti=function(){if(b||!window.KKC)return;var od=f.od.value,dk=f.do.value,nn=od&&dk&&od<dk?Math.round((D0(dk)-D0(od))/864e5):0,q={};
      Object.keys(vyb).forEach(function(k){var t=k.split('-')[0];q[t]=(q[t]||0)+1});q.stan=+d.stan||0;q.karavan=+d.karavan||0;q.os=+f.dosp.value||0;q.dite=+f.dite.value||0;
      var sum=0;for(var i=0;i<nn;i++){var h=KKC.hlavni(ADD(D0(od),i).getMonth())?'a':'b';Object.keys(q).forEach(function(k){if(q[k]&&KKC.p(k))sum+=KKC.v(k,h)*q[k]})}
      var sl=KKC.sleva(nn),cL=R.cenaLodi(lodeZ()).celkem,cD=R.cenaDopravy(doprZ()),c=Math.round(sum-sum*sl)+cL+cD,inf=nn+' '+pl(nn,'noc','noci','nocí')+(sl?' · sleva '+Math.round(sl*100)+' %':'')+(cL?' · lodě '+kc(cL):'')+(cD?' · doprava '+kc(cD):'');lodInfo();
      if(!rucne)f.cena.value=c||'';
      $('#rfci',f).innerHTML=!c?'Vyberte termín, místa a osoby – cena se spočítá podle ceníku.':rucne&&+f.cena.value!==c?'Zadáno ručně · podle ceníku '+kc(c)+' <button type="button" class="lnk" data-cp>Použít</button>':'Podle ceníku · '+inf};
    function mista(){var od=f.od.value,dk=f.do.value,kol={};if(od&&dk&&od<dk)R.kolize([].concat.apply([],R.SKUPINY.map(function(g){return g.c.map(function(c){return g.k+'-'+c})})),od,dk,r&&r.id).forEach(function(k){kol[k]=1});
      $('#rmm',f).innerHTML=R.SKUPINY.map(function(g){return '<div class="rmg"><small>'+g.n+'</small><div>'+g.c.map(function(c){var k=g.k+'-'+c,z=kol[k];if(z)delete vyb[k];return '<label class="rm'+(z?' z':'')+'"><input type="checkbox" value="'+k+'"'+(vyb[k]?' checked':'')+(z?' disabled':'')+' aria-label="'+R.nazev(k)+(z?', obsazeno':'')+'"><span>'+(g.k==='teepee'?'Teepee':c)+'</span></label>'}).join('')+'</div></div>'}).join('')}
    mista();spocti();f.od.addEventListener('change',function(){mista();spocti()});f.do.addEventListener('change',function(){mista();spocti()});
    $('#rmm',f).addEventListener('change',function(e){if(e.target.checked)vyb[e.target.value]=1;else delete vyb[e.target.value];spocti()});
    f.addEventListener('input',function(e){var t=e.target;if(t.name==='cena')rucne=t.value!=='';if(t.name==='cena'||t.name==='dosp'||t.name==='dite'||/^l/.test(t.name||''))spocti()});
    f.addEventListener('change',function(e){if(/^l/.test(e.target.name||''))spocti()});
    f.addEventListener('click',function(e){if(e.target.closest('[data-cp]')){rucne=false;spocti()}var vb=e.target.closest('[data-vse]');if(vb){vyb={};cely=vb.dataset.vse==='1';if(vb.dataset.vse==='1')$$('#rmm input:not(:disabled)',f).forEach(function(i){vyb[i.value]=1});mista()}});
    var cely=!!pre.vse,vseV=function(){if(!cely)return;vyb={};$$('#rmm input:not(:disabled)',f).forEach(function(i){vyb[i.value]=1});mista()};
    if(cely){f.jmeno.value='Kemp zavřený';vseV()}
    f.od.addEventListener('change',vseV);f.do.addEventListener('change',vseV);$('#rmm',f).addEventListener('change',function(){cely=false});
    $('[data-z]',f).addEventListener('click',function(){df.close()});
    f.addEventListener('submit',function(e){e.preventDefault();er.hidden=true;var ch=function(t,el){er.textContent=t;er.hidden=false;if(el)el.focus()};
      var z={jmeno:f.jmeno.value.trim(),od:f.od.value,do:f.do.value,mista:Object.keys(vyb),zprava:f.zprava.value.trim()};
      if(!z.jmeno)return ch(b?'Napište důvod blokace.':'Vyplňte jméno hosta.',f.jmeno);
      var zl=lodeZ(),bezM=!z.mista.length&&!(+d.stan||+d.karavan);
      if(!z.od||!z.do||z.od>z.do||(z.od===z.do&&!(zl&&bezM)))return ch(b?'Konec musí být po začátku.':'Odjezd musí být po příjezdu.',f.do);
      if(zl&&f.lod.value===f.lkam.value)return ch('Místo vyplutí a cíl jsou stejné.',f.lkam);
      if(b)z.stav='blk';else{z.lode=zl;z.doprava=doprZ();
        var pv=f.platba.value,pb0=r&&r.platba;z.platba=pv?{zaloha:(pb0&&pb0.zaloha)||R.zalohaCastka(+f.cena.value||0)||0,splatnost:(pb0&&pb0.splatnost)||R.splatnost(z.od,dnes),stav:pv,kdy:pv==='ceka'?null:(pb0&&pb0.kdy)||Date.now()}:null;z.telefon=f.telefon.value.trim();z.email=f.email.value.trim();z.osoby={dosp:+f.dosp.value||0,dite:+f.dite.value||0,zak:0};z.dalsi={stan:+d.stan||0,karavan:+d.karavan||0};z.cena=+f.cena.value||0;z.stav=f.stav.value;if(!r&&pv==='ceka'&&z.stav==='pot')z.stav='pop'}
      if(!z.mista.length&&(b||!(z.dalsi.stan||z.dalsi.karavan))&&!z.lode)return ch('Vyberte aspoň jedno místo nebo lodě.');
      if(!b&&f.ldop.checked&&!z.doprava)return ch('U dopravy vyberte místo, kam se jede (ne Kemp Krumlov).',f.lod);
      try{var x;if(r)x=zmen(r.id,z,'Upraveno');else{z.zdroj='rucne';z.kdo=ja.jmeno;x=R.pridej(z)}
        KK.zaznam('Rezervace',(x.cislo||'')+' '+x.jmeno+(r?' – upraveno':' – přidáno'));df.close();kresli();toast(b?'Blokace uložena.':'Rezervace '+x.cislo+' uložena.')}catch(q){ch(q.message)}});
    df.showModal();f.jmeno.focus();
  }
  try{if(sessionStorage.getItem('kkt.rez.nova')){sessionStorage.removeItem('kkt.rez.nova');setTimeout(function(){form(null)},0)}}catch(e){}
  function ukazka(){var n=R.ukazka(true);kresli();toast(n?'Vloženo '+n+' testovacích záznamů.':'Testovací data už tam jsou.')}
  box.addEventListener('click',function(e){var t=e.target,b=t.closest('button');
    if(b&&b.dataset.sb){if(b.dataset.sb!==sbT)sbPrepni(function(){sbT=b.dataset.sb;sbKresli()});return}
    if(b&&b.dataset.sj){if(b.dataset.sj!==sbJ)sbPrepni(function(){sbJ=b.dataset.sj;sbKresli()});return}
    if(b&&b.dataset.sv){var f=sbF&&box.contains(sbF)?sbF:$('#sbt',box);if(!f)return;var a=f.selectionStart==null?f.value.length:f.selectionStart,z=f.selectionEnd==null?a:f.selectionEnd;f.value=f.value.slice(0,a)+b.dataset.sv+f.value.slice(z);f.focus();f.selectionStart=f.selectionEnd=a+b.dataset.sv.length;sbNahled();return}
    if(b&&b.dataset.a==='sbuloz'){sbUloz();return}
    if(b&&b.dataset.a==='sbvych'){ptej('Vrátit výchozí znění?\n\nVaše úpravy této šablony ('+JZN[sbJ]+') se smažou.',{ok:'Vrátit výchozí'}).then(function(ok){if(!ok)return;R.ulozSablonu(sbT,sbJ,null);KK.zaznam('Rezervace','šablona e-mailu vrácena: '+sbT+' ('+sbJ+')');sbKresli();toast('Vráceno výchozí znění.')});return}
    if(b){var s=b.dataset;
      if(s.tab){VY={};tab=s.tab;KK.LS.set('rez.tab.'+sek,tab);filtr='';q='';lim=100;kresli()}
      else if(s.qs){var qi=s.qs,qt=s.st;overDatum(qi,qt).then(function(ok){if(!ok)return;try{var sn=snap(),rr=zmen(qi,{stav:qt},R.STAVY[qt]);KK.zaznam('Rezervace',(rr.cislo||'')+' '+rr.jmeno+' – '+R.STAVY[rr.stav]);kresli();tz(rr.jmeno+': '+R.STAVY[rr.stav]+'.',sn)}catch(x){toast(x.message,1)}})}
      else if(s.fs!=null){F.stav=s.fs;lim=100;kresli()}
      else if(s.fo!=null){F.obd=s.fo;F.stav='';lim=100;kresli()}
      else if(s.a==='csv')csv(posl);
      else if(s.ha)hromAkce(s.ha);
      else if(s.dl){rozb[s.dl]=!rozb[s.dl];var y=b.closest('section').getBoundingClientRect().top;kresli();var bb=box.querySelector('[data-dl="'+s.dl+'"]');if(bb){var sc=bb.closest('section');if(rozb[s.dl])bb.focus({preventScroll:true});else{var dy=sc.getBoundingClientRect().top-y;if(dy)window.scrollBy(0,dy);bb.focus({preventScroll:true})}}}
      else if(s.a==='frst'){F=Object.assign({},F0);vicF=false;lim=100;kresli()}
      else if(s.a==='vic'){lim+=100;kresli()}
      else if(s.a==='qx'){q='';kresli()}
      else if(s.a==='vicf'){vicF=true;kresli()}
      else if(s.zp)zaplat(s.zp,'zal');
      else if(s.lv)vydej(s.lv);
      else if(s.lr)vrat(s.lr);
      else if(s.id)detail(s.id);
      else if(s.pos!=null){zac=+s.pos?ADD(zac,+s.pos):ADD(D0(dnes),-2);kresli()}
      else if(s.fl){filtr=filtr===s.fl?'':s.fl;kresli()}
      else if(s.g){sbal[s.g]=!sbal[s.g];kresli()}
      else if(s.nm)form(null,{mista:[s.nm],od:denP,do:ISO(ADD(D0(denP),1))});
      else if(s.den){denP=s.den;kresli()}
      else if(s.dpos!=null){denP=+s.dpos?ISO(ADD(D0(denP),+s.dpos)):dnes;kresli()}
      else if(s.a==='nova')form(null);
      else if(s.a==='tisk')tisk(s.co);
      else if(s.a==='zv'){zvV=!zvV;var w=$('.rn-w',box);if(w)w.classList.toggle('zv',zvV);b.setAttribute('aria-pressed',zvV)}
      else if(s.nt){var jdi=function(){nT=s.nt;kresli()};if(nT==='mail')sbPrepni(jdi);else jdi()}
      else if(s.rz)rezimTyp(s.rz,s.rv);
      else if(s.zt){var nz=R.nast();nz.zaloha=Object.assign(R.zaloha(),{typ:s.zt});if(s.zt==='proc'&&!(nz.zaloha.hodnota>0&&nz.zaloha.hodnota<=100))nz.zaloha.hodnota=30;if(s.zt==='castka'&&nz.zaloha.hodnota<=100)nz.zaloha.hodnota=500;R.ulozNast(nz);KK.zaznam('Rezervace','záloha: '+s.zt);kresli()}
      else if(s.a==='blk')form(null,{blk:1});
      else if(s.a==='ukazka')ukazka();
      else if(s.vm){var n=R.nast(),v=R.vyp().slice(),i=v.indexOf(s.vm);if(i<0)v.push(s.vm);else v.splice(i,1);n.vyp=v;R.ulozNast(n);KK.zaznam('Rezervace',R.nazev(s.vm)+(i<0?' vypnuto z rezervace':' zapnuto do rezervace'));toast(R.nazev(s.vm)+(i<0?' vypnuto – hosté si ho nevyberou.':' zapnuto.'));kresli()}
      else if(s.a==='vymaz')ptej('Smazat všechny rezervace i blokace?\n\nSmaže se úplně všechno včetně historie. Nejde to vrátit.',{ok:'Smazat vše',nebezp:1}).then(function(ok){if(!ok)return;R.vymaz();KK.zaznam('Rezervace','vše smazáno');kresli();toast('Rezervace smazány.')});
      return}
    if(t.closest&&t.closest('.rl-x'))return;
    var rj=t.closest&&t.closest('.rlt tr');if(rj&&(rj=$('.rl-j',rj))){detail(rj.dataset.id);return}
    if(t.classList.contains('rk-t')){var d=ADD(zac,Math.floor(e.offsetX/W));form(null,{mista:[t.dataset.m],od:ISO(d),do:ISO(ADD(d,1))})}});
  /* bublina s datem pod myší (i při přetahování) + zvýraznění dne v hlavičce */
  var tip=m.appendChild(Object.assign(document.createElement('div'),{className:'rk-tip',hidden:true})),tipD=-1;
  var kriz=null,krizR=null;
  function krizUkaz(t,i){if(!kriz||!document.body.contains(kriz)){var inn=$('.rk-in',box);if(!inn)return;kriz=inn.appendChild(Object.assign(document.createElement('i'),{className:'rk-col'}))}kriz.hidden=false;kriz.style.left=(NW+i*W)+'px';kriz.style.width=W+'px';var rr=t.parentNode;if(rr!==krizR){if(krizR)krizR.classList.remove('hvr');krizR=rr;rr.classList.add('hvr')}}
  function tipSkryj(){if(kriz)kriz.hidden=true;if(krizR){krizR.classList.remove('hvr');krizR=null}tip.hidden=true;if(tipD>=0){var o=$$('.rk-d',box)[tipD];if(o)o.classList.remove('hv');tipD=-1}}
  function tipUkaz(e,t,txt,i){tip.innerHTML=txt;tip.hidden=false;var w=tip.offsetWidth,x=e.clientX+14,y=e.clientY+18;if(x+w>innerWidth-8)x=e.clientX-w-10;if(y+tip.offsetHeight>innerHeight-8)y=e.clientY-tip.offsetHeight-10;tip.style.left=x+'px';tip.style.top=y+'px';
    if(i!==tipD){var D=$$('.rk-d',box);if(tipD>=0&&D[tipD])D[tipD].classList.remove('hv');if(D[i])D[i].classList.add('hv');tipD=i}}
  var den=function(d){return DNY[d.getDay()]+' '+d.getDate()+'. '+(d.getMonth()+1)+'.'};
  box.addEventListener('mousemove',function(e){if(tah)return;var t=e.target.closest&&e.target.closest('.rk-t');if(!t){tipSkryj();return}
    var i=Math.max(0,Math.min(N-1,Math.floor((e.clientX-t.getBoundingClientRect().left)/W))),d=ADD(zac,i),b=e.target.closest('.rk-b'),r=b&&najdi(b.dataset.id);
    krizUkaz(t,i);tipUkaz(e,t,'<b>'+den(d)+' '+d.getFullYear()+'</b> · '+R.nazev(t.dataset.m)+(r?'<br>'+esc(r.jmeno)+' · '+KR(r.od)+' – '+KR(r.do)+' · '+R.STAVY[r.stav]:'<br><span>volno – kliknutím založíte rezervaci</span>'),i)});
  box.addEventListener('mouseleave',tipSkryj);
  /* přetahování: pruh rezervace na jiné místo / den, skupina na jiné pořadí */
  var tah=null,zrus=function(){$$('.dp',box).forEach(function(x){x.classList.remove('dp')})};
  function presunSkupinu(id,pred,za){var n=R.nast(),po=skupiny().map(function(g){return g.id}),i=po.indexOf(id);if(i<0||id===pred)return;po.splice(i,1);var j=po.indexOf(pred);po.splice(za?j+1:j,0,id);n.poradi2=po;R.ulozNast(n);kresli()}
  /* přesun místa; když je cíl obsazený jedinou rezervací a ta se vejde na původní místo, hosté se prohodí */
  function presunMista(r,mS,mN,od,dk){
    var nm=(r.mista||[]).map(function(k){return k===mS?mN:k}),kol=R.kolize(nm,od,dk,r.id),zm=od!==r.od||dk!==r.do;
    var kam=R.nazev(mN)+(zm?', '+KR(od)+' – '+KR(dk):'');
    if(!kol.length){
      ptej((zm?'Přesunout rezervaci?':'Přestěhovat hosta?')+'\n\n'+r.jmeno+' · '+KR(r.od)+' – '+KR(r.do)+'\n'+R.nazev(mS)+'  →  '+kam,{ok:zm?'Přesunout':'Přestěhovat'}).then(function(ok){if(!ok)return;
        try{var sn=snap(),x=zmen(r.id,{od:od,do:dk,mista:nm},'Přesun: '+kam);KK.zaznam('Rezervace',(x.cislo||'')+' '+x.jmeno+' – přesunuto');kresli();tz(x.jmeno+' → '+kam,sn)}catch(q){toast(q.message,1)}});return}
    var prek=R.vse().filter(function(x){return x.id!==r.id&&x.stav!=='zru'&&x.od<dk&&od<x.do&&(x.mista||[]).some(function(k){return nm.indexOf(k)>=0})}),r3=prek[0];
    if(kol.length>1||kol[0]!==mN||prek.length!==1||r3.stav==='blk'||(r3.mista||[]).indexOf(mS)>=0){toast((kol.length===1?R.nazev(kol[0])+' je':'Místa '+kol.map(R.nazev).join(', ')+' jsou')+' v termínu '+KR(od)+' – '+KR(dk)+' obsazené'+(prek.length>1?' více rezervacemi':r3&&r3.stav==='blk'?' blokací':'')+'.',1);return}
    var nm3=r3.mista.map(function(k){return k===mN?mS:k}),vadi=R.vse().filter(function(x){return x.id!==r.id&&x.id!==r3.id&&x.stav!=='zru'&&x.od<r3.do&&r3.od<x.do&&(x.mista||[]).indexOf(mS)>=0});
    if(vadi.length){toast(R.nazev(mN)+' je obsazené ('+r3.jmeno+') a prohodit to nejde – '+R.nazev(mS)+' má v termínu '+KR(r3.od)+' – '+KR(r3.do)+' jinou rezervaci.',1);return}
    ptej('Prohodit hosty?\n\n'+r.jmeno+' · '+KR(r.od)+' – '+KR(r.do)+'\n'+R.nazev(mS)+'  →  '+kam+'\n\n'+r3.jmeno+' · '+KR(r3.od)+' – '+KR(r3.do)+'\n'+R.nazev(mN)+'  →  '+R.nazev(mS),{ok:'Prohodit'}).then(function(ok){if(!ok)return;
    var puv3=r3.mista.slice(),sn=snap();
    try{R.uprav(r3.id,{mista:puv3.filter(function(k){return k!==mN})});
      var y=zmen(r.id,{od:od,do:dk,mista:nm},'Prohození s '+r3.jmeno+': '+kam);
      var z=zmen(r3.id,{mista:nm3},'Prohození s '+r.jmeno+': '+R.nazev(mS));
      KK.zaznam('Rezervace',y.jmeno+' ↔ '+z.jmeno+' – prohozeno');kresli();tz('Prohozeno: '+y.jmeno+' ↔ '+z.jmeno,sn)}
    catch(q){try{R.uprav(r3.id,{mista:puv3})}catch(q9){}kresli();toast(q.message,1)}})}
  box.addEventListener('dragstart',function(e){tipSkryj();var b=e.target.closest&&e.target.closest('.rk-b,.rk-dg,.rn[data-id]');if(!b)return;
    if(b.dataset.dg)tah={g:b.dataset.dg};else if(b.classList.contains('rn'))tah={id:b.dataset.id,m:b.dataset.m,dnes:1};else{var r=najdi(b.dataset.id);if(!r)return;tah={id:r.id,m:b.parentNode.dataset.m,off:Math.floor(e.offsetX/W)+Math.max(0,-Math.round((D0(r.od)-zac)/864e5))}}
    e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',b.dataset.id||b.dataset.dg)}catch(x){}});
  box.addEventListener('dragover',function(e){if(!tah)return;var c=e.target.closest(tah.g?'.rk-g[data-gid]':tah.dnes?'.rn':'.rk-t');if(!c)return;e.preventDefault();e.dataTransfer.dropEffect='move';if(!c.classList.contains('dp')){zrus();c.classList.add('dp')}
    if(!tah.g&&!tah.dnes){var r=najdi(tah.id),i=Math.floor((e.clientX-c.getBoundingClientRect().left)/W)-tah.off,a=ADD(zac,i);if(r)krizUkaz(c,Math.max(0,Math.min(N-1,i)));if(r)tipUkaz(e,c,'<b>'+esc(r.jmeno)+'</b> → '+R.nazev(c.dataset.m)+'<br>'+den(a)+' – '+den(ADD(a,noci(r))),Math.max(0,Math.min(N-1,i)))}});
  box.addEventListener('dragend',function(){tah=null;zrus();tipSkryj()});
  box.addEventListener('drop',function(e){if(!tah)return;var T=tah;tah=null;zrus();tipSkryj();
    if(T.g){var c=e.target.closest('.rk-g[data-gid]');if(!c)return;e.preventDefault();var po=skupiny().map(function(g){return g.id});presunSkupinu(T.g,c.dataset.gid,po.indexOf(T.g)<po.indexOf(c.dataset.gid));return}
    if(T.dnes){var c2=e.target.closest('.rn'),r2=najdi(T.id);if(!c2||!r2)return;e.preventDefault();var m2=c2.dataset.m;if(m2===T.m)return;
      if((r2.mista||[]).indexOf(m2)>=0){toast('Tato rezervace už '+R.nazev(m2)+' obsahuje.',1);return}
      try{presunMista(r2,T.m,m2,r2.od,r2.do)}catch(q2){toast(q2.message,1)}return}
    var t=e.target.closest('.rk-t');if(!t)return;e.preventDefault();var r=najdi(T.id);if(!r)return;
    var i=Math.floor((e.clientX-t.getBoundingClientRect().left)/W)-T.off,n=noci(r),od=ISO(ADD(zac,i)),dk=ISO(ADD(zac,i+n)),m=t.dataset.m;
    if(od===r.od&&m===T.m)return;
    if(m!==T.m&&(r.mista||[]).indexOf(m)>=0){toast('Tato rezervace už '+R.nazev(m)+' obsahuje.',1);return}
    try{presunMista(r,T.m,m,od,dk)}catch(q){toast(q.message,1)}});
  box.addEventListener('keydown',function(e){var b=e.target;if(!b.dataset||!b.dataset.dg||(e.key!=='ArrowUp'&&e.key!=='ArrowDown'))return;e.preventDefault();
    var po=skupiny().map(function(g){return g.id}),i=po.indexOf(b.dataset.dg),j=i+(e.key==='ArrowUp'?-1:1);if(j<0||j>=po.length)return;presunSkupinu(b.dataset.dg,po[j],j>i);var f=$('[data-dg="'+b.dataset.dg+'"]',box);if(f)f.focus()});
  box.addEventListener('input',function(e){var t=e.target;if(t.id!=='rq')return;q=t.value.trim()?t.value:'';lim=100;var p=t.selectionStart;kresli();var n=$('#rq',box);n.focus();try{n.setSelectionRange(p,p)}catch(x){}});
  var sbTm;box.addEventListener('input',function(e){if(e.target.id==='sbp'||e.target.id==='sbt'){clearTimeout(sbTm);sbTm=setTimeout(sbNahled,350)}});
  box.addEventListener('focusin',function(e){if(e.target.id==='sbp'||e.target.id==='sbt')sbF=e.target});
  box.addEventListener('change',function(e){var t=e.target;
    if(t.dataset.vy){if(t.checked)VY[t.dataset.vy]=1;else delete VY[t.dataset.vy];t.closest('tr').classList.toggle('vyb',t.checked);hromBar();return}
    if(t.dataset.va!=null){$$('[data-vy]',box).forEach(function(c){c.checked=t.checked;if(t.checked)VY[c.dataset.vy]=1;else delete VY[c.dataset.vy];c.closest('tr').classList.toggle('vyb',t.checked)});hromBar();return}
    if(t.dataset.zl){var nz=R.nast(),zz=R.zaloha(),zk=t.dataset.zl;zz[zk]=zk==='zap'?t.checked:zk==='ucet'?t.value.trim():Math.max(0,Math.round(+t.value||0));if(zk==='hodnota'&&zz.typ==='proc')zz.hodnota=Math.min(100,zz.hodnota);nz.zaloha=zz;R.ulozNast(nz);KK.zaznam('Rezervace','nastavení záloh změněno');kresli();toast('Uloženo.');return}
    if(t.dataset.sk){var ns=R.nast(),sk=ns.sklad||{},ce=t.dataset.sk.split('.'),hv=Math.max(0,Math.round(+t.value||0));if(ce[0]==='vyb'){sk.vyb=sk.vyb||{};sk.vyb[ce[1]]=hv}else{sk.lode=sk.lode||{};sk.lode[ce[1]]=Object.assign({},R.sklad().lode[ce[1]],sk.lode[ce[1]]||{});sk.lode[ce[1]][ce[2]]=hv}ns.sklad=sk;R.ulozNast(ns);KK.zaznam('Rezervace','sklad půjčovny změněn');var fa=t.dataset.sk;kresli();var nf=$('[data-sk="'+fa+'"]',box);if(nf)nf.focus();toast('Uloženo.');return}
    if(t.id==='sbem'){var v=t.value.trim();if(v&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){toast('Zkontrolujte e-mail.',1);return}var n=R.nast();n.emailKemp=v;R.ulozNast(n);KK.zaznam('Rezervace','e-mail pro upozornění: '+(v||'–'));toast('Uloženo.');return}
    if(t.id==='rnd'&&t.value){denP=t.value;kresli()}
    else if(t.id==='rkd'&&t.value){zac=ADD(D0(t.value),-2);kresli()}
    else if(t.id==='rkn'){KK.LS.set('rez.dni',+t.value);kresli()}
    else if(t.dataset.f){F[t.dataset.f]=t.value;lim=100;kresli()}});
  kresli();
}

/* ---------- NASTAVENÍ ---------- */
/* ---------- UŽIVATELÉ (jen správce) ---------- */
function datum(t){return t?new Date(t).toLocaleString('cs-CZ',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—'}
function uzivatele(m){
  return KK.uzivatele.seznam().then(function(U){
    var ja=KK.auth.meSync(),P=KK.prava.vse(),RO=Object.keys(KK.ROLE),SK=Object.keys(KK.SEKCE).filter(function(k){return k!=='prehled'});
    var pravaTxt=function(u){if(u.role==='admin')return '<span class="up-v">smí vše</span>';var a=SK.filter(function(k){return u.prava[k]});return a.length?a.map(function(k){return '<span class="up-c">'+esc(KK.SEKCE[k])+'</span>'}).join(''):'<span class="mut">jen Přehled</span>'};
    var radek=function(u){var jaJ=u.id===ja.id;return '<tr data-id="'+u.id+'"'+(u.aktivni?'':' class="skr"')+'><td><b>'+esc(u.jmeno)+'</b>'+(jaJ?' <span class="badge">vy</span>':'')+(u.vychozi?' <span class="badge warn">výchozí heslo</span>':'')+'<br><small class="mut">'+esc(u.login)+(u.email?' · '+esc(u.email):'')+'</small></td>'+
      '<td><select class="inp" data-u="role" aria-label="Role – '+esc(u.jmeno)+'"'+(jaJ?' disabled title="Svou roli změnit nemůžete"':'')+'>'+RO.map(function(r){return '<option value="'+r+'"'+(u.role===r?' selected':'')+'>'+KK.ROLE[r]+'</option>'}).join('')+'</select></td>'+
      '<td class="up-t">'+pravaTxt(u)+'</td><td class="c"><label class="sw" title="Zapnutý účet"><input type="checkbox" data-u="aktivni"'+(u.aktivni?' checked':'')+(jaJ?' disabled':'')+' aria-label="Účet zapnutý – '+esc(u.jmeno)+'"><span aria-hidden="true"></span></label></td>'+
      '<td><small class="mut">'+datum(u.posledni)+'</small></td>'+
      '<td class="c" style="white-space:nowrap"><button type="button" class="btn sm gh" data-a="upr">Upravit</button> <button type="button" class="btn sm gh'+(jaJ&&u.vychozi?' pri':'')+'" data-a="heslo">'+(jaJ?'Změnit heslo':'Nové heslo')+'</button>'+(jaJ?'':' <button type="button" class="btn ic dan" data-a="del" aria-label="Smazat uživatele '+esc(u.jmeno)+'">'+SV(IC.kos,18)+'</button>')+'</td></tr>'};
    m.innerHTML='<div class="ph"><div><h1>Uživatelé</h1><p>Kdo smí do administrace a co tam smí dělat. <b>Správce</b> smí všechno včetně uživatelů, u <b>Obsluhy</b> nastavíte sekce každému zvlášť v Upravit.</p></div><button type="button" class="btn pri" id="un">+ Přidat uživatele</button></div>'+
      (ja.vychozi?'<div class="card" style="border-left:4px solid var(--warn,#e0a100);border-radius:0 var(--r) var(--r) 0;margin-bottom:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap"><span style="flex:1"><b>Používáte výchozí heslo „kemp“.</b> Změňte si ho tlačítkem Změnit heslo u svého účtu.</span><button type="button" class="btn pri sm" id="umh">Změnit heslo</button></div>':'')+
      '<section class="card" style="margin-bottom:16px"><div class="tw-wrap"><table class="ct"><thead><tr><th>Uživatel</th><th>Role</th><th>Smí upravovat</th><th class="c">Zapnutý</th><th>Poslední přihlášení</th><th class="c"><span class="sr">Akce</span></th></tr></thead><tbody id="ul">'+U.map(radek).join('')+'</tbody></table></div></section>'+
      '<div class="card mut" style="font-size:13.5px">'+SV(IC.zamek,16)+' V náhledu jsou účty uložené jen v tomto prohlížeči a chrání jen před omylem. Skutečné zabezpečení (hesla na serveru, přihlášení, práva) bude po spuštění na serveru – účty se přenesou.</div>'+
      '<dialog id="ud" class="dlg" aria-labelledby="udt"><form method="dialog" id="uf" novalidate><h2 id="udt"></h2><div class="grid" style="gap:12px">'+
      '<label class="f">Jméno a příjmení<input class="inp" name="jmeno" required autocomplete="off"></label>'+
      '<label class="f">Přihlašovací jméno<small>Bez mezer a diakritiky, např. jana.novakova</small><input class="inp" name="login" required autocomplete="off" autocapitalize="none" spellcheck="false"></label>'+
      '<label class="f">E-mail<small>Nepovinné – lze se jím i přihlásit</small><input class="inp" name="email" type="email" autocomplete="off"></label>'+
      '<label class="f">Role<select class="inp" name="role">'+RO.map(function(r){return '<option value="'+r+'"'+(r==='obsluha'?' selected':'')+'>'+KK.ROLE[r]+'</option>'}).join('')+'</select></label>'+
      '<fieldset class="f up-f" data-prava><legend>Co smí upravovat<small>Přehled vidí každý. Správce smí vždy všechno.</small></legend><div class="sw-l">'+SK.map(function(k){return '<label class="sw"><input type="checkbox" name="pr_'+k+'"><span aria-hidden="true"></span>'+esc(KK.SEKCE[k])+'</label>'}).join('')+'</div></fieldset>'+
      '<label class="f" data-heslo>Heslo<small>Aspoň 8 znaků. Předejte ho uživateli, heslo si pak může změnit kliknutím na své jméno vlevo dole.</small><span class="row" style="gap:8px"><input class="inp" name="heslo" type="text" autocomplete="new-password" spellcheck="false" style="flex:1"><button type="button" class="btn sm gh" id="ug">Vytvořit</button></span></label>'+
      '<p class="err-msg" role="alert" hidden></p></div><div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px"><button type="button" class="btn gh" id="uz">Zrušit</button><button class="btn pri" id="uo" value="ok">Uložit</button></div></form></dialog>';
    var dlg=$('#ud'),f=$('#uf'),er=$('.err-msg',f),edit=null;
    function otevri(u){edit=u||null;er.hidden=true;f.reset();$('#udt').textContent=u?'Upravit uživatele':'Nový uživatel';
      f.jmeno.value=u?u.jmeno:'';f.login.value=u?u.login:'';f.login.disabled=!!u;f.email.value=u?u.email:'';f.role.value=u?u.role:'obsluha';f.role.disabled=!!(u&&u.id===ja.id);
      $('[data-heslo]',f).hidden=!!u;if(!u)f.heslo.value=KK.uzivatele.heslo();
      var pv=u?u.prava:KK.prava.vse().obsluha;SK.forEach(function(k){f['pr_'+k].checked=!!pv[k]});prUkaz();
      if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');f.jmeno.focus()}
    function prUkaz(){$('[data-prava]',f).hidden=f.role.value==='admin'}
    f.role.addEventListener('change',prUkaz);
    $('#un').addEventListener('click',function(){otevri(null)});
    var umh=$('#umh');if(umh)umh.addEventListener('click',function(){var b=$('#ul tr[data-id="'+ja.id+'"] [data-a=heslo]');if(b)b.click()});
    $('#uz').addEventListener('click',function(){dlg.close()});
    $('#ug').addEventListener('click',function(){f.heslo.value=KK.uzivatele.heslo();f.heslo.select()});
    f.addEventListener('submit',function(e){e.preventDefault();er.hidden=true;
      var z={jmeno:f.jmeno.value,login:f.login.value,email:f.email.value,role:f.role.value,heslo:f.heslo.value,prava:{}};SK.forEach(function(k){z.prava[k]=f['pr_'+k].checked?1:0});
      if(z.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(z.email)){er.textContent='E-mail nevypadá správně.';er.hidden=false;f.email.focus();return}
      var pr=edit?KK.uzivatele.uprav(edit.id,{jmeno:z.jmeno,email:z.email,role:edit.id===ja.id?undefined:z.role,prava:z.prava}):KK.uzivatele.pridej(z);
      pr.then(function(u){dlg.close();toast(edit?'Uživatel upraven.':'Uživatel '+u.jmeno+' přidán. Heslo: '+z.heslo);if(edit&&edit.id===ja.id)shell(KK.auth.meSync());else route()}).catch(function(x){er.textContent=x.message;er.hidden=false})});
    var najdi=function(id){return U.filter(function(u){return u.id===id})[0]};
    $('#ul').addEventListener('change',function(e){var t=e.target,id=t.closest('tr').dataset.id,z={};z[t.dataset.u]=t.type==='checkbox'?t.checked:t.value;
      KK.uzivatele.uprav(id,z).then(function(){toast('Uloženo.');route()}).catch(function(x){toast(x.message,1);route()})});
    $('#ul').addEventListener('click',function(e){var b=e.target.closest('button[data-a]');if(!b)return;var id=b.closest('tr').dataset.id,u=najdi(id);
      if(b.dataset.a==='upr')otevri(u);
      if(b.dataset.a==='heslo'){(id===ja.id?ptej('Změnit vaše heslo\n\nNapište nové heslo, aspoň 8 znaků.',{pole:'',ok:'Změnit heslo'}):ptej('Nové heslo pro '+u.jmeno+'\n\nAspoň 8 znaků. Navržené heslo můžete přepsat.',{pole:KK.uzivatele.heslo(),ok:'Nastavit heslo'})).then(function(h){if(h==null)return;KK.uzivatele.noveHeslo(id,h).then(function(){toast(id===ja.id?'Vaše heslo je změněné.':'Heslo změněno: '+h);if(id===ja.id){var s2=KK.auth.meSync();if(s2)delete s2.vychozi;shell(KK.auth.meSync())}else route()}).catch(function(x){toast(x.message,1)})})}
      if(b.dataset.a==='del')ptej('Smazat uživatele '+u.jmeno+'?\n\nDo administrace se už nepřihlásí. Nejde to vrátit.',{ok:'Smazat',nebezp:1}).then(function(ok){if(ok)KK.uzivatele.smaz(id).then(function(){toast('Uživatel smazán.');route()}).catch(function(x){toast(x.message,1)})})});
  });
}

/* ---------- MŮJ ÚČET ---------- */
function ucet(m){
  var ja=KK.auth.meSync();
  m.innerHTML='<div class="ph"><div><h1>Můj účet</h1><p>'+esc(ja.jmeno)+' · '+esc(KK.ROLE[ja.role]||ja.role)+' · přihlašovací jméno <b>'+esc(ja.login)+'</b></p></div></div>'+
    (ja.vychozi?'<div class="card" style="border-left:4px solid var(--warn,#e0a100);margin-bottom:16px"><b>Používáte výchozí heslo „kemp“.</b> Změňte si ho prosím níže.</div>':'')+
    '<div class="grid g2"><form class="card" id="af" novalidate><h2>Údaje</h2><div class="grid" style="gap:12px"><label class="f">Jméno a příjmení<input class="inp" name="jmeno" required autocomplete="name"></label><label class="f">E-mail<input class="inp" name="email" type="email" autocomplete="email"></label></div><div class="row" style="margin-top:14px"><button class="btn pri">Uložit údaje</button></div></form>'+
    '<form class="card" id="hf" novalidate><h2>Změna hesla</h2><div class="grid" style="gap:12px"><label class="f">Současné heslo<input class="inp" name="stare" type="password" autocomplete="current-password" required></label><label class="f">Nové heslo<small>Aspoň 8 znaků.</small><input class="inp" name="nove" type="password" autocomplete="new-password" required></label><label class="f">Nové heslo znovu<input class="inp" name="znovu" type="password" autocomplete="new-password" required></label><p class="err-msg" role="alert" hidden></p></div><div class="row" style="margin-top:14px"><button class="btn pri">Změnit heslo</button></div></form></div>';
  var af=$('#af'),hf=$('#hf'),er=$('.err-msg',hf);af.jmeno.value=ja.jmeno;af.email.value=ja.email||'';
  af.addEventListener('submit',function(e){e.preventDefault();KK.auth.upravSebe({jmeno:af.jmeno.value,email:af.email.value}).then(function(){toast('Údaje uloženy.');shell(KK.auth.meSync())}).catch(function(x){toast(x.message,1)})});
  hf.addEventListener('submit',function(e){e.preventDefault();er.hidden=true;
    if(hf.nove.value!==hf.znovu.value){er.textContent='Nová hesla se neshodují.';er.hidden=false;hf.znovu.focus();return}
    KK.auth.zmenHeslo(hf.stare.value,hf.nove.value).then(function(){toast('Heslo změněno.');shell(KK.auth.meSync())}).catch(function(x){er.textContent=x.message;er.hidden=false})});
}

function nastaveni(m){
  m.innerHTML='<div class="ph"><div><h1>Nastavení a záloha</h1><p>Záloha obsahuje všechny upravené texty a překlady, vyměněné fotky a ikony na webu, ceník, SEO i fotky z galerie. Hodí se i pro přenesení na server.</p></div></div>'+
  '<div class="grid g2"><div class="card"><h2>Kde jsou data</h2><p><span class="badge warn">Náhled</span> Vše je uložené jen v tomto prohlížeči. Jiný počítač ani návštěvníci webu změny neuvidí.</p><p class="mut">Po spuštění na serveru se data budou ukládat do databáze a uvidí je všichni. Zálohu odsud pak jde na server nahrát.</p></div>'+
  '<div class="card"><h2>Záloha</h2><p class="mut">Stáhne soubor .json se všemi úpravami.</p><div class="row"><button class="btn pri" id="ex">Stáhnout zálohu</button><label class="btn gh" for="im">Nahrát zálohu</label><input type="file" id="im" accept=".json,application/json" hidden></div></div>'+
  '<div class="card"><h2>Začít znovu</h2><p class="mut">Smaže všechny úpravy textů, SEO i galerii a vrátí web do původní podoby.</p><button class="btn dan" id="rs">Smazat všechny úpravy</button></div></div>';
  $('#ex').addEventListener('click',function(){KK.export().then(function(d){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d)],{type:'application/json'}));a.download='kemp-krumlov-zaloha-'+new Date().toISOString().slice(0,10)+'.json';a.click();toast('Záloha stažena.')})});
  $('#im').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var inpZ=e.target;ptej('Nahrát zálohu?\n\nSoučasné úpravy webu, ceník i rezervace se přepíšou obsahem souboru.',{ok:'Nahrát zálohu',nebezp:1}).then(function(ok){if(!ok){inpZ.value='';return}
    f.text().then(function(t){return KK.import(JSON.parse(t))}).then(function(){ZDROJ=null;toast('Záloha obnovena.')}).catch(function(x){toast(x.message||'Soubor nejde načíst.',1)});inpZ.value=''})});
  $('#rs').addEventListener('click',function(){ptej('Smazat všechny úpravy?\n\nWeb, ceník i nastavení se vrátí do původní podoby. Nejde to vrátit.',{ok:'Smazat vše',nebezp:1}).then(function(ok){if(ok)KK.reset().then(function(){toast('Vše vráceno do původní podoby.')})})});
}

KK.auth.me().then(function(s){s?shell(s):login()});
})();
