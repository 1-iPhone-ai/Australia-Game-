import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave41Integration } from './scenario-wave41-integration-rank.ts';
import { rankMacroScenarioWave40Integration } from './scenario-wave40-integration-rank.ts';

export interface MacroScenarioWave42IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 42 integration (wave 41 latch plus wave 40 integration cushion). */
export function rankMacroScenarioWave42Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave42IntegrationRow[] {
  const wave41 = rankMacroScenarioWave41Integration(rows);
  const wave40 = rankMacroScenarioWave40Integration(rows);
  const w41Max = Math.max(1, ...wave41.map(w => w.integrationPriority));
  const w40Max = Math.max(1, ...wave40.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w41 = wave41.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w40 = wave40.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w41 / w41Max) * 0.55 + (w40 / w40Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
