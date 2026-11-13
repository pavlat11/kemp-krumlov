/* Kemp Krumlov – EDITAČNÍ REŽIM webu (načte se jen přihlášenému správci s ?edit=1)
   Upravit jde:  • texty s klíčem data-t (píše se přímo do stránky)
                 • texty, které vypisují skripty, mapy a animace (okénko u textu, uloží se do „dtexty“)
                 • fotky (img i obrázky na pozadí) • ikony (výběr z knihovny) • ceny lodí PE-LA a čísla ve statistikách
   Ceny kempu se dál mění jen v Ceníku. */
(function(){
'use strict';
if(!window.KK)return;
var BASE=(document.currentScript&&document.currentScript.src||'').replace(/js\/editace\.js.*$/,'');
var ADMIN=BASE+'admin/';
var P=window.KKP;
var VRAMCI=window.top!==window;var orig={},ulozene=KK.texty.vseSync(),cekajici={},pD={},pI={},pO={},zasobnik=[],aktivni=null,predEditaci='',prochazet=false;
var els=function(k){return [].slice.call(document.querySelectorAll('[data-t="'+k+'"]'))};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var pocet=function(){return Object.keys(cekajici).length+Object.keys(pD).length+Object.keys(pI).length+Object.keys(pO).length};
var tvar=function(n,a,b,c){return n===1?a:n>1&&n<5?b:c};
document.documentElement.classList.add('kk-edit');

/* původní texty ze zdrojového HTML (pro „vrátit původní“) */
fetch(BASE+'index.html',{cache:'no-store'}).then(function(r){return r.text()}).then(function(h){
  var d=new DOMParser().parseFromString(h,'text/html');
  [].forEach.call(d.querySelectorAll('[data-t]'),function(e){orig[e.dataset.t]=KK.cisti(e.innerHTML)});
  [].forEach.call(d.querySelectorAll('[data-t-ceny]'),function(e){orig[e.dataset.tCeny]=e.dataset.p1+'|'+e.dataset.pm});
  [].forEach.call(d.querySelectorAll('[data-t-n]'),function(e){orig[e.dataset.tN]=e.dataset.n});
  oznac();
});

var SV=function(p,s){return '<svg viewBox="0 0 24 24" width="'+(s||18)+'" height="'+(s||18)+'" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'};

/* lišta */
var bar=document.createElement('div');bar.className='kke-bar kke-ui';bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Editační režim');
var JZ=KK.JAZYK||'cs';
bar.innerHTML='<span class="kke-tit">'+SV('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>')+'Editační režim</span>'+
 (JZ!=='cs'?'<span class="kke-jz" title="Upravujete překlad. Co nepřeložíte, zůstane na webu česky.">'+JZ.toUpperCase()+' – překlad</span>':'')+
 '<span class="kke-st" aria-live="polite"></span>'+
 '<button type="button" class="kke-b kke-mode" aria-pressed="false" title="Vypne úpravy, aby šlo klikat na web (přepnout krok rezervace, spustit animaci, otevřít místo na mapě…)">'+SV('<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51z"/>')+'<span>Procházet</span></button>'+
 '<button type="button" class="kke-b kke-undo" disabled>Zpět</button>'+
 '<button type="button" class="kke-b kke-drop" disabled>Zahodit</button>'+
 '<button type="button" class="kke-b kke-save" disabled>Uložit</button>'+
 (VRAMCI?'':'<a class="kke-b kke-adm" href="'+ADMIN+'#prehled">Administrace</a>'+'<button type="button" class="kke-b kke-end" aria-label="Ukončit editační režim">Ukončit</button>');
document.body.appendChild(bar);
var st=bar.querySelector('.kke-st'),bUndo=bar.querySelector('.kke-undo'),bDrop=bar.querySelector('.kke-drop'),bSave=bar.querySelector('.kke-save'),bMode=bar.querySelector('.kke-mode');

/* oznámení: samo zmizí, jde zavřít křížkem i kliknutím kamkoli */
var toastT,toastEl;
function toast(m,typ,ms){
  if(!toastEl){toastEl=document.createElement('div');toastEl.className='kke-toast kke-ui';toastEl.setAttribute('role','status');document.body.appendChild(toastEl)}
  toastEl.className='kke-toast kke-ui on '+(typ||'');
  toastEl.innerHTML='<div class="kke-tm">'+m+'</div><button type="button" class="kke-tx" aria-label="Zavřít oznámení">'+SV('<path d="M18 6 6 18M6 6l12 12"/>',16)+'</button>';
  toastEl.querySelector('.kke-tx').onclick=zavriToast;
  clearTimeout(toastT);toastT=setTimeout(zavriToast,ms||3500);
}
function zavriToast(){clearTimeout(toastT);if(toastEl)toastEl.className='kke-toast kke-ui'}

function stav(){
  var n=pocet();
  st.textContent=prochazet?'Procházení – úpravy vypnuté':n?n+' '+tvar(n,'neuložená změna','neuložené změny','neuložených změn'):'Klikněte na text, fotku nebo ikonu';
  st.classList.toggle('dirty',!!n);bSave.disabled=bDrop.disabled=!n;bUndo.disabled=!zasobnik.length;
}
function oznac(){
  [].forEach.call(document.querySelectorAll('[data-t]'),function(e){
    var k=e.dataset.t;e.classList.toggle('kke-upr',!!ulozene[k]&&!e.hasAttribute('data-cena'));e.classList.toggle('kke-ceka',k in cekajici);
    if(!e.hasAttribute('tabindex')&&!/^(A|BUTTON)$/.test(e.tagName)){e.setAttribute('tabindex','0');e.dataset.kkeTi='1'}
  });
}

/* ---------- texty s klíčem data-t: psaní přímo do stránky ---------- */
function zacni(e){
  if(aktivni===e)return;if(aktivni)skonci();
  if(e.hasAttribute('data-cena')){naCenik();return}
  aktivni=e;predEditaci=e.innerHTML;e.contentEditable='true';e.classList.add('kke-act');e.focus();
  var r=document.createRange();r.selectNodeContents(e);r.collapse(false);var s=getSelection();s.removeAllRanges();s.addRange(r);
}
function skonci(){
  var e=aktivni;if(!e)return;aktivni=null;e.contentEditable='false';e.classList.remove('kke-act');
  var k=e.dataset.t,nove=KK.cisti(e.innerHTML),pred=KK.cisti(predEditaci),html=predEditaci;
  if(!nove.replace(/<br>/g,'').trim()){e.innerHTML=predEditaci;toast('Text nemůže zůstat prázdný – vrátil jsem předchozí.');return}
  if(nove!==pred){
    var meli=k in cekajici,byl=cekajici[k];
    zasobnik.push(function(){els(k).forEach(function(x){x.innerHTML=html});if(meli)cekajici[k]=byl;else delete cekajici[k];prepocitejPela()});
    cekajici[k]=nove;e.innerHTML=nove;els(k).forEach(function(x){if(x!==e)x.innerHTML=nove});prepocitejPela();
  }
  stav();oznac();
}
function prepocitejPela(){if(window.KKPela)KKPela.render()}
function naCenik(){toast('<b>Ceny kempu se mění v Ceníku</b>, aby se změnily všude naráz (i ve výpočtu rezervace).<a href="'+ADMIN+'#cenik" target="_top">Otevřít Ceník</a>','lock')}

/* ---------- okénko u prvku ---------- */
var pop=null,popZpet=null;
function zavriPop(){if(!pop)return;pop.remove();pop=null;if(popZpet&&popZpet.focus)try{popZpet.focus({preventScroll:true})}catch(e){}popZpet=null}
function otevriPop(rect,titul,obsah,sirka){
  zavriPop();zavriToast();
  pop=document.createElement('div');pop.className='kke-pop kke-ui';pop.setAttribute('role','dialog');pop.setAttribute('aria-label',titul);
  pop.innerHTML='<div class="kke-ph"><b>'+titul+'</b><button type="button" class="kke-px" aria-label="Zavřít">'+SV('<path d="M18 6 6 18M6 6l12 12"/>',16)+'</button></div>'+obsah;
  if(sirka)pop.style.width=sirka+'px';
  document.body.appendChild(pop);
  var w=pop.offsetWidth,h=pop.offsetHeight,vw=innerWidth,vh=innerHeight-90;
  var x=Math.min(Math.max(8,rect.left+rect.width/2-w/2),vw-w-8),y=rect.bottom+10;
  if(y+h>vh)y=Math.max(8,rect.top-h-10);if(y+h>vh)y=Math.max(8,vh-h);
  pop.style.left=x+'px';pop.style.top=y+'px';
  pop.querySelector('.kke-px').onclick=zavriPop;
  pop.addEventListener('keydown',function(ev){if(ev.key==='Escape'){ev.stopPropagation();zavriPop()}});
  var f=pop.querySelector('textarea,input,button:not(.kke-px)');if(f)setTimeout(function(){f.focus();if(f.select&&f.tagName!=='BUTTON')f.select()},20);
  return pop;
}

/* ---------- texty ze skriptů, map a animací ---------- */
var STAV='#rzCal,#rzSumPeople,#rzSumType,#rzSumDate,#rzSumExtras,#rzTotal,#rzPer,#rzLines,#rzFromT,#rzToT,#rzNl,#dpName,#dpPer,#dpPrice,#rzSeason,.lang-switch,#rzPrice,[data-n],.kke-ui,#kktit,.ai-load-lab';
var CENIK='#rzPeople b,#rzPeople small,#rzTypes b,#rzExtras b,#rzExtras small,#doprava .dp-chip b,#doprava li b,#doprava b,#doprava svg text';
function textUpravitelny(n){
  if(!n||n.nodeType!==3)return false;var p=n.parentElement;if(!p||p.closest('script,style,[data-t],.kke-ui'))return false;
  var t=P.norm(n.data);return t.length>0&&/[A-Za-zÁ-žá-ž]/.test(t);
}
function cenovy(n){var p=n.parentElement,t=P.norm(n.data);if(p.closest('#pela'))return false;if(/\d\s*Kč|Kč\b/.test(t)||p.closest('[data-c],[data-cena]'))return true;return JZ==='cs'&&!!p.closest(CENIK)}
function textVBode(x,y,cil){
  var r=document.caretRangeFromPoint?document.caretRangeFromPoint(x,y):null,n=r&&r.startContainer;
  if(n&&n.nodeType===3&&n.parentElement&&cil.contains(n.parentElement)||n&&n.nodeType===3&&n.parentElement===cil){
    var rr=document.createRange();rr.selectNodeContents(n);var ok=[].some.call(rr.getClientRects(),function(q){return x>=q.left-3&&x<=q.right+3&&y>=q.top-3&&y<=q.bottom+3});
    if(ok)return n;
  }
  /* SVG popisky a prvky s jediným textem */
  var e=cil.closest('text,tspan')||cil,kand=[].filter.call(e.childNodes,function(c){return c.nodeType===3&&c.data.trim()});
  if(kand.length===1){var rr2=document.createRange();rr2.selectNodeContents(kand[0]);var b=rr2.getBoundingClientRect();if(x>=b.left-4&&x<=b.right+4&&y>=b.top-4&&y<=b.bottom+4)return kand[0]}
  /* popisky v SVG mapách často nechytají myš (pointer-events:none) – najdu text podle polohy */
  var sv=cil.closest('svg');while(sv&&sv.parentNode&&sv.parentNode.closest&&sv.parentNode.closest('svg'))sv=sv.parentNode.closest('svg');
  if(sv){var hit=null;[].some.call(sv.querySelectorAll('text'),function(te){var q=te.getBoundingClientRect();if(q.width&&x>=q.left-3&&x<=q.right+3&&y>=q.top-3&&y<=q.bottom+3){var tn=[].filter.call(te.childNodes,function(c){return c.nodeType===3&&c.data.trim()})[0]||(te.querySelector('tspan')&&te.querySelector('tspan').firstChild);if(tn&&tn.nodeType===3){hit=tn;return true}}return false});if(hit)return hit}
  return null;
}
function upravText(n){
  var o=P.puvodniText(n),T=P.texty(),ted=o in pD?(pD[o]==null?o:pD[o]):(T[o]!=null?T[o]:o);
  var stejne=0,w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),m;while((m=w.nextNode()))if(m.__kko===o)stejne++;
  var dlouhy=ted.length>60,r=n.parentElement.getBoundingClientRect();
  var p=otevriPop(r,'Upravit text',
    (dlouhy?'<textarea class="kke-in" rows="'+Math.min(8,Math.ceil(ted.length/48))+'" aria-label="Nový text">'+esc(ted)+'</textarea>':'<input class="kke-in" type="text" value="'+esc(ted)+'" aria-label="Nový text">')+
    (ted!==o?'<p class="kke-pm">Původně: <i>'+esc(o)+'</i></p>':'')+
    (stejne>1?'<p class="kke-pm">Změní se na všech '+stejne+' místech se stejným textem.</p>':'')+
    '<div class="kke-pb">'+(ted!==o?'<button type="button" class="kke-b2 kke-reset">Vrátit původní</button>':'')+'<button type="button" class="kke-b2 kke-ok">Použít</button></div>',dlouhy?420:340);
  var inp=p.querySelector('.kke-in');
  function pouzij(v){
    v=v.replace(/\s+/g,' ').trim();if(!v){toast('Text nemůže zůstat prázdný.');return}
    var meli=o in pD,byl=pD[o],pred=ted;
    pD[o]=v===o?(T[o]!=null?null:undefined):v;if(pD[o]===undefined)delete pD[o];
    P.nastavText(o,v===o?null:v);
    zasobnik.push(function(){if(meli)pD[o]=byl;else delete pD[o];P.nastavText(o,pred===o?null:pred)});
    zavriPop();stav();
  }
  p.querySelector('.kke-ok').onclick=function(){pouzij(inp.value)};
  inp.addEventListener('keydown',function(ev){if(ev.key==='Enter'&&(!dlouhy||!ev.shiftKey)){ev.preventDefault();pouzij(inp.value)}});
  var rs=p.querySelector('.kke-reset');if(rs)rs.onclick=function(){pouzij(o)};
}

/* ---------- fotky ---------- */
function fotkaVBode(x,y){
  var st=document.elementsFromPoint(x,y);
  for(var i=0;i<st.length;i++){var e=st[i];if(e.closest('.kke-ui'))continue;
    if(e.tagName==='IMG'){var c=P.puvodniFotka(e);if(c)return{el:e,c:c}}
    var bg=getComputedStyle(e).backgroundImage;
    if(bg&&bg.indexOf('url(')>=0&&!/data:image\/svg/.test(bg)){var u=(bg.match(/url\(["']?([^"')]+)/)||[])[1],cc=P.cesta(u)||e.__kkbo||cssPuvod(u);if(cc)return{el:e,c:cc}}
    if(e===document.body)break;
  }
  return null;
}
function cssPuvod(u){/* blob: z přepsaného CSS pravidla → původní cesta */
  var najdu='';[].some.call(document.styleSheets,function(sh){var r;try{r=sh.cssRules}catch(e){return false}return(function walk(rs){return [].some.call(rs,function(x){if(x.cssRules&&walk(x.cssRules))return true;if(x.__kko&&x.__kko[u]){najdu=x.__kko[u];return true}return false})})(r)});
  if(!najdu){var O=P.obrazky();Object.keys(O).forEach(function(k){if(P.url(k)===u)najdu=k})}return najdu;
}
function upravFotku(f){
  var O=P.obrazky(),zmenena=f.c in pO?!!pO[f.c]:!!O[f.c],r=f.el.getBoundingClientRect();
  var p=otevriPop({left:r.left,width:r.width,top:Math.max(r.top,60),bottom:Math.min(r.bottom,Math.max(r.top,60)+200)},'Fotka na webu',
    '<div class="kke-fn"><img alt="" src="'+esc(P.url(f.c))+'"></div><p class="kke-pm">'+esc(f.c.split('/').pop())+(zmenena?' · <b>nahrazená</b>':'')+'</p>'+
    '<label class="kke-b2 kke-ok kke-file">'+SV('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',16)+'Nahrát jinou fotku<input type="file" accept="image/*" class="kke-vh"></label>'+
    '<p class="kke-pm">Fotka se zmenší a uloží (JPG, PNG, WebP). Nejlépe na šířku, aspoň 1600 px. Ořez zůstane stejný jako u původní.</p>'+
    (zmenena?'<div class="kke-pb"><button type="button" class="kke-b2 kke-reset">Vrátit původní fotku</button></div>':''),320);
  var inp=p.querySelector('input[type=file]');
  function nastav(z,url){
    var O2=P.obrazky(),meli=f.c in pO,byl=pO[f.c],predZ=O2[f.c]?JSON.parse(JSON.stringify(O2[f.c])):null,predU=P.url(f.c);
    pO[f.c]=z;if(!z&&!(KK.obrazky.vse()[f.c]))delete pO[f.c];
    P.nastavFotku(f.c,z,url);
    zasobnik.push(function(){if(meli)pO[f.c]=byl;else delete pO[f.c];P.nastavFotku(f.c,predZ,predU)});
    zavriPop();stav();
  }
  inp.onchange=function(){var s=inp.files[0];if(!s)return;p.querySelector('.kke-file').classList.add('kke-busy');
    KK.obrazky.nahraj(s).then(function(z){nastav({id:z.id,v:z.v},z.url);toast('Fotka nahrazena – nezapomeňte Uložit.','ok')}).catch(function(e){toast((e&&e.message)||'Fotku se nepodařilo načíst.','err');zavriPop()})};
  var rs=p.querySelector('.kke-reset');if(rs)rs.onclick=function(){nastav(null,null)};
}

/* ---------- ikony ---------- */
var knihovna=null;
function nactiIkony(){if(knihovna)return knihovna;knihovna=window.KK_IKONY?Promise.resolve():new Promise(function(ok,no){var s=document.createElement('script');s.src=BASE+'js/ikony.js?v=2';s.onload=ok;s.onerror=no;document.head.appendChild(s)});return knihovna}
function upravIkonu(svg){
  var k=P.klicIkony(svg),I=P.ikony(),zmenena=k in pI?!!pI[k]:!!I[k];
  var stejne=[].filter.call(document.getElementsByTagName('svg'),function(s){return s.__kkpuv!=null&&P.klicIkony(s)===k}).length;
  nactiIkony().then(function(){
    var mriz=KK_IKONY.map(function(g){return '<div class="kke-ig" role="group" aria-label="'+esc(g[0])+'"><b>'+esc(g[0])+'</b><div>'+g[1].map(function(i){return '<button type="button" class="kke-ib" data-n="'+i[0]+'" data-l="'+esc(i[1])+'" aria-label="'+esc(i[1].split(' ')[0])+'" title="'+esc(i[1])+'">'+SV(i[2],22)+'</button>'}).join('')+'</div></div>'}).join('');
    var p=otevriPop(svg.getBoundingClientRect(),'Vybrat ikonu',
      '<input class="kke-in kke-is" type="search" placeholder="Hledat (např. stan, voda, telefon)" aria-label="Hledat ikonu">'+
      (stejne>1?'<p class="kke-pm">Změní se všech '+stejne+' stejných ikon na stránce.</p>':'')+
      '<div class="kke-igr">'+mriz+'</div>'+(zmenena?'<div class="kke-pb"><button type="button" class="kke-b2 kke-reset">Vrátit původní ikonu</button></div>':''),380);
    var hl=p.querySelector('.kke-is');
    hl.oninput=function(){var q=hl.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
      [].forEach.call(p.querySelectorAll('.kke-ib'),function(b){b.hidden=!!q&&(b.dataset.l+' '+b.dataset.n).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').indexOf(q)<0});
      [].forEach.call(p.querySelectorAll('.kke-ig'),function(g){g.hidden=!g.querySelector('.kke-ib:not([hidden])')})};
    function nastav(z){
      var meli=k in pI,byl=pI[k],predZ=P.ikony()[k]||null;
      pI[k]=z;if(!z&&!KK.ikony.vse()[k])delete pI[k];
      P.nastavIkonu(k,z);
      zasobnik.push(function(){if(meli)pI[k]=byl;else delete pI[k];P.nastavIkonu(k,predZ)});
      zavriPop();stav();
    }
    p.querySelector('.kke-igr').onclick=function(ev){var b=ev.target.closest('.kke-ib');if(!b)return;var s='';KK_IKONY.some(function(g){return g[1].some(function(i){if(i[0]===b.dataset.n){s=i[2];return true}})});nastav({n:b.dataset.n,s:s})};
    var rs=p.querySelector('.kke-reset');if(rs)rs.onclick=function(){nastav(null)};
  });
}

/* ---------- PE-LA: ceny lodí a čísla ve statistikách (obyčejné hodnoty, nejsou v ceníku) ---------- */
function upravCenyLodi(karta){
  var k=karta.dataset.tCeny,p1=karta.dataset.p1,pm=karta.dataset.pm,nazev=((karta.querySelector('.pp-bt')||{}).textContent||'')+' '+((karta.querySelector('.pp-bt+b')||{}).textContent||'');
  var p=otevriPop(karta.querySelector('.pp-price').getBoundingClientRect(),'Cena – '+esc(nazev.trim()),
    '<label class="kke-lb">1 den (Kč)<input class="kke-in" type="number" min="0" step="10" value="'+esc(p1)+'" data-k="1"></label>'+
    '<label class="kke-lb">Vícedenní – za den (Kč)<input class="kke-in" type="number" min="0" step="10" value="'+esc(pm)+'" data-k="m"></label>'+
    '<p class="kke-pm">Ceny lodí patří půjčovně PE-LA, s ceníkem kempu nejsou propojené.</p><div class="kke-pb"><button type="button" class="kke-b2 kke-ok">Použít</button></div>',300);
  function pouzij(){var a=+p.querySelector('[data-k="1"]').value,b=+p.querySelector('[data-k="m"]').value;if(!(a>0&&b>0)){toast('Zadejte obě ceny.');return}
    var meli=k in cekajici,byl=cekajici[k],pa=p1,pb=pm;
    cekajici[k]=a+'|'+b;karta.dataset.p1=a;karta.dataset.pm=b;prepocitejPela();
    zasobnik.push(function(){if(meli)cekajici[k]=byl;else delete cekajici[k];karta.dataset.p1=pa;karta.dataset.pm=pb;prepocitejPela()});
    zavriPop();stav()}
  p.querySelector('.kke-ok').onclick=pouzij;
  [].forEach.call(p.querySelectorAll('input'),function(i){i.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();pouzij()}})});
}
function upravCislo(el){
  var k=el.dataset.tN,ted=el.dataset.n;
  var p=otevriPop(el.getBoundingClientRect(),'Upravit číslo','<input class="kke-in" type="number" value="'+esc(ted)+'" aria-label="Číslo"><div class="kke-pb"><button type="button" class="kke-b2 kke-ok">Použít</button></div>',240);
  var inp=p.querySelector('input');
  function pouzij(){var v=inp.value.trim();if(v===''||isNaN(+v)){toast('Zadejte číslo.');return}
    var meli=k in cekajici,byl=cekajici[k],pred=ted,f=function(x){el.dataset.n=x;el.textContent=(el.dataset.prefix||'')+x+(el.dataset.suffix||'')};
    cekajici[k]=String(+v);f(+v);zasobnik.push(function(){if(meli)cekajici[k]=byl;else delete cekajici[k];f(pred)});zavriPop();stav()}
  p.querySelector('.kke-ok').onclick=pouzij;inp.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();pouzij()}});
}

/* ---------- co je pod kurzorem ---------- */
function najdi(ev){
  var t=ev.target;if(!t||!t.closest||t.closest('.kke-ui'))return null;
  var x=ev.clientX,y=ev.clientY;
  var svg=t.closest('svg');if(svg&&P.jeIkona(svg))return{typ:'ikona',el:svg};
  var dt=t.closest('[data-t]');if(dt)return{typ:dt.hasAttribute('data-cena')?'cena':'t',el:dt};
  var lod=t.closest('.pp-boat');if(lod&&t.closest('.pp-price')&&!t.closest('.pp-price>small:not(.pp-alt)'))return{typ:'lod',el:lod.querySelector('.pp-price'),karta:lod};
  var cis=t.closest('[data-t-n]');if(cis)return{typ:'cislo',el:cis};
  if(t.closest('#galerie .gl-i'))return{typ:'galerie',el:t.closest('#galerie .gl-i')};
  if(!t.closest(STAV)){var n=textVBode(x,y,t);
    if(n&&textUpravitelny(n)&&!n.parentElement.closest(STAV))return{typ:cenovy(n)?'cena':'text',el:n.parentElement,node:n}}
  var f=fotkaVBode(x,y);if(f)return{typ:'fotka',el:f.el,f:f};
  return null;
}
/* zvýraznění toho, co se upraví */
var hl=document.createElement('div');hl.className='kke-hl kke-ui';hl.setAttribute('aria-hidden','true');hl.innerHTML='<span></span>';document.body.appendChild(hl);
var STITKY={t:'Text',text:'Text',ikona:'Ikona – vybrat jinou',fotka:'Fotka – nahrát jinou',cena:'Cena se mění v Ceníku',lod:'Cena lodi',cislo:'Číslo',galerie:'Fotka galerie – v administraci'};
var hlRaf=0,posledni=null;
document.addEventListener('mousemove',function(ev){posledni=ev;if(hlRaf)return;hlRaf=requestAnimationFrame(function(){hlRaf=0;ukaz(posledni)})},{passive:true});
document.addEventListener('scroll',function(){hl.classList.remove('on')},{passive:true,capture:true});
function ukaz(ev){
  if(prochazet||aktivni||pop){hl.classList.remove('on');return}
  var z=najdi(ev),ov=ovladac(ev.target);if(!z||(z.typ==='t'&&!ov)){hl.classList.remove('on');return}
  var r;if(z.node){var rr=document.createRange();rr.selectNodeContents(z.node);r=rr.getBoundingClientRect()}else r=z.el.getBoundingClientRect();
  if(z.typ==='fotka'){r={left:Math.max(r.left,0),top:Math.max(r.top,0),right:Math.min(r.right,innerWidth),bottom:Math.min(r.bottom,innerHeight)};r.width=r.right-r.left;r.height=r.bottom-r.top}
  hl.className='kke-hl kke-ui on t-'+z.typ;hl.style.cssText='left:'+(r.left-4)+'px;top:'+(r.top-4)+'px;width:'+(r.width+8)+'px;height:'+(r.height+8)+'px';
  hl.firstChild.textContent=ov?'Klik = ovládání · dvojklik = '+(z.typ==='t'||z.typ==='text'?'upravit text':STITKY[z.typ].toLowerCase()):STITKY[z.typ];hl.classList.toggle('t-ov',!!ov);var sp=hl.firstChild;sp.style.left='';sp.style.right='';var sr=sp.getBoundingClientRect();if(sr.right>innerWidth-4){sp.style.left='auto';sp.style.right='-2px'}if(sp.getBoundingClientRect().left<4){sp.style.left='0';sp.style.right='auto'}
}

/* klikání: v režimu úprav web nereaguje, klik upravuje */
/* tlačítka (menu, kroky rezervace, karty ubytování, filtry…) fungují i v editaci – jejich text se upraví dvojklikem */
var OVL='button,[role=tab],[role=button],summary,select,input,label';
function ovladac(t){if(!t||!t.closest)return null;var c=t.closest(OVL);if(!c||c.closest('.kke-ui')||t.closest('.kke-act'))return null;return c}
function proved(ev,z){
  if(!z){if(aktivni&&!ev.target.closest('.kke-act'))skonci();return}
  if(z.typ==='t'){ev.preventDefault();ev.stopImmediatePropagation();zacni(z.el);return}
  if(aktivni)skonci();
  ev.preventDefault();ev.stopImmediatePropagation();hl.classList.remove('on');popZpet=document.activeElement;
  if(z.typ==='cena')naCenik();
  else if(z.typ==='galerie')toast('Fotky v galerii a jejich popisky se spravují v administraci v sekci Galerie.<a href="'+ADMIN+'#galerie" target="_top">Otevřít Galerii</a>');
  else if(z.typ==='text')upravText(z.node);
  else if(z.typ==='fotka')upravFotku(z.f);
  else if(z.typ==='ikona')upravIkonu(z.el);
  else if(z.typ==='lod')upravCenyLodi(z.karta);
  else if(z.typ==='cislo')upravCislo(z.el);
}
document.addEventListener('dblclick',function(ev){
  if(prochazet||!ev.target.closest||ev.target.closest('.kke-ui,.kke-act'))return;
  if(!ovladac(ev.target))return;
  getSelection().removeAllRanges();proved(ev,najdi(ev));
},true);
document.addEventListener('click',function(ev){
  if(ev.target.closest&&ev.target.closest('.kke-ui'))return;
  if(pop&&!ev.target.closest('.kke-pop')){zavriPop();ev.preventDefault();ev.stopImmediatePropagation();return}
  zavriToast();
  if(prochazet)return;
  if(ovladac(ev.target)){if(aktivni&&!ev.target.closest('.kke-act'))skonci();return}
  var z=najdi(ev);
  proved(ev,z);
},true);
/* odkazy a tlačítka nesmí reagovat ani na stisk myši (např. přetahování mapy) */
['pointerdown','mousedown'].forEach(function(t){document.addEventListener(t,function(ev){if(prochazet||!ev.target.closest||ev.target.closest('.kke-ui,.kke-act')||ovladac(ev.target))return;if(najdi(ev)&&!ev.target.closest('[data-t]'))ev.preventDefault()},true)});
document.addEventListener('keydown',function(ev){
  if(ev.target.closest&&ev.target.closest('.kke-pop'))return;
  var e=ev.target.closest&&ev.target.closest('[data-t]');
  if(!prochazet&&!aktivni&&e&&(ev.key==='Enter'||ev.key===' ')&&!ev.target.isContentEditable){ev.preventDefault();zacni(e);return}
  if(!aktivni)return;
  if(ev.key==='Escape'){ev.preventDefault();aktivni.innerHTML=predEditaci;var a=aktivni;skonci();a.focus()}
  else if(ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();var b=aktivni;skonci();b.focus()}
  else if(ev.key==='Enter'&&ev.shiftKey&&/^(SPAN|A|BUTTON|H\d|SMALL|B|STRONG|EM|LABEL|SUP)$/.test(aktivni.tagName)){ev.preventDefault()}
},true);
document.addEventListener('paste',function(ev){if(!aktivni)return;ev.preventDefault();var t=(ev.clipboardData||window.clipboardData).getData('text/plain').replace(/\s*\n\s*/g,' ');document.execCommand('insertText',false,t)},true);
document.addEventListener('focusout',function(ev){if(aktivni&&ev.target===aktivni)setTimeout(function(){if(aktivni&&document.activeElement!==aktivni)skonci()},0)},true);

/* přepínač Procházet / Upravovat */
bMode.addEventListener('click',function(){
  if(aktivni)skonci();zavriPop();prochazet=!prochazet;
  bMode.setAttribute('aria-pressed',String(prochazet));bMode.querySelector('span').textContent=prochazet?'Upravovat':'Procházet';
  document.documentElement.classList.toggle('kk-edit',!prochazet);document.documentElement.classList.toggle('kk-edit-prochazet',prochazet);
  hl.classList.remove('on');stav();
  toast(prochazet?'Úpravy jsou vypnuté – na web se dá klikat (kroky rezervace, místa na mapě). Pro úpravy klikněte na <b>Upravovat</b>.':'Úpravy zapnuté – klikněte na text, fotku nebo ikonu.');
});

bUndo.addEventListener('click',function(){var z=zasobnik.pop();if(!z)return;z();stav();oznac()});
bDrop.addEventListener('click',function(){if(!confirm('Zahodit všechny neuložené změny?'))return;
  var nove=Object.keys(pO).map(function(c){return pO[c]&&pO[c].id}).filter(Boolean);
  cekajici={};pD={};pI={};pO={};zasobnik=[];
  (nove.length?KK.obrazky.soubor.smaz(nove).catch(function(){}):Promise.resolve()).then(function(){location.reload()});
});
bSave.addEventListener('click',function(){
  if(aktivni)skonci();var z={};
  Object.keys(cekajici).forEach(function(k){z[k]=(orig[k]!=null&&cekajici[k]===orig[k])?null:cekajici[k]});
  var n=pocet();bSave.disabled=true;
  /* ceny lodí a čísla statistik jsou stejné ve všech jazycích → vždy do češtiny */
  var zc={};Object.keys(z).forEach(function(k){if(/^pela\.(ceny|cislo)\./.test(k)){zc[k]=z[k];delete z[k]}});
  Promise.all([KK.texty.uloz(z),KK.dtexty.uloz(pD),KK.ikony.uloz(pI),KK.obrazky.uloz(pO),Object.keys(zc).length?KK.texty.uloz(zc,'cs'):null])
  .then(function(r){ulozene=r[0];cekajici={};pD={};pI={};pO={};zasobnik=[];stav();oznac();toast('Uloženo – '+n+' '+tvar(n,'změna','změny','změn')+'.','ok');return KK.obrazky.uklid()})
  .catch(function(){bSave.disabled=false;toast('Uložení se nepovedlo. Zkuste to znovu.','err')});
});
if(!VRAMCI)bar.querySelector('.kke-end').addEventListener('click',function(){
  if(pocet()&&!confirm('Máte neuložené změny. Opravdu odejít bez uložení?'))return;
  cekajici={};pD={};pI={};pO={};location.href=location.pathname+location.hash;
});
window.KKE={neulozeno:function(){return pocet()>0},opust:false};
addEventListener('beforeunload',function(e){if(pocet()&&!(window.KKE&&KKE.opust)){e.preventDefault();e.returnValue=''}});
stav();oznac();
/* skok z administrace na konkrétní text: ?edit=1#t=klic */
var hk=decodeURIComponent((location.hash.match(/^#t=(.+)$/)||[])[1]||'');
if(hk){var he=document.querySelector('[data-t="'+hk+'"]');if(he){setTimeout(function(){var vis=he.getClientRects().length>0;if(vis){he.scrollIntoView({block:'center'});he.classList.add('kke-act');setTimeout(function(){he.classList.remove('kke-act')},1600);he.focus({preventScroll:true})}else toast('Tento text je teď skrytý (např. v dalším kroku rezervace nebo v mobilním menu). Otevřete ho klikem (tlačítka v editaci fungují) a pak ho upravte.',null,6000)},600)}}
if(!KK.LS.get('editace-napoveda3',0)){toast('<b>Klikněte na text, fotku nebo ikonu.</b> Tlačítka (menu, kroky rezervace, karty ubytování) fungují normálně – jejich text upravíte <b>dvojklikem</b>.',null,7000);KK.LS.set('editace-napoveda3',1)}
})();
