/* Kemp Krumlov – úpravy z administrace, které nejsou v HTML pod klíčem data-t:
   • texty vypisované skripty a animacemi (mapy, karty, rezervace, SVG popisky)  → kk.dtexty  {"původní text":"nový text"}
   • fotky (img i obrázky na pozadí z CSS)                                           → kk.obrazky {"img/soubor.webp":{id,v}}  (data v IndexedDB kk-obrazky)
   • ikony                                                                          → kk.ikony   {"klíč ikony":{n:"tent",s:"<path…>"}}
   Načítá se hned v <head>, takže úprava se použije dřív, než se stránka vykreslí, i u obsahu,
   který skripty vytvoří později (MutationObserver).
   Na serveru: stejná data vrátí GET /api/prepisy a fotky budou běžné URL – soubor zůstane, jen místo localStorage načte JSON. */
(function(){
'use strict';
function get(k){try{var v=localStorage.getItem('kk.'+k);return v?JSON.parse(v):null}catch(e){return null}}
var T=get('dtexty')||{},O=get('obrazky')||{},I=get('ikony')||{};
var EDIT=/[?&]edit(=1)?(&|$)/.test(location.search);
var BASE=(document.currentScript&&document.currentScript.src||location.href).replace(/js\/prepisy\.js.*$/,'').replace(/[?#].*$/,'');
var URLY={};/* cesta → objectURL nahrazené fotky */
var SKIP='script,style,noscript,textarea,[data-t],[data-c],[data-cena],.kke-ui';
var norm=function(s){return s.replace(/\s+/g,' ').trim()};

/* ---------- fotky v IndexedDB ---------- */
var _db=null;
function db(){if(_db)return _db;_db=new Promise(function(ok,no){if(!window.indexedDB)return no();var r=indexedDB.open('kk-obrazky',1);r.onupgradeneeded=function(){r.result.createObjectStore('o',{keyPath:'id'})};r.onsuccess=function(){ok(r.result)};r.onerror=function(){no(r.error)}});return _db}
function tx(mode,fn){return db().then(function(d){return new Promise(function(ok,no){var t=d.transaction('o',mode),s=t.objectStore('o'),r=fn(s);t.oncomplete=function(){ok(r&&r.result!==undefined?r.result:r)};t.onerror=function(){no(t.error)}})})}

/* ---------- pomocné ---------- */
function cesta(u){/* absolutní / relativní URL → "img/x.webp" */
  if(!u)return '';u=String(u).replace(/^url\(["']?|["']?\)$/g,'');if(/^(data|blob):/.test(u))return '';
  try{u=new URL(u,location.href).href}catch(e){return ''}
  return u.indexOf(BASE)===0?u.slice(BASE.length).replace(/[?#].*$/,''):'';
}
function hash(s){var h=5381;for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36)}
function jeIkona(svg){
  if(!svg||svg.tagName.toLowerCase()!=='svg'||(svg.parentNode&&svg.parentNode.closest&&svg.parentNode.closest('svg')))return false;
  var vb=(svg.getAttribute('viewBox')||'').replace(/,/g,' ').trim();
  if(vb!=='0 0 24 24'&&vb!=='0 0 16 16')return false;
  return !svg.querySelector('text,image,foreignObject')&&!svg.closest('.kke-ui,.flag');
}
function klicIkony(svg){
  if(svg.dataset.i)return svg.dataset.i;
  if(svg.__kkI==null)svg.__kkI='h:'+hash(norm(svg.innerHTML).replace(/\s*\/>/g,'/>'));
  return svg.__kkI;
}

/* ---------- použití ---------- */
function text(n){
  if(n.__kkl!==undefined&&n.data===n.__kkl)return;
  var p=n.parentNode;if(!p||p.nodeType!==1||(p.closest&&p.closest(SKIP)))return;
  var o=norm(n.data);if(!o)return;
  n.__kko=o;
  if(T[o]!=null&&T[o]!==o){var m=n.data.match(/^(\s*)[\s\S]*?(\s*)$/);n.data=m[1]+T[o]+m[2]}
  n.__kkl=n.data;
}
function obrazek(img){
  var src=img.getAttribute('src');if(img.__kkl===src)return;
  var c=img.__kko&&img.__kkl===src?img.__kko:cesta(src);if(!c)return;
  img.__kko=c;
  if(O[c]){
    if(URLY[c]){img.removeAttribute('srcset');if(src!==URLY[c])img.setAttribute('src',URLY[c]);img.removeAttribute('data-kkp-ceka')}
    else img.setAttribute('data-kkp-ceka','');
  }
  img.__kkl=img.getAttribute('src');
}
function pozadi(el){
  var bg=el.style&&el.style.backgroundImage;if(!bg||bg.indexOf('url(')<0||el.__kkb===bg)return;
  var m=bg.match(/url\(["']?([^"')]+)["']?\)/),c=m&&cesta(m[1]);
  if(c&&O[c]&&URLY[c]){el.__kkbo=c;el.style.backgroundImage='url("'+URLY[c]+'")'}
  el.__kkb=el.style.backgroundImage;
}
function ikona(svg){
  if(svg.__kkl!==undefined&&svg.innerHTML===svg.__kkl)return;
  if(!jeIkona(svg))return;
  if(svg.__kkpuv==null){svg.__kkpuv=svg.innerHTML;svg.__kkvb=svg.getAttribute('viewBox')}
  var z=I[klicIkony(svg)];
  if(z&&z.s){
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');
    if(!svg.getAttribute('stroke-width'))svg.setAttribute('stroke-width','2');
    svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.innerHTML=z.s;
  }
  svg.__kkl=svg.innerHTML;
}
function projdi(root){
  if(root.nodeType===3){text(root);return}
  if(root.nodeType!==1)return;
  var tag=root.tagName.toLowerCase();if(tag==='script'||tag==='style')return;
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;while((n=w.nextNode()))text(n);
  if(tag==='img')obrazek(root);if(tag==='svg')ikona(root);
  [].forEach.call(root.getElementsByTagName('img'),obrazek);
  [].forEach.call(root.getElementsByTagName('svg'),ikona);
  if(maObr){if(root.style)pozadi(root);[].forEach.call(root.querySelectorAll('[style*="url("]'),pozadi)}
}
/* obrázky na pozadí z CSS souborů – přepíše přímo pravidla stylů */
function cssPozadi(){
  if(!maObr)return;
  [].forEach.call(document.styleSheets,function(sh){var r;try{r=sh.cssRules}catch(e){return}
    (function walk(rs){[].forEach.call(rs,function(x){
      if(x.cssRules)walk(x.cssRules);
      if(!x.style)return;
      ['background-image','background'].forEach(function(p){var v=x.style.getPropertyValue(p);if(!v||v.indexOf('url(')<0)return;
        var nv=v.replace(/url\(["']?([^"')]+)["']?\)/g,function(a,u){var full;try{full=new URL(u,sh.href||location.href).href}catch(e){return a}
          if(!x.__kko)x.__kko={};var c=x.__kko[u]||cesta(full);if(c){x.__kko[u]=c;if(O[c]&&URLY[c]){x.__kko[URLY[c]]=c;return 'url("'+URLY[c]+'")'}}return a});
        if(nv!==v)x.style.setProperty(p,nv,x.style.getPropertyPriority(p));
      });
    })})(r);
  });
}
var maObr=Object.keys(O).length>0;
var zapnuto=EDIT||maObr||Object.keys(T).length>0||Object.keys(I).length>0;

window.KKP={
  EDIT:EDIT,jeIkona:jeIkona,klicIkony:klicIkony,cesta:cesta,norm:norm,
  texty:function(){return T},obrazky:function(){return O},ikony:function(){return I},
  puvodniText:function(n){return n.__kko||norm(n.data)},
  puvodniFotka:function(el){if(el.tagName==='IMG')return el.__kko||cesta(el.getAttribute('src'));return el.__kkbo||''},
  url:function(c){return URLY[c]||(c?BASE+c:'')},
  /* živé nastavení (editační režim) – uložení dělá administrace / editace */
  nastavText:function(orig,nove){if(nove==null||nove===orig)delete T[orig];else T[orig]=nove;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n;
    while((n=w.nextNode()))if(n.__kko===orig){var m=n.data.match(/^(\s*)[\s\S]*?(\s*)$/);n.data=m[1]+(T[orig]!=null?T[orig]:orig)+m[2];n.__kkl=n.data}},
  nastavFotku:function(c,z,url){
    if(z){O[c]=z;URLY[c]=url}else{delete O[c];delete URLY[c]}
    maObr=true;
    [].forEach.call(document.getElementsByTagName('img'),function(i){if(i.__kko===c){i.removeAttribute('srcset');i.setAttribute('src',z?url:BASE+c);i.__kkl=i.getAttribute('src');i.removeAttribute('data-kkp-ceka')}});
    [].forEach.call(document.querySelectorAll('[style*="url("]'),function(e){if(e.__kkbo===c||cesta((e.style.backgroundImage.match(/url\(["']?([^"')]+)/)||[])[1])===c){e.__kkbo=c;e.style.backgroundImage='url("'+(z?url:BASE+c)+'")';e.__kkb=e.style.backgroundImage}});
    [].forEach.call(document.styleSheets,function(sh){var r;try{r=sh.cssRules}catch(e){return}(function walk(rs){[].forEach.call(rs,function(x){if(x.cssRules)walk(x.cssRules);if(!x.style||!x.__kko)return;
      ['background-image','background'].forEach(function(p){var v=x.style.getPropertyValue(p);if(!v)return;var nv=v.replace(/url\(["']?([^"')]+)["']?\)/g,function(a,u){var cc=x.__kko[u];if(cc!==c)return a;var nu=z?url:BASE+c;x.__kko[nu]=c;return 'url("'+nu+'")'});if(nv!==v)x.style.setProperty(p,nv,x.style.getPropertyPriority(p))})})})(r)});
    cssPozadi();
  },
  nastavIkonu:function(k,z){if(z)I[k]=z;else delete I[k];
    [].forEach.call(document.getElementsByTagName('svg'),function(s){if(s.__kkpuv==null||klicIkony(s)!==k)return;
      if(z){s.setAttribute('viewBox','0 0 24 24');s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');if(!s.getAttribute('stroke-width'))s.setAttribute('stroke-width','2');s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');s.innerHTML=z.s}
      else{s.innerHTML=s.__kkpuv;if(s.__kkvb)s.setAttribute('viewBox',s.__kkvb)}
      s.__kkl=s.innerHTML})},
  puvodniIkona:function(svg){return svg.__kkpuv!=null?svg.__kkpuv:svg.innerHTML},
  /* úložiště fotek */
  fotky:{
    uloz:function(id,blob){return tx('readwrite',function(s){s.put({id:id,blob:blob,kdy:Date.now()})})},
    nacti:function(id){return tx('readonly',function(s){return s.get(id)})},
    vse:function(){return tx('readonly',function(s){return s.getAll()})},
    smaz:function(ids){return tx('readwrite',function(s){ids.forEach(function(i){s.delete(i)})})},
    vymaz:function(){return tx('readwrite',function(s){s.clear()})}
  },
  znovu:function(){if(document.body)projdi(document.body)}
};
if(!zapnuto)return;

if(maObr){var st=document.createElement('style');st.textContent='img[data-kkp-ceka]{visibility:hidden}';document.head.appendChild(st)}
var mo=new MutationObserver(function(rs){
  for(var i=0;i<rs.length;i++){var r=rs[i];
    if(r.type==='childList'){for(var j=0;j<r.addedNodes.length;j++)projdi(r.addedNodes[j]);
      if(r.target.tagName&&r.target.tagName.toLowerCase()==='svg')ikona(r.target);
      else if(r.target.nodeType===1&&r.target.closest){var s=r.target.closest('svg');if(s&&s.parentNode&&!s.parentNode.closest('svg'))ikona(s)}}
    else if(r.type==='characterData')text(r.target);
    else if(r.attributeName==='src'&&r.target.tagName==='IMG')obrazek(r.target);
    else if(r.attributeName==='style')pozadi(r.target);
  }
});
var opt={childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:maObr?['src','style']:['src']};
mo.observe(document.documentElement,opt);
if(document.body)projdi(document.body);
document.addEventListener('DOMContentLoaded',function(){projdi(document.body);cssPozadi()});

/* načtení nahrazených fotek */
if(maObr)KKP.fotky.vse().then(function(a){
  var m={};a.forEach(function(x){m[x.id]=x});
  Object.keys(O).forEach(function(c){var z=O[c];if(z&&z.url)URLY[c]=z.url;else if(z&&m[z.id])URLY[c]=URL.createObjectURL(m[z.id].blob)});
  [].forEach.call(document.getElementsByTagName('img'),function(i){i.__kkl=null;obrazek(i)});
  [].forEach.call(document.querySelectorAll('[style*="url("]'),function(e){e.__kkb=null;pozadi(e)});
  cssPozadi();if(document.readyState!=='loading')cssPozadi();else document.addEventListener('DOMContentLoaded',cssPozadi);
}).catch(function(){[].forEach.call(document.querySelectorAll('img[data-kkp-ceka]'),function(i){i.removeAttribute('data-kkp-ceka')})});
})();
