import type { ResearchTrancheProjectionReadinessOutlook, ResearchTrancheProjectionSnapshot } from './types.ts';
import { RESEARCH_TRANCHE_PROJECTION_BANDS } from './tranche-projection-band-log.ts';

/** Compact persisted digest of tranche projection readiness at seal (round 20). */
export function computeTrancheProjectionSnapshot(
  outlook: ResearchTrancheProjectionReadinessOutlook,
  turn: number
): ResearchTrancheProjectionSnapshot {
  const trancheReadinessScore = Math.round(
    Math.min(100, Math.max(0, outlook.trancheReadinessScore ?? 0))
  );
  const projectionMomentum = Math.round(Math.min(100, Math.max(0, outlook.projectionMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_TRANCHE_PROJECTION_BANDS) {
    if (trancheReadinessScore >= band) peakBand = band;
  }
  const payload = `t${turn}|r${trancheReadinessScore}|h${outlook.horizonTurns}|w${outlook.waveOrdinal}|m${projectionMomentum}|d${outlook.dryRunEligible ? 1 : 0}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    trancheReadinessScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    projectionMomentum,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchTrancheProjectionSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeTrancheProjectionSnapshots(
  local: ResearchTrancheProjectionSnapshot | undefined,
  remote: ResearchTrancheProjectionSnapshot | undefined
): ResearchTrancheProjectionSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
