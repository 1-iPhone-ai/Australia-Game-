import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroHousingSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only housing & wellbeing spillover (Agent 14 domain; never mutates housing state). */
export function readMacroHousingSpilloverFromV1014Housing(inputs: MacroEconomyInputs): MacroHousingSpillover {
  const hw: any = inputs.housingWellbeing ?? inputs.housing ?? inputs.nationalSystems?.housingWellbeing;
  if (!hw) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const affordability = String(hw.affordability?.band ?? hw.affordabilityBand ?? hw.stressBand ?? '');
  if (affordability === 'severe' || affordability === 'critical' || affordability === 'stressed') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = 'Severe housing affordability stress weighs on macro cycle and residential investment read.';
  } else if (affordability === 'comfortable' || affordability === 'balanced') {
    cycleNudge += 1;
    investmentNudge += 1;
    summary = 'Balanced housing affordability supports domestic cycle interpretation.';
  }

  const construction = String(hw.construction?.band ?? hw.buildPipelineBand ?? hw.permitsBand ?? '');
  if (construction === 'boom' || construction === 'strong') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Strong housing construction pipeline lifts macro investment read.';
  } else if (construction === 'correction' || construction === 'collapse' || construction === 'frozen') {
    investmentNudge -= 3;
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Housing construction correction drags macro investment and cycle.';
  }

  const mortgage = String(hw.mortgage?.stressBand ?? hw.debtServiceBand ?? hw.mortgageStress ?? '');
  if (mortgage === 'elevated' || mortgage === 'acute' || mortgage === 'distress') {
    cycleNudge -= 1;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated mortgage stress tightens household-linked macro demand read.';
  }

  const wellbeing = String(hw.wellbeing?.band ?? hw.nationalWellbeingBand ?? '');
  if (wellbeing === 'strong' || wellbeing === 'leading') {
    productivityNudge += 1;
    cycleNudge += 1;
  } else if (wellbeing === 'weak' || wellbeing === 'strained') {
    productivityNudge -= 1;
    cycleNudge -= 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 4),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 3),
    summary
  };
}

export function applyMacroHousingSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroHousingSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
