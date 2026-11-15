# Launchers para Android

Dos pantallas de inicio para Android, optimizadas para el **Redmi Note 13 Pro+ 5G**. Cada una existe como **APK** (launcher nativo) y como **versión web**.

| Tema | Carpeta | APK |
|---|---|---|
| **Launcher 27**: estilo iOS 27, con reloj gigante, mapa mundial, vinilo con letras sincronizadas, calendario y "faltan X días" | `web27/` | `Launcher-27.apk` |
| **Aura**: estilo HyperOS 3 futurista con cristal holográfico 3D (bordes iridiscentes, inclinación 3D, reloj con anillos, rejilla y partículas): widgets de cristal, brillo en los íconos, inclinación (giroscopio), carpetas líquidas, transiciones Deslizar/Profundidad/Cubo, 6 fondos generados + tu foto, J.A.R.V.I.S., noticias y gestos | `webaura/` | `Aura.apk` |
| **Launcher CY**: estilo KLWP, con cabecera negra y esquina doblada, reloj, calendario, música y clima | `web/` | `Launcher-CY.apk` |

Son apps distintas: puedes instalar las dos y elegir cuál usar como inicio.

---

## Descargar e instalar (APK)

➡️ **[Descargar la última versión](../../releases/latest)**: elige `Aura.apk`, `Launcher-27.apk` o `Launcher-CY.apk` (se pueden instalar las tres a la vez).

1. Abre el APK en el celular. Si te pide permiso, activa **"Permitir de esta fuente"**.
2. Abre el launcher. Te pedirá hacerlo tu pantalla de inicio; toca **OK** y elígelo.
   - También se hace en: **Ajustes → Apps → Apps predeterminadas → App de inicio**.
3. Para volver al de Xiaomi, elige **Inicio del sistema** en ese mismo menú.

Cada vez que se sube un cambio a `main`, GitHub compila los APK solo. Cada APK nuevo se instala encima del anterior y conserva tus datos.

### Gestos de navegación (pantalla completa)
HyperOS apaga sus gestos cuando el launcher no es el de Xiaomi, así que los dos launchers traen **sus propios gestos**, que funcionan en todas las apps:

| Gesto | Acción |
|---|---|
| Deslizar desde el borde izquierdo o derecho | Atrás |
| Deslizar hacia arriba desde abajo | Inicio |
| Deslizar hacia arriba y mantener | Apps recientes |
| Deslizar de lado sobre la barra de abajo | App anterior |
| Deslizar hacia abajo arriba del launcher | Notificaciones |

**Zona inferior:** en modo **Cubrir** (por defecto) la barra de gestos tapa los 3 botones, así deslizas desde el borde de abajo como en los gestos de Xiaomi; un toque sobre la barra sigue usando el botón que está debajo (elige el orden de tus botones). La flecha de Atrás sigue al dedo y las zonas laterales se apartan cuando aparece el teclado.

**Activarlos:** en el launcher toca **Configurar gestos** (o Ajustes → Gestos) → **Activar gestos** → Apps instaladas → *Gestos de navegación* → activar.
- Si aparece **"Ajuste restringido"**: Info de la app → ⋮ → **Permitir ajustes restringidos**, y repite.
- En Info de la app activa **Inicio automático** y **Batería → Sin restricciones**.

**Ocultar los 3 botones (opcional, una sola vez):** concede este permiso por ADB (computador o depuración inalámbrica):
```
adb shell pm grant com.cy.launcher27 android.permission.WRITE_SECURE_SETTINGS
adb shell pm grant com.cy.launcher android.permission.WRITE_SECURE_SETTINGS
```
Luego activa **Ocultar botones** en la pantalla de gestos.

### Funciones de Launcher CY (APK)
- **Inicio:** info del dispositivo real (con tiempo de batería restante), accesos rápidos (linterna, Wi-Fi, datos, Bluetooth, sonido, pantalla) y 10 íconos.
- **Cajón de apps a pantalla completa:** se abre con el ícono de cuadritos, con *Todas las apps* o deslizando hacia arriba sobre los íconos. Orden A–Z, buscador, barra de letras, apps ocultas; se cierra deslizando hacia abajo.
- **Mantén presionada una app** (en inicio o en el cajón): accesos directos de la app, Abrir, Agregar a inicio / Cambiar ícono, Info, Notificaciones, Compartir app, Compartir enlace, Play Store, Renombrar, Ocultar y Desinstalar.
- Las páginas siguen al dedo al deslizar; animaciones al entrar, reloj animado, zoom al abrir apps y vibración.

### Aura v1.8: estilo Hacker HUD (nuevo, predeterminado)
- Recreado del tema "Hacker / Stark Industries": marcos HUD naranjas con esquinas cortadas sobre niebla turquesa.
- **Principal**: cobertura global (mapa mundial con radar en tu ubicación, clima y coordenadas), celdas de **energía** brillantes según tu batería (se animan al cargar), diagnóstico real del sistema (CPU, MHz, temperatura, autonomía, RAM, almacenamiento, fecha), botones **ACCESS** (cajón) y **ONLINE** (J.A.R.V.I.S.), tarjeta con núcleo animado.
- **CLASSIFIED**: barra de carga, calendario tipo tambor deslizable, BUSCAR APPS, núcleo con cable y tus apps en cajas azules.
- **Media**: casete con carretes que giran al sonar música (toca para pausar/cambiar) y noticias con imagen, contador "01" y ATRÁS / SIGUIENTE.
- Arranque con terminal hacker (CARGANDO → COMPLETO → ACCESO CONCEDIDO), 5 colores de HUD; el estilo Holo sigue disponible en Ajustes.

### Aura v1.7
- **Inicio estilo HyperOS 3**: reloj crema con borde punteado que se llena con los minutos, clima de cristal, 4 columnas, píldora de búsqueda con orbe de J.A.R.V.I.S., dock de cristal y puntos de página.
- **Página 2**: música (lo que suena en cualquier app), batería en anillo y próximo evento.
- **Efectos**: brillo del color de cada ícono, inclinación del fondo y los widgets con el giroscopio, carpetas líquidas, transiciones Deslizar / Profundidad / Cubo.
- **Editar inicio**: mantén presionado un espacio vacío → los íconos tiemblan; arrastra para ordenar, suelta una app sobre otra para crear una carpeta o llévala al dock. Cancelar / ⚙ / Hecho.
- **Ajustes de pantalla de inicio**: transiciones, etiquetas, carpeta líquida, brillo, inclinación, 6 fondos + tu foto (y aplicarlo al fondo del sistema), 8 colores, widgets, tamaño de íconos, columnas.
- Desliza **arriba** = cajón A–Z de cristal; **derecha** = noticias; **abajo** = notificaciones; mantener un ícono = menú (desinstalar, compartir, info, accesos directos…).
- Pantalla completa sin barras, gestos de navegación propios, bajo consumo (se pausa en segundo plano).

### Novedades de Launcher 27 v1.6
- **Estilo Neo (futurista):** fondo oscuro con brillo de color, rejilla y esquinas tipo HUD, tarjeta de vidrio, degradados en 8 combinaciones modernas (cian/azul, violeta/rosa, menta/cian, ámbar/naranja…), reloj con brillo neón. El estilo **Clásico** del video sigue disponible en Ajustes.
- **Detalles del video que faltaban:** línea con el ícono de la pestaña bajo la barra, CPU en porcentaje, "• • •" en Info del dispositivo, letras anterior/siguiente en gris, etiqueta vertical y número de pista en el vinilo.
- **J.A.R.V.I.S.:** asistente de voz. Se abre con el orbe de la barra "Pregunta algo", manteniendo presionada la barrita de gestos o escribiendo en la barra.
  - Sin internet ni claves entiende: hora y fecha, clima de hoy o mañana, batería, RAM y almacenamiento, "abre [app]", "llama a [contacto]", "envía un mensaje a [contacto] que diga…" (WhatsApp), "alarma a las 6:30", "temporizador de 5 minutos", "recuérdame … mañana a las 3", "¿qué tengo hoy?", noticias, música (pausa, siguiente, pon una canción), volumen, linterna, "llévame a…", buscar en Google, YouTube o Spotify, foto, cálculos, cambiar color o estilo, chistes.
  - Preguntas abiertas: responde con Wikipedia; con una clave propia de **Gemini** (gratis) o **Claude** responde con IA y conoce tu contexto (hora, clima, batería, agenda). La clave queda solo en el celular.
  - Elige la voz en Ajustes → J.A.R.V.I.S.

### Novedades de Launcher 27 v1.5
- **Animaciones del video:** al cambiar de pestaña todo se desvanece y la nueva pestaña se arma por partes. El reloj sube desde abajo, aparecen los colores, luego la info y la batería se llena barra por barra. El mapa aparece con desenfoque, los íconos saltan en cascada y las franjas se deslizan. El vinilo llega girando, la letra aparece inclinada en amarillo y el álbum en blanco. Las barras de eventos se pintan de izquierda a derecha. Al cambiar de color también se tiñen los íconos, la batería y el aro de la foto.
- **Noticias estilo Nova:** en Inicio, desliza hacia la derecha y el panel sigue tu dedo. Muestra Google News de Colombia por temas (Para ti, Colombia, Mundo, Economía, Tecnología, Deportes, Entretenimiento, Ciencia, Salud) y BBC Mundo con fotos. Desliza hacia abajo para actualizar y hacia la izquierda (o atrás) para cerrar. Tocar abre la noticia en una pestaña rápida con el color del tema; mantener presionado la comparte.
- **Ahorro de energía:** con el launcher en segundo plano se pausan JavaScript y las animaciones. La música se actualiza por eventos, sin consultar cada segundo. El reloj se actualiza una vez por minuto, y las animaciones infinitas solo corren cuando se ven. La batería se lee cada 20 s.
- **Cajón más veloz:** el desplazamiento no espera a JavaScript, las sombras son ligeras y no se dibujan las secciones fuera de la pantalla.

### Funciones de Launcher 27 (APK)
- **Inicio:** reloj gigante (tócalo para abrir alarmas), modelo, Android y HyperOS, procesador, RAM y almacenamiento reales, y batería con nivel, temperatura y tiempo restante. Los puntos de color cambian el tema.
- **Inicio** también tiene accesos rápidos (linterna, Wi-Fi, datos, Bluetooth, sonido, pantalla) y widgets de clima, próximo evento y lo que suena.
- **Apps:** 10 favoritas, cajón con todas tus apps en orden A–Z con buscador y barra de letras, y el mapa con tu ubicación. Las apps abren con animación de zoom.
- **Mantén presionada una app** para ver: sus accesos directos (p. ej. *Nuevo chat*), Abrir, Agregar a favoritos / Cambiar ícono, Info de la app, Notificaciones, Compartir app (APK), Compartir enlace, Ver en Play Store, Renombrar, Ocultar del cajón y Desinstalar.
- Desliza con el dedo entre las 4 páginas; la página sigue tu dedo.
- **Música:** muestra y controla lo que suena en **Spotify, YouTube Music, etc.**, con carátula en el vinilo y **letra sincronizada** (LRCLIB). Necesita "acceso a notificaciones"; la app te lleva a activarlo. También reproduce canciones guardadas en el celular.
- **Calendario:** eventos de **tu calendario de Google o del celular** (con permiso) y los que agregues en la app, con "faltan X días".
- **Pregunta algo…:** busca entre tus apps; con Enter busca en Google.
- **Tu foto** abre los ajustes: nombre, foto, color, idioma (ES/EN/ID/PT), ubicación, 12/24 h y °C/°F.

### Compilar con Android Studio
1. `File → Open` → carpeta **`android/`**.
2. Abajo a la izquierda, en **Build Variants**, elige `ios27Release` o `kustomRelease`.
3. `Build → Build APK(s)`, o conecta el celular y dale ▶ Run.

---

## Versión web

Se publica con GitHub Pages (activa *Settings → Pages → Source: GitHub Actions*):

- Launcher 27: **https://zaiddia.github.io/Launcher-apk/ios27/**
- Aura: **https://zaiddia.github.io/Launcher-apk/aura/**
- Launcher CY: **https://zaiddia.github.io/Launcher-apk/**

Ábrela en Chrome → ⋮ → **Instalar app**. La versión web no puede controlar Spotify, leer tu calendario ni ser la pantalla de inicio del sistema; para eso usa el APK.

---

## Estructura
```
web27/      Interfaz Launcher 27 (HTML/CSS/JS, mapa y fuentes incluidas)
webaura/    Interfaz Aura (generada con tools/aura/build.py)
web/        Interfaz Launcher CY
android/    Proyecto Android Studio (WebView + funciones nativas), 2 variantes
.github/    Compilación automática de APKs y publicación web
```

Créditos: clima de [Open-Meteo](https://open-meteo.com), letras de [LRCLIB](https://lrclib.net), mapa de [Natural Earth](https://www.naturalearthdata.com) (dominio público), fuentes Anton y Barlow (SIL OFL).

**Nota:** la llave de firma `android/app/launcher-cy.keystore` está en el repositorio para que las compilaciones automáticas se puedan actualizar entre sí. Es para uso personal.
