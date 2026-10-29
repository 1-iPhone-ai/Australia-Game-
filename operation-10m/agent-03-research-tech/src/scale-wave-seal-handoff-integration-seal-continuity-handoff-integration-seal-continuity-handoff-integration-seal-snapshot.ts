import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
} from './types.ts';
import { RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-band-log.ts';

export function computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot {
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore = Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore ?? 0))
  );
  const sealMomentum = Math.round(Math.min(100, Math.max(0, outlook.sealMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS) {
    if (sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore >= band) peakBand = band;
  }
  const payload = `t${turn}|s${sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    sealMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshots(
  local: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | undefined,
  remote: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | undefined
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
