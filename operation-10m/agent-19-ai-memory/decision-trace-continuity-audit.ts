import { buildAgent19DecisionTraceReport } from './decision-trace.ts';
import { buildAiMemoryHorizonSnapshot } from './horizon.ts';
import type { MemoryInfluenceAuditFinding, MemoryInfluenceDecisionLike } from './types.ts';

export interface DecisionTraceContinuityReport {
  continuityOk: boolean;
  droppedTypes: string[];
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Ensures every before decision still produces a trace after memory influence (no silent drops). */
export function auditDecisionTraceContinuity(
  before: MemoryInfluenceDecisionLike[],
  after: MemoryInfluenceDecisionLike[],
): DecisionTraceContinuityReport {
  const afterTypes = new Set(after.map(d => String(d.type || 'unknown')));
  const droppedTypes = before.map(d => String(d.type || 'unknown')).filter(t => !afterTypes.has(t));
  const findings: MemoryInfluenceAuditFinding[] = [];
  droppedTypes.forEach(t => {
    findings.push({
      code: 'trace_option_dropped',
      severity: 'fail',
      message: `Decision type "${t}" missing after memory pass.`,
    });
  });
  const horizon = buildAiMemoryHorizonSnapshot(null);
  before.forEach((b, i) => {
    const a = after[i];
    if (!a) return;
    buildAgent19DecisionTraceReport({ before: b, after: a, horizonSnapshot: horizon });
  });
  const continuityOk = droppedTypes.length === 0;
  const narrativeLines = [
    continuityOk
      ? 'Decision trace continuity: all option types preserved.'
      : `Decision trace continuity: ${droppedTypes.length} type(s) dropped (${droppedTypes.join(', ')}).`,
  ];
  return { continuityOk, droppedTypes, findings, narrativeLines };
}

export function decisionTraceContinuityOk(report: DecisionTraceContinuityReport): boolean {
  return report.continuityOk;
}
