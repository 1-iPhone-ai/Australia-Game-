import { computeNegotiationThresholdShift } from './negotiation-explainability.ts';
import type { AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';

export const AGENT19_NEGOTIATION_SLICE_MIN = 0.5;

export interface NegotiationInfluenceBridgeReport {
  negotiationShift: number;
  relationshipSliceDelta: number;
  aligned: boolean;
  narrativeLines: string[];
}

/** Links diplomacy negotiation threshold shift to relationship-flavored influence slices on the same turn. */
export function buildNegotiationInfluenceBridge(
  rel: Partial<AiRelationship> | null | undefined,
  decisionsAfter: MemoryInfluenceDecisionLike[],
  ctx?: { dealAffordable?: boolean; thirdPartyThreat?: number },
): NegotiationInfluenceBridgeReport {
  const { shift } = computeNegotiationThresholdShift(rel, ctx || {});
  const relSlices = decisionsAfter.flatMap(d => d.memoryInfluenceSlices || []).filter(s => /trust|griev|gratitude|relationship/i.test(s.reason));
  const relationshipSliceDelta = relSlices.reduce((s, x) => s + x.delta, 0);
  const signMatch =
    Math.abs(shift) < 0.01 ||
    Math.abs(relationshipSliceDelta) < AGENT19_NEGOTIATION_SLICE_MIN ||
    (shift < 0 && relationshipSliceDelta > 0) ||
    (shift > 0 && relationshipSliceDelta < 0);
  const aligned = signMatch;
  const narrativeLines = [
    `Negotiation bridge: threshold shift ${shift >= 0 ? '+' : ''}${shift.toFixed(3)} vs relationship slice Δ ${relationshipSliceDelta.toFixed(2)} (${aligned ? 'consistent' : 'mismatch'}).`,
  ];
  if (relSlices[0]) {
    narrativeLines.push(`Primary relationship slice: ${relSlices[0].reason} (${relSlices[0].delta >= 0 ? '+' : ''}${relSlices[0].delta.toFixed(2)}).`);
  }
  return { negotiationShift: shift, relationshipSliceDelta, aligned, narrativeLines };
}

export function negotiationInfluenceAligned(report: NegotiationInfluenceBridgeReport): boolean {
  return report.aligned;
}
