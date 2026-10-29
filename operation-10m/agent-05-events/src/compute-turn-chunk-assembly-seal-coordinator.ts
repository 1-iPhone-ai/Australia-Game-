import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG,
  OP10M_SYNC_MANIFEST_LATCH_FLAG,
} from './compute-turn-assembly-handoff-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_CHUNK_ASSEMBLY_SEAL_FLAG = 'op10m_chunk_assembly_seal';
export const OP10M_HANDOFF_MANIFEST_COMMIT_FLAG = 'op10m_handoff_manifest_commit';

export interface ComputeTurnChunkAssemblySealCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-handoff pass: seal chunk assembly when handoff wave and manifest latch align. */
export function evaluateComputeTurnChunkAssemblySealCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnChunkAssemblySealCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_CHUNK_ASSEMBLY_SEAL_FLAG];
    delete simulation.flags[OP10M_HANDOFF_MANIFEST_COMMIT_FLAG];
    return { simulation, narrative, log };
  }

  const handoffWave = simulation.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG];
  const manifestLatch = simulation.flags[OP10M_SYNC_MANIFEST_LATCH_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    handoffWave !== undefined &&
    typeof manifestLatch === 'string' &&
    manifestLatch.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_CHUNK_ASSEMBLY_SEAL_FLAG];
    delete simulation.flags[OP10M_HANDOFF_MANIFEST_COMMIT_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_CHUNK_ASSEMBLY_SEAL_FLAG] = day;
  simulation.flags[OP10M_HANDOFF_MANIFEST_COMMIT_FLAG] = manifestLatch;
  const applied = applyConsequenceMutation(simulation, narrative, 'chunk_assembly_seal', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      chunkAssemblySeals: applied.narrative.telemetry.chunkAssemblySeals + 1,
      handoffManifestCommits: applied.narrative.telemetry.handoffManifestCommits + 1,
    },
  };
  log.push(`chunk assembly seal d=${day} commit=${manifestLatch}`);

  return { simulation, narrative, log };
}
