import { AU_REGION_CODES, type AuRegionCode, type ModalShiftPolicy, type TransportAsset } from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 index peaking when road/rail freight capacity is near target mix (default 52% road). */
export function computeModalBalanceIndex(
  operationalAssets: TransportAsset[],
  policy: ModalShiftPolicy = 'balanced',
): number {
  let roadUnits = 0;
  let railUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      roadUnits += asset.laneKilometres * asset.freightShare;
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      railUnits += asset.trackKilometres * (0.35 + asset.dualTrackShare * 0.4);
      railUnits += asset.designFreightTonnesPerYear / 12_000_000;
    }
  }

  const total = roadUnits + railUnits;
  if (total <= 0) return 0.5;

  const roadShare = roadUnits / total;
  const target =
    policy === 'road' ? 0.62 : policy === 'rail' ? 0.42 : 0.52;
  const deviation = Math.abs(roadShare - target);
  return Math.round(clamp(1 - deviation * 2.2, 0.15, 1) * 1000) / 1000;
}

export function computeElectrifiedFreightShare(operationalAssets: TransportAsset[]): number {
  let electrifiedKm = 0;
  let freightKm = 0;
  for (const asset of operationalAssets) {
    if (asset.category !== 'rail' || !('electrifiedShare' in asset)) continue;
    freightKm += asset.trackKilometres;
    electrifiedKm += asset.trackKilometres * asset.electrifiedShare;
  }
  if (freightKm <= 0) return 0;
  return Math.round(clamp(electrifiedKm / freightKm, 0, 1) * 1000) / 1000;
}

export function modalBalanceProductivityMultiplier(index: number, policy: ModalShiftPolicy): number {
  const bias = policy === 'rail' ? 1.04 : policy === 'road' ? 1.02 : 1;
  return 1 + (index - 0.5) * 0.06 * bias;
}

export function emptyModalBalanceByRegion(): Record<AuRegionCode, number> {
  return Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0.5])) as Record<AuRegionCode, number>;
}
