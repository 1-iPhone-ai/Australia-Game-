import type { BatchAdvanceResult } from './batch-advance.js';
import {
  gateExternalStabilizationForBatch,
  type ExternalStabilizationBatchGateOptions,
  type ExternalStabilizationBatchGateResult,
} from './external-stabilization-batch-gate.js';
import type { ExternalStabilizationTurnSignals } from './external-stabilization-signals.js';

export interface BatchStabilizationReconcileReport {
  steppedTurns: number[];
  externalCalmTurns: number;
  externalWaveTurns: number;
  inferredCalmTurns: number;
  inferredWaveTurns: number;
  alignedTurns: number;
  gate: ExternalStabilizationBatchGateResult;
  ok: boolean;
}

export function buildBatchStabilizationReconcileReport(
  batch: BatchAdvanceResult,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  options?: ExternalStabilizationBatchGateOptions,
): BatchStabilizationReconcileReport {
  const gate = gateExternalStabilizationForBatch(batch, stabilizationByTurn, options);
  let externalCalmTurns = 0;
  let externalWaveTurns = 0;
  let inferredCalmTurns = 0;
  let inferredWaveTurns = 0;
  let alignedTurns = 0;

  for (const row of gate.rows) {
    if (row.external.postQueueCalm) externalCalmTurns += 1;
    if (row.external.pendingStabilizationWave) externalWaveTurns += 1;
    if (row.inferred.postQueueCalm) inferredCalmTurns += 1;
    if (row.inferred.pendingStabilizationWave) inferredWaveTurns += 1;
    if (row.ok) alignedTurns += 1;
  }

  return {
    steppedTurns: gate.steppedTurns,
    externalCalmTurns,
    externalWaveTurns,
    inferredCalmTurns,
    inferredWaveTurns,
    alignedTurns,
    gate,
    ok: gate.ok,
  };
}
