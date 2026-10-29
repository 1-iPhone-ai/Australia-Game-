import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG,
} from './compute-turn-scale-wave-post-closure-commit-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG = 'op10m_scale_wave_tranche_sync_latch';
export const OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG = 'op10m_agent25_tranche_sync_wave_ready';

export interface ComputeTurnScaleWaveTrancheSyncLatchCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-post-closure pass: latch tranche sync when post-closure commit and wave seal align. */
export function evaluateComputeTurnScaleWaveTrancheSyncLatchCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveTrancheSyncLatchCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const postClosureCommit = simulation.flags[OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG];
  const postClosureSealed = simulation.flags[OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    postClosureCommit !== undefined &&
    typeof postClosureSealed === 'string' &&
    postClosureSealed.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG] = day;
  simulation.flags[OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG] = postClosureSealed;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_tranche_sync_latch', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveTrancheSyncLatches: applied.narrative.telemetry.scaleWaveTrancheSyncLatches + 1,
      agent25TrancheSyncWaveReadyPasses:
        applied.narrative.telemetry.agent25TrancheSyncWaveReadyPasses + 1,
    },
  };
  log.push(`scale wave tranche sync latch d=${day} wave=${postClosureSealed}`);

  return { simulation, narrative, log };
}
