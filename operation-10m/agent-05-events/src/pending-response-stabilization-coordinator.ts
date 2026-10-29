import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_PENDING_EXPIRY_WAVE_FLAG,
  OP10M_PENDING_QUEUE_CLEARED_FLAG,
} from './pending-response-expiry-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_PENDING_STABILIZATION_WAVE_FLAG = 'op10m_pending_stabilization_wave';
export const OP10M_POST_QUEUE_CALM_FLAG = 'op10m_post_queue_calm';

export interface PendingResponseStabilizationCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Compute-turn pass: surface stabilization / calm flags after backlog drains and queues settle. */
export function evaluatePendingResponseStabilizationCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): PendingResponseStabilizationCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];
  const hasExpiryWave = !!simulation.flags[OP10M_PENDING_EXPIRY_WAVE_FLAG];
  const queueCleared = simulation.flags[OP10M_PENDING_QUEUE_CLEARED_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_PENDING_STABILIZATION_WAVE_FLAG];
    delete simulation.flags[OP10M_POST_QUEUE_CALM_FLAG];
    return { simulation, narrative, log };
  }

  if (pendingCount === 0 && !hasExpiryWave) {
    simulation.flags[OP10M_POST_QUEUE_CALM_FLAG] = day;
    narrative = {
      ...narrative,
      telemetry: {
        ...narrative.telemetry,
        postQueueCalmPasses: narrative.telemetry.postQueueCalmPasses + 1,
      },
    };
    log.push('post queue calm');
  } else {
    delete simulation.flags[OP10M_POST_QUEUE_CALM_FLAG];
  }

  const stabilizationEligible =
    pendingCount === 0 &&
    !hasBacklog &&
    !hasExpiryWave &&
    (queueCleared !== undefined || narrative.telemetry.pendingQueueClears > 0);

  if (stabilizationEligible) {
    simulation.flags[OP10M_PENDING_STABILIZATION_WAVE_FLAG] = day;
    const applied = applyConsequenceMutation(simulation, narrative, 'pending_stabilization_wave', {
      stabilityDelta: 1,
    });
    simulation = applied.simulation;
    narrative = {
      ...applied.narrative,
      telemetry: {
        ...applied.narrative.telemetry,
        pendingStabilizationWaves: applied.narrative.telemetry.pendingStabilizationWaves + 1,
      },
    };
    log.push(`pending stabilization wave d=${day}`);
  } else if (pendingCount > 0 || hasExpiryWave) {
    delete simulation.flags[OP10M_PENDING_STABILIZATION_WAVE_FLAG];
  }

  return { simulation, narrative, log };
}
