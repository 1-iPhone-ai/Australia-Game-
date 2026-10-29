import {
  AU_REGION_CODES,
  type AuRegionCode,
  type BatterySupplyChainPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 battery / EV supply chain logistics readiness by region. */
export function computeBatterySupplyChainByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 14])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'battery_supply' || t === 'ev_freight' || t === 'lithium_logistics' || t === 'cell_manufacturing',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 76_000 + asset.intermodalLinks.length * 0.9;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 480;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_500_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.8 + asset.bulkShare * 4;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.03 - stress * 0.035), 8, 94) * 10) / 10;
  }
  return byRegion;
}

export function nationalBatterySupplyChainIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.46 + max * 0.54, 10, 88) * 10) / 10;
}

export function batterySupplyProductivityMultiplier(
  supplyIndex: number,
  policy: BatterySupplyChainPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.046 : 0;
  const normalized = (supplyIndex - 18) / 100;
  return clamp(1 + normalized * 0.051 + policyBoost, 0.92, 1.11);
}
