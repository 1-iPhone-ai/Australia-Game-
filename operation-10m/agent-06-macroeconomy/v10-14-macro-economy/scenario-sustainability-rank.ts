import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioEquilibrium } from './scenario-equilibrium-rank.ts';
import { rankMacroScenarioRenewal } from './scenario-renewal-rank.ts';

export interface MacroScenarioSustainabilityRow {
  scenarioId: string;
  sustainabilityPriority: number;
}

/** Rank overlays for sustainability planning (equilibrium balance plus renewal runway). */
export function rankMacroScenarioSustainability(rows: MacroScenarioCompareRow[]): MacroScenarioSustainabilityRow[] {
  const equilibrium = rankMacroScenarioEquilibrium(rows);
  const renewal = rankMacroScenarioRenewal(rows);
  const eqMax = Math.max(1, ...equilibrium.map(e => e.equilibriumPriority));
  const renMax = Math.max(1, ...renewal.map(r => r.renewalPriority));

  return rows
    .map(row => {
      const eq = equilibrium.find(e => e.scenarioId === row.scenarioId)?.equilibriumPriority ?? 0;
      const ren = renewal.find(r => r.scenarioId === row.scenarioId)?.renewalPriority ?? 0;
      const sustainabilityPriority =
        Math.round(((eq / eqMax) * 0.55 + (ren / renMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, sustainabilityPriority };
    })
    .sort((a, b) => b.sustainabilityPriority - a.sustainabilityPriority);
}
