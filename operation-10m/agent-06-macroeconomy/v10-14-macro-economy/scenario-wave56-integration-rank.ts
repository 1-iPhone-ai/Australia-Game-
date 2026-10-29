import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave54Integration } from './scenario-wave54-integration-rank.ts';
import { rankMacroScenarioWave53Integration } from './scenario-wave53-integration-rank.ts';

export interface MacroScenarioWave56IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 55 integration (wave 54 latch plus wave 53 integration cushion). */
export function rankMacroScenarioWave56Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave56IntegrationRow[] {
  const wave54 = rankMacroScenarioWave54Integration(rows);
  const wave53 = rankMacroScenarioWave53Integration(rows);
  const w54Max = Math.max(1, ...wave54.map(w => w.integrationPriority));
  const w53Max = Math.max(1, ...wave53.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w54 = wave54.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w53 = wave53.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w54 / w54Max) * 0.55 + (w53 / w53Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
