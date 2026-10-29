import {
  AU_REGION_CODES,
  type AirportExpressRailPolicy,
  type AuRegionCode,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of mobility logistics tied to airport express rail links. */
export function computeAirportExpressRailShare(
  operationalAssets: TransportAsset[],
  policy: AirportExpressRailPolicy = 'baseline',
): number {
  let expressUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'rail' && asset.tags.includes('airport_express')) {
      const units =
        ('designFreightTonnesPerYear' in asset ? asset.designFreightTonnesPerYear / 4_200_000 : 0) +
        ('trackKilometres' in asset ? asset.trackKilometres / 180 : 0);
      totalUnits += units + 2;
      expressUnits += (units + 2) * 0.88;
    }
    if (asset.category === 'road' && asset.tags.includes('air_rail')) {
      totalUnits += asset.laneKilometres / 240;
      expressUnits += asset.laneKilometres / 240 * 0.62;
    }
    if (asset.category === 'logistics' && asset.tags.includes('air_rail')) {
      totalUnits += asset.warehouseSqm / 68_000;
      expressUnits += asset.warehouseSqm / 68_000 * 0.58;
    }
  }

  if (totalUnits <= 0) return 0.045;
  const policyBoost = policy === 'deploy' ? 0.036 : 0;
  return Math.round(clamp(expressUnits / totalUnits + policyBoost, 0.04, 0.38) * 1000) / 1000;
}

export function airportExpressRailProductivityMultiplier(
  share: number,
  policy: AirportExpressRailPolicy,
): number {
  const bias = policy === 'deploy' ? 1.024 : 1;
  return (1 + (share - 0.07) * 0.033) * bias;
}

export function computeAirportExpressRailThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'airport_express' || t === 'air_rail' || t === 'passenger_freight',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      const railBoost = asset.tags.includes('airport_express') ? 2.4 : 1;
      byRegion[asset.hostRegion] +=
        (asset.designFreightTonnesPerYear / 2_400_000 + asset.trackKilometres / 95) * railBoost;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 320;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 98_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAirportExpressRailThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 2, 58) * 10) / 10;
}
