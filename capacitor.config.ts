import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mundial2026.app',
  appName: 'Mundial 2026',
  webDir: 'build',
  bundledWebRuntime: false,

  server: {
    androidScheme: 'https',
    // Para desarrollo: descomenta para apuntar al servidor de Ionic en tu PC
    // url: 'http://192.168.1.100:8100',
    // cleartext: true,
  },

  android: {
    // Permite usar HTTP en desarrollo (no afecta a HTTPS de producción)
    allowMixedContent: false,
    // Captura los logs de la WebView en logcat
    captureInput: true,
    // Tema oscuro/claro según el sistema
    webContentsDebuggingEnabled: false,
  },

  plugins: {
    /**
     * CapacitorHttp intercepta fetch() y XMLHttpRequest, los enruta al
     * stack HTTP nativo de Android/iOS, y por tanto SALTA CORS.
     * Imprescindible para football-data.org y otras APIs que no envían
     * cabeceras Access-Control-Allow-Origin.
     * Solo afecta a builds nativos (APK/IPA) — no a `ionic serve`.
     */
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1a237e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1a237e',
    },
  },
};

export default config;
