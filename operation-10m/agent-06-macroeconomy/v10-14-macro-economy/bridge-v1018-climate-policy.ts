import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroClimatePolicySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.18 climate policy spillover (Agent 13 domain; never mutates energy state). */
export function readMacroClimatePolicySpilloverFromV1018Climate(inputs: MacroEconomyInputs): MacroClimatePolicySpillover {
  const ce: any =
    inputs.climatePolicy ??
    inputs.energyEnvironment?.climatePolicy ??
    inputs.industrialEnergy?.climate ??
    inputs.nationalSystems?.climatePolicy;
  if (!ce) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const transition = String(ce.transitionBand ?? ce.transition?.band ?? ce.policyPace ?? '');
  const carbon = String(ce.carbonPriceBand ?? ce.carbonIntensityBand ?? ce.levyBand ?? '');
  const compliance = String(ce.complianceBand ?? ce.regulatoryPressure?.band ?? '');

  if (transition === 'disruptive' || transition === 'shock' || transition === 'forced') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Disruptive climate transition (${transition}) weighs on macro cycle read.`;
  } else if (transition === 'accelerating' || transition === 'steady') {
    investmentNudge += 1;
    productivityNudge += 0.5;
    summary = `Orderly climate transition (${transition}) supports green-investment spillover read.`;
  }

  if (carbon === 'punitive' || carbon === 'severe' || carbon === 'critical') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Punitive carbon pricing tightens near-term macro cycle interpretation.';
  } else if (carbon === 'moderate' || carbon === 'incentive_aligned') {
    investmentNudge += 0.5;
  }

  if (compliance === 'binding' || compliance === 'severe' || compliance === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Binding climate compliance costs drag productivity spillover read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroClimatePolicySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroClimatePolicySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
