import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave45Integration } from './scenario-wave45-integration-rank.ts';
import { rankMacroScenarioWave44Integration } from './scenario-wave44-integration-rank.ts';

export interface MacroScenarioWave46IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 46 integration (wave 45 latch plus wave 44 integration cushion). */
export function rankMacroScenarioWave46Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave46IntegrationRow[] {
  const wave45 = rankMacroScenarioWave45Integration(rows);
  const wave44 = rankMacroScenarioWave44Integration(rows);
  const w45Max = Math.max(1, ...wave45.map(w => w.integrationPriority));
  const w44Max = Math.max(1, ...wave44.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w45 = wave45.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w44 = wave44.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w45 / w45Max) * 0.55 + (w44 / w44Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
