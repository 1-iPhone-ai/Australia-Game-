import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioRevival } from './scenario-revival-rank.ts';
import { rankMacroScenarioAdaptation } from './scenario-adaptation-rank.ts';

export interface MacroScenarioRegenerationRow {
  scenarioId: string;
  regenerationPriority: number;
}

/** Rank overlays for regeneration planning (revival cushion plus adaptation headroom). */
export function rankMacroScenarioRegeneration(rows: MacroScenarioCompareRow[]): MacroScenarioRegenerationRow[] {
  const revival = rankMacroScenarioRevival(rows);
  const adaptation = rankMacroScenarioAdaptation(rows);
  const revMax = Math.max(1, ...revival.map(r => r.revivalPriority));
  const adMax = Math.max(1, ...adaptation.map(a => a.adaptationPriority));

  return rows
    .map(row => {
      const rev = revival.find(r => r.scenarioId === row.scenarioId)?.revivalPriority ?? 0;
      const ad = adaptation.find(a => a.scenarioId === row.scenarioId)?.adaptationPriority ?? 0;
      const regenerationPriority =
        Math.round(((rev / revMax) * 0.55 + (ad / adMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, regenerationPriority };
    })
    .sort((a, b) => b.regenerationPriority - a.regenerationPriority);
}
