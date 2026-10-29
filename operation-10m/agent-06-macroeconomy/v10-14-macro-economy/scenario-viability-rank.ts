import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioSustainability } from './scenario-sustainability-rank.ts';
import { rankMacroScenarioRevival } from './scenario-revival-rank.ts';

export interface MacroScenarioViabilityRow {
  scenarioId: string;
  viabilityPriority: number;
}

/** Rank overlays for viability planning (sustainability balance plus revival upside). */
export function rankMacroScenarioViability(rows: MacroScenarioCompareRow[]): MacroScenarioViabilityRow[] {
  const sustainability = rankMacroScenarioSustainability(rows);
  const revival = rankMacroScenarioRevival(rows);
  const susMax = Math.max(1, ...sustainability.map(s => s.sustainabilityPriority));
  const revMax = Math.max(1, ...revival.map(r => r.revivalPriority));

  return rows
    .map(row => {
      const sus = sustainability.find(s => s.scenarioId === row.scenarioId)?.sustainabilityPriority ?? 0;
      const rev = revival.find(r => r.scenarioId === row.scenarioId)?.revivalPriority ?? 0;
      const viabilityPriority =
        Math.round(((sus / susMax) * 0.5 + (rev / revMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, viabilityPriority };
    })
    .sort((a, b) => b.viabilityPriority - a.viabilityPriority);
}
