import { TurnTimeSnapshot } from './types.js';
import { incompletePipelineTurns } from './pipeline-stages.js';
import {
  mergeExternalStabilizationWindow,
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

function turnsInWindow(fromTurn: number, toTurn: number): number[] {
  const from = Math.max(1, Math.floor(fromTurn));
  const to = Math.max(from, Math.floor(toTurn));
  const turns: number[] = [];
  for (let t = from; t <= to; t += 1) turns.push(t);
  return turns;
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
  const windowTurns = turnsInWindow(fromTurn, toTurn).filter((t) => t < snapshot.clock.turnIndex);
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
