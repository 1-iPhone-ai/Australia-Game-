import type { ResearchCommercializationReport, ResearchCommercializationSnapshot } from './types.ts';
import { RESEARCH_COMMERCIALIZATION_MILESTONES } from './commercialization-milestone-log.ts';

/** Compact persisted digest of commercialization posture at seal (round 10). */
export function computeCommercializationSnapshot(
  report: ResearchCommercializationReport,
  turn: number
): ResearchCommercializationSnapshot {
  const nationalExportScore = Math.round(Math.min(100, Math.max(0, report.nationalExportScore)));
  const highPriorityBranchCount = report.hints.filter(h => h.exportPriority === 'high').length;
  const mediumPriorityBranchCount = report.hints.filter(h => h.exportPriority === 'medium').length;
  let peakMilestone = 0;
  for (const milestone of RESEARCH_COMMERCIALIZATION_MILESTONES) {
    if (nationalExportScore >= milestone) peakMilestone = milestone;
  }
  const payload = `t${turn}|e${nationalExportScore}|h${highPriorityBranchCount}|m${mediumPriorityBranchCount}|a${report.active ? 1 : 0}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalExportScore,
    highPriorityBranchCount,
    mediumPriorityBranchCount,
    peakMilestone: peakMilestone as ResearchCommercializationSnapshot['peakMilestone'],
    digest: h.toString(36),
  };
}

export function mergeCommercializationSnapshots(
  local: ResearchCommercializationSnapshot | undefined,
  remote: ResearchCommercializationSnapshot | undefined
): ResearchCommercializationSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
