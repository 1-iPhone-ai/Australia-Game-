#!/usr/bin/env node
/**
 * Bundles agent-24-replay sources into operation-10m/modules/agent-24-history/chunk.tsx
 * (no top-level import lines — inline-ready for Agent 25 / OP10M assembly).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-24-replay/src');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-24-history');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'fingerprint.ts',
  'causal-records.ts',
  'timeline-registry.ts',
  'late-game-replay.ts',
  'analytics-depth.ts',
  'replay-scenarios.ts',
  'audit-trails.ts',
  'multi-session.ts',
  'timeline-divergence.ts',
  'history-rollups.ts',
  'replay-attestation.ts',
  'checkpoint-coverage.ts',
  'rewind-safety.ts',
  'history-reconciliation.ts',
  'replay-playback-integrity.ts',
  'branch-lineage.ts',
  'export-readiness.ts',
  'export-manifest.ts',
  'import-validation.ts',
  'history-retention.ts',
  'archive-compaction.ts',
  'replay-transfer-gate.ts',
  'snapshot-seal.ts',
  'seal-verification.ts',
  'replay-restore-gate.ts',
  'archive-publish-plan.ts',
  'replay-restore-plan.ts',
  'archive-publish-dispatch.ts',
  'publish-receipt-ledger.ts',
  'restore-execution-gate.ts',
  'archive-fulfillment-audit.ts',
  'ledger-seal-continuity.ts',
  'restore-commit-record.ts',
  'fulfillment-seal-bridge.ts',
  'archive-continuity-attestation.ts',
  'continuity-export-gate.ts',
  'restore-commit-audit.ts',
  'attestation-chain-seal.ts',
  'attestation-chain-verification.ts',
  'continuity-export-ledger.ts',
  'archive-roundtrip-gate.ts',
  'archive-roundtrip-verification.ts',
  'export-ledger-reconciliation.ts',
  'archive-handoff-seal.ts',
  'archive-handoff-verification.ts',
  'replay-pipeline-closeout.ts',
  'archive-continuity-finalization.ts',
  'archive-continuity-verification.ts',
  'replay-scale-wave-acceptance.ts',
  'archive-release-gate.ts',
  'archive-release-verification.ts',
  'replay-scale-wave-handoff-seal.ts',
  'replay-scale-wave-closeout.ts',
  'replay-scale-wave-verification.ts',
  'archive-scale-wave-finalization.ts',
  'replay-scale-wave-attestation.ts',
  'replay-scale-wave-attestation-verification.ts',
  'archive-scale-wave-release-handoff-gate.ts',
  'replay-scale-wave-integration-closeout.ts',
  'replay-scale-wave-integration-verification.ts',
  'archive-scale-wave-export-gate.ts',
  'replay-scale-wave-projection-handoff.ts',
  'replay-scale-wave-projection-verification.ts',
  'archive-scale-wave-post-projection-gate.ts',
  'replay-scale-wave-dryrun-handoff.ts',
  'replay-scale-wave-dryrun-verification.ts',
  'archive-scale-wave-full-chunks-gate.ts',
  'replay-scale-wave-full-chunks-handoff.ts',
  'replay-scale-wave-full-chunks-verification.ts',
  'archive-scale-wave-wave23-export-gate.ts',
  'replay-scale-wave-wave23-integration-handoff.ts',
  'replay-scale-wave-wave23-integration-verification.ts',
  'archive-scale-wave-wave24-export-gate.ts',
  'replay-scale-wave-wave24-integration-handoff.ts',
  'replay-scale-wave-wave24-integration-verification.ts',
  'archive-scale-wave-wave25-export-gate.ts',
  'replay-scale-wave-wave25-integration-handoff.ts',
  'replay-scale-wave-wave25-integration-verification.ts',
  'archive-scale-wave-wave26-export-gate.ts',
  'replay-scale-wave-wave26-integration-handoff.ts',
  'replay-scale-wave-wave26-integration-verification.ts',
  'archive-scale-wave-wave27-export-gate.ts',
  'replay-scale-wave-wave27-integration-handoff.ts',
  'replay-scale-wave-wave27-integration-verification.ts',
  'archive-scale-wave-wave28-export-gate.ts',
  'replay-scale-wave-wave28-integration-handoff.ts',
  'replay-scale-wave-wave28-integration-verification.ts',
  'archive-scale-wave-wave29-export-gate.ts',
  'replay-scale-wave-wave29-integration-handoff.ts',
  'replay-scale-wave-wave29-integration-verification.ts',
  'archive-scale-wave-wave30-export-gate.ts',
  'replay-scale-wave-wave30-integration-handoff.ts',
  'replay-scale-wave-wave30-integration-verification.ts',
  'archive-scale-wave-wave31-export-gate.ts',
  'replay-scale-wave-wave31-integration-handoff.ts',
  'replay-scale-wave-wave31-integration-verification.ts',
  'archive-scale-wave-wave32-export-gate.ts',
  'replay-scale-wave-wave32-integration-handoff.ts',
  'replay-scale-wave-wave32-integration-verification.ts',
  'archive-scale-wave-wave33-export-gate.ts',
  'replay-scale-wave-wave33-integration-handoff.ts',
  'replay-scale-wave-wave33-integration-verification.ts',
  'archive-scale-wave-wave34-export-gate.ts',
  'replay-scale-wave-wave34-integration-verification.ts',
    'replay-scale-wave-wave34-integration-handoff.ts',
    'archive-scale-wave-wave35-export-gate.ts',
    'replay-scale-wave-wave35-integration-handoff.ts',
    'replay-scale-wave-wave35-integration-verification.ts',
    'archive-scale-wave-wave36-export-gate.ts',
    'replay-scale-wave-wave36-integration-handoff.ts',
  'history-replay-analytics.ts',
  'replay-determinism.ts',
  'historical-analytics-dashboard.tsx',
];

function stripModulePreamble(source) {
  return source
    .split('\n')
    .filter(line => {
      const t = line.trim();
      if (t.startsWith('import ')) return false;
      if (t.startsWith('import\t')) return false;
      if (t.startsWith('export * from')) return false;
      return true;
    })
    .join('\n');
}

const parts = [
  '// OP10M_MODULE_BEGIN agent-24-history',
  '// Agent 24 — history / replay / late game (generated; source: operation-10m/agent-24-replay/src/)',
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

parts.push('// OP10M_MODULE_END agent-24-history');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
const importLines = body.split('\n').filter(l => /^\s*import\s/.test(l));
if (importLines.length) {
  console.error('Chunk still contains import lines:', importLines.length);
  process.exit(1);
}
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
