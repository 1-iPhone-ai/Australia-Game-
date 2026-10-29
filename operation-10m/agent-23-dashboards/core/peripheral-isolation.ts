import { nrDashBuildMapHubIndex } from './map-hub-index.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashPeripheralIsolationRow {
  regionId: string;
  hubScore: number;
  /** Higher = more peripheral (low connectivity). */
  isolationScore: number;
}

export interface NrDashPeripheralIsolationSummary {
  rows: NrDashPeripheralIsolationRow[];
  maxHubScore: number;
}

/** Regions farthest from the connectivity core (inverse of map hub score). */
export function nrDashBuildPeripheralIsolation(ns: NationalSystemsState | null): NrDashPeripheralIsolationSummary | null {
  const hubs = nrDashBuildMapHubIndex(ns);
  if (!hubs.length) return null;
  const maxHubScore = Math.max(...hubs.map(h => h.hubScore), 1);
  const rows: NrDashPeripheralIsolationRow[] = hubs.map(h => ({
    regionId: h.regionId,
    hubScore: h.hubScore,
    isolationScore: Math.round((1 - h.hubScore / maxHubScore) * 1000) / 1000,
  }));
  rows.sort((a, b) => b.isolationScore - a.isolationScore || a.regionId.localeCompare(b.regionId));
  return { rows, maxHubScore };
}

export function nrDashTopPeripheralRegions(ns: NationalSystemsState | null, limit = 3): NrDashPeripheralIsolationRow[] {
  return nrDashBuildPeripheralIsolation(ns)?.rows.slice(0, limit) ?? [];
}
