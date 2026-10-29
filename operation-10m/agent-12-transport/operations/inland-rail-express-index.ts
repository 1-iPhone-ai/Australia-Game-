import {
  AU_REGION_CODES,
  type AuRegionCode,
  type InlandRailExpressPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 inland rail express container throughput by region. */
export function computeInlandRailExpressByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 8])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'inland_rail_express' ||
          t === 'express_freight' ||
          t === 'intermodal_express',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_400_000 + asset.trackKilometres / 480;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 560;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 88_000 + asset.intermodalLinks.length * 0.72;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.teuCapacityPerYear / 280_000 + asset.berthCount * 1.4;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.03 - stress * 0.028), 5, 90) * 10) / 10;
  }
  return byRegion;
}

export function nationalInlandRailExpressIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.46 + max * 0.54, 7, 82) * 10) / 10;
}

export function computeInlandRailExpressShare(
  operationalAssets: TransportAsset[],
  policy: InlandRailExpressPolicy = 'baseline',
): number {
  let expressUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'rail' && asset.tags.includes('inland_rail_express')) {
      const units =
        ('designFreightTonnesPerYear' in asset ? asset.designFreightTonnesPerYear / 5_600_000 : 0) +
        ('trackKilometres' in asset ? asset.trackKilometres / 220 : 0);
      totalUnits += units + 1.8;
      expressUnits += (units + 1.8) * 0.84;
    }
    if (asset.tags.includes('express_freight')) {
      totalUnits += 1.2;
      expressUnits += 0.76;
    }
  }

  if (totalUnits <= 0) return 0.038;
  const policyBoost = policy === 'deploy' ? 0.034 : 0;
  return Math.round(clamp(expressUnits / totalUnits + policyBoost, 0.035, 0.36) * 1000) / 1000;
}

export function inlandRailExpressProductivityMultiplier(
  share: number,
  policy: InlandRailExpressPolicy,
): number {
  const bias = policy === 'deploy' ? 1.023 : 1;
  return (1 + (share - 0.06) * 0.034) * bias;
}
