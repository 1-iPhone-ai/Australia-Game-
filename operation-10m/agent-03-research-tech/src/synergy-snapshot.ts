import type { ResearchSynergyOutlook, ResearchSynergySnapshot } from './types.ts';
import { RESEARCH_SYNERGY_THRESHOLDS } from './synergy-threshold-log.ts';

/** Compact persisted digest of synergy posture at seal (round 9). */
export function computeSynergySnapshot(
  outlook: ResearchSynergyOutlook,
  turn: number
): ResearchSynergySnapshot {
  const currentSynergyScore = Math.round(Math.min(100, Math.max(0, outlook.currentSynergyScore)));
  const projectedSynergyScore = Math.round(Math.min(100, Math.max(0, outlook.projectedSynergyScore)));
  let peakThreshold = 0;
  for (const threshold of RESEARCH_SYNERGY_THRESHOLDS) {
    if (currentSynergyScore >= threshold) peakThreshold = threshold;
  }
  const payload = `t${turn}|c${currentSynergyScore}|p${projectedSynergyScore}|m${outlook.activeMultiBranchCount}|${outlook.dominantCapabilityCluster ?? 'none'}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    currentSynergyScore,
    projectedSynergyScore,
    activeMultiBranchCount: outlook.activeMultiBranchCount,
    peakThreshold: peakThreshold as ResearchSynergySnapshot['peakThreshold'],
    dominantCapabilityCluster: outlook.dominantCapabilityCluster,
    digest: h.toString(36),
  };
}

export function mergeSynergySnapshots(
  local: ResearchSynergySnapshot | undefined,
  remote: ResearchSynergySnapshot | undefined
): ResearchSynergySnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
