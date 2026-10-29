import {
  AU_REGION_CODES,
  type AuRegionCode,
  type OffshoreWindCableExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 offshore wind cable and HVDC export throughput by region. */
export function computeOffshoreWindCableExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'offshore_wind_cable_export' || t === 'subsea_hvdc_feed' || t === 'renewable_export_rail',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.1 + asset.maxDraftMetres * 0.38;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 78_000 + asset.intermodalLinks.length * 0.76;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 510;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_800_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalOffshoreWindCableExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.47 + max * 0.53, 5, 75) * 10) / 10;
}

export function offshoreWindCableExportProductivityMultiplier(
  index: number,
  policy: OffshoreWindCableExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.036 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.041 + policyBoost, 0.93, 1.1);
}
