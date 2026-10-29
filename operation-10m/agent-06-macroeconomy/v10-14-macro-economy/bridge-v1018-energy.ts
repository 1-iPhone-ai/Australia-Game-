import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroEnergySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.18 industrial energy / environment spillover (never mutates energy state). */
export function readMacroEnergySpilloverFromV1018(inputs: MacroEconomyInputs): MacroEnergySpillover {
  const en: any =
    inputs.industrialEnergy ?? inputs.energyEnvironment ?? inputs.nationalSystems?.industrialEnergy ?? inputs.nationalSystems?.energy;
  if (!en) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const supply = String(en.supplyReliability?.band ?? en.reliabilityBand ?? en.gridBand ?? en.supplyBand ?? '');
  const transition = String(en.transition?.band ?? en.decarbonizationBand ?? en.netZeroBand ?? '');
  const cost = String(en.energyCost?.band ?? en.inputCostBand ?? en.priceShockBand ?? '');

  if (supply === 'critical' || supply === 'fragile' || supply === 'stressed') {
    cycleNudge -= supply === 'critical' ? 3 : 2;
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = `Energy supply band (${supply}) drags macro productivity and cycle read.`;
  } else if (supply === 'robust' || supply === 'secure' || supply === 'strong') {
    productivityNudge += 1;
    cycleNudge += 0.5;
    summary = 'Secure energy supply supports macro productivity interpretation.';
  }

  if (transition === 'accelerating' || transition === 'rapid') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Accelerating energy transition lifts capex-heavy macro investment read.';
  } else if (transition === 'stalled' || transition === 'blocked') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Stalled transition pipeline caps green-investment macro upside.';
  }

  if (cost === 'spike' || cost === 'severe' || cost === 'elevated') {
    cycleNudge -= cost === 'severe' ? 3 : 2;
    investmentNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Energy cost shock tightens macro cycle read.';
  } else if (cost === 'favorable' || cost === 'low') {
    cycleNudge += 1;
    productivityNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroEnergySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroEnergySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
