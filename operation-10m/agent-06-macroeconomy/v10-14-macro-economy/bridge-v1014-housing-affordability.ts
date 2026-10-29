import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroHousingAffordabilitySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.14 housing affordability spillover (Agent 14 domain; distinct from housing layer). */
export function readMacroHousingAffordabilitySpilloverFromV1014(inputs: MacroEconomyInputs): MacroHousingAffordabilitySpillover {
  const ha: any =
    inputs.housingAffordability ??
    inputs.housingWellbeing?.affordability ??
    inputs.housing?.affordability ??
    inputs.rentalMarket?.affordability;
  if (!ha) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const stress = String(ha.stressBand ?? ha.affordabilityBand ?? ha.pressureBand ?? '');
  const tenure = String(ha.tenureBand ?? ha.accessBand ?? '');
  const service = String(ha.serviceBand ?? ha.wellbeingBand ?? '');

  if (stress === 'acute' || stress === 'critical' || stress === 'crushed') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Acute housing affordability stress (${stress}) drags macro cycle read.`;
  } else if (stress === 'manageable' || stress === 'balanced') {
    cycleNudge += 1;
    summary = `Balanced housing affordability (${stress}) supports macro cycle interpretation.`;
  }

  if (tenure === 'locked_out' || tenure === 'precarious' || tenure === 'critical') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Precarious tenure access weakens macro productivity spillover.';
  }

  if (service === 'strained' || service === 'critical' || service === 'failing') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Strained housing wellbeing services amplify macro downside.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroHousingAffordabilitySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroHousingAffordabilitySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
