#!/usr/bin/env node
/**
 * Bundles Agent 07 module sources into operation-10m/modules/agent-07-public-finance/chunk.tsx
 * (no top-level imports — Agent 25 inline assembly).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-07-public-finance/modules');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-07-public-finance');
const outFile = path.join(outDir, 'chunk.tsx');

const MODULE_ID = 'agent-07-public-finance';

const FILES = [
  'fiscal-outcomes/types.ts',
  'fiscal-outcomes/boundaries.ts',
  'fiscal-outcomes/tax-instruments.ts',
  'fiscal-outcomes/budget-envelopes.ts',
  'fiscal-outcomes/debt-outcomes.ts',
  'fiscal-outcomes/outcome-linkage.ts',
  'fiscal-outcomes/bridge-v1012.ts',
  'fiscal-outcomes/compute.ts',
  'fiscal-outcomes/gi-queries.ts',
  'fiscal-outcomes/catalog/policy-scenarios.ts',
  'revenue-ledger/types.ts',
  'revenue-ledger/compute.ts',
  'infrastructure-financing/types.ts',
  'infrastructure-financing/compute.ts',
  'recurring-commitments/types.ts',
  'recurring-commitments/compute.ts',
  'fiscal-resilience/types.ts',
  'fiscal-resilience/compute.ts',
  'debt-rollover/types.ts',
  'debt-rollover/compute.ts',
  'budget-lines/types.ts',
  'budget-lines/catalog/appropriation-lines.ts',
  'budget-lines/compute.ts',
  'federal-state/types.ts',
  'federal-state/catalog/state-profiles.ts',
  'federal-state/reconcile.ts',
  'tax-expenditure/types.ts',
  'tax-expenditure/catalog/measures.ts',
  'tax-expenditure/compute.ts',
  'medium-term-outlook/types.ts',
  'medium-term-outlook/compute.ts',
  'consolidated-fiscal/compute.ts',
  'fiscal-rules/types.ts',
  'fiscal-rules/compute.ts',
  'sovereign-issuance/types.ts',
  'sovereign-issuance/compute.ts',
  'program-performance/types.ts',
  'program-performance/compute.ts',
  'reconciliation/reconcile.ts',
  'fiscal-outcomes/react/FiscalOutcomesInspector.tsx',
  'fiscal-outcomes/self-tests.ts',
  'reconciliation/self-tests.ts',
  'recurring-commitments/self-tests.ts',
  'fiscal-resilience/self-tests.ts',
  'debt-rollover/self-tests.ts',
  'budget-lines/self-tests.ts',
  'federal-state/self-tests.ts',
  'tax-expenditure/self-tests.ts',
  'medium-term-outlook/self-tests.ts',
  'consolidated-fiscal/self-tests.ts',
  'fiscal-rules/self-tests.ts',
  'sovereign-issuance/self-tests.ts',
  'program-performance/self-tests.ts'
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
  `// OP10M_MODULE_BEGIN ${MODULE_ID}`,
  '// Agent 07 — public finance & taxation (generated; source: operation-10m/agent-07-public-finance/modules/)',
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

parts.push(`// OP10M_MODULE_END ${MODULE_ID}`);
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
