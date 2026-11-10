# Launchers para Android

Dos pantallas de inicio para Android, optimizadas para el **Redmi Note 13 Pro+ 5G**. Cada una existe como **APK** (launcher nativo) y como **versión web**.

| Tema | Carpeta | APK |
|---|---|---|
| **Launcher 27**: estilo iOS 27, con reloj gigante, mapa mundial, vinilo con letras sincronizadas, calendario y "faltan X días" | `web27/` | `Launcher-27.apk` |
| **Launcher CY**: estilo KLWP, con cabecera negra y esquina doblada, reloj, calendario, música y clima | `web/` | `Launcher-CY.apk` |

Son apps distintas: puedes instalar las dos y elegir cuál usar como inicio.

---

## Descargar e instalar (APK)

➡️ **[Descargar la última versión](../../releases/latest)**: elige `Launcher-27.apk` o `Launcher-CY.apk`.

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

**Activarlos:** en el launcher toca **Configurar gestos** (o Ajustes → Gestos) → **Activar gestos** → Apps instaladas → *Gestos de navegación* → activar.
- Si aparece **"Ajuste restringido"**: Info de la app → ⋮ → **Permitir ajustes restringidos**, y repite.
- En Info de la app activa **Inicio automático** y **Batería → Sin restricciones**.

**Ocultar los 3 botones (opcional, una sola vez):** concede este permiso por ADB (computador o depuración inalámbrica):
```
adb shell pm grant com.cy.launcher27 android.permission.WRITE_SECURE_SETTINGS
adb shell pm grant com.cy.launcher android.permission.WRITE_SECURE_SETTINGS
```
Luego activa **Ocultar botones** en la pantalla de gestos.

### Funciones de Launcher 27 (APK)
- **Inicio:** reloj gigante (tócalo para abrir alarmas), modelo, Android y HyperOS, procesador, RAM y almacenamiento reales, y batería con nivel, temperatura y tiempo restante. Los puntos de color cambian el tema.
- **Apps:** 10 favoritas (mantén presionado un ícono para cambiarlo), todas tus apps instaladas y el mapa con tu ubicación.
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
- Launcher CY: **https://zaiddia.github.io/Launcher-apk/**

Ábrela en Chrome → ⋮ → **Instalar app**. La versión web no puede controlar Spotify, leer tu calendario ni ser la pantalla de inicio del sistema; para eso usa el APK.

---

## Estructura
```
web27/      Interfaz Launcher 27 (HTML/CSS/JS, mapa y fuentes incluidas)
web/        Interfaz Launcher CY
android/    Proyecto Android Studio (WebView + funciones nativas), 2 variantes
.github/    Compilación automática de APKs y publicación web
```

Créditos: clima de [Open-Meteo](https://open-meteo.com), letras de [LRCLIB](https://lrclib.net), mapa de [Natural Earth](https://www.naturalearthdata.com) (dominio público), fuentes Anton y Barlow (SIL OFL).

**Nota:** la llave de firma `android/app/launcher-cy.keystore` está en el repositorio para que las compilaciones automáticas se puedan actualizar entre sí. Es para uso personal.
