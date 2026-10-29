import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroPopulationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.9 population / demographics spillover (distinct from strategic capital bridge). */
export function readMacroPopulationSpilloverFromV109Pop(inputs: MacroEconomyInputs): MacroPopulationSpillover {
  const pop: any =
    inputs.population ??
    inputs.demographics ??
    inputs.nationalPopulation ??
    inputs.nationalSystems?.population ??
    inputs.nationalSystems?.demographics;
  if (!pop) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const growth = String(pop.growthBand ?? pop.populationGrowth?.band ?? pop.demographicMomentum?.band ?? '');
  const dependency = String(pop.dependencyBand ?? pop.ageDependency?.band ?? pop.dependencyRatio?.band ?? '');
  const migration = String(pop.netMigrationBand ?? pop.migration?.band ?? pop.inflowBand ?? '');

  if (growth === 'surging' || growth === 'strong') {
    cycleNudge += 1;
    investmentNudge += 1;
    summary = `Strong population growth (${growth}) supports macro cycle and investment read.`;
  } else if (growth === 'stagnant' || growth === 'contracting' || growth === 'critical') {
    cycleNudge -= growth === 'critical' ? 2 : 1;
    productivityNudge -= 1;
    summary = `Weak demographic growth (${growth}) drags macro cycle interpretation.`;
  }

  if (dependency === 'elevated' || dependency === 'severe' || dependency === 'high') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated age dependency weighs on macro productivity read.';
  } else if (dependency === 'favorable' || dependency === 'low') {
    productivityNudge += 0.5;
  }

  if (migration === 'strong_inflow' || migration === 'surging') {
    investmentNudge += 1;
    cycleNudge += 0.5;
  } else if (migration === 'outflow' || migration === 'severe_outflow') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Net migration outflow tightens macro cycle read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroPopulationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroPopulationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
