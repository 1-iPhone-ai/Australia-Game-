import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroForecastingSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecasting lab spillover (never mutates forecast state). */
export function readMacroForecastingSpilloverFromV1021(inputs: MacroEconomyInputs): MacroForecastingSpillover {
  const fc: any =
    inputs.forecastingLab ??
    inputs.macroForecasts ??
    inputs.nationalForecasts ??
    inputs.nationalSystems?.forecasting;
  if (!fc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const outlook = String(fc.outlookBand ?? fc.consensusOutlook?.band ?? fc.headlineBand ?? '');
  const confidence = String(fc.confidenceBand ?? fc.modelConfidence?.band ?? '');
  const dispersion = String(fc.dispersionBand ?? fc.forecastSpread?.band ?? '');

  if (outlook === 'upside' || outlook === 'strong_growth' || outlook === 'expansion') {
    cycleNudge += 2;
    investmentNudge += 1;
    summary = `Forecast outlook (${outlook}) supports macro cycle read.`;
  } else if (outlook === 'downside' || outlook === 'recession' || outlook === 'contraction') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Downside forecast consensus (${outlook}) drags macro cycle and investment read.`;
  }

  if (confidence === 'high' || confidence === 'strong') {
    if (outlook === 'downside' || outlook === 'recession' || outlook === 'contraction') cycleNudge -= 0.5;
    else cycleNudge += 0.5;
  } else if (confidence === 'low' || confidence === 'uncertain') {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Low forecast confidence caps investment conviction read.';
  }

  if (dispersion === 'wide' || dispersion === 'divergent') {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Wide forecast dispersion increases macro uncertainty read.';
  } else if (dispersion === 'tight' || dispersion === 'aligned') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastingSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastingSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
