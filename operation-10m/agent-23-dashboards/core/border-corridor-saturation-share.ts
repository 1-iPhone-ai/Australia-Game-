import { nrDashBuildBorderStressRows } from './border-stress.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashBorderCorridorSaturationShare {
  borderRegionCount: number;
  meanStress: number;
  peakStress: number;
  saturationShare: number;
}

/** Mean land-border corridor stress relative to the hottest border region. */
export function nrDashBuildBorderCorridorSaturationShare(
  ns: NationalSystemsState | null
): NrDashBorderCorridorSaturationShare | null {
  const rows = nrDashBuildBorderStressRows(ns);
  if (!rows.length) return null;
  const stresses = rows.map(r => r.maxCorridorStress);
  const peakStress = Math.max(...stresses);
  if (peakStress <= 0) return null;
  const meanStress = stresses.reduce((s, v) => s + v, 0) / stresses.length;
  return {
    borderRegionCount: stresses.length,
    meanStress: Math.round(meanStress * 1000) / 1000,
    peakStress: Math.round(peakStress * 1000) / 1000,
    saturationShare: Math.round((meanStress / peakStress) * 1000) / 1000,
  };
}
