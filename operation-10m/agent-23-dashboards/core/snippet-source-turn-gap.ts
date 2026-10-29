import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashSnippetSourceTurnGap {
  sourceEventCount: number;
  snippetLabelCount: number;
  sourceTurnGap: number;
}

/** Delta between authoritative NS/LR history event count and surfaced snippet labels. */
export function nrDashBuildSnippetSourceTurnGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: { historySnippets: string[] } | null
): NrDashSnippetSourceTurnGap | null {
  if (!snap) return null;
  const nsCount = ns?.history.length ?? 0;
  const derivedCount = lr?.state.derived.length ?? 0;
  const sourceEventCount = nsCount + derivedCount;
  const snippetLabelCount = snap.historySnippets.length;
  if (sourceEventCount <= 0 && snippetLabelCount <= 0) return null;
  return {
    sourceEventCount,
    snippetLabelCount,
    sourceTurnGap: sourceEventCount - snippetLabelCount,
  };
}
