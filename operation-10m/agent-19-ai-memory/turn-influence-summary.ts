import { auditFindingsOk, auditMemoryInfluenceDecisions } from './influence-audit.ts';
import { summarizeSlicesByHorizon } from './explainability.ts';
import type { MemoryInfluenceDecisionLike, MemoryInfluenceAuditFinding } from './types.ts';

export interface TurnMemoryInfluenceSummary {
  decisionCount: number;
  influencedDecisionCount: number;
  totalInfluenceDelta: number;
  maxSingleInfluence: number;
  auditOk: boolean;
  findings: MemoryInfluenceAuditFinding[];
  byHorizon: Record<string, { totalDelta: number; count: number }>;
  narrativeLines: string[];
}

export function summarizeTurnMemoryInfluence<T extends MemoryInfluenceDecisionLike>(
  before: T[],
  after: T[],
): TurnMemoryInfluenceSummary {
  const findings = auditMemoryInfluenceDecisions(before, after);
  const auditOk = auditFindingsOk(findings);
  let influencedDecisionCount = 0;
  let totalInfluenceDelta = 0;
  let maxSingleInfluence = 0;
  const allSlices = after.flatMap(d => d.memoryInfluenceSlices || []);
  after.forEach(d => {
    const inf = d.memoryInfluence ?? 0;
    if (inf) influencedDecisionCount += 1;
    totalInfluenceDelta += inf;
    maxSingleInfluence = Math.max(maxSingleInfluence, Math.abs(inf));
  });
  totalInfluenceDelta = Math.round(totalInfluenceDelta * 100) / 100;
  const byHorizon = summarizeSlicesByHorizon(allSlices);
  const narrativeLines = [
    `${after.length} scored options; ${influencedDecisionCount} adjusted by memory (total Δ ${totalInfluenceDelta >= 0 ? '+' : ''}${totalInfluenceDelta}).`,
    `Largest single adjustment: ${maxSingleInfluence.toFixed(2)}.`,
  ];
  Object.entries(byHorizon).forEach(([h, v]) => {
    narrativeLines.push(`Horizon ${h}: ${v.count} slice(s), Δ ${v.totalDelta >= 0 ? '+' : ''}${v.totalDelta.toFixed(2)}.`);
  });
  if (!auditOk) narrativeLines.push('Audit flagged trace inconsistencies — memory must not drop options.');
  return {
    decisionCount: after.length,
    influencedDecisionCount,
    totalInfluenceDelta,
    maxSingleInfluence,
    auditOk,
    findings,
    byHorizon,
    narrativeLines,
  };
}
