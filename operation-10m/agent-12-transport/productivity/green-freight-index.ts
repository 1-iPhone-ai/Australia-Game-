import type { GreenFreightPolicy, TransportAsset } from '../types.ts';
import { clamp } from './formulas.ts';
import { computeElectrifiedFreightShare } from './modal-balance-index.ts';

/** 0–1 share of freight capacity meeting low-emission criteria (electrified rail + efficient road). */
export function computeGreenFreightShare(
  operationalAssets: TransportAsset[],
  policy: GreenFreightPolicy = 'baseline',
): number {
  let greenUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'rail' && 'electrifiedShare' in asset) {
      const units = asset.trackKilometres * (0.4 + asset.dualTrackShare);
      totalUnits += units;
      greenUnits += units * asset.electrifiedShare;
      if (asset.tags.includes('gauge_standard')) greenUnits += units * 0.08;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      const units = asset.laneKilometres * asset.freightShare;
      totalUnits += units;
      if (asset.designSpeedKmh >= 100 && asset.urbanShare < 0.15) {
        greenUnits += units * 0.22;
      }
    }
    if (asset.category === 'logistics' && asset.coldChainCapable) {
      totalUnits += asset.warehouseSqm / 50_000;
      greenUnits += (asset.warehouseSqm / 50_000) * 0.18;
    }
  }

  if (totalUnits <= 0) return 0.2;
  const policyBoost = policy === 'accelerate' ? 0.06 : 0;
  return Math.round(clamp(greenUnits / totalUnits + policyBoost, 0.12, 0.94) * 1000) / 1000;
}

export function greenFreightProductivityMultiplier(share: number, policy: GreenFreightPolicy): number {
  const bias = policy === 'accelerate' ? 1.03 : 1;
  return (1 + (share - 0.35) * 0.05) * bias;
}

export function electrifiedBaselineShare(operationalAssets: TransportAsset[]): number {
  return computeElectrifiedFreightShare(operationalAssets);
}
