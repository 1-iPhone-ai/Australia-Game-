import {
  AU_REGION_CODES,
  type AuRegionCode,
  type MedicalSupplyPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 medical / pharma supply chain readiness by region. */
export function computeMedicalSupplyChainByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 33])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      asset.tags.includes('medical_supply') ||
      asset.tags.includes('health_freight') ||
      asset.tags.includes('pharma_cold')
    ) {
      if (asset.category === 'logistics') {
        byRegion[asset.hostRegion] += asset.warehouseSqm / 82_000 + (asset.coldChainCapable ? 4 : 1.5);
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        byRegion[asset.hostRegion] += asset.laneKilometres / 520;
      }
      if (asset.category === 'port' && asset.tags.includes('gateway')) {
        byRegion[asset.hostRegion] += asset.berthCount * 1.4;
      }
    }
    if (asset.category === 'logistics' && asset.coldChainCapable && asset.tags.includes('capital')) {
      byRegion[asset.hostRegion] += 2.2;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.04 - stress * 0.04), 17, 92) * 10) / 10;
  }
  return byRegion;
}

export function nationalMedicalSupplyChainIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 20, 86) * 10) / 10;
}

export function medicalSupplyProductivityMultiplier(
  supplyIndex: number,
  policy: MedicalSupplyPolicy = 'baseline',
): number {
  const policyBoost = policy === 'surge' ? 0.047 : 0;
  const normalized = (supplyIndex - 38) / 100;
  return clamp(1 + normalized * 0.052 + policyBoost, 0.92, 1.1);
}
