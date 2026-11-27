/* =====================================================================
   Kemp Krumlov – napojení na server (PHP + MariaDB, složka api/)
   ---------------------------------------------------------------------
   Načítá se jako PRVNÍ skript na každé stránce (web, PE-LA, administrace).
   1) Při otevření stránky stáhne data ze serveru a uloží je do localStorage
      pod stejné klíče kkt.*, se kterými už pracuje celý web i administrace.
   2) Každý zápis do těchto klíčů (texty, ceník, nastavení, rezervace …)
      hned pošle na server. Když se zápis nepovede, ukáže se upozornění.
   3) Přihlášená administrace se každých 30 s podívá, jestli něco nezměnil
      někdo jiný (jiný počítač, telefon obsluhy).
   Bez serveru (otevření ze souboru, server nedostupný) zůstane vše jako
   dřív v prohlížeči. Vynutit náhled bez serveru: ?lokalne=1
   ===================================================================== */
(function(){
'use strict';
var S=window.KKS={on:false,prihlasen:false,rev:0,chyba:''};
var me=document.currentScript,src=(me&&me.src)||'';
var ROOT=src.replace(/js\/server\.js.*$/,'');
S.root=ROOT;try{S.rootPath=new URL(ROOT).pathname}catch(e){S.rootPath='/'}
var API=ROOT+'api/';
var ADMIN=/\/admin\//.test(location.pathname);
if(!/^https?:$/.test(location.protocol)||/[?&]lokalne=1/.test(location.search)||window.KK_LOKALNE)return;

var P=Storage.prototype,oSet=P.setItem,oDel=P.removeItem,oGet=P.getItem;
var rset=function(k,v){try{oSet.call(localStorage,'kkt.'+k,v)}catch(e){}},
    rdel=function(k){try{oDel.call(localStorage,'kkt.'+k)}catch(e){}},
    rget=function(k){try{return oGet.call(localStorage,'kkt.'+k)}catch(e){return null}};
S.uloz=function(k,o){rset(k,JSON.stringify(o))};
/* klíče, které se ukládají na server (bez předpony kkt.) */
var SYNC=/^(pela\.)?((texty|dtexty)(\.(en|de))?|ikony|obrazky|seo|galerie|galerie\.kat)$|^(cenik|rez\.nast|rez\.archiv|rez\.cislo|prava|voda\.data)$/;
var SPEC={rezervace:1,historie:1,uzivatele:1,session:1};

/* ---------- požadavky ---------- */
function xhr(method,a,body,q){
  var x=new XMLHttpRequest();x.open(method,API+'?a='+a+(q||''),false);x.setRequestHeader('X-KK','1');
  if(body&&!(body instanceof FormData))x.setRequestHeader('Content-Type','application/json');
  x.send(body?(body instanceof FormData?body:JSON.stringify(body)):null);
  var d=null;try{d=JSON.parse(x.responseText)}catch(e){}
  if(x.status<200||x.status>=300||!d){var er=new Error((d&&d.chyba)||('Server neodpověděl (chyba '+x.status+').'));er.kod=x.status;throw er}
  return d}
function af(method,a,body,q){
  var o={method:method,credentials:'same-origin',headers:{'X-KK':'1'}};
  if(body!=null){if(body instanceof FormData)o.body=body;else{o.headers['Content-Type']='application/json';o.body=JSON.stringify(body)}}
  return fetch(API+'?a='+a+(q||''),o).then(function(r){return r.json().catch(function(){return null}).then(function(d){
    if(!r.ok||d==null){var e=new Error((d&&d.chyba)||('Server neodpověděl (chyba '+r.status+').'));e.kod=r.status;if(r.status===401)odhlasen();throw e}return d})})}
S.post=function(a,body){return af('POST',a,body||{})};
S.get=function(a,q){return af('GET',a,null,q)};
S.postSync=function(a,body){return xhr('POST',a,body||{})};

/* ---------- upozornění dole na stránce ---------- */
var lista=null;
S.upozorni=function(text,akce,trvale){
  var u=function(){if(!document.body)return setTimeout(u,50);
    if(!lista){lista=document.createElement('div');lista.setAttribute('role','alert');
      lista.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147483000;max-width:min(92vw,640px);background:#b3261e;color:#fff;font:600 14px/1.4 system-ui,sans-serif;padding:12px 16px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.3);display:flex;gap:12px;align-items:center';
      document.body.appendChild(lista)}
    lista.style.background=trvale==='ok'?'#1f6d77':'#b3261e';
    lista.innerHTML='';var t=document.createElement('span');t.textContent=text;lista.appendChild(t);
    if(akce){var b=document.createElement('button');b.type='button';b.textContent=akce[0];b.style.cssText='background:#fff;color:#b3261e;border:0;border-radius:8px;padding:6px 12px;font:inherit;cursor:pointer;white-space:nowrap';b.onclick=akce[1];lista.appendChild(b)}
    var x=document.createElement('button');x.type='button';x.setAttribute('aria-label','Zavřít');x.textContent='×';x.style.cssText='background:none;border:0;color:#fff;font-size:20px;cursor:pointer;margin-left:auto';x.onclick=function(){lista.remove();lista=null};lista.appendChild(x);
    clearTimeout(S._t);if(!trvale)S._t=setTimeout(function(){if(lista){lista.remove();lista=null}},9000)};u()};
function odhlasen(){if(!S.prihlasen)return;S.prihlasen=false;S.upozorni('Přihlášení vypršelo – změny se neuloží. Přihlaste se prosím znovu.',['Přihlásit',function(){location.reload()}],true)}

/* ---------- snímek posledního stavu ze serveru (kvůli posílání jen změn) ---------- */
var snapRez={},histPrvni='',zapsano=0;
function snapZ(json){snapRez={};var a;try{a=JSON.parse(json||'[]')||[]}catch(e){a=[]}a.forEach(function(r){if(r&&r.id)snapRez[r.id]=JSON.stringify(r)})}
function histZ(json){var a;try{a=JSON.parse(json||'[]')||[]}catch(e){a=[]}histPrvni=a.length?JSON.stringify(a[0]):''}

/* ---------- načtení dat při otevření stránky ---------- */
S.nacti=function(){
  var q='&web='+(window.KK_WEB==='pela'?'pela':'kemp'),p=new URLSearchParams(location.search);
  if(/storno\.html$/.test(location.pathname)&&p.get('r'))q+='&r='+encodeURIComponent(p.get('r'))+'&k='+encodeURIComponent(p.get('k')||'');
  var d=xhr('GET','data',null,q),D=d.data||{};
  S.on=true;S.prihlasen=!!d.prihlasen;S.rev=d.rev||0;
  zalohujNahled();
  var pryc=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('kkt.')===0){var b=k.slice(4);if((SYNC.test(b)||SPEC[b])&&!(b in D))pryc.push(b)}}
  pryc.forEach(rdel);
  Object.keys(D).forEach(function(k){rset(k,D[k])});
  rset('rez.ukazka','10');/* ukázková data na ostrém webu nevznikají */
  snapZ(D.rezervace);histZ(D.historie);S._D=D;
  if(d.cron&&!S._cron){S._cron=1;setTimeout(function(){fetch(API+'?a=cron',{credentials:'same-origin'}).catch(function(){})},3000)}
  if(S.prihlasen&&ADMIN){setTimeout(nabidniNahled,600);setTimeout(S.autoMaily,8000)}
  return d};

/* ---------- převzetí úprav z náhledu (data, která byla jen v tomto prohlížeči) ---------- */
var ZK='kk-nahled-zaloha',ZP='kk-nahled-prevzato';
function zalohujNahled(){
  try{if(oGet.call(localStorage,ZK)!=null)return;
    var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(!k||k.indexOf('kkt.')!==0)continue;var b=k.slice(4);if(!SYNC.test(b)&&b!=='rezervace')continue;
      var v=oGet.call(localStorage,k);if(v==null||v==='{}'||v==='[]'||v==='null')continue;
      if(b==='rezervace'){var a=[];try{a=(JSON.parse(v)||[]).filter(function(r){return r&&!r.ukazka})}catch(e){}if(!a.length)continue;v=JSON.stringify(a)}
      if(b==='rez.cislo'||b==='voda.data')continue;
      o[b]=v}
    oSet.call(localStorage,ZK,JSON.stringify({kdy:Date.now(),data:o}))}catch(e){}}
S.nahled=function(){try{var z=JSON.parse(oGet.call(localStorage,ZK)||'null');return z&&z.data&&Object.keys(z.data).length?z:null}catch(e){return null}};
function idb(jm,store){return new Promise(function(ok){if(!window.indexedDB)return ok([]);var r=indexedDB.open(jm,1);
  r.onupgradeneeded=function(){r.result.createObjectStore(store,{keyPath:'id'})};
  r.onsuccess=function(){try{var t=r.result.transaction(store,'readonly').objectStore(store).getAll();t.onsuccess=function(){ok(t.result||[])};t.onerror=function(){ok([])}}catch(e){ok([])}};r.onerror=function(){ok([])}})}
S.prevzit=function(){
  var z=S.nahled()||{data:{}},Z=z.data,D=S._D||{},hotovo=[];
  var p=Promise.resolve();
  /* 1) nahrazené fotky na webu (soubory z IndexedDB) → server, v mapě nové adresy */
  ['','pela.'].forEach(function(w){var k=w+'obrazky';if(!Z[k]||D[k])return;
    p=p.then(function(){return idb(w?'kkt-pela-obrazky':'kkt-obrazky','o')}).then(function(soubory){
      var m={};soubory.forEach(function(s){m[s.id]=s.blob});var mapa=JSON.parse(Z[k]),q=Promise.resolve();
      Object.keys(mapa).forEach(function(c){var x=mapa[c];if(!x||x.url||!m[x.id])return;
        q=q.then(function(){var fd=new FormData();fd.append('soubor',m[x.id],'foto.webp');return S.post('obrazek',fd).then(function(r){mapa[c]={id:r.id,v:r.v,url:S.rootPath+r.url}})})});
      return q.then(function(){Z[k]=JSON.stringify(mapa)})})});
  /* 2) texty, ceník, nastavení … – jen co na serveru ještě není */
  p=p.then(function(){Object.keys(Z).forEach(function(k){if(k==='rezervace'||D[k]||!SYNC.test(k))return;xhr('POST','kv',{klic:k,hodnota:Z[k]});hotovo.push(k)})});
  /* 3) rezervace zadané ručně v náhledu (bez ukázkových) */
  p=p.then(function(){if(!Z.rezervace)return;var a=JSON.parse(Z.rezervace),je={};(JSON.parse(D.rezervace||'[]')||[]).forEach(function(r){je[r.id]=1});
    a=a.filter(function(r){return !je[r.id]});if(a.length){xhr('POST','rez',{upsert:a,smaz:[]});hotovo.push(a.length+' rezervací')}});
  /* 4) galerie obou webů */
  [['kemp','kkt-admin'],['pela','kkt-pela-admin']].forEach(function(g){
    p=p.then(function(){return S.get('fotky','&web='+g[0])}).then(function(srv){if(srv&&srv.length)return;
      return idb(g[1],'fotky').then(function(f){f.sort(function(a,b){return a.poradi-b.poradi});var web=f.filter(function(x){return x.src&&!x.blob}),q=Promise.resolve();
        if(web.length)q=q.then(function(){return S.post('fotky_web',{web:g[0],polozky:web})});
        f.filter(function(x){return x.blob}).forEach(function(x){q=q.then(function(){var fd=new FormData();fd.append('web',g[0]);fd.append('kat',x.kat||'');fd.append('popis',x.popis||'');fd.append('poradi',x.poradi||0);fd.append('puvodni',x.puvodni||0);
          fd.append('velka',x.blob,'velka.webp');if(x.nahled)fd.append('mala',x.nahled,'mala.webp');
          return S.post('fotka',fd).then(function(r){if(x.viditelna===false)return S.post('fotka_uprav',{id:r.id,zmena:{viditelna:false}})})})});
        if(f.length)hotovo.push(f.length+' fotek galerie'+(g[0]==='pela'?' PE-LA':''));return q})})});
  return p.then(function(){try{oSet.call(localStorage,ZP,String(Date.now()))}catch(e){}return hotovo})};
function nabidniNahled(){
  try{if(oGet.call(localStorage,ZP))return}catch(e){return}
  if(!S.nahled())return;
  S.upozorni('V tomto prohlížeči jsou úpravy z doby před napojením na server (texty, ceník, nastavení, fotky). Nahrát je na server?',['Nahrát na server',function(){
    S.upozorni('Nahrávám…',null,true);
    S.prevzit().then(function(h){S.upozorni('Hotovo – nahráno: '+(h.length?h.join(', '):'nic nového')+'.',['Obnovit stránku',function(){location.reload()}],true)},
      function(e){S.upozorni('Nahrání se nepovedlo: '+e.message,['Zkusit znovu',nabidniNahled],true)})}],true);
  /* zavření křížkem = už nenabízet */
  var x=lista&&lista.querySelector('button[aria-label="Zavřít"]');if(x){var o=x.onclick;x.onclick=function(){try{oSet.call(localStorage,ZP,'ne')}catch(e){}o()}}}

/* ---------- zápis změn na server ---------- */
function rezDiff(v){
  var a;try{a=JSON.parse(v||'[]')||[]}catch(e){return}
  var nove={},up=[],sm=[];
  a.forEach(function(r){if(!r||!r.id)return;var j=JSON.stringify(r);nove[r.id]=j;if(snapRez[r.id]!==j)up.push(r)});
  Object.keys(snapRez).forEach(function(id){if(!(id in nove))sm.push(id)});
  if(!up.length&&!sm.length)return;
  var stare=snapRez;
  xhr('POST','rez',{upsert:up,smaz:sm});snapRez=nove;zapsano=Date.now();
  setTimeout(function(){up.forEach(function(r){var o=null;try{o=stare[r.id]?JSON.parse(stare[r.id]):null}catch(e){}if(o)prechod(o,r)})},0)}
/* e-mail hostovi podle změny stavu (stejně jako v Rezervace → Nastavení → Šablony e-mailů) */
function prechod(o,r){
  if(!r.email||r.stav==='blk'||r.spoj)return;
  var op=(o.platba||{}).stav,np=(r.platba||{}).stav;
  if(op==='ceka'&&(np==='zal'||np==='vse'))S.mail(r,'zaplaceno');
  else if(o.stav==='pop'&&r.stav==='pot')S.mail(r,'rezervace');
  if(o.stav!=='zru'&&r.stav==='zru'&&!r.stornoHost){var h=(r.hist||[]).slice(-1)[0]||{},co=String(h.co||'');
    if(/^Propadla/.test(co))S.mail(r,'propadla');else if(!/^Automaticky zrušena/.test(co))S.mail(r,'zruseno')}}
function histDiff(v){
  var a;try{a=JSON.parse(v||'[]')||[]}catch(e){return}
  var n=0;if(histPrvni){while(n<a.length&&n<50&&JSON.stringify(a[n])!==histPrvni)n++;if(n>=a.length)n=Math.min(a.length,5)}else n=Math.min(a.length,5);
  if(!n)return;var nov=a.slice(0,n).reverse();histPrvni=JSON.stringify(a[0]);
  S.post('hist',{polozky:nov}).catch(function(){})}
function zapis(k,v){
  if(!S.prihlasen)return;
  if(k==='rezervace')return rezDiff(v);
  if(k==='historie')return histDiff(v);
  if(!SYNC.test(k)||k==='voda.data')return;
  if(v!==null&&rget(k)===v)return;
  if(v===null&&rget(k)===null)return;
  xhr('POST','kv',{klic:k,hodnota:v});zapsano=Date.now();
  if(/^pela\.|^cenik$/.test(k))pelaObnov()}
/* web PE-LA (vlastní hosting) si data z administrace drží 2 minuty – po uložení ho požádat o obnovení hned */
var pelaT=0;function pelaObnov(){clearTimeout(pelaT);pelaT=setTimeout(function(){try{fetch('https://www.pe-la.cz/?obnovit='+Date.now(),{mode:'no-cors',cache:'no-store'}).catch(function(){})}catch(e){}},1500)}
function chyt(k,v){
  try{zapis(k,v)}catch(e){
    if(e.kod===401)odhlasen();else S.upozorni('Změnu se nepodařilo uložit na server: '+e.message);
    throw e}}

/* ---------- nová rezervace a storno (web i administrace) ---------- */
function vlozMistne(r){var a;try{a=JSON.parse(rget('rezervace')||'[]')||[]}catch(e){a=[]}
  a=a.filter(function(x){return x&&x.id!==r.id});a.push(r);rset('rezervace',JSON.stringify(a));if(S.prihlasen)snapRez[r.id]=JSON.stringify(r)}
S.novaRez=function(r){
  try{var d=xhr('POST','rez_nova',{r:r})}catch(e){
    if(e.kod===409)throw new Error(/vybaven/.test(e.message)?'Na tento termín už není dost vybavení.':'V tomto termínu je obsazeno.');
    throw new Error(e.message||'Rezervaci se nepodařilo uložit.')}
  vlozMistne(d.r);zapsano=Date.now();
  if(!S.prihlasen&&!d.r.spoj){var r2=d.r,mt=d.mt,pl=r2.platba||{};
    setTimeout(function(){S.mail(r2,+pl.zaloha>0?'zaloha':r2.stav==='pot'?'rezervace':'poptavka',mt).then(function(){return S.mail(r2,'kemp',mt)})},0)}
  return d.r};
S.storno=function(id,k,duvod){
  var d=xhr('POST','storno',{r:id,k:k,duvod:duvod||''});vlozMistne(d.r);
  var r2=d.r,mt=d.mt;setTimeout(function(){S.mail(r2,'zruseno',mt).then(function(){return S.mail(r2,'stornoKemp',mt)})},0);
  return d.r};

/* ---------- e-maily: text a vzhled ze šablon (KKR), odešle server ---------- */
var NAZ={poptavka:'Poptávka přijata',rezervace:'Rezervace potvrzena',zaloha:'Výzva k zaplacení zálohy',zaplaceno:'Záloha přijata',propadla:'Rezervace propadla',zruseno:'Rezervace zrušena',predPrijezdem:'Den před příjezdem',plavba:'Ráno v den plavby',recenze:'Prosba o recenzi',kemp:'Upozornění pro kemp',stornoKemp:'Host zrušil rezervaci'};
S.mail=function(r,druh,mt){
  var R=window.KKR;if(!R||!R.sablona||!r)return Promise.resolve(null);
  var kemp=druh==='kemp'||druh==='stornoKemp';if(!kemp&&!r.email)return Promise.resolve(null);
  var j=kemp?'cs':(['cs','en','de'].indexOf(r.jazyk)>=0?r.jazyk:'cs'),t;
  return (druh==='zaloha'?S.qrPlatba(r).catch(function(){return null}):Promise.resolve(null)).then(function(qr){
  try{var s=R.sablona(druh,j);t={id:r.id,druh:druh,mt:mt||'',predmet:R.dosad(s.predmet,r,j),text:R.dosad(s.text,r,j),html:R.emailHtml(druh,j,s.predmet,s.text,r,qr?qrBlok(qr,j):'')};if(qr)t.qr=qr.data}catch(e){return null}
  return S.post('mail',t)}).then(function(d){if(!d)return null;
    if(d&&d.ok&&!d.uz&&S.prihlasen&&R.uprav){try{var x=R.vse().filter(function(q){return q.id===r.id})[0];if(x){var m=Object.assign({},x.maily||{});m[druh]=d.kdy||Date.now();
      R.uprav(r.id,{maily:m,hist:(x.hist||[]).concat([{t:Date.now(),kdo:'Systém',co:'Odeslán e-mail: '+(NAZ[druh]||druh)+(d.komu&&d.komu!=='kemp'?' ('+d.komu+')':' (kemp)')}]).slice(-30)})}}catch(e){}}
    return d},function(e){if(ADMIN)S.upozorni('E-mail „'+(NAZ[druh]||druh)+'“ se nepodařilo odeslat: '+e.message);return null})};
/* QR platba zálohy (SPAYD – české bankovní aplikace), stejná jako na webu po odeslání rezervace */
function ibanCZ(u){u=String(u||'').replace(/\s/g,'').toUpperCase();if(/^CZ\d{22}$/.test(u))return u;var m=u.match(/^(?:(\d{1,6})-)?(\d{2,10})\/(\d{4})$/);if(!m)return '';
  var pad=function(x,n){x=String(x||'');while(x.length<n)x='0'+x;return x},bban=m[3]+pad(m[1],6)+pad(m[2],10),z=bban+'123500',r=0;for(var i=0;i<z.length;i++)r=(r*10+(+z[i]))%97;return 'CZ'+pad(98-r,2)+bban}
function nactiQR(){return window.qrcode?Promise.resolve():new Promise(function(ok,no){var sc=document.createElement('script');sc.src=ROOT+'js/vendor/qrcode.js';sc.onload=ok;sc.onerror=no;document.head.appendChild(sc)})}
S.qrPlatba=function(r){var R=window.KKR,Z=R&&R.zaloha?R.zaloha():{},ib=ibanCZ(Z.ucet),pl=(r&&r.platba)||{};if(!ib||!(+pl.zaloha))return Promise.resolve(null);
  var vs=String(r.cislo||'').replace(/\D/g,'').slice(-10),am=(+pl.zaloha).toFixed(2),dt=String(pl.splatnost||'').replace(/-/g,''),
    msg=('KEMP KRUMLOV '+(r.cislo||'')).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\*/g,'').slice(0,60),
    spd='SPD*1.0*ACC:'+ib+'*AM:'+am+'*CC:CZK'+(vs?'*X-VS:'+vs:'')+(dt?'*DT:'+dt:'')+'*MSG:'+msg;
  return nactiQR().then(function(){var q=qrcode(0,'M');q.addData(spd);q.make();return{data:q.createDataURL(6,3).split(',')[1],castka:Math.round(+pl.zaloha),ucet:Z.ucet,vs:vs}})};
function qrBlok(qr,j){var T={cs:['QR platba','Naskenujte kód v aplikaci své banky – částka, účet i variabilní symbol se vyplní samy.'],en:['QR payment','Scan the code in your Czech banking app – amount, account and reference are filled in automatically.'],de:['QR-Zahlung','Scannen Sie den Code in Ihrer tschechischen Banking-App – Betrag, Konto und Verwendungszweck werden automatisch ausgefüllt.']}[j]||[];
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ec;border:1px solid #e6e0d2;border-radius:12px;margin:0 0 20px"><tr><td width="196" style="padding:14px"><img src="cid:qrplatba" width="180" height="180" alt="QR" style="display:block;border:0;background:#fff;border-radius:8px"></td><td style="padding:14px 16px 14px 0;font-size:14px;line-height:1.55;color:#1d2b24"><b style="font-size:16px;color:#0f2219">'+T[0]+'</b><br>'+T[1]+'</td></tr></table>'}
S.testMail=function(komu){return S.post('mail_test',{komu:komu||''})};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#kk-test-mail');if(!b)return;var em=document.getElementById('sbem');b.disabled=true;
  S.testMail(em?em.value.trim():'').then(function(d){S.upozorni('Zkušební e-mail odeslán na '+d.komu+'. Zkontrolujte schránku (i spam).',null,'ok')},function(er){S.upozorni(er.message,null,true)}).then(function(){b.disabled=false})});
/* automatické e-maily (den před příjezdem, ráno v den plavby, recenze) – posílá otevřená administrace / aplikace obsluhy,
   server hlídá, aby každý odešel jen jednou, i když je administrace otevřená na více zařízeních */
var autoKdy=0;
function den(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
S.autoMaily=function(){
  var R=window.KKR;if(!S.prihlasen||!ADMIN||!R||!R.vse||Date.now()-autoKdy<600000)return;autoKdy=Date.now();
  var n=R.nast(),am=n.autoMail||{},t=new Date(),h=t.getHours(),dnes=den(t),z=new Date(t);z.setDate(z.getDate()+1);var zitra=den(z);z=new Date(t);z.setDate(z.getDate()-4);var pred4=den(z);
  var fronta=[];
  R.vse().forEach(function(r){if(!r||!r.email||r.spoj)return;var m=r.maily||{},ub=(r.mista||[]).length||+(r.dalsi||{}).stan||+(r.dalsi||{}).karavan;
    if(am.predPrijezdem!==false&&!m.predPrijezdem&&r.stav==='pot'&&ub&&r.od===zitra&&h>=10)fronta.push([r,'predPrijezdem']);
    if(am.plavba!==false&&!m.plavba&&(r.stav==='pot'||r.stav==='uby')&&r.lode&&R.lodePocet(r.lode)&&r.lode.den===dnes&&h>=7&&h<15)fronta.push([r,'plavba']);
    var ph=(r.hist||[]).slice(-1)[0]||{};if(r.stav==='zru'&&!m.propadla&&/^Propadla/.test(String(ph.co||''))&&Date.now()-(+ph.t||0)<3*864e5)fronta.push([r,'propadla']);
        if(am.recenze!==false&&!m.recenze&&n.recenzeUrl&&r.do&&r.do<dnes&&r.do>pred4&&h>=11&&(r.stav==='odj'||r.stav==='uby'||r.stav==='pot'))fronta.push([r,'recenze'])});
  fronta.slice(0,8).reduce(function(p,x){return p.then(function(){return S.mail(x[0],x[1])})},Promise.resolve())};

/* ---------- změny z jiných zařízení (jen přihlášení) ---------- */
function obnov(){
  if(!S.prihlasen||document.hidden)return;var start=Date.now();S.autoMaily();
  S.get('zmeny','&rev='+S.rev).then(function(d){
    if(!d||zapsano>start)return;/* mezitím jsme sami něco zapsali – zkusí se příště */
    var zm=false;
    Object.keys(d.kv||{}).forEach(function(k){var v=d.kv[k];if(v==null){if(rget(k)!=null){rdel(k);zm=true}}else if(rget(k)!==v){rset(k,v);zm=true}});
    if((d.rez&&d.rez.length)||(d.smaz&&d.smaz.length)){
      var a;try{a=JSON.parse(rget('rezervace')||'[]')||[]}catch(e){a=[]}
      var m={};a.forEach(function(r){if(r&&r.id)m[r.id]=r});
      (d.rez||[]).forEach(function(r){var j=JSON.stringify(r);if(!m[r.id]||JSON.stringify(m[r.id])!==j){m[r.id]=r;zm=true}snapRez[r.id]=j});
      (d.smaz||[]).forEach(function(id){if(m[id]){delete m[id];zm=true}delete snapRez[id]});
      if(zm)rset('rezervace',JSON.stringify(Object.keys(m).map(function(id){return m[id]})))}
    S.rev=d.rev;
    if(zm){try{window.dispatchEvent(new CustomEvent('kk-zmeny'))}catch(e){}
      if(ADMIN)S.upozorni('Někdo jiný mezitím změnil data. Obnovte stránku, ať vidíte aktuální stav.',['Obnovit',function(){location.reload()}],true)}
  }).catch(function(){})}

/* ---------- start ---------- */
try{S.nacti()}catch(e){
  S.on=false;S.chyba=e.message;
  if(ADMIN)S.upozorni('Server není dostupný ('+e.message+'). Změny se teď ukládají jen v tomto prohlížeči.',null,true);
  return}
P.setItem=function(k,v){if(this===localStorage&&S.on&&typeof k==='string'&&k.indexOf('kkt.')===0)chyt(k.slice(4),String(v));return oSet.apply(this,arguments)};
P.removeItem=function(k){if(this===localStorage&&S.on&&typeof k==='string'&&k.indexOf('kkt.')===0)chyt(k.slice(4),null);return oDel.apply(this,arguments)};
setInterval(obnov,30000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)obnov()});
})();
