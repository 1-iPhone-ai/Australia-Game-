import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioContinuity } from './scenario-continuity-rank.ts';
import { rankMacroScenarioFrontier } from './scenario-frontier-rank.ts';

export interface MacroScenarioProsperityRow {
  scenarioId: string;
  prosperityPriority: number;
}

/** Rank overlays for prosperity planning (continuity balance plus frontier upside). */
export function rankMacroScenarioProsperity(rows: MacroScenarioCompareRow[]): MacroScenarioProsperityRow[] {
  const continuity = rankMacroScenarioContinuity(rows);
  const frontier = rankMacroScenarioFrontier(rows);
  const conMax = Math.max(1, ...continuity.map(c => c.continuityPriority));
  const frMax = Math.max(1, ...frontier.map(f => f.frontierScore));

  return rows
    .map(row => {
      const con = continuity.find(c => c.scenarioId === row.scenarioId)?.continuityPriority ?? 0;
      const fr = frontier.find(f => f.scenarioId === row.scenarioId)?.frontierScore ?? 0;
      const prosperityPriority =
        Math.round(((con / conMax) * 0.55 + (fr / frMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, prosperityPriority };
    })
    .sort((a, b) => b.prosperityPriority - a.prosperityPriority);
}
