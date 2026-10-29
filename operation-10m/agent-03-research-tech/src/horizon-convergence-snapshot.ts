import type { ResearchHorizonConvergenceOutlook, ResearchHorizonConvergenceSnapshot } from './types.ts';
import { RESEARCH_HORIZON_CONVERGENCE_BANDS } from './horizon-convergence-band-log.ts';

/** Compact persisted digest of horizon convergence at seal (round 14). */
export function computeHorizonConvergenceSnapshot(
  outlook: ResearchHorizonConvergenceOutlook,
  turn: number
): ResearchHorizonConvergenceSnapshot {
  const nationalConvergenceScore = Math.round(
    Math.min(100, Math.max(0, outlook.nationalConvergenceScore ?? 0))
  );
  const projectedConvergenceScore = Math.round(
    Math.min(100, Math.max(0, outlook.projectedConvergenceScore ?? 0))
  );
  let peakBand = 0;
  for (const band of RESEARCH_HORIZON_CONVERGENCE_BANDS) {
    if (nationalConvergenceScore >= band) peakBand = band;
  }
  const payload = `t${turn}|n${nationalConvergenceScore}|p${projectedConvergenceScore}|h${outlook.horizonTurns}|${outlook.peakRegionId ?? 'none'}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalConvergenceScore,
    projectedConvergenceScore,
    horizonTurns: outlook.horizonTurns,
    peakRegionId: outlook.peakRegionId,
    peakBand: peakBand as ResearchHorizonConvergenceSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeHorizonConvergenceSnapshots(
  local: ResearchHorizonConvergenceSnapshot | undefined,
  remote: ResearchHorizonConvergenceSnapshot | undefined
): ResearchHorizonConvergenceSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
