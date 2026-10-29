import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_FLAG =
  'op10m_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_FLAG =
  'op10m_agent25_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit';

export interface ComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff-closure-finalize-seal-sync-latch-wave-ready pass: commit when latch wave ready aligns. */
export function evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_FLAG];
    return { simulation, narrative, log };
  }

  const waveReady = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG];
  const latchReady =
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    waveReady !== undefined &&
    typeof latchReady === 'string' &&
    latchReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_FLAG] =
    day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_FLAG] =
    latchReady;
  const applied = applyConsequenceMutation(
    simulation,
    narrative,
    'scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit',
    { stabilityDelta: 1 }
  );
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommits:
        applied.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommits + 1,
      agent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitPasses:
        applied.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitPasses + 1,
    },
  };
  log.push(
    `scale wave full-chunks handoff closure finalize seal sync latch wave ready commit d=${day} wave=${latchReady}`
  );

  return { simulation, narrative, log };
}
