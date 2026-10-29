import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot,
} from './types.ts';
import { RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BANDS } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-band-log.ts';

export function computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot {
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore = Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore ?? 0))
  );
  const continuityMomentum = Math.round(Math.min(100, Math.max(0, outlook.continuityMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BANDS) {
    if (sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore >= band) peakBand = band;
  }
  const payload = `t${turn}|s${sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    continuityMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshots(
  local: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot | undefined,
  remote: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot | undefined
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
