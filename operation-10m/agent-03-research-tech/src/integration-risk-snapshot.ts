import type { ResearchIntegrationRiskOutlook, ResearchIntegrationRiskSnapshot } from './types.ts';
import { RESEARCH_INTEGRATION_RISK_BANDS } from './integration-risk-log.ts';

/** Compact persisted digest of integration risk for replay / merge guards (round 8). */
export function computeIntegrationRiskSnapshot(
  outlook: ResearchIntegrationRiskOutlook,
  turn: number
): ResearchIntegrationRiskSnapshot {
  const nationalRiskScore = Math.round(Math.min(100, Math.max(0, outlook.nationalRiskScore)));
  let peakRiskBand = 0;
  for (const band of RESEARCH_INTEGRATION_RISK_BANDS) {
    if (nationalRiskScore >= band) peakRiskBand = band;
  }
  const payload = `t${turn}|s${nationalRiskScore}|c${outlook.criticalBranchCount}|l${outlook.links.length}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalRiskScore,
    criticalBranchCount: outlook.criticalBranchCount,
    peakRiskBand: peakRiskBand as ResearchIntegrationRiskSnapshot['peakRiskBand'],
    digest: h.toString(36),
  };
}

export function mergeIntegrationRiskSnapshots(
  local: ResearchIntegrationRiskSnapshot | undefined,
  remote: ResearchIntegrationRiskSnapshot | undefined
): ResearchIntegrationRiskSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
