import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioConvergence } from './scenario-convergence.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';

export interface MacroScenarioRecoveryRow {
  scenarioId: string;
  recoveryPriority: number;
}

/** Rank overlays for recovery planning (convergence minus severity pressure). */
export function rankMacroScenarioRecovery(rows: MacroScenarioCompareRow[]): MacroScenarioRecoveryRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const convergence = rankMacroScenarioConvergence(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));
  const convMax = Math.max(1, ...convergence.map(c => c.convergenceIndex));

  return rows
    .map(row => {
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const conv = convergence.find(c => c.scenarioId === row.scenarioId)?.convergenceIndex ?? 0;
      const recoveryPriority =
        Math.round(((conv / convMax) * 0.6 + (1 - sev / sevMax) * 0.4) * 1000) / 1000;
      return { scenarioId: row.scenarioId, recoveryPriority };
    })
    .sort((a, b) => b.recoveryPriority - a.recoveryPriority);
}
