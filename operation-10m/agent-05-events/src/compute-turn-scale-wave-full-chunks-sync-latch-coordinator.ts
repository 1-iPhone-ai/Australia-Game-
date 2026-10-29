import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-commit-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG = 'op10m_scale_wave_full_chunks_sync_latch';
export const OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG = 'op10m_agent25_full_chunks_sync_wave_ready';

export interface ComputeTurnScaleWaveFullChunksSyncLatchCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-full-chunks-commit pass: latch full-chunks sync when commit and wave seal align. */
export function evaluateComputeTurnScaleWaveFullChunksSyncLatchCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksSyncLatchCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const chunksCommit = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG];
  const chunksSealed = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    chunksCommit !== undefined &&
    typeof chunksSealed === 'string' &&
    chunksSealed.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG] = chunksSealed;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_full_chunks_sync_latch', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksSyncLatches:
        applied.narrative.telemetry.scaleWaveFullChunksSyncLatches + 1,
      agent25FullChunksSyncWaveReadyPasses:
        applied.narrative.telemetry.agent25FullChunksSyncWaveReadyPasses + 1,
    },
  };
  log.push(`scale wave full-chunks sync latch d=${day} wave=${chunksSealed}`);

  return { simulation, narrative, log };
}
