import { V1014_MACRO_SECTOR_KEYS } from './constants.ts';
import { v1014macroComposeSectorProductivity } from './productivity.ts';
import type { RegionalMacroContribution } from './types.ts';

/** Derive national sector output mix from regional shares × regional sector productivity weights. */
export function computeNationalSectorOutputMix(
  contributions: RegionalMacroContribution[]
): Record<string, number> {
  const mix: Record<string, number> = Object.fromEntries(V1014_MACRO_SECTOR_KEYS.map(k => [k, 0]));
  for (const row of contributions) {
    const sectors = v1014macroComposeSectorProductivity(row.regionId);
    const sectorTotal = Object.values(sectors).reduce((a, b) => a + b, 0) || 1;
    for (const key of V1014_MACRO_SECTOR_KEYS) {
      mix[key] += row.share * ((sectors[key] ?? 0) / sectorTotal);
    }
  }
  const sum = Object.values(mix).reduce((a, b) => a + b, 0) || 1;
  for (const k of Object.keys(mix)) mix[k] = mix[k] / sum;
  return mix;
}

export function dominantNationalSector(mix: Record<string, number>): string {
  return Object.entries(mix).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'services';
}
