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

const MODULE_VERSION = '10m.1.52.0-agent20';

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
  'automation-idle-governance-program-wave-cycle-closeout-compare.ts',
  'automation-idle-governance-program-wave-projection-rollup.ts',
  'automation-idle-governance-program-wave-scale-dispatch.ts',
  'automation-idle-governance-program-wave-scale-dispatch-compare.ts',
  'automation-idle-governance-program-wave-scale-dispatch-replay-parity.ts',
  'automation-idle-governance-program-wave-landing-gate.ts',
  'automation-idle-governance-program-wave-landing-gate-compare.ts',
  'automation-idle-governance-program-wave-landing-bundle.ts',
  'automation-idle-governance-program-wave-scale-wave-seal.ts',
  'automation-idle-governance-program-wave-scale-wave-seal-compare.ts',
  'automation-idle-governance-program-wave-scale-wave-seal-export.ts',
  'automation-idle-governance-program-wave-epoch-closeout.ts',
  'automation-idle-governance-program-wave-epoch-closeout-compare.ts',
  'automation-idle-governance-program-wave-epoch-export.ts',
  'automation-idle-governance-program-wave-round26-capstone.ts',
  'automation-idle-governance-program-wave-round26-capstone-compare.ts',
  'automation-idle-governance-program-wave-round27-export.ts',
  'automation-idle-governance-program-wave-round27-capstone.ts',
  'automation-idle-governance-program-wave-round27-capstone-compare.ts',
  'automation-idle-governance-program-wave-round28-export.ts',
  'automation-idle-governance-program-wave-round28-capstone.ts',
  'automation-idle-governance-program-wave-round28-capstone-compare.ts',
  'automation-idle-governance-program-wave-round29-export.ts',
  'automation-idle-governance-program-wave-round29-capstone.ts',
  'automation-idle-governance-program-wave-round29-capstone-compare.ts',
  'automation-idle-governance-program-wave-round30-export.ts',
  'automation-idle-governance-program-wave-round30-capstone.ts',
  'automation-idle-governance-program-wave-round30-capstone-compare.ts',
  'automation-idle-governance-program-wave-round31-export.ts',
  'automation-idle-governance-program-wave-round31-capstone.ts',
  'automation-idle-governance-program-wave-round31-capstone-compare.ts',
  'automation-idle-governance-program-wave-round32-export.ts',
  'automation-idle-governance-program-wave-round32-capstone.ts',
  'automation-idle-governance-program-wave-round32-capstone-compare.ts',
  'automation-idle-governance-program-wave-round33-export.ts',
  'automation-idle-governance-program-wave-round33-capstone.ts',
  'automation-idle-governance-program-wave-round33-capstone-compare.ts',
  'automation-idle-governance-program-wave-round34-export.ts',
  'automation-idle-governance-program-wave-round34-capstone.ts',
  'automation-idle-governance-program-wave-round34-capstone-compare.ts',
  'automation-idle-governance-program-wave-round35-export.ts',
  'automation-idle-governance-program-wave-round35-capstone.ts',
  'automation-idle-governance-program-wave-round35-capstone-compare.ts',
  'automation-idle-governance-program-wave-round36-export.ts',
  'automation-idle-governance-program-wave-round36-capstone.ts',
  'automation-idle-governance-program-wave-round36-capstone-compare.ts',
  'automation-idle-governance-program-wave-round37-export.ts',
  'automation-idle-governance-program-wave-round37-capstone.ts',
  'automation-idle-governance-program-wave-round37-capstone-compare.ts',
  'automation-idle-governance-program-wave-round38-export.ts',
  'automation-idle-governance-program-wave-round38-capstone.ts',
  'automation-idle-governance-program-wave-round38-capstone-compare.ts',
  'automation-idle-governance-program-wave-round39-export.ts',
  'automation-idle-governance-program-wave-round39-capstone.ts',
  'automation-idle-governance-program-wave-round39-capstone-compare.ts',
  'automation-idle-governance-program-wave-round40-export.ts',
  'automation-idle-governance-program-wave-round40-capstone.ts',
  'automation-idle-governance-program-wave-round40-capstone-compare.ts',
  'automation-idle-governance-program-wave-round41-export.ts',
  'automation-idle-governance-program-wave-round41-capstone.ts',
  'automation-idle-governance-program-wave-round41-capstone-compare.ts',
  'automation-idle-governance-program-wave-round42-export.ts',
  'automation-idle-governance-program-wave-round42-capstone.ts',
  'automation-idle-governance-program-wave-round42-capstone-compare.ts',
  'automation-idle-governance-program-wave-round43-export.ts',
  'automation-idle-governance-program-wave-round43-capstone.ts',
  'automation-idle-governance-program-wave-round43-capstone-compare.ts',
  'automation-idle-governance-program-wave-round44-export.ts',
  'automation-idle-governance-program-wave-round44-capstone.ts',
  'automation-idle-governance-program-wave-round44-capstone-compare.ts',
  'automation-idle-governance-program-wave-round45-export.ts',
  'automation-idle-governance-program-wave-round45-capstone.ts',
  'automation-idle-governance-program-wave-round45-capstone-compare.ts',
  'automation-idle-governance-program-wave-round46-export.ts',
  'automation-idle-governance-program-wave-round46-capstone.ts',
  'automation-idle-governance-program-wave-round46-capstone-compare.ts',
  'automation-idle-governance-program-wave-round47-export.ts',
  'automation-idle-governance-program-wave-round47-capstone.ts',
  'automation-idle-governance-program-wave-round47-capstone-compare.ts',
  'automation-idle-governance-program-wave-round48-export.ts',
  'automation-idle-governance-program-wave-round48-capstone.ts',
  'automation-idle-governance-program-wave-round48-capstone-compare.ts',
  'automation-idle-governance-program-wave-round49-export.ts',
  'automation-idle-governance-program-wave-round49-capstone.ts',
  'automation-idle-governance-program-wave-round49-capstone-compare.ts',
  'automation-idle-governance-program-wave-round50-export.ts',
  'automation-idle-governance-program-wave-round50-capstone.ts',
  'automation-idle-governance-program-wave-round50-capstone-compare.ts',
  'automation-idle-governance-program-wave-round51-export.ts',
  'automation-idle-governance-program-wave-round51-capstone.ts',
  'automation-idle-governance-program-wave-round51-capstone-compare.ts',
  'automation-idle-governance-program-wave-round52-export.ts',
  'automation-idle-governance-program-wave-round52-capstone.ts',
    'automation-idle-governance-program-wave-round53-export.ts',
    'automation-idle-governance-program-wave-round53-capstone.ts',
    'automation-idle-governance-program-wave-round54-export.ts',
    'automation-idle-governance-program-wave-round54-capstone.ts',
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
