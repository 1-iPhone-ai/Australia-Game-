/**
 * Cross-wire: SECTION 20AU team intelligence routing.
 */
import type { V1014AiFidelityTeamAuReadSlice, V1014AiFidelityTurnInput } from '../types/core';
import { clampAiFidelity, aiFidelityRouteRank, aiFidelityHash } from '../engine/ai-fidelity-utils';

export function readV1014AiFidelity20AuSlice(input: V1014AiFidelityTurnInput): V1014AiFidelityTeamAuReadSlice {
  const routingPressure = clampAiFidelity(1 - input.teamCoordinationScore, 0, 1);
  return {
    routingPressure,
    conflictCount: Math.round(routingPressure * 6),
    coordinationPlanId: input.teamCoordinationScore > 0.45 ? `coord3_${input.turn}` : null,
    transparencyEnabled: input.featureFlagsEnabled,
  };
}

export function applyV1014AiFidelity20AuRoutingBridge(
  input: V1014AiFidelityTurnInput,
  pavScore: number,
): { routingCoherence: number; routeDigest: string } {
  const slice = readV1014AiFidelity20AuSlice(input);
  const rank = aiFidelityRouteRank(slice.routingPressure, slice.conflictCount);
  const routingCoherence = clampAiFidelity(rank * 0.5 + pavScore * 0.35 + input.teamCoordinationScore * 0.15, 0, 1);
  const routeDigest = aiFidelityHash({
    turn: input.turn,
    coherence: routingCoherence,
    plan: slice.coordinationPlanId,
  });
  return { routingCoherence, routeDigest };
}

export function v1014AiFidelity20AuTeamRouteModifier(coherence: number): number {
  return clampAiFidelity(0.75 + coherence * 0.35, 0.5, 1.25);
}
