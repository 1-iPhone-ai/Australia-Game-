import { NS_COND_RANK } from './constants.ts';
import { nrDashBuildHeatCells } from './heat-matrix.ts';
import type { NationalNetworkCondition, NationalSystemsState } from '../types.ts';

export interface NrDashHeatStrainedDensity {
  cellCount: number;
  strainedPlusCount: number;
  density: number;
}

const strainedPlus = (c: NationalNetworkCondition) => NS_COND_RANK[c] >= NS_COND_RANK.strained;

/** Share of heat-grid cells at strained+ NS conditions. */
export function nrDashBuildHeatStrainedDensity(ns: NationalSystemsState | null): NrDashHeatStrainedDensity | null {
  if (!ns) return null;
  const heat = nrDashBuildHeatCells(ns);
  const strainedPlusCount = heat.cells.filter(c => strainedPlus(c.tone)).length;
  if (!heat.cells.length) return null;
  return {
    cellCount: heat.cells.length,
    strainedPlusCount,
    density: Math.round((strainedPlusCount / heat.cells.length) * 1000) / 1000,
  };
}
