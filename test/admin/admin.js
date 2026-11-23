/* Kemp Krumlov – administrace (náhled bez serveru). Data jdou přes ../js/kk-data.js */
(function(){
'use strict';
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var app=$('#app');
/* spravovaný web (přepínač nahoře v menu): Kemp Krumlov | PE-LA. Texty, fotky, galerie a SEO má každý web svoje,
   ceník, rezervace, půjčovna, doprava a účty jsou společné. */
var PELA=KK.WEB==='pela',WEB=PELA?'../pela/':'../',NAZEV=KK.WEBY[KK.WEB];
var GALSEL=PELA?'#fotogalerie .gitem':'#galerie .gl-i';
/* stránky webu PE-LA (náhled v test/pela, jazyky ve složkách en/ a de/) */
var PSTR=[['index','Úvod'],['kanoe','Kanoe'],['rafty','Rafty'],['vybaveni','Vybavení']];
var LOGO_PELA='<svg viewBox="0 0 64 64" width="22" height="22" aria-hidden="true"><path d="M41 8 27 33" stroke="currentColor" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M9 32h46c-2 8-10 13-23 13S11 40 9 32z" fill="currentColor"/><path d="M8 54c4-4 8-4 12 0s8 4 12 0 8-4 12 0 8 4 12 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>';
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
 rez_nastaveni:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
 rezervace:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',ubytovani:'<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5"/>',pujcovna:'<path d="M2 15c3.5 3.5 16.5 3.5 20 0M5 15l2.5-6h9L19 15M12 9V4"/>',doprava:'<path d="M2 16V7h12v9M14 10h4l4 4v2h-8"/><circle cx="6.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/>',
 lode:'<path d="M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2-1.5 4.5-1.5S19 17 21 17"/><path d="M5 13h14l-2-5H7z"/>',
 nastaveni:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 ven:'<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
 nahoru:'<path d="m15 18-6-6 6-6"/>',dolu:'<path d="m9 18 6-6-6-6"/>',
 oko:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 okoX:'<path d="M17.9 17.9A10 10 0 0 1 12 19c-6.5 0-10-7-10-7a18 18 0 0 1 5.1-5.9M9.9 5.2A9 9 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2M1 1l22 22"/>',
 kos:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
 upl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
 kalkulace:'<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6" rx="1"/><rect x="12" y="8" width="3" height="10" rx="1"/><rect x="17" y="5" width="3" height="13" rx="1"/>',
 zaznam:'<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>',
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
    var fotky=$$(GALSEL,d).map(function(f){var i=$('img',f);return{src:i.getAttribute('src'),full:PELA?f.getAttribute('data-full')||'':'',popis:i.getAttribute('alt')||'',kat:PELA?'':f.dataset.c||'',w:+i.getAttribute('width')||1536,h:+i.getAttribute('height')||1024}});
    var img=$$('img',d),bezAlt=img.filter(function(i){return !i.hasAttribute('alt')}).length,h1=$$('h1',d).length;
    ZDROJ={texty:texty,ceny:cen,fotky:fotky,bezAlt:bezAlt,h1:h1,obrazky:img.length};return ZDROJ;
  });
}

/* ---------- přihlášení ---------- */
function login(){
  app.innerHTML='<div class="login"><form novalidate aria-labelledby="lt"><div class="logo"><i>'+(PELA?LOGO_PELA:SV(IC.lode,22))+'</i>'+NAZEV+'</div><h1 id="lt">Administrace</h1><p>Přihlaste se pro správu webu.</p>'+
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
/* přepínač ve tvaru segmentu (jedna skupina = jeden rámeček, vybraná volba je bílá) */
function seg(nadpis,attr,pol,akt,ikony){return '<div class="segw"><span class="seg-l" aria-hidden="true">'+nadpis+'</span><div class="seg" role="group" aria-label="'+nadpis+'">'+pol.map(function(x){return '<button type="button" '+attr+'="'+x[0]+'" aria-pressed="'+(x[0]===akt)+'"'+(x[2]?' title="'+x[2]+'"':'')+'>'+(ikony&&ikony[x[0]]?SV(ikony[x[0]],16):'')+'<span>'+x[1]+'</span></button>'}).join('')+'</div></div>'}
var JZK={cs:'CZ',en:'EN',de:'DE'};
function jazykVolba(){var j=jazykAdm();return seg('Jazyk','data-jz',Object.keys(KK.JAZYKY).map(function(k){return [k,KK.JAZYKY[k]]}),j)}
function jazykKlik(m){$$('[data-jz]',m).forEach(function(b){b.addEventListener('click',function(){if(b.dataset.jz===jazykAdm())return;var jd=function(){KK.LS.set('admin-jazyk',b.dataset.jz);neulozeno=null;route()};if(neulozeno&&neulozeno())ptej('Máte neuložené změny\n\nKdyž přepnete jazyk, změny se neuloží.',{ok:'Přepnout bez uložení',ne:'Zůstat'}).then(function(a){if(a)jd()});else jd()})})}

/* ---------- kostra ---------- */
var VIEWS={rez_nastaveni:rezervace,upravit:upravit,prehled:prehled,galerie:galerie,seo:seo,cenik:cenik,rezervace:rezervace,ubytovani:rezervace,pujcovna:rezervace,doprava:rezervace,nastaveni:function(){location.replace('#rez_nastaveni')},zaznam:zaznam,kalkulace:kalkulace,uzivatele:uzivatele,ucet:ucet};
/* finanční souhrny a kalkulace: právo „smí vidět souhrny“ se nastavuje každému uživateli zvlášť (Uživatelé); správce vidí vždy */
var citSkryt=function(){var u=KK.auth.meSync();return !!u&&u.souhrny===false};
var NAV=[['Web',[['prehled','Přehled'],['upravit','Upravit web'],['galerie','Galerie'],['seo','SEO']]],['Provoz',[['rezervace','Rezervace'],['ubytovani','Ubytování'],['pujcovna','Půjčovna lodí'],['doprava','Doprava'],['cenik','Ceník a kapacity'],['kalkulace','Kalkulace']]],['Systém',[['zaznam','Záznam akcí'],['rez_nastaveni','Nastavení'],['uzivatele','Uživatelé']]]];
function shell(s){
  /* bez práv k webu PE-LA zpět na kemp (Provoz je společný) */
  if(PELA&&!KK.auth.muzeWeb('pela')){KK.LS.set('admin-web','kemp');location.reload();return}
  /* smí jen web PE-LA → rovnou PE-LA */
  if(!PELA&&!KK.auth.muzeWeb('kemp')&&KK.auth.muzeWeb('pela')){KK.LS.set('admin-web','pela');location.reload();return}
  /* obsluha se vzhledem „Aplikace pro obsluhu“ (nebo správce v náhledu) dostane jednoduchou aplikaci – admin/obsluha.js */
  if(window.KKO&&KKO.ma(s)){KKO.start(s,{app:app,ptej:ptej,pocty:pocty,toast:toast,login:login,shell:shell,rezervace:rezervace});return}
  document.documentElement.classList.remove('ob-on');
  app.innerHTML='<div class="top"><div class="logo"><i>'+(PELA?LOGO_PELA:SV(IC.lode,20))+'</i>'+NAZEV+'</div>'+prepinac('wsw-top')+'<button type="button" id="mb" aria-label="Otevřít menu" aria-expanded="false" aria-controls="side">'+SV(IC.menu,22)+'</button></div>'+
  '<div class="app"><nav class="side" id="side" aria-label="Administrace"><div class="logo"><i>'+(PELA?LOGO_PELA:SV(IC.lode,22))+'</i><span>'+NAZEV+'<small>Administrace</small></span></div>'+prepinac('')+
  NAV.map(function(g){var pol=g[1].filter(function(n){return KK.auth.muze(n[0])&&!(n[0]==='kalkulace'&&citSkryt())});if(!pol.length)return '';return '<div class="nav-t">'+g[0]+'</div>'+pol.map(function(n){return '<a class="nv" href="#'+n[0]+'">'+SV(IC[n[0]],19)+n[1]+(n[2]?'<span class="soon">brzy</span>':'')+'</a>'}).join('')}).join('')+
  '<a class="nv" href="'+WEB+'index.html" target="_blank" rel="noopener">'+SV(IC.ven,19)+(PELA?'Zobrazit web PE-LA':'Zobrazit web')+'</a>'+
  '<div class="who"><a href="#'+(KK.auth.muze('uzivatele')?'uzivatele':'ucet')+'" class="who-n" title="Můj účet a heslo"><b>'+esc(s.jmeno)+'</b><small>'+esc(KK.ROLE[s.role]||s.role)+'</small></a><button type="button" id="lo">Odhlásit</button></div></nav>'+
  '<main id="main" tabindex="-1"></main></div>';
  var side=$('#side'),mb=$('#mb'),scrim=null;
  function zavri(){side.classList.remove('open');mb.setAttribute('aria-expanded','false');if(scrim){scrim.remove();scrim=null}}
  mb.addEventListener('click',function(){side.classList.add('open');mb.setAttribute('aria-expanded','true');scrim=document.body.appendChild(Object.assign(document.createElement('div'),{className:'scrim'}));scrim.onclick=zavri;$('a',side).focus()});
  side.addEventListener('click',function(e){if(e.target.closest('a.nv'))zavri()});
  $('#lo').addEventListener('click',function(){odejit().then(function(a){if(a)KK.auth.logout().then(login)})});
  $$('[data-web]').forEach(function(b){b.addEventListener('click',function(){var w=b.dataset.web;if(w===KK.WEB)return;
    odejit().then(function(a){if(!a)return;neulozeno=null;KK.LS.set('admin-web',w);location.reload()})})});
  onhashchange=route;route();
}
/* přepínač spravovaného webu – nahoře v menu (na mobilu v horní liště); po přepnutí se administrace načte znovu v barvách webu */
function prepinac(tr){if(!(KK.auth.muzeWeb('kemp')&&KK.auth.muzeWeb('pela')))return '';return '<div class="wsw'+(tr?' '+tr:'')+'" role="group" aria-label="Spravovaný web">'+['kemp','pela'].map(function(w){return '<button type="button" data-web="'+w+'" aria-pressed="'+(w===KK.WEB)+'"'+(tr?' aria-label="'+KK.WEBY[w]+'"':'')+'>'+(tr&&w==='kemp'?'Kemp':KK.WEBY[w])+'</button>'}).join('')+'</div>'}
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
  d.innerHTML='<form method="dialog" novalidate><h2 id="pcth">'+esc(nad)+'</h2>'+(txt?'<p>'+esc(txt)+'</p>':'')+'<div class="pct-g">'+pol.map(function(x){return '<label class="pct-r"><span><b>'+esc(x[1])+'</b>'+(x[4]?'<small>'+esc(x[4])+'</small>':'')+'</span><span class="pct-s"><button type="button" data-d="-1" aria-label="Méně – '+esc(x[1])+'">−</button><input class="inp" type="number" min="0" max="'+x[3]+'" inputmode="numeric" name="'+x[0]+'" value="'+x[2]+'" data-all="'+x[2]+'"><button type="button" data-d="1" aria-label="Více – '+esc(x[1])+'">+</button><small>z '+x[3]+'</small></span></label>'}).join('')+'</div>'+
    '<div class="pct-q"><button type="button" class="btn sm gh on" data-q="max" aria-pressed="true">Vše</button><button type="button" class="btn sm gh" data-q="0">Nic</button></div><p class="pct-e" role="alert"></p>'+
    '<div class="ptj-b"><button type="button" class="btn gh" data-n>Zrušit</button><button type="submit" class="btn pri">'+esc(ok||'Uložit')+'</button></div></form>';
  document.body.appendChild(d);var f=$('form',d);
  /* „Vše“ = všechno z rezervace (výdej) nebo všechno, co má host u sebe (vrácení); je předvybrané */
  var vseOn=function(){var a=$$('input',f).every(function(i){return +i.value===+i.dataset.all}),z=$$('input',f).every(function(i){return !+i.value});var bv=$('[data-q=max]',f),bn=$('[data-q="0"]',f);bv.classList.toggle('on',a);bv.setAttribute('aria-pressed',a);bn.classList.toggle('on',z);bn.setAttribute('aria-pressed',z)};
  f.addEventListener('input',vseOn);
  var konec=function(v){if(hot)return;hot=true;try{d.close()}catch(e){}d.remove();res(v)};
  d.addEventListener('click',function(e){var b=e.target.closest('button');if(e.target===d){konec(null);return}if(!b)return;
    if(b.dataset.d){var i=b.parentNode.querySelector('input');i.value=Math.max(0,Math.min(+i.max,(+i.value||0)+(+b.dataset.d)))}if(b.dataset.d)vseOn();
    if(b.dataset.q)$$('input',f).forEach(function(i){i.value=b.dataset.q==='max'?i.dataset.all:0});vseOn()
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
  Promise.resolve(VIEWS[v](m,v)).then(function(){var h=$('h1',m);if(h){h.tabIndex=-1;h.focus({preventScroll:true})}document.title=(h?h.textContent+' · ':'')+'Administrace · '+NAZEV;scrollTo(0,0)});
}
addEventListener('beforeunload',function(e){if(neulozeno&&neulozeno()){e.preventDefault();e.returnValue=''}});


/* ---------- UPRAVIT WEB (stránka přímo v administraci) ---------- */
function upravit(m){
  var sir={pc:'100%',tab:'820px',mob:'390px'},J=jazykAdm(),LQ='&lang='+J;
  /* PE-LA: každý jazyk má vlastní stránky (en/, de/), vybírá se i stránka webu */
  var PS=PELA?KK.LS.get('admin-pela-str','index'):'';if(PELA&&!PSTR.some(function(x){return x[0]===PS}))PS='index';
  var ADR=PELA?WEB+(J!=='cs'?J+'/':'')+PS+'.html?edit=1':WEB+'index.html?edit=1'+LQ;
  var ZAR={pc:'<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',tab:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/>',mob:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'};
  m.innerHTML='<div class="ph" style="margin-bottom:14px"><div><h1>Upravit web'+(PELA?' PE-LA':'')+'</h1><p>Klikněte na text, fotku nebo ikonu a upravte je. Tlačítkem Procházet vypnete úpravy a můžete na webu normálně klikat '+(PELA?'(menu, odkazy, galerie). Ceny se mění v Ceníku – je společný s kempem.':'(kroky rezervace, místa na mapě).')+'</p></div><a class="btn sm gh" href="'+ADR+'" target="_blank" rel="noopener">'+SV(IC.ven,15)+' Otevřít v nové záložce</a></div>'+
  '<div class="card ed-bar">'+
   (PELA?seg('Stránka','data-ps',PSTR,PS):'')+jazykVolba()+
   '<span class="sp"></span>'+seg('Náhled','data-w',[['pc','<span class="sr">Počítač</span>','Počítač'],['tab','<span class="sr">Tablet</span>','Tablet'],['mob','<span class="sr">Mobil</span>','Mobil']],'pc',ZAR)+
  '</div>'+
  (J!=='cs'?'<p class="ed-pr">'+SV('<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>',16)+(PELA?'Upravujete '+(J==='en'?'anglickou':'německou')+' verzi webu PE-LA – texty pište '+(J==='en'?'anglicky':'německy')+'.':'Upravujete překlad – klikněte na český text a napište '+(J==='en'?'anglický':'německý')+'. Co nepřeložíte, zůstane česky.')+'</p>':'')+
  '<div class="frame"><iframe id="wf" title="Web '+NAZEV+' v editačním režimu" src="'+ADR+'"></iframe></div>';jazykKlik(m);
  $$('[data-ps]',m).forEach(function(b){b.addEventListener('click',function(){if(b.dataset.ps===PS)return;var jd=function(){KK.LS.set('admin-pela-str',b.dataset.ps);neulozeno=null;route()};if(neulozeno&&neulozeno())ptej('Máte neuložené změny\n\nKdyž přepnete stránku, změny se neuloží.',{ok:'Přepnout bez uložení',ne:'Zůstat'}).then(function(a){if(a)jd()});else jd()})});
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
      var mU=function(r){return !!((r.mista||[]).length||(r.dalsi&&(+r.dalsi.stan||+r.dalsi.karavan)))},pri=H.filter(function(x){return mU(x)&&x.od===dnes&&(x.stav==='pot'||x.stav==='pop')}).length,odj=H.filter(function(x){return mU(x)&&x.stav==='uby'&&x.do<=dnes}).length,pop=H.filter(function(x){return x.stav==='pop'}).length,tu=H.filter(function(x){return x.stav==='uby'}).reduce(function(a,x){var o=x.osoby||{};return a+KKC.osobPocet(o)},0);
      var o0=obs(dnes),proc=mista.length?Math.round(o0/mista.length*100):0;
      var tt=[['chatka','Chatky'],['podsad','Podsad. stany'],['teepee','Teepee']].filter(function(t){return R.rezTyp(t[0])}).map(function(t){var x=typ(t[0],dnes);return x[1]?'<span>'+t[1]+' <b>'+x[0]+'/'+x[1]+'</b></span>':''}).join('');
      var TG=REZ_ODKAZY?'a':'div',HR=REZ_ODKAZY?' href="#rezervace"':'';
      var dlz=function(t,dl){return ' data-pv="'+t+'"'+(dl!=null?' data-pvd="'+dl+'"':'')};
      prov='<div class="pv-k">'+
        '<'+TG+' class="card pv-s pv-big"'+HR+dlz('dnes')+'><small>Obsazeno dnes</small><b>'+proc+' %</b><i class="pv-m"><i style="width:'+proc+'%"></i></i><span class="pv-t">'+tt+'</span></'+TG+'>'+
        '<'+TG+' class="card pv-s"'+HR+dlz('dnes')+'><small>Přijíždí dnes</small><b>'+pri+'</b><span>'+(pri?pl(pri,'rezervace čeká','rezervace čekají','rezervací čeká')+' na ubytování':'nikdo')+'</span></'+TG+'>'+
        '<'+TG+' class="card pv-s"'+HR+dlz('dnes')+'><small>Odjíždí dnes</small><b>'+odj+'</b><span>'+(odj?'k odhlášení':'nikdo')+'</span></'+TG+'>'+
        '<'+TG+' class="card pv-s'+(pop?' pv-a':'')+'"'+HR+dlz('dnes')+'><small>Čeká na zálohu / potvrzení</small><b>'+pop+'</b><span>'+(pop?'zkontrolujte platby a potvrďte':'vše vyřízeno')+'</span></'+TG+'>'+
        '<div class="card pv-s"><small>V kempu teď</small><b>'+tu+'</b><span>'+pl(tu,'ubytovaný host','ubytovaní hosté','ubytovaných hostů')+'</span></div></div>';
      var dny=[],i;for(i=0;i<14;i++){var d=new Date(nd.getFullYear(),nd.getMonth(),nd.getDate()+i,12);dny.push(d)}
      var graf='<div class="card pv-g"><div class="pv-gh"><h2>Obsazenost na 14 dní</h2>'+(REZ_ODKAZY?'<a href="#rezervace"'+dlz('kal')+'>Otevřít kalendář →</a>':'')+'</div><div class="pv-b">'+dny.map(function(d){var x=obs(ISO(d)),p=mista.length?Math.round(x/mista.length*100):0,we=d.getDay()%6===0;return '<div class="pv-c'+(we?' we':'')+(ISO(d)===dnes?' tod':'')+'" title="'+d.getDate()+'. '+(d.getMonth()+1)+'.: obsazeno '+x+' z '+mista.length+' míst"><span class="pv-p">'+p+'</span><i style="height:'+Math.max(2,p)+'%" class="'+(p>=90?'pl':p>=60?'st':'')+'"></i><small>'+DK[d.getDay()]+'<br>'+d.getDate()+'.</small></div>'}).join('')+'</div><p class="mut pv-lg">Procento obsazených chatek, podsadových stanů a teepee na noc.</p></div>';
      var rok=nd.getFullYear(),sez=function(y){var L=H.filter(function(x){return x.od.slice(0,4)===String(y)}),n=0,c=0;L.forEach(function(x){n+=Math.round((D0(x.do)-D0(x.od))/864e5);c+=+x.cena||0});return [L.length,n,c]};
      var s1=sez(rok),s2=sez(rok+1),nov=H.filter(function(x){return x.zdroj==='web'&&x.vytvoreno&&Date.now()-x.vytvoreno<7*864e5}).length;
      var sz=citSkryt()?'':'<div class="card pv-z"><h2>Sezóna v číslech</h2><table class="pv-zt"><thead><tr><th></th><th>'+rok+'</th><th>'+(rok+1)+'</th></tr></thead><tbody>'+
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
    m.innerHTML='<div class="ph"><div><h1>Galerie'+(PELA?' PE-LA':'')+'</h1><p>Nahrajte více fotek najednou, upravte popisky a kategorie a přetažením změňte pořadí. Prvních '+(PELA?12:9)+' fotek vidí návštěvník hned, ostatní po kliknutí na „Zobrazit další fotky“.</p></div><a class="btn gh" href="'+WEB+(PELA?'index.html#fotogalerie':'#galerie')+'" target="_blank" rel="noopener">Zobrazit na webu '+SV(IC.ven,16)+'</a></div>'+
    '<div class="drop" id="dz" tabindex="0" role="button" aria-describedby="dzh">'+SV(IC.upl,34)+'<b>Přetáhněte sem fotky</b><span class="mut" id="dzh">nebo je vyberte z počítače či telefonu · JPG, PNG, WebP · fotky se automaticky zmenší a převedou do WebP</span>'+
    '<div class="row"><label class="row" style="font-weight:600" for="dk">Kategorie nových fotek</label><select id="dk" class="inp" style="width:auto;min-height:40px">'+katOpts('')+'</select><button type="button" class="btn sm gh" id="gkat">'+SV('<path d="M12 5v14M5 12h14"/>',16)+'Kategorie</button><button type="button" class="btn pri sm" id="dv">Vybrat fotky</button></div>'+
    '<input type="file" id="df" accept="image/*" multiple hidden></div><ul class="up-list" id="ul" aria-live="polite"></ul>'+
    '<div class="gtools"><label class="row" style="font-weight:600"><input type="checkbox" id="ga" style="width:18px;height:18px;accent-color:#f4a64a"> Vybrat vše</label><span id="gs" class="mut"></span><span class="sp"></span>'+
    '<span class="row" id="gb" hidden><label class="sr" for="gk">Změnit kategorii vybraných</label><select id="gk" class="inp" style="width:auto;min-height:36px"><option value="-">Změnit kategorii…</option>'+katOpts(null)+'</select><button type="button" class="btn sm gh" data-h="0">Skrýt</button><button type="button" class="btn sm gh" data-h="1">Zobrazit</button><button type="button" class="btn sm dan" id="gd">Smazat</button></span></div>'+
    '<div class="ggrid" id="gg" role="list"></div>';
    var gg=$('#gg'),df=$('#df'),dz=$('#dz');
    function katOpts(sel){return '<option value=""'+(sel===''?' selected':'')+'>Bez kategorie</option>'+KK.galKat.vse().map(function(k){return '<option value="'+esc(k.k)+'"'+(sel===k.k?' selected':'')+'>'+esc(k.n)+'</option>'}).join('')}
    /* znovu naplnit všechny výběry kategorií po změně */
    function katObnov(){$('#dk').innerHTML=katOpts($('#dk').value);$('#gk').innerHTML='<option value="-">Změnit kategorii…</option>'+katOpts(null);kresli()}
    /* správa kategorií: přejmenovat (i anglicky a německy), přidat, smazat, pořadí */
    function katSprava(){var K=KK.galKat.vse(),d=document.createElement('dialog');d.className='dlg gkd';d.setAttribute('aria-labelledby','gkdh');
      var poc=function(k){return fotky.filter(function(f){return f.kat===k}).length};
      var radek=function(k,i){return '<li data-k="'+esc(k.k)+'"><div class="gkd-n"><label><span class="sr">Název česky</span><input class="inp" data-p="n" value="'+esc(k.n)+'" placeholder="Název česky" autocomplete="off"></label>'+
        '<span class="gkd-c">'+poc(k.k)+' '+pl(poc(k.k),'fotka','fotky','fotek')+'</span>'+
        '<button type="button" class="btn ic gh" data-m="-1" aria-label="Posunout nahoru"'+(i?'':' disabled')+'>'+SV('<path d="m6 15 6-6 6 6"/>',16)+'</button><button type="button" class="btn ic gh" data-m="1" aria-label="Posunout dolů"'+(i<K.length-1?'':' disabled')+'>'+SV('<path d="m6 9 6 6 6-6"/>',16)+'</button>'+
        '<button type="button" class="btn ic dan" data-x aria-label="Smazat kategorii '+esc(k.n)+'">'+SV(IC.kos,16)+'</button></div>'+
        '<div class="gkd-t"><label><span>EN</span><input class="inp" data-p="en" value="'+esc(k.en||'')+'" placeholder="'+(k.t?'podle překladu webu':'anglicky')+'" autocomplete="off"></label><label><span>DE</span><input class="inp" data-p="de" value="'+esc(k.de||'')+'" placeholder="'+(k.t?'podle překladu webu':'německy')+'" autocomplete="off"></label></div></li>'};
      var nakresli=function(){$('ol',d).innerHTML=K.map(radek).join('')||'<li class="mut">Zatím žádná kategorie.</li>'};
      var sber=function(){$$('li[data-k]',d).forEach(function(li){var k=K.filter(function(x){return x.k===li.dataset.k})[0];$$('[data-p]',li).forEach(function(i){k[i.dataset.p]=i.value.trim()})})};
      d.innerHTML='<form method="dialog" novalidate><h2 id="gkdh">Kategorie galerie</h2><p class="mut" style="margin:-6px 0 12px">Návštěvník na webu vidí jen kategorie, ve kterých je aspoň jedna fotka. Překlad EN/DE můžete nechat prázdný – použije se český název.</p>'+
        '<ol class="gkd-l"></ol><button type="button" class="btn sm" data-add>'+SV('<path d="M12 5v14M5 12h14"/>',16)+'Přidat kategorii</button><p class="err" hidden></p>'+
        '<div class="ptj-b"><button type="button" class="btn gh" data-z>Zrušit</button><button type="submit" class="btn pri">Uložit</button></div></form>';
      document.body.appendChild(d);nakresli();var smaz=[];
      var zavri=function(){try{d.close()}catch(e){}d.remove()};
      d.addEventListener('cancel',function(e){e.preventDefault();zavri()});
      $('[data-z]',d).addEventListener('click',zavri);
      d.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.type==='submit')return;sber();
        if(b.hasAttribute('data-add')){K.push({k:KK.galKat.novyKlic(),n:''});nakresli();var ins=$$('[data-p="n"]',d);ins[ins.length-1].focus();return}
        var li=b.closest('li[data-k]');if(!li)return;var ix=K.findIndex(function(x){return x.k===li.dataset.k});
        if(b.dataset.m){var j=ix+(+b.dataset.m);var t=K[ix];K[ix]=K[j];K[j]=t;nakresli();var nb=$('li[data-k="'+t.k+'"] [data-m="'+b.dataset.m+'"]',d);(nb&&!nb.disabled?nb:$('li[data-k="'+t.k+'"] input',d)).focus();return}
        if(b.hasAttribute('data-x')){var n=poc(K[ix].k),jm=K[ix].n||'bez názvu';
          var ok=function(){smaz.push(K[ix].k);K.splice(ix,1);nakresli()};
          if(!n){ok();return}
          d.close();ptej('Smazat kategorii „'+jm+'“?\n\n'+n+' '+pl(n,'fotka v ní zůstane','fotky v ní zůstanou','fotek v ní zůstane')+' v galerii jako Bez kategorie.',{ok:'Smazat',nebezp:1}).then(function(y){d.showModal();if(y)ok()})}});
      $('form',d).addEventListener('submit',function(e){e.preventDefault();sber();var er=$('.err',d);
        var prazdne=K.filter(function(x){return !x.n})[0];if(prazdne){er.textContent='Vyplňte název u každé kategorie (nebo ji smažte).';er.hidden=false;$('li[data-k="'+prazdne.k+'"] [data-p="n"]',d).focus();return}
        var jm={},dup=K.filter(function(x){var l=x.n.toLowerCase();if(jm[l])return true;jm[l]=1})[0];if(dup){er.textContent='Kategorie „'+dup.n+'“ je tam dvakrát.';er.hidden=false;return}
        K.forEach(function(x){if(!x.en)delete x.en;if(!x.de)delete x.de});KK.galKat.uloz(K);
        var zm=fotky.filter(function(f){return f.kat&&smaz.indexOf(f.kat)>=0});
        Promise.all(zm.map(function(f){f.kat='';return KK.galerie.uprav(f.id,{kat:''})})).then(function(){zavri();katObnov();toast('Kategorie uloženy.'+(zm.length?' '+zm.length+' '+pl(zm.length,'fotka je','fotky jsou','fotek je')+' bez kategorie.':''))})});
      d.showModal();var f0=$('[data-p="n"]',d);if(f0)f0.focus()}
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
    $('#gkat').addEventListener('click',katSprava);
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
  r.push([s.firma.telefon&&s.firma.ulice?'ok':'warn','Údaje o '+(PELA?'půjčovně':'kempu')+' pro Google (adresa, telefon) '+(s.firma.telefon&&s.firma.ulice?'jsou vyplněné.':'chybí.')]);
  return r;
}
function seo(m){
  return Promise.all([zdroj(),KK.galerie.aktivni()?KK.galerie.seznam():Promise.resolve([])]).then(function(r){
    var z=r[0],s=KK.seo.nactiSync(),zm=false;neulozeno=function(){return zm};
    var obr=(r[1].length?r[1].filter(function(f){return f.src}):z.fotky).map(function(f){return f.src});
    var F=function(n,lab,pom,typ,max){return '<label class="f">'+lab+(pom?'<small>'+pom+'</small>':'')+(typ==='ta'?'<textarea class="inp" name="'+n+'" rows="3"></textarea>':'<input class="inp" name="'+n+'"'+(typ?' type="'+typ+'"':'')+'>')+(max?'<span class="cnt" data-c="'+n+'" data-max="'+max+'"></span>':'')+'</label>'};
    m.innerHTML='<div class="ph"><div><h1>SEO</h1><p>Jak se '+(PELA?'web PE-LA (úvodní stránka)':'web')+' zobrazí ve vyhledávání Googlu a při sdílení na Facebooku či WhatsAppu. Na serveru se tyto údaje zapíšou přímo do stránky.</p></div></div>'+
    '<form id="sf" class="grid g2" novalidate><div class="grid" style="align-content:start">'+
    '<div class="card"><h2>Vyhledávání</h2><p class="mut">Titulek a popis, které uvidí lidé v Googlu.</p><div class="grid">'+F('title','Titulek stránky','Co nejvýstižněji, důležitá slova na začátek.','',60)+F('description','Popis stránky','Krátké shrnutí, které láká ke kliknutí.','ta',160)+F('keywords','Klíčová slova','Oddělte čárkou. Slova a fráze, podle kterých vás mají lidé najít.','ta')+'<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:-4px"><button type="button" class="btn sm gh" id="kwn">Doplnit návrh</button><span class="mut" id="kwc" style="font-size:12.5px"></span></div>'+F('canonical','Hlavní adresa webu','Adresa, pod kterou má Google web vést.','url')+
    '<label class="row" style="font-weight:700"><input type="checkbox" name="index" style="width:20px;height:20px;accent-color:#f4a64a"> Povolit zobrazení ve vyhledávačích</label></div></div>'+
    '<div class="card"><h2>Sdílení na sociálních sítích</h2><p class="mut">Když nevyplníte, použije se titulek a popis z vyhledávání.</p><div class="grid">'+F('ogTitle','Titulek při sdílení','','',70)+F('ogDescription','Popis při sdílení','','ta',200)+
    '<div><b style="font-size:14px">Obrázek při sdílení</b><div class="ogpick" role="group" aria-label="Obrázek při sdílení">'+obr.map(function(o){return '<button type="button" data-og="'+esc(o)+'" style="background-image:url(\''+esc(WEB+o)+'\')" aria-label="'+esc(o)+'"></button>'}).join('')+'</div></div></div></div>'+
    '<div class="card"><h2>Údaje o '+(PELA?'půjčovně':'kempu')+' pro Google</h2><p class="mut">Google z nich ukazuje adresu, telefon a polohu na mapě (strukturovaná data).</p><div class="grid g2" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">'+
    F('f.nazev','Název')+F('f.telefon','Telefon','','tel')+F('f.email','E-mail','','email')+F('f.ulice','Ulice a číslo')+F('f.mesto','Město')+F('f.psc','PSČ')+F('f.lat','Zeměpisná šířka')+F('f.lng','Zeměpisná délka')+'<div class="f"><b style="font-size:14px">Cenové rozpětí</b><small>Počítá se samo z Ceníku – od nejlevnějšího po nejdražší ubytování.</small><output class="inp" style="display:block;background:#f5f3ec">'+esc(KKC.rozpeti())+'</output></div>'+'</div></div>'+
    '<div class="card"><h2>Google Search Console</h2>'+F('googleVerify','Ověřovací kód','Z Google Search Console → Ověření vlastnictví → značka HTML (jen hodnota content).')+'</div>'+
    '</div><div class="grid" style="align-content:start;position:sticky;top:20px"><div class="card seo-pre"><h2>Náhled v Googlu</h2><div class="serp" aria-hidden="true"><div class="u"><i>'+(PELA?'P':'K')+'</i><span><b style="font-weight:400">'+NAZEV+'</b><br><span id="pu"></span></span></div><div class="t" id="pt"></div><div class="d" id="pd"></div></div>'+
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
    /* skládání slev: název, výše, podmínky (vše nepovinné), z čeho se počítá, kdy platí */
    var SLT=[['proc','%'],['kc','Kč za pobyt'],['noc','Kč za noc']],UBK=function(){return C.polozky.filter(function(x){return x.kat==='ubytovani'&&x.skryt!==1})};
    var slvPopis=function(x){var d=KKC.slevaPopis.call(null,x),NA=x.na&&x.na.length?x.na:['_uby'];d.hodnota=d.hodnota.replace(/ \(.*\)$/,'')+' z ceny: '+NA.map(function(k){if(k.charAt(0)==='_')return KKC.slevaZ(k);var q=C.polozky.filter(function(p){return p.k===k})[0];return q?q.n.toLowerCase():k}).join(' + ');
      return '<b>'+esc(d.hodnota)+'</b>'+(d.podminky?', když: '+esc(d.podminky)+'.':' – vždy, bez podmínek.')+(x.komb===1?' Sčítá se s dalšími slevami.':'')};
    var slvKarta=function(x,i){var p=x.pod||{},na=x.na||[],POD=KKC.POD,uz=POD.filter(function(d){return p[d[0]]!=null});
      return '<div class="slv'+(x.zap===0?' off':'')+'"><div class="slv-h"><label class="sw" title="Zapnutá"><input type="checkbox" data-sv2="'+i+'" data-f="zap"'+(x.zap===0?'':' checked')+'><span aria-hidden="true"></span><span class="sr">Sleva zapnutá</span></label>'+
        '<input class="inp slv-n" data-sv2="'+i+'" data-f="n" value="'+esc(x.n||'')+'" placeholder="Název, např. Skupina od 10 osob" aria-label="Název slevy">'+
        '<span class="slv-v"><span class="slv-m">−</span><input class="inp num" type="number" min="0" step="1" data-sv2="'+i+'" data-f="h" value="'+(+x.h||0)+'" aria-label="Výše slevy"><select class="inp" data-sv2="'+i+'" data-f="typ" aria-label="Druh slevy">'+SLT.map(function(t){return '<option value="'+t[0]+'"'+((x.typ||'proc')===t[0]?' selected':'')+'>'+t[1]+'</option>'}).join('')+'</select></span>'+
        '<button type="button" class="btn ic dan" data-svx="'+i+'" aria-label="Smazat slevu – '+esc(x.n||'')+'">'+SV(IC.kos,18)+'</button></div>'+
        '<div class="slv-r"><span class="slv-l">Platí, když</span><div class="slv-p">'+(uz.length?uz.map(function(d){return '<span class="slv-c">od <input class="inp num" type="number" min="1" max="999" data-svp="'+i+'" data-k="'+d[0]+'" value="'+(+p[d[0]]||1)+'" aria-label="Od kolika – '+d[1]+'"> '+d[1]+'<button type="button" data-svpx="'+i+'|'+d[0]+'" aria-label="Odebrat podmínku – '+d[1]+'">×</button></span>'}).join('<i class="slv-a">a</i>'):'<em class="mut">vždy</em>')+
          (uz.length<POD.length?'<select class="inp slv-add" data-svpa="'+i+'" aria-label="Přidat podmínku"><option value="">+ přidat podmínku</option>'+POD.filter(function(d){return p[d[0]]==null}).map(function(d){return '<option value="'+d[0]+'">od … '+d[1]+'</option>'}).join('')+'</select>':'')+'</div></div>'+
        '<div class="slv-r"><span class="slv-l">Sleva z</span><div class="slv-p">'+(function(){var NA=na.length?na:['_uby'],cel=NA.indexOf('_uby')>=0,ch=function(k,t,dis){var on=NA.indexOf(k)>=0;return '<button type="button" class="ck-ch'+(on?' on':'')+(dis?' dim':'')+'" data-svna="'+i+'|'+k+'" aria-pressed="'+on+'">'+(on?'✓ ':'')+t+'</button>'};
          return ch('_uby','Celé ubytování')+UBK().map(function(u){return ch(u.k,'jen '+esc(u.n.toLowerCase()),cel)}).join('')+'<span class="slv-sep" aria-hidden="true"></span>'+ch('_lode','Půjčené lodě')+ch('_dop','Doprava')})()+'</div></div>'+
        '<div class="slv-r"><span class="slv-l">Kdy</span><div class="slv-p"><select class="inp slv-s" data-sv2="'+i+'" data-f="sez" aria-label="Sezóna">'+[['','celý rok'],['hlavni','jen hlavní sezóna'],['mimo','jen mimo hlavní sezónu']].map(function(o){return '<option value="'+o[0]+'"'+((x.sez||'')===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select>'+
          '<label class="slv-d">příjezd od <input class="inp" type="date" data-sv2="'+i+'" data-f="od" value="'+(x.od||'')+'"></label><label class="slv-d">do <input class="inp" type="date" data-sv2="'+i+'" data-f="do" value="'+(x.do||'')+'"></label></div></div>'+
        '<div class="slv-r"><span class="slv-l"></span><div class="slv-p"><label class="slv-k"><input type="checkbox" class="cb" data-sv2="'+i+'" data-f="komb"'+(x.komb===1?' checked':'')+'> sčítat s ostatními slevami</label><label class="slv-k"><input type="checkbox" class="cb" data-sv2="'+i+'" data-f="web"'+(x.web===0?'':' checked')+'> ukázat v ceníku na webu</label></div></div>'+
        '<p class="slv-sum" data-svs="'+i+'">'+slvPopis(x)+'</p></div>'};
    var slvUpd=function(i){var e=$('[data-svs="'+i+'"]',m);if(e)e.innerHTML=slvPopis(C.slevy[i])};
    function kresli(){
      var o=md(C.sezona.otevrenoOd),d=md(C.sezona.otevrenoDo),HZ=C.sezona.hlavniZap!==false,CR=C.sezona.celorocne===true;
      var MENA_KARTA='<div class="card"><h2>Měna</h2><p class="mut">Ceny se zadávají v korunách. Na webu si je host může přepnout na eura (v ceníku tlačítkem Kč / €). Anglická a německá verze webu ukazuje eura automaticky.</p>'+
      '<div class="sw-l"><label class="sw"><input type="checkbox" data-mn="eur"'+(C.mena.eur!==false?' checked':'')+'><span aria-hidden="true"></span>Nabízet ceny v eurech</label></div>'+
      (C.mena.eur!==false?'<div class="row" style="gap:16px;flex-wrap:wrap"><label class="row" style="font-weight:700">Kurz: 1 € = <input class="inp num" type="number" min="1" max="100" step="0.1" data-mn="kurz" value="'+C.mena.kurz+'" aria-label="Kurz – kolik korun je 1 euro"> Kč</label>'+
      '<label class="row" style="font-weight:700">Zaokrouhlit na <select class="inp" data-mn="zaokr" aria-label="Zaokrouhlení cen v eurech" style="width:auto">'+[[1,'celá eura'],[0.5,'0,50 €'],[0.1,'0,10 €']].map(function(o){return '<option value="'+o[0]+'"'+(+C.mena.zaokr===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></label></div>'+
      '<p class="mut" style="margin:10px 0 0">Příklad: chatka '+KKC.fmt(C.polozky.filter(function(p){return p.k==='chatka'}).map(function(p){return p.a})[0]||990)+' Kč ≈ '+(Math.round((C.polozky.filter(function(p){return p.k==='chatka'}).map(function(p){return p.a})[0]||990)/C.mena.kurz/C.mena.zaokr)*C.mena.zaokr).toLocaleString('cs-CZ')+' €</p>':'')+'</div>';
      var SLEVY_KARTA='<section class="card slvk" style="margin-bottom:16px"><div class="row" style="margin-bottom:6px"><h2 style="margin:0">Slevy</h2><span class="badge ck-web" title="Zobrazuje se v ceníku na webu">Ceník</span><span class="sp"></span><button type="button" class="btn sm pri" id="sla">+ Přidat slevu</button></div>'+
        '<p class="mut" style="margin:0 0 12px">Slevu si složíte z podmínek – počet nocí, osob, chatek, stanů, lodí… Všechny podmínky jsou nepovinné a musí platit zároveň. Když má host nárok na víc slev, platí ta nejvýhodnější (a k ní ty, které se smí sčítat). U každé slevy vyberete, z čeho se počítá – z ubytování, z půjčených lodí, z dopravy, nebo z více částí najednou.</p>'+
        (C.slevy.length?C.slevy.map(slvKarta).join(''):'<p class="mut">Žádné slevy.</p>')+'</section>';
      var h='<div class="row" style="margin-bottom:14px;gap:12px;flex-wrap:wrap">'+jazykVolba()+(PR?'<span class="mut">Překlad názvů a poznámek do jazyka '+KK.JAZYKY[J]+'. Prázdné pole = použije se šedý návrh (výchozí překlad), případně čeština. Ceny jsou pro všechny jazyky stejné.</span>':'')+'</div>'+
      '<div class="ph"><div><h1>Ceník a kapacity'+(PR?' – '+KK.JAZYKY[J]:'')+'</h1><p><span class="badge ok">Společný pro Kemp Krumlov i PE-LA</span> Jediné místo, kde se mění ceny. Projeví se všude na webu kempu – v úvodu, u ubytování, v ceníku, na mapě kempu a u dopravy –, na webu PE-LA (lodě, návoz, doprava, ubytování od) a také ve výpočtu rezervace.</p></div>'+
      '<div class="row"><a class="btn gh" href="'+WEB+'#ubytovani" target="_blank" rel="noopener">Zobrazit web '+SV(IC.ven,16)+'</a><button type="button" class="btn dan" id="cr">Obnovit výchozí ceník</button></div></div>'+
      ckn()+ckg('obecne')+'<div class="grid g2" style="margin-bottom:16px"><div class="card"><h2>Sezóna</h2><p class="mut">Kdy je kemp otevřený a jestli platí vyšší ceny v hlavní sezóně.</p>'+
      '<div class="sw-l"><label class="sw"><input type="checkbox" data-sz="celorocne"'+(CR?' checked':'')+'><span aria-hidden="true"></span>Otevřeno celý rok</label>'+
      '<label class="sw"><input type="checkbox" data-sz="hlavniZap"'+(HZ?' checked':'')+'><span aria-hidden="true"></span>Hlavní sezóna s vyššími cenami</label></div>'+
      (HZ?'':'<p class="mut" style="margin:0 0 12px">Vypnuto: po celý rok platí jedna cena (sloupec Cena). Ceny „Mimo sezónu“ zůstanou uložené pro případ, že sezónu znovu zapnete.</p>')+
      '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">'+(CR?'':'<fieldset class="fs"><legend>Otevřeno od</legend><div class="row"><select class="inp" data-s="od-d" aria-label="Den otevření">'+DNY(o[1])+'</select><select class="inp" data-s="od-m" aria-label="Měsíc otevření">'+MES(o[0])+'</select></div></fieldset>'+
      '<fieldset class="fs"><legend>Otevřeno do (den odjezdu)</legend><div class="row"><select class="inp" data-s="do-d" aria-label="Den uzavření">'+DNY(d[1])+'</select><select class="inp" data-s="do-m" aria-label="Měsíc uzavření">'+MES(d[0])+'</select></div></fieldset>')+
      (HZ?'<fieldset class="fs"><legend>Hlavní sezóna</legend><div class="row"><select class="inp" data-s="h-od" aria-label="Hlavní sezóna od">'+MES(C.sezona.hlavniOd)+'</select><span>–</span><select class="inp" data-s="h-do" aria-label="Hlavní sezóna do">'+MES(C.sezona.hlavniDo)+'</select></div></fieldset>':'')+'</div></div>'+
      MENA_KARTA+'</div>'+SLEVY_KARTA+
      '';
      h+=ckg('kemp')+'<section class="card ck" style="margin-bottom:16px"><div class="row" style="margin-bottom:6px"><h2 style="margin:0">Služby v kempu</h2><span class="badge ck-web" title="Zobrazuje se v ceníku na webu">Ceník</span><span class="sp"></span><button type="button" class="btn sm pri" id="sva">+ Přidat službu</button></div>'+
        '<p class="mut" style="margin:0 0 12px">Jen text do ceníku na webu (např. sprcha, úschovna). Do ceny rezervace se nepočítají, cenu napište i s jednotkou.</p>'+
        (C.sluzby.length?'<div class="tw-wrap"><table class="ct"><thead><tr><th>Služba</th><th>Cena a podmínky (text)</th><th><span class="sr">Akce</span></th></tr></thead><tbody>'+C.sluzby.map(function(x,i){return '<tr><td><input class="inp" data-sv="'+i+'" data-f="'+pole('n')+'" value="'+esc(hod(x,'n'))+'"'+ph(x,'n')+' aria-label="Název služby'+(PR?' – '+KK.JAZYKY[J]:'')+'"></td><td><input class="inp" data-sv="'+i+'" data-f="'+pole('t')+'" value="'+esc(hod(x,'t'))+'"'+(PR?ph(x,'t'):' placeholder="např. 20 Kč / 4 min"')+' aria-label="Cena a podmínky – '+esc(x.n)+'"></td><td class="c"><button type="button" class="btn ic dan" data-svd="'+i+'" aria-label="Smazat službu – '+esc(x.n)+'">'+SV(IC.kos,18)+'</button></td></tr>'}).join('')+'</tbody></table></div>':'<p class="mut">Žádné služby – v ceníku na webu se sekce nezobrazí.</p>')+'</section>';
      var kempI=-1;
      Object.keys(C.kategorie).forEach(function(kat){if(kat==='navoz')return;/* návoz se nastavuje u zastávek v Dopravě */
        var K=C.kategorie[kat],pol=C.polozky.filter(function(p){return p.kat===kat}),dva=K.sloupce.length>1&&(HZ||kat==='lode'||kat==='navoz'),SL=dva||K.sloupce.length<2?K.sloupce:['Cena'],ub=kat==='ubytovani',dop=kat==='doplnky',slu=kat==='sluzby',rez=ub||dop,lod=kat==='lode',dpr=kat==='doprava',oso=kat==='osoby';
        if(kat==='lode')h+=ckg('pujc');if(kat==='doprava')h+=ckg('dop');
        h+='<section class="card ck ck-'+(lod||kat==='navoz'?'pujc':dpr?'dop':'kemp')+'" style="margin-bottom:16px"><div class="row" style="margin-bottom:10px"><h2 style="margin:0">'+esc(dpr?'Doprava osob a návoz lodí':K.n)+'</h2>'+(oso||ub||dop?'<span class="badge ck-web" title="Zobrazuje se v ceníku na webu">Ceník</span>':'')+'<span class="sp"></span>'+(K.pevne?'<span class="badge">pevné položky</span>':'<button type="button" class="btn sm pri" data-add="'+kat+'">+ Přidat položku</button>')+'</div>'+
        (dop?'<p class="mut" style="margin:-4px 0 12px">Doplňky se zaškrtnutím „V rezervaci“ si host může přidat v kroku Doplňky.</p>':'')+(oso?'<p class="mut" style="margin:-4px 0 12px">Nová skupina (např. senior, ZTP) se objeví v rezervaci v kroku Kdo jede a v ceníku.</p>':'')+(dpr?'<ul class="ck-tip"><li><b>Doprava osob</b> – cena za jedno auto (až 8 osob).</li><li><b>Návoz lodí</b> – platí dražší ze zastávky startu a cíle, vždy jen jeden. Není v ceně rezervace, vybírá se na místě.</li><li><b>Pořadí</b> – zastávky po proudu shora dolů (šipkami vpravo). Kemp leží mezi Centrem a Zlatou Korunou.</li></ul>':'')+(lod?'<p class="mut" style="margin:-4px 0 12px">Cena za jednu loď a den včetně pádel, vest a barelů. Počty kusů na skladě nastavíte v Rezervace → Nastavení → Půjčovna a zálohy.</p>':'')+(kat==='navoz'?'<p class="mut" style="margin:-4px 0 12px">Návoz NENÍ v ceně rezervace – platí se na místě, vždy jen jeden. <b>Ceny návozu se nastavují u jednotlivých zastávek v části Doprava</b> (platí dražší ze startu a cíle). Tyto obecné ceny se použijí jen u zastávky bez vlastní ceny a pro web PE-LA.</p>':'')+''+(ub?'<p class="mut" style="margin:-4px 0 12px">Lůžka = kolik osob se vejde do jedné jednotky (prázdné = vlastní spaní, např. stan nebo karavan). Od osob = nepovinné, ubytování půjde na webu rezervovat jen pro skupiny od tolika osob.</p>':'')+
        (function(){kempI=-1;if(dpr)pol.some(function(p,x){if(p.k==='dop8'||p.k==='dop9'){kempI=x;return true}});return ''})()+
        '<div class="tw-wrap"><table class="ct'+(dpr?' ct-dop':'')+'"><thead>'+(dpr?'<tr class="cdg"><th rowspan="2">Zastávka</th><th rowspan="2">Poznámka</th><th rowspan="2" class="n cdo">Doprava osob<small>za auto (8 osob)</small></th><th colspan="2" class="nvg">Návoz lodí · do 10 lodí</th><th colspan="2" class="nvg nvg2">Návoz lodí · 10 a více lodí</th><th rowspan="2"><span class="sr">Akce</span></th></tr><tr class="cdg2"><th class="n nvh nvs">1 den</th><th class="n nvh">více dní</th><th class="n nvh nvs nvh2">1 den</th><th class="n nvh nvh2">více dní</th></tr></thead><tbody>':'<tr><th>Název</th><th>Poznámka</th>'+SL.slice(0,dva?2:1).map(function(c){return '<th class="n">'+esc(c)+'</th>'}).join('')+(ub?'<th class="n">Lůžek</th><th class="n" title="Nepovinné: rezervace na webu jen pro skupiny od tolika osob">Od osob</th>':'')+(lod?'<th class="n">Osob</th>':'')+(slu?'<th>Za</th>':'')+(rez?'<th>V rezervaci</th>':'')+'<th><span class="sr">Akce</span></th></tr></thead><tbody>')+
        pol.map(function(p,pi){var i=C.polozky.indexOf(p),fix=K.pevne||POUZITO[p.k]||/^dop\d|^(kanoe|raft)/.test(p.k);
          var kemp=dpr&&pi===kempI?'<tr class="ck-kemp"><td colspan="9"><span><i aria-hidden="true">▲</i><b>Kemp Krumlov</b><small>odtud vezeme · výš proti proudu, níž po proudu</small></span></td></tr>':'';
          return kemp+'<tr class="'+(p.skryt===1?'skr':'')+'"><td><input class="inp" data-i="'+i+'" data-f="'+pole('n')+'" value="'+esc(hod(p,'n'))+'"'+ph(p,'n')+' aria-label="Název'+(PR?' – '+KK.JAZYKY[J]:'')+'"'+(PR?'':' required')+'></td><td><input class="inp" data-i="'+i+'" data-f="'+pole('pozn')+'" value="'+esc(hod(p,'pozn'))+'"'+ph(p,'pozn')+' aria-label="Poznámka u '+esc(p.n)+(PR?' – '+KK.JAZYKY[J]:'')+'"></td>'+
          '<td class="n"><label class="kc"><input class="inp num" type="number" min="0" step="10" data-i="'+i+'" data-f="a" value="'+(p.a||0)+'" aria-label="'+esc(p.n)+' – '+esc(SL[0])+'"> Kč</label></td>'+
          (dva?'<td class="n"><label class="kc"><input class="inp num" type="number" min="0" step="10" data-i="'+i+'" data-f="b" value="'+(p.b==null?p.a:p.b)+'" aria-label="'+esc(p.n)+' – '+esc(K.sloupce[1])+'"> Kč</label></td>':'')+
          (lod?'<td class="n"><input class="inp num" type="number" min="1" max="12" data-i="'+i+'" data-f="osob" value="'+(p.osob||'')+'" aria-label="Osob – '+esc(p.n)+'"></td>':'')+(ub?'<td class="n"><input class="inp num" type="number" min="0" max="50" data-i="'+i+'" data-f="luzka" value="'+(p.luzka||'')+'" aria-label="Lůžek – '+esc(p.n)+'"></td><td class="n"><input class="inp num" type="number" min="0" max="200" placeholder="–" data-i="'+i+'" data-f="minOs" value="'+(p.minOs||'')+'" aria-label="Rezervace jen od počtu osob – '+esc(p.n)+' (nepovinné)"></td>':'')+
          (slu?'<td><input class="inp" data-i="'+i+'" data-f="'+pole('jed')+'" value="'+esc(hod(p,'jed'))+'" aria-label="Jednotka – '+esc(p.n)+'"'+(PR?ph(p,'jed'):' placeholder="den, osoba…"')+'></td>':'')+
          (rez?'<td class="c"><input type="checkbox" class="cb" data-i="'+i+'" data-f="rez"'+(p.rez!==0?' checked':'')+' aria-label="Nabízet v rezervaci – '+esc(p.n)+'"></td>':'')+(dpr?'<td class="n nvc nvs"><label class="kc"><input class="inp num" type="number" min="0" step="50" data-i="'+i+'" data-f="n1" value="'+(p.n1==null?'':p.n1)+'" aria-label="Návoz lodí – 1 den – '+esc(p.n)+'"> Kč</label></td>'+'<td class="n nvc"><label class="kc"><input class="inp num" type="number" min="0" step="50" data-i="'+i+'" data-f="d1" value="'+(p.d1==null?'':p.d1)+'" aria-label="Návoz lodí – Více dní – '+esc(p.n)+'"> Kč</label></td>'+'<td class="n nvc nvs nvc2"><label class="kc"><input class="inp num" type="number" min="0" step="50" data-i="'+i+'" data-f="n10" value="'+(p.n10==null?'':p.n10)+'" aria-label="Návoz lodí – 1 den, 10+ lodí – '+esc(p.n)+'"> Kč</label></td>'+'<td class="n nvc nvc2"><label class="kc"><input class="inp num" type="number" min="0" step="50" data-i="'+i+'" data-f="d10" value="'+(p.d10==null?'':p.d10)+'" aria-label="Návoz lodí – Více dní, 10+ lodí – '+esc(p.n)+'"> Kč</label></td>':'')+
          '<td class="c"><span class="row" style="flex-wrap:nowrap;gap:6px;justify-content:flex-end">'+(dpr?'<button type="button" class="btn ic gh" data-mv="'+i+'" data-d="-1" aria-label="Posunout výš – '+esc(p.n)+'"'+(pol.indexOf(p)?'':' disabled')+'>'+SV('<path d="m18 15-6-6-6 6"/>',18)+'</button><button type="button" class="btn ic gh" data-mv="'+i+'" data-d="1" aria-label="Posunout níž – '+esc(p.n)+'"'+(pol.indexOf(p)<pol.length-1?'':' disabled')+'>'+SV('<path d="m6 9 6 6 6-6"/>',18)+'</button>':'')+(p.k==='os'?'':fix&&!K.pevne?'<button type="button" class="btn ic gh" data-hide="'+i+'" aria-label="'+(p.skryt===1?'Zobrazit':'Skrýt')+' – '+esc(p.n)+'" title="Cenu používá text na webu, proto ji nejde smazat – jen skrýt z ceníku a rezervace.">'+SV(p.skryt===1?IC.okoX:IC.oko,18)+'</button>':K.pevne?'':'<button type="button" class="btn ic dan" data-del="'+i+'" aria-label="Smazat – '+esc(p.n)+'">'+SV(IC.kos,18)+'</button>')+'</span></td></tr>'+
          (!PR&&(dop&&p.rez!==0||oso)?(function(){var UB=C.polozky.filter(function(x){return x.kat==='ubytovani'&&x.skryt!==1}),pro=p.pro||[];return '<tr class="ck-pro"><td colspan="99"><div class="ck-vaz"><span class="ck-pl"><b>'+esc(p.n||'Položka')+'</b> '+(oso?(p.k==='os'?'se platí u:':'má svou cenu u:'):'lze objednat k:')+'</span>'+UB.map(function(u){var on=!pro.length||pro.indexOf(u.k)>=0;return '<button type="button" class="ck-ch'+(on?' on':'')+'" data-pro="'+i+'" data-pk="'+u.k+'" aria-pressed="'+on+'">'+(on?'✓ ':'')+esc(u.n)+'</button>'}).join('')+'<small>'+(oso?(p.k==='os'?(pro.length?'U ostatního ubytování je osoba v ceně ubytování (neplatí se zvlášť).':'Platí se u všeho ubytování.'):(pro.length?'U ostatního ubytování se počítá jako Osoba.':'Pro všechno ubytování.')):(pro.length?'U ostatního ubytování bude na webu zašedlý.':'Ke všemu ubytování.'))+'</small></div></td></tr>'})():'')}).join('')+
        '</tbody></table></div></section>';
      });
      h+='<div class="savebar" id="sb" hidden><span id="sbt">Neuložené změny v ceníku</span><span class="row"><button type="button" class="btn sm gh" id="sbz" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.3)">Zahodit</button><button type="button" class="btn sm pri" id="sbu">Uložit ceník</button></span></div>';
      var y=scrollY;m.innerHTML=h;jazykKlik(m);scrollTo(0,y);lista();
    }
    function lista(){var b=$('#sb');if(b)b.hidden=!neulozeno()}
    m.addEventListener('input',function(e){var t=e.target;
      if(t.dataset.i!=null){var p=C.polozky[+t.dataset.i],f=t.dataset.f;
        if(f==='rez')p.rez=t.checked?1:0;else if(f==='vzd')p.vzd=t.checked?1:0;else if(f==='a'||f==='b'||f==='luzka'||f==='osob'||f==='minOs'||f==='n1'||f==='n10'||f==='d1'||f==='d10'){var v=t.value===''?0:Math.max(0,Math.round(+t.value));if(f==='luzka'||f==='osob'||f==='minOs'){if(v)p[f]=v;else delete p[f]}else p[f]=v}else p[f]=t.value}
      else if(t.dataset.mn){var mk=t.dataset.mn;if(mk==='eur'){C.mena.eur=t.checked;kresli();var me=$('[data-mn=eur]',m);if(me)me.focus()}else{var mv=+t.value;if(mk==='kurz'&&mv>0)C.mena.kurz=mv;if(mk==='zaokr')C.mena.zaokr=mv}}
      else if(t.dataset.sv!=null){C.sluzby[+t.dataset.sv][t.dataset.f]=t.value}
      else if(t.dataset.sv2!=null){var si=+t.dataset.sv2,x=C.slevy[si],f=t.dataset.f;
        if(f==='zap'){if(t.checked)delete x.zap;else x.zap=0;kresli();lista();return}
        else if(f==='komb'){if(t.checked)x.komb=1;else delete x.komb}else if(f==='web')x.web=t.checked?1:0;
        else if(f==='h')x.h=Math.max(0,+t.value||0);else if(f==='n')x.n=t.value;else{if(t.value)x[f]=t.value;else delete x[f]}
        slvUpd(si)}
      else if(t.dataset.svp!=null){var x2=C.slevy[+t.dataset.svp];x2.pod=x2.pod||{};x2.pod[t.dataset.k]=Math.max(1,Math.round(+t.value||1));slvUpd(+t.dataset.svp)}
      else if(t.dataset.svpa!=null){if(t.value){var x3=C.slevy[+t.dataset.svpa],kk=t.value,ii=t.dataset.svpa;x3.pod=x3.pod||{};x3.pod[kk]=kk==='noci'?3:kk==='osob'?10:2;kresli();var ni=$('[data-svp="'+ii+'"][data-k="'+kk+'"]',m);if(ni){ni.focus();ni.select()}}}
      else if(t.dataset.s){var g=function(x){return $('[data-s="'+x+'"]',m).value},pad=function(n){return('0'+n).slice(-2)};
        if($('[data-s="od-m"]',m)){C.sezona.otevrenoOd=pad(g('od-m'))+'-'+pad(g('od-d'));C.sezona.otevrenoDo=pad(g('do-m'))+'-'+pad(g('do-d'))}if($('[data-s="h-od"]',m)){C.sezona.hlavniOd=+g('h-od');C.sezona.hlavniDo=+g('h-do')}}
      else if(t.dataset.sz){C.sezona[t.dataset.sz]=t.checked;var fz=t.dataset.sz;kresli();var nt=$('[data-sz="'+fz+'"]',m);if(nt)nt.focus()}
      lista()});
    m.addEventListener('change',function(e){if(e.target.matches('input[type=checkbox],select'))m.dispatchEvent(new Event('input'))});
    m.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
      if(b.dataset.add){var kat=b.dataset.add;C.polozky.push({k:'x'+Date.now().toString(36),kat:kat,n:'',pozn:'',a:0,b:(kat==='sluzby'||kat==='doprava')?undefined:0,rez:(kat==='doplnky'||kat==='ubytovani')?1:undefined,jed:kat==='sluzby'?'':undefined,osob:kat==='lode'?4:undefined});kresli();var ins=$$('section.ck',m).filter(function(s){return $('[data-add="'+kat+'"]',s)})[0];var inp=ins&&$$('tbody tr:last-child input[data-f=n]',ins)[0];if(inp)inp.focus()}
      else if(b.dataset.pro){var pp=C.polozky[+b.dataset.pro],UBk=C.polozky.filter(function(x){return x.kat==='ubytovani'&&x.skryt!==1}).map(function(x){return x.k}),cur=(pp.pro&&pp.pro.length?pp.pro:UBk).slice(),ix2=cur.indexOf(b.dataset.pk);if(ix2>=0)cur.splice(ix2,1);else cur.push(b.dataset.pk);if(!cur.length){toast(pp.kat==='osoby'?'Aspoň jedno ubytování musí zůstat zaškrtnuté. Když skupinu nechcete, skryjte ji.':'Aspoň jedno ubytování musí zůstat zaškrtnuté. Když doplněk nechcete nabízet, vypněte „V rezervaci“.',1);return}if(UBk.every(function(k){return cur.indexOf(k)>=0}))delete pp.pro;else pp.pro=cur;kresli()}
      else if(b.dataset.mv){var ix=+b.dataset.mv,d=+b.dataset.d,kt=C.polozky[ix].kat,j=ix+d;while(j>=0&&j<C.polozky.length&&C.polozky[j].kat!==kt)j+=d;if(j>=0&&j<C.polozky.length){var t=C.polozky[ix];C.polozky[ix]=C.polozky[j];C.polozky[j]=t;kresli();var nb=$('[data-mv="'+j+'"][data-d="'+d+'"]',m);if(nb&&!nb.disabled)nb.focus()}}
      else if(b.dataset.del){var p=C.polozky[+b.dataset.del];ptej('Smazat položku „'+(p.n||'bez názvu')+'“?\n\nZ ceníku zmizí až po uložení.',{ok:'Smazat',nebezp:1}).then(function(ok){if(!ok)return;var pi=C.polozky.indexOf(p);if(pi>=0)C.polozky.splice(pi,1);kresli()})}
      else if(b.dataset.hide){var q=C.polozky[+b.dataset.hide];if(q.skryt===1)delete q.skryt;else q.skryt=1;kresli()}
      else if(b.id==='sva'){C.sluzby.push({n:'',t:''});kresli();var si=$$('[data-sv][data-f=n]',m).pop();if(si)si.focus()}
      else if(b.dataset.svd){var sx=C.sluzby[+b.dataset.svd];(sx.n?ptej('Smazat službu „'+sx.n+'“?',{ok:'Smazat',nebezp:1}):Promise.resolve(true)).then(function(ok){if(!ok)return;var si2=C.sluzby.indexOf(sx);if(si2>=0)C.sluzby.splice(si2,1);kresli()})}
      else if(b.id==='sla'){C.slevy.push({n:'',pod:{},typ:'proc',h:10,web:1});kresli();var sn=$$('.slv-n',m).pop();if(sn){sn.focus();sn.scrollIntoView({block:'center'})}}
      else if(b.dataset.svx!=null){var sx2=C.slevy[+b.dataset.svx];ptej('Smazat slevu „'+(sx2.n||'bez názvu')+'“?\n\nZ ceníku zmizí až po uložení.',{ok:'Smazat',nebezp:1}).then(function(ok){if(!ok)return;var q2=C.slevy.indexOf(sx2);if(q2>=0)C.slevy.splice(q2,1);kresli()})}
      else if(b.dataset.svpx){var pp2=b.dataset.svpx.split('|'),x4=C.slevy[+pp2[0]];if(x4.pod)delete x4.pod[pp2[1]];kresli()}
      else if(b.dataset.svna!=null){var pn=b.dataset.svna.split('|'),x5=C.slevy[+pn[0]],kn=pn[1],na=(x5.na&&x5.na.length?x5.na:['_uby']).slice(),ix5=na.indexOf(kn);
        if(ix5>=0)na.splice(ix5,1);else{na.push(kn);if(kn==='_uby')na=na.filter(function(k){return k.charAt(0)==='_'});else if(kn.charAt(0)!=='_')na=na.filter(function(k){return k!=='_uby'})}
        if(!na.length){toast('Vyberte aspoň jednu část, ze které se sleva počítá.',1);return}if(na.length===1&&na[0]==='_uby')delete x5.na;else x5.na=na;kresli()}
      else if(b.id==='sbz'){C=JSON.parse(puv);kresli()}
      else if(b.id==='cr'){ptej('Vrátit celý ceník na výchozí hodnoty?\n\nVšechny vaše ceny a položky se přepíšou. Nejde to vrátit.',{ok:'Vrátit výchozí',nebezp:1}).then(function(ok){if(ok)KK.cenik.obnov().then(function(){C=JSON.parse(JSON.stringify(KKC.vychozi));puv=JSON.stringify(C);kresli();toast('Ceník vrácen na výchozí.')})})}
      else if(b.id==='sbu'){
        if(KKC.navozZeZastavek)KKC.navozZeZastavek(C);
        var chyba=C.polozky.find(function(p){return !String(p.n).trim()});
        if(chyba){toast('Každá položka musí mít název.',1);var ix=C.polozky.indexOf(chyba),el=$('input[data-i="'+ix+'"][data-f=n]',m);if(el){el.setAttribute('aria-invalid','true');el.focus()}return}
        var o=C.sezona.otevrenoOd,d2=C.sezona.otevrenoDo;if(!C.sezona.celorocne&&d2<=o){toast('Konec sezóny musí být po jejím začátku.',1);return}
        if(C.sezona.hlavniZap!==false&&C.sezona.hlavniDo<C.sezona.hlavniOd){toast('Hlavní sezóna musí končit až po svém začátku.',1);return}
        C.sluzby=C.sluzby.filter(function(x){return String(x.n).trim()});
        C.slevy.forEach(function(x){if(!String(x.n||'').trim()){var dp=KKC.slevaPopis(x);x.n=dp.podminky?dp.podminky.charAt(0).toUpperCase()+dp.podminky.slice(1):'Sleva'}});
        C.polozky.forEach(function(p){['b','rez','jed','osob'].forEach(function(k){if(p[k]===undefined)delete p[k]})});
        KK.cenik.uloz(JSON.parse(JSON.stringify(C))).then(function(){puv=JSON.stringify(C);try{if(KKC.obnov)KKC.obnov(C)}catch(x){}lista();toast('Ceník uložen – ceny se změnily na celém webu i v rezervaci.')})}
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
  var SEK={rezervace:['Rezervace',['sez']],rez_nastaveni:['Nastavení',['nas']],ubytovani:['Ubytování',['uby','dnes','kal']],pujcovna:['Půjčovna lodí',['lod','lodd']],doprava:['Doprava',['dop']]},sek=SEK[sekV]?sekV:'rezervace',ST=SEK[sek][1];
  var R=window.KKR,ja=KK.auth.meSync(),adm=ja.role==='admin',W=40,N=21,NW=150;
  var D0=function(s){var p=s.split('-');return new Date(+p[0],p[1]-1,+p[2])},ISO=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
  var ADD=function(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x},KR=function(s){var d=D0(s);return d.getDate()+'. '+(d.getMonth()+1)+'.'};
  var DNY=['Ne','Po','Út','St','Čt','Pá','So'],MES=['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
  var dnes=ISO(new Date()),zac=ADD(D0(dnes),-2),autoN=R.auto(dnes),tab=KK.LS.get('rez.tab.'+sek,ST[0]),denP=dnes,okno=dnes,filtr='',sbal={},rozb={};
  if(ST.indexOf(tab)<0)tab=ST[0];
  var F0={stav:'',obd:'bud',typ:'',zdroj:'',raz:'akce',od:'',do:''},F=Object.assign({},F0),q='',lim=100,posl=[],VY={};
  /* skupiny v pořadí a směru, jaké si obsluha nastavila */
  var skupiny=function(){var n=R.nast(),po=n.poradi2||[];return R.SKUPINY.filter(function(g){return R.rezTyp(g.k)}).sort(function(a,b){var x=po.indexOf(a.id),y=po.indexOf(b.id);return (x<0?99:x)-(y<0?99:y)})};
  var AKCE={pop:['pot','Potvrdit rezervaci'],pot:['uby','Ubytovat hosta (check-in)'],uby:['odj','Odhlásit hosta (check-out)']};
  var noci=function(r){return Math.round((D0(r.do)-D0(r.od))/864e5)};
  var termin=function(r){var n=noci(r);return KR(r.od)+' – '+KR(r.do)+' '+r.do.slice(0,4)+' ('+n+' '+pl(n,'noc','noci','nocí')+')'};
  var mistaTxt=function(r){var a=(r.mista||[]).map(R.nazev);if(r.dalsi){if(r.dalsi.stan)a.push(r.dalsi.stan+'× vlastní stan');if(r.dalsi.karavan)a.push(r.dalsi.karavan+'× karavan')}return a.join(', ')||'—'};
  var kc=function(n){return n?Number(n).toLocaleString('cs-CZ')+' Kč':'—'};
  var bdg=function(s){return '<span class="rs '+s+'">'+R.STAVY[s]+'</span>'};
  var najdi=function(id){return R.vse().filter(function(x){return x.id===id})[0]};
  m.innerHTML='<div class="rz-lay"><div id="rzv"></div><aside id="rd" class="rpan" aria-labelledby="rdt" hidden></aside></div><dialog id="rf" class="dlg rdl" aria-labelledby="rft"></dialog>';
  var box=$('#rzv',m),dd=$('#rd',m),df=$('#rf',m),vicF=false;
  m.otevri=function(id){detail(id)};m.tisk=function(co,den){if(den)denP=den;tisk(co)}; /* aplikace obsluhy otevírá detail rezervace z hledání */
  dd.close=function(){if(dd.hidden)return;dd.hidden=true;kresli()};
  var oznac=function(){$$('.sel',box).forEach(function(x){x.classList.remove('sel')});if(!dd.hidden)$$('[data-id="'+dd.dataset.id+'"]',box).forEach(function(x){x.classList.add('sel')})};
  /* změna rezervace se zápisem do její historie */
  /* rezervace změněné akcí zůstanou na svém místě v seznamu (zvýrazněné), dokud se nezmění filtr – jinak by „zmizely“ */
  var DRZ={};
  var zmen=function(id,z,co,pod){var r0=najdi(id)||{};if(r0.id&&!DRZ[id])DRZ[id]={g:skupAkce(r0),u:udalost(r0)};else if(DRZ[id])DRZ[id].t=Date.now();if(DRZ[id])DRZ[id].t=Date.now();var e={t:Date.now(),kdo:ja.jmeno,co:co};pod=(pod||[]).slice();if(z.stav&&r0.stav&&z.stav!==r0.stav&&!pod.some(function(x){return /^Stav: /.test(x)}))pod.unshift('Stav: '+R.STAVY[r0.stav]+' → '+R.STAVY[z.stav]);if(pod.length)e.pod=pod;z.hist=(r0.hist||[]).concat([e]).slice(-200);return R.uprav(id,z)};
  /* co přesně se úpravou změnilo – do historie rezervace („Termín: … → …“) */
  var rozdil=function(a,z){var L=[],P=function(n,x,y){x=x||'';y=y||'';if(x!==y)L.push(n+': '+(x||'—')+' → '+(y||'—'))},rr=Object.assign({},a,z),T=function(q){return KR(q.od)+' – '+KR(q.do)+' '+q.do.slice(0,4)};
    var lod=function(q){var l=q.lode;if(!l||!R.lodePocet(l))return '';return Object.keys(l.kusy).filter(function(k){return +l.kusy[k]>0}).map(function(k){return l.kusy[k]+'× '+((KKC.p(k)||{}).n||k)}).join(', ')+' · '+KR(l.den)+' · '+(Math.max(1,+l.dni||1))+' '+pl(Math.max(1,+l.dni||1),'den','dny','dní')+' · '+R.mistoN(l.odkud)+' → '+R.mistoN(l.kam)};
    var dop=function(q){var d=q.doprava;return d&&d.misto?R.mistoN(d.misto)+(d.den?' · '+KR(d.den):'')+(d.cas?' v '+d.cas:'')+' · '+(d.osob||0)+' os.':''};
    var pla=function(q){return q.platba?R.PLATBA[q.platba.stav]||'':'platí na místě'};
    P(a.stav==='blk'?'Důvod':'Jméno',a.jmeno,rr.jmeno);P('Termín',T(a),T(rr));P('Místo',mistaTxt(a),mistaTxt(rr));
    if(rr.stav!=='blk'){P('Osoby',KKC.osobyTxt(a.osoby||{}),KKC.osobyTxt(rr.osoby||{}));P('Lodě',lod(a),lod(rr));P('Doprava',dop(a),dop(rr));P('Cena',kc(a.cena),kc(rr.cena));P('Platba',pla(a),pla(rr));P('Telefon',a.telefon,rr.telefon);P('E-mail',a.email,rr.email);P('Stav',R.STAVY[a.stav],R.STAVY[rr.stav])}
    P('Poznámka',a.zprava,rr.zprava);return L};
  var cas=function(t){var d=new Date(t);return d.getDate()+'. '+(d.getMonth()+1)+'. '+d.getFullYear()+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)};
  var kratM=function(r){var a=(r.mista||[]).map(function(k){return R.nazev(k).replace('Podsadový stan','Stan')});if(r.dalsi){if(r.dalsi.stan)a.push(r.dalsi.stan+'× vl. stan');if(r.dalsi.karavan)a.push(r.dalsi.karavan+'× karavan')}return a.join(', ')||'—'};

  var JL=function(r){return R.jenLode(r)},dniL=function(r){return r.lode?Math.max(1,+r.lode.dni||1):0};
  var LK=function(r){return r.lode&&R.lodePocet(r.lode)?Object.keys(r.lode.kusy).filter(function(k){return +r.lode.kusy[k]>0}).map(function(k){return r.lode.kusy[k]+'× '+((KKC.p(k)||{}).n||k)}).join(', '):''};
  var delka=function(r){var n=noci(r);return JL(r)?dniL(r)+' '+pl(dniL(r),'den','dny','dní')+' · jen lodě':n+' '+pl(n,'noc','noci','nocí')};
  var vybTxt=function(l){var p=R.lodePotreba(l);return p.padla+' '+pl(p.padla,'pádlo','pádla','pádel')+', '+p.vesty+' '+pl(p.vesty,'vesta','vesty','vest')+', '+p.barely+' '+pl(p.barely,'barel','barely','barelů')};
  /* štítky: co všechno rezervace obsahuje */
  var STK=[['uby','Ubytování','<path d="M3 11 12 4l9 7M5 10v10h14V10"/>'],['lod','Lodě','<path d="M2 15c3.5 3.5 16.5 3.5 20 0M5 15l2.5-6h9L19 15M12 9V4"/>'],['dop','Doprava','<path d="M2 16V7h12v9M14 10h4l4 4v2h-8"/><circle cx="6.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/>']];
  var stitky=function(r){if(r.stav==='blk')return '';var m={uby:(r.mista||[]).length||(r.dalsi&&(+r.dalsi.stan||+r.dalsi.karavan)),lod:r.lode&&R.lodePocet(r.lode),dop:r.doprava&&r.doprava.misto||r.vyzved&&r.vyzved.misto};
    var ls=LS(r),LT={vyd:' · vydané',cast:' · část vrácena',vra:' · vrácené'};
    return '<span class="rst">'+STK.filter(function(x){return m[x[0]]}).map(function(x){return '<span class="rst-i '+x[0]+(x[0]==='lod'&&ls?' ls-'+ls:'')+'">'+SV(x[2],13)+x[1]+(x[0]==='lod'&&LT[ls]&&r.stav!=='zru'?LT[ls]:'')+'</span>'}).join('')+'</span>'};
  var pbdg=function(r){var p=r.platba;if(!p||r.stav==='zru'||r.stav==='blk')return '';return '<span class="rpl '+p.stav+'">'+(p.stav==='ceka'?'Záloha do '+KR(p.splatnost):R.PLATBA[p.stav])+'</span>'};
  /* platba: obsluha potvrdí přijetí zálohy – tím se poptávka změní na potvrzenou rezervaci */
  var zaplat=function(id,co){var r=najdi(id);if(!r||(!r.platba&&co!=='vse'))return;var sn=snap(),p=Object.assign({zaloha:0,splatnost:''},r.platba||{},{stav:co,kdy:co==='ceka'?null:Date.now()}),z={platba:p},pot=r.stav==='pop'&&co!=='ceka';if(pot)z.stav='pot';
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
  /* omyl při výdeji nebo vracení: zrušit výdej (lodě zpět na „rezervované“) nebo poslední vrácení */
  var zrusVydej=function(id){var r=najdi(id);if(!r||!r.lode||!r.lode.vydano)return;ptej('Zrušit výdej lodí – '+r.jmeno+'?\n\nLodě se vrátí do stavu „rezervované“, jako by se nevydaly.'+((r.lode.vraceno||[]).length?' Smaže se i záznam o vrácení.':''),{ok:'Zrušit výdej',ne:'Nechat'}).then(function(a){if(!a)return;
    var sn=snap(),l=Object.assign({},r.lode);delete l.vydano;delete l.vraceno;var z={lode:l};if(JL(r)&&r.stav==='odj')z.stav='pot';
    try{zmen(id,z,'Výdej lodí zrušen');KK.zaznam('Rezervace',(r.cislo||'')+' '+r.jmeno+' – výdej lodí zrušen');kresli();tz(r.jmeno+': výdej lodí zrušen.',sn)}catch(x){toast(x.message,1)}})};
  var zrusVraceni=function(id){var r=najdi(id);if(!r||!r.lode||!(r.lode.vraceno||[]).length)return;var v=r.lode.vraceno,po=v[v.length-1];ptej('Zrušit poslední vrácení – '+r.jmeno+'?\n\n'+R.lodeKusyTxt(po.kusy)+' se vrátí mezi lodě, které má host u sebe.',{ok:'Zrušit vrácení',ne:'Nechat'}).then(function(a){if(!a)return;
    var sn=snap(),z={lode:Object.assign({},r.lode,{vraceno:v.slice(0,-1)})};if(JL(r)&&r.stav==='odj')z.stav='pot';
    try{zmen(id,z,'Vrácení zrušeno: '+R.lodeKusyTxt(po.kusy));KK.zaznam('Rezervace',(r.cislo||'')+' '+r.jmeno+' – vrácení lodí zrušeno');kresli();tz(r.jmeno+': vrácení zrušeno.',sn)}catch(x){toast(x.message,1)}})};
  var lodBtn=function(r,sm){var x=LS(r);if(r.stav==='zru'||r.stav==='blk')return '';if(x==='vyd'||x==='cast')return '<button type="button" class="btn sm'+(sm?'':' pri')+'" data-lr="'+r.id+'">Vrátit lodě</button>';if(x==='res'&&r.lode.den<=dnes)return '<button type="button" class="btn sm'+(sm?'':' pri')+'" data-lv="'+r.id+'">Vydat lodě</button>';return ''};
  var zvV=false,kTab='',sbT='poptavka',sbJ='cs',sbF=null,nT=KK.LS.get('rez.nt','rez');KK.LS.set('rez.nt','rez');
  /* po změně nabídnout Vrátit zpět: sn = stav rezervací před změnou */
  var snap=function(){return JSON.stringify(R.vse())},tz=function(msg,sn){toast(msg,0,{t:'Vrátit zpět',fn:function(){R.obnov(JSON.parse(sn));KK.zaznam('Rezervace','vráceno zpět: '+msg);kresli();toast('Vráceno zpět.')}})};
  var JZN={cs:'Čeština',en:'English',de:'Deutsch'};
  function sbVzor(){return {jmeno:'Jana Nováková',cislo:'R-2027-014',od:'2027-07-16',do:'2027-07-19',mista:['chatka-4'],dalsi:{stan:1},osoby:{dosp:2,dite:2,zak:0},cena:7310,lode:{den:'2027-07-17',dni:1,kusy:{kanoe:2},odkud:'dop1',kam:'kemp'},doprava:{misto:'dop1',osob:4,cas:'9:00'},platba:{zaloha:2193,splatnost:'2027-06-20',stav:'ceka'},telefon:'+420 777 123 456',email:'jana@example.cz',zprava:'Přijedeme kolem 18. hodiny.',stav:sbT==='rezervace'?'pot':'pop'}}
  function sbHtml(){var T=R.SABL_TYPY.filter(function(x){return x.k===sbT})[0],J=R.SABL_JAZ(sbT);if(J.indexOf(sbJ)<0)sbJ='cs';var s=R.sablona(sbT,sbJ),dis=adm?'':' disabled';
    var AM=(R.nast().autoMail||{});return '<p class="sb-kdy"><b>'+(T.kdo==='kemp'?'Komu: vám (kempu)':'Komu: hostovi')+'</b> · '+esc(T.kdy)+'</p>'+(T.auto?'<label class="sw sb-auto"><input type="checkbox" id="sbauto" data-k="'+T.k+'"'+(AM[T.k]!==false?' checked':'')+dis+'><span aria-hidden="true"></span>Posílat automaticky</label>'+(T.k==='recenze'&&!R.nast().recenzeUrl?'<p class="sb-war">Doplňte nahoře odkaz na hodnocení na Googlu, jinak bude v e-mailu prázdný.</p>':''):'')+
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
    box.classList.toggle('rz-jennas',sek==='rez_nastaveni');
    box.innerHTML='<div class="rz-top"><h1>'+SEK[sek][0]+'</h1>'+
'<label class="rq"><span class="sr">Hledat v rezervacích</span>'+SV(IC.seo,18)+'<input type="search" id="rq" class="inp" placeholder="Hledat jméno, telefon, chatku, datum…" value="'+esc(q)+'" autocomplete="off"></label>'+(ST.length<2?'':'<div class="rz-seg" role="group" aria-label="Zobrazení">')+[['lod','Výdej a vracení','<path d="M7 7h13l-3-3M17 17H4l3 3"/>'],['lodd','Dostupnost a sklad','<path d="M4 5h16v14H4zM4 10h16M9 5v14M15 5v14"/>'],['uby','Příjezdy a odjezdy','<path d="M3 11 12 4l9 7M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'],['dnes','Plánek','<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'],['kal','Kalendář','<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'],['dop','Doprava','<path d="M3 16V7h11v9M14 10h4l3 3v3h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>'],['sez','Seznam','<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'],['nas','Nastavení','<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>']].filter(function(t){return ST.length>1&&ST.indexOf(t[0])>=0}).map(function(t){return '<button type="button" aria-pressed="'+(!q&&tab===t[0])+'" data-tab="'+t[0]+'">'+SV(t[2],17)+'<span>'+t[1]+'</span></button>'}).join('')+(ST.length<2?'':'</div>')+
      '<div class="row rz-ak">'+(sek==='ubytovani'?'<button type="button" class="btn pri" data-a="ubyt">'+SV('<path d="M3 11 12 4l9 7M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',18)+'Ubytovat hosta</button><button type="button" class="btn" data-a="nova">+ Nová rezervace</button>':(sek==='pujcovna'?'<button type="button" class="btn pri" data-pujcit>'+SV(IC.lode,18)+'Půjčit loď</button><button type="button" class="btn" data-a="nova">+ Nová rezervace</button>':'<button type="button" class="btn pri" data-a="nova">+ Nová rezervace</button>'))+'</div></div>'+
      (q?vysledky(A):tab==='kal'?kal(akt):tab==='lod'?lodeTab(akt):tab==='lodd'?lodDost(akt):tab==='dop'?dopTab(akt):tab==='uby'?ubyTab(akt):tab==='sez'?sez(A):tab==='nas'?nas():prehledDnes(akt));
    if(!dd.hidden){if(najdi(dd.dataset.id))detail(dd.dataset.id);else{dd.hidden=true}}
  }
  function prehledDnes(akt){
    var d=D0(dnes),host=akt.filter(function(r){return r.stav!=='blk'}),DL=['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'],MG=['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'];
    var podle=function(a,b){return a.od<b.od?-1:a.od>b.od?1:0};
    var ukol=function(r){var o=r.osoby||{},os=KKC.osobPocet(o);
      return '<li class="ru"><button type="button" class="ru-t" data-id="'+r.id+'"><b>'+esc(r.jmeno)+'</b><small>'+esc(kratM(r))+' · '+KR(r.od)+' – '+KR(r.do)+(os?' · '+os+' os.':'')+(r.stav==='pop'&&r.vytvoreno?(function(){var c=Math.floor((Date.now()-r.vytvoreno)/864e5);return ' · <em class="ru-c'+(c>=2?' dl':'')+'">čeká '+(c<1?'od dneška':c+' '+pl(c,'den','dny','dní'))+'</em>'})():'')+'</small></button>'+
        (KRAT[r.stav]?'<button type="button" class="btn sm" data-qs="'+r.id+'" data-st="'+AKCE[r.stav][0]+'" aria-label="'+AKCE[r.stav][1]+' – '+esc(r.jmeno)+'">'+KRAT[r.stav]+'</button>':bdg(r.stav))+'</li>'};
    var sloupec=function(n,L,dl,nic){var M=6,cel=rozb[dl];return '<section class="card ruk"><h2>'+n+'<span>'+L.length+'</span></h2>'+(L.length?'<ul>'+(cel?L:L.slice(0,M)).map(ukol).join('')+'</ul>'+(L.length>M?'<button type="button" class="ru-v" data-dl="'+dl+'" aria-expanded="'+!!cel+'">'+(cel?'Zobrazit méně':'Zobrazit všech '+L.length)+'</button>':''):'<p class="mut">'+nic+'</p>')+'</section>'};
    var poc={},G=skupiny(),mapa=G.map(function(g){
      var t=g.c.map(function(c){var k=g.k+'-'+c,r=akt.filter(function(r){return (r.mista||[]).indexOf(k)>=0&&r.od<=denP&&denP<r.do})[0],cis='<span class="rn-c">'+(g.k==='teepee'?'T':c)+'</span>';
        poc[g.k]=poc[g.k]||[0,0];poc[g.k][1]++;
        if(!r&&R.vyp().indexOf(k)>=0){poc[g.k][1]--;return '<div class="rn off" aria-label="'+esc(R.nazev(k))+', vypnuto z rezervace">'+cis+'<b>vypnuto</b></div>'}
        var od1=r?null:akt.filter(function(x){return x.stav!=='blk'&&x.stav!=='odj'&&x.do===denP&&(x.mista||[]).indexOf(k)>=0})[0];
        if(!r)return '<button type="button" class="rn vol" data-m="'+k+'" data-nm="'+k+'" aria-label="'+esc(R.nazev(k))+', volno'+(od1?', ráno odjíždí '+od1.jmeno:'')+'">'+cis+'<b>Volno</b>'+(od1?'<small class="rn-od" title="Ráno odjíždí '+esc(od1.jmeno)+'">odj. '+esc(od1.jmeno)+'</small>':'')+'</button>';
        poc[g.k][0]++;var tu=r.stav==='uby'||r.stav==='blk',o=r.osoby||{},os=KKC.osobPocet(o);
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
        '<span class="rn-leg" aria-hidden="true"><i class="obs"></i>Ubytovaný<i class="ceka"></i>Rezervace<i class="popt"></i>Čeká na zálohu<i class="vol"></i>Volno<i class="blk"></i>Blokace</span></div>'+
      '<div class="rn-nav"><button type="button" class="btn sm" data-dpos="-1" aria-label="Předchozí den">‹</button><label><span class="sr">Datum</span><input type="date" class="inp" id="rnd" value="'+denP+'"></label><button type="button" class="btn sm" data-dpos="1" aria-label="Další den">›</button>'+(jeD?'':'<button type="button" class="btn sm pri" data-dpos="0">Zpět na dnešek</button>')+'<button type="button" class="btn sm gh rn-zv" data-a="zv" aria-pressed="'+zvV+'">'+SV('<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',16)+' Zvýraznit volná</button>'+'<button type="button" class="btn sm gh" data-a="tisk">'+SV('<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/>',16)+' Tisk ubytování</button>'+
        '</div>'+
      '<p class="rn-dl">Volná místa v dalších dnech <span>· zelená = dost volna, oranžová = málo, červená = plno · kliknutím vyberete den</span></p><div class="rn-dny" role="group" aria-label="Vybrat den">'+pas+'</div>'+
      '<div class="rn-mh"><h3>Místa '+(jeD?'dnes':'· '+DL[dp.getDay()].toLowerCase()+' '+dp.getDate()+'. '+MG[dp.getMonth()])+'</h3></div>'+
      '<div class="rn-sg">'+mapa+'</div>'+
      '<p class="mut rn-p">Hosta přestěhujete přetažením na jiné místo, na obsazené místo se hosté prohodí. Kliknutím na volné místo založíte rezervaci'+(jeD?'.':' od '+KR(denP))+'</p></section>';
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
  var typy=function(r){var t={};(r.mista||[]).forEach(function(k){t[k.split('-')[0]]=1});if(r.dalsi&&(r.dalsi.stan||r.dalsi.karavan))t.vlastni=1;if(r.lode&&R.lodePocet(r.lode))t.lode=1;if(r.doprava&&r.doprava.misto||r.vyzved&&r.vyzved.misto)t.doprava=1;if((r.mista||[]).length||t.vlastni)t.ubyt=1;var oo=r.osoby||{};if(r.stav!=='blk'&&((oo.dosp||0)+(oo.dite||0)+(oo.zak||0)>=SKUP_OS||(r.mista||[]).length>=3))t.skup=1;return t};var SKUP_OS=10;
  /* co se který den děje s loděmi a dopravou (společné pro Půjčovnu, Dopravu a tisk) */
  var sLod=function(r){return !!(r.lode&&R.lodePocet(r.lode))},posD=function(r){var d=R.lodeDny(r.lode);return d[d.length-1]};
  var denLode=function(akt,x){var S=akt.filter(sLod),o={vyd:S.filter(function(r){return r.lode.den===x}),vra:S.filter(function(r){return posD(r)===x}),voda:S.filter(function(r){return r.lode.den<x&&x<posD(r)})};
    o.jizdy=akt.filter(function(r){return r.doprava&&r.doprava.misto&&(r.doprava.den||(sLod(r)?r.lode.den:r.od))===x}).sort(function(a,b){return (a.doprava.cas||'99').localeCompare(b.doprava.cas||'99','cs',{numeric:true})||R.mistoN(a.doprava.misto).localeCompare(R.mistoN(b.doprava.misto),'cs')});
    o.vyz=akt.filter(function(r){return r.vyzved&&r.vyzved.misto&&(r.vyzved.den||(sLod(r)?posD(r):r.od))===x});o.navoz=o.vyd.filter(function(r){return r.lode.odkud&&r.lode.odkud!=='kemp'});o.svoz=o.vra.filter(function(r){return r.lode.kam&&r.lode.kam!=='kemp'});return o};
  var poMiste=function(L,klic){var m={};L.forEach(function(r){var k=r.lode[klic];(m[k]=m[k]||[]).push(r)});var po=R.mistaReky().map(function(x){return x.k});return Object.keys(m).sort(function(a,b){return po.indexOf(a)-po.indexOf(b)}).map(function(k){var kus={};m[k].forEach(function(r){Object.keys(r.lode.kusy).forEach(function(t){kus[t]=(kus[t]||0)+(+r.lode.kusy[t]||0)})});return {k:k,L:m[k],kusy:kus}})};
  var kusyTxt=function(kus){return Object.keys(kus).filter(function(k){return kus[k]>0}).map(function(k){return kus[k]+'× '+((KKC.p(k)||{}).n||k)}).join(', ')};
  var denNav=function(){return '<div class="row" style="gap:6px"><button type="button" class="btn sm gh" data-dpos="-7" aria-label="O týden zpět">‹‹</button><button type="button" class="btn sm gh" data-dpos="-1" aria-label="O den zpět">‹</button><button type="button" class="btn sm'+(denP===dnes?' pri':' gh')+'" data-dpos="0">Dnes</button><button type="button" class="btn sm gh" data-dpos="1" aria-label="O den dál">›</button><button type="button" class="btn sm gh" data-dpos="7" aria-label="O týden dál">››</button></div>'};
  var tiskBtn=function(t){return '<button type="button" class="btn sm gh" data-a="tisk">'+SV('<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/>',16)+t+'</button>'};
  /* ---- DOPRAVA: plán jízd na vybraný den ----
     Rozvoz na start = zastávky (místo + čas): koho vezeme a jaké lodě s sebou. Svoz z cíle = kde čekají lodě na odvoz. */
  var poradi=function(k){return R.mistaReky().map(function(x){return x.k}).indexOf(k)};
  var sumKusy=function(L){var k={};L.forEach(function(r){var p=R.lodePotreba(r.lode);Object.keys(p).forEach(function(x){k[x]=(k[x]||0)+p[x]})});return k};
  var stopy=function(X){var m={};
    var pridat=function(r,lidi,lodi){var mi=lidi?r.doprava.misto:r.lode.odkud,c=(r.doprava&&r.doprava.misto===mi&&r.doprava.cas)||'',k=mi+'|'+c;var z=m[k]=m[k]||{misto:mi,cas:c,lidi:[],lodi:[]};if(lidi&&z.lidi.indexOf(r)<0)z.lidi.push(r);if(lodi&&z.lodi.indexOf(r)<0)z.lodi.push(r)};
    X.jizdy.forEach(function(r){pridat(r,1,0)});X.navoz.forEach(function(r){var s=r.doprava&&r.doprava.misto===r.lode.odkud;pridat(r,s,1)});
    return Object.keys(m).map(function(k){var z=m[k];z.osob=0;z.aut=0;z.lidi.forEach(function(r){z.osob+=+r.doprava.osob||0;z.aut+=R.aut(r.doprava.osob)});z.kusy=sumKusy(z.lodi);return z})
      .sort(function(a,b){return (a.cas?0:1)-(b.cas?0:1)||(a.cas||'').localeCompare(b.cas||'','cs',{numeric:true})||poradi(a.misto)-poradi(b.misto)})};
  var vyzStopy=function(X){var m={};X.vyz.forEach(function(r){var v=r.vyzved,k=v.misto+'|'+(v.cas||'');var z=m[k]=m[k]||{misto:v.misto,cas:v.cas||'',L:[],osob:0,aut:0};z.L.push(r);z.osob+=+v.osob||0;z.aut+=R.aut(v.osob)});
    return Object.keys(m).map(function(k){return m[k]}).sort(function(a,b){return (a.cas||'99').localeCompare(b.cas||'99','cs',{numeric:true})||poradi(a.misto)-poradi(b.misto)})};
  var svozy=function(X){var m={};X.svoz.forEach(function(r){var k=r.lode.kam;(m[k]=m[k]||{misto:k,L:[]}).L.push(r)});return Object.keys(m).map(function(k){m[k].kusy=sumKusy(m[k].L);return m[k]}).sort(function(a,b){return poradi(a.misto)-poradi(b.misto)})};
  var lodK=function(k){var o={};Object.keys(k).forEach(function(x){if(!(x in R.VYB))o[x]=k[x]});return o},vybK=function(k){var o={};Object.keys(R.VYB).forEach(function(x){if(k[x])o[x]=k[x]});return o};
  var nLod=function(k){var n=0;Object.keys(lodK(k)).forEach(function(x){n+=k[x]});return n};
  var IKO={lid:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.2 3.2 0 0 1 0 6.2M21 20c0-2.8-1.7-5.1-4-5.8"/>',lod:'<path d="M2 15c3.5 3.5 16.5 3.5 20 0M5 15l2.5-6h9L19 15M12 9V4"/>',auto:'<path d="M2 16V7h12v9M14 10h4l4 4v2h-8"/><circle cx="6.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/>',cil:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'};
  function dopTab(akt){
    /* pruh 14 dní stojí na místě (kliknutím se den jen označí), posouvá se šipkami; vybraný den mimo pruh ho posune */
    var d0=D0(denP),X=denLode(akt,denP),dny=[],i;if(denP<okno)okno=denP;else if(denP>ISO(ADD(D0(okno),13)))okno=ISO(ADD(D0(denP),-13));for(i=0;i<14;i++)dny.push(ISO(ADD(D0(okno),i)));
    var ST=stopy(X),SV2=svozy(X),VZ2=vyzStopy(X),vo=0,os=0,au=0,nl=0,sl=0;VZ2.forEach(function(z){vo+=z.osob});ST.forEach(function(z){os+=z.osob;au+=z.aut;nl+=nLod(z.kusy)});SV2.forEach(function(z){sl+=nLod(z.kusy)});
    var h='<section class="card rv"><div class="row rv-h"><h2 style="margin:0">Doprava · '+(denP===dnes?'dnes':DNY[d0.getDay()]+' '+KR(denP))+'</h2><span class="sp"></span>'+denNav()+tiskBtn('Tisk dopravy')+'</div>'+
      '<div class="rd-dny">'+dny.map(function(d){var x=D0(d),Y=denLode(akt,d),n=stopy(Y).length+vyzStopy(Y).length,l=svozy(Y).length;return '<button type="button" data-den="'+d+'" aria-pressed="'+(d===denP)+'" class="'+(x.getDay()%6?'':'vik')+'"><small>'+DNY[x.getDay()]+' '+x.getDate()+'. '+(x.getMonth()+1)+'.</small><b>'+(n||'–')+'</b><i>'+(n?pl(n,'zastávka','zastávky','zastávek'):l?'jen svoz':'nic')+'</i></button>'}).join('')+'</div>'+
      '<div class="dp-sum"><div class="dp-k lid">'+SV(IKO.lid,22)+'<span>Lidé na start</span><b>'+os+'</b><small>'+(au?au+' '+pl(au,'auto','auta','aut'):'nikdo')+'</small></div>'+
      '<div class="dp-k lod">'+SV(IKO.lod,22)+'<span>Návoz lodí</span><b>'+nl+'</b><small>'+(nl?pl(nl,'loď','lodě','lodí')+' na start':'nic')+'</small></div>'+
      '<div class="dp-k vyz">'+SV(IKO.lid,22)+'<span>Vyzvednout v cíli</span><b>'+vo+'</b><small>'+(VZ2.length?VZ2.length+' '+pl(VZ2.length,'zastávka','zastávky','zastávek'):'nikoho')+'</small></div>'+
      '<div class="dp-k svz">'+SV(IKO.cil,22)+'<span>Svoz lodí z cíle</span><b>'+sl+'</b><small>'+(SV2.length?SV2.length+' '+pl(SV2.length,'místo','místa','míst'):'nic')+'</small></div></div></section>';
    /* rozvoz na start */
    h+='<section class="card rv" style="margin-top:16px"><div class="dp-h"><span class="dp-hi lid">'+SV(IKO.auto,20)+'</span><div><h2>Rozvoz na start</h2><p class="mut">Zastávky podle času odjezdu. U každé je seznam lidí, které vezete, a co naložit.</p></div></div>'+
      (ST.length?'<ol class="dp-tl">'+ST.map(function(z){var lk=lodK(z.kusy),vk=vybK(z.kusy),H=z.lidi.slice();z.lodi.forEach(function(r){if(H.indexOf(r)<0)H.push(r)});
        var nlz=nLod(z.kusy);
        /* tabulka: kdo jede – každý host na vlastním řádku */
        return '<li class="dp-st"><div class="dp-cas">'+(z.cas?'<b>'+esc(z.cas)+'</b><small>odjezd</small>':'<b>–</b><small>jen lodě</small>')+'</div><div class="dp-b">'+
          '<div class="dp-zh"><h3>'+esc(R.mistoN(z.misto))+'</h3><span class="dp-ch lid">'+SV(IKO.lid,15)+'<b>'+z.osob+'</b> '+pl(z.osob,'osoba','osoby','osob')+'</span>'+(z.aut?'<span class="dp-ch aut">'+SV(IKO.auto,15)+'<b>'+z.aut+'</b> '+pl(z.aut,'auto','auta','aut')+'</span>':'')+(nlz?'<span class="dp-ch lod">'+SV(IKO.lod,15)+'<b>'+nlz+'</b> '+pl(nlz,'loď','lodě','lodí')+'</span>':'')+'</div>'+
          '<table class="dp-t"><thead><tr><th>Host</th><th class="n">Osob</th><th>Telefon</th><th>Lodě</th></tr></thead><tbody>'+H.map(function(r){var jede=z.lidi.indexOf(r)>=0,ml=z.lodi.indexOf(r)>=0;
            return '<tr><td><button type="button" class="lnk dp-jm" data-id="'+r.id+'">'+esc(r.jmeno)+'</button><small>'+(maUby(r)?esc(kratM(r)):'nebydlí v kempu')+'</small></td>'+
              '<td class="n">'+(jede?'<b class="dp-os">'+(r.doprava.osob||0)+'</b>':'<span class="mut">jen lodě</span>')+'</td>'+
              '<td>'+(r.telefon?'<a href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'<span class="mut">–</span>')+'</td>'+
              '<td>'+(ml?esc(LK(r)):'<span class="mut">vlastní lodě</span>')+'</td></tr>'}).join('')+'</tbody></table>'+
          (nlz?'<div class="dp-nal">'+SV(IKO.lod,16)+'<span><b>Naložit:</b> '+esc(kusyTxt(lk))+' · '+esc(R.lodeKusyTxt(vk))+'</span></div>':'')+
          '</div></li>'}).join('')+'</ol>':'<p class="mut" style="margin:0">Na tento den nikoho ani nic na start nevezete.</p>')+'</section>';
    /* vyzvednutí lidí v cíli a odvoz zpět do kempu */
    h+='<section class="card rv" style="margin-top:16px"><div class="dp-h"><span class="dp-hi vyz">'+SV(IKO.auto,20)+'</span><div><h2>Vyzvednutí v cíli</h2><p class="mut">Hosté, kteří končí mimo kemp a chtějí odvézt zpátky do kempu. Podle času, kdy budou v cíli.</p></div></div>'+
      (VZ2.length?'<ol class="dp-tl">'+VZ2.map(function(z){return '<li class="dp-st"><div class="dp-cas"><b>'+esc(z.cas||'–')+'</b><small>vyzvednout</small></div><div class="dp-b">'+
        '<div class="dp-zh"><h3>'+esc(R.mistoN(z.misto))+' → Kemp Krumlov</h3><span class="dp-ch lid">'+SV(IKO.lid,15)+'<b>'+z.osob+'</b> '+pl(z.osob,'osoba','osoby','osob')+'</span><span class="dp-ch aut">'+SV(IKO.auto,15)+'<b>'+z.aut+'</b> '+pl(z.aut,'auto','auta','aut')+'</span></div>'+
        '<table class="dp-t"><thead><tr><th>Host</th><th class="n">Osob</th><th>Telefon</th><th>Lodě</th></tr></thead><tbody>'+z.L.map(function(r){return '<tr><td><button type="button" class="lnk dp-jm" data-id="'+r.id+'">'+esc(r.jmeno)+'</button><small>'+(maUby(r)?esc(kratM(r)):'nebydlí v kempu')+'</small></td><td class="n"><b class="dp-os">'+(r.vyzved.osob||0)+'</b></td><td>'+(r.telefon?'<a href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'<span class="mut">–</span>')+'</td><td>'+(LK(r)?esc(LK(r)):'<span class="mut">vlastní lodě</span>')+'</td></tr>'}).join('')+'</tbody></table></div></li>'}).join('')+'</ol>':'<p class="mut" style="margin:0">Na tento den nikoho z cíle nevyzvedáváte.</p>')+'</section>';
    /* svoz */
    h+='<section class="card rv" style="margin-top:16px"><div class="dp-h"><span class="dp-hi svz">'+SV(IKO.cil,20)+'</span><div><h2>Svoz lodí z cíle</h2><p class="mut">Kde hosté končí a odkud je potřeba lodě a vybavení odvézt zpět do kempu.</p></div></div>'+
      (SV2.length?'<div class="dp-sv">'+SV2.map(function(z){return '<div class="dp-svc"><h3>'+esc(R.mistoN(z.misto))+'</h3><b>'+esc(kusyTxt(lodK(z.kusy)))+'</b><span class="dp-vy">'+esc(R.lodeKusyTxt(vybK(z.kusy)))+'</span><ul>'+z.L.map(function(r){return '<li><button type="button" class="lnk" data-id="'+r.id+'">'+esc(r.jmeno)+'</button> <small>'+esc(LK(r))+(r.telefon?' · '+esc(r.telefon):'')+'</small></li>'}).join('')+'</ul></div>'}).join('')+'</div>':'<p class="mut" style="margin:0">Na tento den žádný svoz. Všichni končí v kempu.</p>')+'</section>';
    return h}
  /* ---- PŮJČOVNA: dostupnost lodí a vybavení po dnech + výdej na vybraný den ---- */
  /* kdo má daný typ lodi v daný den (stejná pravidla jako výpočet dostupnosti) */
  var kdoMa=function(k,den){var o=[];R.vse().forEach(function(r){if(r.stav==='zru'||!r.lode||!(+r.lode.kusy[k]||(r.lode.vydano&&r.lode.vydano.kusy[k])))return;var dn=R.lodeDny(r.lode),v=r.lode.vydano,n=0,po=false;
      if(v&&den===dnes&&den>=dn[0])n=R.lodeVen(r)[k]||0;else if(dn.indexOf(den)>=0)n=+r.lode.kusy[k]||0;else if(v&&den>dn[dn.length-1]&&den<=dnes){n=R.lodeVen(r)[k]||0;po=true}
      if(n>0)o.push({r:r,n:n,po:po})});return o.sort(function(a,b){return b.n-a.n||a.r.jmeno.localeCompare(b.r.jmeno,'cs')})};
  var kdoDlg=function(k,den){var L=kdoMa(k,den),p=KKC.p(k)||{n:k},c=R.lodeCelkem()[k]||0,sum=0;L.forEach(function(x){sum+=x.n});
    var d=document.createElement('dialog');d.className='dlg kdo';d.setAttribute('aria-labelledby','kdoh');
    d.innerHTML='<div class="kdo-h"><div><h2 id="kdoh">'+esc(p.n)+' · '+DNY[D0(den).getDay()]+' '+KR(den)+'</h2><p class="mut">Půjčeno <b>'+sum+'</b> z '+c+' · volných <b>'+(c-sum)+'</b></p></div><button type="button" class="btn ic gh" data-x aria-label="Zavřít">✕</button></div>'+
      (L.length?'<ul class="kdo-l">'+L.map(function(x){var r=x.r,l=r.lode,dn=R.lodeDny(l);return '<li><span class="kdo-n">'+x.n+'×</span><div><button type="button" class="rl-j" data-id="'+r.id+'">'+esc(r.jmeno)+'</button>'+lsBdg(r)+(x.po?'<span class="rls po">nevráceno</span>':'')+
        '<small>'+(dn.length>1?KR(dn[0])+' – '+KR(dn[dn.length-1]):KR(dn[0]))+' · '+esc(R.mistoN(l.odkud))+' → '+esc(R.mistoN(l.kam))+(r.telefon?' · <a href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'')+'</small></div></li>'}).join('')+'</ul>':'<p class="mut">Tento den nemá nikdo tento typ lodi půjčený.</p>');
    document.body.appendChild(d);var zavri=function(){try{d.close()}catch(e){}d.remove()};
    d.addEventListener('click',function(e){if(e.target===d||e.target.closest('[data-x]')){zavri();return}var b=e.target.closest('[data-id]');if(b){zavri();detail(b.dataset.id)}});
    d.addEventListener('cancel',function(e){e.preventDefault();zavri()});d.showModal();$('[data-x]',d).focus()};
  /* ---- PŮJČOVNA 1: výdej a vracení – tři sloupce podle toho, co se s loděmi právě děje ---- */
  /* karta rezervace: zaplaceno / doplatit + malý ukazatel */
  var plKarta=function(r){if(r.stav==='zru'||!(+r.cena))return '';var ce=+r.cena,p=r.platba,zp=!p?0:p.stav==='vse'?ce:p.stav==='zal'?Math.min(ce,+p.zaloha||0):0,d=ce-zp,pr=Math.round(zp/ce*100);
    return '<span class="rr-pl'+(d?'':' ok')+'"><span class="rr-pl-t"><span class="z"><small>Zaplaceno</small><b>'+kc(zp)+'</b></span><span class="'+(d?'d':'z')+'"><small>Doplatit</small><b>'+(d?kc(d):'nic')+'</b></span></span><i><s style="width:'+pr+'%"></s></i></span>'};
  var kUhrade=function(r){var p=r.platba;if(p&&p.stav==='vse')return '<span class="pk-pl ok">zaplaceno</span>';var d=p&&p.stav==='zal'?Math.max(0,(+r.cena||0)-(+p.zaloha||0)):+r.cena||0;return d?'<span class="pk-pl">doplatit <b>'+kc(d)+'</b></span>':''};
  var pkKarta=function(r,typ){var l=r.lode,ven=typ==='ven',k=ven?R.lodeVen(r):R.lodePotreba(l),lk=lodK(k),vk=vybK(k),pd=posD(r),po=ven&&pd<dnes;
    var kdy=typ==='vyd'?(r.doprava&&r.doprava.cas?'<span class="pk-t">'+SV(IKO.auto,14)+'odjezd '+esc(r.doprava.cas)+'</span>':'<span class="pk-t">'+(l.odkud==='kemp'?'vyplouvá z kempu':'vlastní doprava')+'</span>')
      :ven?(po?'<span class="pk-t zle">měl vrátit '+KR(pd)+'</span>':pd===dnes?'<span class="pk-t dnes">vrací dnes</span>':'<span class="pk-t">vrátí '+KR(pd)+'</span>')
      :typ==='plan'?'<span class="pk-t">'+(pd===denP?'vrací ten den':'vrátí '+KR(pd))+'</span>'
      :'<span class="pk-t">'+((l.vraceno||[]).length?'vráceno '+cas(l.vraceno[l.vraceno.length-1].kdy).split(' ').pop():'')+'</span>';
    return '<article class="pk-c'+(DRZ[r.id]?' zm'+(Date.now()-DRZ[r.id].t<1500?' zm-n':''):'')+(po?' po':'')+(typ==='vra'?' hot':'')+'"><div class="pk-ch"><button type="button" class="rl-j" data-id="'+r.id+'">'+esc(r.jmeno)+'</button>'+kdy+'</div>'+
      '<div class="pk-l">'+esc(kusyTxt(lk)||'—')+'</div><div class="pk-v">'+esc(R.lodeKusyTxt(vk))+(ven&&LS(r)==='cast'?' · <b>část už vrátil</b>':'')+'</div>'+
      '<div class="pk-m">'+esc(R.mistoN(l.odkud))+' → '+esc(R.mistoN(l.kam))+(R.lodeDny(l).length>1?' · '+R.lodeDny(l).length+' '+pl(R.lodeDny(l).length,'den','dny','dní'):'')+'</div>'+
      '<div class="pk-f">'+(r.telefon?'<a href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'<span></span>')+(typ==='vyd'?kUhrade(r):'')+'</div>'+
      (typ==='vyd'&&r.platba&&r.platba.stav==='ceka'&&r.stav==='pop'?'<p class="pk-w">Záloha ještě není zaplacená.</p>':'')+
      (lodBtn(r)?lodBtn(r).replace('btn sm pri','btn pri pk-b').replace('>Vydat lodě<','>Vydat lodě →<').replace('>Vrátit lodě<','>Vrátit lodě ✓<'):'')+
      (l.vydano?'<div class="pk-z">'+(typ==='vra'||LS(r)==='cast'?'<button type="button" class="lnk" data-lzr="'+r.id+'">Zrušit vrácení</button>':'')+(typ!=='vra'?'<button type="button" class="lnk" data-lzv="'+r.id+'">Zrušit výdej</button>':'')+'</div>':'')+'</article>'};
  /* rychlé půjčení na místě: host přijde, vybere lodě, obsluha je rovnou vydá */
  /* rychlé ubytování hosta, který přijel bez rezervace: jen nutné údaje, zapíše se rovnou jako ubytovaný */
  function ubytovat(){
    var G=skupiny(),d=document.createElement('dialog');d.className='dlg pjc ubq';d.setAttribute('aria-labelledby','ubqh');
    var stp=function(n,l,v,mx,pozn){return '<div class="pjc-r"><span><b>'+l+'</b>'+(pozn?'<small>'+pozn+'</small>':'')+'</span><span class="pct-s"><button type="button" data-d="-1" aria-label="Méně – '+l+'">−</button><input class="inp" type="number" min="0" max="'+mx+'" inputmode="numeric" name="'+n+'" value="'+v+'" aria-label="'+l+' – počet"><button type="button" data-d="1" aria-label="Více – '+l+'">+</button></span></div>'};
    d.innerHTML='<form novalidate><div class="kdo-h"><div><h2 id="ubqh">Ubytovat hosta</h2><p class="mut">Host přijel bez rezervace. Zapíše se rovnou jako ubytovaný.</p></div><button type="button" class="btn ic gh" data-x aria-label="Zavřít">✕</button></div>'+
      '<div class="pjc-g"><label class="f">Jméno<input class="inp" name="jmeno" autocomplete="off" required></label><label class="f">Telefon<input class="inp" name="telefon" type="tel" inputmode="tel" autocomplete="off"></label></div>'+
      '<div class="pjc-l ubq-n">'+stp('noci','Počet nocí',1,30,'<span id="ubqo"></span>')+stp('dosp',esc((KKC.p('os')||{n:'Dospělí'}).n),2,40,esc((KKC.p('os')||{}).pozn||''))+stp('dite',esc((KKC.p('dite')||{n:'Děti'}).n),0,40,esc((KKC.p('dite')||{}).pozn||''))+'</div>'+
      '<fieldset class="ubq-m"><legend>Kam host jde <small>volná místa na celý pobyt</small></legend><div id="ubqm"></div>'+
      '<div class="pjc-l">'+stp('stan','Vlastní stan',0,20)+stp('karavan','Karavan / obytňák',0,20)+'</div></fieldset>'+
      '<div class="pjc-c"><div><span class="mut">Podle ceníku</span><b id="ubqc">–</b></div><label class="f">Cena (Kč)<input class="inp" name="cena" type="number" min="0" step="10"></label></div>'+
      '<label class="pjc-z"><input type="checkbox" class="cb" name="zapl" checked> Zaplaceno na místě</label><p class="pct-e" role="alert"></p>'+
      '<div class="ptj-b"><button type="button" class="btn gh" data-x>Zrušit</button><button type="submit" class="btn pri">Ubytovat →</button></div></form>';
    document.body.appendChild(d);var f=$('form',d),vyb={},rucne=false,zavri=function(){try{d.close()}catch(e){}d.remove()};
    var nn=function(){return Math.min(30,Math.max(1,Math.round(+f.noci.value||1)))},dk=function(){return ISO(ADD(D0(dnes),nn()))},cl=function(n){return Math.max(0,Math.round(+f[n].value||0))};
    var mista=function(){var od=dnes,k=dk();Object.keys(vyb).forEach(function(m){if(R.kolize([m],od,k).length)delete vyb[m]});
      $('#ubqm',f).innerHTML=G.map(function(g){var vo=g.c.map(function(c){return g.k+'-'+c}).filter(function(m){return !R.kolize([m],od,k).length});
        return '<div class="ubq-g"><span>'+esc(g.n)+'<small>'+vo.length+' volných</small></span><div>'+(vo.length?vo.map(function(m){return '<button type="button" class="ubq-b'+(vyb[m]?' on':'')+'" data-m="'+m+'" aria-pressed="'+!!vyb[m]+'">'+esc(R.nazev(m).replace('Podsadový stan','Stan').replace('Chatka ',''))+'</button>'}).join(''):'<em class="mut">vše obsazeno</em>')+'</div></div>'}).join('')};
    var prep=function(){var n=nn(),q={};$('#ubqo',f).textContent='odjezd '+KR(dk())+' '+dk().slice(0,4);
      Object.keys(vyb).forEach(function(m){var t=m.split('-')[0];q[t]=(q[t]||0)+1});q.stan=cl('stan');q.karavan=cl('karavan');q.os=cl('dosp');q.dite=cl('dite');var ty=Object.keys(q).filter(function(k){return q[k]&&KKC.p(k)&&KKC.p(k).kat==='ubytovani'});if(window.KKC&&KKC.osobaPlati&&!KKC.osobaPlati('dite',ty)){q.os+=q.dite;q.dite=0}if(window.KKC&&KKC.osobaPlati&&!KKC.osobaPlati('os',ty))q.os=0;
      var sum=0,sk={};if(window.KKC)for(var i=0;i<n;i++){var h=KKC.hlavni(ADD(D0(dnes),i).getMonth())?'a':'b';Object.keys(q).forEach(function(k){if(q[k]&&KKC.p(k)){var v=KKC.v(k,h)*q[k];sum+=v;sk[k]=(sk[k]||0)+v}})}
      var SL=window.KKC?KKC.slevaPobyt({noci:n,q:q,sumK:sk,od:dnes}):{kc:0},c=Math.round(sum-SL.kc);$('#ubqc',f).textContent=c?kc(c)+(SL.kc?' (sleva '+SL.nazev+' −'+kc(SL.kc)+')':''):'–';if(!rucne)f.cena.value=c||''};
    d.addEventListener('click',function(e){if(e.target===d||e.target.closest('[data-x]')){zavri();return}var b=e.target.closest('[data-d]');if(b){var i=b.parentNode.querySelector('input');i.value=Math.min(+i.max||99,Math.max(i.name==='noci'?1:0,(+i.value||0)+(+b.dataset.d)));if(i.name==='noci')mista();prep();return}
      var m=e.target.closest('[data-m]');if(m){if(vyb[m.dataset.m])delete vyb[m.dataset.m];else vyb[m.dataset.m]=1;m.classList.toggle('on',!!vyb[m.dataset.m]);m.setAttribute('aria-pressed',!!vyb[m.dataset.m]);prep()}});
    f.addEventListener('input',function(e){if(e.target.name==='cena'){rucne=e.target.value!=='';return}if(e.target.name==='noci')mista();prep()});
    d.addEventListener('cancel',function(e){e.preventDefault();zavri()});
    f.addEventListener('submit',function(e){e.preventDefault();var er=$('.pct-e',f),M=Object.keys(vyb),st=cl('stan'),kv=cl('karavan');
      if(!f.jmeno.value.trim()){er.textContent='Vyplňte jméno.';f.jmeno.focus();return}
      if(!M.length&&!st&&!kv){er.textContent='Vyberte chatku nebo stan, případně vlastní stan či karavan.';return}
      if(!cl('dosp')&&!cl('dite')){er.textContent='Zadejte počet osob.';return}
      try{var sn=snap(),n=nn(),r=R.pridej({hist:[{t:Date.now()+1,kdo:ja.jmeno,co:'Ubytován hned při zadání'}],mista:M,dalsi:{stan:st,karavan:kv},od:dnes,do:dk(),jmeno:f.jmeno.value.trim(),telefon:f.telefon.value.trim(),stav:'uby',zdroj:'obsluha',kdo:ja.jmeno,osoby:{dosp:cl('dosp'),dite:cl('dite'),zak:0},cena:+f.cena.value||0,
          platba:f.zapl.checked?{zaloha:0,splatnost:'',stav:'vse',kdy:Date.now()}:null,hist:[{t:Date.now(),kdo:ja.jmeno,co:'Ubytován na místě bez rezervace ('+n+' '+pl(n,'noc','noci','nocí')+')'}]});
        KK.zaznam('Rezervace',(r.cislo||'')+' '+r.jmeno+' – ubytován na místě');zavri();kresli();tz(r.jmeno+': ubytován do '+KR(r.do)+'.',sn)}catch(x){er.textContent=x.message}});
    d.showModal();mista();prep();f.jmeno.focus()}
  function pujcit(){
    var T=R.lodeTypy(),MR=R.mistaReky(),d=document.createElement('dialog');d.className='dlg pjc';d.setAttribute('aria-labelledby','pjch');
    d.innerHTML='<form novalidate><div class="kdo-h"><div><h2 id="pjch">Půjčit loď</h2><p class="mut">Rychlé půjčení na místě. Lodě se rovnou zapíšou jako vydané.</p></div><button type="button" class="btn ic gh" data-x aria-label="Zavřít">✕</button></div>'+
      '<div class="pjc-g"><label class="f">Jméno<input class="inp" name="jmeno" autocomplete="off" required></label><label class="f">Telefon<input class="inp" name="telefon" type="tel" inputmode="tel" autocomplete="off"></label></div>'+
      '<div class="pjc-l">'+T.map(function(p){return '<div class="pjc-r"><span><b>'+esc(p.n)+'</b><small>'+esc(p.pozn||'')+' · <i data-v="'+p.k+'"></i></small></span><span class="pct-s"><button type="button" data-d="-1" aria-label="Méně – '+esc(p.n)+'">−</button><input class="inp" type="number" min="0" inputmode="numeric" name="k_'+p.k+'" value="0" aria-label="'+esc(p.n)+' – počet"><button type="button" data-d="1" aria-label="Více – '+esc(p.n)+'">+</button></span></div>'}).join('')+'</div>'+
      '<div class="pjc-g t3"><label class="f">Na kolik dní<input class="inp" name="dni" type="number" min="1" max="14" value="1"></label><label class="f">Odkud<select class="inp" name="odkud">'+MR.map(function(x){return '<option value="'+x.k+'"'+(x.k==='kemp'?' selected':'')+'>'+esc(x.n)+'</option>'}).join('')+'</select></label><label class="f">Kam<select class="inp" name="kam">'+MR.map(function(x,i){return '<option value="'+x.k+'"'+(i===MR.length-1?' selected':'')+'>'+esc(x.n)+'</option>'}).join('')+'</select></label></div>'+
      '<label class="pjc-z pjc-dq"><input type="checkbox" class="cb" name="dop"> Chci dopravu osob na místo vyplutí</label>'+
      '<div class="pjc-dp" id="pjcd" hidden><div class="pjc-g"><label class="f">Počet osob<input class="inp" name="dos" type="number" min="1" max="99"></label><label class="f">Odjezd z kempu<select class="inp" name="dcas">'+[8,9,10,11,12,13,14,15,16].map(function(h){return '<option>'+h+':00</option><option>'+h+':30</option>'}).join('')+'</select></label></div><p class="mut" id="pjcdi"></p></div>'+
      '<label class="pjc-z pjc-dq"><input type="checkbox" class="cb" name="vyz"> Chci vyzvednutí v cíli (odvoz zpět do kempu)</label>'+
      '<div class="pjc-dp" id="pjcy" hidden><div class="pjc-g"><label class="f">Počet osob<input class="inp" name="vos" type="number" min="1" max="99"></label><label class="f">Vyzvednutí v cíli<select class="inp" name="vcas">'+[12,13,14,15,16,17,18,19].map(function(h){return '<option'+(h===16?' selected':'')+'>'+h+':00</option><option>'+h+':30</option>'}).join('')+'</select></label></div><p class="mut" id="pjcyi"></p></div>'+
      '<div class="pjc-c"><div><span class="mut">Vybavení k výdeji</span><b id="pjcv">–</b><small id="pjcnv" class="pjc-nv"></small></div><label class="f">Cena (Kč)<input class="inp" name="cena" type="number" min="0" step="10"></label></div>'+
      '<label class="pjc-z"><input type="checkbox" class="cb" name="zapl" checked> Zaplaceno na místě</label><p class="pct-e" role="alert"></p>'+
      '<div class="ptj-b"><button type="button" class="btn gh" data-x>Zrušit</button><button type="submit" class="btn pri">Půjčit a vydat lodě →</button></div></form>';
    document.body.appendChild(d);var f=$('form',d),rucne=false,osR=false,vsR=false,zavri=function(){try{d.close()}catch(e){}d.remove()};
    var lod=function(){var k={},n=0;T.forEach(function(p){var v=Math.max(0,Math.round(+f['k_'+p.k].value||0));if(v){k[p.k]=v;n+=v}});return n?{den:dnes,dni:Math.max(1,Math.round(+f.dni.value||1)),kusy:k,odkud:f.odkud.value,kam:f.kam.value}:null};
    var osL=function(l){var o=0;if(l)Object.keys(l.kusy).forEach(function(k){o+=l.kusy[k]*((KKC.p(k)||{}).osob||2)});return o};
    var vyzv=function(){var l=lod();if(!f.vyz.checked||!l||l.kam==='kemp')return null;return {misto:l.kam,osob:Math.max(1,Math.round(+f.vos.value||osL(l)||1)),cas:f.vcas.value,den:R.lodeDny(l).pop()}};
    var dopr=function(){var l=lod();if(!f.dop.checked||!l||l.odkud==='kemp')return null;return {misto:l.odkud,osob:Math.max(1,Math.round(+f.dos.value||osL(l)||1)),cas:f.dcas.value,den:dnes}};
    var prep=function(){var l=lod(),v=R.lodeVolno(dnes,Math.max(1,Math.round(+f.dni.value||1)));$$('[data-v]',f).forEach(function(e){var x=Math.max(0,v[e.dataset.v]||0);e.textContent='volných '+x;e.className=x?'':'zle'});
      $('#pjcv',f).textContent=l?vybTxt(l):'–';
      $('#pjcd',f).hidden=!f.dop.checked;if(f.dop.checked){if(!osR)f.dos.value=osL(l)||'';var dp=dopr(),zk=f.odkud.value==='kemp';$('#pjcdi',f).innerHTML=zk?'<b class="zle">Vyplouvá se z kempu – vyberte v „Odkud“ místo, kam hosty odvezete.</b>':dp?esc(R.mistoN(dp.misto))+' · '+R.aut(dp.osob)+' '+pl(R.aut(dp.osob),'auto','auta','aut')+' · <b>'+kc(R.cenaDopravy(dp))+'</b>':'Nejdřív vyberte lodě.'}
      $('#pjcy',f).hidden=!f.vyz.checked;if(f.vyz.checked){if(!vsR)f.vos.value=osL(l)||'';var vy=vyzv();$('#pjcyi',f).innerHTML=f.kam.value==='kemp'?'<b class="zle">Doplouvá se do kempu – vyzvednutí není potřeba. Vyberte v „Kam“ cíl (např. Zlatá Koruna, Boršov).</b>':vy?esc(R.mistoN(vy.misto))+' → kemp · '+R.aut(vy.osob)+' '+pl(R.aut(vy.osob),'auto','auta','aut')+' · <b>'+kc(R.cenaDopravy(vy))+'</b>':'Nejdřív vyberte lodě.'}
      if(!rucne){var cl=l?R.cenaLodi(l):null,lc=l?cl.celkem:0,dc=R.cenaDopravy(dopr())+R.cenaDopravy(vyzv()),sv=l&&window.KKC&&KKC.slevaPobyt?KKC.slevaPobyt({lodi:R.lodePocet(l),lode:lc,dop:dc,od:dnes}).kc:0;f.cena.value=l?lc+dc-sv:''}var nvv=l?R.cenaLodi(l).navoz:0;$('#pjcnv',f).textContent=nvv?'+ návoz lodí '+kc(nvv)+' – není v ceně, vybrat na místě':'';var ch=l?R.lodeChybi(l):[];$('.pct-e',f).textContent=ch.length?'Chybí: '+ch.join(', ')+'.':''};
    d.addEventListener('click',function(e){if(e.target===d||e.target.closest('[data-x]')){zavri();return}var b=e.target.closest('[data-d]');if(b){var i=b.parentNode.querySelector('input');i.value=Math.max(0,(+i.value||0)+(+b.dataset.d));prep()}});
    f.addEventListener('input',function(e){if(e.target.name==='cena')rucne=e.target.value!=='';else{if(e.target.name==='dos')osR=e.target.value!=='';if(e.target.name==='vos')vsR=e.target.value!=='';prep()}});f.addEventListener('change',prep);
    d.addEventListener('cancel',function(e){e.preventDefault();zavri()});
    f.addEventListener('submit',function(e){e.preventDefault();var l=lod(),er=$('.pct-e',f);
      if(!f.jmeno.value.trim()){er.textContent='Vyplňte jméno.';f.jmeno.focus();return}if(!l){er.textContent='Vyberte aspoň jednu loď.';return}
      if(MR.map(function(x){return x.k}).indexOf(l.kam)<=MR.map(function(x){return x.k}).indexOf(l.odkud)){er.textContent='Cíl musí být po proudu za místem vyplutí.';f.kam.focus();return}
      if(f.dop.checked&&l.odkud==='kemp'){er.textContent='U dopravy vyberte v „Odkud“ místo vyplutí (ne Kemp Krumlov).';f.odkud.focus();return}
      if(f.vyz.checked&&l.kam==='kemp'){er.textContent='U vyzvednutí vyberte v „Kam“ cíl (ne Kemp Krumlov).';f.kam.focus();return}
      var ch=R.lodeChybi(l);if(ch.length){er.textContent='Na to už není dost vybavení: '+ch.join(', ')+'.';return}var dpo=dopr(),vyo=vyzv();
      var pt=R.lodePotreba(l),os=0;Object.keys(l.kusy).forEach(function(k){os+=l.kusy[k]*((KKC.p(k)||{}).osob||2)});l.vydano={kdy:Date.now(),kdo:ja.jmeno,kusy:pt};l.vraceno=[];
      try{var sn=snap(),cn=+f.cena.value||0,r=R.pridej({hist:[{t:Date.now()+1,kdo:ja.jmeno,co:'Lodě vydány hned při zadání: '+R.lodeKusyTxt(pt)}],mista:[],dalsi:{stan:0,karavan:0},od:dnes,do:R.lodeDny(l).pop(),jmeno:f.jmeno.value.trim(),telefon:f.telefon.value.trim(),stav:'pot',zdroj:'obsluha',kdo:ja.jmeno,osoby:{dosp:dpo?dpo.osob:os,dite:0,zak:0},lode:l,doprava:dpo,vyzved:vyo,cena:cn,
          platba:f.zapl.checked?{zaloha:0,splatnost:'',stav:'vse',kdy:Date.now()}:null,hist:[{t:Date.now(),kdo:ja.jmeno,co:'Půjčeno na místě a vydáno: '+R.lodeKusyTxt(pt)+(dpo?' · doprava '+R.mistoN(dpo.misto)+' '+dpo.cas:'')+(vyo?' · vyzvednutí '+R.mistoN(vyo.misto)+' '+vyo.cas:'')}]});
        KK.zaznam('Rezervace',(r.cislo||'')+' '+r.jmeno+' – půjčeno na místě');zavri();denP=dnes;kresli();tz(r.jmeno+': lodě půjčeny a vydány.',sn)}catch(x){er.textContent=x.message}});
    d.showModal();prep();f.jmeno.focus()}
  /* ---- UBYTOVÁNÍ: příjezdy a odjezdy na den – stejné rozložení jako výdej a vracení lodí ---- */
  var ubKarta=function(r,typ){var o=r.osoby||{},os=KKC.osobPocet(o),n=noci(r),p=r.platba,
      tg=typ==='pri'?(r.stav==='pop'?(p&&p.stav==='ceka'?'<span class="pk-t zle">čeká na zálohu</span>':'<span class="pk-t">čeká na zálohu</span>'):'<span class="pk-t">'+(n+' '+pl(n,'noc','noci','nocí'))+'</span>')
        :typ==='odj'||typ==='plan'?(r.do<dnes?'<span class="pk-t zle">měl odjet '+KR(r.do)+'</span>':'<span class="pk-t dnes">odjíždí '+(r.do===dnes?'dnes':KR(r.do))+'</span>')
        :'<span class="pk-t">odhlášen'+(r.hist&&r.hist.length?' '+cas(r.hist[r.hist.length-1].t).split(' ').pop():'')+'</span>',
      lo=LK(r)?'<span class="pk-lo">'+SV(IC.lode,13)+esc(LK(r))+'</span>':'',dp=(r.doprava?'<span class="pk-lo dp">doprava '+esc(R.mistoN(r.doprava.misto))+(r.doprava.cas?' '+esc(r.doprava.cas):'')+'</span>':'')+(r.vyzved?'<span class="pk-lo dp">vyzvednutí '+esc(R.mistoN(r.vyzved.misto))+(r.vyzved.cas?' '+esc(r.vyzved.cas):'')+'</span>':'');
    var uz=typ==='pri'&&(r.stav==='uby'||r.stav==='odj');if(uz)tg='<span class="pk-t ok">✓ ubytován</span>';
    var btn=uz?'<div class="pk-z"><button type="button" class="lnk" data-qs="'+r.id+'" data-st="pot">Zrušit ubytování</button></div>':typ==='pri'?'<button type="button" class="btn pri pk-b" data-qs="'+r.id+'" data-st="uby">Ubytovat</button>':typ==='odj'?'<button type="button" class="btn pri pk-b" data-qs="'+r.id+'" data-st="odj">Odhlásit</button>':'';
    return '<article class="pk-c'+(DRZ[r.id]?' zm'+(Date.now()-DRZ[r.id].t<1500?' zm-n':''):'')+(typ==='odj'&&r.do<dnes?' po':'')+(typ==='hot'?' hot':'')+'"><div class="pk-ch"><button type="button" class="rl-j" data-id="'+r.id+'">'+esc(r.jmeno)+'</button>'+tg+'</div>'+
      '<div class="pk-l">'+esc(kratM(r))+'</div><div class="pk-v">'+esc(KKC.osobyTxt(o))+' · '+KR(r.od)+' – '+KR(r.do)+'</div>'+
      (lo||dp?'<div class="pk-m">'+lo+dp+'</div>':'')+
      '<div class="pk-f">'+(r.telefon?'<a href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'<span></span>')+(typ!=='hot'?kUhrade(r):'')+'</div>'+
      (typ==='pri'&&p&&p.stav==='ceka'?'<p class="pk-w">Záloha ještě není zaplacená.</p>':'')+btn+
      (typ==='hot'?'<div class="pk-z"><button type="button" class="lnk" data-qs="'+r.id+'" data-st="uby">Zrušit odhlášení</button></div>':typ==='odj'&&r.stav==='uby'&&r.od===dnes?'<div class="pk-z"><button type="button" class="lnk" data-qs="'+r.id+'" data-st="pot">Zrušit ubytování</button></div>':'')+'</article>'};
  function ubyTab(akt){
    var d0=D0(denP),jeDnes=denP===dnes,H=akt.filter(function(r){return r.stav!=='blk'&&maUby(r)}),jm=function(a,b){return a.jmeno.localeCompare(b.jmeno,'cs')};
    var hot=function(r){return r.stav==='uby'||r.stav==='odj'},PRh=H.filter(function(r){return r.od===denP&&jeDnes&&hot(r)}).sort(jm),PR=H.filter(function(r){return (r.stav==='pot'||r.stav==='pop')&&r.od===denP}).sort(jm);
    var OD=H.filter(function(r){return jeDnes?r.stav==='uby'&&r.do<=dnes:(r.stav==='uby'||r.stav==='pot'||r.stav==='pop')&&r.do===denP}).sort(function(a,b){return a.do.localeCompare(b.do)||jm(a,b)});
    var HT=jeDnes?H.filter(function(r){return r.stav==='odj'&&r.do===denP}).sort(jm):[];
    var ZU=H.filter(function(r){return (jeDnes?r.stav==='uby':r.stav!=='odj')&&r.od<=denP&&r.do>denP});
    var po=jeDnes?OD.filter(function(r){return r.do<dnes}).length:0,osb=function(L){var n=0;L.forEach(function(r){var o=r.osoby||{};n+=KKC.osobPocet(o)});return n};
    var vse=[],obs={};skupiny().forEach(function(g){g.c.forEach(function(c){vse.push(g.k+'-'+c)})});
    R.vse().forEach(function(r){if(r.stav==='zru')return;if(r.od<=denP&&denP<r.do)(r.mista||[]).forEach(function(m){obs[m]=1})});
    var vol=vse.filter(function(m){return !obs[m]}).length;
    var h='<section class="card rv pk"><div class="row rv-h"><h2 style="margin:0">'+(jeDnes?'Dnes':DNY[d0.getDay()]+' '+KR(denP))+'</h2><span class="mut">'+['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'][d0.getDay()].toLowerCase()+' '+d0.getDate()+'. '+(d0.getMonth()+1)+'. '+d0.getFullYear()+'</span><span class="sp"></span>'+denNav()+'<button type="button" class="btn sm" data-a="tisk" data-co="ubyt">'+SV('<path d="M3 11 12 4l9 7M5 10v10h14V10"/>',16)+'Kdo je ubytován</button>'+tiskBtn('Tisk příjezdů a odjezdů')+'</div>'+
      '<div class="pk-sum"><div class="pk-s vyd"><b>'+PR.length+'</b><span>přijíždí</span><small>'+osb(PR)+' '+pl(osb(PR),'osoba','osoby','osob')+'</small></div>'+
      '<div class="pk-s ven"><b>'+OD.length+'</b><span>odjíždí</span><small>'+(po?po+' po termínu':'k odhlášení')+'</small></div>'+
      '<div class="pk-s zu"><b>'+ZU.length+'</b><span>zůstává</span><small>'+osb(ZU)+' '+pl(osb(ZU),'host','hosté','hostů')+'</small></div>'+
      '<div class="pk-s vra"><b>'+vol+'</b><span>volných míst</span><small>z '+vse.length+' · chatky, stany, teepee</small></div></div></section>';
    /* hotoví (ubytovaní / odhlášení) zůstávají na konci sloupce zeleně, kvůli přehledu */
    var sl=function(cls,nad,pop,L,typ,nic,Lh,typH,nh){return '<section class="pk-col '+cls+'"><header><h3>'+nad+'<span>'+L.length+'</span>'+(Lh&&Lh.length?'<em class="pk-hn">✓ '+Lh.length+' '+nh+'</em>':'')+'</h3><p>'+pop+'</p></header>'+(L.length?L.map(function(r){return ubKarta(r,typ)}).join(''):'<p class="pk-0">'+nic+'</p>')+(Lh&&Lh.length?'<div class="pk-hd'+(typH==='hot'?' off':'')+'"><span>'+(typH==='hot'?'Odhlášení – vyřešeno':'Ubytovaní')+'</span></div>'+Lh.map(function(r){return ubKarta(r,typH).replace('class="pk-c','class="pk-c '+(typH==='hot'?'pk-off':'pk-ok'))}).join(''):'')+'</section>'};
    h+='<div class="pk-g pk-g2">'+sl('vyd','1 · Přijíždí','Hosté s rezervací, kteří ten den přijedou.',PR,'pri',PRh.length?'Všichni jsou ubytovaní.':'Nikdo nepřijíždí.',PRh,'pri','ubytováno')+
      sl('ven','2 · Odjíždí',jeDnes?'Ubytovaní hosté, kteří dnes odjíždějí.':'Hosté, kteří ten den odjedou.',OD,jeDnes?'odj':'plan',HT.length?'Všichni jsou odhlášení.':'Nikdo neodjíždí.',HT,'hot','odhlášeno')+'</div>';
    return h}
  function lodeTab(akt){
    var d0=D0(denP),jeDnes=denP===dnes,S=R.vse().filter(function(r){return r.stav!=='zru'&&sLod(r)});
    var KV=S.filter(function(r){return LS(r)==='res'&&(r.lode.den===denP||(jeDnes&&r.lode.den<dnes&&posD(r)>=dnes))}).sort(function(a,b){return ((a.doprava&&a.doprava.cas)||'99').localeCompare((b.doprava&&b.doprava.cas)||'99','cs',{numeric:true})||a.jmeno.localeCompare(b.jmeno,'cs')});
    var VEN=S.filter(function(r){var x=LS(r);if(jeDnes)return x==='vyd'||x==='cast';return x!=='vra'&&r.lode.den<denP&&denP<=posD(r)}).sort(function(a,b){return posD(a).localeCompare(posD(b))||a.jmeno.localeCompare(b.jmeno,'cs')});
    var VR=S.filter(function(r){if(LS(r)!=='vra')return false;var v=r.lode.vraceno||[];return v.length&&ISO(new Date(v[v.length-1].kdy))===denP});
    var po=jeDnes?VEN.filter(function(r){return posD(r)<dnes}).length:0,vd=VEN.filter(function(r){return posD(r)===denP}).length,nl=function(L,ven){var n=0;L.forEach(function(r){n+=nLod(ven?R.lodeVen(r):R.lodePotreba(r.lode))});return n};
    var dny=[],i;for(i=-1;i<13;i++)dny.push(ISO(ADD(D0(dnes),i)));
    var h='<section class="card rv pk"><div class="row rv-h"><h2 style="margin:0">'+(jeDnes?'Dnes':DNY[d0.getDay()]+' '+KR(denP))+'</h2><span class="mut">'+['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'][d0.getDay()].toLowerCase()+' '+d0.getDate()+'. '+(d0.getMonth()+1)+'. '+d0.getFullYear()+'</span><span class="sp"></span>'+denNav()+tiskBtn('Tisk výdeje')+'</div>'+
      '<div class="pk-sum"><div class="pk-s vyd"><b>'+KV.length+'</b><span>k výdeji</span><small>'+nl(KV)+' '+pl(nl(KV),'loď','lodě','lodí')+'</small></div>'+
      '<div class="pk-s ven"><b>'+VEN.length+'</b><span>'+(jeDnes?'na vodě':'na vodě (plán)')+'</span><small>'+nl(VEN,jeDnes)+' '+pl(nl(VEN,jeDnes),'loď','lodě','lodí')+(vd?' · '+vd+' vrací '+(jeDnes?'dnes':'ten den'):'')+'</small></div>'+
      (jeDnes?'<div class="pk-s po'+(po?' je':'')+'"><b>'+po+'</b><span>po termínu</span><small>'+(po?'zavolejte jim':'vše v pořádku')+'</small></div>':'')+
      '<div class="pk-s vra"><b>'+VR.length+'</b><span>vráceno</span><small>'+(jeDnes?'dnes hotovo':'ten den')+'</small></div></div></section>';
    var sl=function(cls,nad,pop,L,typ,nic){return '<section class="pk-col '+cls+'"><header><h3>'+nad+'<span>'+L.length+'</span></h3><p>'+pop+'</p></header>'+(L.length?L.map(function(r){return pkKarta(r,typ)}).join(''):'<p class="pk-0">'+nic+'</p>')+'</section>'};
    h+='<div class="pk-g">'+sl('vyd','1 · K výdeji','Rezervované lodě, které si host ten den vyzvedne.',KV,'vyd','Nic k výdeji.')+
      sl('ven','2 · Na vodě',jeDnes?'Vydané lodě, které se ještě nevrátily.':'Vícedenní plavby, které ten den pokračují nebo končí.',VEN,jeDnes?'ven':'plan',jeDnes?'Všechno je doma.':'Nic.')+
      sl('vra','3 · Vráceno','Hotovo, vše je zpět ve skladu.',VR,'vra','Zatím nic.')+'</div>';
    return h}
  /* ---- PŮJČOVNA 2: dostupnost na 14 dní a stav skladu ---- */
  function lodDost(akt){
    var T=R.lodeTypy(),C=R.lodeCelkem(),dny=[],i;if(denP<okno)okno=denP;else if(denP>ISO(ADD(D0(okno),13)))okno=ISO(ADD(D0(denP),-13));for(i=0;i<14;i++)dny.push(ISO(ADD(D0(okno),i)));
    var ri=function(k){return k in R.VYB},obs=dny.map(function(d){return R.lodeObs(d)}),RD=T.map(function(p){return [p.k,p.n,p.pozn||'']}).concat(Object.keys(R.VYB).map(function(k){return [k,R.VYB[k],'vybavení']}));
    var bun=function(k,j){var c=C[k]||0,v=c-(obs[j][k]||0),cl=v<0?'min':v===0?'nic':c&&v/c<=.2?'malo':'ok',nz=RD.filter(function(x){return x[0]===k})[0][1],t=nz+' '+KR(dny[j])+': volných '+v+' z '+c;
      return '<td class="rv-c '+cl+(dny[j]===denP?' ted':'')+'">'+(ri(k)?'<b title="'+esc(t)+'">'+v+'</b>':'<button type="button" class="rv-kdo" data-kdo="'+k+'|'+dny[j]+'" title="'+esc(t)+' – kdo je má půjčené" aria-label="'+esc(t)+'. Zobrazit, kdo je má půjčené.">'+v+'</button>')+'</td>'};
    var venK={};R.vse().forEach(function(r){var x=LS(r);if(r.stav==='zru'||(x!=='vyd'&&x!=='cast'))return;var v=R.lodeVen(r);Object.keys(v).forEach(function(k){venK[k]=(venK[k]||0)+v[k]})});
    var h='<section class="card rv"><div class="row rv-h"><h2 style="margin:0">Volné lodě a vybavení na 14 dní</h2><span class="sp"></span>'+denNav()+'</div>'+
      '<p class="mut" style="margin:4px 0 12px">Číslo = kolik kusů je ten den volných. Kliknutím na číslo u lodí uvidíte, kdo je má půjčené. Počítají se i rezervace, které čekají na zálohu.</p>'+
      '<div class="tw-wrap"><table class="rv-t"><thead><tr><th></th>'+dny.map(function(d){var x=D0(d);return '<th class="'+(d===denP?'ted':'')+(x.getDay()%6?'':' vik')+'"><button type="button" data-den="'+d+'" aria-pressed="'+(d===denP)+'"><small>'+DNY[x.getDay()]+'</small>'+x.getDate()+'. '+(x.getMonth()+1)+'.</button></th>'}).join('')+'<th class="rv-s">Celkem</th></tr></thead><tbody>'+
      RD.map(function(x,rj){return '<tr class="'+(rj===T.length?'rv-odd':'')+'"><th scope="row">'+esc(x[1])+(x[2]?'<small>'+esc(x[2])+'</small>':'')+'</th>'+dny.map(function(d,j){return bun(x[0],j)}).join('')+'<td class="rv-s">'+(C[x[0]]||0)+'</td></tr>'}).join('')+
      '</tbody></table></div><p class="rv-leg"><span class="rv-c ok">dost</span><span class="rv-c malo">dochází</span><span class="rv-c nic">vše půjčené</span><span class="rv-c min">chybí</span></p></section>';
    h+='<section class="card rv rve" style="margin-top:16px"><div class="row rv-h"><h2 style="margin:0">Sklad právě teď</h2><span class="mut">kolik je doma a kolik venku u hostů</span><span class="sp"></span>'+(adm?'<button type="button" class="btn sm gh" data-skl>Upravit počty kusů</button>':'')+'</div>'+
      '<div class="rve-g">'+RD.map(function(x){var c=C[x[0]]||0,v=venK[x[0]]||0,pr=c?Math.min(100,Math.round(v/c*100)):0;return '<div class="rve-c'+(ri(x[0])?' vb':'')+'"><span>'+esc(x[1])+'</span><b>'+(c-v)+'<small> / '+c+' doma</small></b><i class="rve-b"><i style="width:'+pr+'%"></i></i><em>'+(v?v+' venku':'nic venku')+'</em></div>'}).join('')+'</div></section>';
    return h}
  /* ---- SEZNAM REZERVACÍ: karta = kdo, kdy, co + pruh stavů (Platba · Ubytování · Lodě) s tlačítkem pro další krok ---- */
  var maUby=function(r){return !!((r.mista||[]).length||(r.dalsi&&(+r.dalsi.stan||+r.dalsi.karavan)))};
  var FJ='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var krok=function(t,on,ted){return '<i class="rs-k'+(on?' on':'')+(ted?' ted':'')+'">'+(on?FJ:'')+t+'</i>'};
  var RSI={pl:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',ub:'<path d="M3 11 12 4l9 7M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',lo:'<path d="M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2-1.5 4.5-1.5S19 17 21 17"/><path d="M5 13h14l-2-5H7z"/>',
    dp:'<path d="M3 16V7a2 2 0 0 1 2-2h11l4 5v6"/><path d="M3 16h18"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/><path d="M3 10h17"/>'};
  var blok=function(cls,nad,kroky,info,btn){var t=cls.split(' ')[0];return '<div class="rs-b '+cls+'"><span class="rs-n">'+(RSI[t]?SV(RSI[t],15):'')+nad+'</span><span class="rs-kr">'+kroky+'</span>'+(info?'<span class="rs-i">'+info+'</span>':'')+(btn?'<span class="rs-a">'+btn+'</span>':'')+'</div>'};
  var stavPruh=function(r){
    if(r.stav==='zru')return '<div class="rsp rsp-zru"><span>Zrušená rezervace</span></div>';
    var h='',p=r.platba,ps=p?p.stav:'',dop=p&&ps==='zal'?Math.max(0,(+r.cena||0)-(+p.zaloha||0)):0,B=function(a,t,pri){return '<button type="button" class="btn sm'+(pri?' pri':'')+'" '+a+'>'+t+'</button>'};
    /* platba */
    h+=blok('pl'+(ps==='vse'?' ok':ps==='ceka'&&p.splatnost<dnes?' zle':''),'Platba',
      (p&&p.zaloha?krok('Záloha',ps==='zal'||ps==='vse',ps==='ceka'):'')+krok('Zaplaceno celé',ps==='vse',ps==='zal'||!p||!p.zaloha&&ps!=='vse'),
      plKarta(r)+(ps==='ceka'?'<span class="rr-pz">záloha '+kc(p.zaloha)+' do '+KR(p.splatnost)+'</span>':!p?'<span class="rr-pz">platí se na místě</span>':''),
      ps==='ceka'?B('data-zp="'+r.id+'" data-zc="zal"','Záloha zaplacena',1):ps!=='vse'?B('data-zp="'+r.id+'" data-zc="vse"','Zaplaceno celé',ps==='zal'&&r.stav==='uby'):'');
    /* ubytování – v kartě až poslední sloupec */
    var hU='';
    if(maUby(r)){var st=r.stav,ix={pop:0,pot:1,uby:2,odj:3}[st];
      hU+=blok('ub'+(st==='odj'?' ok':''),'Ubytování',krok('Potvrzeno',ix>=1,ix===0)+krok('Ubytován',ix>=2,ix===1)+krok('Odjel',ix>=3,ix===2),
        st==='pop'?'čeká na potvrzení':st==='pot'?(r.od===dnes?'přijíždí dnes':r.od<dnes?'měl přijet '+KR(r.od):'příjezd '+KR(r.od)):st==='uby'?(r.do===dnes?'odjíždí dnes':'do '+KR(r.do)):'',
        st==='pop'&&ps!=='ceka'?B('data-qs="'+r.id+'" data-st="pot"','Potvrdit',1):st==='pot'&&r.od<=dnes?B('data-qs="'+r.id+'" data-st="uby"','Ubytovat',1):st==='uby'?B('data-qs="'+r.id+'" data-st="odj"','Odhlásit',r.do<=dnes):'')}
    else hU+='<div class="rs-b ub nic"><span class="rs-n">'+SV(RSI.ub,15)+'Ubytování</span><span class="rs-i">bez ubytování</span></div>';
    var dpr=r.doprava?'<span class="rs-dp">'+SV(RSI.dp,15)+'<b>Doprava</b> '+esc(R.mistoN(r.doprava.misto))+(r.doprava.cas?' · '+esc(r.doprava.cas):'')+(r.doprava.osob?' · '+r.doprava.osob+' '+pl(r.doprava.osob,'osoba','osoby','osob'):'')+'</span>':'';
    if(r.vyzved)dpr+='<span class="rs-dp">'+SV(RSI.dp,15)+'<b>Vyzvednutí</b> '+esc(R.mistoN(r.vyzved.misto))+(r.vyzved.cas?' · '+esc(r.vyzved.cas):'')+'</span>';
    /* lodě */
    if(sLod(r)){var x=LS(r),pd=posD(r),po=(x==='vyd'||x==='cast')&&pd<dnes;
      h+=blok('lo'+(x==='vra'?' ok':po?' zle':''),'Lodě',krok('Vydané',x!=='res',x==='res')+krok('Vrácené',x==='vra',x==='vyd'||x==='cast'),
        x==='res'?(r.lode.den===dnes?'výdej dnes':'výdej '+KR(r.lode.den)):x==='vra'?'':(x==='cast'?'část vrácena · ':'')+(po?'měl vrátit '+KR(pd):pd===dnes?'vrací dnes':'vrátí '+KR(pd)),
        x==='res'&&r.lode.den<=dnes?B('data-lv="'+r.id+'"','Vydat lodě',1):x==='vyd'||x==='cast'?B('data-lr="'+r.id+'"','Vrátit lodě',1):'').replace('</div>',dpr+'</div>')}
    else if(r.doprava||r.vyzved)h+='<div class="rs-b lo jdp"><span class="rs-n">'+SV(RSI.lo,15)+'Lodě</span><span class="rs-i">bez lodí – vlastní</span>'+dpr+'</div>';
    else h+='<div class="rs-b lo nic"><span class="rs-n">'+SV(RSI.lo,15)+'Lodě</span><span class="rs-i">bez lodí</span></div>';
    h+=hU;
    return '<div class="rsp">'+h+'</div>'};
  /* ---- VZHLED B (zkušebně): klidná karta – červená lišta jen u zpoždění, sloupce bez barevných ploch.
     Vrátit původní vzhled: VZHLED_B=false. ---- */
  var VZHLED_B=true;
  var kartaB=function(r,zn,rok,os,b){
    var p=r.platba,ps=p?p.stav:'',ce=+r.cena||0,zp=!p?0:ps==='vse'?ce:ps==='zal'?Math.min(ce,+p.zaloha||0):0,d=ce-zp,zru=r.stav==='zru',
      Bt=function(a,t,pri){return '<button type="button" class="btn sm'+(pri?' pri':'')+'" '+a+'>'+t+'</button>'},
      K=function(t,on,zle){return '<span class="vb-s'+(on?' on':zle?' zle':'')+'">'+(on?'✓':'○')+' '+t+'</span>'},
      sl=function(nad,hl,stavy,pod,btn,zle,ok){var ik={'Platba':'pl','Ubytování':'ub','Lodě':'lo','Doprava':'dp'}[nad];return '<div class="vb-k '+(ik||'')+(zle?' zle':'')+(ok?' ok':'')+'"><span class="vb-n">'+(ik?SV(RSI[ik],15):'')+nad+'</span><span class="vb-h">'+hl+'</span>'+(stavy?'<span class="vb-ss">'+stavy+'</span>':'')+(pod?'<span class="vb-p">'+pod+'</span>':'')+(btn&&btn!==alB?'<span class="vb-a">'+btn+'</span>':'')+'</div>'};
    /* co je po termínu → červená lišta s jedním tlačítkem */
    var al=[],alB='',x=sLod(r)?LS(r):'',pd=x?posD(r):'';
    if(!zru&&!b){
      if((x==='vyd'||x==='cast')&&pd<dnes){al.push('Lodě měly být vráceny '+KR(pd)+(x==='cast'?' · vrácena jen část':''));alB=alB||Bt('data-lr="'+r.id+'"','Vrátit lodě')}
      if(x==='res'&&r.lode.den<dnes){al.push('Lodě se měly vydat '+KR(r.lode.den));alB=alB||Bt('data-lv="'+r.id+'"','Vydat lodě')}
      if(maUby(r)&&r.stav==='pot'&&r.od<dnes){al.push('Host měl přijet '+KR(r.od));alB=alB||Bt('data-qs="'+r.id+'" data-st="uby"','Ubytovat')}
      if(maUby(r)&&r.stav==='uby'&&r.do<dnes){al.push('Host měl odjet '+KR(r.do));alB=alB||Bt('data-qs="'+r.id+'" data-st="odj"','Odhlásit')}
      if(ps==='ceka'&&p.splatnost&&p.splatnost<dnes){al.push('Záloha měla přijít do '+KR(p.splatnost));alB=alB||Bt('data-zp="'+r.id+'" data-zc="zal"','Záloha zaplacena')}}
    var bar=al.length?'<div class="vb-al">'+SV('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',17)+'<span>'+al.join(' · ')+'</span>'+alB+'</div>':'';
    /* co si host bere – obyčejný text místo štítků */
    var co=[];(r.mista||[]).forEach(function(k){co.push(R.nazev(k).replace('Podsadový stan','Stan'))});
    if(r.dalsi&&r.dalsi.stan)co.push(r.dalsi.stan+'× vl. stan');if(r.dalsi&&r.dalsi.karavan)co.push(r.dalsi.karavan+'× karavan');
    var stavCeny=zru?'<span class="vb-c mut">zrušeno</span>':b?'':ps==='vse'?'<span class="vb-c ok">zaplaceno celé</span>':ps==='ceka'?'<span class="vb-c">čeká na zálohu</span>':d?'<span class="vb-c dl">doplatit '+kc(d)+'</span>':'';
    var h='<div class="rr-h vb-hl"><span class="rl-x"><input type="checkbox" data-vy="'+r.id+'"'+(VY[r.id]?' checked':'')+' aria-label="Vybrat – '+esc(r.jmeno)+'"></span>'+
      '<div class="vb-j"><div class="vb-r1"><button type="button" class="rl-j" data-id="'+r.id+'">'+esc(r.jmeno)+'</button><small>'+esc(r.cislo||'')+(r.zdroj==='web'?' · web':'')+(os?' · '+os+' '+pl(os,'osoba','osoby','osob'):'')+(r.telefon?' · <a class="rr-t" href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'')+(r.zprava?' · <span title="'+esc(r.zprava)+'">✎ poznámka</span>':'')+'</small></div>'+
      '<div class="vb-r2">'+KR(r.od)+(r.od===r.do?'':' – '+KR(r.do))+rok+' · '+delka(r)+(co.filter(Boolean).length?' · '+esc(co.filter(Boolean).join(', ')):'')+(b?' · <b>blokace</b>':'')+(!al.length&&zn?' '+zn:'')+'</div></div>'+
      '<div class="vb-cena">'+(b?'':'<b>'+kc(ce)+'</b>'+stavCeny)+'</div>'+
      '<span class="rr-bb"><button type="button" class="rr-e rr-z vb-det" data-id="'+r.id+'" title="Otevřít detail rezervace">Detail <i aria-hidden="true">→</i></button></span></div>';
    if(b)return bar+h;
    if(zru)return bar+h+'<div class="vb-g"><div class="vb-k"><span class="vb-p">Zrušená rezervace</span></div></div>';
    var g=[];
    /* platba */
    g.push(sl('Platba',ce?plKarta(r):'bez ceny','',
      ps==='vse'?'':ps==='zal'?'záloha '+kc(zp)+' přijata':ps==='ceka'?'záloha '+kc(p.zaloha)+' do '+KR(p.splatnost):'platí se na místě',
      ps==='ceka'?Bt('data-zp="'+r.id+'" data-zc="zal"','Záloha zaplacena'):ps!=='vse'&&ce?Bt('data-zp="'+r.id+'" data-zc="vse"','Zaplaceno celé'):'',ps==='ceka'&&p.splatnost<dnes,ps==='vse'));
    /* ubytování */
    if(maUby(r)){var st=r.stav,ix={pop:0,pot:1,uby:2,odj:3}[st];
      g.push(sl('Ubytování',esc(co.join(', ')),K('Potvrzeno',ix>=1)+K('Ubytován',ix>=2,st==='pot'&&r.od<dnes)+K('Odjel',ix>=3,st==='uby'&&r.do<dnes),
        st==='pop'?'čeká na potvrzení':st==='pot'?(r.od===dnes?'přijíždí dnes':r.od<dnes?'měl přijet '+KR(r.od):'příjezd '+KR(r.od)):st==='uby'?(r.do===dnes?'odjíždí dnes':r.do<dnes?'měl odjet '+KR(r.do):'do '+KR(r.do)):'odjel '+KR(r.do),
        st==='pop'&&ps!=='ceka'?Bt('data-qs="'+r.id+'" data-st="pot"','Potvrdit'):st==='pot'&&r.od<=dnes?Bt('data-qs="'+r.id+'" data-st="uby"','Ubytovat'):st==='uby'?Bt('data-qs="'+r.id+'" data-st="odj"','Odhlásit'):'',(st==='pot'&&r.od<dnes)||(st==='uby'&&r.do<dnes),st==='odj'))}
    /* lodě */
    if(sLod(r)){var po=(x==='vyd'||x==='cast')&&pd<dnes;
      g.push(sl('Lodě',esc(LK(r)),K('Vydané',x!=='res',x==='res'&&r.lode.den<dnes)+K(x==='cast'?'Vrácená část':'Vrácené',x==='vra',po),
        x==='res'?(r.lode.den===dnes?'výdej dnes':'výdej '+KR(r.lode.den)):x==='vra'?'vše vráceno':(po?'měl vrátit '+KR(pd):pd===dnes?'vrací dnes':'vrátí '+KR(pd)),
        x==='res'&&r.lode.den<=dnes?Bt('data-lv="'+r.id+'"','Vydat lodě'):x==='vyd'||x==='cast'?Bt('data-lr="'+r.id+'"','Vrátit lodě'):'',po,x==='vra'))}
    /* doprava */
    if(r.doprava||r.vyzved){var os2=(r.doprava&&r.doprava.osob)||(r.vyzved&&r.vyzved.osob)||0;
      g.push(sl('Doprava',(r.doprava?'<span class="vb-d"><b>'+esc(r.doprava.cas||'–')+'</b> odvoz '+esc(R.mistoN(r.doprava.misto))+'</span>':'')+(r.vyzved?'<span class="vb-d"><b>'+esc(r.vyzved.cas||'–')+'</b> vyzvednutí '+esc(R.mistoN(r.vyzved.misto))+'</span>':''),'',
        (os2?os2+' '+pl(os2,'osoba','osoby','osob'):'')+(r.doprava&&!r.vyzved?(os2?' · ':'')+'bez vyzvednutí':''),'',false))}
    return bar+h+'<div class="vb-g">'+g.join('')+'</div>'};
  function tabulka(L,gf,nastr,bezRaz){
    if(!L.length)return '<div class="card rl-0"><b>Nic tu není.</b><span class="mut">Zkuste jiné období, zrušit filtry nebo hledat jinak.</span></div>';
    var hl=!gf,akc=!gf&&F.raz==='akce'&&F.obd!=='min';if(akc)gf=function(r){return DRZ[r.id]?DRZ[r.id].g:skupAkce(r)};
    /* řazení přímo nad seznamem */
    var RZ=[['akce','Co je na řadě'],['od','Podle příjezdu'],['nove','Nejnovější'],['jmeno','Podle jména']],razH=hl&&!bezRaz?'<div class="rr-raz" role="group" aria-label="Řadit"><span>Řadit</span>'+RZ.map(function(x){return '<button type="button" data-fr="'+x[0]+'" aria-pressed="'+(F.raz===x[0])+'">'+x[1]+'</button>'}).join('')+'</div>':'';
    var mes='',h='<section class="rr-l">'+(bezRaz?'':'<div class="rr-top"><label class="rr-va"><input type="checkbox" data-va aria-label="Vybrat vše zobrazené"> Vybrat vše</label>'+razH+'<span class="rr-nas">'+(nastr||'')+'</span></div>');
    var sk={};if(gf||F.raz==='od')L.forEach(function(r){var d=D0(r.od),k=gf?gf(r):MES[d.getMonth()]+' '+d.getFullYear();sk[k]=(sk[k]||0)+1});
    L.slice(0,lim).forEach(function(r){var d=D0(r.od),mm=MES[d.getMonth()]+' '+d.getFullYear(),o=r.osoby||{},os=KKC.osobPocet(o),b=r.stav==='blk';
      if(gf)mm=gf(r);if((gf||F.raz==='od')&&mm!==mes){mes=mm;h+='<h3 class="rr-m'+(mm==='Po termínu'?' po':mm==='Dnes'?' dn':mm==='Hotové a zrušené'?' ho':'')+'">'+mm+'<span>'+sk[mm]+'</span></h3>'}
      var ua=akc&&!b?udalost(r):null,zn=b?'':ua?'<em class="rl-z '+(ua[0]<dnes?'po':ua[1]==='pri'||ua[1]==='lv'?'pri':'odj')+'">'+ua[2]+' '+kdyTxt(ua[0])+'</em>':r.od===dnes?'<em class="rl-z pri">Přijíždí dnes</em>':r.do===dnes&&r.stav!=='odj'&&maUby(r)?'<em class="rl-z odj">Odjíždí dnes</em>':'',rok=(gf||F.raz!=='od')?' '+r.do.slice(0,4):'';
      var co=(r.mista||[]).map(function(k){return '<span class="rl-c '+k.split('-')[0]+'">'+R.nazev(k).replace('Podsadový stan','Stan')+'</span>'}).join('')+(r.dalsi&&r.dalsi.stan?'<span class="rl-c">'+r.dalsi.stan+'× vl. stan</span>':'')+(r.dalsi&&r.dalsi.karavan?'<span class="rl-c">'+r.dalsi.karavan+'× karavan</span>':'')+(LK(r)?'<span class="rl-c lod">'+esc(LK(r))+'</span>':'')+(r.doprava?'<span class="rl-c dop">doprava '+esc(R.mistoN(r.doprava.misto))+(r.doprava.cas?' '+esc(r.doprava.cas):'')+'</span>':'')+(r.vyzved?'<span class="rl-c dop">vyzvednutí '+esc(R.mistoN(r.vyzved.misto))+(r.vyzved.cas?' '+esc(r.vyzved.cas):'')+'</span>':'');
      if(VZHLED_B){h+='<article class="rzr vb'+(DRZ[r.id]?' zm'+(Date.now()-DRZ[r.id].t<1500?' zm-n':''):'')+(r.stav==='zru'||r.stav==='odj'&&(!sLod(r)||LS(r)==='vra')?' skr':'')+(b?' blk':'')+(VY[r.id]?' vyb':'')+'">'+kartaB(r,zn,rok,os,b)+'</article>';return}
      h+='<article class="rzr'+(DRZ[r.id]?' zm'+(Date.now()-DRZ[r.id].t<1500?' zm-n':''):'')+(r.stav==='zru'||r.stav==='odj'&&(!sLod(r)||LS(r)==='vra')?' skr':'')+(b?' blk':'')+(VY[r.id]?' vyb':'')+'"><div class="rr-h"><span class="rl-x"><input type="checkbox" data-vy="'+r.id+'"'+(VY[r.id]?' checked':'')+' aria-label="Vybrat – '+esc(r.jmeno)+'"></span>'+
        '<div class="rr-d"><b>'+KR(r.od)+(r.od===r.do?'':' – '+KR(r.do))+rok+'</b><small>'+delka(r)+'</small>'+zn+'</div>'+
        '<div class="rr-j"><button type="button" class="rl-j" data-id="'+r.id+'">'+esc(r.jmeno)+'</button><small>'+esc(r.cislo||'')+(r.zdroj==='web'?' · web':'')+(os?' · '+os+' '+pl(os,'osoba','osoby','osob'):'')+(r.zprava?' · <span title="'+esc(r.zprava)+'">✎ poznámka</span>':'')+'</small>'+(r.telefon?'<a class="rr-t" href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'')+'</div>'+
        '<div class="rr-c">'+(b?'<span class="rl-c">Blokace</span>'+co:co)+'</div>'+
        '<div class="rr-k">'+(b?'':kc(r.cena))+'<span class="rr-bb"><button type="button" class="rr-e rr-z" data-id="'+r.id+'" title="Otevřít detail rezervace">'+SV(IC.oko,17)+'<span>Detail</span><i aria-hidden="true">→</i></button><button type="button" class="rr-e rr-u" data-ue="'+r.id+'" title="Upravit rezervaci" aria-label="Upravit rezervaci – '+esc(r.jmeno)+'">'+SV(IC.obsah,16)+'</button></span></div></div>'+(b?'':stavPruh(r))+'</article>'});
    return h+'<div id="rhb" class="rhb" hidden></div>'+(L.length>lim?'<p class="rl-v"><span class="mut">Zobrazeno '+lim+' z '+L.length+'</span><button type="button" class="btn gh" data-a="vic">Zobrazit dalších '+Math.min(100,L.length-lim)+'</button></p>':'')+'</section>';
  }
  /* „co je na řadě“: nejbližší úkol u rezervace – příjezd, výdej lodí, vrácení lodí, odjezd. Hotové a zrušené nemají žádný. */
  var udalost=function(r){if(r.stav==='zru'||r.stav==='blk')return null;var c=[],x=LS(r);
    if((r.stav==='pop'||r.stav==='pot')&&maUby(r))c.push([r.od,'pri','Přijíždí']);
    if(r.stav==='uby')c.push([r.do,'odj','Odjíždí']);
    if(x==='res')c.push([r.lode.den,'lv','Vydat lodě']);
    if(x==='vyd'||x==='cast')c.push([posD(r),'lr','Vrací lodě']);
    if(!c.length)return null;c.sort(function(a,b){return a[0]<b[0]?-1:a[0]>b[0]?1:0});return c[0]};
  var kdyTxt=function(d){var z=ISO(ADD(D0(dnes),1));return d<dnes?'– po termínu':d===dnes?'dnes':d===z?'zítra':DNY[D0(d).getDay()].toLowerCase()+' '+KR(d)};
  var skupAkce=function(r){var u=udalost(r);if(!u)return 'Hotové a zrušené';var d=u[0],z=ISO(ADD(D0(dnes),1)),dn=D0(dnes).getDay(),ne=ISO(ADD(D0(dnes),dn?7-dn:0)),pne=ISO(ADD(D0(ne),7));
    if(d<dnes)return 'Po termínu';if(d===dnes)return 'Dnes';if(d===z)return 'Zítra';if(d<=ne)return 'Tento týden';if(d<=pne)return 'Příští týden';var x=D0(d);return MES[x.getMonth()]+' '+x.getFullYear()};
  var radit=function(L){var k=F.raz;if(k==='akce'&&F.obd==='min')return L.sort(function(a,b){return a.od<b.od?1:a.od>b.od?-1:0});
    if(k==='akce'){var E={};L.forEach(function(r){E[r.id]=DRZ[r.id]?DRZ[r.id].u:udalost(r)});return L.sort(function(a,b){var x=E[a.id],y=E[b.id],dx=x?x[0]:'9999',dy=y?y[0]:'9999';if(dx!==dy)return dx<dy?-1:1;
      /* v rámci dne podle průběhu dne: odjezdy, výdej lodí, příjezdy, vracení lodí */
      var RK={odj:0,lv:1,pri:2,lr:3},rx=x?RK[x[1]]:9,ry=y?RK[y[1]]:9;if(rx!==ry)return rx-ry;
      var tx=(a.doprava&&a.doprava.cas)||'99',ty=(b.doprava&&b.doprava.cas)||'99';if(tx!==ty)return tx.localeCompare(ty,'cs',{numeric:true});return bez(a.jmeno).localeCompare(bez(b.jmeno))})}
    return L.sort(function(a,b){if(k==='nove')return (b.vytvoreno||0)-(a.vytvoreno||0);if(k==='jmeno')return bez(a.jmeno).localeCompare(bez(b.jmeno));return a.od<b.od?-1:a.od>b.od?1:(a.jmeno<b.jmeno?-1:1)})};
  function sez(A){
    var tyd=ISO(ADD(D0(dnes),7));
    var L=A.filter(function(r){var o=F.obd;
      if(o==='bud'&&!(r.do>=dnes)&&!(udalost(r)&&udalost(r)[0]<dnes))return false;/* nedořešené po termínu (nevrácené lodě, neodhlášený host) zůstávají vidět */if(o==='ted'&&!(r.od<=dnes&&dnes<r.do))return false;if(o==='pri'&&r.od!==dnes)return false;if(o==='odj'&&r.do!==dnes)return false;
      if(o==='tyd'&&!(r.od>=dnes&&r.od<tyd))return false;if(o==='min'&&!(r.do<dnes))return false;
      if(F.od&&r.do<F.od)return false;if(F.do&&r.od>F.do)return false;
      if(F.zdroj&&(r.zdroj||'rucne')!==F.zdroj)return false;return true});
    A.forEach(function(r){if(DRZ[r.id]&&L.indexOf(r)<0)L.push(r)});
    var TC={};L.forEach(function(r){var t=typy(r);Object.keys(t).forEach(function(k){TC[k]=(TC[k]||0)+1})});TC['']=L.length;
    if(F.typ)L=L.filter(function(r){return DRZ[r.id]||typy(r)[F.typ]});
    /* rychlé filtry podle toho, co je s rezervací potřeba udělat: platba (zálohy) a průběh (potvrzení, ubytování, lodě) */
    var zr=function(r){return r.stav==='zru'||r.stav==='blk'},pls=function(r){return r.platba?r.platba.stav:''};
    var SF=[['Platba',[['zc','Čeká na zálohu','pop',function(r){return !zr(r)&&pls(r)==='ceka'}],['zz','Záloha zaplacena','pot',function(r){return !zr(r)&&pls(r)==='zal'}],['zv','Zaplaceno celé','uby',function(r){return !zr(r)&&pls(r)==='vse'}],['zm','Platí na místě','odj',function(r){return !zr(r)&&!r.platba}]]],
      ['Průběh',[['pop','Čeká na potvrzení','pop',function(r){return r.stav==='pop'&&pls(r)!=='ceka'}],['pot','Potvrzené','pot',function(r){return r.stav==='pot'}],['uby','Ubytovaní','uby',function(r){return r.stav==='uby'}],
        ['odj','Dokončené','odj',function(r){return r.stav==='odj'}],['zru','Zrušené','zru',function(r){return r.stav==='zru'}],['blk','Blokace','blk',function(r){return r.stav==='blk'}]]],
      ['Lodě',[['lr','Lodě k výdeji','pop',function(r){return !zr(r)&&LS(r)==='res'}],['lv','Lodě na vodě','pot',function(r){var x=LS(r);return !zr(r)&&(x==='vyd'||x==='cast')}],['lx','Lodě vrácené','odj',function(r){return !zr(r)&&LS(r)==='vra'}]]]];
    SF[1][0]='Pobyt';
    var lkon=function(r){return ISO(ADD(D0(r.lode.den),Math.max(1,r.lode.dni||1)-1))};
    var poc={},SFm={};SF.forEach(function(g){g[1].forEach(function(x){SFm[x[0]]=x;poc[x[0]]=L.filter(x[3]).length})});var vse=L.length;
    /* úkoly – co je potřeba udělat: velké dlaždice s počtem a krátkou nápovědou */
    var poSpl=L.filter(function(r){return SFm.zc[3](r)&&r.platba.splatnost&&r.platba.splatnost<dnes}).length,
      lrD=L.filter(function(r){return SFm.lr[3](r)&&r.lode.den<=dnes}).length,
      lvD=L.filter(function(r){return SFm.lv[3](r)&&lkon(r)<=dnes}).length;
    var UK=[['zc','Čeká na zálohu',poSpl?poSpl+' po splatnosti':'zkontrolujte platby','w',poSpl],['zz','Záloha zaplacena','zbývá doplatit na místě','g',0,'zatím žádná'],
      ['lr','Lodě k výdeji',lrD?lrD+' vydat dnes':'nic dnes','b',lrD],['lv','Lodě na vodě',lvD?lvD+' vrátit dnes':'žádné vrácení dnes','b',lvD]];
    if(F.stav&&!SFm[F.stav])F.stav='';
    if(F.stav)L=L.filter(function(r){return DRZ[r.id]||SFm[F.stav][3](r)});radit(L);
    posl=L;
    var sel=function(f,l,O){return '<label class="rl-f"><span>'+l+'</span><select class="inp" data-f="'+f+'">'+O.map(function(o){return '<option value="'+o[0]+'"'+(F[f]===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></label>'};
    var zmeneno=Object.keys(F0).some(function(k){return F[k]!==F0[k]});
    var noc=0,kcs=0,osb=0;L.forEach(function(r){if(r.stav==='blk')return;noc+=noci(r);kcs+=+r.cena||0;var o=r.osoby||{};osb+=KKC.osobPocet(o)});
    var OB=[['bud','Aktuální a budoucí'],['pri','Přijíždí dnes'],['odj','Odjíždí dnes'],['ted','Právě ubytovaní'],['tyd','Příštích 7 dní'],['min','Minulé'],['','Vše']];
    var SUB=[['chatka','Chatky'],['podsad','Podsadové stany'],['teepee','Teepee'],['vlastni','Vlastní stany a karavany']],jeSub=SUB.some(function(x){return x[0]===F.typ}),nF=(F.zdroj?1:0)+(F.od||F.do?1:0);
    var IKT={'':'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',ubyt:'<path d="M3 11 12 4l9 7M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',skup:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.2 3.2 0 0 1 0 6.2M21 20c0-2.8-1.7-5.1-4-5.8"/>',lode:'<path d="M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2-1.5 4.5-1.5S19 17 21 17"/><path d="M5 13h14l-2-5H7z"/>',doprava:'<path d="M3 16V7a2 2 0 0 1 2-2h11l4 5v6"/><path d="M3 16h18"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>'};
    /* jedna lišta: vlevo co zobrazit, vpravo období, stav a další filtry */
    var TI={'':'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
      chatka:'<path d="M3 11 12 4l9 7M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',podsad:'<path d="M2 20h20M4 20 12 5l8 15"/><path d="M12 5v15M9 20l3-5 3 5"/>',
      teepee:'<path d="M12 3 5 21M12 3l7 18M10 7 8 3M14 7l2-4M4 21h16"/><path d="M10.5 21 12 16l1.5 5"/>',vlastni:'<rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 11h3l2 3v3h-5"/><circle cx="7" cy="18" r="1.8"/><path d="M5 11h4"/>',
      skup:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.2 3.2 0 0 1 0 6.2M21 20c0-2.8-1.7-5.1-4-5.8"/>',lode:'<path d="M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2-1.5 4.5-1.5S19 17 21 17"/><path d="M5 13h14l-2-5H7z"/>',doprava:'<path d="M3 16V7a2 2 0 0 1 2-2h11l4 5v6"/><path d="M3 16h18"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>'};
    var TB=[['','Vše','vse'],['chatka','Chatky','ubyt'],['podsad','Podsadové stany','ubyt'],['teepee','Teepee','ubyt'],['vlastni','Vlastní stan, karavan','ubyt'],['skup','Skupiny','skup'],['lode','Lodě','lode'],['doprava','Doprava','doprava']];
    var RZ=[['akce','Co je na řadě'],['od','Podle příjezdu'],['nove','Nejnovější'],['jmeno','Podle jména']];
    var opt=function(O,v){return O.map(function(o){return '<option value="'+o[0]+'"'+(v===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')};
    var ukol=UK.filter(function(u){return poc[u[0]]});
    /* varianta B: záložky skupin + jedna tenká lišta nástrojů, úkoly jako pruh, pod tím seznam */
    return ''+
      '<div class="rtk" role="group" aria-label="Co je potřeba udělat">'+UK.map(function(u){var n=poc[u[0]],on=F.stav===u[0];
        return '<button type="button" class="rtk-t '+u[3]+(n?'':' nic')+(on?' on':'')+(u[4]?' hot':'')+'" data-fs="'+(on?'':u[0])+'" aria-pressed="'+on+'"><b>'+n+'</b><span>'+u[1]+'</span><small>'+(n?u[2]:u[5]||'vše hotovo')+'</small></button>'}).join('')+'</div>'+
      '<section class="rlb">'+
      '<div class="rzt" role="tablist" aria-label="Skupiny rezervací">'+TB.map(function(x){var n=TC[x[0]]||0,on=F.typ===x[0]||!x[0]&&!F.typ;return '<button type="button" role="tab" class="'+x[2]+(n?'':' nic')+'" data-ft="'+x[0]+'" aria-selected="'+on+'"'+(x[0]==='skup'?' title="Rezervace od '+SKUP_OS+' osob nebo na 3 a více míst"':'')+'><i class="rzt-i t-'+(x[0]||'vse')+'">'+SV(TI[x[0]],16)+'</i>'+x[1]+'<small>'+n+'</small></button>'}).join('')+'</div>'+
      '<div class="rlb-f">'+(L.length?'<label class="rlb-va" title="Vybrat všechny zobrazené rezervace"><input type="checkbox" data-va aria-label="Vybrat vše zobrazené"><span>Vybrat vše</span></label>':'')+
        '<select class="inp'+(F.obd!=='bud'?' on':'')+'" data-f="obd" aria-label="Období">'+opt(OB,F.obd)+'</select>'+
        '<select class="inp rl-ss'+(F.stav?' on':'')+'" data-f="stav" aria-label="Stav"><option value="">Všechny stavy</option>'+SF.map(function(g){return '<optgroup label="'+g[0]+'">'+g[1].map(function(x){return '<option value="'+x[0]+'"'+(F.stav===x[0]?' selected':'')+(poc[x[0]]||F.stav===x[0]?'':' disabled')+'>'+x[1]+' ('+poc[x[0]]+')</option>'}).join('')+'</optgroup>'}).join('')+'</select>'+
        '<label class="rlb-r"><span>Řadit</span><select class="inp" data-f="raz" aria-label="Řadit">'+opt(RZ,F.raz)+'</select></label>'+
        '<button type="button" class="btn sm gh rlb-fb'+(vicF||nF?' on':'')+'" data-a="vicf" aria-expanded="'+!!(vicF||nF)+'">'+SV('<path d="M4 6h16M7 12h10M10 18h4"/>',16)+'Další filtry'+(nF?' <b>'+nF+'</b>':'')+'</button>'+
        (zmeneno?'<button type="button" class="btn sm gh rl-x" data-a="frst">Zrušit vše</button>':'')+
        '<span class="rlb-sp"></span>'+
        (L.length?'<span class="rlb-ex"><button type="button" class="btn sm gh ic2" data-a="csv" title="Stáhnout do Excelu">'+SV('<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',16)+'<span>Excel</span></button>'+tiskBtn('Tisk')+'</span>':'')+
      '</div>'+
      (vicF||nF?'<div class="rlb-p">'+sel('zdroj','Zdroj',[['','Web i obsluha'],['web','Z webu'],['rucne','Zadala obsluha']])+
        '<label class="rl-f"><span>Pobyt od</span><input type="date" class="inp" data-f="od" value="'+F.od+'"></label><label class="rl-f"><span>do</span><input type="date" class="inp" data-f="do" value="'+F.do+'"></label></div>':'')+
      '</section>'+
      tabulka(L,null,'',1);
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
    var ub=(window.KKC?KKC.kat('ubytovani'):[]).filter(function(p){return p.skryt!==1}),vy=R.vyp(),dis=adm||KK.auth.muze('rez_nastaveni')?'':' disabled';
    var NT=[['rez','Rezervování'],['pujc','Půjčovna a zálohy'],['mista','Místa a blokace'],['mail','E-maily']].concat(window.KKR&&KK.auth.muze('uzivatele')?[['szn','Uzavření sezóny']]:[]).concat(adm?[['data','Testovací data']]:[]);if(!NT.some(function(x){return x[0]===nT}))nT='rez';
    var h='<div class="rnt-tabs" role="tablist" aria-label="Části nastavení">'+NT.map(function(x){return '<button type="button" role="tab" data-nt="'+x[0]+'" aria-selected="'+(x[0]===nT)+'">'+x[1]+'</button>'}).join('')+'</div>';
    if(nT==='szn'){h+='<div id="szn"></div>';setTimeout(function(){var b=document.getElementById('szn');if(b&&!b.childNodes.length)sezona(b)},0)}
    if(nT==='rez'){var SP=n.spravce||{};h+='<section class="card"><h2>Kontakt na správce</h2><p class="mut" style="margin:0 0 12px">Telefon se ukáže obsluze v aplikaci dole v menu – aby věděla, komu zavolat, když si neví rady.</p><div class="row" style="gap:12px;flex-wrap:wrap"><label class="sb-l" style="flex:1 1 200px">Jméno<input class="inp" id="spjm" placeholder="např. Petr" value="'+esc(SP.jmeno||'')+'"'+dis+'></label><label class="sb-l" style="flex:1 1 200px">Telefon<input class="inp" type="tel" id="sptel" placeholder="+420 777 123 456" value="'+esc(SP.tel||'')+'"'+dis+'></label></div></section>';var VD=n.voda||{};h+='<section class="card"><h2>Stav vody na Vltavě</h2><p class="mut" style="margin:0 0 12px">Průtok ve Vyšším Brodě a Českém Krumlově podle ČHMÚ (naostro se aktualizuje každou hodinu). Barva semaforu se řídí hranicemi níže.</p><div class="sw-l"><label class="sw"><input type="checkbox" data-vd="web"'+(VD.web!==0?' checked':'')+dis+'><span aria-hidden="true"></span>Ukazovat na webu</label></div><div class="sw-l" style="margin-bottom:14px"><label class="sw"><input type="checkbox" data-vd="app"'+(VD.app!==0?' checked':'')+dis+'><span aria-hidden="true"></span>Ukazovat v aplikaci obsluhy</label></div><div class="row" style="gap:12px;flex-wrap:wrap"><label class="sb-l" style="flex:1 1 160px">Nízký stav pod (m³/s)<input class="inp" type="number" min="0" step="0.5" data-vd="nizky" value="'+(VD.nizky||5)+'"'+dis+'></label><label class="sb-l" style="flex:1 1 160px">Zvýšený stav od (m³/s)<input class="inp" type="number" min="0" step="1" data-vd="vysoky" value="'+(VD.vysoky||30)+'"'+dis+'></label><label class="sb-l" style="flex:1 1 160px">Nesjízdné od (m³/s)<input class="inp" type="number" min="0" step="1" data-vd="nebezp" value="'+(VD.nebezp||60)+'"'+dis+'></label></div><p class="mut" style="margin:10px 0 0;font-size:13px">🟡 pod první hranicí · 🟢 mezi · 🟠 zvýšený · 🔴 nesjízdné. Pod Lipnem je zaručený minimální odtok asi 6 m³/s.</p></section>'}
    if(nT==='rez'){
      var POP={bez:['Bez rezervace','Host jen přijede, na webu se nenabízí k rezervaci.'],poptavka:['Záloha','Host pošle rezervaci, místo se podrží do zaplacení zálohy a potvrzujete vy.'],ihned:['Ihned','Rezervace platí hned po odeslání, nic nepotvrzujete.']};
      return h+'<section class="card rjr"><h2>Jak se rezervuje</h2><p class="mut" style="margin:0 0 4px">U každého typu ubytování vyberte jednu možnost. Platí pro nové rezervace z webu.</p>'+
        '<ul class="rjr-l">'+ub.map(function(p){var ma=!!n.rezim[p.k],v=p.rez===0?'bez':ma?n.rezim[p.k]:'poptavka',V=ma?['bez','poptavka','ihned']:['bez','poptavka'];
          return '<li><div><b>'+esc(p.n)+'</b><small>'+POP[v][1]+'</small></div><div class="rjr-s" role="radiogroup" aria-label="'+esc(p.n)+'">'+V.map(function(x){return '<button type="button" role="radio" class="'+x+'" aria-checked="'+(x===v)+'" data-rz="'+p.k+'" data-rv="'+x+'"'+dis+'>'+POP[x][0]+'</button>'}).join('')+'</div></li>'}).join('')+'</ul>'+
        '<dl class="rjr-v"><div><dt>Bez rezervace</dt><dd>Na webu se napíše „stačí přijet“, obsazenost se nehlídá.</dd></div><div><dt class="poptavka">Záloha</dt><dd>Přijde jako rezervace čekající na zálohu. Potvrdíte ji, nebo zrušíte.</dd></div><div><dt class="ihned">Ihned</dt><dd>Vznikne rovnou rezervace a místo je obsazené.</dd></div></dl>'+
        '<p class="mut" style="font-size:13.5px;margin:12px 0 0">Když si host vybere víc typů najednou a aspoň u jednoho je Záloha, přijde celá rezervace jako čekající na zálohu.</p>'+(adm?'':'<p class="mut">Změnit to smí jen správce.</p>')+'</section>'}
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
        '<h3 style="margin:18px 0 8px;font-size:15px">Vybavení celkem</h3><div class="rsk-v">'+Object.keys(R.VYB).map(function(k){var malo=S.vyb[k]<pot[k];return '<label class="rzl-f"><span>'+R.VYB[k]+'</span>'+ni('vyb.'+k,S.vyb[k],R.VYB[k]+' celkem')+'<small class="'+(malo?'zle':'')+'">na všechny lodě je potřeba '+pot[k]+'</small></label>'}).join('')+'</div>'+(adm?'':'<p class="mut">Změnit to smí jen správce.</p>')+'</section>'+'<section class="card rpo" style="margin-top:16px"><h2>Poškozené a ztracené</h2><p class="mut" style="margin:0 0 12px">Hlásí obsluha v aplikaci (Lodě → ⚠ u rezervace nebo tlačítko Poškození). Nahlášené kusy se odečítají ze skladu, takže je systém nenabídne k půjčení. Až to bude zase v pořádku, klikněte na „Opraveno“ (u ztracených „Nalezeno“).</p>'+
        (function(){var P=R.poskozene();return P.length?'<ul class="rpo-l">'+P.map(function(x){return '<li class="'+(x.typ==='ztraceno'?'zt':'')+'"><span class="rpo-n"><b>'+R.poskozTyp(x)+': '+x.ks+'× '+esc(R.poskozNazev(x.k))+'</b>'+(x.popis?'<small>'+esc(x.popis)+'</small>':'')+(x.rez?'<small>Rezervace: <button type="button" class="lnk" data-po-rz="'+x.rez+'">'+esc(x.jmeno||'')+(x.cislo?' · '+esc(x.cislo):'')+'</button></small>':'')+'<small class="mut">'+cas(x.kdy)+(x.kdo?' · nahlásil '+esc(x.kdo):'')+'</small></span><button type="button" class="btn sm" data-po-ok="'+x.id+'">'+SV('<path d="m5 12.5 4.5 4.5L19 7.5"/>',16)+(x.typ==='ztraceno'?'Nalezeno':'Opraveno')+'</button></li>'}).join('')+'</ul>':'<p class="mut" style="margin:0">Nic poškozeného ani ztraceného.</p>'})()+
        '</section>'}
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
        '<div class="sb-2"><label class="sb-l sb-em">E-mail kempu pro upozornění<input class="inp" type="email" id="sbem" placeholder="např. info@kemp-krumlov.cz" value="'+esc(n.emailKemp||'')+'"'+dis+'></label><label class="sb-l sb-em">Odkaz na hodnocení na Googlu<input class="inp" type="url" id="sbrc" placeholder="https://g.page/r/…/review" value="'+esc(n.recenzeUrl||'')+'"'+dis+'><small class="mut">Najdete ho v Google Firmě → Požádat o recenze.</small></label></div>'+
        '<div class="sb-ty" role="tablist" aria-label="Druh e-mailu">'+R.SABL_TYPY.map(function(x){return '<button type="button" role="tab" data-sb="'+x.k+'" aria-selected="'+(x.k===sbT)+'"><b>'+esc(x.n)+'</b><small>'+(x.kdo==='kemp'?'pro kemp':x.auto?'automaticky · pro hosta':'pro hosta')+'</small></button>'}).join('')+'</div>'+
        '<div id="sbed">'+sbHtml()+'</div></section>';
    if(nT!=='data')return h;
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
    var rows=[['Číslo','Příjezd','Odjezd','Nocí','Jméno','Telefon','E-mail','Místa','Osob','Složení','Cena','Stav','Zdroj','Poznámka','Lodě','Trasa','Doprava osob','Záloha','Platba']].concat(L.map(function(r){var o=r.osoby||{};return [r.cislo||'',r.od,r.do,noci(r),r.jmeno,r.telefon||'',r.email||'',mistaTxt(r),KKC.osobPocet(o),KKC.osobyTxt(o),r.stav==='blk'?'':r.cena||0,R.STAVY[r.stav],r.zdroj==='web'?'web':'obsluha',r.zprava||'',LK(r),r.lode&&LK(r)?R.mistoN(r.lode.odkud)+' → '+R.mistoN(r.lode.kam):'',R.dopravaVseTxt(r),r.platba?r.platba.zaloha:'',r.platba?R.PLATBA[r.platba.stav]:'']}));
    var blob=new Blob(['\ufeff'+rows.map(function(x){return x.map(Q).join(';')}).join('\r\n')],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(blob),ln=document.createElement('a');ln.href=u;ln.download='rezervace-'+(nazev?nazev+'-':'')+dnes+'.csv';document.body.appendChild(ln);ln.click();ln.remove();setTimeout(function(){URL.revokeObjectURL(u)},1000)}
  /* jedna volba na typ: bez rezervace (ceník rez:0) / poptávka / ihned (nast.rezim) */
  function rezimTyp(k,v){var on=v!=='bez',p0=KKC.p(k)||{},byl=p0.rez!==0,hot=function(){if(on&&R.nast().rezim[k]){var n=R.nast();n.rezim[k]=v;R.ulozNast(n)}KK.zaznam('Rezervace',(p0.n||k)+': '+(v==='bez'?'bez rezervace':v==='ihned'?'okamžitá rezervace':'poptávka'));kresli();toast(v==='bez'?'Uloženo – na webu bude „stačí přijet“.':'Uloženo – platí pro nové rezervace z webu.')};
    if(on===byl){hot();return}
    KK.cenik.nacti().then(function(c){c=c||JSON.parse(JSON.stringify(KKC.vychozi));var p=(c.polozky||[]).filter(function(x){return x.k===k})[0];if(!p){p=JSON.parse(JSON.stringify(KKC.p(k)));c.polozky.push(p)}p.rez=on?1:0;return KK.cenik.uloz(c)}).then(function(){var p=KKC.p(k);if(p)p.rez=on?1:0;hot()}).catch(function(x){toast(x.message,1)})}
  /* tisk přehledu zvoleného dne: příjezdy, odjezdy + úklid, kdo zůstává */
  /* tisk podle části: Ubytování (příjezdy, odjezdy, úklid), Půjčovna (komu co vydat), Doprava (jízdy, návoz, svoz), Seznam (to, co je vyfiltrované) */
  function tisk(co){co=co||(tab==='lod'||tab==='lodd'?'lod':tab==='dop'?'dop':tab==='sez'&&!q?'sez':'uby');
    var vse=R.vse().filter(function(r){return r.stav!=='zru'&&r.stav!=='blk'}),x=denP,d=D0(x),DL=['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'],den=DL[d.getDay()]+' '+d.getDate()+'. '+(d.getMonth()+1)+'. '+d.getFullYear();
    var os=function(r){return KKC.osobyTxt(r.osoby,1)};
    /* poznámka hosta se tiskne na samostatný řádek pod rezervaci, ne do sloupce */
    var TB=function(L,sl,raz){var pz=sl.some(function(c){return c[0]==='Poznámka'});sl=sl.filter(function(c){return c[0]!=='Poznámka'});return L.length?'<table><thead><tr><th style="width:26px"></th>'+sl.map(function(c){return '<th>'+c[0]+'</th>'}).join('')+'</tr></thead><tbody>'+(raz?L.slice().sort(raz):L).map(function(r){var n=pz&&r.zprava&&String(r.zprava).trim();return '<tr'+(n?' class="tk-mp"':'')+'><td><span class="tk-ch"></span></td>'+sl.map(function(c){return '<td>'+c[1](r)+'</td>'}).join('')+'</tr>'+(n?'<tr class="tk-pz"><td></td><td colspan="'+sl.length+'"><b>Poznámka:</b> '+esc(n).replace(/\n/g,' · ')+'</td></tr>':'')}).join('')+'</tbody></table>':'<p class="tk-nic">Nic.</p>'};
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
    else if(co==='ubyt'){
      /* kdo v kempu spí tu noc: po místech, s osobami, termínem, telefonem a doplatkem; volná místa na konci */
      var nc=vse.filter(function(r){return !JL(r)&&r.od<=x&&x<r.do}),wq=function(r){var m=(r.mista||[])[0];return m?({chatka:0,podsad:1,teepee:2}[m.split('-')[0]]||0):3},rz=function(a,b){return wq(a)-wq(b)||kratM(a).localeCompare(kratM(b),'cs',{numeric:true})},sumO=0;nc.forEach(function(r){sumO+=KKC.osobPocet(r.osoby)});
      var obs={};nc.forEach(function(r){(r.mista||[]).forEach(function(m){obs[m]=1})});var vol=[];skupiny().forEach(function(g){g.c.forEach(function(c){var k=g.k+'-'+c;if(!obs[k]&&R.vyp().indexOf(k)<0)vol.push(R.nazev(k).replace('Podsadový stan','Stan'))})});
      h='<h1>Kdo je ubytován · noc '+den+' → '+KR(ISO(ADD(D0(x),1)))+'</h1><p class="tk-sum"><span>Rezervací: <b>'+nc.length+'</b></span><span>Hostů: <b>'+sumO+'</b></span><span>Volných míst: <b>'+vol.length+'</b></span></p>'+
        TB(nc,[['Místo',function(r){return '<b>'+esc(kratM(r))+'</b>'}],['Host',function(r){return '<b>'+esc(r.jmeno)+'</b>'}],O,['Termín',function(r){return KR(r.od)+' – '+KR(r.do)+(r.od===x?' <small>(přijede)</small>':r.do===ISO(ADD(D0(x),1))?' <small>(zítra odjede)</small>':'')}],['Stav',function(r){return r.stav==='uby'?'ubytován':r.stav==='odj'?'odjel':'čeká na příjezd'}],T,PL,PZ],rz)+
        '<h2>Volná místa ('+vol.length+')</h2>'+(vol.length?'<p class="tk-ukl">'+vol.map(function(u){return '<span>'+esc(u)+'</span>'}).join('')+'</p>':'<p class="tk-nic">Plno.</p>')}
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
      var Y=denLode(vse,x),ST=stopy(Y),SZ=svozy(Y),VZ3=vyzStopy(Y),oc=0,ac=0;ST.forEach(function(z){oc+=z.osob;ac+=z.aut});
      h='<h1>Doprava · '+den+'</h1>'+(ST.length?'<p class="tk-sum"><span>Osob na start: <b>'+oc+'</b></span><span>Aut: <b>'+ac+'</b></span></p>':'')+
        '<h2>Rozvoz na start ('+ST.length+' '+pl(ST.length,'zastávka','zastávky','zastávek')+')</h2>'+(ST.length?'<table><thead><tr><th style="width:26px"></th><th>Odjezd</th><th>Místo</th><th>Lidé</th><th>Lodě</th><th>Vybavení</th></tr></thead><tbody>'+ST.map(function(z){
          return '<tr><td><span class="tk-ch"></span></td><td><b>'+esc(z.cas||'–')+'</b></td><td><b>'+esc(R.mistoN(z.misto))+'</b></td><td>'+(z.lidi.length?'<b>'+z.osob+' os. · '+z.aut+' '+pl(z.aut,'auto','auta','aut')+'</b><br>'+z.lidi.map(function(r){return esc(r.jmeno)+' ('+(r.doprava.osob||0)+(r.telefon?', '+esc(r.telefon):'')+')'}).join('<br>'):'–')+'</td><td><b>'+(esc(kusyTxt(lodK(z.kusy)))||'–')+'</b></td><td>'+(esc(R.lodeKusyTxt(vybK(z.kusy)))||'–')+'</td></tr>'}).join('')+'</tbody></table>':'<p class="tk-nic">Nic.</p>')+
        '<h2>Vyzvednutí v cíli ('+VZ3.length+')</h2>'+(VZ3.length?'<table><thead><tr><th style="width:26px"></th><th>Čas</th><th>Místo</th><th>Lidé</th></tr></thead><tbody>'+VZ3.map(function(z){
          return '<tr><td><span class="tk-ch"></span></td><td><b>'+esc(z.cas||'–')+'</b></td><td><b>'+esc(R.mistoN(z.misto))+'</b> → kemp</td><td><b>'+z.osob+' os. · '+z.aut+' '+pl(z.aut,'auto','auta','aut')+'</b><br>'+z.L.map(function(r){return esc(r.jmeno)+' ('+(r.vyzved.osob||0)+(r.telefon?', '+esc(r.telefon):'')+')'}).join('<br>')+'</td></tr>'}).join('')+'</tbody></table>':'<p class="tk-nic">Nic.</p>')+
        '<h2>Svoz lodí z cíle ('+SZ.length+')</h2>'+(SZ.length?'<table><thead><tr><th style="width:26px"></th><th>Místo</th><th>Lodě</th><th>Vybavení</th><th>Hosté</th></tr></thead><tbody>'+SZ.map(function(z){
          return '<tr><td><span class="tk-ch"></span></td><td><b>'+esc(R.mistoN(z.misto))+'</b></td><td><b>'+esc(kusyTxt(lodK(z.kusy)))+'</b></td><td>'+esc(R.lodeKusyTxt(vybK(z.kusy)))+'</td><td>'+z.L.map(function(r){return esc(r.jmeno)+(r.telefon?' ('+esc(r.telefon)+')':'')}).join('<br>')+'</td></tr>'}).join('')+'</tbody></table>':'<p class="tk-nic">Nic.</p>')}
    else{
      h='<h1>Rezervace – seznam ('+posl.length+')</h1>'+TB(posl.filter(function(r){return r.stav!=='blk'}),[['Termín',function(r){return KR(r.od)+' – '+KR(r.do)+' '+r.do.slice(0,4)}],J,T,['Ubytování',function(r){return JL(r)?'–':esc(kratM(r))}],['Lodě',function(r){return esc(LK(r))||'–'}],['Doprava',function(r){var a=[];if(r.doprava)a.push(esc(R.mistoN(r.doprava.misto))+' '+esc(r.doprava.cas||''));if(r.vyzved)a.push('vyzv. '+esc(R.mistoN(r.vyzved.misto))+' '+esc(r.vyzved.cas||''));return a.join('<br>')||'–'}],O,['Cena',function(r){return kc(r.cena)}],['Stav',function(r){return R.STAVY[r.stav]+(r.platba&&r.stav!=='zru'?' · '+R.PLATBA[r.platba.stav].toLowerCase():'')}],PZ])}
    var e=$('#tisk')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'tisk'}));
    e.innerHTML=h+'<p class="tk-pat">Kemp Krumlov · vytištěno '+cas(Date.now())+'</p>';
    window.print()}
  function detail(id){
    var r=najdi(id);if(!r)return;var b=r.stav==='blk',ak=JL(r)&&(r.stav==='pot'||r.stav==='uby')?null:AKCE[r.stav],o=r.osoby||{},deti=(o.dite||0)+(o.zak||0),n=noci(r),byl=dd.hidden;
    var hist=[{t:r.vytvoreno,co:b?'Blokace vytvořena':(r.zdroj==='web'?'Vytvořeno z webu'+(r.jazyk&&r.jazyk!=='cs'?' ('+r.jazyk.toUpperCase()+')':''):'Zadala obsluha'),kdo:r.zdroj==='web'?'':r.kdo}].concat(r.hist||[]);
    /* ---- detail: hlavička → to hlavní (termín, místo, osoby, kontakt) → poznámka → co je na řadě → Platba | Lodě | Doprava → historie.
       Každý údaj je v detailu jen jednou; stav je nahoře, vratné kroky dole u Upravit. ---- */
    var IK={pl:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',ub:'<path d="M3 11 12 4l9 7M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',lo:'<path d="M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2-1.5 4.5-1.5S19 17 21 17"/><path d="M5 13h14l-2-5H7z"/>',
      dp:'<path d="M3 16V7a2 2 0 0 1 2-2h11l4 5v6"/><path d="M3 16h18"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',ko:'<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',po:'<path d="M5 4h14v12H9l-4 4z"/>',
      tel:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',tu:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',
      ka:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',os:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 14.3c2 .8 3.5 2.9 3.5 5.7"/>'};
    var kv=function(L){return '<dl class="rdx-kv">'+L.filter(Boolean).map(function(x){return '<dt>'+x[0]+'</dt><dd>'+x[1]+(x[2]?'<small>'+x[2]+'</small>':'')+'</dd>'}).join('')+'</dl>'};
    var blk=function(cls,ik,nad,stav,obsah){return '<section class="rdx-b '+cls+'"><header><span class="rdx-i">'+SV(IK[ik],16)+'</span><h3>'+nad+'</h3>'+(stav||'')+'</header>'+obsah+'</section>'};
    var fakt=function(ik,nad,txt,pod){return '<li><span class="rdn-i" title="'+nad+'">'+SV(IK[ik],16)+'</span><div><span class="sr">'+nad+': </span><b>'+txt+'</b>'+(pod?'<small>'+pod+'</small>':'')+'</div></li>'};
    var cL=r.lode?R.cenaLodi(r.lode).celkem:0,cD=(r.doprava?R.cenaDopravy(r.doprava):0)+(r.vyzved?R.cenaDopravy(r.vyzved):0),cU=Math.max(0,(+r.cena||0)-cL-cD),vz=r.vytvoreno?cas(r.vytvoreno).replace(/ \d+:\d+$/,''):'';
    var h='<div class="rp-h rdx-h"><div><small>'+(b?'Blokace místa':'Rezervace <b>'+esc(r.cislo||'')+'</b>'+(r.zdroj==='web'?' · z webu'+(r.jazyk&&r.jazyk!=='cs'?' ('+r.jazyk.toUpperCase()+')':''):' · zadala obsluha')+(vz?' · '+vz:''))+'</small><h2 id="rdt" tabindex="-1">'+esc(r.jmeno)+'</h2><div class="rdx-st">'+bdg(r.stav)+pbdg(r)+'</div></div><button type="button" class="rp-x" data-e="zav" aria-label="Zavřít detail">'+SV('<path d="M6 6l12 12M18 6L6 18"/>',18)+'</button></div>';
    /* propojené rezervace (pobyt rozdělený na noc před / noc po) – proklik */
    var SP=R.vse().filter(function(x){return x.id!==r.id&&(x.id===r.spoj||x.spoj===r.id||(r.spoj&&x.spoj===r.spoj))});
    if(SP.length)h+='<div class="rdx-sp"><span>Propojený pobyt:</span>'+SP.map(function(x){return '<button type="button" data-sp="'+x.id+'">'+esc(x.cislo||'')+' · '+KR(x.od)+' – '+KR(x.do)+' · '+esc(R.STAVY[x.stav]||'')+'</button>'}).join('')+'</div>';
    /* osa průběhu u každé části zvlášť – hotové kroky zeleně, další krok obtažený, zbytek šedě */
    var osa=function(nad,K,hot,pozn){return '<div class="rdn-o"><span>'+nad+'</span><ol aria-label="'+nad+': hotovo '+hot+' z '+K.length+'">'+K.map(function(t,i){return '<li class="'+(i<hot?'ok':i===hot?'dal':'')+'">'+(i<hot?'<i>'+FJ+'</i>':'<i></i>')+'<em>'+t+(i<hot?'<span class="sr"> – hotovo</span>':'')+'</em></li>'}).join('')+'</ol>'+(pozn?'<small>'+pozn+'</small>':'')+'</div>'},
      bezO=b||r.stav==='zru',ls0=LS(r),
      oP=bezO||!maUby(r)?'':osa('Průběh',['Přijato','Potvrzeno','Ubytován','Odjel'],({pop:1,pot:2,uby:3,odj:4})[r.stav]||1),
      oL=bezO||!LK(r)?'':osa('Průběh',['Rezervováno','Vydáno','Vráceno'],ls0==='vra'?3:ls0==='vyd'||ls0==='cast'?2:1,ls0==='cast'?'část lodí je už vrácená':''),
      oPl=bezO||!r.platba?'':osa('Průběh',['Záloha','Doplaceno'],r.platba.stav==='vse'?2:r.platba.stav==='zal'?1:0);
    /* to hlavní na jednom místě: kdy, kde, kdo, kontakt */
    var kon=[r.telefon?'<a href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'',r.email?'<a href="mailto:'+esc(r.email)+'">'+esc(r.email)+'</a>':''].filter(Boolean);
    h+='<div class="rdn-fc"><ul class="rdn-f">'+(JL(r)&&r.lode?fakt('ka','Termín',KR(r.lode.den)+' '+r.lode.den.slice(0,4),dniL(r)+' '+pl(dniL(r),'den','dny','dní')+' · jen lodě'):fakt('ka','Termín',KR(r.od)+' – '+KR(r.do)+' '+r.do.slice(0,4),n+' '+pl(n,'noc','noci','nocí')))+
      (b||maUby(r)?fakt('ub','Místo',esc(mistaTxt(r))):'')+(!b&&r.prijezd&&maUby(r)?fakt('ka','Příjezd kolem',esc(r.prijezd)):'')+(b?'':fakt('os','Osoby',esc(KKC.osobyTxt(o))))+(kon.length?fakt('tel','Kontakt',kon[0],kon[1]||''):'')+(r.zprava?'<li class="rdn-pz"><span class="rdn-i" title="Poznámka">'+SV(IK.po,16)+'</span><div><span class="sr">Poznámka: </span><p>'+esc(r.zprava)+'</p></div></li>':'')+'</ul>'+(oP?'<div class="rdn-fo">'+oP+'</div>':'')+'</div>';
    /* hlavní akce – co je teď na řadě */
    h+=(JL(r)&&lodBtn(r)&&!(r.stav==='pop'&&r.platba&&r.platba.stav==='ceka')?lodBtn(r).replace('btn sm pri','btn pri rp-a'):r.stav==='pop'&&r.platba&&r.platba.stav==='ceka'?'<button type="button" class="btn pri rp-a" data-zp="zal">Záloha zaplacena – potvrdit</button><button type="button" class="btn sm gh rp-a2" data-st="pot">Potvrdit bez zálohy</button>':ak?'<button type="button" class="btn pri rp-a" data-st="'+ak[0]+'">'+ak[1]+'</button>':'');
    /* PLATBA – jako účtenka: položky, celkem, zaplaceno, zbývá */
    if(!b){var p=r.platba,ce=+r.cena||0,zp=!p?0:p.stav==='vse'?ce:p.stav==='zal'?Math.min(ce,+p.zaloha||0):0,dop=Math.max(0,ce-zp),pr=ce?Math.round(zp/ce*100):0,
        rad=function(cls,a,c,pod){return '<div class="'+cls+'"><dt>'+a+(pod?'<small>'+pod+'</small>':'')+'</dt><dd>'+c+'</dd></div>'};
      h+=blk('pl','pl','Platba',p?'':'<span class="rpl">na místě</span>',oPl+'<dl class="rdn-u">'+
        (cL||cD?(cU?rad('','Ubytování',kc(cU)):'')+(cL?rad('','Lodě',kc(cL)):'')+(cD?rad('','Doprava',kc(cD)):''):'')+
        rad('cel','Celkem',kc(ce))+
        (zp?rad('zap',p.stav==='vse'?'Zaplaceno':'Zaplacena záloha','− '+kc(zp),p.kdy?cas(p.kdy):''):'')+
        (ce?rad(dop?'dop':'hot',dop?'Zbývá doplatit':'Vše zaplaceno',dop?kc(dop):'✓',dop?'na místě':''):'')+(function(){var nv=sLod(r)?R.cenaLodi(r.lode).navoz:0;return nv?rad('nav','+ Návoz lodí',kc(nv),'není v ceně – vybrat na místě'):''})()+'</dl>'+
        (ce&&p?'<div class="rdx-pay-b" role="img" aria-label="Zaplaceno '+pr+' %"><i style="width:'+pr+'%"></i></div>':'')+
        (p&&p.stav==='ceka'&&+p.zaloha?'<p class="rdx-pay-z">Záloha <b>'+kc(p.zaloha)+'</b> – zaplatit do '+KR(p.splatnost)+' '+p.splatnost.slice(0,4)+(p.splatnost<dnes?' – <b class="zle">po splatnosti</b>':'')+'</p>':'')+
        (p?'<p class="rdx-pay-z">Variabilní symbol <b>'+esc(String(r.cislo||'').replace(/\D/g,''))+'</b></p>':'')+
        (r.stav==='zru'||!p?'':'<div class="rp-pl">'+(p.stav==='zal'?'<button type="button" class="btn sm" data-zp="vse">Doplaceno celé</button>':'')+(p.stav==='ceka'&&r.stav!=='pop'?'<button type="button" class="btn sm" data-zp="zal">Záloha zaplacena</button>':'')+(p.stav!=='ceka'?'<button type="button" class="btn sm gh" data-zp="ceka">Vrátit na nezaplaceno</button>':'')+'</div>'))}
    /* LODĚ */
    if(LK(r)){var x=LS(r);
      h+=blk('lo','lo','Lodě',lsBdg(r),
        oL+kv([['Lodě','<b>'+esc(LK(r))+'</b>',vybTxt(r.lode)],['Kdy',KR(r.lode.den)+' '+r.lode.den.slice(0,4)+' · '+dniL(r)+' '+pl(dniL(r),'den','dny','dní'),dniL(r)>1?'vrátit '+KR(posD(r)):''],['Trasa',esc(R.mistoN(r.lode.odkud))+' → '+esc(R.mistoN(r.lode.kam))],
          r.lode.vydano?['Vydáno',esc(R.lodeKusyTxt(r.lode.vydano.kusy)),cas(r.lode.vydano.kdy)+(r.lode.vydano.kdo?' · '+esc(r.lode.vydano.kdo):'')]:null].concat((r.lode.vraceno||[]).map(function(v,i){return ['Vráceno'+((r.lode.vraceno.length>1)?' '+(i+1)+'.':''),esc(R.lodeKusyTxt(v.kusy)),cas(v.kdy)+(v.kdo?' · '+esc(v.kdo):'')]})).concat((r.poskozeno||[]).map(function(p){return ['<span class="zle">'+R.poskozTyp(p)+(p.opraveno?(p.typ==='ztraceno'?' (nalezeno)':' (opraveno)'):'')+'</span>','<b class="'+(p.opraveno?'':'zle')+'">'+p.ks+'× '+esc(R.poskozNazev(p.k))+'</b>',esc(p.popis||'')+(p.kdy?' · '+cas(p.kdy):'')+(p.kdo?' · '+esc(p.kdo):'')]})).concat([x==='vyd'||x==='cast'?['Ještě venku','<b>'+esc(R.lodeKusyTxt(R.lodeVen(r)))+'</b>','vrátit '+KR(posD(r))+(posD(r)<dnes?' – <b class="zle">po termínu</b>':'')]:null]))+
        (function(t){return t?'<div class="rp-pl">'+t+'</div>':''})((lodBtn(r)?lodBtn(r):'')+(r.lode.vydano&&r.stav!=='zru'?((r.lode.vraceno||[]).length?'<button type="button" class="btn sm gh" data-lzr="1">Zrušit poslední vrácení</button>':'')+'<button type="button" class="btn sm gh" data-lzv="1">Zrušit výdej</button>':'')))}
    /* DOPRAVA */
    if(r.doprava)h+=blk('dp','dp','Doprava na start','',kv([['Kam','<b>'+esc(R.mistoN(r.doprava.misto))+'</b>'],['Odjezd',(r.doprava.den?KR(r.doprava.den)+' ':'')+(r.doprava.cas?'v '+esc(r.doprava.cas)+' z kempu':'čas neurčen')],['Osob',(r.doprava.osob||0)+' · '+R.aut(r.doprava.osob)+' '+pl(R.aut(r.doprava.osob),'auto','auta','aut')]]));
    if(r.vyzved)h+=blk('dp','dp','Vyzvednutí v cíli','',kv([['Odkud','<b>'+esc(R.mistoN(r.vyzved.misto))+'</b> → Kemp Krumlov'],['Kdy',(r.vyzved.den?KR(r.vyzved.den)+' ':'')+(r.vyzved.cas?'v '+esc(r.vyzved.cas):'čas neurčen')],['Osob',(r.vyzved.osob||0)+' · '+R.aut(r.vyzved.osob)+' '+pl(R.aut(r.vyzved.osob),'auto','auta','aut')],['Cena',kc(R.cenaDopravy(r.vyzved))]]));
    /* HISTORIE – všechno, co se s rezervací stalo; nejnovější nahoře, u úprav i co přesně se změnilo */
    var HI=hist.filter(function(x){return x.t}).reverse();
    if(HI.length)h+='<details class="rdn-h" open><summary><span>Historie</span><small>'+HI.length+' '+pl(HI.length,'záznam','záznamy','záznamů')+'</small></summary><ol class="rp-hi">'+HI.map(function(x){return '<li><b>'+esc(x.co)+'</b>'+(x.pod&&x.pod.length?'<ul>'+x.pod.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ul>':'')+'<small>'+cas(x.t)+(x.kdo?' · '+esc(x.kdo):'')+'</small></li>'}).join('')+'</ol></details>';
    /* dole: úprava, krok zpět, zrušení, smazání */
    var zpet=b||r.stav==='zru'||!maUby(r)?null:({pot:['pop','Vrátit na nepotvrzené'],uby:['pot','Zrušit ubytování'],odj:['uby','Zrušit odhlášení']})[r.stav];
    h+='<div class="rp-f"><button type="button" class="btn sm" data-e="upr">'+SV(IK.tu,15)+'Upravit</button>'+
      (zpet?'<button type="button" class="btn sm gh" data-st="'+zpet[0]+'">'+zpet[1]+'</button>':'')+
      (b?'':r.stav==='zru'?'<button type="button" class="btn sm gh" data-st="pop">Obnovit</button>':'<button type="button" class="btn sm gh" data-st="zru">Zrušit rezervaci</button>')+
      (adm||b?'<button type="button" class="btn sm gh rp-d" data-e="del">Smazat</button>':'')+'</div>';
    dd.innerHTML=h;
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
    if(b.dataset.sp){detail(b.dataset.sp);return}
    if(b.dataset.zp){zaplat(id,b.dataset.zp);return}
    if(b.dataset.lv){vydej(id);return}if(b.dataset.lr){vrat(id);return}if(b.dataset.lzv){zrusVydej(id);return}if(b.dataset.lzr){zrusVraceni(id);return}
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
      (b?'':KKC.osobyTypy().concat(KKC.osobyTypy(1).filter(function(t){return +o[t.rk]&&!KKC.osobyTypy().some(function(x){return x.k===t.k})})).map(function(t){return num('os_'+t.rk,esc(t.n),o[t.rk],'nepovinné')}).join('')+
        '<fieldset class="f s2 rfst"><legend>Stav</legend><div class="rfst-g">'+(r&&r.stav==='odj'?['odj','pot','uby']:['pop','pot','uby']).map(function(s){return '<label class="rfst-o '+s+'"><input type="radio" name="stav" value="'+s+'"><span>'+R.STAVY[s]+'</span></label>'}).join('')+'</div><p class="rf-pn" id="rfpn" hidden></p></fieldset>')+
      '<fieldset class="s2 rmf"><legend>Místa <small>přeškrtnutá jsou v termínu obsazená</small></legend>'+(b?'<div class="row rm-vse"><button type="button" class="btn sm gh" data-vse="1">Vybrat celý kemp</button><button type="button" class="btn sm gh" data-vse="0">Zrušit výběr</button></div>':'')+'<div id="rmm"></div></fieldset>'+
      (b?'':'<details class="s2 rfl"'+(r&&r.lode?' open':'')+'><summary>Lodě a doprava osob<small id="rfls"></small></summary><p class="mut rfl-p">Doprava bez lodí: zaškrtněte dopravu, vyberte „Odkud“ jako místo, kam se jede, a den jako „Den vyplutí“.</p><div class="rfg">'+
        '<label class="f">Den vyplutí<input class="inp" name="lden" type="date"></label>'+num('ldni','Na kolik dní',r&&r.lode?r.lode.dni:1)+
        '<div class="s2 rfl-k">'+R.lodeTypy().map(function(p){return '<label class="f">'+esc(p.n)+'<small data-lv="'+p.k+'"></small><input class="inp" name="lk_'+p.k+'" type="number" min="0" inputmode="numeric" value="'+((r&&r.lode&&r.lode.kusy[p.k])||'')+'" placeholder="0"></label>'}).join('')+'</div>'+
        '<label class="f">Odkud<select class="inp" name="lod">'+R.mistaReky().map(function(x){return '<option value="'+x.k+'">'+esc(x.n)+'</option>'}).join('')+'</select></label><label class="f">Kam<select class="inp" name="lkam">'+R.mistaReky().map(function(x){return '<option value="'+x.k+'">'+esc(x.n)+'</option>'}).join('')+'</select></label>'+
        '<label class="s2 rfl-c"><input type="checkbox" class="cb" name="ldop"> Doprava osob na místo vyplutí</label>'+num('ldos','Osob k dopravě',r&&r.doprava?r.doprava.osob:'')+'<label class="f">Odjezd z kempu<input class="inp" name="lcas" placeholder="9:00" autocomplete="off"></label>'+
        '<label class="s2 rfl-c"><input type="checkbox" class="cb" name="lvz"> Vyzvednout lidi v cíli („Kam“) a odvézt do kempu</label><label class="f">Vyzvednutí v<input class="inp" name="lvcas" placeholder="16:00" autocomplete="off"></label></div></details>'+
        '<label class="f s2">Platba<select class="inp" name="platba"><option value="">Bez zálohy – platí se na místě</option><option value="ceka">Čeká na zálohu</option><option value="zal">Záloha zaplacena</option><option value="vse">Zaplaceno celé</option></select></label>')+
      (b?'':'<label class="f s2">Přibližný čas příjezdu<select class="inp" name="prijezd">'+['','do 10:00','10–12','12–14','14–16','16–18','18–20','po 20:00'].map(function(x){return '<option value="'+x+'">'+(x||'nevíme')+'</option>'}).join('')+'</select></label>')+'<label class="f s2">Poznámka<textarea class="inp" name="zprava" rows="2"></textarea></label></div>'+
      (b?'':'<div class="rfp"><div><b>Cena</b><small id="rfci"></small></div><label class="rfc"><span class="sr">Cena v Kč</span><input class="inp" name="cena" type="number" min="0" inputmode="numeric"><span>Kč</span></label></div>')+
      '<p class="err-msg" role="alert" hidden></p><div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px"><button type="button" class="btn gh" data-z>Zrušit</button><button class="btn pri">Uložit</button></div></form>';
    var f=$('form',df),er=$('.err-msg',f),vyb={};((r&&r.mista)||pre.mista||[]).forEach(function(k){vyb[k]=1});
    f.jmeno.value=r?r.jmeno:'';f.od.value=r?r.od:(pre.od||dnes);f.do.value=r?r.do:(pre.do||ISO(ADD(D0(f.od.value),1)));f.zprava.value=(r&&r.zprava)||'';if(f.prijezd){var pj=(r&&r.prijezd)||'';if(pj&&![].some.call(f.prijezd.options,function(o){return o.value===pj}))f.prijezd.add(new Option(pj,pj));f.prijezd.value=pj}
    if(!b){f.telefon.value=(r&&r.telefon)||'';f.email.value=(r&&r.email)||'';f.stav.value=r&&r.stav!=='zru'?r.stav:'pot';f.cena.value=(r&&r.cena)||''}
    if(!b){var l0=(r&&r.lode)||{},p0=(r&&r.doprava)||{};f.lden.value=l0.den||'';f.lod.value=l0.odkud||R.mistaReky()[0].k;f.lkam.value=l0.kam||'kemp';f.ldop.checked=!!(r&&r.doprava);if(r&&r.doprava&&!r.lode){f.lod.value=r.doprava.misto;f.lden.value=r.doprava.den||''}f.lcas.value=p0.cas||'';f.lvz.checked=!!(r&&r.vyzved);f.lvcas.value=(r&&r.vyzved&&r.vyzved.cas)||'';if(r&&r.vyzved&&!r.lode){f.lkam.value=r.vyzved.misto;if(!r.doprava)f.lden.value=r.vyzved.den||''}f.platba.value=(r&&r.platba&&r.platba.stav)||''}
    /* lodě a doprava z formuláře */
    var lodeZ=function(){if(b)return null;var k={},n=0;R.lodeTypy().forEach(function(p){var v=Math.max(0,Math.round(+f['lk_'+p.k].value||0));if(v){k[p.k]=v;n+=v}});if(!n)return null;return {den:f.lden.value||f.od.value,dni:Math.max(1,Math.round(+f.ldni.value||1)),kusy:k,odkud:f.lod.value,kam:f.lkam.value}};
    var osF=function(){var n=0;$$('input[name^="os_"]',f).forEach(function(i){n+=+i.value||0});return n};
    var vyzZ=function(){var l=lodeZ(),m=l?l.kam:f.lkam.value;if(!f.lvz.checked||!m||m==='kemp')return null;var dn=l?R.lodeDny(l):[];return {misto:m,osob:+f.ldos.value||osF(),cas:f.lvcas.value.trim(),den:l?dn[dn.length-1]:(f.lden.value||f.od.value)}};
    var doprZ=function(){var l=lodeZ(),m=l?l.odkud:f.lod.value;if(!f.ldop.checked||!m||m==='kemp')return null;return {misto:m,osob:+f.ldos.value||osF(),cas:f.lcas.value.trim(),den:l?l.den:(f.lden.value||f.od.value)}};
    var lodInfo=function(){if(b)return;var den=f.lden.value||f.od.value,dni=Math.max(1,Math.round(+f.ldni.value||1)),v=den?R.lodeVolno(den,dni,r&&r.id):{};$$('[data-lv]',f).forEach(function(e){var x=v[e.dataset.lv];e.textContent=x==null?'':' · volných '+Math.max(0,x)});var l=lodeZ(),ch=l?R.lodeChybi(l,r&&r.id):[];$('#rfls',f).textContent=l?' · '+R.lodePocet(l)+' '+pl(R.lodePocet(l),'loď','lodě','lodí')+(ch.length?' · chybí vybavení':''):' · žádné';$('#rfls',f).classList.toggle('zle',!!ch.length)};
    var rucne=!!(r&&r.cena);
    /* poznámka ke stavu Poptávka: se zálohou přijde hostovi e-mail s výzvou k platbě */
    var autoP=false,nota=function(){if(b)return;var pn=$('#rfpn',f),Z=R.zaloha(),pop=f.stav.value==='pop';
      if(pop&&Z.zap&&!f.platba.value&&!(r&&r.platba)){f.platba.value='ceka';autoP=true}else if(!pop&&autoP&&f.platba.value==='ceka'){f.platba.value='';autoP=false}
      if(!pop){pn.hidden=true;return}pn.hidden=false;var cn=+f.cena.value||0,zl=(r&&r.platba&&r.platba.zaloha)||R.zalohaCastka(cn),sp=(r&&r.platba&&r.platba.splatnost)||(f.od.value?R.splatnost(f.od.value,dnes):'');
      pn.className='rf-pn'+(f.platba.value==='ceka'&&!f.email.value.trim()?' zle':'');
      pn.innerHTML=f.platba.value==='ceka'?'<b>Hostovi přijde e-mail s výzvou k zaplacení zálohy'+(zl?' '+kc(zl):'')+(sp?' do '+KR(sp):'.')+'</b> Místa i lodě se mu do té doby drží. Až zaplatí, klikněte na „Záloha zaplacena“ a z poptávky se stane rezervace. Když nezaplatí včas, poptávka sama propadne.'+(f.email.value.trim()?'':' <b>Vyplňte e-mail hosta, jinak výzva nemá kam přijít.</b>')
        :'Bez zálohy čeká rezervace na vaše potvrzení. Místa i lodě se hostovi zatím drží.'};
    f.addEventListener('change',nota);f.addEventListener('input',function(e){if(e.target.name==='email'||e.target.name==='cena')nota()});setTimeout(nota,0);
    var spocti=function(){if(b||!window.KKC)return;var od=f.od.value,dk=f.do.value,nn=od&&dk&&od<dk?Math.round((D0(dk)-D0(od))/864e5):0,q={};
      Object.keys(vyb).forEach(function(k){var t=k.split('-')[0];q[t]=(q[t]||0)+1});q.stan=+d.stan||0;q.karavan=+d.karavan||0;KKC.osobyTypy().forEach(function(t){var el=f['os_'+t.rk];if(el)q[t.k]=+el.value||0});var ty=Object.keys(q).filter(function(k){return q[k]&&KKC.p(k)&&KKC.p(k).kat==='ubytovani'});if(KKC.osobaPlati&&!KKC.osobaPlati('dite',ty)){q.os+=q.dite;q.dite=0}if(KKC.osobaPlati&&!KKC.osobaPlati('os',ty))q.os=0;
      var sum=0,sk={};for(var i=0;i<nn;i++){var h=KKC.hlavni(ADD(D0(od),i).getMonth())?'a':'b';Object.keys(q).forEach(function(k){if(q[k]&&KKC.p(k)){var v=KKC.v(k,h)*q[k];sum+=v;sk[k]=(sk[k]||0)+v}})}
      var lz=lodeZ(),cL=R.cenaLodi(lz).celkem,cD=R.cenaDopravy(doprZ())+R.cenaDopravy(vyzZ()),SL=KKC.slevaPobyt({noci:nn,q:q,sumK:sk,od:od||(lz&&lz.den)||'',lodi:lz?R.lodePocet(lz):0,lode:cL,dop:cD}),c=Math.round(sum+cL+cD-SL.kc),inf=nn+' '+pl(nn,'noc','noci','nocí')+(SL.kc?' · sleva '+esc(SL.nazev)+' −'+kc(SL.kc):'')+(cL?' · lodě '+kc(cL):'')+(cD?' · doprava '+kc(cD):'')+(lz&&R.cenaLodi(lz).navoz?' · <b>+ návoz lodí '+kc(R.cenaLodi(lz).navoz)+' na místě</b> (není v ceně)':'');lodInfo();
      if(!rucne)f.cena.value=c||'';
      $('#rfci',f).innerHTML=!c?'Vyberte termín, místa a osoby – cena se spočítá podle ceníku.':rucne&&+f.cena.value!==c?'Zadáno ručně · podle ceníku '+kc(c)+' <button type="button" class="lnk" data-cp>Použít</button>':'Podle ceníku · '+inf};
    function mista(){var od=f.od.value,dk=f.do.value,kol={};if(od&&dk&&od<dk)R.kolize([].concat.apply([],R.SKUPINY.map(function(g){return g.c.map(function(c){return g.k+'-'+c})})),od,dk,r&&r.id).forEach(function(k){kol[k]=1});
      $('#rmm',f).innerHTML=R.SKUPINY.map(function(g){return '<div class="rmg"><small>'+g.n+'</small><div>'+g.c.map(function(c){var k=g.k+'-'+c,z=kol[k];if(z)delete vyb[k];return '<label class="rm'+(z?' z':'')+'"><input type="checkbox" value="'+k+'"'+(vyb[k]?' checked':'')+(z?' disabled':'')+' aria-label="'+R.nazev(k)+(z?', obsazeno':'')+'"><span>'+(g.k==='teepee'?'Teepee':c)+'</span></label>'}).join('')+'</div></div>'}).join('')}
    mista();spocti();f.od.addEventListener('change',function(){mista();spocti()});f.do.addEventListener('change',function(){mista();spocti()});
    $('#rmm',f).addEventListener('change',function(e){if(e.target.checked)vyb[e.target.value]=1;else delete vyb[e.target.value];spocti()});
    f.addEventListener('input',function(e){var t=e.target;if(t.name==='cena')rucne=t.value!=='';if(t.name==='cena'||/^os_/.test(t.name||'')||/^l/.test(t.name||''))spocti()});
    f.addEventListener('change',function(e){if(/^l/.test(e.target.name||''))spocti()});
    f.addEventListener('click',function(e){if(e.target.closest('[data-cp]')){rucne=false;spocti()}var vb=e.target.closest('[data-vse]');if(vb){vyb={};cely=vb.dataset.vse==='1';if(vb.dataset.vse==='1')$$('#rmm input:not(:disabled)',f).forEach(function(i){vyb[i.value]=1});mista()}});
    var cely=!!pre.vse,vseV=function(){if(!cely)return;vyb={};$$('#rmm input:not(:disabled)',f).forEach(function(i){vyb[i.value]=1});mista()};
    if(cely){f.jmeno.value='Kemp zavřený';vseV()}
    f.od.addEventListener('change',vseV);f.do.addEventListener('change',vseV);$('#rmm',f).addEventListener('change',function(){cely=false});
    $('[data-z]',f).addEventListener('click',function(){df.close()});
    f.addEventListener('submit',function(e){e.preventDefault();er.hidden=true;var ch=function(t,el){er.textContent=t;er.hidden=false;if(el)el.focus()};
      var z={jmeno:f.jmeno.value.trim(),od:f.od.value,do:f.do.value,mista:Object.keys(vyb),zprava:f.zprava.value.trim()};if(f.prijezd)z.prijezd=f.prijezd.value;
      if(!z.jmeno)return ch(b?'Napište důvod blokace.':'Vyplňte jméno hosta.',f.jmeno);
      var zl=lodeZ(),bezM=!z.mista.length&&!(+d.stan||+d.karavan);
      if(!z.od||!z.do||z.od>z.do||(z.od===z.do&&!(zl&&bezM)))return ch(b?'Konec musí být po začátku.':'Odjezd musí být po příjezdu.',f.do);
      if(zl&&f.lod.value===f.lkam.value)return ch('Místo vyplutí a cíl jsou stejné.',f.lkam);
      if(b)z.stav='blk';else{z.lode=zl;z.doprava=doprZ();z.vyzved=vyzZ();
        var pv=f.platba.value,pb0=r&&r.platba;if(!r&&f.stav.value==='pop'&&pv==='ceka'&&!f.email.value.trim())return ch('Vyplňte e-mail hosta – přijde na něj výzva k zaplacení zálohy.',f.email);z.platba=pv?{zaloha:(pb0&&pb0.zaloha)||R.zalohaCastka(+f.cena.value||0)||0,splatnost:(pb0&&pb0.splatnost)||R.splatnost(z.od,dnes),stav:pv,kdy:pv==='ceka'?null:(pb0&&pb0.kdy)||Date.now()}:null;z.telefon=f.telefon.value.trim();z.email=f.email.value.trim();z.osoby={};KKC.osobyTypy(1).forEach(function(t){var el=f['os_'+t.rk];var v=el?+el.value||0:+((r&&r.osoby||{})[t.rk])||0;if(v||t.rk==='dosp')z.osoby[t.rk]=v});z.dalsi={stan:+d.stan||0,karavan:+d.karavan||0};z.cena=+f.cena.value||0;z.stav=f.stav.value;if(!r&&pv==='ceka'&&z.stav==='pot')z.stav='pop'}
      if(!z.mista.length&&(b||!(z.dalsi.stan||z.dalsi.karavan))&&!z.lode)return ch('Vyberte aspoň jedno místo nebo lodě.');
      if(!b&&f.ldop.checked&&!z.doprava)return ch('U dopravy vyberte místo, kam se jede (ne Kemp Krumlov).',f.lod);
      if(!b&&f.lvz.checked&&!z.vyzved)return ch('U vyzvednutí vyberte v „Kam“ místo, odkud hosty vyzvednete (ne Kemp Krumlov).',f.lkam);
      try{var x;if(r){var zm=rozdil(r,z);x=zm.length?zmen(r.id,z,'Upraveno',zm):R.uprav(r.id,z)}else{z.zdroj='rucne';z.kdo=ja.jmeno;x=R.pridej(z)}
        KK.zaznam('Rezervace',(x.cislo||'')+' '+x.jmeno+(r?' – upraveno':' – přidáno'));df.close();kresli();toast(b?'Blokace uložena.':'Rezervace '+x.cislo+' uložena.')}catch(q){ch(q.message)}});
    df.showModal();f.jmeno.focus();
  }
  try{if(sessionStorage.getItem('kkt.rez.nova')){sessionStorage.removeItem('kkt.rez.nova');setTimeout(function(){form(null)},0)}}catch(e){}
  function ukazka(){var n=R.ukazka(true);kresli();toast(n?'Vloženo '+n+' testovacích záznamů.':'Testovací data už tam jsou.')}
  box.addEventListener('change',function(e){var t=e.target,f=t.form;if(!f||f.id!=='rpof')return;if(t.name==='rez'){var MX=t.value?R.poskozMax(t.value):R.lodeCelkem();[].forEach.call(f.querySelectorAll('input[type=checkbox]'),function(c){var k=c.name.slice(2),mx=+MX[k]||0,n=f['n_'+k];n.max=mx;c.disabled=!mx;n.disabled=!mx;if(!mx){c.checked=false;n.value=0}else if(+n.value>mx)n.value=mx;c.closest('label').classList.toggle('off',!mx);c.closest('label').hidden=!!t.value&&!mx;c.closest('label').title=t.value?'host měl '+mx:'skladem '+mx});return}if(t.type==='checkbox'){var n=f['n_'+t.name.slice(2)];if(t.checked&&!+n.value)n.value=1;if(!t.checked)n.value=0}else if(/^n_/.test(t.name)){f['c_'+t.name.slice(2)].checked=+t.value>0}});
  box.addEventListener('submit',function(e){if(e.target.id!=='rpof')return;e.preventDefault();var f=e.target;var vy=[];[].forEach.call(f.querySelectorAll('input[type=checkbox]'),function(c){var k=c.name.slice(2),n=Math.round(+f['n_'+k].value||0);if(c.checked&&n>0)vy.push([k,n])});if(!vy.length){toast('Zaškrtněte aspoň jednu věc a nastavte počet.',1);return}var MXa=f.rez.value?R.poskozMax(f.rez.value):R.lodeCelkem(),zl=vy.filter(function(v){return v[1]>(+MXa[v[0]]||0)})[0];if(zl){toast(R.poskozNazev(zl[0])+': '+(f.rez.value?'host měl půjčeno jen ':'skladem je jen ')+(+MXa[zl[0]]||0)+' ks.',1);return}if(!f.popis.value.trim()){toast('Napište, co se stalo.',1);f.popis.focus();return}var kdo=(KK.auth.meSync()||{}).jmeno;vy.forEach(function(v){R.poskozPridej(v[0],v[1],f.popis.value,kdo,f.rez.value,f.typ.value)});KK.zaznam('Rezervace',(f.typ.value==='ztraceno'?'ztraceno: ':'poškozeno: ')+vy.map(function(v){return v[1]+'× '+R.poskozNazev(v[0])}).join(', '));kresli();toast('Nahlášeno – odečteno ze skladu.')});
  box.addEventListener('click',function(e){var t=e.target,b=t.closest('button');
    if(b&&b.dataset.poRz){if(typeof detail==='function')detail(b.dataset.poRz);return}
    if(b&&b.dataset.poOk){R.poskozOprav(b.dataset.poOk,(KK.auth.meSync()||{}).jmeno);KK.zaznam('Rezervace','opraveno');kresli();toast('Označeno jako opravené – zase k půjčení.');return}
    if(b&&b.dataset.sb){if(b.dataset.sb!==sbT)sbPrepni(function(){sbT=b.dataset.sb;sbKresli()});return}
    if(b&&b.dataset.sj){if(b.dataset.sj!==sbJ)sbPrepni(function(){sbJ=b.dataset.sj;sbKresli()});return}
    if(b&&b.dataset.sv){var f=sbF&&box.contains(sbF)?sbF:$('#sbt',box);if(!f)return;var a=f.selectionStart==null?f.value.length:f.selectionStart,z=f.selectionEnd==null?a:f.selectionEnd;f.value=f.value.slice(0,a)+b.dataset.sv+f.value.slice(z);f.focus();f.selectionStart=f.selectionEnd=a+b.dataset.sv.length;sbNahled();return}
    if(b&&b.dataset.a==='sbuloz'){sbUloz();return}
    if(b&&b.dataset.a==='sbvych'){ptej('Vrátit výchozí znění?\n\nVaše úpravy této šablony ('+JZN[sbJ]+') se smažou.',{ok:'Vrátit výchozí'}).then(function(ok){if(!ok)return;R.ulozSablonu(sbT,sbJ,null);KK.zaznam('Rezervace','šablona e-mailu vrácena: '+sbT+' ('+sbJ+')');sbKresli();toast('Vráceno výchozí znění.')});return}
    if(b){var s=b.dataset;
      if(s.tab){VY={};DRZ={};tab=s.tab;KK.LS.set('rez.tab.'+sek,tab);filtr='';q='';lim=100;kresli()}
      else if(s.qs){var qi=s.qs,qt=s.st;overDatum(qi,qt).then(function(ok){if(!ok)return;try{var sn=snap(),rr=zmen(qi,{stav:qt},R.STAVY[qt]);KK.zaznam('Rezervace',(rr.cislo||'')+' '+rr.jmeno+' – '+R.STAVY[rr.stav]);kresli();tz(rr.jmeno+': '+R.STAVY[rr.stav]+'.',sn)}catch(x){toast(x.message,1)}})}
      else if(s.fs!=null){DRZ={};F.stav=F.stav===s.fs?'':s.fs;lim=100;kresli()}
      else if(s.ft!=null){DRZ={};F.typ=F.typ===s.ft?'':s.ft;lim=100;kresli()}
      else if(s.fr){DRZ={};F.raz=s.fr;lim=100;kresli()}
      else if(s.fo!=null){F.obd=s.fo;F.stav='';lim=100;kresli()}
      else if(s.a==='csv')csv(posl);
      else if(s.ha)hromAkce(s.ha);
      else if(s.dl){rozb[s.dl]=!rozb[s.dl];var y=b.closest('section').getBoundingClientRect().top;kresli();var bb=box.querySelector('[data-dl="'+s.dl+'"]');if(bb){var sc=bb.closest('section');if(rozb[s.dl])bb.focus({preventScroll:true});else{var dy=sc.getBoundingClientRect().top-y;if(dy)window.scrollBy(0,dy);bb.focus({preventScroll:true})}}}
      else if(s.a==='frst'){F=Object.assign({},F0);vicF=false;lim=100;kresli()}
      else if(s.a==='vic'){lim+=100;kresli()}
      else if(s.a==='qx'){q='';kresli()}
      else if(s.a==='vicf'){vicF=!vicF;kresli()}
      else if(s.zp)zaplat(s.zp,s.zc||'zal');
      else if(s.kdo){var kd=s.kdo.split('|');kdoDlg(kd[0],kd[1])}
      else if('skl' in s){nT='pujc';KK.LS.set('rez.nt','pujc');location.hash='#rez_nastaveni'}
      else if('pujcit' in s)pujcit();
      else if(s.ue)form(najdi(s.ue));
      else if(s.lzv)zrusVydej(s.lzv);
      else if(s.lzr)zrusVraceni(s.lzr);
      else if(s.lv)vydej(s.lv);
      else if(s.lr)vrat(s.lr);
      else if(s.id)detail(s.id);
      else if(s.pos!=null){zac=+s.pos?ADD(zac,+s.pos):ADD(D0(dnes),-2);kresli()}
      else if(s.fl){filtr=filtr===s.fl?'':s.fl;kresli()}
      else if(s.g){sbal[s.g]=!sbal[s.g];kresli()}
      else if(s.nm)form(null,{mista:[s.nm],od:denP,do:ISO(ADD(D0(denP),1))});
      else if(s.den){denP=s.den;kresli()}
      else if(s.dpos!=null){var o=+s.dpos;if(!o){denP=okno=dnes}else{denP=ISO(ADD(D0(denP),o));if(Math.abs(o)>=7)okno=ISO(ADD(D0(okno),o))}kresli()}
      else if(s.a==='nova')form(null);
      else if(s.a==='ubyt')ubytovat();
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
    var rj=t.closest&&t.closest('.rr-h');if(rj&&(rj=$('.rl-j',rj))){detail(rj.dataset.id);return}
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
    if(t.dataset.vy){if(t.checked)VY[t.dataset.vy]=1;else delete VY[t.dataset.vy];t.closest('.rzr').classList.toggle('vyb',t.checked);hromBar();return}
    if(t.dataset.va!=null){$$('[data-vy]',box).forEach(function(c){c.checked=t.checked;if(t.checked)VY[c.dataset.vy]=1;else delete VY[c.dataset.vy];c.closest('.rzr').classList.toggle('vyb',t.checked)});hromBar();return}
    if(t.dataset.zl){var nz=R.nast(),zz=R.zaloha(),zk=t.dataset.zl;zz[zk]=zk==='zap'?t.checked:zk==='ucet'?t.value.trim():Math.max(0,Math.round(+t.value||0));if(zk==='hodnota'&&zz.typ==='proc')zz.hodnota=Math.min(100,zz.hodnota);nz.zaloha=zz;R.ulozNast(nz);KK.zaznam('Rezervace','nastavení záloh změněno');kresli();toast('Uloženo.');return}
    if(t.dataset.sk){var ns=R.nast(),sk=ns.sklad||{},ce=t.dataset.sk.split('.'),hv=Math.max(0,Math.round(+t.value||0));if(ce[0]==='vyb'){sk.vyb=sk.vyb||{};sk.vyb[ce[1]]=hv}else{sk.lode=sk.lode||{};sk.lode[ce[1]]=Object.assign({},R.sklad().lode[ce[1]],sk.lode[ce[1]]||{});sk.lode[ce[1]][ce[2]]=hv}ns.sklad=sk;R.ulozNast(ns);KK.zaznam('Rezervace','sklad půjčovny změněn');var fa=t.dataset.sk;kresli();var nf=$('[data-sk="'+fa+'"]',box);if(nf)nf.focus();toast('Uloženo.');return}
    if(t.dataset.vd){var nv=R.nast(),vd=nv.voda||{},kk=t.dataset.vd;if(t.type==='checkbox')vd[kk]=t.checked?1:0;else{var hv=Math.max(0,+t.value||0);if(!hv){toast('Zadejte číslo.',1);return}vd[kk]=hv}nv.voda=vd;R.ulozNast(nv);KK.zaznam('Rezervace','stav vody: '+kk+' = '+vd[kk]);toast('Uloženo.');return}
    if(t.id==='spjm'||t.id==='sptel'){var ns=R.nast(),sp=ns.spravce||{};sp[t.id==='spjm'?'jmeno':'tel']=t.value.trim();ns.spravce=sp;R.ulozNast(ns);KK.zaznam('Rezervace','kontakt na správce: '+(sp.jmeno||'')+' '+(sp.tel||''));toast('Uloženo.');return}
    if(t.id==='sbrc'){var u=t.value.trim();if(u&&!/^https?:\/\//.test(u)){toast('Odkaz musí začínat https://',1);return}var n2=R.nast();n2.recenzeUrl=u;R.ulozNast(n2);KK.zaznam('Rezervace','odkaz na recenze');toast('Uloženo.');if(typeof sbKresli==='function')sbKresli();return}
    if(t.id==='sbauto'){var n3=R.nast();n3.autoMail=n3.autoMail||{};n3.autoMail[t.dataset.k]=t.checked;R.ulozNast(n3);KK.zaznam('Rezervace','automatický e-mail '+t.dataset.k+': '+(t.checked?'zapnut':'vypnut'));toast(t.checked?'Bude se posílat automaticky.':'Automatické posílání vypnuto.');return}
    if(t.id==='sbem'){var v=t.value.trim();if(v&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){toast('Zkontrolujte e-mail.',1);return}var n=R.nast();n.emailKemp=v;R.ulozNast(n);KK.zaznam('Rezervace','e-mail pro upozornění: '+(v||'–'));toast('Uloženo.');return}
    if(t.id==='rnd'&&t.value){denP=t.value;kresli()}
    else if(t.id==='rkd'&&t.value){zac=ADD(D0(t.value),-2);kresli()}
    else if(t.id==='rkn'){KK.LS.set('rez.dni',+t.value);kresli()}
    else if(t.dataset.f){DRZ={};F[t.dataset.f]=t.value;lim=100;kresli()}});
  kresli();
}

/* ---------- NASTAVENÍ ---------- */
/* ---------- UŽIVATELÉ (jen správce) ---------- */
function datum(t){return t?new Date(t).toLocaleString('cs-CZ',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—'}
function uzivatele(m){
  return KK.uzivatele.seznam().then(function(U){
    var ja=KK.auth.meSync(),P=KK.prava.vse(),RO=Object.keys(KK.ROLE),SK=Object.keys(KK.SEKCE).filter(function(k){return k!=='prehled'});
    var APN={ubytovani:'Ubytování',pujcovna:'Lodě',doprava:'Doprava'};
    var SKG=KK.SEKCE_SKUPINY,SKL=function(k){var g=SKG.filter(function(x){return x[1].indexOf(k)>=0})[0];return (g&&g[2]?g[2]+' · ':'')+KK.SEKCE[k]};
    var pravaTxt0=function(u){if(u.role==='admin')return '<span class="up-v">smí vše</span>';
      if(u.vzhled==='aplikace'){var ap=KK.APP_SEKCE.filter(function(k){return u.prava[k]});var svg=function(d){return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};
      var API={ubytovani:'<path d="M3 10l9-6 9 6"/><path d="M5 9v11h14V9"/>',pujcovna:'<path d="M2 13h20c-2 4-6 5-10 5S4 17 2 13z"/><path d="M8 3l8 14"/>',doprava:'<path d="M2 6h12v10H2z"/><path d="M14 9h4l4 4v3h-8"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>'};
      return '<div class="up-ap"><span class="up-apv">'+svg('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>')+'Aplikace pro obsluhu</span>'+(u.platby?'':'<span class="up-apn" title="Nesmí potvrzovat platby">bez plateb</span>')+'</div>'+
        '<div class="up-ap">'+(ap.length?ap.map(function(k){return '<span class="up-aps up-aps-'+k+'">'+svg(API[k]||'')+esc(APN[k])+'</span>'}).join(''):'<span class="mut">žádná sekce</span>')+'</div>'}var a=SK.filter(function(k){return u.prava[k]});return a.length?a.map(function(k){var pe=k.indexOf('pela_')===0;return '<span class="up-c'+(pe?' pe':'')+'">'+esc(SKL(k))+'</span>'}).join(''):'<span class="mut">jen Přehled</span>'};
    var pravaTxt=function(u){return pravaTxt0(u)+(u.role!=='admin'&&u.vzhled!=='aplikace'&&u.souhrny===false?'<div class="up-ap"><span class="up-apn" title="Nevidí finanční souhrny a kalkulace">bez souhrnů</span></div>':'')};
    var radek=function(u){var jaJ=u.id===ja.id;return '<tr data-id="'+u.id+'"'+(u.aktivni?'':' class="skr"')+'><td><b>'+esc(u.jmeno)+'</b>'+(jaJ?' <span class="badge">vy</span>':'')+(u.vychozi?' <span class="badge warn">výchozí heslo</span>':'')+'<br><small class="mut">'+esc(u.login)+(u.email?' · '+esc(u.email):'')+'</small></td>'+
      '<td><select class="inp" data-u="role" aria-label="Role – '+esc(u.jmeno)+'"'+(jaJ?' disabled title="Svou roli změnit nemůžete"':'')+'>'+RO.map(function(r){return '<option value="'+r+'"'+(u.role===r?' selected':'')+'>'+KK.ROLE[r]+'</option>'}).join('')+'</select></td>'+
      '<td class="up-t">'+pravaTxt(u)+'</td><td class="c"><label class="sw" title="Zapnutý účet"><input type="checkbox" data-u="aktivni"'+(u.aktivni?' checked':'')+(jaJ?' disabled':'')+' aria-label="Účet zapnutý – '+esc(u.jmeno)+'"><span aria-hidden="true"></span></label></td>'+
      '<td><small class="mut">'+datum(u.posledni)+'</small></td>'+
      '<td class="c" style="white-space:nowrap"><button type="button" class="btn sm gh" data-a="upr">Upravit</button> <button type="button" class="btn sm gh'+(jaJ&&u.vychozi?' pri':'')+'" data-a="heslo">'+(jaJ?'Změnit heslo':'Nové heslo')+'</button>'+(jaJ?'':' <button type="button" class="btn ic dan" data-a="del" aria-label="Smazat uživatele '+esc(u.jmeno)+'">'+SV(IC.kos,18)+'</button>')+'</td></tr>'};
    m.innerHTML='<div class="ph"><div><h1>Uživatelé</h1><p>Kdo smí do administrace a co tam smí dělat. <b>Správce</b> smí všechno včetně uživatelů, u <b>Obsluhy</b> nastavíte sekce každému zvlášť v Upravit.</p></div><div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn gh" id="unah" title="Podívejte se, jak vypadá aplikace pro obsluhu">'+SV(IC.lode,18)+' Náhled aplikace obsluhy</button><button type="button" class="btn pri" id="un">+ Přidat uživatele</button></div></div>'+
      (ja.vychozi?'<div class="card" style="border-left:4px solid var(--warn,#e0a100);border-radius:0 var(--r) var(--r) 0;margin-bottom:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap"><span style="flex:1"><b>Používáte výchozí heslo „kemp“.</b> Změňte si ho tlačítkem Změnit heslo u svého účtu.</span><button type="button" class="btn pri sm" id="umh">Změnit heslo</button></div>':'')+
      '<section class="card" style="margin-bottom:16px"><div class="tw-wrap"><table class="ct"><thead><tr><th>Uživatel</th><th>Role</th><th>Smí upravovat</th><th class="c">Zapnutý</th><th>Poslední přihlášení</th><th class="c"><span class="sr">Akce</span></th></tr></thead><tbody id="ul">'+U.map(radek).join('')+'</tbody></table></div></section>'+
      '<div class="card mut" style="font-size:13.5px">'+SV(IC.zamek,16)+' V náhledu jsou účty uložené jen v tomto prohlížeči a chrání jen před omylem. Skutečné zabezpečení (hesla na serveru, přihlášení, práva) bude po spuštění na serveru – účty se přenesou.</div>'+
      '<dialog id="ud" class="dlg" aria-labelledby="udt"><form method="dialog" id="uf" novalidate><h2 id="udt"></h2><div class="grid" style="gap:12px">'+
      '<label class="f">Jméno a příjmení<input class="inp" name="jmeno" required autocomplete="off"></label>'+
      '<label class="f">Přihlašovací jméno<small>Bez mezer a diakritiky, např. jana.novakova</small><input class="inp" name="login" required autocomplete="off" autocapitalize="none" spellcheck="false"></label>'+
      '<label class="f">E-mail<small>Nepovinné – lze se jím i přihlásit</small><input class="inp" name="email" type="email" autocomplete="off"></label>'+
      '<label class="f">Role<select class="inp" name="role">'+RO.map(function(r){return '<option value="'+r+'"'+(r==='obsluha'?' selected':'')+'>'+KK.ROLE[r]+'</option>'}).join('')+'</select></label>'+
      '<fieldset class="f up-f" data-vz><legend>Vzhled administrace<small>Aplikace = velké dlaždice a jen dnešní práce, na mobilu i na PC. Plná = celá administrace podle zaškrtnutých sekcí.</small></legend><div class="vz-g">'+
        '<label class="vz-o"><input type="radio" name="vzhled" value="aplikace"><span><b>Aplikace pro obsluhu</b><small>Ubytování, Lodě, Doprava – jen to, co je potřeba udělat</small></span></label>'+
        '<label class="vz-o"><input type="radio" name="vzhled" value="plna"><span><b>Plná administrace</b><small>Rezervace, ceník, web… podle sekcí</small></span></label></div></fieldset>'+
      '<fieldset class="f up-f" data-apsek><legend>Co uvidí v aplikaci<small>Každá zapnutá sekce je jedna velká dlaždice. Když zapnete jen jednu, aplikace se rovnou otevře v ní.</small></legend><div class="sw-l">'+
        KK.APP_SEKCE.map(function(k){return '<label class="sw"><input type="checkbox" name="ap_'+k+'"><span aria-hidden="true"></span>'+esc(APN[k])+'</label>'}).join('')+
        '<label class="sw"><input type="checkbox" name="platby"><span aria-hidden="true"></span>Smí potvrzovat platby</label></div></fieldset>'+
      '<fieldset class="f up-f" data-souh><legend>Citlivé údaje<small>Tržby, částky v Kč za sezónu a kalkulace (Přehled, Kalkulace). Správce je vidí vždy.</small></legend><div class="sw-l"><label class="sw"><input type="checkbox" name="souhrny"><span aria-hidden="true"></span>Smí vidět finanční souhrny a kalkulace</label></div></fieldset>'+
      '<fieldset class="f up-f" data-prava><legend>Co smí upravovat<small>Přehled vidí každý. Správce smí vždy všechno.</small></legend><div class="up-g">'+SKG.map(function(g){var kl=g[1].filter(function(k){return SK.indexOf(k)>=0});return '<div class="up-gs'+(g[2]==='PE-LA'?' pe':g[2]?' ke':'')+'"><b>'+esc(g[0])+'</b><div class="sw-l">'+kl.map(function(k){return '<label class="sw"><input type="checkbox" name="pr_'+k+'"><span aria-hidden="true"></span>'+esc(KK.SEKCE[k])+'</label>'}).join('')+'</div></div>'}).join('')+'</div></fieldset>'+
      '<label class="f" data-heslo>Heslo<small>Aspoň 8 znaků. Předejte ho uživateli, heslo si pak může změnit kliknutím na své jméno vlevo dole.</small><span class="row" style="gap:8px"><input class="inp" name="heslo" type="text" autocomplete="new-password" spellcheck="false" style="flex:1"><button type="button" class="btn sm gh" id="ug">Vytvořit</button></span></label>'+
      '<p class="err-msg" role="alert" hidden></p></div><div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px"><button type="button" class="btn gh" id="uz">Zrušit</button><button class="btn pri" id="uo" value="ok">Uložit</button></div></form></dialog>';
    var dlg=$('#ud'),f=$('#uf'),er=$('.err-msg',f),edit=null;
    function otevri(u){edit=u||null;er.hidden=true;f.reset();$('#udt').textContent=u?'Upravit uživatele':'Nový uživatel';
      f.jmeno.value=u?u.jmeno:'';f.login.value=u?u.login:'';f.login.disabled=!!u;f.email.value=u?u.email:'';f.role.value=u?u.role:'obsluha';f.role.disabled=!!(u&&u.id===ja.id);
      $('[data-heslo]',f).hidden=!!u;if(!u)f.heslo.value=KK.uzivatele.heslo();
      var pv=u?u.prava:KK.prava.vse().obsluha;SK.forEach(function(k){f['pr_'+k].checked=!!pv[k]});
      KK.APP_SEKCE.forEach(function(k){f['ap_'+k].checked=!!pv[k]});f.platby.checked=u?u.platby!==false:true;f.souhrny.checked=u?u.souhrny!==false:true;vzNastav(u?(u.role==='admin'?'aplikace':u.vzhled):'aplikace');prUkaz();
      if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');f.jmeno.focus()}
    function vzhled(){var x=$('[name=vzhled]:checked',f);return x?x.value:'plna'}
    function vzNastav(v){$$('[name=vzhled]',f).forEach(function(x){x.checked=x.value===v})}
    function prUkaz(){var ad=f.role.value==='admin',ap=!ad&&vzhled()==='aplikace';$('[data-vz]',f).hidden=ad;$('[data-apsek]',f).hidden=!ap;$('[data-prava]',f).hidden=ad||ap;$('[data-souh]',f).hidden=ad||ap}
    f.role.addEventListener('change',prUkaz);
    /* přepnutí vzhledu přenese zaškrtnuté sekce Ubytování / Lodě / Doprava */
    $$('[name=vzhled]',f).forEach(function(x){x.addEventListener('change',function(){var ap=vzhled()==='aplikace';KK.APP_SEKCE.forEach(function(k){if(ap)f['ap_'+k].checked=f['pr_'+k].checked;else f['pr_'+k].checked=f['ap_'+k].checked});prUkaz()})});
    $('#unah').addEventListener('click',function(){KK.LS.set('o.nahled',1);history.replaceState(null,'','#o');shell(KK.auth.meSync())});
    $('#un').addEventListener('click',function(){otevri(null)});
    var umh=$('#umh');if(umh)umh.addEventListener('click',function(){var b=$('#ul tr[data-id="'+ja.id+'"] [data-a=heslo]');if(b)b.click()});
    $('#uz').addEventListener('click',function(){dlg.close()});
    $('#ug').addEventListener('click',function(){f.heslo.value=KK.uzivatele.heslo();f.heslo.select()});
    f.addEventListener('submit',function(e){e.preventDefault();er.hidden=true;
      var z={jmeno:f.jmeno.value,login:f.login.value,email:f.email.value,role:f.role.value,heslo:f.heslo.value,prava:{}};SK.forEach(function(k){z.prava[k]=f['pr_'+k].checked?1:0});
      z.vzhled=z.role==='admin'?'plna':vzhled();z.platby=f.platby.checked;z.souhrny=f.souhrny.checked;if(z.vzhled==='aplikace')KK.APP_SEKCE.forEach(function(k){z.prava[k]=f['ap_'+k].checked?1:0});
      if(z.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(z.email)){er.textContent='E-mail nevypadá správně.';er.hidden=false;f.email.focus();return}
      var pr=edit?KK.uzivatele.uprav(edit.id,{jmeno:z.jmeno,email:z.email,role:edit.id===ja.id?undefined:z.role,prava:z.prava,vzhled:z.vzhled,platby:z.platby,souhrny:z.souhrny}):KK.uzivatele.pridej(z);
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

/* ---------- KALKULACE: tržby, rozpad podle druhu, platby, obsazenost a průměry ----------
   Rezervace se do období počítají podle dne příjezdu (u samotných lodí podle dne půjčení).
   Obsazenost se počítá po nocích v období. Zahrnuje i uzavřené sezóny z archivu. */
function kalkulace(m){var R=window.KKR;if(!R||!window.KKC){m.innerHTML='<div class="card">Rezervace nejsou k dispozici.</div>';return}
 if(citSkryt()){m.innerHTML='<div class="ph"><div><h1>Kalkulace</h1></div></div><div class="card"><h2>Kalkulace nejsou pro váš účet dostupné</h2><p class="mut">Finanční souhrny a kalkulace vám správce nezpřístupnil.</p></div>';return}
 var kc=function(n){return Math.round(n||0).toLocaleString('cs-CZ').replace(/\s/g,' ')+' Kč'},
  pc=function(a,b){return b?Math.round(a/b*100):0},
  I=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)},
  D=function(s){var p=s.split('-');return new Date(+p[0],p[1]-1,+p[2])},
  KR=function(s){var d=D(s);return d.getDate()+'. '+(d.getMonth()+1)+'. '+d.getFullYear()},
  dnes=new Date(),DN=I(dnes),
  MES=['led','úno','bře','dub','kvě','čvn','čvc','srp','zář','říj','lis','pro'],
  ar=R.archiv(),
  roky=(function(){var o={};R.sezonaRoky().forEach(function(y){o[y]=1});Object.keys(ar).forEach(function(y){o[+y]=1});o[dnes.getFullYear()]=1;return Object.keys(o).map(Number).sort(function(a,b){return b-a})})(),
  st=KK.LS.get('kalk',{})||{},
  obd=st.obd||'rok',rok=roky.indexOf(st.rok)>=0?st.rok:dnes.getFullYear(),vOd=st.od||'',vDo=st.do||'';
 var dk=function(r){return r.od||(r.lode&&r.lode.den)||''};
 function rozsah(){
  if(obd==='mes')return [I(new Date(dnes.getFullYear(),dnes.getMonth(),1)),I(new Date(dnes.getFullYear(),dnes.getMonth()+1,1))];
  if(obd==='tyd'){var a=new Date(dnes.getFullYear(),dnes.getMonth(),dnes.getDate()-(dnes.getDay()+6)%7),b=new Date(a);b.setDate(b.getDate()+7);return [I(a),I(b)]}
  if(obd==='vl'&&vOd&&vDo&&vDo>=vOd){var e=D(vDo);e.setDate(e.getDate()+1);return [vOd,I(e)]}
  return [rok+'-01-01',(rok+1)+'-01-01']}
 function vse(){var a=R.vse().slice();Object.keys(ar).forEach(function(y){(ar[y].rezervace||[]).forEach(function(r){a.push(Object.assign({_arch:1},r))})});return a}
 /* celková cena = ubytování (vč. doplňků a slev) + lodě (půjčovné a návoz) + doprava (na start a vyzvednutí v cíli) */
 function rozpad(r){var c=+r.cena||0,l=r.lode?R.cenaLodi(r.lode).celkem:0,d=R.cenaDopravy(r.doprava)+R.cenaDopravy(r.vyzved);
  if(l+d>c){var k=c/((l+d)||1);l=Math.round(l*k);d=c-l;return {uby:0,lode:l,dop:d}}return {uby:c-l-d,lode:l,dop:d}}
 function zaplaceno(r){var p=r.platba,c=+r.cena||0;if(p&&p.stav==='vse')return c;if(p&&p.stav==='zal')return Math.min(c,+p.zaloha||0);return 0}
 function otevreno(iso){var S=KKC.data.sezona||{};if(S.celorocne)return true;var md=iso.slice(5);return md>=(S.otevrenoOd||'01-01')&&md<(S.otevrenoDo||'12-32')}
 function spocti(){var rz=rozsah(),A=rz[0],B=rz[1],
   V=vse().filter(function(r){var d=dk(r);return r.stav!=='blk'&&d>=A&&d<B}),
   L=V.filter(function(r){return r.stav!=='zru'}),Z=V.length-L.length,
   s={A:A,B:B,L:L,zru:Z,vse:V.length,trz:0,uby:0,lode:0,dop:0,zap:0,zal:0,dopl:0,noci:0,osob:0,rezU:0,rezL:0,lodi:0,arch:V.some(function(r){return r._arch}),mes:{},po:[],dluh:[],ceka:[]};
  L.forEach(function(r){var c=+r.cena||0,x=rozpad(r),z=zaplaceno(r),p=r.platba,mk=dk(r).slice(0,7);
   s.trz+=c;s.uby+=x.uby;s.lode+=x.lode;s.dop+=x.dop;s.zap+=z;if(p&&p.stav==='zal')s.zal+=z;s.dopl+=c-z;
   if(r.od&&r.do&&((r.mista||[]).length||(r.dalsi&&(+r.dalsi.stan||+r.dalsi.karavan)))){s.rezU++;s.noci+=R.noci(r.od,r.do).length}
   if(r.lode&&R.lodePocet(r.lode)){s.rezL++;s.lodi+=R.lodePocet(r.lode)}
   s.osob+=KKC.osobPocet(r.osoby||{});
   var o=s.mes[mk]=s.mes[mk]||{uby:0,lode:0,dop:0};o.uby+=x.uby;o.lode+=x.lode;o.dop+=x.dop;
   if(c-z>0&&!r._arch){if(p&&p.stav==='ceka'&&p.splatnost&&p.splatnost<DN)s.po.push(r);else if(r.stav==='odj')s.dluh.push(r);else if(r.stav==='uby')s.ceka.push(r)}});
  /* obsazenost po nocích v období (jen dny, kdy je kemp otevřený) */
  var J={},noc=[],d=D(A),e=D(B),BK={};vse().forEach(function(r){if(r.stav!=='zru'&&r.stav!=='blk'&&r.od&&r.do&&(r.mista||[]).length)R.noci(r.od,r.do).forEach(function(x){BK[x]=1})});while(d<e&&noc.length<800){var iso=I(d);if(otevreno(iso)||BK[iso])noc.push(iso);d.setDate(d.getDate()+1)}
  R.SKUPINY.forEach(function(g){J[g.k]=J[g.k]||{n:0,obs:0};J[g.k].n+=g.c.length});
  var NS={},ext={stan:0,karavan:0};noc.forEach(function(x){NS[x]=1});
  vse().forEach(function(r){if(r.stav==='zru'||r.stav==='blk'||!r.od||!r.do)return;R.noci(r.od,r.do).forEach(function(x){if(!NS[x])return;(r.mista||[]).forEach(function(mm){var t=mm.split('-')[0];if(J[t])J[t].obs++});if(r.dalsi){ext.stan+=+r.dalsi.stan||0;ext.karavan+=+r.dalsi.karavan||0}})});
  s.obs=J;s.ext=ext;s.nociOtev=noc.length;return s}
 var TYP={chatka:'Chatky',podsad:'Podsadové stany',teepee:'Teepee'};
 function graf(s){var a=D(s.A),b=D(s.B),M=[];a=new Date(a.getFullYear(),a.getMonth(),1);while(a<b&&M.length<36){M.push(I(a).slice(0,7));a.setMonth(a.getMonth()+1)}
  if(M.length<2)return '';var tot=function(k){var o=s.mes[k]||{};return (o.uby||0)+(o.lode||0)+(o.dop||0)},mx=Math.max.apply(null,M.map(tot))||1;
  return '<div class="card"><h2>Tržby po měsících</h2><div class="kl-g" role="img" aria-label="Graf tržeb po měsících">'+M.map(function(k){var o=s.mes[k]||{uby:0,lode:0,dop:0},t=tot(k),h=function(v){return Math.round(v/mx*150)};
   return '<div class="m" title="'+MES[+k.slice(5)-1]+' '+k.slice(0,4)+': '+kc(t)+'"><em>'+(t?Math.round(t/1000)+' tis.':'')+'</em><div class="s"><i class="c-u" style="height:'+h(o.uby)+'px"></i><i class="c-l" style="height:'+h(o.lode)+'px"></i><i class="c-d" style="height:'+h(o.dop)+'px"></i></div><small>'+MES[+k.slice(5)-1]+(M.length>12?' '+k.slice(2,4):'')+'</small></div>'}).join('')+'</div>'+leg()+'</div>'}
 function leg(){return '<ul class="kl-l"><li><i class="kl-dot c-u"></i>Ubytování</li><li><i class="kl-dot c-l"></i>Lodě</li><li><i class="kl-dot c-d"></i>Doprava</li></ul>'}
 function seznam(nad,L,pozn){if(!L.length)return '';L=L.slice().sort(function(a,b){return dk(a)<dk(b)?-1:1});
  return '<h3 class="kl-h">'+nad+' <span class="mut">('+L.length+')</span></h3>'+(pozn?'<p class="mut" style="margin:0 0 6px;font-size:13px">'+pozn+'</p>':'')+'<ul class="kl-s">'+L.slice(0,8).map(function(r){var d=(+r.cena||0)-zaplaceno(r);
   return '<li><span><b>'+esc(r.cislo||'')+'</b> '+esc(r.jmeno||'')+'<small>'+KR(dk(r))+(r.platba&&r.platba.splatnost&&r.platba.stav==='ceka'?' · splatnost '+KR(r.platba.splatnost):'')+'</small></span><b>'+kc(d)+'</b></li>'}).join('')+'</ul>'+(L.length>8?'<p class="mut" style="margin:6px 0 0;font-size:13px">… a dalších '+(L.length-8)+' – najdete je v Rezervacích</p>':'')}
 function kresli(){var s=spocti(),n=s.L.length,KD=function(t,v,p){return '<div><dt>'+t+'</dt><dd>'+v+'</dd>'+(p?'<small>'+p+'</small>':'')+'</div>'},
   konec=D(s.B);konec.setDate(konec.getDate()-1);
  m.innerHTML='<div class="ph"><div><h1>Kalkulace</h1><p>Tržby, platby a obsazenost za vybrané období. Rezervace se počítají podle dne příjezdu, zrušené a blokace se do tržeb nepočítají.</p></div><button type="button" class="btn gh" id="klcsv">Stáhnout CSV</button></div>'+
   '<div class="kl-top"><div class="rz-seg" role="group" aria-label="Období">'+[['tyd','Tento týden'],['mes','Tento měsíc'],['rok','Rok'],['vl','Vlastní']].map(function(x){return '<button type="button" data-ob="'+x[0]+'" aria-pressed="'+(obd===x[0])+'">'+x[1]+'</button>'}).join('')+'</div>'+
   (obd==='rok'?'<select class="inp" id="klrok" aria-label="Rok">'+roky.map(function(y){return '<option'+(y===rok?' selected':'')+'>'+y+'</option>'}).join('')+'</select>':'')+
   (obd==='vl'?'<label class="kl-d">od <input class="inp" type="date" id="klod" value="'+esc(vOd)+'"></label><label class="kl-d">do <input class="inp" type="date" id="kldo" value="'+esc(vDo)+'"></label>':'')+
   '<span class="mut">'+KR(s.A)+' – '+KR(I(konec))+(s.arch?' · včetně archivu':'')+'</span></div>'+
   '<div class="card"><h2>Tržby za období</h2><dl class="kl-k">'+KD('Tržby celkem',kc(s.trz),n+' '+pl(n,'rezervace','rezervace','rezervací'))+KD('Zaplaceno',kc(s.zap),pc(s.zap,s.trz)+' % z tržeb')+KD('Zbývá doplatit',kc(s.dopl),s.po.length?s.po.length+' po splatnosti zálohy':'')+KD('Zrušeno',String(s.zru),s.vse?pc(s.zru,s.vse)+' % rezervací':'')+'</dl></div>'+
   '<div class="grid g2" style="margin-top:16px">'+
    '<div class="card"><h2>Rozpad podle druhu</h2><div class="kl-bar">'+(s.trz?'<i class="c-u" style="width:'+(s.uby/s.trz*100)+'%"></i><i class="c-l" style="width:'+(s.lode/s.trz*100)+'%"></i><i class="c-d" style="width:'+(s.dop/s.trz*100)+'%"></i>':'')+'</div>'+
     '<dl class="kl-rz">'+[['c-u','Ubytování',s.uby,s.rezU+' '+pl(s.rezU,'pobyt','pobyty','pobytů')+' · '+s.noci+' '+pl(s.noci,'noc','noci','nocí')+' · vč. doplňků a slev'],['c-l','Lodě',s.lode,s.lodi+' '+pl(s.lodi,'loď','lodě','lodí')+' v '+s.rezL+' '+pl(s.rezL,'rezervaci','rezervacích','rezervacích')+' · půjčovné a návoz'],['c-d','Doprava',s.dop,'odvoz na start a vyzvednutí v cíli']].map(function(x){return '<div><dt><i class="kl-dot '+x[0]+'"></i>'+x[1]+'<small>'+x[3]+'</small></dt><dd>'+kc(x[2])+'<small>'+pc(x[2],s.trz)+' %</small></dd></div>'}).join('')+'</dl></div>'+
    '<div class="card"><h2>Platby</h2><dl class="kl-rz">'+
     '<div><dt>Zaplaceno celé<small>rezervace označené jako zaplacené</small></dt><dd>'+kc(s.zap-s.zal)+'</dd></div>'+
     '<div><dt>Přijaté zálohy<small>zbytek se doplácí na místě</small></dt><dd>'+kc(s.zal)+'</dd></div>'+
     '<div><dt>Zbývá doplatit<small>u všech rezervací v období</small></dt><dd>'+kc(s.dopl)+'</dd></div></dl>'+
     seznam('Záloha po splatnosti',s.po,'Rezervace, u kterých záloha nedorazila včas.')+
     seznam('Odjeli a nemají označeno zaplaceno',s.dluh,'Buď dluží, nebo platili na místě a platba není v administraci zapsaná.')+
     seznam('Ubytovaní, kteří ještě doplácejí',s.ceka)+
     (!s.po.length&&!s.dluh.length&&!s.ceka.length?'<p class="szn-ok">✓ Nikdo s platbou nemešká.</p>':'')+'</div></div>'+
   graf(s).replace('<div class="card">','<div class="card" style="margin-top:16px">')+
   '<div class="grid g2" style="margin-top:16px">'+
    '<div class="card"><h2>Obsazenost</h2><p class="mut" style="margin-top:-4px">Kolik procent nocí byla místa obsazená. Období má '+s.nociOtev+' '+pl(s.nociOtev,'noc','noci','nocí')+' provozu (dny, kdy je kemp zavřený, se nepočítají).</p>'+
     Object.keys(s.obs).map(function(t){var o=s.obs[t],kap=o.n*s.nociOtev,p=pc(o.obs,kap);return '<div class="kl-o"><span>'+(TYP[t]||t)+'<small>obsazeno '+o.obs+' z '+kap+' možných nocí ('+o.n+' '+pl(o.n,'místo','místa','míst')+' × '+s.nociOtev+')</small></span><div class="kl-bar"><i class="c-u" style="width:'+Math.min(100,p)+'%"></i></div><b>'+p+' %</b></div>'}).join('')+
     '<p class="mut" style="margin:10px 0 0;font-size:14px">Vlastní stany: <b>'+s.ext.stan+'</b> '+pl(s.ext.stan,'noc','noci','nocí')+' · Karavany: <b>'+s.ext.karavan+'</b> '+pl(s.ext.karavan,'noc','noci','nocí')+' (nemají pevnou kapacitu)</p></div>'+
    '<div class="card"><h2>Průměry</h2><dl class="kl-rz">'+
     '<div><dt>Průměrná rezervace</dt><dd>'+kc(n?s.trz/n:0)+'</dd></div>'+
     '<div><dt>Ubytování za noc<small>průměr na jeden pobyt a noc</small></dt><dd>'+kc(s.noci?s.uby/s.noci:0)+'</dd></div>'+
     '<div><dt>Délka pobytu</dt><dd>'+(s.rezU?(s.noci/s.rezU).toLocaleString('cs-CZ',{maximumFractionDigits:1}):'0')+' noci</dd></div>'+
     '<div><dt>Hostů na rezervaci<small>celkem '+s.osob+' '+pl(s.osob,'host','hosté','hostů')+'</small></dt><dd>'+(n?(s.osob/n).toLocaleString('cs-CZ',{maximumFractionDigits:1}):'0')+'</dd></div>'+
     '<div><dt>Lodě na rezervaci s loděmi</dt><dd>'+(s.rezL?(s.lodi/s.rezL).toLocaleString('cs-CZ',{maximumFractionDigits:1}):'0')+'</dd></div></dl></div></div>';
  m.__s=s}
 function uloz(){KK.LS.set('kalk',{obd:obd,rok:rok,od:vOd,do:vDo})}
 m.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.dataset.ob){obd=b.dataset.ob;if(obd==='vl'&&!vOd){vOd=I(new Date(dnes.getFullYear(),dnes.getMonth(),1));vDo=DN}uloz();kresli()}
  else if(b.id==='klcsv'){var s=m.__s,q=function(v){v=String(v==null?'':v);return /[;"\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v},
   rows=[['Číslo','Jméno','Příjezd','Odjezd','Stav','Cena','Ubytování','Lodě','Doprava','Zaplaceno','Doplatit']].concat(s.L.map(function(r){var x=rozpad(r),z=zaplaceno(r);return [r.cislo,r.jmeno,r.od||dk(r),r.do||'',R.STAVY[r.stav]||r.stav,+r.cena||0,x.uby,x.lode,x.dop,z,(+r.cena||0)-z]}));
   var a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+rows.map(function(r){return r.map(q).join(';')}).join('\r\n')],{type:'text/csv'}));a.download='kemp-krumlov-kalkulace-'+s.A+'.csv';a.click();toast('CSV staženo.')}});
 m.addEventListener('change',function(e){var t=e.target;if(t.id==='klrok'){rok=+t.value;uloz();kresli()}else if(t.id==='klod'||t.id==='kldo'){vOd=$('#klod',m).value;vDo=$('#kldo',m).value;if(vOd&&vDo&&vDo<vOd){toast('Konec období musí být po začátku.',1);return}uloz();kresli()}});
 kresli();
}
/* ---------- ZÁZNAM AKCÍ: kdo, kdy a co na webu změnil ---------- */
function zaznam(m){
  m.innerHTML='<div class="ph"><div><h1>Záznam akcí</h1><p>Kdo, kdy a co na webu změnil. Ukládá se posledních 2000 záznamů v tomto prohlížeči.</p></div></div>'+
  '<div class="card"><label class="f">Hledat<input class="inp" type="search" id="zq" placeholder="jméno, akce, popis…" autocomplete="off"></label><ul class="szn-a" id="zl" style="margin-top:12px"></ul></div>';
  var Z=KK.historie();
  function kresli(){var q=($('#zq',m).value||'').trim().toLowerCase();
    var sez=Z.filter(function(z){return !q||(z.co+' '+z.popis+' '+z.kdo).toLowerCase().indexOf(q)>=0});
    $('#zl',m).innerHTML=sez.length?sez.map(function(z){return '<li><div><b>'+esc(z.co)+'</b> '+esc(z.popis)+'<small>'+new Date(z.kdy).toLocaleString('cs-CZ',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'})+(z.kdo?' · '+esc(z.kdo):'')+'</small></div></li>'}).join(''):'<li class="mut">Žádné záznamy.</li>'}
  $('#zq',m).addEventListener('input',kresli);kresli();
}
/* ---------- SEZÓNA: uzavření a archiv (jen Správce, potvrzuje se heslem) ---------- */
function sHeslem(o){return new Promise(function(res){var d=document.createElement('dialog'),hot=false;d.className='dlg ptj nb szn-d';d.setAttribute('aria-labelledby','sznh');
  d.innerHTML='<form method="dialog" novalidate><div class="ptj-i" aria-hidden="true">!</div><h2 id="sznh">'+esc(o.nadpis)+'</h2>'+o.txt.map(function(t){return '<p>'+t+'</p>'}).join('')+
   (o.varovani?'<label class="szn-c"><input type="checkbox" class="cb" name="vim"> '+esc(o.varovani)+'</label>':'')+
   '<label class="f">Vaše heslo<input class="inp" type="password" name="h" autocomplete="current-password" required></label><p class="szn-e" role="alert" hidden></p>'+
   '<div class="ptj-b"><button type="button" class="btn gh" data-n>Zrušit</button><button type="submit" class="btn dan2">'+esc(o.ok)+'</button></div></form>';
  document.body.appendChild(d);var f=$('form',d),er=$('.szn-e',d),konec=function(v){if(hot)return;hot=true;try{d.close()}catch(e){}d.remove();res(v)},chyba=function(t,el){er.textContent=t;er.hidden=false;if(el)el.focus()};
  $('[data-n]',d).addEventListener('click',function(){konec(false)});d.addEventListener('cancel',function(e){e.preventDefault();konec(false)});
  f.addEventListener('submit',function(e){e.preventDefault();if(f.vim&&!f.vim.checked)return chyba('Potvrďte, že víte o nevyřízených rezervacích.',f.vim);if(!f.h.value)return chyba('Zadejte své heslo.',f.h);
   var b=$('[type=submit]',d);b.disabled=true;KK.auth.overSebe(f.h.value).then(function(ok){b.disabled=false;if(!ok){f.h.value='';return chyba('Heslo nesouhlasí.',f.h)}konec(true)})});
  d.showModal();(f.vim||f.h).focus()})}
function sezona(box){var R=window.KKR,kc=function(n){return Math.round(n||0).toLocaleString('cs-CZ').replace(/\s/g,' ')+' Kč'},
  stahni=function(data,nazev){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,1)],{type:'application/json'}));a.download=nazev;document.body.appendChild(a);a.click();a.remove()},
  F=function(t){return new Date(t).toLocaleString('cs-CZ',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'})},
  SZ=function(o){return '<dl class="szn-s"><div><dt>Rezervací</dt><dd>'+o.rezervaci+'</dd></div><div><dt>Nocí</dt><dd>'+o.noci+'</dd></div><div><dt>Hostů</dt><dd>'+o.osob+'</dd></div><div><dt>Lodí</dt><dd>'+o.lodi+'</dd></div><div><dt>Tržby</dt><dd>'+kc(o.trzby)+'</dd></div><div><dt>Zrušených</dt><dd>'+o.zrusenych+'</dd></div></dl>'};
 var roky=R.sezonaRoky(),ted=new Date().getFullYear(),vyb=box.__rok&&roky.indexOf(box.__rok)>=0?box.__rok:(roky.filter(function(y){return y<=ted})[0]||roky[0]);
 function kresli(){var ar=R.archiv(),AR=Object.keys(ar).sort().reverse(),K=vyb?R.sezonaKontrola(vyb):null,pr=K?K.uby.length+K.lode.length+K.budouci.length:0;
  box.innerHTML='<div class="card szn" style="margin-top:18px"><div class="szn-h"><div><h2>Sezóna</h2><p class="mut">Po skončení sezóny ji uzavřete: rezervace se přesunou do archivu, přehledy a seznamy začnou nanovo a čísla rezervací poběží od R'+String((vyb||ted)+1).slice(2)+'-0001. Rezervace na další rok zůstanou.</p></div>'+
   (roky.length>1?'<label class="f szn-r">Sezóna<select class="inp" id="sznR">'+roky.map(function(y){return '<option'+(y===vyb?' selected':'')+'>'+y+'</option>'}).join('')+'</select></label>':'')+'</div>'+
   (K?'<h3 class="szn-t">Sezóna '+vyb+'</h3>'+(citSkryt()?'<p class="mut">Souhrny tržeb jsou skryté.</p>':SZ(K.souhrn))+
    (pr?'<div class="szn-w"><b>Před uzavřením zkontrolujte:</b><ul>'+(K.uby.length?'<li><b>'+K.uby.length+'</b> '+pl(K.uby.length,'host je','hosté jsou','hostů je')+' pořád ubytovaných – odhlaste je.</li>':'')+(K.lode.length?'<li><b>'+K.lode.length+'</b> '+pl(K.lode.length,'rezervace má','rezervace mají','rezervací má')+' lodě ještě venku – vraťte je.</li>':'')+(K.budouci.length?'<li><b>'+K.budouci.length+'</b> '+pl(K.budouci.length,'rezervace ještě neproběhla','rezervace ještě neproběhly','rezervací ještě neproběhlo')+'.</li>':'')+'</ul></div>':'<p class="szn-ok">✓ Vše je vyřízené, sezónu můžete uzavřít.</p>')+
    (K.dalsi?'<p class="mut">'+K.dalsi+' '+pl(K.dalsi,'rezervace','rezervace','rezervací')+' na další rok zůstane v systému.</p>':'')+
    '<div class="row"><button type="button" class="btn dan" id="sznU">Uzavřít sezónu '+vyb+'…</button></div>':'<p class="mut">Zatím nejsou žádné rezervace.</p>')+
   '<h3 class="szn-t">Archiv sezón</h3>'+(AR.length?'<ul class="szn-a">'+AR.map(function(y){var x=ar[y];return '<li><div><b>Sezóna '+y+'</b><small>uzavřeno '+F(x.uzavreno)+(x.kdo?' · '+esc(x.kdo):'')+' · '+x.souhrn.rezervaci+' rezervací · '+kc(x.souhrn.trzby)+'</small></div><button type="button" class="btn sm gh" data-ast="'+y+'">Stáhnout</button><button type="button" class="btn sm gh" data-aob="'+y+'">Vrátit do rezervací…</button></li>'}).join('')+'</ul>':'<p class="mut">Zatím žádná uzavřená sezóna.</p>')+'</div>'}
 /* dialog s heslem: o={nadpis,txt:[odstavce],ok,varovani} → Promise(true|false) */
 box.addEventListener('change',function(e){if(e.target.id==='sznR'){vyb=box.__rok=+e.target.value;kresli()}});
 box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var ja=(KK.auth.meSync()||{}).jmeno||'';
  if(b.id==='sznU'){var K=R.sezonaKontrola(vyb),pr=K.uby.length+K.lode.length+K.budouci.length,dalsi=String(vyb+1).slice(2);
   sHeslem({nadpis:'Uzavřít sezónu '+vyb+'?',ok:'Uzavřít sezónu',varovani:pr?'Vím, že '+pr+' '+pl(pr,'rezervace není vyřízená','rezervace nejsou vyřízené','rezervací není vyřízených')+', a přesto chci sezónu uzavřít.':'',
    txt:['Nejdřív se stáhne <b>záloha všech dat</b> (soubor .json).','Všech <b>'+K.L.length+'</b> rezervací s příjezdem v roce '+vyb+' se přesune do <b>archivu</b>. Z přehledů, seznamů, Ubytování, Půjčovny i Dopravy zmizí a uvolní se místa i lodě.','Nové rezervace dostanou čísla od <b>R'+dalsi+'-0001</b>.'+(K.dalsi?' Rezervace na další rok ('+K.dalsi+') zůstanou beze změny.':''),'Sezónu jde z archivu kdykoli vrátit zpět.']})
   .then(function(ok){if(!ok)return;return KK.export().then(function(d){stahni(d,'kemp-krumlov-zaloha-pred-uzavrenim-'+vyb+'.json')}).then(function(){var x=R.uzavriSezonu(vyb,ja);KK.zaznam('Sezóna',vyb+' uzavřena – '+x.rezervace.length+' rezervací v archivu');box.__rok=null;roky=R.sezonaRoky();vyb=roky.filter(function(y){return y<=ted})[0]||roky[0];kresli();toast('Sezóna '+x.rok+' je uzavřená a uložená v archivu.')}).catch(function(x){toast(x.message||'Sezónu se nepodařilo uzavřít.',1)})})}
  else if(b.dataset.ast){var y=b.dataset.ast,x=R.archiv()[y];if(x){stahni(x,'kemp-krumlov-sezona-'+y+'.json');toast('Archiv sezóny '+y+' stažen.')}}
  else if(b.dataset.aob){var y2=+b.dataset.aob,x2=R.archiv()[y2];if(!x2)return;
   sHeslem({nadpis:'Vrátit sezónu '+y2+' do rezervací?',ok:'Vrátit zpět',txt:['<b>'+x2.rezervace.length+'</b> rezervací z archivu se vrátí mezi rezervace a znovu se objeví v přehledech, seznamech i obsazenosti.']})
   .then(function(ok){if(!ok)return;try{R.obnovSezonu(y2);KK.zaznam('Sezóna',y2+' vrácena z archivu');roky=R.sezonaRoky();vyb=box.__rok=y2;kresli();toast('Sezóna '+y2+' je zpátky v rezervacích.')}catch(x){toast(x.message,1)}})}});
 kresli()}

/* kříž v tabulce dostupnosti (lodě, vybavení): zvýrazní řádek i sloupec buňky pod myší / s fokusem */
(function(){var posl=null;function vycisti(){$$('.rv-t .kx,.rv-t .kr,.rv-t .kc').forEach(function(x){x.classList.remove('kx','kr','kc')})}
  function kriz(e){var c=e.target.closest&&e.target.closest('.rv-t td.rv-c');if(c===posl)return;posl=c;vycisti();if(!c)return;var tr=c.parentNode,t=c.closest('.rv-t'),ci=[].indexOf.call(tr.children,c);
    tr.classList.add('kr');c.classList.add('kc');$$('tr',t).forEach(function(r){var x=r.children[ci];if(x)x.classList.add('kx')})}
  document.addEventListener('mouseover',kriz);document.addEventListener('focusin',kriz);
  document.addEventListener('mouseout',function(e){if(posl&&!(e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest('.rv-t td.rv-c'))){posl=null;vycisti()}})})();
KK.auth.me().then(function(s){s?shell(s):login()});
})();
