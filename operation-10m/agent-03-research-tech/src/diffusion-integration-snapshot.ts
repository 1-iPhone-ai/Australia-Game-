import type { RegionalDiffusionCell, ResearchDiffusionIntegrationSnapshot } from './types.ts';
import { RESEARCH_DIFFUSION_INTEGRATION_MILESTONES } from './diffusion-integration-log.ts';
import type { V94AustralianRegionCode } from './v94-ids.ts';

/** Compact persisted digest of national diffusion integration at seal (round 11). */
export function computeDiffusionIntegrationSnapshot(
  cells: RegionalDiffusionCell[],
  leadingResearchRegion: V94AustralianRegionCode | null,
  turn: number
): ResearchDiffusionIntegrationSnapshot {
  const integratedRegionCount = cells.filter(c => c.level === 'integrated').length;
  const adoptingRegionCount = cells.filter(c => c.level === 'adopting' || c.level === 'integrated').length;
  const meanDiffusionScore =
    cells.length > 0 ? Math.round((cells.reduce((s, c) => s + c.score, 0) / cells.length) * 1000) / 1000 : 0;
  let peakMilestone = 0;
  for (const milestone of RESEARCH_DIFFUSION_INTEGRATION_MILESTONES) {
    if (integratedRegionCount >= milestone) peakMilestone = milestone;
  }
  const payload = `t${turn}|i${integratedRegionCount}|a${adoptingRegionCount}|m${meanDiffusionScore}|${leadingResearchRegion ?? 'none'}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    integratedRegionCount,
    adoptingRegionCount,
    meanDiffusionScore,
    leadingResearchRegion,
    peakMilestone: peakMilestone as ResearchDiffusionIntegrationSnapshot['peakMilestone'],
    digest: h.toString(36),
  };
}

export function mergeDiffusionIntegrationSnapshots(
  local: ResearchDiffusionIntegrationSnapshot | undefined,
  remote: ResearchDiffusionIntegrationSnapshot | undefined
): ResearchDiffusionIntegrationSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
