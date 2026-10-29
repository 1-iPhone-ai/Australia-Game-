import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioResilience } from './scenario-resilience-rank.ts';
import { rankMacroScenarioWave35Integration } from './scenario-wave35-integration-rank.ts';

export interface MacroScenarioWave36IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 36 integration (resilience cushion plus wave 35 integration latch). */
export function rankMacroScenarioWave36Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave36IntegrationRow[] {
  const resilience = rankMacroScenarioResilience(rows);
  const wave35 = rankMacroScenarioWave35Integration(rows);
  const resMax = Math.max(1, ...resilience.map(r => r.resiliencePriority));
  const w35Max = Math.max(1, ...wave35.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const res = resilience.find(r => r.scenarioId === row.scenarioId)?.resiliencePriority ?? 0;
      const w35 = wave35.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((res / resMax) * 0.45 + (w35 / w35Max) * 0.55) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}
