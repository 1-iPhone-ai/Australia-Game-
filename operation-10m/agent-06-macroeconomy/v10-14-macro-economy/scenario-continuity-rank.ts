import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioViability } from './scenario-viability-rank.ts';
import { rankMacroScenarioRegeneration } from './scenario-regeneration-rank.ts';

export interface MacroScenarioContinuityRow {
  scenarioId: string;
  continuityPriority: number;
}

/** Rank overlays for continuity planning (viability balance plus regeneration depth). */
export function rankMacroScenarioContinuity(rows: MacroScenarioCompareRow[]): MacroScenarioContinuityRow[] {
  const viability = rankMacroScenarioViability(rows);
  const regeneration = rankMacroScenarioRegeneration(rows);
  const viaMax = Math.max(1, ...viability.map(v => v.viabilityPriority));
  const regMax = Math.max(1, ...regeneration.map(r => r.regenerationPriority));

  return rows
    .map(row => {
      const via = viability.find(v => v.scenarioId === row.scenarioId)?.viabilityPriority ?? 0;
      const reg = regeneration.find(r => r.scenarioId === row.scenarioId)?.regenerationPriority ?? 0;
      const continuityPriority =
        Math.round(((via / viaMax) * 0.5 + (reg / regMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, continuityPriority };
    })
    .sort((a, b) => b.continuityPriority - a.continuityPriority);
}
