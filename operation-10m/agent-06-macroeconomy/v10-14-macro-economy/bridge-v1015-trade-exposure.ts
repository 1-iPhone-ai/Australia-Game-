import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroTradeExposureSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.15 trade exposure spillover (Agent 15 domain; distinct from trade layer). */
export function readMacroTradeExposureSpilloverFromV1015(inputs: MacroEconomyInputs): MacroTradeExposureSpillover {
  const te: any =
    inputs.tradeExposure ??
    inputs.trade?.exposure ??
    inputs.trade?.externalExposure ??
    inputs.nationalSystems?.tradeExposure;
  if (!te) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const openness = String(te.opennessBand ?? te.exposureBand ?? te.linkageBand ?? '');
  const shock = String(te.shockBand ?? te.vulnerabilityBand ?? '');
  const balance = String(te.balanceBand ?? te.deficitBand ?? '');

  if (shock === 'severe' || shock === 'critical' || shock === 'dislocated') {
    cycleNudge -= 3;
    productivityNudge -= 2;
    summary = `Severe trade exposure shock (${shock}) drags macro productivity read.`;
  } else if (openness === 'diversified' || openness === 'balanced') {
    productivityNudge += 1;
    summary = `Diversified trade exposure (${openness}) supports macro productivity interpretation.`;
  }

  if (balance === 'deep_deficit' || balance === 'critical' || balance === 'unsustainable') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Unsustainable external balance caps macro investment spillover.';
  }

  if (openness === 'concentrated' || openness === 'fragile') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Concentrated trade linkages amplify macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTradeExposureSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTradeExposureSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
