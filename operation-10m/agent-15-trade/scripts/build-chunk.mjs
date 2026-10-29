#!/usr/bin/env node
/**
 * Bundles agent-15-trade sources into operation-10m/modules/agent-15-trade/chunk.tsx
 * (no top-level import lines — Agent 25 assembly ready).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-15-trade/src');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-15-trade');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'types.ts',
  'constants.ts',
  'util.ts',
  'persist.ts',
  'diplomacy-linkage.ts',
  'trade-agreements.ts',
  'world-shocks.ts',
  'commodity-shock-scenarios.ts',
  'sanctions.ts',
  'partner-trust.ts',
  'trade-policy.ts',
  'trade-disputes.ts',
  'trade-compliance.ts',
  'export-logistics.ts',
  'trade-balance.ts',
  'import-dependency.ts',
  'diplomatic-engagement.ts',
  'trade-finance.ts',
  'market-diversification.ts',
  'terms-of-trade.ts',
  'supply-chain-resilience.ts',
  'foreign-exchange-pressure.ts',
  'trade-retaliation.ts',
  'trade-deescalation.ts',
  'export-capacity-allocation.ts',
  'trade-reconciliation.ts',
  'maritime-risk-premium.ts',
  'preferential-access-utilization.ts',
  'trade-enforcement-intensity.ts',
  'export-credit-insurance-stack.ts',
  'partner-access-restoration.ts',
  'trade-corridor-resilience.ts',
  'sanctions-spillover-depth.ts',
  'trade-fx-hedging.ts',
  'import-lane-pressure.ts',
  'diplomatic-trade-coherence.ts',
  'trade-balance-stabilization.ts',
  'trade-shock-absorption.ts',
  'export-commitment-pipeline.ts',
  'import-commitment-pipeline.ts',
  'trade-flow-cohesion.ts',
  'o10-237-wave53-sovereign-handoff-depth.ts',
  'o10-240-wave54-sovereign-handoff-lattice.ts',
  'o10-247-wave55-sovereign-handoff-depth-stacking.ts',
  'o10-254-wave56-sovereign-handoff-depth-stacking.ts',
  'o10-257-wave57-sovereign-handoff-depth-stacking.ts',
  'domestic-consequences.ts',
  'household-bridge.ts',
  'trade-turn.ts',
  'self-tests.ts',
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
  '// OP10M_MODULE_BEGIN agent-15-trade',
  '// Agent 15 — Global trade, diplomacy, sanctions & world economy (generated; source: operation-10m/agent-15-trade/src/)',
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

parts.push('// OP10M_MODULE_END agent-15-trade');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
