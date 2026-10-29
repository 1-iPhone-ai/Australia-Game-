import { V1014_MACRO_REGION_SECTOR_DELTAS } from './catalog/regional-sector-deltas.ts';
import { V1014_MACRO_SECTOR_KEYS, V1014_MACRO_SECTOR_PRODUCTIVITY_PRIORS } from './constants.ts';
import { v1014macroClamp } from './math.ts';

export function v1014macroComposeSectorProductivity(regionId: string): Record<string, number> {
  const base: Record<string, number> = { ...V1014_MACRO_SECTOR_PRODUCTIVITY_PRIORS };
  const deltas = V1014_MACRO_REGION_SECTOR_DELTAS[regionId];
  if (!deltas) return base;
  for (const key of V1014_MACRO_SECTOR_KEYS) {
    const delta = deltas[key] ?? 0;
    base[key] = v1014macroClamp((base[key] ?? 55) + delta, 20, 95);
  }
  return base;
}

export function nationalSectorProductivityFromScore(
  productivityScore: number
): Record<string, number> {
  const sectorProductivity: Record<string, number> = { ...V1014_MACRO_SECTOR_PRODUCTIVITY_PRIORS };
  for (const s of Object.keys(sectorProductivity)) {
    sectorProductivity[s] = v1014macroClamp(sectorProductivity[s] + (productivityScore - 58) * 0.15, 20, 95);
  }
  return sectorProductivity;
}

export function averageRegionalProductivityIndex(sectorMap: Record<string, number>): number {
  const vals = Object.values(sectorMap);
  return vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length);
}
