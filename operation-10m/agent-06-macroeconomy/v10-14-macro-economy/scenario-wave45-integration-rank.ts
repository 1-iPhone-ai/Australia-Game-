import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioWave44Integration } from './scenario-wave44-integration-rank.ts';
import { rankMacroScenarioWave43Integration } from './scenario-wave43-integration-rank.ts';

export interface MacroScenarioWave45IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 45 integration (wave 44 latch plus wave 43 integration cushion). */
export function rankMacroScenarioWave45Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave45IntegrationRow[] {
  const wave44 = rankMacroScenarioWave44Integration(rows);
  const wave43 = rankMacroScenarioWave43Integration(rows);
  const w44Max = Math.max(1, ...wave44.map(w => w.integrationPriority));
  const w43Max = Math.max(1, ...wave43.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w44 = wave44.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w43 = wave43.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w44 / w44Max) * 0.55 + (w43 / w43Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
