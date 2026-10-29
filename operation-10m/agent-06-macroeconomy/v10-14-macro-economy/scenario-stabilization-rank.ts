import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioResilience } from './scenario-resilience-rank.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';

export interface MacroScenarioStabilizationRow {
  scenarioId: string;
  stabilizationPriority: number;
}

/** Rank overlays for stabilization planning (resilience minus severity pressure). */
export function rankMacroScenarioStabilization(rows: MacroScenarioCompareRow[]): MacroScenarioStabilizationRow[] {
  const resilience = rankMacroScenarioResilience(rows);
  const severity = rankMacroScenarioSeverity(rows);
  const resMax = Math.max(1, ...resilience.map(r => r.resiliencePriority));
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));

  return rows
    .map(row => {
      const res = resilience.find(r => r.scenarioId === row.scenarioId)?.resiliencePriority ?? 0;
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const stabilizationPriority =
        Math.round(((res / resMax) * 0.65 + (1 - sev / sevMax) * 0.35) * 1000) / 1000;
      return { scenarioId: row.scenarioId, stabilizationPriority };
    })
    .sort((a, b) => b.stabilizationPriority - a.stabilizationPriority);
}
