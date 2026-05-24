#!/usr/bin/env node
/**
 * Genera los PNG necesarios para PWA y Android desde public/icon.svg.
 *
 * Requiere: sharp (se instala automáticamente)
 *   npm install --no-save sharp
 *
 * Uso:
 *   npm run iconos
 *
 * Genera:
 *   public/icon-192.png   (PWA)
 *   public/icon-512.png   (PWA)
 *   public/favicon.ico    (Tab del navegador)
 *   resources/icon.png    (1024x1024 para Capacitor)
 *   resources/splash.png  (2732x2732 para Capacitor)
 */

import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Cargar sharp dinámicamente (puede no estar instalado)
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('❌ Falta el paquete `sharp`. Instálalo con:');
  console.error('   npm install --no-save sharp\n');
  process.exit(1);
}

const svgPath = join(ROOT, 'public', 'icon.svg');
if (!existsSync(svgPath)) {
  console.error(`❌ No encuentro ${svgPath}`);
  process.exit(1);
}
const svg = readFileSync(svgPath);

const publicDir = join(ROOT, 'public');
const resourcesDir = join(ROOT, 'resources');
mkdirSync(resourcesDir, { recursive: true });

const tareas = [
  { out: join(publicDir, 'icon-192.png'),     size: 192 },
  { out: join(publicDir, 'icon-512.png'),     size: 512 },
  { out: join(publicDir, 'favicon-32.png'),   size: 32 },
  { out: join(resourcesDir, 'icon.png'),      size: 1024 },
  // Splash con padding (icono centrado sobre fondo)
  { out: join(resourcesDir, 'splash.png'),    size: 2732, splash: true },
];

console.log('🎨 Generando iconos desde public/icon.svg...\n');

for (const t of tareas) {
  if (t.splash) {
    // Splash: icono de 1024 centrado sobre fondo 2732x2732 azul
    const iconBuf = await sharp(svg).resize(1024, 1024).png().toBuffer();
    await sharp({
      create: {
        width: 2732, height: 2732, channels: 4,
        background: { r: 26, g: 35, b: 126, alpha: 1 },  // azul Mundial
      },
    })
      .composite([{ input: iconBuf, gravity: 'center' }])
      .png()
      .toFile(t.out);
  } else {
    await sharp(svg).resize(t.size, t.size).png().toFile(t.out);
  }
  console.log(`  ✓ ${t.out.replace(ROOT + '/', '')} (${t.size}x${t.size})`);
}

console.log('\n✅ Listo.');
console.log('\n👉 Próximos pasos para Capacitor Android:');
console.log('   1. npm install --save-dev @capacitor/assets');
console.log('   2. npx capacitor-assets generate --android');
console.log('   Esto regenera iconos y splash en todas las densidades.\n');
