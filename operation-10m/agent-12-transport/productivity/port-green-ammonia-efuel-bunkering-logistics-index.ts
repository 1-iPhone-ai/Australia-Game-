import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PortGreenAmmoniaEfuelBunkeringLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port logistics supporting green ammonia e-fuel bunkering. */
export function computePortGreenAmmoniaEfuelBunkeringLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: PortGreenAmmoniaEfuelBunkeringLogisticsPolicy = 'baseline',
): number {
  let ammoniaUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'port_green_ammonia_efuel_bunkering' ||
          t === 'green_ammonia_efuel_mooring' ||
          t === 'green_ammonia_efuel_bunkering',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 0.91 + asset.teuCapacityPerYear / 420_000;
        ammoniaUnits += asset.berthCount * 0.91 * 0.5;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 45_500;
        ammoniaUnits += (asset.warehouseSqm / 45_500) * 0.47;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 322;
        ammoniaUnits += (asset.laneKilometres / 322) * 0.39;
      }
    }
  }

  if (totalUnits <= 0) return 0.032;
  const policyBoost = policy === 'expand' ? 0.02 : 0;
  return Math.round(clamp(ammoniaUnits / totalUnits + policyBoost, 0.031, 0.19) * 1000) / 1000;
}

export function portGreenAmmoniaEfuelBunkeringLogisticsProductivityMultiplier(
  share: number,
  policy: PortGreenAmmoniaEfuelBunkeringLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.012 : 1;
  return (1 + (share - 0.05) * 0.016) * bias;
}

export function computePortGreenAmmoniaEfuelBunkeringLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'port_green_ammonia_efuel_bunkering' ||
          t === 'green_ammonia_efuel_mooring' ||
          t === 'green_ammonia_efuel_bunkering',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 41_500 + asset.lastMileCoveragePct / 90;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 328;
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 198;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPortGreenAmmoniaEfuelBunkeringLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.43 + max * 0.57, 2, 68) * 10) / 10;
}
