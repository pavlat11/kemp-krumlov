/* =====================================================================
   Kemp Krumlov – APLIKACE PRO OBSLUHU
   Jednoduchý vzhled administrace pro účty se vzhledem „Aplikace pro obsluhu“ (Uživatelé → Upravit).
   Obsluha vidí jen dnešní práci ve svých sekcích (Ubytování, Lodě, Doprava) – žádné souhrny, ceny ani nastavení.
   Funguje na mobilu (spodní lišta) i na PC (menu vlevo). Správce si ji může prohlédnout: Uživatelé → Náhled aplikace.
   Data a změny jdou přes window.KKR stejně jako v plné administraci, každá akce se zapíše do historie rezervace.
   Adresy: #o (Přehled), #o/ubytovani, #o/pujcovna, #o/doprava
   ===================================================================== */
(function(){
'use strict';
var R,A,ja,den,box,poslSek='',slysi=false;
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var esc=function(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var D=function(s){var p=s.split('-');return new Date(+p[0],p[1]-1,+p[2])};
var I=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
var ADD=function(s,n){var d=D(s);d.setDate(d.getDate()+n);return I(d)};
var DNES=function(){return I(new Date())};
var DNY=['neděle','pondělí','úterý','středa','čtvrtek','pátek','sobota'],DNYK=['ne','po','út','st','čt','pá','so'];
var kr=function(s){if(!s)return '';var d=D(s);return d.getDate()+'. '+(d.getMonth()+1)+'.'};
var kc=function(n){return Number(n||0).toLocaleString('cs-CZ')+' Kč'};
var pl=function(n,a,b,c){return n===1?a:n>=2&&n<=4?b:c};
var sv=function(p,s){return '<svg viewBox="0 0 24 24" width="'+(s||22)+'" height="'+(s||22)+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'};
var IK={
  prehled:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  ubytovani:'<path d="M3 10l9-6 9 6"/><path d="M5 9v11h14V9"/><path d="M10 20v-5h4v5"/>',
  pujcovna:'<path d="M2 13h20c-2 4-6 5-10 5S4 17 2 13z"/><path d="M8 3l8 14"/><path d="M3 21c2 0 2-1 4.5-1s2.5 1 4.5 1 2-1 4.5-1 2.5 1 4.5 1"/>',
  doprava:'<path d="M2 6h12v10H2z"/><path d="M14 9h4l4 4v3h-8"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>',
  zpet:'<path d="M15 5l-7 7 7 7"/>',vpred:'<path d="M9 5l7 7-7 7"/>',tisk:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  tel:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  ven:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  klic:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M17 6l3 3M15 8l2 2"/>',
  sipven:'<path d="M7 17L17 7"/><path d="M9 7h8v8"/>',dovnitr:'<path d="M17 7L7 17"/><path d="M15 17H7V9"/>',seznam:'<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',kal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',dost:'<path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/>',
  hledat:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',ok:'<path d="M5 12l5 5 9-10"/>',zprava:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',lide:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.2 3.2 0 0 1 0 6.2M21 20c0-2.8-1.7-5.1-4-5.8"/>'
};
var MOD={ubytovani:{n:'Ubytování',c:'u'},pujcovna:{n:'Lodě',c:'l'},doprava:{n:'Doprava',c:'d'}};

/* ---------- data jednoho dne ---------- */
var akt=function(){return R.vse().filter(function(r){return r.stav!=='zru'&&r.stav!=='blk'})};
var sLod=function(r){return !!(r.lode&&R.lodePocet(r.lode))};
var posD=function(r){var d=R.lodeDny(r.lode);return d[d.length-1]};
var maMisto=function(r){return !!((r.mista||[]).length||(r.dalsi&&(+r.dalsi.stan||+r.dalsi.karavan)))};
var venK=function(r){return Object.keys(R.lodeVen(r)).length>0};
var dopDen=function(r){return r.doprava.den||(sLod(r)?r.lode.den:r.od)};
var vyzDen=function(r){return r.vyzved.den||(sLod(r)?posD(r):r.od)};
var poradiM=function(k){return R.mistaReky().map(function(x){return x.k}).indexOf(k)};
var cas=function(a,b){return (a||'99').localeCompare(b||'99','cs',{numeric:true})};
function jizdy(L,kl){var m={};L.forEach(function(r){var v=r[kl],k=v.misto+'|'+(v.cas||'');var g=m[k]=m[k]||{kl:kl,misto:v.misto,cas:v.cas||'',L:[],osob:0,aut:0,kusy:{}};g.L.push(r);g.osob+=+v.osob||0;g.aut+=R.aut(v.osob);
    /* lodě, které jedou s lidmi na start / čekají v cíli na odvoz */
    if(sLod(r)&&(kl==='doprava'?r.lode.odkud===v.misto:r.lode.kam===v.misto))Object.keys(r.lode.kusy).forEach(function(t){g.kusy[t]=(g.kusy[t]||0)+(+r.lode.kusy[t]||0)})});
  return Object.keys(m).map(function(k){var g=m[k];g.hot=g.L.every(function(r){return r[kl].hotovo});return g})}
function data(x){var L=akt(),o={},dn=DNES();
  o.pri=L.filter(function(r){return maMisto(r)&&r.od===x});
  o.odj=L.filter(function(r){return maMisto(r)&&r.do===x});
  o.ted=L.filter(function(r){return maMisto(r)&&r.od<=x&&x<r.do});
  o.vyd=L.filter(function(r){return sLod(r)&&r.lode.den===x});
  o.vra=L.filter(function(r){return sLod(r)&&((posD(r)===x&&(r.lode.vydano||r.lode.den<x))||(x===dn&&r.lode.vydano&&posD(r)<x&&venK(r)))});
  o.jiz=jizdy(L.filter(function(r){return r.doprava&&r.doprava.misto&&r.doprava.misto!=='kemp'&&dopDen(r)===x}),'doprava');
  o.vyz=jizdy(L.filter(function(r){return r.vyzved&&r.vyzved.misto&&r.vyzved.misto!=='kemp'&&vyzDen(r)===x}),'vyzved');
  var ser=function(a,b){return cas(a.doprava&&a.doprava.cas,b.doprava&&b.doprava.cas)||String(a.jmeno).localeCompare(String(b.jmeno),'cs')};
  o.vyd.sort(ser);o.vra.sort(function(a,b){return cas(a.vyzved&&a.vyzved.cas,b.vyzved&&b.vyzved.cas)||String(a.jmeno).localeCompare(String(b.jmeno),'cs')});
  return o}
var HOT={pri:function(r){return r.stav==='uby'||r.stav==='odj'},odj:function(r){return r.stav==='odj'},vyd:function(r){return !!r.lode.vydano},vra:function(r){return !!r.lode.vydano&&!venK(r)}};
var zbyva=function(L,k){return L.filter(function(r){return !HOT[k](r)}).length};

/* ---------- popisky ---------- */
var mistoKr=function(r){var m=r.mista||[];if(m.length){var p=m[0].split('-'),t={chatka:'chatka',podsad:'stan',teepee:'teepee'}[p[0]]||p[0];return {t:t,n:p[0]==='teepee'?'':p[1],vic:m.length-1}}
  var d=r.dalsi||{};return d.karavan?{t:'karavan',n:'',vic:0}:{t:'vl. stan',n:+d.stan>1?d.stan+'×':'',vic:0}};
var mistaTxt=function(r){var a=(r.mista||[]).map(R.nazev),d=r.dalsi||{};if(+d.stan)a.push(d.stan+'× vlastní stan');if(+d.karavan)a.push(d.karavan+'× karavan');return a.join(', ')};
var osob=function(r){var o=r.osoby||{};if(window.KKC&&KKC.osobPocet)return KKC.osobPocet(o);var n=0;Object.keys(o).forEach(function(k){n+=+o[k]||0});return n};
var noci=function(r){return Math.round((D(r.do)-D(r.od))/864e5)};
var zaplaceno=function(r){var p=r.platba,c=+r.cena||0;return !p?0:p.stav==='vse'?c:p.stav==='zal'?Math.min(c,+p.zaloha||0):0};
var doplatek=function(r){return Math.max(0,(+r.cena||0)-zaplaceno(r))};
var cekaZal=function(r){return !!(r.platba&&r.platba.stav==='ceka')};
var kusN=function(k,n){var V={padla:['pádlo','pádla','pádel'],vesty:['vesta','vesty','vest'],barely:['barel','barely','barelů']}[k];if(V)return n===1?V[0]:n<5?V[1]:V[2];var p=window.KKC&&KKC.p(k);return p?p.n:k};
var kusyLi=function(k){return Object.keys(k||{}).filter(function(x){return +k[x]>0}).sort(function(a,b){return (a in R.VYB)-(b in R.VYB)}).map(function(x){var lod=!(x in R.VYB);return '<li'+(lod?' class="lod"':'')+'><b>'+k[x]+(lod?'×':'')+'</b> '+esc(kusN(x,+k[x]))+'</li>'}).join('')};
var lodiN=function(k){var n=0;Object.keys(k||{}).forEach(function(x){if(!(x in R.VYB))n+=+k[x]||0});return n};
var tel=function(r){return r.telefon?'<a class="ob-tel" href="tel:'+esc(String(r.telefon).replace(/\s/g,''))+'" aria-label="Zavolat – '+esc(r.jmeno)+'">'+sv(IK.tel,20)+'</a>':''};
var jazyk=function(r){var j=r.jazyk||r.lang;return j&&j!=='cs'?'<span class="ob-ch">'+esc(String(j).toUpperCase())+'</span>':''};
var platbaCh=function(r){if(cekaZal(r))return '<span class="ob-ch zl">Záloha nezaplacena'+(r.platba.splatnost?' (do '+kr(r.platba.splatnost)+')':'')+'</span>';var d=doplatek(r);
  return +r.cena?(d?'<span class="ob-ch zl">Doplatit '+kc(d)+'</span>':'<span class="ob-ch ok">Zaplaceno</span>'):''};

/* ---------- změna rezervace (zápis do historie) ---------- */
function zmen(r,z,co,tichy){var z0={};Object.keys(z).forEach(function(k){z0[k]=r[k]===undefined?null:JSON.parse(JSON.stringify(r[k]))});
  z.hist=(r.hist||[]).concat([{t:Date.now(),kdo:ja.jmeno,co:co}]).slice(-200);
  try{R.uprav(r.id,z)}catch(x){A.toast(x.message,1);return false}
  KK.zaznam('Rezervace',(r.cislo||'')+' '+r.jmeno+' – '+co);
  kresli();
  if(!tichy)A.toast(r.jmeno+': '+co.charAt(0).toLowerCase()+co.slice(1)+'.',0,{t:'Vrátit',fn:function(){var a=R.vse().filter(function(x){return x.id===r.id})[0];if(!a)return;var zz={};Object.keys(z0).forEach(function(k){if(k!=='hist')zz[k]=z0[k]===null?undefined:z0[k]});zmen(a,zz,'Vráceno zpět: '+co,1);A.toast('Vráceno zpět.')}});
  return true}
var najdi=function(id){return R.vse().filter(function(x){return x.id===id})[0]};
var AKCE={
  ubytovat:function(r){var go=function(){zmen(r,{stav:'uby'},'Host ubytován')};
    if(cekaZal(r))A.ptej('Záloha ještě není zaplacená\n\nUbytovat '+r.jmeno+' i tak?',{ok:'Ubytovat'}).then(function(a){if(a)go()});else go()},
  odhlasit:function(r){var go=function(){zmen(r,{stav:'odj'},'Host odhlášen, klíče vráceny')};
    if(sLod(r)&&r.lode.vydano&&venK(r))A.ptej('Host má ještě půjčené lodě\n\n'+R.lodeKusyTxt(R.lodeVen(r))+'. Odhlásit i tak?',{ok:'Odhlásit'}).then(function(a){if(a)go()});else go()},
  zpetUby:function(r){A.ptej('Vrátit ubytování zpět?\n\n'+r.jmeno+' bude zase „čeká na příjezd“.',{ok:'Vrátit zpět'}).then(function(a){if(a)zmen(r,{stav:'pot'},'Ubytování vráceno zpět',1)})},
  zpetOdj:function(r){A.ptej('Vrátit odhlášení zpět?\n\n'+r.jmeno+' bude zase ubytovaný.',{ok:'Vrátit zpět'}).then(function(a){if(a)zmen(r,{stav:'uby'},'Odhlášení vráceno zpět',1)})},
  zaloha:function(r){var p=Object.assign({},r.platba,{stav:'zal',kdy:Date.now()}),z={platba:p};if(r.stav==='pop')z.stav='pot';zmen(r,z,'Záloha zaplacena ('+kc(p.zaloha)+')'+(z.stav?' – rezervace potvrzena':''))},
  doplaceno:function(r){var d=doplatek(r);A.ptej('Host zaplatil na místě?\n\n'+r.jmeno+' · '+kc(d),{ok:'Zaplaceno'}).then(function(a){if(!a)return;var p=Object.assign({zaloha:0,splatnost:''},r.platba||{},{stav:'vse',kdy:Date.now()}),z={platba:p};if(r.stav==='pop')z.stav='pot';zmen(r,z,'Zaplaceno celé ('+kc(r.cena)+')')})},
  vydat:function(r,k){var l=Object.assign({},r.lode,{vydano:{kdy:Date.now(),kdo:ja.jmeno,kusy:k||R.lodePotreba(r.lode)},vraceno:[]});zmen(r,{lode:l},'Lodě vydány: '+R.lodeKusyTxt(l.vydano.kusy))},
  vydatUpr:function(r){var p=R.lodePotreba(r.lode),pol=Object.keys(p).filter(function(x){return p[x]>0}).map(function(x){return [x,kusN(x,2).replace(/^./,function(c){return c.toUpperCase()}),p[x],999,'podle rezervace '+p[x]]});
    A.pocty('Vydat lodě – '+r.jmeno,'Upravte počty podle toho, co si host skutečně odnáší.',pol,'Vydat').then(function(k){if(k)AKCE.vydat(r,k)})},
  zpetVyd:function(r){A.ptej('Zrušit výdej lodí?\n\nLodě se vrátí do stavu „rezervované“.',{ok:'Zrušit výdej',ne:'Nechat'}).then(function(a){if(!a)return;var l=Object.assign({},r.lode);delete l.vydano;delete l.vraceno;var z={lode:l};if(R.jenLode(r)&&r.stav==='odj')z.stav='pot';zmen(r,z,'Výdej lodí zrušen',1)})},
  vratit:function(r,k){var ven=R.lodeVen(r);k=k||ven;var vr=(r.lode.vraceno||[]).concat([{kdy:Date.now(),kdo:ja.jmeno,kusy:k}]),l=Object.assign({},r.lode,{vraceno:vr}),z={lode:l},zb={};
    Object.keys(ven).forEach(function(x){var n=ven[x]-(+k[x]||0);if(n>0)zb[x]=n});var vse=!Object.keys(zb).length;if(vse&&R.jenLode(r))z.stav='odj';
    zmen(r,z,'Vráceno: '+R.lodeKusyTxt(k)+(vse?' – vše vráceno':' – zbývá vrátit '+R.lodeKusyTxt(zb)))},
  vratitCast:function(r){var ven=R.lodeVen(r),pol=Object.keys(ven).map(function(x){return [x,kusN(x,2).replace(/^./,function(c){return c.toUpperCase()}),ven[x],ven[x],'venku '+ven[x]]});
    A.pocty('Vrátit lodě – '+r.jmeno,'Zadejte, co host vrací teď. Zbytek zůstane u něj.',pol,'Uložit vrácení').then(function(k){if(k)AKCE.vratit(r,k)})},
  jizda:function(g,hot){g.L.forEach(function(r0){var r=najdi(r0.id);if(!r)return;var v=Object.assign({},r[g.kl]);if(hot)v.hotovo={kdy:Date.now(),kdo:ja.jmeno};else delete v.hotovo;var z={};z[g.kl]=v;
    zmen(r,z,(g.kl==='doprava'?(hot?'Odvezeni na start ':'Odvoz vrácen zpět – '):(hot?'Vyzvednuti v cíli ':'Vyzvednutí vráceno zpět – '))+R.mistoN(g.misto),1)});
    A.toast(hot?(g.kl==='doprava'?'Odjeto – ':'Vyzvednuto – ')+R.mistoN(g.misto)+'.':'Vráceno zpět.')}
};

/* ---------- kostra aplikace ---------- */
function moduly(){return KK.APP_SEKCE.filter(function(k){return KK.auth.muze(k)})}
function sekce(){var h=location.hash.replace(/^#o\/?/,'').split('/')[0],M=moduly();if(h==='hledat')return 'hledat';if(M.length===1)return M[0];return M.indexOf(h)>=0?h:''}
function navOdkazy(cls){var M=moduly(),s=sekce(),a=[];if(M.length>1)a.push(['','Přehled','prehled']);M.forEach(function(k){a.push([k,MOD[k].n,k])});a.push(['hledat','Hledat','hledat']);
  return a.map(function(x){return '<a class="'+cls+(MOD[x[0]]?' m-'+MOD[x[0]].c:'')+(x[0]==='hledat'?' ob-nvh':'')+'" href="#o'+(x[0]?'/'+x[0]:'')+'"'+(x[0]===s?' aria-current="page"':'')+'>'+sv(IK[x[2]],24)+'<span>'+x[1]+'</span></a>'}).join('')}
function kostra(){var nah=ja.role==='admin',M=moduly();
  document.documentElement.classList.add('ob-on');
  A.app.innerHTML=(nah?'<div class="ob-nah" role="status"><span><b>Náhled</b> – takhle vidí administraci obsluha s aplikací.</span><button type="button" id="obx">Zpět do administrace</button></div>':'')+
   '<div class="ob'+(M.length<2?' jedna':'')+'"><nav class="ob-side" aria-label="Aplikace obsluhy"><div class="ob-logo">'+sv(IK.pujcovna,22)+'<span>Kemp Krumlov<small>obsluha</small></span></div><div class="ob-sn" id="obsn"></div>'+
   '<div class="ob-who"><span><b>'+esc(ja.jmeno)+'</b><small>'+(nah?'Správce · náhled':'Obsluha')+'</small></span><button type="button" class="ob-ic" data-ucet aria-label="Účet a odhlášení">'+sv(IK.ven,20)+'</button></div></nav>'+
   '<div class="ob-main"><main id="main" class="ob-c" tabindex="-1"></main></div>'+
   '<nav class="ob-tab" id="obtab" aria-label="Hlavní menu"></nav></div>';
  box=$('#main');
  var x=$('#obx');if(x)x.addEventListener('click',function(){KK.LS.del('o.nahled');onhashchange=null;history.replaceState(null,'','#uzivatele');document.documentElement.classList.remove('ob-on');A.shell(KK.auth.meSync())});
  A.app.addEventListener('click',klik);
}
function ucetMenu(){var d=document.createElement('dialog');d.className='dlg ob-dlg';d.setAttribute('aria-labelledby','obuh');
  d.innerHTML='<form method="dialog" novalidate><h2 id="obuh">'+esc(ja.jmeno)+'</h2><p class="mut">Přihlášen jako '+esc(ja.login||'')+'</p>'+
   '<details><summary>Změnit heslo</summary><div class="ob-hes"><label class="f">Současné heslo<input class="inp" type="password" name="s" autocomplete="current-password"></label><label class="f">Nové heslo<small>Aspoň 8 znaků</small><input class="inp" type="password" name="n" autocomplete="new-password"></label><p class="err-msg" role="alert" hidden></p><button type="button" class="btn pri" data-h>Uložit heslo</button></div></details>'+
   '<div class="ob-dlg-b"><button type="button" class="btn gh" data-z>Zavřít</button><button type="button" class="btn dan2" data-o>Odhlásit se</button></div></form>';
  document.body.appendChild(d);var zav=function(){try{d.close()}catch(e){}d.remove()};
  d.addEventListener('cancel',function(e){e.preventDefault();zav()});d.addEventListener('click',function(e){if(e.target===d)zav()});
  $('[data-z]',d).onclick=zav;
  $('[data-o]',d).onclick=function(){zav();KK.LS.del('o.nahled');KK.auth.logout().then(function(){onhashchange=null;document.documentElement.classList.remove('ob-on');A.login()})};
  $('[data-h]',d).onclick=function(){var f=$('form',d),er=$('.err-msg',d);er.hidden=true;KK.auth.zmenHeslo(f.s.value,f.n.value).then(function(){zav();A.toast('Heslo je změněné.')}).catch(function(x){er.textContent=x.message;er.hidden=false})};
  d.showModal();$('[data-z]',d).focus()}

/* ---------- vykreslení ---------- */
var denNav=function(){var dz=den===DNES(),d=D(den);return '<div class="ob-den" role="group" aria-label="Den"><button type="button" class="ob-ic" data-den="-1" aria-label="Předchozí den">'+sv(IK.zpet,20)+'</button>'+
   '<button type="button" class="ob-den-t'+(dz?' dnes':'')+'" data-den="0"'+(dz?' aria-current="date"':' title="Zpět na dnešek"')+'><b>'+(dz?'Dnes':DNY[d.getDay()].replace(/^./,function(c){return c.toUpperCase()}))+'</b><span>'+(dz?DNY[d.getDay()]+' ':'')+kr(den)+' '+den.slice(0,4)+'</span></button>'+
   '<button type="button" class="ob-ic" data-den="1" aria-label="Další den">'+sv(IK.vpred,20)+'</button>'+(dz?'':'<button type="button" class="ob-dnes" data-den="0">Dnes</button>')+'</div>'};
var hl=function(nad,sek,bezDne,filtr){var M=moduly(),dz=den===DNES(),d=D(den);
  return '<header class="ob-top">'+(sek&&M.length>1?'<a class="ob-ic ob-zpet" href="#o" aria-label="Zpět na přehled">'+sv(IK.zpet,22)+'</a>':'')+
   '<div class="ob-tt">'+(sek?'':'<span class="ob-kick">Kemp Krumlov · obsluha</span>')+'<h1>'+nad+'</h1></div>'+
   (sek?'<button type="button" class="ob-ic ob-pr" data-tisk aria-label="Vytisknout">'+sv(IK.tisk,22)+'</button>':'')+
   '<button type="button" class="ob-ic ob-av" data-ucet aria-label="Účet a odhlášení – '+esc(ja.jmeno)+'">'+esc(ja.jmeno.split(/\s+/).map(function(x){return x.charAt(0)}).join('').slice(0,2).toUpperCase())+'</button></header>'+
   (bezDne?'':denNav())};
var fq={};
/* hledací pole sekce: hledá jen v tom, co je zobrazené (seznam se zúží, v plánku a kalendáři se shody zvýrazní) */
var qBox=function(ph){var v=fq[sekce()]||'';return '<div class="ob-qw'+(v?' ma':'')+'" role="search"><span class="ob-q-i">'+sv(IK.hledat,20)+'</span><label class="sr" for="obqi">Hledat v zobrazeném</label>'+
  '<input id="obqi" class="ob-qi" type="search" placeholder="'+(ph||'Hledat hosta, chatku, telefon…')+'" autocomplete="off" enterkeyhint="search" value="'+esc(v)+'">'+
  '<span class="ob-qn" aria-live="polite"></span><button type="button" class="ob-qx" data-qx aria-label="Vymazat hledání">'+sv('<path d="M6 6l12 12M18 6L6 18"/>',18)+'</button><kbd class="ob-kbd" aria-hidden="true">/</kbd></div>'};
var bar=function(segH,ph){return '<div class="ob-bar">'+(segH||'')+qBox(ph)+'</div><p class="ob-fq0" hidden>Nic tady neodpovídá. Hledat napříč všemi rezervacemi můžete v menu <a href="#o/hledat">Hledat</a>.</p>'};
var seg=function(id,pol,akt){return '<div class="ob-seg" role="tablist" aria-label="Zobrazit">'+pol.map(function(x){return '<button type="button" role="tab" data-seg="'+id+'" data-v="'+x[0]+'" aria-selected="'+(x[0]===akt)+'"'+(x[4]?' class="'+x[4]+'"':'')+'>'+(x[3]?sv(IK[x[3]],18):'')+'<b>'+x[1]+'</b>'+(x[2]!=null?'<span>'+x[2]+'</span>':'')+'</button>'}).join('')+'</div>'};
var skup=function(nad,pocet,html){return html?'<section class="ob-sk"><h2 class="ob-sk-h">'+nad+' <span>'+pocet+'</span></h2><div class="ob-list">'+html+'</div></section>':''};
var hotove=function(n,html){return n?'<details class="ob-hotd"><summary>'+sv(IK.ok,18)+'Hotovo <span>'+n+'</span></summary><div class="ob-list">'+html+'</div></details>':''};
var prazdne=function(t){return '<p class="ob-0">'+sv(IK.ok,28)+'<span>'+t+'</span></p>'};
var tlac=function(cls,attr,txt,hot){return '<button type="button" class="ob-b '+cls+(hot?' hot':'')+'" '+attr+'>'+(hot?sv(IK.ok,20):'')+txt+'</button>'};

function prehled(){var X=data(den),M=moduly(),dz=den===DNES(),h=hl(dz?'Přehled':'Přehled dne',0)+'<div class="ob-bar">'+qBox('Hledat rezervaci – jméno, telefon, chatka…')+'</div>';
  var T={ubytovani:[zbyva(X.pri,'pri')+zbyva(X.odj,'odj'),X.pri.length+' '+pl(X.pri.length,'příjezd','příjezdy','příjezdů')+' · '+X.odj.length+' '+pl(X.odj.length,'odjezd','odjezdy','odjezdů')],
    pujcovna:[zbyva(X.vyd,'vyd')+zbyva(X.vra,'vra'),X.vyd.length+' '+pl(X.vyd.length,'výdej','výdeje','výdejů')+' · '+X.vra.length+' '+pl(X.vra.length,'vrácení','vrácení','vrácení')],
    doprava:[X.jiz.filter(function(g){return !g.hot}).length+X.vyz.filter(function(g){return !g.hot}).length,X.jiz.length+' '+pl(X.jiz.length,'odvoz','odvozy','odvozů')+' · '+X.vyz.length+' '+pl(X.vyz.length,'vyzvednutí','vyzvednutí','vyzvednutí')]};
  h+='<div class="ob-tiles n'+M.length+'">'+M.map(function(k){var t=T[k];return '<a class="ob-tile m-'+MOD[k].c+'" href="#o/'+k+'"><span class="ob-tile-i">'+sv(IK[k],34)+'</span><span class="ob-tile-t"><b>'+MOD[k].n+'</b><span>'+t[1]+'</span></span>'+
    '<span class="ob-tile-n'+(t[0]?'':' nic')+'" aria-label="'+(t[0]?'Zbývá '+t[0]:'Hotovo')+'">'+(t[0]||sv(IK.ok,20))+'</span></a>'}).join('')+'</div>';
  /* co je potřeba udělat – podle času */
  var U=[],on=function(k){return M.indexOf(k)>=0};
  if(on('doprava')){X.jiz.forEach(function(g){if(!g.hot)U.push({c:g.cas,m:'d',s:'doprava',t:'Odvoz – '+R.mistoN(g.misto),p:g.osob+' '+pl(g.osob,'osoba','osoby','osob')+(lodiN(g.kusy)?' · '+lodiN(g.kusy)+' '+pl(lodiN(g.kusy),'loď','lodě','lodí'):'')})});
    X.vyz.forEach(function(g){if(!g.hot)U.push({c:g.cas,m:'d',s:'doprava',t:'Vyzvednutí – '+R.mistoN(g.misto),p:g.osob+' '+pl(g.osob,'osoba','osoby','osob')})})}
  if(on('pujcovna')){X.vyd.forEach(function(r){if(!HOT.vyd(r))U.push({c:r.doprava&&r.doprava.cas||'',m:'l',s:'pujcovna',t:'Výdej lodí – '+r.jmeno,p:R.lodeKusyTxt(r.lode.kusy)})});
    X.vra.forEach(function(r){if(!HOT.vra(r))U.push({c:'',m:'l',s:'pujcovna',t:'Vrácení lodí – '+r.jmeno,p:R.lodeKusyTxt(r.lode.vydano?R.lodeVen(r):r.lode.kusy)})})}
  if(on('ubytovani')){X.odj.forEach(function(r){if(!HOT.odj(r))U.push({c:'',m:'u',s:'ubytovani',t:'Odjezd – '+r.jmeno,p:mistaTxt(r)})});
    X.pri.forEach(function(r){if(!HOT.pri(r))U.push({c:'',m:'u',s:'ubytovani',t:'Příjezd – '+r.jmeno,p:mistaTxt(r)+' · '+osob(r)+' '+pl(osob(r),'osoba','osoby','osob')})})}
  U.sort(function(a,b){return (a.c?0:1)-(b.c?0:1)||cas(a.c,b.c)});
  h+='<section class="ob-next"><h2>'+(dz?'Teď na řadě':'Na tento den')+(U.length>6?' <span>'+U.length+'</span>':'')+'</h2>'+(U.length?'<div class="ob-nl">'+U.slice(0,6).map(function(u){return '<a class="ob-nx m-'+u.m+'" href="#o/'+u.s+'"><span class="ob-nx-c">'+(u.c||sv(IK[u.s],22))+'</span><span class="ob-nx-t"><b>'+esc(u.t)+'</b><small>'+esc(u.p)+'</small></span>'+sv(IK.vpred,18)+'</a>'}).join('')+'</div>':prazdne(dz?'Na dnešek je všechno hotové.':'Na tento den nic není.'))+'</section>';
  return h}

function kartaU(r,typ){var mk=mistoKr(r),hot=typ==='pri'?HOT.pri(r):HOT.odj(r),o=osob(r),n=noci(r),smi=ja.platby;
  var info=(typ==='odj'?'od '+kr(r.od):n+' '+pl(n,'noc','noci','nocí')+' · do '+kr(r.do))+' · '+o+' '+pl(o,'osoba','osoby','osob')+((r.mista||[]).length>1||!(r.mista||[]).length?' · '+mistaTxt(r):'');
  var ch=platbaCh(r)+jazyk(r)+(sLod(r)?'<span class="ob-ch l">+ lodě</span>':'')+(r.doprava&&r.doprava.misto&&r.doprava.misto!=='kemp'?'<span class="ob-ch d">+ doprava</span>':'')+(typ==='odj'&&r.stav!=='uby'&&r.stav!=='odj'?'<span class="ob-ch zl">Nebyl ubytován</span>':'');
  var b2=!smi||hot?'':cekaZal(r)?'<button type="button" class="ob-mini" data-a="zaloha" data-id="'+r.id+'">Záloha přišla</button>':doplatek(r)?'<button type="button" class="ob-mini" data-a="doplaceno" data-id="'+r.id+'">Doplaceno</button>':'';
  var b=hot?'<button type="button" class="ob-st" data-a="'+(typ==='pri'?'zpetUby':'zpetOdj')+'" data-id="'+r.id+'" title="Vrátit zpět">'+sv(IK.ok,18)+(typ==='pri'?(r.stav==='odj'?'Odjel':'Ubytován'):'Odhlášen')+'</button>'
    :'<button type="button" class="ob-go '+(typ==='pri'?'k-pri':'k-odj')+'" data-a="'+(typ==='pri'?'ubytovat':'odhlasit')+'" data-id="'+r.id+'">'+(typ==='pri'?sv(IK.dovnitr,20)+'Ubytovat':sv(IK.klic,20)+'Odhlásit')+'</button>';
  return '<div class="ob-r'+(hot?' hot':'')+'" data-det="'+r.id+'" data-q="'+qT(r)+'"><span class="ob-mi"><small>'+esc(mk.t)+'</small><b>'+esc(mk.n||'')+'</b>'+(mk.vic?'<i>+'+mk.vic+'</i>':'')+'</span>'+
   '<div class="ob-r-t"><span class="ob-r-n">'+'<button type="button" class="ob-jm" data-det="'+r.id+'" title="Detail rezervace"><b>'+esc(r.jmeno)+'</b></button>'+(r.telefon?'<a href="tel:'+esc(String(r.telefon).replace(/\s/g,''))+'" class="ob-tl2" aria-label="Zavolat – '+esc(r.jmeno)+'">'+sv(IK.tel,15)+'</a>':'')+'</span><small>'+esc(info)+'</small>'+
   (!hot&&(ch||b2)?'<span class="ob-r-ch">'+ch+b2+'</span>':'')+(r.zprava&&!hot?'<span class="ob-r-pz">'+sv(IK.zprava,14)+esc(r.zprava)+'</span>':'')+'</div>'+b+'</div>'}
function ubytovani(){var t=KK.LS.get('o.tab.u','dnes');if(['dnes','plan','kal'].indexOf(t)<0)t='dnes';var X=data(den);
  var odj=X.odj.filter(function(r){return !HOT.odj(r)}),pri=X.pri.filter(function(r){return !HOT.pri(r)}),hot=X.odj.filter(HOT.odj).map(function(r){return [r,'odj']}).concat(X.pri.filter(function(r){return HOT.pri(r)&&!HOT.odj(r)}).map(function(r){return [r,'pri']}));
  var h=hl('Ubytování',1,1)+bar(seg('u',[['dnes','Seznam',odj.length+pri.length,'seznam'],['plan','Plánek',null,'prehled'],['kal','Kalendář',null,'kal']],t),t==='dnes'?'':'Hledat a zvýraznit – jméno, chatka…');
  if(t!=='dnes')return h+'<div class="ob-rz" id="obrz"></div>';
  h+='<div class="ob-akce"><button type="button" class="ob-go ob-go2" data-nova="ubytovani">+ Nová rezervace</button><button type="button" class="ob-go k-pri" data-nova="ubytovani" data-btn="ubyt">'+sv(IK.ubytovani,20)+'Ubytovat hosta</button></div>';
  var srt=function(a,b){return mistaTxt(a).localeCompare(mistaTxt(b),'cs',{numeric:true})};
  var pan=function(nad,L,typ){return L.length?'<section class="ob-pan k-'+typ+'"><h2 class="ob-pan-h">'+sv(IK[typ==='pri'?'dovnitr':'sipven'],18)+nad+'<span>'+L.length+'</span></h2>'+L.sort(srt).map(function(r){return kartaU(r,typ)}).join('')+'</section>':''};
  h+=denNav()+'<p class="ob-sum">V kempu '+X.ted.length+' '+pl(X.ted.length,'rezervace','rezervace','rezervací')+' · přijede '+X.pri.length+' · odjede '+X.odj.length+'</p>';
  if(!odj.length&&!pri.length)h+=prazdne(hot.length?'Všechno na tento den je hotové.':'Nikdo nepřijíždí ani neodjíždí.');
  var sb=function(nad,L){return L.length?'<details class="ob-hotd"><summary>'+sv(IK.ok,18)+nad+' <span>'+L.length+'</span></summary><section class="ob-pan">'+L.map(function(x){return kartaU(x[0],x[1])}).join('')+'</section></details>':''};
  var hO=hot.filter(function(x){return x[1]==='odj'}),hU=hot.filter(function(x){return x[1]==='pri'});
  h+='<div class="ob-2s"><div class="ob-2s-s">'+pan('Odjíždí',odj,'odj')+sb('Odhlášení',hO)+'</div><div class="ob-2s-s">'+pan('Přijíždí',pri,'pri')+sb('Ubytovaní',hU)+'</div></div>';
  return h}
function kartaL(r,typ){var l=r.lode,hot=HOT[typ](r),ceka=cekaZal(r),smi=ja.platby,dni=Math.max(1,+l.dni||1),pozde=typ==='vra'&&posD(r)<den;
  var k=typ==='vra'&&l.vydano?R.lodeVen(r):l.vydano?l.vydano.kusy:R.lodePotreba(l);if(typ==='vra'&&hot)k=l.vydano.kusy;
  var kdy=typ==='vyd'?(r.doprava&&r.doprava.cas?r.doprava.cas:''):(r.vyzved&&r.vyzved.cas?r.vyzved.cas:'');
  var trasa=R.mistoN(l.odkud||'kemp')+' → '+R.mistoN(l.kam||'kemp')+' · '+dni+' '+pl(dni,'den','dny','dní');
  var b='',b2='';
  if(typ==='vyd'){if(hot)b=tlac('','data-a="zpetVyd" data-id="'+r.id+'"','Vydáno',1);else if(ceka)b='<button type="button" class="ob-b" disabled>Vydat až po zaplacení zálohy</button>';else{b=tlac('k-ven','data-a="vydat" data-id="'+r.id+'"',sv(IK.sipven,20)+'Vydat');b2='<button type="button" class="ob-b2" data-a="vydatUpr" data-id="'+r.id+'">Upravit počty</button>'}}
  else{if(hot)b=tlac('','data-a="zpetVyd" data-id="'+r.id+'"','Vráceno',1);else if(!l.vydano)b='<button type="button" class="ob-b" disabled>Lodě nebyly vydány</button>';else{b=tlac('k-zpet','data-a="vratit" data-id="'+r.id+'"',sv(IK.dovnitr,20)+'Vráceno vše');b2='<button type="button" class="ob-b2" data-a="vratitCast" data-id="'+r.id+'">Vrátit jen část</button>'}}
  if(typ==='vra'&&hot)b='<button type="button" class="ob-b hot" disabled>'+sv(IK.ok,20)+'Vráceno</button>';
  return '<article class="ob-k ob-kl '+(typ==='vyd'?'k-ven':'k-zpet')+(hot?' hot':'')+'" data-det="'+r.id+'" data-q="'+qT(r)+'"><div class="ob-k-h"><span class="ob-mi cas">'+(kdy?'<b>'+kdy+'</b><small>'+(typ==='vyd'?'odvoz':'vyzved.')+'</small>':'<small>'+(typ==='vyd'?'výdej':'vrácení')+'</small><b>dnes</b>')+'</span><div class="ob-k-n">'+'<button type="button" class="ob-jm" data-det="'+r.id+'" title="Detail rezervace"><b>'+esc(r.jmeno)+'</b></button>'+'<small>'+esc(trasa)+'</small></div>'+tel(r)+'</div>'+
   '<ul class="ob-kusy">'+kusyLi(k)+'</ul>'+
   ((pozde||ceka&&typ==='vyd'||jazyk(r))?'<div class="ob-chs">'+(pozde?'<span class="ob-ch zl">Měl vrátit '+kr(posD(r))+'</span>':'')+jazyk(r)+'</div>':'')+
   (ceka&&typ==='vyd'&&!hot?'<div class="ob-zal"><span>Čeká na zálohu'+(r.platba.splatnost?' · propadne '+kr(r.platba.splatnost):'')+'</span>'+(smi?'<button type="button" class="ob-b2" data-a="zaloha" data-id="'+r.id+'">Zaplaceno</button>':'<small>Platbu potvrzuje správce</small>')+'</div>':'')+
   '<div class="ob-k-a">'+b2+b+'</div></article>'}
function pujcovna(){var t=KK.LS.get('o.tab.l','vyd');if(['vyd','vra','dost'].indexOf(t)<0)t='vyd';var X=data(den);
  var sgL=seg('l',[['vyd','Výdej',zbyva(X.vyd,'vyd'),'sipven','k-ven'],['vra','Vrácení',zbyva(X.vra,'vra'),'dovnitr','k-zpet'],['dost','Dostupnost',null,'dost']],t);var h=hl('Lodě',1,1)+(t==='dost'?'<div class="ob-bar">'+sgL+'</div>':bar(sgL,'Hledat hosta, loď, telefon…'));
  if(t==='dost')return h+'<div class="ob-rz" id="obrz" data-sek="pujcovna"></div>';
  h+='<div class="ob-akce"><button type="button" class="ob-go" data-nova="pujcovna">'+sv(IK.pujcovna,20)+'Půjčit loď</button></div>'+denNav();
  var L=X[t].slice().sort(function(a,b){return (HOT[t](a)?1:0)-(HOT[t](b)?1:0)});
  return h+(L.length?'<div class="ob-list">'+L.map(function(r){return kartaL(r,t)}).join('')+'</div>':prazdne(t==='vyd'?'Žádné lodě k vydání.':'Žádné lodě k vrácení.'))}
var GJ=[];
function doprava(){var X=data(den),G=X.jiz.concat(X.vyz).sort(function(a,b){return cas(a.cas,b.cas)||(a.kl==='doprava'?0:1)-(b.kl==='doprava'?0:1)||poradiM(a.misto)-poradiM(b.misto)});GJ=G;
  var h=hl('Doprava',1,1)+bar('','Hledat hosta, místo, čas…')+denNav()+'<p class="ob-sum">'+X.jiz.length+' '+pl(X.jiz.length,'odvoz','odvozy','odvozů')+' na start · '+X.vyz.length+' '+pl(X.vyz.length,'vyzvednutí','vyzvednutí','vyzvednutí')+' v cíli</p>';
  if(!G.length)return h+prazdne('Na tento den žádné jízdy.');
  var li=function(g,i){var vy=g.kl==='vyzved',nl=lodiN(g.kusy);
    return '<li class="'+(vy?'vy':'od')+(g.hot?' hot':'')+'" data-q="'+esc(bezD(R.mistoN(g.misto)+' '+(g.cas||'')+' '+(vy?'vyzvednuti':'odvoz'))+' '+g.L.map(qT).join(' '))+'"><span class="ob-tl-c">'+(g.cas||'—')+'</span><article class="ob-k"><span class="ob-tag">'+(vy?'Vyzvednutí v cíli':'Odvoz na start')+'</span>'+
     '<h3>'+(vy?esc(R.mistoN(g.misto))+' → kemp':'Kemp → '+esc(R.mistoN(g.misto)))+'</h3>'+
     '<div class="ob-dp"><span>'+sv(IK.lide,18)+'<b>'+g.osob+'</b> '+pl(g.osob,'osoba','osoby','osob')+'</span><span>'+sv(IK.doprava,18)+'<b>'+g.aut+'</b> '+pl(g.aut,'auto','auta','aut')+'</span>'+(nl?'<span>'+sv(IK.pujcovna,18)+'<b>'+nl+'</b> '+pl(nl,'loď','lodě','lodí')+(vy?' naložit':' s sebou')+'</span>':'')+'</div>'+
     '<ul class="ob-lid">'+g.L.map(function(r){return '<li data-det="'+r.id+'"><span>'+'<button type="button" class="ob-jm" data-det="'+r.id+'" title="Detail rezervace">'+esc(r.jmeno)+'</button>'+'  <small>'+(+r[g.kl].osob||0)+' os.</small></span>'+tel(r)+'</li>'}).join('')+'</ul>'+
     '<div class="ob-k-a">'+(g.hot?tlac('','data-j="'+i+'" data-hot="0"',vy?'Vyzvednuto':'Odvezeno',1):tlac('','data-j="'+i+'" data-hot="1"',vy?'Vyzvednuto':'Odjeto'))+'</div></article></li>'};
  var od=[],vz=[];G.forEach(function(g,i){(g.kl==='vyzved'?vz:od).push(li(g,i))});
  return h+'<ol class="ob-tl ob-tl-v">'+G.map(li).join('')+'</ol><div class="ob-2s ob-tl-2"><section><h2 class="ob-sk-h">Odvoz na start <span>'+od.length+'</span></h2><ol class="ob-tl">'+od.join('')+'</ol></section><section class="m-d"><h2 class="ob-sk-h">Vyzvednutí v cíli <span>'+vz.length+'</span></h2><ol class="ob-tl">'+vz.join('')+'</ol></section></div>'}

function kresli(){if(!box||!document.body.contains(box))return;var s=sekce(),sc=window.scrollY,stejne=s===poslSek;poslSek=s;
  var f={ubytovani:ubytovani,pujcovna:pujcovna,doprava:doprava,hledat:hledat}[s]||prehled;
  box.className='ob-c'+(MOD[s]?' m-'+MOD[s].c:'');box.innerHTML=f();
  if(s==='hledat')hledatPo();
  filtruj();
  /* plánek a kalendář ubytování = stejná obrazovka jako v plné administraci (přesuny přetažením, detail rezervace) */
  var rz=$('#obrz',box);if(rz&&A.rezervace){box.classList.add('siroky');var rs=rz.dataset.sek||'ubytovani';if(rs==='pujcovna')KK.LS.set('rez.tab.pujcovna','lodd');else KK.LS.set('rez.tab.ubytovani',KK.LS.get('o.tab.u')==='kal'?'kal':'dnes');try{A.rezervace(rz,rs);new MutationObserver(function(){clearTimeout(rz._zt);rz._zt=setTimeout(function(){var i=$('.ob-qi',box);if(i&&i.value.trim()){var q=bezD(i.value).trim();qStav(i,q,zvyrazni(q,0))}},40)}).observe(rz,{childList:true,subtree:true})}catch(x){rz.innerHTML='<p class="ob-0">Plánek se nepodařilo načíst.</p>'}}
  var sn=$('#obsn');if(sn)sn.innerHTML=navOdkazy('ob-nv');var tb=$('#obtab');if(tb)tb.innerHTML=navOdkazy('ob-tb');
  document.title=(MOD[s]?MOD[s].n:s==='hledat'?'Hledat':'Přehled')+' · Obsluha · Kemp Krumlov';
  if(stejne)scrollTo(0,sc);else{scrollTo(0,0);var h1=$('h1',box),qi=$('#obq',box);if(qi)qi.focus();else if(h1){h1.tabIndex=-1;h1.focus({preventScroll:true})}}}
/* nová rezervace / půjčení lodě: stejné okno jako v plné administraci (její obrazovka se připraví skrytě) */
function nova(sek,btn){var hid=$('#obskr');if(!hid){hid=document.createElement('div');hid.id='obskr';hid.className='ob-skr';hid.setAttribute('aria-hidden','true');box.appendChild(hid)}
  KK.LS.set('rez.tab.'+sek,sek==='pujcovna'?'lod':'uby');hid.innerHTML='';try{A.rezervace(hid,sek)}catch(x){return A.toast('Nepodařilo se otevřít.',1)}
  var b=$(sek==='pujcovna'?'[data-pujcit]':'[data-a='+(btn==='ubyt'?'ubyt':'nova')+']',hid);if(b)b.click()}
/* ---------- filtr: hledá jen v tom, co je v sekci zobrazené ---------- */
function zvyrazni(q,skrol){var rz=$('#obrz',box);if(!rz)return -1;var sl=q?q.split(/\s+/):[],M={};if(q)R.vse().forEach(function(r){M[r.id]=bezD(qT(r))});var n={},prvni=null;
  $$('[data-id]',rz).forEach(function(el){var t=M[el.dataset.id];var ok=!!q&&!!t&&sl.every(function(w){return t.indexOf(w)>=0});el.classList.toggle('ob-hit',ok);el.classList.toggle('ob-dim',!!q&&!ok);if(ok){n[el.dataset.id]=1;if(!prvni)prvni=el}});
  if(skrol&&prvni)prvni.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});return Object.keys(n).length}
function qStav(i,q,n){var w=i.closest('.ob-qw');w.classList.toggle('ma',!!q);var c=$('.ob-qn',w);c.textContent=q?(n?n+' '+pl(n,'shoda','shody','shod'):'nic'):'';c.classList.toggle('nic',!!q&&!n)}
var qPosl='';
function filtruj(){var i=$('.ob-qi',box);if(!i)return;if(!sekce()){if(i.value.trim()){hq=i.value;location.hash='#o/hledat'}return}fq[sekce()]=i.value;
  if($('#obrz',box)){var qq=bezD(i.value).trim(),nn=zvyrazni(qq,qq!==qPosl);qPosl=qq;qStav(i,qq,nn);var zz=$('.ob-fq0',box);if(zz)zz.hidden=!(qq&&!nn);return}var q=bezD(i.value).trim(),sl=q?q.split(/\s+/):[],vse=$$('[data-q]',box),n=0;
  vse.forEach(function(el){var ok=sl.every(function(w){return el.dataset.q.indexOf(w)>=0});el.hidden=!ok;if(ok)n++});
  $$('.ob-pan,.ob-hotd,.ob-tl-2>section,.ob-list,.ob-tl',box).forEach(function(g){var d=$$('[data-q]',g);if(!d.length)return;var vid=d.some(function(x){return !x.hidden});g.hidden=!vid;if(g.tagName==='DETAILS'&&q&&vid)g.open=true});
  /* počty v nadpisech podle toho, co je vidět */
  $$('.ob-pan-h>span,.ob-sk-h>span,.ob-hotd>summary>span',box).forEach(function(b){var g=b.closest('details,section,.ob-pan');if(!g)return;var d=$$('[data-q]',g);if(d.length)b.textContent=d.filter(function(x){return !x.hidden}).length});
  /* dva sloupce: prázdný sloupec schovat, zbylý roztáhnout přes celou šířku */
  $$('.ob-2s',box).forEach(function(w){var k=[].slice.call(w.children);k.forEach(function(c){var d=$$('[data-q]',c);c.hidden=!d.length||!d.some(function(x){return !x.hidden})});w.classList.toggle('jeden',k.filter(function(c){return !c.hidden}).length<2)});
  qStav(i,q,n);var z=$('.ob-fq0',box);if(z)z.hidden=!(q&&vse.length&&!n)||false;if(z&&q&&!vse.length)z.hidden=false}
/* ---------- hledání ve všech rezervacích (menu Hledat) ---------- */
var hq='';
var qT=function(r){return esc(bezD([r.jmeno,r.telefon,String(r.telefon||'').replace(/\s/g,''),r.email,r.cislo,mistaTxt(r),(r.mista||[]).map(function(m){return m.replace('-',' ')}).join(' '),sLod(r)?R.lodeKusyTxt(r.lode.kusy):''].join(' ')))};
var bezD=function(t){return String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')};
function hledat(){return hl('Hledat',1,1)+'<label class="ob-q">'+sv(IK.hledat,22)+'<span class="sr">Hledat</span><input id="obq" type="search" placeholder="Jméno, telefon, chatka, číslo rezervace…" autocomplete="off" value="'+esc(hq)+'"></label><div id="obqv" aria-live="polite"></div>'}
function hledatPo(){var i=$('#obq',box);if(!i)return;var vys=function(){hq=i.value;$('#obqv',box).innerHTML=vysledky(hq)};i.addEventListener('input',vys);vys();try{i.focus();i.setSelectionRange(i.value.length,i.value.length)}catch(e){}}
function vysledky(q){q=bezD(q).trim();if(q.length<2)return '<p class="ob-sum">Napište aspoň 2 znaky. Hledá se ve jménu, telefonu, e-mailu, čísle rezervace, místě (např. „chatka 7“) i datu.</p>';
  var dn=DNES(),slova=q.split(/\s+/),L=R.vse().filter(function(r){if(r.stav==='blk')return false;var t=bezD([r.jmeno,r.telefon,String(r.telefon||'').replace(/\s/g,''),r.email,r.cislo,mistaTxt(r),kr(r.od),kr(r.do),r.lode&&R.lodePocet(r.lode)?'lode '+R.lodeKusyTxt(r.lode.kusy)+' '+kr(r.lode.den):''].join(' '));return slova.every(function(w){return t.indexOf(w)>=0})});
  L.sort(function(a,b){var x=Math.abs(D(a.od)-D(dn)),y=Math.abs(D(b.od)-D(dn));return x-y});
  if(!L.length)return prazdne('Nic nenalezeno.');
  return '<p class="ob-sum">Nalezeno '+L.length+(L.length>40?' – ukazuji 40 nejbližších':'')+'</p><section class="ob-pan">'+L.slice(0,40).map(function(r){var mk=maMisto(r)?mistoKr(r):{t:'lodě',n:sLod(r)?R.lodePocet(r.lode)+'×':'',vic:0},n=noci(r);
    var st=r.stav==='zru'?'<span class="ob-ch zl">Zrušená</span>':'<span class="ob-ch">'+esc(R.STAVY[r.stav]||r.stav)+'</span>';
    var info=(maMisto(r)?kr(r.od)+' – '+kr(r.do)+' '+r.do.slice(0,4)+' · '+n+' '+pl(n,'noc','noci','nocí')+' · '+mistaTxt(r):'lodě '+kr(r.lode.den)+' '+r.lode.den.slice(0,4)+' · '+R.lodeKusyTxt(r.lode.kusy));
    return '<button type="button" class="ob-r ob-hr" data-det="'+r.id+'"><span class="ob-mi"><small>'+esc(mk.t)+'</small><b>'+esc(mk.n||'')+'</b></span><span class="ob-r-t"><span class="ob-r-n"><b>'+esc(r.jmeno)+'</b><small class="ob-cis">'+esc(r.cislo||'')+'</small></span><small>'+esc(info)+'</small><span class="ob-r-ch">'+st+(r.stav!=='zru'?platbaCh(r):'')+(maMisto(r)&&sLod(r)?'<span class="ob-ch l">+ lodě</span>':'')+(r.doprava&&r.doprava.misto&&r.doprava.misto!=='kemp'?'<span class="ob-ch d">+ doprava</span>':'')+(r.telefon?'<span class="ob-ch">'+esc(r.telefon)+'</span>':'')+'</span></span><span class="ob-st">Detail '+sv(IK.vpred,18)+'</span></button>'}).join('')+'</section>'}
/* detail rezervace = stejný panel jako v plné administraci (úpravy, historie, platba) */
function detail(id){var hid=$('#obskr');if(!hid){hid=document.createElement('div');hid.id='obskr';hid.className='ob-skr';box.appendChild(hid)}
  KK.LS.set('rez.tab.ubytovani','uby');hid.innerHTML='';try{A.rezervace(hid,'ubytovani')}catch(x){return A.toast('Detail se nepodařilo otevřít.',1)}
  if(!hid.otevri)return;hid.otevri(id);var rd=$('#rd',hid);if(!rd)return;
  new MutationObserver(function(m,o){if(rd.hidden){o.disconnect();setTimeout(kresli,30)}}).observe(rd,{attributes:true,attributeFilter:['hidden']});
  var x=$('button',rd);if(x)x.focus()}
function klik(e){var t=e.target.closest('button,a,input,label,summary,details');
  /* klik kamkoli na rezervaci (mimo tlačítka) = detail rezervace */
  if(!t){var d=e.target.closest('[data-det]');if(d&&A.app.contains(d)&&!d.closest('#obrz,#obskr'))detail(d.dataset.det);return}
  if(!A.app.contains(t)||t.tagName==='INPUT'||t.tagName==='LABEL'||t.tagName==='SUMMARY'||t.tagName==='DETAILS')return;
  if(t.closest('#obrz,#obskr'))return;
  if(t.dataset.nova)return nova(t.dataset.nova,t.dataset.btn);
  if(t.dataset.det)return detail(t.dataset.det); /* plánek a kalendář si klikání obsluhují samy */
  if(t.hasAttribute('data-ucet'))return ucetMenu();
  if(t.hasAttribute('data-tisk'))return print();
  if(t.dataset.den!=null){var n=+t.dataset.den;den=n?ADD(den,n):DNES();return kresli()}
  if(t.hasAttribute('data-qx')){var qi=$('.ob-qi',box);if(qi){qi.value='';filtruj();qi.focus()}return}
  if(t.dataset.seg){KK.LS.set('o.tab.'+t.dataset.seg,t.dataset.v);return kresli()}
  if(t.dataset.cel){var b=t.getAttribute('aria-label');return A.toast(b)}
  if(t.dataset.j!=null){var g=GJ[+t.dataset.j];if(!g)return;if(t.dataset.hot==='0')A.ptej('Vrátit jízdu zpět?\n\n'+R.mistoN(g.misto)+' bude zase nehotové.',{ok:'Vrátit zpět'}).then(function(a){if(a)AKCE.jizda(g,0)});else AKCE.jizda(g,1);return}
  if(t.dataset.a&&AKCE[t.dataset.a]){var r=najdi(t.dataset.id);if(!r)return A.toast('Rezervace už neexistuje.',1);
    if((t.dataset.a==='zaloha'||t.dataset.a==='doplaceno')&&!ja.platby)return A.toast('Platby potvrzuje správce.',1);AKCE[t.dataset.a](r)}}

window.KKO={
  /* má přihlášený dostat aplikaci místo plné administrace? (obsluha se vzhledem aplikace, nebo správce v náhledu) */
  ma:function(s){return !!s&&(KK.auth.aplikace()||(s.role==='admin'&&!!KK.LS.get('o.nahled',0)))},
  start:function(s,api){A=api;R=window.KKR;ja=KK.auth.meSync()||s;den=DNES();poslSek='-';
    if(!/^#o(\/|$)/.test(location.hash))history.replaceState(null,'','#o');
    try{if(R.auto)R.auto(den)}catch(e){}
    if(!moduly().length){A.app.innerHTML='<div class="ob-none"><h1>Zatím nemáte žádnou sekci</h1><p>Požádejte správce, ať vám v Uživatelích zapne Ubytování, Lodě nebo Dopravu.</p><button type="button" class="btn pri" id="obl">Odhlásit</button></div>';$('#obl').onclick=function(){KK.auth.logout().then(A.login)};return}
    kostra();
    onhashchange=function(){var j=KK.auth.meSync();if(!j){onhashchange=null;document.documentElement.classList.remove('ob-on');return A.login()}ja=j;if(!/^#o(\/|$)/.test(location.hash)){history.replaceState(null,'','#o')}kresli()};
    if(!slysi){
      /* pole nahoře v sekci = filtr zobrazeného seznamu */
      A.app.addEventListener('input',function(e){if(e.target.classList&&e.target.classList.contains('ob-qi'))filtruj()});
      document.addEventListener('keydown',function(e){if(e.key==='/'&&document.documentElement.classList.contains('ob-on')&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||'')&&!$('dialog[open]')){var qi=$('.ob-qi',box);if(qi){e.preventDefault();qi.focus();qi.select()}}});
      A.app.addEventListener('keydown',function(e){var i=e.target;if(e.key==='Escape'&&i.classList&&i.classList.contains('ob-qi')){i.value='';filtruj()}})}
    if(!slysi)document.addEventListener('close',function(){if($('#obskr'))setTimeout(function(){if($('#obskr')&&!$('dialog[open]'))kresli()},60)},true);
    if(!slysi)addEventListener('storage',function(e){if(document.documentElement.classList.contains('ob-on')&&e.key&&/rez|uzivatele|session/.test(e.key)){var j=KK.auth.meSync();if(!j||!KKO.ma(j))return location.reload();ja=j;kresli()}});slysi=true;
    kresli()}
};
})();
