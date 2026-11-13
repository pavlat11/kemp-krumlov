(function(){
 var sk=document.querySelector('.skip-link'),ob=document.getElementById('obsah');if(sk&&ob)sk.addEventListener('click',function(e){e.preventDefault();ob.focus();ob.scrollIntoView()});
 /* galerie: fokus zůstane uvnitř otevřeného prohlížeče */
 var lb=document.getElementById('glLb');if(lb)lb.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=[].slice.call(lb.querySelectorAll('button'));var i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}});
})();
