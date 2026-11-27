#!/usr/bin/env python3
"""Vygeneruje rezervace.html – samostatnou stránku jen s rezervačním formulářem kempu
(vkládá ji web PE-LA). Bere hlavičku a sekci #rezervace z index.html, takže po úpravě
formuláře v index.html stačí spustit znovu:  python3 nastroje/rezervace-stranka.py"""
import re, pathlib
koren = pathlib.Path(__file__).resolve().parent.parent
h = (koren / 'index.html').read_text(encoding='utf-8')
hlava = h[:h.index('</head>')]
hlava = re.sub(r'<link rel="preload" as="image"[^>]*>\n?', '', hlava)
hlava = re.sub(r'<link rel="canonical"[^>]*>', '<meta name="robots" content="noindex">', hlava)
hlava = re.sub(r'<title>[^<]*</title>', '<title>Rezervace · Kemp Krumlov a PE-LA</title>', hlava)
hlava = re.sub(r'<script type="application/ld\+json".*?</script>\n?', '', hlava, flags=re.S)
a = h.index('<section id="rezervace"'); b = h.index('</section>', a) + len('</section>')
sekce = h[a:b]
skripty = '\n'.join(re.findall(r'<script src="js/(?:cenik|pobyt)\.js[^"]*"></script>', h))
vlozeno = '''<style>
html,body{background:transparent}body.kk-vlozeno{margin:0;overflow-x:hidden}
.kk-vlozeno #rezervace{margin:0!important;padding-top:24px!important;padding-bottom:24px!important}
.kk-vlozeno .rz-anchor{display:none}
/* ve vloženém okně (web PE-LA) bez úvodu kempu a bez fotky na pozadí – nadpis má vkládající stránka */
html.kk-v-ramu,html.kk-v-ramu body{overflow:hidden!important;scrollbar-width:none}
html.kk-v-ramu::-webkit-scrollbar,html.kk-v-ramu body::-webkit-scrollbar{display:none}
html.kk-v-ramu .rz-head{display:none}
html.kk-v-ramu #rezervace,html.kk-v-ramu #rezervace::before,html.kk-v-ramu #rezervace::after{background:none!important}
html.kk-v-ramu #rezervace>.wrap{max-width:none;padding-left:0;padding-right:0}
html.kk-v-ramu #rezervace.rz{padding:0!important;min-height:0}
html.kk-v-ramu .rz-app{max-width:none!important}
html.kk-v-ramu .rz-side{position:static!important;top:auto!important}
/* barvy webu PE-LA (?web=pela) */
html[data-web=pela] #rezervace{--rz-f:#0a2229;--rz-f2:#0c3640;--rz-sun:#ffb81c;--rz-sun2:#ffcf5c}
html[data-web=pela] #rezervace .rz-card-top{background:linear-gradient(150deg,#0c3640,#0a2229)!important}
html[data-web=pela] #rezervace .rz-card-top::after{background:radial-gradient(circle,rgba(27,138,140,.55),transparent 70%)!important}
html[data-web=pela] #rezervace .rz-season{background:rgba(255,184,28,.18)!important}
html[data-web=pela] #rezervace .rz-sum>div:hover dd{color:#1b8a8c!important}
html[data-web=pela] #rezervace .rz-next,html[data-web=pela] #rezervace .rz-submit{background:#ffb81c!important;color:#0a2229!important;box-shadow:0 14px 30px -12px rgba(255,184,28,.8)!important}
html[data-web=pela] #rezervace .rz-next:hover,html[data-web=pela] #rezervace .rz-submit:hover{background:#ffcf5c!important}
html[data-web=pela] #rezervace .rz-num,html[data-web=pela] #rezervace .rz-prog button.done i{background:#0a2229!important}
html[data-web=pela] #rezervace .rz-prog button.on{background:#fff6dc!important}
html[data-web=pela] #rezervace .rz-pricebtn,html[data-web=pela] #rezervace .rz-pbig{border-color:#ffb81c!important;background:#fffaeb!important}
html[data-web=pela] #rezervace .rz-cn.on{background:#0c3640!important;box-shadow:0 0 0 2px #ffb81c!important}
html[data-web=pela] #rezervace .rz-row .ph .n,html[data-web=pela] #rezervace .rz-cap .dots i.f,html[data-web=pela] #rezervace .rz-pbig .ic{background:#ffb81c!important}
html[data-web=pela] #rezervace .rz-t.on{border-color:#0a2229!important;box-shadow:0 0 0 3px rgba(255,184,28,.4)!important}
</style>
<script>
/* výška pro vkládající web (PE-LA): posílá se rodičovské stránce, ať iframe nemá posuvník */
(function(){if(/[?&]web=pela(&|$)/.test(location.search))document.documentElement.setAttribute('data-web','pela');if(window.parent===window)return;document.documentElement.classList.add('kk-v-ramu');
/* posouvání stránky řídí vkládající web: po načtení nic (jinak by schoval nadpis), při přechodu mezi kroky jen když je místo mimo obrazovku */
var t0=Date.now();Element.prototype.scrollIntoView=function(){if(Date.now()-t0<4000)return;var r=this.getBoundingClientRect();parent.postMessage({kkRezervace:1,skok:Math.round(r.top)},'*')};var p=0;function posli(){var r=document.getElementById('rezervace'),v=Math.ceil(r?r.offsetTop+r.offsetHeight:document.body.scrollHeight);if(Math.abs(v-p)>2){p=v;parent.postMessage({kkRezervace:1,vyska:v},'*')}}
addEventListener('load',posli);if(window.ResizeObserver)new ResizeObserver(posli).observe(document.documentElement);setInterval(posli,800);
/* odkazy mimo formulář (GDPR, kontakty) otevřít v novém okně */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(a&&!/^#|^javascript:/.test(a.getAttribute('href'))&&!a.target)a.target='_blank'},true)})();
</script>
'''
out = hlava + vlozeno + '</head>\n<body class="kk-vlozeno">\n' + sekce + '\n' + skripty + '\n</body>\n</html>\n'
(koren / 'rezervace.html').write_text(out, encoding='utf-8')
print('rezervace.html', len(out), 'B')
