(function(){
var r=document.getElementById('galerie');if(!r)return;
var grid=r.querySelector('.gl-grid'),lb=document.getElementById('glLb'),im=lb.querySelector('img'),t=lb.querySelector('.t'),n=lb.querySelector('.n'),
    mb=r.querySelector('.gl-more-b'),mw=r.querySelector('.gl-more-w'),LIM=9,cur=0,last=null,filtr='all';
function it(){return [].slice.call(grid.querySelectorAll('.gl-i'))}
function vis(){return it().filter(function(x){return getComputedStyle(x).display!=='none'})}
function priprav(){
  var a=it();a.forEach(function(x,i){x.classList.toggle('extra',i>=LIM)});
  var zbyva=a.length-LIM;
  if(mw){var ukaz=zbyva>0&&filtr==='all'&&grid.classList.contains('lim');mw.hidden=!(zbyva>0);mw.style.display=ukaz?'':'none';if(mb)mb.querySelector('span:last-child').textContent='('+Math.max(0,zbyva)+')'}
  if(zbyva<=0)grid.classList.remove('lim');
}
function show(i){var v=vis();if(!v.length)return;cur=(i+v.length)%v.length;var e=v[cur].querySelector('img');im.src=e.dataset.full||e.src;im.alt=e.alt;t.textContent=e.alt;n.textContent=(cur+1)+' / '+v.length}
function open(el){last=document.activeElement;show(vis().indexOf(el));lb.hidden=false;document.documentElement.style.overflow='hidden';lb.querySelector('.gl-x').focus()}
function close(){lb.hidden=true;document.documentElement.style.overflow='';if(last)last.focus()}
grid.addEventListener('click',function(e){var b=e.target.closest('.gl-i button');if(b)open(b.closest('.gl-i'))});
if(mb)mb.addEventListener('click',function(){grid.classList.remove('lim');mw.style.display='none';mb.setAttribute('aria-expanded','true');var f=it()[LIM];if(f)f.querySelector('button').focus({preventScroll:true})});
lb.querySelector('.gl-x').addEventListener('click',close);lb.querySelector('.gl-p').addEventListener('click',function(){show(cur-1)});lb.querySelector('.gl-n').addEventListener('click',function(){show(cur+1)});
lb.addEventListener('click',function(e){if(e.target===lb)close()});
addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(cur-1);else if(e.key==='ArrowRight')show(cur+1)});
var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){if(sx===null)return;var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>45)show(cur+(d<0?1:-1));sx=null});
r.querySelectorAll('.gl-f button').forEach(function(b){b.addEventListener('click',function(){
  r.querySelectorAll('.gl-f button').forEach(function(x){x.classList.toggle('on',x===b)});filtr=b.dataset.f;
  grid.classList.toggle('all',filtr==='all');
  if(filtr!=='all')grid.classList.remove('lim');else if(mb&&mb.getAttribute('aria-expanded')!=='true')grid.classList.add('lim');
  it().forEach(function(x){x.classList.toggle('hide',filtr!=='all'&&x.dataset.c!==filtr)});priprav();
})});
priprav();
/* vykreslení z dat (administrace / server) */
var esc=function(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
window.KKGalerie={vykresli:function(f){
  grid.innerHTML=f.map(function(x){return '<figure class="gl-i" data-c="'+esc(x.kat)+'"><button type="button" aria-label="Zvětšit: '+esc(x.popis||'fotka')+'"><img src="'+esc(x.nahled||x.src)+'" data-full="'+esc(x.src)+'" alt="'+esc(x.popis)+'" loading="lazy" decoding="async" width="'+(x.w||1536)+'" height="'+(x.h||1024)+'"></button>'+(x.popis?'<figcaption>'+esc(x.popis)+'</figcaption>':'')+'</figure>'}).join('');
  if(mb&&mb.getAttribute('aria-expanded')!=='true')grid.classList.add('lim');
  it().forEach(function(x){x.classList.toggle('hide',filtr!=='all'&&x.dataset.c!==filtr)});priprav();
}};
})();
