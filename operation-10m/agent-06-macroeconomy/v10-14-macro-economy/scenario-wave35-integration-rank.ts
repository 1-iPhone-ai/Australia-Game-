import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioProsperity } from './scenario-prosperity-rank.ts';
import { rankMacroScenarioProjectionSync } from './scenario-projection-sync-rank.ts';

export interface MacroScenarioWave35IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 35 integration (prosperity upside plus projection-sync latch). */
export function rankMacroScenarioWave35Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave35IntegrationRow[] {
  const prosperity = rankMacroScenarioProsperity(rows);
  const projection = rankMacroScenarioProjectionSync(rows);
  const proMax = Math.max(1, ...prosperity.map(p => p.prosperityPriority));
  const projMax = Math.max(1, ...projection.map(p => p.syncPriority));

  return rows
    .map(row => {
      const pro = prosperity.find(p => p.scenarioId === row.scenarioId)?.prosperityPriority ?? 0;
      const proj = projection.find(p => p.scenarioId === row.scenarioId)?.syncPriority ?? 0;
      const integrationPriority =
        Math.round(((pro / proMax) * 0.5 + (proj / projMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
