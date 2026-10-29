import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave39Integration } from './scenario-wave39-integration-rank.ts';
import { rankMacroScenarioWave38Integration } from './scenario-wave38-integration-rank.ts';

export interface MacroScenarioWave40IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 40 integration (wave 39 latch plus wave 38 integration cushion). */
export function rankMacroScenarioWave40Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave40IntegrationRow[] {
  const wave39 = rankMacroScenarioWave39Integration(rows);
  const wave38 = rankMacroScenarioWave38Integration(rows);
  const w39Max = Math.max(1, ...wave39.map(w => w.integrationPriority));
  const w38Max = Math.max(1, ...wave38.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w39 = wave39.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w38 = wave38.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w39 / w39Max) * 0.55 + (w38 / w38Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
