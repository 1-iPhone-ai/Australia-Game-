import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashTriadMergedDerivedMajorSnippetSourceGapWave58 {
  triadMergedDerivedMajorSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** NS history plus LR major derived plus overlap lane vs snapshot snippets (triad gap). */
export function nrDashBuildTriadMergedDerivedMajorSnippetSourceGapWave58(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashTriadMergedDerivedMajorSnippetSourceGapWave58 | null {
  if (!ns?.history.length || !snap) return null;
  const majors = lr?.state.derived.filter(d => d.significance === 'major') ?? [];
  const majorTurns = new Set(majors.map(d => d.turn).filter(t => Number.isFinite(t)));
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const mergedTurns = nsTurns.filter(t => majorTurns.has(t));
  const overlapTurns = mergedTurns.length;
  const triadMergedDerivedMajorSourceCount = nsTurns.length + majors.length + overlapTurns;
  if (triadMergedDerivedMajorSourceCount <= 0) return null;
  const sourceTurns = new Set<number>([...nsTurns, ...majors.map(d => d.turn).filter(t => Number.isFinite(t))]);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    triadMergedDerivedMajorSourceCount,
    matchedSnippetCount,
    sourceGap: triadMergedDerivedMajorSourceCount - matchedSnippetCount,
  };
}
