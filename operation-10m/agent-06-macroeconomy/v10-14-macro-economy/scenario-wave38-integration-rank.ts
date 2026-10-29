import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave37Integration } from './scenario-wave37-integration-rank.ts';
import { rankMacroScenarioWave36Integration } from './scenario-wave36-integration-rank.ts';

export interface MacroScenarioWave38IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 38 integration (wave 37 latch plus wave 36 integration cushion). */
export function rankMacroScenarioWave38Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave38IntegrationRow[] {
  const wave37 = rankMacroScenarioWave37Integration(rows);
  const wave36 = rankMacroScenarioWave36Integration(rows);
  const w37Max = Math.max(1, ...wave37.map(w => w.integrationPriority));
  const w36Max = Math.max(1, ...wave36.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w37 = wave37.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w36 = wave36.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w37 / w37Max) * 0.55 + (w36 / w36Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
