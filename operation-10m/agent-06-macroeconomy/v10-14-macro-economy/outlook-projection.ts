import {
  v1014macroBandInvestment,
  v1014macroBandProductivity,
  v1014macroClamp,
  v1014macroCycleFromScore
} from './math.ts';
import { deriveGrossOutputIndex, deriveUtilizationIndex } from './production.ts';
import type {
  BusinessCyclePhase,
  MacroEconomyInputs,
  MacroOutlookProjection,
  NationalMacroEconomyState
} from './types.ts';
import { composeStackedShockDeltas } from './shock-composition.ts';
import { CYCLICAL_MACRO_SHOCK_CATALOG, resolveActiveCyclicalShockIds } from './catalog/cyclical-shocks.ts';

export function projectMacroEconomyOutlook(
  state: NationalMacroEconomyState,
  inputs: MacroEconomyInputs,
  horizonTurns = 3
): MacroOutlookProjection {
  const h = Math.max(1, Math.min(6, Math.floor(horizonTurns)));
  let cycleScore = state.productivityIndex * 0.35 + state.grossInvestmentIndex * 0.35 + 50 * 0.3;
  let productivityScore = state.productivityIndex;
  let investmentScore = state.grossInvestmentIndex;
  const shockIds = resolveActiveCyclicalShockIds(inputs);
  const stacked = composeStackedShockDeltas(shockIds, CYCLICAL_MACRO_SHOCK_CATALOG);
  cycleScore += stacked.cycleDelta * 0.35 * h;
  productivityScore += stacked.productivityDelta * 0.25 * h;
  investmentScore += stacked.investmentDelta * 0.25 * h;
  cycleScore = v1014macroClamp(cycleScore, 0, 100);
  productivityScore = v1014macroClamp(productivityScore, 0, 100);
  investmentScore = v1014macroClamp(investmentScore, 0, 100);
  const projectedCyclePhase: BusinessCyclePhase = v1014macroCycleFromScore(cycleScore, state.cyclePhase);
  const projectedProductivityBand = v1014macroBandProductivity(productivityScore);
  const projectedInvestmentClimate = v1014macroBandInvestment(investmentScore);
  const utilization = deriveUtilizationIndex(cycleScore, investmentScore);
  const projectedOutputIndex = deriveGrossOutputIndex(productivityScore, utilization, investmentScore);
  const confidence = v1014macroClamp(0.92 - shockIds.length * 0.06 - h * 0.04, 0.45, 0.95);
  return {
    horizonTurns: h,
    projectedCyclePhase,
    projectedInvestmentClimate,
    projectedProductivityBand,
    projectedOutputIndex,
    confidence
  };
}
