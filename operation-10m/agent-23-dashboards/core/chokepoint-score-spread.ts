import { nrDashBuildDependencyChokepoints } from './dependency-chokepoint.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashChokepointScoreSpread {
  edgeCount: number;
  meanScore: number;
  stdDev: number;
  maxScore: number;
}

/** Dispersion of NS dependency chokepoint scores (endpoint stress weighted). */
export function nrDashBuildChokepointScoreSpread(
  ns: NationalSystemsState | null
): NrDashChokepointScoreSpread | null {
  const rows = nrDashBuildDependencyChokepoints(ns);
  if (!rows.length) return null;
  const scores = rows.map(r => r.chokeScore);
  const meanScore = scores.reduce((s, n) => s + n, 0) / scores.length;
  const variance =
    scores.reduce((s, n) => s + (n - meanScore) ** 2, 0) / Math.max(scores.length, 1);
  return {
    edgeCount: scores.length,
    meanScore: Math.round(meanScore * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    maxScore: Math.max(...scores),
  };
}
