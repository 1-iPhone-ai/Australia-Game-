import type { MemoryInfluenceDecisionLike } from './types.ts';

export interface CounterfactualDecisionDelta {
  type: string;
  baselineScore: number;
  influencedScore: number;
  memoryInfluence: number;
  sliceCount: number;
}

export interface CounterfactualMemoryReport {
  decisionCount: number;
  influencedCount: number;
  totalAbsInfluence: number;
  deltas: CounterfactualDecisionDelta[];
  narrativeLines: string[];
}

/** Scores as if memory influence were stripped (never removes options — only score deltas). */
export function baselineScoresWithoutMemory(decisions: MemoryInfluenceDecisionLike[]): MemoryInfluenceDecisionLike[] {
  return decisions.map(d => {
    const score = d.score ?? 0;
    const influence = d.memoryInfluence ?? 0;
    return {
      ...d,
      score: score - influence,
      memoryInfluence: 0,
      memoryReasons: [],
      memoryInfluenceSlices: [],
    };
  });
}

export function buildCounterfactualMemoryReport(
  decisionsBefore: MemoryInfluenceDecisionLike[],
  decisionsAfter: MemoryInfluenceDecisionLike[],
): CounterfactualMemoryReport {
  const baseline = baselineScoresWithoutMemory(decisionsAfter);
  const deltas: CounterfactualDecisionDelta[] = [];
  let influencedCount = 0;
  let totalAbsInfluence = 0;
  const n = Math.min(decisionsBefore.length, decisionsAfter.length, baseline.length);
  for (let i = 0; i < n; i++) {
    const after = decisionsAfter[i];
    const base = baseline[i];
    const influence = after.memoryInfluence ?? 0;
    if (Math.abs(influence) > 0.001) influencedCount++;
    totalAbsInfluence += Math.abs(influence);
    deltas.push({
      type: after.type || decisionsBefore[i]?.type || `option_${i}`,
      baselineScore: base.score ?? 0,
      influencedScore: after.score ?? 0,
      memoryInfluence: influence,
      sliceCount: after.memoryInfluenceSlices?.length ?? 0,
    });
  }
  const narrativeLines = [
    `Counterfactual: ${influencedCount}/${n} decisions received memory score nudges (total |Δ| ${totalAbsInfluence.toFixed(2)}).`,
    'Without memory, scores revert to pre-influence baselines; legal option sets stay unchanged.',
  ];
  deltas
    .filter(d => Math.abs(d.memoryInfluence) > 0.001)
    .slice(0, 4)
    .forEach(d => {
      narrativeLines.push(
        `• ${d.type}: ${d.baselineScore.toFixed(1)} → ${d.influencedScore.toFixed(1)} (${d.memoryInfluence >= 0 ? '+' : ''}${d.memoryInfluence.toFixed(2)}, ${d.sliceCount} slice(s))`,
      );
    });
  return {
    decisionCount: n,
    influencedCount,
    totalAbsInfluence,
    deltas,
    narrativeLines,
  };
}

export function formatCounterfactualBrief(report: CounterfactualMemoryReport): string[] {
  return report.narrativeLines;
}
