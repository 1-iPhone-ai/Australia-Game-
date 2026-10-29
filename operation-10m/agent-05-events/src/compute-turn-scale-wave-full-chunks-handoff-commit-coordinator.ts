import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-latch-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG =
  'op10m_scale_wave_full_chunks_handoff_commit';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG =
  'op10m_agent25_full_chunks_handoff_wave_sealed';

export interface ComputeTurnScaleWaveFullChunksHandoffCommitCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff-latch pass: commit handoff wave when latch and handoff readiness align. */
export function evaluateComputeTurnScaleWaveFullChunksHandoffCommitCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffCommitCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  const handoffLatch = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_LATCH_FLAG];
  const handoffReady = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    handoffLatch !== undefined &&
    typeof handoffReady === 'string' &&
    handoffReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG] = handoffReady;
  const applied = applyConsequenceMutation(
    simulation,
    narrative,
    'scale_wave_full_chunks_handoff_commit',
    { stabilityDelta: 1 }
  );
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksHandoffCommits:
        applied.narrative.telemetry.scaleWaveFullChunksHandoffCommits + 1,
      agent25FullChunksHandoffWaveSealedPasses:
        applied.narrative.telemetry.agent25FullChunksHandoffWaveSealedPasses + 1,
    },
  };
  log.push(`scale wave full-chunks handoff commit d=${day} sealed=${handoffReady}`);

  return { simulation, narrative, log };
}
