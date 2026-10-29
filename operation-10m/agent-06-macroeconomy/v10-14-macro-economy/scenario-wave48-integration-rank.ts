import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave47Integration } from './scenario-wave47-integration-rank.ts';
import { rankMacroScenarioWave46Integration } from './scenario-wave46-integration-rank.ts';

export interface MacroScenarioWave48IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 48 integration (wave 47 latch plus wave 46 integration cushion). */
export function rankMacroScenarioWave48Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave48IntegrationRow[] {
  const wave47 = rankMacroScenarioWave47Integration(rows);
  const wave46 = rankMacroScenarioWave46Integration(rows);
  const w47Max = Math.max(1, ...wave47.map(w => w.integrationPriority));
  const w46Max = Math.max(1, ...wave46.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w47 = wave47.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w46 = wave46.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w47 / w47Max) * 0.55 + (w46 / w46Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
