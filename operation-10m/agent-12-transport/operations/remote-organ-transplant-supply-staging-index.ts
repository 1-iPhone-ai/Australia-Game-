import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RemoteOrganTransplantSupplyStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 remote organ transplant supply staging readiness by region. */
export function computeRemoteOrganTransplantSupplyStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'remote_organ_transplant' ||
          t === 'organ_cold_chain_staging' ||
          t === 'transplant_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 54_000 + (asset.coldChainCapable ? 1.35 : 0.71);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 392;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.82;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 228;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.022 - stress * 0.016), 5, 74) * 10) / 10;
  }
  return byRegion;
}

export function nationalRemoteOrganTransplantSupplyStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 6, 72) * 10) / 10;
}

export function computeRemoteOrganTransplantSupplyStagingShare(
  operationalAssets: TransportAsset[],
  policy: RemoteOrganTransplantSupplyStagingPolicy = 'baseline',
): number {
  let transplantUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('remote_organ_transplant') || asset.tags.includes('transplant_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 50_000;
        transplantUnits += (asset.warehouseSqm / 50_000) * 0.52;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 358;
        transplantUnits += (asset.laneKilometres / 358) * 0.44;
      }
    }
  }

  if (totalUnits <= 0) return 0.03;
  const policyBoost = policy === 'surge' ? 0.018 : 0;
  return Math.round(clamp(transplantUnits / totalUnits + policyBoost, 0.028, 0.18) * 1000) / 1000;
}

export function remoteOrganTransplantSupplyStagingProductivityMultiplier(
  share: number,
  policy: RemoteOrganTransplantSupplyStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.01 : 1;
  return (1 + (share - 0.04) * 0.016) * bias;
}
