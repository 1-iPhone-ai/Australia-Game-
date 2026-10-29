import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NrDashMapLink, RegionMapNode } from '../types.ts';

export interface NrDashLinkPulseSpan {
  linkCount: number;
  minBlend: number;
  maxBlend: number;
  intensitySpread: number;
}

/** Spread of endpoint-averaged map pulse intensity across strategic map links. */
export function nrDashBuildLinkPulseSpan(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashLinkPulseSpan | null {
  if (!links.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = links.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const minBlend = Math.min(...blends);
  const maxBlend = Math.max(...blends);
  return {
    linkCount: blends.length,
    minBlend: Math.round(minBlend * 1000) / 1000,
    maxBlend: Math.round(maxBlend * 1000) / 1000,
    intensitySpread: Math.round((maxBlend - minBlend) * 1000) / 1000,
  };
}
