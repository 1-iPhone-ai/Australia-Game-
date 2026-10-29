import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NrDashMapLink, RegionMapNode } from '../types.ts';

export interface NrDashAdjacencyCorridorSaturationShare {
  linkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean adjacency-link pulse blend relative to the hottest land-adjacency corridor. */
export function nrDashBuildAdjacencyCorridorSaturationShare(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashAdjacencyCorridorSaturationShare | null {
  const adjLinks = links.filter(l => l.kind === 'adjacency');
  if (!adjLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = adjLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    linkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}
