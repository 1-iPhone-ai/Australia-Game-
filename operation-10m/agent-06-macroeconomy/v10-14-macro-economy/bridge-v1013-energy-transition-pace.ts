import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroEnergyTransitionPaceSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.13 energy transition pace spillover (Agent 13 domain; distinct from energy layer). */
export function readMacroEnergyTransitionPaceSpilloverFromV1013(inputs: MacroEconomyInputs): MacroEnergyTransitionPaceSpillover {
  const et: any =
    inputs.energyTransitionPace ??
    inputs.industrialEnergy?.transitionPace ??
    inputs.energyEnvironment?.transition ??
    inputs.climatePolicy?.transitionPace;
  if (!et) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pace = String(et.paceBand ?? et.transitionBand ?? et.speedBand ?? '');
  const cost = String(et.costBand ?? et.adjustmentCost?.band ?? '');
  const grid = String(et.gridBand ?? et.integrationBand ?? '');

  if (pace === 'disruptive' || pace === 'critical' || pace === 'forced') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Disruptive energy transition pace (${pace}) unsettles macro investment read.`;
  } else if (pace === 'orderly' || pace === 'steady') {
    investmentNudge += 1;
    summary = `Orderly transition pace (${pace}) supports macro investment interpretation.`;
  }

  if (cost === 'severe' || cost === 'critical' || cost === 'spiking') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Spiking transition costs drag macro productivity spillover.';
  }

  if (grid === 'strained' || grid === 'critical' || grid === 'unstable') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Strained grid integration amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroEnergyTransitionPaceSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroEnergyTransitionPaceSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
