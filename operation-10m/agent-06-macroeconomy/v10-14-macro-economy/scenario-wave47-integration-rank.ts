import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave46Integration } from './scenario-wave46-integration-rank.ts';
import { rankMacroScenarioWave45Integration } from './scenario-wave45-integration-rank.ts';

export interface MacroScenarioWave47IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 47 integration (wave 46 latch plus wave 45 integration cushion). */
export function rankMacroScenarioWave47Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave47IntegrationRow[] {
  const wave46 = rankMacroScenarioWave46Integration(rows);
  const wave45 = rankMacroScenarioWave45Integration(rows);
  const w46Max = Math.max(1, ...wave46.map(w => w.integrationPriority));
  const w45Max = Math.max(1, ...wave45.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w46 = wave46.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w45 = wave45.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w46 / w46Max) * 0.55 + (w45 / w45Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
