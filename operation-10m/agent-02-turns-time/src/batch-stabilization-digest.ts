import { fnv1a64Hex } from './turn-audit.js';
import type { BatchStabilizationReconcileReport } from './batch-stabilization-reconcile-report.js';

export function computeBatchStabilizationDigest(report: BatchStabilizationReconcileReport): string {
  const payload = JSON.stringify({
    ok: report.ok,
    aligned: report.alignedTurns,
    externalCalm: report.externalCalmTurns,
    externalWave: report.externalWaveTurns,
    inferredCalm: report.inferredCalmTurns,
    inferredWave: report.inferredWaveTurns,
    failing: report.gate.failingTurns,
    turns: report.steppedTurns,
  });
  return fnv1a64Hex(payload);
}
