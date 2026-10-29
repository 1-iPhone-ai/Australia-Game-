import { fnv1a64Hex } from './turn-audit.js';
import type { BatchInstrumentedAdvanceReport } from './batch-instrumented-advance-report.js';
import type { BatchStabilizationAlignmentScore } from './batch-stabilization-alignment-score.js';
import type { BatchAdvancePostStabilizationGateResult } from './batch-advance-post-stabilization-gate.js';

export interface BatchOrchestratedAdvanceReport extends BatchInstrumentedAdvanceReport {
  alignment: BatchStabilizationAlignmentScore;
  postStabilization?: BatchAdvancePostStabilizationGateResult;
}

export function buildBatchOrchestratedAdvanceReport(
  instrumented: BatchInstrumentedAdvanceReport,
  alignment: BatchStabilizationAlignmentScore,
  postStabilization?: BatchAdvancePostStabilizationGateResult,
): BatchOrchestratedAdvanceReport {
  const postOk = postStabilization?.ok ?? true;
  return {
    ...instrumented,
    alignment,
    postStabilization,
    ok: instrumented.ok && alignment.ok && postOk,
  };
}

export function computeBatchOrchestratedAdvanceDigest(report: BatchOrchestratedAdvanceReport): string {
  const payload = JSON.stringify({
    ok: report.ok,
    instrumented: report.readiness.compositeDigest ?? report.readiness.digest,
    alignment: report.alignment.ratio,
    post: report.postStabilization?.lastSteppedTurn ?? null,
    completed: report.batch.completed,
  });
  return fnv1a64Hex(payload);
}
