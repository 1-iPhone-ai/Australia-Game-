import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG,
} from './compute-turn-scale-wave-tranche-sync-latch-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG = 'op10m_scale_wave_tranche_ready_commit';
export const OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG = 'op10m_agent25_tranche_ready_wave_sealed';

export interface ComputeTurnScaleWaveTrancheReadyCommitCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-tranche-sync pass: commit tranche-ready wave when sync latch and wave readiness align. */
export function evaluateComputeTurnScaleWaveTrancheReadyCommitCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveTrancheReadyCommitCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  const syncLatch = simulation.flags[OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG];
  const syncReady = simulation.flags[OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    syncLatch !== undefined &&
    typeof syncReady === 'string' &&
    syncReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG] = day;
  simulation.flags[OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG] = syncReady;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_tranche_ready_commit', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveTrancheReadyCommits: applied.narrative.telemetry.scaleWaveTrancheReadyCommits + 1,
      agent25TrancheReadyWaveSealedPasses:
        applied.narrative.telemetry.agent25TrancheReadyWaveSealedPasses + 1,
    },
  };
  log.push(`scale wave tranche ready commit d=${day} sealed=${syncReady}`);

  return { simulation, narrative, log };
}
