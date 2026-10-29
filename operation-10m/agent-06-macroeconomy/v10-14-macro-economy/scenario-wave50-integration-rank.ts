import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave49Integration } from './scenario-wave49-integration-rank.ts';
import { rankMacroScenarioWave48Integration } from './scenario-wave48-integration-rank.ts';

export interface MacroScenarioWave50IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 50 integration (wave 49 latch plus wave 48 integration cushion). */
export function rankMacroScenarioWave50Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave50IntegrationRow[] {
  const wave49 = rankMacroScenarioWave49Integration(rows);
  const wave48 = rankMacroScenarioWave48Integration(rows);
  const w49Max = Math.max(1, ...wave49.map(w => w.integrationPriority));
  const w48Max = Math.max(1, ...wave48.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w49 = wave49.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w48 = wave48.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w49 / w49Max) * 0.55 + (w48 / w48Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
