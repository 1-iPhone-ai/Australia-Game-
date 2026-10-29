import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG,
} from './compute-turn-scale-wave-tranche-ready-commit-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG = 'op10m_scale_wave_full_chunks_latch';
export const OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG = 'op10m_agent25_full_chunks_wave_ready';

export interface ComputeTurnScaleWaveFullChunksLatchCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-tranche-ready pass: latch full-chunks wave when ready commit and wave seal align. */
export function evaluateComputeTurnScaleWaveFullChunksLatchCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksLatchCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const readyCommit = simulation.flags[OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG];
  const readySealed = simulation.flags[OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    readyCommit !== undefined &&
    typeof readySealed === 'string' &&
    readySealed.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG] = readySealed;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_full_chunks_latch', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksLatches: applied.narrative.telemetry.scaleWaveFullChunksLatches + 1,
      agent25FullChunksWaveReadyPasses:
        applied.narrative.telemetry.agent25FullChunksWaveReadyPasses + 1,
    },
  };
  log.push(`scale wave full-chunks latch d=${day} wave=${readySealed}`);

  return { simulation, narrative, log };
}
