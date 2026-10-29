import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-seal-commit-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_LATCH_FLAG =
  'op10m_scale_wave_full_chunks_handoff_closure_seal_sync_latch';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_READY_FLAG =
  'op10m_agent25_full_chunks_handoff_closure_seal_sync_wave_ready';

export interface ComputeTurnScaleWaveFullChunksHandoffClosureSealSyncLatchCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff-closure-seal-commit pass: latch closure seal sync when seal commit and seal align. */
export function evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealSyncLatchCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffClosureSealSyncLatchCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const sealCommit = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG];
  const sealSealed = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    sealCommit !== undefined &&
    typeof sealSealed === 'string' &&
    sealSealed.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_LATCH_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_READY_FLAG] = sealSealed;
  const applied = applyConsequenceMutation(
    simulation,
    narrative,
    'scale_wave_full_chunks_handoff_closure_seal_sync_latch',
    { stabilityDelta: 1 }
  );
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksHandoffClosureSealSyncLatches:
        applied.narrative.telemetry.scaleWaveFullChunksHandoffClosureSealSyncLatches + 1,
      agent25FullChunksHandoffClosureSealSyncWaveReadyPasses:
        applied.narrative.telemetry.agent25FullChunksHandoffClosureSealSyncWaveReadyPasses + 1,
    },
  };
  log.push(`scale wave full-chunks handoff closure seal sync latch d=${day} wave=${sealSealed}`);

  return { simulation, narrative, log };
}
