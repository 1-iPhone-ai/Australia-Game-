import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_CLOSURE_SEAL_READY_FLAG,
  OP10M_INTEGRATION_SYNC_GATE_FLAG,
} from './compute-turn-integration-sync-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';
import { OP10M_TURN_COMPUTE_DIGEST_FLAG } from './types.ts';

export const OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG = 'op10m_assembly_handoff_wave';
export const OP10M_SYNC_MANIFEST_LATCH_FLAG = 'op10m_sync_manifest_latch';

export interface ComputeTurnAssemblyHandoffCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-sync pass: latch assembly handoff when sync gate and manifest digest align. */
export function evaluateComputeTurnAssemblyHandoffCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnAssemblyHandoffCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG];
    delete simulation.flags[OP10M_SYNC_MANIFEST_LATCH_FLAG];
    return { simulation, narrative, log };
  }

  const syncGate = simulation.flags[OP10M_INTEGRATION_SYNC_GATE_FLAG];
  const sealReady = simulation.flags[OP10M_CLOSURE_SEAL_READY_FLAG];
  const digest = simulation.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    syncGate !== undefined &&
    typeof sealReady === 'string' &&
    sealReady.length >= 4 &&
    typeof digest === 'string' &&
    digest.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG];
    delete simulation.flags[OP10M_SYNC_MANIFEST_LATCH_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG] = day;
  simulation.flags[OP10M_SYNC_MANIFEST_LATCH_FLAG] = digest;
  const applied = applyConsequenceMutation(simulation, narrative, 'assembly_handoff_wave', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      assemblyHandoffWaves: applied.narrative.telemetry.assemblyHandoffWaves + 1,
      syncManifestLatches: applied.narrative.telemetry.syncManifestLatches + 1,
    },
  };
  log.push(`assembly handoff wave d=${day} manifest=${digest}`);

  return { simulation, narrative, log };
}
