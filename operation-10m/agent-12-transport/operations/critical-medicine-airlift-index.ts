import {
  AU_REGION_CODES,
  type AuRegionCode,
  type CriticalMedicineAirliftPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 critical medicine airlift readiness by region. */
export function computeCriticalMedicineAirliftByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 7])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'critical_medicine' || t === 'medevac_airlift' || t === 'pharma_cold_chain',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 70_000 + (asset.coldChainCapable ? 2.6 : 0.8);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 520;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.5 + asset.teuCapacityPerYear / 300_000;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 14_000_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.038 - stress * 0.029), 4, 88) * 10) / 10;
  }
  return byRegion;
}

export function nationalCriticalMedicineAirliftIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.49 + max * 0.51, 6, 82) * 10) / 10;
}

export function computeCriticalMedicineAirliftShare(
  operationalAssets: TransportAsset[],
  policy: CriticalMedicineAirliftPolicy = 'baseline',
): number {
  let airliftUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('medevac_airlift') || asset.tags.includes('critical_medicine')) {
      if (asset.category === 'logistics' && asset.coldChainCapable) {
        totalUnits += asset.warehouseSqm / 65_000 + 1.2;
        airliftUnits += (asset.warehouseSqm / 65_000 + 1.2) * 0.77;
      }
      if (asset.category === 'port') {
        totalUnits += asset.berthCount;
        airliftUnits += asset.berthCount * 0.68;
      }
    }
  }

  if (totalUnits <= 0) return 0.033;
  const policyBoost = policy === 'surge' ? 0.034 : 0;
  return Math.round(clamp(airliftUnits / totalUnits + policyBoost, 0.032, 0.33) * 1000) / 1000;
}

export function criticalMedicineAirliftProductivityMultiplier(
  share: number,
  policy: CriticalMedicineAirliftPolicy,
): number {
  const bias = policy === 'surge' ? 1.025 : 1;
  return (1 + (share - 0.05) * 0.034) * bias;
}
