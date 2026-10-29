import type {
  ResearchScaleWaveIntegrationSealHandoffOutlook,
  ResearchScaleWaveIntegrationSealHandoffSnapshot,
} from './types.ts';
import { RESEARCH_INTEGRATION_SEAL_HANDOFF_BANDS } from './scale-wave-integration-seal-handoff-band-log.ts';

/** Compact persisted digest of integration seal handoff (round 31). */
export function computeIntegrationSealHandoffSnapshot(
  outlook: ResearchScaleWaveIntegrationSealHandoffOutlook,
  turn: number
): ResearchScaleWaveIntegrationSealHandoffSnapshot {
  const integrationSealHandoffScore = Math.round(
    Math.min(100, Math.max(0, outlook.integrationSealHandoffScore ?? 0))
  );
  const handoffMomentum = Math.round(Math.min(100, Math.max(0, outlook.handoffMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_INTEGRATION_SEAL_HANDOFF_BANDS) {
    if (integrationSealHandoffScore >= band) peakBand = band;
  }
  const payload = `t${turn}|h${integrationSealHandoffScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    integrationSealHandoffScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    handoffMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveIntegrationSealHandoffSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeIntegrationSealHandoffSnapshots(
  local: ResearchScaleWaveIntegrationSealHandoffSnapshot | undefined,
  remote: ResearchScaleWaveIntegrationSealHandoffSnapshot | undefined
): ResearchScaleWaveIntegrationSealHandoffSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
