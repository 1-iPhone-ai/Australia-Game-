import { applyConsequenceMutation } from './consequence-applier.ts';
import { enqueueDeferredNarrativeMutation, getDeferredQueueDepth } from './deferred-queue.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_COMPUTE_PRESSURE_FLAG = 'op10m_compute_turn_pressure';

const RUPTURE_PHASE = 'rupture' as const;

export function countActiveRuptureChains(narrative: Op10mNarrativeEngineState): number {
  return Object.values(narrative.activeChains).filter((c) => c.phase === RUPTURE_PHASE).length;
}

export interface ComputeTurnDepthResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Applies rupture-stack pressure and schedules deferred fallout for the next compute turn. */
export function evaluateComputeTurnDepth(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  turn: number
): ComputeTurnDepthResult {
  let simulation = { ...simulationIn };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const ruptureCount = countActiveRuptureChains(narrative);
  if (ruptureCount === 0) {
    return { simulation, narrative, log };
  }

  const pressure = Math.min(5, ruptureCount);
  simulation = {
    ...simulation,
    flags: {
      ...simulation.flags,
      [OP10M_COMPUTE_PRESSURE_FLAG]: pressure,
    },
  };
  log.push(`compute pressure ${pressure} (${ruptureCount} ruptures)`);

  if (ruptureCount >= 2 && getDeferredQueueDepth(narrative) < 6) {
    const sourceChainId = Object.values(narrative.activeChains).find((c) => c.phase === RUPTURE_PHASE)
      ?.chainId;
    if (sourceChainId) {
      narrative = enqueueDeferredNarrativeMutation(narrative, {
        chainId: sourceChainId,
        firesOnTurn: turn + 1,
        enqueuedDay: simulation.day,
        mutation: {
          stabilityDelta: -2,
          moneyDelta: -250,
          setFlags: { op10m_deferred_fallout: true },
        },
      });
      log.push(`deferred fallout queued for turn ${turn + 1}`);
    }
  }

  if (ruptureCount >= 3) {
    const applied = applyConsequenceMutation(simulation, narrative, 'compute_turn_stack', {
      sectorActivityDelta: { logistics: -1, trade: -1 },
      stabilityDelta: -1,
    });
    simulation = applied.simulation;
    narrative = applied.narrative;
    log.push('rupture stack sector drag');
  }

  return { simulation, narrative, log };
}
