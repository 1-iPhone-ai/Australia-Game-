import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEAL_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEAL_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-seal-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEALED_FLAG =
  'op10m_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed';
export const OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEALED_FLAG =
  'op10m_agent25_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed';

export interface ComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitSealedCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

export function evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitSealedCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitSealedCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];
  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];
  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEALED_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEALED_FLAG];
    return { simulation, narrative, log };
  }
  const waveCommit = simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEAL_FLAG];
  const latchCommit = simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEAL_FLAG];
  const eligible = pendingCount === 0 && !hasBacklog && waveCommit !== undefined && typeof latchCommit === 'string' && latchCommit.length >= 4;
  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEALED_FLAG];
    delete simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEALED_FLAG];
    return { simulation, narrative, log };
  }
  simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEALED_FLAG] = day;
  simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_WAVE_READY_COMMIT_SEALED_FLAG] = latchCommit;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed', { stabilityDelta: 1 });
  simulation = applied.simulation;
  narrative = { ...applied.narrative, telemetry: { ...applied.narrative.telemetry,
    scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitSealeds: applied.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitSealeds + 1,
    agent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitSealedPasses: applied.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitSealedPasses + 1,
  }};
  log.push(`scale wave full-chunks handoff closure finalize seal sync latch wave ready commit sealed d=${day} wave=${latchCommit}`);
  return { simulation, narrative, log };
}
