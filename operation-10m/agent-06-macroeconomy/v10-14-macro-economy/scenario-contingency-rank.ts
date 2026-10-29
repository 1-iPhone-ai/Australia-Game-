import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';
import { rankMacroScenarioTriage } from './scenario-triage-rank.ts';

export interface MacroScenarioContingencyRow {
  scenarioId: string;
  contingencyPriority: number;
}

/** Rank overlays for contingency planning (severity + triage, hedge-neutral). */
export function rankMacroScenarioContingency(rows: MacroScenarioCompareRow[]): MacroScenarioContingencyRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const triage = rankMacroScenarioTriage(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));
  const triMax = Math.max(1, ...triage.map(t => t.triagePriority));

  return rows
    .map(row => {
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const tri = triage.find(t => t.scenarioId === row.scenarioId)?.triagePriority ?? 0;
      const contingencyPriority =
        Math.round(((sev / sevMax) * 0.55 + (tri / triMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, contingencyPriority };
    })
    .sort((a, b) => b.contingencyPriority - a.contingencyPriority);
}
