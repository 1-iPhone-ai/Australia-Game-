import type {
  ResearchScaleWaveIntegrationContinuityOutlook,
  ResearchScaleWaveIntegrationContinuitySnapshot,
} from './types.ts';
import { RESEARCH_INTEGRATION_CONTINUITY_BANDS } from './scale-wave-integration-continuity-band-log.ts';

/** Compact persisted digest of integration continuity at seal (round 27). */
export function computeIntegrationContinuitySnapshot(
  outlook: ResearchScaleWaveIntegrationContinuityOutlook,
  turn: number
): ResearchScaleWaveIntegrationContinuitySnapshot {
  const integrationContinuityScore = Math.round(
    Math.min(100, Math.max(0, outlook.integrationContinuityScore ?? 0))
  );
  const continuityMomentum = Math.round(Math.min(100, Math.max(0, outlook.continuityMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_INTEGRATION_CONTINUITY_BANDS) {
    if (integrationContinuityScore >= band) peakBand = band;
  }
  const payload = `t${turn}|c${integrationContinuityScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    integrationContinuityScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    continuityMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveIntegrationContinuitySnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeIntegrationContinuitySnapshots(
  local: ResearchScaleWaveIntegrationContinuitySnapshot | undefined,
  remote: ResearchScaleWaveIntegrationContinuitySnapshot | undefined
): ResearchScaleWaveIntegrationContinuitySnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
