import {
  NATIONAL_CONDITION_LABEL,
  NATIONAL_NETWORK_LABEL,
  NATIONAL_NETWORKS,
} from './constants.ts';
import type { NationalSystemsState, NrDashHeatCell } from '../types.ts';

export function nrDashBuildHeatCells(ns: NationalSystemsState | null): {
  cells: NrDashHeatCell[];
  rows: string[];
  cols: string[];
} {
  if (!ns) return { cells: [], rows: [], cols: [] };
  const rows = Object.values(ns.regions)
    .sort((a, b) => a.regionId.localeCompare(b.regionId))
    .map(r => r.regionId);
  const cols = NATIONAL_NETWORKS.map(n => NATIONAL_NETWORK_LABEL[n]);
  const cells: NrDashHeatCell[] = [];
  for (const reg of Object.values(ns.regions)) {
    for (const n of NATIONAL_NETWORKS) {
      const x = reg.networks[n];
      cells.push({
        row: reg.regionId,
        col: NATIONAL_NETWORK_LABEL[n],
        label: NATIONAL_CONDITION_LABEL[x.condition],
        tone: x.condition,
        title: `${reg.name} ${NATIONAL_NETWORK_LABEL[n]}: ${NATIONAL_CONDITION_LABEL[x.condition]} (${Math.round(x.utilization * 100)}% used)`,
      });
    }
  }
  return { cells, rows, cols };
}
