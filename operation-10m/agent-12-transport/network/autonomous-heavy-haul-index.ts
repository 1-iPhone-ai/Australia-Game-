import {
  AU_REGION_CODES,
  type AuRegionCode,
  type AutonomousHeavyHaulPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 autonomous heavy-haul rail and road throughput by region. */
export function computeAutonomousHeavyHaulByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'autonomous_heavy_haul' || t === 'ore_auto_rail' || t === 'driverless_pilbara',
    );
    if (!tagged) continue;

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_500_000 + asset.trackKilometres / 520;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 720 + asset.freightShare * 3.6;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.8 + asset.bulkShare * 5.4;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 100_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAutonomousHeavyHaulIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.43 + max * 0.57, 5, 76) * 10) / 10;
}

export function autonomousHeavyHaulProductivityMultiplier(
  index: number,
  policy: AutonomousHeavyHaulPolicy = 'baseline',
): number {
  const policyBoost = policy === 'deploy' ? 0.042 : 0;
  const normalized = (index - 6) / 100;
  return clamp(1 + normalized * 0.048 + policyBoost, 0.93, 1.11);
}
