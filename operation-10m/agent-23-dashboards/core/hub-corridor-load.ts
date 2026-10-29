import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashEnrichMapLinkStress } from './link-stress.ts';
import { nrDashPrimaryMapHub } from './map-hub-index.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashHubCorridorLoad {
  hubRegionId: string | null;
  touchingLinkCount: number;
  meanLinkStress: number;
  peakLinkStress: number;
  peakLinkLabel: string | null;
}

/** Aggregate map link stress touching the primary connectivity hub. */
export function nrDashBuildHubCorridorLoad(ns: NationalSystemsState | null): NrDashHubCorridorLoad | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const stressed = nrDashEnrichMapLinkStress(merged, ns);
  const touching = stressed.filter(l => l.fromId === hubRegionId || l.toId === hubRegionId);
  if (!touching.length) {
    return {
      hubRegionId,
      touchingLinkCount: 0,
      meanLinkStress: 0,
      peakLinkStress: 0,
      peakLinkLabel: null,
    };
  }
  const levels = touching.map(l => l.stressLevel ?? 0);
  const meanLinkStress = levels.reduce((s, v) => s + v, 0) / levels.length;
  const peak = touching.reduce((best, l) => ((l.stressLevel ?? 0) > (best.stressLevel ?? 0) ? l : best));
  return {
    hubRegionId,
    touchingLinkCount: touching.length,
    meanLinkStress: Math.round(meanLinkStress * 1000) / 1000,
    peakLinkStress: Math.round((peak.stressLevel ?? 0) * 1000) / 1000,
    peakLinkLabel: peak.label,
  };
}
