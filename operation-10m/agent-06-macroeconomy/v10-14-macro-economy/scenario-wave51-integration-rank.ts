import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave50Integration } from './scenario-wave50-integration-rank.ts';
import { rankMacroScenarioWave49Integration } from './scenario-wave49-integration-rank.ts';

export interface MacroScenarioWave51IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 51 integration (wave 50 latch plus wave 49 integration cushion). */
export function rankMacroScenarioWave51Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave51IntegrationRow[] {
  const wave50 = rankMacroScenarioWave50Integration(rows);
  const wave49 = rankMacroScenarioWave49Integration(rows);
  const w50Max = Math.max(1, ...wave50.map(w => w.integrationPriority));
  const w49Max = Math.max(1, ...wave49.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w50 = wave50.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w49 = wave49.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w50 / w50Max) * 0.55 + (w49 / w49Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
