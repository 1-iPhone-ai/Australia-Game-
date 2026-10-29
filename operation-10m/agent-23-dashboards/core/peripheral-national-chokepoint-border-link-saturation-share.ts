import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashTopPeripheralRegions } from './peripheral-isolation.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashPeripheralNationalChokepointBorderLinkSaturationShare {
  peripheralRegionCount: number;
  peripheralNationalChokepointLinkCount: number;
  meanBlend: number;
  nationalPeakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on merged links touching peripheral regions vs national peak blend. */
export function nrDashBuildPeripheralNationalChokepointBorderLinkSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashPeripheralNationalChokepointBorderLinkSaturationShare | null {
  if (!ns) return null;
  const peripheralIds = new Set(nrDashTopPeripheralRegions(ns, 4).map(r => r.regionId));
  if (!peripheralIds.size) return null;
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
  const peripheralLinks = merged.filter(l => peripheralIds.has(l.fromId) || peripheralIds.has(l.toId));
  if (!peripheralLinks.length) return null;
  const peripheralBlends = peripheralLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const meanBlend = peripheralBlends.reduce((s, v) => s + v, 0) / peripheralBlends.length;
  return {
    peripheralRegionCount: peripheralIds.size,
    peripheralNationalChokepointLinkCount: peripheralBlends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    nationalPeakBlend: Math.round(nationalPeakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / nationalPeakBlend) * 1000) / 1000,
  };
}
