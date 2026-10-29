import type {
  ResearchScaleWaveHandoffIntegrationOutlook,
  ResearchScaleWaveHandoffIntegrationSnapshot,
} from './types.ts';
import { RESEARCH_HANDOFF_INTEGRATION_BANDS } from './scale-wave-handoff-integration-band-log.ts';

/** Compact persisted digest of handoff integration at seal (round 29). */
export function computeHandoffIntegrationSnapshot(
  outlook: ResearchScaleWaveHandoffIntegrationOutlook,
  turn: number
): ResearchScaleWaveHandoffIntegrationSnapshot {
  const handoffIntegrationScore = Math.round(
    Math.min(100, Math.max(0, outlook.handoffIntegrationScore ?? 0))
  );
  const integrationMomentum = Math.round(Math.min(100, Math.max(0, outlook.integrationMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_HANDOFF_INTEGRATION_BANDS) {
    if (handoffIntegrationScore >= band) peakBand = band;
  }
  const payload = `t${turn}|i${handoffIntegrationScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    handoffIntegrationScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    integrationMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveHandoffIntegrationSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeHandoffIntegrationSnapshots(
  local: ResearchScaleWaveHandoffIntegrationSnapshot | undefined,
  remote: ResearchScaleWaveHandoffIntegrationSnapshot | undefined
): ResearchScaleWaveHandoffIntegrationSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
