/**
 * Cross-wire: ACC17 command center execution verifier (§15).
 */
import type { V1014AiFidelityAcc17ReadSlice, V1014AiFidelityTurnInput } from '../types/core';
import { clampAiFidelity, aiFidelityExecutionRank } from '../engine/ai-fidelity-utils';

export function readV1014AiFidelityAcc17Slice(input: V1014AiFidelityTurnInput): V1014AiFidelityAcc17ReadSlice {
  const rank = aiFidelityExecutionRank(input.executionBand);
  const queueDepth = clampAiFidelity(input.acc17QueueDepth + (5 - rank) * 0.5, 0, 32);
  return {
    queueDepth,
    verifiedExecutionRate: clampAiFidelity(0.55 + rank * 0.1 - queueDepth * 0.015, 0, 1),
    pendingPlanSteps: Math.round(queueDepth * 0.6),
    fingerprintGateOpen: rank >= 2,
  };
}

export function applyV1014AiFidelityAcc17VerifyBridge(
  input: V1014AiFidelityTurnInput,
  pavScore: number,
): { verifyBoost: number; gateClosed: boolean } {
  const slice = readV1014AiFidelityAcc17Slice(input);
  const verifyBoost = clampAiFidelity(pavScore * 0.25 + slice.verifiedExecutionRate * 0.35, 0, 1);
  return {
    verifyBoost,
    gateClosed: !slice.fingerprintGateOpen && pavScore < 0.4,
  };
}

export function v1014AiFidelityAcc17PlanActVerifyHint(pavScore: number, queueDepth: number): string {
  return `acc17:pav=${pavScore.toFixed(2)}:queue=${queueDepth.toFixed(0)}`;
}
