/* ---------- Fondos generados (sin imágenes externas) ---------- */
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%100000)/100000}}
function genWall(kind,W,H){
  const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),R=rng(kind.length*7919+W);
  const lg=(stops,y0=0,y1=H)=>{const g=x.createLinearGradient(0,y0,0,y1);stops.forEach(([o,col])=>g.addColorStop(o,col));return g};
  const blob=(cx,cy,r,col,blur)=>{x.save();x.filter=`blur(${blur}px)`;x.fillStyle=col;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.restore()};
  const stars=(n,maxY,a=1)=>{for(let i=0;i<n;i++){x.fillStyle=`rgba(255,255,255,${(R()*.8+.2)*a})`;const r=R()*1.6*W/1080+.3;x.beginPath();x.arc(R()*W,R()*maxY,r,0,7);x.fill()}};
  const skyline=(base,col,tower)=>{x.fillStyle=col;let px=0;while(px<W){const bw=(30+R()*90)*W/1080,bh=(60+R()*260)*H/2340;x.fillRect(px,base-bh,bw,bh+H);
      if(R()>.6){x.fillRect(px+bw*.4,base-bh-40*H/2340,bw*.15,40*H/2340)}px+=bw-2}
    if(tower){const tx=W*tower,u=H/2340;x.fillRect(tx-14*u,base-760*u,28*u,760*u);x.beginPath();x.moveTo(tx-40*u,base-560*u);x.lineTo(tx+40*u,base-560*u);x.lineTo(tx+26*u,base-470*u);x.lineTo(tx-26*u,base-470*u);x.fill();
      x.beginPath();x.ellipse(tx,base-610*u,52*u,38*u,0,0,7);x.fill();x.fillRect(tx-4*u,base-1020*u,8*u,280*u);x.fillRect(tx-90*u,base-200*u,180*u,200*u)}};
  const lights=(base,n,col)=>{for(let i=0;i<n;i++){x.fillStyle=col;x.globalAlpha=R()*.8+.2;x.fillRect(R()*W,base-R()*280*H/2340,2.2*W/1080,3*H/2340)}x.globalAlpha=1};
  if(kind==='sunset'){
    x.fillStyle=lg([[0,'#1d1730'],[.28,'#5a3a63'],[.48,'#c06a6a'],[.6,'#f29a6b'],[.68,'#ffc98f'],[.72,'#ffd9a3'],[1,'#2a1b24']]);x.fillRect(0,0,W,H);
    blob(W*.5,H*.66,W*.35,'rgba(255,200,140,.75)',W*.12);blob(W*.2,H*.4,W*.3,'rgba(255,120,150,.25)',W*.15);blob(W*.85,H*.3,W*.25,'rgba(140,110,255,.25)',W*.15);
    stars(60,H*.25,.5);skyline(H*.74,'#170f1c',.62);x.fillStyle=lg([[0,'rgba(23,15,28,0)'],[.15,'#170f1c'],[1,'#0b070e']],H*.72,H);x.fillRect(0,H*.72,W,H);lights(H*.74,180,'#ffcf8a');
  }else if(kind==='aurora'){
    x.fillStyle=lg([[0,'#020814'],[.6,'#06192b'],[1,'#03070d']]);x.fillRect(0,0,W,H);stars(260,H*.75);
    [['rgba(40,255,170,.55)',.28],['rgba(0,200,255,.45)',.36],['rgba(170,80,255,.45)',.22]].forEach(([col,yy],k)=>{x.save();x.filter=`blur(${W*.05}px)`;x.strokeStyle=col;x.lineWidth=W*(.16-k*.03);x.beginPath();
      x.moveTo(-W*.2,H*yy);for(let i=0;i<=6;i++)x.quadraticCurveTo(W*(i/6)-W*.05,H*(yy+(R()-.5)*.22),W*((i+.5)/6),H*(yy+(R()-.5)*.12));x.stroke();x.restore()});
    x.fillStyle='#04101a';x.beginPath();x.moveTo(0,H*.8);for(let i=0;i<=10;i++)x.lineTo(W*i/10,H*(.72+R()*.1));x.lineTo(W,H);x.lineTo(0,H);x.fill();
    x.fillStyle='#02070c';x.beginPath();x.moveTo(0,H*.86);for(let i=0;i<=8;i++)x.lineTo(W*i/8,H*(.82+R()*.06));x.lineTo(W,H);x.lineTo(0,H);x.fill();
  }else if(kind==='neon'){
    x.fillStyle=lg([[0,'#0b0221'],[.35,'#2a0845'],[.55,'#7a1c7a'],[.62,'#ff3d81'],[.64,'#120326'],[1,'#05010c']]);x.fillRect(0,0,W,H);stars(140,H*.45,.7);
    const sy=H*.5,sr=W*.32;const sg=x.createLinearGradient(0,sy-sr,0,sy+sr);sg.addColorStop(0,'#ffe66d');sg.addColorStop(.6,'#ff6ec7');sg.addColorStop(1,'#a020f0');
    blob(W/2,sy,sr*1.25,'rgba(255,80,180,.45)',W*.08);x.fillStyle=sg;x.beginPath();x.arc(W/2,sy,sr,0,7);x.fill();
    x.fillStyle='#2a0845';for(let i=0;i<7;i++){const yy=sy+sr*.15+i*sr*.13;x.fillRect(W/2-sr,yy,sr*2,sr*.035+i*sr*.012)}
    skyline(H*.635,'#120326',0);const hz=H*.64;x.strokeStyle='rgba(0,240,255,.75)';x.lineWidth=2*W/1080;x.shadowColor='#00f0ff';x.shadowBlur=12;
    for(let i=0;i<14;i++){const t=i/14,yy=hz+(H-hz)*t*t;x.beginPath();x.moveTo(0,yy);x.lineTo(W,yy);x.stroke()}
    for(let i=-12;i<=12;i++){x.beginPath();x.moveTo(W/2+i*W*.03,hz);x.lineTo(W/2+i*W*.32,H);x.stroke()}x.shadowBlur=0;
  }else if(kind==='ocean'){
    x.fillStyle='#021b33';x.fillRect(0,0,W,H);
    [[.2,.15,'#00e5ff'],[.85,.25,'#2563eb'],[.4,.55,'#14b8a6'],[.9,.7,'#7c3aed'],[.1,.85,'#0ea5e9'],[.6,.95,'#22d3ee']].forEach(([a,b,col])=>blob(W*a,H*b,W*(.35+R()*.2),col,W*.14));
    x.globalAlpha=.08;for(let i=0;i<40;i++){x.strokeStyle='#fff';x.lineWidth=1;x.beginPath();x.arc(W*R(),H*R(),W*(.1+R()*.5),0,7);x.stroke()}x.globalAlpha=1;
  }else if(kind==='galaxy'){
    x.fillStyle='#05030f';x.fillRect(0,0,W,H);
    [[.3,.3,'rgba(255,60,180,.55)'],[.7,.45,'rgba(80,120,255,.55)'],[.5,.62,'rgba(170,70,255,.5)'],[.25,.75,'rgba(0,220,255,.35)'],[.8,.2,'rgba(255,150,80,.35)']].forEach(([a,b,col])=>blob(W*a,H*b,W*(.3+R()*.2),col,W*.13));
    stars(600,H);for(let i=0;i<14;i++){const sx=R()*W,sy=R()*H;blob(sx,sy,3*W/1080,'#fff',2);x.fillStyle='rgba(255,255,255,.9)';x.fillRect(sx-W*.02,sy-.6,W*.04,1.2);x.fillRect(sx-.6,sy-W*.02,1.2,W*.04)}
  }else{ /* lava */
    x.fillStyle='#1a0306';x.fillRect(0,0,W,H);
    [[.2,.2,'#ff2e63'],[.8,.15,'#ff9a00'],[.5,.45,'#ff4d00'],[.15,.7,'#c2185b'],[.85,.65,'#ff6a00'],[.5,.95,'#ff1744']].forEach(([a,b,col])=>blob(W*a,H*b,W*(.33+R()*.18),col,W*.13));
    x.globalCompositeOperation='overlay';x.fillStyle=lg([[0,'rgba(255,255,255,.25)'],[1,'rgba(0,0,0,.4)']]);x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';
  }
  /* grano suave */
  const id=x.getImageData(0,0,W,H),d=id.data;for(let i=0;i<d.length;i+=4){const n=(R()-.5)*10;d[i]+=n;d[i+1]+=n;d[i+2]+=n}x.putImageData(id,0,0);
  return c}
const WALLS=[['sunset','Atardecer'],['aurora','Aurora'],['neon','Neón'],['ocean','Océano'],['galaxy','Galaxia'],['lava','Lava']];
