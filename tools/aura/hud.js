/* =====================================================================
   HACKER HUD v2 — una sola pantalla: panel central que cambia + base fija
   (recreado de los temas "Hacker theme for KLWP": Stark / Matrix / Shadow)
   ===================================================================== */
const HUDON=()=>S.skin==='hud';
/* paletas: línea, esquinas gruesas, energía, acento de texto, nombre */
const HUDC={matrix:['#7CFF3A','#F5D9A8','#35E7FF','#FF3B4E','Matrix'],shadow:['#FF4D6D','#B6FF3B','#3BFF7A','#FF4D6D','Shadow'],stark:['#FF8A3D','#FFB36B','#35E7FF','#FF3B6B','Stark'],
  cyan:['#35E7FF','#E8F7FF','#7CFF3A','#FF3B6B','Cyber'],violet:['#B07CFF','#F2D7FF','#35E7FF','#FF3B9A','Nebula']};
const HMAP='__MAP__';
const MONTHS=()=>Array.from({length:12},(_,i)=>fmt(new Date(2024,i,1),{month:'long'}));
const WDAYS=()=>Array.from({length:7},(_,i)=>fmt(new Date(2024,0,7+i),{weekday:'long'}));
const HT={es:{cov:'COBERTURA GLOBAL',radar:'SISTEMA RADAR',power:'ENERGÍA',diag:'DIAGNÓSTICO DEL SISTEMA',diagS:'Para ver tus aplicaciones toca el botón LOGIN (Información clasificada)',pa:'ANÁLISIS DE ENERGÍA',ma:'ANÁLISIS DE MEMORIA',
    cpu:'CPU en uso',freq:'Frecuencia CPU en MHz',temp:'Temperatura batería',life:'Autonomía',ramU:'Memoria usada',stoT:'Almacenamiento total',date:'Día | Mes | Año',ramF:'Memoria libre',stoF:'Almacenamiento libre',ramT:'Memoria total',
    access:'ACCESS',login:'LOGIN',online:'ONLINE',media:'Sistema multimedia',classI:'Información clasificada',sysT:'SYSTEM INFORMATION',
    sysS:'Toca el avatar para hablar con J.A.R.V.I.S. · mantenlo para la cámara.',wifi:'Conexión Wi-Fi',mob:'Datos móviles',none:'Sin conexión',
    secured:'APPS SEGURAS',files:'APPS',classified:'CLASSIFIED',search:'BUSCAR APPS',notif:'NOTIFICACIÓN',notifS:'Toca el núcleo animado para activar a J.A.R.V.I.S.',ringer:'SISTEMA',cpuU:'CPU USADA',
    upd:'ACTUALIZADO',total:'TOTAL NOTICIAS',back:'ATRÁS',next:'SIGUIENTE',news:'NOTICIAS',noNews:'Toca NOTICIAS para cargar los titulares.',player:'REPRODUCTOR',vol:'VOLUMEN',nothing:'SIN REPRODUCCIÓN',
    boot:'CARGANDO',done:'COMPLETO',granted:'ACCESO CONCEDIDO',hum:'Viento',rain:'Lluvia',lon:'Longitud',lat:'Latitud',stark:'STARK INDUSTRIES',
    settings:'SETTINGS',desc:'DESCRIPCIÓN',descS:'El color de las luces del sistema. Toca ELEMENTS o el núcleo para cambiarlo.',walls:'FONDOS',wallsS:'Fondos integrados: toca uno para aplicarlo o abre la galería protegida para usar tu foto.',
    gallery:'GALERÍA PROTEGIDA',effects:'EFECTOS',status:'ESTADO',shadow:'LUZ Y SOMBRA',bootA:'ARRANQUE',saver:'AHORRO',perms:'PERMISOS',more:'MÁS AJUSTES',missed:'PERDIDAS',sms:'SMS',net:'INTERNET',
    hour:'hora',min:'min',sec:'seg',noAcc:'sin acceso',permT:'Centro de permisos',permS:'Concede los permisos para que todo el tema funcione con datos reales.',grantAll:'Conceder todos',
    pLoc:'Ubicación',pLocS:'Clima, mapa con radar y nombre del Wi-Fi',pCal:'Calendario',pCalS:'Eventos en el calendario y en J.A.R.V.I.S.',pMic:'Micrófono',pMicS:'Hablar con J.A.R.V.I.S.',pCon:'Contactos',pConS:'Llamar y escribir por voz',
    pPh:'Teléfono',pPhS:'J.A.R.V.I.S. puede llamar',pLog:'Registro de llamadas',pLogS:'Contador de llamadas perdidas',pSms:'SMS',pSmsS:'Contador de mensajes sin leer',pNot:'Acceso a notificaciones',pNotS:'Contador de notificaciones y música',
    pHome:'App de inicio',pHomeS:'Que Aura se abra con el botón de inicio',pGes:'Gestos de navegación',pGesS:'Gestos en HyperOS con este launcher',open:'Abrir'},
  en:{cov:'GLOBAL COVERAGE',radar:'RADAR SYSTEM',power:'POWER',diag:'DATABASE DEFRAGMENTATION',diagS:'To access applications page, touch the Classified Information button',pa:'POWER DATA ANALYSIS',ma:'MEMORY DATA ANALYSIS',
    cpu:'Current CPU in %',freq:'CPU frequency in MHz',temp:'Battery temperature',life:'Battery life',ramU:'Used memory in Mb',stoT:'Total internal space',date:'Day | Month | Year',ramF:'Free memory in Mb',stoF:'Free internal space',ramT:'Total memory in Mb',
    access:'ACCESS',login:'LOGIN',online:'ONLINE',media:'Media System',classI:'Classified Information',sysT:'SYSTEM INFORMATION',
    sysS:'Touch the avatar to talk to J.A.R.V.I.S. · hold it for the camera.',wifi:'Wi-Fi connection',mob:'Mobile data',none:'Offline',
    secured:'SECURED APPS',files:'APPS',classified:'CLASSIFIED',search:'SEARCH APPS',notif:'NOTIFICATION',notifS:'Touch the animated core to wake J.A.R.V.I.S.',ringer:'SYSTEM',cpuU:'CPU USED',
    upd:'UPDATED',total:'TOTAL NEWS',back:'BACK',next:'NEXT',news:'NEWS',noNews:'Touch NEWS to load headlines.',player:'PLAYER',vol:'VOLUME',nothing:'NOTHING PLAYING',
    boot:'LOADING',done:'COMPLETE',granted:'ACCESS GRANTED',hum:'Wind',rain:'Rain',lon:'Longitude',lat:'Latitude',stark:'STARK INDUSTRIES',
    settings:'SETTINGS',desc:'DESCRIPTION',descS:'The color of the system lights. Touch ELEMENTS or the core to change it.',walls:'WALLPAPERS',wallsS:'Built-in wallpapers: touch one to apply it or open the protected gallery to use your photo.',
    gallery:'PROTECTED GALLERY',effects:'EFFECTS',status:'STATUS',shadow:'LIGHT SHADOW',bootA:'BOOT',saver:'SAVER',perms:'PERMISSIONS',more:'MORE SETTINGS',missed:'MISSED CALLS',sms:'SMS',net:'INTERNET',
    hour:'hour',min:'min',sec:'sec',noAcc:'no access',permT:'Permission center',permS:'Grant permissions so the whole theme works with real data.',grantAll:'Grant all',
    pLoc:'Location',pLocS:'Weather, radar map and Wi-Fi name',pCal:'Calendar',pCalS:'Calendar events and J.A.R.V.I.S.',pMic:'Microphone',pMicS:'Talk to J.A.R.V.I.S.',pCon:'Contacts',pConS:'Call and text by voice',
    pPh:'Phone',pPhS:'J.A.R.V.I.S. can call',pLog:'Call log',pLogS:'Missed calls counter',pSms:'SMS',pSmsS:'Unread messages counter',pNot:'Notification access',pNotS:'Notification counter and music',
    pHome:'Home app',pHomeS:'Open Aura with the home button',pGes:'Navigation gestures',pGesS:'Gestures on HyperOS with this launcher',open:'Open'}};
const H=()=>HT[S.lang]||(S.lang==='pt'?HT.es:HT.en);
function hudColors(){const c=HUDC[S.hudc]||HUDC.matrix;const R=document.body.style;R.setProperty('--fr',c[0]);R.setProperty('--fr2',c[1]);R.setProperty('--tl',c[2]);R.setProperty('--pk',c[3]);
  document.body.classList.toggle('noshadow',S.shadow===false)}
/* páginas virtuales del HUD */
function VP(){if(!HUDON())return S.pages.map((_,i)=>({k:'apps',pi:i}));const v=[{k:'main',pi:-1},{k:'class',pi:0},{k:'media',pi:-1},{k:'set',pi:-1}];for(let i=1;i<S.pages.length;i++)v.push({k:'apps',pi:i});return v}
const vIdx=k=>VP().findIndex(v=>v.k===k);

/* ---------- marcos con esquinas cortadas (SVG a la medida) ---------- */
const FRO=typeof ResizeObserver!=='undefined'?new ResizeObserver(es=>es.forEach(e=>drawFrame(e.target))):null;
function drawFrame(el){const w=el.offsetWidth,h=el.offsetHeight;if(!w||!h)return;if(el._fw===w&&el._fh===h)return;el._fw=w;el._fh=h;
  const f=el.dataset.f||'plain',c=14,t=f.includes('tab')?10:0,b=f.includes('bot')?10:0,x1=w*.28,x2=w*.72,y0=t,y1=h-b;
  let p=`M${c},${y0}`;if(t)p+=`L${x1},${y0}L${x1+t},0L${x2-t},0L${x2},${y0}`;p+=`L${w-c},${y0}L${w},${y0+c}L${w},${y1-c}L${w-c},${y1}`;
  if(b)p+=`L${x2},${y1}L${x2-b},${h}L${x1+b},${h}L${x1},${y1}`;p+=`L${c},${y1}L0,${y1-c}L0,${y0+c}Z`;
  const acc=`M4,${y0+c+22}L4,${y0+c+4}L${c+4},${y0+4}L${c+40},${y0+4}M${w-4},${y1-c-22}L${w-4},${y1-c-4}L${w-c-4},${y1-4}L${w-c-40},${y1-4}`;
  const L2=Math.min(80,h*.35);
  const thick=`M0,${y0+c+L2}L0,${y0+c}L${c},${y0}L${Math.min(c+70,x1)},${y0}M0,${y1-c-L2*.8}L0,${y1-c}L${c},${y1}M${w},${y1-c-L2*.6}L${w},${y1-c}L${w-c},${y1}L${w-c-60},${y1}`;
  const dots=(t?`<circle cx="${x1}" cy="${y0}" r="2.6"/><circle cx="${x2}" cy="${y0}" r="2.6"/>`:'')+(b?`<circle cx="${x1}" cy="${y1}" r="2.6"/><circle cx="${x2}" cy="${y1}" r="2.6"/>`:'')+`<circle cx="${c+48}" cy="${y0+4}" r="1.8"/>`;
  const ticks=f.includes('side')?`<path d="M${w+5},${h*.42}h6M${w+5},${h*.42+7}h6M${w+5},${h*.42+14}h6" class="tk"/>`:'';
  let s=el.querySelector(':scope>svg.fr');if(!s){s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('class','fr');el.prepend(s)}
  s.setAttribute('viewBox',`-2 -2 ${w+16} ${h+4}`);s.style.width=(w+16)+'px';s.style.height=(h+4)+'px';
  s.innerHTML=`<path d="${p}" class="bd"/><path d="${p}" class="gl"/><path d="${p}" class="ln"/><path d="${thick}" class="th"/><path d="${acc}" class="ac"/>${ticks}<g class="dt">${dots}</g>`}
function frames(root){(root||document).querySelectorAll('.hf').forEach(el=>{drawFrame(el);if(FRO&&!el._ob){el._ob=1;FRO.observe(el)}})}

/* ---------- datos vivos ---------- */
const HD={cpu:null,freq:null,notif:-1,calls:-1,sms:-1,net:{type:navigator.onLine?'other':'none',ssid:''}};
function sampleCPU(){if(!NATIVE)return;try{if(has('cpuLoad'))HD.cpu=Android.cpuLoad();if(has('cpuFreq'))HD.freq=Android.cpuFreq()}catch(e){}}
function sampleComm(){if(!NATIVE)return;try{if(has('notifCount'))HD.notif=Android.notifCount();if(has('missedCalls'))HD.calls=Android.missedCalls();if(has('unreadSms'))HD.sms=Android.unreadSms();if(has('netInfo'))HD.net=JSON.parse(Android.netInfo())}catch(e){}}
window.onNotif=n=>{HD.notif=n;hudCard()};
['online','offline'].forEach(v=>window.addEventListener(v,()=>{sampleComm();hudCard()}));
const mbs=b=>b==null?'—':Math.round(b/1048576)+' MB';
const gbs=b=>b==null?'—':(b/1073741824).toFixed(1)+' GB';

/* ---------- MAIN ---------- */
function hMap(mini){const h=H(),w=S.wx,L0=S.wxLoc;const mk=L0?`<g class="pin" transform="translate(${(L0.lon+180).toFixed(1)},${(84-L0.lat).toFixed(1)})"><circle r="9" class="p1"/><circle r="5" class="p2"/><circle r="2.2" class="p3"/><path d="M-12,0h7M5,0h7M0,-12v7M0,5v7"/></g>`:'';
  const map=`<svg class="wmap" viewBox="0 6 360 120" preserveAspectRatio="xMidYMid meet"><path d="${HMAP}"/>${mk}</svg>`;
  if(mini)return `<span class="hl tl">${h.cov}</span>${map}<small class="sid">GEO-SYNC<br>&gt;&gt; ${h.lon}: ${L0?L0.lon.toFixed(3):'—'}<br>&gt;&gt; ${h.lat}: ${L0?L0.lat.toFixed(3):'—'}</small>`;
  return `<button class="hf hp hmap" data-f="tab" data-w="wx"><span class="hl tl">${h.cov}</span><span class="hl tr2"><b class="xx">●</b> ${esc(fmt(new Date(),{hour:'2-digit',minute:'2-digit'}))}</span>
    <div class="hmc"><div class="hwx"><b class="ht">${w?w.temp+'°'+S.unit:'—'}</b><span class="hi">${w?WXE[wcat(w.code)]:'◌'}</span>
      <small>${h.hum} <em>${w&&w.wind!=null?w.wind+' km/h':'—'}</em></small><i class="bar"><u style="width:${w&&w.wind!=null?Math.min(100,w.wind*3):0}%"></u></i>
      <small>${h.rain} <em>${w?(w.rain??0)+'%':'—'}</em></small><i class="bar"><u style="width:${w?(w.rain??0):0}%"></u></i>
      <small class="sid">GEO-SYNC ${esc((L0&&L0.name||'—').toUpperCase())}<br>&gt;&gt; ${h.lon}: ${L0?L0.lon.toFixed(4):'—'}<br>&gt;&gt; ${h.lat}: ${L0?L0.lat.toFixed(4):'—'}</small></div>
    ${map}<div class="hside"><i></i><i></i><i></i><small>${h.radar}</small></div></div>
    <div class="comp"><i></i><span>|</span><span>·</span><span>|</span><b>N</b><span>|</span><span>·</span><span>|</span><i></i></div></button>`}
function hMain(){const h=H(),caps=Array.from({length:9},(_,i)=>`<i data-i="${i}"></i>`).join('');
  return `<div class="hrow" id="hMapRow">${hMap()}</div>
  <div class="hrow"><div class="hf hp hpow" data-f="tab side"><span class="lightfx"></span>
    <div class="hh"><span class="haz"></span><span class="hl"><b class="pkc">∞</b> ${h.power}</span><span class="hl r" id="hPct">—%</span></div>
    <button class="caps" data-w="bat"><span class="plug">⊂▸</span><span class="cc" id="hCaps">${caps}</span><span class="plug">◂⊃</span></button>
    <div class="hbar"><span class="bt" id="hBt">—%</span><span class="line"></span><span class="sym">▬ ⋕ ▲ ✚</span><span class="dis" id="hDis">—</span></div>
    <div class="dat" id="hDat">${hDataRows()}</div><span class="stark">${h.stark}</span></div></div>`}
function hDataRows(){const h=H(),n=DI.n||{},d=new Date();const row=(k,v,c='')=>`<div class="dr ${c}"><span>${k}</span><b>${v}</b></div>`;
  return `<b class="dh">${h.diag}</b><small class="ds">${h.diagS}</small><b class="dh">${h.pa}</b>
  ${row(h.cpu,HD.cpu!=null&&HD.cpu>=0?HD.cpu+'%':'—')}${row(h.freq,HD.freq>0?HD.freq+' MHz':'—')}${row(h.temp,DI.temp!=null?(+DI.temp).toFixed(1)+'°C':'—')}${row(h.life,esc(remain()))}
  <b class="dh">${h.ma}</b><div class="mrows"><i class="sweep"></i>${row(h.ramF,mbs(n.ramAvail))}${row(h.ramU,n.ramTotal?mbs(n.ramTotal-n.ramAvail):'—')}${row(h.stoT,gbs(n.stoTotal))}${row(h.date,pad(d.getDate())+' '+esc(cap(fmt(d,{month:'short'}).replace('.','')))+' '+d.getFullYear(),'pk')}${row(h.ramT,mbs(n.ramTotal))}${row(h.stoF,gbs(n.stoFree))}</div>`}

/* ---------- CLASSIFIED ---------- */
function hClass(){const h=H(),n=installed().length,t=new Date();t.setHours(12,0,0,0);const M=MONTHS(),W=WDAYS();let rows='';
  for(let k=-20;k<=60;k++){const d=new Date(t.getTime()+k*864e5);rows+=`<div class="cr${k===0?' td':''}" data-d="${ymd(d)}"><span>${pad(d.getDate())}</span><span>${esc(W[d.getDay()].toUpperCase())}</span><span>${esc(M[d.getMonth()].toUpperCase())}</span><span>${d.getFullYear()}</span></div>`}
  return `<div class="hrow"><div class="hf hp hcls" data-f="bot"><div class="hh2"><span>▲ ${n} ${h.files}</span><span>🔒 ${h.secured}</span></div>
      <div class="hz"><i></i><u></u><i></i></div><b class="ctit">${h.classified}</b></div></div>
    <div class="hrow"><div class="hf hp hcal" data-f="side"><span class="haz"></span><div class="drum nosw" id="hDrum">${rows}</div><i class="hiband"></i>
      <div class="cfoot"><span class="hl">${h.ringer} · ${esc((DI.n&&DI.n.os)||'ANDROID').toUpperCase()}</span><span class="tri">▼</span><b class="bp" id="hBat2">—% ▮</b></div></div></div>
    <div class="hrow hsrow"><button class="orbx" data-w="jv"><i></i><i></i><i></i><em></em></button>
      <div class="sbx"><button class="gs" data-w="search"><b>${h.search}</b><span class="mic" data-w="mic">●</span></button>
        <small class="hl">${h.notif} <em class="cnt" id="hCnt">${HD.notif>=0?HD.notif:0}</em></small><small class="nt">${h.notifS}</small><small class="hl cpuu">${h.cpuU} <em id="hCpu2">${HD.cpu!=null&&HD.cpu>=0?HD.cpu+'%':'—'}</em></small></div></div>`}
function hudClassTail(){return ''}

/* ---------- MEDIA ---------- */
const reel=`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" class="r1"/><circle cx="20" cy="20" r="11" class="r2"/>${[0,60,120,180,240,300].map(a=>`<circle cx="${(20+12*Math.cos(a*Math.PI/180)).toFixed(2)}" cy="${(20+12*Math.sin(a*Math.PI/180)).toFixed(2)}" r="3.2" class="r3"/>`).join('')}<circle cx="20" cy="20" r="5" class="r4"/></svg>`;
let HNI=0;
function feedItems(){if(typeof FEED!=='undefined'&&FEED[0]&&FEED[0].length)return FEED[0];try{const c=JSON.parse(localStorage.getItem('nf:'+S.lang+':0')||'null');if(c&&c.items){FEED[0]=c.items;return c.items}}catch(e){}return []}
function hMedia(){const h=H(),np=NP;
  return `<div class="hrow"><div class="hf hp hcas${np&&np.playing?' on':''}" data-f="bot" id="hCas"><span class="hl tl" id="hPs">◷ ${np&&np.playing?'PLAY':'STOP'}</span><span class="hl tr2">${h.player}</span>
      <div class="deck"><button class="reel" data-m="prev">${reel}</button><span class="tape"><i></i><i></i><i></i><i></i><i></i></span><span class="tape r"><i></i><i></i><i></i><i></i><i></i></span><button class="reel" data-m="next">${reel}</button></div>
      <button class="ttl" data-m="toggle"><b id="hTr">${esc(np?np.title:h.nothing)}</b><small id="hAr">${esc(np?np.artist:'—')}</small></button>
      <div class="seg" id="hSeg">${'<i></i>'.repeat(18)}</div></div></div>
    <div class="hrow"><div class="hf hp hnews" data-f="tab side" id="hNews">${hNewsIn()}</div></div>`}
function hNewsIn(){const h=H(),it=feedItems();if(!it.length)return `<span class="haz"></span><p class="nn">${h.noNews}</p><div class="nbar"><button data-n="feed" class="mid">${h.news}</button></div>`;
  HNI=Math.max(0,Math.min(HNI,it.length-1));const x=it[HNI];const th=[1,2,3,4].map(k=>it[(HNI+k)%it.length]).map(y=>`<button class="tb" data-u="${esc(y.l)}" ${y.img?`style="background-image:url('${esc(y.img)}')"`:''}>${y.img?'':esc((y.s||'').slice(0,8))}</button>`).join('');
  return `<span class="haz"></span><b class="nh" data-u="${esc(x.l)}">${esc(x.t)}</b><div class="nmid"><span class="upd"><i></i>${h.upd}<br>${esc(relT(x.d||Date.now()))}</span>
    <button class="nim" data-u="${esc(x.l)}" ${x.img?`style="background-image:url('${esc(x.img)}')"`:''}>${x.img?'':'<span>'+esc((x.s||'NEWS').slice(0,14))+'</span>'}</button><b class="num">${pad(HNI+1)}</b></div>
    <small class="tot">${h.total}: ${it.length} · ${esc(x.s||'')}</small><div class="thumbs">${th}</div><div class="nbar"><button data-n="-1">◂ ${h.back}</button><button data-n="feed" class="mid">${h.news}</button><button data-n="1">${h.next} ▸</button></div>`}

/* ---------- SETTINGS ---------- */
const HWALLS=['cyber','holo','prism','aurora'];
function hSet(){const h=H(),c=HUDC[S.hudc]||HUDC.matrix;
  return `<div class="hrow"><div class="hf hp hstit" data-f="bot"><b class="ctit g">${h.settings}</b></div></div>
   <div class="hrow"><div class="hf hp hset" data-f="tab side"><span class="haz"></span>
    <div class="srow"><button class="wheel" data-s="col"><i></i><i></i><em></em></button>
      <div class="sx"><b class="sh">${h.desc}</b><small>${h.descS}</small><div class="elb"><button data-s="colp">◂◂</button><b data-s="col">ELEMENTS · ${esc(c[4].toUpperCase())}</b><button data-s="col">▸▸</button></div></div></div>
    <b class="sh">${h.walls}</b><small class="sd">${h.wallsS}</small>
    <div class="wrow2"><button class="gal" data-s="gal"><b>${h.gallery}</b></button>${HWALLS.map(k=>`<button class="wt${S.wall===k?' on':''}" data-s="wall" data-k="${k}"></button>`).join('')}</div>
    <b class="sh">${h.effects}</b>
    <div class="tgs"><button class="tg${S.hfx!==false?' on':''}" data-s="hfx"><span>${h.status}</span><i></i></button><button class="tg${S.shadow!==false?' on':''}" data-s="shadow"><span>${h.shadow}</span><i></i></button><button class="tg${S.boot!==false?' on':''}" data-s="boot"><span>${h.bootA}</span><i></i></button></div>
    <div class="tgs"><button class="tg${S.saver!==false?' on':''}" data-s="saver"><span>${h.saver}</span><i></i></button><button class="tg${S.hz60?' on':''}" data-s="hz60"><span>60 HZ</span><i></i></button></div>
    <div class="sbtns"><button class="pb sm" data-s="perm"><b>${h.perms}</b><u></u></button><button class="pb sm" data-s="more"><b>${h.more}</b><u></u></button></div>
   </div></div>`}

/* ---------- base fija: botones, tarjeta, reloj ---------- */
let HK='';
function hudBottom(){const el=$('#hudBot');if(!el)return;if(!HUDON()){el.innerHTML='';HK='';return}const h=H(),k=(VP()[S.page|0]||{}).k||'main';HK=k;
  const on1=k==='media',on2=k==='class';
  let card;
  if(k==='class')card=`<button class="hf hp hcard mapc" data-f="tab" data-w="wx">${hMap(true)}</button>`;
  else if(k==='media')card=`<div class="hf hp hcard volc" data-f="tab"><span class="hl tl">${h.vol}</span><span class="vb" id="hVol"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <div class="vctl"><button data-v="-1">−</button><button class="pp" data-m="toggle" id="hPP">${NP&&NP.playing?'❚❚':'▶'}</button><button data-v="1">+</button></div><small class="hl">${h.player}: <em id="hPl">${esc(NP?(NP.pkg||'').split('.').pop():'—')}</em></small></div>`;
  else card=`<div class="hf hp hcard dayc" data-f="tab"><span class="ics"><i>✚</i><i>♥</i><i>✱</i></span><b class="dn" id="hDay">${esc(fmt(new Date(),{weekday:'long'}).toUpperCase())}</b>
      <div class="cm1"><button class="ph" data-w="calls">✆</button><div class="nb"><small>${h.notif} <em id="hNn">—</em></small><span class="segs" id="hNs">${'<i></i>'.repeat(10)}</span><small>${h.missed} <em id="hMc">—</em></small></div></div>
      <div class="cbt"><button data-w="sms">${h.sms} <em id="hSm"></em></button><button data-w="net" id="hNet">${h.net}</button></div>
      <button class="ava" data-w="ava"><i></i><i></i><em>☠</em></button></div>`;
  el.innerHTML=`<div class="hb1"><div class="btns"><button class="pb${on1?' act':''}" data-w="acc"><small>${h.media}</small><b>${on1?h.online:h.access}</b><u></u></button><button class="pb${on2?' act':''}" data-w="log"><small>${h.classI}</small><b>${on2?h.online:h.login}</b><u></u></button></div>${card}</div>
    <div class="hb2"><div class="lcol"><button class="pill" data-w="notif" id="hPill"></button><button class="sq${k==='set'?' act':''}" data-w="set" aria-label="settings"></button></div>
      <div class="ck c1"><small>${h.hour}</small><b id="hH">--</b></div><div class="ck c2"><small>${h.min}</small><b id="hM">--</b></div><div class="ck c3"><small>${h.sec}</small><b id="hS">--</b></div>
      <div class="sinf"><b>${h.sysT}</b><small>${h.sysS}</small><small id="hWifi"></small></div></div>`;
  frames(el);hudCard();hudClock()}
function hudCard(){if(!HUDON())return;const h=H();const nn=$('#hNn');if(nn){const n=HD.notif;nn.textContent=n<0?h.noAcc:n;$$('#hNs i').forEach((i,k)=>i.classList.toggle('on',n>0&&k<Math.min(10,n)));$('#hMc').textContent=HD.calls<0?'—':HD.calls;$('#hSm').textContent=HD.sms>0?'· '+HD.sms:'';
    $('#hNet').classList.toggle('on',HD.net.type!=='none')}
  const p=$('#hPill');if(p)p.classList.toggle('blink',HD.notif>0||HD.calls>0);
  const c=$('#hCnt');if(c)c.textContent=HD.notif>=0?HD.notif:0;
  const wf=$('#hWifi');if(wf){const t=HD.net.type;wf.textContent=t==='wifi'?h.wifi+(HD.net.ssid?' · '+HD.net.ssid:''):t==='mobile'?h.mob:t==='none'?h.none:(navigator.onLine?'ONLINE':h.none)}}
let HCK=0;function hudClock(){clearTimeout(HCK);if(!HUDON()||document.hidden)return;const d=new Date();let hh=d.getHours();if(!S.h24)hh=hh%12||12;const a=$('#hH');if(a){a.textContent=pad(hh);$('#hM').textContent=pad(d.getMinutes());$('#hS').textContent=pad(d.getSeconds())}HCK=setTimeout(hudClock,1000-d.getMilliseconds()+5)}
function hudVol(){const v=$('#hVol');if(!v)return;let lv=.5;try{if(has('volume')){const r=Android.volume(0);if(typeof r==='number')lv=r}}catch(e){}v.querySelectorAll('i').forEach((i,k)=>i.classList.toggle('on',k<Math.round(lv*8)))}

/* ---------- integración ---------- */
function hudPanels(v){return v.k==='main'?hMain():v.k==='class'?hClass():v.k==='media'?hMedia():v.k==='set'?hSet():''}
function hudUpdate(){if(!HUDON())return;const h=H(),v=DI.bat;
  const wk=JSON.stringify([S.wx,S.wxLoc&&S.wxLoc.name,S.unit]),mr=$('#hMapRow');if(mr&&mr._wk!==wk){mr._wk=wk;mr.innerHTML=hMap();frames(mr)}
  const caps=$('#hCaps');if(caps){const n=v==null?0:Math.round(v/100*9);caps.querySelectorAll('i').forEach((c,i)=>c.classList.toggle('on',i<n));caps.classList.toggle('chg',!!DI.chg);$('#hPct').textContent=(v??'—')+'%';
    $('#hBt').textContent=(v??'—')+'%'+(DI.temp!=null?'  '+Math.round(DI.temp)+'°C':'');$('#hDis').textContent=DI.chg?'CHARGING':'DISCHARGED'}
  const b2=$('#hBat2');if(b2)b2.textContent=(v??'—')+'% ▮';
  const dt=$('#hDat');if(dt){const nw=hDataRows();if(dt._h!==nw){dt._h=nw;dt.innerHTML=nw}}
  const c2=$('#hCpu2');if(c2)c2.textContent=HD.cpu!=null&&HD.cpu>=0?HD.cpu+'%':'—';
  const cas=$('#hCas');if(cas){const np=NP;cas.classList.toggle('on',!!(np&&np.playing));$('#hPs').textContent='◷ '+(np&&np.playing?'PLAY':'STOP');$('#hTr').textContent=np?np.title:h.nothing;$('#hAr').textContent=np?np.artist:'—'}
  const pp=$('#hPP');if(pp)pp.textContent=NP&&NP.playing?'❚❚':'▶';
  const dy=$('#hDay');if(dy)dy.textContent=fmt(new Date(),{weekday:'long'}).toUpperCase();hudCard()}
function hudNews(){const n=$('#hNews');if(n){n.innerHTML=hNewsIn();n._fw=0;drawFrame(n);hudFit()}}
function hudCenterDrum(){const d=$('#hDrum');if(!d)return;const td=d.querySelector('.td');if(td)d.scrollTop=td.offsetTop-d.clientHeight/2+td.offsetHeight/2}
function hudOnPage(i){if(!HUDON())return;const k=(VP()[i]||{}).k||'main';if(k!==HK){S.page=i;hudBottom();if(k==='media')hudVol();if(k==='set')hudWallThumbs()}}
let HUDT=0,HUDN=0;function hudTick(){clearTimeout(HUDT);if(!HUDON()||document.hidden)return;if((VP()[S.page|0]||{}).k==='main'){sampleCPU();if(NATIVE)nativeDev();hudUpdate()}
  if(Date.now()-HUDN>(ECO.eco?180000:60000)){HUDN=Date.now();sampleComm();hudCard();ecoCheck()}HUDT=setTimeout(hudTick,ECO.idle||ECO.eco?20000:5000);hudClock()}
function hudFit(){if(!HUDON())return;$$('#pager .page').forEach(p=>{p.style.zoom='';const need=p.scrollHeight,have=p.clientHeight;if(need>have+2)p.style.zoom=Math.max(.66,have/need).toFixed(3)})}
window.addEventListener('resize',()=>setTimeout(hudFit,50));

/* navegación con carga (como en el tema): marco vacío -> barra de carga + terminal -> contenido */
const LOGL=['[ OK ] Started Journal Service.','[ OK ] Reached target Paths.','Mounting POSIX Message Queue...','[ OK ] Listening on udev Kernel Socket.','Starting LVM2 metadata daemon...','[ OK ] Mounted Huge Pages File System.','dev-disk-by-uuid '+Math.random().toString(16).slice(2,12),'Check sum ........ OK','Secure connection is established','All files are protected!!'];
function hudGo(k){const i=vIdx(k);if(i<0)return;ecoWake();$$('.page.ld').forEach(x=>{x.classList.remove('ld');const o=x.querySelector('.ldov');if(o)o.remove()});hap('tick');const anim=S.hfx!==false&&!ECO.eco;goPage(i,false);hudOnPage(i);if(!anim){animIn();return}
  const p=$(`.page[data-pi="${i}"]`);if(!p)return;p.classList.add('ld');let ov=p.querySelector('.ldov');if(ov)ov.remove();ov=document.createElement('div');ov.className='ldov';
  ov.innerHTML=`<div class="hz"><i></i><u class="fill"></u><i></i></div><b class="bst">${H().boot}</b><pre></pre>`;p.appendChild(ov);const pre=ov.querySelector('pre');let n=0;
  const st=()=>{if(!ov.isConnected)return;if(n<4){pre.textContent+=LOGL[(n+Math.floor(Math.random()*4))%LOGL.length]+'\n';n++;setTimeout(st,45)}else{ov.querySelector('.bst').textContent=H().done;setTimeout(()=>{ov.remove();p.classList.remove('ld');animIn();frames(p);hudFit();if(k==='class')hudCenterDrum()},90)}};setTimeout(st,40)}
$('#hudBot').addEventListener('click',e=>{const m=e.target.closest('[data-m]');if(m){hap();cmd(m.dataset.m);return}const vb=e.target.closest('[data-v]');if(vb){hap('tick');try{has('volume')&&Android.volume(+vb.dataset.v)}catch(x){}setTimeout(hudVol,150);return}
  const b=e.target.closest('[data-w]');if(!b)return;const w=b.dataset.w;hap();
  if(w==='acc')hudGo(HK==='media'?'main':'media');else if(w==='log')hudGo(HK==='class'?'main':'class');else if(w==='set')hudGo(HK==='set'?'main':'set');
  else if(w==='calls'){has('openCallLog')?Android.openCallLog():launch('phone')}else if(w==='sms'){has('openSms')?Android.openSms():launch('sms')}else if(w==='net'){has('openNetSettings')&&Android.openNetSettings()}
  else if(w==='notif'){has('openNotifications')&&Android.openNotifications()}else if(w==='ava'){if(!hudBottom._lp)jvOpen(true)}else if(w==='wx'){S.wxLoc?loadWx(true):geoLocate(false)}});
/* mantener el avatar = cámara */
(()=>{let t=0;$('#hudBot').addEventListener('pointerdown',e=>{if(!e.target.closest('.ava'))return;hudBottom._lp=false;clearTimeout(t);t=setTimeout(()=>{hudBottom._lp=true;hap('long');launch('camera')},550)});['pointerup','pointercancel','pointerleave'].forEach(v=>$('#hudBot').addEventListener(v,()=>clearTimeout(t)))})();
$('#pager').addEventListener('click',e=>{if(!HUDON())return;const n=e.target.closest('[data-n]');if(n){e.stopPropagation();hap('tick');const v=n.dataset.n;if(v==='feed'){if(!feedItems().length&&NATIVE){loadFeed(true)}else openFeed();return}const it=feedItems();if(it.length){HNI=(HNI+(+v)+it.length)%it.length;hudNews()}return}
  const u=e.target.closest('#hNews [data-u]');if(u){e.stopPropagation();hap();if(has('openArticle'))Android.openArticle(u.dataset.u,getComputedStyle(document.documentElement).getPropertyValue('--fr').trim()||S.acc);return}
  const r=e.target.closest('.cr');if(r){e.stopPropagation();hap('tick');const d=$('#hDrum');d.scrollTo({top:r.offsetTop-d.clientHeight/2+r.offsetHeight/2,behavior:'smooth'});return}
  const s=e.target.closest('[data-s]');if(s){e.stopPropagation();hap('tick');hudSet(s)}},true);
async function hudSet(b){const a=b.dataset.s,K=Object.keys(HUDC);
  if(a==='col'||a==='colp'){const i=K.indexOf(S.hudc);S.hudc=K[(i+(a==='colp'?K.length-1:1)+K.length)%K.length];save();applyTheme();hudRe()}
  else if(a==='wall'){S.wall=b.dataset.k;save();await applyWall();$$('.wt').forEach(x=>x.classList.toggle('on',x===b))}
  else if(a==='gal'){$('#wallIn').click()}
  else if(a==='hz60'){S.hz60=!S.hz60;save();b.classList.toggle('on',S.hz60);ecoCheck()}
  else if(a==='hfx'||a==='shadow'||a==='boot'||a==='saver'){S[a]=!(S[a]!==false);if(a==='saver'){ECO.idle=false;document.body.classList.remove('idle');ecoWake()}save();applyTheme();b.classList.toggle('on',S[a]!==false);if(a==='boot'&&S.boot)hudBoot(true)}
  else if(a==='perm')permSheet();else if(a==='more')homeSettings()}
function hudRe(){const p=S.page|0;renderHome();goPage(p,false);HK='';hudOnPage(p)}
function hudWallThumbs(){$$('.wt').forEach(b=>{if(b.style.backgroundImage)return;requestAnimationFrame(()=>{b.style.backgroundImage=`url(${genWall(b.dataset.k,72,128).toDataURL('image/jpeg',.75)})`})})}

/* ---------- centro de permisos (nativo) ---------- */
const PT={es:{t:'Permisos y sistema',s:'Todo se concede con los diálogos y ajustes de Android. «Configurar todo» los recorre uno por uno y continúa solo al volver.',
  all:'Configurar todo automáticamente',run:'Permisos de Android',sp:'Ajustes especiales',xi:'Optimización de HyperOS',keep:'Mantener activo',keepS:'Servicio persistente con notificación mínima: HyperOS no cierra el launcher y abre al instante',
  adb:'Activación total por ADB (opcional)',adbS:'Conecta el celular al PC con depuración USB y ejecuta una vez este comando. Después Aura activa sola las notificaciones y los gestos:',copy:'Copiar',copied:'Copiado',
  step:(i,n)=>`Paso ${i} de ${n}`,done:'Listo: todo configurado',open:'Abrir',ok:'Conceder',
  pNotif:'Notificaciones',pNotifS:'Para el aviso de «Mantener activo»',pBat:'Sin optimización de batería',pBatS:'Android no pausa el launcher',
  pAuto:'Inicio automático',pAutoS:'Que HyperOS no cierre Aura',pMb:'Ahorro de batería: Sin restricciones',pMbS:'Busca Aura y elige «Sin restricciones»',pPop:'Ventanas en segundo plano y bloqueo',pPopS:'Abrir apps y J.A.R.V.I.S. desde segundo plano'},
 en:{t:'Permissions & system',s:'Everything is granted through Android dialogs and settings. «Set up everything» walks through them and continues when you return.',
  all:'Set up everything automatically',run:'Android permissions',sp:'Special settings',xi:'HyperOS optimization',keep:'Keep alive',keepS:'Persistent service with a minimal notification: HyperOS will not close the launcher',
  adb:'Full activation via ADB (optional)',adbS:'Connect the phone to a PC with USB debugging and run this once. Then Aura enables notifications and gestures by itself:',copy:'Copy',copied:'Copied',
  step:(i,n)=>`Step ${i} of ${n}`,done:'Done: everything is set up',open:'Open',ok:'Grant',
  pNotif:'Notifications',pNotifS:'For the «Keep alive» notice',pBat:'No battery optimization',pBatS:'Android will not pause the launcher',
  pAuto:'Autostart',pAutoS:'So HyperOS does not close Aura',pMb:'Battery saver: No restrictions',pMbS:'Find Aura and choose «No restrictions»',pPop:'Background windows & lock screen',pPopS:'Open apps and J.A.R.V.I.S. from background'}};
const PTT=()=>PT[S.lang]||(S.lang==='pt'?PT.es:PT.en);
function permState(){let st={};try{st=has('permStatus')?JSON.parse(Android.permStatus()):{}}catch(e){}S.permVisited=S.permVisited||{};return st}
function permLists(){const h=H(),p=PTT();
  const R=[['location',h.pLoc,h.pLocS],['calendar',h.pCal,h.pCalS],['mic',h.pMic,h.pMicS],['contacts',h.pCon,h.pConS],['phone',h.pPh,h.pPhS],['calllog',h.pLog,h.pLogS],['sms',h.pSms,h.pSmsS],['notifications',p.pNotif,p.pNotifS]];
  const SP=[['home',h.pHome,h.pHomeS],['notif',h.pNot,h.pNotS],['gestures',h.pGes,h.pGesS],['battery',p.pBat,p.pBatS]];
  const XI=[['autostart',p.pAuto,p.pAutoS],['miuibattery',p.pMb,p.pMbS],['popup',p.pPop,p.pPopS]];
  return {R,SP,XI}}
const PW={q:[],i:0,n:0,wait:false};
function permDo(k){if(!NATIVE){toast('APK');return}PW.wait=true;
  if(k==='runtime'){const st=permState(),{R}=permLists();Android.requestPerms(R.filter(x=>!st[x[0]]).map(x=>x[0]).join(','))}
  else if(k==='home')Android.setDefaultLauncher();
  else if(['notif','gestures','battery','autostart','miuibattery','popup'].includes(k)){if(['autostart','miuibattery','popup'].includes(k)){S.permVisited[k]=true;save()}
    if(has('requestSpecial'))Android.requestSpecial(k);else if(k==='notif')Android.requestMediaAccess();else if(k==='gestures')Android.openAccessibility()}
  else Android.requestPerms(k)}
function permPlan(){const st=permState(),{R,SP,XI}=permLists(),q=[];if(R.some(x=>!st[x[0]]))q.push('runtime');
  SP.forEach(x=>{if(!st[x[0]])q.push(x[0])});if(st.xiaomi)XI.forEach(x=>{if(!S.permVisited[x[0]])q.push(x[0])});return q}
function permWizard(){if(has('autoGrant'))try{Android.autoGrant()}catch(e){}PW.q=permPlan();PW.n=PW.q.length;PW.i=0;if(!PW.n){toast(PTT().done);permSheet();return}permNext()}
function permNext(){if(PW.i>=PW.q.length){PW.q=[];toast(PTT().done);permSheet();return}const k=PW.q[PW.i++];toast(PTT().step(PW.i,PW.n));setTimeout(()=>permDo(k),350)}
function permBack(){if(!PW.wait)return;PW.wait=false;setTimeout(()=>{if(PW.q.length)permNext();else if(document.body.classList.contains('sheetOpen')&&$('#pAll'))permSheet()},450)}
function permSheet(){const h=H(),p=PTT(),st=permState(),{R,SP,XI}=permLists();
  const row=([k,l,d],btn,okv)=>`<div class="row"><span>${esc(l)}<small>${esc(d)}</small></span>${okv?'<b class="pok">✓</b>':`<button class="btn alt" data-p="${k}" style="padding:7px 12px">${esc(btn)}</button>`}</div>`;
  const cmd='adb shell pm grant '+(has('appMode')&&JVAPP?'com.cy.jarvis':'com.cy.aura')+' android.permission.WRITE_SECURE_SETTINGS';
  const nMiss=permPlan().length;
  sheet(`<h3><button class="x" data-x>${ic('close')}</button>${esc(p.t)}</h3><p style="font-size:12.5px;color:#9AA4B2;text-align:center;margin:-6px 0 12px">${esc(p.s)}</p>
    <button class="btn" id="pAll" style="width:100%;margin-bottom:6px">${esc(p.all)}${nMiss?` · ${nMiss}`:' ✓'}</button>
    <h4>${esc(p.keep)}</h4><div class="grp"><div class="row"><span>${esc(p.keep)}<small>${esc(p.keepS)}</small></span><button class="sw ${st.keepalive?'on':''}" id="pKeep"></button></div></div>
    <h4>${esc(p.run)}</h4><div class="grp">${R.map(r=>row(r,p.ok,st[r[0]])).join('')}</div>
    <h4>${esc(p.sp)}</h4><div class="grp">${SP.map(r=>row(r,p.open,st[r[0]])).join('')}</div>
    ${st.xiaomi?`<h4>${esc(p.xi)}</h4><div class="grp">${XI.map(r=>row(r,p.open,S.permVisited[r[0]])).join('')}</div>`:''}
    <h4>${esc(p.adb)}</h4><div class="grp" style="padding:10px 14px"><small style="display:block;color:#9AA4B2;font-size:11.5px;margin-bottom:8px">${esc(p.adbS)}</small>
      <code style="display:block;font:500 11px var(--mono);background:rgba(0,0,0,.4);padding:10px;border-radius:8px;word-break:break-all;-webkit-user-select:text;user-select:text">${esc(cmd)}</code>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px"><span style="font-size:12px">${st.secure?'<b class="pok">✓</b> ADB':''}</span><button class="btn alt" id="pCopy" style="padding:7px 12px">${esc(p.copy)}</button></div></div>`);
  $('#pAll').onclick=()=>{closeSheet();permWizard()};
  $('#pKeep').onclick=e=>{const on=!e.currentTarget.classList.contains('on');e.currentTarget.classList.toggle('on',on);hap('tick');if(has('setPersistent'))Android.setPersistent(on);if(on&&!st.notifications&&has('requestPerms')){PW.wait=true;Android.requestPerms('notifications')}};
  $('#pCopy').onclick=async()=>{try{await navigator.clipboard.writeText(cmd);toast(p.copied)}catch(e){if(has('shareText'))Android.shareText(cmd)}};
  $('#sheetIn').onclick=e=>{const b=e.target.closest('[data-p]');if(!b)return;hap();const k=b.dataset.p;PW.q=[];permDo(k);if(['autostart','miuibattery','popup'].includes(k))b.outerHTML='<b class="pok">✓</b>'}}
window.onPerms=()=>{sampleComm();hudCard();permBack();if(S.wxLoc==null)geoLocate(true)};
/* ---------- arranque tipo terminal ---------- */
const BOOTL=['[ OK ] Started Journal Service.','Mounting POSIX Message Queue File System...','[ OK ] Reached target Paths.','[ OK ] Listening on udev Kernel Socket.','Starting Create list of static device nodes...',
  '[ OK ] Listening on Device-mapper event daemon FIFOs.','Starting LVM2 metadata daemon...','[ OK ] Set up automount Arbitrary Executable File Formats.','dev-disk-by\\x2duuid-'+Math.random().toString(16).slice(2,14)+'.device',
  '[ OK ] Mounted Huge Pages File System.','[ 11.8106] random: nonblocking pool is initialized','[ OK ] Started J.A.R.V.I.S. neural interface.','Check sum ........ OK','Secure connection is established','All files are protected!!'];
function hudBoot(force){if(!HUDON()||(S.boot===false&&!force)||$('#boot'))return;const h=H();const el=document.createElement('div');el.id='boot';
  el.innerHTML=`<div class="hf hp bt1" data-f="bot"><div class="hz"><i></i><u class="fill"></u><i></i></div><b class="bst">${h.boot}</b></div><div class="hf hp bt2" data-f="tab side"><span class="haz"></span><pre id="bLog"></pre></div>`;
  document.body.appendChild(el);frames(el);const log=$('#bLog');let i=0;
  const step=()=>{if(!el.isConnected)return;if(i<BOOTL.length){log.textContent+=BOOTL[i++]+'\n';log.scrollTop=1e9;setTimeout(step,32+Math.random()*28)}
    else{el.querySelector('.bst').textContent=h.done;el.classList.add('ok');setTimeout(()=>{el.querySelector('.bst').textContent=h.granted},200);setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),300)},520)}};
  setTimeout(step,120);el.onclick=()=>{el.classList.add('out');setTimeout(()=>el.remove(),300)}}
function hudFirstRun(){if(has('autoGrant'))try{Android.autoGrant()}catch(e){}if(!NATIVE||S.permAsked)return;S.permAsked=true;save();setTimeout(permSheet,3600)}
const _rfH=renderFeed;renderFeed=function(a){_rfH(a);if(HUDON())hudNews()};
