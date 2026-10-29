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
  'cycle-memory.ts',
  'sector-decomposition.ts',
  'regional-divergence.ts',
  'outlook-projection.ts',
  'action-alignment.ts',
  'gi-queries.ts',
  'compute.ts',
  'integration.ts',
  'accounting/reconciliation-tests.ts',
  'accounting/regional-reconciliation.ts',
  'depth-self-tests.ts',
  'round2-self-tests.ts',
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
