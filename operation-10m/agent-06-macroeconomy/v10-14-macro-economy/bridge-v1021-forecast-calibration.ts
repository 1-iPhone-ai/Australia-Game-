import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroForecastCalibrationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast calibration spillover (Agent 21 domain; distinct from forecasting layer). */
export function readMacroForecastCalibrationSpilloverFromV1021(inputs: MacroEconomyInputs): MacroForecastCalibrationSpillover {
  const fc: any =
    inputs.forecastCalibration ??
    inputs.forecastingLab?.calibration ??
    inputs.macroForecasts?.calibration ??
    inputs.nationalForecasts?.calibration;
  if (!fc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const bias = String(fc.biasBand ?? fc.calibrationBand ?? fc.errorBand ?? '');
  const horizon = String(fc.horizonBand ?? fc.rangeBand ?? '');
  const confidence = String(fc.confidenceBand ?? fc.certaintyBand ?? '');

  if (bias === 'severe' || bias === 'critical' || bias === 'runaway') {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = `Severe forecast calibration bias (${bias}) drags macro investment read.`;
  } else if (bias === 'neutral' || bias === 'well_calibrated') {
    investmentNudge += 1;
    summary = `Well-calibrated forecasts (${bias}) support macro investment interpretation.`;
  }

  if (horizon === 'blind' || horizon === 'critical' || horizon === 'collapsed') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Blind forecast horizon weakens macro productivity spillover.';
  }

  if (confidence === 'overconfident' || confidence === 'critical' || confidence === 'misplaced') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Misplaced forecast confidence amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastCalibrationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastCalibrationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
