import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNationalSnippetSaturationGap {
  maxSnippets: number;
  snippetCount: number;
  saturationGap: number;
  headroomShare: number;
}

/** Unused dashboard snippet buffer slots on a merged LR+NS national snapshot. */
export function nrDashBuildNationalSnippetSaturationGap(
  snap: NrDashAuthSnapshot | null
): NrDashNationalSnippetSaturationGap | null {
  if (!snap?.regions.length) return null;
  const hasLr = snap.provenance.some(p => p.source === 'living_regions');
  const hasNs = snap.provenance.some(p => p.source === 'national_systems');
  if (!hasLr || !hasNs) return null;
  const maxSnippets = 8;
  const snippetCount = snap.historySnippets.length;
  const saturationGap = maxSnippets - snippetCount;
  return {
    maxSnippets,
    snippetCount,
    saturationGap,
    headroomShare: Math.round((saturationGap / maxSnippets) * 1000) / 1000,
  };
}
