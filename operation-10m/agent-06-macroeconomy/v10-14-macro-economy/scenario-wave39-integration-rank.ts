import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave38Integration } from './scenario-wave38-integration-rank.ts';
import { rankMacroScenarioWave37Integration } from './scenario-wave37-integration-rank.ts';

export interface MacroScenarioWave39IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 39 integration (wave 38 latch plus wave 37 integration cushion). */
export function rankMacroScenarioWave39Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave39IntegrationRow[] {
  const wave38 = rankMacroScenarioWave38Integration(rows);
  const wave37 = rankMacroScenarioWave37Integration(rows);
  const w38Max = Math.max(1, ...wave38.map(w => w.integrationPriority));
  const w37Max = Math.max(1, ...wave37.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w38 = wave38.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w37 = wave37.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w38 / w38Max) * 0.55 + (w37 / w37Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
