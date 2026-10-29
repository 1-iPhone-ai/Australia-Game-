import {
  AU_REGION_CODES,
  type AuRegionCode,
  type TidalLagoonExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 tidal lagoon export throughput by region. */
export function computeTidalLagoonExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'tidal_lagoon_export' ||
        t === 'tidal_barrage_rail_feed' ||
        t === 'marine_renewable_lagoon',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.0 + asset.maxDraftMetres * 0.37;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 68_000 + asset.intermodalLinks.length * 0.68;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 460;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_400_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalTidalLagoonExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.47 + max * 0.53, 5, 71) * 10) / 10;
}

export function tidalLagoonExportProductivityMultiplier(
  index: number,
  policy: TidalLagoonExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.033 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.036 + policyBoost, 0.93, 1.09);
}
