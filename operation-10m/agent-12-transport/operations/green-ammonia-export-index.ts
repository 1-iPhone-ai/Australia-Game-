import {
  AU_REGION_CODES,
  type AuRegionCode,
  type GreenAmmoniaExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 green ammonia export logistics readiness by region. */
export function computeGreenAmmoniaExportByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 10])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'green_ammonia' ||
          t === 'ammonia_export' ||
          t === 'hydrogen_derivative' ||
          t === 'renewable_export',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 82_000 + asset.intermodalLinks.length * 0.85;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 520;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_200_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.2 + asset.bulkShare * 5.5;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.04 - stress * 0.032), 6, 92) * 10) / 10;
  }
  return byRegion;
}

export function nationalGreenAmmoniaExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.47 + max * 0.53, 8, 86) * 10) / 10;
}

export function greenAmmoniaExportProductivityMultiplier(
  exportIndex: number,
  policy: GreenAmmoniaExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.045 : 0;
  const normalized = (exportIndex - 12) / 100;
  return clamp(1 + normalized * 0.05 + policyBoost, 0.92, 1.12);
}
