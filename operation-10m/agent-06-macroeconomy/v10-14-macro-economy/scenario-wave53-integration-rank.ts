import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave52Integration } from './scenario-wave52-integration-rank.ts';
import { rankMacroScenarioWave51Integration } from './scenario-wave51-integration-rank.ts';

export interface MacroScenarioWave53IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 53 integration (wave 52 latch plus wave 51 integration cushion). */
export function rankMacroScenarioWave53Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave53IntegrationRow[] {
  const wave52 = rankMacroScenarioWave52Integration(rows);
  const wave51 = rankMacroScenarioWave51Integration(rows);
  const w52Max = Math.max(1, ...wave52.map(w => w.integrationPriority));
  const w51Max = Math.max(1, ...wave51.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w52 = wave52.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w51 = wave51.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w52 / w52Max) * 0.55 + (w51 / w51Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
