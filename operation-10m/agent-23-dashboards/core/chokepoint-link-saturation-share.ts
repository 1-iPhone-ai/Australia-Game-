import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildDependencyChokepoints } from './dependency-chokepoint.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashChokepointLinkSaturationShare {
  chokepointCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on dependency chokepoint map links relative to peak chokepoint link blend. */
export function nrDashBuildChokepointLinkSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashChokepointLinkSaturationShare | null {
  const rows = nrDashBuildDependencyChokepoints(ns);
  if (!rows.length || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const depLinks = merged.filter(l => l.kind === 'dependency');
  const chokeKeys = new Set(rows.map(r => `${r.consumerRegionId}|${r.providerRegionId}`));
  const chokeLinks = depLinks.filter(l => chokeKeys.has(`${l.fromId}|${l.toId}`) || chokeKeys.has(`${l.toId}|${l.fromId}`));
  if (!chokeLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = chokeLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
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
