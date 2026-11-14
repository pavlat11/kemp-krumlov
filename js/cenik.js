/* =====================================================================
   Kemp Krumlov – CENÍK: jediný zdroj všech cen na webu.
   Používají ho: úvod, karty ubytování, tabulka ceníku, výpočet rezervace,
   mapa kempu, Doprava osob a ceník lodí PE-LA.
   Náhled: úpravy z administrace jsou v localStorage (kk.cenik).
   Server: vypíše window.KK_CENIK_DATA přímo do stránky (stejný formát).
   ===================================================================== */
(function(){
'use strict';
/* sloupce: a = sezóna / 1 den / cena,  b = mimo sezónu / vícedenní */
var VYCHOZI={verze:1,
 sezona:{otevrenoOd:'05-01',otevrenoDo:'10-01',hlavniOd:6,hlavniDo:8,hlavniZap:true,celorocne:false},
 /* hlavniZap:false = jedna cena po celý rok (platí sloupec a),  celorocne:true = kemp otevřený celý rok */
 slevy:[{noci:2,proc:10},{noci:3,proc:15},{noci:4,proc:20}],
 kategorie:{
  osoby:{n:'Osoby',sloupce:['Sezóna','Mimo sezónu']},
  ubytovani:{n:'Ubytování',sloupce:['Sezóna','Mimo sezónu']},
  doplnky:{n:'Doplňky',sloupce:['Sezóna','Mimo sezónu']},
  doprava:{n:'Doprava osob (cena za auto pro 8 osob)',sloupce:['Cena']}
 },
 polozky:[
  {k:'os',kat:'osoby',n:'Osoba',pozn:'od 15 let, včetně místního poplatku 50 Kč',a:200,b:190},
  {k:'dite',kat:'osoby',n:'Dítě',pozn:'do 15 let',a:120,b:100},
  {k:'zak',kat:'osoby',n:'Žák ve stanu',pozn:'jen ve vlastním stanu',a:150,b:150},
  {k:'stan',kat:'ubytovani',n:'Stan',pozn:'místo na louce u řeky',a:200,b:190,jed:'stan',rez:1},
  {k:'karavan',kat:'ubytovani',n:'Karavan',pozn:'místo s elektřinou',a:500,b:300,jed:'místo',rez:1},
  {k:'chatka',kat:'ubytovani',n:'Chatka',pozn:'+ každá osoba',a:990,b:890,jed:'chatka',luzka:7,rez:1},
  {k:'teepee',kat:'ubytovani',n:'Teepee',pozn:'',a:800,b:700,jed:'teepee',luzka:4,rez:1},
  {k:'podsad',kat:'ubytovani',n:'Podsadový stan',pozn:'už postavený',a:300,b:300,jed:'stan',luzka:2,rez:1},
  {k:'auto',kat:'doplnky',n:'Auto',pozn:'za den',a:200,b:200,rez:1},
  {k:'moto',kat:'doplnky',n:'Motocykl',pozn:'',a:100,b:100,rez:1},
  {k:'elek',kat:'doplnky',n:'Elektřina',pozn:'',a:200,b:200,rez:1},
  {k:'pes',kat:'doplnky',n:'Pes',pozn:'',a:50,b:50,rez:1},
  {k:'dop1',kat:'doprava',n:'Vyšší Brod',a:1150},{k:'dop2',kat:'doprava',n:'Rožmberk nad Vltavou',a:850},{k:'dop3',kat:'doprava',n:'Nahořany',a:650},
  {k:'dop4',kat:'doprava',n:'Kemp Vltava',a:550},{k:'dop5',kat:'doprava',n:'Viking / Pískárna',a:500},{k:'dop6',kat:'doprava',n:'Vltavan / Spolí',a:350},
  {k:'dop7',kat:'doprava',n:'Centrum',a:250},{k:'dop8',kat:'doprava',n:'Zlatá Koruna',a:350},{k:'dop9',kat:'doprava',n:'Boršov',a:900}
 ],
 /* měna: eur = nabízet přepínač Kč/€, kurz Kč za 1 €, zaokr = zaokrouhlení eur (1 | 0.5 | 0.1) */
 mena:{eur:true,kurz:25,zaokr:1},
 /* služby v kempu – jen text do ceníku na webu, nepočítají se */
 sluzby:[{n:'Sprcha na mince',t:'20 Kč / 4 min'},{n:'Úschovna bagáže',t:'50 Kč / batoh'},{n:'Parkování autobusu',t:'500 Kč / den – zdarma, pokud cestující bydlí v kempu'},{n:'Školní kurzy',t:'200 Kč / osoba'}]};
/* starší uložený ceník doplní o nové vlastnosti z výchozího */
function doplň(u){
  if(!u.sluzby){var st=u.polozky.filter(function(p){return p.kat==='sluzby'});u.sluzby=st.length?st.filter(function(p){return p.k!=='poplatek'&&p.skryt!==1}).map(function(p){return{n:p.n,t:(p.a||0)+' Kč'+(p.jed?' / '+p.jed:'')+(p.pozn?' – '+p.pozn:'')}}):JSON.parse(JSON.stringify(VYCHOZI.sluzby));
    var pp=st.filter(function(p){return p.k==='poplatek'})[0],os=u.polozky.filter(function(p){return p.k==='os'})[0];if(os&&!os.pozn)os.pozn='včetně místního poplatku '+(pp?pp.a:50)+' Kč'}
  if(!u.mena)u.mena=JSON.parse(JSON.stringify(VYCHOZI.mena));
  u.kategorie=JSON.parse(JSON.stringify(VYCHOZI.kategorie));u.polozky=u.polozky.filter(function(p){return u.kategorie[p.kat]});return u}
function nacti(){
  if(window.KK_CENIK_DATA)return doplň(window.KK_CENIK_DATA);
  try{var u=JSON.parse(localStorage.getItem('kk.cenik')||'null');if(u&&u.verze===1&&u.polozky)return doplň(u)}catch(e){}
  return JSON.parse(JSON.stringify(VYCHOZI));
}
var C=nacti();
var JZ=window.KKL&&KKL.jazyk||'cs',L=function(x){return window.KKL?KKL.t(x):x},P5=function(n){return window.KKL?KKL.pl(n,'noc','noci','nocí'):(n===1?'noc':n<5?'noci':'nocí')};
/* názvy a poznámky v jiném jazyce (pole n_en, pozn_en … z administrace) */
if(JZ!=='cs'){(C.polozky||[]).forEach(function(p){if(p['n_'+JZ])p.n=p['n_'+JZ];if(p['pozn_'+JZ])p.pozn=p['pozn_'+JZ];if(p['jed_'+JZ])p.jed=p['jed_'+JZ]});(C.sluzby||[]).forEach(function(x){if(x['n_'+JZ])x.n=x['n_'+JZ];if(x['t_'+JZ])x.t=x['t_'+JZ]})}
var HZ=C.sezona.hlavniZap!==false;
var mapa={};C.polozky.forEach(function(p){mapa[p.k]=p});
var fmt=function(n){return Math.round(n).toLocaleString('cs-CZ').replace(/\s/g,' ')};
var KKC=window.KKC={
  data:C,vychozi:VYCHOZI,fmt:fmt,doplň:doplň,
  p:function(k){return mapa[k]},
  /* cena jako číslo: mode a | b | min */
  jednaCena:!HZ,celorocne:C.sezona.celorocne===true,
  rozpeti:function(){var c=[];KKC.kat('ubytovani').forEach(function(p){if(p.skryt===1)return;var a=+p.a||0,b=p.b==null||!HZ?a:+p.b;if(a)c.push(a);if(b)c.push(b)});if(!c.length)return '';var mi=Math.min.apply(0,c),mx=Math.max.apply(0,c);return (KKC.fmt(mi)+(mx>mi?'–'+KKC.fmt(mx):'')+' Kč').replace(/\u00a0/g,' ')},
  v:function(k,mode){var p=mapa[k];if(!p)return 0;var a=+p.a||0,b=p.b==null||!HZ?a:+p.b;return mode==='b'?b:mode==='min'?Math.min(a,b):a},
  /* text: „890 Kč“, „od 890 Kč“ (jen když se ceny liší) */
  t:function(k,mode){var p=mapa[k];if(!p)return '';var a=KKC.v(k,'a'),b=KKC.v(k,'b');if(mode==='od')return (a!==b?'od ':'')+fmt(Math.min(a,b))+' Kč';return fmt(KKC.v(k,mode))+' Kč'},
  kat:function(kat){return C.polozky.filter(function(p){return p.kat===kat})},
  minUbyt:function(){var v=KKC.kat('ubytovani').filter(function(p){return p.rez!==0}).map(function(p){return KKC.v(p.k,'min')});return v.length?Math.min.apply(null,v):0},
  sleva:function(n){var s=0;(C.slevy||[]).forEach(function(x){if(n>=x.noci&&x.proc>s)s=x.proc});return s/100},
  slevyText:function(){return (C.slevy||[]).slice().sort(function(a,b){return a.noci-b.noci}).map(function(x,i,arr){return (i===arr.length-1&&arr.length>1?x.noci+'+ '+P5(5):x.noci+' '+P5(x.noci))+' −'+x.proc+' %'}).join(', ')},
  hlavni:function(m){return HZ&&m+1>=C.sezona.hlavniOd&&m+1<=C.sezona.hlavniDo},
  mesic:['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec']
};

/* ---- 1) všechny ceny v HTML: data-c="klic:mode" (mode a | b | od | min-ubyt) ---- */
var CIS=/(od[\s\u00a0]+)?\d{1,3}(?:[ \u00a0]\d{3})*(?!\d)/;
function prepis(el,text){
  var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),n;
  /* __kkSrc = text před převodem na eura (js/start.js) */
  while((n=w.nextNode())){var v=n.__kkSrc!=null?n.__kkSrc:n.nodeValue;if(CIS.test(v)){var nv=v.replace(CIS,text);if(n.__kkSrc!=null&&nv!==v)n.__kkl=undefined;n.nodeValue=nv;return}}
}
[].forEach.call(document.querySelectorAll('[data-c]'),function(el){
  var sp=el.getAttribute('data-c').split(':'),k=sp[0],m=sp[1]||'a',t;
  if(k==='min-ubyt')t='od '+fmt(KKC.minUbyt());
  else if(!mapa[k])return;
  else if(m==='od'){var a=KKC.v(k,'a'),b=KKC.v(k,'b');t=(a!==b?'od ':'')+fmt(Math.min(a,b))}
  else t=fmt(KKC.v(k,m));
  prepis(el,t);
});

/* ---- 2) tabulka ceníku ---- */
var tb=document.querySelector('#rzPrice tbody');
if(tb){
  var esc=function(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  var h='';
  ['osoby','ubytovani','doplnky'].forEach(function(kat){
    var pol=KKC.kat(kat).filter(function(p){return p.skryt!==1});if(!pol.length)return;
    h+='<tr class="ck-kat"><th colspan="3" scope="colgroup">'+esc(C.kategorie[kat].n)+'</th></tr>';
    pol.forEach(function(p){var pozn=p.pozn;if(p.luzka)pozn=(pozn?L(pozn)+', ':'')+L('kapacita')+' '+p.luzka;
      h+='<tr><td>'+esc(p.n)+(pozn?' <small>'+esc(pozn)+'</small>':'')+'</td>'+(HZ?'<td>'+KKC.t(p.k,'a')+'</td><td>'+KKC.t(p.k,'b')+'</td>':'<td colspan="2">'+KKC.t(p.k,'a')+'</td>')+'</tr>'});
  });
  var sl=C.sluzby||[];
  if(sl.length){h+='<tr class="ck-kat"><th colspan="3" scope="colgroup">Služby v kempu</th></tr>';sl.forEach(function(p){if(p.n)h+='<tr><td>'+esc(p.n)+'</td><td colspan="2">'+esc(p.t)+'</td></tr>'})}
  tb.innerHTML=h;
  var ths=document.querySelectorAll('#rzPrice thead th');if(!HZ&&ths.length===3){ths[1].colSpan=2;ths[1].innerHTML='Cena';ths[1].removeAttribute('data-t');ths[2].remove()}
  var th=HZ&&document.querySelector('#rzPrice thead th small');var MZ=function(m){return JZ!=='cs'&&window.KKL?KKL.mesic(m-1):KKC.mesic[m-1]};if(th)th.textContent=MZ(C.sezona.hlavniOd)+'–'+MZ(C.sezona.hlavniDo);
  var no=document.querySelector('#rzPrice .note');if(no)no.textContent=L('Ceny za noc.')+((C.slevy||[]).length?' '+L('Sleva:')+' '+KKC.slevyText()+'.':'');
}
/* ---- 3) přepínač Kč / € – v ceníku, v kalkulačce rezervace a u dopravy ---- */
var P=window.KKP;
if(P&&P.euraPovolena&&!P.EDIT){
  var EN=P.jazyk==='en',DE=P.jazyk==='de';
  var prepinac=function(kam,pred,trida){if(!kam)return;
    var sw=document.createElement('div');sw.className='kk-mena'+(trida?' '+trida:'');sw.setAttribute('role','group');sw.setAttribute('aria-label',EN?'Currency':DE?'Währung':'Měna');sw.setAttribute('data-bez-meny','');
    sw.innerHTML='<button type="button" data-m="CZK">Kč</button><button type="button" data-m="EUR">€</button>';
    kam.insertBefore(sw,pred||null);
    sw.addEventListener('click',function(e){var b=e.target.closest('button');if(b){P.nastavMenu(b.dataset.m);stavM()}});
  };
  var dlgH=document.querySelector('#rzPrice .rz-dlg-h');
  prepinac(dlgH,dlgH&&dlgH.querySelector('.rz-dlg-x'));
  var kh=document.querySelector('.rz-card-h');prepinac(kh,document.getElementById('rzSeason'),'kk-mena--tmavy');
  var dr=document.querySelector('#doprava .dp-res-p');prepinac(dr,null,'kk-mena--tmavy');
  var rb=document.querySelector('.rz-bar-sum');prepinac(rb,null,'kk-mena--tmavy kk-mena--bar');
  var poz=document.createElement('p');poz.className='kk-mena-pozn';poz.setAttribute('data-bez-meny','');
  poz.textContent=EN?'Euro prices are approximate (1 € = '+P.kurz+' CZK). Payment is in CZK.':DE?'Preise in Euro sind ungefähr (1 € = '+P.kurz+' CZK). Bezahlt wird in CZK.':'Ceny v eurech jsou orientační (1 € = '+P.kurz+' Kč). Platí se v korunách.';
  var tab=document.querySelector('#rzPrice table');if(tab&&tab.parentNode)tab.parentNode.insertBefore(poz,tab);
  var stavM=function(){var m=P.mena();[].forEach.call(document.querySelectorAll('.kk-mena button'),function(b){b.setAttribute('aria-pressed',String(b.dataset.m===m))});poz.hidden=m!=='EUR'};
  document.addEventListener('kk-mena',stavM);stavM();
}
/* ---- 4) cenové rozpětí pro Google (strukturovaná data) ---- */
var ldk=document.getElementById('ld-kemp');if(ldk)try{var jl=JSON.parse(ldk.textContent);jl.priceRange=KKC.rozpeti();ldk.textContent=JSON.stringify(jl)}catch(e){}
var dh=document.querySelector('.rz-disc-hint');if(dh)dh.textContent=(C.slevy||[]).length?L('Sleva:')+' '+KKC.slevyText():'';
})();

/* ---------------- REZERVACE: místa, obsazenost, ukládání ----------------
   Náhled: data jsou v prohlížeči (localStorage kk.rezervace). Na serveru tyto funkce nahradí API – viz admin/NAPOJENI-NA-SERVER.md.
   Rezervace: {id,cislo,stav,od,do,mista:['chatka-4','podsad-6','teepee-1'],dalsi:{stan,karavan},osoby:{dosp,dite,zak},jmeno,telefon,email,zprava,cena,zdroj}
   Obsazené jsou noci od ≤ noc < do. Stav 'zru' místo neblokuje, 'blk' je blokace místa obsluhou. */
(function(){
var K='kk.rezervace',KN='kk.rez.nast',KC='kk.rez.cislo';
var cti=function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
var pis=function(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
var rada=function(a,b){var r=[],s=a<=b?1:-1;for(var i=a;s>0?i<=b:i>=b;i+=s)r.push(i);return r};
var D=function(s){var p=s.split('-');return new Date(+p[0],p[1]-1,+p[2])};
var I=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
var R=window.KKR={
 SKUPINY:[{id:'cl',k:'chatka',n:'Chatky vlevo',c:rada(20,11)},{id:'cn',k:'chatka',n:'Chatky vpravo nahoře',c:rada(1,5)},{id:'cd',k:'chatka',n:'Chatky vpravo dole',c:rada(6,10)},{id:'ps',k:'podsad',n:'Podsadové stany',c:rada(1,11)},{id:'tp',k:'teepee',n:'Teepee',c:[1]}],
 STAVY:{pop:'Poptávka',pot:'Potvrzená',uby:'Ubytovaný',odj:'Odjel',zru:'Zrušená',blk:'Blokace'},
 nazev:function(m){var p=m.split('-');return p[0]==='chatka'?'Chatka '+p[1]:p[0]==='podsad'?'Podsadový stan '+p[1]:'Teepee'},
 /* režim pro každý typ zvlášť: 'poptavka' (potvrzuje obsluha) nebo 'ihned' */
 nast:function(){var n=cti(KN,{}),z=n.rezim,r={};['chatka','podsad','teepee'].forEach(function(k){r[k]=(typeof z==='string'?z:(z||{})[k])==='ihned'?'ihned':'poptavka'});n.rezim=r;return n},
 /* stav nové rezervace z webu: potvrzená jen když všechna vybraná místa mají okamžitou rezervaci */
 stavWeb:function(mista){var z=R.nast().rezim;return mista&&mista.length&&mista.every(function(m){return z[m.split('-')[0]]==='ihned'})?'pot':'pop'},
 ulozNast:function(n){pis(KN,n)},
 vse:function(){return cti(K,[]).map(function(r){if(r.stav==='zap')r.stav='pot';return r})}, /* zálohy se neplatí – dřívější stav 'zap' se bere jako potvrzená */
 noci:function(od,dk){var r=[],d=D(od),e=D(dk);while(d<e&&r.length<400){r.push(I(d));d.setDate(d.getDate()+1)}return r},
 obsazeno:function(krome){var o={};R.vse().forEach(function(r){if(r.stav==='zru'||r.id===krome)return;var n=R.noci(r.od,r.do);(r.mista||[]).forEach(function(m){o[m]=(o[m]||[]).concat(n)})});return o},
 kolize:function(mista,od,dk,krome){var o=R.obsazeno(krome),n=R.noci(od,dk);return (mista||[]).filter(function(m){return (o[m]||[]).some(function(d){return n.indexOf(d)>=0})})},
 pridej:function(r){var k=R.kolize(r.mista,r.od,r.do);if(k.length)throw new Error('V tomto termínu je obsazeno: '+k.map(R.nazev).join(', ')+'.');
  var a=R.vse(),c=cti(KC,0)+1;r.id='r'+Date.now().toString(36)+c;r.cislo='R'+String(new Date().getFullYear()).slice(2)+'-'+('000'+c).slice(-4);r.vytvoreno=Date.now();a.push(r);
  if(!pis(K,a))throw new Error('Rezervaci se nepodařilo uložit.');pis(KC,c);return r},
 uprav:function(id,z){var a=R.vse(),r=a.filter(function(x){return x.id===id})[0];if(!r)throw new Error('Rezervace nenalezena.');var n=Object.assign({},r,z);
  if(n.stav!=='zru'){var k=R.kolize(n.mista,n.od,n.do,id);if(k.length)throw new Error('V tomto termínu je obsazeno: '+k.map(R.nazev).join(', ')+'.')}
  Object.assign(r,z);pis(K,a);return r},
 smaz:function(id){pis(K,R.vse().filter(function(x){return x.id!==id}))},
 vymaz:function(){pis(K,[])},
 /* TESTOVACÍ DATA pro náhled – před ostrým provozem smazat (i automatické vložení níže).
    Kolem dneška pár pobytů, v červenci sezóny plnější obsazenost a víkend 16.–18. 7. s plnou kapacitou chatek. */
 ukazka:function(){var n=0,t=new Date(),Y=t.getFullYear()+(t.getMonth()>7?1:0),J=['Novákovi','Müller','Dvořák','Jansen','Kolářová','Veselý','Jelínek','Schmidt','Svoboda','Fischer','Černý','Weber','Procházka','de Vries','Kučera','Horák','Bauer','Marková','Němec','Visser','Pokorná','Hofmann','Král','Urban'],ST=['pot','pot','pot','pop','pot','pot'],C={chatka:890,podsad:300,teepee:700};
  var dd=function(k){var x=new Date(t.getFullYear(),t.getMonth(),t.getDate()+k);return I(x)},jl=function(d){return I(new Date(Y,6,d))};
  var p=function(m,od,dk,st,jm){try{var k=m.split('-')[0];R.pridej(st==='blk'?{mista:[m],od:od,do:dk,jmeno:jm,stav:'blk',zprava:'Testovací data'}:{mista:[m],od:od,do:dk,jmeno:jm||J[n%J.length],stav:st||ST[n%ST.length],osoby:{dosp:k==='podsad'?2:2+n%3,dite:k==='podsad'?0:n%3,zak:0},telefon:'+420 777 000 '+('00'+(100+n)).slice(-3),cena:C[k]*R.noci(od,dk).length,zdroj:n%3?'web':'rucne',kdo:'ukázka',zprava:'Testovací data'});n++}catch(e){}};
  p('chatka-4',dd(-1),dd(3),'uby');p('chatka-12',dd(0),dd(4),'pot');p('chatka-18',dd(2),dd(7),'pot');p('chatka-7',dd(1),dd(3),'pop');p('podsad-3',dd(0),dd(2),'pot');p('podsad-6',dd(3),dd(6),'pop');p('teepee-1',dd(1),dd(4),'pot');p('chatka-15',dd(0),dd(10),'blk','Údržba');
  var i,d,l;for(i=1;i<=20;i++)p('chatka-'+i,jl(16),jl(18));
  for(i=1;i<=20;i++){d=1+(i*3)%5;while(d<29){l=2+(i+d)%5;p('chatka-'+i,jl(d),jl(Math.min(31,d+l)));d+=l+(i*d)%3}}
  for(i=1;i<=11;i++){d=2+(i*2)%6;while(d<28){l=1+(i+d)%3;p('podsad-'+i,jl(d),jl(d+l));d+=l+2+(i+d)%4}}
  p('teepee-1',jl(3),jl(7));p('teepee-1',jl(10),jl(20));p('teepee-1',jl(24),jl(27));
  pis('kk.rez.ukazka',1);return n}
};
try{if(!cti('kk.rez.ukazka',0)&&!R.vse().length)R.ukazka()}catch(e){}
})();
