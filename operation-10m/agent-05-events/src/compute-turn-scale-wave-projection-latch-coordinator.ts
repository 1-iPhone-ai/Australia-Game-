import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG,
  OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG,
} from './compute-turn-scale-wave-origin-gate-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG = 'op10m_scale_wave_projection_latch';
export const OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG = 'op10m_agent25_projection_wave_ready';

export interface ComputeTurnScaleWaveProjectionLatchCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-origin-gate pass: latch projection wave when origin gate and attestation align. */
export function evaluateComputeTurnScaleWaveProjectionLatchCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveProjectionLatchCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const originGate = simulation.flags[OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG];
  const originAttested = simulation.flags[OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    originGate !== undefined &&
    typeof originAttested === 'string' &&
    originAttested.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG] = day;
  simulation.flags[OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG] = originAttested;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_projection_latch', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveProjectionLatches: applied.narrative.telemetry.scaleWaveProjectionLatches + 1,
      agent25ProjectionWaveReadyPasses:
        applied.narrative.telemetry.agent25ProjectionWaveReadyPasses + 1,
    },
  };
  log.push(`scale wave projection latch d=${day} wave=${originAttested}`);

  return { simulation, narrative, log };
}
