import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import {
  gateBatchAdvanceUnifiedPreconditions,
  type BatchAdvanceUnifiedPreGateInput,
  type BatchAdvanceUnifiedPreGateResult,
} from './batch-advance-unified-pregate.js';
import {
  stepTurnsWithBudgetStabilizationCapture,
  batchStabilizationGateOptionsFromCapture,
} from './batch-stabilization-queue-capture.js';
import { buildBatchAdvanceObservabilityRollup } from './batch-advance-observability.js';
import { gateBatchAdvanceReadiness } from './batch-advance-readiness-gate.js';
import { gateStabilizationBacklogRebound } from './stabilization-backlog-rebound-gate.js';
import {
  buildBatchInstrumentedAdvanceReport,
  computeBatchInstrumentedAdvanceDigest,
  type BatchInstrumentedAdvanceReport,
} from './batch-instrumented-advance-report.js';
import type { BatchAdvanceCompositeReadinessInput } from './batch-advance-composite-gated-step.js';

export interface BatchAdvanceFullInstrumentedInput extends BatchAdvanceCompositeReadinessInput {
  preGate?: BatchAdvanceUnifiedPreGateInput;
}

export interface BatchAdvanceWithFullInstrumentedGate {
  report: BatchInstrumentedAdvanceReport;
  instrumentedDigest: string;
}

/**
 * Round 11: unified pre-gate + instrumented batch + rebound gate + consolidated report.
 */
export function stepTurnsWithBudgetFullInstrumentedGate(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceFullInstrumentedInput,
): BatchAdvanceWithFullInstrumentedGate {
  const before = engine.snapshot();
  const preGate: BatchAdvanceUnifiedPreGateResult | undefined = input?.preGate
    ? gateBatchAdvanceUnifiedPreconditions(before, input.preGate)
    : undefined;

  const { batch, capture } = stepTurnsWithBudgetStabilizationCapture(engine, maxSteps, budget);
  const after = engine.snapshot();
  const rollup = buildBatchAdvanceObservabilityRollup(before, after, batch);
  const stabilizationOptions = input?.stabilization ?? batchStabilizationGateOptionsFromCapture(capture);
  const readiness = gateBatchAdvanceReadiness(
    after,
    rollup,
    input?.externalByTurn,
    input?.stabilizationByTurn,
    { stabilization: stabilizationOptions },
  );
  const rebound =
    input?.stabilizationByTurn !== undefined
      ? gateStabilizationBacklogRebound(batch, capture, input.stabilizationByTurn)
      : undefined;

  const report = buildBatchInstrumentedAdvanceReport(
    preGate,
    batch,
    capture,
    rollup,
    readiness,
    rebound,
  );
  return {
    report,
    instrumentedDigest: computeBatchInstrumentedAdvanceDigest(report),
  };
}
