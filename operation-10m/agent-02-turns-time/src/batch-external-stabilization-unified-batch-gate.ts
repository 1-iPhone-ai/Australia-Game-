import type { BatchAdvanceResult } from './batch-advance.js';
import type { ExternalStabilizationTurnSignals } from './external-stabilization-signals.js';
import {
  gateExternalDayPlanForBatch,
  type ExternalDayPlanBatchGateResult,
} from './external-day-plan-batch-gate.js';
import {
  gateExternalStabilizationForBatch,
  type ExternalStabilizationBatchGateOptions,
  type ExternalStabilizationBatchGateResult,
} from './external-stabilization-batch-gate.js';

export interface BatchExternalStabilizationUnifiedBatchGateResult {
  dayPlan: ExternalDayPlanBatchGateResult;
  stabilization: ExternalStabilizationBatchGateResult;
  ok: boolean;
}

/**
 * Round 15: single XS-02 + Agent 05 batch merge gate for stepped national ticks.
 */
export function gateBatchExternalStabilizationUnified(
  batch: BatchAdvanceResult,
  externalByTurn: Readonly<Record<number, readonly string[]>>,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  stabilizationOptions?: ExternalStabilizationBatchGateOptions,
): BatchExternalStabilizationUnifiedBatchGateResult {
  const dayPlan = gateExternalDayPlanForBatch(batch, externalByTurn);
  const stabilization = gateExternalStabilizationForBatch(
    batch,
    stabilizationByTurn,
    stabilizationOptions,
  );
  return { dayPlan, stabilization, ok: dayPlan.ok && stabilization.ok };
}
