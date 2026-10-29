import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashPrimaryMapHub } from './map-hub-index.ts';
import { nrDashHottestBorderRegion } from './border-stress.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashPeripheralChokepointBorderLinkSaturationShare {
  borderRegionId: string | null;
  hubRegionId: string | null;
  peripheralChokepointLinkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on hottest-border merged links whose far endpoint is not the primary hub. */
export function nrDashBuildPeripheralChokepointBorderLinkSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashPeripheralChokepointBorderLinkSaturationShare | null {
  const borderRegionId = nrDashHottestBorderRegion(ns);
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!borderRegionId || !hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const links = merged.filter(
    l =>
      (l.fromId === borderRegionId && l.toId !== hubRegionId) ||
      (l.toId === borderRegionId && l.fromId !== hubRegionId)
  );
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
    hubRegionId,
    peripheralChokepointLinkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}
