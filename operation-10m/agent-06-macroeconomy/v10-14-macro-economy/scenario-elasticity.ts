import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { scenarioNetScore } from './scenario-ranking.ts';

export interface MacroScenarioElasticityRow {
  scenarioId: string;
  netScore: number;
  elasticity: number;
}

/** Rank scenario overlays by absolute net-outcome sensitivity (lab prioritization). */
export function rankMacroScenarioElasticity(rows: MacroScenarioCompareRow[]): MacroScenarioElasticityRow[] {
  return rows
    .map(row => ({
      scenarioId: row.scenarioId,
      netScore: scenarioNetScore(row),
      elasticity: Math.round(Math.abs(scenarioNetScore(row)) * 100) / 100
    }))
    .sort((a, b) => b.elasticity - a.elasticity);
}
