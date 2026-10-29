import { nrDashBuildCorridorStressRows } from './corridor-stress.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashCorridorStressConcentration {
  corridorCount: number;
  topCorridorKey: string | null;
  concentrationIndex: number;
  topCorridorShare: number;
}

/** Herfindahl clustering of land-corridor mean peak utilization (NS adjacency). */
export function nrDashBuildCorridorStressConcentration(
  ns: NationalSystemsState | null
): NrDashCorridorStressConcentration | null {
  const rows = nrDashBuildCorridorStressRows(ns);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.meanPeakUtilization, 0);
  if (total <= 0) return null;
  let topCorridorKey: string | null = null;
  let topStress = 0;
  let concentrationIndex = 0;
  rows.forEach(r => {
    if (r.meanPeakUtilization > topStress) {
      topStress = r.meanPeakUtilization;
      topCorridorKey = r.corridorKey;
    }
    const share = r.meanPeakUtilization / total;
    concentrationIndex += share * share;
  });
  return {
    corridorCount: rows.length,
    topCorridorKey,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topCorridorShare: Math.round((topStress / total) * 1000) / 1000,
  };
}
