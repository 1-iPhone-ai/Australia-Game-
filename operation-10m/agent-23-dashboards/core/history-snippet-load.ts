import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashHistorySnippetLoad {
  snippetCount: number;
  maxSnippets: number;
  loadRatio: number;
}

/** Dashboard history snippet buffer utilization (LR majors + NS history). */
export function nrDashBuildHistorySnippetLoad(snap: NrDashAuthSnapshot | null): NrDashHistorySnippetLoad | null {
  if (!snap) return null;
  const maxSnippets = 8;
  const snippetCount = snap.historySnippets.length;
  return {
    snippetCount,
    maxSnippets,
    loadRatio: Math.round((snippetCount / maxSnippets) * 1000) / 1000,
  };
}
