# Tema «Aura Hacker» para HyperOS + J.A.R.V.I.S.

Con este tema usas el **launcher original de HyperOS**. Así funcionan los gestos del sistema, se gasta menos batería y todo va más fluido. El estilo hacker queda en la pantalla de bloqueo, los íconos y los fondos. **J.A.R.V.I.S.** queda como una app aparte.

## Qué incluye `Aura-Hacker.mtz`
- **Pantalla de bloqueo HUD animada** (MAML):
  - celdas de energía con tu batería real, que se animan al cargar;
  - reloj hora · min · seg en losas de colores;
  - fecha, próxima alarma, llamadas perdidas y SMS sin leer;
  - mapa con radar;
  - núcleo de J.A.R.V.I.S. (tócalo para hablarle);
  - ACCESS abre la cámara, LOGIN desbloquea, y también se desbloquea deslizando hacia arriba.
- **Íconos** en cajas azules con la línea verde.
- **Fondo** Cyber para el inicio y el bloqueo.

## 1) Instalar J.A.R.V.I.S.
1. Instala `JARVIS.apk` (desde Releases).
2. Ábrelo una vez y concede el micrófono (y contactos o teléfono si quieres que llame).
3. Hazlo tu asistente: **Ajustes → Apps → Administrar apps → ⋮ → Apps predeterminadas → Asistente digital** (o «App de asistencia») → **J.A.R.V.I.S.**
4. Para abrirlo:
   - con el gesto o botón de asistente (en algunos HyperOS: *Ajustes → Configuración adicional → Atajos de gestos → Iniciar asistente*);
   - con su ícono;
   - con el núcleo de la pantalla de bloqueo.

## 2) Volver al launcher de HyperOS
**Ajustes → Apps → Administrar apps → ⋮ → Apps predeterminadas → Pantalla de inicio → Launcher del sistema.**
Aura sigue instalado por si quieres volver a usarlo.

## 3) Instalar el tema `.mtz`
HyperOS **global** no deja importar temas propios de forma directa. Prueba en este orden:

**A. Importar desde la app Temas** (ROM china, xiaomi.eu y algunas regiones)
1. Copia `Aura-Hacker.mtz` a la memoria del teléfono (por ejemplo, a *Descargas*).
2. Abre **Temas → Perfil / Mi cuenta → Temas → baja hasta el final → Importar**.
3. Elige `Aura-Hacker.mtz` y toca **Aplicar**.

**B. Si no aparece «Importar»**
- Algunas guías dicen que aparece al cambiar la región a **India** (*Ajustes → Configuración adicional → Región*). Después de aplicar el tema puedes volver a Colombia, aunque en ese caso el tema podría desaparecer.
- Otra opción es la app de temas china clonada (método «Enable Import Option»). Es más complicado.

**C. Si el tema se quita solo a los 30–60 segundos**
HyperOS restablece los temas que no vienen de la tienda. Hay apps que lo evitan (por ejemplo, Zyper). Son de terceros: úsalas bajo tu responsabilidad.

**D. Aplicar solo partes**
En *Temas → Personalizar* puedes aplicar solo la **pantalla de bloqueo**, solo los **íconos** o solo el **fondo**.

## Notas
- Probado en un simulador, **no en un teléfono real**. El formato MAML puede variar entre versiones de HyperOS. Si algo no se ve bien, envía una captura y se ajusta.
- Para regenerar el tema: `python3 theme/build_theme.py` → `theme/out/Aura-Hacker.mtz`.
