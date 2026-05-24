#!/bin/bash
# ===================================================================
# Build automático del APK Android para Mundial 2026.
#
# Requisitos previos:
#   - Node.js 18+              (https://nodejs.org)
#   - Java JDK 17              (https://adoptium.net/)
#   - Android Studio o solo SDK Command-Line Tools
#   - Variable ANDROID_HOME apuntando al SDK de Android
#
# Uso:
#   ./scripts/build-android.sh                  # APK debug (instalable)
#   ./scripts/build-android.sh release          # APK release sin firmar
#   ./scripts/build-android.sh limpio           # Borra android/ y recompila
# ===================================================================

set -e  # detener al primer error

# Colores para los mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

paso() { echo -e "\n${BLUE}▶ $1${NC}"; }
ok()   { echo -e "${GREEN}✓ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✗ $1${NC}" >&2; exit 1; }

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
MODO="${1:-debug}"

# ===================================================================
# 1. Verificar herramientas
# ===================================================================
paso "Verificando entorno..."

command -v node >/dev/null 2>&1 || err "Node.js no instalado. Descarga desde https://nodejs.org"
ok "Node $(node --version) detectado"

command -v npm >/dev/null 2>&1 || err "npm no encontrado"
ok "npm $(npm --version) detectado"

command -v java >/dev/null 2>&1 || err "Java JDK no instalado. Descarga JDK 17 desde https://adoptium.net"
JAVA_VER=$(java -version 2>&1 | head -1 | awk -F '"' '{print $2}')
ok "Java $JAVA_VER detectado"

if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
  warn "ANDROID_HOME no está definido."
  warn "Si Android Studio está instalado, prueba:"
  warn '   export ANDROID_HOME="$HOME/Library/Android/sdk"   # macOS'
  warn '   export ANDROID_HOME="$HOME/Android/Sdk"           # Linux'
  warn '   export ANDROID_HOME="$LOCALAPPDATA/Android/Sdk"   # Windows (Git Bash)'
  read -p "¿Continuar de todos modos? [y/N] " resp
  [ "$resp" != "y" ] && exit 1
else
  ok "Android SDK: ${ANDROID_HOME:-$ANDROID_SDK_ROOT}"
fi

# ===================================================================
# 2. Limpiar si se pidió
# ===================================================================
if [ "$MODO" = "limpio" ]; then
  paso "Modo limpio: borrando android/, node_modules/, build/..."
  rm -rf android node_modules build package-lock.json
  ok "Carpetas borradas"
  MODO="debug"
fi

# ===================================================================
# 3. Instalar dependencias
# ===================================================================
if [ ! -d "node_modules" ]; then
  paso "Instalando dependencias npm..."
  npm install --legacy-peer-deps
  ok "Dependencias instaladas"
else
  ok "node_modules ya existe"
fi

# ===================================================================
# 4. Compilar la app React
# ===================================================================
paso "Compilando React → carpeta build/..."
npm run build
ok "Build de React listo"

# ===================================================================
# 5. Añadir plataforma Android (solo primera vez)
# ===================================================================
if [ ! -d "android" ]; then
  paso "Añadiendo plataforma Android (primera vez)..."
  npx cap add android
  ok "Plataforma Android añadida"
else
  ok "Plataforma Android ya existente"
fi

# ===================================================================
# 6. Sincronizar build/ con el proyecto Android
# ===================================================================
paso "Sincronizando assets web → proyecto Android..."
npx cap sync android
ok "Sync completado"

# ===================================================================
# 7. Generar el APK con Gradle
# ===================================================================
cd android

if [ "$MODO" = "release" ]; then
  paso "Generando APK RELEASE (sin firmar)..."
  ./gradlew assembleRelease --no-daemon
  APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
  TIPO="release"
else
  paso "Generando APK DEBUG..."
  ./gradlew assembleDebug --no-daemon
  APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
  TIPO="debug"
fi

cd "$ROOT"

# ===================================================================
# 8. Copiar APK a la raíz para fácil acceso
# ===================================================================
if [ -f "android/$APK_PATH" ]; then
  DEST="mundial-2026-${TIPO}.apk"
  cp "android/$APK_PATH" "$DEST"
  TAM=$(du -h "$DEST" | cut -f1)

  echo ""
  echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}  ✅ APK GENERADO CORRECTAMENTE${NC}"
  echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "📦 Archivo:  ${BLUE}$DEST${NC} (${TAM})"
  echo -e "📍 Ruta:     $ROOT/$DEST"
  echo ""
  echo "📲 Para instalarlo en tu teléfono Android:"
  echo "   1. Cópialo al teléfono (USB, AirDrop, email...)"
  echo "   2. En el teléfono, abre el archivo .apk"
  echo "   3. Acepta 'Instalar de orígenes desconocidos' si Android lo pide"
  echo ""
  echo "🔌 O con el teléfono conectado por USB (modo desarrollador):"
  echo "   adb install -r $DEST"
  echo ""
else
  err "No se encontró el APK en android/$APK_PATH"
fi
