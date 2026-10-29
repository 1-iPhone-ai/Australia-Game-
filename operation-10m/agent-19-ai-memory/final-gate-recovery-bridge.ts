import type { MatchExplainabilityFinalGateReport } from './match-explainability-final-gate.ts';

export const AGENT19_FINAL_RECOVERY_HINT_CAP = 6;

/** Maps final-gate sub-check failures to targeted recovery hints. */
export function buildFinalGateRecoveryHints(report: MatchExplainabilityFinalGateReport): string[] {
  const hints: string[] = [];
  if (!report.matchGateOpen) {
    hints.push('Close session GI cap or confidence band issues before reopening the match gate.');
  }
  if (!report.traceContinuityOpen) {
    hints.push('Restore dropped decision option types — memory must not remove legal choices.');
  }
  if (!report.horizonAlignmentOk) {
    hints.push('Remove influence slices that cite inactive horizons in the post-turn snapshot.');
  }
  if (!report.traceCompositeAllPassed) {
    hints.push('Fix per-turn slice attribution or trace/composite bridge failures.');
  }
  if (report.finalOpen) {
    hints.push('Final explainability gate is open — delivery bundle may ship.');
  }
  return hints.slice(0, AGENT19_FINAL_RECOVERY_HINT_CAP);
}

export function finalGateRecoveryNeeded(report: MatchExplainabilityFinalGateReport): boolean {
  return !report.finalOpen;
}
