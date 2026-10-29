import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioConsolidation } from './scenario-consolidation-rank.ts';
import { rankMacroScenarioMitigation } from './scenario-mitigation-rank.ts';

export interface MacroScenarioEquilibriumRow {
  scenarioId: string;
  equilibriumPriority: number;
}

/** Rank overlays for equilibrium planning (consolidation balance plus mitigation cushion). */
export function rankMacroScenarioEquilibrium(rows: MacroScenarioCompareRow[]): MacroScenarioEquilibriumRow[] {
  const consolidation = rankMacroScenarioConsolidation(rows);
  const mitigation = rankMacroScenarioMitigation(rows);
  const conMax = Math.max(1, ...consolidation.map(c => c.consolidationPriority));
  const mitMax = Math.max(1, ...mitigation.map(m => m.mitigationPriority));

  return rows
    .map(row => {
      const con = consolidation.find(c => c.scenarioId === row.scenarioId)?.consolidationPriority ?? 0;
      const mit = mitigation.find(m => m.scenarioId === row.scenarioId)?.mitigationPriority ?? 0;
      const equilibriumPriority =
        Math.round(((con / conMax) * 0.5 + (mit / mitMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, equilibriumPriority };
    })
    .sort((a, b) => b.equilibriumPriority - a.equilibriumPriority);
}
