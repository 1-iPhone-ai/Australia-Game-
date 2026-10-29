import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot,
} from './types.ts';
import { RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BANDS } from './scale-wave-seal-handoff-integration-seal-continuity-band-log.ts';

/** Compact persisted digest of seal handoff integration seal continuity (round 35). */
export function computeSealHandoffIntegrationSealContinuitySnapshot(
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot {
  const sealHandoffIntegrationSealContinuityScore = Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityScore ?? 0))
  );
  const continuityMomentum = Math.round(Math.min(100, Math.max(0, outlook.continuityMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BANDS) {
    if (sealHandoffIntegrationSealContinuityScore >= band) peakBand = band;
  }
  const payload = `t${turn}|c${sealHandoffIntegrationSealContinuityScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    sealHandoffIntegrationSealContinuityScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    continuityMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeSealHandoffIntegrationSealContinuitySnapshots(
  local: ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot | undefined,
  remote: ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot | undefined
): ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
