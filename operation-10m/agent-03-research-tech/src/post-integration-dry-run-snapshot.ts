import type {
  ResearchScaleWavePostIntegrationDryRunOutlook,
  ResearchScaleWavePostIntegrationDryRunSnapshot,
} from './types.ts';
import { RESEARCH_POST_INTEGRATION_DRY_RUN_BANDS } from './post-integration-dry-run-band-log.ts';

/** Compact persisted digest of post-integration dry-run at seal (round 24). */
export function computePostIntegrationDryRunSnapshot(
  outlook: ResearchScaleWavePostIntegrationDryRunOutlook,
  turn: number
): ResearchScaleWavePostIntegrationDryRunSnapshot {
  const postIntegrationDryRunScore = Math.round(
    Math.min(100, Math.max(0, outlook.postIntegrationDryRunScore ?? 0))
  );
  const dryRunMomentum = Math.round(Math.min(100, Math.max(0, outlook.dryRunMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_POST_INTEGRATION_DRY_RUN_BANDS) {
    if (postIntegrationDryRunScore >= band) peakBand = band;
  }
  const payload = `t${turn}|p${postIntegrationDryRunScore}|h${outlook.horizonTurns}|w${outlook.waveOrdinal}|d${outlook.dryRunEligible ? 1 : 0}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    postIntegrationDryRunScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    dryRunMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWavePostIntegrationDryRunSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergePostIntegrationDryRunSnapshots(
  local: ResearchScaleWavePostIntegrationDryRunSnapshot | undefined,
  remote: ResearchScaleWavePostIntegrationDryRunSnapshot | undefined
): ResearchScaleWavePostIntegrationDryRunSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
