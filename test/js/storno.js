/* Zrušení rezervace hostem – stránka storno.html?r=<id>&k=<klíč>
   Náhled: pracuje s rezervacemi v localStorage (funguje jen ve stejném prohlížeči).
   Naostro: GET /api/storno?r&k vrátí shrnutí, POST /api/storno {r,k,duvod} rezervaci zruší (viz NAPOJENI-NA-SERVER.md). */
(function(){
var R=window.KKR,h=document.documentElement,M=document.getElementById('obsah');
var q=new URLSearchParams(location.search),ID=q.get('r')||'',KL=q.get('k')||'';
var T={
 cs:{tit:'Zrušení rezervace',eb:'Rezervace',lead:'Rezervaci můžete zrušit sami. Zkontrolujte prosím, že jde o tu správnou.',cis:'Číslo',ter:'Termín',uby:'Ubytování',lod:'Lodě',dop:'Doprava',os:'Osoby',zal:'Záloha',zap:'zaplacená',nez:'nezaplacená',pod:'Storno podmínky',podV:'Pokud jste zaplatili zálohu, ozveme se vám ohledně jejího vrácení.',du:'Důvod zrušení',duS:'nepovinné – pomůže nám to',potv:'Pro potvrzení napište STORNO',potvS:'Tím zabráníme nechtěnému zrušení.',btn:'Zrušit rezervaci',zpet:'Ponechat rezervaci',chyba:'Napište prosím slovo STORNO.',
  zrT:'Rezervace je zrušená',zrP:'Rezervace {c} byla zrušena. Potvrzení jsme vám poslali e-mailem. Místo jsme uvolnili pro další hosty.',zrP2:'Budeme rádi, když přijedete jindy.',web:'Zpět na web',
  jzT:'Rezervace už je zrušená',jzP:'Rezervace {c} už byla dříve zrušena. Není potřeba nic dalšího dělat.',
  nnT:'Rezervaci jsme nenašli',nnP:'Odkaz je neplatný nebo už byl použit. Zkuste ho otevřít znovu z e-mailu, případně nám zavolejte.',
  pzT:'Rezervaci už nejde zrušit online',pzP:'Do příjezdu zbývá méně než {d}. Zavolejte nám prosím, domluvíme se.',odT:'Pobyt už začal',odP:'Rezervaci {c} už nejde zrušit online. Zavolejte nám prosím.',vyT:'Lodě už jsou vydané',vyP:'Rezervaci {c} už nejde zrušit online. Zavolejte nám prosím.',vpT:'Zrušení online není dostupné',vpP:'Pro zrušení rezervace nám prosím zavolejte nebo napište.',
  tel:'Zavolat',den:['den','dny','dní'],nahled:'Náhled: funguje jen v prohlížeči, kde byla rezervace vytvořena.'},
 en:{tit:'Cancel booking',eb:'Booking',lead:'You can cancel your booking yourself. Please check that this is the right one.',cis:'Number',ter:'Dates',uby:'Accommodation',lod:'Boats',dop:'Transport',os:'Guests',zal:'Deposit',zap:'paid',nez:'not paid',pod:'Cancellation terms',podV:'If you have paid a deposit, we will contact you about the refund.',du:'Reason',duS:'optional – it helps us',potv:'To confirm, type STORNO',potvS:'This prevents accidental cancellation.',btn:'Cancel booking',zpet:'Keep booking',chyba:'Please type the word STORNO.',
  zrT:'Booking cancelled',zrP:'Booking {c} has been cancelled. We have sent you a confirmation by e-mail.',zrP2:'We hope to see you another time.',web:'Back to website',
  jzT:'Booking already cancelled',jzP:'Booking {c} was cancelled earlier. Nothing else to do.',
  nnT:'Booking not found',nnP:'The link is invalid or has already been used. Please open it again from the e-mail or call us.',
  pzT:'The booking can no longer be cancelled online',pzP:'There are less than {d} left before arrival. Please call us and we will sort it out.',odT:'Your stay has already started',odP:'Booking {c} can no longer be cancelled online. Please call us.',vyT:'Boats already handed out',vyP:'Booking {c} can no longer be cancelled online. Please call us.',vpT:'Online cancellation not available',vpP:'Please call or e-mail us to cancel your booking.',
  tel:'Call',den:['day','days','days'],nahled:'Preview: works only in the browser where the booking was made.'},
 de:{tit:'Reservierung stornieren',eb:'Reservierung',lead:'Sie können Ihre Reservierung selbst stornieren. Bitte prüfen Sie, ob es die richtige ist.',cis:'Nummer',ter:'Termin',uby:'Unterkunft',lod:'Boote',dop:'Transport',os:'Personen',zal:'Anzahlung',zap:'bezahlt',nez:'nicht bezahlt',pod:'Stornobedingungen',podV:'Wenn Sie eine Anzahlung geleistet haben, melden wir uns wegen der Rückerstattung.',du:'Grund',duS:'optional – hilft uns',potv:'Zur Bestätigung STORNO eingeben',potvS:'So verhindern wir eine versehentliche Stornierung.',btn:'Reservierung stornieren',zpet:'Reservierung behalten',chyba:'Bitte geben Sie das Wort STORNO ein.',
  zrT:'Reservierung storniert',zrP:'Die Reservierung {c} wurde storniert. Die Bestätigung haben wir Ihnen per E-Mail geschickt.',zrP2:'Wir freuen uns, wenn Sie ein anderes Mal kommen.',web:'Zurück zur Website',
  jzT:'Reservierung bereits storniert',jzP:'Die Reservierung {c} wurde bereits storniert.',
  nnT:'Reservierung nicht gefunden',nnP:'Der Link ist ungültig oder wurde bereits verwendet. Öffnen Sie ihn bitte erneut aus der E-Mail oder rufen Sie uns an.',
  pzT:'Online-Stornierung nicht mehr möglich',pzP:'Bis zur Anreise sind es weniger als {d}. Bitte rufen Sie uns an.',odT:'Der Aufenthalt hat bereits begonnen',odP:'Die Reservierung {c} kann nicht mehr online storniert werden. Bitte rufen Sie uns an.',vyT:'Boote bereits ausgegeben',vyP:'Die Reservierung {c} kann nicht mehr online storniert werden. Bitte rufen Sie uns an.',vpT:'Online-Stornierung nicht verfügbar',vpP:'Bitte rufen Sie uns an oder schreiben Sie uns.',
  tel:'Anrufen',den:['Tag','Tage','Tage'],nahled:'Vorschau: funktioniert nur im Browser, in dem die Reservierung erstellt wurde.'}};
var e=function(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')};
var hotovo=null;
function L(){return T[h.lang]||T.cs}
function dt(s){if(!s)return '';var p=s.split('-');return (+p[2])+'. '+(+p[1])+'. '+p[0]}
function tel(){var K=R.KONTAKT.tel[0];return '<a class="btn btn-g" href="tel:'+K.replace(/\s/g,'')+'">'+e(L().tel)+' '+e(K)+'</a>'}
function info(cls,ik,tit,txt,akce){M.innerHTML='<span class="eyebrow">'+e(L().eb)+'</span><h1>'+e(L().tit)+'</h1><div class="box"><div class="stav '+cls+'"><i aria-hidden="true">'+ik+'</i><div><h2>'+e(tit)+'</h2>'+txt+'</div></div>'+(akce?'<div class="akce" style="margin-top:18px">'+akce+'</div>':'')+'</div>'}
function web(){return '<a class="btn btn-g" href="'+(h.lang==='cs'?'./':'./?lang='+h.lang)+'">'+e(L().web)+'</a>'}
function kresli(){var t=L(),j=h.lang;
 if(hotovo){info('zr','✓',t.zrT,'<p>'+e(t.zrP.replace('{c}',hotovo.cislo||''))+'</p><p>'+e(t.zrP2)+'</p>',web());return}
 var r=R&&ID&&KL?R.vse().filter(function(x){return x.id===ID})[0]:null;
 if(r&&r.stav==='zru'){info('zr','✓',t.jzT,'<p>'+e(t.jzP.replace('{c}',r.cislo||''))+'</p>',web());return}
 if(!r||r.stok!==KL){info('ne','?',t.nnT,'<p>'+e(t.nnP)+'</p><p style="font-size:13px">'+e(t.nahled)+'</p>',tel());return}
 var st=R.stornoStav(r),N=R.stornoNast(),dn=N.dni+' '+(N.dni===1?t.den[0]:N.dni<5?t.den[1]:t.den[2]);
 if(st!=='ok'){var m={pozde:[t.pzT,t.pzP.replace('{d}',dn)],odjel:[t.odT,t.odP],vydano:[t.vyT,t.vyP],vypnuto:[t.vpT,t.vpP]}[st]||[t.nnT,t.nnP];info('ne','!',m[0],'<p>'+e(m[1].replace('{c}',r.cislo||''))+'</p>',tel());return}
 var D=function(s){return R.dosad('{'+s+'}',r,j)},pl=r.platba||{},rows=[[t.cis,r.cislo],[t.ter,dt(r.od)+(r.do&&r.do!==r.od?' – '+dt(r.do):'')],[t.uby,D('mista')],[t.os,D('osoby')],[t.lod,D('lode')],[t.dop,D('doprava')],[t.zal,pl.zaloha?D('zaloha')+' · '+(pl.stav&&pl.stav!=='ceka'?t.zap:t.nez):'']].filter(function(x){return x[1]&&x[1]!=='–'});
 M.innerHTML='<span class="eyebrow">'+e(t.eb+' '+(r.cislo||''))+'</span><h1>'+e(t.tit)+'</h1><p class="lead">'+e(t.lead)+'</p>'+
  '<div class="box"><dl class="rz">'+rows.map(function(x){return '<dt>'+e(x[0])+'</dt><dd>'+e(x[1])+'</dd>'}).join('')+'</dl></div>'+
  '<form class="box" id="sf" novalidate><p class="pod"><b>'+e(t.pod)+'</b>'+e(N.pod||t.podV)+'</p>'+
  '<div class="pole"><label class="f" for="duv">'+e(t.du)+'<small>'+e(t.duS)+'</small></label><textarea class="inp" id="duv" maxlength="300"></textarea></div>'+
  '<div class="pole"><label class="f" for="potv">'+e(t.potv)+'<small>'+e(t.potvS)+'</small></label><input class="inp" id="potv" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="STORNO" aria-describedby="sok"></div>'+
  '<div class="akce"><button class="btn btn-z" id="sbtn" type="submit" disabled>'+e(t.btn)+'</button>'+web().replace(e(t.web),e(t.zpet))+'</div><p class="ok" id="sok" role="status"></p></form>';
 var P=document.getElementById('potv'),B=document.getElementById('sbtn'),O=document.getElementById('sok');
 var shoda=function(){return P.value.trim().toUpperCase()==='STORNO'};
 P.addEventListener('input',function(){B.disabled=!shoda();O.textContent=''});
 document.getElementById('sf').addEventListener('submit',function(ev){ev.preventDefault();if(!shoda()){O.textContent=t.chyba;P.focus();return}
  B.disabled=true;try{hotovo=R.stornoHost(ID,KL,document.getElementById('duv').value.trim());kresli();scrollTo(0,0)}catch(er){B.disabled=false;O.textContent=er.message==='pozde'?t.pzT:t.nnT}})}
/* přepínač jazyka (stejně jako na stránce GDPR) */
var BJ=[].slice.call(document.querySelectorAll('.lang button')),TT={cs:'Zrušení rezervace · Kemp Krumlov',en:'Cancel booking · Kemp Krumlov',de:'Reservierung stornieren · Kemp Krumlov'};
function jaz(l){h.lang=l;document.title=TT[l];BJ.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.j===l))});var z=document.getElementById('zpet');if(z)z.href=l==='cs'?'./':'./?lang='+l;var u=new URL(location.href);if(l==='cs')u.searchParams.delete('lang');else u.searchParams.set('lang',l);history.replaceState(null,'',u);kresli()}
BJ.forEach(function(b){b.addEventListener('click',function(){try{localStorage.setItem('kkt.jazyk',JSON.stringify(b.dataset.j))}catch(x){}jaz(b.dataset.j)})});
jaz(h.lang);
})();
