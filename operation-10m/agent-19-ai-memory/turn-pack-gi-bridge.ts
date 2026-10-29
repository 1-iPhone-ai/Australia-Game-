import { buildMemoryGiClaims, type MemoryGiClaim } from './explainability-claims.ts';
import type { AiMemoryHorizonSnapshot, AiMemoryInspectionView } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

/** Ask-the-Game claims extended with turn-pack influence and counterfactual facts. */
export function buildTurnPackGiClaims(params: {
  pack: TurnExplainabilityPack;
  horizon: AiMemoryHorizonSnapshot;
  inspection?: AiMemoryInspectionView | null;
  memoryInfluenceEnabled?: boolean;
}): MemoryGiClaim[] {
  const base = buildMemoryGiClaims({
    horizon: params.horizon,
    inspection: params.inspection,
    memoryInfluenceEnabled: params.memoryInfluenceEnabled,
  });
  const extra: MemoryGiClaim[] = [];
  const inf = params.pack.influenceSummary;
  if (inf.influencedDecisionCount > 0) {
    extra.push({
      id: 'turn_influence',
      kind: 'fact',
      text: `Turn ${params.pack.turn}: memory adjusted ${inf.influencedDecisionCount} decision score(s) (total Δ ${inf.totalInfluenceDelta.toFixed(2)}).`,
      confidence: inf.auditOk ? 'confirmed' : 'likely',
    });
  }
  if (params.pack.counterfactual.influencedCount > 0) {
    extra.push({
      id: 'turn_counterfactual',
      kind: 'interpretation',
      text: `Without memory influence, ${params.pack.counterfactual.influencedCount} option(s) on turn ${params.pack.turn} would use baseline scores instead.`,
      confidence: 'likely',
    });
  }
  if (params.pack.topSlices[0]) {
    const s = params.pack.topSlices[0];
    extra.push({
      id: 'turn_top_slice',
      kind: 'interpretation',
      text: `Strongest slice this turn: ${s.horizon} (${s.delta >= 0 ? '+' : ''}${s.delta.toFixed(2)} — ${s.reason}).`,
      confidence: 'likely',
    });
  }
  return [...base, ...extra];
}
