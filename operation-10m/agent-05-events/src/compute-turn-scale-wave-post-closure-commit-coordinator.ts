import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG,
} from './compute-turn-scale-wave-gate-closure-latch-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG = 'op10m_scale_wave_post_closure_commit';
export const OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG = 'op10m_agent25_post_closure_wave_sealed';

export interface ComputeTurnScaleWavePostClosureCommitCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-gate-closure pass: commit post-closure wave when closure latch and wave readiness align. */
export function evaluateComputeTurnScaleWavePostClosureCommitCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWavePostClosureCommitCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  const closureLatch = simulation.flags[OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG];
  const closureReady = simulation.flags[OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    closureLatch !== undefined &&
    typeof closureReady === 'string' &&
    closureReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG] = day;
  simulation.flags[OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG] = closureReady;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_post_closure_commit', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWavePostClosureCommits: applied.narrative.telemetry.scaleWavePostClosureCommits + 1,
      agent25PostClosureWaveSealedPasses:
        applied.narrative.telemetry.agent25PostClosureWaveSealedPasses + 1,
    },
  };
  log.push(`scale wave post-closure commit d=${day} sealed=${closureReady}`);

  return { simulation, narrative, log };
}
