#!/usr/bin/env node
/**
 * Simulador del Mundial 2026.
 *
 * Genera resultados aleatorios para los 104 partidos usando distribución
 * Poisson pesada por la "fuerza" de cada selección (ranking aproximado).
 *
 * Calcula:
 *  - 72 partidos de fase de grupos
 *  - Clasificación de cada grupo (Pts → DG → GF)
 *  - 2 primeros + 8 mejores terceros = 32 clasificados
 *  - Bracket de 16/8/4/2/3º/1 = 32 partidos eliminatorios
 *  - Si hay empate en eliminatorias → desempate por "penales" (random)
 *
 * Uso:
 *   node scripts/simular-mundial.mjs
 *
 * Genera:  public/simulacion.json
 *
 * Para activarlo en la app:
 *   - La app lo detecta automáticamente si está presente y no hay otra fuente.
 *   - O explícitamente: REACT_APP_RESULTS_JSON_URL=/simulacion.json
 */

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ====================================================================
// DATOS — deben coincidir con src/data/teams.ts y matches-grupos.ts
// ====================================================================

const GRUPOS = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],
  B: ['CAN', 'BIH', 'QAT', 'SUI'],
  C: ['BRA', 'MAR', 'HAI', 'SCO'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'CUW', 'CIV', 'ECU'],
  F: ['NED', 'JPN', 'SWE', 'TUN'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'],
  H: ['ESP', 'CPV', 'KSA', 'URU'],
  I: ['FRA', 'SEN', 'IRQ', 'NOR'],
  J: ['ARG', 'ALG', 'AUT', 'JOR'],
  K: ['POR', 'COD', 'UZB', 'COL'],
  L: ['ENG', 'CRO', 'GHA', 'PAN'],
};

// "Fuerza" basada en ranking FIFA + rendimiento histórico Mundial
const FUERZA = {
  ARG: 95, FRA: 94, ESP: 93, ENG: 92, BRA: 91, POR: 89, NED: 87,
  GER: 86, BEL: 84, CRO: 83, URU: 82, COL: 81, JPN: 80, NOR: 80,
  MEX: 78, USA: 78, SEN: 78, MAR: 77, AUT: 76, TUR: 75, KOR: 75,
  SUI: 75, CIV: 74, ECU: 73, IRN: 72, SWE: 74, GHA: 72, CAN: 72,
  PAR: 70, AUS: 70, EGY: 70, CZE: 70, SCO: 70, ALG: 69, TUN: 68,
  BIH: 65, RSA: 65, IRQ: 64, QAT: 64, KSA: 64, UZB: 63, COD: 62,
  JOR: 60, PAN: 60, CPV: 58, NZL: 56, HAI: 54, CUW: 50,
};

// 72 partidos de fase de grupos
const PARTIDOS_GRUPOS = [
  { id: 'G01', g: 'A', l: 'MEX', v: 'RSA' }, { id: 'G02', g: 'A', l: 'KOR', v: 'CZE' },
  { id: 'G03', g: 'B', l: 'CAN', v: 'BIH' }, { id: 'G04', g: 'B', l: 'QAT', v: 'SUI' },
  { id: 'G05', g: 'D', l: 'USA', v: 'PAR' }, { id: 'G06', g: 'C', l: 'BRA', v: 'MAR' },
  { id: 'G07', g: 'C', l: 'HAI', v: 'SCO' }, { id: 'G08', g: 'D', l: 'AUS', v: 'TUR' },
  { id: 'G09', g: 'E', l: 'GER', v: 'CUW' }, { id: 'G10', g: 'E', l: 'CIV', v: 'ECU' },
  { id: 'G11', g: 'F', l: 'NED', v: 'JPN' }, { id: 'G12', g: 'F', l: 'SWE', v: 'TUN' },
  { id: 'G13', g: 'G', l: 'BEL', v: 'EGY' }, { id: 'G14', g: 'G', l: 'IRN', v: 'NZL' },
  { id: 'G15', g: 'H', l: 'ESP', v: 'CPV' }, { id: 'G16', g: 'H', l: 'KSA', v: 'URU' },
  { id: 'G17', g: 'I', l: 'FRA', v: 'SEN' }, { id: 'G18', g: 'I', l: 'IRQ', v: 'NOR' },
  { id: 'G19', g: 'J', l: 'ARG', v: 'ALG' }, { id: 'G20', g: 'J', l: 'AUT', v: 'JOR' },
  { id: 'G21', g: 'K', l: 'POR', v: 'COD' }, { id: 'G22', g: 'K', l: 'UZB', v: 'COL' },
  { id: 'G23', g: 'L', l: 'ENG', v: 'CRO' }, { id: 'G24', g: 'L', l: 'GHA', v: 'PAN' },
  { id: 'G25', g: 'A', l: 'MEX', v: 'KOR' }, { id: 'G26', g: 'A', l: 'CZE', v: 'RSA' },
  { id: 'G27', g: 'B', l: 'CAN', v: 'QAT' }, { id: 'G28', g: 'B', l: 'SUI', v: 'BIH' },
  { id: 'G29', g: 'C', l: 'BRA', v: 'HAI' }, { id: 'G30', g: 'C', l: 'MAR', v: 'SCO' },
  { id: 'G31', g: 'D', l: 'USA', v: 'AUS' }, { id: 'G32', g: 'D', l: 'TUR', v: 'PAR' },
  { id: 'G33', g: 'E', l: 'GER', v: 'CIV' }, { id: 'G34', g: 'E', l: 'ECU', v: 'CUW' },
  { id: 'G35', g: 'F', l: 'NED', v: 'SWE' }, { id: 'G36', g: 'F', l: 'TUN', v: 'JPN' },
  { id: 'G37', g: 'G', l: 'BEL', v: 'IRN' }, { id: 'G38', g: 'G', l: 'NZL', v: 'EGY' },
  { id: 'G39', g: 'H', l: 'ESP', v: 'KSA' }, { id: 'G40', g: 'H', l: 'URU', v: 'CPV' },
  { id: 'G41', g: 'I', l: 'FRA', v: 'IRQ' }, { id: 'G42', g: 'I', l: 'NOR', v: 'SEN' },
  { id: 'G43', g: 'J', l: 'ARG', v: 'AUT' }, { id: 'G44', g: 'J', l: 'JOR', v: 'ALG' },
  { id: 'G45', g: 'K', l: 'POR', v: 'UZB' }, { id: 'G46', g: 'K', l: 'COL', v: 'COD' },
  { id: 'G47', g: 'L', l: 'ENG', v: 'GHA' }, { id: 'G48', g: 'L', l: 'PAN', v: 'CRO' },
  { id: 'G49', g: 'A', l: 'MEX', v: 'CZE' }, { id: 'G50', g: 'A', l: 'RSA', v: 'KOR' },
  { id: 'G51', g: 'B', l: 'CAN', v: 'SUI' }, { id: 'G52', g: 'B', l: 'BIH', v: 'QAT' },
  { id: 'G53', g: 'C', l: 'BRA', v: 'SCO' }, { id: 'G54', g: 'C', l: 'HAI', v: 'MAR' },
  { id: 'G55', g: 'D', l: 'TUR', v: 'USA' }, { id: 'G56', g: 'D', l: 'PAR', v: 'AUS' },
  { id: 'G57', g: 'E', l: 'GER', v: 'ECU' }, { id: 'G58', g: 'E', l: 'CIV', v: 'CUW' },
  { id: 'G59', g: 'F', l: 'NED', v: 'TUN' }, { id: 'G60', g: 'F', l: 'JPN', v: 'SWE' },
  { id: 'G61', g: 'G', l: 'BEL', v: 'NZL' }, { id: 'G62', g: 'G', l: 'EGY', v: 'IRN' },
  { id: 'G63', g: 'H', l: 'ESP', v: 'URU' }, { id: 'G64', g: 'H', l: 'CPV', v: 'KSA' },
  { id: 'G65', g: 'I', l: 'FRA', v: 'NOR' }, { id: 'G66', g: 'I', l: 'IRQ', v: 'SEN' },
  { id: 'G67', g: 'J', l: 'ARG', v: 'JOR' }, { id: 'G68', g: 'J', l: 'ALG', v: 'AUT' },
  { id: 'G69', g: 'K', l: 'POR', v: 'COL' }, { id: 'G70', g: 'K', l: 'COD', v: 'UZB' },
  { id: 'G71', g: 'L', l: 'ENG', v: 'PAN' }, { id: 'G72', g: 'L', l: 'CRO', v: 'GHA' },
];

// ====================================================================
// MOTOR DE SIMULACIÓN
// ====================================================================

const fuerza = (codigo) => FUERZA[codigo] ?? 60;

/** Muestrea un valor Poisson con lambda dada */
function poisson(lambda) {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

/** Genera goles de un equipo basado en su fuerza vs el rival */
function golesEsperados(fuerzaPropia, fuerzaRival) {
  // Media histórica del Mundial ~1.3 goles por equipo por partido.
  // Se modula por el ratio de fuerzas.
  const ratio = fuerzaPropia / fuerzaRival;
  const lambda = Math.max(0.25, 1.3 * Math.pow(ratio, 1.5));
  return Math.min(7, poisson(lambda));  // cap en 7 para evitar locuras
}

/** Simula un partido normal (puede empatar) */
function simularPartido(local, visitante) {
  return {
    local: golesEsperados(fuerza(local), fuerza(visitante)),
    visitante: golesEsperados(fuerza(visitante), fuerza(local)),
  };
}

/** Simula partido eliminatorio — fuerza ganador (penales si empate) */
function simularKO(local, visitante) {
  const r = simularPartido(local, visitante);
  if (r.local === r.visitante) {
    // Penales: el de mayor fuerza tiene ligera ventaja, pero es 50/50ish
    const probLocal = 0.5 + (fuerza(local) - fuerza(visitante)) * 0.005;
    if (Math.random() < probLocal) r.local += 1;
    else r.visitante += 1;
  }
  return r;
}

const ganador = (m, local, visitante) => m.local > m.visitante ? local : visitante;
const perdedor = (m, local, visitante) => m.local > m.visitante ? visitante : local;

// ====================================================================
// EJECUCIÓN
// ====================================================================

console.log('🎲 Simulando Mundial 2026...\n');

const resultados = {};

// 1) FASE DE GRUPOS
console.log('📋 Fase de grupos (72 partidos)...');
for (const p of PARTIDOS_GRUPOS) {
  resultados[p.id] = simularPartido(p.l, p.v);
}

// 2) CLASIFICACIÓN POR GRUPO
function tablaGrupo(grupo) {
  const equipos = GRUPOS[grupo];
  const t = {};
  equipos.forEach(e => t[e] = { codigo: e, pj:0, g:0, e:0, p:0, gf:0, gc:0, dg:0, pts:0 });
  PARTIDOS_GRUPOS.filter(p => p.g === grupo).forEach(p => {
    const r = resultados[p.id];
    const L = t[p.l], V = t[p.v];
    L.pj++; V.pj++;
    L.gf += r.local; L.gc += r.visitante;
    V.gf += r.visitante; V.gc += r.local;
    if (r.local > r.visitante)      { L.g++; L.pts += 3; V.p++; }
    else if (r.visitante > r.local) { V.g++; V.pts += 3; L.p++; }
    else                            { L.e++; V.e++; L.pts++; V.pts++; }
  });
  return Object.values(t)
    .map(x => ({ ...x, dg: x.gf - x.gc }))
    .sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
}

const tablas = {};
const primeros = {};
const segundos = {};
const terceros = [];

console.log('\n📊 Clasificación final de grupos:');
for (const g of Object.keys(GRUPOS)) {
  const t = tablaGrupo(g);
  tablas[g] = t;
  primeros[g] = t[0].codigo;
  segundos[g] = t[1].codigo;
  terceros.push({ ...t[2], grupo: g });
  console.log(`  Grupo ${g}: 1º ${t[0].codigo}(${t[0].pts}pts) · 2º ${t[1].codigo}(${t[1].pts}pts) · 3º ${t[2].codigo}(${t[2].pts}pts) · 4º ${t[3].codigo}(${t[3].pts}pts)`);
}

// 8 mejores terceros
terceros.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
const mejoresTerceros = terceros.slice(0, 8).map(t => t.codigo);
console.log(`\n🥉 Mejores terceros que avanzan: ${mejoresTerceros.join(', ')}`);

// 3) DIECISEISAVOS (R32) — 32 equipos en 16 partidos
// Asignación simplificada: pareo cruzado para distribuir
const clasificados32 = [
  ...Object.values(primeros),   // 12 primeros
  ...Object.values(segundos),   // 12 segundos
  ...mejoresTerceros,            // 8 mejores terceros
];

const r32Ids = Array.from({ length: 16 }, (_, i) => `R32-${String(i + 1).padStart(2, '0')}`);
const r32Pairs = [];

// Pareo: emparejamos por orden — top1 con bottom1, etc.
// Esto da un bracket razonablemente equilibrado sin necesitar mapear las reglas
// específicas de FIFA (que dependen de qué grupos producen los 8 mejores terceros).
for (let i = 0; i < 16; i++) {
  r32Pairs.push([clasificados32[i], clasificados32[31 - i]]);
}

console.log('\n🏆 DIECISEISAVOS DE FINAL:');
const r16Avanzan = [];
r32Pairs.forEach((par, i) => {
  const [l, v] = par;
  const id = r32Ids[i];
  const r = simularKO(l, v);
  resultados[id] = r;
  const g = ganador(r, l, v);
  r16Avanzan.push(g);
  console.log(`  ${id}: ${l} ${r.local}-${r.visitante} ${v} → ${g}`);
});

// 4) OCTAVOS — 16 → 8
console.log('\n🏆 OCTAVOS DE FINAL:');
const oct = [];
for (let i = 0; i < 8; i++) {
  const id = `OCT-${String(i + 1).padStart(2, '0')}`;
  const l = r16Avanzan[i * 2];
  const v = r16Avanzan[i * 2 + 1];
  const r = simularKO(l, v);
  resultados[id] = r;
  const g = ganador(r, l, v);
  oct.push(g);
  console.log(`  ${id}: ${l} ${r.local}-${r.visitante} ${v} → ${g}`);
}

// 5) CUARTOS — 8 → 4
console.log('\n🏆 CUARTOS DE FINAL:');
const cuartos = [];
for (let i = 0; i < 4; i++) {
  const id = `CUA-${String(i + 1).padStart(2, '0')}`;
  const l = oct[i * 2];
  const v = oct[i * 2 + 1];
  const r = simularKO(l, v);
  resultados[id] = r;
  const g = ganador(r, l, v);
  cuartos.push(g);
  console.log(`  ${id}: ${l} ${r.local}-${r.visitante} ${v} → ${g}`);
}

// 6) SEMIFINALES — 4 → 2
console.log('\n🏆 SEMIFINALES:');
const sem = [];
const semiPerdedores = [];
for (let i = 0; i < 2; i++) {
  const id = `SEM-${String(i + 1).padStart(2, '0')}`;
  const l = cuartos[i * 2];
  const v = cuartos[i * 2 + 1];
  const r = simularKO(l, v);
  resultados[id] = r;
  const g = ganador(r, l, v);
  const pe = perdedor(r, l, v);
  sem.push(g);
  semiPerdedores.push(pe);
  console.log(`  ${id}: ${l} ${r.local}-${r.visitante} ${v} → ${g}`);
}

// 7) TERCER PUESTO
console.log('\n🥉 PARTIDO POR EL TERCER PUESTO:');
{
  const id = 'TER-01';
  const [l, v] = semiPerdedores;
  const r = simularKO(l, v);
  resultados[id] = r;
  const g = ganador(r, l, v);
  console.log(`  ${id}: ${l} ${r.local}-${r.visitante} ${v} → 3º ${g}`);
}

// 8) FINAL
console.log('\n🏆🏆🏆 GRAN FINAL 🏆🏆🏆');
let CAMPEON, SUBCAMPEON;
{
  const id = 'FIN-01';
  const [l, v] = sem;
  const r = simularKO(l, v);
  resultados[id] = r;
  CAMPEON = ganador(r, l, v);
  SUBCAMPEON = perdedor(r, l, v);
  console.log(`  ${id}: ${l} ${r.local}-${r.visitante} ${v}`);
  console.log(`\n  👑 CAMPEÓN DEL MUNDO: ${CAMPEON}`);
  console.log(`  🥈 SUBCAMPEÓN:        ${SUBCAMPEON}`);
}

// ====================================================================
// ESCRIBIR JSON
// ====================================================================

const salida = Object.entries(resultados).map(([partidoId, r]) => ({
  partidoId,
  local: r.local,
  visitante: r.visitante,
  estado: 'FINISHED',
}));

const publicDir = join(ROOT, 'public');
mkdirSync(publicDir, { recursive: true });
const outFile = join(publicDir, 'simulacion.json');
writeFileSync(outFile, JSON.stringify(salida, null, 2), 'utf-8');

console.log(`\n✅ ${salida.length} partidos simulados.`);
console.log(`📁 Guardado en: ${outFile}`);
console.log(`\n👉 Para activar en la app:`);
console.log(`   1. Crea .env.local con:  REACT_APP_RESULTS_JSON_URL=/simulacion.json`);
console.log(`   2. (Re)arranca:           ionic serve`);
console.log(`\n   O bórralo si ya no quieres simulación:  rm public/simulacion.json\n`);
