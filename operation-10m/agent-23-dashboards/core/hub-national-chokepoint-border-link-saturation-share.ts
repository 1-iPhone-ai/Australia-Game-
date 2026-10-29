import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashPrimaryMapHub } from './map-hub-index.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashHubNationalChokepointBorderLinkSaturationShare {
  hubRegionId: string | null;
  hubNationalChokepointLinkCount: number;
  meanBlend: number;
  nationalPeakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on hub-touching merged links relative to the national merged-link peak blend. */
export function nrDashBuildHubNationalChokepointBorderLinkSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashHubNationalChokepointBorderLinkSaturationShare | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
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
  const hubLinks = merged.filter(l => l.fromId === hubRegionId || l.toId === hubRegionId);
  if (!hubLinks.length) return null;
  const hubBlends = hubLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const meanBlend = hubBlends.reduce((s, v) => s + v, 0) / hubBlends.length;
  return {
    hubRegionId,
    hubNationalChokepointLinkCount: hubBlends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    nationalPeakBlend: Math.round(nationalPeakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / nationalPeakBlend) * 1000) / 1000,
  };
}
