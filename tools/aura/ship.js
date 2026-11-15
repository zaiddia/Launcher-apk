/* =====================================================================
   NAVE — estilo "Spacecraft" (KLWP): marco naranja de pantalla completa,
   salud de la nave, sistema solar real, menú radial con paneles, página de sistema
   ===================================================================== */
const SHIPON=()=>S.skin==='ship';
const SC={es:{health:'CHEQUEO DE SALUD DE LA NAVE',checking:'VERIFICANDO',anom:'ANOMALÍAS',fuel:'COMBUSTIBLE',speed:'VELOCIDAD',temp:'TEMP',ctrl:'CONTROL',ok:'OK',
    solar:'TRAYECTORIA DEL SISTEMA SOLAR',telemetry:'MONITOREO DE TELEMETRÍA',hourlyBat:'ESTADO DE BATERÍA POR HORA',hoursAgo:'HORAS ATRÁS',system:'SISTEMA',scan:'ESCANEO DEL DISPOSITIVO',
    wxH:'PRONÓSTICO POR HORA',wx3:'PRONÓSTICO A 3 DÍAS',cal:'CALENDARIO',agenda:'AGENDA',news:'NOTICIAS',map:'NAVEGACIÓN',compass:'BRÚJULA',fit:'DATOS FÍSICOS',steps:'PASOS',today:'HOY',
    music:'REPRODUCTOR',set:'ESPECTRO DE COLOR',apps:'APPS',more:'MÁS AJUSTES',perms:'PERMISOS',style:'ESTILO',close:'CERRAR',noAct:'Concede «Actividad física» para contar pasos',noSensor:'Este celular no tiene contador de pasos',
    moon:'FASE LUNAR',illum:'ILUMINACIÓN',sunrise:'AMANECER',sunset:'ATARDECER',zodiac:'SIGNO',season:'ESTACIÓN',wind:'VIENTO',hum:'HUMEDAD',press:'PRESIÓN',uv:'ÍNDICE UV',station:'ESTACIÓN',
    openMaps:'ABRIR MAPAS',heading:'RUMBO',noLoc:'Toca para elegir ubicación',distance:'DISTANCIA',kcal:'KCAL',ekg:'DIAGRAMA EKG',nextAlarm:'PRÓXIMA ALARMA',procs:'APPS INSTALADAS',launcher:'LAUNCHER',
    model:'MODELO',android:'VERSIÓN ANDROID',cpu:'CPU',cores:'NÚCLEOS',batT:'TEMPERATURA BATERÍA',power:'ENERGÍA DEL SISTEMA',volt:'VOLTAJE BATERÍA EN mV',ram:'MEMORIA LIBRE',sto:'ALMACENAMIENTO LIBRE',
    phases:['Luna nueva','Creciente','Cuarto creciente','Gibosa creciente','Luna llena','Gibosa menguante','Cuarto menguante','Menguante'],
    zod:['Capricornio','Acuario','Piscis','Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario'],seasons:['Invierno','Primavera','Verano','Otoño'],
    planets:{mercury:'MERCURIO',venus:'VENUS',earth:'TIERRA',mars:'MARTE',jupiter:'JÚPITER',saturn:'SATURNO',uranus:'URANO',neptune:'NEPTUNO',pluto:'PLUTÓN',sun:'SOL',belt:'CINTURÓN DE ASTEROIDES',kuiper:'CINTURÓN DE KUIPER'}},
  en:{health:'SPACECRAFT SYSTEM HEALTH CHECK',checking:'CHECKING',anom:'ANOMALIES',fuel:'FUEL',speed:'SPEED',temp:'TEMP',ctrl:'CONTROL',ok:'OK',
    solar:'SOLAR SYSTEM TRAJECTORY',telemetry:'TELEMETRY MONITORING',hourlyBat:'HOURLY BATTERY STATUS',hoursAgo:'HOURS AGO',system:'SYSTEM',scan:'DEVICE SCANNING',
    wxH:'HOURLY WEATHER FORECAST',wx3:'3-DAY WEATHER FORECAST',cal:'CALENDAR',agenda:'AGENDA',news:'NEWS',map:'NAVIGATION',compass:'COMPASS',fit:'FITNESS DATA',steps:'STEPS',today:'TODAY',
    music:'PLAYER',set:'COLOR SPECTRUM',apps:'APPS',more:'MORE SETTINGS',perms:'PERMISSIONS',style:'STYLE',close:'CLOSE',noAct:'Grant «Physical activity» to count steps',noSensor:'This phone has no step counter',
    moon:'MOON PHASE',illum:'ILLUMINATION',sunrise:'SUNRISE',sunset:'SUNSET',zodiac:'ZODIAC SIGN',season:'SEASON',wind:'WIND',hum:'HUMIDITY',press:'PRESSURE',uv:'UV INDEX',station:'STATION',
    openMaps:'OPEN MAPS',heading:'HEADING',noLoc:'Tap to choose location',distance:'DISTANCE',kcal:'KCAL',ekg:'EKG DIAGRAM',nextAlarm:'NEXT ALARM',procs:'INSTALLED APPS',launcher:'LAUNCHER',
    model:'MODEL',android:'ANDROID VERSION',cpu:'CPU',cores:'CORES',batT:'BATTERY TEMPERATURE',power:'POWER SYSTEM DEVICE',volt:'BATTERY VOLTAGE IN mV',ram:'FREE MEMORY',sto:'FREE STORAGE',
    phases:['New moon','Waxing crescent','First quarter','Waxing gibbous','Full moon','Waning gibbous','Last quarter','Waning crescent'],
    zod:['Capricorn','Aquarius','Pisces','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius'],seasons:['Winter','Spring','Summer','Autumn'],
    planets:{mercury:'MERCURY',venus:'VENUS',earth:'EARTH',mars:'MARS',jupiter:'JUPITER',saturn:'SATURN',uranus:'URANUS',neptune:'NEPTUNE',pluto:'PLUTO',sun:'SUN',belt:'ASTEROID BELT',kuiper:'KUIPER BELT'}}};
const SCT=()=>SC[S.lang]||(S.lang==='pt'?SC.es:SC.en);
function shipColors(){const h=S.shipHue??28,B=document.body.style;B.setProperty('--fr',`hsl(${h} 100% 55%)`);B.setProperty('--fr2',`hsl(${h} 95% 72%)`);B.setProperty('--sr',`hsl(${(h+340)%360} 92% 58%)`)}

/* ---------- astronomía (sin internet) ---------- */
const AST={
  planets(d){const days=(d-Date.UTC(2000,0,1,12))/864e5;const E=[['mercury',252.25,4.09233,.39],['venus',181.98,1.60213,.72],['earth',100.46,.98561,1],['mars',355.43,.52403,1.52],
      ['jupiter',34.35,.08309,5.2],['saturn',50.08,.03346,9.5],['uranus',314.06,.01173,19.2],['neptune',304.35,.00598,30.1],['pluto',238.9,.00397,39.5]];
    return E.map(([k,L0,n,a])=>({k,lon:((L0+n*days)%360+360)%360,a}))},
  moon(d){const syn=29.530588853,ref=Date.UTC(2000,0,6,18,14);const age=(((d-ref)/864e5)%syn+syn)%syn;const ill=Math.round((1-Math.cos(2*Math.PI*age/syn))/2*100);
    const ph=Math.floor((age/syn)*8+.5)%8;return{age,ill,ph}},
  sun(d,lat,lon){const rad=Math.PI/180,day=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/864e5);
    const g=2*Math.PI/365*(day-1);const eq=229.18*(.000075+.001868*Math.cos(g)-.032077*Math.sin(g)-.014615*Math.cos(2*g)-.040849*Math.sin(2*g));
    const dec=.006918-.399912*Math.cos(g)+.070257*Math.sin(g)-.006758*Math.cos(2*g)+.000907*Math.sin(2*g)-.002697*Math.cos(3*g)+.00148*Math.sin(3*g);
    const ha=Math.acos(Math.min(1,Math.max(-1,Math.cos(90.833*rad)/(Math.cos(lat*rad)*Math.cos(dec))-Math.tan(lat*rad)*Math.tan(dec))))/rad;
    const mk=m=>{const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())+m*60000);return t};
    return{rise:mk(720-4*(lon+ha)-eq),set:mk(720-4*(lon-ha)-eq)}},
  zodiac(d){const m=d.getMonth(),dd=d.getDate();const cut=[20,19,21,20,21,21,23,23,23,23,22,22];return (m+(dd>=cut[m]?1:0))%12},
  season(d,lat){const m=d.getMonth();let s=m<2||m===11?0:m<5?1:m<8?2:3;if(lat<0)s=(s+2)%4;return s}};

/* ---------- íconos de línea del menú radial ---------- */
const WI={dots:'<g fill="currentColor" stroke="none"><circle cx="6" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></g>',
  news:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M6 9h12M6 12h5M13 12h5M6 15h12"/>',music:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M10 16V8l6-1.5v8"/><circle cx="8.5" cy="16" r="1.6"/><circle cx="14.5" cy="14.5" r="1.6"/>',
  fit:'<path d="M12 3a8 8 0 0 0-8 8v3M12 6a5 5 0 0 1 5 5v6M12 9a2 2 0 0 0-2 2v5a5 5 0 0 1-3 4M12 11v4a8 8 0 0 0 2 5M20 11v1"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/><rect x="3" y="3" width="10" height="10" rx="1" opacity=".6"/>',
  map:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2"/>',
  wx:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',sys:'<path d="M9 21v-3a6 6 0 1 1 9-5l1 3h-2v3a2 2 0 0 1-2 2h-1"/><path d="M10 10a2 2 0 1 1 4 0c0 1.5-2 1.5-2 3"/>',
  jv:'<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 16h6M3 12v3M21 12v3"/>',grid:'<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>',
  wifi:'<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.3" fill="currentColor"/>',torch:'<path d="M8 2h8v5l-2 3v12h-4V10L8 7z"/><path d="M12 13v3"/>',
  gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  bat:'<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M6 10v4M9 10v4"/>',hex:'<path d="M12 2l8.66 5v10L12 22l-8.66-5V7z"/>',back:'<path d="M15 5l-7 7 7 7"/>',fwd:'<path d="M9 5l7 7-7 7"/>'};
const wi=(n,c='')=>`<svg class="wi ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${WI[n]||''}</svg>`;
/* orden del menú radial (sentido horario desde arriba) */
const WHEEL=[['apps','dots'],['news','news'],['music','music'],['fit','fit'],['edit','edit'],['map','map'],['cal','cal'],['wx','wx'],['sys','sys'],['jv','jv']];

/* ---------- barra superior y marco ---------- */
function shTop(){const el=$('#shipTop');if(!el)return;if(!SHIPON()){el.innerHTML='';return}const d=new Date(),n=VP().length,p=(S.page|0)+1;
  el.innerHTML=`<span class="lg">AU</span><span class="tm"><b id="shT">${esc(fmt(d,{hour:'2-digit',minute:'2-digit'}))}</b><small id="shD">${esc(fmt(d,{day:'numeric',month:'short'}).toUpperCase())}</small></span>
    <button class="pg" data-sp="-1">«</button><b class="pn" id="shPn">${p}</b><button class="pg" data-sp="1">»</button>
    <span class="sig" id="shSig"><i></i><i></i><i></i><i></i></span><span class="nt" id="shNet">—</span><span class="bt"><span class="bb" id="shBb">${'<i></i>'.repeat(10)}</span><b id="shBp">—%</b></span>`}
function shTopUpd(){const pn=$('#shPn');if(!pn)return;pn.textContent=(S.page|0)+1;const d=new Date();$('#shT').textContent=fmt(d,{hour:'2-digit',minute:'2-digit'});$('#shD').textContent=fmt(d,{day:'numeric',month:'short'}).toUpperCase();
  const v=DI.bat;$('#shBp').textContent=(v??'—')+'%';$$('#shBb i').forEach((i,k)=>i.classList.toggle('on',v!=null&&k<Math.round(v/10)));
  const t=HD.net.type;$('#shNet').textContent=t==='wifi'?'WI-FI':t==='mobile'?'4G/5G':t==='none'?'OFF':'NET';$$('#shSig i').forEach((i,k)=>i.classList.toggle('on',t!=='none'&&k<(t==='wifi'?4:3)))}
$('#shipTop').addEventListener('click',e=>{const b=e.target.closest('[data-sp]');if(!b)return;hap('tick');goPage((S.page|0)+(+b.dataset.sp))});

/* ---------- página principal ---------- */
let SHP='';   // panel abierto desde el menú radial ('' = nave + sistema solar)
function shMain(){return `<div class="hrow shpanel" id="shPanel">${SHP?shSub(SHP):shDefault()}</div>${shWheel()}`}
function shDefault(){const t=SCT();
  return `<div class="hf hp shhc" data-f="ship-b"><span class="tele">${t.telemetry}</span><b class="hct">${t.health}</b><small class="chk">${t.checking}<i>▮</i></small>
     <div class="shbox"><img src="img/ship.webp" alt="" class="shimg" decoding="async"><span class="scanl"></span><span class="mk m1"></span><span class="mk m2" id="shMk2"></span><span class="mk m3" id="shMk3"></span></div>
     <div class="met" id="shMet">${shMet()}</div>
     <div class="hcb"><svg class="gauge" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" class="g0"/><circle cx="20" cy="20" r="16" class="g1" id="shG" stroke-dasharray="0 101"/></svg>
       <span class="mbars" id="shMb">${shMiniBars()}</span><span class="rdr"><i></i></span></div></div>
   <div class="solar">${shSolar()}<b class="sct">${t.solar}</b></div>`}
function shMet(){const t=SCT(),n=DI.n||{};const anom=Math.max(0,HD.notif)+Math.max(0,HD.calls);
  return `<span>${t.anom}: <b>${anom}</b></span><span>${t.fuel}: <b>${DI.bat??'—'}%</b></span><span>${t.speed}: <b>${HD.cpu!=null&&HD.cpu>=0?HD.cpu+'%':'—'}</b></span><span>${t.temp}: <b>${DI.temp!=null?Math.round(DI.temp)+'°C':'—'}</b></span><span>${t.ctrl}: <b>${n.ramTotal?Math.round(n.ramAvail/n.ramTotal*100)+'%':t.ok}</b></span>`}
function shMiniBars(){const h=batHist(8);return h.map(v=>`<i style="height:${v==null?4:Math.max(8,v)}%"></i>`).join('')}
function shSolar(){const t=SCT(),P=AST.planets(Date.now());const cx=180,cy=92,rx=f=>26+f*132,ry=f=>(26+f*132)*.36;const sc=a=>Math.sqrt(a/39.5);
  let s=`<svg viewBox="0 0 360 184" class="orr"><defs><radialGradient id="sunG"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="var(--fr2)"/><stop offset="1" stop-color="var(--fr)" stop-opacity="0"/></radialGradient></defs>`;
  s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx(sc(2.8))}" ry="${ry(sc(2.8))}" class="belt"/><ellipse cx="${cx}" cy="${cy}" rx="${rx(sc(44))}" ry="${ry(sc(44))}" class="belt k"/>`;
  P.forEach(p=>{s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx(sc(p.a))}" ry="${ry(sc(p.a))}" class="orb"/>`});
  s+=`<circle cx="${cx}" cy="${cy}" r="14" fill="url(#sunG)"/><circle cx="${cx}" cy="${cy}" r="5.5" class="sun"/><text x="${cx}" y="${cy-12}" class="pl">${t.planets.sun}</text>`;
  const sz={mercury:2.5,venus:3.6,earth:3.8,mars:3,jupiter:7,saturn:6,uranus:4.6,neptune:4.4,pluto:2.2};
  P.forEach((p,i)=>{const a=p.lon*Math.PI/180,x=cx+rx(sc(p.a))*Math.cos(a),y=cy-ry(sc(p.a))*Math.sin(a);const up=i<4?(i%2===0):(y<cy),L=i<4?14+i*5:9;
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz[p.k]}" class="pt ${p.k}"/>${p.k==='saturn'?`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="10" ry="3" class="ring"/>`:''}<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y+(up?-L:L)).toFixed(1)}" class="lk"/><text x="${x.toFixed(1)}" y="${(y+(up?-L-2:L+7)).toFixed(1)}" class="pl">${t.planets[p.k]}</text>`});
  s+=`<text x="${cx+rx(sc(2.8))-4}" y="${cy+ry(sc(2.8))+8}" class="pl s">${t.planets.belt}</text><text x="${cx+rx(sc(44))-30}" y="${cy-ry(sc(44))+4}" class="pl s">${t.planets.kuiper}</text></svg>`;return s}
function shWheel(){const cx=200,cy=150,R0=62,R1=136,n=WHEEL.length,gap=3.2;let s='';
  WHEEL.forEach(([k,ico],i)=>{const a0=(-90-18+i*36+gap/2)*Math.PI/180,a1=(-90-18+(i+1)*36-gap/2)*Math.PI/180;const p=(r,a)=>`${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`;
    const am=(a0+a1)/2,ix=cx+99*Math.cos(am),iy=cy+99*Math.sin(am);
    s+=`<g class="wg2${SHP===k?' on':''}" data-wk="${k}"><path d="M${p(R0,a0)} L${p(R1,a0)} A${R1},${R1} 0 0 1 ${p(R1,a1)} L${p(R0,a1)} A${R0},${R0} 0 0 0 ${p(R0,a0)}Z"/>
      <foreignObject x="${(ix-17).toFixed(1)}" y="${(iy-17).toFixed(1)}" width="34" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="wic">${wi(ico)}</div></foreignObject></g>`});
  return `<div class="wheelw"><img src="img/hull.webp" alt="" class="hull" decoding="async"><svg viewBox="0 0 400 300" class="wheel2">${s}<g class="wc" data-wk="drawer"><circle cx="${cx}" cy="${cy}" r="${R0-8}"/><circle cx="${cx}" cy="${cy}" r="${R0-16}" class="in"/>
     <foreignObject x="${cx-22}" y="${cy-22}" width="44" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="wic big">${wi('grid')}</div></foreignObject></g></svg></div>`}

/* ---------- paneles del menú radial ---------- */
function shHead(ico,title,extra=''){return `<div class="sph"><span class="spi">${wi(ico)}</span><b>${title}</b>${extra}<button class="spx" data-close="1">${wi('back')}</button></div>`}
function shSub(k){const t=SCT();
  if(k==='wx')return shWxPanel();
  if(k==='cal')return shCalPanel();
  if(k==='news')return shNewsPanel();
  if(k==='map')return shMapPanel();
  if(k==='fit')return shFitPanel();
  if(k==='music')return `<div class="hf hp spn" data-f="ship-b">${shHead('music',t.music)}${hMedia().replace(/<div class="hrow"><div class="hf hp hnews"[\s\S]*$/,'')}</div>`;
  if(k==='edit')return shSetPanel();
  return shDefault()}
function shOpen(k){if(k==='drawer'){openDrawer();return}if(k==='jv'){jvOpen(true);return}if(k==='sys'){goPage(0);return}if(k==='apps'){goPage(Math.min(2,pagesCount()-1));return}
  SHP=SHP===k?'':k;const p=$('#shPanel');if(!p)return;p.classList.add('sw');
  setTimeout(()=>{p.innerHTML=SHP?shSub(SHP):shDefault();frames(p);p.classList.remove('sw');$$('.wg2').forEach(g=>g.classList.toggle('on',g.dataset.wk===SHP));
    if(SHP==='wx')shWxLoad();if(SHP==='fit'&&has('stepsAsync'))Android.stepsAsync();if(SHP==='news'&&!feedItems().length&&NATIVE)loadFeed(false);if(SHP==='map')shCompass(true);else shCompass(false);if(SHP==='edit')shHueBind();hudFit()},140)}
$('#pager').addEventListener('click',e=>{if(!SHIPON())return;const w=e.target.closest('[data-wk]');if(w){e.stopPropagation();hap('tick');shOpen(w.dataset.wk);return}
  const c=e.target.closest('[data-close]');if(c){e.stopPropagation();hap('tick');shOpen(SHP);return}
  const sx=e.target.closest('[data-sx]');if(sx){e.stopPropagation();hap('tick');shAct(sx.dataset.sx,sx);return}},true);

/* clima por hora y 3 días */
let SHWX=null,SHWM='h';
async function shWxLoad(force){if(!S.wxLoc){return}const k=S.wxLoc.lat+','+S.wxLoc.lon+S.unit;if(!force&&SHWX&&SHWX.k===k&&Date.now()-SHWX.t<30*60e3){shWxDraw();return}
  try{const {lat,lon}=S.wxLoc;const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,cloud_cover&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=4&timezone=auto${S.unit==='F'?'&temperature_unit=fahrenheit':''}`);
    const j=await r.json();const now=Date.now();const hi=j.hourly.time.findIndex(x=>new Date(x).getTime()>=now-36e5);
    SHWX={k,t:now,c:j.current,h:j.hourly.time.slice(hi,hi+12).map((x,i)=>({t:x,v:Math.round(j.hourly.temperature_2m[hi+i]),c:j.hourly.weather_code[hi+i],p:j.hourly.precipitation_probability[hi+i]})),
      d:j.daily.time.slice(1,4).map((x,i)=>({t:x,mx:Math.round(j.daily.temperature_2m_max[i+1]),mn:Math.round(j.daily.temperature_2m_min[i+1]),c:j.daily.weather_code[i+1]})),uv:j.daily.uv_index_max[0]}}catch(e){}
  shWxDraw()}
function shWxDraw(){const b=$('#shWxB');if(b)b.innerHTML=shWxBody()}
function shWxPanel(){const t=SCT();return `<div class="hf hp spn" data-f="ship-b">${shHead(SHWM==='h'?'wx':'cal',SHWM==='h'?t.wxH:t.wx3,`<button class="spt" data-sx="wxmode">${wi('fwd')}</button>`)}<div id="shWxB">${shWxBody()}</div></div>`}
function shWxBody(){const t=SCT(),T=T0(),X=SHWX;if(!S.wxLoc)return `<p class="spe" data-sx="loc">${t.noLoc}</p>`;if(!X)return `<p class="spe">…</p>`;
  let chart;if(SHWM==='h'){const vs=X.h.map(x=>x.v),mx=Math.max(...vs),mn=Math.min(...vs),rg=Math.max(1,mx-mn);
    chart=`<div class="bars">${X.h.map(x=>`<div class="bc"><b>${x.v}</b><i style="height:${30+(x.v-mn)/rg*60}%"></i><span class="cl">${WXE[wcat(x.c)]}</span><small>${esc(fmt(new Date(x.t),{hour:'numeric'}))}</small></div>`).join('')}</div>`}
  else chart=`<div class="bars d3">${X.d.map(x=>`<div class="bc"><b>${x.mx}°/${x.mn}°</b><i style="height:${40+Math.max(0,x.mx)*1.6}%"></i><span class="cl">${WXE[wcat(x.c)]}</span><small>${esc(fmt(new Date(x.t+'T12:00'),{weekday:'short',day:'numeric'}).toUpperCase())}</small></div>`).join('')}</div>`;
  const c=X.c||{};return `${chart}<div class="wxs"><div class="hf wxl" data-f="plain"><small>${esc((S.wxLoc.name||'').toUpperCase())}</small><b>${Math.round(c.temperature_2m)}°${S.unit}</b><small>${esc(cap(T.wx[wcat(c.weather_code)]||''))}</small></div>
    <div class="wxd">//${t.hum}: ${c.relative_humidity_2m??'—'}%<br>//${t.wind}: ${Math.round(c.wind_speed_10m??0)} km/h · ${c.wind_direction_10m??'—'}°<br>//${t.press}: ${Math.round(c.pressure_msl??0)} mbar<br>//${t.station}: ${esc(S.wxLoc.name||'')}</div>
    <div class="uvr"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" class="g0"/><circle cx="20" cy="20" r="16" class="g1" stroke-dasharray="${Math.min(11,X.uv||0)/11*100} 101"/></svg><b>${Math.round(X.uv||0)}</b><small>${t.uv}</small></div></div>`}
const T0=()=>T();

/* calendario + sol y luna */
let SHCM=null;
function shCalPanel(){const t=SCT(),now=new Date();if(!SHCM)SHCM=new Date(now.getFullYear(),now.getMonth(),1);const y=SHCM.getFullYear(),m=SHCM.getMonth();
  const first=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate(),ev=new Set(upcoming().map(x=>x.d));const W=Array.from({length:7},(_,i)=>fmt(new Date(2024,0,1+i),{weekday:'short'}).slice(0,3).toUpperCase());
  let g='';for(let i=0;i<first;i++)g+='<span class="cd o"></span>';for(let d=1;d<=days;d++){const ds=ymd(new Date(y,m,d));g+=`<span class="cd${ds===ymd(now)?' td':''}${ev.has(ds)?' ev':''}">${d}</span>`}
  const L=S.wxLoc||{lat:4.71,lon:-74.07},sun=AST.sun(now,L.lat,L.lon),mo=AST.moon(now.getTime()),hm=d=>fmt(d,{hour:'2-digit',minute:'2-digit'});
  return `<div class="hf hp spn" data-f="ship-b"><div class="sph"><button class="spt" data-sx="calp">${wi('back')}</button><b>${esc(fmt(SHCM,{month:'long',year:'numeric'}).toUpperCase())}</b><button class="spt" data-sx="caln">${wi('fwd')}</button><button class="spx" data-close="1">✕</button></div>
    <div class="cgrid">${W.map(x=>`<span class="cw">${x}</span>`).join('')}${g}</div><button class="agd" data-sx="agenda">${t.agenda}</button></div>
    <div class="calx"><div class="dring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" class="g0"/><circle cx="20" cy="20" r="16" class="g1" stroke-dasharray="${now.getDate()/days*100} 101"/></svg><b>${now.getDate()}</b></div>
      <div class="wxd">${esc(hm(now))}<br>//${t.moon}: ${esc(t.phases[mo.ph])}<br>//${t.illum}: ${mo.ill}%<br>//${t.sunrise}: ${esc(hm(sun.rise))} · ${t.sunset}: ${esc(hm(sun.set))}<br>//${t.zodiac}: ${esc(t.zod[AST.zodiac(now)])}<br>//${t.season}: ${esc(t.seasons[AST.season(now,L.lat)])}</div></div>`}

/* noticias */
let SHNI=0;
function shNewsPanel(){const t=SCT(),it=feedItems();if(!it.length)return `<div class="hf hp spn" data-f="ship-b">${shHead('news',t.news)}<p class="spe" data-sx="feed">${esc(H().noNews)}</p></div>`;
  SHNI=(SHNI+it.length)%it.length;const x=it[SHNI];
  return `<div class="hf hp spn" data-f="ship-b">${shHead('news',t.news+' · '+esc((x.s||'').toUpperCase().slice(0,18)),`<span class="ntm">${esc(relT(x.d||Date.now()))}</span>`)}
    <b class="nt2" data-sx="open" data-u="${esc(x.l)}">${esc(x.t)}</b><button class="nhero" data-sx="open" data-u="${esc(x.l)}" ${x.img?`style="background-image:url('${esc(x.img)}')"`:''}></button>
    <div class="nnav"><button data-sx="nprev">${wi('back')}</button><b>${pad(SHNI+1)} / ${pad(it.length)}</b><button data-sx="nnext">${wi('fwd')}</button><button data-sx="feed">${t.news} ▸</button></div></div>`}

/* navegación: brújula + mapa */
let SHCP=false,SHHD=0,SHCR=0;
function shMapPanel(){const t=SCT(),L=S.wxLoc;
  const ticks=Array.from({length:72},(_,i)=>`<line x1="100" y1="12" x2="100" y2="${i%6?18:24}" transform="rotate(${i*5} 100 100)"/>`).join('');
  const lab=['N','NE','E','SE','S','SO','O','NO'].map((x,i)=>`<text x="100" y="40" transform="rotate(${i*45} 100 100)">${x}</text>`).join('');
  return `<div class="hf hp spn mapn" data-f="ship-b">${shHead('map',t.map)}<div class="cmp"><svg viewBox="0 0 200 200" class="rose" id="shRose"><circle cx="100" cy="100" r="92" class="c0"/>${ticks}${lab}<circle cx="100" cy="100" r="58" class="c1"/></svg>
      <svg viewBox="0 0 200 200" class="needle"><path d="M100 46 L108 100 L100 92 L92 100Z" class="n1"/><path d="M100 154 L108 100 L100 108 L92 100Z" class="n2"/><circle cx="100" cy="100" r="5"/></svg><b class="hdg" id="shHdg">—°</b></div>
    <div class="wxd">//${t.heading}: <span id="shHdg2">—</span><br>//${H().lat}: ${L?L.lat.toFixed(4):'—'}<br>//${H().lon}: ${L?L.lon.toFixed(4):'—'}<br>//${esc((L&&L.name||'').toUpperCase())}</div>
    <div class="mapw">${hMap(true).replace(/<span class="hl tl">[^<]*<\/span>/,'').replace(/<small class="sid">[\s\S]*<\/small>/,'')}</div><button class="agd" data-sx="maps">${t.openMaps}</button></div>`}
function shOri(e){let h=e.webkitCompassHeading!=null?e.webkitCompassHeading:(e.absolute||e.type==='deviceorientationabsolute')&&e.alpha!=null?360-e.alpha:null;if(h==null)return;SHHD=h;if(!SHCR)SHCR=requestAnimationFrame(()=>{SHCR=0;const r=$('#shRose');if(!r){return}r.style.transform=`rotate(${-SHHD}deg)`;const v=Math.round(SHHD)%360+'°';$('#shHdg').textContent=v;$('#shHdg2').textContent=v+' '+['N','NE','E','SE','S','SO','O','NO'][Math.round(SHHD/45)%8]})}
function shCompass(on){const ev='ondeviceorientationabsolute' in window?'deviceorientationabsolute':'deviceorientation';if(on&&!SHCP){window.addEventListener(ev,shOri);SHCP=true}else if(!on&&SHCP){window.removeEventListener(ev,shOri);SHCP=false}}

/* datos físicos: pasos del sensor del sistema */
let SHST=null;
window.onSteps=v=>{SHST=v;if(v>=0){const td=ymd(new Date());S.stepBase=S.stepBase||{};S.stepHist=S.stepHist||{};let b=S.stepBase;
    if(b.d!==td||v<b.c){if(b.d===td&&v<b.c){b.c=v-(S.stepHist[td]||0)}else b={d:td,c:v}}S.stepBase=b;S.stepHist[td]=Math.max(0,v-b.c);
    const ks=Object.keys(S.stepHist).sort();while(ks.length>7)delete S.stepHist[ks.shift()];save()}
  if(SHP==='fit'){const p=$('#shPanel');if(p){p.innerHTML=shFitPanel();frames(p)}}};
function shFitPanel(){const t=SCT();let body;
  if(SHST===-2)body=`<p class="spe" data-sx="perm">${t.noAct}</p>`;else if(SHST===-1)body=`<p class="spe">${t.noSensor}</p>`;
  else{const H5=[4,3,2,1,0].map(k=>{const d=new Date(Date.now()-k*864e5),key=ymd(d);return{l:k?fmt(d,{day:'2-digit',month:'short'}).toUpperCase():t.today,v:(S.stepHist||{})[key]||0}});const mx=Math.max(1000,...H5.map(x=>x.v));
    const td=H5[4].v;body=`<div class="bars fitb">${H5.map(x=>`<div class="bc"><b>${x.v}</b><i style="height:${8+x.v/mx*82}%"></i><small>${esc(x.l)}</small></div>`).join('')}</div>
      <div class="ekg"><svg viewBox="0 0 300 40"><path d="M0 20h40l6-10 6 22 6-30 6 26 6-8h40l6-10 6 22 6-30 6 26 6-8h40l6-10 6 22 6-30 6 26 6-8h44"/></svg><small>${t.ekg}</small></div>
      <div class="wxd">//${t.steps} ${t.today}: ${td}<br>//${t.distance}: ${(td*.75/1000).toFixed(2)} km<br>//${t.kcal}: ${Math.round(td*.04)}</div>`}
  return `<div class="hf hp spn" data-f="ship-b">${shHead('fit',t.fit)}${body}</div>`}

/* espectro de color (anillo de hexágonos) + accesos */
function shSetPanel(){const t=SCT();let hx='';const N=24;for(let i=0;i<N;i++){const a=i/N*2*Math.PI-Math.PI/2,x=110+82*Math.cos(a),y=110+82*Math.sin(a),h=Math.round(i/N*360);
    hx+=`<path d="${hexP(x,y,13)}" fill="hsl(${h} 95% 55%)" class="hx${Math.abs(((S.shipHue??28)-h+540)%360-180)<8?' on':''}" data-hue="${h}"/>`}
  for(let i=0;i<12;i++){const a=i/12*2*Math.PI-Math.PI/2,x=110+50*Math.cos(a),y=110+50*Math.sin(a),h=Math.round(i/12*360+15);hx+=`<path d="${hexP(x,y,10)}" fill="hsl(${h} 70% 42%)" class="hx" data-hue="${h}"/>`}
  return `<div class="hf hp spn" data-f="ship-b">${shHead('edit',t.set)}<div class="hue"><svg viewBox="0 0 220 220" id="shHue"><circle cx="110" cy="110" r="104" class="hr"/>${hx}<circle cx="110" cy="110" r="26" class="hc"/><text x="110" y="114" class="ht2">${S.shipHue??28}°</text></svg></div>
    <div class="sbtn"><button data-sx="style">${t.style}</button><button data-sx="perm">${t.perms}</button><button data-sx="more">${t.more}</button></div></div>`}
function hexP(x,y,r){let p='';for(let i=0;i<6;i++){const a=Math.PI/3*i+Math.PI/6;p+=(i?'L':'M')+(x+r*Math.cos(a)).toFixed(1)+','+(y+r*Math.sin(a)).toFixed(1)}return p+'Z'}
function shHueBind(){const s=$('#shHue');if(!s)return;s.onclick=e=>{const h=e.target.closest('[data-hue]');if(!h)return;hap('tick');S.shipHue=+h.dataset.hue;save();shipColors();$$('#shHue .hx').forEach(x=>x.classList.toggle('on',x===h));s.querySelector('.ht2').textContent=S.shipHue+'°';frames(document)}}
async function shAct(a,el){const p=$('#shPanel');
  if(a==='wxmode'){SHWM=SHWM==='h'?'d':'h';p.innerHTML=shWxPanel();frames(p)}
  else if(a==='loc')citySheet();
  else if(a==='calp'||a==='caln'){SHCM=new Date(SHCM.getFullYear(),SHCM.getMonth()+(a==='caln'?1:-1),1);p.innerHTML=shCalPanel();frames(p)}
  else if(a==='agenda')jvOpen(false,S.lang==='en'?'What do I have this week?':'¿Qué tengo esta semana?');
  else if(a==='nprev'||a==='nnext'){SHNI+=a==='nnext'?1:-1;p.innerHTML=shNewsPanel();frames(p)}
  else if(a==='feed'){feedItems().length?openFeed():loadFeed(true)}
  else if(a==='open'){if(has('openArticle'))Android.openArticle(el.dataset.u,getComputedStyle(document.body).getPropertyValue('--fr').trim()||'#FF8A1E')}
  else if(a==='maps')launch('maps');
  else if(a==='perm')permSheet();else if(a==='more')moreSettings();else if(a==='style')homeSettings();
  else if(a==='wifi'){has('openNetSettings')&&Android.openNetSettings()}
  else if(a==='torch'){if(has('setTorch')){const on=!(has('getTorch')&&Android.getTorch());Android.setTorch(on);el.classList.toggle('on',on)}}
  else if(a==='gear'){has('openSettings')&&Android.openSettings()}
  else if(a==='bell'){has('openNotifications')&&Android.openNotifications()}
  else if(a==='bat'){has('openPanel')&&Android.openPanel('battery')}
  else if(a==='hue'){goPage(1);setTimeout(()=>shOpen('edit'),400)}}

/* ---------- página de sistema (placa de circuitos) ---------- */
function batHist(n){const H0=S.batHist||{},now=new Date();return Array.from({length:n},(_,i)=>{const d=new Date(now.getTime()-(n-1-i)*36e5);return H0[ymd(d)+'T'+pad(d.getHours())]??null})}
function batRecord(){if(DI.bat==null)return;const d=new Date(),k=ymd(d)+'T'+pad(d.getHours());S.batHist=S.batHist||{};if(S.batHist[k]===DI.bat)return;S.batHist[k]=DI.bat;const ks=Object.keys(S.batHist).sort();while(ks.length>30)delete S.batHist[ks.shift()];save()}
function shSys(){const t=SCT();return `<div class="hrow sysw"><div class="hf hp syslog" data-f="ship-b"><img src="img/circuit.webp" alt="" class="circ" decoding="async"><pre id="shLog">${shLog()}</pre>
     <div class="dia">${[['wifi','wifi'],['torch','torch'],['gear','gear'],['bell','bell'],['bat','bat']].map(([k,i])=>`<button data-sx="${k}" class="dm">${wi(i)}</button>`).join('')}</div>
     <div class="lft">${[['hue','hex'],['bat','bat'],['gear','gear']].map(([k,i])=>`<button data-sx="${k}">${wi(i)}</button>`).join('')}</div></div></div>
   <div class="hrow"><div class="hf hp hbs" data-f="ship-b"><b class="hct">${t.hourlyBat}</b><div class="hbc" id="shHb">${shHourBars()}</div><small class="hax">${t.hoursAgo}</small></div></div>
   <div class="hrow"><div class="hf hp scanp" data-f="ship-t"><b class="syt">${t.system}</b><img src="img/cruiser.webp" alt="" class="crz" decoding="async"><span class="scanl v"></span><b class="dsc">${t.scan}</b></div></div>`}
function shHourBars(){const h=batHist(9);return h.map((v,i)=>`<div class="hb"><i style="height:${v==null?2:v}%"></i><b style="bottom:calc(${v==null?2:v}% + 2px)">${v??'—'}</b><small>${i===8?(S.lang==='en'?'NOW':'AHORA'):(8-i)+'h'}</small></div>`).join('')}
function shLog(){const t=SCT(),n=DI.n||{},L=S.wxLoc||{lat:4.71,lon:-74.07},now=new Date(),sun=AST.sun(now,L.lat,L.lon),mo=AST.moon(now.getTime()),hm=d=>fmt(d,{hour:'2-digit',minute:'2-digit'});
  let al='';try{const v=has('nextAlarm')?Android.nextAlarm():'';if(v)al=fmt(new Date(+v),{weekday:'short',hour:'2-digit',minute:'2-digit'})}catch(e){}
  const L2=[[t.model,n.model||'—'],[t.android,n.android||'—'],[t.cpu,(n.soc||'—')],[t.cores,n.cores||'—'],[t.launcher,'AURA · NAVE'],[t.procs,installed().length],[t.nextAlarm,al||'—'],
    [t.sunrise,hm(sun.rise)],[t.sunset,hm(sun.set)],[t.moon,t.phases[mo.ph]],[t.illum,mo.ill+'%'],[t.batT,DI.temp!=null?DI.temp+'°C':'—'],[t.power,(DI.bat??'—')+'%'],[t.volt,DI.volt||'—'],
    [t.ram,n.ramAvail?mbs(n.ramAvail):'—'],[t.sto,n.stoFree?gbs(n.stoFree):'—']];
  return L2.map(([k,v])=>'//'+esc(k)+': '+esc(String(v).toUpperCase())).join('\n')}

/* ---------- integración con el HUD ---------- */
function shPanels(v){if(v.k==='sys')return shSys();if(v.k==='ship')return shMain();if(v.k==='apps')return `<div class="hrow apph"><span class="gear"></span><b class="appb">${SCT().apps} · ${v.pi+1}</b><span class="gear"></span></div>`;return ''}
function shBottom(){const el=$('#hudBot');if(!el)return;el.innerHTML=`<div class="shdock">${S.dock.slice(0,5).map((id,k)=>{const p=id.replace(/^p:/,'');const nm=p.startsWith('f:')?'':labelOf(p);
    return `<button class="sdk" data-dk="${esc(id)}">${NATIVE&&!p.startsWith('w:')&&!p.startsWith('f:')?`<img src="${appIconUrl(p)}" alt="" decoding="async">`:`<span class="g">${ic((APPS[p.replace('w:','')]||{}).i)}</span>`}<small>${esc((nm||'').toUpperCase().slice(0,9))}</small></button>`}).join('')}</div>`}
$('#hudBot').addEventListener('click',e=>{const b=e.target.closest('[data-dk]');if(!b||!SHIPON())return;e.stopPropagation();hap();launch(b.dataset.dk,b)},true);
function shUpdate(){if(!SHIPON())return;shTopUpd();const m=$('#shMet');if(m){const h=shMet();if(m._h!==h){m._h=h;m.innerHTML=h}}const g=$('#shG');if(g)g.setAttribute('stroke-dasharray',`${HD.cpu>0?HD.cpu:0} 101`);
  const lg=$('#shLog');if(lg){const h=shLog();if(lg._h!==h){lg._h=h;lg.textContent='';lg.innerHTML=h}}const hb=$('#shHb');if(hb)hb.innerHTML=shHourBars();const mb=$('#shMb');if(mb)mb.innerHTML=shMiniBars();
  const anom=Math.max(0,HD.notif)+Math.max(0,HD.calls);const m2=$('#shMk2'),m3=$('#shMk3');if(m2)m2.style.display=anom>0?'':'none';if(m3)m3.style.display=anom>3?'':'none';batRecord()}
