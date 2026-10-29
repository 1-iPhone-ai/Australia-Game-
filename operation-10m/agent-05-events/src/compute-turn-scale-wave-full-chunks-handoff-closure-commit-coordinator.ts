import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-latch-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG =
  'op10m_scale_wave_full_chunks_handoff_closure_commit';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG =
  'op10m_agent25_full_chunks_handoff_closure_wave_sealed';

export interface ComputeTurnScaleWaveFullChunksHandoffClosureCommitCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff-closure-latch pass: commit closure when latch and closure readiness align. */
export function evaluateComputeTurnScaleWaveFullChunksHandoffClosureCommitCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffClosureCommitCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  const closureLatch = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_LATCH_FLAG];
  const closureReady = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    closureLatch !== undefined &&
    typeof closureReady === 'string' &&
    closureReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG] = closureReady;
  const applied = applyConsequenceMutation(
    simulation,
    narrative,
    'scale_wave_full_chunks_handoff_closure_commit',
    { stabilityDelta: 1 }
  );
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksHandoffClosureCommits:
        applied.narrative.telemetry.scaleWaveFullChunksHandoffClosureCommits + 1,
      agent25FullChunksHandoffClosureWaveSealedPasses:
        applied.narrative.telemetry.agent25FullChunksHandoffClosureWaveSealedPasses + 1,
    },
  };
  log.push(`scale wave full-chunks handoff closure commit d=${day} sealed=${closureReady}`);

  return { simulation, narrative, log };
}
