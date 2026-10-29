import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroRentalSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.14 rental market spillover (Agent 14 domain; never mutates housing state). */
export function readMacroRentalSpilloverFromV1014Rental(inputs: MacroEconomyInputs): MacroRentalSpillover {
  const rental: any =
    inputs.rentalMarket ??
    inputs.housingWellbeing?.rental ??
    inputs.housing?.rentalMarket ??
    inputs.nationalSystems?.housing?.rental;
  if (!rental) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pressure = String(rental.pressureBand ?? rental.affordabilityBand ?? rental.stressBand ?? '');
  const vacancy = String(rental.vacancyBand ?? rental.vacancy?.band ?? rental.availabilityBand ?? '');
  const rentGrowth = String(rental.rentGrowthBand ?? rental.growthBand ?? rental.momentumBand ?? '');

  if (pressure === 'severe' || pressure === 'critical' || pressure === 'acute') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    productivityNudge -= 1;
    summary = `Severe rental pressure (${pressure}) weighs on household-linked macro cycle read.`;
  } else if (pressure === 'elevated' || pressure === 'stressed') {
    cycleNudge -= 1;
    summary = `Elevated rental pressure (${pressure}) caps domestic demand interpretation.`;
  } else if (pressure === 'balanced' || pressure === 'moderate') {
    cycleNudge += 0.5;
  }

  if (vacancy === 'tight' || vacancy === 'critical' || vacancy === 'zero') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Tight rental vacancy supports residential investment spillover read.';
  } else if (vacancy === 'glut' || vacancy === 'oversupply') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Rental oversupply drags residential investment interpretation.';
  }

  if (rentGrowth === 'surging' || rentGrowth === 'accelerating') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Surging rent growth tightens household real-income macro read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroRentalSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroRentalSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
