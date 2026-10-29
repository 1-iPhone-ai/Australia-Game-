import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroInflationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.10 finance / inflation spillover (never mutates finance state). */
export function readMacroInflationSpilloverFromV1010(inputs: MacroEconomyInputs): MacroInflationSpillover {
  const nf: any = inputs.nationalFinance ?? inputs.monetaryPolicy;
  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  if (inputs.highInflationScenarioActive) {
    cycleNudge -= 2;
    investmentNudge -= 2;
    productivityNudge -= 2;
    summary = 'High-inflation scenario flag drags macro cycle and productivity read.';
  }

  if (!nf && !inputs.highInflationScenarioActive) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  const headline = String(
    nf?.inflation?.band ?? nf?.inflationBand ?? nf?.cpiBand ?? nf?.headlineInflation?.band ?? ''
  );
  const core = String(nf?.coreInflation?.band ?? nf?.coreInflationBand ?? nf?.underlyingInflation?.band ?? '');
  const expectations = String(nf?.inflationExpectations?.band ?? nf?.expectationsBand ?? '');

  if (headline === 'elevated' || headline === 'high' || headline === 'very_high') {
    cycleNudge -= headline === 'very_high' ? 3 : 2;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Headline inflation band (${headline}) tightens macro cycle interpretation.`;
  } else if (headline === 'moderate' || headline === 'target') {
    cycleNudge += 0.5;
    summary = 'Inflation near target supports stable macro read.';
  } else if (headline === 'disinflation' || headline === 'low') {
    cycleNudge += 1;
    investmentNudge += 1;
    summary = 'Disinflationary conditions support macro investment interpretation.';
  }

  if (core === 'sticky' || core === 'elevated' || core === 'high') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Sticky core inflation weighs on productivity read.';
  }

  if (expectations === 'unanchored' || expectations === 'rising' || expectations === 'elevated') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Unanchored inflation expectations cap investment upside.';
  } else if (expectations === 'anchored' || expectations === 'stable') {
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroInflationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroInflationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
