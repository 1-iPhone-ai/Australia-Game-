import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-commit-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG =
  'op10m_scale_wave_full_chunks_handoff_sync_latch';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG =
  'op10m_agent25_full_chunks_handoff_sync_wave_ready';

export interface ComputeTurnScaleWaveFullChunksHandoffSyncLatchCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff-commit pass: latch handoff sync when commit and handoff seal align. */
export function evaluateComputeTurnScaleWaveFullChunksHandoffSyncLatchCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffSyncLatchCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const handoffCommit = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG];
  const handoffSealed = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    handoffCommit !== undefined &&
    typeof handoffSealed === 'string' &&
    handoffSealed.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG] = handoffSealed;
  const applied = applyConsequenceMutation(
    simulation,
    narrative,
    'scale_wave_full_chunks_handoff_sync_latch',
    { stabilityDelta: 1 }
  );
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveFullChunksHandoffSyncLatches:
        applied.narrative.telemetry.scaleWaveFullChunksHandoffSyncLatches + 1,
      agent25FullChunksHandoffSyncWaveReadyPasses:
        applied.narrative.telemetry.agent25FullChunksHandoffSyncWaveReadyPasses + 1,
    },
  };
  log.push(`scale wave full-chunks handoff sync latch d=${day} wave=${handoffSealed}`);

  return { simulation, narrative, log };
}
