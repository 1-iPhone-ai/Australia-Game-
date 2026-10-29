import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks } from './map-links.ts';
import { nrDashHottestBorderRegion } from './border-stress.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashAdjacencyMergedNationalChokepointBorderLinkSaturationShareWave72 {
  borderRegionId: string | null;
  adjacencyMergedNationalChokepointLinkCount: number;
  meanBlend: number;
  nationalPeakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on adjacency-only border links vs adjacency-link peak blend. */
export function nrDashBuildAdjacencyMergedNationalChokepointBorderLinkSaturationShareWave72(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashAdjacencyMergedNationalChokepointBorderLinkSaturationShareWave72 | null {
  const borderRegionId = nrDashHottestBorderRegion(ns);
  if (!borderRegionId || !ns) return null;
  const adjacency = nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT);
  if (!adjacency.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const allBlends = adjacency.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const nationalPeakBlend = Math.max(...allBlends);
  if (nationalPeakBlend <= 0) return null;
  const borderLinks = adjacency.filter(l => l.fromId === borderRegionId || l.toId === borderRegionId);
  if (!borderLinks.length) return null;
  const blends = borderLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    borderRegionId,
    adjacencyMergedNationalChokepointLinkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    nationalPeakBlend: Math.round(nationalPeakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / nationalPeakBlend) * 1000) / 1000,
  };
}
