import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-commit-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG =
  'op10m_scale_wave_full_chunks_handoff_closure_sync_latch';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG =
  'op10m_agent25_full_chunks_handoff_closure_sync_wave_ready';

export interface ComputeTurnScaleWaveFullChunksHandoffClosureSyncLatchCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff-closure-commit pass: latch closure sync when commit and closure seal align. */
export function evaluateComputeTurnScaleWaveFullChunksHandoffClosureSyncLatchCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffClosureSyncLatchCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const closureCommit = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG];
  const closureSealed = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    closureCommit !== undefined &&
    typeof closureSealed === 'string' &&
    closureSealed.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG] = closureSealed;
  const applied = applyConsequenceMutation(
    simulation,
    narrative,
    'scale_wave_full_chunks_handoff_closure_sync_latch',
    { stabilityDelta: 1 }
  );
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksHandoffClosureSyncLatches:
        applied.narrative.telemetry.scaleWaveFullChunksHandoffClosureSyncLatches + 1,
      agent25FullChunksHandoffClosureSyncWaveReadyPasses:
        applied.narrative.telemetry.agent25FullChunksHandoffClosureSyncWaveReadyPasses + 1,
    },
  };
  log.push(`scale wave full-chunks handoff closure sync latch d=${day} wave=${closureSealed}`);

  return { simulation, narrative, log };
}
