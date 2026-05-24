# 📱 Cómo instalar la app en Android

Tienes **3 caminos**, de más rápido a más profesional. Elige el que te convenga.

---

## 🚀 Opción 1 — PWA (lo más rápido, 2 minutos, sin instalar nada)

Esto convierte la web en una app instalable. **No genera APK** pero queda igual
en el cajón de apps del Android, con su icono, pantalla completa, etc.

### Pasos

1. En tu PC, arranca el servidor: `ionic serve`
2. Apunta tu PC y tu Android a la **misma red WiFi**
3. Mira la IP local de tu PC:
   ```bash
   # macOS / Linux
   ipconfig getifaddr en0
   # Windows
   ipconfig | findstr IPv4
   ```
4. En el Chrome del teléfono, abre `http://TU_IP:8100` (ej. `http://192.168.1.50:8100`)
5. Chrome mostrará un banner **"Añadir a pantalla de inicio"**. Acéptalo.
6. ✅ La app queda instalada como cualquier otra.

### Limitaciones
- Necesita conexión la primera vez
- Para producción real conviene servirla desde HTTPS (puedes usar [Vercel](https://vercel.com) o [Netlify](https://netlify.com) gratis)

---

## ☁️ Opción 2 — GitHub Actions (build en la nube, sin Android Studio)

Esta es **la opción recomendada** si no quieres instalar Android Studio.
Un servidor de GitHub genera el APK por ti y te lo da listo para descargar.

### Pasos (una sola vez)

1. **Sube el proyecto a GitHub**:
   ```bash
   cd /Users/admin/Documents/mundial
   git init
   git add .
   git commit -m "Mundial 2026 app"
   # Crea repo nuevo en github.com y luego:
   git remote add origin https://github.com/TU_USUARIO/mundial-2026.git
   git push -u origin main
   ```

2. **GitHub detecta automáticamente** el workflow en `.github/workflows/build-android.yml` y empieza a compilar.

3. Ve a tu repo en GitHub → pestaña **"Actions"** → verás un workflow corriendo (tarda ~5-10 min la primera vez).

4. Cuando termine (✅ verde), entra al run y baja al final → sección **"Artifacts"** → descarga **`mundial-2026-debug-apk`**.

5. Descomprime el ZIP, dentro está `app-debug.apk`. Cópialo a tu teléfono y ábrelo para instalar.

### Cada vez que actualices código

Cada `git push` regenera el APK automáticamente. Tu APK siempre estará actualizado.

### Para versión "release" (publicable)

```bash
git tag v1.0.0
git push origin v1.0.0
```

Esto genera un APK release (sin firmar) y crea una **Release** en GitHub con el APK adjunto.

---

## 🛠️ Opción 3 — Build local con script (la profesional)

Si quieres compilar en tu Mac directamente. Es más rápido para iterar, pero
requiere instalar Java y Android.

### Requisitos previos (una sola vez, ~30 minutos)

1. **Node.js 18+**: https://nodejs.org/ → descarga el `.pkg` LTS para macOS

2. **JDK 17** (Eclipse Temurin recomendado):
   ```bash
   # Si tienes Homebrew:
   brew install --cask temurin@17
   ```
   O descarga desde https://adoptium.net/

3. **Android Studio**: https://developer.android.com/studio
   - Al instalar, deja que descargue el SDK por defecto
   - Una vez instalado: abre Android Studio → More Actions → SDK Manager
   - Asegúrate de tener:
     - **Android 14 (API 34)** o superior, marcado
     - **Android SDK Build-Tools 34.0.0** o superior
     - **Android SDK Command-line Tools (latest)**

4. **Variables de entorno**: añade al `~/.zshrc` (macOS) o `~/.bashrc`:
   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"
   ```
   Recarga: `source ~/.zshrc`

### Generar el APK

```bash
cd /Users/admin/Documents/mundial

# La primera vez (instala todo y compila)
npm install --legacy-peer-deps
npm run android

# Las siguientes veces (mucho más rápido)
npm run android
```

Genera el archivo **`mundial-2026-debug.apk`** en la raíz del proyecto.

### Comandos disponibles

```bash
npm run android            # Build APK debug (instalable directamente)
npm run android:release    # Build APK release (sin firmar - para publicar)
npm run android:limpio     # Borra todo y vuelve a compilar desde cero
npm run android:abrir      # Abre el proyecto en Android Studio
```

### Instalar el APK en tu teléfono

**Vía USB con ADB** (rápido):
1. Activa **Opciones de desarrollador** en tu Android (toca 7 veces "Número de compilación" en Ajustes → Acerca del teléfono)
2. Activa **Depuración USB** dentro de Opciones de desarrollador
3. Conecta el teléfono por USB
4. Acepta el aviso de "Permitir depuración" en el teléfono
5. ```bash
   adb install -r mundial-2026-debug.apk
   ```

**Vía archivo** (sin USB):
1. Copia `mundial-2026-debug.apk` al teléfono (Drive, AirDrop, email...)
2. Abre el archivo desde el teléfono
3. Acepta "Instalar de orígenes desconocidos" si Android lo pide
4. Listo

---

## 🎨 Generar los iconos (opcional, pero recomendado)

Antes de cualquiera de las 3 opciones, genera los iconos de la app desde el SVG:

```bash
npm run iconos
```

Esto crea:
- `public/icon-192.png` (PWA)
- `public/icon-512.png` (PWA)
- `public/favicon-32.png` (tab del navegador)
- `resources/icon.png` (1024x1024 para Capacitor)
- `resources/splash.png` (2732x2732 splash de Android)

Después, si vas a generar el APK, regenera los recursos nativos:

```bash
npm install --save-dev @capacitor/assets
npx capacitor-assets generate --android
```

Esto genera todos los tamaños que Android necesita (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi, splash en todas las orientaciones, etc.) automáticamente.

---

## 🆘 Errores comunes

### `SDK location not found`
Falta `ANDROID_HOME`. Mira la sección "Variables de entorno" arriba.

### `Java version 11 detected, required 17`
Tienes una versión vieja de Java. Instala JDK 17:
```bash
brew install --cask temurin@17
```

### `Could not find tools.jar`
JDK incompleto. Reinstala con `brew install --cask temurin@17`.

### `npm error ERESOLVE`
Resuelto: el proyecto ya tiene `.npmrc` con `legacy-peer-deps=true`. Si aún falla:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### `Gradle build failed`
Casi siempre es por SDK desactualizado. Abre Android Studio → SDK Manager → actualiza todo.

### El APK pesa demasiado (>50 MB)
Lo normal son ~15-25 MB. Si pesa más, revisa que no estés incluyendo source maps:
```bash
# Edita .env.production
GENERATE_SOURCEMAP=false
```

---

## 📐 Tamaños esperados

| Tipo | Tamaño aproximado | Notas |
|------|-------------------|-------|
| APK debug | 15-20 MB | Para pruebas, instala en cualquier Android 7+ |
| APK release sin firmar | 12-18 MB | Para publicar — hay que firmarlo después |
| AAB (Google Play) | 8-12 MB | Solo lo necesitas si subes a Google Play |

---

## 🎯 Mi recomendación

- **Solo quiero ver la app en mi móvil** → **Opción 1 (PWA)**, 2 minutos
- **Quiero compartir el APK con amigos** → **Opción 2 (GitHub Actions)**, 30 min la primera vez
- **Voy a iterar mucho y desarrollar** → **Opción 3 (local)**, 1 hora la primera vez
