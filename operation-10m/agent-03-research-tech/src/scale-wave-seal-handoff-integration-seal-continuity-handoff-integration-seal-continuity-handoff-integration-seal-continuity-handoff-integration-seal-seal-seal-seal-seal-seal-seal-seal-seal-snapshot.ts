import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSnapshot,
} from './types.ts';
import { RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts';

export function computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSnapshot(
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSnapshot {
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore = Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore ?? 0))
  );
  const integrationSealSealSealSealSealSealSealSealSealMomentum = Math.round(Math.min(100, Math.max(0, outlook.integrationSealSealSealSealSealSealSealSealSealMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS) {
    if (sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore >= band) peakBand = band;
  }
  const payload = `t${turn}|s${sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    integrationSealSealSealSealSealSealSealSealSealMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSnapshots(
  local: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSnapshot | undefined,
  remote: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSnapshot | undefined
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
