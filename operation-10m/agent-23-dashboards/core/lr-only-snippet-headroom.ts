import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashLrOnlySnippetHeadroom {
  lrSnippetCap: number;
  surfacedCount: number;
  headroomSlots: number;
  headroomShare: number;
}

/** Unused LR major-derived snippet lane on snapshots built from Living Regions only. */
export function nrDashBuildLrOnlySnippetHeadroom(
  snap: NrDashAuthSnapshot | null
): NrDashLrOnlySnippetHeadroom | null {
  if (!snap) return null;
  const hasLr = snap.provenance.some(p => p.source === 'living_regions');
  const hasNs = snap.provenance.some(p => p.source === 'national_systems');
  if (!hasLr || hasNs) return null;
  const lrSnippetCap = 3;
  const surfacedCount = snap.historySnippets.length;
  const headroomSlots = lrSnippetCap - surfacedCount;
  return {
    lrSnippetCap,
    surfacedCount,
    headroomSlots,
    headroomShare: Math.round((headroomSlots / lrSnippetCap) * 1000) / 1000,
  };
}
