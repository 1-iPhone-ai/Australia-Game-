import {
  AU_REGION_CODES,
  type AuRegionCode,
  type DigitalFreightPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of freight operations with digital visibility / telemetry integration. */
export function computeDigitalFreightVisibilityShare(
  operationalAssets: TransportAsset[],
  policy: DigitalFreightPolicy = 'baseline',
): number {
  let digitalUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'logistics') {
      const units = asset.warehouseSqm / 65_000 + asset.intermodalLinks.length;
      totalUnits += units;
      if (
        asset.tags.includes('digital_freight') ||
        asset.tags.includes('visibility') ||
        asset.tags.includes('telemetry')
      ) {
        digitalUnits += units * 0.82;
      }
    }
    if (asset.category === 'port') {
      const units = asset.berthCount * 2 + asset.automationLevel * 1.5;
      totalUnits += units;
      if (asset.tags.includes('digital_freight') || asset.automationLevel >= 2) {
        digitalUnits += units * (0.45 + asset.automationLevel * 0.08);
      }
    }
    if (asset.category === 'road' && asset.tags.includes('telemetry') && 'laneKilometres' in asset) {
      totalUnits += asset.laneKilometres / 200;
      digitalUnits += asset.laneKilometres / 200;
    }
  }

  if (totalUnits <= 0) return 0.08;
  const policyBoost = policy === 'integrate' ? 0.042 : 0;
  return Math.round(clamp(digitalUnits / totalUnits + policyBoost, 0.07, 0.65) * 1000) / 1000;
}

export function digitalFreightProductivityMultiplier(
  share: number,
  policy: DigitalFreightPolicy,
): number {
  const bias = policy === 'integrate' ? 1.023 : 1;
  return (1 + (share - 0.12) * 0.036) * bias;
}

export function computeDigitalFreightThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some((t) => t === 'digital_freight' || t === 'visibility' || t === 'telemetry')
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 90_000 + asset.intermodalLinks.length * 1.4;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.automationLevel * 2.8 + asset.teuCapacityPerYear / 400_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 620;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalDigitalFreightThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.56 + max * 0.44, 2, 74) * 10) / 10;
}
