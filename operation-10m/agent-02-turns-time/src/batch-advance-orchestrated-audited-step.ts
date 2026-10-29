import {
  stepTurnsWithBudgetOrchestratedAdvance,
  type BatchAdvanceOrchestratedInput,
  type BatchAdvanceWithOrchestratedGate,
} from './batch-advance-orchestrated-step.js';
import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { gateStabilizationCalmStreak, type StabilizationCalmStreakGateResult } from './stabilization-calm-streak-gate.js';
import {
  summarizeBatchOrchestratedAdvanceReport,
  type BatchOrchestratedAdvanceSummary,
} from './batch-orchestrated-advance-summary.js';
import type { BatchOrchestratedAdvanceReport } from './batch-orchestrated-advance-report.js';
import { fnv1a64Hex } from './turn-audit.js';

export interface BatchOrchestratedAuditedReport extends BatchOrchestratedAdvanceReport {
  calmStreak?: StabilizationCalmStreakGateResult;
}

export interface BatchAdvanceWithOrchestratedAudit extends BatchAdvanceWithOrchestratedGate {
  report: BatchOrchestratedAuditedReport;
  summary: BatchOrchestratedAdvanceSummary;
  auditDigest: string;
}

export function computeBatchOrchestratedAuditDigest(
  report: BatchOrchestratedAuditedReport,
  summary: BatchOrchestratedAdvanceSummary,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ok: report.ok && (report.calmStreak?.ok ?? true),
      summary: summary.orchestratedDigest,
      calmStreak: report.calmStreak?.calmStreakLength ?? 0,
      violations: report.calmStreak?.violations.length ?? 0,
    }),
  );
}

/**
 * Round 13: orchestrated advance + calm-streak gate + Agent 25-friendly summary.
 */
export function stepTurnsWithBudgetOrchestratedAuditedAdvance(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
): BatchAdvanceWithOrchestratedAudit {
  const run = stepTurnsWithBudgetOrchestratedAdvance(engine, maxSteps, budget, input);
  const calmStreak =
    input?.stabilizationByTurn !== undefined
      ? gateStabilizationCalmStreak(run.report.batch, run.report.capture, input.stabilizationByTurn)
      : undefined;
  const calmOk = calmStreak?.ok ?? true;
  const report: BatchOrchestratedAuditedReport = {
    ...run.report,
    calmStreak,
    ok: run.report.ok && calmOk,
  };
  const summary = summarizeBatchOrchestratedAdvanceReport(report, run.orchestratedDigest);
  const auditDigest = computeBatchOrchestratedAuditDigest(report, summary);
  return {
    report,
    orchestratedDigest: run.orchestratedDigest,
    summary: { ...summary, ok: report.ok },
    auditDigest,
  };
}
