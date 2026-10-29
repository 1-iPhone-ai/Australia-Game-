import { NATIONAL_CONDITION_LABEL, NS_COND_RANK } from './constants.ts';
import { nrDashBuildHeatCells } from './heat-matrix.ts';
import type { NationalNetworkCondition, NationalSystemsState } from '../types.ts';

export interface NrDashHeatRowSummary {
  regionId: string;
  worstCondition: NationalNetworkCondition;
  worstLabel: string;
  strainedNetworks: number;
}

const condRank = (c: NationalNetworkCondition) => NS_COND_RANK[c];

/** Per-region worst network condition from heat matrix cells (NS only). */
export function nrDashBuildHeatRowSummaries(ns: NationalSystemsState | null): NrDashHeatRowSummary[] {
  if (!ns) return [];
  const { cells, rows } = nrDashBuildHeatCells(ns);
  return rows.map(regionId => {
    const rowCells = cells.filter(c => c.row === regionId);
    let worst: NationalNetworkCondition = 'healthy';
    let strained = 0;
    rowCells.forEach(c => {
      if (condRank(c.tone) >= condRank('strained')) strained += 1;
      if (condRank(c.tone) > condRank(worst)) worst = c.tone;
    });
    return {
      regionId,
      worstCondition: worst,
      worstLabel: NATIONAL_CONDITION_LABEL[worst],
      strainedNetworks: strained,
    };
  });
}
