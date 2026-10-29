import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-seal-sync-commit-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_LATCH_FLAG =
  'op10m_scale_wave_full_chunks_handoff_closure_finalize_latch';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_READY_FLAG =
  'op10m_agent25_full_chunks_handoff_closure_finalize_wave_ready';

export interface ComputeTurnScaleWaveFullChunksHandoffClosureFinalizeLatchCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff-closure-seal-sync-commit pass: latch closure finalize when seal sync commit and seal align. */
export function evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeLatchCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffClosureFinalizeLatchCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const syncCommit = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_COMMIT_FLAG];
  const syncSealed = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_SEALED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    syncCommit !== undefined &&
    typeof syncSealed === 'string' &&
    syncSealed.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_LATCH_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_READY_FLAG] = syncSealed;
  const applied = applyConsequenceMutation(
    simulation,
    narrative,
    'scale_wave_full_chunks_handoff_closure_finalize_latch',
    { stabilityDelta: 1 }
  );
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksHandoffClosureFinalizeLatches:
        applied.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeLatches + 1,
      agent25FullChunksHandoffClosureFinalizeWaveReadyPasses:
        applied.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeWaveReadyPasses + 1,
    },
  };
  log.push(`scale wave full-chunks handoff closure finalize latch d=${day} wave=${syncSealed}`);

  return { simulation, narrative, log };
}
