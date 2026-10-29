import { TurnTimeSnapshot } from './types.js';
import {
  mergeExternalDayPlanWindow,
  type ExternalDayPlanWindowMergeResult,
} from './external-day-plan-window.js';
import { incompletePipelineTurns } from './pipeline-stages.js';

export interface ExternalDayPlanWindowGateResult {
  merge: ExternalDayPlanWindowMergeResult;
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
 * XS-02 gate: narrative window merge must pass and completed turns in the window must have full pipeline rolls.
 */
export function gateExternalDayPlanWindow(
  snapshot: TurnTimeSnapshot,
  fromTurn: number,
  toTurn: number,
  externalByTurn: Readonly<Record<number, readonly string[]>>,
  strict = true,
): ExternalDayPlanWindowGateResult {
  const merge = mergeExternalDayPlanWindow(snapshot, fromTurn, toTurn, externalByTurn, strict);
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
