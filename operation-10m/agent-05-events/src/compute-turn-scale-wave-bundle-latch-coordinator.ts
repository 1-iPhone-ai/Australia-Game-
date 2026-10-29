import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_CHUNK_MANIFEST_SEALED_FLAG,
  OP10M_POST_CRISIS_SLOT_COMMIT_FLAG,
} from './compute-turn-post-crisis-slot-commit-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG = 'op10m_scale_wave_bundle_latch';
export const OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG = 'op10m_agent25_assembly_wave_ready';

export interface ComputeTurnScaleWaveBundleLatchCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-commit pass: latch scale-wave bundle when slot commit and manifest seal align. */
export function evaluateComputeTurnScaleWaveBundleLatchCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveBundleLatchCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  const slotCommit = simulation.flags[OP10M_POST_CRISIS_SLOT_COMMIT_FLAG];
  const manifestSealed = simulation.flags[OP10M_CHUNK_MANIFEST_SEALED_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    slotCommit !== undefined &&
    typeof manifestSealed === 'string' &&
    manifestSealed.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG];
    delete simulation.flags[OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG] = day;
  simulation.flags[OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG] = manifestSealed;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_bundle_latch', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveBundleLatches: applied.narrative.telemetry.scaleWaveBundleLatches + 1,
      agent25AssemblyWaveReadyPasses: applied.narrative.telemetry.agent25AssemblyWaveReadyPasses + 1,
    },
  };
  log.push(`scale wave bundle latch d=${day} wave=${manifestSealed}`);

  return { simulation, narrative, log };
}
