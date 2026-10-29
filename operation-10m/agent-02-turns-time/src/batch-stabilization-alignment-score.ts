import type { BatchStabilizationReconcileReport } from './batch-stabilization-reconcile-report.js';

export interface BatchStabilizationAlignmentScore {
  steppedTurns: number;
  alignedTurns: number;
  ratio: number;
  ok: boolean;
}

export function computeBatchStabilizationAlignmentScore(
  reconcile: BatchStabilizationReconcileReport | undefined,
): BatchStabilizationAlignmentScore {
  if (!reconcile) {
    return { steppedTurns: 0, alignedTurns: 0, ratio: 1, ok: true };
  }
  const steppedTurns = reconcile.gate.rows.length;
  const alignedTurns = reconcile.alignedTurns;
  const ratio = steppedTurns === 0 ? 1 : alignedTurns / steppedTurns;
  return {
    steppedTurns,
    alignedTurns,
    ratio,
    ok: reconcile.ok && ratio === 1,
  };
}
