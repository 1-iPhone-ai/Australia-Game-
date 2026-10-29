import {
  AU_REGION_CODES,
  type AuRegionCode,
  type TransportAsset,
  type WildfireAirtankerStagingPolicy,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 wildfire airtanker staging readiness by region. */
export function computeWildfireAirtankerStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'wildfire_airtanker_staging' ||
          t === 'aerial_firefighting_base' ||
          t === 'bushfire_tanker_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 70_000 + (asset.coldChainCapable ? 1.2 : 0.75);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 470;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.9;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 290;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.038 - stress * 0.024), 5, 78) * 10) / 10;
  }
  return byRegion;
}

export function nationalWildfireAirtankerStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 6, 76) * 10) / 10;
}

export function computeWildfireAirtankerStagingShare(
  operationalAssets: TransportAsset[],
  policy: WildfireAirtankerStagingPolicy = 'baseline',
): number {
  let tankerUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('wildfire_airtanker_staging') || asset.tags.includes('bushfire_tanker_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 63_000;
        tankerUnits += (asset.warehouseSqm / 63_000) * 0.55;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 440;
        tankerUnits += (asset.laneKilometres / 440) * 0.49;
      }
    }
  }

  if (totalUnits <= 0) return 0.037;
  const policyBoost = policy === 'surge' ? 0.028 : 0;
  return Math.round(clamp(tankerUnits / totalUnits + policyBoost, 0.036, 0.26) * 1000) / 1000;
}

export function wildfireAirtankerStagingProductivityMultiplier(
  share: number,
  policy: WildfireAirtankerStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.02 : 1;
  return (1 + (share - 0.052) * 0.025) * bias;
}
