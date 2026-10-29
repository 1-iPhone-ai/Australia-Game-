import type {
  ResearchScaleWaveIntegrationSealOutlook,
  ResearchScaleWaveIntegrationSealSnapshot,
} from './types.ts';
import { RESEARCH_INTEGRATION_SEAL_BANDS } from './scale-wave-integration-seal-band-log.ts';

/** Compact persisted digest of integration seal at seal (round 25). */
export function computeIntegrationSealSnapshot(
  outlook: ResearchScaleWaveIntegrationSealOutlook,
  turn: number
): ResearchScaleWaveIntegrationSealSnapshot {
  const integrationSealScore = Math.round(
    Math.min(100, Math.max(0, outlook.integrationSealScore ?? 0))
  );
  const sealMomentum = Math.round(Math.min(100, Math.max(0, outlook.sealMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_INTEGRATION_SEAL_BANDS) {
    if (integrationSealScore >= band) peakBand = band;
  }
  const payload = `t${turn}|s${integrationSealScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}|d${outlook.dryRunEligible ? 1 : 0}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    integrationSealScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    sealMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveIntegrationSealSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeIntegrationSealSnapshots(
  local: ResearchScaleWaveIntegrationSealSnapshot | undefined,
  remote: ResearchScaleWaveIntegrationSealSnapshot | undefined
): ResearchScaleWaveIntegrationSealSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
