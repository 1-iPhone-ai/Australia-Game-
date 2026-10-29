import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import {
  stepTurnsWithBudgetFullInstrumentedGate,
  type BatchAdvanceFullInstrumentedInput,
} from './batch-advance-full-instrumented-step.js';
import {
  gateBatchAdvanceUnifiedPreconditions,
  type BatchAdvanceUnifiedPreGateResult,
} from './batch-advance-unified-pregate.js';
import { buildBatchAdvanceObservabilityRollup } from './batch-advance-observability.js';
import { gateBatchAdvanceReadiness } from './batch-advance-readiness-gate.js';
import {
  buildBatchInstrumentedAdvanceReport,
  type BatchInstrumentedAdvanceReport,
} from './batch-instrumented-advance-report.js';
import { computeBatchStabilizationAlignmentScore } from './batch-stabilization-alignment-score.js';
import { gateBatchAdvancePostStabilization } from './batch-advance-post-stabilization-gate.js';
import {
  buildBatchOrchestratedAdvanceReport,
  computeBatchOrchestratedAdvanceDigest,
  type BatchOrchestratedAdvanceReport,
} from './batch-orchestrated-advance-report.js';
import type { BatchAdvanceResult } from './batch-advance.js';
import type { BatchStabilizationQueueCapture } from './batch-stabilization-queue-capture.js';

export interface BatchAdvanceOrchestratedInput extends BatchAdvanceFullInstrumentedInput {
  /** When true (default), do not step if unified pre-gate fails. */
  blockOnFailedPreGate?: boolean;
}

export interface BatchAdvanceWithOrchestratedGate {
  report: BatchOrchestratedAdvanceReport;
  orchestratedDigest: string;
}

function emptyBatch(budget: TurnAdvanceBudgetState): BatchAdvanceResult {
  return { steps: [], budget, completed: 0, horizonReconcileOk: [] };
}

function emptyCapture(): BatchStabilizationQueueCapture {
  return { queueBeforeByTurn: {}, queueAfterByTurn: {} };
}

function buildBlockedPreGateReport(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  preGate: BatchAdvanceUnifiedPreGateResult,
): BatchInstrumentedAdvanceReport {
  const before = engine.snapshot();
  const batch = emptyBatch(budget);
  const rollup = buildBatchAdvanceObservabilityRollup(before, before, batch);
  const readiness = gateBatchAdvanceReadiness(before, rollup);
  return buildBatchInstrumentedAdvanceReport(preGate, batch, emptyCapture(), rollup, {
    ...readiness,
    ok: false,
  });
}

/**
 * Round 12: orchestrated XS-02 + Agent 05 path — optional pre-gate block, alignment score, post-stabilization verify.
 */
export function stepTurnsWithBudgetOrchestratedAdvance(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
): BatchAdvanceWithOrchestratedGate {
  const blockOnFailedPreGate = input?.blockOnFailedPreGate !== false;
  const preGateResult = input?.preGate
    ? gateBatchAdvanceUnifiedPreconditions(engine.snapshot(), input.preGate)
    : undefined;

  if (preGateResult && !preGateResult.ok && blockOnFailedPreGate) {
    const instrumented = buildBlockedPreGateReport(engine, budget, preGateResult);
    const alignment = computeBatchStabilizationAlignmentScore(undefined);
    const report = buildBatchOrchestratedAdvanceReport(instrumented, alignment);
    return { report, orchestratedDigest: computeBatchOrchestratedAdvanceDigest(report) };
  }

  const run = stepTurnsWithBudgetFullInstrumentedGate(engine, maxSteps, budget, input);
  const alignment = computeBatchStabilizationAlignmentScore(
    run.report.readiness.stabilizationReconcile,
  );
  const postStabilization =
    input?.stabilizationByTurn !== undefined
      ? gateBatchAdvancePostStabilization(
          engine.snapshot(),
          run.report.batch,
          run.report.capture,
          input.stabilizationByTurn,
        )
      : undefined;
  const report = buildBatchOrchestratedAdvanceReport(run.report, alignment, postStabilization);
  return {
    report,
    orchestratedDigest: computeBatchOrchestratedAdvanceDigest(report),
  };
}
