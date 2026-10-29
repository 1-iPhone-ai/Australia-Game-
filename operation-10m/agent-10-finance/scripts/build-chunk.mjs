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
  'prices/market-dynamics.ts',
  'shocks/catalog.ts',
  'shocks/scenario-runner.ts',
  'inflation/pass-through.ts',
  'inflation/wage-price-spiral.ts',
  'inflation/cpi-basket.ts',
  'inflation/expectations-anchor.ts',
  'inflation/phillips-slack.ts',
  'inflation/core-headline-spread.ts',
  'inflation/supply-demand-shock.ts',
  'rates/monetary-reaction.ts',
  'rates/inflation-target-breach.ts',
  'rates/real-rate-gap.ts',
  'rates/term-premium-inflation-signal.ts',
  'fiscal/fiscal-dominance.ts',
  'credit/credit-inflation-feedback.ts',
  'inflation/inflation-momentum.ts',
  'inflation/disinflation-sacrifice.ts',
  'inflation/import-price-pass-through.ts',
  'credit/loan-pricing.ts',
  'investment/climate-link.ts',
  'transmission/channels.ts',
  'persistence/validate-state.ts',
  'catalog/fiscal-inflation-scenarios.ts',
  'compute/national-macro-financial.ts',
  'integration/query-co-pilot.ts',
  'integration/regression-harness.ts',
  'integration/save-bridge.ts',
  'integration/agent06-macro-bridge.ts',
  'integration/agent07-fiscal-bridge.ts',
  'integration/agent09-household-bridge.ts',
  'integration/agent15-trade-bridge.ts',
  'integration/agent08-corporate-bridge.ts',
  'integration/inflation-forecast.ts',
  'integration/inflation-regime-tracker.ts',
  'integration/agent21-forecast-bridge.ts',
  'credit/tier-spreads.ts',
  'self-tests.ts',
  'react/FinanceConditionsLab.tsx',
  'react/FinanceTransmissionPanel.tsx',
  'react/InflationDiagnosticsPanel.tsx',
  'react/InflationRegimePanel.tsx',
  'react/InflationMomentumPanel.tsx',
  'react/ImportInflationPanel.tsx',
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
