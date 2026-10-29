import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioHedge } from './scenario-hedge-rank.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';

export interface MacroScenarioTriageRow {
  scenarioId: string;
  triagePriority: number;
}

/** Rank overlays for policy triage (high severity, low hedge priority first). */
export function rankMacroScenarioTriage(rows: MacroScenarioCompareRow[]): MacroScenarioTriageRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const hedge = rankMacroScenarioHedge(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));
  const hedgeMax = Math.max(1, ...hedge.map(h => h.hedgeIndex));

  return rows
    .map(row => {
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const hed = hedge.find(h => h.scenarioId === row.scenarioId)?.hedgeIndex ?? 0;
      const triagePriority =
        Math.round(((sev / sevMax) * 0.7 + (1 - hed / hedgeMax) * 0.3) * 1000) / 1000;
      return { scenarioId: row.scenarioId, triagePriority };
    })
    .sort((a, b) => b.triagePriority - a.triagePriority);
}
