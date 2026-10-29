import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioConvergence } from './scenario-convergence.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';

export interface MacroScenarioProjectionSyncRow {
  scenarioId: string;
  syncPriority: number;
}

/** Rank overlays for forecast projection sync planning (convergence minus severity drag). */
export function rankMacroScenarioProjectionSync(rows: MacroScenarioCompareRow[]): MacroScenarioProjectionSyncRow[] {
  const convergence = rankMacroScenarioConvergence(rows);
  const severity = rankMacroScenarioSeverity(rows);
  const convMax = Math.max(1, ...convergence.map(c => c.convergenceIndex));
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));

  return rows
    .map(row => {
      const conv = convergence.find(c => c.scenarioId === row.scenarioId)?.convergenceIndex ?? 0;
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const syncPriority =
        Math.round(((conv / convMax) * 0.6 + (1 - sev / sevMax) * 0.4) * 1000) / 1000;
      return { scenarioId: row.scenarioId, syncPriority };
    })
    .sort((a, b) => b.syncPriority - a.syncPriority);
}
