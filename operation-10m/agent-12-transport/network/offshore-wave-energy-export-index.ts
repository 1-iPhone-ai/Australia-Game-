import {
  AU_REGION_CODES,
  type AuRegionCode,
  type OffshoreWaveEnergyExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 offshore wave energy export throughput by region. */
export function computeOffshoreWaveEnergyExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'offshore_wave_energy_export' ||
        t === 'wave_farm_cable_feed' ||
        t === 'marine_renewable_export',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.05 + asset.maxDraftMetres * 0.37;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 73_000 + asset.intermodalLinks.length * 0.73;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 485;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_200_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalOffshoreWaveEnergyExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.47 + max * 0.53, 5, 74) * 10) / 10;
}

export function offshoreWaveEnergyExportProductivityMultiplier(
  index: number,
  policy: OffshoreWaveEnergyExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.036 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.038 + policyBoost, 0.93, 1.1);
}
