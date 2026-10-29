import { AU_REGION_CODES, type AuRegionCode, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** Stylized hours-to-clear-regional-freight backlog (lower is better). */
export function computeFreightLatencyByRegion(
  operationalAssets: TransportAsset[],
  networkUtilizationFreight: number,
): Record<AuRegionCode, number> {
  const capacity = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) capacity[code] = 0.5;

  for (const asset of operationalAssets) {
    let units = asset.baseProductivityPoints;
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      units += asset.laneKilometres / 400;
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      units += asset.trackKilometres / 250;
    }
    if (asset.category === 'port' && 'teuCapacityPerYear' in asset) {
      units += asset.teuCapacityPerYear / 800_000;
    }
    if (asset.category === 'logistics' && 'warehouseSqm' in asset) {
      units += asset.warehouseSqm / 120_000;
    }
    capacity[asset.hostRegion] += units;
  }

  const stress = clamp(networkUtilizationFreight, 0.05, 1.2);
  const out = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    const hours = (18 / Math.max(1.2, capacity[code])) * (0.65 + stress * 0.55);
    out[code] = Math.round(hours * 100) / 100;
  }
  return out;
}

export function nationalMedianFreightLatency(byRegion: Record<AuRegionCode, number>): number {
  const sorted = AU_REGION_CODES.map((c) => byRegion[c]).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
