import { TurnTimeSnapshot } from './types.js';
import { fnv1a64Hex } from './turn-audit.js';
import {
  derivePipelineStageHits,
  incompletePipelineTurns,
  listRegisteredPipelineStageIds,
  summarizePipelineByTurn,
} from './pipeline-stages.js';
import { reconcileLastStepHorizon } from './plan-actual-reconcile.js';

export interface Agent02TurnPipelineReport {
  turnIndex: number;
  dayIndex: number;
  registeredStageCount: number;
  stageHitCount: number;
  incompleteTurns: number[];
  pipelineDigest: string;
  reconcileOk: boolean | null;
}

function pipelineDigestPayload(snapshot: TurnTimeSnapshot): string {
  const hits = derivePipelineStageHits(snapshot.trace);
  const summaries = summarizePipelineByTurn(snapshot.trace, snapshot.clock.turnIndex);
  return JSON.stringify({
    turnIndex: snapshot.clock.turnIndex,
    hits: hits.map((h) => [h.stageId, h.turnIndex, h.sequence]),
    summaries: summaries.map((s) => [s.turnIndex, s.blocked, s.rolled, s.stageIds]),
  });
}

export function computeTurnPipelineDigest(snapshot: TurnTimeSnapshot): string {
  return fnv1a64Hex(pipelineDigestPayload(snapshot));
}

export function buildAgent02TurnPipelineReport(
  after: TurnTimeSnapshot,
  before?: TurnTimeSnapshot,
): Agent02TurnPipelineReport {
  const reconcileOk = before ? reconcileLastStepHorizon(before, after).ok : null;
  return {
    turnIndex: after.clock.turnIndex,
    dayIndex: after.clock.dayIndex,
    registeredStageCount: listRegisteredPipelineStageIds().length,
    stageHitCount: derivePipelineStageHits(after.trace).length,
    incompleteTurns: incompletePipelineTurns(after.trace, after.clock.turnIndex),
    pipelineDigest: computeTurnPipelineDigest(after),
    reconcileOk,
  };
}
