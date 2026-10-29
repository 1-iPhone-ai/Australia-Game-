import { TurnTimeSnapshot } from './types.js';
import { incompletePipelineTurns } from './pipeline-stages.js';
import {
  mergeExternalStabilizationWindow,
  listTurnsInStabilizationWindow,
  type ExternalStabilizationWindowMergeResult,
} from './external-stabilization-window.js';
import type { ExternalStabilizationTurnSignals } from './external-stabilization-signals.js';

export interface ExternalStabilizationWindowGateResult {
  merge: ExternalStabilizationWindowMergeResult;
  incompletePipelineTurns: number[];
  turnsWithIncompletePipeline: number[];
  pipelineReady: boolean;
  ok: boolean;
}

/**
 * Pre-advance gate: stabilization window lattice + pipeline completeness for completed turns in range.
 */
export function gateExternalStabilizationWindow(
  snapshot: TurnTimeSnapshot,
  fromTurn: number,
  toTurn: number,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): ExternalStabilizationWindowGateResult {
  const merge = mergeExternalStabilizationWindow(fromTurn, toTurn, stabilizationByTurn);
  const incomplete = incompletePipelineTurns(snapshot.trace, snapshot.clock.turnIndex);
  const windowTurns = listTurnsInStabilizationWindow(fromTurn, toTurn).filter((t) => t < snapshot.clock.turnIndex);
  const turnsWithIncompletePipeline = windowTurns.filter((t) => incomplete.includes(t));
  const pipelineReady = turnsWithIncompletePipeline.length === 0;
  return {
    merge,
    incompletePipelineTurns: incomplete,
    turnsWithIncompletePipeline,
    pipelineReady,
    ok: merge.ok && pipelineReady,
  };
}
