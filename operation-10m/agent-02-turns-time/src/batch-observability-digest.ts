import { fnv1a64Hex } from './turn-audit.js';
import type { BatchAdvanceObservabilityRollup } from './batch-advance-observability.js';

export function computeBatchObservabilityDigest(rollup: BatchAdvanceObservabilityRollup): string {
  const payload = JSON.stringify({
    completed: rollup.batch.completed,
    stoppedReason: rollup.batch.stoppedReason ?? null,
    pipelineDigest: rollup.pipeline.finalPipelineDigest,
    horizonOk: rollup.horizon.ok,
    observabilityOk: rollup.ok,
    stepDigests: rollup.stepRows.map((row) => row.report.pipelineDigest),
    newStages: rollup.finalCoverageDelta.newlyObservedStageIds,
  });
  return fnv1a64Hex(payload);
}
