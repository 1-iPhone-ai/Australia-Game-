import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave48Integration } from './scenario-wave48-integration-rank.ts';
import { rankMacroScenarioWave47Integration } from './scenario-wave47-integration-rank.ts';

export interface MacroScenarioWave49IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 49 integration (wave 48 latch plus wave 47 integration cushion). */
export function rankMacroScenarioWave49Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave49IntegrationRow[] {
  const wave48 = rankMacroScenarioWave48Integration(rows);
  const wave47 = rankMacroScenarioWave47Integration(rows);
  const w48Max = Math.max(1, ...wave48.map(w => w.integrationPriority));
  const w47Max = Math.max(1, ...wave47.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w48 = wave48.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w47 = wave47.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w48 / w48Max) * 0.55 + (w47 / w47Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
