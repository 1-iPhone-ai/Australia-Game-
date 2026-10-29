import { AU_REGION_CODES, type AuRegionCode, type CongestionReliefPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 urban freight congestion pressure (higher = worse). */
export function computeUrbanCongestionByRegion(
  operationalAssets: TransportAsset[],
  freightUtilization = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 28])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'road' && 'urbanShare' in asset) {
      const pressure = asset.urbanShare * asset.freightShare * (asset.laneKilometres / 120);
      byRegion[asset.hostRegion] += pressure * 12;
      if (asset.tollRoad) byRegion[asset.hostRegion] -= 2.5;
    }
    if (asset.category === 'logistics' && asset.lastMileCoveragePct > 65) {
      byRegion[asset.hostRegion] -= 3;
    }
  }

  const utilStress = clamp(freightUtilization, 0.05, 1.15);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (0.9 + utilStress * 0.25), 8, 92) * 10) / 10;
  }
  return byRegion;
}

export function nationalUrbanCongestionIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 12, 78) * 10) / 10;
}

export function congestionReliefMultiplier(
  congestionIndex: number,
  policy: CongestionReliefPolicy = 'baseline',
): number {
  const policyRelief =
    policy === 'invest' ? 0.06 : policy === 'priority_freight' ? 0.09 : 0;
  const normalized = (congestionIndex - 35) / 100;
  return clamp(1 - normalized * 0.08 + policyRelief, 0.9, 1.08);
}
