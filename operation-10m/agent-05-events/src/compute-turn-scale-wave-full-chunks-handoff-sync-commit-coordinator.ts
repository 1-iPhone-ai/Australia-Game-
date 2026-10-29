import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-sync-latch-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG =
  'op10m_scale_wave_full_chunks_handoff_sync_commit';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG =
  'op10m_agent25_full_chunks_handoff_sync_wave_sealed';

export interface ComputeTurnScaleWaveFullChunksHandoffSyncCommitCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff-sync-latch pass: commit handoff sync when latch and sync readiness align. */
export function evaluateComputeTurnScaleWaveFullChunksHandoffSyncCommitCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffSyncCommitCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  const syncLatch = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG];
  const syncReady = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    syncLatch !== undefined &&
    typeof syncReady === 'string' &&
    syncReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG] = syncReady;
  const applied = applyConsequenceMutation(
    simulation,
    narrative,
    'scale_wave_full_chunks_handoff_sync_commit',
    { stabilityDelta: 1 }
  );
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksHandoffSyncCommits:
        applied.narrative.telemetry.scaleWaveFullChunksHandoffSyncCommits + 1,
      agent25FullChunksHandoffSyncWaveSealedPasses:
        applied.narrative.telemetry.agent25FullChunksHandoffSyncWaveSealedPasses + 1,
    },
  };
  log.push(`scale wave full-chunks handoff sync commit d=${day} sealed=${syncReady}`);

  return { simulation, narrative, log };
}
