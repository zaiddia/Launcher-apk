# Launcher CY

Pantalla de inicio para Android inspirada en los temas estilo KLWP: cabecera negra con esquina doblada, reloj y saludo, calendario y eventos, reproductor de música con vinilo, clima en tiempo real, 10 colores y 7 idiomas. Optimizada para el **Redmi Note 13 Pro+ 5G**.

Hay **dos versiones**, y las dos usan la misma interfaz (carpeta `web/`):

| | APK (recomendada) | Web (PWA) |
|---|---|---|
| Se usa como pantalla de inicio del sistema | ✅ | ❌ |
| Abre cualquier app instalada | ✅ directo | ⚠️ por enlaces |
| Cajón con todas tus apps e íconos reales | ✅ | ❌ |
| RAM, almacenamiento, procesador y HyperOS reales | ✅ | ⚠️ parcial |
| Clima, calendario, música, ajustes | ✅ | ✅ |

---

## 1. Versión APK

### Descargar
Cada vez que se sube un cambio a `main`, GitHub compila el APK solo.

➡️ **[Descargar la última versión](../../releases/latest)** → toca `Launcher-CY.apk`.

### Instalar en el Redmi Note 13 Pro+
1. Abre el APK descargado. Si pide permiso, activa **"Permitir de esta fuente"** para Chrome o el gestor de archivos.
2. Abre **Launcher CY**. Te pedirá hacerlo tu pantalla de inicio; toca **OK** y elige **Launcher CY**.
   - También se hace en: **Ajustes → Apps → Apps predeterminadas → App de inicio → Launcher CY**.
3. Para volver al launcher de Xiaomi, elige **Inicio del sistema** en ese mismo menú.

> Cada APK nuevo se instala encima del anterior (misma firma) y conserva tus datos.

### Uso
- **Barra inferior** o **deslizar** izquierda/derecha: Inicio, Calendario, Música, Clima.
- **Ícono ⚙** o tocar tu foto: colores, barra de navegación, idioma, perfil, °C/°F.
- **Mantener presionado un ícono**: cambiarlo por cualquier app instalada o por un ícono del tema.
- **Ícono de cuadritos**: cajón con todas tus apps (con buscador).
- **Música**: toca **+** y elige canciones del celular; quedan guardadas.
- **Clima**: la primera vez pide ubicación (o busca tu ciudad).

### Compilar con Android Studio
1. `File → Open` → elige la carpeta **`android/`**.
2. Espera a que termine el *Gradle Sync*.
3. `Build → Build App Bundle(s) / APK(s) → Build APK(s)`, o conecta el celular por USB y dale ▶ Run.

---

## 2. Versión web

Se publica automáticamente con GitHub Pages:

➡️ **https://zaiddia.github.io/Launcher-apk/**

Ábrela en Chrome → menú ⋮ → **Instalar app** o **Agregar a pantalla principal**.

---

## Estructura

```
web/        Interfaz (HTML/CSS/JS), la usan las dos versiones
android/    Proyecto Android Studio (WebView + funciones nativas)
.github/    Compilación automática del APK y publicación web
```

Datos del clima: [Open-Meteo](https://open-meteo.com). Ubicación por nombre: BigDataCloud.

**Nota:** la llave de firma `android/app/launcher-cy.keystore` está en el repositorio para que las compilaciones automáticas se puedan actualizar entre sí. Sirve para uso personal; para publicar en Play Store crea una llave privada propia.
