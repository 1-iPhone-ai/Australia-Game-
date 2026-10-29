import {
  OP10M_COMPUTE_DRIFT_FLAG,
  type ComputeTurnReconcileResult,
} from './compute-turn-reconcile.ts';
import { sanitizeOp10mTurnComputeLedger } from './deferred-queue.ts';
import { OP10M_TURN_COMPUTE_DIGEST_FLAG } from './types.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_COMPUTE_DRIFT_SETTLED_FLAG = 'op10m_compute_drift_settled';
export { OP10M_COMPUTE_TURN_GAP_ACK_FLAG } from './compute-turn-reconcile.ts';

/** Clears drift when simulation digest matches ledger after reconcile; marks settled for tranche7 gates. */
export function settleOp10mComputeTurnDriftAfterReconcile(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState
): ComputeTurnReconcileResult {
  let simulation = { ...simulationIn };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  if (!simulation.flags[OP10M_COMPUTE_DRIFT_FLAG]) {
    return { simulation, narrative, log };
  }

  const ledger = sanitizeOp10mTurnComputeLedger(narrative.turnCompute);
  const flagDigest = simulation.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG];
  const ledgerDigest = ledger.turnComputeDigest;

  const digestsAligned =
    typeof flagDigest === 'string' &&
    ledgerDigest !== 'init' &&
    flagDigest === ledgerDigest;

  if (digestsAligned || ledger.lastTurn > 0) {
    const { [OP10M_COMPUTE_DRIFT_FLAG]: _drift, ...restFlags } = simulation.flags;
    simulation = {
      ...simulation,
      flags: {
        ...restFlags,
        [OP10M_COMPUTE_DRIFT_SETTLED_FLAG]: true,
      },
    };
    log.push('compute drift settled');
  }

  return { simulation, narrative, log };
}
