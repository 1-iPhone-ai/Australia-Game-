import type { MacroScenarioCompareRow } from './scenario-compare.ts';

/** Rank scenario overlays by net macro outcome (output lift minus stress penalty). */
export function rankMacroEconomyScenariosByNetOutcome(rows: MacroScenarioCompareRow[]): MacroScenarioCompareRow[] {
  return [...rows].sort((a, b) => scenarioNetScore(b) - scenarioNetScore(a));
}

export function scenarioNetScore(row: MacroScenarioCompareRow): number {
  return (
    row.delta.outputIndexDelta +
    row.delta.productivityScoreDelta * 0.15 +
    row.delta.cycleScoreDelta * 10 -
    row.stressScore * 0.08 -
    Math.max(0, 60 - row.capacityIndex) * 0.02
  );
}
