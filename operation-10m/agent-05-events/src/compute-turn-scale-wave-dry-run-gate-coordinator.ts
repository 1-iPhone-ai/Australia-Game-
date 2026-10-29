import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG,
} from './compute-turn-scale-wave-projection-latch-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG = 'op10m_scale_wave_dry_run_gate';
export const OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG = 'op10m_agent25_dry_run_wave_attested';

export interface ComputeTurnScaleWaveDryRunGateCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-projection-latch pass: dry-run gate when projection latch and wave readiness align. */
export function evaluateComputeTurnScaleWaveDryRunGateCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveDryRunGateCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG];
    delete simulation.flags[OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG];
    return { simulation, narrative, log };
  }

  const projectionLatch = simulation.flags[OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG];
  const projectionReady = simulation.flags[OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    projectionLatch !== undefined &&
    typeof projectionReady === 'string' &&
    projectionReady.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG];
    delete simulation.flags[OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG] = day;
  simulation.flags[OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG] = projectionReady;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_dry_run_gate', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveDryRunGates: applied.narrative.telemetry.scaleWaveDryRunGates + 1,
      agent25DryRunWaveAttestedPasses:
        applied.narrative.telemetry.agent25DryRunWaveAttestedPasses + 1,
    },
  };
  log.push(`scale wave dry-run gate d=${day} attested=${projectionReady}`);

  return { simulation, narrative, log };
}
