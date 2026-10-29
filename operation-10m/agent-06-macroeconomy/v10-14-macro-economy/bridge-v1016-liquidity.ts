import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroLiquiditySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.16 system liquidity spillover (distinct from credit spread read). */
export function readMacroLiquiditySpilloverFromV1016Liquidity(inputs: MacroEconomyInputs): MacroLiquiditySpillover {
  const liq: any =
    inputs.systemLiquidity ??
    inputs.creditMarkets?.liquidity ??
    inputs.monetaryPolicy?.liquidity ??
    inputs.nationalFinance?.liquidity;
  if (!liq) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const band = String(liq.band ?? liq.stressBand ?? liq.systemBand ?? liq.stance ?? '');
  const marketDepth = String(liq.marketDepthBand ?? liq.depthBand ?? '');
  const rollRisk = String(liq.rolloverRiskBand ?? liq.refinancingBand ?? '');

  if (band === 'frozen' || band === 'critical' || band === 'strained') {
    cycleNudge -= 3;
    investmentNudge -= 3;
    productivityNudge -= 1;
    summary = `Strained system liquidity (${band}) tightens macro cycle and investment read.`;
  } else if (band === 'ample' || band === 'abundant') {
    investmentNudge += 1;
    cycleNudge += 0.5;
    summary = `Ample system liquidity (${band}) supports macro investment interpretation.`;
  }

  if (marketDepth === 'thin' || marketDepth === 'critical' || marketDepth === 'evaporated') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Thin market depth caps macro financing spillover read.';
  }

  if (rollRisk === 'elevated' || rollRisk === 'severe' || rollRisk === 'default_wave') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Elevated rollover risk amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroLiquiditySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroLiquiditySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
