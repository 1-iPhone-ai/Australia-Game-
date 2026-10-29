import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioProsperity } from './scenario-prosperity-rank.ts';
import { rankMacroScenarioContinuity } from './scenario-continuity-rank.ts';

export interface MacroScenarioResilienceRow {
  scenarioId: string;
  resiliencePriority: number;
}

/** Rank overlays for resilience planning (prosperity upside plus continuity floor). */
export function rankMacroScenarioResilience(rows: MacroScenarioCompareRow[]): MacroScenarioResilienceRow[] {
  const prosperity = rankMacroScenarioProsperity(rows);
  const continuity = rankMacroScenarioContinuity(rows);
  const proMax = Math.max(1, ...prosperity.map(p => p.prosperityPriority));
  const conMax = Math.max(1, ...continuity.map(c => c.continuityPriority));

  return rows
    .map(row => {
      const pro = prosperity.find(p => p.scenarioId === row.scenarioId)?.prosperityPriority ?? 0;
      const con = continuity.find(c => c.scenarioId === row.scenarioId)?.continuityPriority ?? 0;
      const resiliencePriority =
        Math.round(((pro / proMax) * 0.45 + (con / conMax) * 0.55) * 1000) / 1000;
      return { scenarioId: row.scenarioId, resiliencePriority };
    })
    .sort((a, b) => b.resiliencePriority - a.resiliencePriority);
}
