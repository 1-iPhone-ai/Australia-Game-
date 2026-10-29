import { auditFindingsOk, auditMemoryInfluenceDecisions } from './influence-audit.ts';
import type { MemoryInfluenceAuditFinding, MemoryInfluenceDecisionLike } from './types.ts';

export const AGENT19_SLICE_ATTRIBUTION_TOLERANCE = 0.05;

export interface TurnSliceAttributionReport {
  auditOk: boolean;
  sliceMismatchCount: number;
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Turn-level explainability check that influence slices reconcile to memoryInfluence per decision. */
export function auditTurnSliceAttribution(
  before: MemoryInfluenceDecisionLike[],
  after: MemoryInfluenceDecisionLike[],
): TurnSliceAttributionReport {
  const findings = auditMemoryInfluenceDecisions(before, after);
  const sliceMismatchCount = findings.filter(f => f.code === 'slice_sum_mismatch').length;
  const auditOk = auditFindingsOk(findings) && sliceMismatchCount === 0;
  const narrativeLines = [
    sliceMismatchCount
      ? `Slice attribution audit: ${sliceMismatchCount} decision(s) have slice sums outside ±${AGENT19_SLICE_ATTRIBUTION_TOLERANCE}.`
      : 'Slice attribution audit: influenced decisions reconcile slices to memoryInfluence.',
  ];
  findings
    .filter(f => f.code === 'slice_sum_mismatch')
    .forEach(f => narrativeLines.push(`[warn] ${f.message}`));
  return { auditOk, sliceMismatchCount, findings, narrativeLines };
}

export function turnSliceAttributionOk(report: TurnSliceAttributionReport): boolean {
  return report.auditOk;
}
