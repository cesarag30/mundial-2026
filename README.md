# Mundial 2026 — App Ionic React

App móvil oficial-fan para el **Mundial FIFA 2026** (USA · Canadá · México).
Construida con Ionic + React + TypeScript, lista para Android, iOS y web.

## ⚡ Características

| Pantalla | Qué hace |
|----------|----------|
| **Equipos** | Las 48 selecciones agrupadas en 12 grupos (A–L). Cada equipo abre su ficha con plantilla convocada, banderas, club de cada jugador y dorsales. |
| **Calendario** | Los 104 partidos (72 grupos + 32 eliminatorias) con fecha, hora local del estadio, ciudad y sede. Filtro por fase. |
| **Quiniela** | Introduces tu marcador para cada partido y se compara con el oficial. Suma puntos: **3 por marcador exacto**, **1 por acertar ganador o empate**. Persistencia en localStorage. |
| **Torneo** | Tabla de los 12 grupos con clasificación calculada en vivo + **bracket gráfico** de eliminatorias hasta la final. |
| **Campeón** | Cuando se juega la final, muestra a la selección campeona con bandera gigante, recorrido completo desde dieciseisavos y plantilla. |

## 📂 Estructura del proyecto

```
mundial/
├── package.json                  Dependencias Ionic + React + Capacitor
├── tsconfig.json
├── ionic.config.json
├── capacitor.config.ts           Config para Android / iOS
├── public/
│   ├── index.html
│   └── manifest.json
└── src/
    ├── index.tsx                 Punto de entrada React
    ├── App.tsx                   Tabs + routing
    ├── theme/variables.css       Tema USA/Canadá/México
    ├── context/
    │   └── QuinielaContext.tsx   Estado global y cálculo de puntos
    ├── data/
    │   ├── teams.ts              48 selecciones · 12 grupos
    │   ├── sedes.ts              16 estadios oficiales
    │   ├── squads-top.ts         26 jugadores × 16 selecciones top
    │   ├── squads-resto.ts       11 titulares × 32 selecciones
    │   ├── squads.ts             Índice unificado
    │   ├── matches-grupos.ts     72 partidos de fase de grupos
    │   ├── matches-eliminatorias.ts  32 partidos de eliminatorias
    │   └── matches.ts            Índice unificado
    ├── components/
    │   ├── MatchCard.tsx         Tarjeta de partido
    │   ├── ScoreInput.tsx        +/- para introducir marcador
    │   ├── Bracket.tsx           Bracket gráfico
    │   └── TablaGrupos.tsx       Tablas de clasificación de grupos
    └── pages/
        ├── Equipos.tsx           Listado por grupos
        ├── EquipoDetalle.tsx     Plantilla del equipo
        ├── Calendario.tsx        Partidos por fecha
        ├── Quiniela.tsx          Predicciones del usuario
        ├── Torneo.tsx            Grupos + bracket
        └── Campeon.tsx           Selección campeona
```

## 🛠 Requisitos previos

Necesitas instalar **Node.js 18 o superior** y el CLI de Ionic.

### 1. Instalar Node.js

**macOS** (sin Homebrew, descarga directa):
- Ve a https://nodejs.org/ y descarga el instalador **LTS** para macOS.
- O instala Homebrew y luego: `brew install node`

Verifica:
```bash
node --version    # debe imprimir v18.x.x o superior
npm --version
```

### 2. Instalar Ionic CLI

```bash
npm install -g @ionic/cli
ionic --version
```

## 🚀 Cómo correr la app

Desde la carpeta del proyecto (`/Users/admin/Documents/mundial/`):

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Servidor de desarrollo en navegador (recarga en caliente)
ionic serve
# → se abre en http://localhost:8100
```

### Probar en navegador como móvil

Una vez abierto `localhost:8100`, abre las **DevTools** de Chrome (F12), activa
el **Device Toolbar** (Cmd+Shift+M) y elige un iPhone o Pixel.

## 📱 Generar APK Android / app iOS

👉 Para Android hay una **guía completa con 3 opciones** en [`ANDROID.md`](./ANDROID.md):

1. **PWA** — instalación instantánea desde Chrome móvil, sin compilar nada
2. **GitHub Actions** — APK generado en la nube, sin Android Studio local
3. **Build local** — `npm run android` genera `mundial-2026-debug.apk` en la raíz

### iOS (solo en macOS)

```bash
ionic capacitor add ios
ionic capacitor build ios
```

Luego desde Xcode: selecciona un dispositivo y presiona **Run**.

## 🎲 Probar la app con un Mundial simulado (sin esperar a junio)

Para ver la app "viva" antes del torneo real (quiniela con puntos, tablas
ordenadas, bracket completo, campeón) hay un simulador que genera resultados
aleatorios para los 104 partidos:

```bash
npm run simular
```

Esto:
1. Simula los 72 partidos de grupos con distribución Poisson pesada por la
   fuerza de cada selección (Argentina, Francia, etc. ganan más a menudo, pero
   hay upsets).
2. Calcula la clasificación final de cada grupo (puntos → DG → GF).
3. Selecciona los 8 mejores terceros.
4. Simula los 16 dieciseisavos, 8 octavos, 4 cuartos, 2 semifinales, tercer
   puesto y la final. Si hay empate en eliminatorias, decide por "penales".
5. Guarda todo en `public/simulacion.json`.
6. Imprime el bracket completo y el campeón en la consola.

La app **lo detecta automáticamente** al recargarla. Verás:
- Chip "🎲 simulación" arriba de cada pantalla
- Las tablas de grupos pobladas
- El bracket avanzando con equipos reales
- El botón dorado **¡Campeón!** en la pestaña Torneo
- Puntos calculados en la quiniela según lo que predijiste

Para volver al estado vacío:
```bash
npm run borrar-simulacion
```

Cada vez que ejecutas `npm run simular` se genera un Mundial diferente.

## 🔄 Auto-actualización de marcadores (recomendado)

La app se actualiza **sola** cada 2 minutos si configuras una fuente de datos.
También refresca al recuperar el foco (cuando vuelves a la app).

### Configurar football-data.org (recomendado)

1. Crea una cuenta gratis en https://www.football-data.org/client/register
2. Copia tu API key
3. Crea el archivo `.env.local` en la raíz del proyecto:

```bash
REACT_APP_FOOTBALL_API_KEY=tu_clave_aqui
```

4. Reinicia `ionic serve` para que tome la variable

Listo. La app empezará a:
- Hacer fetch al arrancar
- Refrescar cada 2 minutos automáticamente
- Refrescar al volver al foco de la app
- Cachear el último resultado en `localStorage` (funciona offline)
- Mostrar un chip "Actualizado hace X min · football-data.org" en cada pantalla
- Indicar partidos EN VIVO con un punto rojo pulsante

### Alternativa sin API key (JSON propio)

Si prefieres mantener tú mismo los resultados (o usar otra API), publica un
JSON en cualquier URL pública (un GitHub Gist sirve) con este formato:

```json
[
  { "partidoId": "G01", "local": 2, "visitante": 1, "estado": "FINISHED" },
  { "partidoId": "G02", "local": 0, "visitante": 0, "estado": "IN_PLAY" }
]
```

Y configúralo en `.env.local`:

```bash
REACT_APP_RESULTS_JSON_URL=https://gist.githubusercontent.com/usuario/abc/raw/results.json
```

El campo `estado` puede ser `SCHEDULED`, `IN_PLAY`, `PAUSED` o `FINISHED`.

### Sin fuente configurada

Si no configuras nada, la app sigue funcionando con datos estáticos y el chip
muestra "Modo sin conexión · datos estáticos". Puedes actualizar resultados
manualmente editando los archivos `data/matches-*.ts`.

## 🔧 Actualización manual (fallback)

### Resultados oficiales

Edita `src/data/matches-grupos.ts` o `src/data/matches-eliminatorias.ts`
y añade el campo `marcadorOficial` al partido jugado:

```typescript
{
  id: 'G01',
  fase: 'GRUPOS',
  grupo: 'A',
  jornada: 1,
  fecha: '2026-06-11',
  horaLocal: '18:00',
  sedeId: 'azteca',
  equipoLocal: 'MEX',
  equipoVisitante: 'RSA',
  marcadorOficial: { local: 2, visitante: 1 },  // ← AÑADIR
},
```

La quiniela recalcula los puntos automáticamente, las tablas de grupos se
actualizan y el bracket avanza visualmente.

### Equipos clasificados a eliminatorias

En `src/data/matches-eliminatorias.ts`, cambia `'TBD'` por el código FIFA
de los equipos que clasifican:

```typescript
{ id: 'R32-01', ..., equipoLocal: 'MEX', equipoVisitante: 'BIH', ... }
```

### Plantillas oficiales

FIFA publica las listas oficiales de 26 entre el **1 y el 6 de junio de 2026**.
Para actualizarlas, edita `src/data/squads-top.ts` y `src/data/squads-resto.ts`.

## 🎯 Reglas de la quiniela

| Acierto | Puntos |
|---------|--------|
| Marcador exacto (2-1 = 2-1) | **3 pts** |
| Acertar ganador o empate, pero no marcador | **1 pt** |
| Fallar el resultado | **0 pts** |

Los puntos se calculan automáticamente. Solo se computan partidos con marcador
oficial registrado.

## 📅 Fechas clave

- **11 junio 2026** — Apertura: México vs Sudáfrica @ Estadio Azteca
- **11-27 junio** — Fase de grupos (72 partidos)
- **28 jun - 3 jul** — Dieciseisavos
- **4-7 julio** — Octavos
- **9-11 julio** — Cuartos
- **14-15 julio** — Semifinales
- **18 julio** — Tercer puesto
- **19 julio 2026** — 🏆 **GRAN FINAL** @ MetLife Stadium

## ⚠️ Notas importantes

- Los datos de plantillas, sedes y partidos se basan en información oficial de
  FIFA y de fuentes deportivas al cierre de mayo 2026. Algunos pueden cambiar
  por convocatorias de última hora o lesiones.
- Los marcadores oficiales empiezan vacíos. Hay que ir actualizándolos manualmente
  conforme se jueguen los partidos (o conectar la app a una API externa, ver
  abajo).

## 🔌 Arquitectura del sistema de auto-actualización

```
┌─────────────────────────┐
│  football-data.org      │  ← API externa (cada 2 min)
│  o JSON URL personal    │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  src/services/          │
│  livedata.ts            │  ← fetcher + mapper (utcDate → partidoId)
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  LiveDataContext        │  ← polling + caché localStorage + foco
│  (provider global)      │
└───┬────────┬────────────┘
    ↓        ↓
QuinielaCtx  MatchCard / TablaGrupos / Bracket / Torneo / Campeón
    ↓
Recalcula puntos automáticamente cuando hay nuevo marcador
```

Para añadir más proveedores (API-Football, RapidAPI, etc.), implementa una
función `fetchDesdeXxx()` en `src/services/livedata.ts` y haz que
`fetchLiveMarcadores()` la prefiera.

## 📄 Licencia

Proyecto educativo / fan. Marcas, escudos y referencias a la FIFA pertenecen a
sus respectivos titulares.
