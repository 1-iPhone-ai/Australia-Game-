import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-commit-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG =
  'op10m_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG =
  'op10m_agent25_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready';

export interface ComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff-closure-finalize-seal-commit pass: latch closure finalize seal sync when sync latch commit and sync sealed align. */
export function evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const syncCommit = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_COMMIT_FLAG];
  const syncSealed = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_SEALED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    syncCommit !== undefined &&
    typeof syncSealed === 'string' &&
    syncSealed.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG] = syncSealed;
  const applied = applyConsequenceMutation(
    simulation,
    narrative,
    'scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready',
    { stabilityDelta: 1 }
  );
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyLatches:
        applied.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyLatches + 1,
      agent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyPasses:
        applied.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyPasses + 1,
    },
  };
  log.push(
    `scale wave full-chunks handoff closure finalize seal sync latch wave ready d=${day} wave=${syncSealed}`
  );

  return { simulation, narrative, log };
}
