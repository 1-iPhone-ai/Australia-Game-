import type {
  ResearchScaleWaveHandoffIntegrationSealOutlook,
  ResearchScaleWaveHandoffIntegrationSealSnapshot,
} from './types.ts';
import { RESEARCH_HANDOFF_INTEGRATION_SEAL_BANDS } from './scale-wave-handoff-integration-seal-band-log.ts';

/** Compact persisted digest of handoff integration seal (round 30). */
export function computeHandoffIntegrationSealSnapshot(
  outlook: ResearchScaleWaveHandoffIntegrationSealOutlook,
  turn: number
): ResearchScaleWaveHandoffIntegrationSealSnapshot {
  const handoffIntegrationSealScore = Math.round(
    Math.min(100, Math.max(0, outlook.handoffIntegrationSealScore ?? 0))
  );
  const sealMomentum = Math.round(Math.min(100, Math.max(0, outlook.sealMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_HANDOFF_INTEGRATION_SEAL_BANDS) {
    if (handoffIntegrationSealScore >= band) peakBand = band;
  }
  const payload = `t${turn}|s${handoffIntegrationSealScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    handoffIntegrationSealScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    sealMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveHandoffIntegrationSealSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeHandoffIntegrationSealSnapshots(
  local: ResearchScaleWaveHandoffIntegrationSealSnapshot | undefined,
  remote: ResearchScaleWaveHandoffIntegrationSealSnapshot | undefined
): ResearchScaleWaveHandoffIntegrationSealSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
