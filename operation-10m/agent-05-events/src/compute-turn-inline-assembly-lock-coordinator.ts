import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_CHUNK_INLINE_READY_FLAG,
  OP10M_MODULE_MANIFEST_ANCHOR_FLAG,
} from './compute-turn-module-manifest-anchor-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_INLINE_ASSEMBLY_LOCK_FLAG = 'op10m_inline_assembly_lock';
export const OP10M_AGENT25_SLOT_READY_FLAG = 'op10m_agent25_slot_ready';

export interface ComputeTurnInlineAssemblyLockCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-anchor pass: lock inline assembly when manifest anchor and chunk inline readiness align. */
export function evaluateComputeTurnInlineAssemblyLockCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnInlineAssemblyLockCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_INLINE_ASSEMBLY_LOCK_FLAG];
    delete simulation.flags[OP10M_AGENT25_SLOT_READY_FLAG];
    return { simulation, narrative, log };
  }

  const anchor = simulation.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG];
  const inlineReady = simulation.flags[OP10M_CHUNK_INLINE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    anchor !== undefined &&
    typeof inlineReady === 'string' &&
    inlineReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_INLINE_ASSEMBLY_LOCK_FLAG];
    delete simulation.flags[OP10M_AGENT25_SLOT_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_INLINE_ASSEMBLY_LOCK_FLAG] = day;
  simulation.flags[OP10M_AGENT25_SLOT_READY_FLAG] = inlineReady;
  const applied = applyConsequenceMutation(simulation, narrative, 'inline_assembly_lock', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      inlineAssemblyLocks: applied.narrative.telemetry.inlineAssemblyLocks + 1,
      agent25SlotReadyPasses: applied.narrative.telemetry.agent25SlotReadyPasses + 1,
    },
  };
  log.push(`inline assembly lock d=${day} slot=${inlineReady}`);

  return { simulation, narrative, log };
}
