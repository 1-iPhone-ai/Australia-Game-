import { applyConsequenceMutation } from './consequence-applier.ts';
import { OP10M_COMPUTE_DRIFT_SETTLED_FLAG } from './compute-turn-drift-settle.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_DIGEST_CLOSURE_LATCH_FLAG,
  OP10M_STABILIZATION_CLOSURE_WAVE_FLAG,
} from './pending-stabilization-closure-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_INTEGRATION_SYNC_GATE_FLAG = 'op10m_integration_sync_gate';
export const OP10M_CLOSURE_SEAL_READY_FLAG = 'op10m_closure_seal_ready';

export interface ComputeTurnIntegrationSyncCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-closure pass: open integration sync gate when closure latch and drift settle align. */
export function evaluateComputeTurnIntegrationSyncCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnIntegrationSyncCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_INTEGRATION_SYNC_GATE_FLAG];
    delete simulation.flags[OP10M_CLOSURE_SEAL_READY_FLAG];
    return { simulation, narrative, log };
  }

  const closureWave = simulation.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG];
  const digestLatch = simulation.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG];
  const driftSettled = !!simulation.flags[OP10M_COMPUTE_DRIFT_SETTLED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    closureWave !== undefined &&
    typeof digestLatch === 'string' &&
    digestLatch.length >= 4 &&
    driftSettled;

  if (!eligible) {
    delete simulation.flags[OP10M_INTEGRATION_SYNC_GATE_FLAG];
    delete simulation.flags[OP10M_CLOSURE_SEAL_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_INTEGRATION_SYNC_GATE_FLAG] = day;
  simulation.flags[OP10M_CLOSURE_SEAL_READY_FLAG] = digestLatch;
  const applied = applyConsequenceMutation(simulation, narrative, 'integration_sync_gate', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      integrationSyncGates: applied.narrative.telemetry.integrationSyncGates + 1,
      closureSealReadyPasses: applied.narrative.telemetry.closureSealReadyPasses + 1,
    },
  };
  log.push(`integration sync gate d=${day} seal=${digestLatch}`);

  return { simulation, narrative, log };
}
