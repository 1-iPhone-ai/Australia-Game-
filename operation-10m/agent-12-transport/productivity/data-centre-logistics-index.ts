import {
  AU_REGION_CODES,
  type AuRegionCode,
  type DataCentreLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of logistics tied to data-centre / hyperscale digital infrastructure. */
export function computeDataCentreLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: DataCentreLogisticsPolicy = 'baseline',
): number {
  let dcUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'logistics') {
      const units = asset.warehouseSqm / 68_000 + asset.intermodalLinks.length;
      totalUnits += units;
      if (
        asset.tags.includes('data_centre') ||
        asset.tags.includes('hyperscale_logistics') ||
        asset.tags.includes('digital_infra')
      ) {
        dcUnits += units * 0.88;
      }
    }
    if (asset.category === 'road' && asset.tags.includes('digital_infra') && 'laneKilometres' in asset) {
      totalUnits += asset.laneKilometres / 220;
      dcUnits += asset.laneKilometres / 220 * 0.7;
    }
    if (asset.category === 'rail' && asset.tags.includes('data_centre')) {
      totalUnits += asset.trackKilometres / 100;
      dcUnits += asset.trackKilometres / 100;
    }
  }

  if (totalUnits <= 0) return 0.07;
  const policyBoost = policy === 'accelerate' ? 0.041 : 0;
  return Math.round(clamp(dcUnits / totalUnits + policyBoost, 0.06, 0.5) * 1000) / 1000;
}

export function dataCentreLogisticsProductivityMultiplier(
  share: number,
  policy: DataCentreLogisticsPolicy,
): number {
  const bias = policy === 'accelerate' ? 1.023 : 1;
  return (1 + (share - 0.1) * 0.036) * bias;
}

export function computeDataCentreLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'data_centre' || t === 'hyperscale_logistics' || t === 'digital_infra',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 86_000 + asset.lastMileCoveragePct / 140;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 680;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 10_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalDataCentreLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.56 + max * 0.44, 2, 66) * 10) / 10;
}
