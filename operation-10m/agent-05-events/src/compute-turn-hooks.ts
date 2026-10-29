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
import { evaluateComputeTurnChunkAssemblySealCoordination } from './compute-turn-chunk-assembly-seal-coordinator.ts';
import { evaluateComputeTurnModuleManifestAnchorCoordination } from './compute-turn-module-manifest-anchor-coordinator.ts';
import { evaluateComputeTurnInlineAssemblyLockCoordination } from './compute-turn-inline-assembly-lock-coordinator.ts';
import { evaluateComputeTurnPostCrisisSlotCommitCoordination } from './compute-turn-post-crisis-slot-commit-coordinator.ts';
import { evaluateComputeTurnScaleWaveBundleLatchCoordination } from './compute-turn-scale-wave-bundle-latch-coordinator.ts';
import { evaluateComputeTurnScaleWaveCatalogCommitCoordination } from './compute-turn-scale-wave-catalog-commit-coordinator.ts';
import { evaluateComputeTurnScaleWaveOriginGateCoordination } from './compute-turn-scale-wave-origin-gate-coordinator.ts';
import { evaluateComputeTurnScaleWaveProjectionLatchCoordination } from './compute-turn-scale-wave-projection-latch-coordinator.ts';
import { evaluateComputeTurnScaleWaveDryRunGateCoordination } from './compute-turn-scale-wave-dry-run-gate-coordinator.ts';
import { evaluateComputeTurnScaleWaveGateClosureLatchCoordination } from './compute-turn-scale-wave-gate-closure-latch-coordinator.ts';
import { evaluateComputeTurnScaleWavePostClosureCommitCoordination } from './compute-turn-scale-wave-post-closure-commit-coordinator.ts';
import { evaluateComputeTurnScaleWaveTrancheSyncLatchCoordination } from './compute-turn-scale-wave-tranche-sync-latch-coordinator.ts';
import { evaluateComputeTurnScaleWaveTrancheReadyCommitCoordination } from './compute-turn-scale-wave-tranche-ready-commit-coordinator.ts';
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

  const sealPass = evaluateComputeTurnChunkAssemblySealCoordination(simulation, narrative, params.day);
  simulation = sealPass.simulation;
  narrative = sealPass.narrative;
  log.push(...sealPass.log);

  const anchorPass = evaluateComputeTurnModuleManifestAnchorCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = anchorPass.simulation;
  narrative = anchorPass.narrative;
  log.push(...anchorPass.log);

  const lockPass = evaluateComputeTurnInlineAssemblyLockCoordination(simulation, narrative, params.day);
  simulation = lockPass.simulation;
  narrative = lockPass.narrative;
  log.push(...lockPass.log);

  const slotCommitPass = evaluateComputeTurnPostCrisisSlotCommitCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = slotCommitPass.simulation;
  narrative = slotCommitPass.narrative;
  log.push(...slotCommitPass.log);

  const bundleLatchPass = evaluateComputeTurnScaleWaveBundleLatchCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = bundleLatchPass.simulation;
  narrative = bundleLatchPass.narrative;
  log.push(...bundleLatchPass.log);

  const catalogCommitPass = evaluateComputeTurnScaleWaveCatalogCommitCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = catalogCommitPass.simulation;
  narrative = catalogCommitPass.narrative;
  log.push(...catalogCommitPass.log);

  const originGatePass = evaluateComputeTurnScaleWaveOriginGateCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = originGatePass.simulation;
  narrative = originGatePass.narrative;
  log.push(...originGatePass.log);

  const projectionLatchPass = evaluateComputeTurnScaleWaveProjectionLatchCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = projectionLatchPass.simulation;
  narrative = projectionLatchPass.narrative;
  log.push(...projectionLatchPass.log);

  const dryRunGatePass = evaluateComputeTurnScaleWaveDryRunGateCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = dryRunGatePass.simulation;
  narrative = dryRunGatePass.narrative;
  log.push(...dryRunGatePass.log);

  const gateClosurePass = evaluateComputeTurnScaleWaveGateClosureLatchCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = gateClosurePass.simulation;
  narrative = gateClosurePass.narrative;
  log.push(...gateClosurePass.log);

  const postClosurePass = evaluateComputeTurnScaleWavePostClosureCommitCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = postClosurePass.simulation;
  narrative = postClosurePass.narrative;
  log.push(...postClosurePass.log);

  const trancheSyncPass = evaluateComputeTurnScaleWaveTrancheSyncLatchCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = trancheSyncPass.simulation;
  narrative = trancheSyncPass.narrative;
  log.push(...trancheSyncPass.log);

  const trancheReadyPass = evaluateComputeTurnScaleWaveTrancheReadyCommitCoordination(
    simulation,
    narrative,
    params.day
  );
  simulation = trancheReadyPass.simulation;
  narrative = trancheReadyPass.narrative;
  log.push(...trancheReadyPass.log);

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
