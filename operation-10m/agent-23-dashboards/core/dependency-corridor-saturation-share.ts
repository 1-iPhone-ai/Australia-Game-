import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NrDashMapLink, RegionMapNode } from '../types.ts';

export interface NrDashDependencyCorridorSaturationShare {
  linkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean dependency-link pulse blend relative to the hottest dependency corridor. */
export function nrDashBuildDependencyCorridorSaturationShare(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashDependencyCorridorSaturationShare | null {
  const depLinks = links.filter(l => l.kind === 'dependency');
  if (!depLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = depLinks.map(link => {
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
