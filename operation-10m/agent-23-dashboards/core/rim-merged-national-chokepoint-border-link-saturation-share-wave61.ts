import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashHottestBorderRegion } from './border-stress.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashRimMergedNationalChokepointBorderLinkSaturationShareWave61 {
  borderRegionId: string | null;
  rimMergedNationalChokepointLinkCount: number;
  meanBlend: number;
  nationalPeakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on merged rim-border links vs national peak blend. */
export function nrDashBuildRimMergedNationalChokepointBorderLinkSaturationShareWave61(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashRimMergedNationalChokepointBorderLinkSaturationShareWave61 | null {
  const borderRegionId = nrDashHottestBorderRegion(ns);
  if (!borderRegionId || !ns) return null;
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
  const rimBorderLinks = merged.filter(l => {
    const touchesBorder = l.fromId === borderRegionId || l.toId === borderRegionId;
    const other = l.fromId === borderRegionId ? l.toId : l.fromId;
    return touchesBorder && (other.startsWith('RIM') || other.endsWith('_RIM'));
  });
  if (!rimBorderLinks.length) {
    const fallback = merged.filter(l => l.fromId === borderRegionId || l.toId === borderRegionId).slice(0, 2);
    if (!fallback.length) return null;
    const blends = fallback.map(link => {
      const a = pulseById.get(link.fromId) ?? 0;
      const b = pulseById.get(link.toId) ?? 0;
      return (a + b) / 2;
    });
    const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
    return {
      borderRegionId,
      rimMergedNationalChokepointLinkCount: blends.length,
      meanBlend: Math.round(meanBlend * 1000) / 1000,
      nationalPeakBlend: Math.round(nationalPeakBlend * 1000) / 1000,
      saturationShare: Math.round((meanBlend / nationalPeakBlend) * 1000) / 1000,
    };
  }
  const blends = rimBorderLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    borderRegionId,
    rimMergedNationalChokepointLinkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    nationalPeakBlend: Math.round(nationalPeakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / nationalPeakBlend) * 1000) / 1000,
  };
}
