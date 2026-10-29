import {
  AU_REGION_CODES,
  type AuRegionCode,
  type DisasterRecoveryStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 disaster recovery staging readiness (emergency corridors, relief staging). */
export function computeDisasterRecoveryStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 32])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      asset.tags.includes('disaster_recovery') ||
      asset.tags.includes('emergency_staging') ||
      asset.tags.includes('emergency_relief')
    ) {
      if (asset.category === 'logistics') {
        byRegion[asset.hostRegion] += asset.warehouseSqm / 90_000 + (asset.coldChainCapable ? 2.5 : 0);
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        byRegion[asset.hostRegion] += asset.laneKilometres / 400;
      }
      if (asset.category === 'port') {
        byRegion[asset.hostRegion] += asset.berthCount * 2.1;
      }
    }
    if (asset.linkedProjectType === 'remote_logistics_base') {
      byRegion[asset.hostRegion] += 3.2;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.15);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.05 - stress * 0.04), 18, 92) * 10) / 10;
  }
  return byRegion;
}

export function nationalDisasterRecoveryStagingIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 22, 86) * 10) / 10;
}

export function disasterRecoveryStagingProductivityMultiplier(
  stagingIndex: number,
  policy: DisasterRecoveryStagingPolicy = 'baseline',
): number {
  const policyBoost = policy === 'surge' ? 0.046 : 0;
  const normalized = (stagingIndex - 38) / 100;
  return clamp(1 + normalized * 0.052 + policyBoost, 0.92, 1.1);
}
