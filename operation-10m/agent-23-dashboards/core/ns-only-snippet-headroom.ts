import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNsOnlySnippetHeadroom {
  nsSnippetCap: number;
  surfacedCount: number;
  headroomSlots: number;
  headroomShare: number;
}

/** Unused NS history snippet lane on snapshots built from National Systems only. */
export function nrDashBuildNsOnlySnippetHeadroom(
  snap: NrDashAuthSnapshot | null
): NrDashNsOnlySnippetHeadroom | null {
  if (!snap) return null;
  const hasNs = snap.provenance.some(p => p.source === 'national_systems');
  const hasLr = snap.provenance.some(p => p.source === 'living_regions');
  if (!hasNs || hasLr) return null;
  const nsSnippetCap = 4;
  const surfacedCount = snap.historySnippets.length;
  const headroomSlots = nsSnippetCap - surfacedCount;
  return {
    nsSnippetCap,
    surfacedCount,
    headroomSlots,
    headroomShare: Math.round((headroomSlots / nsSnippetCap) * 1000) / 1000,
  };
}
