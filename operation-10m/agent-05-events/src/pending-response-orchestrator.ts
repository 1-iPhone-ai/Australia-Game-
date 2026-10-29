import { applyConsequenceMutation } from './consequence-applier.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_PENDING_BACKLOG_FLAG = 'op10m_pending_response_backlog';
export const OP10M_PENDING_ARBITRATION_FLAG = 'op10m_pending_arbitration_active';

const BACKLOG_THRESHOLD = 4;
const ARBITRATION_REGION_THRESHOLD = 2;
const SEVERE_BACKLOG_THRESHOLD = 6;

export function countPendingResponses(narrative: Op10mNarrativeEngineState): number {
  return narrative.pendingResponses.length;
}

export function maxPendingInSingleRegion(narrative: Op10mNarrativeEngineState): number {
  const counts: Record<string, number> = {};
  for (const pending of narrative.pendingResponses) {
    counts[pending.regionId] = (counts[pending.regionId] ?? 0) + 1;
  }
  const values = Object.values(counts);
  return values.length === 0 ? 0 : Math.max(...values);
}

export interface PendingResponseOrchestrationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-tick pressure: backlog flags, regional arbitration, and attention tax when queues swell. */
export function evaluatePendingResponseOrchestration(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): PendingResponseOrchestrationResult {
  let simulation = { ...simulationIn };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const maxRegional = maxPendingInSingleRegion(narrative);
  const flags = { ...simulation.flags };

  if (pendingCount < BACKLOG_THRESHOLD) {
    delete flags[OP10M_PENDING_BACKLOG_FLAG];
  }

  if (maxRegional < ARBITRATION_REGION_THRESHOLD) {
    delete flags[OP10M_PENDING_ARBITRATION_FLAG];
  }

  let telemetry = { ...narrative.telemetry };

  if (pendingCount >= BACKLOG_THRESHOLD) {
    flags[OP10M_PENDING_BACKLOG_FLAG] = pendingCount;
    const applied = applyConsequenceMutation(
      { ...simulation, flags },
      { ...narrative, telemetry },
      'pending_backlog',
      { stabilityDelta: -1 }
    );
    simulation = applied.simulation;
    telemetry = {
      ...applied.narrative.telemetry,
      pendingBacklogSurges: applied.narrative.telemetry.pendingBacklogSurges + 1,
    };
    narrative = { ...applied.narrative, telemetry };
    log.push(`pending backlog ${pendingCount}`);
  } else {
    simulation = { ...simulation, flags };
    narrative = { ...narrative, telemetry };
  }

  if (maxRegional >= ARBITRATION_REGION_THRESHOLD) {
    simulation = {
      ...simulation,
      flags: {
        ...simulation.flags,
        [OP10M_PENDING_ARBITRATION_FLAG]: maxRegional,
      },
    };
    narrative = {
      ...narrative,
      telemetry: {
        ...narrative.telemetry,
        responsesArbitrated: narrative.telemetry.responsesArbitrated + 1,
      },
    };
    log.push(`pending arbitration regionDepth=${maxRegional}`);
  }

  if (pendingCount >= SEVERE_BACKLOG_THRESHOLD) {
    const tax = applyConsequenceMutation(simulation, narrative, 'pending_attention_tax', {
      moneyDelta: -200,
      stabilityDelta: -1,
    });
    simulation = tax.simulation;
    narrative = tax.narrative;
    log.push('pending attention tax');
  }

  if (day > 0 && pendingCount === 0) {
    log.push('pending queue clear');
  }

  return { simulation, narrative, log };
}
