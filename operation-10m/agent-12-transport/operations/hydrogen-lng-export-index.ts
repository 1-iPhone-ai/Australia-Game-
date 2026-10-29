import {
  AU_REGION_CODES,
  type AuRegionCode,
  type HydrogenLngExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 hydrogen liquefaction and cryogenic export readiness by region. */
export function computeHydrogenLngExportByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 9])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'hydrogen_lng' || t === 'h2_liquefaction' || t === 'export_cryogenic',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.3 + asset.bulkShare * 5.2;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 78_000 + (asset.coldChainCapable ? 1.8 : 0.6);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 540;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_800_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.04 - stress * 0.031), 5, 90) * 10) / 10;
  }
  return byRegion;
}

export function nationalHydrogenLngExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.47 + max * 0.53, 7, 85) * 10) / 10;
}

export function hydrogenLngExportProductivityMultiplier(
  exportIndex: number,
  policy: HydrogenLngExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.044 : 0;
  const normalized = (exportIndex - 11) / 100;
  return clamp(1 + normalized * 0.049 + policyBoost, 0.92, 1.12);
}
