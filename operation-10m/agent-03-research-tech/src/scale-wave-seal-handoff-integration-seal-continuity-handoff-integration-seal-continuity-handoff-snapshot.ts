import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot,
} from './types.ts';
import { RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-band-log.ts';

export function computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot {
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore = Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore ?? 0))
  );
  const handoffMomentum = Math.round(Math.min(100, Math.max(0, outlook.handoffMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS) {
    if (sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore >= band) peakBand = band;
  }
  const payload = `t${turn}|s${sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    handoffMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshots(
  local: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | undefined,
  remote: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | undefined
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
