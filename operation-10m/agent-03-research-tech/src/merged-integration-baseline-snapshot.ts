import type {
  ResearchMergedIntegrationBaselineOutlook,
  ResearchMergedIntegrationBaselineSnapshot,
} from './types.ts';
import { RESEARCH_MERGED_INTEGRATION_BASELINE_BANDS } from './merged-integration-baseline-band-log.ts';

/** Compact persisted digest of merged integration baseline at seal (round 23). */
export function computeMergedIntegrationBaselineSnapshot(
  outlook: ResearchMergedIntegrationBaselineOutlook,
  turn: number
): ResearchMergedIntegrationBaselineSnapshot {
  const mergedBaselineScore = Math.round(
    Math.min(100, Math.max(0, outlook.mergedBaselineScore ?? 0))
  );
  const mergeMomentum = Math.round(Math.min(100, Math.max(0, outlook.mergeMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_MERGED_INTEGRATION_BASELINE_BANDS) {
    if (mergedBaselineScore >= band) peakBand = band;
  }
  const payload = `t${turn}|m${mergedBaselineScore}|p${outlook.projectedFunctionalHint}|w${outlook.waveOrdinal}|d${outlook.dryRunEligible ? 1 : 0}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    mergedBaselineScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    mergeMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchMergedIntegrationBaselineSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeMergedIntegrationBaselineSnapshots(
  local: ResearchMergedIntegrationBaselineSnapshot | undefined,
  remote: ResearchMergedIntegrationBaselineSnapshot | undefined
): ResearchMergedIntegrationBaselineSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
