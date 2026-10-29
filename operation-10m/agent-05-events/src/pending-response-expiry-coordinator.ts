import { applyConsequenceMutation } from './consequence-applier.ts';
import { OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_PENDING_EXPIRY_WAVE_FLAG = 'op10m_pending_expiry_wave';
export const OP10M_PENDING_QUEUE_CLEARED_FLAG = 'op10m_pending_queue_cleared';

export interface PendingResponseExpiryCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Compute-turn pass: drop expired dilemmas, surface expiry-wave flags, mark queue clears after backlog. */
export function evaluatePendingResponseExpiryCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): PendingResponseExpiryCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const hadBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];
  const beforeCount = narrative.pendingResponses.length;

  const surviving = narrative.pendingResponses.filter((p) => p.expiresDay >= day);
  const expiredCount = beforeCount - surviving.length;

  if (expiredCount > 0) {
    narrative = {
      ...narrative,
      pendingResponses: surviving,
      telemetry: {
        ...narrative.telemetry,
        pendingResponsesExpired: narrative.telemetry.pendingResponsesExpired + expiredCount,
      },
    };
    simulation.flags[OP10M_PENDING_EXPIRY_WAVE_FLAG] = expiredCount;
    const applied = applyConsequenceMutation(simulation, narrative, 'pending_expiry_wave', {
      stabilityDelta: -1,
    });
    simulation = applied.simulation;
    narrative = applied.narrative;
    log.push(`pending expiry wave n=${expiredCount}`);
  } else {
    delete simulation.flags[OP10M_PENDING_EXPIRY_WAVE_FLAG];
  }

  if (surviving.length === 0 && beforeCount > 0) {
    simulation.flags[OP10M_PENDING_QUEUE_CLEARED_FLAG] = day;
    narrative = {
      ...narrative,
      telemetry: {
        ...narrative.telemetry,
        pendingQueueClears: narrative.telemetry.pendingQueueClears + 1,
      },
    };
    log.push('pending queue cleared');
  }

  if (hadBacklog && surviving.length === 0) {
    delete simulation.flags[OP10M_PENDING_BACKLOG_FLAG];
    log.push('pending backlog released');
  }

  return { simulation, narrative, log };
}
