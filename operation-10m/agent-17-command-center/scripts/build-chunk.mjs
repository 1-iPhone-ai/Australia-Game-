#!/usr/bin/env node
/**
 * Bundles Agent 17 modular sources into operation-10m/modules/agent-17-command-center/chunk.tsx
 * (no top-level imports; OP10M assembly-ready).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-17-command-center');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-17-command-center');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'types/command-center-types.ts',
  'planning/fingerprint.ts',
  'planning/deep-templates.ts',
  'planning/templates.ts',
  'planning/ops-state.ts',
  'planning/recovery-paths.ts',
  'planning/template-selector.ts',
  'planning/plan-health.ts',
  'planning/delegation-analytics.ts',
  'planning/delegation-ladder.ts',
  'planning/plan-ledger.ts',
  'planning/delegation-depth.ts',
  'planning/intent-synthesis.ts',
  'planning/verification-policy.ts',
  'planning/coordination-brief.ts',
  'planning/execution-pacing.ts',
  'planning/resilience-scorecard.ts',
  'planning/strategic-alignment.ts',
  'planning/handoff-readiness.ts',
  'planning/command-posture.ts',
  'planning/governance-audit.ts',
  'planning/escalation-matrix.ts',
  'planning/rollback-assurance.ts',
  'planning/stabilization-index.ts',
  'planning/command-envelope.ts',
  'planning/convergence-index.ts',
  'planning/mission-directive.ts',
  'planning/directive-synthesis.ts',
  'planning/execution-closure.ts',
  'planning/cadence-lattice.ts',
  'planning/readiness-gate.ts',
  'planning/pulse-index.ts',
  'planning/continuity-bridge.ts',
  'planning/flux-index.ts',
  'planning/integrity-seal.ts',
  'planning/commit-lattice.ts',
  'planning/covenant-gate.ts',
  'planning/mandate-weave.ts',
  'planning/sovereignty-lock.ts',
  'planning/authority-charter.ts',
  'planning/dispatch-accord.ts',
  'planning/mobilization-index.ts',
  'planning/execution-summons.ts',
  'planning/field-index.ts',
  'planning/theater-commitment.ts',
  'planning/campaign-index.ts',
  'planning/mission-lattice.ts',
  'planning/strategic-index.ts',
  'planning/doctrine-accord.ts',
  'planning/command-index.ts',
  'planning/federation-accord.ts',
  'planning/alliance-index.ts',
  'planning/coalition-accord.ts',
  'planning/pact-index.ts',
  'planning/unity-accord.ts',
  'planning/compact-index.ts',
  'planning/sovereign-accord.ts',
  'planning/planning-orchestrator.ts',
  'evaluation/operations-evaluator.ts',
  'rollback/rollback-controller.ts',
  'goals/goal-registry.ts',
  'validation/goal-verification.ts',
  'harness/run-acc17-dev-tests.ts',
  'harness/run-recovery-path-tests.ts',
  'harness/run-planning-depth-tests.ts',
  'harness/run-delegation-depth-tests.ts',
  'harness/run-coordination-depth-tests.ts',
  'harness/run-execution-depth-tests.ts',
  'harness/run-continuity-depth-tests.ts',
  'harness/run-governance-depth-tests.ts',
  'harness/run-assurance-depth-tests.ts',
  'harness/run-stabilization-depth-tests.ts',
  'harness/run-convergence-depth-tests.ts',
  'harness/run-synthesis-depth-tests.ts',
  'harness/run-cadence-depth-tests.ts',
  'harness/run-pulse-depth-tests.ts',
  'harness/run-flux-depth-tests.ts',
  'harness/run-covenant-depth-tests.ts',
  'harness/run-mandate-depth-tests.ts',
  'harness/run-authority-depth-tests.ts',
  'harness/run-operations-depth-tests.ts',
  'harness/run-field-depth-tests.ts',
  'harness/run-campaign-depth-tests.ts',
  'harness/run-strategic-depth-tests.ts',
  'harness/run-command-depth-tests.ts',
  'harness/run-alliance-depth-tests.ts',
  'harness/run-pact-depth-tests.ts',
  'harness/run-compact-depth-tests.ts',
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
  '// OP10M_MODULE_BEGIN agent-17-command-center',
  '// Agent 17 — Game Intelligence / AI Command Center (generated; source: operation-10m/agent-17-command-center/)',
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

parts.push(`export function runAgent17Op10mModuleSelfTests(): {
  acc17: ReturnType<typeof runAgent17Acc17DevTests>;
  recovery: ReturnType<typeof runAgent17RecoveryPathTests>;
  depth: ReturnType<typeof runAgent17PlanningDepthTests>;
  delegation: ReturnType<typeof runAgent17DelegationDepthTests>;
  coordination: ReturnType<typeof runAgent17CoordinationDepthTests>;
  execution: ReturnType<typeof runAgent17ExecutionDepthTests>;
  continuity: ReturnType<typeof runAgent17ContinuityDepthTests>;
  governance: ReturnType<typeof runAgent17GovernanceDepthTests>;
  assurance: ReturnType<typeof runAgent17AssuranceDepthTests>;
  success: boolean;
} {
  const acc17 = runAgent17Acc17DevTests();
  const recovery = runAgent17RecoveryPathTests();
  const depth = runAgent17PlanningDepthTests();
  const delegation = runAgent17DelegationDepthTests();
  const coordination = runAgent17CoordinationDepthTests();
  const execution = runAgent17ExecutionDepthTests();
  const continuity = runAgent17ContinuityDepthTests();
  const governance = runAgent17GovernanceDepthTests();
  const assurance = runAgent17AssuranceDepthTests();
  return {
    acc17,
    recovery,
    depth,
    delegation,
    coordination,
    execution,
    continuity,
    governance,
    assurance,
    success:
      acc17.success &&
      recovery.success &&
      depth.success &&
      delegation.success &&
      coordination.success &&
      execution.success &&
      continuity.success &&
      governance.success &&
      assurance.success,
  };
}`);
parts.push('');
parts.push('// OP10M_MODULE_END agent-17-command-center');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
