import { OP10M_TURN_COMPUTE_DIGEST_FLAG } from './types.ts';
import {
  getDeferredQueueDepth,
  getTurnComputePassCount,
  sanitizeOp10mTurnComputeLedger,
} from './deferred-queue.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_COMPUTE_DRIFT_FLAG = 'op10m_compute_turn_drift';
export const OP10M_COMPUTE_ELIGIBILITY_PRIMED_FLAG = 'op10m_compute_eligibility_primed';

export interface ComputeTurnReconcileResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Aligns ledger turn metadata and surfaces digest drift before deferred drains run. */
export function reconcileOp10mTurnComputeLedger(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  turn: number,
  day: number
): ComputeTurnReconcileResult {
  let simulation = { ...simulationIn };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const ledger = sanitizeOp10mTurnComputeLedger(narrative.turnCompute);
  const flagDigest = simulation.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG];
  const ledgerDigest = ledger.turnComputeDigest;

  if (
    typeof flagDigest === 'string' &&
    ledgerDigest !== 'init' &&
    flagDigest !== ledgerDigest
  ) {
    simulation = {
      ...simulation,
      flags: {
        ...simulation.flags,
        [OP10M_COMPUTE_DRIFT_FLAG]: true,
      },
    };
    log.push('compute digest drift detected');
  }

  if (ledger.lastTurn > 0 && turn > ledger.lastTurn + 1) {
    log.push(`compute turn gap ${ledger.lastTurn}->${turn}`);
  }

  narrative = {
    ...narrative,
    turnCompute: {
      ...ledger,
      lastDay: Math.max(ledger.lastDay, day),
    },
  };

  return { simulation, narrative, log };
}

/** Marks eligibility when sustained compute passes and deferred backlog warrant priming. */
export function primeComputeTurnNarrativeEligibility(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState
): ComputeTurnReconcileResult {
  let simulation = { ...simulationIn };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const passes = getTurnComputePassCount(narrative);
  const deferred = getDeferredQueueDepth(narrative);
  if (passes >= 2 || deferred >= 2) {
    simulation = {
      ...simulation,
      flags: {
        ...simulation.flags,
        [OP10M_COMPUTE_ELIGIBILITY_PRIMED_FLAG]: true,
      },
    };
    log.push(`eligibility primed passes=${passes} deferred=${deferred}`);
  }

  return { simulation, narrative, log };
}
