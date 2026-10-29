import {
  AU_REGION_CODES,
  type AuRegionCode,
  type BiomethaneGridExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 biomethane grid export throughput by region. */
export function computeBiomethaneGridExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'biomethane_grid_export' ||
        t === 'anaerobic_digest_rail_feed' ||
        t === 'renewable_gas_logistics',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.9 + asset.maxDraftMetres * 0.35;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 69_000 + asset.intermodalLinks.length * 0.69;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 465;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_600_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalBiomethaneGridExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.49 + max * 0.51, 5, 72) * 10) / 10;
}

export function biomethaneGridExportProductivityMultiplier(
  index: number,
  policy: BiomethaneGridExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.034 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.037 + policyBoost, 0.93, 1.09);
}
