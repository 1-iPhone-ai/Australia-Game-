import {
  AU_REGION_CODES,
  type AuRegionCode,
  type AutomatedLivestockExportYardPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of livestock export using automated quarantine yards. */
export function computeAutomatedLivestockExportYardShare(
  operationalAssets: TransportAsset[],
  policy: AutomatedLivestockExportYardPolicy = 'baseline',
): number {
  let autoUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'auto_livestock_yard' || t === 'export_quarantine_staging' || t === 'cattle_rail_loadout',
      )
    ) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 55_000 + (asset.coldChainCapable ? 0.8 : 0.5);
        autoUnits += (asset.warehouseSqm / 55_000) * 0.6;
      }
      if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
        totalUnits += asset.designFreightTonnesPerYear / 12_500_000;
        autoUnits += (asset.designFreightTonnesPerYear / 12_500_000) * 0.56;
      }
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.1;
        autoUnits += asset.berthCount * 0.65;
      }
    }
  }

  if (totalUnits <= 0) return 0.038;
  const policyBoost = policy === 'expand' ? 0.03 : 0;
  return Math.round(clamp(autoUnits / totalUnits + policyBoost, 0.037, 0.28) * 1000) / 1000;
}

export function automatedLivestockExportYardProductivityMultiplier(
  share: number,
  policy: AutomatedLivestockExportYardPolicy,
): number {
  const bias = policy === 'expand' ? 1.023 : 1;
  return (1 + (share - 0.058) * 0.027) * bias;
}

export function computeAutomatedLivestockExportYardThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'auto_livestock_yard' || t === 'export_quarantine_staging' || t === 'cattle_rail_loadout',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 63_000;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 11_200_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.6;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAutomatedLivestockExportYardThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 2, 55) * 10) / 10;
}
