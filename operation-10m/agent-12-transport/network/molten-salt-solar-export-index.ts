import {
  AU_REGION_CODES,
  type AuRegionCode,
  type MoltenSaltSolarExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 molten salt solar export throughput by region. */
export function computeMoltenSaltSolarExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'molten_salt_solar_export' ||
        t === 'csp_heat_rail_feed' ||
        t === 'thermal_renewable_export',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.98 + asset.maxDraftMetres * 0.36;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 70_000 + asset.intermodalLinks.length * 0.7;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 470;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_800_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalMoltenSaltSolarExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.48 + max * 0.52, 5, 73) * 10) / 10;
}

export function moltenSaltSolarExportProductivityMultiplier(
  index: number,
  policy: MoltenSaltSolarExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.035 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.038 + policyBoost, 0.93, 1.1);
}
