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
   '<label class="f">Přihlašovací jméno nebo e-mail<input class="inp" name="u" autocomplete="username" required></label><br>'+
   '<label class="f">Heslo<input class="inp" name="p" type="password" autocomplete="current-password" required aria-describedby="lh"><small id="lh">První přihlášení v náhledu: <b>admin</b> / <b>kemp</b> – heslo si pak změňte.</small></label>'+
   '<p class="err-msg" role="alert" hidden></p><br><button class="btn pri" style="width:100%">Přihlásit se</button></form></div>';
  var f=$('form',app),er=$('.err-msg',app);
  f.addEventListener('submit',function(e){e.preventDefault();er.hidden=true;
    KK.auth.login(f.u.value.trim(),f.p.value).then(function(s){var j=KK.auth.meSync();if(j&&j.vychozi)history.replaceState(null,'','#ucet');shell(j||s)}).catch(function(x){er.textContent=x.message;er.hidden=false;f.p.setAttribute('aria-invalid','true');f.p.focus()})});
  f.u.focus();
}

/* ---------- jazyk úprav (čeština = originál, ostatní = překlad) ---------- */
function jazykAdm(){var j=KK.LS.get('admin-jazyk','cs');return KK.JAZYKY[j]?j:'cs'}
function jazykVolba(){var j=jazykAdm();return '<div class="row jz" role="group" aria-label="Jazyk úprav">'+Object.keys(KK.JAZYKY).map(function(k){return '<button type="button" class="btn sm gh" data-jz="'+k+'" aria-pressed="'+(k===j)+'">'+KK.JAZYKY[k]+'</button>'}).join('')+'</div>'}
function jazykKlik(m){$$('[data-jz]',m).forEach(function(b){b.addEventListener('click',function(){if(b.dataset.jz===jazykAdm())return;if(neulozeno&&neulozeno()&&!confirm('Máte neuložené změny. Přepnout jazyk bez uložení?'))return;KK.LS.set('admin-jazyk',b.dataset.jz);neulozeno=null;route()})})}

/* ---------- kostra ---------- */
var VIEWS={upravit:upravit,prehled:prehled,galerie:galerie,seo:seo,cenik:cenik,rezervace:rezervace,nastaveni:nastaveni,uzivatele:uzivatele,ucet:ucet};
var NAV=[['Web',[['prehled','Přehled'],['upravit','Upravit web'],['galerie','Galerie'],['seo','SEO']]],['Provoz',[['rezervace','Rezervace'],['cenik','Ceník a kapacity']]],['Systém',[['nastaveni','Nastavení a záloha'],['uzivatele','Uživatelé'],['ucet','Můj účet']]]];
function shell(s){
  app.innerHTML='<div class="top"><div class="logo"><i>'+SV(IC.lode,20)+'</i>Administrace</div><button type="button" id="mb" aria-label="Otevřít menu" aria-expanded="false" aria-controls="side">'+SV(IC.menu,22)+'</button></div>'+
  '<div class="app"><nav class="side" id="side" aria-label="Administrace"><div class="logo"><i>'+SV(IC.lode,22)+'</i><span>Kemp Krumlov<small>Administrace</small></span></div>'+
  NAV.map(function(g){var pol=g[1].filter(function(n){return KK.auth.muze(n[0])});if(!pol.length)return '';return '<div class="nav-t">'+g[0]+'</div>'+pol.map(function(n){return '<a class="nv" href="#'+n[0]+'">'+SV(IC[n[0]],19)+n[1]+(n[2]?'<span class="soon">brzy</span>':'')+'</a>'}).join('')}).join('')+
  '<a class="nv" href="'+WEB+'" target="_blank" rel="noopener">'+SV(IC.ven,19)+'Zobrazit web</a>'+
  '<div class="who"><a href="#ucet" class="who-n"><b>'+esc(s.jmeno)+'</b><small>'+esc(KK.ROLE[s.role]||s.role)+'</small></a><button type="button" id="lo">Odhlásit</button></div></nav>'+
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
  var ja=KK.auth.meSync();if(!ja){onhashchange=null;login();return}
  if(!KK.auth.muze(v)){var prvni=['prehled','upravit','rezervace','galerie','ucet'].filter(function(x){return KK.auth.muze(x)})[0]||'ucet';if(v!==prvni){toast('Do sekce „'+(KK.SEKCE[v]||v)+'“ nemáte přístup.',1);location.replace('#'+prvni);return}}
  if(predHash&&predHash!==location.hash&&neulozeno&&neulozeno()&&!confirm('Máte neuložené změny. Opravdu odejít?')){history.replaceState(null,'',predHash);return}
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
    var R=window.KKR,rez=R&&KK.auth.muze('rezervace'),D0=function(x){var d=new Date(x+'T12:00:00');return d},ISO=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)},
      nd=new Date(),dnes=ISO(nd),DL=['neděle','pondělí','úterý','středa','čtvrtek','pátek','sobota'],DK=['Ne','Po','Út','St','Čt','Pá','So'],MG=['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'];
    var kc=function(n){return Math.round(n).toLocaleString('cs-CZ').replace(/\s/g,' ')+' Kč'};
    var h1='<div class="ph"><div><h1>Dobrý den, '+esc(jaP?jaP.jmeno.split(' ')[0]:'')+'</h1><p>Dnes je '+DL[nd.getDay()]+' '+nd.getDate()+'. '+MG[nd.getMonth()]+' '+nd.getFullYear()+'.</p></div><div class="row">'+
      (rez?'<a class="btn pri" href="#rezervace" data-rn>+ Nová rezervace</a>':'')+'<a class="btn" href="#upravit">'+SV(IC.obsah,18)+'Upravit web</a></div></div>';
    var hes=jaP&&jaP.vychozi?'':'';
    var prov='';
    if(rez){
      var A=R.vse().filter(function(x){return x.stav!=='zru'}),H=A.filter(function(x){return x.stav!=='blk'}),vyp=R.vyp();
      var mista=[].concat.apply([],R.SKUPINY.filter(function(g){return R.rezTyp(g.k)}).map(function(g){return g.c.map(function(c){return g.k+'-'+c})})).filter(function(k){return vyp.indexOf(k)<0});
      var obs=function(den){var u={};A.forEach(function(x){if(x.od<=den&&den<x.do)(x.mista||[]).forEach(function(k){u[k]=1})});return mista.filter(function(k){return u[k]}).length};
      var typ=function(t,den){var u={};A.forEach(function(x){if(x.od<=den&&den<x.do)(x.mista||[]).forEach(function(k){u[k]=1})});var L=mista.filter(function(k){return k.split('-')[0]===t});return [L.filter(function(k){return u[k]}).length,L.length]};
      var pri=H.filter(function(x){return x.od===dnes&&x.stav!=='uby'&&x.stav!=='odj'}).length,odj=H.filter(function(x){return x.do===dnes&&x.stav!=='odj'}).length,pop=H.filter(function(x){return x.stav==='pop'}).length,tu=H.filter(function(x){return x.stav==='uby'}).reduce(function(a,x){var o=x.osoby||{};return a+(o.dosp||0)+(o.dite||0)+(o.zak||0)},0);
      var o0=obs(dnes),proc=mista.length?Math.round(o0/mista.length*100):0;
      var tt=[['chatka','Chatky'],['podsad','Podsad. stany'],['teepee','Teepee']].filter(function(t){return R.rezTyp(t[0])}).map(function(t){var x=typ(t[0],dnes);return x[1]?'<span>'+t[1]+' <b>'+x[0]+'/'+x[1]+'</b></span>':''}).join('');
      var dlz=function(t,dl){return ' data-pv="'+t+'"'+(dl!=null?' data-pvd="'+dl+'"':'')};
      prov='<div class="pv-k">'+
        '<a class="card pv-s pv-big" href="#rezervace"'+dlz('dnes')+'><small>Obsazeno dnes</small><b>'+proc+' %</b><i class="pv-m"><i style="width:'+proc+'%"></i></i><span class="pv-t">'+tt+'</span></a>'+
        '<a class="card pv-s" href="#rezervace"'+dlz('dnes')+'><small>Přijíždí dnes</small><b>'+pri+'</b><span>'+(pri?pl(pri,'rezervace čeká','rezervace čekají','rezervací čeká')+' na ubytování':'nikdo')+'</span></a>'+
        '<a class="card pv-s" href="#rezervace"'+dlz('dnes')+'><small>Odjíždí dnes</small><b>'+odj+'</b><span>'+(odj?'k odhlášení':'nikdo')+'</span></a>'+
        '<a class="card pv-s'+(pop?' pv-a':'')+'" href="#rezervace"'+dlz('dnes')+'><small>Poptávky k potvrzení</small><b>'+pop+'</b><span>'+(pop?'čekají na vaši odpověď':'vše vyřízeno')+'</span></a>'+
        '<div class="card pv-s"><small>V kempu teď</small><b>'+tu+'</b><span>'+pl(tu,'ubytovaný host','ubytovaní hosté','ubytovaných hostů')+'</span></div></div>';
      var dny=[],i;for(i=0;i<14;i++){var d=new Date(nd.getFullYear(),nd.getMonth(),nd.getDate()+i,12);dny.push(d)}
      var graf='<div class="card pv-g"><div class="pv-gh"><h2>Obsazenost na 14 dní</h2><a href="#rezervace"'+dlz('kal')+'>Otevřít kalendář →</a></div><div class="pv-b">'+dny.map(function(d){var x=obs(ISO(d)),p=mista.length?Math.round(x/mista.length*100):0,we=d.getDay()%6===0;return '<div class="pv-c'+(we?' we':'')+(ISO(d)===dnes?' tod':'')+'" title="'+d.getDate()+'. '+(d.getMonth()+1)+'.: obsazeno '+x+' z '+mista.length+' míst"><span class="pv-p">'+p+'</span><i style="height:'+Math.max(2,p)+'%" class="'+(p>=90?'pl':p>=60?'st':'')+'"></i><small>'+DK[d.getDay()]+'<br>'+d.getDate()+'.</small></div>'}).join('')+'</div><p class="mut pv-lg">Procento obsazených chatek, podsadových stanů a teepee na noc.</p></div>';
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
      '<li class="'+(jaP&&jaP.vychozi?'warn':'ok')+'"><a href="#ucet"><b>Heslo</b><span>'+(jaP&&jaP.vychozi?'Výchozí – změňte ho':'Nastavené')+'</span></a></li>'+
      '<li class="ok"><a href="'+WEB+'index.html" target="_blank" rel="noopener"><b>Web</b><span>Otevřít v novém okně ↗</span></a></li></ul></div>';
    var hi='<div class="card"><h2>Poslední změny</h2>'+(h.length?'<ul class="hist">'+h.slice(0,6).map(function(x){return '<li><time>'+cas(x.kdy)+'</time><span><b>'+esc(x.co)+'</b> – '+esc(x.popis)+'</span></li>'}).join('')+'</ul>':'<p class="mut">Zatím žádné změny.</p>')+'</div>';
    m.innerHTML=hes+h1+prov+hi;
    m.addEventListener('click',function(e){var a=e.target.closest('[data-pv],[data-rn]');if(!a)return;if(a.dataset.pv)KK.LS.set('rez.tab',a.dataset.pv);if(a.hasAttribute('data-rn'))sessionStorage.setItem('kk.rez.nova','1')});
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

/* ---------- REZERVACE (kalendář obsazenosti, seznam, nastavení) ---------- */
function rezervace(m){
  var R=window.KKR,ja=KK.auth.meSync(),adm=ja.role==='admin',W=40,N=21,NW=150;
  var D0=function(s){var p=s.split('-');return new Date(+p[0],p[1]-1,+p[2])},ISO=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
  var ADD=function(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x},KR=function(s){var d=D0(s);return d.getDate()+'. '+(d.getMonth()+1)+'.'};
  var DNY=['Ne','Po','Út','St','Čt','Pá','So'],MES=['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
  var dnes=ISO(new Date()),zac=ADD(D0(dnes),-2),tab=KK.LS.get('rez.tab','dnes'),filtr='',sbal={},rozb={};
  var F0={stav:'',obd:'bud',typ:'',zdroj:'',raz:'od',od:'',do:''},F=Object.assign({},F0),q='',lim=100,posl=[];
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

  function kresli(){
    var A=R.vse(),akt=A.filter(function(r){return r.stav!=='zru'});
    box.innerHTML='<div class="rz-top"><h1>Rezervace</h1><div class="rz-seg" role="group" aria-label="Zobrazení">'+[['dnes','Dnes'],['kal','Kalendář'],['sez','Seznam'],['nas','Nastavení']].map(function(t){return '<button type="button" aria-pressed="'+(!q&&tab===t[0])+'" data-tab="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div>'+
      '<label class="rq"><span class="sr">Hledat v rezervacích</span>'+SV(IC.seo,18)+'<input type="search" id="rq" class="inp" placeholder="Hledat jméno, telefon, číslo, chatka 12, 16. 7. …" value="'+esc(q)+'" autocomplete="off"></label>'+
      '<div class="row rz-ak"><button type="button" class="btn gh" data-a="blk">Blokovat místo</button><button type="button" class="btn pri" data-a="nova">+ Nová rezervace</button></div></div>'+
      (q?vysledky(A):tab==='kal'?kal(akt):tab==='sez'?sez(A):tab==='nas'?nas():prehledDnes(akt));
    if(!dd.hidden){if(najdi(dd.dataset.id))detail(dd.dataset.id);else{dd.hidden=true}}
  }
  function prehledDnes(akt){
    var d=D0(dnes),host=akt.filter(function(r){return r.stav!=='blk'}),DL=['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'],MG=['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'];
    var podle=function(a,b){return a.od<b.od?-1:a.od>b.od?1:0};
    var ukol=function(r){var o=r.osoby||{},os=(o.dosp||0)+(o.dite||0)+(o.zak||0);
      return '<li class="ru"><button type="button" class="ru-t" data-id="'+r.id+'"><b>'+esc(r.jmeno)+'</b><small>'+esc(kratM(r))+' · '+KR(r.od)+' – '+KR(r.do)+(os?' · '+os+' os.':'')+'</small></button>'+
        (KRAT[r.stav]?'<button type="button" class="btn sm" data-qs="'+r.id+'" data-st="'+AKCE[r.stav][0]+'" aria-label="'+AKCE[r.stav][1]+' – '+esc(r.jmeno)+'">'+KRAT[r.stav]+'</button>':bdg(r.stav))+'</li>'};
    var sloupec=function(n,L,dl,nic){var M=6,cel=rozb[dl];return '<section class="card ruk"><h2>'+n+'<span>'+L.length+'</span></h2>'+(L.length?'<ul>'+(cel?L:L.slice(0,M)).map(ukol).join('')+'</ul>'+(L.length>M?'<button type="button" class="ru-v" data-dl="'+dl+'" aria-expanded="'+!!cel+'">'+(cel?'Zobrazit méně':'Zobrazit všech '+L.length)+'</button>':''):'<p class="mut">'+nic+'</p>')+'</section>'};
    var poc={},G=skupiny(),mapa=G.map(function(g){
      var t=g.c.map(function(c){var k=g.k+'-'+c,r=akt.filter(function(r){return (r.mista||[]).indexOf(k)>=0&&r.od<=dnes&&dnes<r.do})[0],cis='<span class="rn-c">'+(g.k==='teepee'?'T':c)+'</span>';
        poc[g.k]=poc[g.k]||[0,0];poc[g.k][1]++;
        if(!r&&R.vyp().indexOf(k)>=0){poc[g.k][1]--;return '<div class="rn off" aria-label="'+esc(R.nazev(k))+', vypnuto z rezervace">'+cis+'<b>vypnuto</b></div>'}
        if(!r)return '<button type="button" class="rn vol" data-m=""'+k+'" data-nm="'+k+'" aria-label="'+esc(R.nazev(k))+', volno">'+cis+'<b>volno</b></button>';
        poc[g.k][0]++;var tu=r.stav==='uby'||r.stav==='blk',o=r.osoby||{},os=(o.dosp||0)+(o.dite||0)+(o.zak||0);
        return '<button type="button" draggable="true" class="rn '+(r.stav==='blk'?'blk':tu?'obs':r.stav==='pop'?'popt':'ceka')+'" data-m="'+k+'" data-id="'+r.id+'" title="'+esc(r.jmeno+' · '+R.nazev(k)+' · '+KR(r.od)+' – '+KR(r.do)+(os?' · '+os+' os.':'')+' · '+R.STAVY[r.stav])+'" aria-label="'+esc(R.nazev(k)+', '+r.jmeno+', '+R.STAVY[r.stav]+', do '+KR(r.do))+'">'+cis+'<b>'+esc(r.jmeno)+'</b><small>'+(r.stav==='blk'?'blokace do '+KR(r.do):'do '+KR(r.do)+'')+'</small>'+(!tu&&r.od===dnes?'<em>přijíždí dnes</em>':'')+'</button>'}).join(''),vol=(t.match(/class="rn vol"/g)||[]).length;
      return '<div class="rn-s"><h3>'+g.n+'<span>'+(vol?'volné '+vol+' z '+g.c.length:'plno')+'</span></h3><div class="rn-g">'+t+'</div></div>'}).join('');
    var souhrn=[['chatka','chatky'],['podsad','podsadové stany'],['teepee','teepee']].map(function(t){var x=poc[t[0]]||[0,0];return t[1]+' '+x[0]+' z '+x[1]}).join(' · ');
    return '<p class="rz-dat"><b>'+DL[d.getDay()]+' '+d.getDate()+'. '+MG[d.getMonth()]+'</b> Obsazeno: '+souhrn+'</p>'+
      '<section class="rn-w"><div class="rn-hd"><h2>Kdo kde dnes je</h2><span class="rn-leg" aria-hidden="true"><i class="obs"></i>ubytovaný<i class="ceka"></i>potvrzená<i class="popt"></i>poptávka<i class="vol"></i>volno<i class="blk"></i>blokace</span></div>'+'<div class="rn-sg">'+mapa+'</div>'+
      '<p class="mut rn-p">Hosta přestěhujete přetažením na jiné místo. Kliknutím na volné místo založíte rezervaci.</p></section>'+
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
    h+='<div class="rk-g st"><span><b>Bez čísla místa</b> počet na každou noc</span></div>';
    [['stan','Vlastní stany'],['karavan','Karavany']].forEach(function(t){
      h+='<div class="rk-r"><div class="rk-n">'+t[1]+'</div>'+iso.map(function(d){var s=0;akt.forEach(function(r){if(r.dalsi&&r.dalsi[t[0]]&&r.od<=d&&d<r.do)s+=+r.dalsi[t[0]]});return '<div class="rk-c" style="width:'+W+'px">'+(s||'')+'</div>'}).join('')+'</div>'});
    return h+'</div></div><p class="mut rk-p">Rezervaci přesunete přetažením pruhu, pořadí skupin přetažením za úchyt ⠿. Kliknutím na volné políčko založíte novou rezervaci. Den odjezdu je už volný pro dalšího hosta.</p>';
  }
  /* ---- seznam: filtry, řazení, rychlé akce ---- */
  var bez=function(t){return String(t==null?'':t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')};
  var KRAT={pop:'Potvrdit',pot:'Ubytovat',uby:'Odhlásit'};
  var typy=function(r){var t={};(r.mista||[]).forEach(function(k){t[k.split('-')[0]]=1});if(r.dalsi&&(r.dalsi.stan||r.dalsi.karavan))t.vlastni=1;return t};
  function tabulka(L,gf){
    if(!L.length)return '<div class="card rl-0"><b>Nic tu není.</b><span class="mut">Zkuste jiné období, zrušit filtry nebo hledat jinak.</span></div>';
    var mes='',h='<section class="card rl"><div class="tw-wrap"><table class="ct rlt"><thead><tr><th>Termín</th><th>Host</th><th>Telefon</th><th>Místa</th><th class="n">Osob</th><th class="n">Cena</th><th>Stav</th><th class="c"><span class="sr">Akce</span></th></tr></thead><tbody>';
    var sk={};if(gf||F.raz==='od')L.forEach(function(r){var d=D0(r.od),k=gf?gf(r):MES[d.getMonth()]+' '+d.getFullYear();sk[k]=(sk[k]||0)+1});
    L.slice(0,lim).forEach(function(r){var d=D0(r.od),mm=MES[d.getMonth()]+' '+d.getFullYear(),n=noci(r),o=r.osoby||{},os=(o.dosp||0)+(o.dite||0)+(o.zak||0),b=r.stav==='blk';
      if(gf)mm=gf(r);if((gf||F.raz==='od')&&mm!==mes){mes=mm;h+='<tr class="rl-m"><th colspan="8" scope="colgroup">'+mm+'<span>'+sk[mm]+'</span></th></tr>'}
      var zn=b?'':r.od===dnes?'<em class="rl-z pri">přijíždí dnes</em>':r.do===dnes&&r.stav!=='odj'?'<em class="rl-z odj">odjíždí dnes</em>':'';
      h+='<tr class="'+(r.stav==='zru'||r.stav==='odj'?'skr':'')+'"><td class="rl-d"><b>'+KR(r.od)+' – '+KR(r.do)+((gf||F.raz!=='od')?' '+r.do.slice(0,4):'')+'</b><small>'+n+' '+pl(n,'noc','noci','nocí')+'</small>'+zn+'</td>'+
        '<td class="rl-h"><button type="button" class="rl-j" data-id="'+r.id+'">'+esc(r.jmeno)+'</button><small>'+esc(r.cislo||'')+(r.zdroj==='web'?' · web':'')+(r.zprava?' · <span title="'+esc(r.zprava)+'">✎ poznámka</span>':'')+'</small></td>'+
        '<td class="rl-t">'+(r.telefon?'<a href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'<span class="mut">—</span>')+'</td>'+
        '<td>'+(r.mista||[]).map(function(k){return '<span class="rl-c '+k.split('-')[0]+'">'+R.nazev(k).replace('Podsadový stan','Stan')+'</span>'}).join('')+(r.dalsi&&r.dalsi.stan?'<span class="rl-c">'+r.dalsi.stan+'× vl. stan</span>':'')+(r.dalsi&&r.dalsi.karavan?'<span class="rl-c">'+r.dalsi.karavan+'× karavan</span>':'')+'</td>'+
        '<td class="n">'+(b?'':os||'—')+'</td><td class="n rl-k">'+(b?'':kc(r.cena))+'</td><td>'+bdg(r.stav)+'</td>'+
        '<td class="c">'+(KRAT[r.stav]?'<button type="button" class="btn sm" data-qs="'+r.id+'" data-st="'+AKCE[r.stav][0]+'" aria-label="'+AKCE[r.stav][1]+' – '+esc(r.jmeno)+'">'+KRAT[r.stav]+'</button>':'')+'</td></tr>'});
    return h+'</tbody></table></div>'+(L.length>lim?'<p class="rl-v"><span class="mut">Zobrazeno '+lim+' z '+L.length+'</span><button type="button" class="btn gh" data-a="vic">Zobrazit dalších '+Math.min(100,L.length-lim)+'</button></p>':'')+'</section>';
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
        '<div class="rl-fr">'+sel('typ','Typ',[['','Všechny typy'],['chatka','Chatky'],['podsad','Podsadové stany'],['teepee','Teepee'],['vlastni','Vlastní stany a karavany']])+
        sel('raz','Řadit',[['od','Podle příjezdu'],['nove','Nejnovější'],['jmeno','Podle jména']])+
        (vicF||F.zdroj||F.od||F.do?sel('zdroj','Zdroj',[['','Web i obsluha'],['web','Z webu'],['rucne','Zadala obsluha']])+
        '<label class="rl-f"><span>Pobyt od</span><input type="date" class="inp" data-f="od" value="'+F.od+'"></label><label class="rl-f"><span>do</span><input type="date" class="inp" data-f="do" value="'+F.do+'"></label>':'<button type="button" class="btn sm gh" data-a="vicf">+ Další filtry</button>')+
        (zmeneno?'<button type="button" class="btn sm gh rl-x" data-a="frst">Zrušit filtry</button>':'')+'</div>'+
        '<div class="rl-st" role="group" aria-label="Stav"><button type="button" class="rs vse'+(F.stav?'':' on')+'" data-fs="" aria-pressed="'+!F.stav+'">Všechny stavy <b>'+vse+'</b></button>'+
        Object.keys(R.STAVY).filter(function(k){return poc[k]||F.stav===k}).map(function(k){return '<button type="button" class="rs '+k+(F.stav===k?' on':'')+'" data-fs="'+k+'" aria-pressed="'+(F.stav===k)+'">'+R.STAVY[k]+' <b>'+(poc[k]||0)+'</b></button>'}).join('')+'</div></section>'+
      '<div class="rl-sum"><span><b>'+L.length+'</b> '+pl(L.length,'rezervace','rezervace','rezervací')+'</span><span><b>'+noc+'</b> '+pl(noc,'noc','noci','nocí')+'</span><span><b>'+osb+'</b> '+pl(osb,'osoba','osoby','osob')+'</span><span><b>'+kc(kcs)+'</b> celkem</span>'+(L.length?'<button type="button" class="btn sm gh" data-a="csv">'+SV('<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',16)+'Stáhnout do Excelu</button>':'')+'</div>'+tabulka(L);
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
    var ub=(window.KKC?KKC.kat('ubytovani'):[]).filter(function(p){return p.skryt!==1}),vy=R.vyp();
    var sw=function(attr,on,lab){return '<label class="rsw"><input type="checkbox" '+attr+(on?' checked':'')+(adm?'':' disabled')+' aria-label="'+esc(lab)+'"><i aria-hidden="true"></i></label>'};
    var co='<section class="card rco"><h2>Co se rezervuje</h2><p class="mut" style="margin:0 0 12px">Zapnuté typy si hosté rezervují na webu a hlídá se u nich obsazenost. U vypnutých se na webu napíše, že rezervace není potřeba a stačí přijet.</p><ul class="rco-l">'+
      ub.map(function(p){var on=p.rez!==0;return '<li class="'+(on?'on':'')+'"><span><b>'+esc(p.n)+'</b><small>'+(on?'Rezervace zapnutá':'Bez rezervace – stačí přijet')+'</small></span>'+sw('data-rt="'+p.k+'"',on,'Rezervace – '+p.n)+'</li>'}).join('')+'</ul></section>'+
      '<section class="card rco" style="margin-top:16px"><h2>Jednotlivá místa</h2><p class="mut" style="margin:0 0 12px">Vypnuté místo se hostům nenabízí a nedá se na něj rezervovat – třeba chatka pro personál nebo místo v opravě. Klikněte na číslo.</p>'+
      R.SKUPINY.filter(function(g){return R.rezTyp(g.k)}).map(function(g){return '<div class="rco-g"><small>'+g.n+'</small><div>'+g.c.map(function(c){var k=g.k+'-'+c,off=vy.indexOf(k)>=0;return '<button type="button" class="rco-m'+(off?' off':'')+'" data-vm="'+k+'" aria-pressed="'+!off+'" aria-label="'+R.nazev(k)+(off?', vypnuto':', zapnuto')+'"'+(adm?'':' disabled')+'>'+(g.k==='teepee'?'Teepee':c)+'</button>'}).join('')+'</div></div>'}).join('')+
      '<p class="mut" style="font-size:13.5px;margin:12px 0 0">Přeškrtnuté = vypnuté. Rezervace, které už na vypnutém místě jsou, zůstanou.</p></section>';
    return co+'<section class="card" style="margin-top:16px"><h2>Jak vzniká rezervace z webu</h2><p class="mut" style="margin:0 0 12px"><b>Poptávka</b>: host pošle poptávku, místo se mu hned podrží a vy ji potvrdíte nebo zrušíte. <b>Okamžitá rezervace</b>: je potvrzená hned po odeslání.</p>'+
      '<div class="tw-wrap"><table class="ct rnt"><thead><tr><th>Typ ubytování</th><th>Poptávka – potvrzuje obsluha</th><th>Okamžitá rezervace</th></tr></thead><tbody>'+
      ub.filter(function(p){return n.rezim[p.k]}).map(function(p){return [p.k,p.n,p.rez!==0]}).map(function(t){return !t[2]?'<tr class="rnt-off"><td><b>'+esc(t[1])+'</b></td><td colspan="2">Rezervace vypnutá – host jen přijede (zapnete ji výše v „Co se rezervuje“)</td></tr>':'<tr><td><b>'+esc(t[1])+'</b></td>'+['poptavka','ihned'].map(function(v){return '<td><label class="rr"><input type="radio" name="rezim-'+t[0]+'" value="'+v+'"'+(n.rezim[t[0]]===v?' checked':'')+(adm?'':' disabled')+' aria-label="'+t[1]+' – '+(v==='ihned'?'okamžitá rezervace':'poptávka')+'"><span>'+(v==='ihned'?'Hned potvrzená':'Potvrzuje obsluha')+'</span></label></td>'}).join('')+'</tr>'}).join('')+
      '</tbody></table></div><p class="mut" style="font-size:13.5px;margin:12px 0 0">Když si host vybere víc typů najednou a aspoň jeden z nich potvrzuje obsluha, přijde celá rezervace jako poptávka.</p>'+(adm?'':'<p class="mut">Změnit to smí jen správce.</p>')+'</section>'+
      '<div class="card mut" style="font-size:13.5px;margin-top:16px">'+SV(IC.zamek,16)+' V náhledu jsou rezervace uložené jen v tomto prohlížeči. Host na jiném počítači je neuvidí a jeho rezervace se k vám nedostane. Sdílená obsazenost bude fungovat po spuštění na serveru.</div>'+
      (adm?'<div class="row" style="margin-top:16px"><button type="button" class="btn gh" data-a="ukazka">Vložit testovací data</button><button type="button" class="btn gh" data-a="vymaz">Smazat všechny rezervace</button></div>':'');
  }
  function detail(id){
    var r=najdi(id);if(!r)return;var b=r.stav==='blk',ak=AKCE[r.stav],o=r.osoby||{},deti=(o.dite||0)+(o.zak||0),n=noci(r),byl=dd.hidden;
    var hist=[{t:r.vytvoreno,co:b?'Blokace vytvořena':(r.zdroj==='web'?'Vytvořeno z webu'+(r.jazyk&&r.jazyk!=='cs'?' ('+r.jazyk.toUpperCase()+')':''):'Zadala obsluha'),kdo:r.zdroj==='web'?'':r.kdo}].concat(r.hist||[]);
    dd.innerHTML='<div class="rp-h"><div><small>'+(b?'Blokace místa':'Rezervace '+esc(r.cislo||''))+'</small><h2 id="rdt" tabindex="-1">'+esc(r.jmeno)+'</h2>'+bdg(r.stav)+'</div><button type="button" class="rp-x" data-e="zav" aria-label="Zavřít detail">'+SV('<path d="M6 6l12 12M18 6L6 18"/>',18)+'</button></div>'+
      (ak?'<button type="button" class="btn pri rp-a" data-st="'+ak[0]+'">'+ak[1]+'</button>':'')+
      (b||!(r.telefon||r.email)?'':'<div class="rp-k">'+(r.telefon?'<a class="btn sm gh" href="tel:'+esc(r.telefon.replace(/\s/g,''))+'">'+esc(r.telefon)+'</a>':'')+(r.email?'<a class="btn sm gh" href="mailto:'+esc(r.email)+'">'+esc(r.email)+'</a>':'')+'</div>')+
      '<h3>Pobyt</h3><dl class="rdd"><dt>Termín</dt><dd>'+KR(r.od)+' – '+KR(r.do)+' '+r.do.slice(0,4)+'<small>'+n+' '+pl(n,'noc','noci','nocí')+'</small></dd><dt>Místa</dt><dd>'+esc(kratM(r))+'</dd>'+
      (b?'':'<dt>Osoby</dt><dd>'+(o.dosp||0)+' dosp.'+(deti?', '+deti+' '+pl(deti,'dítě','děti','dětí'):'')+'</dd><dt>Cena</dt><dd>'+kc(r.cena)+'</dd>')+'</dl>'+
      (r.zprava?'<h3>Poznámka</h3><p class="rp-n">'+esc(r.zprava)+'</p>':'')+
      '<h3>Historie</h3><ol class="rp-hi">'+hist.filter(function(h){return h.t}).map(function(h){return '<li><b>'+esc(h.co)+'</b><small>'+cas(h.t)+(h.kdo?' · '+esc(h.kdo):'')+'</small></li>'}).join('')+'</ol>'+
      '<div class="rp-f"><button type="button" class="btn sm gh" data-e="upr">Upravit</button>'+
      (b?'':r.stav==='zru'?'<button type="button" class="btn sm gh" data-st="pop">Obnovit</button>':'<button type="button" class="btn sm gh" data-st="zru">Zrušit rezervaci</button>')+
      (adm||b?'<button type="button" class="btn sm gh rp-d" data-e="del">Smazat</button>':'')+'</div>';
    dd.dataset.id=id;dd.hidden=false;
    if(byl){if(tab==='kal'&&!q){kresli();return}$('#rdt',dd).focus({preventScroll:true})}
    oznac();
  }
  dd.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var id=dd.dataset.id;
    if(b.dataset.st){try{var r=zmen(id,{stav:b.dataset.st},R.STAVY[b.dataset.st]);KK.zaznam('Rezervace',(r.cislo||'')+' '+r.jmeno+' – '+R.STAVY[r.stav]);toast('Stav: '+R.STAVY[r.stav]+'.');kresli()}catch(x){toast(x.message,1)}}
    else if(b.dataset.e==='zav')dd.close();
    else if(b.dataset.e==='upr')form(najdi(id));
    else if(b.dataset.e==='del'&&confirm('Opravdu smazat? Nejde to vrátit.')){R.smaz(id);dd.hidden=true;kresli();toast('Smazáno.')}});
  function form(r,pre){
    pre=pre||{};var b=r?r.stav==='blk':!!pre.blk,o=(r&&r.osoby)||{},d=(r&&r.dalsi)||{},num=function(n,l,v){return '<label class="f">'+l+'<input class="inp" name="'+n+'" type="number" min="0" inputmode="numeric" value="'+(v||'')+'"></label>'};
    df.innerHTML='<form method="dialog" novalidate><h2 id="rft">'+(r?(b?'Upravit blokaci':'Upravit rezervaci'):(b?'Blokovat místo':'Nová rezervace'))+'</h2><div class="rfg">'+
      '<label class="f s2">'+(b?'Důvod blokace':'Jméno hosta')+'<input class="inp" name="jmeno" required autocomplete="off"></label>'+
      (b?'':'<label class="f">Telefon<input class="inp" name="telefon" type="tel" autocomplete="off"></label><label class="f">E-mail<input class="inp" name="email" type="email" autocomplete="off"></label>')+
      '<label class="f">'+(b?'Od':'Příjezd')+'<input class="inp" name="od" type="date" required></label><label class="f">'+(b?'Do (tento den už je volno)':'Odjezd')+'<input class="inp" name="do" type="date" required></label>'+
      (b?'':num('dosp','Dospělí',o.dosp)+num('dite','Děti',(o.dite||0)+(o.zak||0))+
        '<fieldset class="f s2 rfst"><legend>Stav</legend><div class="rfst-g">'+(r&&(r.stav==='pop'||r.stav==='odj')?[r.stav,'pot','uby']:['pot','uby']).map(function(s){return '<label class="rfst-o '+s+'"><input type="radio" name="stav" value="'+s+'"><span>'+R.STAVY[s]+'</span></label>'}).join('')+'</div></fieldset>')+
      '<fieldset class="s2 rmf"><legend>Místa <small>přeškrtnutá jsou v termínu obsazená</small></legend><div id="rmm"></div></fieldset>'+
      '<label class="f s2">Poznámka<textarea class="inp" name="zprava" rows="2"></textarea></label></div>'+
      (b?'':'<div class="rfp"><div><b>Cena</b><small id="rfci"></small></div><label class="rfc"><span class="sr">Cena v Kč</span><input class="inp" name="cena" type="number" min="0" inputmode="numeric"><span>Kč</span></label></div>')+
      '<p class="err-msg" role="alert" hidden></p><div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px"><button type="button" class="btn gh" data-z>Zrušit</button><button class="btn pri">Uložit</button></div></form>';
    var f=$('form',df),er=$('.err-msg',f),vyb={};((r&&r.mista)||pre.mista||[]).forEach(function(k){vyb[k]=1});
    f.jmeno.value=r?r.jmeno:'';f.od.value=r?r.od:(pre.od||dnes);f.do.value=r?r.do:(pre.do||ISO(ADD(D0(f.od.value),1)));f.zprava.value=(r&&r.zprava)||'';
    if(!b){f.telefon.value=(r&&r.telefon)||'';f.email.value=(r&&r.email)||'';f.stav.value=r&&r.stav!=='zru'?r.stav:'pot';f.cena.value=(r&&r.cena)||''}
    var rucne=!!(r&&r.cena);
    var spocti=function(){if(b||!window.KKC)return;var od=f.od.value,dk=f.do.value,nn=od&&dk&&od<dk?Math.round((D0(dk)-D0(od))/864e5):0,q={};
      Object.keys(vyb).forEach(function(k){var t=k.split('-')[0];q[t]=(q[t]||0)+1});q.stan=+d.stan||0;q.karavan=+d.karavan||0;q.os=+f.dosp.value||0;q.dite=+f.dite.value||0;
      var sum=0;for(var i=0;i<nn;i++){var h=KKC.hlavni(ADD(D0(od),i).getMonth())?'a':'b';Object.keys(q).forEach(function(k){if(q[k]&&KKC.p(k))sum+=KKC.v(k,h)*q[k]})}
      var sl=KKC.sleva(nn),c=Math.round(sum-sum*sl),inf=nn+' '+pl(nn,'noc','noci','nocí')+(sl?' · sleva '+Math.round(sl*100)+' %':'');
      if(!rucne)f.cena.value=c||'';
      $('#rfci',f).innerHTML=!c?'Vyberte termín, místa a osoby – cena se spočítá podle ceníku.':rucne&&+f.cena.value!==c?'Zadáno ručně · podle ceníku '+kc(c)+' <button type="button" class="lnk" data-cp>Použít</button>':'Podle ceníku · '+inf};
    function mista(){var od=f.od.value,dk=f.do.value,kol={};if(od&&dk&&od<dk)R.kolize([].concat.apply([],R.SKUPINY.map(function(g){return g.c.map(function(c){return g.k+'-'+c})})),od,dk,r&&r.id).forEach(function(k){kol[k]=1});
      $('#rmm',f).innerHTML=R.SKUPINY.map(function(g){return '<div class="rmg"><small>'+g.n+'</small><div>'+g.c.map(function(c){var k=g.k+'-'+c,z=kol[k];if(z)delete vyb[k];return '<label class="rm'+(z?' z':'')+'"><input type="checkbox" value="'+k+'"'+(vyb[k]?' checked':'')+(z?' disabled':'')+' aria-label="'+R.nazev(k)+(z?', obsazeno':'')+'"><span>'+(g.k==='teepee'?'Teepee':c)+'</span></label>'}).join('')+'</div></div>'}).join('')}
    mista();spocti();f.od.addEventListener('change',function(){mista();spocti()});f.do.addEventListener('change',function(){mista();spocti()});
    $('#rmm',f).addEventListener('change',function(e){if(e.target.checked)vyb[e.target.value]=1;else delete vyb[e.target.value];spocti()});
    f.addEventListener('input',function(e){var t=e.target;if(t.name==='cena')rucne=t.value!=='';if(t.name==='cena'||t.name==='dosp'||t.name==='dite')spocti()});
    f.addEventListener('click',function(e){if(e.target.closest('[data-cp]')){rucne=false;spocti()}});
    $('[data-z]',f).addEventListener('click',function(){df.close()});
    f.addEventListener('submit',function(e){e.preventDefault();er.hidden=true;var ch=function(t,el){er.textContent=t;er.hidden=false;if(el)el.focus()};
      var z={jmeno:f.jmeno.value.trim(),od:f.od.value,do:f.do.value,mista:Object.keys(vyb),zprava:f.zprava.value.trim()};
      if(!z.jmeno)return ch(b?'Napište důvod blokace.':'Vyplňte jméno hosta.',f.jmeno);
      if(!z.od||!z.do||z.od>=z.do)return ch(b?'Konec musí být po začátku.':'Odjezd musí být po příjezdu.',f.do);
      if(b)z.stav='blk';else{z.telefon=f.telefon.value.trim();z.email=f.email.value.trim();z.osoby={dosp:+f.dosp.value||0,dite:+f.dite.value||0,zak:0};z.dalsi={stan:+d.stan||0,karavan:+d.karavan||0};z.cena=+f.cena.value||0;z.stav=f.stav.value}
      if(!z.mista.length&&(b||!(z.dalsi.stan||z.dalsi.karavan)))return ch('Vyberte aspoň jedno místo.');
      try{var x;if(r)x=zmen(r.id,z,'Upraveno');else{z.zdroj='rucne';z.kdo=ja.jmeno;x=R.pridej(z)}
        KK.zaznam('Rezervace',(x.cislo||'')+' '+x.jmeno+(r?' – upraveno':' – přidáno'));df.close();kresli();toast(b?'Blokace uložena.':'Rezervace '+x.cislo+' uložena.')}catch(q){ch(q.message)}});
    df.showModal();f.jmeno.focus();
  }
  try{if(sessionStorage.getItem('kk.rez.nova')){sessionStorage.removeItem('kk.rez.nova');setTimeout(function(){form(null)},0)}}catch(e){}
  function ukazka(){var n=R.ukazka(true);kresli();toast(n?'Vloženo '+n+' testovacích záznamů.':'Testovací data už tam jsou.')}
  box.addEventListener('click',function(e){var t=e.target,b=t.closest('button');
    if(b){var s=b.dataset;
      if(s.tab){tab=s.tab;KK.LS.set('rez.tab',tab);filtr='';q='';lim=100;kresli()}
      else if(s.qs){try{var rr=zmen(s.qs,{stav:s.st},R.STAVY[s.st]);KK.zaznam('Rezervace',(rr.cislo||'')+' '+rr.jmeno+' – '+R.STAVY[rr.stav]);kresli();toast(rr.jmeno+': '+R.STAVY[rr.stav]+'.')}catch(x){toast(x.message,1)}}
      else if(s.fs!=null){F.stav=s.fs;lim=100;kresli()}
      else if(s.fo!=null){F.obd=s.fo;F.stav='';lim=100;kresli()}
      else if(s.a==='csv'){var Q=function(v){v=String(v==null?'':v);return /[";\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
        var rows=[['Číslo','Příjezd','Odjezd','Nocí','Jméno','Telefon','E-mail','Místa','Dospělí','Děti','Cena','Stav','Zdroj','Poznámka']].concat(posl.map(function(r){var o=r.osoby||{};return [r.cislo||'',r.od,r.do,noci(r),r.jmeno,r.telefon||'',r.email||'',mistaTxt(r),o.dosp||0,(o.dite||0)+(o.zak||0),r.stav==='blk'?'':r.cena||0,R.STAVY[r.stav],r.zdroj==='web'?'web':'obsluha',r.zprava||'']}));
        var blob=new Blob(['\ufeff'+rows.map(function(x){return x.map(Q).join(';')}).join('\r\n')],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(blob),ln=document.createElement('a');ln.href=u;ln.download='rezervace-'+dnes+'.csv';document.body.appendChild(ln);ln.click();ln.remove();setTimeout(function(){URL.revokeObjectURL(u)},1000)}
      else if(s.dl){rozb[s.dl]=!rozb[s.dl];var y=b.closest('section').getBoundingClientRect().top;kresli();var bb=box.querySelector('[data-dl="'+s.dl+'"]');if(bb){var sc=bb.closest('section');if(rozb[s.dl])bb.focus({preventScroll:true});else{var dy=sc.getBoundingClientRect().top-y;if(dy)window.scrollBy(0,dy);bb.focus({preventScroll:true})}}}
      else if(s.a==='frst'){F=Object.assign({},F0);vicF=false;lim=100;kresli()}
      else if(s.a==='vic'){lim+=100;kresli()}
      else if(s.a==='qx'){q='';kresli()}
      else if(s.a==='vicf'){vicF=true;kresli()}
      else if(s.id)detail(s.id);
      else if(s.pos!=null){zac=+s.pos?ADD(zac,+s.pos):ADD(D0(dnes),-2);kresli()}
      else if(s.fl){filtr=filtr===s.fl?'':s.fl;kresli()}
      else if(s.g){sbal[s.g]=!sbal[s.g];kresli()}
      else if(s.nm)form(null,{mista:[s.nm]});
      else if(s.a==='nova')form(null);
      else if(s.a==='blk')form(null,{blk:1});
      else if(s.a==='ukazka')ukazka();
      else if(s.vm){var n=R.nast(),v=R.vyp().slice(),i=v.indexOf(s.vm);if(i<0)v.push(s.vm);else v.splice(i,1);n.vyp=v;R.ulozNast(n);KK.zaznam('Rezervace',R.nazev(s.vm)+(i<0?' vypnuto z rezervace':' zapnuto do rezervace'));toast(R.nazev(s.vm)+(i<0?' vypnuto – hosté si ho nevyberou.':' zapnuto.'));kresli()}
      else if(s.a==='vymaz'&&confirm('Opravdu smazat všechny rezervace i blokace? Nejde to vrátit.')){R.vymaz();KK.zaznam('Rezervace','vše smazáno');kresli();toast('Rezervace smazány.')}
      return}
    var rj=t.closest&&t.closest('.rlt tr');if(rj&&(rj=$('.rl-j',rj))){detail(rj.dataset.id);return}
    if(t.classList.contains('rk-t')){var d=ADD(zac,Math.floor(e.offsetX/W));form(null,{mista:[t.dataset.m],od:ISO(d),do:ISO(ADD(d,1))})}});
  /* bublina s datem pod myší (i při přetahování) + zvýraznění dne v hlavičce */
  var tip=m.appendChild(Object.assign(document.createElement('div'),{className:'rk-tip',hidden:true})),tipD=-1;
  function tipSkryj(){tip.hidden=true;if(tipD>=0){var o=$$('.rk-d',box)[tipD];if(o)o.classList.remove('hv');tipD=-1}}
  function tipUkaz(e,t,txt,i){tip.innerHTML=txt;tip.hidden=false;var w=tip.offsetWidth,x=e.clientX+14,y=e.clientY+18;if(x+w>innerWidth-8)x=e.clientX-w-10;if(y+tip.offsetHeight>innerHeight-8)y=e.clientY-tip.offsetHeight-10;tip.style.left=x+'px';tip.style.top=y+'px';
    if(i!==tipD){var D=$$('.rk-d',box);if(tipD>=0&&D[tipD])D[tipD].classList.remove('hv');if(D[i])D[i].classList.add('hv');tipD=i}}
  var den=function(d){return DNY[d.getDay()]+' '+d.getDate()+'. '+(d.getMonth()+1)+'.'};
  box.addEventListener('mousemove',function(e){if(tah)return;var t=e.target.closest&&e.target.closest('.rk-t');if(!t){tipSkryj();return}
    var i=Math.max(0,Math.min(N-1,Math.floor((e.clientX-t.getBoundingClientRect().left)/W))),d=ADD(zac,i),b=e.target.closest('.rk-b'),r=b&&najdi(b.dataset.id);
    tipUkaz(e,t,'<b>'+den(d)+' '+d.getFullYear()+'</b> · '+R.nazev(t.dataset.m)+(r?'<br>'+esc(r.jmeno)+' · '+KR(r.od)+' – '+KR(r.do)+' · '+R.STAVY[r.stav]:'<br><span>volno – kliknutím založíte rezervaci</span>'),i)});
  box.addEventListener('mouseleave',tipSkryj);
  /* přetahování: pruh rezervace na jiné místo / den, skupina na jiné pořadí */
  var tah=null,zrus=function(){$$('.dp',box).forEach(function(x){x.classList.remove('dp')})};
  function presunSkupinu(id,pred,za){var n=R.nast(),po=skupiny().map(function(g){return g.id}),i=po.indexOf(id);if(i<0||id===pred)return;po.splice(i,1);var j=po.indexOf(pred);po.splice(za?j+1:j,0,id);n.poradi2=po;R.ulozNast(n);kresli()}
  box.addEventListener('dragstart',function(e){tipSkryj();var b=e.target.closest&&e.target.closest('.rk-b,.rk-dg,.rn[data-id]');if(!b)return;
    if(b.dataset.dg)tah={g:b.dataset.dg};else if(b.classList.contains('rn'))tah={id:b.dataset.id,m:b.dataset.m,dnes:1};else{var r=najdi(b.dataset.id);if(!r)return;tah={id:r.id,m:b.parentNode.dataset.m,off:Math.floor(e.offsetX/W)+Math.max(0,-Math.round((D0(r.od)-zac)/864e5))}}
    e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',b.dataset.id||b.dataset.dg)}catch(x){}});
  box.addEventListener('dragover',function(e){if(!tah)return;var c=e.target.closest(tah.g?'.rk-g[data-gid]':tah.dnes?'.rn':'.rk-t');if(!c)return;e.preventDefault();e.dataTransfer.dropEffect='move';if(!c.classList.contains('dp')){zrus();c.classList.add('dp')}
    if(!tah.g&&!tah.dnes){var r=najdi(tah.id),i=Math.floor((e.clientX-c.getBoundingClientRect().left)/W)-tah.off,a=ADD(zac,i);if(r)tipUkaz(e,c,'<b>'+esc(r.jmeno)+'</b> → '+R.nazev(c.dataset.m)+'<br>'+den(a)+' – '+den(ADD(a,noci(r))),Math.max(0,Math.min(N-1,i)))}});
  box.addEventListener('dragend',function(){tah=null;zrus();tipSkryj()});
  box.addEventListener('drop',function(e){if(!tah)return;var T=tah;tah=null;zrus();tipSkryj();
    if(T.g){var c=e.target.closest('.rk-g[data-gid]');if(!c)return;e.preventDefault();var po=skupiny().map(function(g){return g.id});presunSkupinu(T.g,c.dataset.gid,po.indexOf(T.g)<po.indexOf(c.dataset.gid));return}
    if(T.dnes){var c2=e.target.closest('.rn'),r2=najdi(T.id);if(!c2||!r2)return;e.preventDefault();var m2=c2.dataset.m;if(m2===T.m)return;
      if((r2.mista||[]).indexOf(m2)>=0){toast('Tato rezervace už '+R.nazev(m2)+' obsahuje.',1);return}
      var nm2=r2.mista.map(function(k){return k===T.m?m2:k}),ko=R.kolize(nm2,r2.od,r2.do,r2.id);
      if(ko.length){toast(R.nazev(m2)+' je v termínu '+KR(r2.od)+' – '+KR(r2.do)+' obsazené.',1);return}
      if(!confirm('Přestěhovat hosta?\n\n'+r2.jmeno+' ('+KR(r2.od)+' – '+KR(r2.do)+')\n'+R.nazev(T.m)+' → '+R.nazev(m2)))return;
      try{var y=zmen(r2.id,{mista:nm2},'Přesun: '+R.nazev(T.m)+' → '+R.nazev(m2));KK.zaznam('Rezervace',(y.cislo||'')+' '+y.jmeno+' – přesunuto');kresli();toast(y.jmeno+': '+R.nazev(m2))}catch(q2){toast(q2.message,1)}return}
    var t=e.target.closest('.rk-t');if(!t)return;e.preventDefault();var r=najdi(T.id);if(!r)return;
    var i=Math.floor((e.clientX-t.getBoundingClientRect().left)/W)-T.off,n=noci(r),od=ISO(ADD(zac,i)),dk=ISO(ADD(zac,i+n)),m=t.dataset.m;
    if(od===r.od&&m===T.m)return;
    if(m!==T.m&&(r.mista||[]).indexOf(m)>=0){toast('Tato rezervace už '+R.nazev(m)+' obsahuje.',1);return}
    var nm=(r.mista||[]).map(function(k){return k===T.m?m:k}),kol=R.kolize(nm,od,dk,r.id);
    if(kol.length){toast('V tomto termínu je obsazeno: '+kol.map(R.nazev).join(', ')+'.',1);return}
    if(!confirm('Přesunout rezervaci?\n\n'+r.jmeno+'\n'+R.nazev(T.m)+', '+KR(r.od)+' – '+KR(r.do)+'\n→ '+R.nazev(m)+', '+KR(od)+' – '+KR(dk)))return;
    try{var x=zmen(r.id,{od:od,do:dk,mista:nm},'Přesun: '+R.nazev(m)+', '+KR(od)+' – '+KR(dk));KK.zaznam('Rezervace',(x.cislo||'')+' '+x.jmeno+' – přesunuto');kresli();toast(x.jmeno+': '+R.nazev(m)+', '+KR(od)+' – '+KR(dk))}catch(q){toast(q.message,1)}});
  box.addEventListener('keydown',function(e){var b=e.target;if(!b.dataset||!b.dataset.dg||(e.key!=='ArrowUp'&&e.key!=='ArrowDown'))return;e.preventDefault();
    var po=skupiny().map(function(g){return g.id}),i=po.indexOf(b.dataset.dg),j=i+(e.key==='ArrowUp'?-1:1);if(j<0||j>=po.length)return;presunSkupinu(b.dataset.dg,po[j],j>i);var f=$('[data-dg="'+b.dataset.dg+'"]',box);if(f)f.focus()});
  box.addEventListener('input',function(e){var t=e.target;if(t.id!=='rq')return;q=t.value.trim()?t.value:'';lim=100;var p=t.selectionStart;kresli();var n=$('#rq',box);n.focus();try{n.setSelectionRange(p,p)}catch(x){}});
  box.addEventListener('change',function(e){var t=e.target;
    if(t.id==='rkd'&&t.value){zac=ADD(D0(t.value),-2);kresli()}
    else if(t.id==='rkn'){KK.LS.set('rez.dni',+t.value);kresli()}
    else if(t.dataset.f){F[t.dataset.f]=t.value;lim=100;kresli()}
    else if(t.dataset.rt){var k=t.dataset.rt,on=t.checked;KK.cenik.nacti().then(function(c){c=c||JSON.parse(JSON.stringify(KKC.vychozi));var p=(c.polozky||[]).filter(function(x){return x.k===k})[0];if(!p){p=JSON.parse(JSON.stringify(KKC.p(k)));c.polozky.push(p)}p.rez=on?1:0;return KK.cenik.uloz(c)}).then(function(){var p=KKC.p(k);if(p)p.rez=on?1:0;KK.zaznam('Rezervace',(KKC.p(k)||{}).n+': '+(on?'rezervace zapnutá':'bez rezervace'));toast(on?'Rezervace zapnutá.':'Vypnuto – na webu bude „stačí přijet“.');kresli()}).catch(function(x){toast(x.message,1)})}
    else if(/^rezim-/.test(t.name)){var n=R.nast(),k=t.name.slice(6);n.rezim[k]=t.value;R.ulozNast(n);KK.zaznam('Rezervace','režim '+k+': '+(t.value==='ihned'?'okamžitá rezervace':'poptávka'));toast('Uloženo – platí pro nové rezervace z webu.')}});
  kresli();
}

/* ---------- NASTAVENÍ ---------- */
/* ---------- UŽIVATELÉ (jen správce) ---------- */
function datum(t){return t?new Date(t).toLocaleString('cs-CZ',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—'}
function uzivatele(m){
  return KK.uzivatele.seznam().then(function(U){
    var ja=KK.auth.meSync(),P=KK.prava.vse(),RO=Object.keys(KK.ROLE);
    var radek=function(u){var jaJ=u.id===ja.id;return '<tr data-id="'+u.id+'"'+(u.aktivni?'':' class="skr"')+'><td><b>'+esc(u.jmeno)+'</b>'+(jaJ?' <span class="badge">vy</span>':'')+(u.vychozi?' <span class="badge warn">výchozí heslo</span>':'')+'<br><small class="mut">'+esc(u.login)+(u.email?' · '+esc(u.email):'')+'</small></td>'+
      '<td><select class="inp" data-u="role" aria-label="Role – '+esc(u.jmeno)+'"'+(jaJ?' disabled title="Svou roli změnit nemůžete"':'')+'>'+RO.map(function(r){return '<option value="'+r+'"'+(u.role===r?' selected':'')+'>'+KK.ROLE[r]+'</option>'}).join('')+'</select></td>'+
      '<td class="c"><label class="sw" title="Zapnutý účet"><input type="checkbox" data-u="aktivni"'+(u.aktivni?' checked':'')+(jaJ?' disabled':'')+' aria-label="Účet zapnutý – '+esc(u.jmeno)+'"><span aria-hidden="true"></span></label></td>'+
      '<td><small class="mut">'+datum(u.posledni)+'</small></td>'+
      '<td class="c" style="white-space:nowrap"><button type="button" class="btn sm gh" data-a="upr">Upravit</button> <button type="button" class="btn sm gh" data-a="heslo">Nové heslo</button>'+(jaJ?'':' <button type="button" class="btn ic dan" data-a="del" aria-label="Smazat uživatele '+esc(u.jmeno)+'">'+SV(IC.kos,18)+'</button>')+'</td></tr>'};
    m.innerHTML='<div class="ph"><div><h1>Uživatelé</h1><p>Kdo smí do administrace a co tam smí dělat. <b>Správce</b> smí všechno včetně uživatelů, <b>Obsluha</b> jen sekce povolené níže.</p></div><button type="button" class="btn pri" id="un">+ Přidat uživatele</button></div>'+
      '<section class="card" style="margin-bottom:16px"><div class="tw-wrap"><table class="ct"><thead><tr><th>Uživatel</th><th>Role</th><th class="c">Zapnutý</th><th>Poslední přihlášení</th><th class="c"><span class="sr">Akce</span></th></tr></thead><tbody id="ul">'+U.map(radek).join('')+'</tbody></table></div></section>'+
      '<section class="card" style="margin-bottom:16px" aria-labelledby="pt"><h2 id="pt">Co smí Obsluha</h2><p class="mut">Správce smí vždy všechno. Přehled a Můj účet vidí každý.</p>'+
      '<div class="sw-l">'+Object.keys(KK.SEKCE).filter(function(k){return k!=='prehled'}).map(function(k){return '<label class="sw"><input type="checkbox" data-pr="'+k+'"'+(P.obsluha[k]?' checked':'')+'><span aria-hidden="true"></span>'+esc(KK.SEKCE[k])+'</label>'}).join('')+'</div></section>'+
      '<div class="card mut" style="font-size:13.5px">'+SV(IC.zamek,16)+' V náhledu jsou účty uložené jen v tomto prohlížeči a chrání jen před omylem. Skutečné zabezpečení (hesla na serveru, přihlášení, práva) bude po spuštění na serveru – účty se přenesou.</div>'+
      '<dialog id="ud" class="dlg" aria-labelledby="udt"><form method="dialog" id="uf" novalidate><h2 id="udt"></h2><div class="grid" style="gap:12px">'+
      '<label class="f">Jméno a příjmení<input class="inp" name="jmeno" required autocomplete="off"></label>'+
      '<label class="f">Přihlašovací jméno<small>Bez mezer a diakritiky, např. jana.novakova</small><input class="inp" name="login" required autocomplete="off" autocapitalize="none" spellcheck="false"></label>'+
      '<label class="f">E-mail<small>Nepovinné – lze se jím i přihlásit</small><input class="inp" name="email" type="email" autocomplete="off"></label>'+
      '<label class="f">Role<select class="inp" name="role">'+RO.map(function(r){return '<option value="'+r+'"'+(r==='obsluha'?' selected':'')+'>'+KK.ROLE[r]+'</option>'}).join('')+'</select></label>'+
      '<label class="f" data-heslo>Heslo<small>Aspoň 8 znaků. Předejte ho uživateli, heslo si pak může změnit v Můj účet.</small><span class="row" style="gap:8px"><input class="inp" name="heslo" type="text" autocomplete="new-password" spellcheck="false" style="flex:1"><button type="button" class="btn sm gh" id="ug">Vytvořit</button></span></label>'+
      '<p class="err-msg" role="alert" hidden></p></div><div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px"><button type="button" class="btn gh" id="uz">Zrušit</button><button class="btn pri" id="uo" value="ok">Uložit</button></div></form></dialog>';
    var dlg=$('#ud'),f=$('#uf'),er=$('.err-msg',f),edit=null;
    function otevri(u){edit=u||null;er.hidden=true;f.reset();$('#udt').textContent=u?'Upravit uživatele':'Nový uživatel';
      f.jmeno.value=u?u.jmeno:'';f.login.value=u?u.login:'';f.login.disabled=!!u;f.email.value=u?u.email:'';f.role.value=u?u.role:'obsluha';f.role.disabled=!!(u&&u.id===ja.id);
      $('[data-heslo]',f).hidden=!!u;if(!u)f.heslo.value=KK.uzivatele.heslo();
      if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');f.jmeno.focus()}
    $('#un').addEventListener('click',function(){otevri(null)});
    $('#uz').addEventListener('click',function(){dlg.close()});
    $('#ug').addEventListener('click',function(){f.heslo.value=KK.uzivatele.heslo();f.heslo.select()});
    f.addEventListener('submit',function(e){e.preventDefault();er.hidden=true;
      var z={jmeno:f.jmeno.value,login:f.login.value,email:f.email.value,role:f.role.value,heslo:f.heslo.value};
      if(z.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(z.email)){er.textContent='E-mail nevypadá správně.';er.hidden=false;f.email.focus();return}
      var pr=edit?KK.uzivatele.uprav(edit.id,{jmeno:z.jmeno,email:z.email,role:edit.id===ja.id?undefined:z.role}):KK.uzivatele.pridej(z);
      pr.then(function(u){dlg.close();toast(edit?'Uživatel upraven.':'Uživatel '+u.jmeno+' přidán. Heslo: '+z.heslo);if(edit&&edit.id===ja.id)shell(KK.auth.meSync());else route()}).catch(function(x){er.textContent=x.message;er.hidden=false})});
    var najdi=function(id){return U.filter(function(u){return u.id===id})[0]};
    $('#ul').addEventListener('change',function(e){var t=e.target,id=t.closest('tr').dataset.id,z={};z[t.dataset.u]=t.type==='checkbox'?t.checked:t.value;
      KK.uzivatele.uprav(id,z).then(function(){toast('Uloženo.');route()}).catch(function(x){toast(x.message,1);route()})});
    $('#ul').addEventListener('click',function(e){var b=e.target.closest('button[data-a]');if(!b)return;var id=b.closest('tr').dataset.id,u=najdi(id);
      if(b.dataset.a==='upr')otevri(u);
      if(b.dataset.a==='heslo'){var h=prompt('Nové heslo pro '+u.jmeno+' (aspoň 8 znaků):',KK.uzivatele.heslo());if(h==null)return;KK.uzivatele.noveHeslo(id,h).then(function(){toast('Heslo změněno: '+h);route()}).catch(function(x){toast(x.message,1)})}
      if(b.dataset.a==='del'&&confirm('Smazat uživatele '+u.jmeno+'? Tato akce nejde vrátit.'))KK.uzivatele.smaz(id).then(function(){toast('Uživatel smazán.');route()}).catch(function(x){toast(x.message,1)})});
    $$('[data-pr]',m).forEach(function(c){c.addEventListener('change',function(){var P2=KK.prava.vse();P2.obsluha[c.dataset.pr]=c.checked?1:0;KK.prava.uloz(P2).then(function(){toast('Práva obsluhy uložena.')})})});
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
  $('#im').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;if(!confirm('Nahrání zálohy přepíše současné úpravy. Pokračovat?')){e.target.value='';return}
    f.text().then(function(t){return KK.import(JSON.parse(t))}).then(function(){ZDROJ=null;toast('Záloha obnovena.')}).catch(function(x){toast(x.message||'Soubor nejde načíst.',1)});e.target.value=''});
  $('#rs').addEventListener('click',function(){if(!confirm('Opravdu smazat všechny úpravy? Nejde to vrátit.'))return;KK.reset().then(function(){toast('Vše vráceno do původní podoby.')})});
}

KK.auth.me().then(function(s){s?shell(s):login()});
})();
