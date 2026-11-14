/* =====================================================================
   Kemp Krumlov – DATOVÁ VRSTVA (sdílená webem i administrací)
   ---------------------------------------------------------------------
   Teď (náhled):  data se ukládají v prohlížeči (localStorage + IndexedDB).
   Na serveru:    přepnout KK.MODE na 'server' a doplnit KK.API_URL.
                  Každá funkce má popsaný odpovídající požadavek na API
                  (viz admin/NAPOJENI-NA-SERVER.md). Web ani administrace
                  se kromě tohoto souboru měnit nemusí.
   ===================================================================== */
(function(){
'use strict';
var KK=window.KK=window.KK||{};
KK.MODE='local';          // 'local' | 'server'
KK.API_URL='/api';        // adresa API na serveru

var LS={
  get:function(k,d){try{var v=localStorage.getItem('kk.'+k);return v?JSON.parse(v):d}catch(e){return d}},
  set:function(k,v){try{localStorage.setItem('kk.'+k,JSON.stringify(v));return true}catch(e){return false}},
  del:function(k){try{localStorage.removeItem('kk.'+k)}catch(e){}}
};
KK.LS=LS;

function api(method,path,body){
  return fetch(KK.API_URL+path,{method:method,credentials:'same-origin',headers:body instanceof FormData?{}:{'Content-Type':'application/json','Accept':'application/json'},body:body instanceof FormData?body:(body?JSON.stringify(body):undefined)})
  .then(function(r){if(!r.ok)throw new Error('API '+r.status);return r.status===204?null:r.json()});
}

/* ---------------- PŘIHLÁŠENÍ ---------------- */
/* server: POST /api/login {email,heslo} · POST /api/logout · GET /api/me */
/* ---------------- UŽIVATELÉ, ROLE A PRÁVA ----------------
   role: admin = Správce (smí vše, spravuje uživatele), obsluha = Obsluha (jen sekce povolené v KK.prava).
   Náhled: účty jsou v prohlížeči, heslo jen jako otisk SHA-256 se solí – skutečná ochrana bude až na serveru
   (Laravel: tabulka users s rolí, hesla bcrypt, přihlášení přes session, práva přes middleware/Policy).
   server: POST /login {login,heslo} · POST /logout · GET /me · GET/POST/PUT/DELETE /uzivatele · GET/PUT /prava · PUT /me/heslo */
KK.ROLE={admin:'Správce',obsluha:'Obsluha'};
KK.SEKCE={prehled:'Přehled',upravit:'Upravit web',galerie:'Galerie',seo:'SEO',rezervace:'Rezervace',cenik:'Ceník a kapacity',nastaveni:'Nastavení a záloha'};
var PRAVA0={obsluha:{prehled:1,upravit:1,galerie:1,rezervace:1,seo:0,cenik:0,nastaveni:0}};
function hex(b){return [].map.call(new Uint8Array(b),function(x){return ('0'+x.toString(16)).slice(-2)}).join('')}
function otisk(sul,heslo){var t=sul+'|'+heslo;
  if(window.crypto&&crypto.subtle&&window.TextEncoder)return crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)).then(hex);
  var h=2166136261;for(var i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return Promise.resolve('f'+h.toString(16))}
function novaSul(){var a=new Uint8Array(12);(window.crypto||{}).getRandomValues?crypto.getRandomValues(a):a.forEach(function(_,i){a[i]=Math.random()*256|0});return hex(a)}
function seznamU(){var u=LS.get('uzivatele',null);if(!u||!u.length){u=[{id:'u1',jmeno:'Správce',login:'admin',email:'',role:'admin',aktivni:true,vychozi:true,vytvoren:Date.now()}];LS.set('uzivatele',u)}return u}
function ulozU(u){LS.set('uzivatele',u)}
function verejny(x){return{id:x.id,jmeno:x.jmeno,login:x.login,email:x.email||'',role:x.role,aktivni:x.aktivni!==false,vychozi:!!x.vychozi,posledni:x.posledni||null,vytvoren:x.vytvoren||null}}
function overHeslo(u,heslo){if(u.vychozi&&!u.hash)return Promise.resolve(heslo==='kemp');return otisk(u.sul,heslo).then(function(h){return h===u.hash})}
function nastavHeslo(u,heslo){u.sul=novaSul();return otisk(u.sul,heslo).then(function(h){u.hash=h;delete u.vychozi;return u})}
function kontrolaHesla(h){if(!h||h.length<8)return 'Heslo musí mít aspoň 8 znaků.';return ''}
function aktivniSpravci(u){return u.filter(function(x){return x.role==='admin'&&x.aktivni!==false})}
KK.prava={
  vse:function(){var p=LS.get('prava',null)||{};var o={};Object.keys(PRAVA0).forEach(function(r){o[r]=Object.assign({},PRAVA0[r],p[r]||{});o[r].prehled=1});return o},
  uloz:function(p){LS.set('prava',p);historie('Práva','upravena práva obsluhy');return Promise.resolve(KK.prava.vse())}
};
KK.auth={
  login:function(user,pass){
    if(KK.MODE==='server')return api('POST','/login',{login:user,heslo:pass});
    var u=seznamU(),q=String(user||'').trim().toLowerCase(),x=u.filter(function(y){return y.login.toLowerCase()===q||(y.email&&y.email.toLowerCase()===q)})[0];
    var chyba=function(){return Promise.reject(new Error('Špatné přihlašovací jméno nebo heslo.'))};
    if(!x||!pass)return chyba();
    return overHeslo(x,pass).then(function(ok){
      if(!ok)return chyba();
      if(x.aktivni===false)return Promise.reject(new Error('Účet je vypnutý. Obraťte se na správce.'));
      x.posledni=Date.now();ulozU(u);
      var s={id:x.id,jmeno:x.jmeno,role:x.role,od:Date.now(),do:Date.now()+12*3600e3};LS.set('session',s);return s});
  },
  logout:function(){if(KK.MODE==='server')return api('POST','/logout');LS.del('session');return Promise.resolve()},
  me:function(){if(KK.MODE==='server')return api('GET','/me').catch(function(){return null});return Promise.resolve(KK.auth.meSync())},
  /* aktuální přihlášený – vždy s čerstvou rolí; vypnutý nebo smazaný účet se odhlásí */
  meSync:function(){var s=LS.get('session',null);if(!s||s.do<=Date.now()){if(s)LS.del('session');return null}
    var x=seznamU().filter(function(y){return y.id===s.id})[0];
    if(!x||x.aktivni===false){LS.del('session');return null}
    s.jmeno=x.jmeno;s.role=x.role;s.vychozi=!!x.vychozi;s.login=x.login;s.email=x.email||'';return s},
  muze:function(sekce){var s=KK.auth.meSync();if(!s)return false;if(s.role==='admin')return true;if(sekce==='uzivatele')return false;if(sekce==='ucet')return true;var p=KK.prava.vse()[s.role]||{};return !!p[sekce]},
  zmenHeslo:function(stare,nove){var s=KK.auth.meSync();if(!s)return Promise.reject(new Error('Nejste přihlášen.'));
    var e=kontrolaHesla(nove);if(e)return Promise.reject(new Error(e));
    var u=seznamU(),x=u.filter(function(y){return y.id===s.id})[0];
    return overHeslo(x,stare).then(function(ok){if(!ok)throw new Error('Současné heslo nesouhlasí.');return nastavHeslo(x,nove)}).then(function(){ulozU(u);historie('Účet','změna hesla')})},
  upravSebe:function(z){var s=KK.auth.meSync();if(!s)return Promise.reject(new Error('Nejste přihlášen.'));return KK.uzivatele.uprav(s.id,{jmeno:z.jmeno,email:z.email},true)}
};
KK.uzivatele={
  seznam:function(){return Promise.resolve(seznamU().map(verejny))},
  pridej:function(z){if(!KK.auth.muze('uzivatele'))return Promise.reject(new Error('Uživatele spravuje jen správce.'));
    var u=seznamU(),login=String(z.login||'').trim();
    if(!String(z.jmeno||'').trim())return Promise.reject(new Error('Vyplňte jméno.'));
    if(!/^[a-z0-9._@-]{3,}$/i.test(login))return Promise.reject(new Error('Přihlašovací jméno: aspoň 3 znaky, bez mezer a diakritiky.'));
    if(u.some(function(y){return y.login.toLowerCase()===login.toLowerCase()}))return Promise.reject(new Error('Toto přihlašovací jméno už existuje.'));
    var e=kontrolaHesla(z.heslo);if(e)return Promise.reject(new Error(e));
    var x={id:'u'+Date.now().toString(36),jmeno:z.jmeno.trim(),login:login,email:String(z.email||'').trim(),role:KK.ROLE[z.role]?z.role:'obsluha',aktivni:true,vytvoren:Date.now()};
    return nastavHeslo(x,z.heslo).then(function(){u.push(x);ulozU(u);historie('Uživatelé','přidán '+x.jmeno+' ('+KK.ROLE[x.role]+')');return verejny(x)})},
  uprav:function(id,z,sebe){if(!sebe&&!KK.auth.muze('uzivatele'))return Promise.reject(new Error('Uživatele spravuje jen správce.'));
    var u=seznamU(),x=u.filter(function(y){return y.id===id})[0];if(!x)return Promise.reject(new Error('Uživatel neexistuje.'));
    var pred=JSON.stringify(verejny(x));
    if(z.jmeno!=null){if(!String(z.jmeno).trim())return Promise.reject(new Error('Jméno nesmí být prázdné.'));x.jmeno=String(z.jmeno).trim()}
    if(z.email!=null)x.email=String(z.email).trim();
    if(!sebe&&z.role!=null&&KK.ROLE[z.role])x.role=z.role;
    if(!sebe&&z.aktivni!=null)x.aktivni=!!z.aktivni;
    if(!aktivniSpravci(u).length){var p=JSON.parse(pred);x.role=p.role;x.aktivni=p.aktivni;return Promise.reject(new Error('Musí zůstat aspoň jeden aktivní správce.'))}
    ulozU(u);if(!sebe)historie('Uživatelé','upraven '+x.jmeno);return Promise.resolve(verejny(x))},
  noveHeslo:function(id,heslo){if(!KK.auth.muze('uzivatele'))return Promise.reject(new Error('Uživatele spravuje jen správce.'));
    var e=kontrolaHesla(heslo);if(e)return Promise.reject(new Error(e));
    var u=seznamU(),x=u.filter(function(y){return y.id===id})[0];if(!x)return Promise.reject(new Error('Uživatel neexistuje.'));
    return nastavHeslo(x,heslo).then(function(){ulozU(u);historie('Uživatelé','nové heslo pro '+x.jmeno)})},
  smaz:function(id){if(!KK.auth.muze('uzivatele'))return Promise.reject(new Error('Uživatele spravuje jen správce.'));
    var s=KK.auth.meSync();if(s&&s.id===id)return Promise.reject(new Error('Sami sebe smazat nemůžete.'));
    var u=seznamU(),x=u.filter(function(y){return y.id===id})[0],z=u.filter(function(y){return y.id!==id});
    if(!aktivniSpravci(z).length)return Promise.reject(new Error('Musí zůstat aspoň jeden aktivní správce.'));
    ulozU(z);historie('Uživatelé','smazán '+(x?x.jmeno:id));return Promise.resolve()},
  heslo:function(){var a='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789',o='',r=new Uint8Array(12);(window.crypto||{}).getRandomValues?crypto.getRandomValues(r):r.forEach(function(_,i){r[i]=Math.random()*256|0});for(var i=0;i<12;i++)o+=a[r[i]%a.length];return o}
};

/* ---------------- TEXTY WEBU ----------------
   Uloženy jen ZMĚNĚNÉ texty: { 'o-kempu.3': '<em>…</em>', … }
   server: GET /api/texty · PUT /api/texty {klic:html,…} · DELETE /api/texty/{klic} */
/* jazyky: čeština = 'texty', ostatní = 'texty.en', 'texty.de' (překlady; co chybí, zůstane česky)
   server: …/texty?lang=en */
KK.JAZYKY={cs:'Čeština',en:'English',de:'Deutsch'};
KK.JAZYK=window.KK_LANG||'cs';
function kJ(base,j){j=j||KK.JAZYK;return j==='cs'?base:base+'.'+j}
KK.texty={
  vse:function(j){return KK.MODE==='server'?api('GET','/texty?lang='+(j||KK.JAZYK)):Promise.resolve(LS.get(kJ('texty',j),{}))},
  vseSync:function(j){return LS.get(kJ('texty',j),{})},
  uloz:function(zmeny,j){
    if(KK.MODE==='server')return api('PUT','/texty?lang='+(j||KK.JAZYK),zmeny);
    var key=kJ('texty',j),t=LS.get(key,{});Object.keys(zmeny).forEach(function(k){if(zmeny[k]===null)delete t[k];else t[k]=zmeny[k]});
    LS.set(key,t);if(Object.keys(zmeny).length)historie((j||KK.JAZYK)==='cs'?'Texty':'Překlad '+(j||KK.JAZYK).toUpperCase(),Object.keys(zmeny).length+' změn');return Promise.resolve(t);
  },
  obnov:function(klic){var z={};z[klic]=null;return KK.texty.uloz(z)}
};

/* čištění HTML z editoru – povolené jen základní formátování */
var OK_TAG={EM:1,STRONG:1,B:1,I:1,BR:1,SUP:1,SMALL:1,U:1};
KK.cisti=function(html){
  var d=document.createElement('div');d.innerHTML=html;
  (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType===3)return;
    if(c.nodeType!==1){c.remove();return}
    walk(c);
    if(OK_TAG[c.tagName]){[].slice.call(c.attributes).forEach(function(a){c.removeAttribute(a.name)});return}
    if(c.tagName==='DIV'||c.tagName==='P'){c.insertAdjacentHTML('beforebegin','<br>')}
    while(c.firstChild)c.parentNode.insertBefore(c.firstChild,c);c.remove();
  })})(d);
  return d.innerHTML.replace(/^(<br>)+|(<br>)+$/g,'').replace(/&nbsp;/g,' ').trim();
};

/* ---------------- SEO ----------------
   server: GET /api/seo · PUT /api/seo  (server je pak vypisuje přímo do <head>) */
KK.SEO_VYCHOZI={
  title:'Kemp Krumlov — vodácký kemp nejblíže centru Českého Krumlova',
  description:'Kemp Krumlov na břehu Vltavy, nejblíže centru Českého Krumlova. Chatky, teepee, podsadové stany, místa pro stany i karavany, půjčovna lodí PE-LA.',
  canonical:'https://www.kemp-krumlov.cz/',
  index:true,
  ogTitle:'',ogDescription:'',ogImage:'img/kemp_reprezentativni.webp',
  googleVerify:'',
  firma:{nazev:'Kemp Krumlov',ulice:'Domoradice 107',mesto:'Český Krumlov',psc:'381 01',telefon:'+420 720 514 943',email:'kempkrumlov2017@gmail.com',lat:'48.8190',lng:'14.3276',sezonaOd:'05-01',sezonaDo:'10-01',cenovaHladina:'190–990 Kč'}
};
KK.seo={
  nacti:function(){return KK.MODE==='server'?api('GET','/seo'):Promise.resolve(KK.seo.nactiSync())},
  nactiSync:function(){var u=LS.get('seo',null)||{};var v=JSON.parse(JSON.stringify(KK.SEO_VYCHOZI));Object.keys(u).forEach(function(k){if(k==='firma')Object.assign(v.firma,u.firma||{});else v[k]=u[k]});return v},
  uloz:function(d){if(KK.MODE==='server')return api('PUT','/seo',d);LS.set('seo',d);historie('SEO','uloženo');return Promise.resolve(d)},
  upraveno:function(){return !!LS.get('seo',null)}
};

/* ---------------- CENÍK ----------------
   Výchozí ceník je v js/cenik.js (KKC.vychozi). Ukládá se celý.
   server: GET /api/cenik · PUT /api/cenik (server ho pak vypisuje do stránky jako window.KK_CENIK_DATA) */
KK.cenik={
  nacti:function(){if(KK.MODE==='server')return api('GET','/cenik');var u=LS.get('cenik',null);return Promise.resolve(u&&u.verze===1?u:null)},
  uloz:function(c){if(KK.MODE==='server')return api('PUT','/cenik',c);LS.set('cenik',c);historie('Ceník','uloženo');return Promise.resolve(c)},
  obnov:function(){if(KK.MODE==='server')return api('DELETE','/cenik');LS.del('cenik');historie('Ceník','vrácen na výchozí');return Promise.resolve()},
  upraveno:function(){return !!LS.get('cenik',null)}
};

/* ---------------- GALERIE ----------------
   Fotka: {id, popis, kat:'ubyt'|'reka'|'vecer'|'', poradi, viditelna, w, h, src (cesta) | blob, nahled(blob), velikost, pridano}
   server: GET /api/fotky · POST /api/fotky (multipart, více souborů) · PATCH /api/fotky/{id} · DELETE /api/fotky/{id} · PUT /api/fotky/poradi [id,…] */
var DBN='kk-admin',DBV=1,_db=null;
function db(){if(_db)return _db;_db=new Promise(function(ok,no){var r=indexedDB.open(DBN,DBV);r.onupgradeneeded=function(){var d=r.result;if(!d.objectStoreNames.contains('fotky'))d.createObjectStore('fotky',{keyPath:'id'})};r.onsuccess=function(){ok(r.result)};r.onerror=function(){no(r.error)}});return _db}
function tx(mode,fn){return db().then(function(d){return new Promise(function(ok,no){var t=d.transaction('fotky',mode),s=t.objectStore('fotky'),res=fn(s);t.oncomplete=function(){ok(res&&res.result!==undefined?res.result:res)};t.onerror=function(){no(t.error)}})})}
KK.KATEGORIE={ubyt:'Ubytování',reka:'U řeky',vecer:'Večery'};
KK.galerie={
  aktivni:function(){return !!LS.get('galerie',null)},
  seznam:function(){
    if(KK.MODE==='server')return api('GET','/fotky');
    return tx('readonly',function(s){return s.getAll()}).then(function(a){return a.sort(function(x,y){return x.poradi-y.poradi})});
  },
  /* první spuštění: převezme fotky, které jsou teď na webu */
  zalozZWebu:function(polozky){
    return tx('readwrite',function(s){polozky.forEach(function(p,i){s.put({id:'web-'+i,popis:p.popis,kat:p.kat,poradi:i,viditelna:true,src:p.src,w:p.w||1536,h:p.h||1024,velikost:0,pridano:Date.now(),zdroj:'web'})})})
      .then(function(){LS.set('galerie',{v:1});return KK.galerie.seznam()});
  },
  pridej:function(soubory,vychoziKat,prubeh){
    if(KK.MODE==='server'){var fd=new FormData();soubory.forEach(function(f){fd.append('fotky[]',f)});fd.append('kat',vychoziKat||'');return api('POST','/fotky',fd)}
    var vysledky=[];
    return KK.galerie.seznam().then(function(vse){
      var start=vse.length?Math.max.apply(null,vse.map(function(x){return x.poradi}))+1:0;
      return soubory.reduce(function(p,f,i){return p.then(function(){
        if(prubeh)prubeh(i,'zpracovava');
        return zmensi(f,1920,0.82).then(function(velka){return zmensi(f,640,0.78).then(function(mala){
          var z={id:'f'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),popis:popisZNazvu(f.name),kat:vychoziKat||'',poradi:start+i,viditelna:true,blob:velka.blob,nahled:mala.blob,w:velka.w,h:velka.h,velikost:velka.blob.size,puvodni:f.size,pridano:Date.now(),zdroj:'nahrano'};
          return tx('readwrite',function(s){s.put(z)}).then(function(){vysledky.push(z);if(prubeh)prubeh(i,'hotovo',z)});
        })}).catch(function(e){if(prubeh)prubeh(i,'chyba',e)});
      })},Promise.resolve());
    }).then(function(){LS.set('galerie',{v:1,zmena:Date.now()});historie('Galerie','nahráno '+vysledky.length+' fotek');return vysledky});
  },
  uprav:function(id,zmena){
    if(KK.MODE==='server')return api('PATCH','/fotky/'+id,zmena);
    return tx('readwrite',function(s){var r=s.get(id);r.onsuccess=function(){if(r.result)s.put(Object.assign(r.result,zmena))}}).then(function(){LS.set('galerie',{v:1,zmena:Date.now()})});
  },
  smaz:function(ids){
    if(KK.MODE==='server')return Promise.all(ids.map(function(id){return api('DELETE','/fotky/'+id)}));
    return tx('readwrite',function(s){ids.forEach(function(id){s.delete(id)})}).then(function(){LS.set('galerie',{v:1,zmena:Date.now()});historie('Galerie','smazáno '+ids.length+' fotek')});
  },
  poradi:function(ids){
    if(KK.MODE==='server')return api('PUT','/fotky/poradi',ids);
    return tx('readwrite',function(s){ids.forEach(function(id,i){var r=s.get(id);r.onsuccess=function(){if(r.result){r.result.poradi=i;s.put(r.result)}}})}).then(function(){LS.set('galerie',{v:1,zmena:Date.now()})});
  },
  url:function(f,nahled){if(f.src)return f.src;var b=nahled&&f.nahled?f.nahled:f.blob;return b?URL.createObjectURL(b):''}
};
function popisZNazvu(n){n=n.replace(/\.[a-z0-9]+$/i,'').replace(/[_-]+/g,' ').replace(/\b(IMG|DSC|DSCN|PXL|P)\s?\d+\b/gi,'').replace(/\s+/g,' ').trim();return n?n.charAt(0).toUpperCase()+n.slice(1):''}
function zmensi(file,max,q){
  return (window.createImageBitmap?createImageBitmap(file):Promise.reject()).catch(function(){
    return new Promise(function(ok,no){var i=new Image();i.onload=function(){ok(i)};i.onerror=function(){no(new Error('Soubor nejde otevřít jako obrázek (např. HEIC z iPhonu – uložte ho jako JPG).'))};i.src=URL.createObjectURL(file)});
  }).then(function(img){
    var w=img.width,h=img.height,k=Math.min(1,max/Math.max(w,h)),W=Math.round(w*k),H=Math.round(h*k);
    var c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').drawImage(img,0,0,W,H);
    return new Promise(function(ok,no){c.toBlob(function(b){b?ok({blob:b,w:W,h:H}):no(new Error('Převod se nezdařil'))},'image/webp',q)});
  });
}


/* ---------------- PŘEPISY: texty ze skriptů a animací, fotky na webu, ikony ----------------
   (na webu je použije js/start.js)
   dtexty  {"původní text":"nový text"}       server: GET/PUT /api/prepisy/texty
   ikony   {"klíč":{n:"tent",s:"<path…>"}}    server: GET/PUT /api/prepisy/ikony
   obrazky {"img/x.webp":{id,v}} + soubory     server: GET /api/prepisy/fotky · POST (multipart: cesta, soubor) · DELETE ?cesta=… */
var _odb=null;
function odb(){if(_odb)return _odb;_odb=new Promise(function(ok,no){var r=indexedDB.open('kk-obrazky',1);r.onupgradeneeded=function(){r.result.createObjectStore('o',{keyPath:'id'})};r.onsuccess=function(){ok(r.result)};r.onerror=function(){no(r.error)}});return _odb}
function otx(mode,fn){return odb().then(function(d){return new Promise(function(ok,no){var t=d.transaction('o',mode),s=t.objectStore('o'),r=fn(s);t.oncomplete=function(){ok(r&&r.result!==undefined?r.result:r)};t.onerror=function(){no(t.error)}})})}
function mapa(zaklad,nazev,jaz){var K=function(){return jaz?kJ(zaklad):zaklad};return{
  vse:function(){return LS.get(K(),{})},
  uloz:function(zmeny){var klic=K(),t=LS.get(klic,{});Object.keys(zmeny).forEach(function(k){if(zmeny[k]==null)delete t[k];else t[k]=zmeny[k]});
    if(Object.keys(t).length)LS.set(klic,t);else LS.del(klic);if(Object.keys(zmeny).length)historie(nazev,Object.keys(zmeny).length+' změn');return Promise.resolve(t)}
}}
KK.dtexty=mapa('dtexty','Texty v mapách a animacích',true);
KK.ikony=mapa('ikony','Ikony');
KK.obrazky=mapa('obrazky','Fotky na webu');
KK.obrazky.soubor={
  uloz:function(id,blob){return otx('readwrite',function(s){s.put({id:id,blob:blob,kdy:Date.now()})})},
  vse:function(){return otx('readonly',function(s){return s.getAll()})},
  smaz:function(ids){return otx('readwrite',function(s){ids.forEach(function(i){s.delete(i)})})},
  vymaz:function(){return otx('readwrite',function(s){s.clear()})}
};
/* nahraje fotku (zmenší na max. 2200 px), vrátí {id,v,url} – do mapy ji zapíše až uložení */
KK.obrazky.nahraj=function(soubor){return zmensi(soubor,2200,0.85).then(function(r){var id='o'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  return KK.obrazky.soubor.uloz(id,r.blob).then(function(){return{id:id,v:Date.now(),url:URL.createObjectURL(r.blob)}})})};
/* smaže soubory, na které už nic neodkazuje */
KK.obrazky.uklid=function(){var pouzite={};var m=LS.get('obrazky',{});Object.keys(m).forEach(function(k){if(m[k]&&m[k].id)pouzite[m[k].id]=1});
  return KK.obrazky.soubor.vse().then(function(a){var x=a.filter(function(o){return !pouzite[o.id]}).map(function(o){return o.id});return x.length?KK.obrazky.soubor.smaz(x):null})};
KK.obrazky.url=function(z){return KK.obrazky.soubor.vse().then(function(a){var m={};a.forEach(function(o){m[o.id]=URL.createObjectURL(o.blob)});return m})};
KK.zmensi=function(f,max,q){return zmensi(f,max||1920,q||0.82)};
function preklady(){var o={};['en','de'].forEach(function(j){o[j]={texty:LS.get('texty.'+j,{}),dtexty:LS.get('dtexty.'+j,{})}});return o}
function naData(b){return new Promise(function(ok){var r=new FileReader();r.onload=function(){ok(r.result)};r.readAsDataURL(b)})}
function zDat(u){var p=u.split(','),b=atob(p[1]),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new Blob([a],{type:(p[0].match(/:(.*?);/)||[])[1]||'image/webp'})}

/* ---------------- HISTORIE ZMĚN, EXPORT, RESET ---------------- */
function historie(co,popis){var h=LS.get('historie',[]);h.unshift({kdy:Date.now(),co:co,popis:popis,kdo:(KK.auth.meSync()||{}).jmeno||''});LS.set('historie',h.slice(0,50))}
KK.historie=function(){return LS.get('historie',[])};KK.zaznam=historie;
KK.export=function(){return KK.galerie.seznam().then(function(f){
  return Promise.all(f.map(function(x){if(!x.blob)return x;return new Promise(function(ok){var r=new FileReader();r.onload=function(){var y=Object.assign({},x);y.blob=r.result;delete y.nahled;ok(y)};r.readAsDataURL(x.blob)})}))
  .then(function(fotky){return KK.obrazky.soubor.vse().catch(function(){return[]}).then(function(ob){return Promise.all(ob.map(function(o){return naData(o.blob).then(function(d){return{id:o.id,data:d}})}))}).then(function(ob){
    return{verze:1,datum:new Date().toISOString(),texty:LS.get('texty',{}),seo:LS.get('seo',null),cenik:LS.get('cenik',null),fotky:fotky,rezervace:LS.get('rezervace',[]),rezNast:LS.get('rez.nast',null),rezCislo:LS.get('rez.cislo',0),dtexty:LS.get('dtexty',{}),preklady:preklady(),ikony:LS.get('ikony',{}),obrazky:LS.get('obrazky',{}),obrazkySoubory:ob}})})})};
KK.import=function(d){
  if(!d||d.verze!==1)return Promise.reject(new Error('Soubor není záloha administrace Kemp Krumlov.'));
  LS.set('texty',d.texty||{});['dtexty','ikony','obrazky'].forEach(function(k){if(d[k]&&Object.keys(d[k]).length)LS.set(k,d[k]);else LS.del(k)});
  ['en','de'].forEach(function(j){var z=(d.preklady||{})[j]||{};['texty','dtexty'].forEach(function(b){if(z[b]&&Object.keys(z[b]).length)LS.set(b+'.'+j,z[b]);else LS.del(b+'.'+j)})});if(d.seo)LS.set('seo',d.seo);else LS.del('seo');if(d.cenik)LS.set('cenik',d.cenik);else LS.del('cenik');if(d.rezervace){LS.set('rezervace',d.rezervace);LS.set('rez.cislo',d.rezCislo||d.rezervace.length);if(d.rezNast)LS.set('rez.nast',d.rezNast)}
  var fotky=(d.fotky||[]).map(function(f){if(typeof f.blob==='string'){var p=f.blob.split(','),b=atob(p[1]),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);f.blob=new Blob([a],{type:(p[0].match(/:(.*?);/)||[])[1]||'image/webp'});f.nahled=f.blob}return f});
  return tx('readwrite',function(s){s.clear();fotky.forEach(function(f){s.put(f)})}).then(function(){if(fotky.length)LS.set('galerie',{v:1,zmena:Date.now()});else LS.del('galerie');
    return KK.obrazky.soubor.vymaz().then(function(){return otx('readwrite',function(s){(d.obrazkySoubory||[]).forEach(function(o){s.put({id:o.id,blob:zDat(o.data),kdy:Date.now()})})})});
  }).then(function(){historie('Záloha','obnovena ze souboru')});
};
KK.reset=function(){['texty','seo','cenik','galerie','historie','dtexty','ikony','obrazky','texty.en','texty.de','dtexty.en','dtexty.de','mena','jazyk','rezervace','rez.nast','rez.cislo'].forEach(LS.del);return tx('readwrite',function(s){s.clear()}).then(function(){return KK.obrazky.soubor.vymaz().catch(function(){})})};
})();
