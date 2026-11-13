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
 /* služby v kempu – jen text do ceníku na webu, nepočítají se */
 sluzby:[{n:'Sprcha na mince',t:'20 Kč / 4 min'},{n:'Úschovna bagáže',t:'50 Kč / batoh'},{n:'Parkování autobusu',t:'500 Kč / den – zdarma, pokud cestující bydlí v kempu'},{n:'Školní kurzy',t:'200 Kč / osoba'}]};
/* starší uložený ceník doplní o nové vlastnosti z výchozího */
function doplň(u){
  if(!u.sluzby){var st=u.polozky.filter(function(p){return p.kat==='sluzby'});u.sluzby=st.length?st.filter(function(p){return p.k!=='poplatek'&&p.skryt!==1}).map(function(p){return{n:p.n,t:(p.a||0)+' Kč'+(p.jed?' / '+p.jed:'')+(p.pozn?' – '+p.pozn:'')}}):JSON.parse(JSON.stringify(VYCHOZI.sluzby));
    var pp=st.filter(function(p){return p.k==='poplatek'})[0],os=u.polozky.filter(function(p){return p.k==='os'})[0];if(os&&!os.pozn)os.pozn='včetně místního poplatku '+(pp?pp.a:50)+' Kč'}
  u.kategorie=JSON.parse(JSON.stringify(VYCHOZI.kategorie));u.polozky=u.polozky.filter(function(p){return u.kategorie[p.kat]});return u}
function nacti(){
  if(window.KK_CENIK_DATA)return doplň(window.KK_CENIK_DATA);
  try{var u=JSON.parse(localStorage.getItem('kk.cenik')||'null');if(u&&u.verze===1&&u.polozky)return doplň(u)}catch(e){}
  return JSON.parse(JSON.stringify(VYCHOZI));
}
var C=nacti();
var HZ=C.sezona.hlavniZap!==false;
var mapa={};C.polozky.forEach(function(p){mapa[p.k]=p});
var fmt=function(n){return Math.round(n).toLocaleString('cs-CZ').replace(/\s/g,' ')};
var KKC=window.KKC={
  data:C,vychozi:VYCHOZI,fmt:fmt,doplň:doplň,
  p:function(k){return mapa[k]},
  /* cena jako číslo: mode a | b | min */
  jednaCena:!HZ,celorocne:C.sezona.celorocne===true,
  v:function(k,mode){var p=mapa[k];if(!p)return 0;var a=+p.a||0,b=p.b==null||!HZ?a:+p.b;return mode==='b'?b:mode==='min'?Math.min(a,b):a},
  /* text: „890 Kč“, „od 890 Kč“ (jen když se ceny liší) */
  t:function(k,mode){var p=mapa[k];if(!p)return '';var a=KKC.v(k,'a'),b=KKC.v(k,'b');if(mode==='od')return (a!==b?'od ':'')+fmt(Math.min(a,b))+' Kč';return fmt(KKC.v(k,mode))+' Kč'},
  kat:function(kat){return C.polozky.filter(function(p){return p.kat===kat})},
  minUbyt:function(){var v=KKC.kat('ubytovani').filter(function(p){return p.rez!==0}).map(function(p){return KKC.v(p.k,'min')});return v.length?Math.min.apply(null,v):0},
  sleva:function(n){var s=0;(C.slevy||[]).forEach(function(x){if(n>=x.noci&&x.proc>s)s=x.proc});return s/100},
  slevyText:function(){return (C.slevy||[]).slice().sort(function(a,b){return a.noci-b.noci}).map(function(x,i,arr){return (i===arr.length-1&&arr.length>1?x.noci+'+ nocí':x.noci+' '+(x.noci<5?'noci':'nocí'))+' −'+x.proc+' %'}).join(', ')},
  hlavni:function(m){return HZ&&m+1>=C.sezona.hlavniOd&&m+1<=C.sezona.hlavniDo},
  mesic:['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec']
};

/* ---- 1) všechny ceny v HTML: data-c="klic:mode" (mode a | b | od | min-ubyt) ---- */
var CIS=/(od[\s\u00a0]+)?\d{1,3}(?:[ \u00a0]\d{3})*(?!\d)/;
function prepis(el,text){
  var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),n;
  while((n=w.nextNode())){if(CIS.test(n.nodeValue)){n.nodeValue=n.nodeValue.replace(CIS,text);return}}
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
    pol.forEach(function(p){var pozn=p.pozn;if(p.luzka)pozn=(pozn?pozn+', ':'')+'kapacita '+p.luzka;
      h+='<tr><td>'+esc(p.n)+(pozn?' <small>'+esc(pozn)+'</small>':'')+'</td>'+(HZ?'<td>'+KKC.t(p.k,'a')+'</td><td>'+KKC.t(p.k,'b')+'</td>':'<td colspan="2">'+KKC.t(p.k,'a')+'</td>')+'</tr>'});
  });
  var sl=C.sluzby||[];
  if(sl.length){h+='<tr class="ck-kat"><th colspan="3" scope="colgroup">Služby v kempu</th></tr>';sl.forEach(function(p){if(p.n)h+='<tr><td>'+esc(p.n)+'</td><td colspan="2">'+esc(p.t)+'</td></tr>'})}
  tb.innerHTML=h;
  var ths=document.querySelectorAll('#rzPrice thead th');if(!HZ&&ths.length===3){ths[1].colSpan=2;ths[1].innerHTML='Cena';ths[1].removeAttribute('data-t');ths[2].remove()}
  var th=HZ&&document.querySelector('#rzPrice thead th small');if(th)th.textContent=KKC.mesic[C.sezona.hlavniOd-1]+'–'+KKC.mesic[C.sezona.hlavniDo-1];
  var no=document.querySelector('#rzPrice .note');if(no)no.textContent='Ceny za noc.'+((C.slevy||[]).length?' Sleva: '+KKC.slevyText()+'.':'');
}
var dh=document.querySelector('.rz-disc-hint');if(dh)dh.textContent=(C.slevy||[]).length?'Sleva: '+KKC.slevyText():'';
})();
