import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioProsperity } from './scenario-prosperity-rank.ts';
import { rankMacroScenarioWave36Integration } from './scenario-wave36-integration-rank.ts';

export interface MacroScenarioWave37IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 37 integration (wave 36 integration latch plus prosperity cushion). */
export function rankMacroScenarioWave37Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave37IntegrationRow[] {
  const wave36 = rankMacroScenarioWave36Integration(rows);
  const prosperity = rankMacroScenarioProsperity(rows);
  const w36Max = Math.max(1, ...wave36.map(w => w.integrationPriority));
  const proMax = Math.max(1, ...prosperity.map(p => p.prosperityPriority));

  return rows
    .map(row => {
      const w36 = wave36.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const pro = prosperity.find(p => p.scenarioId === row.scenarioId)?.prosperityPriority ?? 0;
      const integrationPriority =
        Math.round(((w36 / w36Max) * 0.5 + (pro / proMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
