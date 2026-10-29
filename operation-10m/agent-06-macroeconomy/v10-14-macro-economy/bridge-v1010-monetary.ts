import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroMonetarySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.10 monetary policy stance spillover (distinct from inflation band read). */
export function readMacroMonetarySpilloverFromV1010Monetary(inputs: MacroEconomyInputs): MacroMonetarySpillover {
  const mp: any =
    inputs.monetaryPolicy ??
    inputs.creditMarkets ??
    inputs.nationalFinance?.monetary ??
    inputs.nationalFinance?.policy;
  if (!mp) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const stance = String(mp.policyStance ?? mp.stance ?? mp.rateStance ?? mp.bias ?? '');
  const realRate = String(mp.realRateBand ?? mp.realRates?.band ?? mp.policyRateBand ?? '');
  const liquidity = String(mp.liquidityBand ?? mp.systemLiquidity?.band ?? mp.liquidityStance ?? '');

  if (stance === 'restrictive' || stance === 'aggressive_tightening' || stance === 'hawkish') {
    cycleNudge -= 2;
    investmentNudge -= 3;
    summary = `Restrictive monetary stance (${stance}) tightens macro investment read.`;
  } else if (stance === 'accommodative' || stance === 'easing' || stance === 'dovish') {
    cycleNudge += 1;
    investmentNudge += 2;
    summary = `Accommodative monetary stance (${stance}) supports macro investment interpretation.`;
  }

  if (realRate === 'elevated' || realRate === 'restrictive' || realRate === 'very_high') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated real policy rates weigh on macro cycle timing.';
  } else if (realRate === 'supportive' || realRate === 'negative') {
    investmentNudge += 1;
  }

  if (liquidity === 'strained' || liquidity === 'frozen' || liquidity === 'critical') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Strained system liquidity amplifies macro downside read.';
  } else if (liquidity === 'ample' || liquidity === 'abundant') {
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroMonetarySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroMonetarySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
