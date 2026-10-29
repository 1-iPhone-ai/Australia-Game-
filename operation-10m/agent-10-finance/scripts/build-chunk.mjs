#!/usr/bin/env node
/**
 * Bundles agent-10-finance sources into operation-10m/modules/agent-10-finance/chunk.tsx
 * (no top-level import lines — inline-ready for Agent 25 / OP10M assembly).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-10-finance/src');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-10-finance');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'definitions/types.ts',
  'definitions/constants.ts',
  'definitions/glossary.ts',
  'compute/math.ts',
  'credit/bands.ts',
  'credit/actor-leverage.ts',
  'rates/reference-rate.ts',
  'prices/boundary.ts',
  'shocks/catalog.ts',
  'shocks/scenario-runner.ts',
  'inflation/pass-through.ts',
  'credit/loan-pricing.ts',
  'transmission/channels.ts',
  'compute/national-macro-financial.ts',
  'integration/query-co-pilot.ts',
  'self-tests.ts',
  'react/FinanceConditionsLab.tsx',
];

function stripModulePreamble(source) {
  return source
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (t.startsWith('import ')) return false;
      if (t.startsWith('export * from')) return false;
      return true;
    })
    .join('\n');
}

const parts = [
  '// OP10M_MODULE_BEGIN agent-10-finance',
  '// Agent 10 — V10.14 macro-financial conditions (generated; source: operation-10m/agent-10-finance/src/)',
  '',
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

parts.push('// OP10M_MODULE_END agent-10-finance');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
