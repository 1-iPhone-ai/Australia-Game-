import { TurnTimeSnapshot } from './types.js';
import { type BatchAdvanceResult } from './batch-advance.js';
import {
  reconcileHorizonThroughTurns,
  type HorizonReconcileReport,
} from './plan-actual-reconcile.js';

export interface BatchHorizonReconcileReport {
  steppedTurnCount: number;
  stepHorizonOk: boolean[];
  rangeReport: HorizonReconcileReport;
  allStepHorizonOk: boolean;
  ok: boolean;
}

export function buildBatchHorizonReconcileReport(
  initial: TurnTimeSnapshot,
  final: TurnTimeSnapshot,
  batch: BatchAdvanceResult,
): BatchHorizonReconcileReport {
  const stepHorizonOk = batch.horizonReconcileOk ?? [];
  const steppedTurns = batch.steps
    .filter((s) => !s.blockedByPause)
    .map((s) => s.clockBefore.turnIndex);
  const fromTurn = steppedTurns[0] ?? initial.clock.turnIndex;
  const toTurn = steppedTurns[steppedTurns.length - 1] ?? fromTurn;
  const rangeReport =
    steppedTurns.length > 0
      ? reconcileHorizonThroughTurns(initial, final, fromTurn, toTurn)
      : { ok: true, rows: [] };
  const allStepHorizonOk = stepHorizonOk.every(Boolean);
  return {
    steppedTurnCount: steppedTurns.length,
    stepHorizonOk,
    rangeReport,
    allStepHorizonOk,
    ok: allStepHorizonOk && rangeReport.ok,
  };
}
