import { NS_COND_RANK } from './constants.ts';
import { nrDashBuildHeatCells } from './heat-matrix.ts';
import type { NationalNetworkCondition, NationalSystemsState } from '../types.ts';

export interface NrDashCriticalCellDensity {
  cellCount: number;
  criticalPlusCount: number;
  density: number;
  worstRegionId: string | null;
}

const criticalPlus = (c: NationalNetworkCondition) => NS_COND_RANK[c] >= NS_COND_RANK.critical;

/** Share of NS heat cells at critical+ condition (authoritative cells only). */
export function nrDashBuildCriticalCellDensity(ns: NationalSystemsState | null): NrDashCriticalCellDensity | null {
  if (!ns) return null;
  const heat = nrDashBuildHeatCells(ns);
  if (!heat.cells.length) return null;
  let criticalPlusCount = 0;
  const perRegion = new Map<string, number>();
  heat.cells.forEach(cell => {
    if (criticalPlus(cell.tone)) {
      criticalPlusCount += 1;
      perRegion.set(cell.row, (perRegion.get(cell.row) ?? 0) + 1);
    }
  });
  let worstRegionId: string | null = null;
  let worst = 0;
  perRegion.forEach((n, id) => {
    if (n > worst) {
      worst = n;
      worstRegionId = id;
    }
  });
  return {
    cellCount: heat.cells.length,
    criticalPlusCount,
    density: Math.round((criticalPlusCount / heat.cells.length) * 1000) / 1000,
    worstRegionId,
  };
}
