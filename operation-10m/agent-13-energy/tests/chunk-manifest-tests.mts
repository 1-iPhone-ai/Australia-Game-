import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHUNK = path.join(ROOT, 'chunk.tsx');

const REQUIRED_EXPORTS = [
  'computeIndustrialEnergyEnvironmentalState',
  'runV1014IndustrialEnergyEnvironmentalSelfTests',
  'V1014_INDUSTRIAL_ENERGY_AGENT',
  'V1014_STORAGE_FLEXIBILITY_CATALOG',
  'V1014_EMISSIONS_CREDIT_CATALOG',
  'V1014_BIODIVERSITY_OFFSET_CATALOG',
  'V1014_CIRCULAR_RECOVERY_CATALOG',
  'runAgent13StoragePermitScaleSelfTests',
  'runAgent13EmissionsWaterScaleSelfTests',
  'runAgent13BiodiversityCircularScaleSelfTests',
  'executeAgent13IndustrialEnergyTurnHook',
  'V1014_INTERREGIONAL_GRID_LINKS',
  'V1014_REGIONAL_GRID_SCENARIOS',
  'runAgent13TurnSimulationDepthSelfTests',
  'OP10M_MODULE_BEGIN agent-13-energy',
  'OP10M_MODULE_END agent-13-energy',
];

export function runAgent13ChunkManifestTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(fs.existsSync(CHUNK));
  const text = fs.readFileSync(CHUNK, 'utf8');
  ok(!/^import\s/m.test(text));
  ok(!/from '\.\//.test(text));
  for (const sym of REQUIRED_EXPORTS) {
    ok(text.includes(sym));
  }
  ok(text.indexOf('OP10M_MODULE_BEGIN agent-13-energy') < text.indexOf('OP10M_MODULE_END agent-13-energy'));
  ok(text.includes('content-sha256:'));

  return { passed, failed, total: passed + failed };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = runAgent13ChunkManifestTests();
  console.log(`Agent 13 chunk manifest tests: ${r.passed}/${r.total} passed`);
  if (r.failed) process.exit(1);
}
