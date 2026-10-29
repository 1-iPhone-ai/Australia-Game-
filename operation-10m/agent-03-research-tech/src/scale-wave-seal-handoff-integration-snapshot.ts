import type {
  ResearchScaleWaveSealHandoffIntegrationOutlook,
  ResearchScaleWaveSealHandoffIntegrationSnapshot,
} from './types.ts';
import { RESEARCH_SEAL_HANDOFF_INTEGRATION_BANDS } from './scale-wave-seal-handoff-integration-band-log.ts';

/** Compact persisted digest of seal handoff integration (round 33). */
export function computeSealHandoffIntegrationSnapshot(
  outlook: ResearchScaleWaveSealHandoffIntegrationOutlook,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSnapshot {
  const sealHandoffIntegrationScore = Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffIntegrationScore ?? 0))
  );
  const integrationMomentum = Math.round(Math.min(100, Math.max(0, outlook.integrationMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_SEAL_HANDOFF_INTEGRATION_BANDS) {
    if (sealHandoffIntegrationScore >= band) peakBand = band;
  }
  const payload = `t${turn}|i${sealHandoffIntegrationScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    sealHandoffIntegrationScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    integrationMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveSealHandoffIntegrationSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeSealHandoffIntegrationSnapshots(
  local: ResearchScaleWaveSealHandoffIntegrationSnapshot | undefined,
  remote: ResearchScaleWaveSealHandoffIntegrationSnapshot | undefined
): ResearchScaleWaveSealHandoffIntegrationSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
