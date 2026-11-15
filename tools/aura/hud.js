/* =====================================================================
   HACKER HUD — estilo "Stark Industries" (KLWP hacker theme)
   ===================================================================== */
const HUDON=()=>S.skin==='hud';
const OFF=()=>HUDON()?1:0;               /* página virtual 0 = panel principal */
const HUDC={orange:['#FF8A3D','#35E7FF'],cyan:['#35E7FF','#FF8A3D'],red:['#FF3B5C','#35E7FF'],green:['#3BFF8A','#B6FF3B'],violet:['#B07CFF','#35E7FF']};
const HMAP='__MAP__';
const MONTHS=()=>Array.from({length:12},(_,i)=>fmt(new Date(2024,i,1),{month:'long'}));
const WDAYS=()=>Array.from({length:7},(_,i)=>fmt(new Date(2024,0,7+i),{weekday:'long'}));
const HT={es:{cov:'COBERTURA GLOBAL',radar:'SISTEMA RADAR',power:'ENERGÍA',diag:'DIAGNÓSTICO DEL SISTEMA',diagS:'Para abrir el cajón de aplicaciones toca el botón ACCESS',pa:'ANÁLISIS DE ENERGÍA',ma:'ANÁLISIS DE MEMORIA',
    cpu:'CPU en uso',freq:'Frecuencia CPU en MHz',temp:'Temperatura batería',life:'Autonomía',ramU:'Memoria usada',stoT:'Almacenamiento total',date:'Día | Mes | Año',ramF:'Memoria libre',stoF:'Almacenamiento libre',
    access:'ACCESS',online:'ONLINE',media:'Sistema de apps',classI:'J.A.R.V.I.S. en línea',sysT:'SYSTEM INFORMATION',sysS:'Toca el avatar para hablar con J.A.R.V.I.S.',conn:'Conexión',
    secured:'APPS SEGURAS',files:'APPS',classified:'CLASSIFIED',search:'BUSCAR APPS',notif:'NOTIFICACIÓN',notifS:'Toca el núcleo animado para activar a J.A.R.V.I.S.',ringer:'SISTEMA',cpuU:'CPU USADA',
    upd:'ACTUALIZADO',total:'TOTAL NOTICIAS',back:'ATRÁS',next:'SIGUIENTE',news:'NOTICIAS',noNews:'Desliza a la derecha en la página principal para cargar noticias.',player:'REPRODUCTOR',vol:'VOLUMEN',nothing:'SIN REPRODUCCIÓN',
    boot:'CARGANDO',done:'COMPLETO',granted:'ACCESO CONCEDIDO',hum:'Humedad',wind:'Viento',lon:'Longitud',lat:'Latitud',stark:'STARK INDUSTRIES'},
  en:{cov:'GLOBAL COVERAGE',radar:'RADAR SYSTEM',power:'POWER',diag:'DATABASE DEFRAGMENTATION',diagS:'To open the applications page, touch the ACCESS button',pa:'POWER DATA ANALYSIS',ma:'MEMORY DATA ANALYSIS',
    cpu:'Current CPU in %',freq:'CPU frequency in MHz',temp:'Battery temperature',life:'Battery life',ramU:'Used memory in Mb',stoT:'Total internal space',date:'Day | Month | Year',ramF:'Free memory in Mb',stoF:'Free internal space',
    access:'ACCESS',online:'ONLINE',media:'Media System',classI:'J.A.R.V.I.S. online',sysT:'SYSTEM INFORMATION',sysS:'Touch the avatar to talk to J.A.R.V.I.S.',conn:'Connection',
    secured:'SECURED APPS',files:'APPS',classified:'CLASSIFIED',search:'SEARCH APPS',notif:'NOTIFICATION',notifS:'Touch the animated core to wake J.A.R.V.I.S.',ringer:'SYSTEM',cpuU:'CPU USED',
    upd:'UPDATED',total:'TOTAL NEWS',back:'BACK',next:'NEXT',news:'NEWS',noNews:'Swipe right on the main page to load news.',player:'PLAYER',vol:'VOLUME',nothing:'NOTHING PLAYING',
    boot:'LOADING',done:'COMPLETE',granted:'ACCESS GRANTED',hum:'Humidity',wind:'Wind',lon:'Longitude',lat:'Latitude',stark:'STARK INDUSTRIES'}};
const H=()=>HT[S.lang]||(S.lang==='pt'?HT.es:HT.en);
function hudColors(){const c=HUDC[S.hudc]||HUDC.orange;const R=document.documentElement.style;R.setProperty('--fr',c[0]);R.setProperty('--tl',c[1])}

/* ---------- marcos con esquinas cortadas (SVG a la medida) ---------- */
const FRO=typeof ResizeObserver!=='undefined'?new ResizeObserver(es=>es.forEach(e=>drawFrame(e.target))):null;
function drawFrame(el){const w=el.offsetWidth,h=el.offsetHeight;if(!w||!h)return;if(el._fw===w&&el._fh===h)return;el._fw=w;el._fh=h;
  const f=el.dataset.f||'plain',c=14,t=f.includes('tab')?10:0,b=f.includes('bot')?10:0,x1=w*.28,x2=w*.72,y0=t,y1=h-b;
  let p=`M${c},${y0}`;if(t)p+=`L${x1},${y0}L${x1+t},0L${x2-t},0L${x2},${y0}`;p+=`L${w-c},${y0}L${w},${y0+c}L${w},${y1-c}L${w-c},${y1}`;
  if(b)p+=`L${x2},${y1}L${x2-b},${h}L${x1+b},${h}L${x1},${y1}`;p+=`L${c},${y1}L0,${y1-c}L0,${y0+c}Z`;
  const acc=`M4,${y0+c+22}L4,${y0+c+4}L${c+4},${y0+4}L${c+40},${y0+4}M${w-4},${y1-c-22}L${w-4},${y1-c-4}L${w-c-4},${y1-4}L${w-c-40},${y1-4}`;
  const dots=(t?`<circle cx="${x1}" cy="${y0}" r="2.6"/><circle cx="${x2}" cy="${y0}" r="2.6"/>`:'')+(b?`<circle cx="${x1}" cy="${y1}" r="2.6"/><circle cx="${x2}" cy="${y1}" r="2.6"/>`:'')+`<circle cx="${c+48}" cy="${y0+4}" r="1.8"/>`;
  const ticks=f.includes('side')?`<path d="M${w+5},${h*.42}h6M${w+5},${h*.42+7}h6M${w+5},${h*.42+14}h6" class="tk"/>`:'';
  let s=el.querySelector(':scope>svg.fr');if(!s){s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('class','fr');el.prepend(s)}
  s.setAttribute('viewBox',`-1 -1 ${w+14} ${h+2}`);s.style.width=(w+14)+'px';s.style.height=(h+2)+'px';
  s.innerHTML=`<path d="${p}" class="bd"/><path d="${p}" class="ln"/><path d="${acc}" class="ac"/>${ticks}<g class="dt">${dots}</g>`}
function frames(root){(root||document).querySelectorAll('.hf').forEach(el=>{drawFrame(el);if(FRO&&!el._ob){el._ob=1;FRO.observe(el)}})}

/* ---------- datos vivos ---------- */
const HD={cpu:null,freq:null};
function sampleCPU(){if(!NATIVE)return;try{if(has('cpuLoad'))HD.cpu=Android.cpuLoad();if(has('cpuFreq'))HD.freq=Android.cpuFreq()}catch(e){}}
const mbs=b=>b==null?'—':Math.round(b/1048576)+' MB';
const gbs=b=>b==null?'—':(b/1073741824).toFixed(1)+' GB';

/* ---------- página principal ---------- */
function hMain(){const h=H(),w=S.wx,L0=S.wxLoc;const mk=L0?`<g class="pin" transform="translate(${(L0.lon+180).toFixed(1)},${(84-L0.lat).toFixed(1)})"><circle r="9" class="p1"/><circle r="5" class="p2"/><circle r="2.2" class="p3"/><path d="M-12,0h7M5,0h7M0,-12v7M0,5v7"/></g>`:'';
  const caps=Array.from({length:9},(_,i)=>`<i data-i="${i}"></i>`).join('');
  return `<div class="hrow"><button class="hf hp hmap" data-f="tab" data-w="wx"><span class="hl tl">${h.cov}</span><span class="hl tr2"><b class="xx">✕</b></span>
    <div class="hmc"><div class="hwx"><b class="ht" id="hT">${w?w.temp+'°'+S.unit:'—'}</b><span class="hi" id="hI">${w?WXE[wcat(w.code)]:'◌'}</span>
      <small id="hW1">${h.wind} <em>${w&&w.wind!=null?w.wind+' km/h':'—'}</em></small><i class="bar"><u style="width:${w&&w.wind!=null?Math.min(100,w.wind*3):0}%"></u></i>
      <small id="hW2">☂ <em>${w?(w.rain??0)+'%':'—'}</em></small><i class="bar"><u style="width:${w?(w.rain??0):0}%"></u></i>
      <small class="sid">SYS-ID ${esc((L0&&L0.name||'—').toUpperCase())}<br>&gt;&gt; ${h.lon}: ${L0?L0.lon.toFixed(4):'—'}<br>&gt;&gt; ${h.lat}: ${L0?L0.lat.toFixed(4):'—'}</small></div>
    <svg class="wmap" viewBox="0 6 360 120" preserveAspectRatio="xMidYMid meet"><path d="${HMAP}"/>${mk}</svg>
    <div class="hside"><i></i><i></i><i></i><small>${h.radar}</small></div></div>
    <div class="comp"><span>·</span><span>|</span><span>·</span><b>N</b><span>·</span><span>|</span><span>·</span></div></button></div>
  <div class="hrow"><div class="hf hp hpow" data-f="side">
    <div class="hh"><span class="haz"></span><span class="hl">∞ ${h.power}</span><span class="hl r" id="hPct">—%</span></div>
    <button class="caps" data-w="bat"><span class="plug">⊂●</span><span class="cc" id="hCaps">${caps}</span><span class="plug">●⊃</span></button>
    <div class="hbar"><span class="bt" id="hBt">BAT</span><span class="line"></span><span class="sym">▸ ■ ▲ ●</span></div>
    <div class="dat" id="hDat">${hDataRows()}</div><span class="stark">${h.stark}</span></div></div>
  <div class="hrow hacc"><div class="btns"><button class="pb" data-w="access"><small>${h.media}</small><b>${h.access}</b></button><button class="pb" data-w="online"><small>${h.classI}</small><b>${h.online}</b></button></div>
    <button class="hf hp hday" data-f="tab" data-w="jv"><b id="hDay">${esc(fmt(new Date(),{weekday:'long'}).toUpperCase())}</b><span class="core"><i></i><i></i><i></i><em></em></span>
      <span class="mini"><i style="width:72%"></i></span><span class="mini2"><u></u><u></u><u></u><u></u><u></u><u></u></span></button></div>`}
function hDataRows(){const h=H(),n=DI.n||{},d=new Date();const row=(k,v,c='')=>`<div class="dr ${c}"><span>${k}</span><b>${v}</b></div>`;
  return `<b class="dh">${h.diag}</b><small class="ds">${h.diagS}</small><b class="dh">${h.pa}</b>
  ${row(h.cpu,HD.cpu!=null&&HD.cpu>=0?HD.cpu+'%':'—')}${row(h.freq,HD.freq>0?HD.freq+' MHz':'—')}${row(h.temp,DI.temp!=null?(+DI.temp).toFixed(1)+'°C':'—')}${row(h.life,esc(remain()))}
  <b class="dh">${h.ma}</b><div class="mrows"><i class="sweep"></i>${row(h.ramU,n.ramTotal?mbs(n.ramTotal-n.ramAvail):'—')}${row(h.stoT,gbs(n.stoTotal))}${row(h.date,pad(d.getDate())+' '+esc(cap(fmt(d,{month:'short'}).replace('.','')))+' '+d.getFullYear(),'pk')}${row(h.ramF,mbs(n.ramAvail))}${row(h.stoF,gbs(n.stoFree))}</div>`}

/* ---------- CLASSIFIED: calendario, búsqueda, radar ---------- */
function hClass(){const h=H(),n=installed().length,t=new Date();t.setHours(12,0,0,0);const M=MONTHS(),W=WDAYS();let rows='';
  for(let k=-20;k<=60;k++){const d=new Date(t.getTime()+k*864e5);rows+=`<div class="cr${k===0?' td':''}" data-d="${ymd(d)}"><span>${pad(d.getDate())}</span><span>${esc(W[d.getDay()].toUpperCase())}</span><span>${esc(M[d.getMonth()].toUpperCase())}</span><span>${d.getFullYear()}</span></div>`}
  return `<div class="hrow"><div class="hf hp hcls" data-f="bot"><div class="hh2"><span>▲ ${n} ${h.files}</span><span>🔒 ${h.secured}</span></div>
      <div class="hz"><i></i><u></u><i></i></div><b class="ctit">${h.classified}</b></div></div>
    <div class="hrow"><div class="hf hp hcal" data-f="tab side"><span class="haz"></span><div class="drum nosw" id="hDrum">${rows}</div><i class="hiband"></i>
      <div class="cfoot"><span class="hl">${h.ringer} · ${esc((DI.n&&DI.n.os)||'ANDROID').toUpperCase()}</span><span class="tri">▼</span><b class="bp" id="hBat2">—% ▮</b></div></div></div>
    <div class="hrow hsrow"><button class="orbx" data-w="jv"><i></i><i></i><i></i><em></em></button>
      <svg class="cable" viewBox="0 0 120 120"><path d="M30,10 C10,60 70,40 40,90 S90,110 110,100"/><circle cx="110" cy="100" r="3"/><circle cx="30" cy="10" r="3"/></svg>
      <div class="sbx"><button class="gs" data-w="search"><b>${h.search}</b><span class="mic" data-w="mic">●</span></button>
        <small class="hl">${h.notif} <em class="cnt" id="hCnt">${pad(n%100)}</em></small><small class="nt">${h.notifS}</small><small class="hl cpuu">${h.cpuU} <em id="hCpu2">${HD.cpu!=null&&HD.cpu>=0?HD.cpu+'%':'—'}</em></small></div></div>`}

/* ---------- MEDIA: casete y noticias ---------- */
const reel=`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" class="r1"/><circle cx="20" cy="20" r="11" class="r2"/>${[0,60,120,180,240,300].map(a=>`<circle cx="${20+12*Math.cos(a*Math.PI/180)}" cy="${20+12*Math.sin(a*Math.PI/180)}" r="3.2" class="r3"/>`).join('')}<circle cx="20" cy="20" r="5" class="r4"/></svg>`;
let HNI=0;
function feedItems(){if(typeof FEED!=='undefined'&&FEED[0]&&FEED[0].length)return FEED[0];try{const c=JSON.parse(localStorage.getItem('nf:'+S.lang+':0')||'null');if(c&&c.items){FEED[0]=c.items;return c.items}}catch(e){}return []}
function hMedia(){const h=H(),np=NP;
  return `<div class="hrow"><div class="hf hp hcas${np&&np.playing?' on':''}" data-f="tab bot" id="hCas"><span class="hl tl" id="hPs">◷ ${np&&np.playing?'PLAY':'STOP'}</span><span class="hl tr2">${h.player}</span>
      <div class="deck"><button class="reel" data-m="prev">${reel}</button><span class="tape"><i></i><i></i><i></i><i></i><i></i></span><span class="tape r"><i></i><i></i><i></i><i></i><i></i></span><button class="reel" data-m="next">${reel}</button></div>
      <button class="ttl" data-m="toggle"><b id="hTr">${esc(np?np.title:h.nothing)}</b><small id="hAr">${esc(np?np.artist:'—')}</small></button>
      <div class="seg" id="hSeg">${'<i></i>'.repeat(18)}</div></div></div>
    <div class="hrow"><div class="hf hp hnews" data-f="tab side" id="hNews">${hNewsIn()}</div></div>`}
function hNewsIn(){const h=H(),it=feedItems();if(!it.length)return `<span class="haz"></span><p class="nn">${h.noNews}</p><div class="nbar"><button data-n="feed">${h.news}</button></div>`;
  HNI=Math.max(0,Math.min(HNI,it.length-1));const x=it[HNI];
  return `<span class="haz"></span><b class="nh" data-u="${esc(x.l)}">${esc(x.t)}</b><div class="nmid"><span class="upd"><i></i>${h.upd}<br>${esc(relT(x.d||Date.now()))}</span>
    <button class="nim" data-u="${esc(x.l)}" ${x.img?`style="background-image:url('${esc(x.img)}')"`:''}>${x.img?'':'<span>'+esc((x.s||'NEWS').slice(0,14))+'</span>'}</button><b class="num">${pad(HNI+1)}</b></div>
    <small class="tot">${h.total}: ${it.length}</small><div class="nbar"><button data-n="-1">◂ ${h.back}</button><button data-n="feed" class="mid">${h.news}</button><button data-n="1">${h.next} ▸</button></div>`}

/* ---------- integración ---------- */
function hudPanels(vi){return vi===0?hMain():vi===1?hClass():vi===2?hMedia():''}
function hudUpdate(){if(!HUDON())return;const h=H(),w=S.wx,v=DI.bat;
  const wk=JSON.stringify([S.wx,S.wxLoc&&S.wxLoc.name,S.unit]),mp=$('.hmap');if(mp&&mp.parentNode._wk!==wk){const row=mp.parentNode;const tmp=document.createElement('div');tmp.innerHTML=hMain();row.innerHTML=tmp.firstElementChild.innerHTML;row._wk=wk;frames(row)}
  const caps=$('#hCaps');if(caps){const n=v==null?0:Math.round(v/100*9);caps.querySelectorAll('i').forEach((c,i)=>c.classList.toggle('on',i<n));caps.classList.toggle('chg',!!DI.chg);$('#hPct').textContent=(v??'—')+'%';$('#hBt').textContent=DI.chg?'⚡ '+(v??'')+'%':'BAT '+(v??'—')+'%'}
  const b2=$('#hBat2');if(b2)b2.textContent=(v??'—')+'% ▮';
  const dt=$('#hDat');if(dt){const nw=hDataRows();if(dt._h!==nw){dt._h=nw;dt.innerHTML=nw}}
  const c2=$('#hCpu2');if(c2)c2.textContent=HD.cpu!=null&&HD.cpu>=0?HD.cpu+'%':'—';
  const cas=$('#hCas');if(cas){const np=NP;cas.classList.toggle('on',!!(np&&np.playing));$('#hPs').textContent='◷ '+(np&&np.playing?'PLAY':'STOP');$('#hTr').textContent=np?np.title:h.nothing;$('#hAr').textContent=np?np.artist:'—'}
  const dy=$('#hDay');if(dy)dy.textContent=fmt(new Date(),{weekday:'long'}).toUpperCase()}
function hudNews(){const n=$('#hNews');if(n){n.innerHTML=hNewsIn();n._fw=0;drawFrame(n);hudFit()}}
function hudCenterDrum(){const d=$('#hDrum');if(!d)return;const td=d.querySelector('.td');if(td)d.scrollTop=td.offsetTop-d.clientHeight/2+td.offsetHeight/2}
let HUDT=0;function hudTick(){clearTimeout(HUDT);if(!HUDON()||document.hidden)return;if((S.page|0)===0){sampleCPU();if(NATIVE)nativeDev();hudUpdate()}HUDT=setTimeout(hudTick,4000)}
$('#pager').addEventListener('click',e=>{if(!HUDON())return;const n=e.target.closest('[data-n]');if(n){e.stopPropagation();hap('tick');const v=n.dataset.n;if(v==='feed'){openFeed();return}const it=feedItems();if(it.length){HNI=(HNI+(+v)+it.length)%it.length;hudNews()}return}
  const u=e.target.closest('#hNews [data-u]');if(u){e.stopPropagation();hap();if(has('openArticle'))Android.openArticle(u.dataset.u,getComputedStyle(document.documentElement).getPropertyValue('--fr').trim()||S.acc);return}
  const r=e.target.closest('.cr');if(r){e.stopPropagation();hap('tick');const d=$('#hDrum');d.scrollTo({top:r.offsetTop-d.clientHeight/2+r.offsetHeight/2,behavior:'smooth'});return}},true);

/* ---------- arranque tipo terminal ---------- */
const BOOTL=['[ OK ] Started Journal Service.','Mounting POSIX Message Queue File System...','[ OK ] Reached target Paths.','[ OK ] Listening on udev Kernel Socket.','Starting Create list of static device nodes...',
  '[ OK ] Listening on Device-mapper event daemon FIFOs.','Starting LVM2 metadata daemon...','[ OK ] Set up automount Arbitrary Executable File Formats.','dev-disk-by\\x2duuid-'+Math.random().toString(16).slice(2,14)+'.device',
  '[ OK ] Mounted Huge Pages File System.','[ 11.8106] random: nonblocking pool is initialized','[ OK ] Started J.A.R.V.I.S. neural interface.','Check sum ........ OK','Secure connection is established','All files are protected!!'];
function hudBoot(){if(!HUDON()||S.boot===false||$('#boot'))return;const h=H();const el=document.createElement('div');el.id='boot';
  el.innerHTML=`<div class="hf hp bt1" data-f="bot"><div class="hz"><i></i><u></u><i></i></div><b class="bst">${h.boot}</b></div><div class="hf hp bt2" data-f="tab side"><span class="haz"></span><pre id="bLog"></pre></div>`;
  document.body.appendChild(el);frames(el);const log=$('#bLog');let i=0;
  const step=()=>{if(!el.isConnected)return;if(i<BOOTL.length){log.textContent+=BOOTL[i++]+'\n';log.scrollTop=1e9;setTimeout(step,70+Math.random()*60)}
    else{el.querySelector('.bst').textContent=h.done;el.classList.add('ok');setTimeout(()=>{el.querySelector('.bst').textContent=h.granted},380);setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),450)},1000)}};
  setTimeout(step,350);el.onclick=()=>{el.classList.add('out');setTimeout(()=>el.remove(),300)}}
const _rfH=renderFeed;renderFeed=function(a){_rfH(a);if(HUDON())hudNews()};
function hudFit(){if(!HUDON())return;$$('#pager .page').forEach(p=>{p.style.zoom='';const need=p.scrollHeight,have=p.clientHeight;if(need>have+2)p.style.zoom=Math.max(.72,have/need).toFixed(3)})}
window.addEventListener('resize',()=>setTimeout(hudFit,50));
