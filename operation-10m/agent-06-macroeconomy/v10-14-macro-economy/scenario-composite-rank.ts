import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioConvergence } from './scenario-convergence.ts';
import { rankMacroScenarioElasticity } from './scenario-elasticity.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';

export interface MacroScenarioCompositeRow {
  scenarioId: string;
  compositeScore: number;
}

/** Lab composite rank blending severity, elasticity, and convergence (higher = more policy attention). */
export function rankMacroScenarioComposite(rows: MacroScenarioCompareRow[]): MacroScenarioCompositeRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const elasticity = rankMacroScenarioElasticity(rows);
  const convergence = rankMacroScenarioConvergence(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));
  const elMax = Math.max(1, ...elasticity.map(e => e.elasticity));
  const convMax = Math.max(1, ...convergence.map(c => c.convergenceIndex));

  return rows
    .map(row => {
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const el = elasticity.find(e => e.scenarioId === row.scenarioId)?.elasticity ?? 0;
      const conv = convergence.find(c => c.scenarioId === row.scenarioId)?.convergenceIndex ?? 0;
      const compositeScore =
        Math.round(((sev / sevMax) * 0.5 + (el / elMax) * 0.3 + (1 - conv / convMax) * 0.2) * 1000) / 1000;
      return { scenarioId: row.scenarioId, compositeScore };
    })
    .sort((a, b) => b.compositeScore - a.compositeScore);
}
