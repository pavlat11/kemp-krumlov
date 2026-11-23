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
  navoz:{n:'Návoz lodí (jednorázový poplatek)',sloupce:['Bližší místa','Vzdálenější místa'],pevne:true},
  doprava:{n:'Doprava osob (cena za auto pro 8 osob)',sloupce:['Cena']}
 },
 polozky:[
  {k:'os',kat:'osoby',n:'Osoba',pozn:'od 15 let, včetně místního poplatku 50 Kč',a:200,b:190},
  {k:'dite',kat:'osoby',n:'Dítě',pozn:'do 15 let',a:120,b:100},
  {k:'zak',kat:'osoby',n:'Žák ve stanu',pozn:'jen ve vlastním stanu',a:150,b:150,pro:['stan']},
  {k:'stan',kat:'ubytovani',n:'Stan',pozn:'místo na louce u řeky',a:200,b:190,jed:'stan',rez:1},
  {k:'karavan',kat:'ubytovani',n:'Karavan',pozn:'místo u řeky, elektřina za příplatek',a:500,b:300,jed:'místo',rez:1},
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
  {k:'nav1',kat:'navoz',n:'Jeden den, do 10 lodí',a:200,b:600},{k:'nav2',kat:'navoz',n:'Jeden den, 10 a více lodí',a:500,b:1000},
  {k:'nav3',kat:'navoz',n:'Více dní, do 10 lodí',a:400},{k:'nav4',kat:'navoz',n:'Více dní, 10 a více lodí',a:800},
  {k:'dop1',kat:'doprava',n:'Vyšší Brod',a:1150,vzd:1,n1:600,n10:1000,d1:400,d10:800},{k:'dop2',kat:'doprava',n:'Rožmberk nad Vltavou',a:850,vzd:1,n1:600,n10:1000,d1:400,d10:800},{k:'dop3',kat:'doprava',n:'Nahořany',a:650,n1:200,n10:500,d1:400,d10:800},
  {k:'dop4',kat:'doprava',n:'Kemp Vltava',a:550,n1:200,n10:500,d1:400,d10:800},{k:'dop5',kat:'doprava',n:'Viking / Pískárna',a:500,n1:200,n10:500,d1:400,d10:800},{k:'dop6',kat:'doprava',n:'Vltavan / Spolí',a:350,n1:200,n10:500,d1:400,d10:800},
  {k:'dop7',kat:'doprava',n:'Centrum',a:250,n1:200,n10:500,d1:400,d10:800},{k:'dop8',kat:'doprava',n:'Zlatá Koruna',a:350,n1:200,n10:500,d1:400,d10:800},{k:'dop9',kat:'doprava',n:'Boršov',a:900,vzd:1,n1:600,n10:1000,d1:400,d10:800}
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
  /* návoz: druhý sloupec (vzdálenější místa, web PE-LA) ve starším ceníku chybí */
  u.polozky.forEach(function(p){if(p.kat==='doprava'&&p.vzd===undefined){var v0=VYCHOZI.polozky.filter(function(x){return x.k===p.k})[0];p.vzd=v0&&v0.vzd?1:0}});
  /* ceny návozu u každé zastávky (n1 = 1 den do 10 lodí, n10 = 1 den 10+, d1 = více dní do 10, d10 = více dní 10+); starší ceník je doplní z obecných cen návozu */
  var NVc=function(k,b){var x=u.polozky.filter(function(p){return p.k===k})[0]||VYCHOZI.polozky.filter(function(p){return p.k===k})[0]||{};return b&&x.b!=null?+x.b:+x.a||0};
  u.polozky.forEach(function(p){if(p.kat!=='doprava'||p.n1!==undefined)return;var f=!!p.vzd;p.n1=NVc('nav1',f);p.n10=NVc('nav2',f);p.d1=NVc('nav3',f);p.d10=NVc('nav4',f)});
  u.polozky.forEach(function(p){if(p.kat==='navoz'&&p.b==null){var v=VYCHOZI.polozky.filter(function(x){return x.k===p.k})[0];if(v&&v.b!=null)p.b=v.b}});
  navozZeZastavek(u);
  return u}
/* obecné ceny návozu (nav1–nav4, používá web PE-LA) se odvozují ze zastávek: bližší = nejnižší, vzdálenější = nejvyšší cena */
function navozZeZastavek(u){var Z=(u.polozky||[]).filter(function(p){return p.kat==='doprava'&&p.skryt!==1&&p.n1!=null});if(!Z.length)return;[['nav1','n1'],['nav2','n10'],['nav3','d1'],['nav4','d10']].forEach(function(x){var p=u.polozky.filter(function(q){return q.k===x[0]})[0];if(!p)return;var v=Z.map(function(z){return +z[x[1]]||0});p.a=Math.min.apply(null,v);p.b=Math.max.apply(null,v)})}
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
  data:C,vychozi:VYCHOZI,fmt:fmt,doplň:doplň,navozZeZastavek:navozZeZastavek,
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
  var MZ=function(m){return JZ!=='cs'&&window.KKL?KKL.mesic(m-1):KKC.mesic[m-1]};
  var IC={osoby:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14.2c2.8.3 5 2.6 5 5.8"/>',ubytovani:'<path d="M3 20 12 4l9 16H3z"/><path d="M12 4v16M9 20l3-6 3 6"/>',doplnky:'<rect x="3" y="11" width="18" height="6" rx="2"/><path d="M5 11l2-5h10l2 5M7 17v2M17 17v2"/>',lode:'<path d="M2 15h20l-3 4H5l-3-4z"/><path d="M12 15V4l6 8h-6"/>',sluzby:'<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"/>'};
  var svg=function(k){return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[k]+'</svg>'};
  var S=[],sez=MZ(C.sezona.hlavniOd)+'–'+MZ(C.sezona.hlavniDo);
  var hlav=function(a,b){return '<div class="ck-r ck-rh"><span></span>'+(b?'<span>'+a+'</span><span>'+b+'</span>':'<span class="ck-1">'+a+'</span>')+'</div>'};
  var rad=function(n,pz,a,b){return '<div class="ck-r"><span class="ck-n">'+esc(n)+(pz?'<small>'+esc(pz)+'</small>':'')+'</span>'+(b==null?'<b class="ck-1">'+a+'</b>':'<b>'+a+'</b><b'+(a===b?' class="ck-st"':'')+'>'+b+'</b>')+'</div>'};
  var sek=function(k,nad,pod,obsah){S.push([k,nad]);return '<div class="ck-s" id="ck-'+k+'"><h4 class="ck-h"><span class="ck-ic">'+svg(k)+'</span><span>'+esc(nad)+(pod?'<small>'+esc(pod)+'</small>':'')+'</span></h4><div class="ck-t">'+obsah+'</div></div>'};
  var h='';
  ['osoby','ubytovani','doplnky'].forEach(function(kat){
    var pol=KKC.kat(kat).filter(function(p){return p.skryt!==1});if(!pol.length)return;
    var o=HZ?hlav(L('Sezóna')+'<small>'+esc(sez)+'</small>',L('Mimo sezónu')):hlav(L('Cena'));
    pol.forEach(function(p){var pozn=p.pozn?L(p.pozn):'';if(p.luzka)pozn=(pozn?pozn+', ':'')+L('kapacita')+' '+p.luzka;o+=rad(p.n,pozn,KKC.t(p.k,'a'),HZ?KKC.t(p.k,'b'):null)});
    h+=sek(kat,C.kategorie[kat].n,kat==='osoby'||kat==='ubytovani'?L('za noc'):'',o)});
  var lo=KKC.kat('lode').filter(function(p){return p.skryt!==1});
  if(lo.length){var o=hlav(L('1–2 dny'),L('3 a více dní'));lo.forEach(function(p){o+=rad(p.n,p.pozn,fmt(+p.a||0)+' Kč',fmt(p.b==null?+p.a||0:+p.b)+' Kč')});
    var ZS=KKC.kat('doprava').filter(function(p){return p.skryt!==1&&p.n1!=null});if(ZS.length){o+='<div class="ck-sub">'+esc(L('Návoz lodí podle místa'))+'<small>'+esc(L('Není v ceně rezervace – platí se na místě, vždy jen jeden návoz bez ohledu na trasu.'))+' '+esc(L('Platí dražší z místa startu a cíle. Kemp Krumlov se nepočítá.'))+'</small></div>'+hlav(L('1 den'),L('více dní'));ZS.forEach(function(p){o+=rad(p.n,(+p.n10||+p.d10)?L('10 a více lodí')+': '+fmt(+p.n10||0)+' / '+fmt(+p.d10||0)+' Kč':'',fmt(+p.n1||0)+' Kč',fmt(+p.d1||0)+' Kč')})}
    h+=sek('lode',L('Půjčovna lodí'),L('cena za loď a den'),o)}
  var sl=(C.sluzby||[]).filter(function(p){return p.n});
  if(sl.length){var o='';sl.forEach(function(p){o+='<div class="ck-r ck-rs"><span class="ck-n">'+esc(p.n)+'</span><b class="ck-1">'+esc(p.t)+'</b></div>'});h+=sek('sluzby','Služby v kempu','',o)}
  var sv=KKC.slevyText(),top='<nav class="ck-nav" aria-label="'+esc(L('Části ceníku'))+'">'+S.map(function(x){return '<a href="#ck-'+x[0]+'">'+svg(x[0])+esc(x[1])+'</a>'}).join('')+'</nav>'+
    (sv?'<div class="ck-sl"><b>'+esc(L('Delší pobyt = levnější'))+'</b><span>'+sv.split(' · ').map(function(x){return '<i>'+esc(x)+'</i>'}).join('')+'</span></div>':'');
  var tab=tb.closest('table'),box=document.createElement('div');box.className='ck';box.innerHTML=top+h;tab.parentNode.insertBefore(box,tab);tab.remove();
  box.querySelector('.ck-nav').addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;e.preventDefault();var t=box.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth',block:'start'})});
  var no=document.querySelector('#rzPrice .note');if(no)no.textContent=L('Ceny jsou za noc, u lodí za loď a den. Místní poplatek je v ceně za osobu.');
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
  var tab=document.querySelector('#rzPrice .ck')||document.querySelector('#rzPrice table');if(tab&&tab.parentNode)tab.parentNode.insertBefore(poz,tab);
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
var K='kkt.rezervace',KN='kkt.rez.nast',KC='kkt.rez.cislo',KA='kkt.rez.archiv';
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
    rezervace.vyzved  = {misto:'dop9', osob:6, cas:'16:00', den}  (vyzvednutí v cíli a odvoz zpět do kempu, cena jako doprava na stejné místo)
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
 lodeCelkem:function(){var S=R.sklad(),c=Object.assign({},S.vyb);Object.keys(S.lode).forEach(function(k){c[k]=+S.lode[k].ks||0});R.poskozene().forEach(function(x){if(x.k in c)c[x.k]=Math.max(0,c[x.k]-(+x.ks||0))});return c},
 /* poškozené / v opravě: [{id,k,ks,popis,kdy,kdo}] – odečítají se ze skladu, dokud je někdo neoznačí jako opravené */
 poskozene:function(){return (R.nast().poskozeno||[]).filter(function(x){return x&&x.k&&+x.ks>0})},
 /* kolik kusů čeho může host ještě nahlásit jako poškozené/ztracené: co měl půjčené minus to, co už u něj nahlášené je (a není opravené) */
 poskozMax:function(rid){var r=R.vse().filter(function(x){return x.id===rid})[0];if(!r||!r.lode)return null;var m=Object.assign({},r.lode.vydano?r.lode.vydano.kusy:R.lodePotreba(r.lode));
  (r.poskozeno||[]).forEach(function(p){if(!p.opraveno&&p.k in m)m[p.k]=Math.max(0,m[p.k]-(+p.ks||0))});return m},
 poskozTyp:function(x){return x&&x.typ==='ztraceno'?'Ztraceno':'Poškozeno'},
 poskozNazev:function(k){var p=window.KKC&&KKC.p(k);return R.VYB[k]||(p?p.n:k)},
 poskozPridej:function(k,ks,popis,kdo,rid,typ){var n=R.nast(),r=rid?R.vse().filter(function(x){return x.id===rid})[0]:null,z={id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),k:k,ks:Math.max(1,Math.round(+ks||1)),typ:typ==='ztraceno'?'ztraceno':'poskozeno',popis:String(popis||'').trim(),kdy:Date.now(),kdo:kdo||''};if(r){z.rez=r.id;z.cislo=r.cislo||'';z.jmeno=r.jmeno||''}
  n.poskozeno=(n.poskozeno||[]).concat([z]);R.ulozNast(n);
  /* záznam i do historie rezervace, ať je u hosta vidět, co poškodil */
  if(r&&R.uprav)try{R.uprav(r.id,{poskozeno:(r.poskozeno||[]).concat([{id:z.id,k:k,ks:z.ks,typ:z.typ,popis:z.popis,kdy:z.kdy,kdo:z.kdo}]),hist:(r.hist||[]).concat([{t:z.kdy,kdo:kdo||'',co:(z.typ==='ztraceno'?'Ztraceno: ':'Poškozeno: ')+z.ks+'× '+R.poskozNazev(k)+(z.popis?' – '+z.popis:'')}]).slice(-30)})}catch(x){}
  return z},
 /* rezervace s loděmi, ke kterým jde poškození přiřadit: lodě má host teď u sebe, nebo je vracel/vydával v posledních dnech */
 poskozRez:function(den){var d=den||new Date().toISOString().slice(0,10),od=new Date(new Date(d).getTime()-3*864e5).toISOString().slice(0,10);return R.vse().filter(function(r){if(!r.lode||!R.lodePocet(r.lode)||r.stav==='zru'||r.stav==='blk')return false;var a=r.lode.den,b=R.lodeDny(r.lode).pop()||a;return a<=d&&b>=od}).sort(function(a,b){return (a.jmeno||'').localeCompare(b.jmeno||'','cs')})},
 poskozOprav:function(id,kdo){var n=R.nast(),x=(n.poskozeno||[]).filter(function(y){return y.id===id})[0];n.poskozeno=(n.poskozeno||[]).filter(function(y){return y.id!==id});R.ulozNast(n);
  if(x&&x.rez&&R.uprav)try{var r=R.vse().filter(function(q){return q.id===x.rez})[0];if(r)R.uprav(r.id,{poskozeno:(r.poskozeno||[]).map(function(p){return p.id===id?Object.assign({},p,{opraveno:Date.now()}):p}),hist:(r.hist||[]).concat([{t:Date.now(),kdo:kdo||'',co:(x.typ==='ztraceno'?'Nalezeno / doplněno: ':'Opraveno: ')+x.ks+'× '+R.poskozNazev(x.k)}]).slice(-30)})}catch(e){}},
 /* volné kusy pro celé období (nejhorší den) */
 lodeVolno:function(den,dni,krome){var c=R.lodeCelkem(),v=Object.assign({},c);R.lodeDny({den:den,dni:dni}).forEach(function(d){var o=R.lodeObs(d,krome);Object.keys(c).forEach(function(k){v[k]=Math.min(v[k],c[k]-(o[k]||0))})});return v},
 lodeChybi:function(l,krome){if(!l||!R.lodePocet(l))return [];var v=R.lodeVolno(l.den,l.dni,krome),p=R.lodePotreba(l),ch=[];Object.keys(p).forEach(function(k){if(p[k]>(v[k]||0)){var t=window.KKC&&KKC.p(k);ch.push((t?t.n:R.VYB[k]||k)+' (volných '+Math.max(0,v[k]||0)+', potřeba '+p[k]+')')}});return ch},
 cenaLodi:function(l){var o={pujc:0,navoz:0,celkem:0};if(!l||!window.KKC)return o;var dni=Math.max(1,+l.dni||1),n=R.lodePocet(l);if(!n)return o;Object.keys(l.kusy).forEach(function(k){o.pujc+=(+l.kusy[k]||0)*KKC.lod(k,dni)*dni});
  var nk=dni>1?(n>=10?'nav4':'nav3'):(n>=10?'nav2':'nav1'),np=KKC.p(nk),pa=window.KKC&&KKC.p(l.odkud),pb=window.KKC&&KKC.p(l.kam);o.daleko=!!((pa&&pa.vzd)||(pb&&pb.vzd));o.nk=nk;o.navoz=np?(o.daleko&&np.b!=null?+np.b||0:+np.a||0):0;
  /* ceny u zastávek mají přednost – platí ta dražší ze startu a cíle (návoz je vždy jen jeden) */
  var pk=dni>1?(n>=10?'d10':'d1'):(n>=10?'n10':'n1');o.pk=pk;o.zast='';[pa,pb].forEach(function(p){if(p&&p.kat==='doprava'&&p[pk]!=null&&(o.zast===''||+p[pk]>o.navoz)){o.navoz=+p[pk]||0;o.zast=p.k}});o.celkem=o.pujc;return o}/* návoz lodí NENÍ v ceně – platí se na místě, vždy jen jeden (bez ohledu na trasu) */,
 aut:function(osob){return Math.max(1,Math.ceil((+osob||0)/8))},
 cenaDopravy:function(d){if(!d||!d.misto||d.misto==='kemp'||!window.KKC)return 0;var p=KKC.p(d.misto);return p?(+p.a||0)*R.aut(d.osob):0},
 lodeTxt:function(l,j){if(!l||!R.lodePocet(l))return '';var a=Object.keys(l.kusy).filter(function(k){return +l.kusy[k]>0}).map(function(k){var p=window.KKC&&KKC.p(k);return l.kusy[k]+'× '+(p?(j&&j!=='cs'&&p['n_'+j])||p.n:k)}),d=l.den.split('-'),dni=Math.max(1,+l.dni||1),W={cs:['den','dny','dní'],en:['day','days','days'],de:['Tag','Tage','Tage']}[j||'cs']||['den','dny','dní'];
  return a.join(', ')+' · '+(+d[2])+'. '+(+d[1])+'. ('+dni+' '+(dni===1?W[0]:dni<5?W[1]:W[2])+')'+(l.odkud||l.kam?' · '+R.mistoN(l.odkud)+' → '+R.mistoN(l.kam):'')},
 dopravaTxt:function(d,j){if(!d||!d.misto)return '';var W={cs:['osob','auto','auta'],en:['people','van','vans'],de:['Personen','Wagen','Wagen']}[j||'cs']||['osob','auto','auta'],a=R.aut(d.osob),o=+d.osob||0;return R.mistoN(d.misto)+' · '+o+' '+((j||'cs')==='cs'?(o===1?'osoba':o>=2&&o<=4?'osoby':'osob'):W[0])+' · '+a+' '+(a===1?W[1]:W[2])+(d.cas?' · '+d.cas:'')},
 /* doprava na start + vyzvednutí v cíli (rezervace.vyzved = {misto, osob, cas, den}: hosty v cíli vyzvedneme a odvezeme do kempu) */
 dopravaVseTxt:function(r,j){if(!r)return '';var a=[];if(r.doprava&&r.doprava.misto)a.push(R.dopravaTxt(r.doprava,j));if(r.vyzved&&r.vyzved.misto)a.push(({cs:'vyzvednutí v cíli',en:'pick-up at the finish',de:'Abholung am Ziel'}[j||'cs']||'vyzvednutí v cíli')+': '+R.dopravaTxt(r.vyzved,j));return a.join(' + ')},
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
  {k:'predPrijezdem',n:'Den před příjezdem',kdo:'host',auto:1,kdy:'Automaticky den před příjezdem (v 10:00) – připomínka termínu, příjezdu a co si vzít.'},
  {k:'plavba',n:'Ráno v den plavby',kdo:'host',auto:1,kdy:'Automaticky v den plavby v 7:00 – čas a místo odvozu, návoz lodí a co si vzít na vodu. Jen u rezervací s loděmi.'},
  {k:'recenze',n:'Poděkování a prosba o recenzi',kdo:'host',auto:1,kdy:'Automaticky den po odjezdu (v 11:00) – poděkování a odkaz na hodnocení na Googlu.'},
  {k:'kemp',n:'Upozornění pro kemp',kdo:'kemp',kdy:'Přijde vám při každé nové poptávce nebo rezervaci z webu.'}],
 SABL_POLE:[['jmeno','Jméno hosta'],['cislo','Číslo rezervace'],['od','Příjezd'],['do','Odjezd'],['noci','Počet nocí'],['mista','Ubytování'],['osoby','Osoby'],['lode','Lodě'],['doprava','Doprava'],['cena','Cena'],['zaloha','Záloha'],['splatnost','Splatnost zálohy'],['doplatek','Doplatek na místě'],['ucet','Číslo účtu'],['vs','Variabilní symbol'],['telefon','Telefon'],['email','E-mail hosta'],['zprava','Zpráva od hosta'],['stav','Stav'],['prijezd','Čas příjezdu'],['odvoz','Odvoz (čas a místo)'],['navoz','Návoz lodí na místě'],['recenze','Odkaz na recenze']],
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
  predPrijezdem:{
   cs:{predmet:'Zítra se vidíme – Kemp Krumlov',text:'Dobrý den, {jmeno},\n\nzítra se na vás těšíme v Kempu Krumlov!\n\nTermín: {od} – {do} ({noci})\nUbytování: {mista}\nPříjezd kolem: {prijezd}\nDoplatek na místě: {doplatek}\nLodě: {lode}\n\nRecepce je otevřená od 8 do 21 hodin. Když přijedete později, zavolejte nám prosím na +420 720 514 943.\n\nS pozdravem\nKemp Krumlov'},
   en:{predmet:'See you tomorrow – Kemp Krumlov',text:'Hello {jmeno},\n\nwe look forward to seeing you tomorrow at Kemp Krumlov!\n\nDates: {od} – {do} ({noci})\nAccommodation: {mista}\nArrival around: {prijezd}\nBalance on site: {doplatek}\nBoats: {lode}\n\nReception is open from 8 am to 9 pm. If you arrive later, please call us on +420 720 514 943.\n\nBest regards\nKemp Krumlov'},
   de:{predmet:'Bis morgen – Kemp Krumlov',text:'Guten Tag {jmeno},\n\nwir freuen uns, Sie morgen im Kemp Krumlov zu begrüßen!\n\nTermin: {od} – {do} ({noci})\nUnterkunft: {mista}\nAnkunft gegen: {prijezd}\nRestbetrag vor Ort: {doplatek}\nBoote: {lode}\n\nDie Rezeption ist von 8 bis 21 Uhr geöffnet. Wenn Sie später ankommen, rufen Sie uns bitte an: +420 720 514 943.\n\nMit freundlichen Grüßen\nKemp Krumlov'}},
  plavba:{
   cs:{predmet:'Dnes jedete na vodu – Kemp Krumlov',text:'Dobrý den, {jmeno},\n\ndnes vás čeká Vltava! Krátké shrnutí:\n\nLodě: {lode}\nOdvoz: {odvoz}\nNávoz lodí (platí se na místě): {navoz}\n\nVezměte si: plavky, oblečení na převlečení, opalovací krém, pokrývku hlavy, pití a nepromokavý obal na telefon. Pádla, vesty a barely máte od nás.\n\nAhoj na vodě!\nKemp Krumlov'},
   en:{predmet:'Today you go on the river – Kemp Krumlov',text:'Hello {jmeno},\n\nthe Vltava is waiting for you today! A short summary:\n\nBoats: {lode}\nRide: {odvoz}\nBoat delivery (paid on site): {navoz}\n\nPlease bring: swimwear, spare clothes, sunscreen, a hat, drinks and a waterproof phone case. Paddles, life jackets and barrels are provided.\n\nHave a great trip!\nKemp Krumlov'},
   de:{predmet:'Heute geht es aufs Wasser – Kemp Krumlov',text:'Guten Tag {jmeno},\n\nheute wartet die Moldau auf Sie! Kurz zusammengefasst:\n\nBoote: {lode}\nFahrt: {odvoz}\nBootstransport (vor Ort zu zahlen): {navoz}\n\nBitte mitbringen: Badesachen, Wechselkleidung, Sonnencreme, Kopfbedeckung, Getränke und eine wasserdichte Handyhülle. Paddel, Westen und Tonnen bekommen Sie von uns.\n\nAhoj und gute Fahrt!\nKemp Krumlov'}},
  recenze:{
   cs:{predmet:'Děkujeme, že jste byli u nás – Kemp Krumlov',text:'Dobrý den, {jmeno},\n\nděkujeme, že jste strávili čas v Kempu Krumlov. Doufáme, že se vám u nás líbilo.\n\nPokud ano, moc nám pomůže krátké hodnocení na Googlu – zabere minutu:\n{recenze}\n\nBudeme se těšit zase příště!\nKemp Krumlov'},
   en:{predmet:'Thank you for staying with us – Kemp Krumlov',text:'Hello {jmeno},\n\nthank you for staying at Kemp Krumlov. We hope you enjoyed it.\n\nIf you did, a short review on Google would help us a lot – it only takes a minute:\n{recenze}\n\nWe hope to see you again!\nKemp Krumlov'},
   de:{predmet:'Danke für Ihren Besuch – Kemp Krumlov',text:'Guten Tag {jmeno},\n\nvielen Dank für Ihren Aufenthalt im Kemp Krumlov. Wir hoffen, es hat Ihnen gefallen.\n\nWenn ja, hilft uns eine kurze Bewertung bei Google sehr – es dauert nur eine Minute:\n{recenze}\n\nWir freuen uns auf ein Wiedersehen!\nKemp Krumlov'}},
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
  var h={jmeno:r.jmeno||'',cislo:r.cislo||'',od:F(r.od),do:F(r.do),noci:nc?nc+' '+P(nc,W.n):({cs:'bez noclehu',en:'no overnight stay',de:'ohne Übernachtung'}[j]||'bez noclehu'),mista:mi.join(', '),osoby:j==='cs'&&window.KKC?KKC.osobyTxt(o):(o.dosp||0)+' '+W.d+(dt?', '+dt+' '+P(dt,W.k):''),cena:KcT(r.cena),lode:R.lodeTxt(r.lode,j),doprava:R.dopravaVseTxt(r,j),zaloha:KcT(pl.zaloha),splatnost:F(pl.splatnost),doplatek:pl.zaloha&&r.cena>pl.zaloha?KcT(r.cena-pl.zaloha):'',ucet:R.zaloha().ucet||'',vs:String(r.cislo||'').replace(/\D/g,''),telefon:r.telefon||'',email:r.email||'',zprava:r.zprava||'–',stav:r.stav==='pop'?W.pop:W.pot,prijezd:r.prijezd||'',odvoz:r.doprava&&r.doprava.misto&&r.doprava.misto!=='kemp'?(r.doprava.cas||'')+' · '+R.mistoN(r.doprava.misto):'',navoz:r.lode&&R.lodePocet(r.lode)?KcT(R.cenaLodi(r.lode).navoz):'',recenze:R.nast().recenzeUrl||''};
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
  var a=R.vse(),c=cti(KC,0)+1;r.id='r'+Date.now().toString(36)+c;r.cislo='R'+(R.nast().rada||String(new Date().getFullYear()).slice(2))+'-'+('000'+c).slice(-4);r.vytvoreno=Date.now();a.push(r);
  if(!pis(K,a))throw new Error('Rezervaci se nepodařilo uložit.');pis(KC,c);return r},
 uprav:function(id,z){var a=R.vse(),r=a.filter(function(x){return x.id===id})[0];if(!r)throw new Error('Rezervace nenalezena.');var n=Object.assign({},r,z);
  if(n.stav!=='zru'){var k=R.kolize(n.mista,n.od,n.do,id);if(k.length)throw new Error('V tomto termínu je obsazeno: '+k.map(R.nazev).join(', ')+'.');
   var lc=R.lodeChybi(n.lode,id);if(lc.length)throw new Error('Na tento termín už není dost vybavení: '+lc.join(', ')+'.')}
  Object.assign(r,z);pis(K,a);return r},
 /* ---- SEZÓNA: uzavření a archiv ----
    Sezóna = rezervace s příjezdem (od) v daném roce. Uzavřením se přesunou do archivu (kkt.rez.archiv = {'2026':{rok,uzavreno,kdo,rezervace,souhrn}}),
    číslování nových rezervací začne od R27-0001 a rezervace na další roky zůstanou. Archiv jde stáhnout nebo vrátit zpět.
    server: GET /api/sezony · POST /api/sezony/{rok}/uzavrit {heslo} · POST /api/sezony/{rok}/obnovit {heslo} */
 sezonaRoky:function(){var o={};R.vse().forEach(function(r){var y=+(r.od||'').slice(0,4);if(y)o[y]=1});return Object.keys(o).map(Number).sort()},
 sezonaSouhrn:function(L){var o={rezervaci:0,zrusenych:0,noci:0,osob:0,trzby:0,lodi:0};(L||[]).forEach(function(r){if(r.stav==='blk')return;if(r.stav==='zru'){o.zrusenych++;return}o.rezervaci++;o.noci+=R.noci(r.od,r.do).length;o.osob+=window.KKC?KKC.osobPocet(r.osoby||{}):0;o.trzby+=+r.cena||0;o.lodi+=r.lode?R.lodePocet(r.lode):0});return o},
 /* co brání uzavření: hosté ještě ubytovaní, lodě venku, rezervace, které ještě neproběhly */
 sezonaKontrola:function(rok){var dnes=I(new Date()),L=R.vse().filter(function(r){return +(r.od||'').slice(0,4)===+rok}),akt=function(r){return r.stav!=='zru'&&r.stav!=='blk'};
  return {L:L,souhrn:R.sezonaSouhrn(L),uby:L.filter(function(r){return r.stav==='uby'}),lode:L.filter(function(r){var s=R.lodeStav(r);return s==='vyd'||s==='cast'}),
   budouci:L.filter(function(r){return akt(r)&&r.stav!=='uby'&&r.stav!=='odj'&&(r.do||r.od)>=dnes}),dalsi:R.vse().filter(function(r){return +(r.od||'').slice(0,4)>+rok&&akt(r)}).length}},
 archiv:function(){return cti(KA,{})},
 uzavriSezonu:function(rok,kdo){rok=+rok;var a=R.vse(),ven=a.filter(function(r){return +(r.od||'').slice(0,4)===rok}),zus=a.filter(function(r){return +(r.od||'').slice(0,4)!==rok});
  if(!ven.length)throw new Error('V sezóně '+rok+' nejsou žádné rezervace.');
  var ar=R.archiv(),st=ar[rok]&&ar[rok].rezervace||[],ids={};st.forEach(function(r){ids[r.id]=1});
  ar[rok]={rok:rok,uzavreno:Date.now(),kdo:kdo||'',pred:{rada:R.nast().rada||'',cislo:cti(KC,0)},rezervace:st.concat(ven.filter(function(r){return !ids[r.id]}))};ar[rok].souhrn=R.sezonaSouhrn(ar[rok].rezervace);
  if(!pis(KA,ar))throw new Error('Archiv se nepodařilo uložit (málo místa v prohlížeči). Nic se nezměnilo.');
  if(!pis(K,zus)){throw new Error('Rezervace se nepodařilo uložit. Nic se nezměnilo.')}
  var n=R.nast();n.rada=String(rok+1).slice(2);R.ulozNast(n);pis(KC,0);return ar[rok]},
 obnovSezonu:function(rok){var ar=R.archiv(),x=ar[rok];if(!x)throw new Error('Sezóna '+rok+' v archivu není.');var a=R.vse(),ids={};a.forEach(function(r){ids[r.id]=1});
  pis(K,a.concat(x.rezervace.filter(function(r){return !ids[r.id]})));delete ar[rok];pis(KA,ar);
  /* od uzavření nepřibyla žádná rezervace → vrátí se i původní číslování */
  var n=R.nast();if(x.pred&&n.rada===String(+rok+1).slice(2)&&!cti(KC,0)){n.rada=x.pred.rada;if(!n.rada)delete n.rada;R.ulozNast(n);pis(KC,x.pred.cislo||0)}return x},
 /* ubytovaní hosté, kterým už uplynul den odjezdu, se sami přepnou na „Odjel“ (zapomenuté odhlášení); vrací počet */
 auto:function(dnes){var a=R.vse(),n=0;a.forEach(function(r){if(r.stav==='pop'&&r.platba&&r.platba.stav==='ceka'&&r.platba.splatnost&&r.platba.splatnost<dnes){r.stav='zru';r.hist=(r.hist||[]).concat([{t:Date.now(),kdo:'Systém',co:'Propadla – záloha nepřišla do '+r.platba.splatnost}]).slice(-30);n++}
  else if((r.stav==='pot'||r.stav==='pop')&&r.od&&r.od<dnes&&!(r.lode&&r.lode.vydano)){r.stav='zru';r.hist=(r.hist||[]).concat([{t:Date.now(),kdo:'Systém',co:'Automaticky zrušena – host nepřijel (příjezd '+r.od+')'}]).slice(-30);n++}
  else if(r.stav==='uby'&&r.do&&r.do<dnes){r.stav='odj';r.hist=(r.hist||[]).concat([{t:Date.now(),kdo:'Systém',co:'Automaticky odhlášen (odjezd '+r.do+' už uplynul)'}]).slice(-30);n++}});if(n)pis(K,a);return n},
 obnov:function(a){pis(K,a)}, /* vrácení poslední změny zpět (administrace) */
 smaz:function(id){pis(K,R.vse().filter(function(x){return x.id!==id}))},
 vymaz:function(){pis(K,[])},
 /* TESTOVACÍ DATA pro náhled – před ostrým provozem smazat (i automatické vložení níže).
    Kolem dneška: minulé, probíhající a budoucí pobyty se zálohami v různém stavu, lodě (výdej, na vodě, vrácené) a doprava. Záznamy mají ukazka:1. */
 ukazka:function(vse){var v=vse?0:cti('kkt.rez.ukazka',0),n=0,m0={};m0[K]=cti(K,[]);m0[KC]=cti(KC,0);mem=m0;try{var t=new Date(),Y=t.getFullYear()+(t.getMonth()>7?1:0),J=['Novákovi','Müller','Dvořák','Jansen','Kolářová','Veselý','Jelínek','Schmidt','Svoboda','Fischer','Černý','Weber','Procházka','de Vries','Kučera','Horák','Bauer','Marková','Němec','Visser','Pokorná','Hofmann','Král','Urban'],ST=['pot'],C={chatka:890,podsad:300,teepee:700};
  var dd=function(k){var x=new Date(t.getFullYear(),t.getMonth(),t.getDate()+k);return I(x)},jl=function(d){return I(new Date(Y,6,d))};
  var p=function(m,od,dk,st,jm){try{var k=m.split('-')[0];R.pridej(st==='blk'?{mista:[m],od:od,do:dk,jmeno:jm,stav:'blk',zprava:'Testovací data'}:{mista:[m],od:od,do:dk,jmeno:jm||J[n%J.length],stav:st||ST[n%ST.length],osoby:{dosp:k==='podsad'?2:2+n%3,dite:k==='podsad'?0:n%3,zak:0},telefon:'+420 777 000 '+('00'+(100+n)).slice(-3),cena:C[k]*R.noci(od,dk).length,zdroj:n%3?'web':'rucne',kdo:'ukázka',zprava:'Testovací data'});n++}catch(e){}};
  if(!vse&&v<8){m0[K]=[];m0[KC]=0} /* přechod na novou sadu: staré testovací rezervace pryč */
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
    else{var q=rn();if(mist){st='pot'}else if(q<.6){st='pot';pb=plat(cn,od,'zal')}else if(q<.82){st='pot';pb=plat(cn,od,'ceka')}else if(q<.9){st='pot';pb=plat(cn,od,'vse')}else{st='pot'}}
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
    try{R.pridej(Object.assign({mista:ch(c),od:od,do:dk,stav:'pot',osoby:{dosp:Math.min(4,Math.max(2,os-1)),dite:os>3?1:0,zak:0},lode:lo,doprava:dp,cena:cn,platba:plat(cn,od,q?'zal':'ceka'),zprava:''},h,{zdroj:'web',kdo:''}));n++}catch(e){}break}});
  { /* lodě a doprava – minulé (vrácené, nevrácené po termínu), dnešní výdej, budoucí; doprava i bez lodí */
   var JM=['Kratochvíl','Hoffmann','Pospíšilová','de Vries','Marek','Bauer','Horáková','Wagner','Bláha','Zeman','Krejčí','Becker','Urban','Peeters','Vacek','Richter','Šimek','Klein','Kadlec','Novotná','Beneš','Wolf','Sedláček','Hájek','Mertens','Vlček','Lang','Polák','Dušek','Schulz','Kovář','Janssen','Mráz','Bergmann','Holub','Smits','Říha','Vogel'];
   var KP=function(k){var o=0;Object.keys(k).forEach(function(x){o+=k[x]*((KKC.p(x)||{}).osob||2)});return o};
   /* [den od dnes, dní, lodě, odkud, kam, doprava?, čas, stan ve vlastním stanu (noci), stav lodí: 0 nic | 'vra' vráceno | 'ven' venku | 'cast' část vrácena] */
   var L4=[[-6,1,{kanoe:3},'dop1','kemp',1,'9:00',0,'vra'],[-5,2,{raft6:2},'dop2','dop9',1,'10:00',2,'vra'],[-4,1,{kanoe:2,baraka:1},'dop4','kemp',0,'',0,'vra'],[-3,1,{raft4:1},'dop5','dop8',1,'11:00',0,'cast'],
     [-2,1,{kanoe:2},'dop1','dop2',1,'9:30',0,'ven'],[-1,1,{raft8:1,kanoe:2},'dop2','kemp',1,'9:00',1,'vra'],[-1,2,{kanoe:4},'dop1','kemp',1,'8:30',0,'ven'],
     [0,1,{kanoe:2},'dop1','kemp',1,'9:00',1,0],[0,1,{raft6:1},'dop3','kemp',1,'10:30',0,0],[0,1,{kanoe:5,raft4:1},'dop1','dop2',1,'9:00',0,'ven'],[0,3,{kanoe:2},'dop1','dop9',1,'8:30',0,'ven'],[0,1,{baraka:2},'kemp','dop8',0,'',2,0],
     [1,1,{kanoe:3},'dop2','kemp',1,'9:30',1,0],[1,1,{raft8:2},'dop1','kemp',1,'9:00',0,0],[2,2,{kanoe:6},'dop1','dop9',1,'8:30',2,0],[2,1,{raft4:2,kanoe:1},'dop4','kemp',1,'10:00',0,0],[3,1,{kanoe:2},'dop5','kemp',0,'',1,0],
     [4,1,{raft6:3},'dop1','kemp',1,'9:00',0,0],[5,1,{kanoe:8},'dop2','kemp',1,'9:30',2,0],[6,1,{raft4:1},'dop3','dop8',1,'11:00',0,0],[7,2,{kanoe:3,baraka:1},'dop1','kemp',1,'8:30',3,0],[9,1,{raft8:1},'dop2','kemp',1,'10:00',0,0],
     [10,1,{kanoe:10},'dop1','kemp',1,'9:00',1,0],[12,1,{raft6:2},'dop4','dop9',1,'9:30',0,0],[14,3,{kanoe:4},'dop1','dop9',1,'8:30',2,0],[17,1,{kanoe:2,raft4:1},'dop2','kemp',1,'10:00',0,0],[20,1,{raft8:2},'dop1','kemp',1,'9:00',1,0],[24,1,{kanoe:3},'dop3','kemp',0,'',0,0],
     [0,1,{kanoe:3},'kemp','dop9',0,'',1,0],[1,1,{raft4:1,kanoe:1},'kemp','dop8',0,'',0,0],[1,1,{kanoe:2},'dop2','dop8',1,'9:00',0,0],[2,1,{raft6:1},'kemp','dop9',0,'',2,0],[3,1,{baraka:2},'kemp','dop8',0,'',0,0],[4,1,{kanoe:4},'dop1','dop8',1,'8:30',1,0],[5,1,{raft8:1},'kemp','dop9',0,'',0,0],[6,2,{kanoe:2},'dop4','dop9',1,'10:00',0,0],[8,1,{kanoe:3},'kemp','dop8',0,'',1,0],[11,1,{raft4:2},'kemp','dop9',0,'',0,0]];
   L4.forEach(function(x,i){try{var l={den:dd(x[0]),dni:x[1],kusy:x[2],odkud:x[3],kam:x[4]},os=KP(x[2]),dp=x[5]&&x[3]!=='kemp'?{misto:x[3],osob:os,cas:x[6],den:l.den}:null,vz=x[4]!=='kemp'&&i%4!==3?{misto:x[4],osob:os,cas:['15:30','16:00','16:30','17:00','17:30'][i%5],den:R.lodeDny(l).pop()}:null,st=x[7],cn=R.cenaLodi(l).celkem+R.cenaDopravy(dp)+R.cenaDopravy(vz),od=st?dd(x[0]-1):l.den,dk=st?dd(x[0]-1+st):dd(x[0]+x[1]-1);
     if(st)cn+=st*(190+2*200);
     var pb=R.novaPlatba(cn,l.den,dd(Math.min(0,x[0]-7)));if(pb){if(x[0]<0)pb.stav='vse';else if(x[0]===0||i%3)pb.stav='zal';if(pb.stav!=='ceka')pb.kdy=Date.now()-ri(1,9)*864e5}
     var r=R.pridej({mista:[],dalsi:{stan:st?1:0,karavan:0},od:od,do:dk<l.den&&!st?l.den:dk,jmeno:JM[i%JM.length],stav:st&&od<dd(0)?'uby':'pot',osoby:{dosp:Math.max(1,os-(os>3?2:0)),dite:os>3?2:0,zak:0},telefon:'+420 77'+(i%10)+' 4'+(10+i)+' '+(300+i*7),email:'host'+(i+1)+'@example.com',zdroj:i%4?'web':'obsluha',jazyk:i%5===4?'de':i%7===3?'en':'cs',lode:l,doprava:dp,vyzved:vz,platba:pb,cena:cn,zprava:i%5===2?'Jedeme poprvé, prosíme o krátkou instruktáž.':'',ukazka:1});
     if(x[8]){var pt=R.lodePotreba(l),vd={kdy:Date.now()-Math.max(0,-x[0])*864e5-3600e3,kdo:'Obsluha',kusy:pt},vr=[];
      if(x[8]==='vra')vr=[{kdy:vd.kdy+6*3600e3,kdo:'Obsluha',kusy:pt}];
      if(x[8]==='cast'){var half={};Object.keys(pt).forEach(function(k){var h=Math.floor(pt[k]/2);if(h)half[k]=h});vr=[{kdy:vd.kdy+5*3600e3,kdo:'Obsluha',kusy:half}]}
      var z={lode:Object.assign({},l,{vydano:vd,vraceno:vr})};if(x[8]==='vra'&&!st)z.stav='odj';if(x[8]==='vra'&&st&&x[0]+st<=0)z.stav='odj';R.uprav(r.id,z)}
     n++}catch(e){}});
   /* doprava bez lodí (vlastní lodě nebo jen výlet) */
   [[0,'dop1','9:00',4,2],[1,'dop2','10:00',6,3],[3,'dop4','9:30',3,2],[5,'dop1','8:30',8,4],[8,'dop3','11:00',2,1],[11,'dop2','9:00',5,2],[0,'dop8','16:00',3,1,1],[2,'dop9','17:00',5,2,1],[6,'dop8','15:30',2,1,1]].forEach(function(x,i){try{var dp={misto:x[1],osob:x[3],cas:x[2],den:dd(x[0])},zp=!!x[5],cn=R.cenaDopravy(dp)+x[4]*(190+x[3]*200);
     R.pridej({mista:[],dalsi:{stan:1,karavan:0},od:dd(x[0]-1),do:dd(x[0]-1+x[4]),jmeno:JM[(i+11)%JM.length]+' (vlastní lodě)',stav:x[0]<=0?'uby':'pot',osoby:{dosp:x[3],dite:0,zak:0},telefon:'+420 60'+i+' 2'+(20+i)+' 5'+(10+i),email:'doprava'+(i+1)+'@example.com',zdroj:'web',jazyk:'cs',doprava:zp?null:dp,vyzved:zp?dp:null,cena:cn,zprava:zp?'Lodě máme vlastní, poplujeme z kempu – prosíme vyzvednout v cíli.':'Lodě máme vlastní, chceme jen odvoz na start.',ukazka:1});n++}catch(e){}})}
  }finally{mem=null;pis(K,m0[K]);pis(KC,m0[KC])}
  pis('kkt.rez.ukazka',8);return n}
};
try{if(cti('kkt.rez.ukazka',0)<6)R.ukazka()}catch(e){}
})();
/* Stav vody na Vltavě (KKV). Testovací verze: ukázková data. Naostro: server každou hodinu stáhne data ČHMÚ (opendata.chmi.cz, stanice Vyšší Brod a Český Krumlov) a web je načte z /api/voda – viz NAPOJENI-NA-SERVER.md */
(function(){
var LSG=function(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}};
var T=function(s){return window.KL&&KL.t?KL.t(s):s};
function prahy(){var p=LSG('kkt.voda.prahy',null)||{};return{nizky:+p.nizky||5,vysoky:+p.vysoky||30,nebezp:+p.nebezp||60}}
function data(){var srv=LSG('kkt.voda.data',null);if(srv&&srv.st)return srv;
  var d=new Date(),h=d.getHours(),hist=[],i,b=7.4;
  for(i=6;i>=0;i--){var x=new Date(d);x.setDate(d.getDate()-i);var s=x.getDate()*7+x.getMonth()*3;hist.push({d:x.getDate()+'. '+(x.getMonth()+1)+'.',q:Math.round((b+Math.sin(s)*1.1+(6-i)*.12)*10)/10})}
  var q=hist[6].q,q0=hist[5].q;
  return{ukazka:1,cas:(h<10?'0':'')+h+':00',hist:hist,
    st:[{n:'Vyšší Brod',q:q,h:Math.round(52+q*1.6),t:Math.round((d.getMonth()>4&&d.getMonth()<9?17:7)*10)/10,tr:q>q0+.2?1:q<q0-.2?-1:0},
        {n:'Český Krumlov',q:Math.round((q*1.35+1)*10)/10,h:Math.round(70+q*2.1),t:null,tr:q>q0+.2?1:q<q0-.2?-1:0}]}}
function stav(q){var p=prahy();if(q<p.nizky)return{k:'nizky',t:T('Nízký stav – místy drhne'),c:'#e0a43a'};if(q<p.vysoky)return{k:'ok',t:T('Ideální na vodu'),c:'#2fb36b'};if(q<p.nebezp)return{k:'vys',t:T('Zvýšený stav – jen zkušení'),c:'#e07a2f'};return{k:'neb',t:T('Nesjízdné – velká voda'),c:'#d64545'}}
function f(n){return String(n).replace('.',',')}
function spark(hist,w,hg){var mx=Math.max.apply(0,hist.map(function(x){return x.q}))*1.08,mn=Math.min.apply(0,hist.map(function(x){return x.q}))*.9,st=w/(hist.length-1);
  var pts=hist.map(function(x,i){return[Math.round(i*st),Math.round(hg-(x.q-mn)/(mx-mn)*hg)]});
  return '<svg class="kv-sp" viewBox="0 -3 '+w+' '+(hg+6)+'" width="'+w+'" height="'+hg+'" aria-hidden="true"><path d="M'+pts.map(function(p){return p.join(' ')}).join('L')+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="'+pts[pts.length-1][0]+'" cy="'+pts[pts.length-1][1]+'" r="3.2" fill="currentColor"/></svg>'}
var TR=['↘','→','↗'],TRT=[T('klesá'),T('ustálený'),T('stoupá')];
function pruh(cls){var D=data(),s=D.st[0],S=stav(s.q);
  return '<div class="kv '+(cls||'')+' kv-'+S.k+'" title="'+T('Zdroj: ČHMÚ, stanice')+' '+s.n+(D.ukazka?' · '+T('ukázková data'):'')+'"><span class="kv-dot" style="background:'+S.c+'"></span><span class="kv-l">'+T('Vltava dnes')+'</span><b class="kv-q">'+f(s.q)+' m³/s</b><span class="kv-tr">'+TR[s.tr+1]+' '+TRT[s.tr+1]+'</span><span class="kv-s">'+S.t+'</span>'+(s.t!=null?'<span class="kv-t">'+T('voda')+' '+f(s.t)+' °C</span>':'')+'<span class="kv-c">'+s.n+' · '+D.cas+'</span></div>'}
function karta(){var D=data(),s=D.st[0],S=stav(s.q);
  return '<div class="kv-k kv-'+S.k+'"><div class="kv-kh"><span class="kv-dot" style="background:'+S.c+'"></span><b>'+S.t+'</b><span class="kv-c">'+T('aktualizováno')+' '+D.cas+(D.ukazka?' · '+T('ukázková data'):'')+'</span></div><div class="kv-kb">'+D.st.map(function(x){return '<div><span>'+x.n+'</span><b>'+f(x.q)+' m³/s</b><small>'+x.h+' cm · '+TR[x.tr+1]+' '+TRT[x.tr+1]+(x.t!=null?' · '+f(x.t)+' °C':'')+'</small></div>'}).join('')+'<div class="kv-kg"><span>'+T('Posledních 7 dní')+'</span>'+spark(D.hist,150,34)+'</div></div><div class="kv-kz">'+T('Zdroj: ČHMÚ, operativní neověřená data')+'</div></div>'}
function bublina(){var D=data(),s=D.st[0],S=stav(s.q);
  return '<div class="kv-bub kv-'+S.k+'" title="'+T('Zdroj: ČHMÚ, stanice')+' '+s.n+' · '+D.cas+(D.ukazka?' · '+T('ukázková data'):'')+'"><span class="kv-ic" style="background:'+S.c+'"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg></span><span class="kv-bt"><small>'+T('Vltava dnes')+'</small><b>'+f(s.q)+' m³/s <i>'+TR[s.tr+1]+'</i></b><em style="color:'+S.c+'">'+S.t+'</em></span>'+(s.t!=null?'<span class="kv-bw"><b>'+Math.round(s.t)+'°</b><small>'+T('voda')+'</small></span>':'')+'</div>'}
window.KKV={bublina:bublina,data:data,stav:stav,prahy:prahy,pruh:pruh,karta:karta};
function web(){var e=document.getElementById('vodaHero');if(e)e.innerHTML=pruh('kv-hero');var m=document.getElementById('vodaMapa');if(m){m.innerHTML=bublina();var pos=function(){var c=document.querySelector('#rmap #stops .stop circle'),w=m.parentNode;if(!c||!w)return;var r=c.getBoundingClientRect(),q=w.getBoundingClientRect();if(!r.width)return;m.style.left=(r.left+r.width/2-q.left)+'px';m.style.top=(r.top-q.top)+'px';m.classList.add('on')};pos();setTimeout(pos,400);setTimeout(pos,1500);addEventListener('resize',pos);addEventListener('load',pos)}var v=document.getElementById('vodaSek');if(v)v.innerHTML=karta()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',web);else web();
})();
