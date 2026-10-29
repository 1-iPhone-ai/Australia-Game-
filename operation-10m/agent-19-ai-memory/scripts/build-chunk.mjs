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
  'match-explainability-operations-bundle.ts',
  'launch-recovery-orchestrator.ts',
  'session-operations-export-bundle.ts',
  'release-launch-bridge.ts',
  'match-explainability-production-gate.ts',
  'match-explainability-deployment-bundle.ts',
  'production-recovery-orchestrator.ts',
  'session-deployment-export-bundle.ts',
  'operations-production-bridge.ts',
  'match-explainability-fleet-gate.ts',
  'match-explainability-sustainment-bundle.ts',
  'session-sustainment-export-bundle.ts',
  'fleet-sustainment-bridge.ts',
  'fleet-recovery-orchestrator.ts',
  'match-explainability-orbit-gate.ts',
  'match-explainability-transit-bundle.ts',
  'session-transit-export-bundle.ts',
  'orbit-transit-bridge.ts',
  'match-explainability-relay-gate.ts',
  'orbit-recovery-orchestrator.ts',
  'match-explainability-relay-bundle.ts',
  'session-relay-export-bundle.ts',
  'relay-transit-bridge.ts',
  'match-explainability-beacon-gate.ts',
  'relay-recovery-orchestrator.ts',
  'match-explainability-beacon-bundle.ts',
  'session-beacon-export-bundle.ts',
  'relay-beacon-bridge.ts',
  'match-explainability-signal-gate.ts',
  'beacon-recovery-orchestrator.ts',
  'match-explainability-signal-bundle.ts',
  'session-signal-export-bundle.ts',
  'beacon-signal-bridge.ts',
  'match-explainability-uplink-gate.ts',
  'signal-recovery-orchestrator.ts',
  'match-explainability-uplink-bundle.ts',
  'session-uplink-export-bundle.ts',
  'signal-uplink-bridge.ts',
  'match-explainability-handshake-gate.ts',
  'uplink-recovery-orchestrator.ts',
  'match-explainability-handshake-bundle.ts',
  'session-handshake-export-bundle.ts',
  'uplink-handshake-bridge.ts',
  'match-explainability-ack-gate.ts',
  'handshake-recovery-orchestrator.ts',
  'match-explainability-ack-bundle.ts',
  'session-ack-export-bundle.ts',
  'handshake-ack-bridge.ts',
  'match-explainability-confirm-gate.ts',
  'ack-recovery-orchestrator.ts',
  'match-explainability-confirm-bundle.ts',
  'session-confirm-export-bundle.ts',
  'ack-confirm-bridge.ts',
  'match-explainability-seal-gate.ts',
  'confirm-recovery-orchestrator.ts',
  'match-explainability-seal-bundle.ts',
  'session-seal-export-bundle.ts',
  'confirm-seal-bridge.ts',
  'match-explainability-covenant-gate.ts',
  'seal-recovery-orchestrator.ts',
  'match-explainability-covenant-bundle.ts',
  'session-covenant-export-bundle.ts',
  'seal-covenant-bridge.ts',
  'match-explainability-charter-gate.ts',
  'covenant-recovery-orchestrator.ts',
  'match-explainability-charter-bundle.ts',
  'session-charter-export-bundle.ts',
  'covenant-charter-bridge.ts',
  'match-explainability-pact-gate.ts',
  'charter-recovery-orchestrator.ts',
  'match-explainability-pact-bundle.ts',
  'session-pact-export-bundle.ts',
  'charter-pact-bridge.ts',
  'match-explainability-treaty-gate.ts',
  'pact-recovery-orchestrator.ts',
  'match-explainability-treaty-bundle.ts',
  'session-treaty-export-bundle.ts',
  'pact-treaty-bridge.ts',
  'match-explainability-accord-gate.ts',
  'treaty-recovery-orchestrator.ts',
  'match-explainability-accord-bundle.ts',
  'session-accord-export-bundle.ts',
  'treaty-accord-bridge.ts',
  'match-explainability-league-gate.ts',
  'accord-recovery-orchestrator.ts',
  'match-explainability-league-bundle.ts',
  'session-league-export-bundle.ts',
  'accord-league-bridge.ts',
  'match-explainability-federation-gate.ts',
  'league-recovery-orchestrator.ts',
  'match-explainability-federation-bundle.ts',
  'session-federation-export-bundle.ts',
  'league-federation-bridge.ts',
  'match-explainability-union-gate.ts',
  'federation-recovery-orchestrator.ts',
  'match-explainability-union-bundle.ts',
  'session-union-export-bundle.ts',
  'federation-union-bridge.ts',
  'match-explainability-commonwealth-gate.ts',
  'union-recovery-orchestrator.ts',
  'match-explainability-commonwealth-bundle.ts',
  'session-commonwealth-export-bundle.ts',
  'union-commonwealth-bridge.ts',
  'match-explainability-realm-gate.ts',
  'commonwealth-recovery-orchestrator.ts',
  'match-explainability-realm-bundle.ts',
  'session-realm-export-bundle.ts',
  'commonwealth-realm-bridge.ts',
  'match-explainability-sovereign-gate.ts',
  'realm-recovery-orchestrator.ts',
  'match-explainability-sovereign-bundle.ts',
  'session-sovereign-export-bundle.ts',
  'realm-sovereign-bridge.ts',
  'match-explainability-imperial-gate.ts',
  'sovereign-recovery-orchestrator.ts',
  'match-explainability-imperial-bundle.ts',
  'session-imperial-export-bundle.ts',
  'sovereign-imperial-bridge.ts',
  'match-explainability-dominion-gate.ts',
  'imperial-recovery-orchestrator.ts',
  'match-explainability-dominion-bundle.ts',
  'session-dominion-export-bundle.ts',
  'imperial-dominion-bridge.ts',
  'match-explainability-hegemony-gate.ts',
  'dominion-recovery-orchestrator.ts',
  'match-explainability-hegemony-bundle.ts',
  'session-hegemony-export-bundle.ts',
  'dominion-hegemony-bridge.ts',
  'match-explainability-supremacy-gate.ts',
  'hegemony-recovery-orchestrator.ts',
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
