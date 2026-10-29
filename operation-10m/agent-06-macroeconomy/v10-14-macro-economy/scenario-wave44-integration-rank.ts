import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave43Integration } from './scenario-wave43-integration-rank.ts';
import { rankMacroScenarioWave42Integration } from './scenario-wave42-integration-rank.ts';

export interface MacroScenarioWave44IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 44 integration (wave 43 latch plus wave 42 integration cushion). */
export function rankMacroScenarioWave44Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave44IntegrationRow[] {
  const wave43 = rankMacroScenarioWave43Integration(rows);
  const wave42 = rankMacroScenarioWave42Integration(rows);
  const w43Max = Math.max(1, ...wave43.map(w => w.integrationPriority));
  const w42Max = Math.max(1, ...wave42.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w43 = wave43.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w42 = wave42.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w43 / w43Max) * 0.55 + (w42 / w42Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
