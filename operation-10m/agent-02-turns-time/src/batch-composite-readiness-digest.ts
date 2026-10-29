import { fnv1a64Hex } from './turn-audit.js';
import type { BatchAdvanceReadinessGateResult } from './batch-advance-readiness-gate.js';

export function computeBatchCompositeReadinessDigest(
  readiness: BatchAdvanceReadinessGateResult,
): string {
  const payload = JSON.stringify({
    ok: readiness.ok,
    observability: readiness.digest,
    stabilization: readiness.stabilizationDigest ?? null,
    externalBatchOk: readiness.externalBatchOk,
    stabilizationBatchOk: readiness.stabilizationBatchOk,
    latticeOk: readiness.latticeSequenceOk,
  });
  return fnv1a64Hex(payload);
}
