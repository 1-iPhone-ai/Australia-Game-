import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG,
  OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG,
} from './compute-turn-scale-wave-dry-run-gate-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG = 'op10m_scale_wave_gate_closure_latch';
export const OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG = 'op10m_agent25_gate_closure_wave_ready';

export interface ComputeTurnScaleWaveGateClosureLatchCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-dry-run-gate pass: latch gate closure when dry-run gate and attestation align. */
export function evaluateComputeTurnScaleWaveGateClosureLatchCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveGateClosureLatchCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const dryRunGate = simulation.flags[OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG];
  const dryRunAttested = simulation.flags[OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    dryRunGate !== undefined &&
    typeof dryRunAttested === 'string' &&
    dryRunAttested.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG] = day;
  simulation.flags[OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG] = dryRunAttested;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_gate_closure_latch', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveGateClosureLatches: applied.narrative.telemetry.scaleWaveGateClosureLatches + 1,
      agent25GateClosureWaveReadyPasses:
        applied.narrative.telemetry.agent25GateClosureWaveReadyPasses + 1,
    },
  };
  log.push(`scale wave gate closure latch d=${day} wave=${dryRunAttested}`);

  return { simulation, narrative, log };
}
