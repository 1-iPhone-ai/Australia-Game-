import { buildMemoryExplainabilityBrief } from './explainability.ts';
import type {
  AiMemoryHorizonSnapshot,
  AiMemoryInfluenceSlice,
  MemoryInfluenceDecisionLike,
} from './types.ts';

export interface Agent19DecisionTraceReport {
  decisionType: string;
  baseScore: number;
  adjustedScore: number;
  memoryInfluence: number;
  horizonSnapshot: AiMemoryHorizonSnapshot;
  narrativeLines: string[];
  sliceSummaryByHorizon: Record<string, { totalDelta: number; count: number }>;
}

export const AGENT19_HORIZON_LABELS: Record<string, string> = {
  short_term_match: 'This match',
  long_term_prior: 'Earlier matches (saved prior)',
  team_directive: 'Team plan directive',
};

export function labelMemoryHorizon(horizon: AiMemoryInfluenceSlice['horizon']): string {
  return AGENT19_HORIZON_LABELS[horizon] || horizon;
}

export function buildAgent19DecisionTraceReport(params: {
  before: MemoryInfluenceDecisionLike;
  after: MemoryInfluenceDecisionLike;
  horizonSnapshot: AiMemoryHorizonSnapshot;
}): Agent19DecisionTraceReport {
  const baseScore = params.before.score ?? 0;
  const adjustedScore = params.after.score ?? 0;
  const memoryInfluence = params.after.memoryInfluence ?? 0;
  const slices = params.after.memoryInfluenceSlices || [];
  const sliceSummaryByHorizon: Record<string, { totalDelta: number; count: number }> = {};
  slices.forEach(s => {
    const b = sliceSummaryByHorizon[s.horizon] || { totalDelta: 0, count: 0 };
    b.totalDelta = Math.round((b.totalDelta + s.delta) * 100) / 100;
    b.count += 1;
    sliceSummaryByHorizon[s.horizon] = b;
  });
  const narrativeLines = [
    `Decision "${params.after.type || params.before.type || 'unknown'}": base score ${baseScore}, after memory ${adjustedScore} (${memoryInfluence >= 0 ? '+' : ''}${memoryInfluence.toFixed(2)}).`,
    ...buildMemoryExplainabilityBrief(params.horizonSnapshot, slices),
  ];
  return {
    decisionType: String(params.after.type || params.before.type || 'unknown'),
    baseScore,
    adjustedScore,
    memoryInfluence,
    horizonSnapshot: params.horizonSnapshot,
    narrativeLines,
    sliceSummaryByHorizon,
  };
}

export function compareHorizonSnapshots(before: AiMemoryHorizonSnapshot, after: AiMemoryHorizonSnapshot): string[] {
  const lines: string[] = [];
  if (before.shortTermEventCount !== after.shortTermEventCount) {
    lines.push(`Match events: ${before.shortTermEventCount} → ${after.shortTermEventCount}.`);
  }
  if (before.longTermPriorBeliefCount !== after.longTermPriorBeliefCount) {
    lines.push(`Cross-match priors: ${before.longTermPriorBeliefCount} → ${after.longTermPriorBeliefCount}.`);
  }
  if (before.longTermPriorActive !== after.longTermPriorActive) {
    lines.push(
      `Cross-match prior influence: ${before.longTermPriorActive ? 'active' : 'idle'} → ${after.longTermPriorActive ? 'active' : 'idle'}.`,
    );
  }
  if (!lines.length) lines.push('Horizon snapshot unchanged.');
  return lines;
}
