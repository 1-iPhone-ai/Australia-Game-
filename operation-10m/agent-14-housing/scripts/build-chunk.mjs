#!/usr/bin/env node
/**
 * Bundles agent-14-housing sources into operation-10m/modules/agent-14-housing/chunk.tsx (no imports).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-14-housing');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-14-housing');
const outFile = path.join(outDir, 'chunk.tsx');

/** Dependency-safe order (imports stripped; no cross-file refs at runtime). */
const FILES = [
  'types.ts',
  'constants.ts',
  'housing-delivery-pipeline.ts',
  'national-wellbeing-snapshot.ts',
  'public-service-capacity.ts',
  'delayed-spending-effects.ts',
  'program-stub-commitments.ts',
  'service-access-lens.ts',
  'wellbeing-guardian-warnings.ts',
  'program-sequencing.ts',
  'wellbeing-forecast.ts',
  'cross-pillar-coupling.ts',
  'regional-wellbeing-memory.ts',
  'coupling-trajectory.ts',
  'wellbeing-accountability-scorecard.ts',
  'equity-rebalancing-advisor.ts',
  'accountability-trajectory.ts',
  'wellbeing-resilience-index.ts',
  'resilience-trajectory.ts',
  'intervention-priority-queue.ts',
  'capacity-relief-scheduler.ts',
  'wellbeing-governance-panel.ts',
  'governance-trajectory.ts',
  'relief-dispatch-planner.ts',
  'stakeholder-coordination-brief.ts',
  'coordination-trajectory.ts',
  'relief-execution-monitor.ts',
  'portfolio-stabilization-brief.ts',
  'stabilization-trajectory.ts',
  'relief-fulfillment-tracker.ts',
  'wellbeing-recovery-readiness-brief.ts',
  'readiness-trajectory.ts',
  'fulfillment-aging-monitor.ts',
  'portfolio-resumption-plan.ts',
  'resumption-trajectory.ts',
  'commit-gating-advisor.ts',
  'portfolio-handoff-brief.ts',
  'handoff-trajectory.ts',
  'gated-commit-scheduler.ts',
  'wellbeing-integration-handoff-brief.ts',
  'integration-trajectory.ts',
  'schedule-readiness-monitor.ts',
  'national-wire-in-readiness-brief.ts',
  'wire-in-trajectory.ts',
  'turn-boundary-activation-monitor.ts',
  'agent25-assembly-handoff-brief.ts',
  'assembly-merge-trajectory.ts',
  'chunk-anchor-alignment-monitor.ts',
  'agent25-inline-readiness-brief.ts',
  'inline-merge-trajectory.ts',
  'inline-activation-monitor.ts',
  'agent25-wave17-projection-handoff-brief.ts',
  'projection-gate-trajectory.ts',
  'wave18-projection-monitor.ts',
  'agent25-wave18-projection-handoff-brief.ts',
  'wave19-gate-trajectory.ts',
  'wave19-integration-monitor.ts',
  'agent25-wave19-projection-handoff-brief.ts',
  'wave20-gate-trajectory.ts',
  'wave20-integration-monitor.ts',
  'agent25-wave20-projection-handoff-brief.ts',
  'wave21-gate-trajectory.ts',
  'wave21-integration-monitor.ts',
  'agent25-wave21-projection-handoff-brief.ts',
  'wave22-gate-trajectory.ts',
  'wave22-integration-monitor.ts',
  'agent25-wave22-projection-handoff-brief.ts',
  'wave23-gate-trajectory.ts',
  'wave23-integration-monitor.ts',
  'agent25-wave23-projection-handoff-brief.ts',
  'wave24-gate-trajectory.ts',
  'wave24-integration-monitor.ts',
  'agent25-wave24-projection-handoff-brief.ts',
  'wave25-gate-trajectory.ts',
  'wave25-integration-monitor.ts',
  'agent25-wave25-projection-handoff-brief.ts',
  'wave26-gate-trajectory.ts',
  'wave26-integration-monitor.ts',
  'agent25-wave26-projection-handoff-brief.ts',
  'wave27-gate-trajectory.ts',
  'wave27-integration-monitor.ts',
  'agent25-wave27-projection-handoff-brief.ts',
  'wave28-gate-trajectory.ts',
  'wave28-integration-monitor.ts',
  'agent25-wave28-projection-handoff-brief.ts',
  'wave29-gate-trajectory.ts',
  'wave29-integration-monitor.ts',
  'agent25-wave29-projection-handoff-brief.ts',
  'wave30-gate-trajectory.ts',
  'wave30-integration-monitor.ts',
  'agent25-wave30-projection-handoff-brief.ts',
  'wave31-gate-trajectory.ts',
  'wave31-integration-monitor.ts',
  'agent25-wave31-projection-handoff-brief.ts',
  'wave32-gate-trajectory.ts',
  'wave32-integration-monitor.ts',
  'agent25-wave32-projection-handoff-brief.ts',
  'wave33-gate-trajectory.ts',
  'wave33-integration-monitor.ts',
  'agent25-wave33-projection-handoff-brief.ts',
  'wave34-gate-trajectory.ts',
  'wave34-integration-monitor.ts',
  'agent25-wave34-projection-handoff-brief.ts',
  'wave35-gate-trajectory.ts',
  'wave35-integration-monitor.ts',
  'agent25-wave35-projection-handoff-brief.ts',
  'wave36-gate-trajectory.ts',
  'wave36-integration-monitor.ts',
  'agent25-wave36-projection-handoff-brief.ts',
  'wave37-gate-trajectory.ts',
  'wave37-integration-monitor.ts',
  'agent25-wave37-projection-handoff-brief.ts',
  'wave38-gate-trajectory.ts',
  'wave38-integration-monitor.ts',
  'agent25-wave38-projection-handoff-brief.ts',
  'wave39-gate-trajectory.ts',
  'wave39-integration-monitor.ts',
  'agent25-wave39-projection-handoff-brief.ts',
  'wave40-gate-trajectory.ts',
  'wave40-integration-monitor.ts',
  'agent25-wave40-projection-handoff-brief.ts',
  'wave41-gate-trajectory.ts',
  'wave41-integration-monitor.ts',
  'agent25-wave41-projection-handoff-brief.ts',
  'wave42-gate-trajectory.ts',
  'wave42-integration-monitor.ts',
  'agent25-wave42-projection-handoff-brief.ts',
  'wave43-gate-trajectory.ts',
  'wave43-integration-monitor.ts',
  'agent25-wave43-projection-handoff-brief.ts',
  'wave44-gate-trajectory.ts',
  'wave44-integration-monitor.ts',
  'agent25-wave44-projection-handoff-brief.ts',
  'wave45-gate-trajectory.ts',
  'wave45-integration-monitor.ts',
  'agent25-wave45-projection-handoff-brief.ts',
  'wave46-gate-trajectory.ts',
  'wave46-integration-monitor.ts',
  'agent25-wave46-projection-handoff-brief.ts',
  'wave47-gate-trajectory.ts',
  'wave47-integration-monitor.ts',
  'agent25-wave47-projection-handoff-brief.ts',
  'wave48-gate-trajectory.ts',
  'wave48-integration-monitor.ts',
  'agent25-wave48-projection-handoff-brief.ts',
  'wellbeing-executive-brief.ts',
  'turn-advance.ts',
  'scenario-sweep.ts',
  'self-tests.ts',
];

function stripModulePreamble(source) {
  let out = source.replace(/^import\s+(?:type\s+)?[\s\S]*?from\s+['"][^'"]+['"];?\s*\n/gm, '');
  out = out.replace(/^export \* from\s+['"][^'"]+['"];?\s*\n/gm, '');
  out = out.replace(/^export \{[\s\S]*?\} from\s+['"][^'"]+['"];?\s*\n/gm, '');
  return out;
}

const parts = [
  '// OP10M_MODULE_BEGIN agent-14-housing',
  '// Agent 14 — V10.14 housing / health / education public service capacity & delayed spending',
  '// Generated from operation-10m/agent-14-housing/ (regenerate: npm run build:agent14-housing-chunk)',
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

parts.push('// OP10M_MODULE_END agent-14-housing');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const text = parts.join('\n');
fs.writeFileSync(outFile, text);
console.log('Wrote', outFile, `(${text.split('\n').length} lines)`);
