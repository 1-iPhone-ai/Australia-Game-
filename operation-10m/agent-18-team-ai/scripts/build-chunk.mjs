#!/usr/bin/env node
/**
 * Bundles agent-18-team-ai sources into operation-10m/modules/agent-18-team-ai/chunk.tsx
 * (no top-level import lines — assembly-ready for Agent 25).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-18-team-ai/src');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-18-team-ai');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'types.ts',
  'priority-arbitration.ts',
  'duplicate-action-guard.ts',
  'role-assignment-engine.ts',
  'coordination-orchestrator.ts',
  'directive-coordination.ts',
  'team-boundary-guard.ts',
  'layer-persistence.ts',
  'handoff-sla-monitor.ts',
  'actor-capacity-ledger.ts',
  'directive-quota-guard.ts',
  'handoff-readiness-scorer.ts',
  'mutex-stability-index.ts',
  'workstream-barrier-monitor.ts',
  'role-churn-index.ts',
  'lease-expiry-watchdog.ts',
  'coordination-composite-score.ts',
  'directive-collision-index.ts',
  'handoff-chain-integrity.ts',
  'coordination-escalation-tier.ts',
  'coordination-recovery-playbook.ts',
  'directive-priority-inversion.ts',
  'handoff-orphan-detector.ts',
  'workstream-deadlock-detector.ts',
  'lease-contention-index.ts',
  'coordination-saturation-gauge.ts',
  'mutex-lease-divergence-index.ts',
  'handoff-cascade-analyzer.ts',
  'suppression-backlog-index.ts',
  'coordination-audit.ts',
  'coordination-reconcile.ts',
  'multi-agent-state.ts',
  'dual-team-coordination.ts',
  'self-tests.ts',
];

function stripModulePreamble(source) {
  return source
    .split('\n')
    .filter(line => {
      const t = line.trim();
      if (t.startsWith('import ')) return false;
      if (t.startsWith('export * from')) return false;
      if (t.startsWith('export {') && t.includes(' from ')) return false;
      return true;
    })
    .join('\n');
}

const parts = [
  '// OP10M_MODULE_BEGIN agent-18-team-ai',
  '// Agent 18 — Team Intelligence / multi-agent coordination (generated; source: operation-10m/agent-18-team-ai/src/)',
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

parts.push('// OP10M_MODULE_END agent-18-team-ai');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);

const importLines = body.split('\n').filter(l => l.trim().startsWith('import '));
if (importLines.length) {
  console.error('Chunk still contains import lines:', importLines.length);
  process.exit(1);
}

console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
