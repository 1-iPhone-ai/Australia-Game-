import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { scenarioNetScore } from './scenario-ranking.ts';

export interface MacroScenarioConvergenceRow {
  scenarioId: string;
  netScore: number;
  distanceFromBaseline: number;
  convergenceIndex: number;
}

/** Rank scenario overlays by closeness to baseline net outcome (lab reconciliation). */
export function rankMacroScenarioConvergence(
  rows: MacroScenarioCompareRow[],
  baselineNetScore?: number
): MacroScenarioConvergenceRow[] {
  const baseline =
    baselineNetScore ??
    rows.reduce((best, row) => {
      const score = scenarioNetScore(row);
      return Math.abs(score) < Math.abs(best) ? score : best;
    }, scenarioNetScore(rows[0] ?? { scenarioId: 'baseline', delta: { cycleDelta: 0, investmentDelta: 0, productivityDelta: 0, outputDelta: 0 }, stressScore: 0, capacityIndex: 0 }));

  return rows
    .map(row => {
      const netScore = scenarioNetScore(row);
      const distanceFromBaseline = Math.round(Math.abs(netScore - baseline) * 100) / 100;
      const convergenceIndex = Math.round(Math.max(0, 100 - distanceFromBaseline * 8) * 10) / 10;
      return { scenarioId: row.scenarioId, netScore, distanceFromBaseline, convergenceIndex };
    })
    .sort((a, b) => b.convergenceIndex - a.convergenceIndex);
}
