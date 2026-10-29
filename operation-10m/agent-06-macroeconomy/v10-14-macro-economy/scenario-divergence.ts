import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { scenarioNetScore } from './scenario-ranking.ts';

export interface MacroScenarioDivergenceRow {
  scenarioId: string;
  netScore: number;
  divergenceIndex: number;
}

/** Rank scenario overlays by absolute distance from the weakest net outcome (stress prioritization). */
export function rankMacroScenarioDivergence(rows: MacroScenarioCompareRow[]): MacroScenarioDivergenceRow[] {
  const scored = rows.map(row => ({
    scenarioId: row.scenarioId,
    netScore: scenarioNetScore(row)
  }));
  const anchor = scored.reduce((min, row) => (row.netScore < min ? row.netScore : min), scored[0]?.netScore ?? 0);

  return scored
    .map(row => ({
      scenarioId: row.scenarioId,
      netScore: row.netScore,
      divergenceIndex: Math.round(Math.abs(row.netScore - anchor) * 100) / 100
    }))
    .sort((a, b) => b.divergenceIndex - a.divergenceIndex);
}
