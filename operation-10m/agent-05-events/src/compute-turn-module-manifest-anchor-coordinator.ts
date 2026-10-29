import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_CHUNK_ASSEMBLY_SEAL_FLAG,
  OP10M_HANDOFF_MANIFEST_COMMIT_FLAG,
} from './compute-turn-chunk-assembly-seal-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';
import { OP10M_TURN_COMPUTE_DIGEST_FLAG } from './types.ts';

export const OP10M_MODULE_MANIFEST_ANCHOR_FLAG = 'op10m_module_manifest_anchor';
export const OP10M_CHUNK_INLINE_READY_FLAG = 'op10m_chunk_inline_ready';

export interface ComputeTurnModuleManifestAnchorCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-seal pass: anchor module manifest when seal and handoff commit align with digest. */
export function evaluateComputeTurnModuleManifestAnchorCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnModuleManifestAnchorCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG];
    delete simulation.flags[OP10M_CHUNK_INLINE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const seal = simulation.flags[OP10M_CHUNK_ASSEMBLY_SEAL_FLAG];
  const commit = simulation.flags[OP10M_HANDOFF_MANIFEST_COMMIT_FLAG];
  const digest = simulation.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    seal !== undefined &&
    typeof commit === 'string' &&
    commit.length >= 4 &&
    typeof digest === 'string' &&
    digest.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG];
    delete simulation.flags[OP10M_CHUNK_INLINE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG] = day;
  simulation.flags[OP10M_CHUNK_INLINE_READY_FLAG] = digest;
  const applied = applyConsequenceMutation(simulation, narrative, 'module_manifest_anchor', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      moduleManifestAnchors: applied.narrative.telemetry.moduleManifestAnchors + 1,
      chunkInlineReadyPasses: applied.narrative.telemetry.chunkInlineReadyPasses + 1,
    },
  };
  log.push(`module manifest anchor d=${day} inline=${digest}`);

  return { simulation, narrative, log };
}
