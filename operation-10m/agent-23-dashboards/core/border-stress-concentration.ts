import { nrDashBuildBorderStressRows } from './border-stress.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashBorderStressConcentration {
  regionCount: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of per-region max land-border corridor stress. */
export function nrDashBuildBorderStressConcentration(
  ns: NationalSystemsState | null
): NrDashBorderStressConcentration | null {
  const rows = nrDashBuildBorderStressRows(ns);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.maxCorridorStress, 0);
  if (total <= 0) return null;
  let topRegionId: string | null = null;
  let topStress = 0;
  let concentrationIndex = 0;
  rows.forEach(r => {
    if (r.maxCorridorStress > topStress) {
      topStress = r.maxCorridorStress;
      topRegionId = r.regionId;
    }
    const share = r.maxCorridorStress / total;
    concentrationIndex += share * share;
  });
  return {
    regionCount: rows.length,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topStress / total) * 1000) / 1000,
  };
}
