import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave40Integration } from './scenario-wave40-integration-rank.ts';
import { rankMacroScenarioWave39Integration } from './scenario-wave39-integration-rank.ts';

export interface MacroScenarioWave41IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 41 integration (wave 40 latch plus wave 39 integration cushion). */
export function rankMacroScenarioWave41Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave41IntegrationRow[] {
  const wave40 = rankMacroScenarioWave40Integration(rows);
  const wave39 = rankMacroScenarioWave39Integration(rows);
  const w40Max = Math.max(1, ...wave40.map(w => w.integrationPriority));
  const w39Max = Math.max(1, ...wave39.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w40 = wave40.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w39 = wave39.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w40 / w40Max) * 0.55 + (w39 / w39Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
