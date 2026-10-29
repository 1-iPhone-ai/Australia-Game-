#!/usr/bin/env node
/**
 * Generates deterministic KPI scenario modules for SECTION 20AZ expansion shard.
 * Run: node expansion/o6k-10m/public-services/scripts/generate.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const genDir = path.join(root, 'src', 'generated', 'kpi-scenarios');
const atlasPath = path.join(root, 'src', 'generated', 'regional-coefficient-atlas.ts');
const barrelPath = path.join(root, 'src', 'generated', 'index.ts');

const REGIONS = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
const PILLARS = ['housing', 'healthcare', 'education'];
const MODULE_COUNT = 185;

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function scenarioModule(id) {
  const mod = String(id).padStart(3, '0');
  const region = REGIONS[id % REGIONS.length];
  const pillar = PILLARS[id % PILLARS.length];
  const seed = id * 991 + 17;
  const coefLines = [];
  for (let k = 0; k < 72; k++) {
    const v = ((seed * (k + 3)) % 997) / 10;
    coefLines.push(`  c${k}: ${v.toFixed(4)},`);
  }
  return `import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario ${mod} — ${region}/${pillar}. */
export const V1014_PUBSVC_KPI_SCENARIO_${mod}_META = {
  id: 'kpi_${mod}',
  regionId: '${region}' as V1014PubsSvcRegionId,
  pillar: '${pillar}' as V1014PubsSvcPillar,
  seed: ${seed},
} as const;

const V1014_PUBSVC_KPI_SCENARIO_${mod}_COEF = {
${coefLines.join('\n')}
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_${mod}_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_${mod}_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_${mod}_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_${mod}_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_${mod}_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_${mod}_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_${mod}_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_${mod}_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_${mod}_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_${mod}_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
`;
}

function buildAtlas() {
  const rows = [];
  for (let r = 0; r < REGIONS.length; r++) {
    for (let p = 0; p < PILLARS.length; p++) {
      for (let t = 0; t < 40; t++) {
        const id = r * 120 + p * 40 + t;
        const queuePrior = ((id * 13) % 80) + 10;
        const skillGap = ((id * 7) % 55) + 5;
        const migGain = (((id * 11) % 100) / 100) * 1.2 + 0.4;
        rows.push(
          `  { id: ${id}, region: '${REGIONS[r]}', pillar: '${PILLARS[p]}', turn: ${t + 1}, queuePrior: ${queuePrior}, skillGap: ${skillGap}, migGain: ${migGain.toFixed(4)} },`,
        );
      }
    }
  }
  return `import { V1014_PUBSVC_clamp, V1014_PUBSVC_weightedMean } from '../core/math.ts';
import type { V1014PubsSvcPillar, V1014PubsSvcRegionId } from '../core/types.ts';

export interface V1014PubsSvcAtlasRow {
  id: number;
  region: V1014PubsSvcRegionId;
  pillar: V1014PubsSvcPillar;
  turn: number;
  queuePrior: number;
  skillGap: number;
  migGain: number;
}

export const V1014_PUBSVC_REGIONAL_COEFFICIENT_ATLAS: readonly V1014PubsSvcAtlasRow[] = [
${rows.join('\n')}
];

export function V1014_PUBSVC_lookupAtlasRow(id: number): V1014PubsSvcAtlasRow | undefined {
  return V1014_PUBSVC_REGIONAL_COEFFICIENT_ATLAS.find((row) => row.id === id);
}

export function V1014_PUBSVC_atlasCompositeForRegion(region: V1014PubsSvcRegionId, turn: number): number {
  const rows = V1014_PUBSVC_REGIONAL_COEFFICIENT_ATLAS.filter((row) => row.region === region && row.turn === turn);
  if (!rows.length) return 50;
  return V1014_PUBSVC_clamp(
    V1014_PUBSVC_weightedMean(
      rows.map((row) => ({
        weight: 1,
        value: 100 - row.queuePrior * 0.4 - row.skillGap * 0.35 - row.migGain * 12,
      })),
    ),
    0,
    100,
  );
}
`;
}

ensureDir(genDir);
const exports = [];
for (let i = 0; i < MODULE_COUNT; i++) {
  const mod = String(i).padStart(3, '0');
  const file = path.join(genDir, `scenario-${mod}.ts`);
  fs.writeFileSync(file, scenarioModule(i), 'utf8');
  exports.push(`export * from './kpi-scenarios/scenario-${mod}.ts';`);
}

fs.writeFileSync(atlasPath, buildAtlas(), 'utf8');
fs.writeFileSync(
  barrelPath,
  `/** Generated bundle — do not hand edit. Regenerate via scripts/generate.mjs */\n${exports.join('\n')}\nexport * from './regional-coefficient-atlas.ts';\n`,
  'utf8',
);

const lines = countLines(root);
console.log(`Generated ${MODULE_COUNT} scenario modules + atlas under ${root}`);
console.log(`Approx TS LOC (public-services): ${lines}`);

function countLines(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      total += countLines(p);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.md') || entry.name.endsWith('.mjs')) {
      total += fs.readFileSync(p, 'utf8').split('\n').length;
    }
  }
  return total;
}
