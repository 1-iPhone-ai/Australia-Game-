import { fnv1a64Hex } from './turn-audit.js';
import type { BatchAdvanceUnifiedPreGateResult } from './batch-advance-unified-pregate.js';
import type { BatchAdvanceResult } from './batch-advance.js';
import type { BatchStabilizationQueueCapture } from './batch-stabilization-queue-capture.js';
import type { BatchAdvanceObservabilityRollup } from './batch-advance-observability.js';
import type { BatchAdvanceReadinessGateResult } from './batch-advance-readiness-gate.js';
import type { StabilizationBacklogReboundGateResult } from './stabilization-backlog-rebound-gate.js';

export interface BatchInstrumentedAdvanceReport {
  preGate?: BatchAdvanceUnifiedPreGateResult;
  batch: BatchAdvanceResult;
  capture: BatchStabilizationQueueCapture;
  rollup: BatchAdvanceObservabilityRollup;
  readiness: BatchAdvanceReadinessGateResult;
  rebound?: StabilizationBacklogReboundGateResult;
  ok: boolean;
}

export function buildBatchInstrumentedAdvanceReport(
  preGate: BatchAdvanceUnifiedPreGateResult | undefined,
  batch: BatchAdvanceResult,
  capture: BatchStabilizationQueueCapture,
  rollup: BatchAdvanceObservabilityRollup,
  readiness: BatchAdvanceReadinessGateResult,
  rebound?: StabilizationBacklogReboundGateResult,
): BatchInstrumentedAdvanceReport {
  const reboundOk = rebound?.ok ?? true;
  const preOk = preGate?.ok ?? true;
  return {
    preGate,
    batch,
    capture,
    rollup,
    readiness,
    rebound,
    ok: preOk && readiness.ok && reboundOk,
  };
}

export function computeBatchInstrumentedAdvanceDigest(report: BatchInstrumentedAdvanceReport): string {
  const payload = JSON.stringify({
    ok: report.ok,
    pre: report.preGate?.ok ?? null,
    readiness: report.readiness.compositeDigest ?? report.readiness.digest,
    rebound: report.rebound?.reboundTurns ?? [],
    completed: report.batch.completed,
  });
  return fnv1a64Hex(payload);
}
