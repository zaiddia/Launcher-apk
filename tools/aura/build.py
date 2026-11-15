import re,sys
src=open('/home/claude/web27src/index.tpl.html').read().split('\n')
L=lambda a,b:'\n'.join(src[a-1:b])
# find CSS ranges
def idx(pat,start=0):
    for i in range(start,len(src)):
        if pat in src[i]:return i+1
    raise SystemExit('nf '+pat)
fc0=idx('/* ===== panel de noticias ===== */');fc1=idx('/* ===== detalles del video ===== */')
jc0=idx('/* ===== JARVIS ===== */');jc1=idx('/* ===================== ESTILO NEO')
i0=idx('const I={');i1=next(i for i in range(i0,len(src)) if src[i].startswith('};'))+1
g0=idx('/* ---------- GESTOS DE NAVEGACIÓN (APK) ---------- */');j0=idx('J.A.R.V.I.S. — asistente')-1
f0=idx('/* ---------- NOTICIAS (estilo Nova) ---------- */');b0=idx('/* ---------- LANG / BOOT ---------- */')
jh0=idx('<section id="jv" aria-label="JARVIS">');jh1=idx('<div id="fshade"></div>')
fh1=idx('<div class="fl" id="fl">')
t=open(__import__('os').path.join(__import__('os').path.dirname(__file__),'aura.tpl.html')).read()
icons=L(i0,i1)
rep={'__FEED_CSS__':L(fc0,fc1-1),'__JV_CSS__':L(jc0,jc1-1),'__ICONS__':icons,'__WALLS__':open(__import__('os').path.join(__import__('os').path.dirname(__file__),'walls.js')).read(),
 '__GEST_JS__':L(g0,j0-1),'__JARVIS_JS__':L(j0,f0-1),'__FEED_JS__':L(f0,b0-1),
 '__JV_HTML__':L(jh0,jh1-1),'__FEED_HTML__':L(jh1,fh1)}
for k,v in rep.items():
    assert k in t,k; t=t.replace(k,v)
open('/home/claude/launcher-apk/webaura/index.html','w').write(t)
print(len(t),{k:len(v) for k,v in rep.items()})
