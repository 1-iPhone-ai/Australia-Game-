import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioDivergence } from './scenario-divergence.ts';
import { scenarioNetScore } from './scenario-ranking.ts';

export interface MacroScenarioSeverityRow {
  scenarioId: string;
  netScore: number;
  stressScore: number;
  severityIndex: number;
}

/** Rank scenario overlays by composite severity (stress + divergence + downside net). */
export function rankMacroScenarioSeverity(rows: MacroScenarioCompareRow[]): MacroScenarioSeverityRow[] {
  const divergence = rankMacroScenarioDivergence(rows);
  const divById = Object.fromEntries(divergence.map(d => [d.scenarioId, d.divergenceIndex]));

  return rows
    .map(row => {
      const netScore = scenarioNetScore(row);
      const downside = netScore < 0 ? Math.abs(netScore) : 0;
      const severityIndex =
        Math.round((row.stressScore * 0.45 + (divById[row.scenarioId] ?? 0) * 0.35 + downside * 0.2) * 100) / 100;
      return {
        scenarioId: row.scenarioId,
        netScore,
        stressScore: row.stressScore,
        severityIndex
      };
    })
    .sort((a, b) => b.severityIndex - a.severityIndex);
}
