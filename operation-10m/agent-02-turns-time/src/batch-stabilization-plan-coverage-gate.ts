import type { BatchAdvanceResult } from './batch-advance.js';
import type { ExternalStabilizationTurnSignals } from './external-stabilization-signals.js';

export interface BatchStabilizationPlanCoverageGateResult {
  steppedTurns: number[];
  missingTurns: number[];
  ok: boolean;
}

/**
 * Round 14: every stepped turn must appear in the Agent 05 stabilization export when batch gating is enabled.
 */
export function gateBatchStabilizationPlanCoverage(
  batch: BatchAdvanceResult,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): BatchStabilizationPlanCoverageGateResult {
  const steppedTurns: number[] = [];
  const missingTurns: number[] = [];

  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    const turn = step.clockBefore.turnIndex;
    steppedTurns.push(turn);
    if (stabilizationByTurn[turn] === undefined) missingTurns.push(turn);
  }

  return { steppedTurns, missingTurns, ok: missingTurns.length === 0 };
}
