import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioContainment } from './scenario-containment-rank.ts';
import { rankMacroScenarioHedge } from './scenario-hedge-rank.ts';

export interface MacroScenarioRebalanceRow {
  scenarioId: string;
  rebalancePriority: number;
}

/** Rank overlays for rebalance planning (containment plus hedge cushion). */
export function rankMacroScenarioRebalance(rows: MacroScenarioCompareRow[]): MacroScenarioRebalanceRow[] {
  const containment = rankMacroScenarioContainment(rows);
  const hedge = rankMacroScenarioHedge(rows);
  const conMax = Math.max(1, ...containment.map(c => c.containmentPriority));
  const hedMax = Math.max(1, ...hedge.map(h => h.hedgeIndex));

  return rows
    .map(row => {
      const con = containment.find(c => c.scenarioId === row.scenarioId)?.containmentPriority ?? 0;
      const hed = hedge.find(h => h.scenarioId === row.scenarioId)?.hedgeIndex ?? 0;
      const rebalancePriority =
        Math.round(((con / conMax) * 0.55 + (hed / hedMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, rebalancePriority };
    })
    .sort((a, b) => b.rebalancePriority - a.rebalancePriority);
}
