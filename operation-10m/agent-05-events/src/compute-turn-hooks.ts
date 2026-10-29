import { evaluateComputeTurnDepth } from './compute-turn-orchestrator.ts';
import {
  primeComputeTurnNarrativeEligibility,
  reconcileOp10mTurnComputeLedger,
} from './compute-turn-reconcile.ts';
import { settleOp10mComputeTurnDriftAfterReconcile } from './compute-turn-drift-settle.ts';
import {
  drainDeferredNarrativeMutationsForTurn,
  getDeferredQueueDepth,
  sanitizeOp10mTurnComputeLedger,
} from './deferred-queue.ts';
import {
  createDefaultOp10mNarrativeEngineState,
  evaluateOp10mNarrativeTick,
  sanitizeOp10mNarrativeEngineState,
  type Op10mTickOptions,
} from './narrative-runtime.ts';
import { evaluatePendingResponseOrchestration } from './pending-response-orchestrator.ts';
import { evaluatePendingResponseExpiryCoordination } from './pending-response-expiry-coordinator.ts';
import { evaluatePendingResponseStabilizationCoordination } from './pending-response-stabilization-coordinator.ts';
import { evaluatePendingStabilizationClosureCoordination } from './pending-stabilization-closure-coordinator.ts';
import { evaluateComputeTurnIntegrationSyncCoordination } from './compute-turn-integration-sync-coordinator.ts';
import { evaluateComputeTurnAssemblyHandoffCoordination } from './compute-turn-assembly-handoff-coordinator.ts';
import type {
  Op10mChainDescriptor,
  Op10mComputeTurnStage,
  Op10mNarrativeEngineState,
  Op10mRegionalNarrativeHook,
  Op10mSimulationSlice,
} from './types.ts';
import { OP10M_TURN_COMPUTE_DIGEST_FLAG } from './types.ts';

export {
  createDefaultOp10mTurnComputeLedger,
  drainDeferredNarrativeMutationsForTurn,
  enqueueDeferredNarrativeMutation,
  getDeferredQueueDepth,
  getTurnComputePassCount,
  sanitizeOp10mTurnComputeLedger,
} from './deferred-queue.ts';

export { OP10M_TURN_COMPUTE_DIGEST_FLAG } from './types.ts';

export function buildTurnComputeDigest(
  turn: number,
  day: number,
  activeCrises: number,
  deferredCount: number
): string {
  return `t${turn}|d${day}|c${activeCrises}|q${deferredCount}`;
}

export interface Op10mComputeTurnHookParams {
  turn: number;
  day: number;
  enabled?: boolean;
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState | null | undefined;
  catalog: Op10mChainDescriptor[];
  regionalHooks?: Op10mRegionalNarrativeHook[];
  tickOptions?: Op10mTickOptions;
}

export interface Op10mComputeTurnHookResult {
  ok: boolean;
  turn: number;
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
  turnComputeDigest: string;
  stagesRun: Op10mComputeTurnStage[];
}

const STAGE_ORDER: Op10mComputeTurnStage[] = [
  'pre_simulation',
  'post_simulation',
  'narrative_eligibility',
  'finalize',
];

/** Agent 25 / Agent 02 alignment: run deferred drains, compute depth, narrative tick, digest. */
export function executeOp10mNarrativeComputeTurnHook(
  params: Op10mComputeTurnHookParams
): Op10mComputeTurnHookResult {
  const enabled = params.enabled !== false;
  const stagesRun: Op10mComputeTurnStage[] = [];
  const log: string[] = [];

  let simulation: Op10mSimulationSlice = {
    ...params.simulation,
    day: params.day,
  };
  let narrative = sanitizeOp10mNarrativeEngineState(params.narrative ?? createDefaultOp10mNarrativeEngineState());
  narrative = {
    ...narrative,
    turnCompute: sanitizeOp10mTurnComputeLedger(narrative.turnCompute),
  };

  if (!enabled) {
    const digest = buildTurnComputeDigest(
      params.turn,
      params.day,
      simulation.activeCrisisCount,
      getDeferredQueueDepth(narrative)
    );
    return { ok: false, turn: params.turn, simulation, narrative, log, turnComputeDigest: digest, stagesRun };
  }

  const reconcile = reconcileOp10mTurnComputeLedger(simulation, narrative, params.turn, params.day);
  simulation = reconcile.simulation;
  narrative = reconcile.narrative;
  log.push(...reconcile.log);

  const settled = settleOp10mComputeTurnDriftAfterReconcile(simulation, narrative);
  simulation = settled.simulation;
  narrative = settled.narrative;
  log.push(...settled.log);

  const pre = drainDeferredNarrativeMutationsForTurn(simulation, narrative, params.turn);
  simulation = pre.simulation;
  narrative = pre.narrative;
  log.push(...pre.log);
  stagesRun.push('pre_simulation');

  const depth = evaluateComputeTurnDepth(simulation, narrative, params.turn);
  simulation = depth.simulation;
  narrative = depth.narrative;
  log.push(...depth.log);
  stagesRun.push('post_simulation');

  const primed = primeComputeTurnNarrativeEligibility(simulation, narrative);
  simulation = primed.simulation;
  narrative = primed.narrative;
  log.push(...primed.log);

  const tick = evaluateOp10mNarrativeTick(simulation, narrative, params.catalog, {
    regionalHooks: params.regionalHooks,
    ...params.tickOptions,
  });
  simulation = tick.simulation;
  narrative = tick.narrative;
  log.push(...tick.log);
  stagesRun.push('narrative_eligibility');

  const expiryPass = evaluatePendingResponseExpiryCoordination(simulation, narrative, params.day);
  simulation = expiryPass.simulation;
  narrative = expiryPass.narrative;
  log.push(...expiryPass.log);

  const pendingPass = evaluatePendingResponseOrchestration(simulation, narrative, params.day);
  simulation = pendingPass.simulation;
  narrative = pendingPass.narrative;
  log.push(...pendingPass.log);

  const stabilizationPass = evaluatePendingResponseStabilizationCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = stabilizationPass.simulation;
  narrative = stabilizationPass.narrative;
  log.push(...stabilizationPass.log);

  const deferredCount = getDeferredQueueDepth(narrative);
  const digest = buildTurnComputeDigest(
    params.turn,
    params.day,
    simulation.activeCrisisCount,
    deferredCount
  );
  const ledger = sanitizeOp10mTurnComputeLedger(narrative.turnCompute);
  narrative = {
    ...narrative,
    turnCompute: {
      ...ledger,
      lastTurn: params.turn,
      lastDay: params.day,
      computePassCount: ledger.computePassCount + 1,
      turnComputeDigest: digest,
      lastStages: STAGE_ORDER,
    },
    telemetry: {
      ...narrative.telemetry,
      computeTurnPasses: narrative.telemetry.computeTurnPasses + 1,
    },
  };
  simulation = {
    ...simulation,
    flags: {
      ...simulation.flags,
      [OP10M_TURN_COMPUTE_DIGEST_FLAG]: digest,
    },
  };
  log.push(`digest ${digest}`);
  stagesRun.push('finalize');

  const closurePass = evaluatePendingStabilizationClosureCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = closurePass.simulation;
  narrative = closurePass.narrative;
  log.push(...closurePass.log);

  const syncPass = evaluateComputeTurnIntegrationSyncCoordination(simulation, narrative, params.day);
  simulation = syncPass.simulation;
  narrative = syncPass.narrative;
  log.push(...syncPass.log);

  const handoffPass = evaluateComputeTurnAssemblyHandoffCoordination(simulation, narrative, params.day);
  simulation = handoffPass.simulation;
  narrative = handoffPass.narrative;
  log.push(...handoffPass.log);

  const postSettle = settleOp10mComputeTurnDriftAfterReconcile(simulation, narrative);
  simulation = postSettle.simulation;
  narrative = postSettle.narrative;
  log.push(...postSettle.log);

  return {
    ok: true,
    turn: params.turn,
    simulation,
    narrative,
    log,
    turnComputeDigest: digest,
    stagesRun,
  };
}
