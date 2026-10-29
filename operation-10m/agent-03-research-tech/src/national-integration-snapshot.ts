import type { ResearchNationalIntegrationOutlook, ResearchNationalIntegrationSnapshot } from './types.ts';
import { RESEARCH_NATIONAL_INTEGRATION_BANDS } from './national-integration-band-log.ts';

/** Compact persisted digest of national integration at seal (round 18). */
export function computeNationalIntegrationSnapshot(
  outlook: ResearchNationalIntegrationOutlook,
  turn: number
): ResearchNationalIntegrationSnapshot {
  const nationalIntegrationScore = Math.round(
    Math.min(100, Math.max(0, outlook.nationalIntegrationScore ?? 0))
  );
  const projectedIntegrationScore = Math.round(
    Math.min(100, Math.max(0, outlook.projectedIntegrationScore ?? 0))
  );
  const maturityMomentum = Math.round(Math.min(100, Math.max(0, outlook.maturityMomentum ?? 0)));
  const nationalIntegrationCount = Math.max(0, outlook.nationalIntegrationCount ?? 0);
  let peakBand = 0;
  for (const band of RESEARCH_NATIONAL_INTEGRATION_BANDS) {
    if (nationalIntegrationScore >= band) peakBand = band;
  }
  const payload = `t${turn}|n${nationalIntegrationScore}|p${projectedIntegrationScore}|h${outlook.horizonTurns}|m${maturityMomentum}|c${nationalIntegrationCount}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalIntegrationScore,
    projectedIntegrationScore,
    horizonTurns: outlook.horizonTurns,
    maturityMomentum,
    nationalIntegrationCount,
    peakBand: peakBand as ResearchNationalIntegrationSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeNationalIntegrationSnapshots(
  local: ResearchNationalIntegrationSnapshot | undefined,
  remote: ResearchNationalIntegrationSnapshot | undefined
): ResearchNationalIntegrationSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
