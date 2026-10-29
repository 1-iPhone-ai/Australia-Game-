import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroCreditSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.16 credit / financial conditions spillover (never mutates finance state). */
export function readMacroCreditSpilloverFromV1016(inputs: MacroEconomyInputs): MacroCreditSpillover {
  const cm: any = inputs.creditMarkets ?? inputs.monetaryPolicy ?? inputs.nationalFinance;
  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  if (inputs.creditShockActive) {
    investmentNudge -= 5;
    cycleNudge -= 3;
    productivityNudge -= 1;
    summary = 'Active credit shock flag tightens macro investment and cycle read.';
  }

  if (!cm && !inputs.creditShockActive) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  const spread = String(cm?.spreadBand ?? cm?.creditSpread?.band ?? cm?.conditions?.band ?? 'normal');
  const policy = String(cm?.policyStance ?? cm?.stance ?? cm?.ratePolicy?.band ?? 'neutral');
  const liquidity = String(cm?.liquidity?.band ?? cm?.liquidityBand ?? 'adequate');

  if (spread === 'wide' || spread === 'stressed' || spread === 'frozen') {
    investmentNudge -= spread === 'frozen' ? 6 : 4;
    cycleNudge -= 2;
    summary = `Credit spread band (${spread}) weighs on macro investment climate.`;
  } else if (spread === 'tight' || spread === 'elevated') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = 'Elevated credit spreads modestly tighten macro cycle read.';
  } else if (spread === 'narrow' || spread === 'favorable') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = 'Favorable credit conditions support macro investment interpretation.';
  }

  if (policy === 'restrictive' || policy === 'tightening') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Restrictive policy stance caps investment upside.';
  } else if (policy === 'accommodative' || policy === 'easing') {
    investmentNudge += 1.5;
    summary = (summary ? summary + ' ' : '') + 'Accommodative policy stance supports investment read.';
  }

  if (liquidity === 'strained' || liquidity === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Liquidity strain adds macro downside risk.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -8, 4),
    investmentNudge: v1014macroClamp(investmentNudge, -10, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 2),
    summary
  };
}

export function applyMacroCreditSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCreditSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
