import type { NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNationalDependencyGap {
  listCount: number;
  snapshotCount: number;
  gap: number;
}

/** Delta between NS dependency list length and merged snapshot dependencyCount. */
export function nrDashBuildNationalDependencyGap(
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNationalDependencyGap | null {
  if (!ns || !snap) return null;
  const listCount = ns.dependencies.length;
  const snapshotCount = snap.dependencyCount;
  return {
    listCount,
    snapshotCount,
    gap: listCount - snapshotCount,
  };
}
