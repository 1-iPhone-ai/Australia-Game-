import { buildTurnPackGiClaims } from './turn-pack-gi-bridge.ts';
import type { MemoryGiClaim } from './explainability-claims.ts';
import type { AiMemoryInspectionView } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export const AGENT19_SESSION_GI_CLAIM_CAP = 24;

export interface SessionGiClaimsRollup {
  claimCount: number;
  uniqueIds: string[];
  claims: MemoryGiClaim[];
  narrativeLines: string[];
}

/** Merges Ask-the-Game claims across turn packs; dedupes by id keeping latest turn text. */
export function buildSessionGiClaimsRollup(
  packs: TurnExplainabilityPack[],
  params?: {
    inspection?: AiMemoryInspectionView | null;
    memoryInfluenceEnabled?: boolean;
  },
): SessionGiClaimsRollup {
  const byId = new Map<string, MemoryGiClaim>();
  packs.forEach(pack => {
    const claims = buildTurnPackGiClaims({
      pack,
      horizon: pack.horizonAfter,
      inspection: params?.inspection,
      memoryInfluenceEnabled: params?.memoryInfluenceEnabled,
    });
    claims.forEach(c => byId.set(c.id, c));
  });
  const claims = [...byId.values()].slice(0, AGENT19_SESSION_GI_CLAIM_CAP);
  const narrativeLines = [
    `Session GI rollup: ${claims.length} claim(s) from ${packs.length} turn pack(s) (cap ${AGENT19_SESSION_GI_CLAIM_CAP}).`,
  ];
  claims.slice(0, 4).forEach(c => narrativeLines.push(`• [${c.id}] ${c.text.slice(0, 120)}`));
  return {
    claimCount: claims.length,
    uniqueIds: claims.map(c => c.id),
    claims,
    narrativeLines,
  };
}

export function sessionGiRollupWithinCap(rollup: SessionGiClaimsRollup): boolean {
  return rollup.claimCount <= AGENT19_SESSION_GI_CLAIM_CAP;
}
