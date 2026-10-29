import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashPrimaryMapHub } from './map-hub-index.ts';
import { nrDashHottestBorderRegion } from './border-stress.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashRimNationalChokepointBorderLinkSaturationShare {
  borderRegionId: string | null;
  hubRegionId: string | null;
  rimNationalChokepointLinkCount: number;
  meanBlend: number;
  nationalPeakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on rim border merged links relative to the national merged-link peak blend. */
export function nrDashBuildRimNationalChokepointBorderLinkSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashRimNationalChokepointBorderLinkSaturationShare | null {
  const borderRegionId = nrDashHottestBorderRegion(ns);
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!borderRegionId || !hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  if (!merged.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const allBlends = merged.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const nationalPeakBlend = Math.max(...allBlends);
  if (nationalPeakBlend <= 0) return null;
  const rimLinks = merged.filter(
    l =>
      (l.fromId === borderRegionId || l.toId === borderRegionId) &&
      l.fromId !== hubRegionId &&
      l.toId !== hubRegionId
  );
  if (!rimLinks.length) return null;
  const rimBlends = rimLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const meanBlend = rimBlends.reduce((s, v) => s + v, 0) / rimBlends.length;
  return {
    borderRegionId,
    hubRegionId,
    rimNationalChokepointLinkCount: rimBlends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    nationalPeakBlend: Math.round(nationalPeakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / nationalPeakBlend) * 1000) / 1000,
  };
}
