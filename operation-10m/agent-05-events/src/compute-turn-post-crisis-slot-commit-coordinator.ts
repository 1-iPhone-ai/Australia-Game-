import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_SLOT_READY_FLAG,
  OP10M_INLINE_ASSEMBLY_LOCK_FLAG,
} from './compute-turn-inline-assembly-lock-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_POST_CRISIS_SLOT_COMMIT_FLAG = 'op10m_post_crisis_slot_commit';
export const OP10M_CHUNK_MANIFEST_SEALED_FLAG = 'op10m_chunk_manifest_sealed';

export interface ComputeTurnPostCrisisSlotCommitCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-lock pass: commit post-crisis slot when inline lock and Agent 25 slot readiness align. */
export function evaluateComputeTurnPostCrisisSlotCommitCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnPostCrisisSlotCommitCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_POST_CRISIS_SLOT_COMMIT_FLAG];
    delete simulation.flags[OP10M_CHUNK_MANIFEST_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  const inlineLock = simulation.flags[OP10M_INLINE_ASSEMBLY_LOCK_FLAG];
  const slotReady = simulation.flags[OP10M_AGENT25_SLOT_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    inlineLock !== undefined &&
    typeof slotReady === 'string' &&
    slotReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_POST_CRISIS_SLOT_COMMIT_FLAG];
    delete simulation.flags[OP10M_CHUNK_MANIFEST_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_POST_CRISIS_SLOT_COMMIT_FLAG] = day;
  simulation.flags[OP10M_CHUNK_MANIFEST_SEALED_FLAG] = slotReady;
  const applied = applyConsequenceMutation(simulation, narrative, 'post_crisis_slot_commit', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      postCrisisSlotCommits: applied.narrative.telemetry.postCrisisSlotCommits + 1,
      chunkManifestSealedPasses: applied.narrative.telemetry.chunkManifestSealedPasses + 1,
    },
  };
  log.push(`post-crisis slot commit d=${day} sealed=${slotReady}`);

  return { simulation, narrative, log };
}
