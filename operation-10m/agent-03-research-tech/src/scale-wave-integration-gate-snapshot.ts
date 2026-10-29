import type {
  ResearchScaleWaveIntegrationGateOutlook,
  ResearchScaleWaveIntegrationGateSnapshot,
} from './types.ts';
import { RESEARCH_INTEGRATION_GATE_BANDS } from './scale-wave-integration-gate-band-log.ts';

/** Compact persisted digest of integration gate at seal (round 21). */
export function computeIntegrationGateSnapshot(
  outlook: ResearchScaleWaveIntegrationGateOutlook,
  turn: number
): ResearchScaleWaveIntegrationGateSnapshot {
  const integrationGateScore = Math.round(
    Math.min(100, Math.max(0, outlook.integrationGateScore ?? 0))
  );
  const gateMomentum = Math.round(Math.min(100, Math.max(0, outlook.gateMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_INTEGRATION_GATE_BANDS) {
    if (integrationGateScore >= band) peakBand = band;
  }
  const payload = `t${turn}|g${integrationGateScore}|h${outlook.horizonTurns}|w${outlook.waveOrdinal}|m${gateMomentum}|d${outlook.dryRunEligible ? 1 : 0}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    integrationGateScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    gateMomentum,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveIntegrationGateSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeIntegrationGateSnapshots(
  local: ResearchScaleWaveIntegrationGateSnapshot | undefined,
  remote: ResearchScaleWaveIntegrationGateSnapshot | undefined
): ResearchScaleWaveIntegrationGateSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
