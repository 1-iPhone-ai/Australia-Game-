#!/usr/bin/env node
/**
 * Operation 111 · Agent 74 — static contract against PRESET_GAME_SCENARIOS in the V9.4 monolith.
 * Does not import the TSX bundle (too heavy for CI); parses authored preset blocks.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONOLITH = path.resolve(__dirname, '../../(V9.4) australia-game-with-ai.tsx');
const REGION_CODES = new Set(['QLD', 'NSW', 'VIC', 'SA', 'WA', 'TAS', 'NT', 'ACT']);
const TARGET_TYPES = new Set([
  'money', 'regions', 'netWorth', 'challenges', 'regionalStanding', 'daysPassed', 'money_accumulated',
  'regions_controlled', 'turns_survived', 'standing_reached', 'ai_eliminated', 'challenges_completed',
  'public_stability', 'crisis_resolved', 'territory_controlled', 'debt_cleared', 'investments_count',
  'standing_threshold', 'specific_region_controlled', 'zero_sabotage_taken', 'governance_proposals_passed',
  'multi_actor_standing_avg',
]);
const NETWORK_KINDS = new Set(['freight', 'energy', 'water', 'trade', 'digital']);
const INDUSTRY_KINDS = new Set(['mining', 'agriculture', 'energy', 'manufacturing', 'technology', 'research', 'tourism', 'trade']);
const V10_DELTA_CAP = 40;

const src = fs.readFileSync(MONOLITH, 'utf8');
const start = src.indexOf('export const PRESET_GAME_SCENARIOS');
const end = src.indexOf('export const GAME_SCENARIOS', start);
if (start < 0 || end < 0) {
  console.error('Could not locate PRESET_GAME_SCENARIOS in monolith');
  process.exit(2);
}
const block = src.slice(start, end);

const scenarios = [];
const inner = block.slice(block.indexOf('[') + 1);
for (const part of inner.split(/\n  \{/).slice(1)) {
  const idM = part.match(/^\s*id:\s*'([^']+)'/);
  if (!idM) continue;
  scenarios.push({ id: idM[1], chunk: part });
}

const checks = [];
const pass = (name, ok, detail = 'ok') => checks.push({ name, ok, detail });

pass('preset_count', scenarios.length >= 16, `count=${scenarios.length}`);

const ids = scenarios.map(s => s.id);
pass('unique_ids', ids.length === new Set(ids).size, ids.filter((id, i) => ids.indexOf(id) !== i).join(',') || 'ok');

for (const sc of scenarios) {
  const regions = [...sc.chunk.matchAll(/startingRegions:\s*\[([^\]]+)\]/g)].flatMap(r =>
    [...r[1].matchAll(/'([^']+)'/g)].map(x => x[1])
  );
  for (const r of regions) {
    if (!REGION_CODES.has(r)) pass(`region_${sc.id}_${r}`, false, `invalid code ${r}`);
  }
  const targets = [...sc.chunk.matchAll(/targetType:\s*'([^']+)'/g)].map(x => x[1]);
  for (const t of targets) {
    if (!TARGET_TYPES.has(t)) pass(`target_${sc.id}_${t}`, false, `unknown targetType ${t}`);
  }
  const objCount = (sc.chunk.match(/targetType:/g) || []).length;
  const explicitSecondary = (sc.chunk.match(/isPrimary:\s*false/g) || []).length;
  const hasPrimary = objCount > explicitSecondary;
  pass(`primary_${sc.id}`, hasPrimary, 'no primary objective');

  if (sc.id.startsWith('v93_')) {
    const det = /deterministicRngActive:\s*true/.test(sc.chunk) && /worldRngSeed:\s*\d+/.test(sc.chunk);
    pass(`v93_det_${sc.id}`, det, 'missing deterministic RNG');
  }
}

const scanHook = (field, kinds) => {
  const re = new RegExp(`${field}:\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}`, 'g');
  let hm;
  while ((hm = re.exec(block)) !== null) {
    const body = hm[1];
    for (const rm of body.matchAll(/([A-Z]{2,3}):\s*\{([^}]*)\}/g)) {
      const reg = rm[1];
      if (!REGION_CODES.has(reg)) pass(`hook_region_${field}_${reg}`, false, reg);
      for (const km of rm[2].matchAll(/(\w+):\s*(-?\d+)/g)) {
        const kind = km[1];
        const val = Number(km[2]);
        if (!kinds.has(kind)) pass(`hook_kind_${field}_${kind}`, false, kind);
        if (Math.abs(val) > V10_DELTA_CAP) pass(`hook_cap_${field}_${kind}_${val}`, false, String(val));
      }
    }
  }
};
scanHook('nationalNetworks', NETWORK_KINDS);
scanHook('industries', INDUSTRY_KINDS);

const v10Pairs = scenarios.filter(s => /nationalNetworks:/.test(s.chunk) && /industries:/.test(s.chunk)).length;
pass('v10_pack_count', v10Pairs >= 4, `pairs=${v10Pairs}`);

pass('self_test_registered', /runScenarioCatalogSelfTests/.test(src) && /id: 'sc74'/.test(src), 'missing in monolith');

const failed = checks.filter(c => !c.ok);
for (const c of checks) {
  if (!c.ok) console.error(`FAIL ${c.name}: ${c.detail}`);
}
console.log(`Scenario catalog contract: ${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);
