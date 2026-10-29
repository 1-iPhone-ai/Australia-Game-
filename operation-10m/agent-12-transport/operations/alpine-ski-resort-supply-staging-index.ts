import {
  AU_REGION_CODES,
  type AlpineSkiResortSupplyStagingPolicy,
  type AuRegionCode,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 alpine ski resort supply staging readiness by region. */
export function computeAlpineSkiResortSupplyStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'alpine_ski_resort_supply' ||
          t === 'snowfield_logistics_staging' ||
          t === 'mountain_resort_freight',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 64_000 + (asset.coldChainCapable ? 1.25 : 0.74);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 440;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.9;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 270;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.034 - stress * 0.021), 5, 75) * 10) / 10;
  }
  return byRegion;
}

export function nationalAlpineSkiResortSupplyStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.54 + max * 0.46, 6, 73) * 10) / 10;
}

export function computeAlpineSkiResortSupplyStagingShare(
  operationalAssets: TransportAsset[],
  policy: AlpineSkiResortSupplyStagingPolicy = 'baseline',
): number {
  let skiUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('alpine_ski_resort_supply') || asset.tags.includes('mountain_resort_freight')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 58_000;
        skiUnits += (asset.warehouseSqm / 58_000) * 0.51;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 405;
        skiUnits += (asset.laneKilometres / 405) * 0.45;
      }
    }
  }

  if (totalUnits <= 0) return 0.034;
  const policyBoost = policy === 'surge' ? 0.024 : 0;
  return Math.round(clamp(skiUnits / totalUnits + policyBoost, 0.033, 0.22) * 1000) / 1000;
}

export function alpineSkiResortSupplyStagingProductivityMultiplier(
  share: number,
  policy: AlpineSkiResortSupplyStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.016 : 1;
  return (1 + (share - 0.044) * 0.021) * bias;
}
