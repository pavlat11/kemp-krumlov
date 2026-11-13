/* Přepínač jazyka. Jazyk určuje js/prepisy.js (?lang=en|de, jinak poslední volba, jinak čeština).
   Zvolením jazyka se stránka načte znovu s ?lang=… – texty se pak vezmou z překladů v administraci
   (co ještě není přeložené, zůstane česky). Na serveru budou jazyky na adresách /en/ a /de/. */
(()=>{const w=document.querySelector('.lang-switch');if(!w)return;
const t=w.querySelector('.lang-current'),flag=t.querySelector('.flag'),name=t.querySelector('.sr-lang'),menu=w.querySelector('.lang-menu');
const KOD={CZ:'cs',EN:'en',DE:'de'},names={CZ:'Čeština',EN:'English',DE:'Deutsch'};
const ted=Object.keys(KOD).find(k=>KOD[k]===(window.KK_LANG||'cs'))||'CZ';
const ukaz=l=>{menu.querySelectorAll('[data-lang]').forEach(x=>{const on=x.dataset.lang===l;x.classList.toggle('active',on);if(on)x.setAttribute('aria-current','true');else x.removeAttribute('aria-current')});flag.className='flag flag-'+l.toLowerCase();if(!name.hasAttribute('data-t')||l!=='CZ')name.textContent=names[l]};
ukaz(ted);
const zavri=()=>{w.classList.remove('open');t.setAttribute('aria-expanded','false')};
t.addEventListener('click',e=>{e.stopPropagation();const o=w.classList.toggle('open');t.setAttribute('aria-expanded',String(o))});
menu.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(!b)return;const l=b.dataset.lang;zavri();if(l===ted)return;
  if(window.KKE&&KKE.neulozeno()&&!confirm('Máte neuložené změny. Přepnout jazyk bez uložení?'))return;
  const kod=KOD[l];try{localStorage.setItem('kk.jazyk',JSON.stringify(kod))}catch(x){}
  const u=new URL(location.href);if(kod==='cs')u.searchParams.delete('lang');else u.searchParams.set('lang',kod);
  if(window.KKE)window.KKE.opust=true;location.href=u.toString()});
document.addEventListener('click',zavri);document.addEventListener('keydown',e=>{if(e.key==='Escape')zavri()});
})();
