import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroHouseholdConfidenceSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.13 household consumer-confidence spillover (never mutates household state). */
export function readMacroHouseholdConfidenceSpilloverFromV1013(inputs: MacroEconomyInputs): MacroHouseholdConfidenceSpillover {
  const hh: any = inputs.households ?? inputs.nationalSystems?.households;
  const conf: any = hh?.consumerConfidence ?? hh?.confidence ?? inputs.consumerConfidence;
  if (!conf && !hh) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const band = String(conf?.band ?? conf?.level ?? hh?.confidenceBand ?? hh?.sentimentBand ?? '');
  const volatility = String(conf?.volatilityBand ?? conf?.swingsBand ?? hh?.sentimentVolatility ?? '');

  if (band === 'euphoric' || band === 'very_high' || band === 'strong') {
    cycleNudge += 2;
    investmentNudge += 1;
    summary = `Elevated consumer confidence (${band}) supports macro cycle read.`;
  } else if (band === 'collapsed' || band === 'critical' || band === 'depressed') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Collapsed consumer confidence (${band}) drags macro cycle and spending read.`;
  } else if (band === 'weak' || band === 'cautious') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = `Cautious consumer confidence (${band}) weighs on macro demand interpretation.`;
  }

  if (volatility === 'extreme' || volatility === 'whipsaw' || volatility === 'critical') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Volatile confidence swings obscure macro investment timing.';
  } else if (volatility === 'anchored' || volatility === 'stable') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroHouseholdConfidenceSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroHouseholdConfidenceSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
