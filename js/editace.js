/* Kemp Krumlov – EDITAČNÍ REŽIM webu (načte se jen přihlášenému správci s ?edit=1) */
(function(){
'use strict';
if(!window.KK)return;
var BASE=(document.currentScript&&document.currentScript.src||'').replace(/js\/editace\.js.*$/,'');
var ADMIN=BASE+'admin/';
var VRAMCI=window.top!==window;var orig={},ulozene=KK.texty.vseSync(),cekajici={},zasobnik=[],aktivni=null,predEditaci='';
var els=function(k){return [].slice.call(document.querySelectorAll('[data-t="'+k+'"]'))};
var esc=function(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})};
if(window.__setAnimPaused)window.__setAnimPaused(true);
document.documentElement.classList.add('kk-edit');

/* původní texty ze zdrojového HTML (pro „vrátit původní“) */
fetch(BASE+'index.html',{cache:'no-store'}).then(function(r){return r.text()}).then(function(h){
  var d=new DOMParser().parseFromString(h,'text/html');
  [].forEach.call(d.querySelectorAll('[data-t]'),function(e){orig[e.dataset.t]=KK.cisti(e.innerHTML)});
  oznac();
});

/* lišta */
var bar=document.createElement('div');bar.className='kke-bar';bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Editační režim');
bar.innerHTML='<span class="kke-tit"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>Editační režim</span>'+
 '<span class="kke-st" aria-live="polite">Klikněte na text a pište</span>'+
 '<button type="button" class="kke-b kke-undo" disabled>Zpět</button>'+
 '<button type="button" class="kke-b kke-drop" disabled>Zahodit</button>'+
 '<button type="button" class="kke-b kke-save" disabled>Uložit</button>'+
 (VRAMCI?'':'<a class="kke-b kke-adm" href="'+ADMIN+'#obsah">Administrace</a>'+'<button type="button" class="kke-b kke-end" aria-label="Ukončit editační režim">Ukončit</button>');
document.body.appendChild(bar);
var st=bar.querySelector('.kke-st'),bUndo=bar.querySelector('.kke-undo'),bDrop=bar.querySelector('.kke-drop'),bSave=bar.querySelector('.kke-save');
var toastT;function toast(m,typ){var x=document.querySelector('.kke-toast')||document.body.appendChild(Object.assign(document.createElement('div'),{className:'kke-toast'}));x.setAttribute('role','status');x.className='kke-toast on '+(typ||'');x.innerHTML=m;clearTimeout(toastT);toastT=setTimeout(function(){x.className='kke-toast'},3800)}

function stav(){
  var n=Object.keys(cekajici).length;
  st.textContent=n?n+' '+(n===1?'neuložená změna':n<5?'neuložené změny':'neuložených změn'):'Klikněte na text a pište';
  st.classList.toggle('dirty',!!n);bSave.disabled=bDrop.disabled=!n;bUndo.disabled=!zasobnik.length;
}
function oznac(){
  [].forEach.call(document.querySelectorAll('[data-t]'),function(e){
    var k=e.dataset.t;e.classList.toggle('kke-upr',!!ulozene[k]&&!e.hasAttribute('data-cena'));e.classList.toggle('kke-ceka',k in cekajici);
    if(!e.hasAttribute('tabindex')&&!/^(A|BUTTON)$/.test(e.tagName)){e.setAttribute('tabindex','0');e.dataset.kkeTi='1'}
  });
}
function zacni(e){
  if(aktivni===e)return;if(aktivni)skonci();
  if(e.hasAttribute('data-cena')){toast('<b>Ceny se upravují v administraci</b> v sekci Ceník, aby se změnily všude naráz (i ve výpočtu rezervace).<a href="'+ADMIN+'#cenik" target="_top">Otevřít Ceník</a>','lock');return}
  aktivni=e;predEditaci=e.innerHTML;e.contentEditable='true';e.classList.add('kke-act');e.focus();
  var r=document.createRange();r.selectNodeContents(e);r.collapse(false);var s=getSelection();s.removeAllRanges();s.addRange(r);
}
function skonci(){
  var e=aktivni;if(!e)return;aktivni=null;e.contentEditable='false';e.classList.remove('kke-act');
  var k=e.dataset.t,nove=KK.cisti(e.innerHTML),pred=KK.cisti(predEditaci);
  if(!nove.replace(/<br>/g,'').trim()){e.innerHTML=predEditaci;toast('Text nemůže zůstat prázdný – vrátil jsem předchozí.');return}
  if(nove!==pred){zasobnik.push({k:k,html:predEditaci,meli:k in cekajici,byl:cekajici[k]});cekajici[k]=nove;e.innerHTML=nove;els(k).forEach(function(x){if(x!==e)x.innerHTML=nove})}
  stav();oznac();
}
/* klikání: v režimu úprav texty neodkazují */
document.addEventListener('click',function(ev){
  if(ev.target.closest('.kke-bar,.kke-toast'))return;
  var e=ev.target.closest('[data-t]');
  if(e){ev.preventDefault();ev.stopImmediatePropagation();zacni(e);return}
  var g=ev.target.closest('#galerie .gl-i');if(g){ev.preventDefault();ev.stopImmediatePropagation();toast('Fotky a jejich popisky se spravují v administraci v sekci Galerie.<a href="'+ADMIN+'#galerie" target="_top">Otevřít Galerii</a>');return}
  if(aktivni&&!ev.target.closest('.kke-act'))skonci();
},true);
document.addEventListener('keydown',function(ev){
  var e=ev.target.closest&&ev.target.closest('[data-t]');
  if(!aktivni&&e&&(ev.key==='Enter'||ev.key===' ')&&!ev.target.isContentEditable){ev.preventDefault();zacni(e);return}
  if(!aktivni)return;
  if(ev.key==='Escape'){ev.preventDefault();aktivni.innerHTML=predEditaci;var a=aktivni;skonci();a.focus()}
  else if(ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();var b=aktivni;skonci();b.focus()}
  else if(ev.key==='Enter'&&ev.shiftKey&&/^(SPAN|A|BUTTON|H\d|SMALL|B|STRONG|EM|LABEL|SUP)$/.test(aktivni.tagName)){ev.preventDefault()}
},true);
document.addEventListener('paste',function(ev){if(!aktivni)return;ev.preventDefault();var t=(ev.clipboardData||window.clipboardData).getData('text/plain').replace(/\s*\n\s*/g,' ');document.execCommand('insertText',false,t)},true);
document.addEventListener('focusout',function(ev){if(aktivni&&ev.target===aktivni)setTimeout(function(){if(aktivni&&document.activeElement!==aktivni)skonci()},0)},true);

bUndo.addEventListener('click',function(){var z=zasobnik.pop();if(!z)return;els(z.k).forEach(function(x){x.innerHTML=z.html});if(z.meli)cekajici[z.k]=z.byl;else delete cekajici[z.k];stav();oznac()});
bDrop.addEventListener('click',function(){if(!confirm('Zahodit všechny neuložené změny?'))return;Object.keys(cekajici).forEach(function(k){var h=ulozene[k]!=null?ulozene[k]:orig[k];if(h!=null)els(k).forEach(function(x){x.innerHTML=h})});cekajici={};zasobnik=[];stav();oznac()});
bSave.addEventListener('click',function(){
  if(aktivni)skonci();var z={};
  Object.keys(cekajici).forEach(function(k){z[k]=(orig[k]!=null&&cekajici[k]===orig[k])?null:cekajici[k]});
  bSave.disabled=true;
  KK.texty.uloz(z).then(function(t){ulozene=t;var n=Object.keys(cekajici).length;cekajici={};zasobnik=[];stav();oznac();toast('Uloženo – '+n+' '+(n===1?'změna':n<5?'změny':'změn')+'.','ok')})
  .catch(function(){bSave.disabled=false;toast('Uložení se nepovedlo. Zkuste to znovu.','err')});
});
if(!VRAMCI)bar.querySelector('.kke-end').addEventListener('click',function(){
  if(Object.keys(cekajici).length&&!confirm('Máte neuložené změny. Opravdu odejít bez uložení?'))return;
  cekajici={};location.href=location.pathname+location.hash;
});
window.KKE={neulozeno:function(){return Object.keys(cekajici).length>0}};
addEventListener('beforeunload',function(e){if(Object.keys(cekajici).length){e.preventDefault();e.returnValue=''}});
stav();oznac();
/* skok z administrace na konkrétní text: ?edit=1#t=klic */
var hk=decodeURIComponent((location.hash.match(/^#t=(.+)$/)||[])[1]||'');
if(hk){var he=document.querySelector('[data-t="'+hk+'"]');if(he){setTimeout(function(){var vis=he.getClientRects().length>0;if(vis){he.scrollIntoView({block:'center'});he.classList.add('kke-act');setTimeout(function(){he.classList.remove('kke-act')},1600);he.focus({preventScroll:true})}else toast('Tento text je teď skrytý (např. v dalším kroku rezervace nebo v mobilním menu). Upravte ho v administraci v sekci Obsah webu.')},600)}}
if(!KK.LS.get('editace-napoveda',0)){toast('<b>Klikněte na libovolný text a pište.</b> Enter = hotovo, Esc = zrušit, Shift+Enter = nový řádek. Ceny a fotky se upravují v administraci.');KK.LS.set('editace-napoveda',1)}
})();
