#!/usr/bin/env node
/**
 * Bundles v10-14-macro-economy sources into modules/agent-06-macroeconomy/chunk.tsx
 * into operation-10m/modules/agent-06-macroeconomy/chunk.tsx (no local imports).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-06-macroeconomy/v10-14-macro-economy');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-06-macroeconomy');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'types.ts',
  'constants.ts',
  'boundaries.ts',
  'catalog/regional-sector-deltas.ts',
  'shock-composition.ts',
  'catalog/cyclical-shocks.ts',
  'catalog/cyclical-shocks-self-tests.ts',
  'catalog/stress-scenarios.ts',
  'math.ts',
  'productivity.ts',
  'investment.ts',
  'production.ts',
  'shocks.ts',
  'regional-aggregation.ts',
  'accounting/ledger.ts',
  'accounting/validate-state.ts',
  'persisted.ts',
  'inputs.ts',
  'bridge-v1012-fiscal.ts',
  'bridge-v1013-households.ts',
  'bridge-v101-industries.ts',
  'bridge-v1015-trade.ts',
  'bridge-economic-geography.ts',
  'bridge-v1016-credit.ts',
  'bridge-v104-innovation.ts',
  'bridge-v107-workforce.ts',
  'bridge-v109-strategic.ts',
  'bridge-v1014-housing.ts',
  'bridge-v1010-inflation.ts',
  'bridge-v1018-energy.ts',
  'bridge-v105-events.ts',
  'bridge-v108-companies.ts',
  'bridge-v102-turns.ts',
  'bridge-v1017-transport.ts',
  'bridge-v103-research.ts',
  'bridge-v109-population.ts',
  'bridge-v1006-modes.ts',
  'bridge-v1016-guardian.ts',
  'bridge-v1011-cities.ts',
  'bridge-v1021-forecasting.ts',
  'bridge-v1017-command.ts',
  'bridge-v1020-automation.ts',
  'macro-transmission.ts',
  'macro-stress-index.ts',
  'policy-stance-snapshot.ts',
  'counterfactual-delta.ts',
  'macro-capacity-snapshot.ts',
  'macro-transmission-balance.ts',
  'macro-transmission-coherence.ts',
  'macro-transmission-concentration.ts',
  'macro-transmission-asymmetry.ts',
  'macro-transmission-volatility.ts',
  'macro-transmission-resilience.ts',
  'macro-transmission-coverage.ts',
  'macro-transmission-amplification.ts',
  'scenario-compare.ts',
  'scenario-ranking.ts',
  'scenario-elasticity.ts',
  'scenario-convergence.ts',
  'scenario-divergence.ts',
  'scenario-severity.ts',
  'scenario-composite-rank.ts',
  'scenario-frontier-rank.ts',
  'scenario-hedge-rank.ts',
  'regression-harness.ts',
  'cycle-memory.ts',
  'sector-decomposition.ts',
  'regional-divergence.ts',
  'outlook-projection.ts',
  'action-alignment.ts',
  'consistency-gates.ts',
  'macro-debrief.ts',
  'gi-queries.ts',
  'compute.ts',
  'integration.ts',
  'accounting/reconciliation-tests.ts',
  'accounting/regional-reconciliation.ts',
  'depth-self-tests.ts',
  'round2-self-tests.ts',
  'round3-self-tests.ts',
  'round4-self-tests.ts',
  'round5-self-tests.ts',
  'round6-self-tests.ts',
  'round7-self-tests.ts',
  'round8-self-tests.ts',
  'round9-self-tests.ts',
  'round10-self-tests.ts',
  'round11-self-tests.ts',
  'round12-self-tests.ts',
  'round13-self-tests.ts',
  'round14-self-tests.ts',
  'self-tests.ts',
  'react/MacroEconomyInspectorLab.tsx'
];

function stripModulePreamble(source) {
  return source
    .split('\n')
    .filter(line => {
      const t = line.trim();
      if (t.startsWith('import ')) return false;
      if (t.startsWith('export * from')) return false;
      return true;
    })
    .join('\n');
}

const parts = [
  '// OP10M_MODULE_BEGIN agent-06-macroeconomy',
  '// Agent 06 — V10.14 national macroeconomy (generated; source: operation-10m/agent-06-macroeconomy/v10-14-macro-economy/)',
  ''
];

for (const rel of FILES) {
  const abs = path.join(srcRoot, rel);
  if (!fs.existsSync(abs)) {
    console.error('Missing source file:', rel);
    process.exit(1);
  }
  parts.push(`// --- source: ${rel} ---`);
  parts.push(stripModulePreamble(fs.readFileSync(abs, 'utf8')));
  parts.push('');
}

parts.push('// OP10M_MODULE_END agent-06-macroeconomy');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, parts.join('\n'));
console.log('Wrote', outFile, `(${parts.join('\n').split('\n').length} lines)`);
