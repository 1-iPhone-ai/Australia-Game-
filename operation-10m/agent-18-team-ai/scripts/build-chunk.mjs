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
  'reconcile-drift-index.ts',
  'arbitration-pressure-index.ts',
  'persistence-churn-gauge.ts',
  'duplicate-guard-pressure.ts',
  'role-task-coverage-gap.ts',
  'composite-health-gradient.ts',
  'handoff-readiness-spread.ts',
  'workstream-parallelism-index.ts',
  'escalation-recovery-alignment.ts',
  'audit-pressure-index.ts',
  'role-lock-friction-index.ts',
  'directive-constraint-density.ts',
  'cross-team-rejection-index.ts',
  'handoff-sla-velocity-index.ts',
  'recovery-action-breadth.ts',
  'directive-quota-exhaustion-index.ts',
  'capacity-imbalance-index.ts',
  'workstream-barrier-staleness-index.ts',
  'workstream-deadlock-pressure-index.ts',
  'suppression-quota-coupling-index.ts',
  'handoff-lease-overlap-index.ts',
  'saturation-deadlock-coupling-index.ts',
  'cascade-lease-convergence-index.ts',
  'gradient-audit-tension-index.ts',
  'escalation-saturation-stack-index.ts',
  'recovery-cascade-mismatch-index.ts',
  'persistence-gradient-friction-index.ts',
  'stack-mismatch-coupling-index.ts',
  'audit-stack-amplification-index.ts',
  'friction-alignment-gap-index.ts',
  'coupling-amplification-fusion-index.ts',
  'gap-churn-resonance-index.ts',
  'stack-friction-convergence-index.ts',
  'fusion-resonance-coupling-index.ts',
  'convergence-fusion-stack-index.ts',
  'resonance-audit-cascade-index.ts',
  'coupling-stack-cascade-index.ts',
  'stack-cascade-amplification-index.ts',
  'cascade-coupling-synthesis-index.ts',
  'cascade-synthesis-fusion-index.ts',
  'amplification-stack-resonance-index.ts',
  'synthesis-escalation-pressure-index.ts',
  'fusion-resonance-convergence-index.ts',
  'pressure-fusion-cascade-index.ts',
  'resonance-pressure-synthesis-index.ts',
  'convergence-cascade-synthesis-index.ts',
  'synthesis-convergence-stack-index.ts',
  'cascade-resonance-amplification-index.ts',
  'synthesis-stack-amplification-index.ts',
  'amplification-convergence-cascade-index.ts',
  'stack-synthesis-resonance-index.ts',
  'stack-amplification-cascade-fusion-index.ts',
  'resonance-amplification-stack-index.ts',
  'cascade-convergence-resonance-index.ts',
  'fusion-stack-convergence-index.ts',
  'resonance-cascade-synthesis-index.ts',
  'convergence-amplification-pressure-index.ts',
  'convergence-synthesis-fusion-index.ts',
  'pressure-cascade-stack-index.ts',
  'synthesis-pressure-resonance-index.ts',
  'fusion-cascade-stack-index.ts',
  'resonance-pressure-cascade-index.ts',
  'synthesis-fusion-convergence-index.ts',
  'stack-cascade-resonance-index.ts',
  'cascade-convergence-pressure-index.ts',
  'convergence-fusion-synthesis-index.ts',
  'resonance-convergence-fusion-index.ts',
  'pressure-synthesis-cascade-index.ts',
  'synthesis-resonance-stack-index.ts',
  'convergence-fusion-pressure-index.ts',
  'synthesis-cascade-stack-index.ts',
  'resonance-stack-fusion-index.ts',
  'pressure-stack-resonance-index.ts',
  'stack-fusion-cascade-index.ts',
  'fusion-cascade-convergence-index.ts',
  'resonance-fusion-stack-index.ts',
  'fusion-cascade-pressure-index.ts',
  'stack-convergence-resonance-index.ts',
  'fusion-stack-pressure-index.ts',
  'pressure-resonance-cascade-index.ts',
  'stack-synthesis-convergence-index.ts',
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
