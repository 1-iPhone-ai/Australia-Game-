import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroHouseholdSpillover {
  cycleNudge: number;
  investmentNudge: number;
  summary: string | null;
}

/** Read-only V10.13 household / domestic demand spillover (never mutates household state). */
export function readMacroHouseholdSpilloverFromV1013(inputs: MacroEconomyInputs): MacroHouseholdSpillover {
  const hh: any = inputs.households;
  if (!hh) return { cycleNudge: 0, investmentNudge: 0, summary: null };
  const demand = String(hh.domesticDemand?.level ?? hh.domesticDemand?.band ?? hh.demandBand ?? 'stable');
  const affordability = String(hh.affordability?.band ?? hh.livingStandards?.band ?? 'moderate');
  let cycleNudge = 0;
  let investmentNudge = 0;
  let summary: string | null = null;
  if (demand === 'surging' || demand === 'very_strong') {
    cycleNudge += 3;
    investmentNudge += 2;
    summary = 'Strong domestic demand supports macro cycle momentum (interpretation).';
  }
  if (demand === 'contracting' || demand === 'soft') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'Soft domestic demand weighs on macro cycle read.';
  }
  if (affordability === 'severe_pressure' || affordability === 'strained') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Household affordability strain caps investment interpretation.';
  }
  return {
    cycleNudge: v1014macroClamp(cycleNudge, -6, 6),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    summary
  };
}

export function applyMacroHouseholdSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroHouseholdSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
