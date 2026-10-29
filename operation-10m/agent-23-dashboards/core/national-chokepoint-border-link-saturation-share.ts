import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashHottestBorderRegion } from './border-stress.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashNationalChokepointBorderLinkSaturationShare {
  borderRegionId: string | null;
  nationalChokepointLinkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on merged adjacency and dependency links at the hottest border relative to peak blend. */
export function nrDashBuildNationalChokepointBorderLinkSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashNationalChokepointBorderLinkSaturationShare | null {
  const borderRegionId = nrDashHottestBorderRegion(ns);
  if (!borderRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const links = merged.filter(l => l.fromId === borderRegionId || l.toId === borderRegionId);
  if (!links.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = links.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    borderRegionId,
    nationalChokepointLinkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}
