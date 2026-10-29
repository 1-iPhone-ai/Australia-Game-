import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG,
  OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG,
} from './compute-turn-scale-wave-catalog-commit-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG = 'op10m_scale_wave_origin_gate';
export const OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG = 'op10m_agent25_origin_wave_attested';

export interface ComputeTurnScaleWaveOriginGateCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-commit pass: origin-gate scale wave when catalog commit and bundle catalog seal align. */
export function evaluateComputeTurnScaleWaveOriginGateCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveOriginGateCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG];
    delete simulation.flags[OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG];
    return { simulation, narrative, log };
  }

  const catalogCommit = simulation.flags[OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG];
  const bundleSealed = simulation.flags[OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    catalogCommit !== undefined &&
    typeof bundleSealed === 'string' &&
    bundleSealed.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG];
    delete simulation.flags[OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG] = day;
  simulation.flags[OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG] = bundleSealed;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_origin_gate', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveOriginGates: applied.narrative.telemetry.scaleWaveOriginGates + 1,
      agent25OriginWaveAttestedPasses:
        applied.narrative.telemetry.agent25OriginWaveAttestedPasses + 1,
    },
  };
  log.push(`scale wave origin gate d=${day} attested=${bundleSealed}`);

  return { simulation, narrative, log };
}
