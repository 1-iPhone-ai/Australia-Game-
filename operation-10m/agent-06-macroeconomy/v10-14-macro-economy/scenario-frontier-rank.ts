import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioConvergence } from './scenario-convergence.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';

export interface MacroScenarioFrontierRow {
  scenarioId: string;
  frontierScore: number;
}

/** Rank scenarios on severity–convergence frontier (high severity, low convergence → front). */
export function rankMacroScenarioFrontier(rows: MacroScenarioCompareRow[]): MacroScenarioFrontierRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const convergence = rankMacroScenarioConvergence(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));
  const convMax = Math.max(1, ...convergence.map(c => c.convergenceIndex));

  return rows
    .map(row => {
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const conv = convergence.find(c => c.scenarioId === row.scenarioId)?.convergenceIndex ?? 0;
      const frontierScore = Math.round(((sev / sevMax) * 0.65 + (1 - conv / convMax) * 0.35) * 1000) / 1000;
      return { scenarioId: row.scenarioId, frontierScore };
    })
    .sort((a, b) => b.frontierScore - a.frontierScore);
}
