import type { AiMemoryHorizonSnapshot, AiMemoryInspectionView } from './types.ts';
import { AGENT19_EXPLAINABILITY_DISCLAIMER } from './types.ts';

export type MemoryGiClaimKind = 'fact' | 'interpretation' | 'policy';

export interface MemoryGiClaim {
  id: string;
  kind: MemoryGiClaimKind;
  text: string;
  confidence: 'confirmed' | 'likely' | 'policy';
}

/** Ask-the-Game style claims derived only from inspection-safe memory views. */
export function buildMemoryGiClaims(params: {
  horizon: AiMemoryHorizonSnapshot;
  inspection?: AiMemoryInspectionView | null;
  memoryInfluenceEnabled?: boolean;
}): MemoryGiClaim[] {
  const claims: MemoryGiClaim[] = [];
  if (params.memoryInfluenceEnabled === false) {
    claims.push({
      id: 'mem_off',
      kind: 'policy',
      text: 'AI memory influence is turned off in settings — relationships may still display but do not adjust scores.',
      confidence: 'confirmed',
    });
    return claims;
  }
  claims.push({
    id: 'mem_rule_based',
    kind: 'policy',
    text: AGENT19_EXPLAINABILITY_DISCLAIMER,
    confidence: 'policy',
  });
  if (params.horizon.longTermPriorActive) {
    claims.push({
      id: 'mem_priors',
      kind: 'fact',
      text: `${params.horizon.longTermPriorBeliefCount} cross-match prior belief(s) are active alongside this match’s events.`,
      confidence: 'confirmed',
    });
  } else if (params.horizon.shortTermEventCount > 0) {
    claims.push({
      id: 'mem_match_only',
      kind: 'fact',
      text: `Memory is using ${params.horizon.shortTermEventCount} committed event(s) from this match only.`,
      confidence: 'confirmed',
    });
  } else {
    claims.push({
      id: 'mem_idle',
      kind: 'fact',
      text: 'AI memory has not recorded committed events this match yet.',
      confidence: 'confirmed',
    });
  }
  const view = params.inspection;
  if (view?.isRedacted) {
    claims.push({
      id: 'mem_redacted',
      kind: 'policy',
      text: 'Rival private beliefs stay hidden unless full memory inspection is enabled.',
      confidence: 'policy',
    });
  }
  if (view?.influenceSummary) {
    claims.push({
      id: 'mem_influence',
      kind: 'interpretation',
      text: view.influenceSummary,
      confidence: 'likely',
    });
  }
  return claims;
}

export function formatGiClaimsAsBrief(claims: MemoryGiClaim[]): string[] {
  return claims.map(c => `[${c.kind}] ${c.text}`);
}
