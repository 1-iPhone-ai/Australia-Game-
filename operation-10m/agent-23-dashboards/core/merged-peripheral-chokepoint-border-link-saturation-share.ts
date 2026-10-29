import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashPrimaryMapHub } from './map-hub-index.ts';
import { nrDashHottestBorderRegion } from './border-stress.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashMergedPeripheralChokepointBorderLinkSaturationShare {
  borderRegionId: string | null;
  hubRegionId: string | null;
  mergedPeripheralChokepointLinkCount: number;
  meanBlend: number;
  borderPeakBlend: number;
  saturationShare: number;
}

/** Mean peripheral border link pulse blend relative to peak blend on all merged border links. */
export function nrDashBuildMergedPeripheralChokepointBorderLinkSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashMergedPeripheralChokepointBorderLinkSaturationShare | null {
  const borderRegionId = nrDashHottestBorderRegion(ns);
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!borderRegionId || !hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const borderLinks = merged.filter(l => l.fromId === borderRegionId || l.toId === borderRegionId);
  if (!borderLinks.length) return null;
  const peripheralLinks = merged.filter(
    l =>
      (l.fromId === borderRegionId && l.toId !== hubRegionId) ||
      (l.toId === borderRegionId && l.fromId !== hubRegionId)
  );
  if (!peripheralLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blendFor = (link: (typeof merged)[number]) => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  };
  const borderBlends = borderLinks.map(blendFor);
  const borderPeakBlend = Math.max(...borderBlends);
  if (borderPeakBlend <= 0) return null;
  const peripheralBlends = peripheralLinks.map(blendFor);
  const meanBlend = peripheralBlends.reduce((s, v) => s + v, 0) / peripheralBlends.length;
  return {
    borderRegionId,
    hubRegionId,
    mergedPeripheralChokepointLinkCount: peripheralLinks.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    borderPeakBlend: Math.round(borderPeakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / borderPeakBlend) * 1000) / 1000,
  };
}
