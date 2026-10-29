import {
  AU_REGION_CODES,
  type AuRegionCode,
  type CycloneResilientCoastalFreightPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 cyclone-resilient coastal freight routing readiness by region. */
export function computeCycloneResilientCoastalFreightByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'cyclone_resilient_coastal' || t === 'tropical_storm_routing' || t === 'coastal_freight_harden',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.95 + asset.maxDraftMetres * 0.42;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 79_000 + (asset.coldChainCapable ? 1.2 : 0.65);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 580;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 15_800_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.04 - stress * 0.026), 5, 79) * 10) / 10;
  }
  return byRegion;
}

export function nationalCycloneResilientCoastalFreightIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 6, 77) * 10) / 10;
}

export function computeCycloneResilientCoastalFreightShare(
  operationalAssets: TransportAsset[],
  policy: CycloneResilientCoastalFreightPolicy = 'baseline',
): number {
  let resilientUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('cyclone_resilient_coastal') || asset.tags.includes('tropical_storm_routing')) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.35;
        resilientUnits += asset.berthCount * 0.92;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 520;
        resilientUnits += (asset.laneKilometres / 520) * 0.58;
      }
    }
  }

  if (totalUnits <= 0) return 0.036;
  const policyBoost = policy === 'harden' ? 0.029 : 0;
  return Math.round(clamp(resilientUnits / totalUnits + policyBoost, 0.035, 0.26) * 1000) / 1000;
}

export function cycloneResilientCoastalFreightProductivityMultiplier(
  share: number,
  policy: CycloneResilientCoastalFreightPolicy,
): number {
  const bias = policy === 'harden' ? 1.021 : 1;
  return (1 + (share - 0.052) * 0.027) * bias;
}
