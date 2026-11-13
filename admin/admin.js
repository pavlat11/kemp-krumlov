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
 fotky:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
 prehled:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
 upravit:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M11 13h6M11 16h4"/><path d="M6 13h2"/>',
 obsah:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 galerie:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 8"/>',
 seo:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 cenik:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
 rezervace:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
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
var toastT;function toast(m,err){var t=$('#toast');t.textContent=m;t.className='toast on'+(err?' err':'');clearTimeout(toastT);toastT=setTimeout(function(){t.className='toast'},3500)}
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
   '<label class="f">E-mail nebo jméno<input class="inp" name="u" autocomplete="username" value="admin" required></label><br>'+
   '<label class="f">Heslo<input class="inp" name="p" type="password" autocomplete="current-password" required aria-describedby="lh"><small id="lh">V náhledu je heslo <b>kemp</b>.</small></label>'+
   '<p class="err-msg" role="alert" hidden></p><br><button class="btn pri" style="width:100%">Přihlásit se</button></form></div>';
  var f=$('form',app),er=$('.err-msg',app);
  f.addEventListener('submit',function(e){e.preventDefault();er.hidden=true;
    KK.auth.login(f.u.value.trim(),f.p.value).then(function(s){shell(s)}).catch(function(x){er.textContent=x.message;er.hidden=false;f.p.setAttribute('aria-invalid','true');f.p.focus()})});
  f.p.focus();
}

/* ---------- jazyk úprav (čeština = originál, ostatní = překlad) ---------- */
function jazykAdm(){var j=KK.LS.get('admin-jazyk','cs');return KK.JAZYKY[j]?j:'cs'}
function jazykVolba(){var j=jazykAdm();return '<div class="row jz" role="group" aria-label="Jazyk úprav">'+Object.keys(KK.JAZYKY).map(function(k){return '<button type="button" class="btn sm gh" data-jz="'+k+'" aria-pressed="'+(k===j)+'">'+KK.JAZYKY[k]+'</button>'}).join('')+'</div>'}
function jazykKlik(m){$$('[data-jz]',m).forEach(function(b){b.addEventListener('click',function(){if(b.dataset.jz===jazykAdm())return;if(neulozeno&&neulozeno()&&!confirm('Máte neuložené změny. Přepnout jazyk bez uložení?'))return;KK.LS.set('admin-jazyk',b.dataset.jz);neulozeno=null;route()})})}

/* ---------- kostra ---------- */
var VIEWS={upravit:upravit,prehled:prehled,obsah:obsah,galerie:galerie,fotky:fotkyIkony,seo:seo,cenik:cenik,rezervace:pripravujeme,nastaveni:nastaveni};
var NAV=[['Web',[['prehled','Přehled'],['upravit','Upravit web'],['obsah','Všechny texty'],['galerie','Galerie'],['fotky','Fotky a ikony'],['seo','SEO']]],['Provoz',[['rezervace','Rezervace',1],['cenik','Ceník a kapacity']]],['Systém',[['nastaveni','Nastavení a záloha']]]];
function shell(s){
  app.innerHTML='<div class="top"><div class="logo"><i>'+SV(IC.lode,20)+'</i>Administrace</div><button type="button" id="mb" aria-label="Otevřít menu" aria-expanded="false" aria-controls="side">'+SV(IC.menu,22)+'</button></div>'+
  '<div class="app"><nav class="side" id="side" aria-label="Administrace"><div class="logo"><i>'+SV(IC.lode,22)+'</i><span>Kemp Krumlov<small>Administrace</small></span></div>'+
  NAV.map(function(g){return '<div class="nav-t">'+g[0]+'</div>'+g[1].map(function(n){return '<a class="nv" href="#'+n[0]+'">'+SV(IC[n[0]],19)+n[1]+(n[2]?'<span class="soon">brzy</span>':'')+'</a>'}).join('')}).join('')+
  '<a class="nv" href="'+WEB+'" target="_blank" rel="noopener">'+SV(IC.ven,19)+'Zobrazit web</a>'+
  '<div class="who"><span>'+esc(s.jmeno)+'</span><button type="button" id="lo">Odhlásit</button></div></nav>'+
  '<main id="main" tabindex="-1"></main></div>';
  var side=$('#side'),mb=$('#mb'),scrim=null;
  function zavri(){side.classList.remove('open');mb.setAttribute('aria-expanded','false');if(scrim){scrim.remove();scrim=null}}
  mb.addEventListener('click',function(){side.classList.add('open');mb.setAttribute('aria-expanded','true');scrim=document.body.appendChild(Object.assign(document.createElement('div'),{className:'scrim'}));scrim.onclick=zavri;$('a',side).focus()});
  side.addEventListener('click',function(e){if(e.target.closest('a.nv'))zavri()});
  $('#lo').addEventListener('click',function(){if(odejit()){KK.auth.logout().then(login)}});
  onhashchange=route;route();
}
var neulozeno=null;function odejit(){return !neulozeno||!neulozeno()||confirm('Máte neuložené změny. Opravdu odejít?')}
var predHash=null;
function route(){
  var v=(location.hash.slice(1)||'prehled').split('/')[0];if(!VIEWS[v])v='prehled';
  if(predHash&&predHash!==location.hash&&neulozeno&&neulozeno()&&!confirm('Máte neuložené změny. Opravdu odejít?')){history.replaceState(null,'',predHash);return}
  predHash=location.hash||'#prehled';neulozeno=null;
  $$('.side a.nv').forEach(function(a){if(a.getAttribute('href')==='#'+v)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  var st=$('#main'),m=st.cloneNode(false);st.replaceWith(m);m.innerHTML='<p class="mut">Načítám…</p>';KK.JAZYK='cs';
  Promise.resolve(VIEWS[v](m,v)).then(function(){var h=$('h1',m);if(h){h.tabIndex=-1;h.focus({preventScroll:true})}document.title=(h?h.textContent+' · ':'')+'Administrace · Kemp Krumlov';scrollTo(0,0)});
}
addEventListener('beforeunload',function(e){if(neulozeno&&neulozeno()){e.preventDefault();e.returnValue=''}});


/* ---------- UPRAVIT WEB (stránka přímo v administraci) ---------- */
function upravit(m){
  var sir={pc:'100%',tab:'820px',mob:'390px'},J=jazykAdm(),LQ=J==='cs'?'':'&lang='+J;
  m.innerHTML='<div class="ph" style="margin-bottom:12px"><div><h1>Upravit web</h1><p>Klikněte na text, fotku nebo ikonu a upravte je. Tlačítkem Procházet vypnete úpravy a můžete na webu normálně klikat (kroky rezervace, místa na mapě).</p></div>'+
  '<div class="row" role="group" aria-label="Velikost náhledu"><button type="button" class="btn sm gh" data-w="pc" aria-pressed="true">Počítač</button><button type="button" class="btn sm gh" data-w="tab" aria-pressed="false">Tablet</button><button type="button" class="btn sm gh" data-w="mob" aria-pressed="false">Mobil</button>'+
  '<a class="btn sm gh" href="'+WEB+'?edit=1'+LQ+'" target="_blank" rel="noopener">Nová záložka '+SV(IC.ven,14)+'</a></div></div>'+
  '<div class="row" style="margin:-4px 0 12px;gap:12px;flex-wrap:wrap">'+jazykVolba()+(J!=='cs'?'<span class="mut">Upravujete překlad – klikněte na český text a napište '+(J==='en'?'anglický':'německý')+'. Co nepřeložíte, zůstane česky.</span>':'')+'</div>'+
  '<div class="frame"><iframe id="wf" title="Web Kemp Krumlov v editačním režimu" src="'+WEB+'index.html?edit=1'+LQ+'"></iframe></div>';jazykKlik(m);
  var f=$('#wf');
  neulozeno=function(){try{return !!(f.contentWindow.KKE&&f.contentWindow.KKE.neulozeno())}catch(e){return false}};
  $$('[data-w]',m).forEach(function(b){b.addEventListener('click',function(){$$('[data-w]',m).forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});f.style.width=sir[b.dataset.w]})});
}

/* ---------- PŘEHLED ---------- */
function prehled(m){
  return Promise.all([zdroj(),KK.texty.vse(),KK.galerie.aktivni()?KK.galerie.seznam():Promise.resolve(null)]).then(function(r){
    var z=r[0],t=r[1],f=r[2]||z.fotky,nT=Object.keys(t).length,ch=seoKontrola(KK.seo.nactiSync(),z),okN=ch.filter(function(x){return x[0]==='ok'}).length,h=KK.historie();
    m.innerHTML='<div class="ph"><div><h1>Dobrý den 👋</h1><p>Tady spravujete obsah webu Kemp Krumlov. Texty upravíte přímo na webu, fotky v Galerii a vyhledávání v SEO.</p></div>'+
    '<a class="btn pri" href="#upravit">'+SV(IC.obsah,18)+'Upravovat texty na webu</a></div>'+
    '<div class="grid g4">'+
    '<a class="card stat" href="#obsah" style="text-decoration:none;color:inherit"><b>'+nT+'</b><span>'+pl(nT,'upravený text','upravené texty','upravených textů')+' z '+z.texty.length+'</span></a>'+
    '<a class="card stat" href="#galerie" style="text-decoration:none;color:inherit"><b>'+f.length+'</b><span>'+pl(f.length,'fotka','fotky','fotek')+' v galerii</span></a>'+
    '<a class="card stat" href="#seo" style="text-decoration:none;color:inherit"><b>'+okN+' / '+ch.length+'</b><span>SEO kontrol v pořádku</span></a>'+
    '<div class="card stat"><b>'+z.ceny+'</b><span>cen zamčeno – upraví se v Ceníku</span></div></div><br>'+
    '<div class="grid g2"><div class="card"><h2>Poslední změny</h2>'+(h.length?'<ul class="hist">'+h.slice(0,8).map(function(x){return '<li><time>'+cas(x.kdy)+'</time><span><b>'+esc(x.co)+'</b> – '+esc(x.popis)+'</span></li>'}).join('')+'</ul>':'<p class="mut">Zatím žádné změny.</p>')+'</div>'+
    '<div class="card soonc"><h2>Připravujeme</h2><p class="mut" style="margin:0">Další části administrace, které přijdou na řadu:</p><ul><li>Rezervace ubytování – přehled poptávek, potvrzení, kalendář obsazenosti</li><li>Ceník a kapacity – ceny v sezóně a mimo ni, počty chatek, slevy</li></ul></div></div>';
  });
}

/* ---------- OBSAH ---------- */
function obsah(m){
  var J=jazykAdm(),PR=J!=='cs';KK.JAZYK=J;
  return Promise.all([zdroj(),KK.texty.vse(),PR?KK.texty.vse('cs'):null]).then(function(r){
    var CS=r[2]||{};
    /* + texty, které vypisují skripty (mapy, animace, okolí, rezervace) – ukládají se zvlášť (KK.dtexty) */
    var dt=KK.dtexty.vse(),ul=Object.assign({},r[1]),znam={},rows=r[0].texty.slice();
    (window.KK_DTEXTY||[]).forEach(function(x){if(znam[x[1]])return;znam[x[1]]=1;rows.push({k:'d:'+x[1],sek:x[0],html:esc(x[1]),tag:x[1].length>60?'p':'span',d:1})});
    Object.keys(dt).forEach(function(t){if(!znam[t])rows.push({k:'d:'+t,sek:'web',html:esc(t),tag:'span',d:1});ul['d:'+t]=esc(dt[t])});
    if(PR){var dcs=JSON.parse(localStorage.getItem('kk.dtexty')||'{}');var VPJ=(window.KK_PREKLADY&&KK_PREKLADY[J])||{};rows=rows.map(function(x){var y=Object.assign({},x);y.cs=x.d?(dcs[x.k.slice(2)]!=null?esc(dcs[x.k.slice(2)]):x.html):(CS[x.k]!=null?CS[x.k]:x.html);var v=x.d?(VPJ.dtexty||{})[x.k.slice(2)]:(VPJ.texty||{})[x.k];if(v!=null){y.vych=1;y.html=x.d?esc(v):v}else y.html=y.cs;return y})}
    var z={texty:rows,ceny:r[0].ceny},ulozene=ul,ceka={},filtr={q:'',sek:'',upr:false,nep:false};
    neulozeno=function(){return Object.keys(ceka).length>0};
    var sekce=[];z.texty.forEach(function(x){if(sekce.indexOf(x.sek)<0)sekce.push(x.sek)});
    m.innerHTML='<div class="row" style="margin-bottom:14px;gap:12px;flex-wrap:wrap">'+jazykVolba()+(PR?'<span class="mut">Překlad do jazyka '+KK.JAZYKY[J]+'. Pod každým polem je český originál; nepřeložené texty se na webu ukážou česky.</span>':'')+'</div>'+
    '<div class="ph"><div><h1>'+(PR?'Překlad – '+KK.JAZYKY[J]:'Všechny texty')+'</h1><p>Nejpohodlnější je upravovat texty přímo na webu – uvidíte je hned v místě, kde jsou. Tady najdete všechny texty pohromadě, i ty skryté (další kroky rezervace, místa v mapě kempu a v Okolí, popisky animací).</p></div>'+
    '<a class="btn pri" href="#upravit">'+SV(IC.obsah,18)+'Upravovat přímo na stránce</a></div>'+
    '<div class="card" style="margin-bottom:16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span class="badge warn">🔒 '+z.ceny+' cen</span><span class="mut" style="flex:1;min-width:240px">Ceny se tady ani v editačním režimu neupravují – budou v sekci <a href="#cenik">Ceník a kapacity</a>, aby se změnily všude naráz včetně výpočtu rezervace.</span></div>'+
    '<div class="toolbar"><label class="sr" for="oq">Hledat text</label><input id="oq" class="inp" type="search" placeholder="Hledat v textech…">'+
    '<label class="sr" for="os">Sekce</label><select id="os" class="inp" style="max-width:240px"><option value="">Všechny sekce</option>'+sekce.map(function(s){return '<option value="'+s+'">'+esc(SEK[s]||s)+'</option>'}).join('')+'</select>'+
    '<label class="row" style="font-weight:600"><input type="checkbox" id="ou" style="width:18px;height:18px;accent-color:#f4a64a"> '+(PR?'Jen přeložené':'Jen upravené')+'</label>'+(PR?'<label class="row" style="font-weight:600"><input type="checkbox" id="on" style="width:18px;height:18px;accent-color:#f4a64a"> Jen nepřeložené</label>':'')+'<span class="sp"></span><span class="mut" id="oc"></span></div>'+
    '<div id="ol"></div><div class="savebar" id="sb" hidden><span id="sbt"></span><span class="row"><button type="button" class="btn sm gh" id="sbz" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.3)">Zahodit</button><button type="button" class="btn sm pri" id="sbu">Uložit změny</button></span></div>';
    var ol=$('#ol');
    function aktualni(x){return x.k in ceka?ceka[x.k]:x.k in ulozene?ulozene[x.k]:x.html}
    function kresli(){
      var q=filtr.q.toLowerCase(),n=0,html='';
      sekce.forEach(function(s){
        if(filtr.sek&&s!==filtr.sek)return;
        var rows=z.texty.filter(function(x){return x.sek===s&&(!filtr.upr||x.k in ulozene||x.k in ceka)&&(!filtr.nep||!(x.k in ulozene||x.k in ceka||x.vych))&&(!q||txt(aktualni(x)).toLowerCase().indexOf(q)>=0||txt(x.html).toLowerCase().indexOf(q)>=0)});
        if(!rows.length)return;n+=rows.length;
        html+='<section class="sec"><h2>'+esc(SEK[s]||s)+' <span class="badge">'+rows.length+'</span></h2>'+rows.map(function(x){
          var upr=x.k in ulozene,ck=x.k in ceka;
          return '<div class="tx'+(upr||ck?' upr':'')+'" data-k="'+x.k+'"><div class="ed" contenteditable="true" role="textbox" aria-multiline="'+(/^(p|li|dd|blockquote|figcaption|div)$/.test(x.tag)?'true':'false')+'" aria-label="'+esc(SEK[s]||s)+': '+esc(txt(x.html).slice(0,60))+'">'+aktualni(x)+'</div>'+
          '<div class="meta">'+(ck?'<span class="badge warn">Neuloženo</span>':upr?'<span class="badge ok">'+(PR?'Přeloženo':'Upraveno')+'</span>':PR?(x.vych?'<span class="badge">Výchozí překlad</span>':'<span class="badge">Nepřeloženo</span>'):'')+
          ((upr||ck)?'<button type="button" class="btn sm gh" data-a="puv">'+(PR?'Smazat překlad':'Vrátit původní')+'</button>':'')+
          (x.d?'<span class="mut" style="font-size:12.5px" title="Text vypisuje mapa, animace nebo krok rezervace. Změní se všude, kde je stejný.">mapa / animace</span>':'<a class="btn sm gh" href="'+WEB+'?edit=1'+(PR?'&lang='+J:'')+'#t='+x.k+'" target="_blank" rel="noopener" aria-label="Ukázat na webu">Na webu '+SV(IC.ven,14)+'</a>')+'</div>'+
          (PR?'<div class="orig">Česky: '+esc(txt(x.cs))+'</div>':(upr||ck)?'<div class="orig">Původně: <s>'+esc(txt(x.html))+'</s></div>':'')+'</div>'}).join('')+'</section>';
      });
      ol.innerHTML=html||'<div class="empty card">Nic neodpovídá hledání.</div>';
      $('#oc').textContent=n+' '+pl(n,'text','texty','textů');lista();
    }
    function lista(){var n=Object.keys(ceka).length;$('#sb').hidden=!n;$('#sbt').textContent=n+' '+pl(n,'neuložená změna','neuložené změny','neuložených změn')}
    ol.addEventListener('input',function(e){var ed=e.target.closest('.ed');if(!ed)return;var row=ed.closest('.tx'),k=row.dataset.k,x=z.texty.find(function(y){return y.k===k});
      var h=KK.cisti(ed.innerHTML),puv=k in ulozene?ulozene[k]:x.html;if(h===puv)delete ceka[k];else ceka[k]=h;row.classList.toggle('upr',k in ceka||k in ulozene);lista()});
    ol.addEventListener('keydown',function(e){var ed=e.target.closest('.ed');if(ed&&e.key==='Enter'&&(!e.shiftKey||ed.getAttribute('aria-multiline')==='false')){e.preventDefault();ed.blur()}});
    ol.addEventListener('paste',function(e){if(!e.target.closest('.ed'))return;e.preventDefault();document.execCommand('insertText',false,(e.clipboardData.getData('text/plain')||'').replace(/\s*\n\s*/g,' '))});
    ol.addEventListener('focusout',function(e){var ed=e.target.closest('.ed');if(ed&&!txt(ed.innerHTML)){var k=ed.closest('.tx').dataset.k,x=z.texty.find(function(y){return y.k===k});ed.innerHTML=k in ulozene?ulozene[k]:x.html;delete ceka[k];lista();toast('Text nemůže zůstat prázdný.',1)}});
    ol.addEventListener('click',function(e){var b=e.target.closest('[data-a=puv]');if(!b)return;var k=b.closest('.tx').dataset.k;
      if(!(k in ulozene)){delete ceka[k];kresli();return}
      ceka[k]=z.texty.find(function(y){return y.k===k}).html;kresli();toast('Původní text připraven – nezapomeňte uložit.')});
    $('#oq').addEventListener('input',function(e){filtr.q=e.target.value;kresli()});
    $('#os').addEventListener('change',function(e){filtr.sek=e.target.value;kresli()});
    $('#ou').addEventListener('change',function(e){filtr.upr=e.target.checked;kresli()});
    if(PR)$('#on').addEventListener('change',function(e){filtr.nep=e.target.checked;kresli()});
    jazykKlik(m);
    $('#sbz').addEventListener('click',function(){ceka={};kresli()});
    $('#sbu').addEventListener('click',function(){var zm={},zd={};Object.keys(ceka).forEach(function(k){var x=z.texty.find(function(y){return y.k===k});
        if(x.d){var o=k.slice(2),v=txt(ceka[k]).replace(/\s+/g,' ').trim();zd[o]=v===o?null:v}else zm[k]=ceka[k]===x.html?null:ceka[k]});
      Promise.all([KK.texty.uloz(zm),KK.dtexty.uloz(zd)]).then(function(rr){var t=Object.assign({},rr[0]);Object.keys(rr[1]).forEach(function(o){t['d:'+o]=esc(rr[1][o])});ulozene=t;var n=Object.keys(ceka).length;ceka={};kresli();toast('Uloženo – '+n+' '+pl(n,'změna','změny','změn')+'. Na webu se projeví po obnovení stránky.')}).catch(function(){toast('Uložení se nepovedlo.',1)})});
    kresli();
  });
}

/* ---------- FOTKY A IKONY NA WEBU ---------- */
function fotkyIkony(m){
  var urls=[];
  return Promise.all([KK.obrazky.soubor.vse().catch(function(){return[]})]).then(function(r){
    var soub={};r[0].forEach(function(o){var u=URL.createObjectURL(o.blob);urls.push(u);soub[o.id]=u});
    var F=window.KK_FOTKY||[],O=KK.obrazky.vse(),I=KK.ikony.vse();
    var nI=Object.keys(I).length,nO=Object.keys(O).length;
    function nahled(c){var z=O[c];return z&&soub[z.id]?soub[z.id]:WEB+c}
    m.innerHTML='<div id="fw"><div class="ph"><div><h1>Fotky a ikony</h1><p>Fotky v sekcích webu (mimo galerii) a ikony. Fotku i ikonu nejsnáz změníte přímo na stránce: v <a href="#upravit">Upravit web</a> na ni klikněte.</p></div>'+
      '<a class="btn pri" href="#upravit">'+SV(IC.obsah,18)+'Upravit na stránce</a></div>'+
      '<section class="sec"><h2>Fotky v sekcích <span class="badge">'+F.length+'</span>'+(nO?' <span class="badge ok">'+nO+' '+pl(nO,'nahrazená','nahrazené','nahrazených')+'</span>':'')+'</h2>'+
      '<p class="mut" style="margin-top:-6px">Fotky v galerii se spravují v sekci <a href="#galerie">Galerie</a>. Nová fotka se zmenší na max. 2200 px; výřez na webu zůstane stejný jako u původní, proto volte podobný formát (na šířku).</p>'+
      '<div class="ggrid" id="fg">'+F.map(function(f,i){var c=f[1],z=!!O[c];return '<div class="gc'+(z?' sel':'')+'" data-c="'+esc(c)+'"><div class="im" style="cursor:default;background-image:url(&quot;'+esc(nahled(c))+'&quot;)" role="img" aria-label="'+esc(f[2]||c)+'">'+(z?'<span class="n first">Nahrazená</span>':'')+'</div>'+
        '<div style="padding:10px 12px;display:flex;flex-direction:column;gap:8px"><b style="font-size:14px">'+esc(SEK[f[0]]||f[0])+'</b><span class="mut" style="font-size:12.5px;word-break:break-all">'+esc(f[2]||c.split('/').pop())+'</span>'+
        '<span class="row" style="gap:6px;flex-wrap:wrap"><label class="btn sm pri" style="cursor:pointer">'+SV('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',15)+'Nahradit<input type="file" accept="image/*" data-f="'+i+'" class="sr"></label>'+
        (z?'<button type="button" class="btn sm gh" data-r="'+i+'">Vrátit původní</button>':'')+'</span></div></div>'}).join('')+'</div></section>'+
      '<section class="sec"><h2>Ikony'+(nI?' <span class="badge ok">'+nI+' '+pl(nI,'změněná','změněné','změněných')+'</span>':'')+'</h2>'+
      '<p class="mut" style="margin-top:-6px">Ikonu změníte na stránce v <a href="#upravit">Upravit web</a>: klikněte na ni a vyberte jinou z knihovny. Stejné ikony na stránce se změní společně.</p>'+
      (nI?'<div class="card"><ul class="hist" id="il">'+Object.keys(I).map(function(k){return '<li><span class="row" style="gap:12px">'+SV(I[k].s,24)+'<span>'+esc(I[k].n)+'</span></span><button type="button" class="btn sm gh" data-ik="'+esc(k)+'">Vrátit původní</button></li>'}).join('')+'</ul></div>':'<div class="card mut">Zatím žádná ikona není změněná.</div>')+
      '<h3 style="margin:22px 0 10px;font-size:16px">Knihovna ikon <span class="badge">'+(window.KK_IKONY?KK_IKONY.reduce(function(a,g){return a+g[1].length},0):0)+'</span></h3>'+
      '<div class="card">'+(window.KK_IKONY||[]).map(function(g){return '<div style="margin-bottom:12px"><b class="mut" style="font-size:12px;text-transform:uppercase;letter-spacing:.04em">'+esc(g[0])+'</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">'+g[1].map(function(x){return '<span title="'+esc(x[1])+'" style="width:42px;height:42px;display:grid;place-items:center;border:1.5px solid var(--line);border-radius:10px">'+SV(x[2],22)+'<span class="sr">'+esc(x[1])+'</span></span>'}).join('')+'</div></div>'}).join('')+
      '<p class="mut" style="margin:6px 0 0;font-size:12.5px">Ikony Lucide (licence ISC).</p></div></section></div>';var fw=$('#fw');
    fw.addEventListener('change',function(e){var inp=e.target.closest('input[data-f]');if(!inp||!inp.files[0])return;var c=F[+inp.dataset.f][1],lab=inp.closest('label');lab.style.opacity='.6';
      KK.obrazky.nahraj(inp.files[0]).then(function(z){var o={};o[c]={id:z.id,v:z.v};return KK.obrazky.uloz(o)}).then(function(){return KK.obrazky.uklid()})
      .then(function(){toast('Fotka nahrazena – na webu se projeví po obnovení stránky.');route()}).catch(function(x){lab.style.opacity='';toast((x&&x.message)||'Fotku se nepodařilo nahrát.',1)})});
    fw.addEventListener('click',function(e){var b=e.target.closest('[data-r]');if(b){var o={};o[F[+b.dataset.r][1]]=null;KK.obrazky.uloz(o).then(function(){return KK.obrazky.uklid()}).then(function(){toast('Vrácena původní fotka.');route()});return}
      var k=e.target.closest('[data-ik]');if(k){var x={};x[k.dataset.ik]=null;KK.ikony.uloz(x).then(function(){toast('Vrácena původní ikona.');route()})}});
  });
}

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
      if(a==='del'&&confirm('Opravdu smazat tuto fotku?')){KK.galerie.smaz([i]).then(function(){fotky.splice(ix,1);delete vyber[i];return uloz_poradi()}).then(function(){kresli();toast('Fotka smazána.')})}
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
    $('#gd').addEventListener('click',function(){var ids=Object.keys(vyber);if(!confirm('Opravdu smazat '+ids.length+' '+pl(ids.length,'fotku','fotky','fotek')+'?'))return;KK.galerie.smaz(ids).then(function(){fotky=fotky.filter(function(f){return !vyber[f.id]});vyber={};return uloz_poradi()}).then(function(){kresli();toast('Smazáno.')})});
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
    '<div class="card"><h2>Vyhledávání</h2><p class="mut">Titulek a popis, které uvidí lidé v Googlu.</p><div class="grid">'+F('title','Titulek stránky','Co nejvýstižněji, důležitá slova na začátek.','',60)+F('description','Popis stránky','Krátké shrnutí, které láká ke kliknutí.','ta',160)+F('canonical','Hlavní adresa webu','Adresa, pod kterou má Google web vést.','url')+
    '<label class="row" style="font-weight:700"><input type="checkbox" name="index" style="width:20px;height:20px;accent-color:#f4a64a"> Povolit zobrazení ve vyhledávačích</label></div></div>'+
    '<div class="card"><h2>Sdílení na sociálních sítích</h2><p class="mut">Když nevyplníte, použije se titulek a popis z vyhledávání.</p><div class="grid">'+F('ogTitle','Titulek při sdílení','','',70)+F('ogDescription','Popis při sdílení','','ta',200)+
    '<div><b style="font-size:14px">Obrázek při sdílení</b><div class="ogpick" role="group" aria-label="Obrázek při sdílení">'+obr.map(function(o){return '<button type="button" data-og="'+esc(o)+'" style="background-image:url(\''+esc(WEB+o)+'\')" aria-label="'+esc(o)+'"></button>'}).join('')+'</div></div></div></div>'+
    '<div class="card"><h2>Údaje o kempu pro Google</h2><p class="mut">Google z nich ukazuje adresu, telefon a polohu na mapě (strukturovaná data).</p><div class="grid g2" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">'+
    F('f.nazev','Název')+F('f.telefon','Telefon','','tel')+F('f.email','E-mail','','email')+F('f.ulice','Ulice a číslo')+F('f.mesto','Město')+F('f.psc','PSČ')+F('f.lat','Zeměpisná šířka')+F('f.lng','Zeměpisná délka')+F('f.cenovaHladina','Cenové rozpětí','např. 190–990 Kč')+'</div></div>'+
    '<div class="card"><h2>Google Search Console</h2>'+F('googleVerify','Ověřovací kód','Z Google Search Console → Ověření vlastnictví → značka HTML (jen hodnota content).')+'</div>'+
    '</div><div class="grid" style="align-content:start;position:sticky;top:20px"><div class="card seo-pre"><h2>Náhled v Googlu</h2><div class="serp" aria-hidden="true"><div class="u"><i>K</i><span><b style="font-weight:400">Kemp Krumlov</b><br><span id="pu"></span></span></div><div class="t" id="pt"></div><div class="d" id="pd"></div></div>'+
    '<h2 style="margin-top:6px">Náhled při sdílení</h2><div class="og" aria-hidden="true"><div class="im" id="oi"></div><div class="bx"><small id="ou2"></small><b id="ot"></b><span id="od"></span></div></div></div>'+
    '<div class="card"><h2>Kontrola</h2><ul class="chk" id="ck"></ul></div>'+
    '<div class="row"><button class="btn pri" type="submit">Uložit SEO</button><button class="btn gh" type="button" id="sr">Obnovit výchozí</button></div></div></form>';
    var f=$('#sf');
    function nastav(){['title','description','canonical','ogTitle','ogDescription','googleVerify'].forEach(function(k){f.elements[k].value=s[k]||''});f.elements.index.checked=s.index!==false;
      Object.keys(s.firma).forEach(function(k){var e=f.elements['f.'+k];if(e)e.value=s.firma[k]||''});}
    function cti(){['title','description','canonical','ogTitle','ogDescription','googleVerify'].forEach(function(k){s[k]=f.elements[k].value.trim()});s.index=f.elements.index.checked;Object.keys(s.firma).forEach(function(k){var e=f.elements['f.'+k];if(e)s.firma[k]=e.value.trim()})}
    function nahled(){cti();
      $('#pu').textContent=(s.canonical||'').replace(/^https?:\/\//,'').replace(/\/$/,'')||'kemp-krumlov.cz';
      $('#pt').textContent=(s.title||'').length>60?s.title.slice(0,58)+'…':s.title;$('#pd').textContent=(s.description||'').length>160?s.description.slice(0,157)+'…':s.description;
      $('#ot').textContent=s.ogTitle||s.title;$('#od').textContent=s.ogDescription||s.description;$('#ou2').textContent=(s.canonical||'').replace(/^https?:\/\//,'').split('/')[0];
      $('#oi').style.backgroundImage=s.ogImage?'url(\''+WEB+s.ogImage+'\')':'none';
      $$('.ogpick button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.og===s.ogImage))});
      $$('.cnt',f).forEach(function(c){var n=f.elements[c.dataset.c].value.length,mx=+c.dataset.max;c.textContent=n+' / '+mx+' znaků';c.className='cnt '+(n===0?'':n<=mx?'ok':n<=mx*1.15?'warn':'err')});
      $('#ck').innerHTML=seoKontrola(s,z).map(function(x){return '<li class="'+x[0]+'"><i>'+(x[0]==='ok'?'✓':'!')+'</i>'+esc(x[1])+'</li>'}).join('');
    }
    f.addEventListener('input',function(){zm=true;nahled()});
    f.addEventListener('click',function(e){var b=e.target.closest('[data-og]');if(b){s.ogImage=b.dataset.og;zm=true;nahled()}});
    f.addEventListener('submit',function(e){e.preventDefault();cti();if(!s.title){toast('Titulek nesmí být prázdný.',1);f.elements.title.focus();return}
      KK.seo.uloz(JSON.parse(JSON.stringify(s))).then(function(){zm=false;toast('SEO uloženo.')})});
    $('#sr').addEventListener('click',function(){if(!confirm('Vrátit všechny SEO údaje na výchozí hodnoty?'))return;s=JSON.parse(JSON.stringify(KK.SEO_VYCHOZI));nastav();nahled();zm=true});
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
    function kresli(){
      var o=md(C.sezona.otevrenoOd),d=md(C.sezona.otevrenoDo),HZ=C.sezona.hlavniZap!==false,CR=C.sezona.celorocne===true;
      var h='<div class="row" style="margin-bottom:14px;gap:12px;flex-wrap:wrap">'+jazykVolba()+(PR?'<span class="mut">Překlad názvů a poznámek do jazyka '+KK.JAZYKY[J]+'. Prázdné pole = použije se šedý návrh (výchozí překlad), případně čeština. Ceny jsou pro všechny jazyky stejné.</span>':'')+'</div>'+
      '<div class="ph"><div><h1>Ceník a kapacity'+(PR?' – '+KK.JAZYKY[J]:'')+'</h1><p>Jediné místo, kde se mění ceny. Projeví se všude na webu – v úvodu, u ubytování, v ceníku, na mapě kempu a u dopravy – a také ve výpočtu rezervace.</p></div>'+
      '<div class="row"><a class="btn gh" href="'+WEB+'#ubytovani" target="_blank" rel="noopener">Zobrazit web '+SV(IC.ven,16)+'</a><button type="button" class="btn dan" id="cr">Obnovit výchozí ceník</button></div></div>'+
      '<div class="grid g2" style="margin-bottom:16px"><div class="card"><h2>Sezóna</h2><p class="mut">Kdy je kemp otevřený a jestli platí vyšší ceny v hlavní sezóně.</p>'+
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
      h+='<section class="card ck" style="margin-bottom:16px"><div class="row" style="margin-bottom:6px"><h2 style="margin:0">Služby v kempu</h2><span class="badge">text</span><span class="sp"></span><button type="button" class="btn sm pri" id="sva">+ Přidat službu</button></div>'+
        '<p class="mut" style="margin:0 0 12px">Jen text do ceníku na webu (např. sprcha, úschovna). Do ceny rezervace se nepočítají, cenu napište i s jednotkou.</p>'+
        (C.sluzby.length?'<div class="tw-wrap"><table class="ct"><thead><tr><th>Služba</th><th>Cena a podmínky (text)</th><th><span class="sr">Akce</span></th></tr></thead><tbody>'+C.sluzby.map(function(x,i){return '<tr><td><input class="inp" data-sv="'+i+'" data-f="'+pole('n')+'" value="'+esc(hod(x,'n'))+'"'+ph(x,'n')+' aria-label="Název služby'+(PR?' – '+KK.JAZYKY[J]:'')+'"></td><td><input class="inp" data-sv="'+i+'" data-f="'+pole('t')+'" value="'+esc(hod(x,'t'))+'"'+(PR?ph(x,'t'):' placeholder="např. 20 Kč / 4 min"')+' aria-label="Cena a podmínky – '+esc(x.n)+'"></td><td class="c"><button type="button" class="btn ic dan" data-svd="'+i+'" aria-label="Smazat službu – '+esc(x.n)+'">'+SV(IC.kos,18)+'</button></td></tr>'}).join('')+'</tbody></table></div>':'<p class="mut">Žádné služby – v ceníku na webu se sekce nezobrazí.</p>')+'</section>';
      Object.keys(C.kategorie).forEach(function(kat){
        var K=C.kategorie[kat],pol=C.polozky.filter(function(p){return p.kat===kat}),dva=K.sloupce.length>1&&HZ,SL=dva||K.sloupce.length<2?K.sloupce:['Cena'],ub=kat==='ubytovani',dop=kat==='doplnky',slu=kat==='sluzby',rez=ub||dop,lod=kat==='lode',dpr=kat==='doprava',oso=kat==='osoby';
        h+='<section class="card ck" style="margin-bottom:16px"><div class="row" style="margin-bottom:10px"><h2 style="margin:0">'+esc(K.n)+'</h2><span class="sp"></span>'+(K.pevne?'<span class="badge">pevné položky</span>':'<button type="button" class="btn sm pri" data-add="'+kat+'">+ Přidat položku</button>')+'</div>'+
        (dop?'<p class="mut" style="margin:-4px 0 12px">Doplňky se zaškrtnutím „V rezervaci“ si host může přidat v kroku Doplňky.</p>':'')+(oso?'<p class="mut" style="margin:-4px 0 12px">Nová skupina (např. senior, ZTP) se objeví v rezervaci v kroku Kdo jede a v ceníku.</p>':'')+(dpr?'<p class="mut" style="margin:-4px 0 12px">Pořadí = pořadí míst na řece po proudu (shora dolů). Kemp leží mezi Centrem a Zlatou Korunou. Nové místo se na mapě dopravy objeví mezi sousedy v seznamu.</p>':'')+(ub?'<p class="mut" style="margin:-4px 0 12px">Lůžka = kolik osob se vejde do jedné jednotky (prázdné = vlastní spaní, např. stan nebo karavan).</p>':'')+
        '<div class="tw-wrap"><table class="ct"><thead><tr><th>Název</th><th>Poznámka</th>'+SL.slice(0,dva?2:1).map(function(c){return '<th class="n">'+esc(c)+'</th>'}).join('')+(ub?'<th class="n">Lůžek</th>':'')+(lod?'<th class="n">Osob</th>':'')+(slu?'<th>Za</th>':'')+(rez?'<th>V rezervaci</th>':'')+'<th><span class="sr">Akce</span></th></tr></thead><tbody>'+
        pol.map(function(p){var i=C.polozky.indexOf(p),fix=K.pevne||POUZITO[p.k]||/^dop\d|^(kanoe|raft)/.test(p.k);
          return '<tr class="'+(p.skryt===1?'skr':'')+'"><td><input class="inp" data-i="'+i+'" data-f="'+pole('n')+'" value="'+esc(hod(p,'n'))+'"'+ph(p,'n')+' aria-label="Název'+(PR?' – '+KK.JAZYKY[J]:'')+'"'+(PR?'':' required')+'></td><td><input class="inp" data-i="'+i+'" data-f="'+pole('pozn')+'" value="'+esc(hod(p,'pozn'))+'"'+ph(p,'pozn')+' aria-label="Poznámka u '+esc(p.n)+(PR?' – '+KK.JAZYKY[J]:'')+'"></td>'+
          '<td class="n"><label class="kc"><input class="inp num" type="number" min="0" step="10" data-i="'+i+'" data-f="a" value="'+(p.a||0)+'" aria-label="'+esc(p.n)+' – '+esc(SL[0])+'"> Kč</label></td>'+
          (dva?'<td class="n"><label class="kc"><input class="inp num" type="number" min="0" step="10" data-i="'+i+'" data-f="b" value="'+(p.b==null?p.a:p.b)+'" aria-label="'+esc(p.n)+' – '+esc(K.sloupce[1])+'"> Kč</label></td>':'')+
          (lod?'<td class="n"><input class="inp num" type="number" min="1" max="12" data-i="'+i+'" data-f="osob" value="'+(p.osob||'')+'" aria-label="Osob – '+esc(p.n)+'"></td>':'')+(ub?'<td class="n"><input class="inp num" type="number" min="0" max="50" data-i="'+i+'" data-f="luzka" value="'+(p.luzka||'')+'" aria-label="Lůžek – '+esc(p.n)+'"></td>':'')+
          (slu?'<td><input class="inp" data-i="'+i+'" data-f="'+pole('jed')+'" value="'+esc(hod(p,'jed'))+'" aria-label="Jednotka – '+esc(p.n)+'"'+(PR?ph(p,'jed'):' placeholder="den, osoba…"')+'></td>':'')+
          (rez?'<td class="c"><input type="checkbox" class="cb" data-i="'+i+'" data-f="rez"'+(p.rez!==0?' checked':'')+' aria-label="Nabízet v rezervaci – '+esc(p.n)+'"></td>':'')+
          '<td class="c"><span class="row" style="flex-wrap:nowrap;gap:6px;justify-content:flex-end">'+(dpr?'<button type="button" class="btn ic gh" data-mv="'+i+'" data-d="-1" aria-label="Posunout výš – '+esc(p.n)+'"'+(pol.indexOf(p)?'':' disabled')+'>'+SV('<path d="m18 15-6-6-6 6"/>',18)+'</button><button type="button" class="btn ic gh" data-mv="'+i+'" data-d="1" aria-label="Posunout níž – '+esc(p.n)+'"'+(pol.indexOf(p)<pol.length-1?'':' disabled')+'>'+SV('<path d="m6 9 6 6 6-6"/>',18)+'</button>':'')+(p.k==='os'?'':fix&&!K.pevne?'<button type="button" class="btn ic gh" data-hide="'+i+'" aria-label="'+(p.skryt===1?'Zobrazit':'Skrýt')+' – '+esc(p.n)+'" title="Cenu používá text na webu, proto ji nejde smazat – jen skrýt z ceníku a rezervace.">'+SV(p.skryt===1?IC.okoX:IC.oko,18)+'</button>':K.pevne?'':'<button type="button" class="btn ic dan" data-del="'+i+'" aria-label="Smazat – '+esc(p.n)+'">'+SV(IC.kos,18)+'</button>')+'</span></td></tr>'}).join('')+
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
      else if(b.dataset.mv){var ix=+b.dataset.mv,d=+b.dataset.d,kt=C.polozky[ix].kat,j=ix+d;while(j>=0&&j<C.polozky.length&&C.polozky[j].kat!==kt)j+=d;if(j>=0&&j<C.polozky.length){var t=C.polozky[ix];C.polozky[ix]=C.polozky[j];C.polozky[j]=t;kresli();var nb=$('[data-mv="'+j+'"][data-d="'+d+'"]',m);if(nb&&!nb.disabled)nb.focus()}}
      else if(b.dataset.del){var p=C.polozky[+b.dataset.del];if(confirm('Smazat položku „'+(p.n||'bez názvu')+'“?')){C.polozky.splice(+b.dataset.del,1);kresli()}}
      else if(b.dataset.hide){var q=C.polozky[+b.dataset.hide];if(q.skryt===1)delete q.skryt;else q.skryt=1;kresli()}
      else if(b.id==='sva'){C.sluzby.push({n:'',t:''});kresli();var si=$$('[data-sv][data-f=n]',m).pop();if(si)si.focus()}
      else if(b.dataset.svd){var sx=C.sluzby[+b.dataset.svd];if(!sx.n||confirm('Smazat službu „'+sx.n+'“?')){C.sluzby.splice(+b.dataset.svd,1);kresli()}}
      else if(b.id==='sla'){C.slevy.push({noci:(C.slevy.reduce(function(a,x){return Math.max(a,x.noci)},1))+1,proc:5});kresli()}
      else if(b.dataset.sld){C.slevy.splice(+b.dataset.sld,1);kresli()}
      else if(b.id==='sbz'){C=JSON.parse(puv);kresli()}
      else if(b.id==='cr'){if(confirm('Vrátit celý ceník na výchozí hodnoty?')){KK.cenik.obnov().then(function(){C=JSON.parse(JSON.stringify(KKC.vychozi));puv=JSON.stringify(C);kresli();toast('Ceník vrácen na výchozí.')})}}
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

/* ---------- NASTAVENÍ ---------- */
function nastaveni(m){
  m.innerHTML='<div class="ph"><div><h1>Nastavení a záloha</h1><p>Záloha obsahuje všechny upravené texty, SEO a fotky z galerie. Hodí se i pro přenesení na server.</p></div></div>'+
  '<div class="grid g2"><div class="card"><h2>Kde jsou data</h2><p><span class="badge warn">Náhled</span> Vše je uložené jen v tomto prohlížeči. Jiný počítač ani návštěvníci webu změny neuvidí.</p><p class="mut">Po spuštění na serveru se data budou ukládat do databáze a uvidí je všichni. Zálohu odsud pak jde na server nahrát.</p></div>'+
  '<div class="card"><h2>Záloha</h2><p class="mut">Stáhne soubor .json se všemi úpravami.</p><div class="row"><button class="btn pri" id="ex">Stáhnout zálohu</button><label class="btn gh" for="im">Nahrát zálohu</label><input type="file" id="im" accept=".json,application/json" hidden></div></div>'+
  '<div class="card"><h2>Začít znovu</h2><p class="mut">Smaže všechny úpravy textů, SEO i galerii a vrátí web do původní podoby.</p><button class="btn dan" id="rs">Smazat všechny úpravy</button></div></div>';
  $('#ex').addEventListener('click',function(){KK.export().then(function(d){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d)],{type:'application/json'}));a.download='kemp-krumlov-zaloha-'+new Date().toISOString().slice(0,10)+'.json';a.click();toast('Záloha stažena.')})});
  $('#im').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;if(!confirm('Nahrání zálohy přepíše současné úpravy. Pokračovat?')){e.target.value='';return}
    f.text().then(function(t){return KK.import(JSON.parse(t))}).then(function(){ZDROJ=null;toast('Záloha obnovena.')}).catch(function(x){toast(x.message||'Soubor nejde načíst.',1)});e.target.value=''});
  $('#rs').addEventListener('click',function(){if(!confirm('Opravdu smazat všechny úpravy? Nejde to vrátit.'))return;KK.reset().then(function(){toast('Vše vráceno do původní podoby.')})});
}

KK.auth.me().then(function(s){s?shell(s):login()});
})();
