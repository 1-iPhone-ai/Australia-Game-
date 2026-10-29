#!/usr/bin/env node
/**
 * Bundles agent-20-automation src into operation-10m/modules/agent-20-automation/chunk.tsx (no top-level imports).
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-20-automation/src');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-20-automation');
const outFile = path.join(outDir, 'chunk.tsx');
const manifestFile = path.join(outDir, 'module.manifest.json');

const MODULE_VERSION = '10m.1.21.0-agent20';

const FILES = [
  'types.ts',
  'conditional-actions.ts',
  'limits.ts',
  'logs.ts',
  'safe-time-advance.ts',
  'national-steward.ts',
  'bridge-hooks.ts',
  'idle-automation-depth.ts',
  'turn-compute-engine.ts',
  'turn-hooks.ts',
  'idle-automation-simulation.ts',
  'automation-intent-queue.ts',
  'day-boundary-compute.ts',
  'scenario-runner.ts',
  'automation-soak-projection.ts',
  'automation-replay-tape.ts',
  'intent-schedule-coordinator.ts',
  'automation-idle-escalation.ts',
  'automation-soak-replay-attestation.ts',
  'automation-intent-backpressure.ts',
  'automation-idle-deescalation.ts',
  'automation-backpressure-telemetry.ts',
  'automation-idle-ops-pipeline.ts',
  'automation-idle-ops-window.ts',
  'automation-backpressure-alerts.ts',
  'automation-steward-idle-coordination.ts',
  'automation-backpressure-remediation.ts',
  'automation-idle-ops-governance.ts',
  'automation-idle-governance-report.ts',
  'automation-governance-remediation-runner.ts',
  'automation-idle-governance-audit-trail.ts',
  'automation-idle-governance-stabilization.ts',
  'automation-idle-governance-reconciliation.ts',
  'automation-idle-governance-escalation-ladder.ts',
  'automation-idle-governance-copilot-brief.ts',
  'automation-idle-governance-audit-trend.ts',
  'automation-idle-governance-cycle-attestation.ts',
  'automation-idle-governance-assurance-pass.ts',
  'automation-idle-governance-assurance-journal.ts',
  'automation-idle-governance-assurance-rollup.ts',
  'automation-idle-governance-sustained-watch.ts',
  'automation-idle-governance-watch-replay-tape.ts',
  'automation-idle-governance-program-charter.ts',
  'automation-idle-governance-program-pass.ts',
  'automation-idle-governance-program-attestation.ts',
  'automation-idle-governance-program-registry.ts',
  'automation-idle-governance-program-operations.ts',
  'automation-idle-governance-program-registry-rollup.ts',
  'automation-idle-governance-program-compliance-score.ts',
  'automation-idle-governance-program-director-pass.ts',
  'automation-idle-governance-program-remediation-plan.ts',
  'automation-idle-governance-program-board-certification.ts',
  'automation-idle-governance-program-executive-pass.ts',
  'automation-idle-governance-program-subject-pass.ts',
  'automation-idle-governance-program-scale-wave-rollup.ts',
  'automation-idle-governance-program-wave-closeout.ts',
  'automation-idle-governance-program-wave-scorecard.ts',
  'automation-idle-governance-program-wave-closeout-compare.ts',
  'automation-idle-governance-program-wave-assembly-gate.ts',
  'automation-idle-governance-program-wave-scorecard-compare.ts',
  'automation-idle-governance-program-wave-assembly-run.ts',
  'automation-idle-governance-program-wave-assembly-export.ts',
  'automation-idle-governance-program-wave-assembly-export-compare.ts',
  'automation-idle-governance-program-wave-assembly-replay-parity.ts',
  'automation-idle-governance-program-wave-integration-gate.ts',
  'automation-idle-governance-program-wave-integration-gate-compare.ts',
  'automation-idle-governance-program-wave-handoff-bundle.ts',
  'automation-idle-governance-program-wave-cycle-closeout.ts',
  'index.ts',
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

const sourceBlocks = [];
for (const rel of FILES) {
  const abs = path.join(srcRoot, rel);
  if (!fs.existsSync(abs)) {
    console.error('Missing source file:', rel);
    process.exit(1);
  }
  sourceBlocks.push(`// --- source: ${rel} ---`);
  sourceBlocks.push(stripModulePreamble(fs.readFileSync(abs, 'utf8')));
  sourceBlocks.push('');
}

const hashedBody = [...sourceBlocks, '// OP10M_MODULE_END agent-20-automation', ''].join('\n');
const chunkSha256 = crypto.createHash('sha256').update(hashedBody, 'utf8').digest('hex');

const header = [
  '// OP10M_MODULE_BEGIN agent-20-automation',
  `// OP10M_MANIFEST_SHA256: ${chunkSha256}`,
  `// OP10M_MODULE_VERSION: ${MODULE_VERSION}`,
  '// Agent 20 — idle / automation / autonomous ops (generated; source: operation-10m/agent-20-automation/src/)',
  '',
];

const body = [...header, ...sourceBlocks, '// OP10M_MODULE_END agent-20-automation', ''].join('\n');
const lineCount = body.split('\n').length;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, body);

const manifest = {
  moduleId: 'agent-20-automation',
  moduleVersion: MODULE_VERSION,
  slot: 'append-only-self-tests',
  touchesSaveFormat: true,
  anchorComment: 'O10_AGENT20_INTEGRATION_ANCHOR',
  sourceRoot: 'operation-10m/agent-20-automation/src',
  regenerate: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  chunkSha256,
  chunkLineCount: lineCount,
  sourceFiles: FILES,
};

fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
console.log('Wrote', outFile, `(${lineCount} lines)`, 'sha256', chunkSha256.slice(0, 12) + '…');
