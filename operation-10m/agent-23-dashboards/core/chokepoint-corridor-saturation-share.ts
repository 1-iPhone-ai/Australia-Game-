import { nrDashBuildDependencyChokepoints } from './dependency-chokepoint.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashChokepointCorridorSaturationShare {
  chokepointCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean dependency chokepoint pulse blend relative to the hottest chokepoint corridor. */
export function nrDashBuildChokepointCorridorSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashChokepointCorridorSaturationShare | null {
  const rows = nrDashBuildDependencyChokepoints(ns);
  if (!rows.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = rows.map(row => {
    const consumer = pulseById.get(row.consumerRegionId) ?? 0;
    const provider = pulseById.get(row.providerRegionId) ?? 0;
    return (consumer + provider) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    chokepointCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}
