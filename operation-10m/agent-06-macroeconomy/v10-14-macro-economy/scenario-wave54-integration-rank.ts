import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave53Integration } from './scenario-wave53-integration-rank.ts';
import { rankMacroScenarioWave52Integration } from './scenario-wave52-integration-rank.ts';

export interface MacroScenarioWave54IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 54 integration (wave 53 latch plus wave 52 integration cushion). */
export function rankMacroScenarioWave54Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave54IntegrationRow[] {
  const wave53 = rankMacroScenarioWave53Integration(rows);
  const wave52 = rankMacroScenarioWave52Integration(rows);
  const w53Max = Math.max(1, ...wave53.map(w => w.integrationPriority));
  const w52Max = Math.max(1, ...wave52.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w53 = wave53.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w52 = wave52.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w53 / w53Max) * 0.55 + (w52 / w52Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
