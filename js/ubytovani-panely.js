(()=>{const w=document.getElementById('ubPanels');if(!w)return;const ps=[...w.querySelectorAll('.ubp')];
function act(p){ps.forEach(x=>{const o=x===p;x.classList.toggle('on',o);const t=x.querySelector('.ubp-tg');if(t)t.setAttribute('aria-expanded',o)})}
ps.forEach(p=>{p.addEventListener('click',e=>{if(!p.classList.contains('on')){e.preventDefault();act(p)}});const tg=p.querySelector('.ubp-tg');if(tg)tg.addEventListener('click',e=>{e.stopPropagation();act(p)})})})();
