import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave42Integration } from './scenario-wave42-integration-rank.ts';
import { rankMacroScenarioWave41Integration } from './scenario-wave41-integration-rank.ts';

export interface MacroScenarioWave43IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 43 integration (wave 42 latch plus wave 41 integration cushion). */
export function rankMacroScenarioWave43Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave43IntegrationRow[] {
  const wave42 = rankMacroScenarioWave42Integration(rows);
  const wave41 = rankMacroScenarioWave41Integration(rows);
  const w42Max = Math.max(1, ...wave42.map(w => w.integrationPriority));
  const w41Max = Math.max(1, ...wave41.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w42 = wave42.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w41 = wave41.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w42 / w42Max) * 0.55 + (w41 / w41Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
