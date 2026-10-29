import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-latch-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG = 'op10m_scale_wave_full_chunks_commit';
export const OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG = 'op10m_agent25_full_chunks_wave_sealed';

export interface ComputeTurnScaleWaveFullChunksCommitCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-full-chunks-latch pass: commit full-chunks wave when latch and wave readiness align. */
export function evaluateComputeTurnScaleWaveFullChunksCommitCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksCommitCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  const chunksLatch = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG];
  const chunksReady = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    chunksLatch !== undefined &&
    typeof chunksReady === 'string' &&
    chunksReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG] = chunksReady;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_full_chunks_commit', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksCommits: applied.narrative.telemetry.scaleWaveFullChunksCommits + 1,
      agent25FullChunksWaveSealedPasses:
        applied.narrative.telemetry.agent25FullChunksWaveSealedPasses + 1,
    },
  };
  log.push(`scale wave full-chunks commit d=${day} sealed=${chunksReady}`);

  return { simulation, narrative, log };
}
