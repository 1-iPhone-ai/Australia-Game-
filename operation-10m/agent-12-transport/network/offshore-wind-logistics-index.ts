import { AU_REGION_CODES, type AuRegionCode, type OffshoreWindLogisticsPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 offshore wind staging and turbine logistics throughput by region. */
export function computeOffshoreWindLogisticsByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const windTagged =
      asset.tags.some(
        (t) =>
          t === 'offshore_wind' ||
          t === 'wind_farm_logistics' ||
          t === 'turbine_staging' ||
          t === 'offshore_staging',
      ) || (asset.category === 'port' && asset.tags.includes('renewable_export'));

    if (!windTagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.1 + asset.teuCapacityPerYear / 190_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 105_000 + (asset.intermodalLinks.includes('port') ? 2.4 : 1);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 820;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 12_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalOffshoreWindLogisticsIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 2, 78) * 10) / 10;
}

export function offshoreWindLogisticsProductivityMultiplier(
  index: number,
  policy: OffshoreWindLogisticsPolicy = 'baseline',
): number {
  const policyBoost = policy === 'deploy' ? 0.044 : 0;
  const normalized = (index - 6) / 100;
  return clamp(1 + normalized * 0.049 + policyBoost, 0.93, 1.12);
}
