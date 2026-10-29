/**
 * Bundles module `src/` into assembly-ready `chunk.tsx` with OP10M markers.
 * See operation-10m/agent-02-turns-time/INTEGRATION.md — no npm/local imports in output.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleRoot = resolve(__dirname, '..');
const moduleId = 'agent-02-turns-time';

/** Stable concat order: dependencies before dependents. */
const SOURCE_FILES = [
  'src/types.ts',
  'src/turn-sequence.ts',
  'src/scheduled-obligations.ts',
  'src/event-scheduling-queue.ts',
  'src/multi-turn-construction.ts',
  'src/defer-schedule.ts',
  'src/delayed-consequences.ts',
  'src/construction-pause-slip.ts',
  'src/cancel-cascade.ts',
  'src/turn-horizon.ts',
  'src/replay-compare.ts',
  'src/pipeline-stages.ts',
  'src/plan-actual-reconcile.ts',
  'src/advance-budget.ts',
  'src/external-day-plan.ts',
  'src/external-day-plan-window.ts',
  'src/external-day-plan-window-gate.ts',
  'src/pipeline-stage-coverage.ts',
  'src/pipeline-coverage-delta.ts',
  'src/turn-pipeline-report.ts',
  'src/diagnostics.ts',
  'src/turn-audit.ts',
  'src/pause-resume.ts',
  'src/engine.ts',
  'src/batch-advance.ts',
  'src/batch-pipeline-report.ts',
  'src/batch-horizon-reconcile-report.ts',
  'src/batch-step-pipeline-reports.ts',
  'src/batch-advance-observability.ts',
  'src/pipeline-coverage-gap-report.ts',
  'src/batch-observability-digest.ts',
  'src/external-day-plan-batch-gate.ts',
  'src/external-stabilization-signals.ts',
  'src/agent02-stabilization-inference.ts',
  'src/external-stabilization-batch-gate.ts',
  'src/batch-stabilization-reconcile-report.ts',
  'src/batch-stabilization-digest.ts',
  'src/stabilization-lattice-sequence-gate.ts',
  'src/external-stabilization-window.ts',
  'src/external-stabilization-window-gate.ts',
  'src/batch-stabilization-queue-capture.ts',
  'src/batch-composite-readiness-digest.ts',
  'src/advance-budget-batch-report.ts',
  'src/batch-advance-readiness-gate.ts',
  'src/batch-advance-gated-step.ts',
  'src/batch-advance-composite-gated-step.ts',
  'src/batch-advance-instrumented-composite-step.ts',
  'src/fast-forward.ts',
] as const;

function stripModuleImports(source: string): string {
  const lines = source.split('\n');
  const out: string[] = [];
  let skippingImport = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (skippingImport) {
      if (trimmed.includes(';') || trimmed.startsWith('from ')) {
        skippingImport = false;
      }
      continue;
    }

    if (/^import\s/.test(trimmed)) {
      if (!trimmed.includes(';') && !/from\s+['"]/.test(trimmed)) {
        skippingImport = true;
      }
      continue;
    }

    if (/^export\s+\{[^}]*\}\s+from\s+['"]/.test(trimmed)) continue;
    if (/^export\s+\*\s+from\s+['"]/.test(trimmed)) continue;

    out.push(line);
  }

  return out.join('\n').trim();
}

function bundleSources(): string {
  const parts: string[] = [
    `// Operation 10M — Agent 02 Turns, Time, and Delayed Consequences`,
    `// Bundled for Agent 25 assembly (no external imports).`,
    `// Host wiring: INTEGRATION.md in operation-10m/agent-02-turns-time/`,
  ];

  for (const rel of SOURCE_FILES) {
    const abs = resolve(moduleRoot, rel);
    const raw = readFileSync(abs, 'utf8');
    parts.push(`// --- ${rel} ---`, stripModuleImports(raw));
  }

  parts.push(
    `export const AGENT_02_MODULE_ID = 'operation-10m/${moduleId}';`,
    `export const AGENT_02_MODULE_VERSION = '2.0.0';`,
    '',
    `export function runOp10mAgent02TurnsTimeSelfTests(): {`,
    `  passed: number;`,
    `  failed: number;`,
    `  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;`,
    `} {`,
    `  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];`,
    `  const engine = new TurnTimeEngine();`,
    `  engine.registerObligation({ id: 'self_ob', dueTurn: 1, kind: 'self_test' });`,
    `  const step = engine.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_obligation_once',`,
    `    name: 'obligation fires once on turn 1',`,
    `    passed:`,
    `      step.firedObligationIds.length === 1 &&`,
    `      step.firedObligationIds[0] === 'self_ob' &&`,
    `      engine.snapshot().obligations[0]?.status === 'fired',`,
    `  });`,
    `  const paused = new TurnTimeEngine();`,
    `  paused.scheduleEvent({ id: 'self_ev', dueTurn: 1, kind: 'tick' });`,
    `  paused.setPaused('self_test');`,
    `  const blocked = paused.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_pause_blocks',`,
    `    name: 'pause blocks turn advance',`,
    `    passed:`,
    `      blocked.blockedByPause === true &&`,
    `      blocked.clockBefore.turnIndex === blocked.clockAfter.turnIndex,`,
    `  });`,
    `  paused.clearPaused();`,
    `  paused.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_integrity',`,
    `    name: 'validate() ok after resume step',`,
    `    passed: paused.validate().ok,`,
    `  });`,
    `  const chain = new TurnTimeEngine();`,
    `  chain.registerObligation({ id: 'parent', dueTurn: 1, kind: 'seed' });`,
    `  chain.registerFollowUp({`,
    `    id: 'fu1',`,
    `    triggerRefId: 'parent',`,
    `    trigger: 'obligation_fired',`,
    `    dueTurnOffset: 1,`,
    `    spawnKind: 'obligation',`,
    `    spawnId: 'child',`,
    `    spawnKindLabel: 'ripple',`,
    `  });`,
    `  chain.stepFullTurn();`,
    `  chain.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_follow_up',`,
    `    name: 'follow-up obligation fires on schedule',`,
    `    passed: chain.snapshot().obligations.find((o) => o.id === 'child')?.status === 'fired',`,
    `  });`,
    `  const horizon = new TurnTimeEngine();`,
    `  horizon.registerObligation({ id: 'h1', dueTurn: 2, kind: 'h' });`,
    `  results.push({`,
    `    id: 'agent02_horizon',`,
    `    name: 'turn horizon lists pending obligation',`,
    `    passed: horizon.planThroughTurn(2).some((p) => p.id === 'h1'),`,
    `  });`,
    `  const pipeline = new TurnTimeEngine();`,
    `  pipeline.registerObligation({ id: 'pipe', dueTurn: 1, kind: 'pipe' });`,
    `  const pipeBefore = pipeline.snapshot();`,
    `  pipeline.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_pipeline',`,
    `    name: 'pipeline stages recorded for full turn',`,
    `    passed:`,
    `      pipeline.listRegisteredPipelineStageIds().length === 9 &&`,
    `      pipeline.getPipelineStageHits().some((h) => h.stageId === 'ag02:phase.end') &&`,
    `      pipeline.reconcileLastStepHorizon(pipeBefore).ok,`,
    `  });`,
    `  const dayPlan = new TurnTimeEngine();`,
    `  dayPlan.scheduleEvent({ id: 'xs_ev', dueTurn: 1, kind: 'xs' });`,
    `  results.push({`,
    `    id: 'agent02_day_plan',`,
    `    name: 'external day plan merge ok when aligned',`,
    `    passed: dayPlan.mergeExternalDayPlan(1, ['xs_ev']).ok,`,
    `  });`,
    `  const windowPlan = new TurnTimeEngine();`,
    `  windowPlan.scheduleEvent({ id: 'w1', dueTurn: 1, kind: 'w' });`,
    `  windowPlan.scheduleEvent({ id: 'w2', dueTurn: 2, kind: 'w' });`,
    `  results.push({`,
    `    id: 'agent02_day_plan_window',`,
    `    name: 'external day plan window merge ok when aligned',`,
    `    passed: windowPlan.mergeExternalDayPlanWindow(1, 2, { 1: ['w1'], 2: ['w2'] }).ok,`,
    `  });`,
    `  const gatePlan = new TurnTimeEngine();`,
    `  gatePlan.scheduleEvent({ id: 'g1', dueTurn: 1, kind: 'g' });`,
    `  results.push({`,
    `    id: 'agent02_day_plan_gate',`,
    `    name: 'XS-02 window gate ok before turn advance',`,
    `    passed: gatePlan.gateExternalDayPlanWindow(1, 1, { 1: ['g1'] }).ok,`,
    `  });`,
    `  const obs = new TurnTimeEngine();`,
    `  obs.registerObligation({ id: 'obs1', dueTurn: 1, kind: 'k' });`,
    `  const obsRun = obs.stepTurnsWithBudgetObservability(1, createTurnAdvanceBudget(2));`,
    `  results.push({`,
    `    id: 'agent02_batch_observability',`,
    `    name: 'batch observability rollup ok after one step',`,
    `    passed: obsRun.rollup.ok && obsRun.rollup.stepRows.length === 1,`,
    `  });`,
    `  const gap = new TurnTimeEngine();`,
    `  gap.registerObligation({ id: 'gap1', dueTurn: 1, kind: 'k' });`,
    `  gap.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_coverage_gap',`,
    `    name: 'pipeline coverage gap report lists observed stages',`,
    `    passed:`,
    `      gap.buildPipelineCoverageGapReport().observedCount >= 1 &&`,
    `      gap.buildPipelineCoverageGapReport().coverage.registeredStageCount === 9,`,
    `  });`,
    `  const ready = new TurnTimeEngine();`,
    `  ready.scheduleEvent({ id: 'rb1', dueTurn: 1, kind: 'n' });`,
    `  ready.registerObligation({ id: 'rb2', dueTurn: 1, kind: 'k' });`,
    `  const readyRun = ready.stepTurnsWithBudgetReadinessGate(1, createTurnAdvanceBudget(2), { 1: ['rb1'] });`,
    `  results.push({`,
    `    id: 'agent02_batch_readiness_gate',`,
    `    name: 'batch readiness gate ok with aligned XS-02 batch plan',`,
    `    passed:`,
    `      readyRun.readiness.ok &&`,
    `      readyRun.readiness.digest.length === 16 &&`,
    `      readyRun.readiness.externalBatch?.ok === true,`,
    `  });`,
    `  const stab = new TurnTimeEngine();`,
    `  stab.scheduleEvent({ id: 'st1', dueTurn: 1, kind: 'n' });`,
    `  const stabBatch = stab.stepTurnsWithBudget(1, createTurnAdvanceBudget(2));`,
    `  results.push({`,
    `    id: 'agent02_stabilization_batch_gate',`,
    `    name: 'stabilization batch gate ok when wave aligns with queue drain',`,
    `    passed: stab.gateExternalStabilizationForBatch(stabBatch, {`,
    `      1: { postQueueCalm: true, pendingStabilizationWave: true },`,
    `    }, {`,
    `      queueBeforeByTurn: { 1: { pendingEventDueCount: 1, pendingObligationDueCount: 0 } },`,
    `      queueAfterByTurn: { 1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 } },`,
    `    }).ok,`,
    `  });`,
    `  const composite = new TurnTimeEngine();`,
    `  const compositeRun = stepTurnsWithBudgetCompositeReadinessGate(composite, 1, createTurnAdvanceBudget(2), {`,
    `    stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },`,
    `  });`,
    `  results.push({`,
    `    id: 'agent02_composite_readiness',`,
    `    name: 'composite readiness gate ok on calm idle batch step',`,
    `    passed:`,
    `      compositeRun.readiness.ok &&`,
    `      compositeRun.readiness.stabilizationBatchOk === true,`,
    `  });`,
    `  const lattice = new TurnTimeEngine();`,
    `  results.push({`,
    `    id: 'agent02_stabilization_lattice',`,
    `    name: 'stabilization lattice rejects wave without calm',`,
    `    passed:`,
    `      !lattice.gateStabilizationLatticeSequence({`,
    `        1: { postQueueCalm: false, pendingStabilizationWave: true },`,
    `      }).ok,`,
    `  });`,
    `  const instrumented = new TurnTimeEngine();`,
    `  instrumented.scheduleEvent({ id: 'inst', dueTurn: 1, kind: 'n' });`,
    `  const instRun = stepTurnsWithBudgetInstrumentedCompositeGate(instrumented, 1, createTurnAdvanceBudget(2), {`,
    `    externalByTurn: { 1: ['inst'] },`,
    `    stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },`,
    `  });`,
    `  results.push({`,
    `    id: 'agent02_instrumented_composite',`,
    `    name: 'instrumented composite gate with auto queue capture',`,
    `    passed:`,
    `      instRun.readiness.ok &&`,
    `      (instRun.readiness.compositeDigest?.length ?? 0) === 16,`,
    `  });`,
    `  const failed = results.filter((r) => !r.passed).length;`,
    `  return { passed: results.length - failed, failed, results };`,
    `}`,
  );

  return parts.join('\n\n');
}

function wrapChunk(body: string): string {
  const begin = `// OP10M_MODULE_BEGIN ${moduleId}`;
  const end = `// OP10M_MODULE_END ${moduleId}`;
  const hash = createHash('sha256').update(body).digest('hex').slice(0, 16);
  return `${begin}\n// @ts-nocheck\n// content-sha256-prefix: ${hash}\n${body}\n${end}\n`;
}

const body = bundleSources();
const chunk = wrapChunk(body);
const outPath = resolve(moduleRoot, 'chunk.tsx');
writeFileSync(outPath, chunk, 'utf8');
console.log(`Wrote ${outPath} (${chunk.split('\n').length} lines, sha256~${createHash('sha256').update(body).digest('hex').slice(0, 16)})`);
