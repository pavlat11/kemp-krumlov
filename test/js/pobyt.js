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
 {k:'karavan',n:'Karavan',c:'#55606b',bd:'Volejte předem',bc:'call',pr:'od <strong>300 Kč</strong>',s:'místo s elektřinou',img:'img/karavan-640.webp',per:'za místo',bed:'vlastní spaní'},
 {k:'chatka',n:'Chatka',c:'#b6513e',bd:'Omezená kapacita',pr:'od <strong>890 Kč</strong>',s:'lůžkoviny, terasa',cap:7,img:'img/chatka_nova-640.webp',per:'za noc',bed:'7 lůžek'},
 {k:'teepee',n:'Teepee',c:'#d58a2c',bd:'Omezená kapacita',pr:'od <strong>700 Kč</strong>',s:'zážitek pro rodiny s dětmi',cap:4,img:'img/teepee-640.webp',per:'za noc',bed:'4 lůžka'},
 {k:'podsad',n:'Podsadový stan',c:'#2a7c86',bd:'Omezená kapacita',pr:'<strong>300 Kč</strong>',s:'už postavený, stačí přijet',cap:2,img:'img/podsadovy-640.webp',per:'za noc',bed:'2 lůžka'}];
const TYPES=KC.kat('ubytovani').filter(p=>p.rez!==0&&p.skryt!==1).map(p=>{const b=BT.find(x=>x.k===p.k)||{k:p.k,n:p.n,c:'#6b766f',bd:p.luzka?'Omezená kapacita':'',s:p.pozn||'',img:'img/kemp_reprezentativni-640.webp',per:'za noc'};
 return Object.assign({},b,{pr:prOd(p.k),cap:p.luzka||undefined,bed:p.luzka?p.luzka+' '+(p.luzka<5?'lůžka':'lůžek'):(b.bed||'vlastní spaní'),s:b.k===p.k&&BT.some(x=>x.k===p.k)?b.s:(p.pozn||'')})});
const UNIT0={stan:['Počet stanů','stan','stany','stanů'],karavan:['Počet karavanů','karavan','karavany','karavanů'],chatka:['Počet chatek','chatka','chatky','chatek'],teepee:['Počet teepee','teepee','teepee','teepee'],podsad:['Počet podsadových stanů','podsadový stan','podsadové stany','podsadových stanů']};
const UNIT=Object.assign({},UNIT0);TYPES.forEach(t=>{if(!UNIT[t.k]){const n=KL.male(KL.t(t.n));UNIT[t.k]=['Počet',n,n,n]}});
const EXTRAS=KC.kat('doplnky').filter(p=>p.rez!==0&&p.skryt!==1).map(p=>({k:p.k,n:p.n,pro:(p.pro||[]).filter(k=>TYPES.some(t=>t.k===k)),s:KC.t(p.k,'a')+(p.pozn?' / '+p.pozn.replace(/^za /,''):' / noc')}));
EXTRAS.forEach(x=>{if(!ICO[x.k])ICO[x.k]='<path d="M12 5v14M5 12h14"/>'});
const PEOPLE=[{k:'dosp',n:'Dospělí',s:'od 15 let',min:1},{k:'dite',n:'Děti',s:'do 15 let',min:0},{k:'zak',n:'Žáci a studenti',s:'zvýhodněně jen ve vlastním stanu',min:0}].filter(x=>x.k==='dosp'||!(KC.p(x.k)||{}).skryt);
/* vlastní typy osob z ceníku (např. senior, ZTP) */
const OS_VLASTNI=KC.kat('osoby').filter(p=>!['os','dite','zak'].includes(p.k)&&p.skryt!==1);
OS_VLASTNI.forEach(p=>{PEOPLE.push({k:p.k,n:p.n,s:p.pozn||'',min:0,vl:1});if(!ICO[p.k])ICO[p.k]=ICO.dosp});
const S={type:(TYPES[0]||{}).k,q:{},c:{},dosp:1,dite:0,zak:0,units:1,from:null,to:null};OS_VLASTNI.forEach(p=>S[p.k]=0);TYPES.forEach(t=>S.q[t.k]=0);EXTRAS.forEach(x=>S[x.k]=0);
S.l={kusy:{},den:'',dni:1,odkud:'',kam:'kemp',dopr:null,cas:'9:00'};S.mod=null;S.d0=null;S.nc=false;S.pr=null;S.ou=null;S.l.chci=false;S.dvM='';S.dvD='';   // mod: 'uby' | 'lod' (čím host začal), d0: den vyplutí, np/nz: noc před / po plavbě
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
const freeU=(k,n)=>{if(VYP().includes(k+'-'+n))return false;if(!S.from||!S.to)return true;for(let d=S.from;d<S.to;d=addD(d,1))if(isBusyU(k,n,d))return false;return true};
const isBusy=d=>SEL().some(t=>MISTA[t.k]?S.c[t.k].some(n=>isBusyU(t.k,n,d)):isBusyK(t.k,d));
const freeK=k=>{if(MISTA[k]){for(let n=1;n<=CNT[k];n++)if(freeU(k,n))return true;return false}if(VYP().includes(k+'-1'))return false;if(!S.from||!S.to)return true;for(let d=S.from;d<S.to;d=addD(d,1))if(isBusyK(k,d))return false;return true};
const cis=k=>MISTA[k]&&S.c[k].length?' ('+KL.t('č.')+' '+S.c[k].join(', ')+')':'';
function setCount(k,v){const c=S.c[k];while(c.length>v)c.pop();for(let n=1;c.length<v&&n<=CNT[k];n++)if(!c.includes(n)&&freeU(k,n))c.push(n);c.sort((a,b)=>a-b);S.q[k]=c.length;return c.length>=v}
const rangeFree=(a,b)=>{for(let d=a;d<b;d=addD(d,1))if(isBusy(d))return false;return true};
const canArrive=d=>d>=TODAY&&openNight(d)&&!isBusy(d);
const canDepart=d=>!!S.from&&d>S.from&&d<=endOf(S.from.getFullYear())&&rangeFree(S.from,d);
const WD=KL.den?[0,1,2,3,4,5,6].map(i=>KL.den(i)):['ne','po','út','st','čt','pá','so'],MN=KL.mesic?[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>KL.mesic(i)):['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
const fD=d=>KL.datum?KL.datum(d):d?`${WD[d.getDay()]} ${d.getDate()}. ${d.getMonth()+1}.`:'–';
const fDY=d=>d?`${d.getDate()}. ${d.getMonth()+1}. ${d.getFullYear()}`:'–';
let START;(()=>{const y=TODAY.getFullYear();let a;
 if(TODAY<D(y,OM-1,OD))a=D(y,SZ.hlavniOd,10);else if(TODAY>=addD(endOf(y),-3))a=D(y+1,SZ.hlavniOd,10);else a=addD(TODAY,7);
 START=a})();
const nightsList=()=>{const out=[];if(!S.from||!S.to)return out;for(let d=S.from;d<S.to&&out.length<120;d=addD(d,1))out.push(d);return out};

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
  b.classList.toggle('pv',!!(pending&&hover&&canDepart(hover)&&x>S.from&&x<=hover));
  b.setAttribute('aria-pressed',String(!!(same(x,S.from)||same(x,S.to))));
  b.setAttribute('aria-label',(KL.jazyk==='cs'?`${WD[x.getDay()]} ${d}. ${m}. ${y}`:x.toLocaleDateString(KL.loc,{weekday:'long',day:'numeric',month:'long',year:'numeric'}))+(!openNight(x)?' – '+KL.t('zavřeno'):''))})}
cal.addEventListener('click',e=>{
 const nav=e.target.closest('.rz-calnav');
 if(nav){view=D(view.getFullYear(),view.getMonth()+(nav.classList.contains('n')?1:-1),1);if(view<minView)view=minView;drawCal();return}
 const b=e.target.closest('.rz-d');if(!b||b.disabled)return;
 const [y,m,d]=b.dataset.d.split('-').map(Number),x=D(y,m-1,d);
 if(S.mod==='lod'){S.d0=x;S.from=x;S.to=x;hover=null;render();return}
 if(S.from&&!S.to&&canDepart(x))S.to=x;else{S.from=x;S.to=null}
 hover=null;render()});
cal.addEventListener('mouseover',e=>{const b=e.target.closest('.rz-d');if(!b||!(S.from&&!S.to))return;const [y,m,d]=b.dataset.d.split('-').map(Number);hover=D(y,m-1,d);paintCal()});
cal.addEventListener('mouseleave',()=>{if(hover){hover=null;paintCal()}});
$('rzQuick').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(!S.from){warn(KL.t('Nejdřív klikněte v kalendáři na den příjezdu.'));return}const t=addD(S.from,+b.dataset.n);
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
 c.innerHTML=`<span class="ic">${SV(ICO[r.k])}</span><span class="tx"><b>${r.n}</b><small>${r.s}</small></span>`;
 r.st=stepper(()=>S[r.k],v=>{S[r.k]=v;fitUnits()},()=>r.min,30);c.append(r.st);r.el=c;$('rzPeople').append(c)});

/* ---------- ubytování ---------- */
TYPES.forEach(t=>{const b=document.createElement('div');b.className='rz-row';b.style.setProperty('--c',t.c);
 b.innerHTML=`<span class="ph" style="background-image:url(${t.img})"><i class="n"></i></span><span class="tx"><b>${t.n}</b><small>${t.s}</small><span class="tg"><em>${t.bed}</em><em class="bd ${t.bc||''}">${t.bd}</em></span></span><span class="rt"><span class="pr">${t.per}<strong>${t.pr.replace(/<\/?strong>/g,'')}</strong></span></span>`;
 const st=stepper(()=>S.q[t.k],v=>{if(v>S.q[t.k]&&!freeK(t.k)){warn(KL.t(t.n)+' '+KL.t('je ve vybraném termínu obsazená, zkuste jiné ubytování.'));return}if(MISTA[t.k]){if(!setCount(t.k,v))warn(KL.t('Více volných míst tohoto typu ve vašem termínu nemáme.'));t.open=true}else S.q[t.k]=v;if(t.k==='karavan'&&v&&('elek' in S)&&!S.elek)S.elek=1},()=>0,MAXQ[t.k]||20);b.querySelector('.rt').append(st);t.st=st;
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
function setType(k){const t=TYPES.find(x=>x.k===k);if(!t)return;TYPES.forEach(x=>{S.q[x.k]=0;if(S.c[x.k])S.c[x.k]=[]});const q=Math.min(MAXQ[k]||20,t.cap?Math.max(1,Math.ceil(persons()/t.cap)):1);if(MISTA[k]){setCount(k,q);t.open=true}else S.q[k]=q;if(k==='karavan'&&('elek' in S)&&!S.elek)S.elek=1;render()}
const uWrap=$('rzUnits');uWrap.hidden=true;

/* ---------- doplňky ---------- */
EXTRAS.forEach(x=>{const c=document.createElement('div');c.className='rz-x';c.tabIndex=0;c.setAttribute('role','checkbox');
 c.innerHTML=`<span class="tg"></span><span class="ic">${SV(ICO[x.k])}</span><b>${x.n}</b><small>${x.s}</small>`;
 x.st=stepper(()=>S[x.k],v=>{S[x.k]=v},()=>1,9);c.append(x.st);
 const tog=()=>{if(c.classList.contains('ne'))return;S[x.k]=S[x.k]?0:1;render()};
 if(x.pro.length){const n=document.createElement('em');n.className='rz-xne';n.textContent=KL.t('Jen k:')+' '+x.pro.map(k=>KL.t((TYPES.find(t=>t.k===k)||{}).n||k)).join(', ');c.append(n)}
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
const doprObj=()=>{if(S.l.dopr!==true)return null;if(nLodi())return S.l.odkud!=='kemp'?{misto:S.l.odkud,osob:persons(),cas:S.l.cas,den:S.l.den}:null;return S.dvM&&S.dvD?{misto:S.dvM,osob:persons(),cas:S.l.cas,den:S.dvD}:null};
const stayDays=()=>{const o=[];if(!S.from||!S.to)return o;for(let d=S.from;d<=S.to&&o.length<60;d=addD(d,1))o.push(d);return o};
const lodDays=()=>{const o=[];if(S.mod==='lod')return S.d0?[S.d0]:o;if(!S.from||!S.to)return o;for(let d=S.from;d<=S.to&&o.length<60;d=addD(d,1))o.push(d);return o};
const lodMaxDni=()=>{if(S.mod==='lod'||denMod())return 14;const a=lodDays(),i=a.findIndex(d=>iso(d)===S.l.den);return Math.max(1,a.length-Math.max(0,i))};
const lodFree=()=>KR&&S.l.den?KR.lodeVolno(S.l.den,S.l.dni):{};
const rIdx=k=>REKA.findIndex(x=>x.k===k);
function lodFix(){const a=lodDays();if(!a.length){S.l.den='';return}
 if(!a.some(d=>iso(d)===S.l.den))S.l.den=iso(a[denMod()?0:Math.min(1,a.length-1)]);
 S.l.dni=Math.max(1,Math.min(S.l.dni,lodMaxDni()));
 if(rIdx(S.l.odkud)<0)S.l.odkud=(REKA[0]||{}).k||'';if(rIdx(S.l.odkud)>=REKA.length-1)S.l.odkud=(REKA[REKA.length-2]||REKA[0]||{}).k;
 if(rIdx(S.l.kam)<=rIdx(S.l.odkud))S.l.kam=rIdx('kemp')>rIdx(S.l.odkud)?'kemp':REKA[rIdx(S.l.odkud)+1].k;
 const v=lodFree();LODE.forEach(p=>{if(S.l.kusy[p.k]>Math.max(0,v[p.k]||0))S.l.kusy[p.k]=Math.max(0,v[p.k]||0)})}
const lodW=$('rzLode');let lodOk=false;
if(lodW&&LODE.length&&REKA.length>1){lodOk=true;const t=x=>KL.t(x);
 const FA='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',nbK=(k,ico,nad,body)=>`<button type="button" class="rz-nb ${k}" data-nb="${k}" aria-pressed="false"><span class="rz-nb-t"><span class="ic">${ico}</span><span class="cn"><small>${t('od')}</small><b id="rzNbC-${k}"></b><i id="rzNbJ-${k}"></i></span></span><b class="nd">${t(nad)}</b><span class="pr" id="rzNbP-${k}"></span><ul>${body.map(x=>`<li>${FA}${t(x)}</li>`).join('')}</ul><span class="cta"><span class="a0">${t('Přidat k rezervaci')} +</span><span class="a1">${FA}${t('Přidáno')}</span></span></button>`;
 lodW.innerHTML=`<div class="rz-nab" id="rzNab">${nbK('lod','<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 28c6 7 32 7 38 0M10 28l5-11h18l5 11M24 17V8M24 8l7 4-7 3M6 40c3 2 6 2 9 0s6-2 9 0 6 2 9 0 6-2 9 0"/></svg>','Sjeďte si Vltavu na lodi',['Pádla, vesty a barel v ceně','Lodě vám přivezeme na start','Končit můžete přímo v kempu'])}${nbK('dop','<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 32V14h24v18M28 20h9l7 8v4H28"/><circle cx="13" cy="34" r="4"/><circle cx="35" cy="34" r="4"/><path d="M9 20h6M19 20h4"/></svg>','Odvezeme vás na start',['Auto necháte v kempu','Vyjedeme v čas, který si vyberete','Až 8 osob v jednom autě'])}</div>
  <div class="rz-lod-l" id="rzLodL"></div><div class="rz-lod-o" id="rzLodO" hidden>
  <label class="rz-lf"><span>${t('Den vyplutí')}</span><select id="rzLden"></select></label>
  <div class="rz-lf"><span>${t('Na kolik dní')}</span><div id="rzLdni"></div></div>
  <label class="rz-lf"><span>${t('Odkud poplujete')}</span><select id="rzLod"></select></label>
  <label class="rz-lf"><span>${t('Kde skončíte')}</span><select id="rzLkam"></select></label>
  <p class="rz-lod-i" id="rzLodI"></p></div>`;
 LODE.forEach(p=>{const c=document.createElement('div');c.className='rz-lod';
  c.innerHTML=`<span class="tx"><b>${KL.t(p.n)}</b><small>${p.pozn?KL.t(p.pozn):''}</small><em class="fr"></em></span><span class="pr"><strong>${KC.fmt(+p.a||0)} Kč</strong><small>${t('za den')}${p.b!=null&&+p.b!==+p.a?' · '+t('od 3 dnů')+' '+KC.fmt(+p.b)+' Kč':''}</small></span>`;
  p.st=stepper(()=>S.l.kusy[p.k],v=>{const b=S.l.kusy[p.k];if(v>b&&v>Math.max(0,lodFree()[p.k]||0)){warn(t('Víc lodí tohoto typu na tento den už nemáme.'));return}
   S.l.kusy[p.k]=v;if(v>b&&KR.lodeChybi(lodeObj()).length){S.l.kusy[p.k]=b;warn(t('Na tento den už nemáme dost pádel nebo vest. Zavolejte nám, zkusíme to vyřešit.'))}},()=>0,99);
  c.append(p.st);p.el=c;$('rzLodL').append(c)});
 const dniSt=stepper(()=>S.l.dni,v=>{S.l.dni=Math.min(v,lodMaxDni())},()=>1,14);$('rzLdni').append(dniSt);lodW.dniSt=dniSt;
 $('rzLden').addEventListener('change',e=>{S.l.den=e.target.value;render()});
 $('rzLod').addEventListener('change',e=>{S.l.odkud=e.target.value;render()});
 $('rzLkam').addEventListener('change',e=>{S.l.kam=e.target.value;render()});
 $('rzNab').addEventListener('click',e=>{const b=e.target.closest('[data-nb]');if(!b)return;
  if(b.dataset.nb==='lod'){S.l.chci=!S.l.chci;if(!S.l.chci)LODE.forEach(p=>S.l.kusy[p.k]=0)}else S.l.dopr=S.l.dopr===true?false:true;render();
  if(b.dataset.nb==='lod'&&S.l.chci)setTimeout(()=>$('rzLodL').scrollIntoView({behavior:'smooth',block:'nearest'}),80)})
}
else if(lodW){lodW.innerHTML='<p class="rz-norez">'+KL.t('Lodě si domluvte telefonicky.')+'</p>'}
{const tx=(id,q)=>{const e=q?root.querySelector(q):$(id);if(e)e.textContent=KL.t(e.textContent.trim())};['rzLodH','rzLodS','rzSumLodT','rzVolH','rzVolS','rzDvH','rzDvS'].forEach(i=>tx(i));root.querySelectorAll('.rz-vc b,.rz-vc small,.rz-vc em').forEach(e=>{e.textContent=KL.t(e.textContent.trim())})}
const dvW=$('rzDopr');
if(dvW){const VAN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 16V7h12v9M14 10h4l4 4v2h-8"/><circle cx="6.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/></svg>',CAR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 17h14v-5l-2-5H7l-2 5zM5 12h14"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></svg>';
 dvW.innerHTML=`<div class="rz-dv-tr" id="rzDvTr"></div><div class="rz-dv-o" role="radiogroup"><button type="button" class="rz-dv-c ano" role="radio" data-dv="1"><span class="ic">${VAN}</span><b>${KL.t('Ano, odvezte nás')}</b><small id="rzDvP"></small><em id="rzDvK"></em></button><button type="button" class="rz-dv-c ne" role="radio" data-dv="0"><span class="ic">${CAR}</span><b>${KL.t('Ne, dopravíme se sami')}</b><small>${KL.t('Na start přijedeme vlastním autem.')}</small><em>0 Kč</em></button></div>
 <div class="rz-dv-cas" id="rzDvC"><div class="rz-dv-kam" id="rzDvKam"><label class="rz-lf"><span>${KL.t('Kam vás odvezeme')}</span><select id="rzDvM"></select></label><label class="rz-lf"><span>${KL.t('Který den')}</span><select id="rzDvD"></select></label></div><b>${KL.t('V kolik chcete vyrazit z kempu?')}</b><div>${[8,9,10,11,12,13,14].map(h=>[h+':00',h+':30']).flat().map(c=>`<button type="button" data-cas="${c}">${c}</button>`).join('')}</div></div><p class="rz-dv-n" id="rzDvN"></p>`;
 dvW.addEventListener('change',e=>{if(e.target.id==='rzDvM')S.dvM=e.target.value;if(e.target.id==='rzDvD')S.dvD=e.target.value;render()});
 dvW.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.dv){S.l.dopr=b.dataset.dv==='1';render()}else if(b.dataset.cas){S.l.cas=b.dataset.cas;render()}})}
function dopRender(){if(!dvW||!lodOk)return;const sL=nLodi()>0,RK=REKA.filter(x=>x.k!=='kemp');
 if(!sL){if(!RK.some(x=>x.k===S.dvM))S.dvM=(RK[0]||{}).k||'';const sd=stayDays();if(!sd.some(d=>iso(d)===S.dvD))S.dvD=sd.length?iso(sd[Math.min(1,sd.length-1)]):'';
  setOpts($('rzDvM'),RK.map(x=>`<option value="${x.k}">${KL.t(x.n)} · ${fmt(x.cena*KR.aut(persons()))}</option>`).join(''));$('rzDvM').value=S.dvM;
  setOpts($('rzDvD'),sd.map(d=>`<option value="${iso(d)}">${fD(d)}</option>`).join(''));$('rzDvD').value=S.dvD}
 $('rzDvKam').hidden=sL;
 const zK=sL&&S.l.odkud==='kemp',m=(sL?REKA[rIdx(S.l.odkud)]:REKA.find(x=>x.k===S.dvM))||{},a=KR.aut(persons()),ano=S.l.dopr===true&&!zK,c1=dvW.querySelector('[data-dv="1"]'),c0=dvW.querySelector('[data-dv="0"]');
 $('rzDvTr').innerHTML=`<span>${KL.t('Kemp Krumlov')}</span><i aria-hidden="true">→</i><b>${KL.t(m.n||'')}</b><small>${persons()} ${plural(persons(),'osoba','osoby','osob')}</small>`;
 c1.disabled=zK;c1.classList.toggle('on',ano);c1.setAttribute('aria-checked',ano);c0.classList.toggle('on',S.l.dopr===false||zK);c0.setAttribute('aria-checked',S.l.dopr===false||zK);
 $('rzDvP').textContent=zK?KL.t('Vyplouváte přímo z kempu, doprava není potřeba.'):`${a} ${plural(a,'auto','auta','aut')} ${KL.t('pro')} ${persons()} ${plural(persons(),'osoba','osoby','osob')}`;$('rzDvK').textContent=zK?'':'+ '+fmt((m.cena||0)*a);
 $('rzDvC').hidden=!ano;dvW.querySelectorAll('[data-cas]').forEach(b=>{const o=b.dataset.cas===S.l.cas;b.classList.toggle('on',o);b.setAttribute('aria-pressed',o)});
 const dd=sL?S.l.den:S.dvD,dx=dd?lodDays().concat(stayDays()).find(d=>iso(d)===dd):null;
 $('rzDvN').textContent=ano?`${KL.t('Odjezd z kempu')} ${dx?fD(dx)+' ':''}${KL.t('v')} ${S.l.cas} · ${KL.t(m.n||'')}`:''}
/* režim Lodě: nocleh – host si vybere příjezd a odjezd (libovolný počet nocí) */
const nocW=$('rzNoci'),nocOk=d=>d>=TODAY&&openNight(d);
if(nocW){nocW.innerHTML=`<button type="button" class="rz-nb" data-nc="1" aria-pressed="false"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5"/></svg></span><span class="tx"><b>${KL.t('Ano, chci u vás přespat')}</b><small>${KL.t('Chatka, teepee, stan nebo karavan – na jednu i více nocí.')}</small></span><em class="ck" aria-hidden="true"></em></button>
 <div class="rz-nc-d" id="rzNcD"><label class="rz-lf"><span>${KL.t('Příjezd')}</span><select id="rzNcP"></select></label><label class="rz-lf"><span>${KL.t('Odjezd')}</span><select id="rzNcO"></select></label><p class="rz-nc-i" id="rzNcI"></p></div>`;
 nocW.addEventListener('click',e=>{const b=e.target.closest('[data-nc]');if(!b)return;S.nc=!S.nc;if(S.nc&&!S.pr){const p=addD(S.d0,-1);S.pr=nocOk(p)?p:S.d0;S.ou=addD(S.pr,1)}if(!S.nc){TYPES.forEach(t=>{S.q[t.k]=0;if(S.c[t.k])S.c[t.k]=[]});EXTRAS.forEach(x=>{S[x.k]=0})}render()});
 nocW.addEventListener('change',e=>{const v=e.target.value.split('-'),d=new Date(+v[0],v[1]-1,+v[2]);if(e.target.id==='rzNcP'){S.pr=d;if(!(S.ou>S.pr))S.ou=addD(d,1)}else S.ou=d;render()})}
const nocChyba=()=>{if(!S.nc||!S.pr||!S.ou)return '';for(let d=S.pr;d<S.ou;d=addD(d,1))if(!nocOk(d))return KL.t('V tomto termínu máme zavřeno nebo je to v minulosti. Vyberte prosím jiné noci.');return ''};
function nocRender(){if(!nocW)return;const lod=S.mod==='lod';nocW.hidden=!lod;const ty=$('rzTypes'),nr=root.querySelector('.rz-norez');if(ty)ty.hidden=lod&&!S.nc;if(nr&&nr.parentNode===ty.parentNode)nr.hidden=lod;if(!lod||!S.d0)return;
 const b=nocW.querySelector('[data-nc]');b.classList.toggle('on',S.nc);b.setAttribute('aria-pressed',S.nc);$('rzNcD').hidden=!S.nc;if(!S.nc)return;
 const last=addD(S.d0,S.l.dni-1),pa=[],po=[];for(let d=addD(S.d0,-14);d<=addD(last,7);d=addD(d,1))if(d>=TODAY)pa.push(d);for(let d=addD(S.pr,1);d<=addD(S.pr,21);d=addD(d,1))po.push(d);
 setOpts($('rzNcP'),pa.map(d=>`<option value="${iso(d)}">${fD(d)}${same(d,S.d0)?' · '+KL.t('den vyplutí'):''}</option>`).join(''));$('rzNcP').value=iso(S.pr);
 setOpts($('rzNcO'),po.map(d=>`<option value="${iso(d)}">${fD(d)}${same(d,last)?' · '+KL.t('návrat z vody'):''}</option>`).join(''));$('rzNcO').value=iso(S.ou);
 const n=Math.round((S.ou-S.pr)/864e5),ch=nocChyba();$('rzNcI').textContent=ch||`${n} ${plural(n,'noc','noci','nocí')}`;$('rzNcI').classList.toggle('zle',!!ch)}
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
 setOpts($('rzLden'),lodDays().map(d=>`<option value="${iso(d)}">${fD(d)}</option>`).join(''));$('rzLden').value=S.l.den;$('rzLden').disabled=S.mod==='lod';
 lodW.dniSt.upd();
 setOpts($('rzLod'),REKA.slice(0,-1).map(x=>`<option value="${x.k}">${KL.t(x.n)}</option>`).join(''));$('rzLod').value=S.l.odkud;
 setOpts($('rzLkam'),REKA.filter((x,i)=>i>oi).map(x=>`<option value="${x.k}">${KL.t(x.n)}</option>`).join(''));$('rzLkam').value=S.l.kam;
 const cl=KR.cenaLodi(lodeObj());$('rzLodI').textContent=`${KL.t('V ceně jsou pádla, vesty a barely.')} ${KL.t('Návoz lodí')}: ${fmt(cl.navoz)} ${KL.t('jednorázově')}.`}
const lodeTxt=()=>{const l=lodeObj();if(!l)return '';const d=lodDays().find(x=>iso(x)===l.den);return LODE.filter(p=>l.kusy[p.k]).map(p=>`${l.kusy[p.k]}× ${KL.male(KL.t(p.n))}`).join(', ')+` · ${d?fD(d):''}${l.dni>1?' ('+l.dni+' '+plural(l.dni,'den','dny','dní')+')':''} · ${KL.t(KR.mistoN(l.odkud))} → ${KL.t(KR.mistoN(l.kam))}`};
const doprTxt=()=>{const d=doprObj();if(!d)return '';const a=KR.aut(d.osob);return `${KL.t(KR.mistoN(d.misto))}, ${d.cas} · ${a} ${plural(a,'auto','auta','aut')}`};

/* ---------- výpočet ---------- */
function compute(){const nights=nightsList(),L=[],sk={},qk={};let sum=0;
 const add=(label,key,qty)=>{if(!qty)return;let v=0;nights.forEach(d=>v+=P[key][isHi(d)?0:1]*qty);qk[key]=(qk[key]||0)+qty;if(v){L.push([label,v]);sum+=v;sk[key]=(sk[key]||0)+v}};
 SEL().forEach(x=>{const u=UNIT[x.k],q=S.q[x.k];add(`${q}× ${plural(q,u[1],u[2],u[3])}${cis(x.k)}`,x.k,q)});
 const ad=S.dosp+(!onlyStan()?S.zak:0);
 add(`${ad}× ${plural(ad,'dospělý','dospělí','dospělých')}`,'os',ad);
 add(`${S.dite}× ${plural(S.dite,'dítě','děti','dětí')}`,'dite',S.dite);
 if(onlyStan())add(`${S.zak}× ${plural(S.zak,'žák','žáci','žáků')}`,'zak',S.zak);
 OS_VLASTNI.forEach(p=>add(`${S[p.k]||0}× ${KL.male(KL.t(p.n))}`,p.k,S[p.k]||0));
 EXTRAS.forEach(x=>add(`${S[x.k]}× ${KL.male(KL.t(x.n))}`,x.k,S[x.k]));
 const n=nights.length,lo=lodeObj(),L2=[],cl=lo?KR.cenaLodi(lo):{navoz:0,celkem:0},dp=doprObj(),cd=dp?KR.cenaDopravy(dp):0;
 /* slevy podle ceníku – z ubytování, případně i z lodí a dopravy */
 const SL=KC.slevaPobyt?KC.slevaPobyt({noci:n,q:qk,sumK:sk,od:n?iso(nights[0]):(lo?lo.den:''),lodi:lo?Object.values(lo.kusy).reduce((a,b)=>a+(+b||0),0):0,lode:cl.celkem,dop:cd}):{kc:0,nazev:'',proc:0},dv=SL.kc,disc=sum?dv/sum:0,discN=SL.nazev,discP=SL.proc;
 if(lo){LODE.forEach(p=>{const q=lo.kusy[p.k];if(q)L2.push([`${q}× ${KL.male(KL.t(p.n))}${lo.dni>1?' · '+lo.dni+' '+plural(lo.dni,'den','dny','dní'):''}`,q*KC.lod(p.k,lo.dni)*lo.dni])});if(cl.navoz)L2.push([KL.t('Návoz lodí'),cl.navoz])}
 if(cd)L2.push([`${KL.t('Doprava osob')} – ${KL.t(KR.mistoN(dp.misto))}`,cd]);
 const total=sum-dv+cl.celkem+cd;
 return{nights,n,L,L2,sum,disc,dv,discN,discP,lode:cl.celkem,dopr:cd,total,zal:KR&&KR.zalohaCastka?KR.zalohaCastka(Math.round(total)):0}}

/* plynulé počítání ceny */
const tw={};function tween(el,to){const o=tw[el.id]||(tw[el.id]={v:0,a:0});cancelAnimationFrame(o.a);const from=o.v,t0=performance.now(),dur=false?1:550;
 const f=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);o.v=from+(to-from)*e;el.textContent=fmt(o.v);if(p<1)o.a=requestAnimationFrame(f)};o.a=requestAnimationFrame(f)}

let R,warnT;
function warn(msg){const w=$('rzWarn');w.textContent=msg;w.hidden=!msg;clearTimeout(warnT);if(msg)warnT=setTimeout(()=>{w.hidden=true},6000)}
const extrasTxt=()=>EXTRAS.filter(x=>S[x.k]).map(x=>`${S[x.k]>1?S[x.k]+'× ':''}${KL.male(KL.t(x.n))}`).join(', ');
const peopleTxt=()=>{const a=[`${S.dosp} ${plural(S.dosp,'dospělý','dospělí','dospělých')}`];if(S.dite)a.push(`${S.dite} ${plural(S.dite,'dítě','děti','dětí')}`);if(S.zak)a.push(`${S.zak} ${plural(S.zak,'žák','žáci','žáků')}`);OS_VLASTNI.forEach(p=>{if(S[p.k])a.push(`${S[p.k]}× ${KL.male(KL.t(p.n))}`)});return a.join(', ')};
const typeTxt=()=>SEL().map(t=>`${S.q[t.k]}× ${KL.male(KL.t(t.n))}${cis(t.k)}`).join(', ')||(denMod()?KL.t('bez noclehu'):'nevybráno');
const dateTxt=()=>S.mod==='lod'?(S.d0?`${fD(S.d0)}${S.l.dni>1?' – '+fD(addD(S.d0,S.l.dni-1)):''} · ${KL.t('lodě')}${R.n?' · '+R.n+' '+plural(R.n,'noc','noci','nocí'):''}`:KL.t('vyberte den')):!S.from?'vyberte termín':denMod()?`${fD(S.from)} · ${KL.t('bez noclehu')}`:S.from&&S.to?`${fD(S.from)} – ${fD(S.to)} · ${R.n} ${plural(R.n,'noc','noci','nocí')}`:'vyberte odjezd';

/* doplněk jen k určitému ubytování (ceník: pro) – jinak zašedlý */
function xLimit(){const selT=SEL().map(t=>t.k);EXTRAS.forEach(x=>{const ne=x.pro.length&&selT.length&&!selT.some(k=>x.pro.includes(k));if(ne&&S[x.k])S[x.k]=0;x.el.classList.toggle('ne',!!ne);x.el.setAttribute('aria-disabled',!!ne);x.el.tabIndex=ne?-1:0})}
function render(){Object.keys(MISTA).forEach(k=>{S.c[k]=S.c[k].filter(n=>freeU(k,n));if(k in S.q)S.q[k]=S.c[k].length});lodMod();if(denMod()){TYPES.forEach(t=>{S.q[t.k]=0;if(S.c[t.k])S.c[t.k]=[]});EXTRAS.forEach(x=>{S[x.k]=0})}lodFix();xLimit();R=compute();lodRender();dopRender();nocRender();const pending=S.from&&!S.to;if(S.to&&!$('rzWarn').hidden)warn(KL.t(''));
 paintCal();
 $('rzFromT').textContent=S.from?fD(S.from):'vyberte';$('rzFromT').classList.toggle('wait',!S.from);
 const toT=$('rzToT');toT.textContent=S.to?fD(S.to):S.from?'vyberte':'–';toT.classList.toggle('wait',!!pending);
 $('rzN').textContent=R.n;$('rzNl').textContent=plural(R.n,'noc','noci','nocí');
 root.querySelectorAll('#rzQuick button').forEach(b=>b.classList.toggle('on',!!S.to&&+b.dataset.n===R.n));
 PEOPLE.forEach(r=>{r.st.upd();r.el.classList.toggle('has',S[r.k]>0)});
 TYPES.forEach(x=>{const q=S.q[x.k],fr=freeK(x.k);x.el.classList.toggle('on',q>0);x.el.classList.toggle('busy',!fr);x.el.querySelector('.tx b').dataset.obs=fr?'':KL.t('Plná kapacita – ve vašem termínu obsazeno');x.el.querySelector('.n').textContent=q?q+'×':'';x.st.upd()});
 $('rzTNote').hidden=true;
 TYPES.forEach(t=>{if(!t.pick)return;const c=S.c[t.k],o=!!(t.open||c.length);t.pick.hidden=!o;t.tg.setAttribute('aria-expanded',o);
  t.tg.textContent=c.length?KL.t('č.')+' '+c.join(', '):KL.t(t.k==='chatka'?'Vybrat číslo chatky':'Vybrat číslo stanu');
  t.cns.forEach(x=>{const n=+x.dataset.n,s=c.includes(n),f=freeU(t.k,n);x.disabled=!f;x.classList.toggle('on',s);x.setAttribute('aria-pressed',s);x.setAttribute('aria-label',KL.t(t.n)+' '+n+(f?'':', '+KL.t('obsazeno')))})});
 EXTRAS.forEach(x=>{x.el.classList.toggle('on',S[x.k]>0);x.el.setAttribute('aria-checked',S[x.k]>0);x.st.upd()});
 /* souhrn */
 const hiN=R.nights.filter(isHi).length,se=$('rzSeason');
 se.textContent=!R.n||KC.jednaCena?'Termín':hiN===R.n?'Sezóna':hiN===0?'Mimo sezónu':'Sezóna + mimo';se.classList.toggle('lo',R.n>0&&hiN===0&&!KC.jednaCena);
 if(!S.to){$('rzTotal').textContent='— Kč';delete tw.rzTotal;$('rzBarTotal').textContent='—';delete tw.rzBarTotal;$('rzPer').textContent=pending?'Vyberte v kalendáři den odjezdu':'Cenu uvidíte po výběru termínu'}
 else{tween($('rzTotal'),R.total);tween($('rzBarTotal'),R.total);$('rzPer').textContent=R.lode||R.dopr?'':persons()&&R.n?`≈ ${fmt(R.total/persons()/R.n)} ${KL.t('na osobu a noc')}`:''}
 const d=$('rzDisc');d.hidden=!R.disc;d.textContent=R.dv?`${KL.t('Sleva')}${R.discP?' '+R.discP+' %':''} · ${KL.t('ušetříte')} ${fmt(R.dv)}`:'';
 $('rzSumDate').textContent=dateTxt();$('rzSumPeople').textContent=peopleTxt();$('rzSumType').textContent=typeTxt();$('rzSumExtras').textContent=extrasTxt()||'žádné';
 $('rzSumLode').textContent=[lodeTxt(),doprTxt()?KL.t('doprava osob')+' – '+doprTxt():''].filter(Boolean).join(' + ')||KL.t('žádné');
 {const z=$('rzZal'),u=!!(S.to&&R.zal&&R.total);z.hidden=!u;z.textContent=u?(R.zal>=Math.round(R.total)?`${KL.t('Platí se předem převodem')}: ${fmt(R.zal)}`:`${KL.t('Záloha předem')} ${fmt(R.zal)} · ${KL.t('zbytek na místě')} ${fmt(R.total-R.zal)}`):''}
 $('rzLines').innerHTML=!S.to?'<li><span>Vyberte termín</span><em>–</em></li>':R.L.map(([l,v])=>`<li><span>${l}</span><em>${fmt(v)}</em></li>`).join('')+R.L2.map(([l,v])=>`<li><span>${l}</span><em>${fmt(v)}</em></li>`).join('')+(R.dv?`<li class="minus"><span>${KL.t('Sleva')}${R.discP?' '+R.discP+' %':''}${R.discN?' · '+KL.t(R.discN):''}</span><em>−${fmt(R.dv)}</em></li>`:'')||'<li><span>Vyberte termín</span><em>–</em></li>';
 /* skrytá pole pro odeslání */
 const f=form.elements,set=(n,v)=>{f[n].value=v};
 set('prijezd',iso(S.from));set('odjezd',iso(S.to));set('noci',R.n);set('ubytovani',typeTxt());set('pocet_jednotek',SEL().reduce((a,t)=>a+S.q[t.k],0));
 set('dospeli',S.dosp);set('deti',S.dite);set('zaci',S.zak);set('doplnky',extrasTxt()||'žádné');set('cena',R.total);set('lode',lodeTxt());set('doprava',doprTxt());set('zaloha',R.zal||'');
 set('souhrn',summaryText());
 navState()}
function summaryText(){return `${S.mod==='lod'&&S.d0?'Den vyplutí: '+fDY(S.d0)+(R.n?'\nNocleh: '+fDY(S.from)+' – '+fDY(S.to)+' ('+R.n+' '+plural(R.n,'noc','noci','nocí')+')':''):'Termín: '+fDY(S.from)+' – '+fDY(S.to)+' ('+R.n+' '+plural(R.n,'noc','noci','nocí')+')'}\nOsoby: ${peopleTxt()}\nUbytování: ${typeTxt()}\nDoplňky: ${extrasTxt()||'žádné'}${lodeTxt()?'\nLodě: '+lodeTxt():''}${doprTxt()?'\nDoprava osob: '+doprTxt():''}\nOrientační cena: ${fmt(R.total)}${R.disc?` (vč. slevy ${Math.round(R.disc*100)} %)`:''}${R.zal?'\nZáloha předem: '+fmt(R.zal):''}${KL.jazyk!=='cs'?'\nJazyk webu: '+KL.jazyk.toUpperCase():''}`}

/* ---------- kroky / průvodce ----------
   Host na začátku zvolí, čím začne (S.mod). Druhou část mu průvodce nabídne na konci, dopravu úplně nakonec:
   ubytování: termín → kdo → ubytování → doplňky → lodě (nabídka) → doprava (jen s loděmi) → kontakt
   lodě:      den → kdo → lodě → nocleh (nabídka) → doplňky (jen s noclehem) → doprava → kontakt */
const steps=[...root.querySelectorAll('.rz-step')],SK={};steps.forEach(s=>SK[s.dataset.k]=s);
const LBL={termin:'Termín',kdo:'Kdo jede',uby:'Ubytování',ext:'Doplňky',lode:'Lodě a doprava',doprava:'Doprava',kontakt:'Kontakt'};
const seq=()=>!S.mod?['volba']:S.mod==='lod'?['volba','termin','kdo','lode','uby'].concat(SEL().length?['ext']:[],['doprava','kontakt']):['volba','termin','kdo','uby','ext','lode','doprava','kontakt'];
const progW=root.querySelector('.rz-prog'),mq=matchMedia('(max-width:900px)');let cur='volba';
const wiz=()=>true;
const HD0={};['termin','uby','lode'].forEach(k=>{const h=SK[k].querySelector('.rz-sh');HD0[k]=[h.querySelector('b').textContent,h.querySelector('small').textContent]});
const HDL={termin:['Kdy chcete vyplout?','Klikněte v kalendáři na den vyplutí. Počet dní nastavíte u lodí.'],uby:['Chcete u nás i přespat?','Nepovinné. Vyberte, kdy přijedete a kdy odjedete – klidně na víc nocí.'],lode:['Jaké lodě si půjčíte?','Pádla, vesty i barely jsou v ceně.']};
const HDU={lode:['Chcete si k pobytu půjčit lodě nebo objednat dopravu?','Nepovinné. Lodě, pádla, vesty i barely pro vás zarezervujeme na daný den.']};const HDLx={lode:'Lodě'};
function navState(){const q=seq();if(!q.includes(cur))cur=q[q.length-1];const i=q.indexOf(cur),last=cur==='kontakt',p=q.slice(1),sig=p.join()+KL.jazyk+S.mod;
 if(progW.__s!==sig){progW.__s=sig;progW.innerHTML=p.map((k,j)=>`<button type="button" data-k="${k}"><i>${j+1}</i><span>${KL.t(S.mod==='lod'&&HDLx[k]||LBL[k])}</span></button>`).join('')}
 [...progW.children].forEach((b,j)=>{const on=b.dataset.k===cur;b.classList.toggle('on',on);b.classList.toggle('done',j<i-1);b.setAttribute('aria-current',on?'step':'false')});
 progW.hidden=cur==='volba';
 root.classList.add('wiz');root.classList.toggle('last',last);root.classList.toggle('mod-lod',S.mod==='lod');root.classList.toggle('na-volbe',cur==='volba');
 steps.forEach(s=>{const k=s.dataset.k;s.classList.toggle('on',k===cur);const n=s.querySelector('.rz-num'),ix=q.indexOf(k);if(n&&ix>0)n.textContent=ix;
  const H=(S.mod==='lod'?HDL[k]:HDU[k])||HD0[k];if(H){const h=s.querySelector('.rz-sh');h.querySelector('b').textContent=KL.t(H[0]);h.querySelector('small').textContent=KL.t(H[1])}});
 root.querySelectorAll('#rzVolba .rz-vc').forEach(b=>b.classList.toggle('on',b.dataset.mod===S.mod));
 $('rzBack').hidden=i===0;$('rzNext').hidden=cur==='volba';const nx=q[i+1];
 $('rzNext').innerHTML=last?(innerWidth>900?KL.t('Odeslat poptávku')+' →':KL.t('Odeslat')+' →'):(innerWidth>900?KL.t('Pokračovat:')+' '+KL.t(S.mod==='lod'&&HDLx[nx]||LBL[nx]||'')+' →':KL.t('Další')+' →');$('rzNext').removeAttribute('aria-label')}
function nudge(){const c=$('rzCal');c.classList.remove('nudge');void c.offsetWidth;c.classList.add('nudge')}
function stepOk(k){
 if(k==='volba')return !!S.mod;
 if(k==='termin'){if(S.mod==='lod'){if(!S.d0){warn(KL.t('Vyberte v kalendáři den vyplutí.'));nudge();return false}return true}
  if(!S.to||denMod()){warn(S.from&&!denMod()?'Vyberte v kalendáři den odjezdu.':'Vyberte v kalendáři den příjezdu a odjezdu.');nudge();return false}return true}
 if(k==='uby'){if(S.mod==='uby'&&!SEL().length){warn(KL.t('Vyberte prosím aspoň jedno ubytování.'));return false}
  if(S.mod==='lod'&&S.nc){const ch=nocChyba();if(ch){warn(ch);return false}if(!SEL().length){warn(KL.t('Vyberte prosím ubytování, nebo zrušte „Ano, chci u vás přespat“.'));return false}}
  if(SEL().length&&!bedsOk()){warn(KL.t('Ještě nemají všichni kde spát – přidejte chatku, teepee nebo vlastní stan.'));return false}}
 if(k==='lode'&&S.mod==='lod'&&!nLodi()){warn(KL.t('Vyberte prosím aspoň jednu loď.'));return false}
 if(k==='lode'&&S.mod==='uby'&&S.l.chci&&!nLodi()){warn(KL.t('Vyberte počet lodí, nebo zrušte „Chci si půjčit lodě“.'));return false}
 if(k==='doprava'&&S.l.dopr===null&&!(nLodi()&&S.l.odkud==='kemp')){warn(KL.t('Vyberte prosím, jestli chcete dopravu.'));return false}
 return true}
function go(k,scroll=true){let q=seq();if(!q.includes(k))return;let i=q.indexOf(cur),n=q.indexOf(k);
 if(n>i)for(let j=i;j<n;j++)if(!stepOk(q[j])){n=j;break}
 q=seq();cur=q[Math.max(0,Math.min(q.length-1,n))];navState();
 if(scroll){const top=root.querySelector('.rz-main').getBoundingClientRect().top;if(top<0||top>innerHeight*.5)root.querySelector('.rz-main').scrollIntoView({behavior:'smooth',block:'start'})}
 if(cur==='kontakt')setTimeout(()=>form.elements.jmeno.focus({preventScroll:true}),350)}
const krok=d=>{const q=seq();return q[q.indexOf(cur)+d]};
progW.addEventListener('click',e=>{const b=e.target.closest('button');if(b)go(b.dataset.k)});
$('rzBack').addEventListener('click',()=>go(krok(-1)));
$('rzNext').addEventListener('click',()=>{if(cur==='kontakt')submit();else go(krok(1))});
root.querySelectorAll('.rz-sum [data-go]').forEach(r=>r.addEventListener('click',()=>go(r.dataset.go)));
function setMod(m){if(S.mod!==m){S.mod=m;S.from=S.to=S.d0=null;S.nc=false;S.pr=S.ou=null;S.l.chci=m==='lod';TYPES.forEach(t=>{S.q[t.k]=0;if(S.c[t.k])S.c[t.k]=[]});LODE.forEach(p=>S.l.kusy[p.k]=0);S.l.dopr=null;drawCal();render()}}
$('rzVolba').addEventListener('click',e=>{const b=e.target.closest('.rz-vc');if(!b)return;setMod(b.dataset.mod);go('termin')});
mq.addEventListener?mq.addEventListener('change',()=>navState()):mq.addListener(()=>navState());
if('IntersectionObserver' in window){const io2=new IntersectionObserver(es=>es.forEach(e=>document.body.classList.toggle('rz-inview',e.isIntersecting)),{threshold:.05});io2.observe(root)}

/* ---------- odeslání ---------- */
form.addEventListener('submit',e=>{e.preventDefault();submit()});
function fieldErr(name,msg){const inp=form.elements[name],lab=inp.closest('.rz-f');let em=lab.querySelector('em');
 if(msg){if(!em){em=document.createElement('em');em.id='err-'+name;lab.append(em)}em.textContent=msg;lab.classList.add('err');inp.setAttribute('aria-invalid','true');inp.setAttribute('aria-describedby','err-'+name)}else{if(em)em.remove();lab.classList.remove('err');inp.removeAttribute('aria-invalid');inp.removeAttribute('aria-describedby')}}
['jmeno','telefon','email'].forEach(n=>form.elements[n].addEventListener('input',()=>fieldErr(n,'')));
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
  try{r=KKR.pridej({stav:pb?'pop':KKR.stavWeb(mista,{stan:S.q.stan||0,karavan:S.q.karavan||0}),od,do:dk,lode:lo,doprava:dp,platba:pb,
   mista,dalsi:{stan:S.q.stan||0,karavan:S.q.karavan||0},
   osoby:{dosp:S.dosp,dite:S.dite,zak:S.zak},jmeno:f.jmeno.value.trim(),telefon:f.telefon.value.trim(),email:f.email.value.trim(),zprava:f.zprava.value.trim(),cena:Math.round(R.total),zdroj:'web',jazyk:KL.jazyk})}
  catch(x){nactiBusy();drawCal();render();if(/vybavení/.test(x.message)){go('lode');warn(KL.t('Lodě si mezitím půjčil někdo jiný. Upravte prosím počet.'))}else{go('uby');warn(KL.t('Vybrané místo si mezitím zarezervoval někdo jiný. Vyberte prosím jiné.'))}return}
  done(false,r);nactiBusy();drawCal()}
 else{const body=`${summaryText()}\n\nJméno: ${f.jmeno.value}\nTelefon: ${f.telefon.value}\nE-mail: ${f.email.value||'-'}\nZpráva: ${f.zprava.value||'-'}`;
  location.href=`mailto:kempkrumlov2017@gmail.com?subject=${encodeURIComponent('Poptávka pobytu '+fDY(S.from)+' – '+fDY(S.to))}&body=${encodeURIComponent(body)}`;done(true)}}
function warnSend(){alert('Poptávku se nepodařilo odeslat. Zkuste to prosím znovu nebo zavolejte na +420 720 514 943.')}
function done(viaMail,rz){const f=form.elements;
 $('rzDoneH').textContent=viaMail?'Skoro hotovo – dokončete odeslání v e-mailu':'Děkujeme, poptávka je odeslaná';
 $('rzDoneP').textContent=viaMail?'Otevřeli jsme vám e-mail s vyplněnou poptávkou, stačí ho odeslat. Ozveme se s potvrzením termínu a přesnou cenou.':`${KL.t('Ozveme se vám na')} ${f.telefon.value}${f.email.value?' '+KL.t('nebo')+' '+f.email.value:''} ${KL.t('s potvrzením termínu a přesnou cenou.')}`;
 if(rz){const hned=rz.stav==='pot';$('rzDoneH').textContent=KL.t(hned?'Rezervace je potvrzená':'Děkujeme, poptávka je odeslaná');
  $('rzDoneP').textContent=KL.t(hned?'Číslo rezervace':'Číslo poptávky')+' '+rz.cislo+'. '+KL.t(hned?'Místo je zarezervované na vaše jméno.':'Místo vám držíme, ozveme se s potvrzením.')}
 if(rz&&rz.platba){const z=rz.platba,sd=z.splatnost.split('-');$('rzDoneH').textContent=KL.t('Rezervace přijata – zbývá zaplatit zálohu');
  $('rzDoneP').textContent=`${KL.t('Číslo rezervace')} ${rz.cislo}. ${KL.t('Na e-mail vám posíláme pokyny k platbě.')} ${KL.t('Záloha')} ${fmt(z.zaloha)}, ${KL.t('splatnost')} ${+sd[2]}. ${+sd[1]}. ${sd[0]}. ${KL.t('Do té doby vám vše držíme.')}`}
 $('rzDoneSum').innerHTML=summaryText().split('\n').map(l=>{const i=l.indexOf(':');return `<b>${l.slice(0,i+1)}</b>${l.slice(i+1)}`}).join('<br>');
 form.hidden=true;const d=$('rzDone');d.hidden=false;
 d.scrollIntoView({behavior:'smooth',block:'center'});d.focus({preventScroll:true})}
$('rzAgain').addEventListener('click',()=>{$('rzDone').hidden=true;form.hidden=false;const b=$('rzSubmit');b.disabled=false;b.innerHTML='Odeslat poptávku <span>→</span>';go('kontakt')});

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
 STOPS=[];FR=[];vse.forEach(function(p,i){if(p.skryt===1)return;STOPS.push([p.n,KKC.v(p.k,'a'),p.k]);FR.push(Math.min(.99,Math.max(.01,pol[i])))});
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
ps.forEach(p=>{p.addEventListener('click',e=>{if(!p.classList.contains('on')){e.preventDefault();act(p)}});const tg=p.querySelector('.ubp-tg');if(tg)tg.addEventListener('click',e=>{e.stopPropagation();act(p)})})})();
;
