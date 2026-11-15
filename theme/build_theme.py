#!/usr/bin/env python3
"""Construye el tema de HyperOS "Aura Hacker" (.mtz).

Un solo esquema de posiciones genera:
  * la pantalla de bloqueo MAML (lockscreen/manifest.xml + imágenes),
  * los íconos (icons/res/drawable-xxhdpi/...),
  * los fondos y las vistas previas.
Uso: python3 build_theme.py  ->  out/Aura-Hacker.mtz
"""
import math, os, shutil, zipfile, io
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
F = lambda n: os.path.join(HERE, 'fonts', n + '.ttf')
OUT = os.path.join(HERE, 'out'); BUILD = os.path.join(HERE, 'build')
W, H = 1080, 2400                       # espacio de coordenadas MAML (screenWidth=1080)

# paleta "Matrix" (verde/crema) del video
LN = (124, 255, 58); CR = (245, 217, 168); CY = (53, 231, 255); RD = (255, 59, 78); BL = (61, 111, 224)
def font(n, s): return ImageFont.truetype(F(n), s)
ORB9, ORB7, ORB5 = 'orbitron-latin-900-normal', 'orbitron-latin-700-normal', 'orbitron-latin-500-normal'
SYM = 'dejavu-bold'
BAR6, BAR7, MONO = 'barlow-latin-600-normal', 'barlow-latin-700-normal', 'jetbrains-mono-latin-400-normal'

def rgba(c, a=255): return (c[0], c[1], c[2], a)

def spaced(d, xy, text, f, fill, sp=0, anchor='la'):
    """Texto con espaciado entre letras (estilo HUD)."""
    if not sp:
        d.text(xy, text, font=f, fill=fill, anchor=anchor); return
    x, y = xy
    total = sum(d.textlength(ch, font=f) + sp for ch in text) - sp
    if anchor[0] == 'r': x -= total
    elif anchor[0] == 'm': x -= total / 2
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill, anchor='l' + anchor[1]); x += d.textlength(ch, font=f) + sp

def frame(img, box, tab=None, c=26, glow=True, fill=(0, 0, 0, 150)):
    """Marco HUD con esquinas cortadas, pestaña y esquinas gruesas crema."""
    x0, y0, x1, y1 = box; w = x1 - x0; t = 18
    ty0 = y0 + (t if tab == 'top' else 0); ty1 = y1 - (t if tab == 'bot' else 0)
    a, b = x0 + w * .28, x0 + w * .72
    pts = [(x0 + c, ty0)]
    if tab == 'top': pts += [(a, ty0), (a + t, y0), (b - t, y0), (b, ty0)]
    pts += [(x1 - c, ty0), (x1, ty0 + c), (x1, ty1 - c), (x1 - c, ty1)]
    if tab == 'bot': pts += [(b, ty1), (b - t, y1), (a + t, y1), (a, ty1)]
    pts += [(x0 + c, ty1), (x0, ty1 - c), (x0, ty0 + c)]
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.polygon(pts, fill=fill)
    if glow:
        g = Image.new('RGBA', img.size, (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
        gd.line(pts + [pts[0]], fill=rgba(LN, 150), width=10, joint='curve'); g = g.filter(ImageFilter.GaussianBlur(7))
        lay.alpha_composite(g)
    d = ImageDraw.Draw(lay)
    d.line(pts + [pts[0]], fill=rgba(LN), width=3, joint='curve')
    L = min(150, (ty1 - ty0) * .35)
    d.line([(x0, ty0 + c + L), (x0, ty0 + c), (x0 + c, ty0), (x0 + c + 120, ty0)], fill=rgba(CR), width=9)
    d.line([(x0, ty1 - c - L * .8), (x0, ty1 - c), (x0 + c, ty1)], fill=rgba(CR), width=9)
    d.line([(x1, ty1 - c - L * .6), (x1, ty1 - c), (x1 - c, ty1), (x1 - c - 110, ty1)], fill=rgba(CR), width=9)
    for px in ([a, b] if tab else []):
        yy = ty0 if tab == 'top' else ty1
        d.ellipse([px - 6, yy - 6, px + 6, yy + 6], fill=rgba(LN))
    d.ellipse([x0 + c + 80, ty0 + 4, x0 + c + 88, ty0 + 12], fill=rgba(LN))
    img.alpha_composite(lay)

def hazard(d, x, y, s=36, col=LN):
    t = Image.new('RGBA', (s, s), (0, 0, 0, 0)); td = ImageDraw.Draw(t)
    for i in range(-s, s * 2, 12):
        td.polygon([(i, s), (i + 6, s), (i + 6 + s, 0), (i + s, 0)], fill=rgba(col))
    d._image.paste(t, (x, y), t)

def world_map(width, col=CR):
    """Mapa mundial (mismo trazado que Aura) dibujado en PNG."""
    path = open(os.path.join(HERE, 'map.txt')).read().strip()
    sc = width / 360.0; hgt = int(120 * sc)
    im = Image.new('RGBA', (width, hgt), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for seg in path.split('M')[1:]:
        closed = seg.endswith('Z'); seg = seg.rstrip('Z')
        pts = [tuple(float(v) for v in p.split(',')) for p in seg.split('L') if ',' in p]
        pts = [(x * sc, (y - 6) * sc) for x, y in pts]
        if len(pts) >= 3: d.polygon(pts, fill=rgba(col))
    return im

# ----------------------------------------------------------------------------- esquema
# cada elemento: dict(kind, x, y, ... ) ; y negativa = medida desde abajo (#screen_height + y)
EL = []
def add(**k): EL.append(k); return k

def build_assets(dst):
    os.makedirs(dst, exist_ok=True)
    def save(im, n): im.save(os.path.join(dst, n))
    # ---- capa superior estática (paneles de mapa y energía) ----
    top = Image.new('RGBA', (W, 1560), (0, 0, 0, 0)); d = ImageDraw.Draw(top)
    frame(top, (36, 120, 1044, 560), tab='top')
    spaced(d, (72, 168), 'COBERTURA GLOBAL', font(ORB7, 22), rgba(CR), 5)
    d.ellipse([826, 160, 840, 174], fill=rgba(RD)); spaced(d, (852, 167), 'GEO-SYNC', font(ORB7, 20), rgba(CR), 4, 'lm')
    m = world_map(560); top.alpha_composite(m, (300, 215))
    for i in range(3): d.rectangle([960, 230 + i * 34, 1010, 252 + i * 34], outline=rgba(LN), width=3)
    spaced(d, (72, 470), '>> LATITUD   4.711', font(MONO, 20), rgba(CR)); spaced(d, (72, 498), '>> LONGITUD -74.072', font(MONO, 20), rgba(CR))
    # brújula
    cx = 540
    for k, ch in enumerate('·|·N·|·'):
        f = font(ORB9, 30) if ch == 'N' else font(SYM, 24)
        d.text((cx + (k - 3) * 44, 528), ch, font=f, fill=rgba((255, 255, 255) if ch == 'N' else CR), anchor='mm')
    frame(top, (36, 600, 1044, 1520), tab='top')
    hazard(d, 74, 650); spaced(d, (124, 668), '∞', font(SYM, 34), rgba(RD), 0, 'lm'); spaced(d, (160, 668), 'ENERGÍA', font(ORB7, 26), rgba(CR), 8, 'lm')
    # luz detrás de las celdas
    glow = Image.new('RGBA', top.size, (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
    gd.ellipse([140, 690, 940, 960], fill=rgba(CY, 90)); glow = glow.filter(ImageFilter.GaussianBlur(60)); top.alpha_composite(glow)
    d = ImageDraw.Draw(top)
    spaced(d, (70, 820), '⊂▸', font(SYM, 34), rgba(CY), 0, 'lm'); spaced(d, (1010, 820), '◂⊃', font(SYM, 34), rgba(CY), 0, 'rm')
    d.rounded_rectangle([72, 930, 250, 976], radius=8, fill=(184, 199, 232, 255))
    d.line([(270, 953), (760, 953)], fill=rgba(LN, 200), width=3)
    for k, s in enumerate('▬#▲✚'): d.text((790 + k * 40, 953), s, font=font(SYM, 26), fill=rgba(LN), anchor='mm')
    spaced(d, (72, 1020), 'DIAGNÓSTICO DEL SISTEMA', font(ORB7, 26), rgba(CR), 6)
    d.text((72, 1064), 'Desliza hacia arriba para desbloquear · toca el núcleo para J.A.R.V.I.S.', font=font(BAR6, 26), fill=(240, 228, 214, 230))
    spaced(d, (72, 1118), 'ANÁLISIS DE ENERGÍA', font(ORB7, 24), rgba(CR), 6)
    rows = [('Batería', 1172), ('Estado', 1216)]
    spaced(d, (72, 1262), 'ANÁLISIS DE COMUNICACIONES', font(ORB7, 24), rgba(CR), 6)
    rows += [('Día | Mes | Año', 1316), ('Próxima alarma', 1360), ('Llamadas perdidas', 1404), ('SMS sin leer', 1448)]
    for name, y in rows:
        d.text((84, y), name, font=font(BAR6, 30), fill=rgba(RD if name.startswith('Día') else LN), anchor='lm')
    st = Image.new('RGBA', (360, 30), (0, 0, 0, 0)); spaced(ImageDraw.Draw(st), (0, 15), 'STARK INDUSTRIES', font(ORB7, 18), rgba(LN), 7, 'lm')
    top.paste((0, 0, 0, 0), (1046, 1040, 1080, 1100)); top.alpha_composite(st.rotate(-90, expand=True), (1050, 1110))
    for k in range(3): d.rectangle([1054, 860 + k * 16, 1074, 868 + k * 16], fill=rgba(LN))
    save(top, 'hud_top.png')
    EL.append(dict(kind='img', x=0, y=0, src='hud_top.png'))

    # ---- celdas de energía (9) ----
    def cap(on):
        im = Image.new('RGBA', (110, 180), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        if on:
            g = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(g).rounded_rectangle([12, 12, 98, 168], radius=26, outline=rgba(CY), width=10)
            im.alpha_composite(g.filter(ImageFilter.GaussianBlur(9)))
            d.rounded_rectangle([12, 12, 98, 168], radius=26, outline=rgba(CY), width=5, fill=rgba(CY, 50))
            d.rounded_rectangle([28, 30, 82, 150], radius=14, outline=(220, 255, 255, 255), width=3)
        else:
            d.rounded_rectangle([12, 12, 98, 168], radius=26, outline=rgba(CY, 110), width=4, fill=rgba(CY, 10))
            d.rounded_rectangle([28, 30, 82, 150], radius=14, outline=rgba(CY, 70), width=2)
        return im
    save(cap(False), 'cap_off.png'); save(cap(True), 'cap_on.png')
    for i in range(9):
        x = 112 + i * 92
        EL.append(dict(kind='img', x=x, y=730, src='cap_off.png'))
        EL.append(dict(kind='img', x=x, y=730, src='cap_on.png', vis=f'ge(#battery_level,{int(i*11.1)+1})', sample=lambda v, i=i: v['bat'] >= int(i * 11.1) + 1,
                        anim=('alpha_charge', i)))
    # números
    def digits(prefix, f, col, size, w, h, shadow=None):
        for n in range(10):
            im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
            if shadow:
                g = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(g).text((w / 2, h / 2), str(n), font=font(f, size), fill=rgba(shadow), anchor='mm')
                im.alpha_composite(g.filter(ImageFilter.GaussianBlur(6)))
            d.text((w / 2, h / 2), str(n), font=font(f, size), fill=rgba(col) if len(col) == 3 else col, anchor='mm'); save(im, f'{prefix}_{n}.png')
        return w
    digits('bnum', ORB9, CR, 40, 34, 52)            # % batería (arriba a la derecha)
    digits('tnum', ORB9, (20, 20, 22), 62, 48, 80)   # reloj en losas
    digits('dnum', ORB9, CY, 34, 28, 46, CY)         # valores
    pct = Image.new('RGBA', (34, 52), (0, 0, 0, 0)); ImageDraw.Draw(pct).text((17, 26), '%', font=font(ORB9, 34), fill=rgba(CR), anchor='mm'); save(pct, 'pct.png')
    EL.append(dict(kind='num', x=926, y=642, src='bnum', expr='#battery_level', align='right', w=34, sample=lambda v: v['bat']))
    EL.append(dict(kind='img', x=972, y=642, src='pct.png'))
    EL.append(dict(kind='num', x=84, y=930, src='bnum', expr='#battery_level', w=34, sample=lambda v: v['bat'], color_override=(20, 24, 40)))
    # estado (textos)
    EL.append(dict(kind='text', x=1000, y=1172, align='right', size=30, color=CY, text='CARGANDO', vis='eq(#battery_state,1)', sample=lambda v: v['chg']))
    EL.append(dict(kind='text', x=1000, y=1172, align='right', size=30, color=CY, text='LLENA', vis='eq(#battery_state,3)', sample=lambda v: False))
    EL.append(dict(kind='text', x=1000, y=1172, align='right', size=30, color=CY, text='EN USO', vis='lt(#battery_state,1)+eq(#battery_state,2)', sample=lambda v: not v['chg']))
    EL.append(dict(kind='textf', x=1000, y=1216, align='right', size=30, color=(255, 255, 255), fmt='%d %%', paras='#battery_level', sample=lambda v: f"{v['bat']} %"))
    EL.append(dict(kind='date', x=1000, y=1316, align='right', size=30, color=RD, fmt='dd MMM yyyy', sample=lambda v: '14 nov 2026'))
    EL.append(dict(kind='textv', x=1000, y=1360, align='right', size=30, color=(255, 255, 255), var='@next_alarm_time', sample=lambda v: 'dom. 06:30'))
    EL.append(dict(kind='textf', x=1000, y=1404, align='right', size=30, color=(255, 255, 255), fmt='%d', paras='#call_missed_count', sample=lambda v: str(v['calls'])))
    EL.append(dict(kind='textf', x=1000, y=1448, align='right', size=30, color=(255, 255, 255), fmt='%d', paras='#sms_unread_count', sample=lambda v: str(v['sms'])))
    # barra de lectura que recorre las filas
    sw = Image.new('RGBA', (944, 40), (0, 0, 0, 0)); sd = ImageDraw.Draw(sw)
    for x in range(936):
        a = int(150 - x * 0.09); sd.line([(x, 0), (x, 39)], fill=(150, 160, 185, max(40, a)))
    sd.rectangle([936, 0, 943, 39], fill=rgba(CR)); sd.ellipse([10, 13, 24, 27], fill=rgba(RD)); save(sw, 'sweep.png')
    EL.insert(0, dict(kind='img', x=64, y=1296, src='sweep.png', anim=('sweep',)))
    # radar sobre Colombia
    px = 300 + (-74.07 + 180) / 360 * 560; py = 215 + (84 - 4.71 - 6) / 360 * 560
    pulse = Image.new('RGBA', (120, 120), (0, 0, 0, 0)); ImageDraw.Draw(pulse).ellipse([4, 4, 116, 116], outline=rgba(RD), width=5); save(pulse, 'pulse.png')
    dot = Image.new('RGBA', (60, 60), (0, 0, 0, 0)); dd = ImageDraw.Draw(dot)
    dd.ellipse([18, 18, 42, 42], outline=rgba(RD), width=4); dd.ellipse([26, 26, 34, 34], fill=rgba(RD))
    for a_, b_ in [((0, 30), (14, 30)), ((46, 30), (60, 30)), ((30, 0), (30, 14)), ((30, 46), (30, 60))]: dd.line([a_, b_], fill=rgba(RD), width=3)
    save(dot, 'radar.png')
    EL.append(dict(kind='img', x=px, y=py, src='pulse.png', center=True, anim=('pulse',)))
    EL.append(dict(kind='img', x=px, y=py, src='radar.png', center=True))
    # LED que parpadea
    led = Image.new('RGBA', (24, 24), (0, 0, 0, 0)); ImageDraw.Draw(led).ellipse([2, 2, 22, 22], fill=rgba(RD)); save(led, 'led.png')
    EL.append(dict(kind='img', x=821, y=155, src='led.png', anim=('blink',)))

    # ---- bloque inferior (anclado abajo) ----
    B = -860  # y relativa al fondo
    bot = Image.new('RGBA', (W, 860), (0, 0, 0, 0)); d = ImageDraw.Draw(bot)
    def pbtn(y, label, sub, red=False):
        g = Image.new('RGBA', (600, 130), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
        poly = [(0, 0), (600, 0), (600, 92), (562, 130), (0, 130)]
        grad = Image.new('RGBA', (600, 130)); gr = ImageDraw.Draw(grad)
        for yy in range(130):
            t = yy / 129; col = (int(106 - 60 * t), int(112 - 64 * t), int(128 - 70 * t), 255); gr.line([(0, yy), (600, yy)], fill=col)
        mask = Image.new('L', (600, 130), 0); ImageDraw.Draw(mask).polygon(poly, fill=255)
        g.paste(grad, (0, 0), mask); gd = ImageDraw.Draw(g)
        gd.line([(0, 1), (600, 1)], fill=(255, 255, 255, 120), width=2)
        gd.polygon([(0, 112), (580, 112), (562, 130), (0, 130)], fill=rgba(CR)); gd.rectangle([300, 100, 370, 112], fill=(22, 24, 29, 255))
        spaced(gd, (560, 52), label, font(ORB9, 40), rgba(RD) if red else (238, 241, 246, 255), 10, 'rm')
        gd.text((26, 84), sub, font=font(BAR6, 24), fill=(217, 222, 232, 255), anchor='lm')
        bot.alpha_composite(g, (36, y))
    pbtn(20, 'ACCESS', 'Sistema multimedia'); pbtn(170, 'LOGIN', 'Información clasificada')
    frame(bot, (660, 10, 1044, 300), tab='top', c=22)
    d = ImageDraw.Draw(bot)
    for k, s in enumerate('✚♥✱'):
        d.rectangle([900 + k * 44, 0, 936 + k * 44, 36], outline=rgba(LN), width=3, fill=(0, 0, 0, 200)); d.text((918 + k * 44, 18), s, font=font(SYM, 20), fill=rgba(LN), anchor='mm')
    d.ellipse([688, 120, 748, 180], fill=(190, 20, 31, 255)); d.text((718, 150), '✆', font=font(SYM, 34), fill=(255, 255, 255), anchor='mm')
    spaced(d, (762, 136), 'PERDIDAS', font(ORB7, 13), (232, 236, 242, 255), 2, 'lm')
    spaced(d, (762, 178), 'SMS', font(ORB7, 13), (232, 236, 242, 255), 2, 'lm')
    d.rounded_rectangle([684, 214, 880, 262], radius=8, outline=(143, 166, 216, 255), width=3, fill=(40, 60, 110, 160))
    spaced(d, (782, 238), 'J.A.R.V.I.S.', font(ORB7, 18), (221, 230, 245, 255), 2, 'mm')
    # losas del reloj
    for k, (lab, col) in enumerate([('hora', CR), ('min', CY), ('seg', LN)]):
        x = 140 + k * 168; y = 360
        d.polygon([(x, y), (x + 150, y), (x + 150, y + 138), (x + 22, y + 138), (x, y + 116)], fill=rgba(col))
        d.text((x + 12, y + 8), lab, font=font(BAR6, 26), fill=(30, 30, 30, 200))
    d.rounded_rectangle([36, 360, 96, 386], radius=13, fill=rgba(RD, 200))
    d.rectangle([36, 410, 116, 490], fill=(70, 75, 86, 255), outline=(120, 126, 140, 255), width=2)
    spaced(d, (1030, 552), 'SYSTEM INFORMATION', font(ORB9, 30), rgba(CR), 2, 'rm')
    for k, s in enumerate(['Toca el núcleo para hablar con J.A.R.V.I.S.', 'Mantén ACCESS para abrir la cámara.', 'Desliza hacia arriba para desbloquear.']):
        d.text((1030, 596 + k * 34), s, font=font(BAR6, 25), fill=rgba(CR), anchor='rm')
    for k in range(4): d.rectangle([1040, 540 + k * 22, 1048, 554 + k * 22], fill=rgba(CR))
    save(bot, 'hud_bot.png')
    EL.append(dict(kind='img', x=0, y=B, src='hud_bot.png'))
    EL.append(dict(kind='date', x=690, y=B + 78, size=34, color=CR, fmt='EEEE', bold=True, sample=lambda v: 'SÁBADO'))
    EL.append(dict(kind='textf', x=862, y=B + 136, size=26, color=LN, fmt='%d', paras='#call_missed_count', sample=lambda v: str(v['calls'])))
    EL.append(dict(kind='textf', x=862, y=B + 178, size=26, color=LN, fmt='%d', paras='#sms_unread_count', sample=lambda v: str(v['sms'])))
    # núcleo J.A.R.V.I.S. (anillos que giran)
    def ring(r, w, col, dash=False, gap=None):
        im = Image.new('RGBA', (2 * r + 20, 2 * r + 20), (0, 0, 0, 0)); d2 = ImageDraw.Draw(im); c = r + 10
        if dash:
            for a in range(0, 360, 14): d2.arc([c - r, c - r, c + r, c + r], a, a + 7, fill=rgba(col), width=w)
        else:
            d2.arc([c - r, c - r, c + r, c + r], 0, 360 - (gap or 0), fill=rgba(col), width=w)
        return im
    save(ring(84, 7, CY, gap=110), 'ring1.png'); save(ring(66, 4, CR, dash=True), 'ring2.png'); save(ring(50, 8, LN, gap=200), 'ring3.png')
    core = Image.new('RGBA', (140, 140), (0, 0, 0, 0)); cd = ImageDraw.Draw(core)
    cd.ellipse([20, 20, 120, 120], fill=(29, 79, 107, 255)); g = Image.new('RGBA', core.size, (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse([40, 40, 100, 100], fill=(160, 240, 255, 230))
    core.alpha_composite(g.filter(ImageFilter.GaussianBlur(10))); ImageDraw.Draw(core).ellipse([56, 56, 84, 84], fill=(255, 255, 255, 255)); save(core, 'core.png')
    ax, ay = 968, B + 172
    EL.append(dict(kind='img', x=ax, y=ay, src='core.png', center=True))
    EL.append(dict(kind='img', x=ax, y=ay, src='ring1.png', center=True, anim=('rot', 5000, 1)))
    EL.append(dict(kind='img', x=ax, y=ay, src='ring2.png', center=True, anim=('rot', 9000, -1)))
    EL.append(dict(kind='img', x=ax, y=ay, src='ring3.png', center=True, anim=('rot', 3000, 1)))
    EL.append(dict(kind='btn', x=ax - 90, y=ay - 90, w=180, h=180, action='jarvis'))
    EL.append(dict(kind='btn', x=684, y=B + 214, w=196, h=48, action='jarvis'))
    EL.append(dict(kind='btn', x=36, y=B + 20, w=600, h=130, action='camera'))
    EL.append(dict(kind='btn', x=36, y=B + 170, w=600, h=130, action='unlock'))
    # reloj: dos dígitos por losa
    for k, (expr, sv) in enumerate([('#hour24', 'h'), ('#minute', 'm'), ('#second', 's')]):
        x = 140 + k * 168 + 40; y = B + 360 + 44
        EL.append(dict(kind='num', x=x, y=y, src='tnum', expr=f'int({expr}/10)', w=48, sample=lambda v, sv=sv: v[sv] // 10))
        EL.append(dict(kind='num', x=x + 50, y=y, src='tnum', expr=f'{expr}%10', w=48, sample=lambda v, sv=sv: v[sv] % 10))
    EL.append(dict(kind='img', x=36, y=B + 360, src='led_pill.png', vis='gt(#call_missed_count+#sms_unread_count,0)', sample=lambda v: v['calls'] + v['sms'] > 0, anim=('blink',)))
    lp = Image.new('RGBA', (60, 26), (0, 0, 0, 0)); ImageDraw.Draw(lp).rounded_rectangle([0, 0, 59, 25], radius=13, fill=rgba(RD)); save(lp, 'led_pill.png')
    # aviso para desbloquear
    hint = Image.new('RGBA', (W, 40), (0, 0, 0, 0)); hd_ = ImageDraw.Draw(hint); spaced(hd_, (W / 2, 20), 'DESLIZA PARA DESBLOQUEAR', font(ORB7, 20), rgba(LN), 5, 'mm'); [hd_.text((xx, 20), '▲', font=font(SYM, 20), fill=rgba(LN), anchor='mm') for xx in (250, 830)]; save(hint, 'hint.png')
    EL.append(dict(kind='img', x=0, y=-110, src='hint.png', anim=('breath',)))

# ----------------------------------------------------------------------------- MAML
def Y(y): return f'#screen_height{y:+d}' if isinstance(y, int) and y < 0 else (f'#screen_height{int(y):+d}' if y < 0 else f'{y:.0f}' if isinstance(y, float) else str(y))
def anim_xml(a, el):
    k = a[0]
    if k == 'rot':
        d, s = a[1], a[2]
        return f'<RotationAnimation><Item value="0" time="0"/><Item value="{360*s}" time="{d}"/></RotationAnimation>'
    if k == 'blink':
        return '<AlphaAnimation><Item value="255" time="0"/><Item value="255" time="500"/><Item value="40" time="800"/><Item value="255" time="1100"/></AlphaAnimation>'
    if k == 'breath':
        return '<AlphaAnimation><Item value="90" time="0"/><Item value="255" time="1200"/><Item value="90" time="2400"/></AlphaAnimation>'
    if k == 'pulse':
        return ('<SizeAnimation><Item w="20" h="20" time="0"/><Item w="150" h="150" time="1800"/><Item w="150" h="150" time="2000"/></SizeAnimation>'
                '<AlphaAnimation><Item value="255" time="0"/><Item value="0" time="1800"/><Item value="0" time="2000"/></AlphaAnimation>')
    if k == 'sweep':
        steps = ''.join(f'<Item x="0" y="{i*44}" time="{i*900}"/><Item x="0" y="{i*44}" time="{i*900+700}"/>' for i in range(4))
        return f'<PositionAnimation>{steps}<Item x="0" y="0" time="3600"/></PositionAnimation>'
    if k == 'alpha_charge':
        i = a[1]
        return (f'<AlphaAnimation><Item value="255" time="0"/><Item value="255" time="{i*120}"/><Item value="110" time="{i*120+300}"/>'
                f'<Item value="255" time="{i*120+600}"/><Item value="255" time="1800"/></AlphaAnimation>')
    return ''

def maml():
    out = ['<?xml version="1.0" encoding="utf-8"?>',
           '<!-- Aura Hacker — pantalla de bloqueo HUD (MAML). Generado por build_theme.py -->',
           '<Lockscreen version="1" frameRate="30" screenWidth="1080" displayDesktop="false">',
           '  <Image x="0" y="0" w="#screen_width" h="#screen_height" src="wall.jpg"/>',
           '  <Rectangle x="0" y="0" w="#screen_width" h="#screen_height" fillColor="#66000000"/>']
    acts = {'jarvis': '<IntentCommand action="com.cy.launcher.JARVIS" flags="268435456"/>',
            'camera': '<IntentCommand action="android.media.action.STILL_IMAGE_CAMERA" flags="268435456"/>',
            'unlock': '<ExternCommand command="unlock"/>'}
    for e in EL:
        vis = f' visibility="{e["vis"]}"' if e.get('vis') else ''
        y = Y(e['y']) if not isinstance(e['y'], float) else (f"{e['y']:.0f}")
        x = f"{e['x']:.0f}" if isinstance(e['x'], float) else str(e['x'])
        k = e['kind']
        if k == 'img':
            an = anim_xml(e['anim'], e) if e.get('anim') else ''
            cen = ' align="center" alignV="center"' if e.get('center') else ''
            piv = ''
            if e.get('anim') and e['anim'][0] == 'rot':
                im = Image.open(os.path.join(BUILD, 'lockscreen', e['src'])); piv = f' pivotX="{im.width/2:.0f}" pivotY="{im.height/2:.0f}"'
            out.append(f'  <Image x="{x}" y="{y}" src="{e["src"]}"{cen}{piv}{vis}>{an}</Image>' if an else f'  <Image x="{x}" y="{y}" src="{e["src"]}"{cen}{vis}/>')
        elif k == 'num':
            al = ' align="right"' if e.get('align') == 'right' else ''
            out.append(f'  <ImageNumber x="{x}" y="{y}" number="{e["expr"]}" src="{e["src"]}.png"{al}{vis}/>')
        elif k in ('text', 'textf', 'textv', 'date'):
            c = '#%02X%02X%02X' % e['color'][:3]; al = f' align="{e["align"]}"' if e.get('align') else ''
            b = ' bold="true"' if e.get('bold') else ''
            base = f'x="{x}" y="{y}" alignV="center" color="{c}" size="{e["size"]}"{al}{b}{vis}'
            if k == 'text': out.append(f'  <Text {base} text="{e["text"]}"/>')
            elif k == 'textf': out.append(f'  <Text {base} format="{e["fmt"]}" paras="{e["paras"]}"/>')
            elif k == 'textv': out.append(f'  <Text {base} text="{e["var"]}"/>')
            else: out.append(f'  <DateTime {base} format="{e["fmt"]}"/>')
        elif k == 'btn':
            out.append(f'  <Button x="{x}" y="{y}" w="{e["w"]}" h="{e["h"]}"><Triggers><Trigger action="up">{acts[e["action"]]}</Trigger></Triggers></Button>')
    out += ['  <!-- desbloqueo: deslizar hacia arriba desde la parte inferior -->',
            '  <Unlocker name="unlocker" bounceInitSpeed="2000" bounceAcceleration="3000">',
            '    <StartPoint x="0" y="#screen_height-420" w="#screen_width" h="420"/>',
            '    <EndPoint x="0" y="0" w="#screen_width" h="#screen_height-900"><Path tolerance="2000"><Position x="0" y="0"/><Position x="0" y="-1400"/></Path></EndPoint>',
            '  </Unlocker>', '</Lockscreen>']
    return '\n'.join(out)

# ----------------------------------------------------------------------------- vista previa (mismas posiciones)
def preview(sample):
    wall = Image.open(os.path.join(HERE, 'assets', 'wall_cyber.jpg')).convert('RGBA').resize((W, int(W * 2712 / 1220)))
    sh = H
    im = Image.new('RGBA', (W, sh), (0, 0, 0, 255)); im.alpha_composite(wall.crop((0, 0, W, sh)))
    im.alpha_composite(Image.new('RGBA', (W, sh), (0, 0, 0, 102)))
    L = os.path.join(BUILD, 'lockscreen'); d = ImageDraw.Draw(im)
    def yv(y): return sh + y if (isinstance(y, (int, float)) and y < 0) else y
    for e in EL:
        if e.get('sample') and e['kind'] != 'num' and not e['sample'](sample): continue
        k = e['kind']; x, y = e['x'], yv(e['y'])
        if k == 'img':
            p = Image.open(os.path.join(L, e['src'])).convert('RGBA')
            if e.get('anim') and e['anim'][0] == 'pulse': p = p.resize((100, 100))
            if e.get('anim') and e['anim'][0] == 'sweep': y += 44
            if e.get('center'): x, y = x - p.width / 2, y - p.height / 2
            im.alpha_composite(p, (int(x), int(y)))
        elif k == 'num':
            v = e['sample'](sample); s = str(v); w = e['w']
            if e.get('align') == 'right': x = x - w * len(s) + w
            for i, ch in enumerate(s):
                p = Image.open(os.path.join(L, f'{e["src"]}_{ch}.png')).convert('RGBA')
                if e.get('color_override'):
                    a = p.split()[3]; p = Image.new('RGBA', p.size, e['color_override'] + (255,)); p.putalpha(a)
                im.alpha_composite(p, (int(x + i * w), int(y)))
        elif k == 'btn': continue
        else:
            d = ImageDraw.Draw(im); txt = e['sample'](sample) if k != 'text' else e['text']
            if k == 'date' and e.get('fmt') == 'EEEE': txt = 'SÁBADO'
            f = font(BAR7 if e.get('bold') or k == 'date' else BAR6, e['size'])
            d.text((x, y), txt, font=f, fill=rgba(e['color']), anchor='rm' if e.get('align') == 'right' else 'lm')
    return im.convert('RGB')

def icons(dst):
    """Paquete de íconos: caja azul con borde y línea verde (como el tema)."""
    r = os.path.join(dst, 'res', 'drawable-xxhdpi'); os.makedirs(r, exist_ok=True); S = 192
    bg = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(bg)
    poly = [(14, 0), (S - 1, 0), (S - 1, S - 15), (S - 15, S - 1), (0, S - 1), (0, 14)]
    grad = Image.new('RGBA', (S, S)); gd = ImageDraw.Draw(grad)
    for y in range(S): t = y / (S - 1); gd.line([(0, y), (S, y)], fill=(int(60 - 40 * t), int(100 - 60 * t), int(230 - 110 * t), 235))
    m = Image.new('L', (S, S), 0); ImageDraw.Draw(m).polygon(poly, fill=255); bg.paste(grad, (0, 0), m)
    bg.save(os.path.join(r, 'icon_background.png'))
    border = Image.new('RGBA', (S, S), (0, 0, 0, 0)); bd = ImageDraw.Draw(border)
    bd.line(poly + [poly[0]], fill=(110, 152, 255, 255), width=5)
    bd.rectangle([26, S - 26, S - 30, S - 18], fill=rgba(LN)); border.save(os.path.join(r, 'icon_border.png'))
    mask = Image.new('RGBA', (S, S), (0, 0, 0, 0)); ImageDraw.Draw(mask).rounded_rectangle([34, 22, S - 34, S - 46], radius=26, fill=(0, 0, 0, 255))
    mask.save(os.path.join(r, 'icon_mask.png'))
    # vista previa de íconos
    pv = Image.new('RGBA', (S, S), (0, 0, 0, 0)); pv.alpha_composite(bg)
    return bg, border, mask

def zipdir(src, dst):
    with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(src):
            for f in sorted(files):
                p = os.path.join(root, f); z.write(p, os.path.relpath(p, src))

def main():
    shutil.rmtree(BUILD, ignore_errors=True); os.makedirs(OUT, exist_ok=True)
    L = os.path.join(BUILD, 'lockscreen'); build_assets(L)
    Image.open(os.path.join(HERE, 'assets', 'wall_cyber.jpg')).convert('RGB').resize((1080, 2400)).save(os.path.join(L, 'wall.jpg'), quality=88)
    open(os.path.join(L, 'manifest.xml'), 'w', encoding='utf-8').write(maml())
    I = os.path.join(BUILD, 'icons'); bg, border, mask = icons(I)
    T = os.path.join(BUILD, 'mtz'); os.makedirs(os.path.join(T, 'wallpaper'), exist_ok=True); os.makedirs(os.path.join(T, 'preview'), exist_ok=True)
    shutil.copy(os.path.join(HERE, 'assets', 'wall_cyber.jpg'), os.path.join(T, 'wallpaper', 'default_wallpaper.jpg'))
    shutil.copy(os.path.join(HERE, 'assets', 'wall_cyber.jpg'), os.path.join(T, 'wallpaper', 'default_lock_wallpaper.jpg'))
    zipdir(L, os.path.join(T, 'lockscreen')); zipdir(I, os.path.join(T, 'icons'))
    sample = dict(bat=68, chg=False, calls=2, sms=3, h=21, m=47, s=33)
    pv = preview(sample); pv.save(os.path.join(OUT, 'preview_lockscreen.png'))
    pv.resize((720, 1600)).save(os.path.join(T, 'preview', 'preview_lockscreen_0.jpg'), quality=88)
    # vista previa de íconos sobre el fondo
    home = Image.open(os.path.join(HERE, 'assets', 'wall_cyber.jpg')).convert('RGBA').resize((1080, 2400)); hd = ImageDraw.Draw(home)
    cols = [(234, 67, 53), (52, 168, 83), (66, 133, 244), (251, 188, 5), (156, 39, 176), (0, 188, 212), (255, 87, 34), (96, 125, 139)]
    names = ['TELÉFONO', 'MENSAJES', 'CÁMARA', 'GALERÍA', 'AJUSTES', 'J.A.R.V.I.S.', 'MÚSICA', 'NOTAS']
    for i in range(12):
        x = 70 + (i % 4) * 250; y = 2060 if i >= 8 else 900 + (i // 4) * 260
        t = Image.new('RGBA', (192, 192), (0, 0, 0, 0)); t.alpha_composite(bg)
        ic = Image.new('RGBA', (192, 192), (0, 0, 0, 0)); ImageDraw.Draw(ic).rounded_rectangle([34, 22, 158, 146], radius=26, fill=rgba(cols[i % 8]))
        ImageDraw.Draw(ic).ellipse([78, 64, 114, 100], fill=(255, 255, 255, 230)); t.alpha_composite(ic); t.alpha_composite(border)
        home.alpha_composite(t, (x, y))
        if i < 8: hd.text((x + 96, y + 214), names[i % 8], font=font(ORB7, 20), fill=rgba(CR), anchor='mm')
    home.convert('RGB').resize((720, 1600)).save(os.path.join(T, 'preview', 'preview_icons_0.jpg'), quality=88)
    home.convert('RGB').save(os.path.join(OUT, 'preview_icons.png'))
    open(os.path.join(T, 'description.xml'), 'w', encoding='utf-8').write('''<?xml version="1.0" encoding="UTF-8"?>
<theme>
  <title>Aura Hacker</title>
  <designer>CY</designer>
  <author>CY</author>
  <version>1.0</version>
  <uiVersion>14</uiVersion>
  <description>Tema HUD hacker (Matrix verde/crema) con pantalla de bloqueo animada: batería en celdas de energía, reloj hora/min/seg, llamadas perdidas, SMS, próxima alarma, mapa con radar y acceso a J.A.R.V.I.S.</description>
</theme>
''')
    dst = os.path.join(OUT, 'Aura-Hacker.mtz')
    if os.path.exists(dst): os.remove(dst)
    zipdir(T, dst)
    print('OK', dst, os.path.getsize(dst) // 1024, 'KB')

if __name__ == '__main__':
    main()
