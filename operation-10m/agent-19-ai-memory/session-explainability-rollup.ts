import { summarizeSlicesByHorizon } from './explainability.ts';
import type { AiMemoryHorizon } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export interface SessionExplainabilityRollup {
  turnCount: number;
  totalInfluencedDecisions: number;
  totalAbsInfluence: number;
  byHorizon: ReturnType<typeof summarizeSlicesByHorizon>;
  dominantHorizon: AiMemoryHorizon | null;
  narrativeLines: string[];
}

export function buildSessionExplainabilityRollup(packs: TurnExplainabilityPack[]): SessionExplainabilityRollup {
  const merged = packs.flatMap(p =>
    p.topSlices.map(s => ({ horizon: s.horizon, delta: s.delta, reason: s.reason || `turn_${p.turn}` })),
  );
  const byHorizon = summarizeSlicesByHorizon(merged);
  let dominantHorizon: AiMemoryHorizon | null = null;
  let best = 0;
  (Object.keys(byHorizon) as AiMemoryHorizon[]).forEach(h => {
    const mag = Math.abs(byHorizon[h]?.totalDelta ?? 0);
    if (mag > best) {
      best = mag;
      dominantHorizon = h;
    }
  });
  const totalInfluencedDecisions = packs.reduce((s, p) => s + p.influenceSummary.influencedDecisionCount, 0);
  const totalAbsInfluence = packs.reduce((s, p) => s + Math.abs(p.influenceSummary.totalInfluenceDelta), 0);
  const narrativeLines = [
    `Session rollup across ${packs.length} turn pack(s): ${totalInfluencedDecisions} influenced decision(s), |Δ| sum ${totalAbsInfluence.toFixed(2)}.`,
  ];
  if (dominantHorizon) {
    narrativeLines.push(
      `Dominant horizon: ${dominantHorizon} (${(byHorizon[dominantHorizon]?.totalDelta ?? 0).toFixed(2)} cumulative slice delta).`,
    );
  }
  packs.slice(-2).forEach(p => narrativeLines.push(`Turn ${p.turn}: ${p.influenceSummary.narrativeLines[0] || 'no influence'}`));
  return {
    turnCount: packs.length,
    totalInfluencedDecisions,
    totalAbsInfluence,
    byHorizon,
    dominantHorizon,
    narrativeLines,
  };
}
