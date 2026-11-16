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
 /* slevy: n = název, pod = podmínky (vše nepovinné: noci, osob, mist, chatka, podsad, teepee, stan, karavan, lodi),
    typ proc | kc (Kč za pobyt) | noc (Kč za noc), h = hodnota, na = z čeho (prázdné = celý pobyt, jinak klíče ubytování),
    sez vse | hlavni | mimo, od/do = platnost akce (datum příjezdu), komb = sčítá se s ostatními, web = ukázat v ceníku, zap = zapnutá */
 slevy:[{n:'Od 2 nocí',pod:{noci:2},typ:'proc',h:10,web:1},{n:'Od 3 nocí',pod:{noci:3},typ:'proc',h:15,web:1},{n:'Od 4 nocí',pod:{noci:4},typ:'proc',h:20,web:1}],
 kategorie:{
  osoby:{n:'Osoby',sloupce:['Sezóna','Mimo sezónu']},
  ubytovani:{n:'Ubytování',sloupce:['Sezóna','Mimo sezónu']},
  doplnky:{n:'Doplňky',sloupce:['Sezóna','Mimo sezónu']},
  lode:{n:'Půjčovna lodí (cena za loď a den)',sloupce:['1–2 dny','3 a více dní']},
  navoz:{n:'Návoz lodí (jednorázový poplatek)',sloupce:['Cena'],pevne:true},
  doprava:{n:'Doprava osob (cena za auto pro 8 osob)',sloupce:['Cena']}
 },
 polozky:[
  {k:'os',kat:'osoby',n:'Osoba',pozn:'od 15 let, včetně místního poplatku 50 Kč',a:200,b:190},
  {k:'dite',kat:'osoby',n:'Dítě',pozn:'do 15 let',a:120,b:100},
  {k:'zak',kat:'osoby',n:'Žák ve stanu',pozn:'jen ve vlastním stanu',a:150,b:150,pro:['stan']},
  {k:'stan',kat:'ubytovani',n:'Stan',pozn:'místo na louce u řeky',a:200,b:190,jed:'stan',rez:1},
  {k:'karavan',kat:'ubytovani',n:'Karavan',pozn:'místo s elektřinou',a:500,b:300,jed:'místo',rez:1},
  {k:'chatka',kat:'ubytovani',n:'Chatka',pozn:'+ každá osoba',a:990,b:890,jed:'chatka',luzka:7,rez:1},
  {k:'teepee',kat:'ubytovani',n:'Teepee',pozn:'',a:800,b:700,jed:'teepee',luzka:4,rez:1},
  {k:'podsad',kat:'ubytovani',n:'Podsadový stan',pozn:'už postavený',a:300,b:300,jed:'stan',luzka:2,rez:1},
  {k:'auto',kat:'doplnky',n:'Auto',pozn:'za den',a:200,b:200,rez:1},
  {k:'moto',kat:'doplnky',n:'Motocykl',pozn:'',a:100,b:100,rez:1},
  {k:'elek',kat:'doplnky',n:'Elektřina',pozn:'',a:200,b:200,rez:1},
  {k:'pes',kat:'doplnky',n:'Pes',pozn:'',a:50,b:50,rez:1},
  {k:'kanoe',kat:'lode',n:'Kanoe',pozn:'2–3 osoby, nafukovací',a:700,b:500,osob:3},
  {k:'raft4',kat:'lode',n:'Raft pro 4',pozn:'3–4 osoby',a:1250,b:950,osob:4},
  {k:'raft6',kat:'lode',n:'Raft pro 6',pozn:'5–6 osob',a:1600,b:1400,osob:6},
  {k:'raft8',kat:'lode',n:'Raft pro 8',pozn:'7–8 osob',a:1800,b:1600,osob:8},
  {k:'baraka',kat:'lode',n:'Baraka',pozn:'2 osoby',a:750,b:550,osob:2},
  {k:'nav1',kat:'navoz',n:'Jeden den, do 10 lodí',a:200},{k:'nav2',kat:'navoz',n:'Jeden den, 10 a více lodí',a:500},
  {k:'nav3',kat:'navoz',n:'Více dní, do 10 lodí',a:400},{k:'nav4',kat:'navoz',n:'Více dní, 10 a více lodí',a:800},
  {k:'dop1',kat:'doprava',n:'Vyšší Brod',a:1150},{k:'dop2',kat:'doprava',n:'Rožmberk nad Vltavou',a:850},{k:'dop3',kat:'doprava',n:'Nahořany',a:650},
  {k:'dop4',kat:'doprava',n:'Kemp Vltava',a:550},{k:'dop5',kat:'doprava',n:'Viking / Pískárna',a:500},{k:'dop6',kat:'doprava',n:'Vltavan / Spolí',a:350},
  {k:'dop7',kat:'doprava',n:'Centrum',a:250},{k:'dop8',kat:'doprava',n:'Zlatá Koruna',a:350},{k:'dop9',kat:'doprava',n:'Boršov',a:900}
 ],
 /* měna: eur = nabízet přepínač Kč/€, kurz Kč za 1 €, zaokr = zaokrouhlení eur (1 | 0.5 | 0.1) */
 mena:{eur:true,kurz:25,zaokr:1},
 /* služby v kempu – jen text do ceníku na webu, nepočítají se */
 sluzby:[{n:'Sprcha na mince',t:'20 Kč / 4 min'},{n:'Úschovna bagáže',t:'50 Kč / batoh'},{n:'Parkování autobusu',t:'500 Kč / den – zdarma, pokud cestující bydlí v kempu'},{n:'Školní kurzy',t:'200 Kč / osoba'}]};
/* starší uložený ceník doplní o nové vlastnosti z výchozího */
/* starší formát slev {noci,proc} -> nový se skládanými podmínkami */
function slevyNove(a){return (a||[]).map(function(x){return x&&x.pod?x:{n:'Od '+(x.noci||1)+' nocí',pod:{noci:+x.noci||1},typ:'proc',h:+x.proc||0,web:1}})}
function doplň(u){u.slevy=slevyNove(u.slevy);(u.polozky||[]).forEach(function(p){if(p.k==='zak'&&p.pro===undefined)p.pro=['stan']});
  if(!u.sluzby){var st=u.polozky.filter(function(p){return p.kat==='sluzby'});u.sluzby=st.length?st.filter(function(p){return p.k!=='poplatek'&&p.skryt!==1}).map(function(p){return{n:p.n,t:(p.a||0)+' Kč'+(p.jed?' / '+p.jed:'')+(p.pozn?' – '+p.pozn:'')}}):JSON.parse(JSON.stringify(VYCHOZI.sluzby));
    var pp=st.filter(function(p){return p.k==='poplatek'})[0],os=u.polozky.filter(function(p){return p.k==='os'})[0];if(os&&!os.pozn)os.pozn='včetně místního poplatku '+(pp?pp.a:50)+' Kč'}
  if(!u.mena)u.mena=JSON.parse(JSON.stringify(VYCHOZI.mena));
  u.kategorie=JSON.parse(JSON.stringify(VYCHOZI.kategorie));u.polozky=u.polozky.filter(function(p){return u.kategorie[p.kat]});
  /* půjčovna: starší ceník ještě lodě a návoz nemá – doplní se výchozí (před dopravu) */
  ['navoz','lode'].forEach(function(kat){if(u.polozky.some(function(p){return p.kat===kat}))return;var nove=JSON.parse(JSON.stringify(VYCHOZI.polozky.filter(function(p){return p.kat===kat}))),i=u.polozky.findIndex(function(p){return p.kat==='doprava'});u.polozky.splice.apply(u.polozky,[i<0?u.polozky.length:i,0].concat(nove))});
  return u}
function nacti(){
  if(window.KK_CENIK_DATA)return doplň(window.KK_CENIK_DATA);
  try{var u=JSON.parse(localStorage.getItem('kkt.cenik')||'null');if(u&&u.verze===1&&u.polozky)return doplň(u)}catch(e){}
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
  /* po uložení ceníku v administraci – nové ceny a slevy platí hned, bez obnovení stránky */
  obnov:function(u){u=doplň(JSON.parse(JSON.stringify(u)));Object.keys(C).forEach(function(k){delete C[k]});Object.assign(C,u);mapa={};C.polozky.forEach(function(p){mapa[p.k]=p});HZ=C.sezona.hlavniZap!==false;KKC.jednaCena=!HZ;KKC.celorocne=C.sezona.celorocne===true},
  p:function(k){return mapa[k]},
  /* cena jako číslo: mode a | b | min */
  jednaCena:!HZ,celorocne:C.sezona.celorocne===true,
  rozpeti:function(){var c=[];KKC.kat('ubytovani').forEach(function(p){if(p.skryt===1)return;var a=+p.a||0,b=p.b==null||!HZ?a:+p.b;if(a)c.push(a);if(b)c.push(b)});if(!c.length)return '';var mi=Math.min.apply(0,c),mx=Math.max.apply(0,c);return (KKC.fmt(mi)+(mx>mi?'–'+KKC.fmt(mx):'')+' Kč').replace(/\u00a0/g,' ')},
  v:function(k,mode){var p=mapa[k];if(!p)return 0;var a=+p.a||0,b=p.b==null||!HZ?a:+p.b;return mode==='b'?b:mode==='min'?Math.min(a,b):a},
  /* text: „890 Kč“, „od 890 Kč“ (jen když se ceny liší) */
  t:function(k,mode){var p=mapa[k];if(!p)return '';var a=KKC.v(k,'a'),b=KKC.v(k,'b');if(mode==='od')return (a!==b?'od ':'')+fmt(Math.min(a,b))+' Kč';return fmt(KKC.v(k,mode))+' Kč'},
  /* cena lodi za den: do 2 dnů sloupec a, od 3 dnů sloupec b */
  lod:function(k,dni){var p=mapa[k];if(!p)return 0;return dni>=3&&p.b!=null?+p.b||0:+p.a||0},
  kat:function(kat){return C.polozky.filter(function(p){return p.kat===kat})},
  /* osoby podle ceníku: rk = klíč v rezervaci (Osoba → dosp), jméno a popis se berou z ceníku (přejmenování se projeví všude) */
  osobyTypy:function(vse){return KKC.kat('osoby').filter(function(p){return vse||p.skryt!==1}).map(function(p){return {k:p.k,rk:p.k==='os'?'dosp':p.k,n:p.n,pozn:p.pozn||''}})},
  osobPocet:function(o){o=o||{};var n=0;Object.keys(o).forEach(function(k){n+=+o[k]||0});return n},
  osobyTxt:function(o,kr){o=o||{};var V={dosp:['Osoba',['dospělý','dospělí','dospělých'],'dosp.'],dite:['Dítě',['dítě','děti','dětí'],'dítě'],zak:['Žák ve stanu',['žák','žáci','žáků'],'žák']},T=KKC.osobyTypy(1),ut={},out=[];
    var P=function(n,a){return n===1?a[0]:n>=2&&n<=4?a[1]:a[2]};
    T.forEach(function(t){ut[t.rk]=1;var n=+o[t.rk]||0;if(!n)return;var v=V[t.rk];out.push(v&&t.n===v[0]?n+' '+(kr&&t.rk==='dosp'?v[2]:P(n,v[1])):n+'× '+t.n.toLowerCase())});
    Object.keys(o).forEach(function(k){if(!ut[k]&&+o[k])out.push(o[k]+'× '+k)});return out.join(', ')||'–'},
  minUbyt:function(){var v=KKC.kat('ubytovani').filter(function(p){return p.rez!==0}).map(function(p){return KKC.v(p.k,'min')});return v.length?Math.min.apply(null,v):0},
  /* jen procentní sleva podle nocí (starší volání) */
  sleva:function(n){var s=0;KKC.slevy().forEach(function(x){var p=x.pod||{},ok=x.typ==='proc'&&!(x.na&&x.na.length)&&Object.keys(p).every(function(k){return k==='noci'?n>=p.noci:!p[k]});if(ok&&+x.h>s)s=+x.h});return s/100},
  /* skupina osob (dítě, žák, senior…) má vlastní cenu jen u ubytování, ke kterému je přiřazená (pole pro); jinak se počítá jako Osoba */
  osobaPlati:function(k,typy){var p=mapa[k];if(!p||!p.pro||!p.pro.length||!typy||!typy.length)return true;var j=function(t){return p.pro.indexOf(t)>=0};return k==='os'?typy.some(j):typy.every(j)},
  slevy:function(){return (C.slevy||[]).filter(function(x){return x&&x.zap!==0})},
  POD:[['noci','nocí','noci'],['osob','osob','osoby'],['mist','míst celkem','místa celkem'],['chatka','chatek','chatky'],['podsad','podsadových stanů','podsadového stanu'],['teepee','teepee','teepee'],['stan','vlastních stanů','vlastního stanu'],['karavan','karavanů','karavanu'],['lodi','lodí','lodi']],
  /* popis podmínek a výše slevy česky (administrace, ceník na webu) */
  slevaPopis:function(x){var p=x.pod||{},a=KKC.POD.filter(function(d){return +p[d[0]]>0}).map(function(d){return 'od '+p[d[0]]+' '+(p[d[0]]==1?d[2]:d[1])});
    if(x.sez==='hlavni')a.push('v hlavní sezóně');if(x.sez==='mimo')a.push('mimo hlavní sezónu');if(x.od||x.do)a.push('příjezd '+(x.od?'od '+x.od.split('-').reverse().slice(0,2).join('. ')+'.':'')+(x.do?' do '+x.do.split('-').reverse().slice(0,2).join('. ')+'.':''));
    var v=x.typ==='kc'?'−'+fmt(+x.h||0)+' Kč':x.typ==='noc'?'−'+fmt(+x.h||0)+' Kč / noc':'−'+(+x.h||0)+' %',z=x.na&&x.na.length&&!(x.na.length===1&&x.na[0]==='_uby')?' ('+x.na.map(KKC.slevaZ).join(', ')+')':'';
    return {hodnota:v+z,podminky:a.join(', ')}},
  /* z čeho se sleva počítá: _uby = celé ubytování, _lode = půjčovné lodí (i návoz), _dop = doprava osob, jinak klíč ubytování */
  slevaZ:function(k){return k==='_uby'?'ubytování':k==='_lode'?'lodě':k==='_dop'?'doprava':(mapa[k]?mapa[k].n.toLowerCase():k)},
  /* popis slevy v jazyce webu (cs = slevaPopis; en/de = vlastní slovník) */
  slevaPopisJ:function(x,j){if(!j||j==='cs')return KKC.slevaPopis(x);
    var W={en:{od:'from',z:{noci:['night','nights'],osob:['person','people'],mist:['place in total','places in total'],chatka:['cabin','cabins'],podsad:['tent on platform','tents on platform'],teepee:['teepee','teepees'],stan:['own tent','own tents'],karavan:['caravan','caravans'],lodi:['boat','boats']},hl:'in main season',mimo:'outside main season',pr:'arrival',pd:'from',pdo:'until',uby:'accommodation',lode:'boats',dop:'transport',noc:'/ night'},
      de:{od:'ab',z:{noci:['Nacht','Nächten'],osob:['Person','Personen'],mist:['Platz insgesamt','Plätzen insgesamt'],chatka:['Hütte','Hütten'],podsad:['Zelt auf Podest','Zelten auf Podest'],teepee:['Teepee','Teepees'],stan:['eigenem Zelt','eigenen Zelten'],karavan:['Wohnwagen','Wohnwagen'],lodi:['Boot','Booten']},hl:'in der Hauptsaison',mimo:'außerhalb der Hauptsaison',pr:'Anreise',pd:'ab',pdo:'bis',uby:'Unterkunft',lode:'Boote',dop:'Transport',noc:'/ Nacht'}}[j];if(!W)return KKC.slevaPopis(x);
    var p=x.pod||{},dt=function(d){return d.split('-').reverse().slice(0,2).join('.')+'.'},
      a=KKC.POD.filter(function(d){return +p[d[0]]>0}).map(function(d){var f=W.z[d[0]]||[d[0],d[0]];return W.od+' '+p[d[0]]+' '+(p[d[0]]==1?f[0]:f[1])});
    if(x.sez==='hlavni')a.push(W.hl);if(x.sez==='mimo')a.push(W.mimo);if(x.od||x.do)a.push(W.pr+' '+(x.od?W.pd+' '+dt(x.od):'')+(x.do?' '+W.pdo+' '+dt(x.do):''));
    var v=x.typ==='kc'?'−'+fmt(+x.h||0)+' Kč':x.typ==='noc'?'−'+fmt(+x.h||0)+' Kč '+W.noc:'−'+(+x.h||0)+' %',
      Z={_uby:W.uby,_lode:W.lode,_dop:W.dop},z=x.na&&x.na.length&&!(x.na.length===1&&x.na[0]==='_uby')?' ('+x.na.map(function(k){return Z[k]||KKC.slevaZ(k)}).join(', ')+')':'';
    return {hodnota:v+z,podminky:a.join(', ')}},
  slevyText:function(){var j=window.KKL&&KKL.jazyk||'cs';return KKC.slevy().filter(function(x){return x.web!==0}).map(function(x){var d=KKC.slevaPopisJ(x,j);return (d.podminky||x.n)+' '+d.hodnota}).join(' · ')},
  /* výpočet slevy pobytu. o = {noci, q:{klíč:počet}, sumK:{klíč:Kč za celý pobyt}, od:'RRRR-MM-DD', lodi}
     platí nejvyšší jedna sleva + všechny, které se smí sčítat; sleva nikdy nepřesáhne cenu */
  slevaPobyt:function(o){o=o||{};var q=o.q||{},sk=Object.assign({},o.sumK||{}),n=+o.noci||0,c=function(k){return +q[k]||0},tot=0,osob=0,mist=0;
    Object.keys(sk).forEach(function(k){tot+=+sk[k]||0});sk._uby=tot;sk._lode=Math.max(0,+o.lode||0);sk._dop=Math.max(0,+o.dop||0);var vse=tot+sk._lode+sk._dop;
    Object.keys(q).forEach(function(k){var p=mapa[k];if(!p)return;if(p.kat==='osoby')osob+=c(k);if(p.kat==='ubytovani')mist+=c(k)});
    var hl=o.od?KKC.hlavni(+o.od.slice(5,7)-1):false,M={noci:n,osob:osob,mist:mist,lodi:+o.lodi||0},V=[];
    KKC.slevy().forEach(function(x){var p=x.pod||{},ok=Object.keys(p).every(function(k){var min=+p[k]||0;return !min||(k in M?M[k]:c(k))>=min});
      if(x.sez==='hlavni'&&!hl||x.sez==='mimo'&&hl)ok=false;if(o.od&&(x.od&&o.od<x.od||x.do&&o.od>x.do))ok=false;if(!ok)return;
      var na=x.na&&x.na.length?x.na:['_uby'],cel=na.indexOf('_uby')>=0,base=na.reduce(function(a,k){return a+(cel&&k.charAt(0)!=='_'?0:+sk[k]||0)},0);if(!base)return;
      var kc=x.typ==='kc'?+x.h||0:x.typ==='noc'?(+x.h||0)*n:base*(+x.h||0)/100;kc=Math.min(base,Math.max(0,Math.round(kc)));
      if(kc)V.push({n:x.n||'Sleva',kc:kc,komb:x.komb===1,proc:x.typ==='proc'&&na.length===1&&na[0]==='_uby'?+x.h:0})});
    var best=null;V.forEach(function(v){if(!v.komb&&(!best||v.kc>best.kc))best=v});
    var L=(best?[best]:[]).concat(V.filter(function(v){return v.komb})),kc=Math.min(vse,L.reduce(function(a,v){return a+v.kc},0));
    return {kc:kc,polozky:L,nazev:L.map(function(v){return v.n}).join(' + '),proc:L.length===1?L[0].proc:0}},
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
  var lo=KKC.kat('lode').filter(function(p){return p.skryt!==1});
  if(lo.length){h+='<tr class="ck-kat"><th colspan="3" scope="colgroup">'+esc(L('Půjčovna lodí'))+' <small>'+esc(L('za loď a den: 1–2 dny / 3 a více dní'))+'</small></th></tr>';
   lo.forEach(function(p){h+='<tr><td>'+esc(p.n)+(p.pozn?' <small>'+esc(p.pozn)+'</small>':'')+'</td><td>'+fmt(+p.a||0)+' Kč</td><td>'+fmt(p.b==null?+p.a||0:+p.b)+' Kč</td></tr>'});
   KKC.kat('navoz').forEach(function(p){h+='<tr><td>'+esc(L('Návoz lodí'))+' <small>'+esc(p.n)+'</small></td><td colspan="2">'+fmt(+p.a||0)+' Kč</td></tr>'})}
  var sl=C.sluzby||[];
  if(sl.length){h+='<tr class="ck-kat"><th colspan="3" scope="colgroup">Služby v kempu</th></tr>';sl.forEach(function(p){if(p.n)h+='<tr><td>'+esc(p.n)+'</td><td colspan="2">'+esc(p.t)+'</td></tr>'})}
  tb.innerHTML=h;
  var ths=document.querySelectorAll('#rzPrice thead th');if(!HZ&&ths.length===3){ths[1].colSpan=2;ths[1].innerHTML='Cena';ths[1].removeAttribute('data-t');ths[2].remove()}
  var th=HZ&&document.querySelector('#rzPrice thead th small');var MZ=function(m){return JZ!=='cs'&&window.KKL?KKL.mesic(m-1):KKC.mesic[m-1]};if(th)th.textContent=MZ(C.sezona.hlavniOd)+'–'+MZ(C.sezona.hlavniDo);
  var no=document.querySelector('#rzPrice .note');if(no)no.textContent=L('Ceny za noc.')+(KKC.slevyText()?' '+L('Sleva:')+' '+KKC.slevyText()+'.':'');
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
var dh=document.querySelector('.rz-disc-hint');if(dh)dh.textContent=KKC.slevyText()?L('Sleva:')+' '+KKC.slevyText():'';
/* ---- 5) otevírací doba a hlavní sezóna v textech webu podle ceníku (i po přeložení do EN/DE) ---- */
var sezTexty=function(){var Z=C.sezona||{},md=function(x){var p=String(x||'').split('-');return [+p[0],+p[1]]},o=md(Z.otevrenoOd),c=md(Z.otevrenoDo);
  var MS=function(m,kr){var d=new Date(2020,m-1,1);return d.toLocaleString(JZ==='en'?'en-GB':JZ==='de'?'de-DE':'cs-CZ',{month:kr?'short':'long'}).replace('.','')};
  var dt=function(x){return JZ==='en'?x[1]+' '+MS(x[0],1):x[1]+'. '+x[0]+'.'};
  var rozsah=Z.celorocne?({cs:'celoročně',en:'all year',de:'ganzjährig'})[JZ]||'celoročně':dt(o)+' – '+dt(c);
  var mes=JZ==='cs'?KKC.mesic[Z.hlavniOd-1]+'–'+KKC.mesic[Z.hlavniDo-1]:MS(Z.hlavniOd)+'–'+MS(Z.hlavniDo);
  var reD=/\b1\.\s?5\.\s?–\s?1\.\s?10\.|\b1 May – 1 Oct/g,reM=/červen–srpen|June–August|Juni–August/g;
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n,zm=[];while(n=w.nextNode()){if(n.parentElement&&n.parentElement.closest('script,style,#kke,.kke-ui'))continue;var t=n.textContent;if(reD.test(t)||reM.test(t))zm.push(n);reD.lastIndex=0;reM.lastIndex=0}
  zm.forEach(function(x){x.textContent=x.textContent.replace(reD,rozsah).replace(reM,mes)});
  var hi=document.querySelector('#rezervace .rz-hint .rz-lg.hi');if(hi&&!HZ){hi.hidden=true;if(hi.nextElementSibling)hi.nextElementSibling.hidden=true}
  if(ldk)try{var j2=JSON.parse(ldk.textContent);(Array.isArray(j2.openingHoursSpecification)?j2.openingHoursSpecification:j2.openingHoursSpecification?[j2.openingHoursSpecification]:[]).forEach(function(s){var y=String(s.validFrom||new Date().getFullYear()).slice(0,4);if(s.validFrom)s.validFrom=y+'-'+Z.otevrenoOd;if(s.validThrough)s.validThrough=y+'-'+Z.otevrenoDo});ldk.textContent=JSON.stringify(j2)}catch(e){}};
KKC.sezTexty=sezTexty;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sezTexty);else sezTexty();
addEventListener('load',function(){setTimeout(sezTexty,50)});
})();

/* ---------------- REZERVACE: místa, obsazenost, ukládání ----------------
   Náhled: data jsou v prohlížeči (localStorage kk.rezervace). Na serveru tyto funkce nahradí API – viz admin/NAPOJENI-NA-SERVER.md.
   Rezervace: {id,cislo,stav,od,do,mista:['chatka-4','podsad-6','teepee-1'],dalsi:{stan,karavan},osoby:{dosp,dite,zak},jmeno,telefon,email,zprava,cena,zdroj}
   Obsazené jsou noci od ≤ noc < do. Stav 'zru' místo neblokuje, 'blk' je blokace místa obsluhou. */
(function(){
var K='kkt.rezervace',KN='kkt.rez.nast',KC='kkt.rez.cislo';
var mem=null; /* při hromadném vkládání (testovací data) se pracuje v paměti a zapíše se až na konci */
var cti=function(k,d){if(mem&&k in mem)return mem[k];try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
var pis=function(k,v){if(mem&&(k===K||k===KC)){mem[k]=v;return true}try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
var rada=function(a,b){var r=[],s=a<=b?1:-1;for(var i=a;s>0?i<=b:i>=b;i+=s)r.push(i);return r};
var D=function(s){var p=s.split('-');return new Date(+p[0],p[1]-1,+p[2])};
var I=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
var R=window.KKR={
 SKUPINY:[{id:'cn',k:'chatka',n:'Chatky vpravo nahoře',c:rada(1,5)},{id:'cd',k:'chatka',n:'Chatky vpravo dole',c:rada(6,10)},{id:'cl',k:'chatka',n:'Chatky vlevo',c:rada(11,20)},{id:'ps',k:'podsad',n:'Podsadové stany',c:rada(1,11)},{id:'tp',k:'teepee',n:'Teepee',c:[1]}],
 /* ---- PŮJČOVNA: sklad, dostupnost po dnech, ceny, zálohy ----
    rezervace.lode = {den:'RRRR-MM-DD', dni:2, kusy:{kanoe:2,raft4:1}, odkud:'dop1', kam:'kemp'}
    rezervace.doprava = {misto:'dop1', osob:6, cas:'09:00'}   (doprava osob na místo vyplutí)
    rezervace.platba = {zaloha:1500, splatnost:'RRRR-MM-DD', stav:'ceka'|'zal'|'vse', kdy:čas}
    Vybavení blokuje každá nezrušená rezervace. Nezaplacená záloha po splatnosti = rezervace propadne (auto). */
 VYB:{padla:'Pádla',vesty:'Vesty',barely:'Barely'},
 SKLAD0:{lode:{kanoe:{ks:30,padla:2,vesty:3,barely:1},raft4:{ks:10,padla:4,vesty:4,barely:1},raft6:{ks:8,padla:6,vesty:6,barely:2},raft8:{ks:4,padla:8,vesty:8,barely:2},baraka:{ks:6,padla:2,vesty:2,barely:1}},vyb:{padla:200,vesty:230,barely:70}},
 lodeTypy:function(){return (window.KKC?KKC.kat('lode'):[]).filter(function(p){return p.skryt!==1})},
 sklad:function(){var s=R.nast().sklad||{},o={lode:{},vyb:Object.assign({},R.SKLAD0.vyb,s.vyb||{})};R.lodeTypy().forEach(function(p){var os=+p.osob||2;o.lode[p.k]=Object.assign({ks:0,padla:os,vesty:os,barely:1},R.SKLAD0.lode[p.k]||{},(s.lode||{})[p.k]||{})});return o},
 mistoN:function(k){if(!k)return '';if(k==='kemp')return 'Kemp Krumlov';var p=window.KKC&&KKC.p(k);return p?p.n:k},
 /* místa na řece po proudu, kemp leží mezi Centrem a Zlatou Korunou */
 mistaReky:function(){var a=[],kde=-1;(window.KKC?KKC.kat('doprava'):[]).forEach(function(p){if(p.skryt===1)return;if(kde<0&&(p.k==='dop8'||p.k==='dop9'))kde=a.length;a.push({k:p.k,n:p.n,cena:+p.a||0})});a.splice(kde<0?a.length:kde,0,{k:'kemp',n:'Kemp Krumlov',cena:0});return a},
 lodeDny:function(l){var r=[];if(!l||!l.den)return r;var d=D(l.den);for(var i=0;i<Math.max(1,+l.dni||1)&&i<60;i++){r.push(I(d));d.setDate(d.getDate()+1)}return r},
 lodePocet:function(l){var n=0;Object.keys((l&&l.kusy)||{}).forEach(function(k){n+=+l.kusy[k]||0});return n},
 /* kolik čeho rezervace potřebuje: {kanoe:2, padla:4, vesty:6, barely:2} */
 lodePotreba:function(l){var S=R.sklad(),o={padla:0,vesty:0,barely:0};Object.keys((l&&l.kusy)||{}).forEach(function(k){var n=+l.kusy[k]||0,t=S.lode[k];if(!n)return;o[k]=(o[k]||0)+n;if(t){o.padla+=n*(+t.padla||0);o.vesty+=n*(+t.vesty||0);o.barely+=n*(+t.barely||0)}});return o},
 /* obsazeno v jednom dni */
 /* Vydané lodě se počítají podle toho, co je skutečně venku: dnes zbytek po vrácení, po termínu nevrácené kusy až do dneška */
 lodeObs:function(den,krome){var o={},dnes=I(new Date());R.vse().forEach(function(r){if(r.stav==='zru'||r.id===krome||!r.lode||!R.lodePocet(r.lode))return;var dn=R.lodeDny(r.lode),v=r.lode.vydano,p=null;
   if(v&&den===dnes&&den>=dn[0])p=R.lodeVen(r);else if(dn.indexOf(den)>=0)p=R.lodePotreba(r.lode);else if(v&&den>dn[dn.length-1]&&den<=dnes)p=R.lodeVen(r);
   if(p)Object.keys(p).forEach(function(k){o[k]=(o[k]||0)+(+p[k]||0)})});return o},
 /* výdej a vracení: lode.vydano={kdy,kdo,kusy}, lode.vraceno=[{kdy,kdo,kusy},…] (kusy = lodě i pádla, vesty, barely) */
 LSTAV:{res:'Lodě rezervované',vyd:'Lodě vydané',cast:'Část lodí vrácena',vra:'Lodě vrácené'},
 lodeVen:function(r){var l=r&&r.lode,o={};if(!l||!l.vydano)return o;var k=l.vydano.kusy||{};Object.keys(k).forEach(function(x){o[x]=+k[x]||0});(l.vraceno||[]).forEach(function(v){Object.keys(v.kusy||{}).forEach(function(x){o[x]=(o[x]||0)-(+v.kusy[x]||0)})});Object.keys(o).forEach(function(x){if(o[x]<=0)delete o[x]});return o},
 lodeStav:function(r){var l=r&&r.lode;if(!l||!R.lodePocet(l))return '';if(!l.vydano)return 'res';var ven=R.lodeVen(r);return !Object.keys(ven).length?'vra':(l.vraceno||[]).length?'cast':'vyd'},
 lodeKusyTxt:function(k){var o=[];Object.keys(k||{}).sort(function(a,b){return (a in R.VYB)-(b in R.VYB)}).forEach(function(x){var n=+k[x]||0;if(!n)return;var p=window.KKC&&KKC.p(x),V={padla:['pádlo','pádla','pádel'],vesty:['vesta','vesty','vest'],barely:['barel','barely','barelů']}[x];o.push(V?n+' '+(n===1?V[0]:n<5?V[1]:V[2]):n+'× '+(p?p.n:x))});return o.join(', ')},
 lodeCelkem:function(){var S=R.sklad(),c=Object.assign({},S.vyb);Object.keys(S.lode).forEach(function(k){c[k]=+S.lode[k].ks||0});return c},
 /* volné kusy pro celé období (nejhorší den) */
 lodeVolno:function(den,dni,krome){var c=R.lodeCelkem(),v=Object.assign({},c);R.lodeDny({den:den,dni:dni}).forEach(function(d){var o=R.lodeObs(d,krome);Object.keys(c).forEach(function(k){v[k]=Math.min(v[k],c[k]-(o[k]||0))})});return v},
 lodeChybi:function(l,krome){if(!l||!R.lodePocet(l))return [];var v=R.lodeVolno(l.den,l.dni,krome),p=R.lodePotreba(l),ch=[];Object.keys(p).forEach(function(k){if(p[k]>(v[k]||0)){var t=window.KKC&&KKC.p(k);ch.push((t?t.n:R.VYB[k]||k)+' (volných '+Math.max(0,v[k]||0)+', potřeba '+p[k]+')')}});return ch},
 cenaLodi:function(l){var o={pujc:0,navoz:0,celkem:0};if(!l||!window.KKC)return o;var dni=Math.max(1,+l.dni||1),n=R.lodePocet(l);if(!n)return o;Object.keys(l.kusy).forEach(function(k){o.pujc+=(+l.kusy[k]||0)*KKC.lod(k,dni)*dni});
  var nk=dni>1?(n>=10?'nav4':'nav3'):(n>=10?'nav2':'nav1'),np=KKC.p(nk);o.navoz=np?+np.a||0:0;o.celkem=o.pujc+o.navoz;return o},
 aut:function(osob){return Math.max(1,Math.ceil((+osob||0)/8))},
 cenaDopravy:function(d){if(!d||!d.misto||d.misto==='kemp'||!window.KKC)return 0;var p=KKC.p(d.misto);return p?(+p.a||0)*R.aut(d.osob):0},
 lodeTxt:function(l,j){if(!l||!R.lodePocet(l))return '';var a=Object.keys(l.kusy).filter(function(k){return +l.kusy[k]>0}).map(function(k){var p=window.KKC&&KKC.p(k);return l.kusy[k]+'× '+(p?(j&&j!=='cs'&&p['n_'+j])||p.n:k)}),d=l.den.split('-'),dni=Math.max(1,+l.dni||1),W={cs:['den','dny','dní'],en:['day','days','days'],de:['Tag','Tage','Tage']}[j||'cs']||['den','dny','dní'];
  return a.join(', ')+' · '+(+d[2])+'. '+(+d[1])+'. ('+dni+' '+(dni===1?W[0]:dni<5?W[1]:W[2])+')'+(l.odkud||l.kam?' · '+R.mistoN(l.odkud)+' → '+R.mistoN(l.kam):'')},
 dopravaTxt:function(d,j){if(!d||!d.misto)return '';var W={cs:['osob','auto','auta'],en:['people','van','vans'],de:['Personen','Wagen','Wagen']}[j||'cs']||['osob','auto','auta'],a=R.aut(d.osob),o=+d.osob||0;return R.mistoN(d.misto)+' · '+o+' '+((j||'cs')==='cs'?(o===1?'osoba':o>=2&&o<=4?'osoby':'osob'):W[0])+' · '+a+' '+(a===1?W[1]:W[2])+(d.cas?' · '+d.cas:'')},
 /* záloha: typ 'proc' (procento z ceny) | 'castka' (pevná částka) | 'vse' (celá cena předem); zap:false = bez záloh */
 ZAL0:{zap:true,typ:'proc',hodnota:30,lhuta:5,ucet:''},
 zaloha:function(){return Object.assign({},R.ZAL0,R.nast().zaloha||{})},
 zalohaCastka:function(cena){var z=R.zaloha();cena=+cena||0;if(!z.zap||!cena)return 0;return z.typ==='vse'?cena:z.typ==='castka'?Math.min(cena,Math.max(0,+z.hodnota||0)):Math.round(cena*Math.min(100,Math.max(0,+z.hodnota||0))/100)},
 /* splatnost = dnes + lhůta, nejpozději v den příjezdu */
 splatnost:function(od,dnes){dnes=dnes||I(new Date());var d=D(dnes);d.setDate(d.getDate()+Math.max(0,+R.zaloha().lhuta||0));var s=I(d);return od&&s>od?(od<dnes?dnes:od):s},
 novaPlatba:function(cena,od,dnes){var z=R.zalohaCastka(cena);return z?{zaloha:z,splatnost:R.splatnost(od,dnes),stav:'ceka'}:null},
 PLATBA:{ceka:'Čeká na zálohu',zal:'Záloha zaplacena',vse:'Zaplaceno celé'},
 jenLode:function(r){return !!(r&&r.lode&&R.lodePocet(r.lode)&&!(r.mista||[]).length&&!(r.dalsi&&(+r.dalsi.stan||+r.dalsi.karavan)))},
 STAVY:{pop:'Čeká na zálohu',pot:'Rezervace',uby:'Ubytovaný',odj:'Odjel',zru:'Zrušená',blk:'Blokace'},
 nazev:function(m){var p=m.split('-');return p[0]==='chatka'?'Chatka '+p[1]:p[0]==='podsad'?'Podsadový stan '+p[1]:'Teepee'},
 /* režim pro každý typ zvlášť: 'poptavka' (potvrzuje obsluha) nebo 'ihned' */
 nast:function(){var n=cti(KN,{}),z=n.rezim,r={};['chatka','podsad','teepee','stan','karavan'].forEach(function(k){r[k]=(typeof z==='string'?z:(z||{})[k])==='ihned'?'ihned':'poptavka'});n.rezim=r;return n},
 /* stav nové rezervace z webu: potvrzená jen když všechna vybraná místa mají okamžitou rezervaci */
 stavWeb:function(mista,dalsi){var z=R.nast().rezim,k=[];(mista||[]).forEach(function(m){k.push(m.split('-')[0])});Object.keys(dalsi||{}).forEach(function(t){if(+dalsi[t]>0)k.push(t)});return k.length&&k.every(function(t){return z[t]==='ihned'})?'pot':'pop'},
 /* ---- šablony e-mailů (úprava v Rezervace → Nastavení; server je použije při odesílání) ---- */
 SABL_TYPY:[
  {k:'poptavka',n:'Poptávka přijata',kdo:'host',kdy:'Host odešle poptávku z webu (typ, který potvrzuje obsluha).'},
  {k:'rezervace',n:'Rezervace potvrzena',kdo:'host',kdy:'Okamžitá rezervace z webu, nebo když obsluha převede poptávku na rezervaci.'},
  {k:'zaloha',n:'Výzva k zaplacení zálohy',kdo:'host',kdy:'Hned po odeslání rezervace z webu, když jsou zapnuté zálohy. Obsahuje částku, účet, variabilní symbol a splatnost.'},
  {k:'zaplaceno',n:'Záloha přijata',kdo:'host',kdy:'Obsluha klikne na „Záloha zaplacena“ – rezervace je tím potvrzená.'},
  {k:'propadla',n:'Rezervace propadla',kdo:'host',kdy:'Záloha nepřišla do data splatnosti, rezervace se sama zrušila a místo i vybavení se uvolnilo.'},
  {k:'zruseno',n:'Rezervace zrušena',kdo:'host',kdy:'Obsluha rezervaci nebo poptávku zruší.'},
  {k:'kemp',n:'Upozornění pro kemp',kdo:'kemp',kdy:'Přijde vám při každé nové poptávce nebo rezervaci z webu.'}],
 SABL_POLE:[['jmeno','Jméno hosta'],['cislo','Číslo rezervace'],['od','Příjezd'],['do','Odjezd'],['noci','Počet nocí'],['mista','Ubytování'],['osoby','Osoby'],['lode','Lodě'],['doprava','Doprava'],['cena','Cena'],['zaloha','Záloha'],['splatnost','Splatnost zálohy'],['doplatek','Doplatek na místě'],['ucet','Číslo účtu'],['vs','Variabilní symbol'],['telefon','Telefon'],['email','E-mail hosta'],['zprava','Zpráva od hosta'],['stav','Stav']],
 SABL_VYCH:{
  poptavka:{
   cs:{predmet:'Poptávka {cislo} – Kemp Krumlov',text:'Dobrý den, {jmeno},\n\nděkujeme za vaši poptávku. Termín vám zatím držíme, ale rezervace ještě není potvrzená – ozveme se vám co nejdříve.\n\nČíslo poptávky: {cislo}\nTermín: {od} – {do} ({noci})\nUbytování: {mista}\nOsoby: {osoby}\nLodě: {lode}\nDoprava: {doprava}\nOrientační cena: {cena}\n\nKdyž budete potřebovat cokoli změnit, stačí odpovědět na tento e-mail.\n\nS pozdravem\nKemp Krumlov'},
   en:{predmet:'Inquiry {cislo} – Kemp Krumlov',text:'Hello {jmeno},\n\nthank you for your inquiry. We are holding the dates for you, but the booking is not confirmed yet – we will get back to you as soon as possible.\n\nInquiry number: {cislo}\nDates: {od} – {do} ({noci})\nAccommodation: {mista}\nGuests: {osoby}\nBoats: {lode}\nTransport: {doprava}\nEstimated price: {cena}\n\nIf you need to change anything, just reply to this e-mail.\n\nBest regards\nKemp Krumlov'},
   de:{predmet:'Anfrage {cislo} – Kemp Krumlov',text:'Guten Tag {jmeno},\n\nvielen Dank für Ihre Anfrage. Wir halten den Termin für Sie frei, die Reservierung ist aber noch nicht bestätigt – wir melden uns so bald wie möglich.\n\nAnfragenummer: {cislo}\nTermin: {od} – {do} ({noci})\nUnterkunft: {mista}\nPersonen: {osoby}\nBoote: {lode}\nTransport: {doprava}\nVoraussichtlicher Preis: {cena}\n\nWenn Sie etwas ändern möchten, antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen\nKemp Krumlov'}},
  rezervace:{
   cs:{predmet:'Rezervace {cislo} potvrzena – Kemp Krumlov',text:'Dobrý den, {jmeno},\n\nvaše rezervace je potvrzená. Těšíme se na vás!\n\nČíslo rezervace: {cislo}\nTermín: {od} – {do} ({noci})\nUbytování: {mista}\nOsoby: {osoby}\nLodě: {lode}\nDoprava: {doprava}\nCena: {cena} (platí se na místě)\n\nKdyž budete potřebovat cokoli změnit nebo zrušit, stačí odpovědět na tento e-mail.\n\nS pozdravem\nKemp Krumlov'},
   en:{predmet:'Booking {cislo} confirmed – Kemp Krumlov',text:'Hello {jmeno},\n\nyour booking is confirmed. We look forward to seeing you!\n\nBooking number: {cislo}\nDates: {od} – {do} ({noci})\nAccommodation: {mista}\nGuests: {osoby}\nBoats: {lode}\nTransport: {doprava}\nPrice: {cena} (paid on site)\n\nIf you need to change or cancel anything, just reply to this e-mail.\n\nBest regards\nKemp Krumlov'},
   de:{predmet:'Reservierung {cislo} bestätigt – Kemp Krumlov',text:'Guten Tag {jmeno},\n\nIhre Reservierung ist bestätigt. Wir freuen uns auf Sie!\n\nReservierungsnummer: {cislo}\nTermin: {od} – {do} ({noci})\nUnterkunft: {mista}\nPersonen: {osoby}\nBoote: {lode}\nTransport: {doprava}\nPreis: {cena} (Zahlung vor Ort)\n\nWenn Sie etwas ändern oder stornieren möchten, antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen\nKemp Krumlov'}},
  zaloha:{
   cs:{predmet:'Rezervace {cislo} – zaplaťte prosím zálohu do {splatnost}',text:'Dobrý den, {jmeno},\n\nděkujeme za rezervaci. Vše vám držíme do {splatnost}. Aby rezervace platila, zaplaťte prosím do tohoto dne zálohu.\n\nZáloha: {zaloha}\nČíslo účtu: {ucet}\nVariabilní symbol: {vs}\nSplatnost: {splatnost}\n\nČíslo rezervace: {cislo}\nTermín: {od} – {do} ({noci})\nUbytování: {mista}\nOsoby: {osoby}\nLodě: {lode}\nDoprava: {doprava}\nCena celkem: {cena}\nDoplatek na místě: {doplatek}\n\nJakmile platba dorazí, pošleme vám potvrzení. Když záloha do data splatnosti nepřijde, rezervace se sama zruší.\n\nS pozdravem\nKemp Krumlov'},
   en:{predmet:'Booking {cislo} – please pay the deposit by {splatnost}',text:'Hello {jmeno},\n\nthank you for your booking. We are holding everything for you until {splatnost}. To confirm the booking, please pay the deposit by that date.\n\nDeposit: {zaloha}\nAccount number: {ucet}\nPayment reference: {vs}\nDue date: {splatnost}\n\nBooking number: {cislo}\nDates: {od} – {do} ({noci})\nAccommodation: {mista}\nGuests: {osoby}\nBoats: {lode}\nTransport: {doprava}\nTotal price: {cena}\nBalance on site: {doplatek}\n\nWe will send you a confirmation as soon as the payment arrives. If the deposit does not arrive by the due date, the booking is cancelled automatically.\n\nBest regards\nKemp Krumlov'},
   de:{predmet:'Reservierung {cislo} – bitte Anzahlung bis {splatnost} leisten',text:'Guten Tag {jmeno},\n\nvielen Dank für Ihre Reservierung. Wir halten alles bis {splatnost} für Sie frei. Damit die Reservierung gilt, überweisen Sie bitte bis zu diesem Tag die Anzahlung.\n\nAnzahlung: {zaloha}\nKontonummer: {ucet}\nVerwendungszweck: {vs}\nFällig bis: {splatnost}\n\nReservierungsnummer: {cislo}\nTermin: {od} – {do} ({noci})\nUnterkunft: {mista}\nPersonen: {osoby}\nBoote: {lode}\nTransport: {doprava}\nGesamtpreis: {cena}\nRestzahlung vor Ort: {doplatek}\n\nSobald die Zahlung eingeht, senden wir Ihnen eine Bestätigung. Geht die Anzahlung nicht rechtzeitig ein, wird die Reservierung automatisch storniert.\n\nMit freundlichen Grüßen\nKemp Krumlov'}},
  zaplaceno:{
   cs:{predmet:'Záloha přijata – rezervace {cislo} je potvrzená',text:'Dobrý den, {jmeno},\n\nvaše záloha dorazila a rezervace je potvrzená. Těšíme se na vás!\n\nČíslo rezervace: {cislo}\nTermín: {od} – {do} ({noci})\nUbytování: {mista}\nOsoby: {osoby}\nLodě: {lode}\nDoprava: {doprava}\nCena celkem: {cena}\nZaplacená záloha: {zaloha}\nDoplatek na místě: {doplatek}\n\nKdyž budete potřebovat cokoli změnit, stačí odpovědět na tento e-mail.\n\nS pozdravem\nKemp Krumlov'},
   en:{predmet:'Deposit received – booking {cislo} is confirmed',text:'Hello {jmeno},\n\nyour deposit has arrived and the booking is confirmed. We look forward to seeing you!\n\nBooking number: {cislo}\nDates: {od} – {do} ({noci})\nAccommodation: {mista}\nGuests: {osoby}\nBoats: {lode}\nTransport: {doprava}\nTotal price: {cena}\nDeposit paid: {zaloha}\nBalance on site: {doplatek}\n\nIf you need to change anything, just reply to this e-mail.\n\nBest regards\nKemp Krumlov'},
   de:{predmet:'Anzahlung erhalten – Reservierung {cislo} ist bestätigt',text:'Guten Tag {jmeno},\n\nIhre Anzahlung ist eingegangen und die Reservierung ist bestätigt. Wir freuen uns auf Sie!\n\nReservierungsnummer: {cislo}\nTermin: {od} – {do} ({noci})\nUnterkunft: {mista}\nPersonen: {osoby}\nBoote: {lode}\nTransport: {doprava}\nGesamtpreis: {cena}\nGeleistete Anzahlung: {zaloha}\nRestzahlung vor Ort: {doplatek}\n\nWenn Sie etwas ändern möchten, antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen\nKemp Krumlov'}},
  propadla:{
   cs:{predmet:'Rezervace {cislo} propadla – záloha nepřišla',text:'Dobrý den, {jmeno},\n\nzáloha za rezervaci {cislo} na termín {od} – {do} nám do {splatnost} nepřišla, a tak jsme rezervaci zrušili a místa uvolnili.\n\nPokud jste platbu poslali nebo máte o termín stále zájem, odpovězte prosím na tento e-mail – rádi to dáme do pořádku.\n\nS pozdravem\nKemp Krumlov'},
   en:{predmet:'Booking {cislo} has expired – no deposit received',text:'Hello {jmeno},\n\nwe did not receive the deposit for booking {cislo} ({od} – {do}) by {splatnost}, so the booking has been cancelled.\n\nIf you have sent the payment or are still interested, please reply to this e-mail – we will be happy to sort it out.\n\nBest regards\nKemp Krumlov'},
   de:{predmet:'Reservierung {cislo} verfallen – keine Anzahlung erhalten',text:'Guten Tag {jmeno},\n\ndie Anzahlung für die Reservierung {cislo} ({od} – {do}) ist bis {splatnost} nicht eingegangen, daher wurde die Reservierung storniert.\n\nFalls Sie bereits bezahlt haben oder weiterhin Interesse besteht, antworten Sie bitte auf diese E-Mail.\n\nMit freundlichen Grüßen\nKemp Krumlov'}},
  zruseno:{
   cs:{predmet:'Rezervace {cislo} zrušena – Kemp Krumlov',text:'Dobrý den, {jmeno},\n\nvaše rezervace {cislo} na termín {od} – {do} byla zrušena.\n\nPokud jde o omyl nebo si chcete vybrat jiný termín, odpovězte prosím na tento e-mail.\n\nS pozdravem\nKemp Krumlov'},
   en:{predmet:'Booking {cislo} cancelled – Kemp Krumlov',text:'Hello {jmeno},\n\nyour booking {cislo} for {od} – {do} has been cancelled.\n\nIf this is a mistake or you would like to choose other dates, please reply to this e-mail.\n\nBest regards\nKemp Krumlov'},
   de:{predmet:'Reservierung {cislo} storniert – Kemp Krumlov',text:'Guten Tag {jmeno},\n\nIhre Reservierung {cislo} für {od} – {do} wurde storniert.\n\nFalls es sich um einen Irrtum handelt oder Sie einen anderen Termin wählen möchten, antworten Sie bitte auf diese E-Mail.\n\nMit freundlichen Grüßen\nKemp Krumlov'}},
  kemp:{
   cs:{predmet:'Nová {stav} {cislo}: {jmeno}, {od} – {do}',text:'Z webu přišla nová {stav}.\n\nČíslo: {cislo}\nHost: {jmeno}\nTelefon: {telefon}\nE-mail: {email}\nTermín: {od} – {do} ({noci})\nUbytování: {mista}\nOsoby: {osoby}\nLodě: {lode}\nDoprava: {doprava}\nCena: {cena}\n\nZpráva od hosta:\n{zprava}\n\nDetail najdete v administraci v Rezervacích.'}}},
 SABL_JAZ:function(t){return t==='kemp'?['cs']:['cs','en','de']},
 sablona:function(t,j){var v=R.SABL_VYCH[t]||{},d=v[j]||v.cs||{predmet:'',text:''},s=((R.nast().sablony||{})[t]||{})[j]||{};return {predmet:typeof s.predmet==='string'?s.predmet:d.predmet,text:typeof s.text==='string'?s.text:d.text,upravena:typeof s.predmet==='string'||typeof s.text==='string'}},
 ulozSablonu:function(t,j,o){var n=R.nast();n.sablony=n.sablony||{};n.sablony[t]=n.sablony[t]||{};if(o)n.sablony[t][j]={predmet:o.predmet,text:o.text};else delete n.sablony[t][j];R.ulozNast(n)},
 /* dosadí údaje rezervace do šablony; j = jazyk e-mailu (jména míst, počty nocí, osoby) */
 dosad:function(txt,r,j){r=r||{};j=j||'cs';var W={cs:{ch:'Chatka',ps:'Podsadový stan',st:'vlastní stan',kr:'karavan',n:['noc','noci','nocí'],d:'dosp.',k:['dítě','děti','dětí'],pop:'poptávka',pot:'rezervace'},en:{ch:'Cabin',ps:'Tent on platform',st:'own tent',kr:'caravan',n:['night','nights','nights'],d:'adults',k:['child','children','children'],pop:'inquiry',pot:'booking'},de:{ch:'Hütte',ps:'Zelt auf Podest',st:'eigenes Zelt',kr:'Wohnwagen',n:['Nacht','Nächte','Nächte'],d:'Erw.',k:['Kind','Kinder','Kinder'],pop:'Anfrage',pot:'Reservierung'}}[j]||{};
  var P=function(c,a){return c===1?a[0]:c>=2&&c<=4?a[1]:a[2]},F=function(s){if(!s)return '';var p=s.split('-');return +p[2]+'. '+(+p[1])+'. '+p[0]};
  var nc=r.od&&r.do?R.noci(r.od,r.do).length:0,o=r.osoby||{},dt=(o.dite||0)+(o.zak||0);
  var mi=(r.mista||[]).map(function(m){var p=m.split('-');return p[0]==='chatka'?W.ch+' '+p[1]:p[0]==='podsad'?W.ps+' '+p[1]:'Teepee'});var dl=r.dalsi||{};if(+dl.stan)mi.push(dl.stan+'× '+W.st);if(+dl.karavan)mi.push(dl.karavan+'× '+W.kr);
  var pl=r.platba||{},KcT=function(n){return n?String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč':''};
  var h={jmeno:r.jmeno||'',cislo:r.cislo||'',od:F(r.od),do:F(r.do),noci:nc?nc+' '+P(nc,W.n):({cs:'bez noclehu',en:'no overnight stay',de:'ohne Übernachtung'}[j]||'bez noclehu'),mista:mi.join(', '),osoby:j==='cs'&&window.KKC?KKC.osobyTxt(o):(o.dosp||0)+' '+W.d+(dt?', '+dt+' '+P(dt,W.k):''),cena:KcT(r.cena),lode:R.lodeTxt(r.lode,j),doprava:R.dopravaTxt(r.doprava,j),zaloha:KcT(pl.zaloha),splatnost:F(pl.splatnost),doplatek:pl.zaloha&&r.cena>pl.zaloha?KcT(r.cena-pl.zaloha):'',ucet:R.zaloha().ucet||'',vs:String(r.cislo||'').replace(/\D/g,''),telefon:r.telefon||'',email:r.email||'',zprava:r.zprava||'–',stav:r.stav==='pop'?W.pop:W.pot};
  /* řádek „Popisek: {pole}“ se vynechá, když je pole prázdné (rezervace bez lodí, bez ubytování…) */
  return String(txt||'').split('\n').filter(function(ln){var m=/^[^:{}\n]{1,40}:\s*\{(\w+)\}\s*$/.exec(ln);return !(m&&m[1] in h&&h[m[1]]==='')}).join('\n').replace(/\{(\w+)\}/g,function(a,k){return k in h?h[k]:a})},
 /* grafická podoba e-mailu (HTML, inline styly kvůli e-mailovým klientům). Server ji použije stejně – text šablony se jen vloží do rámu. */
 KONTAKT:{adresa:'Domoradice 107, 381 01 Český Krumlov',tel:['+420 720 514 943','+420 725 336 601'],email:'kempkrumlov2017@gmail.com',web:'https://pavlat11.github.io/kemp-krumlov/'},
 emailHtml:function(t,j,predmet,text,r){
  var e=function(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')},K=R.KONTAKT;
  var TIT={poptavka:{cs:'Poptávka přijata',en:'Inquiry received',de:'Anfrage erhalten'},rezervace:{cs:'Rezervace potvrzena',en:'Booking confirmed',de:'Reservierung bestätigt'},zruseno:{cs:'Rezervace zrušena',en:'Booking cancelled',de:'Reservierung storniert'},zaloha:{cs:'Zaplaťte prosím zálohu',en:'Please pay the deposit',de:'Bitte Anzahlung leisten'},zaplaceno:{cs:'Záloha přijata',en:'Deposit received',de:'Anzahlung erhalten'},propadla:{cs:'Rezervace propadla',en:'Booking expired',de:'Reservierung verfallen'},kemp:{cs:r&&r.stav==='pop'?'Nová poptávka':'Nová rezervace'}}[t]||{};
  var BAR={poptavka:['#fdf0de','#9a5a0c','#e08a1e'],rezervace:['#e3f1f2','#1f6d77','#1f6d77'],zruseno:['#efece6','#6b665c','#9a9384'],propadla:['#efece6','#6b665c','#9a9384'],zaloha:['#fdf0de','#9a5a0c','#e08a1e'],zaplaceno:['#e3f1f2','#1f6d77','#1f6d77'],kemp:['#e3f1f2','#1f6d77','#1f6d77']}[t]||['#e3f1f2','#1f6d77','#1f6d77'];
  var IKO={poptavka:'&#9203;',rezervace:'&#10003;',zruseno:'&#10005;',propadla:'&#10005;',zaloha:'&#9203;',zaplaceno:'&#10003;',kemp:'&#9993;'}[t]||'';
  var L={cs:['Kontakt','Odpovědět můžete přímo na tento e-mail.'],en:['Contact','You can reply directly to this e-mail.'],de:['Kontakt','Sie können direkt auf diese E-Mail antworten.']}[j]||['Kontakt',''];
  var body=String(R.dosad(text,r,j)||'').replace(/\r/g,'').split(/\n\s*\n/).map(function(bl){var ls=bl.split('\n').filter(function(x){return x.trim()});if(!ls.length)return '';
   var tab=ls.length>=2&&ls.every(function(x){return /^[^:\n]{1,40}:\s*\S/.test(x)});
   if(tab)return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;background:#f7f4ec;border:1px solid #e6e0d2;border-radius:12px;margin:0 0 20px">'+ls.map(function(x,i){var k=x.indexOf(':'),a=x.slice(0,k),b=x.slice(k+1).trim(),c=/cena|price|preis|záloha|deposit|anzahlung/i.test(a);return '<tr><td style="padding:10px 16px;'+(i?'border-top:1px solid #e6e0d2;':'')+'color:#6b665c;font-size:14px;width:42%;vertical-align:top">'+e(a)+'</td><td style="padding:10px 16px;'+(i?'border-top:1px solid #e6e0d2;':'')+'color:#0f2219;font-size:'+(c?'17':'15')+'px;font-weight:'+(c?'800':'700')+';vertical-align:top">'+e(b)+'</td></tr>'}).join('')+'</table>';
   return '<p style="margin:0 0 16px;font-size:15.5px;line-height:1.6;color:#1d2b24">'+ls.map(e).join('<br>')+'</p>'}).join('');
  var F='font-family:\'Plus Jakarta Sans\',Segoe UI,Helvetica,Arial,sans-serif';
  return '<!DOCTYPE html><html lang="'+j+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+e(R.dosad(predmet,r,j))+'</title></head>'+
   '<body style="margin:0;padding:0;background:#efe9dc;'+F+'"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efe9dc"><tr><td align="center" style="padding:28px 12px">'+
   '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 2px 10px rgba(15,34,25,.08)">'+
   '<tr><td style="background:#0f2219;padding:22px 28px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle;padding-right:12px"><div style="width:38px;height:38px;border-radius:50%;background:#173a29;text-align:center;line-height:38px;font-size:20px;color:#ffc978">&#9650;</div></td><td style="vertical-align:middle"><div style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-.01em">Kemp Krumlov</div><div style="color:#9fc2ad;font-size:13px">Český Krumlov · Vltava</div></td></tr></table></td></tr>'+
   '<tr><td style="height:5px;background:'+BAR[2]+';line-height:5px;font-size:0">&nbsp;</td></tr>'+
   '<tr><td style="padding:28px 28px 8px"><div style="display:inline-block;background:'+BAR[0]+';color:'+BAR[1]+';font-size:13px;font-weight:800;border-radius:999px;padding:6px 14px;margin-bottom:14px">'+IKO+'&nbsp; '+e(r&&r.cislo?r.cislo:'Kemp Krumlov')+'</div>'+
   '<h1 style="margin:0 0 18px;font-size:25px;line-height:1.25;color:#0f2219;font-weight:800">'+e(TIT[j]||TIT.cs||'')+'</h1>'+body+'</td></tr>'+
   (t==='kemp'?'':'<tr><td style="padding:4px 28px 26px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e0d2"><tr><td style="padding-top:18px;font-size:13.5px;line-height:1.7;color:#6b665c"><b style="color:#0f2219">'+L[0]+'</b><br>'+e(K.adresa)+'<br>'+K.tel.map(function(x){return '<a href="tel:'+x.replace(/\s/g,'')+'" style="color:#1f6d77;text-decoration:none">'+e(x)+'</a>'}).join(' · ')+'<br><a href="mailto:'+e(K.email)+'" style="color:#1f6d77;text-decoration:none">'+e(K.email)+'</a> · <a href="'+e(K.web)+'" style="color:#1f6d77;text-decoration:none">kemp-krumlov.cz</a></td></tr></table></td></tr>')+
   '</table><div style="max-width:600px;padding:14px 8px;font-size:12px;color:#8a8473;text-align:center">'+e(L[1])+'</div></td></tr></table></body></html>'},
 ulozNast:function(n){pis(KN,n)},
 /* místa vypnutá z rezervace (personál, oprava) a typy, které se nerezervují */
 vyp:function(){var v=R.nast().vyp;return Array.isArray(v)?v:[]},
 rezTyp:function(k){var p=window.KKC&&KKC.p(k);return !p||p.rez!==0},
 vse:function(){return cti(K,[]).map(function(r){if(r.stav==='zap')r.stav='pot';return r})}, /* zálohy se neplatí – dřívější stav 'zap' se bere jako potvrzená */
 noci:function(od,dk){var r=[],d=D(od),e=D(dk);while(d<e&&r.length<400){r.push(I(d));d.setDate(d.getDate()+1)}return r},
 obsazeno:function(krome){var o={};R.vse().forEach(function(r){if(r.stav==='zru'||r.id===krome)return;var n=R.noci(r.od,r.do);(r.mista||[]).forEach(function(m){o[m]=(o[m]||[]).concat(n)})});return o},
 kolize:function(mista,od,dk,krome){var o=R.obsazeno(krome),n=R.noci(od,dk);return (mista||[]).filter(function(m){return (o[m]||[]).some(function(d){return n.indexOf(d)>=0})})},
 pridej:function(r){var k=R.kolize(r.mista,r.od,r.do);if(k.length)throw new Error('V tomto termínu je obsazeno: '+k.map(R.nazev).join(', ')+'.');
  var lc=R.lodeChybi(r.lode);if(lc.length)throw new Error('Na tento termín už není dost vybavení: '+lc.join(', ')+'.');
  var a=R.vse(),c=cti(KC,0)+1;r.id='r'+Date.now().toString(36)+c;r.cislo='R'+String(new Date().getFullYear()).slice(2)+'-'+('000'+c).slice(-4);r.vytvoreno=Date.now();a.push(r);
  if(!pis(K,a))throw new Error('Rezervaci se nepodařilo uložit.');pis(KC,c);return r},
 uprav:function(id,z){var a=R.vse(),r=a.filter(function(x){return x.id===id})[0];if(!r)throw new Error('Rezervace nenalezena.');var n=Object.assign({},r,z);
  if(n.stav!=='zru'){var k=R.kolize(n.mista,n.od,n.do,id);if(k.length)throw new Error('V tomto termínu je obsazeno: '+k.map(R.nazev).join(', ')+'.');
   var lc=R.lodeChybi(n.lode,id);if(lc.length)throw new Error('Na tento termín už není dost vybavení: '+lc.join(', ')+'.')}
  Object.assign(r,z);pis(K,a);return r},
 /* ubytovaní hosté, kterým už uplynul den odjezdu, se sami přepnou na „Odjel“ (zapomenuté odhlášení); vrací počet */
 auto:function(dnes){var a=R.vse(),n=0;a.forEach(function(r){if(r.stav==='pop'&&r.platba&&r.platba.stav==='ceka'&&r.platba.splatnost&&r.platba.splatnost<dnes){r.stav='zru';r.hist=(r.hist||[]).concat([{t:Date.now(),kdo:'Systém',co:'Propadla – záloha nepřišla do '+r.platba.splatnost}]).slice(-30);n++}
  else if((r.stav==='pot'||r.stav==='pop')&&r.od&&r.od<dnes&&!(r.lode&&r.lode.vydano)){r.stav='zru';r.hist=(r.hist||[]).concat([{t:Date.now(),kdo:'Systém',co:'Automaticky zrušena – host nepřijel (příjezd '+r.od+')'}]).slice(-30);n++}
  else if(r.stav==='uby'&&r.do&&r.do<dnes){r.stav='odj';r.hist=(r.hist||[]).concat([{t:Date.now(),kdo:'Systém',co:'Automaticky odhlášen (odjezd '+r.do+' už uplynul)'}]).slice(-30);n++}});if(n)pis(K,a);return n},
 obnov:function(a){pis(K,a)}, /* vrácení poslední změny zpět (administrace) */
 smaz:function(id){pis(K,R.vse().filter(function(x){return x.id!==id}))},
 vymaz:function(){pis(K,[])},
 /* TESTOVACÍ DATA pro náhled – před ostrým provozem smazat (i automatické vložení níže).
    Kolem dneška: minulé, probíhající a budoucí pobyty se zálohami v různém stavu, lodě (výdej, na vodě, vrácené) a doprava. Záznamy mají ukazka:1. */
 ukazka:function(vse){var v=vse?0:cti('kkt.rez.ukazka',0),n=0,m0={};m0[K]=cti(K,[]);m0[KC]=cti(KC,0);mem=m0;try{var t=new Date(),Y=t.getFullYear()+(t.getMonth()>7?1:0),J=['Novákovi','Müller','Dvořák','Jansen','Kolářová','Veselý','Jelínek','Schmidt','Svoboda','Fischer','Černý','Weber','Procházka','de Vries','Kučera','Horák','Bauer','Marková','Němec','Visser','Pokorná','Hofmann','Král','Urban'],ST=['pot','pot','pot','pop','pot','pot'],C={chatka:890,podsad:300,teepee:700};
  var dd=function(k){var x=new Date(t.getFullYear(),t.getMonth(),t.getDate()+k);return I(x)},jl=function(d){return I(new Date(Y,6,d))};
  var p=function(m,od,dk,st,jm){try{var k=m.split('-')[0];R.pridej(st==='blk'?{mista:[m],od:od,do:dk,jmeno:jm,stav:'blk',zprava:'Testovací data'}:{mista:[m],od:od,do:dk,jmeno:jm||J[n%J.length],stav:st||ST[n%ST.length],osoby:{dosp:k==='podsad'?2:2+n%3,dite:k==='podsad'?0:n%3,zak:0},telefon:'+420 777 000 '+('00'+(100+n)).slice(-3),cena:C[k]*R.noci(od,dk).length,zdroj:n%3?'web':'rucne',kdo:'ukázka',zprava:'Testovací data'});n++}catch(e){}};
  if(!vse&&v<5){m0[K]=[];m0[KC]=0} /* přechod na novou sadu: staré testovací rezervace pryč */
  var sd=20261116,rn=function(){sd=(sd*16807)%2147483647;return sd/2147483647},ri=function(a,b){return a+Math.floor(rn()*(b-a+1))},pick=function(A){return A[Math.floor(rn()*A.length)]};
  var JN=['Jana Nováková','Petr Dvořák','Lukas Müller','Tereza Svobodová','Martin Černý','Anna Schmidt','Tomáš Procházka','Eva Kučerová','Jan Veselý','Sophie Weber','Pavel Horák','Lenka Němcová','Daan de Vries','Michal Marek','Kateřina Pokorná','Jonas Fischer','Ondřej Král','Barbora Jelínková','Emma Jansen','Jiří Růžička','Markéta Benešová','Felix Wagner','David Fiala','Hana Sedláčková','Piotr Kowalski','Vojtěch Doležal','Klára Zemanová','Lisa Hoffmann','Radek Kolář','Monika Navrátilová','Tim Peeters','Filip Urban','Veronika Šimková','Max Becker','Josef Vlček','Lucie Kadlecová','Ruud Visser','Adam Polák','Nikola Hájková','Stefan Klein'];
  var JZ=['cs','cs','cs','cs','cs','de','de','en','nl','pl'],hn=0,dd=function(k){var x=new Date(t.getFullYear(),t.getMonth(),t.getDate()+k);return I(x)},dnes=dd(0);
  var host=function(){var jm=JN[(hn++*7)%JN.length],web=rn()<.78,em=jm.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z]+/g,'.');
   return {jmeno:jm,telefon:'+420 '+ri(601,799)+' '+ri(100,999)+' '+ri(100,999),email:web||rn()<.5?em+'@example.com':'',zdroj:web?'web':'rucne',jazyk:web?pick(JZ):'cs',kdo:web?'':'Obsluha',ukazka:1}};
  var plat=function(cn,od,st){var pb=R.novaPlatba(cn,od,dd(-ri(1,6)));if(!pb)return null;pb.stav=st;if(st!=='ceka')pb.kdy=Date.now()-ri(1,12)*864e5;else if(pb.splatnost<dnes)pb.splatnost=dd(ri(0,3));return pb};
  /* jedna rezervace ubytování; stav a platba podle toho, kdy pobyt je (minulý, právě probíhá, dnešní příjezd, budoucí) */
  var U=function(mista,od,dk,ex){try{var k=mista.length?mista[0].split('-')[0]:'stan',nc=R.noci(od,dk).length,h=host(),o=k==='podsad'?{dosp:2,dite:0,zak:0}:{dosp:ri(1,3)+1,dite:rn()<.45?ri(1,2):0,zak:0};
    var cn=0;mista.forEach(function(m){cn+=({chatka:890,podsad:300,teepee:700}[m.split('-')[0]]||0)*nc});ex=ex||{};if(ex.dalsi)cn+=((ex.dalsi.stan||0)*150+(ex.dalsi.karavan||0)*250+(o.dosp+o.dite)*120)*nc;
    var st,pb=null,mist=h.zdroj==='rucne'&&rn()<.55;
    if(dk<dnes){st='odj';pb=mist?null:plat(cn,od,'vse')}
    else if(od<dnes){st='uby';pb=mist?null:plat(cn,od,rn()<.5?'vse':'zal')}
    else if(od===dnes){st='pot';pb=mist?null:plat(cn,od,'zal')}
    else{var q=rn();if(mist){st='pot'}else if(q<.6){st='pot';pb=plat(cn,od,'zal')}else if(q<.82){st='pop';pb=plat(cn,od,'ceka')}else if(q<.9){st='pot';pb=plat(cn,od,'vse')}else{st='pop'}}
    var r=Object.assign({mista:mista,od:od,do:dk,stav:st,osoby:o,cena:cn,platba:pb,zprava:rn()<.15?pick(['Přijedeme až kolem 20:00.','Máme s sebou psa.','Prosíme chatku blíž k řece.','Budeme potřebovat parkování pro 2 auta.']):''},h,ex);
    R.pridej(r);n++;return r}catch(e){return null}};
  var ch=function(i){return ['chatka-'+i]},ps=function(i){return ['podsad-'+i]},i,d,l;
  /* blokace: údržba chatky */
  try{R.pridej({mista:['chatka-20'],od:dd(2),do:dd(6),jmeno:'Údržba – nová terasa',stav:'blk',zprava:'Oprava terasy',ukazka:1});n++}catch(e){}
  /* skupina */
  U(['chatka-1','chatka-2','chatka-3','podsad-1','podsad-2'],dd(18),dd(21),{jmeno:'Turistický oddíl Kaplice',osoby:{dosp:3,dite:12,zak:0},zdroj:'rucne',kdo:'Obsluha'});
  /* chatky, podsadové stany a teepee: asi polovina obsazená, 2 týdny zpět a 6 týdnů dopředu */
  for(i=1;i<=20;i++){d=-16+ri(0,5);while(d<42){l=ri(2,6);if(rn()<.58)U(ch(i),dd(d),dd(d+l));d+=l+ri(0,3)}}
  for(i=1;i<=11;i++){d=-12+ri(0,4);while(d<32){l=ri(1,3);if(rn()<.5)U(ps(i),dd(d),dd(d+l));d+=l+ri(0,4)}}
  for(d=-10;d<35;){l=ri(2,4);if(rn()<.6)U(['teepee-1'],dd(d),dd(d+l));d+=l+ri(0,3)}
  /* vlastní stany a karavany */
  for(d=-10;d<30;d+=ri(1,3)){l=ri(1,4);U([],dd(d),dd(d+l),{dalsi:{stan:rn()<.7?ri(1,2):0,karavan:rn()<.4?1:0}})}
  /* zrušené: hostem, a jedna propadlá (záloha nepřišla) */
  [[4,'Zrušeno hostem – nemoc v rodině'],[9,'Zrušeno hostem'],[15,'Zrušeno hostem – změna plánů']].forEach(function(x){var r=U([],dd(x[0]),dd(x[0]+2),{dalsi:{stan:1,karavan:0}});if(r)try{R.uprav(r.id,{stav:'zru',hist:[{t:Date.now()-864e5,kdo:'Obsluha',co:x[1]}]})}catch(e){}});
  (function(){var r=U([],dd(6),dd(9),{dalsi:{stan:0,karavan:1},zdroj:'web',kdo:''});if(r&&r.platba)try{R.uprav(r.id,{stav:'zru',platba:Object.assign({},r.platba,{stav:'ceka',splatnost:dd(-1)}),hist:[{t:Date.now()-3600e3,kdo:'Systém',co:'Propadla – záloha nepřišla do '+dd(-1)}]})}catch(e){}})();
  /* chatka + lodě: hosté, kteří si k ubytování přiobjednali lodě (a dopravu) */
  [[1,2,{kanoe:2},'dop1',1],[3,1,{raft6:1},'dop2',1],[5,2,{kanoe:3},'dop1',0],[8,1,{raft4:1,kanoe:1},'dop4',1],[11,2,{kanoe:2},'dop1',1]].forEach(function(x){
   for(var c=1;c<=19;c++){var od=dd(x[0]-1),dk=dd(x[0]+x[1]);if(R.kolize(ch(c),od,dk).length)continue;
    var lo={den:dd(x[0]),dni:x[1],kusy:x[2],odkud:x[3],kam:'kemp'},os=0;Object.keys(x[2]).forEach(function(k){os+=x[2][k]*((KKC.p(k)||{}).osob||2)});
    var dp=x[4]?{misto:x[3],osob:os,cas:'9:00',den:lo.den}:null,cn=890*R.noci(od,dk).length+R.cenaLodi(lo).celkem+R.cenaDopravy(dp),h=host(),q=x[0]<4;
    try{R.pridej(Object.assign({mista:ch(c),od:od,do:dk,stav:q?'pot':'pop',osoby:{dosp:Math.min(4,Math.max(2,os-1)),dite:os>3?1:0,zak:0},lode:lo,doprava:dp,cena:cn,platba:plat(cn,od,q?'zal':'ceka'),zprava:''},h,{zdroj:'web',kdo:''}));n++}catch(e){}break}});
  { /* lodě a doprava – minulé (vrácené, nevrácené po termínu), dnešní výdej, budoucí; doprava i bez lodí */
   var JM=['Kratochvíl','Hoffmann','Pospíšilová','de Vries','Marek','Bauer','Horáková','Wagner','Bláha','Zeman','Krejčí','Becker','Urban','Peeters','Vacek','Richter','Šimek','Klein','Kadlec','Novotná','Beneš','Wolf','Sedláček','Hájek','Mertens','Vlček','Lang','Polák'];
   var KP=function(k){var o=0;Object.keys(k).forEach(function(x){o+=k[x]*((KKC.p(x)||{}).osob||2)});return o};
   /* [den od dnes, dní, lodě, odkud, kam, doprava?, čas, stan ve vlastním stanu (noci), stav lodí: 0 nic | 'vra' vráceno | 'ven' venku | 'cast' část vrácena] */
   var L4=[[-6,1,{kanoe:3},'dop1','kemp',1,'9:00',0,'vra'],[-5,2,{raft6:2},'dop2','dop9',1,'10:00',2,'vra'],[-4,1,{kanoe:2,baraka:1},'dop4','kemp',0,'',0,'vra'],[-3,1,{raft4:1},'dop5','dop8',1,'11:00',0,'cast'],
     [-2,1,{kanoe:2},'dop1','dop2',1,'9:30',0,'ven'],[-1,1,{raft8:1,kanoe:2},'dop2','kemp',1,'9:00',1,'vra'],[-1,2,{kanoe:4},'dop1','kemp',1,'8:30',0,'ven'],
     [0,1,{kanoe:2},'dop1','kemp',1,'9:00',1,0],[0,1,{raft6:1},'dop3','kemp',1,'10:30',0,0],[0,1,{kanoe:5,raft4:1},'dop1','dop2',1,'9:00',0,'ven'],[0,3,{kanoe:2},'dop1','dop9',1,'8:30',0,'ven'],[0,1,{baraka:2},'kemp','dop8',0,'',2,0],
     [1,1,{kanoe:3},'dop2','kemp',1,'9:30',1,0],[1,1,{raft8:2},'dop1','kemp',1,'9:00',0,0],[2,2,{kanoe:6},'dop1','dop9',1,'8:30',2,0],[2,1,{raft4:2,kanoe:1},'dop4','kemp',1,'10:00',0,0],[3,1,{kanoe:2},'dop5','kemp',0,'',1,0],
     [4,1,{raft6:3},'dop1','kemp',1,'9:00',0,0],[5,1,{kanoe:8},'dop2','kemp',1,'9:30',2,0],[6,1,{raft4:1},'dop3','dop8',1,'11:00',0,0],[7,2,{kanoe:3,baraka:1},'dop1','kemp',1,'8:30',3,0],[9,1,{raft8:1},'dop2','kemp',1,'10:00',0,0],
     [10,1,{kanoe:10},'dop1','kemp',1,'9:00',1,0],[12,1,{raft6:2},'dop4','dop9',1,'9:30',0,0],[14,3,{kanoe:4},'dop1','dop9',1,'8:30',2,0],[17,1,{kanoe:2,raft4:1},'dop2','kemp',1,'10:00',0,0],[20,1,{raft8:2},'dop1','kemp',1,'9:00',1,0],[24,1,{kanoe:3},'dop3','kemp',0,'',0,0]];
   L4.forEach(function(x,i){try{var l={den:dd(x[0]),dni:x[1],kusy:x[2],odkud:x[3],kam:x[4]},os=KP(x[2]),dp=x[5]&&x[3]!=='kemp'?{misto:x[3],osob:os,cas:x[6],den:l.den}:null,st=x[7],cn=R.cenaLodi(l).celkem+R.cenaDopravy(dp),od=st?dd(x[0]-1):l.den,dk=st?dd(x[0]-1+st):dd(x[0]+x[1]-1);
     if(st)cn+=st*(190+2*200);
     var pb=R.novaPlatba(cn,l.den,dd(Math.min(0,x[0]-7)));if(pb){if(x[0]<0)pb.stav='vse';else if(x[0]===0||i%3)pb.stav='zal';if(pb.stav!=='ceka')pb.kdy=Date.now()-ri(1,9)*864e5}
     var r=R.pridej({mista:[],dalsi:{stan:st?1:0,karavan:0},od:od,do:dk<l.den&&!st?l.den:dk,jmeno:JM[i%JM.length],stav:st&&od<dd(0)?'uby':pb&&pb.stav==='ceka'?'pop':'pot',osoby:{dosp:Math.max(1,os-(os>3?2:0)),dite:os>3?2:0,zak:0},telefon:'+420 77'+(i%10)+' 4'+(10+i)+' '+(300+i*7),email:'host'+(i+1)+'@example.com',zdroj:i%4?'web':'obsluha',jazyk:i%5===4?'de':i%7===3?'en':'cs',lode:l,doprava:dp,platba:pb,cena:cn,zprava:i%5===2?'Jedeme poprvé, prosíme o krátkou instruktáž.':'',ukazka:1});
     if(x[8]){var pt=R.lodePotreba(l),vd={kdy:Date.now()-Math.max(0,-x[0])*864e5-3600e3,kdo:'Obsluha',kusy:pt},vr=[];
      if(x[8]==='vra')vr=[{kdy:vd.kdy+6*3600e3,kdo:'Obsluha',kusy:pt}];
      if(x[8]==='cast'){var half={};Object.keys(pt).forEach(function(k){var h=Math.floor(pt[k]/2);if(h)half[k]=h});vr=[{kdy:vd.kdy+5*3600e3,kdo:'Obsluha',kusy:half}]}
      var z={lode:Object.assign({},l,{vydano:vd,vraceno:vr})};if(x[8]==='vra'&&!st)z.stav='odj';if(x[8]==='vra'&&st&&x[0]+st<=0)z.stav='odj';R.uprav(r.id,z)}
     n++}catch(e){}});
   /* doprava bez lodí (vlastní lodě nebo jen výlet) */
   [[0,'dop1','9:00',4,2],[1,'dop2','10:00',6,3],[3,'dop4','9:30',3,2],[5,'dop1','8:30',8,4],[8,'dop3','11:00',2,1],[11,'dop2','9:00',5,2]].forEach(function(x,i){try{var dp={misto:x[1],osob:x[3],cas:x[2],den:dd(x[0])},cn=R.cenaDopravy(dp)+x[4]*(190+x[3]*200);
     R.pridej({mista:[],dalsi:{stan:1,karavan:0},od:dd(x[0]-1),do:dd(x[0]-1+x[4]),jmeno:JM[(i+11)%JM.length]+' (vlastní lodě)',stav:x[0]<=0?'uby':'pot',osoby:{dosp:x[3],dite:0,zak:0},telefon:'+420 60'+i+' 2'+(20+i)+' 5'+(10+i),email:'doprava'+(i+1)+'@example.com',zdroj:'web',jazyk:'cs',doprava:dp,cena:cn,zprava:'Lodě máme vlastní, chceme jen odvoz na start.',ukazka:1});n++}catch(e){}})}
  }finally{mem=null;pis(K,m0[K]);pis(KC,m0[KC])}
  pis('kkt.rez.ukazka',5);return n}
};
try{if(cti('kkt.rez.ukazka',0)<5)R.ukazka()}catch(e){}
})();
