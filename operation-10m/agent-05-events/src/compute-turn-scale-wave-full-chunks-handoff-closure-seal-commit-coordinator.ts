import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-seal-latch-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG =
  'op10m_scale_wave_full_chunks_handoff_closure_seal_commit';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG =
  'op10m_agent25_full_chunks_handoff_closure_seal_wave_sealed';

export interface ComputeTurnScaleWaveFullChunksHandoffClosureSealCommitCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff-closure-seal-latch pass: commit closure seal when latch and seal readiness align. */
export function evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealCommitCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffClosureSealCommitCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  const sealLatch = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_LATCH_FLAG];
  const sealReady = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    sealLatch !== undefined &&
    typeof sealReady === 'string' &&
    sealReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG] = sealReady;
  const applied = applyConsequenceMutation(
    simulation,
    narrative,
    'scale_wave_full_chunks_handoff_closure_seal_commit',
    { stabilityDelta: 1 }
  );
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksHandoffClosureSealCommits:
        applied.narrative.telemetry.scaleWaveFullChunksHandoffClosureSealCommits + 1,
      agent25FullChunksHandoffClosureSealWaveSealedPasses:
        applied.narrative.telemetry.agent25FullChunksHandoffClosureSealWaveSealedPasses + 1,
    },
  };
  log.push(`scale wave full-chunks handoff closure seal commit d=${day} sealed=${sealReady}`);

  return { simulation, narrative, log };
}
