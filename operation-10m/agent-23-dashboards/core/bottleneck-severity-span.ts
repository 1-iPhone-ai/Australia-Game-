import type { NationalSystemsState } from '../types.ts';

const SEVERITY_RANK: Record<string, number> = {
  minor: 0,
  meaningful: 1,
  major: 2,
  critical: 3,
};

export interface NrDashBottleneckSeveritySpan {
  activeCount: number;
  distinctSeverities: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of severity ranks across active NS bottleneck records. */
export function nrDashBuildBottleneckSeveritySpan(
  ns: NationalSystemsState | null
): NrDashBottleneckSeveritySpan | null {
  if (!ns?.bottlenecks?.length) return null;
  const ranks = ns.bottlenecks.map(b => SEVERITY_RANK[b.severity ?? ''] ?? 1);
  const distinct = new Set(ranks);
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    activeCount: ns.bottlenecks.length,
    distinctSeverities: distinct.size,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}
