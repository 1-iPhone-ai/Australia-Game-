import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks } from './map-links.ts';
import { nrDashPrimaryMapHub } from './map-hub-index.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashRimCorridorSaturationShare {
  hubRegionId: string | null;
  rimLinkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on non-hub land corridors relative to the peak rim corridor. */
export function nrDashBuildRimCorridorSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashRimCorridorSaturationShare | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const adjacency = nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT);
  const rimLinks = adjacency.filter(l => l.fromId !== hubRegionId && l.toId !== hubRegionId);
  if (!rimLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = rimLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    hubRegionId,
    rimLinkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}
