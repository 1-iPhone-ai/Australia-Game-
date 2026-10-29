import type { ResearchScaleWaveReport, ResearchScaleWaveSnapshot } from './types.ts';

/** Compact persisted digest of scale-wave posture at seal (round 8). */
export function computeScaleWaveSnapshot(
  report: ResearchScaleWaveReport | null,
  turn: number
): ResearchScaleWaveSnapshot | null {
  if (!report) return null;
  const tier5UnlockCount = report.tier5UnlockCount;
  const crossBranchSynergyScore = report.crossBranchSynergyScore;
  const transferLinkCount = report.technologyTransferLinks.length;
  const payload = `t${turn}|5:${tier5UnlockCount}|sy:${crossBranchSynergyScore}|xl:${transferLinkCount}|${report.dominantCapabilityCluster ?? 'none'}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    tier5UnlockCount,
    crossBranchSynergyScore,
    transferLinkCount,
    dominantCapabilityCluster: report.dominantCapabilityCluster,
    digest: h.toString(36),
  };
}

export function mergeScaleWaveSnapshots(
  local: ResearchScaleWaveSnapshot | undefined,
  remote: ResearchScaleWaveSnapshot | undefined
): ResearchScaleWaveSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
