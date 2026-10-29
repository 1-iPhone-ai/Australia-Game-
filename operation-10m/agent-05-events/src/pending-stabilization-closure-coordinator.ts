import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_PENDING_STABILIZATION_WAVE_FLAG,
  OP10M_POST_QUEUE_CALM_FLAG,
} from './pending-response-stabilization-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';
import { OP10M_TURN_COMPUTE_DIGEST_FLAG } from './types.ts';

export const OP10M_STABILIZATION_CLOSURE_WAVE_FLAG = 'op10m_stabilization_closure_wave';
export const OP10M_DIGEST_CLOSURE_LATCH_FLAG = 'op10m_digest_closure_latch';

export interface PendingStabilizationClosureCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-digest pass: latch closure flags when calm stabilization and digest align. */
export function evaluatePendingStabilizationClosureCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): PendingStabilizationClosureCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG];
    delete simulation.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG];
    return { simulation, narrative, log };
  }

  const calm = simulation.flags[OP10M_POST_QUEUE_CALM_FLAG];
  const stabilization = simulation.flags[OP10M_PENDING_STABILIZATION_WAVE_FLAG];
  const digest = simulation.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    calm !== undefined &&
    stabilization !== undefined &&
    typeof digest === 'string' &&
    digest.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG];
    delete simulation.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG] = day;
  simulation.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG] = digest;
  const applied = applyConsequenceMutation(simulation, narrative, 'stabilization_closure_wave', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      stabilizationClosureWaves: applied.narrative.telemetry.stabilizationClosureWaves + 1,
      digestClosureLatches: applied.narrative.telemetry.digestClosureLatches + 1,
    },
  };
  log.push(`stabilization closure latch d=${day} digest=${digest}`);

  return { simulation, narrative, log };
}
