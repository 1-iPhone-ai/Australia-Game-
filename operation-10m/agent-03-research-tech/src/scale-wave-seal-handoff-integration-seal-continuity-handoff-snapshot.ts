import type {
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot,
} from './types.ts';
import { RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-band-log.ts';

/** Compact persisted digest of seal handoff integration seal continuity handoff (round 36). */
export function computeSealHandoffIntegrationSealContinuityHandoffSnapshot(
  outlook: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot {
  const sealHandoffIntegrationSealContinuityHandoffScore = Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealContinuityHandoffScore ?? 0))
  );
  const handoffMomentum = Math.round(Math.min(100, Math.max(0, outlook.handoffMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BANDS) {
    if (sealHandoffIntegrationSealContinuityHandoffScore >= band) peakBand = band;
  }
  const payload = `t${turn}|h${sealHandoffIntegrationSealContinuityHandoffScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    sealHandoffIntegrationSealContinuityHandoffScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    handoffMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeSealHandoffIntegrationSealContinuityHandoffSnapshots(
  local: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot | undefined,
  remote: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot | undefined
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
