#!/usr/bin/env node
/**
 * Bundles Agent 19 modular sources into operation-10m/modules/agent-19-ai-memory/chunk.tsx
 * (no top-level imports — assembly-ready for Agent 25).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-19-ai-memory');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-19-ai-memory');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'types.ts',
  'horizon.ts',
  'explainability.ts',
  'negotiation-explainability.ts',
  'inspection-explainability.ts',
  'memory-bounds-audit.ts',
  'decision-trace.ts',
  'prior-explainability.ts',
  'adaptive-plan-explainability.ts',
  'memory-health-scorecard.ts',
  'turn-influence-summary.ts',
  'explainability-claims.ts',
  'memory-event-timeline.ts',
  'relationship-explainability.ts',
  'memory-retention-audit.ts',
  'turn-explainability-pack.ts',
  'counterfactual-explainability.ts',
  'memory-staleness-audit.ts',
  'session-explainability-rollup.ts',
  'explainability-debug-export.ts',
  'memory-explainability-integrity.ts',
  'opponent-model-explainability.ts',
  'influence-drift-audit.ts',
  'prior-event-tension-audit.ts',
  'match-explainability-digest.ts',
  'turn-pack-gi-bridge.ts',
  'slice-attribution-audit.ts',
  'gi-redaction-consistency-audit.ts',
  'multi-turn-drift-rollup.ts',
  'integrity-recovery-hints.ts',
  'adaptive-plan-influence-bridge.ts',
  'turn-pack-composite-audit.ts',
  'session-gi-claims-rollup.ts',
  'negotiation-influence-bridge.ts',
  'decision-trace-continuity-audit.ts',
  'explainability-confidence-band.ts',
  'composite-recovery-bridge.ts',
  'session-confidence-rollup.ts',
  'horizon-slice-alignment-audit.ts',
  'match-explainability-gate.ts',
  'trace-composite-bridge.ts',
  'match-gate-recovery-bridge.ts',
  'session-trace-continuity-gate.ts',
  'session-horizon-alignment-audit.ts',
  'explainability-export-gate.ts',
  'session-trace-composite-rollup.ts',
  'match-explainability-final-gate.ts',
  'session-export-bundle.ts',
  'negotiation-session-rollup.ts',
  'confidence-export-bridge.ts',
  'match-recovery-playbook.ts',
  'match-explainability-delivery-bundle.ts',
  'session-gi-delivery-bundle.ts',
  'final-gate-recovery-bridge.ts',
  'negotiation-export-bridge.ts',
  'match-explainability-shipment-gate.ts',
  'match-explainability-release-bundle.ts',
  'shipment-recovery-playbook-bridge.ts',
  'delivery-shipment-bridge.ts',
  'session-release-export-bundle.ts',
  'match-explainability-launch-gate.ts',
  'influence-audit.ts',
  'eval/run-suite.ts',
  'chunk-self-tests.ts',
  'react/MemoryExplainabilityLab.tsx',
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
  '// OP10M_MODULE_BEGIN agent-19-ai-memory',
  '// Agent 19 — AI memory evaluation, audit, explainability (generated; source: operation-10m/agent-19-ai-memory/)',
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

parts.push('// OP10M_MODULE_END agent-19-ai-memory');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
