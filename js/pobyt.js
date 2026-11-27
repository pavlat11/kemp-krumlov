/* Kemp Krumlov – Ubytování a výpočty: karty ubytování, rezervace s kalkulačkou, doprava osob.
   Spojeno z: ubytovani.js, rezervace.js, ubytovani-cenik.js, doprava.js, ubytovani-panely.js */

/* ===== ubytovani.js ===== */
(function(){
var sec=document.getElementById('ubytovani');if(!sec)return;
var cards=sec.querySelectorAll('.ub-card');
if('IntersectionObserver' in window){
 sec.classList.add('ub-js');
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.15});
 cards.forEach(function(c){io.observe(c)});
}
/* "Spočítat cenu" na kartě rovnou předvybere typ v kalkulačce */
sec.querySelectorAll('.ub-cta[data-kc]').forEach(function(a){
 a.addEventListener('click',function(){
  var name=a.getAttribute('data-kc');
  document.querySelectorAll('#kcTypes .kc-t').forEach(function(b){
   var t=b.querySelector('b');if(t&&t.textContent.trim()===name)b.click();
  });
 });
});
})();
;

/* ===== rezervace.js ===== */
(()=>{
const root=document.getElementById('rezervace');if(!root)return;
const form=document.getElementById('rzForm');
const $=id=>document.getElementById(id);
const SV=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICO={
 stan:'<path d="M3 20 12 6l9 14zM12 6v14"/>',karavan:'<rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 11h3l2 3v3h-5"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
 chatka:'<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5"/>',teepee:'<path d="M12 3 5 21h14zM10 3l2 3 2-3M10 21l2-5 2 5"/>',
 podsad:'<path d="M3 19 12 6l9 13M2 21h20M9 19l3-5 3 5"/>',
 dosp:'<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',dite:'<circle cx="12" cy="9" r="3"/><path d="M7 21v-2a5 5 0 0 1 10 0v2"/>',
 zak:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
 auto:'<path d="M5 17h14v-5l-2-5H7l-2 5zM5 12h14"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/>',
 moto:'<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-7h4l4 7M14 10l-2-3h-2"/>',
 elek:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',pes:'<circle cx="5" cy="9" r="1.6"/><circle cx="9.5" cy="5.5" r="1.6"/><circle cx="14.5" cy="5.5" r="1.6"/><circle cx="19" cy="9" r="1.6"/><path d="M12 11c-3 0-6 4-6 7 0 2 2 2.5 3 2l3-1 3 1c1 .5 3 0 3-2 0-3-3-7-6-7z"/>'
};
/* ceník [sezóna (červen–srpen), mimo sezónu] – stejný jako dosud */
/* ceny z ceníku (js/cenik.js) – [sezóna, mimo sezónu] */
const KC=window.KKC;const P={};KC.data.polozky.forEach(p=>{P[p.k]=[KC.v(p.k,'a'),KC.v(p.k,'b')]});
const prOd=k=>{const a=KC.v(k,'a'),b=KC.v(k,'b');return (a!==b?'od ':'')+'<strong>'+KC.fmt(Math.min(a,b))+' Kč</strong>'};
const BT=[
 {k:'stan',n:'Vlastní stan',c:'#4f9a58',bd:'Dostatek míst',bc:'gr',pr:'od <strong>190 Kč</strong>',s:'místo na louce u řeky',img:'img/stan-640.webp',per:'za místo',bed:'vlastní spaní'},
 {k:'karavan',n:'Karavan',c:'#55606b',bd:'Volejte předem',bc:'call',pr:'od <strong>300 Kč</strong>',s:'místo u řeky, elektřina za příplatek',img:'img/karavan-640.webp',per:'za místo',bed:'vlastní spaní'},
 {k:'chatka',n:'Chatka',c:'#b6513e',bd:'Omezená kapacita',pr:'od <strong>890 Kč</strong>',s:'lůžkoviny, terasa',cap:7,img:'img/chatka_nova-640.webp',per:'za noc',bed:'7 lůžek'},
 {k:'teepee',n:'Teepee',c:'#d58a2c',bd:'Omezená kapacita',pr:'od <strong>700 Kč</strong>',s:'zážitek pro rodiny s dětmi',cap:4,img:'img/teepee-640.webp',per:'za noc',bed:'4 lůžka'},
 {k:'podsad',n:'Podsadový stan',c:'#2a7c86',bd:'Omezená kapacita',pr:'<strong>300 Kč</strong>',s:'už postavený, stačí přijet',cap:2,img:'img/podsadovy-640.webp',per:'za noc',bed:'2 lůžka'}];
const TYPES=KC.kat('ubytovani').filter(p=>p.rez!==0&&p.skryt!==1).map(p=>{const b=BT.find(x=>x.k===p.k)||{k:p.k,n:p.n,c:'#6b766f',bd:p.luzka?'Omezená kapacita':'',s:p.pozn||'',img:'img/kemp_reprezentativni-640.webp',per:'za noc'};
 return Object.assign({},b,{minOs:+p.minOs||0,pr:prOd(p.k),cap:p.luzka||undefined,bed:p.luzka?p.luzka+' '+(p.luzka<5?'lůžka':'lůžek'):(b.bed||'vlastní spaní'),s:b.k===p.k&&BT.some(x=>x.k===p.k)?b.s:(p.pozn||'')})});
const UNIT0={stan:['Počet stanů','stan','stany','stanů'],karavan:['Počet karavanů','karavan','karavany','karavanů'],chatka:['Počet chatek','chatka','chatky','chatek'],teepee:['Počet teepee','teepee','teepee','teepee'],podsad:['Počet podsadových stanů','podsadový stan','podsadové stany','podsadových stanů']};
const UNIT=Object.assign({},UNIT0);TYPES.forEach(t=>{if(!UNIT[t.k]){const n=KL.male(KL.t(t.n));UNIT[t.k]=['Počet',n,n,n]}});
const EXTRAS=(window.KKR&&KKR.doplnkyZap&&!KKR.doplnkyZap()?[]:KC.kat('doplnky')).filter(p=>p.rez!==0&&p.skryt!==1).map(p=>({k:p.k,n:p.n,pro:(p.pro||[]).filter(k=>TYPES.some(t=>t.k===k)),s:KC.t(p.k,'a')+(p.pozn?' / '+p.pozn.replace(/^za /,''):' / noc')}));
EXTRAS.forEach(x=>{if(!ICO[x.k])ICO[x.k]='<path d="M12 5v14M5 12h14"/>'});
const PEOPLE=[{k:'dosp',n:'Dospělí',s:'od 15 let',min:0},{k:'dite',n:'Děti',s:'do 15 let',min:0},{k:'zak',n:'Žáci a studenti',s:'zvýhodněně jen ve vlastním stanu',min:0}].filter(x=>x.k==='dosp'||!(KC.p(x.k)||{}).skryt);
/* přejmenované osoby v ceníku: název a popis z ceníku */
const OS_VYCH={dosp:['os','Osoba'],dite:['dite','Dítě'],zak:['zak','Žák ve stanu']};PEOPLE.forEach(x=>{const v=OS_VYCH[x.k],p=v&&KC.p(v[0]);if(p&&p.n&&p.n!==v[1]){x.n=p.n;x.s=p.pozn||'';x.jm=1}});
/* vlastní typy osob z ceníku (např. senior, ZTP) */
const OS_VLASTNI=KC.kat('osoby').filter(p=>!['os','dite','zak'].includes(p.k)&&p.skryt!==1);
OS_VLASTNI.forEach(p=>{PEOPLE.push({k:p.k,n:p.n,s:p.pozn||'',min:0,vl:1});if(!ICO[p.k])ICO[p.k]=ICO.dosp});
const S={type:(TYPES[0]||{}).k,q:{},c:{},dosp:1,dite:0,zak:0,units:1,from:null,to:null};OS_VLASTNI.forEach(p=>S[p.k]=0);TYPES.forEach(t=>S.q[t.k]=0);EXTRAS.forEach(x=>S[x.k]=0);
S.l={kusy:{},den:'',dni:1,odkud:'',kam:'kemp',dopr:null,cas:'9:00',vz:null,vcas:'16:00'};S.mod=null;S.d0=null;S.nc=false;S.pr=null;S.ou=null;S.l.chci=false;S.dvM='';S.dvD='';   // mod: 'uby' | 'lod' (čím host začal), d0: den vyplutí, np/nz: noc před / po plavbě
const fmt=n=>Math.round(n).toLocaleString('cs-CZ')+'\u00a0Kč';
const KL=window.KKL||{jazyk:'cs',t:x=>x,pl:(n,a,b,c)=>n===1?a:n>=2&&n<=4?b:c,male:x=>x.toLowerCase(),loc:'cs-CZ'};
const plural=(n,a,b,c)=>KL.pl(n,a,b,c);
const T=()=>TYPES.find(t=>t.k===S.type);
const persons=()=>S.dosp+S.dite+S.zak+OS_VLASTNI.reduce((a,p)=>a+(S[p.k]||0),0);
const minUnits=()=>{const t=T();return t.cap?Math.max(1,Math.ceil(persons()/t.cap)):1};
const fitUnits=()=>{};
const SEL=()=>TYPES.filter(t=>S.q[t.k]>0);
const ownBed=()=>S.q.stan>0||S.q.karavan>0;
const beds=()=>TYPES.reduce((a,t)=>a+(t.cap?t.cap*S.q[t.k]:0),0);
const bedsOk=()=>ownBed()||beds()>=persons();
const onlyStan=()=>S.q.stan>0&&SEL().length===1;
const pop=el=>{el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop')};

/* ---------- datumy ---------- */
const D=(y,m,d)=>new Date(y,m,d,12);
const addD=(d,n)=>D(d.getFullYear(),d.getMonth(),d.getDate()+n);
const same=(a,b)=>a&&b&&a.getTime()===b.getTime();
const iso=d=>d?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';
const now=new Date(),TODAY=D(now.getFullYear(),now.getMonth(),now.getDate());
const SZ=KC.data.sezona,md=(s)=>s.split('-').map(Number),[OM,OD]=md(SZ.otevrenoOd),[CM,CD]=md(SZ.otevrenoDo);
const CELOROK=KC.celorocne;
const openNight=d=>{if(CELOROK)return true;const v=(d.getMonth()+1)*100+d.getDate();return v>=OM*100+OD&&v<CM*100+CD};   // poslední noc je den před koncem sezóny
const endOf=y=>CELOROK?D(y+1,0,31):D(y,CM-1,CD);
const isHi=d=>KC.hlavni(d.getMonth());
/* OBSAZENOST: sem se napojí rezervační systém. Formát: {chatka:['2027-07-18',…], teepee:[…]} = obsazené noci */
const BUSY={};
function nactiBusy(){Object.keys(BUSY).forEach(k=>delete BUSY[k]);[window.RZ_OBSAZENO||{},window.KKR?KKR.obsazeno():{}].forEach(o=>Object.keys(o).forEach(k=>{BUSY[k]=(BUSY[k]||[]).concat(o[k])}));
 if(BUSY['teepee-1'])BUSY.teepee=(BUSY.teepee||[]).concat(BUSY['teepee-1']);root.classList.toggle('has-busy',Object.values(BUSY).some(a=>a&&a.length))}
nactiBusy();
const isBusyK=(k,d)=>(BUSY[k]||[]).includes(iso(d));
/* KONKRÉTNÍ MÍSTA: chatky a podsadové stany mají čísla, host si vybere které. Obsazenost jednoho místa: RZ_OBSAZENO['chatka-4']=[noci]
   Rozložení (skupiny podle polohy v kempu) jde přepsat v ceníku: KKC.data.mista={chatka:[['Název skupiny',od,do,'sloupec'] (od>do = čísla pozpátku),…]} – skupiny se stejným sloupcem jsou pod sebou */
const MISTA=Object.assign({chatka:[['Vlevo',20,11,'vlevo'],['Vpravo nahoře',1,5,'vpravo'],['Vpravo dole',6,10,'vpravo']],podsad:[['Řada 1–11',1,11]]},KC.data.mista||{});
const CNT={};Object.keys(MISTA).forEach(k=>{CNT[k]=MISTA[k].reduce((a,g)=>Math.max(a,g[1],g[2]),0);S.c[k]=[]});
const MAXQ=Object.assign({teepee:1},CNT);
const isBusyU=(k,n,d)=>isBusyK(k,d)||(BUSY[k+'-'+n]||[]).includes(iso(d));
const VYP=()=>window.KKR&&KKR.vyp?KKR.vyp():[];
/* noci, které host u lodí vynechal (mezera mezi nocí před a po plavbě) */
const gap=d=>S.mod==='lod'&&S.nc&&!!S.ns&&S.ns.size>0&&!S.ns.has(iso(d));
const freeU=(k,n)=>{if(VYP().includes(k+'-'+n))return false;if(!S.from||!S.to)return true;for(let d=S.from;d<S.to;d=addD(d,1))if(!gap(d)&&isBusyU(k,n,d))return false;return true};
const isBusy=d=>SEL().some(t=>MISTA[t.k]?S.c[t.k].some(n=>isBusyU(t.k,n,d)):isBusyK(t.k,d));
const freeK=k=>{if(MISTA[k]){for(let n=1;n<=CNT[k];n++)if(freeU(k,n))return true;return false}if(VYP().includes(k+'-1'))return false;if(!S.from||!S.to)return true;for(let d=S.from;d<S.to;d=addD(d,1))if(!gap(d)&&isBusyK(k,d))return false;return true};
const cis=k=>MISTA[k]&&S.c[k].length?' ('+KL.t('č.')+' '+S.c[k].join(', ')+')':'';
function setCount(k,v){const c=S.c[k];while(c.length>v)c.pop();for(let n=1;c.length<v&&n<=CNT[k];n++)if(!c.includes(n)&&freeU(k,n))c.push(n);c.sort((a,b)=>a-b);S.q[k]=c.length;return c.length>=v}
const rangeFree=(a,b)=>{for(let d=a;d<b;d=addD(d,1))if(isBusy(d))return false;return true};
const canArrive=d=>d>=TODAY&&openNight(d)&&!isBusy(d);
const canDepart=d=>!!S.from&&d>S.from&&d<=endOf(S.from.getFullYear())&&rangeFree(S.from,d);
const WD=KL.den?[0,1,2,3,4,5,6].map(i=>KL.den(i)):['ne','po','út','st','čt','pá','so'],MN=KL.mesic?[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>KL.mesic(i)):['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
const fD=d=>KL.datum?KL.datum(d):d?`${WD[d.getDay()]} ${d.getDate()}. ${d.getMonth()+1}.`:'–';
const fDY=d=>d?`${d.getDate()}. ${d.getMonth()+1}. ${d.getFullYear()}`:'–';
let START;(()=>{const y=TODAY.getFullYear();let a;
 if(TODAY<D(y,OM-1,OD))a=D(y,SZ.hlavniOd-1,10);else if(TODAY>=addD(endOf(y),-3))a=D(y+1,SZ.hlavniOd-1,10);else a=addD(TODAY,7);
 START=a})();
const nightsList=()=>{const out=[];if(!S.from||!S.to)return out;for(let d=S.from;d<S.to&&out.length<120;d=addD(d,1))if(!gap(d))out.push(d);return out};

/* ---------- kalendář ---------- */
const cal=$('rzCal');let view=D(START.getFullYear(),START.getMonth(),1),hover=null;
const minView=D(TODAY.getFullYear(),TODAY.getMonth(),1);
function month(m){const y=m.getFullYear(),mo=m.getMonth(),first=D(y,mo,1),len=new Date(y,mo+1,0).getDate(),off=(first.getDay()+6)%7;
 let h=`<div class="rz-m"><h3 class="rz-mh">${MN[mo]} ${y}</h3><div class="rz-wd">${[1,2,3,4,5,6,0].map(i=>`<span>${WD[i]}</span>`).join('')}</div><div class="rz-days">`;
 for(let i=0;i<off;i++)h+='<i></i>';
 for(let d=1;d<=len;d++){const x=D(y,mo,d);h+=`<button type="button" class="rz-d" data-d="${iso(x)}"><span>${d}</span></button>`}
 return h+'</div></div>'}
function drawCal(){cal.innerHTML=`<button type="button" class="rz-calnav p" aria-label="${KL.t('Předchozí měsíc')}"><svg class="chv" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5 9 12l6 7"/></svg></button><button type="button" class="rz-calnav n" aria-label="${KL.t('Další měsíc')}"><svg class="chv" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 6 7-6 7"/></svg></button>`+month(view)+month(D(view.getFullYear(),view.getMonth()+1,1));
 cal.querySelector('.p').disabled=view<=minView;paintCal()}
function paintCal(){const pending=S.from&&!S.to;
 cal.querySelectorAll('.rz-d').forEach(b=>{const [y,m,d]=b.dataset.d.split('-').map(Number),x=D(y,m-1,d);
  const ok=pending?(canDepart(x)||canArrive(x)):canArrive(x);
  b.disabled=!ok;b.classList.toggle('closed',!openNight(x)&&!(pending&&canDepart(x)));
  b.classList.toggle('hi',isHi(x));b.classList.toggle('busy',openNight(x)&&isBusy(x));b.classList.toggle('today',same(x,TODAY));
  b.classList.toggle('from',same(x,S.from));b.classList.toggle('to',same(x,S.to));
  b.classList.toggle('in',!!(S.from&&S.to&&x>S.from&&x<S.to));
  if(S.mod==='lod'&&S.d0){const la=addD(S.d0,S.l.dni-1);b.classList.toggle('from',same(x,S.d0));b.classList.toggle('to',S.l.dni>1&&same(x,la));b.classList.toggle('in',x>S.d0&&x<la);b.classList.toggle('pv',!!(S.lp&&hover&&x>S.d0&&x<=hover&&(hover-S.d0)/864e5<14))}else
 
  b.classList.toggle('pv',!!(pending&&hover&&canDepart(hover)&&x>S.from&&x<=hover));
  b.setAttribute('aria-pressed',String(!!(same(x,S.from)||same(x,S.to))));
  b.setAttribute('aria-label',(KL.jazyk==='cs'?`${WD[x.getDay()]} ${d}. ${m}. ${y}`:x.toLocaleDateString(KL.loc,{weekday:'long',day:'numeric',month:'long',year:'numeric'}))+(!openNight(x)?' – '+KL.t('zavřeno'):''))})}
cal.addEventListener('click',e=>{
 const nav=e.target.closest('.rz-calnav');
 if(nav){view=D(view.getFullYear(),view.getMonth()+(nav.classList.contains('n')?1:-1),1);if(view<minView)view=minView;drawCal();return}
 const b=e.target.closest('.rz-d');if(!b||b.disabled)return;
 const [y,m,d]=b.dataset.d.split('-').map(Number),x=D(y,m-1,d);
 if(S.mod==='lod'){const df=S.d0?Math.round((x-S.d0)/864e5):-1;if(S.d0&&S.lp&&df>=0&&df<14){S.l.dni=df+1;S.lp=false}else{S.d0=x;S.l.dni=1;S.lp=true}S.from=S.d0;S.to=S.d0;hover=null;render();return}
 if(S.from&&!S.to&&canDepart(x))S.to=x;else{S.from=x;S.to=null}
 hover=null;render()});
cal.addEventListener('mouseover',e=>{const b=e.target.closest('.rz-d');if(!b||!(S.mod==='lod'?S.d0&&S.lp:S.from&&!S.to))return;const [y,m,d]=b.dataset.d.split('-').map(Number);hover=D(y,m-1,d);paintCal()});
cal.addEventListener('mouseleave',()=>{if(hover){hover=null;paintCal()}});
$('rzQuick').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(S.mod==='lod'){if(!S.d0){warn(KL.t('Nejdřív klikněte v kalendáři na den vyplutí.'));return}S.l.dni=+b.dataset.n;S.lp=false;render();return}if(!S.from){warn(KL.t('Nejdřív klikněte v kalendáři na den příjezdu.'));return}const t=addD(S.from,+b.dataset.n);
 const lim=endOf(S.from.getFullYear()),tt=t>lim?lim:t;if(!rangeFree(S.from,tt)){warn(KL.t('V tomto rozsahu je některá noc obsazená.'));return}S.to=tt;render();
 if(t>lim)warn(KL.t('Kemp zavírá 1. 10., odjezd jsme posunuli na poslední možný den.'))});

/* ---------- osoby ---------- */
function stepper(get,set,min,max){const w=document.createElement('div');w.className='rz-st';
 w.innerHTML='<button type="button" aria-label="'+KL.t('Méně')+'"><i class="sg sg-m" aria-hidden="true"></i></button><output>0</output><button type="button" aria-label="'+KL.t('Více')+'"><i class="sg sg-p" aria-hidden="true"></i></button>';
 const [m,o,p]=w.children;
 m.addEventListener('click',e=>{e.stopPropagation();set(Math.max(min(),get()-1));render();pop(o)});
 p.addEventListener('click',e=>{e.stopPropagation();set(Math.min(max,get()+1));render();pop(o)});
 w.upd=()=>{o.textContent=get();m.disabled=get()<=min();p.disabled=get()>=max};return w}
PEOPLE.forEach(r=>{const c=document.createElement('div');c.className='rz-pc';
 const pro=((KC.p(r.k)||{}).pro||[]).filter(k=>TYPES.some(t=>t.k===k)),jen='';
 c.innerHTML=`<span class="ic">${SV(ICO[r.k])}</span><span class="tx"><b>${r.n}</b><small>${r.s}</small>${jen}</span>`;
 r.st=stepper(()=>S[r.k],v=>{S[r.k]=v;fitUnits()},()=>r.min,30);c.append(r.st);r.el=c;$('rzPeople').append(c)});

/* ---------- ubytování ---------- */
TYPES.forEach(t=>{const b=document.createElement('div');b.className='rz-row';b.style.setProperty('--c',t.c);
 b.innerHTML=`<span class="ph" data-bg="${t.img}"><i class="n"></i></span><span class="tx"><b>${t.n}</b><small>${t.s}</small><span class="tg"><em>${t.bed}</em><em class="bd ${t.bc||''}" data-bd>${t.bd}</em>${t.minOs?`<em class="bd mo">${KL.t('jen pro skupiny od')} ${t.minOs} ${KL.t('osob')}</em>`:''}</span></span><span class="rt"><span class="pr">${KL.t(t.per+' + osoby')}<strong>${t.pr.replace(/<\/?strong>/g,'')}</strong></span></span>`;
 const st=stepper(()=>S.q[t.k],v=>{if(v>S.q[t.k]&&t.minOs&&persons()<t.minOs){warn(KL.t(t.n)+': '+KL.t('rezervace jen pro skupiny od')+' '+t.minOs+' '+KL.t('osob')+'.');return}if(v>S.q[t.k]&&!freeK(t.k)){warn(KL.t(t.n)+' '+KL.t('je ve vybraném termínu obsazená, zkuste jiné ubytování.'));return}if(MISTA[t.k]){if(!setCount(t.k,v))warn(KL.t('Více volných míst tohoto typu ve vašem termínu nemáme.'));t.open=true}else S.q[t.k]=v;if(t.k==='karavan'&&v&&('elek' in S)&&!S.elek)S.elek=1},()=>0,MAXQ[t.k]||20);b.querySelector('.rt').append(st);t.st=st;
 $('rzTypes').append(b);t.el=b});
/* typy, které se nerezervují – jen informace */
{const NR=KC.kat('ubytovani').filter(p=>p.rez===0&&p.skryt!==1);if(NR.length){const d=document.createElement('p');d.className='rz-norez';d.innerHTML='<b>'+KL.t('Bez rezervace – stačí přijet:')+'</b> '+NR.map(p=>KL.t(p.n)).join(', ');$('rzTypes').after(d)}}
/* výběr konkrétního čísla chatky / stanu */
TYPES.forEach(t=>{if(!MISTA[t.k])return;const b=t.el,ch=t.k==='chatka';b.classList.add('has-pick');
 const tg=document.createElement('button');tg.type='button';tg.className='rz-pick-t';tg.setAttribute('aria-expanded','false');b.querySelector('.tx').append(tg);t.tg=tg;
 const p=document.createElement('div');p.className='rz-pick';p.hidden=true;
 p.innerHTML=`<div class="rz-pick-h"><b>${KL.t(ch?'Vyberte si číslo chatky':'Vyberte si číslo stanu')}</b><small>${KL.t('Přeškrtnutá čísla jsou ve vašem termínu obsazená.')}</small></div><div class="rz-pick-g">`+
  (()=>{const cols=[];MISTA[t.k].forEach((g,i)=>{const id=g[3]||i;let c=cols.find(x=>x.id===id);if(!c)cols.push(c={id,g:[],w:0});c.g.push(g);c.w=Math.max(c.w,Math.abs(g[2]-g[1])+1)});
   return cols.map(c=>`<div class="rz-pick-c" style="--n:${c.w}">`+c.g.map(g=>{let h='';const st=g[2]>=g[1]?1:-1;for(let n=g[1];st>0?n<=g[2]:n>=g[2];n+=st)h+=`<button type="button" class="rz-cn" data-n="${n}" aria-pressed="false">${n}</button>`;return `<div class="rz-pick-s" style="--n:${Math.abs(g[2]-g[1])+1}"><span>${KL.t(g[0])}</span><div>${h}</div></div>`}).join('')+'</div>').join('')})()+'</div>';
 p.addEventListener('click',e=>{e.stopPropagation();const x=e.target.closest('.rz-cn');if(!x||x.disabled)return;const n=+x.dataset.n,c=S.c[t.k],i=c.indexOf(n);if(i>=0)c.splice(i,1);else c.push(n);c.sort((a,z)=>a-z);S.q[t.k]=c.length;render()});
 b.append(p);t.pick=p;t.cns=[...p.querySelectorAll('.rz-cn')];
 b.addEventListener('click',e=>{if(e.target.closest('.rz-st,.rz-pick'))return;t.open=!t.open;render()})});
function setType(k){const t=TYPES.find(x=>x.k===k);if(!t||t.minOs&&persons()<t.minOs)return;TYPES.forEach(x=>{S.q[x.k]=0;if(S.c[x.k])S.c[x.k]=[]});const q=Math.min(MAXQ[k]||20,t.cap?Math.max(1,Math.ceil(persons()/t.cap)):1);if(MISTA[k]){setCount(k,q);t.open=true}else S.q[k]=q;if(k==='karavan'&&('elek' in S)&&!S.elek)S.elek=1;render()}
const uWrap=$('rzUnits');uWrap.hidden=true;

/* ---------- doplňky ---------- */
EXTRAS.forEach(x=>{const c=document.createElement('div');c.className='rz-x';c.tabIndex=0;c.setAttribute('role','checkbox');
 c.innerHTML=`<span class="tg"></span><span class="ic">${SV(ICO[x.k])}</span><b>${x.n}</b><small>${x.s}</small>`;
 x.st=stepper(()=>S[x.k],v=>{S[x.k]=v},()=>1,9);c.append(x.st);
 const tog=()=>{if(c.classList.contains('ne'))return;S[x.k]=S[x.k]?0:1;render()};
 if(x.pro.length)c.title=KL.t('Jen k:')+' '+x.pro.map(k=>KL.t((TYPES.find(t=>t.k===k)||{}).n||k)).join(', ');
 c.addEventListener('click',e=>{if(e.target.closest('.rz-st'))return;tog()});
 c.addEventListener('keydown',e=>{if(e.target!==c)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();tog()}});
 x.el=c;$('rzExtras').append(c)});

/* ---------- lodě a doprava osob (půjčovna) ---------- */
const KR=window.KKR,LODE=(KR&&KR.lodeTypy?KR.lodeTypy():[]).map(p=>Object.assign({},p)),REKA=KR&&KR.mistaReky?KR.mistaReky():[];
LODE.forEach(p=>S.l.kusy[p.k]=0);S.l.odkud=(REKA[0]||{}).k||'';
const denMod=()=>!!(S.from&&S.to&&same(S.from,S.to));   // jen lodě, bez noclehu
const nLodi=()=>LODE.reduce((a,p)=>a+(S.l.kusy[p.k]||0),0);
const lodeObj=()=>nLodi()?{den:S.l.den,dni:S.l.dni,kusy:Object.fromEntries(LODE.filter(p=>S.l.kusy[p.k]>0).map(p=>[p.k,S.l.kusy[p.k]])),odkud:S.l.odkud,kam:S.l.kam}:null;
/* doprava osob: s loděmi na místo vyplutí, bez lodí kamkoli na řeku v den, který si host vybere */
/* místo po proudu pod kempem (Zlatá Koruna, Boršov): tam se na start neodváží – hosty v cíli vyzvedneme a odvezeme zpět do kempu */
const podKempem=k=>!!k&&k!=='kemp'&&rIdx(k)>rIdx('kemp');
const naDnes=()=>{const l=lodeObj(),a=S.from?iso(S.from):'',b=l&&l.den||'',od=[a,b].filter(Boolean).sort()[0];return !!od&&od<=iso(new Date())};
const doprObj=()=>{if(S.l.dopr!==true)return null;if(nLodi())return S.l.odkud!=='kemp'?{misto:S.l.odkud,osob:persons(),cas:S.l.cas,den:S.l.den}:null;return S.dvM&&S.dvD&&!podKempem(S.dvM)?{misto:S.dvM,osob:persons(),cas:S.l.cas,den:S.dvD}:null};
/* vyzvednutí v cíli: s loděmi tam, kde host končí mimo kemp (poslední den plavby); bez lodí místo pod kempem */
const vyzvObj=()=>{if(nLodi()){if(S.l.vz!==true||!S.l.kam||S.l.kam==='kemp')return null;const dn=KR.lodeDny(lodeObj());return {misto:S.l.kam,osob:persons(),cas:S.l.vcas,den:dn[dn.length-1]||S.l.den}}
 return S.l.dopr===true&&S.dvM&&S.dvD&&podKempem(S.dvM)?{misto:S.dvM,osob:persons(),cas:S.l.vcas,den:S.dvD}:null};
const stayDays=()=>{const o=[];if(!S.from||!S.to)return o;for(let d=S.from;d<=S.to&&o.length<60;d=addD(d,1))o.push(d);return o};
const lodDays=()=>{const o=[];if(S.mod==='lod')return S.d0?[S.d0]:o;if(!S.from||!S.to)return o;for(let d=S.from;d<=S.to&&o.length<60;d=addD(d,1))o.push(d);return o};
const lodMaxDni=()=>30; /* lodě si host může půjčit na libovolný počet dní, i mimo termín pobytu */
const lodFree=()=>KR&&S.l.den?KR.lodeVolno(S.l.den,S.l.dni):{};
const rIdx=k=>REKA.findIndex(x=>x.k===k);
function lodFix(){const a=lodDays();if(!a.length){S.l.den='';return}
 if(S.mod!=='lod'&&S.l.den&&S.l.den>=iso(new Date())){}else if(!a.some(d=>iso(d)===S.l.den))S.l.den=iso(a[denMod()?0:Math.min(1,a.length-1)]);
 S.l.dni=Math.max(1,Math.min(S.l.dni,lodMaxDni()));
 if(rIdx(S.l.odkud)<0)S.l.odkud=(REKA[0]||{}).k||'';if(rIdx(S.l.odkud)>=REKA.length-1)S.l.odkud=(REKA[REKA.length-2]||REKA[0]||{}).k;
 if(rIdx(S.l.kam)<=rIdx(S.l.odkud))S.l.kam=rIdx('kemp')>rIdx(S.l.odkud)?'kemp':REKA[rIdx(S.l.odkud)+1].k;
 const v=lodFree();LODE.forEach(p=>{if(S.l.kusy[p.k]>Math.max(0,v[p.k]||0))S.l.kusy[p.k]=Math.max(0,v[p.k]||0)})}
const lodW=$('rzLode');let lodOk=false;
if(lodW&&LODE.length&&REKA.length>1){lodOk=true;const t=x=>KL.t(x);
 const FA='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',nbK=(k,ico,nad,sl,body,od,kam,cta,cta1)=>`<button type="button" class="rz-nb v3 ${k}" data-nb="${k}" aria-pressed="false"><span class="rz-nb-t"><span class="tag">${k==='lod'?'★ ':''}${t(k==='lod'?'Nejoblíbenější':'Pohodlně')}</span><span class="ck3" aria-hidden="true">${FA}</span><span class="hd"><span class="ic">${ico}</span><span><b class="nd">${t(nad)}</b><small class="sl">${t(sl)}</small></span></span></span><span class="rt" aria-hidden="true"><i>${od}</i><span class="ln ${k}"></span><i>${kam}</i></span><span class="fr"><span class="pr" id="rzNbP-${k}"></span><span class="cn"><small>${t('od')}</small><b id="rzNbC-${k}"></b><i id="rzNbJ-${k}"></i></span></span><ul>${body.map(x=>`<li>${FA}${t(x)}</li>`).join('')}</ul><span class="cta"><span class="a0"><i aria-hidden="true">+</i>${t(cta)}</span><span class="a1">${FA}${t(cta1)} · <u>${t('odebrat')}</u></span></span></button>`;
 lodW.innerHTML=`<div class="rz-nab" id="rzNab">${nbK('lod','<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 28c6 7 32 7 38 0M10 28l5-11h18l5 11M24 17V8M24 8l7 4-7 3M6 40c3 2 6 2 9 0s6-2 9 0 6 2 9 0 6-2 9 0"/></svg>','Den na Vltavě','Ráno vás vyvezeme proti proudu a doplujete až ke stanu.',['Pádla, vesty a barel v ceně','Lodě vám přivezeme na start','Bez starostí s autem'],KL.t(KR.mistoN((REKA[0]||{}).k||'')),'⛺ '+KL.t('Kemp'),'Chci na vodu','Jedeme na vodu')}${nbK('dop','<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 32V14h24v18M28 20h9l7 8v4H28"/><circle cx="13" cy="34" r="4"/><circle cx="35" cy="34" r="4"/><path d="M9 20h6M19 20h4"/></svg>','Odvoz na start','Máte vlastní loď? Auto necháte v kempu, na řeku vás odvezeme my.',['Vyjedeme v čas, který si vyberete','Až 8 osob v jednom autě','Vyzvedneme vás i v cíli'],'⛺ '+KL.t('Kemp'),KL.t('kamkoli na řeku'),'Chci odvézt','Odvezete nás')}</div>
  <div class="rz-lod-l" id="rzLodL"></div><div class="rz-lod-o" id="rzLodO" hidden>
  <label class="rz-lf"><span>${t('Den vyplutí')}</span><input type="date" id="rzLden"></label>
  <label class="rz-lf"><span>${t('Vrácení lodí')}</span><input type="date" id="rzLvdo"><small class="rz-ldn" id="rzLvdoN"></small></label>
  <label class="rz-lf"><span>${t('Odkud poplujete')}</span><select id="rzLod"></select></label>
  <label class="rz-lf"><span>${t('Kde skončíte')}</span><select id="rzLkam"></select></label>
  <div class="rz-lod-i" id="rzLodI"></div></div>`;
 LODE.forEach(p=>{const c=document.createElement('div');c.className='rz-lod';
  c.innerHTML=`<span class="tx"><b>${KL.t(p.n)}</b><small>${p.pozn?KL.t(p.pozn):''}</small><em class="fr"></em></span><span class="pr"><strong>${KC.fmt(+p.a||0)} Kč</strong><small>${t('za den')}${p.b!=null&&+p.b!==+p.a?' · '+t('od 3 dnů')+' '+KC.fmt(+p.b)+' Kč':''}</small></span>`;
  p.st=stepper(()=>S.l.kusy[p.k],v=>{const b=S.l.kusy[p.k];if(v>b&&v>Math.max(0,lodFree()[p.k]||0)){warn(t('Víc lodí tohoto typu na tento den už nemáme.'));return}
   S.l.kusy[p.k]=v;if(v>b&&KR.lodeChybi(lodeObj()).length){S.l.kusy[p.k]=b;warn(t('Na tento den už nemáme dost pádel nebo vest. Zavolejte nám, zkusíme to vyřešit.'))}},()=>0,99);
  c.append(p.st);p.el=c;$('rzLodL').append(c)});
 $('rzLvdo').addEventListener('change',e=>{const a=(S.l.den||'').split('-'),b=(e.target.value||'').split('-');if(a.length===3&&b.length===3){const n=Math.round((new Date(+b[0],b[1]-1,+b[2])-new Date(+a[0],a[1]-1,+a[2]))/864e5)+1;S.l.dni=Math.max(1,Math.min(n||1,lodMaxDni()))}S.lp=false;render()});
 $('rzLden').addEventListener('change',e=>{const v=e.target.value,dn=iso(new Date());if(v)S.l.den=v<dn?dn:v;render()});
 $('rzLod').addEventListener('change',e=>{S.l.odkud=e.target.value;render()});
 $('rzLkam').addEventListener('change',e=>{S.l.kam=e.target.value;render()});
 $('rzNab').addEventListener('click',e=>{const b=e.target.closest('[data-nb]');if(!b)return;
  if(b.dataset.nb==='lod'){S.l.chci=!S.l.chci;if(!S.l.chci)LODE.forEach(p=>S.l.kusy[p.k]=0)}else S.l.dopr=S.l.dopr===true?false:true;render();
  if(b.dataset.nb==='lod'&&S.l.chci)dolu($('rzLodL'));else if(b.dataset.nb==='dop'&&S.l.dopr===true)dolu(SK.doprava)})
}
else if(lodW){lodW.innerHTML='<p class="rz-norez">'+KL.t('Lodě si domluvte telefonicky.')+'</p>'}
{const tx=(id,q)=>{const e=q?root.querySelector(q):$(id);if(e)e.textContent=KL.t(e.textContent.trim())};['rzLodH','rzLodS','rzSumLodT','rzVolH','rzVolS','rzDvH','rzDvS'].forEach(i=>tx(i));root.querySelectorAll('.rz-vc b,.rz-vc small,.rz-vc em').forEach(e=>{e.textContent=KL.t(e.textContent.trim())})}
const dvW=$('rzDopr');
if(dvW){const VAN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 16V7h12v9M14 10h4l4 4v2h-8"/><circle cx="6.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/></svg>',CAR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 17h14v-5l-2-5H7l-2 5zM5 12h14"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></svg>';
 const CASY=(a,b)=>{const o=[];for(let h=a;h<=b;h++){o.push(h+':00');if(h<b)o.push(h+':30')}return o};
 dvW.innerHTML=`<div id="rzDvA"><div class="rz-dv-tr" id="rzDvTr"></div><div class="rz-dv-o" role="radiogroup"><button type="button" class="rz-dv-c ano" role="radio" data-dv="1"><span class="ic">${VAN}</span><b>${KL.t('Ano, odvezte nás')}</b><small id="rzDvP"></small><em id="rzDvK"></em></button><button type="button" class="rz-dv-c ne" role="radio" data-dv="0"><span class="ic">${CAR}</span><b>${KL.t('Ne, dopravíme se sami')}</b><small>${KL.t('Na start přijedeme vlastním autem.')}</small><em>0 Kč</em></button></div>
 <div class="rz-dv-cas" id="rzDvC"><div class="rz-dv-kam" id="rzDvKam"><label class="rz-lf"><span>${KL.t('Kam vás odvezeme')}</span><select id="rzDvM"></select></label><label class="rz-lf"><span>${KL.t('Který den')}</span><select id="rzDvD"></select></label></div><b id="rzDvCasH">${KL.t('V kolik chcete vyrazit z kempu?')}</b><div id="rzDvCasA">${CASY(8,14).map(c=>`<button type="button" data-cas="${c}">${c}</button>`).join('')}</div><div id="rzDvCasZ" hidden>${CASY(11,19).map(c=>`<button type="button" data-vcas="${c}">${c}</button>`).join('')}</div></div><p class="rz-dv-n" id="rzDvN"></p></div>
 <div class="rz-dv-z" id="rzDvZ" hidden><div class="rz-dv-tr zp" id="rzDvZTr"></div><div class="rz-dv-o" role="radiogroup"><button type="button" class="rz-dv-c ano" role="radio" data-vz="1"><span class="ic">${VAN}</span><b>${KL.t('Ano, vyzvedněte nás v cíli')}</b><small id="rzDvZP"></small><em id="rzDvZK"></em></button><button type="button" class="rz-dv-c ne" role="radio" data-vz="0"><span class="ic">${CAR}</span><b>${KL.t('Ne, zpátky se dopravíme sami')}</b><small>${KL.t('Lodě v cíli převezmeme, odvoz lidí nechcete.')}</small><em>0 Kč</em></button></div>
 <div class="rz-dv-cas" id="rzDvZC" hidden><b>${KL.t('V kolik budete v cíli?')}</b><div>${CASY(11,19).map(c=>`<button type="button" data-vcas="${c}">${c}</button>`).join('')}</div></div><p class="rz-dv-n" id="rzDvZN"></p></div>`;
 dvW.addEventListener('change',e=>{if(e.target.id==='rzDvM')S.dvM=e.target.value;if(e.target.id==='rzDvD')S.dvD=e.target.value;render()});
 dvW.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.dv){S.l.dopr=b.dataset.dv==='1';render();if(S.l.dopr)dolu($('rzDvC'))}else if(b.dataset.vz){S.l.vz=b.dataset.vz==='1';render();if(S.l.vz)dolu($('rzDvZC'))}else if(b.dataset.cas){S.l.cas=b.dataset.cas;render()}else if(b.dataset.vcas){S.l.vcas=b.dataset.vcas;render()}})}
function dopRender(){if(!dvW||!lodOk)return;const sL=nLodi()>0,RK=REKA.filter(x=>x.k!=='kemp'),os=persons(),a=KR.aut(os),osT=`${os} ${plural(os,'osoba','osoby','osob')}`,autT=`${a} ${plural(a,'auto','auta','aut')} ${KL.t('pro')} ${osT}`;
 if(!sL){if(!RK.some(x=>x.k===S.dvM))S.dvM=(RK[0]||{}).k||'';const sd=stayDays();if(!sd.some(d=>iso(d)===S.dvD))S.dvD=sd.length?iso(sd[Math.min(1,sd.length-1)]):'';
  setOpts($('rzDvM'),RK.map(x=>`<option value="${x.k}">${KL.t(x.n)}${podKempem(x.k)?' ('+KL.t('vyzvednutí')+')':''} · ${fmt(x.cena*a)}</option>`).join(''));$('rzDvM').value=S.dvM;
  setOpts($('rzDvD'),sd.map(d=>`<option value="${iso(d)}">${fD(d)}</option>`).join(''));$('rzDvD').value=S.dvD}
 $('rzDvKam').hidden=sL;
 /* bez lodí a místo pod kempem = vyzvednutí (jede se pro hosty a vezou se zpět do kempu) */
 const zp=!sL&&podKempem(S.dvM),zK=sL&&S.l.odkud==='kemp',m=(sL?REKA[rIdx(S.l.odkud)]:REKA.find(x=>x.k===S.dvM))||{},ano=S.l.dopr===true&&!zK,c1=dvW.querySelector('[data-dv="1"]'),c0=dvW.querySelector('[data-dv="0"]');
 $('rzDvA').hidden=zK;
 $('rzDvTr').innerHTML=zp?`<b>${KL.t(m.n||'')}</b><i aria-hidden="true">→</i><span>${KL.t('Kemp Krumlov')}</span><small>${osT}</small>`:`<span>${KL.t('Kemp Krumlov')}</span><i aria-hidden="true">→</i><b>${KL.t(m.n||'')}</b><small>${osT}</small>`;
 c1.querySelector('b').textContent=KL.t(zp?'Ano, vyzvedněte nás':'Ano, odvezte nás');c0.querySelector('small').textContent=KL.t(zp?'Z cíle se vrátíme sami.':'Na start přijedeme vlastním autem.');
 c1.classList.toggle('on',ano);c1.setAttribute('aria-checked',ano);c0.classList.toggle('on',S.l.dopr===false);c0.setAttribute('aria-checked',S.l.dopr===false);
 $('rzDvP').textContent=autT;$('rzDvK').textContent='+ '+fmt((m.cena||0)*a);
 $('rzDvC').hidden=!ano;$('rzDvCasH').textContent=KL.t(zp?'V kolik vás máme vyzvednout?':'V kolik chcete vyrazit z kempu?');$('rzDvCasA').hidden=zp;$('rzDvCasZ').hidden=!zp;
 dvW.querySelectorAll('[data-cas]').forEach(b=>{const o=b.dataset.cas===S.l.cas;b.classList.toggle('on',o);b.setAttribute('aria-pressed',o)});
 dvW.querySelectorAll('[data-vcas]').forEach(b=>{const o=b.dataset.vcas===S.l.vcas;b.classList.toggle('on',o);b.setAttribute('aria-pressed',o)});
 const dd=sL?S.l.den:S.dvD,dx=dd?lodDays().concat(stayDays()).find(d=>iso(d)===dd):null;
 $('rzDvN').textContent=ano?(zp?`${KL.t('Vyzvedneme vás')} ${dx?fD(dx)+' ':''}${KL.t('v')} ${S.l.vcas} · ${KL.t(m.n||'')} → ${KL.t('Kemp Krumlov')}`:`${KL.t('Odjezd z kempu')} ${dx?fD(dx)+' ':''}${KL.t('v')} ${S.l.cas} · ${KL.t(m.n||'')}`):'';
 /* s loděmi a cílem mimo kemp: vyzvednutí v cíli */
 const kZ=sL&&S.l.kam&&S.l.kam!=='kemp',zw=$('rzDvZ');zw.hidden=!kZ;if(!kZ)return;
 const mk=REKA[rIdx(S.l.kam)]||{},v=vyzvObj(),vz=S.l.vz===true,dn=KR.lodeDny(lodeObj()),dl=dn[dn.length-1],dlx=dl?lodDays().concat(stayDays(),[addD(S.d0||TODAY,S.l.dni-1)]).find(d=>iso(d)===dl):null;
 $('rzDvZTr').innerHTML=`<b>${KL.t(mk.n||'')}</b><i aria-hidden="true">→</i><span>${KL.t('Kemp Krumlov')}</span><small>${KL.t('vyzvednutí v cíli')} · ${osT}</small>`;
 const z1=zw.querySelector('[data-vz="1"]'),z0=zw.querySelector('[data-vz="0"]');z1.classList.toggle('on',vz);z1.setAttribute('aria-checked',vz);z0.classList.toggle('on',S.l.vz===false);z0.setAttribute('aria-checked',S.l.vz===false);
 $('rzDvZP').textContent=autT;$('rzDvZK').textContent='+ '+fmt((mk.cena||0)*a);$('rzDvZC').hidden=!vz;
 $('rzDvZN').textContent=v?`${KL.t('Vyzvedneme vás')} ${dlx?fD(dlx)+' ':''}${KL.t('v')} ${S.l.vcas} · ${KL.t(mk.n||'')} → ${KL.t('Kemp Krumlov')}`:''}
/* režim Lodě: nocleh – host si vybere příjezd a odjezd (libovolný počet nocí) */
const nocW=$('rzNoci'),nocOk=d=>d>=TODAY&&openNight(d);
if(nocW){nocW.innerHTML=`<button type="button" class="rz-nb" data-nc="1" aria-pressed="false"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5"/></svg></span><span class="tx"><b>${KL.t('Ano, chci u vás přespat')}</b><small>${KL.t('Chatka, teepee, stan nebo karavan – na jednu i více nocí.')}</small></span><em class="ck" aria-hidden="true"></em></button>
 <div class="rz-nc-d v4" id="rzNcD"><p class="rz-nch">${KL.t('Klikněte na noci, které u nás chcete strávit.')}<small>${KL.t('Noc patří ke dni, kdy večer jdete spát.')}</small></p><div class="rz-ncc4" id="rzNcC"></div><div class="rz-ncl4"><span><i class="s"></i>${KL.t('spíte u nás')}</span><span><i class="l"></i>${KL.t('plavba')}</span></div><p class="rz-nts" id="rzNts"></p><p class="rz-nc-i" id="rzNcI" hidden></p></div>`;
 S.ns=new Set();
 const ncSync=()=>{const a=[...S.ns].sort();if(!a.length){S.pr=S.ou=null;return}const v=x=>{const p=x.split('-');return D(+p[0],p[1]-1,+p[2])};S.pr=v(a[0]);S.ou=addD(v(a[a.length-1]),1)};
 const ncKlik=d=>{if(!nocOk(d))return;const k=iso(d);if(S.ns.has(k))S.ns.delete(k);else S.ns.add(k);ncSync();render()};
 nocW.ncSync=ncSync;
 nocW.addEventListener('click',e=>{const b=e.target.closest('[data-ncd]');if(!b||b.disabled)return;const v=b.dataset.ncd.split('-');ncKlik(D(+v[0],v[1]-1,+v[2]))});
 nocW.addEventListener('click',e=>{const b=e.target.closest('[data-nc]');if(!b)return;S.nc=!S.nc;if(!S.nc){S.ns.clear();nocW.ncSync()}if(!S.nc){TYPES.forEach(t=>{S.q[t.k]=0;if(S.c[t.k])S.c[t.k]=[]});EXTRAS.forEach(x=>{S[x.k]=0})}render()});
}
const ncRange=(a,b)=>{for(let d=a;d<b;d=addD(d,1))if(!nocOk(d))return false;return true};
const nocChyba=()=>{if(!S.nc||!S.pr||!S.ou)return '';for(let d=S.pr;d<S.ou;d=addD(d,1))if(!gap(d)&&!nocOk(d))return KL.t('V tomto termínu máme zavřeno nebo je to v minulosti. Vyberte prosím jiné noci.');return ''};
/* souvislé úseky nocí: [[příjezd, odjezd], …] */
function useky(){const a=[...(S.ns||[])].sort(),o=[];const v=x=>{const p=x.split('-');return D(+p[0],p[1]-1,+p[2])};a.forEach(x=>{const d=v(x),u=o[o.length-1];if(u&&same(u[1],d))u[1]=addD(d,1);else o.push([d,addD(d,1)])});return o}
function nocRender(){if(!nocW)return;const lod=S.mod==='lod';nocW.hidden=!lod;const ty=$('rzTypes'),nr=root.querySelector('.rz-norez');if(ty)ty.hidden=lod&&!S.nc;if(nr&&nr.parentNode===ty.parentNode)nr.hidden=lod;if(!lod||!S.d0)return;
 const b=nocW.querySelector('[data-nc]');b.classList.toggle('on',S.nc);b.setAttribute('aria-pressed',S.nc);$('rzNcD').hidden=!S.nc;if(!S.nc)return;
 const last=addD(S.d0,S.l.dni-1),n=S.ns.size,ch=nocChyba(),sg=useky();
 /* běžný kalendář po měsících: měsíc(e) kolem plavby */
 const a0=S.pr&&S.pr<addD(S.d0,-3)?S.pr:addD(S.d0,-3),a1=S.ou&&S.ou>addD(last,3)?S.ou:addD(last,3),m0=D(a0.getFullYear(),a0.getMonth(),1),m1=D(a1.getFullYear(),a1.getMonth(),1),MS=[m0];if(m1>m0)MS.push(m1);
 $('rzNcC').innerHTML=MS.map(m=>{let h=`<div class="rz-ncm"><b class="rz-ncm-h">${MN[m.getMonth()]} ${m.getFullYear()}</b><div class="rz-ncw4">`+[1,2,3,4,5,6,0].map(i=>`<span>${WD[i]}</span>`).join('')+'</div><div class="rz-ncg4">';
  const pad=(m.getDay()+6)%7;for(let i=0;i<pad;i++)h+='<span></span>';
  for(let d=m;d.getMonth()===m.getMonth();d=addD(d,1)){const sp=S.ns.has(iso(d)),lod=d>=S.d0&&d<=last,ok=nocOk(d),ps=0,pe=0;
   h+=`<button type="button" data-ncd="${iso(d)}" class="${[sp?'sp':'',ps?'ps':'',pe?'pe':'',lod?'lod':'',same(d,TODAY)?'td':''].join(' ').trim()}"${ok?'':' disabled'} aria-pressed="${!!sp}" aria-label="${KL.t('noc')} ${fD(d)} → ${fD(addD(d,1))}${lod?', '+KL.t('plavba'):''}"><b>${d.getDate()}</b>${lod?'<i class="lo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2-1.5 4.5-1.5S19 17 21 17"/><path d="M5 13h14l-2-5H7z"/></svg></i>':''}${sp?'<i class="mo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></i>':''}</button>`}
  return h+'</div></div>'}).join('');
 $('rzNts').innerHTML=n?sg.map(u=>`${KL.t('Příjezd')} <b>${fD(u[0])}</b> → ${KL.t('odjezd')} <b>${fD(u[1])}</b>`).join('<br>')+` · <b class="n">${n} ${plural(n,'noc','noci','nocí')}</b>`:KL.t('Zatím nemáte vybranou žádnou noc.');
 $('rzNcI').textContent=ch;$('rzNcI').classList.toggle('zle',!!ch);$('rzNcI').hidden=!ch}
function lodMod(){if(S.mod!=='lod'||!S.d0)return;if(S.nc&&S.pr&&S.ou&&S.ou>S.pr){S.from=S.pr;S.to=S.ou}else{S.from=S.d0;S.to=S.d0}S.l.den=iso(S.d0)}
/* příklad ceny podle počtu osob: do 2 lidí kanoe, víc lidí raft správné velikosti */
const proOs=n=>KL.jazyk==='cs'?`${n} ${n===1?'osobu':n<5?'osoby':'osob'}`:`${n} ${plural(n,'osoba','osoby','osob')}`;
function lodPriklad(){const os=Math.max(1,persons()),p=k=>LODE.find(x=>x.k===k);let t,n=1;
 if(os<=2)t=p('kanoe');else if(os<=4)t=p('raft4');else if(os<=6)t=p('raft6');else{t=p('raft8');n=Math.ceil(os/8)}
 t=t||LODE[0];if(!t)return null;return {cena:n*KC.lod(t.k,1),txt:`${KL.t('Pro')} ${proOs(os)}: ${n>1?n+'× ':''}${KL.male(KL.t(t.n))}`}}
function dopPriklad(){const m=REKA.filter(x=>x.k!=='kemp'&&x.cena).sort((a,b)=>a.cena-b.cena)[0];if(!m)return null;const a=KR.aut(persons());return {cena:m.cena*a,txt:`${KL.t(m.n)} · ${a} ${plural(a,'auto','auta','aut')} ${KL.t('pro')} ${proOs(Math.max(1,persons()))}`}}
const setOpts=(el,h)=>{if(el.__h!==h){el.innerHTML=h;el.__h=h}};
function lodRender(){if(!lodOk)return;if(S.l.pref&&S.l.den){const f=lodFree();if(!nLodi()&&(f[S.l.pref]||0)>0)S.l.kusy[S.l.pref]=1;S.l.pref=null}const v=lodFree(),n=nLodi(),oi=rIdx(S.l.odkud),uby=S.mod==='uby',nab=$('rzNab');
 nab.hidden=!uby;$('rzLodL').hidden=uby&&!S.l.chci;
 nab.querySelectorAll('[data-nb]').forEach(b=>{const on=b.dataset.nb==='lod'?S.l.chci:S.l.dopr===true;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
 {const L=lodPriklad(),D=dopPriklad();if(L){$('rzNbC-lod').textContent=fmt(L.cena);$('rzNbJ-lod').textContent=KL.t('za loď a den');$('rzNbP-lod').textContent=L.txt}if(D){$('rzNbC-dop').textContent=fmt(D.cena);$('rzNbJ-dop').textContent=KL.t('za jízdu');$('rzNbP-dop').textContent=D.txt}}
 if(uby&&!S.l.chci){$('rzLodO').hidden=true;return}
 LODE.forEach(p=>{const q=S.l.kusy[p.k],f=Math.max(0,v[p.k]==null?0:v[p.k]);p.el.classList.toggle('on',q>0);p.el.classList.toggle('busy',f<=0&&!q);p.el.querySelector('.fr').textContent=!S.l.den?'':f<=0?KL.t('vše půjčené'):KL.t('volných')+' '+f;p.st.upd()});
 $('rzLodO').hidden=!n;if(!n)return;
 {const e=$('rzLden');e.min=iso(new Date());e.removeAttribute('max');e.value=S.l.den||'';e.disabled=S.mod==='lod'}
 {const p=(S.l.den||'').split('-'),d0=p.length===3?new Date(+p[0],p[1]-1,+p[2]):null,mx=lodMaxDni(),e=$('rzLvdo'),n=Math.max(1,Math.min(+S.l.dni||1,mx));e.disabled=!d0;e.min=d0?iso(d0):'';e.removeAttribute('max');e.value=d0?iso(addD(d0,n-1)):'';$('rzLvdoN').textContent=d0?(n===1?KL.t('vrácení týž den')+' · ':'')+n+' '+plural(n,'den','dny','dní'):''}
 setOpts($('rzLod'),REKA.slice(0,-1).map(x=>`<option value="${x.k}">${KL.t(x.n)}</option>`).join(''));$('rzLod').value=S.l.odkud;
 setOpts($('rzLkam'),REKA.filter((x,i)=>i>oi).map(x=>`<option value="${x.k}">${KL.t(x.n)}</option>`).join(''));$('rzLkam').value=S.l.kam;
 const lo0=lodeObj(),cl=KR.cenaLodi(lo0,doprObj()),vel=lo0&&KR.lodePocet(lo0)>=10,vic=lo0&&+lo0.dni>1,ZS=KC.kat('doprava').filter(p=>p.skryt!==1&&p.n1!=null),k1=vel?'n10':'n1',k2=vel?'d10':'d1';
 $('rzLodI').innerHTML=(window.KKV?KKV.pruh('kv-rz'):'')+`<p>${KL.t('V ceně jsou pádla, vesty a barely.')} ${cl.sOsobami?`<b>${KL.t('Lodě vezeme spolu s vámi – návoz lodí se zvlášť neplatí.')}</b></p>`:`<b>${KL.t('Návoz lodí')} ${cl.navoz?'('+fmt(cl.navoz)+') ':''}${KL.t('není započítaný v ceně – platí se až na místě, vždy jen jeden, i když jedete třeba z Vyššího Brodu do Boršova.')}</b> <button type="button" class="rz-nvl" data-cenik-lode>${KL.t('Ceník návozu')}</button></p>`}`}
const lodeTxt=()=>{const l=lodeObj();if(!l)return '';const d=lodDays().find(x=>iso(x)===l.den);return LODE.filter(p=>l.kusy[p.k]).map(p=>`${l.kusy[p.k]}× ${KL.male(KL.t(p.n))}`).join(', ')+` · ${KR.lodeObdobi?KR.lodeObdobi(l,KL.jazyk||document.documentElement.lang,1):(d?fD(d):'')} · ${KL.t(KR.mistoN(l.odkud))} → ${KL.t(KR.mistoN(l.kam))}`};
const doprTxt=()=>{const d=doprObj(),v=vyzvObj(),o=[];if(d){const a=KR.aut(d.osob);o.push(`${KL.t(KR.mistoN(d.misto))}, ${d.cas} · ${a} ${plural(a,'auto','auta','aut')}`)}if(v){const a=KR.aut(v.osob);o.push(`${KL.t('vyzvednutí')} ${KL.t(KR.mistoN(v.misto))}, ${v.cas} · ${a} ${plural(a,'auto','auta','aut')}`)}return o.join(' + ')};

/* ---------- výpočet ---------- */
function compute(){const nights=nightsList(),L=[],sk={},qk={};let sum=0;
 const add=(label,key,qty)=>{if(!qty)return;let v=0;nights.forEach(d=>v+=P[key][isHi(d)?0:1]*qty);qk[key]=(qk[key]||0)+qty;if(v){L.push([label,v]);sum+=v;sk[key]=(sk[key]||0)+v}};
 SEL().forEach(x=>{const u=UNIT[x.k],q=S.q[x.k];add(`${q}× ${plural(q,u[1],u[2],u[3])}${cis(x.k)}`,x.k,q)});
 /* skupiny osob mají svou cenu jen u ubytování, ke kterému patří (ceník → Osoby → Platí pro); jinak se počítají jako dospělý */
 const typy=SEL().map(t=>t.k),ok=k=>KC.osobaPlati?KC.osobaPlati(k,typy):true;
 const ad=S.dosp+(ok('dite')?0:S.dite)+(ok('zak')?0:S.zak)+OS_VLASTNI.reduce((a,p)=>a+(ok(p.k)?0:(S[p.k]||0)),0);
 /* Osoba se neplatí u ubytování, kde je v ceně (ceník → Osoba → se platí u) */
 if(ok('os'))add(`${ad}× ${plural(ad,'dospělý','dospělí','dospělých')}`,'os',ad);
 if(ok('dite'))add(`${S.dite}× ${plural(S.dite,'dítě','děti','dětí')}`,'dite',S.dite);
 if(ok('zak'))add(`${S.zak}× ${plural(S.zak,'žák','žáci','žáků')}`,'zak',S.zak);
 OS_VLASTNI.forEach(p=>{if(ok(p.k))add(`${S[p.k]||0}× ${KL.male(KL.t(p.n))}`,p.k,S[p.k]||0)});
 EXTRAS.forEach(x=>add(`${S[x.k]}× ${KL.male(KL.t(x.n))}`,x.k,S[x.k]));
 const n=nights.length,lo=lodeObj(),L2=[],cl=lo?KR.cenaLodi(lo,doprObj()):{navoz:0,celkem:0},dp=doprObj(),vy=vyzvObj(),cv=vy?KR.cenaDopravy(vy):0,cd=(dp?KR.cenaDopravy(dp):0)+cv;
 /* slevy podle ceníku – z ubytování, případně i z lodí a dopravy */
 const SL=KC.slevaPobyt?KC.slevaPobyt({noci:n,q:qk,sumK:sk,od:n?iso(nights[0]):(lo?lo.den:''),lodi:lo?Object.values(lo.kusy).reduce((a,b)=>a+(+b||0),0):0,lode:cl.celkem,dop:cd}):{kc:0,nazev:'',proc:0},dv=SL.kc,disc=sum?dv/sum:0,discN=SL.nazev,discP=SL.proc;
 if(lo){LODE.forEach(p=>{const q=lo.kusy[p.k];if(q)L2.push([`${q}× ${KL.male(KL.t(p.n))}${lo.dni>1?' · '+lo.dni+' '+plural(lo.dni,'den','dny','dní'):''}`,q*KC.lod(p.k,lo.dni)*lo.dni])});if(cl.navoz)L2.push([`${KL.t('Návoz lodí')} ${fmt(cl.navoz)}`,KL.t('na místě'),1])}
 if(dp&&cd-cv)L2.push([`${KL.t('Doprava osob')} – ${KL.t(KR.mistoN(dp.misto))}`,cd-cv]);if(cv)L2.push([`${KL.t('Vyzvednutí v cíli')} – ${KL.t(KR.mistoN(vy.misto))}`,cv]);
 const total=sum-dv+cl.celkem+cd;
 return{nights,n,L,L2,sum,disc,dv,discN,discP,navoz:cl.navoz,lode:cl.celkem,dopr:cd,total,zal:KR&&KR.zalohaCastka&&!naDnes()?KR.zalohaCastka(Math.round(total)):0,dnes:naDnes()}}

/* plynulé počítání ceny */
const tw={};function tween(el,to){const o=tw[el.id]||(tw[el.id]={v:0,a:0});cancelAnimationFrame(o.a);const from=o.v,t0=performance.now(),dur=false?1:550;
 const f=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);o.v=from+(to-from)*e;el.textContent=fmt(o.v);if(p<1)o.a=requestAnimationFrame(f)};o.a=requestAnimationFrame(f)}

let R,warnT;
/* po volbě sjet plynule k dalším údajům, ať je host nemusí hledat */
function dolu(el){setTimeout(()=>{if(!el||el.hidden||!el.offsetParent)return;const r=el.getBoundingClientRect(),top=scrollY+r.top-110;if(r.top<90||r.top>innerHeight*.55)scrollTo({top,behavior:'smooth'})},120)}
function warn(msg){const w=$('rzWarn');w.textContent=msg;w.hidden=!msg;clearTimeout(warnT);if(msg){warnT=setTimeout(()=>{w.hidden=true},8000)}}
{const bar=root.querySelector('.rz-bar'),w=$('rzWarn');if(bar&&w)bar.before(w)}
const extrasTxt=()=>EXTRAS.filter(x=>S[x.k]).map(x=>`${S[x.k]>1?S[x.k]+'× ':''}${KL.male(KL.t(x.n))}`).join(', ');
const peopleTxt=()=>{const J=k=>PEOPLE.find(x=>x.k===k&&x.jm),a=[];const pp=(k,f)=>{if(!S[k])return;const j=J(k);a.push(j?`${S[k]}× ${KL.male(KL.t(j.n))}`:f())};pp('dosp',()=>`${S.dosp} ${plural(S.dosp,'dospělý','dospělí','dospělých')}`);pp('dite',()=>`${S.dite} ${plural(S.dite,'dítě','děti','dětí')}`);pp('zak',()=>`${S.zak} ${plural(S.zak,'žák','žáci','žáků')}`);OS_VLASTNI.forEach(p=>{if(S[p.k])a.push(`${S[p.k]}× ${KL.male(KL.t(p.n))}`)});return a.join(', ')||'–'};
const typeTxt=()=>SEL().map(t=>`${S.q[t.k]}× ${KL.male(KL.t(t.n))}${cis(t.k)}`).join(', ')||(denMod()?KL.t('bez noclehu'):'nevybráno');
const dateTxt=()=>S.mod==='lod'?(S.d0?`${fD(S.d0)}${S.l.dni>1?' – '+fD(addD(S.d0,S.l.dni-1)):''} · ${KL.t('lodě')}${R.n?' · '+R.n+' '+plural(R.n,'noc','noci','nocí'):''}`:KL.t('vyberte den')):!S.from?'vyberte termín':denMod()?`${fD(S.from)} · ${KL.t('bez noclehu')}`:S.from&&S.to?`${fD(S.from)} – ${fD(S.to)} · ${R.n} ${plural(R.n,'noc','noci','nocí')}`:'vyberte odjezd';

/* doplněk jen k určitému ubytování (ceník: pro) – jinak zašedlý */
function xLimit(){TYPES.forEach(t=>{if(!t.el)return;const ne=t.minOs&&persons()<t.minOs;if(ne&&S.q[t.k]){S.q[t.k]=0;if(S.c[t.k])S.c[t.k]=[]}t.el.classList.toggle('mo-ne',!!ne)});const selT=SEL().map(t=>t.k);EXTRAS.forEach(x=>{const ne=x.pro.length&&selT.length&&!selT.some(k=>x.pro.includes(k));if(ne&&S[x.k])S[x.k]=0;x.el.classList.toggle('ne',!!ne);x.el.setAttribute('aria-disabled',!!ne);x.el.tabIndex=ne?-1:0})}
/* shrnutí před odesláním (poslední krok) */
function rekap(nic){const rk=$('rzRek');if(!rk)return;const lod=[lodeTxt(),doprTxt()?KL.t('doprava osob')+' – '+doprTxt():''].filter(Boolean).join(' + '),ex=extrasTxt();
 const Rw=[['termin',S.mod==='lod'?'Den vyplutí':'Termín',dateTxt()],['kdo','Osoby',peopleTxt()]];
 if(S.mod==='lod'){if(lod)Rw.push(['lode','Lodě a doprava',lod]);Rw.push(['uby','Nocleh',SEL().length?typeTxt()+'<br><small>'+useky().map(u=>fD(u[0])+' – '+fD(u[1])).join(' '+KL.t('a')+' ')+'</small>':KL.t('bez noclehu')])}else Rw.push(['uby','Ubytování',typeTxt()]);
 if(ex)Rw.push(['ext','Doplňky',ex]);if(S.mod!=='lod')Rw.push(['lode','Lodě a doprava',lod||KL.t('žádné')]);
const zal=R.dnes&&R.total&&!nic?`<p class="rz-rek-z">${KL.t('Rezervace na dnešek – bez zálohy, celou částku zaplatíte na místě.')} <b>${fmt(R.total)}</b></p>`:R.zal&&!nic?(R.zal>=Math.round(R.total)?`<p class="rz-rek-z">${KL.t('Platí se předem převodem')}: <b>${fmt(R.zal)}</b></p>`:`<p class="rz-rek-z">${KL.t('Záloha předem')} <b>${fmt(R.zal)}</b> · ${KL.t('zbytek na místě')} <b>${fmt(R.total-R.zal)}</b>${R.navoz?` + ${KL.t('návoz lodí')} <b>${fmt(R.navoz)}</b>`:''}</p>`):'';
 rk.innerHTML=`<dl>`+Rw.map(x=>`<div><dt>${KL.t(x[1])}</dt><dd>${x[2]}</dd><button type="button" data-go="${x[0]}">${KL.t('změnit')}</button></div>`).join('')+`</dl><div class="rz-rek-c"><span>${KL.t('Cena celkem')}${R.dv?` <small>${KL.t('vč. slevy')} ${fmt(R.dv)}</small>`:''}</span><b>${nic||!S.to?'—':fmt(R.total)}</b></div>${zal}`;
 $('rzRekK').textContent=KL.t('Kam vám máme odpovědět?')}
/* texty podle toho, jestli se platí záloha – ať host ví předem, co ho čeká */
const TX0={};
function texty(){const Z=KR&&KR.zaloha?KR.zaloha():null,zap=!!(Z&&Z.zap);
 const tx=(k,v)=>{const e=root.querySelector('[data-t="rezervace.'+k+'"]');if(!e)return;if(!(k in TX0))TX0[k]=e.textContent;const n=v==null?TX0[k]:KL.t(v);if(e.dataset.tz!==n||v==null&&e.dataset.tz){if(v==null){if(e.dataset.tz){e.textContent=TX0[k];delete e.dataset.tz}}else{e.textContent=n;e.dataset.tz=n}}};
 const ch=!zap?null:Z.typ==='vse'?'Platba předem převodem':Z.typ==='castka'?KL.t('Záloha')+' '+fmt(Z.hodnota)+', '+KL.t('zbytek na místě'):KL.t('Záloha')+' '+Z.hodnota+' %, '+KL.t('zbytek na místě');
 tx(24,'Zkontrolujte a odešlete');tx(15,S.mod==='lod'?'Vyplutí':null);tx(16,S.mod==='lod'?'Vrácení':null);tx(4,ch);tx(3,zap?'Vyberte termín, ubytování a počet osob – cenu uvidíte hned. Rezervaci potvrdíte zaplacením zálohy, pokyny pošleme e-mailem.':null);
 tx(37,zap?'Cena podle ceníku. Zálohu zaplatíte převodem, zbytek až na místě.':null);
 tx(25,zap?'Na e-mail vám pošleme číslo rezervace a pokyny k zaplacení zálohy.':null);tx(28,zap?'E-mail *':null)}
function render(){{const cw=$("rzCasW");if(cw)cw.hidden=S.mod==="lod"}Object.keys(MISTA).forEach(k=>{S.c[k]=S.c[k].filter(n=>freeU(k,n));if(k in S.q)S.q[k]=S.c[k].length});lodMod();if(denMod()){TYPES.forEach(t=>{S.q[t.k]=0;if(S.c[t.k])S.c[t.k]=[]});EXTRAS.forEach(x=>{S[x.k]=0})}lodFix();xLimit();R=compute();lodRender();dopRender();nocRender();const pending=S.from&&!S.to;if(S.to&&!$('rzWarn').hidden)warn(KL.t(''));
 paintCal();
 $('rzFromT').textContent=S.from?fD(S.from):'vyberte';$('rzFromT').classList.toggle('wait',!S.from);
 const toT=$('rzToT');toT.textContent=S.to?fD(S.to):S.from?'vyberte':'–';toT.classList.toggle('wait',!!pending);
 $('rzN').textContent=R.n;$('rzNl').textContent=plural(R.n,'noc','noci','nocí');
 {const L=S.mod==='lod',QN=['1 noc','2 noci','3 noci','Týden'],QL=['1 den','2 dny','3 dny','Týden'];root.querySelectorAll('#rzQuick button').forEach((b,i)=>{b.textContent=KL.t((L?QL:QN)[i]||b.textContent);b.classList.toggle('on',L?!!S.d0&&!S.lp&&+b.dataset.n===S.l.dni:!!S.to&&+b.dataset.n===R.n)});
  if(L){$('rzFromT').textContent=S.d0?fD(S.d0):KL.t('vyberte');$('rzFromT').classList.toggle('wait',!S.d0);toT.textContent=S.d0?(S.lp?KL.t('vyberte'):fD(addD(S.d0,S.l.dni-1))):'–';toT.classList.toggle('wait',!!S.lp);$('rzN').textContent=S.d0&&!S.lp?S.l.dni:0;$('rzNl').textContent=plural(S.d0?S.l.dni:0,'den','dny','dní')}}
 PEOPLE.forEach(r=>{r.st.upd();r.el.classList.toggle('has',S[r.k]>0)});
 TYPES.forEach(x=>{const q=S.q[x.k],fr=freeK(x.k);{const bd=x.el.querySelector('[data-bd]');if(bd&&MISTA[x.k]&&S.from&&S.to){let v=0;for(let n=1;n<=CNT[x.k];n++)if(freeU(x.k,n))v++;bd.textContent=v?`${KL.t('volných')} ${v} ${KL.t('z')} ${CNT[x.k]}`:KL.t('obsazeno');bd.classList.toggle('gr',v>3);bd.classList.toggle('zle',!v)}}x.el.classList.toggle('on',q>0);x.el.classList.toggle('busy',!fr);x.el.querySelector('.tx b').dataset.obs=fr?'':KL.t('Plná kapacita – ve vašem termínu obsazeno');x.el.querySelector('.n').textContent=q?q+'×':'';x.st.upd()});
 $('rzTNote').hidden=true;
 TYPES.forEach(t=>{if(!t.pick)return;const c=S.c[t.k],o=!!(t.open||c.length);t.pick.hidden=!o;t.tg.setAttribute('aria-expanded',o);
  t.tg.textContent=c.length?KL.t('č.')+' '+c.join(', '):KL.t(t.k==='chatka'?'Vybrat číslo chatky':'Vybrat číslo stanu');
  t.cns.forEach(x=>{const n=+x.dataset.n,s=c.includes(n),f=freeU(t.k,n);x.disabled=!f;x.classList.toggle('on',s);x.setAttribute('aria-pressed',s);x.setAttribute('aria-label',KL.t(t.n)+' '+n+(f?'':', '+KL.t('obsazeno')))})});
 EXTRAS.forEach(x=>{x.el.classList.toggle('on',S[x.k]>0);x.el.setAttribute('aria-checked',S[x.k]>0);x.st.upd()});
 /* souhrn */
 const hiN=R.nights.filter(isHi).length,se=$('rzSeason');
 se.textContent=!R.n||KC.jednaCena?'Termín':hiN===R.n?'Sezóna':hiN===0?'Mimo sezónu':'Sezóna + mimo';se.classList.toggle('lo',R.n>0&&hiN===0&&!KC.jednaCena);
 const nic=!!S.to&&!SEL().length&&!nLodi()&&!R.dopr;
 if(!S.to||nic){$('rzTotal').textContent='— Kč';delete tw.rzTotal;$('rzBarTotal').textContent='—';delete tw.rzBarTotal;$('rzPer').textContent=nic?KL.t(S.mod==='lod'?'Cenu uvidíte po výběru lodí':'Cenu uvidíte po výběru ubytování'):pending?'Vyberte v kalendáři den odjezdu':'Cenu uvidíte po výběru termínu'}
 else{tween($('rzTotal'),R.total);tween($('rzBarTotal'),R.total);$('rzPer').textContent=R.lode||R.dopr?'':persons()&&R.n?`≈ ${fmt(R.total/persons()/R.n)} ${KL.t('na osobu a noc')}`:''}
 const d=$('rzDisc');d.hidden=!R.disc||nic;d.textContent=R.dv?`${KL.t('Sleva')}${R.discP?' '+R.discP+' %':''} · ${KL.t('ušetříte')} ${fmt(R.dv)}`:'';
 $('rzSumDate').textContent=dateTxt();$('rzSumPeople').textContent=peopleTxt();$('rzSumType').textContent=typeTxt();$('rzSumExtras').textContent=extrasTxt()||'žádné';
 $('rzSumLode').textContent=[lodeTxt(),doprTxt()?KL.t('doprava osob')+' – '+doprTxt():''].filter(Boolean).join(' + ')||KL.t('žádné');
 {const z=$('rzZal'),u=!!(S.to&&(R.zal||R.dnes)&&R.total&&!nic);z.hidden=!u;z.textContent=u?R.dnes?KL.t('Rezervace na dnešek – bez zálohy, celou částku zaplatíte na místě.'):(R.zal>=Math.round(R.total)?`${KL.t('Platí se předem převodem')}: ${fmt(R.zal)}`:`${KL.t('Záloha předem')} ${fmt(R.zal)} · ${KL.t('zbytek na místě')} ${fmt(R.total-R.zal)}`)+(R.navoz?` + ${KL.t('návoz lodí')} ${fmt(R.navoz)}`:''):''}
 $('rzLines').innerHTML=!S.to?'<li><span>Vyberte termín</span><em>–</em></li>':R.L.map(([l,v])=>`<li><span>${l}</span><em>${fmt(v)}</em></li>`).join('')+R.L2.map(([l,v,x])=>`<li${x?' class="rz-mimo"':''}><span>${l}</span><em>${x?v:fmt(v)}</em></li>`).join('')+(R.dv?`<li class="minus"><span>${KL.t('Sleva')}${R.discP?' '+R.discP+' %':''}${R.discN?' · '+KL.t(R.discN):''}</span><em>−${fmt(R.dv)}</em></li>`:'')||'<li><span>Vyberte termín</span><em>–</em></li>';
 rekap(nic);texty();
 /* skrytá pole pro odeslání */
 const f=form.elements,set=(n,v)=>{f[n].value=v};
 set('prijezd',iso(S.from));set('odjezd',iso(S.to));set('noci',R.n);set('ubytovani',typeTxt());set('pocet_jednotek',SEL().reduce((a,t)=>a+S.q[t.k],0));
 set('dospeli',S.dosp);set('deti',S.dite);set('zaci',S.zak);set('doplnky',extrasTxt()||'žádné');set('cena',R.total);set('lode',lodeTxt());set('doprava',doprTxt());set('zaloha',R.zal||'');
 set('souhrn',summaryText());
 navState()}
function summaryText(){return `${S.mod==='lod'&&S.d0?'Den vyplutí: '+fDY(S.d0)+(R.n?'\nNocleh: '+useky().map(u=>fDY(u[0])+' – '+fDY(u[1])).join(' a ')+' ('+R.n+' '+plural(R.n,'noc','noci','nocí')+')':''):'Termín: '+fDY(S.from)+' – '+fDY(S.to)+' ('+R.n+' '+plural(R.n,'noc','noci','nocí')+')'}${S.mod!=='lod'&&form.elements.cas_prijezdu&&form.elements.cas_prijezdu.value?'\nPříjezd kolem: '+form.elements.cas_prijezdu.value:''}\nOsoby: ${peopleTxt()}\nUbytování: ${typeTxt()}\nDoplňky: ${extrasTxt()||'žádné'}${lodeTxt()?'\nLodě: '+lodeTxt():''}${doprTxt()?'\nDoprava osob: '+doprTxt():''}\n${R.zal?'Cena':'Orientační cena'}: ${fmt(R.total)}${R.disc?` (vč. slevy ${Math.round(R.disc*100)} %)`:''}${R.zal?'\nZáloha předem: '+fmt(R.zal):''}${KL.jazyk!=='cs'?'\nJazyk webu: '+KL.jazyk.toUpperCase():''}`}

/* ---------- kroky / průvodce ----------
   Host na začátku zvolí, čím začne (S.mod). Druhou část mu průvodce nabídne na konci, dopravu úplně nakonec:
   ubytování: termín → kdo → ubytování → doplňky → lodě (nabídka) → doprava (jen s loděmi) → kontakt
   lodě:      den → kdo → lodě → nocleh (nabídka) → doplňky (jen s noclehem) → doprava → kontakt */
const steps=[...root.querySelectorAll('.rz-step')],SK={};steps.forEach(s=>SK[s.dataset.k]=s);
{const rk=document.createElement('div');rk.className='rz-rek';rk.id='rzRek';SK.kontakt.querySelector('.rz-fields').before(rk);
 const kh=document.createElement('p');kh.className='rz-rek-k';kh.id='rzRekK';SK.kontakt.querySelector('.rz-fields').before(kh);
 rk.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(b.dataset.go)})}
const LBL={termin:'Termín',kdo:'Kdo jede',uby:'Osoby a ubytování',ext:'Doplňky',lode:'Lodě a doprava',doprava:'Doprava',kontakt:'Shrnutí a kontakt'};
const dvJo=()=>nLodi()>0||S.l.dopr===true;
/* společně zobrazené části jednoho kroku: osoby u ubytování (nebo u lodí), doprava u lodí */
const spolu=k=>k==='uby'&&S.mod==='uby'?['kdo']:k==='lode'?(S.mod==='lod'?['kdo']:dvJo()?['doprava']:[]):[];
const alias=k=>k==='kdo'?(S.mod==='lod'?'lode':'uby'):k==='doprava'&&S.mod==='uby'?'lode':k;
const maZal=()=>!!(R&&R.zal);
const seq=()=>!S.mod?['volba']:S.mod==='lod'?['volba','termin','lode','doprava','uby'].concat(SEL().length?['ext']:[],['kontakt']):['volba','termin','uby','ext','lode','kontakt'];
const progW=root.querySelector('.rz-prog'),mq=matchMedia('(max-width:900px)');let cur='volba';
const wiz=()=>true;
const HD0={};['termin','uby','lode'].forEach(k=>{const h=SK[k].querySelector('.rz-sh');HD0[k]=[h.querySelector('b').textContent,h.querySelector('small').textContent]});
const HDL={termin:['Na kdy si chcete půjčit loď?','Klikněte na den vyplutí a pak na den vrácení. Na jeden den klikněte na stejný den dvakrát.'],uby:['Chcete u nás i přespat?','Nepovinné. Vyberte, kdy přijedete a kdy odjedete – klidně na víc nocí.'],lode:['Jaké lodě si půjčíte?','Pádla, vesty i barely jsou v ceně.']};
const HDU={lode:['Užijte si Vltavu naplno','Řeka teče přímo kolem kempu. Přidejte si lodě nebo odvoz – zarezervujeme je na váš den.']};const HDLx={lode:'Osoby a lodě',uby:'Nocleh'};
function navState(){const q=seq();if(!q.includes(cur))cur=q[q.length-1];const i=q.indexOf(cur),last=cur==='kontakt',p=q.slice(1),sig=p.join()+KL.jazyk+S.mod;
 if(progW.__s!==sig){progW.__s=sig;progW.innerHTML=p.map((k,j)=>`<button type="button" data-k="${k}"><i>${j+1}</i><span>${KL.t(S.mod==='lod'&&HDLx[k]||LBL[k])}</span></button>`).join('')}
 [...progW.children].forEach((b,j)=>{const on=b.dataset.k===cur;b.classList.toggle('on',on);b.classList.toggle('done',j<i-1);b.setAttribute('aria-current',on?'step':'false')});
 progW.hidden=cur==='volba';
 root.classList.add('wiz');root.classList.toggle('last',last);root.classList.toggle('mod-lod',S.mod==='lod');root.classList.toggle('na-volbe',cur==='volba');
 const sp=spolu(cur);steps.forEach(s=>{const k=s.dataset.k,je=k===cur||sp.includes(k);s.classList.toggle('on',je);s.classList.toggle('par',je&&sp.length>0);s.classList.toggle('sub',je&&(k==='doprava'&&sp.includes(k)||k===cur&&sp.includes('kdo')));const n=s.querySelector('.rz-num'),ix=q.indexOf(je?cur:k);if(n&&ix>0)n.textContent=ix;
  const H=(S.mod==='lod'?HDL[k]:HDU[k])||HD0[k];if(H){const h=s.querySelector('.rz-sh');h.querySelector('b').textContent=KL.t(H[0]);h.querySelector('small').textContent=KL.t(H[1])}});
 root.querySelectorAll('#rzVolba .rz-vc').forEach(b=>b.classList.toggle('on',b.dataset.mod===S.mod));
 $('rzBack').hidden=i===0;$('rzNext').hidden=cur==='volba';const nx=q[i+1];
 $('rzNext').innerHTML=last?(innerWidth>900?KL.t(maZal()?'Odeslat rezervaci':'Odeslat poptávku')+' →':KL.t('Odeslat')+' →'):(innerWidth>900?KL.t('Pokračovat:')+' '+KL.t(S.mod==='lod'&&HDLx[nx]||LBL[nx]||'')+' →':KL.t('Další')+' →');$('rzNext').removeAttribute('aria-label')}
function nudge(){const c=$('rzCal');c.classList.remove('nudge');void c.offsetWidth;c.classList.add('nudge')}
function stepOk(k){
 if((k==='kdo'||k==='uby'&&S.mod==='uby'||k==='lode'&&S.mod==='lod')&&persons()<1){warn(KL.t('Zadejte prosím aspoň jednu osobu.'));return false}
 if(k==='volba')return !!S.mod;
 if(k==='termin'){if(S.mod==='lod'){if(!S.d0){warn(KL.t('Vyberte v kalendáři den vyplutí.'));nudge();return false}if(S.lp){warn(KL.t('Vyberte v kalendáři den vrácení. Na jeden den klikněte na stejný den znovu.'));nudge();return false}return true}
  if(!S.to||denMod()){warn(S.from&&!denMod()?'Vyberte v kalendáři den odjezdu.':'Vyberte v kalendáři den příjezdu a odjezdu.');nudge();return false}return true}
 if(k==='uby'){if(S.mod==='uby'&&!SEL().length){warn(KL.t('Vyberte prosím aspoň jedno ubytování.'));return false}
  if(S.mod==='lod'&&S.nc){if(!S.ou||!S.pr){warn(KL.t('Zvolte aspoň jednu noc.'));return false}const ch=nocChyba();if(ch){warn(ch);return false}if(!SEL().length){warn(KL.t('Vyberte prosím ubytování, nebo zrušte „Ano, chci u vás přespat“.'));return false}}
  if(SEL().length&&!bedsOk()){warn(KL.t('Ještě nemají všichni kde spát – přidejte chatku, teepee nebo vlastní stan.'));return false}}
 if(k==='lode'&&S.mod==='lod'&&!nLodi()){warn(KL.t('Vyberte prosím aspoň jednu loď.'));return false}
 if(k==='lode'&&S.mod==='uby'&&S.l.chci&&!nLodi()){warn(KL.t('Vyberte počet lodí, nebo zrušte „Chci si půjčit lodě“.'));return false}
 if(k==='lode'&&S.mod==='uby'&&dvJo()&&!stepOk('doprava'))return false;
 if(k==='doprava'&&S.l.dopr===null&&!(nLodi()&&S.l.odkud==='kemp')){warn(KL.t('Vyberte prosím, jestli chcete dopravu.'));return false}
 if(k==='doprava'&&nLodi()&&S.l.kam&&S.l.kam!=='kemp'&&S.l.vz===null){warn(KL.t('Vyberte prosím, jestli vás máme vyzvednout v cíli.'));return false}
 return true}
function go(k,scroll=true){k=alias(k);let q=seq();if(!q.includes(k))return;let i=q.indexOf(cur),n=q.indexOf(k),stop=false;
 if(n>i)for(let j=i;j<n;j++)if(!stepOk(q[j])){n=j;stop=true;break}
 if(stop&&n===i){navState();const w=$('rzWarn');if(w&&!w.hidden)setTimeout(()=>{const r=w.getBoundingClientRect();if(r.top<80||r.bottom>innerHeight-(innerWidth<=900?120:20))scrollTo({top:scrollY+r.top-innerHeight/2+r.height/2,behavior:'smooth'})},30);return}
 q=seq();cur=q[Math.max(0,Math.min(q.length-1,n))];navState();
 if(scroll){const top=root.querySelector('.rz-main').getBoundingClientRect().top;if(top<0||top>innerHeight*.5)root.querySelector('.rz-main').scrollIntoView({behavior:'smooth',block:'start'})}
 if(cur==='kontakt')setTimeout(()=>form.elements.jmeno.focus({preventScroll:true}),350)}
const krok=d=>{const q=seq();return q[q.indexOf(cur)+d]};
progW.addEventListener('click',e=>{const b=e.target.closest('button');if(b)go(b.dataset.k)});
$('rzBack').addEventListener('click',()=>go(krok(-1)));
$('rzNext').addEventListener('click',()=>{if(cur==='kontakt')submit();else go(krok(1))});
root.querySelectorAll('.rz-sum [data-go]').forEach(r=>r.addEventListener('click',()=>go(r.dataset.go)));
function setMod(m){if(S.mod!==m){S.mod=m;S.lp=false;S.from=S.to=S.d0=null;S.nc=false;S.pr=S.ou=null;if(S.ns)S.ns.clear();S.l.chci=m==='lod';TYPES.forEach(t=>{S.q[t.k]=0;if(S.c[t.k])S.c[t.k]=[]});LODE.forEach(p=>S.l.kusy[p.k]=0);S.l.dopr=null;S.l.vz=null;drawCal();render()}}
$('rzVolba').addEventListener('click',e=>{const b=e.target.closest('.rz-vc');if(!b)return;setMod(b.dataset.mod);go('termin')});
mq.addEventListener?mq.addEventListener('change',()=>navState()):mq.addListener(()=>navState());
if('IntersectionObserver' in window){const io2=new IntersectionObserver(es=>es.forEach(e=>document.body.classList.toggle('rz-inview',e.isIntersecting)),{threshold:.05});io2.observe(root)}

/* ---------- odeslání ---------- */
form.addEventListener('submit',e=>{e.preventDefault();submit()});
function fieldErr(name,msg){const inp=form.elements[name],lab=inp.closest('.rz-f');let em=lab.querySelector('em');
 if(msg){if(!em){em=document.createElement('em');em.id='err-'+name;lab.append(em)}em.textContent=msg;lab.classList.add('err');inp.setAttribute('aria-invalid','true');inp.setAttribute('aria-describedby','err-'+name)}else{if(em)em.remove();lab.classList.remove('err');inp.removeAttribute('aria-invalid');inp.removeAttribute('aria-describedby')}}
['jmeno','telefon','email'].forEach(n=>form.elements[n].addEventListener('input',()=>fieldErr(n,'')));
/* fotky ubytování se načtou až když se k nim host doroluje (rychlejší první načtení stránky) */
{const L=[...document.querySelectorAll('#rezervace [data-bg]')],uk=e=>{e.style.backgroundImage='url('+e.dataset.bg+')';e.removeAttribute('data-bg')};if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){uk(x.target);io.unobserve(x.target)}}),{rootMargin:'300px'});L.forEach(e=>io.observe(e))}else L.forEach(uk)}
/* odkaz „Ceník návozu“ otevře celý ceník u lodí */
document.addEventListener('click',e=>{if(!e.target.closest('[data-cenik-lode]'))return;const d=document.getElementById('rzPrice');if(!d)return;if(!d.open)d.showModal();setTimeout(()=>{const t=d.querySelector('#ck-lode .ck-sub')||d.querySelector('#ck-lode');if(t)t.scrollIntoView({block:'start'})},60)});
/* přibližný čas příjezdu – jen u pobytu, popisky podle jazyka */
{const w=$('rzCasW');if(w){$('rzCasL').textContent=KL.t('Přibližný čas příjezdu');const o=$('rzCas').options;o[0].textContent=KL.t('Zatím nevím');o[1].textContent=KL.t('do 10:00');o[7].textContent=KL.t('po 20:00')}}
/* krátká cesta pro vodáky: tlačítko „Jen lodě na den“ (data-rzmod) nebo odkaz #jen-lode rovnou otevře rezervaci lodí */
const rzMod=m=>{const b=document.querySelector('[data-mod="'+m+'"]');if(b&&S.mod!==m)b.click();const sec=document.getElementById('rezervace');if(sec)sec.scrollIntoView({behavior:'smooth',block:'start'})};
document.addEventListener('click',e=>{const a=e.target.closest('[data-rzmod]');if(!a)return;e.preventDefault();rzMod(a.dataset.rzmod)});
if(location.hash==='#jen-lode')setTimeout(()=>rzMod('lod'),300);
function submit(){
 if(!S.mod){go('volba');return}if(!S.to){go('termin');warn(KL.t(S.mod==='lod'?'Vyberte v kalendáři den vyplutí.':'Vyberte v kalendáři termín pobytu.'));return}
 if(!SEL().length&&!nLodi()){go(S.mod==='lod'?'lode':'uby');warn(KL.t(S.mod==='lod'?'Vyberte prosím aspoň jednu loď.':'Vyberte prosím aspoň jedno ubytování.'));return}
 const f=form.elements;let bad=null;
 if(R.zal&&window.KKR&&!f.email.value.trim()){fieldErr('email','Vyplňte e-mail, pošleme na něj pokyny k zaplacení zálohy.');bad=bad||f.email}
 if(!f.jmeno.value.trim()){fieldErr('jmeno','Vyplňte prosím jméno.');bad=bad||f.jmeno}
 if(f.telefon.value.replace(/\D/g,'').length<9){fieldErr('telefon','Zadejte telefon, ať vás můžeme zastihnout.');bad=bad||f.telefon}
 if(f.email.value&&!/^\S+@\S+\.\S+$/.test(f.email.value)){fieldErr('email','E-mail nevypadá správně.');bad=bad||f.email}
 if(bad){go('kontakt',false);SK.kontakt.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>bad.focus({preventScroll:true}),400);const b=$('rzSubmit');pop(b);return}
 const ep=form.dataset.endpoint,btn=$('rzSubmit');
 if(ep){btn.disabled=true;btn.textContent='Odesílám…';
  fetch(ep,{method:'POST',body:new FormData(form)}).then(r=>{if(!r.ok)throw 0;done(false)})
  .catch(()=>{btn.disabled=false;btn.innerHTML='Odeslat poptávku <span>→</span>';warnSend()})}
 else if(window.KKR){let r;
   const mista=[].concat(...Object.keys(MISTA).map(k=>S.c[k].map(n=>k+'-'+n)),S.q.teepee?['teepee-1']:[]);
  const lo=lodeObj(),dp=doprObj(),od=iso(S.from),dk=denMod()&&lo?KKR.lodeDny(lo).pop():iso(S.to),pb=KKR.novaPlatba(Math.round(R.total),lo&&lo.den<od?lo.den:od);
  const UG=S.mod==='lod'&&S.nc&&useky().length>1?useky():null,st0=pb?'pop':KKR.stavWeb(mista,{stan:S.q.stan||0,karavan:S.q.karavan||0}),zak={dalsi:{stan:S.q.stan||0,karavan:S.q.karavan||0},osoby:Object.assign({dosp:S.dosp,dite:S.dite,zak:S.zak},...OS_VLASTNI.filter(p=>S[p.k]).map(p=>({[p.k]:S[p.k]}))),doplnky:Object.assign({},...EXTRAS.filter(x=>+S[x.k]>0).map(x=>({[x.k]:+S[x.k]}))),jmeno:f.jmeno.value.trim(),telefon:f.telefon.value.trim(),email:f.email.value.trim(),prijezd:S.mod==='lod'?'':(f.cas_prijezdu?f.cas_prijezdu.value:''),zdroj:'web',jazyk:KL.jazyk};
    try{if(UG&&UG.some(u=>KKR.kolize(mista,iso(u[0]),iso(u[1])).length))throw new Error('obsazeno');/* noc před a po plavbě = dvě navazující rezervace; cena, záloha, lodě a doprava jsou u první */
   const u0=UG?UG[0]:null,txU=UG?KL.t('Nocleh rozdělený')+': '+UG.map(u=>fD(u[0])+' – '+fD(u[1])).join(' a '):'';
   r=KKR.pridej(Object.assign({stav:st0,od:u0?iso(u0[0]):od,do:u0?iso(u0[1]):dk,lode:lo,doprava:dp,vyzved:vyzvObj(),platba:pb,mista,zprava:[f.zprava.value.trim(),txU].filter(Boolean).join('\n'),cena:Math.round(R.total)},zak));
   if(UG)UG.slice(1).forEach(u=>{try{KKR.pridej(Object.assign({stav:st0,od:iso(u[0]),do:iso(u[1]),mista,spoj:r.id,zprava:KL.t('Druhá část pobytu k rezervaci')+' '+r.cislo+' – '+KL.t('cena a záloha jsou v ní.'),cena:0},zak))}catch(x){}})}
  catch(x){nactiBusy();drawCal();render();if(/vybavení/.test(x.message)){go('lode');warn(KL.t('Lodě si mezitím půjčil někdo jiný. Upravte prosím počet.'))}else{go('uby');warn(KL.t('Vybrané místo si mezitím zarezervoval někdo jiný. Vyberte prosím jiné.'))}return}
  done(false,r);nactiBusy();drawCal()}
 else{const body=`${summaryText()}\n\nJméno: ${f.jmeno.value}\nTelefon: ${f.telefon.value}\nE-mail: ${f.email.value||'-'}\nZpráva: ${f.zprava.value||'-'}`;
  location.href=`mailto:kempkrumlov2017@gmail.com?subject=${encodeURIComponent('Poptávka pobytu '+fDY(S.from)+' – '+fDY(S.to))}&body=${encodeURIComponent(body)}`;done(true)}}
/* QR platba (SPAYD – české bankovní aplikace) na zálohu: účet z Nastavení rezervací → Zálohy, VS = číslo rezervace */
function ibanCZ(u){u=String(u||'').replace(/\s/g,'').toUpperCase();if(/^CZ\d{22}$/.test(u))return u;const m=u.match(/^(?:(\d{1,6})-)?(\d{2,10})\/(\d{4})$/);if(!m)return '';
 const bban=m[3]+(m[1]||'').padStart(6,'0')+m[2].padStart(10,'0');let r=0;for(const ch of bban+'123500')r=(r*10+ +ch)%97;return 'CZ'+String(98-r).padStart(2,'0')+bban}
function qrPlatba(rz){let b=$('rzQR');if(b)b.remove();const Z=window.KKR&&KKR.zaloha?KKR.zaloha():{},ib=ibanCZ(Z.ucet);if(!rz||!rz.platba||!ib||!(+rz.platba.zaloha))return;
 const vs=String(rz.cislo||'').replace(/\D/g,'').slice(-10),am=(+rz.platba.zaloha).toFixed(2),dt=(rz.platba.splatnost||'').replace(/-/g,''),
  spd='SPD*1.0*ACC:'+ib+'*AM:'+am+'*CC:CZK'+(vs?'*X-VS:'+vs:'')+(dt?'*DT:'+dt:'')+'*MSG:'+('KEMP KRUMLOV '+(rz.cislo||'')).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\*/g,'').slice(0,60);
 b=document.createElement('div');b.id='rzQR';b.className='rz-qr';const sd=(rz.platba.splatnost||'').split('-');
 b.innerHTML=`<div class="rz-qr-c" aria-hidden="true"></div><div class="rz-qr-t"><b>${KL.t('Zaplaťte zálohu QR platbou')}</b><small>${KL.t('Naskenujte kód v aplikaci své banky – vše se vyplní samo.')}</small><dl><dt>${KL.t('Částka')}</dt><dd>${fmt(+rz.platba.zaloha)}</dd><dt>${KL.t('Účet')}</dt><dd>${String(Z.ucet).replace(/[<>&"]/g,"")}</dd>${vs?`<dt>${KL.t('Variabilní symbol')}</dt><dd>${vs}</dd>`:''}${sd.length===3?`<dt>${KL.t('Splatnost')}</dt><dd>${+sd[2]}. ${+sd[1]}. ${sd[0]}</dd>`:''}</dl></div>`;
 $('rzDoneP').after(b);
 const kresli=()=>{try{const q=qrcode(0,'M');q.addData(spd);q.make();b.querySelector('.rz-qr-c').innerHTML=q.createSvgTag({cellSize:5,margin:2,scalable:true})}catch(x){b.remove()}};
 if(window.qrcode)kresli();else{const sc=document.createElement('script');sc.src=(document.querySelector('script[src*="pobyt.js"]').src.replace(/pobyt\.js.*$/,''))+'vendor/qrcode.js';sc.onload=kresli;sc.onerror=()=>b.remove();document.head.append(sc)}}
function warnSend(){alert('Poptávku se nepodařilo odeslat. Zkuste to prosím znovu nebo zavolejte na +420 720 514 943.')}
let ULOZENO=false;
function done(viaMail,rz){const f=form.elements;ULOZENO=!!rz;$('rzAgain').textContent=KL.t(rz?'Nová rezervace':'Upravit poptávku');
 $('rzDoneH').textContent=viaMail?'Skoro hotovo – dokončete odeslání v e-mailu':'Děkujeme, poptávka je odeslaná';
 $('rzDoneP').textContent=viaMail?'Otevřeli jsme vám e-mail s vyplněnou poptávkou, stačí ho odeslat. Ozveme se s potvrzením termínu a přesnou cenou.':`${KL.t('Ozveme se vám na')} ${f.telefon.value}${f.email.value?' '+KL.t('nebo')+' '+f.email.value:''} ${KL.t('s potvrzením termínu a přesnou cenou.')}`;
 if(rz){const hned=rz.stav==='pot';$('rzDoneH').textContent=KL.t(hned?'Rezervace je potvrzená':'Děkujeme, poptávka je odeslaná');
  $('rzDoneP').textContent=KL.t(hned?'Číslo rezervace':'Číslo poptávky')+' '+rz.cislo+'. '+KL.t(hned?'Místo je zarezervované na vaše jméno.':'Místo vám držíme, ozveme se s potvrzením.')}
 if(rz&&rz.platba){const z=rz.platba,sd=z.splatnost.split('-');$('rzDoneH').textContent=KL.t('Rezervace přijata – zbývá zaplatit zálohu');
  $('rzDoneP').textContent=`${KL.t('Číslo rezervace')} ${rz.cislo}. ${KL.t('Na e-mail vám posíláme pokyny k platbě.')} ${KL.t('Záloha')} ${fmt(z.zaloha)}, ${KL.t('splatnost')} ${+sd[2]}. ${+sd[1]}. ${sd[0]}. ${KL.t('Do té doby vám vše držíme.')}`}
 qrPlatba(rz);
 $('rzDoneSum').innerHTML=summaryText().split('\n').map(l=>{const i=l.indexOf(':');return `<b>${l.slice(0,i+1)}</b>${l.slice(i+1)}`}).join('<br>');
 form.hidden=true;const d=$('rzDone');d.hidden=false;
 d.scrollIntoView({behavior:'smooth',block:'center'});d.focus({preventScroll:true})}
$('rzAgain').addEventListener('click',()=>{if(ULOZENO){location.hash='#rezervace';location.reload();return}$('rzDone').hidden=true;form.hidden=false;const b=$('rzSubmit');b.disabled=false;b.innerHTML='Odeslat poptávku <span>→</span>';go('kontakt')});

/* ---------- napojení z karet Ubytování ---------- */
const NAMES={'Vlastní stan':'stan','Karavan':'karavan','Chatka':'chatka','Teepee':'teepee','Podsadový stan':'podsad'};
document.querySelectorAll('[data-kc]').forEach(a=>a.addEventListener('click',e=>{const k=NAMES[a.dataset.kc];if(!k)return;e.preventDefault();
 setMod('uby');setType(k);cur=S.to&&!denMod()?'uby':'termin';navState();
 root.querySelector('.rz-main').scrollIntoView({behavior:"smooth",block:"start"})}));
/* napojení ze sekce Půjčovna lodí: otevře rezervaci lodí, vybraná loď se předvyplní po zvolení dne */
document.addEventListener('click',e=>{const a=e.target.closest('[data-rzlod]');if(!a)return;e.preventDefault();setMod('lod');S.l.pref=a.dataset.rzlod||null;cur='termin';navState();
 root.querySelector('.rz-main').scrollIntoView({behavior:"smooth",block:"start"})});
window.RZ={setType,go,setMod};
const dlg=$('rzPrice'),openP=()=>{dlg.showModal?dlg.showModal():dlg.setAttribute('open','')};
$('rzPriceBtn').addEventListener('click',openP);$('rzPriceBtn2').addEventListener('click',openP);
dlg.querySelector('.rz-dlg-x').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});

addEventListener('storage',e=>{if(e.key==='kkt.rezervace'){nactiBusy();drawCal();render()}});
drawCal();render();navState();
})();
;

/* ===== ubytovani-cenik.js ===== */
(function(){var b=document.getElementById('ubPriceBtn'),d=document.getElementById('rzPrice');if(b&&d)b.addEventListener('click',function(){d.showModal?d.showModal():d.setAttribute('open','')});})();
;

/* ===== doprava.js ===== */
(function(){
var sec=document.getElementById('doprava');if(!sec)return;
var STOPS=[["Vyšší Brod", 1150], ["Rožmberk nad Vltavou", 850], ["Nahořany", 650], ["Kemp Vltava", 550], ["Viking / Pískárna", 500], ["Vltavan / Spolí", 350], ["Centrum", 250], ["Zlatá Koruna", 350], ["Boršov", 900]],NS='http://www.w3.org/2000/svg';
var W=480,H=740;
function E(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
/* ---------- geometrie: řeka teče shora dolů, silnice vpravo od ní ---------- */
function rx(y){return 232+58*Math.sin(y*0.0172+0.35)}
function poly(f,dx){var d='';for(var y=-10;y<=H+10;y+=8){d+=(d?' L':'M')+(rx(y)+dx).toFixed(1)+' '+y}return d}
var riverEl=document.getElementById('dpRiver'),roadEl=document.getElementById('dpRoad');
var D_RIVER=poly(rx,0),D_ROAD=poly(rx,78);
['dpRiverBank','dpRiver','dpRiverHl'].forEach(function(id){document.getElementById(id).setAttribute('d',D_RIVER)});
['dpRoadEdge','dpRoad','dpRoadDash'].forEach(function(id){document.getElementById(id).setAttribute('d',D_ROAD)});
var road=roadEl,L=road.getTotalLength(),rv=riverEl,RL=rv.getTotalLength();
var trail=document.getElementById('dpTrail'),van=document.getElementById('dpVan'),camp=document.getElementById('dpCamp'),gS=document.getElementById('dpStops');
var FR=[.045,.14,.235,.33,.43,.535,.64,.82,.955],CAMP=.735;
/* zastávky z ceníku: pořadí v ceníku = pořadí po proudu; nové se umístí mezi sousedy */
if(window.KKC){var FRK={dop1:.045,dop2:.14,dop3:.235,dop4:.33,dop5:.43,dop6:.535,dop7:.64,dop8:.82,dop9:.955};
 var vse=KKC.kat('doprava'),pol=vse.map(function(p){return p.poloha!=null?+p.poloha/100:FRK[p.k]!=null?FRK[p.k]:null});
 pol.forEach(function(v,i){if(v!=null)return;var a=null,b=null,ia=i,ib=i;
  while(ia>0&&a==null){ia--;a=pol[ia]}while(ib<pol.length-1&&b==null){ib++;b=pol[ib]}
  if(a==null)a=0.01;if(b==null)b=0.99;pol[i]=a+(b-a)*(i-ia)/Math.max(1,(ib-ia)||1)});
 STOPS=[];FR=[];vse.forEach(function(p,i){if(p.skryt===1)return;STOPS.push([p.n,KKC.v(p.k,'a'),p.k]);FR.push(Math.min(.99,Math.max(.01,pol[i])))});if(STOPS[0]){var e1=document.getElementById('dpPrice'),e2=document.getElementById('dpPer'),e3=document.getElementById('dpName');if(e1)e1.textContent=fmt(STOPS[0][1]);if(e2)e2.textContent=fmt(STOPS[0][1]/8);if(e3)e3.textContent=STOPS[0][0]}
 var chW=sec.querySelector('.dp-chips');if(chW)chW.innerHTML=STOPS.map(function(x,i){return '<button type="button" class="dp-chip" data-i="'+i+'"><span class="dp-dot"></span><b>'+x[0].replace(/[&<>]/g,'')+'</b><em>'+KKC.t(x[2],'a')+'</em></button>'}).join('');}
function rp(f){return rv.getPointAtLength(RL*f)}
/* ---------- zastávky na řece, popisek vlevo ---------- */
var stEls=STOPS.map(function(s,i){var p=rp(FR[i]),g=E('g',{class:'dp-st',tabindex:0,role:'button','aria-label':s[0],transform:'translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')'},gS);
 E('circle',{class:'hit',r:24,fill:'transparent'},g);E('circle',{class:'ring',r:10},g);E('circle',{class:'o',r:8},g);
 var t=E('text',{x:-22,y:5.5,'text-anchor':'end'},g);t.textContent=s[0].replace(' nad Vltavou','');
 g.addEventListener('click',function(){stopAuto();select(i)});
 g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();stopAuto();select(i)}});
 return g});
/* ---------- kemp u silnice ---------- */
var cr=road.getPointAtLength(L*CAMP);
var spur=E('path',{d:'M'+cr.x.toFixed(1)+' '+cr.y.toFixed(1)+' L'+(cr.x+36).toFixed(1)+' '+cr.y.toFixed(1),stroke:'#e9dfc3',fill:'none','stroke-width':7,'stroke-linecap':'round'});
camp.parentNode.insertBefore(spur,camp);
camp.setAttribute('transform','translate('+(cr.x+46).toFixed(1)+' '+cr.y.toFixed(1)+')');
var chips=[].slice.call(sec.querySelectorAll('.dp-chip'));
chips.forEach(function(c){c.addEventListener('click',function(){stopAuto();select(+c.dataset.i)})});
/* ---------- jízda ---------- */
function fmt(n){return Math.round(n).toLocaleString('cs-CZ')+'\u00a0Kč'}
var ang=0,angT=0;
function norm(a){while(a>180)a-=360;while(a<-180)a+=360;return a}
function targetAng(f,dir){var p=road.getPointAtLength(L*f),q=road.getPointAtLength(L*Math.min(1,Math.max(0,f+.003*dir)));return Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI+90}
function place(f,dir,snap){var p=road.getPointAtLength(L*f);angT=targetAng(f,dir);
 if(snap)ang=angT;else ang+=norm(angT-ang)*.22;
 van.setAttribute('transform','translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+') rotate('+ang.toFixed(1)+')')}
function drawTrail(a,b){var pts=[],n=44;for(var k=0;k<=n;k++){var p=road.getPointAtLength(L*(a+(b-a)*k/n));pts.push(p.x.toFixed(1)+' '+p.y.toFixed(1))}trail.setAttribute('d','M'+(cr.x+34).toFixed(1)+' '+cr.y.toFixed(1)+' L'+pts.join(' L'))}
var priceObj={v:0},anim=0,sel=-1,pT=0;
function tweenPrice(to){cancelAnimationFrame(pT);var from=priceObj.v,t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/600),e=1-Math.pow(1-p,3);priceObj.v=from+(to-from)*e;
 document.getElementById('dpPrice').textContent=fmt(priceObj.v);document.getElementById('dpPer').textContent=fmt(priceObj.v/8);if(p<1)pT=requestAnimationFrame(f)})(t0)}
function select(i){if(i===sel)return;sel=i;
 stEls.forEach(function(e,k){e.classList.toggle('on',k===i)});
 chips.forEach(function(c,k){c.classList.toggle('on',k===i);c.setAttribute('aria-selected',k===i)});
 document.getElementById('dpName').textContent=STOPS[i][0];tweenPrice(STOPS[i][1]);
 {var lb=sec.querySelector('.dp-res-l');if(lb){if(lb.__t==null)lb.__t=lb.textContent;var zp=FR[i]>CAMP;lb.textContent=zp?(window.KKL?KKL.t('Vyzvedneme vás v cíli'):'Vyzvedneme vás v cíli'):lb.__t;sec.classList.toggle('dp-zpet',zp)}}
 var target=FR[i],start=CAMP,dir=target>start?1:-1,dur=Math.max(450,Math.abs(target-start)*720),t0=null;cancelAnimationFrame(anim);van.classList.remove('dp-van-idle');
 (function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,pos=start+(target-start)*e;place(pos,dir);drawTrail(start,pos);
  if(p<1)anim=requestAnimationFrame(f);else van.classList.add('dp-van-idle')})(performance.now())}
var auto=null,ai=0;function stopAuto(){clearInterval(auto);auto=null}
place(CAMP,1,true);
var reduce=!!window.KK_BEZ_ANIMACI;
function start(){select(0);if(reduce)return;ai=0;auto=setInterval(function(){ai=(ai+1)%STOPS.length;select(ai)},1400)}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){start();io.disconnect()}},{threshold:.25});io.observe(sec.querySelector('.dp-map'))}else start();
})();
;

/* ===== ubytovani-panely.js ===== */
(()=>{const w=document.getElementById('ubPanels');if(!w)return;const ps=[...w.querySelectorAll('.ubp')];
function act(p){ps.forEach(x=>{const o=x===p;x.classList.toggle('on',o);const t=x.querySelector('.ubp-tg');if(t)t.setAttribute('aria-expanded',o)})}
ps.forEach(p=>{p.addEventListener('click',e=>{if(!p.classList.contains('on')){e.preventDefault();act(p)}});const tg=p.querySelector('.ubp-tg');if(tg)tg.addEventListener('click',e=>{e.stopPropagation();act(p)})});
 /* na počítači s myší se panel otevře už najetím (krátká prodleva, aby při přejíždění neblikal) */
 if(matchMedia('(hover:hover) and (pointer:fine)').matches){let tm;ps.forEach(p=>{p.addEventListener('mouseenter',()=>{clearTimeout(tm);if(!p.classList.contains('on'))tm=setTimeout(()=>act(p),140)});p.addEventListener('mouseleave',()=>clearTimeout(tm))})}})();
;
