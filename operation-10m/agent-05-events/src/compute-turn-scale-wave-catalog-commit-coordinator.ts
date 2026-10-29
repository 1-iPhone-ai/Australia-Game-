import { applyConsequenceMutation } from './consequence-applier.ts';
import { countPendingResponses, OP10M_PENDING_BACKLOG_FLAG } from './pending-response-orchestrator.ts';
import {
  OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG,
} from './compute-turn-scale-wave-bundle-latch-coordinator.ts';
import type { Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG = 'op10m_scale_wave_catalog_commit';
export const OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG = 'op10m_agent25_bundle_catalog_sealed';

export interface ComputeTurnScaleWaveCatalogCommitCoordinationResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

/** Post-latch pass: commit scale-wave catalog when bundle latch and assembly wave align. */
export function evaluateComputeTurnScaleWaveCatalogCommitCoordination(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  day: number
): ComputeTurnScaleWaveCatalogCommitCoordinationResult {
  let simulation = { ...simulationIn, flags: { ...simulationIn.flags } };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const pendingCount = countPendingResponses(narrative);
  const hasBacklog = !!simulation.flags[OP10M_PENDING_BACKLOG_FLAG];

  if (hasBacklog || pendingCount >= 3) {
    delete simulation.flags[OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  const bundleLatch = simulation.flags[OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG];
  const assemblyWave = simulation.flags[OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG];

  const eligible =
    pendingCount === 0 &&
    !hasBacklog &&
    bundleLatch !== undefined &&
    typeof assemblyWave === 'string' &&
    assemblyWave.length >= 4;

  if (!eligible) {
    delete simulation.flags[OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG];
    delete simulation.flags[OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG];
    return { simulation, narrative, log };
  }

  simulation.flags[OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG] = day;
  simulation.flags[OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG] = assemblyWave;
  const applied = applyConsequenceMutation(simulation, narrative, 'scale_wave_catalog_commit', {
    stabilityDelta: 1,
  });
  simulation = applied.simulation;
  narrative = {
    ...applied.narrative,
    telemetry: {
      ...applied.narrative.telemetry,
      scaleWaveCatalogCommits: applied.narrative.telemetry.scaleWaveCatalogCommits + 1,
      agent25BundleCatalogSealedPasses: applied.narrative.telemetry.agent25BundleCatalogSealedPasses + 1,
    },
  };
  log.push(`scale wave catalog commit d=${day} sealed=${assemblyWave}`);

  return { simulation, narrative, log };
}
