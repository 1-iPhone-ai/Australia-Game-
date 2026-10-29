#!/usr/bin/env node
/**
 * Bundles Agent 08 module sources into operation-10m/modules/agent-08-companies/chunk.tsx
 * (no top-level imports — assembly-ready for Agent 25).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-08-companies');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-08-companies');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'upstream-stubs.ts',
  'v1014-private-sector-core.tsx',
  'tax-labor-capacity-linkage.ts',
  'sector-production-depth.ts',
  'production-capacity-cascade.ts',
  'integrated-production-synthesis.ts',
  'production-recovery-playbook.ts',
  'production-stabilization-outlook.ts',
  'production-coordination-mandate.ts',
  'production-mandate-compliance.ts',
  'production-compliance-remediation.ts',
  'production-remediation-execution.ts',
  'production-utilization-depth.ts',
  'production-capacity-reconciliation.ts',
  'production-operating-priorities.ts',
  'production-operating-digest.ts',
  'production-readiness-portfolio.ts',
  'production-transition-horizon.ts',
  'production-transition-commitment.ts',
  'production-transition-mobilization.ts',
  'production-transition-deployment.ts',
  'production-transition-validation.ts',
  'production-transition-consolidation.ts',
  'production-transition-sustainment.ts',
  'production-transition-resilience.ts',
  'production-transition-equilibrium.ts',
  'production-transition-maturity.ts',
  'production-transition-continuity.ts',
  'production-transition-heritage.ts',
  'production-transition-codification.ts',
  'production-transition-stewardship.ts',
  'production-transition-governance.ts',
  'production-transition-accountability.ts',
  'production-transition-assurance.ts',
  'production-transition-trust.ts',
  'production-transition-legitimacy.ts',
  'production-transition-recognition.ts',
  'production-transition-precedence.ts',
  'production-transition-ratification.ts',
  'production-transition-confirmation.ts',
  'production-transition-finalization.ts',
  'production-transition-closure.ts',
  'production-transition-completion.ts',
  'production-transition-resolution.ts',
  'production-transition-settlement.ts',
  'production-transition-retirement.ts',
  'production-transition-legacy.ts',
  'production-transition-remembrance.ts',
  'production-transition-commemoration.ts',
  'production-transition-veneration.ts',
  'production-transition-enshrinement.ts',
  'production-transition-immortalization.ts',
  'production-transition-transcendence.ts',
  'production-transition-apotheosis.ts',
  'chunk-exports.ts',
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
  '// OP10M_MODULE_BEGIN agent-08-companies',
  '// Agent 08 — V10.14 private sector + tax/labor + supply depth (generated).',
  '// Source: operation-10m/agent-08-companies/ — regenerate: npm run build:agent08-chunk',
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

parts.push('// OP10M_MODULE_END agent-08-companies');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
