import type { NationalSystemsState } from '../types.ts';

const SEVERITY_WEIGHT: Record<string, number> = {
  minor: 0.5,
  meaningful: 1,
  severe: 1.5,
  critical: 2,
};

export interface NrDashBottleneckSeverityLoad {
  activeCount: number;
  weightedLoad: number;
  topRegionId: string | null;
}

/** Weighted sum of active NS bottleneck severities (authoritative list). */
export function nrDashBuildBottleneckSeverityLoad(
  ns: NationalSystemsState | null
): NrDashBottleneckSeverityLoad | null {
  if (!ns?.bottlenecks?.length) return null;
  let weightedLoad = 0;
  let topRegionId: string | null = null;
  let topWeight = 0;
  ns.bottlenecks.forEach(b => {
    const w = SEVERITY_WEIGHT[b.severity ?? ''] ?? 1;
    weightedLoad += w;
    if (b.regionId && w > topWeight) {
      topWeight = w;
      topRegionId = b.regionId;
    }
  });
  return {
    activeCount: ns.bottlenecks.length,
    weightedLoad: Math.round(weightedLoad * 1000) / 1000,
    topRegionId,
  };
}
