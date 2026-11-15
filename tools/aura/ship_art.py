from PIL import Image, ImageDraw, ImageFilter
import math, random
random.seed(7)
TE=(47,232,216)
def glowc(a): return (60,255,235,a)
def station(W=900,H=520):
    im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im)
    cx,cy=W*.5,H*.5;L=W*.78;R=H*.30;tilt=-0.18
    def P(x,y): # rota el casco
        return (cx+x*math.cos(tilt)-y*math.sin(tilt), cy+x*math.sin(tilt)+y*math.cos(tilt))
    # cuerpo cilíndrico con sombreado por franjas
    for i in range(160):
        t=i/159; y=(t-.5)*2*R
        sh=math.cos((t-.35)*math.pi*.95); sh=max(0,sh)
        col=(int(10+40*sh),int(60+170*sh),int(70+150*sh),255)
        d.polygon([P(-L/2,y),P(L/2,y),P(L/2,y+2*R/159+1),P(-L/2,y+2*R/159+1)],fill=col)
    # anillos y módulos
    for k in range(-5,6):
        x=k*L/11.5
        w=18 if k%2==0 else 10
        for i in range(60):
            t=i/59;y=(t-.5)*2*(R+14);sh=max(0,math.cos((t-.35)*math.pi*.95))
            col=(int(20+60*sh),int(90+150*sh),int(95+140*sh),255)
            d.polygon([P(x-w/2,y),P(x+w/2,y),P(x+w/2,y+2*(R+14)/59+1),P(x-w/2,y+2*(R+14)/59+1)],fill=col)
    # paneles
    for _ in range(140):
        x=random.uniform(-L/2+10,L/2-30);y=random.uniform(-R+6,R-12);w=random.uniform(10,40);h=random.uniform(4,12)
        a=random.randint(60,150);d.polygon([P(x,y),P(x+w,y),P(x+w,y+h),P(x,y+h)],outline=(140,255,240,a))
    # tapas y antenas
    for s in (-1,1):
        cxx=s*L/2
        for r in range(int(R),0,-3):
            sh=r/R;d.ellipse([P(cxx,0)[0]-r*.35,P(cxx,0)[1]-r,P(cxx,0)[0]+r*.35,P(cxx,0)[1]+r],outline=(int(40+120*sh),int(140+100*sh),int(150+90*sh),200))
        d.line([P(cxx,0),P(cxx+s*90,-20)],fill=(150,255,240,220),width=4);d.ellipse([P(cxx+s*90,-20)[0]-8,P(cxx+s*90,-20)[1]-8,P(cxx+s*90,-20)[0]+8,P(cxx+s*90,-20)[1]+8],fill=(150,255,240,230))
    # paneles solares
    for s in (-1,1):
        x0=-L*.12;pts=[P(x0,s*(R+20)),P(x0+L*.22,s*(R+20)),P(x0+L*.18,s*(R+92)),P(x0-L*.04,s*(R+92))]
        d.polygon(pts,fill=(20,80,90,200),outline=(120,255,235,230))
        for k in range(1,6):
            t=k/6;a=(pts[0][0]+(pts[3][0]-pts[0][0])*t,pts[0][1]+(pts[3][1]-pts[0][1])*t);b=(pts[1][0]+(pts[2][0]-pts[1][0])*t,pts[1][1]+(pts[2][1]-pts[1][1])*t);d.line([a,b],fill=(120,255,235,120),width=2)
    g=im.filter(ImageFilter.GaussianBlur(10));out=Image.new('RGBA',(W,H),(0,0,0,0))
    r,gg,b,a=g.split();a=a.point(lambda v:int(v*.55));g=Image.merge('RGBA',(r,gg,b,a));out.alpha_composite(g);out.alpha_composite(im);return out
s=station();s.save('ship.webp','WEBP',quality=82)
# nave lateral (device scanning)
def cruiser(W=900,H=260):
    im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im)
    body=[(40,150),(150,95),(620,80),(820,110),(880,135),(820,165),(600,190),(150,185)]
    d.polygon(body,fill=(20,110,110,255))
    for i in range(70):
        t=i/69;y=80+t*110;sh=max(0,math.cos((t-.3)*math.pi));d.line([(150,y),(800,y)],fill=(int(20+50*sh),int(90+150*sh),int(95+140*sh),140))
    for _ in range(90):
        x=random.uniform(160,780);y=random.uniform(92,180);d.rectangle([x,y,x+random.uniform(8,30),y+random.uniform(3,9)],outline=(150,255,240,random.randint(70,160)))
    for x in (260,420,560):d.rectangle([x,60,x+60,210],outline=(150,255,240,200),fill=(25,120,120,220))
    d.polygon([(40,150),(-10,140),(-10,160)],fill=(120,240,230,200))
    g=im.filter(ImageFilter.GaussianBlur(8));out=Image.new('RGBA',(W,H));out.alpha_composite(g);out.alpha_composite(im);return out
cruiser().save('cruiser.webp','WEBP',quality=82)
# casco detrás del menú radial (turquesa, grande)
def hull(W=1000,H=700):
    im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im)
    for i in range(300):
        t=i/299;y=H*.12+t*H*.9;sh=max(0,math.cos((t-.25)*math.pi*.9))
        d.line([(0,y-(1-t)*80),(W,y-t*60)],fill=(int(10+40*sh),int(70+130*sh),int(75+120*sh),int(140+90*sh)),width=3)
    for _ in range(260):
        x=random.uniform(0,W);y=random.uniform(H*.15,H);w=random.uniform(16,70);h=random.uniform(6,22)
        d.rectangle([x,y,x+w,y+h],outline=(140,255,240,random.randint(40,120)))
    for k in range(8):
        y=H*.2+k*H*.1;d.line([(0,y+30),(W,y-40)],fill=(150,255,240,70),width=2)
    return im.filter(ImageFilter.GaussianBlur(1.2))
hull().save('hull.webp','WEBP',quality=75)
# placa de circuitos azul (fondo página sistema)
def circuit(W=540,H=1100):
    im=Image.new('RGB',(W,H),(14,10,60));d=ImageDraw.Draw(im)
    for _ in range(260):
        x=random.randrange(0,W,12);y=random.randrange(0,H,12);col=random.choice([(40,40,170),(60,50,200),(90,40,160),(150,40,90)])
        pts=[(x,y)]
        for _ in range(random.randint(2,6)):
            dx,dy=random.choice([(1,0),(0,1),(1,1),(-1,1),(0,-1)]);ln=random.randrange(12,90,12);x+=dx*ln;y+=dy*ln;pts.append((x,y))
        d.line(pts,fill=col,width=random.choice([3,4,6]));d.ellipse([x-5,y-5,x+5,y+5],outline=col,width=2)
    for _ in range(30):
        x=random.randrange(20,W-80);y=random.randrange(20,H-80);d.rectangle([x,y,x+random.randint(30,80),y+random.randint(30,80)],outline=(70,60,210),width=3,fill=(20,16,90))
    return im
circuit().save('circuit.webp','WEBP',quality=70)
print('ok')
