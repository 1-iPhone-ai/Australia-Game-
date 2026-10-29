import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroForecastDispersionSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast dispersion spillover (Agent 21 domain; never mutates forecast state). */
export function readMacroForecastDispersionSpilloverFromV1021(inputs: MacroEconomyInputs): MacroForecastDispersionSpillover {
  const fl: any =
    inputs.forecastingLab ??
    inputs.macroForecasts ??
    inputs.nationalForecasts ??
    inputs.nationalSystems?.forecasting;
  if (!fl) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const dispersion = String(fl.dispersionBand ?? fl.forecastSpread?.band ?? fl.modelDispersion ?? '');
  const confidence = String(fl.confidenceBand ?? fl.consensusConfidence?.band ?? '');
  const disagreement = String(fl.disagreementBand ?? fl.analystSplit?.band ?? '');

  if (dispersion === 'wide' || dispersion === 'extreme' || dispersion === 'critical') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Wide forecast dispersion (${dispersion}) obscures macro investment timing read.`;
  } else if (dispersion === 'tight' || dispersion === 'aligned') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
    summary = 'Tight forecast dispersion supports coherent macro read.';
  }

  if (confidence === 'low' || confidence === 'critical' || confidence === 'fragmented') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Low forecast confidence caps macro investment upside.';
  } else if (confidence === 'high' || confidence === 'strong') {
    investmentNudge += 1;
  }

  if (disagreement === 'severe' || disagreement === 'polarized' || disagreement === 'extreme') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Polarized forecast disagreement weighs on productivity interpretation.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastDispersionSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastDispersionSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
