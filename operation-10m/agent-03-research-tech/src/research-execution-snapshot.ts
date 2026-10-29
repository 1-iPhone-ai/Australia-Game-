import type { ResearchExecutionOutlook, ResearchExecutionSnapshot } from './types.ts';
import { RESEARCH_EXECUTION_BANDS } from './research-execution-band-log.ts';

/** Compact persisted digest of research execution at seal (round 15). */
export function computeResearchExecutionSnapshot(
  outlook: ResearchExecutionOutlook,
  turn: number
): ResearchExecutionSnapshot {
  const nationalExecutionScore = Math.round(
    Math.min(100, Math.max(0, outlook.nationalExecutionScore ?? 0))
  );
  const projectedExecutionScore = Math.round(
    Math.min(100, Math.max(0, outlook.projectedExecutionScore ?? 0))
  );
  let peakBand = 0;
  for (const band of RESEARCH_EXECUTION_BANDS) {
    if (nationalExecutionScore >= band) peakBand = band;
  }
  const payload = `t${turn}|n${nationalExecutionScore}|p${projectedExecutionScore}|h${outlook.horizonTurns}|r${outlook.criticalRiskBranchCount}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalExecutionScore,
    projectedExecutionScore,
    horizonTurns: outlook.horizonTurns,
    criticalRiskBranchCount: outlook.criticalRiskBranchCount,
    peakBand: peakBand as ResearchExecutionSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeResearchExecutionSnapshots(
  local: ResearchExecutionSnapshot | undefined,
  remote: ResearchExecutionSnapshot | undefined
): ResearchExecutionSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
