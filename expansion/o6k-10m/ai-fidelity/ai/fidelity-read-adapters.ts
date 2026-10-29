/**
 * GI3 / explainability read surface for AI fidelity state (§1B pairs).
 */
import type {
  V1014AiFidelityTurnInput,
  V1014AiFidelityRuntimeState,
  V1014AiFidelityAcc17ReadSlice,
  V1014AiFidelityTeamAuReadSlice,
  V1014AiFidelityPaReadSlice,
} from '../types/core';

export function buildV1014AiFidelityAiBriefing(
  input: V1014AiFidelityTurnInput,
  acc17: V1014AiFidelityAcc17ReadSlice,
  team: V1014AiFidelityTeamAuReadSlice,
  pa: V1014AiFidelityPaReadSlice,
  preview: Pick<V1014AiFidelityRuntimeState, 'aggregatePavScore' | 'verifyPassRate'>,
): string {
  return [
    `turn=${input.turn}`,
    `pav=${preview.aggregatePavScore.toFixed(2)}`,
    `verify=${preview.verifyPassRate.toFixed(2)}`,
    `acc17_q=${acc17.queueDepth.toFixed(0)}`,
    `20au_conflicts=${team.conflictCount}`,
    `20pa_tier=${pa.advisoryTier}`,
  ].join(' ');
}

export function v1014AiFidelityExplainabilityFactKeys(): string[] {
  return ['ai_fidelity_state', 'pav_loop', 'acc17_queue', '20au_routing', '20pa_advisory'];
}
