import { NATIONAL_NETWORKS, NATIONAL_NETWORK_LABEL } from './constants.ts';
import type { NationalNetworkKind, NationalSystemsState } from '../types.ts';

export interface NrDashUtilAlignmentRow {
  network: NationalNetworkKind;
  label: string;
  nationalUtilization: number;
  regionalMeanUtilization: number;
  /** Absolute gap between national bar and regional mean cell util. */
  drift: number;
}

export interface NrDashUtilAlignmentDrift {
  rows: NrDashUtilAlignmentRow[];
  meanDrift: number;
  worstNetwork: NationalNetworkKind | null;
}

/** Mean absolute mismatch between national network bars and regional NS cells. */
export function nrDashBuildUtilAlignmentDrift(ns: NationalSystemsState | null): NrDashUtilAlignmentDrift | null {
  if (!ns?.national || !ns.regions) return null;
  const regionList = Object.values(ns.regions);
  if (!regionList.length) return null;
  const rows: NrDashUtilAlignmentRow[] = NATIONAL_NETWORKS.map(network => {
    const nationalUtilization = ns.national[network]?.utilization ?? 0;
    const regionalMeanUtilization =
      regionList.reduce((s, reg) => s + (reg.networks[network]?.utilization ?? 0), 0) / regionList.length;
    const drift = Math.abs(nationalUtilization - regionalMeanUtilization);
    return {
      network,
      label: NATIONAL_NETWORK_LABEL[network],
      nationalUtilization: Math.round(nationalUtilization * 1000) / 1000,
      regionalMeanUtilization: Math.round(regionalMeanUtilization * 1000) / 1000,
      drift: Math.round(drift * 1000) / 1000,
    };
  });
  rows.sort((a, b) => b.drift - a.drift || a.network.localeCompare(b.network));
  const meanDrift = rows.reduce((s, r) => s + r.drift, 0) / rows.length;
  return {
    rows,
    meanDrift: Math.round(meanDrift * 1000) / 1000,
    worstNetwork: rows[0]?.drift > 0 ? rows[0].network : null,
  };
}
