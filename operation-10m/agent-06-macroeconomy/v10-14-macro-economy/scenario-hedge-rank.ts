import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { scenarioNetScore } from './scenario-ranking.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';

export interface MacroScenarioHedgeRow {
  scenarioId: string;
  netScore: number;
  hedgeIndex: number;
}

/** Rank overlays that best hedge baseline stress (high net score, lower severity). */
export function rankMacroScenarioHedge(rows: MacroScenarioCompareRow[]): MacroScenarioHedgeRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));

  return rows
    .map(row => {
      const netScore = scenarioNetScore(row);
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const hedgeIndex = Math.round((Math.max(0, netScore) * 0.55 + (1 - sev / sevMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, netScore, hedgeIndex };
    })
    .sort((a, b) => b.hedgeIndex - a.hedgeIndex);
}
