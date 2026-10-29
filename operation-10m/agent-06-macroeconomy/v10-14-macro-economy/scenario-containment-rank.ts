import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioAdaptation } from './scenario-adaptation-rank.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';

export interface MacroScenarioContainmentRow {
  scenarioId: string;
  containmentPriority: number;
}

/** Rank overlays for containment planning (adaptation minus severity tail risk). */
export function rankMacroScenarioContainment(rows: MacroScenarioCompareRow[]): MacroScenarioContainmentRow[] {
  const adaptation = rankMacroScenarioAdaptation(rows);
  const severity = rankMacroScenarioSeverity(rows);
  const adMax = Math.max(1, ...adaptation.map(a => a.adaptationPriority));
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));

  return rows
    .map(row => {
      const ad = adaptation.find(a => a.scenarioId === row.scenarioId)?.adaptationPriority ?? 0;
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const containmentPriority =
        Math.round(((ad / adMax) * 0.6 + (1 - sev / sevMax) * 0.4) * 1000) / 1000;
      return { scenarioId: row.scenarioId, containmentPriority };
    })
    .sort((a, b) => b.containmentPriority - a.containmentPriority);
}
