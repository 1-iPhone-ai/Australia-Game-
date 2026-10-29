import type {
  ResearchScaleWaveSealHandoffIntegrationSealOutlook,
  ResearchScaleWaveSealHandoffIntegrationSealSnapshot,
} from './types.ts';
import { RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_BANDS } from './scale-wave-seal-handoff-integration-seal-band-log.ts';

/** Compact persisted digest of seal handoff integration seal (round 34). */
export function computeSealHandoffIntegrationSealSnapshot(
  outlook: ResearchScaleWaveSealHandoffIntegrationSealOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealSnapshot {
  const sealHandoffIntegrationSealScore = Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationSealScore ?? 0))
  );
  const sealMomentum = Math.round(Math.min(100, Math.max(0, outlook.sealMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_BANDS) {
    if (sealHandoffIntegrationSealScore >= band) peakBand = band;
  }
  const payload = `t${turn}|s${sealHandoffIntegrationSealScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    sealHandoffIntegrationSealScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    sealMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveSealHandoffIntegrationSealSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeSealHandoffIntegrationSealSnapshots(
  local: ResearchScaleWaveSealHandoffIntegrationSealSnapshot | undefined,
  remote: ResearchScaleWaveSealHandoffIntegrationSealSnapshot | undefined
): ResearchScaleWaveSealHandoffIntegrationSealSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
