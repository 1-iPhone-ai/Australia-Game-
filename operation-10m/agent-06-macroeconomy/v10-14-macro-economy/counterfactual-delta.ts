import { computeNationalMacroEconomy } from './compute.ts';
import type { MacroEconomyInputs, NationalMacroEconomyState } from './types.ts';

export interface MacroCounterfactualDelta {
  baselineTurn: number;
  cycleScoreDelta: number;
  investmentScoreDelta: number;
  productivityScoreDelta: number;
  outputIndexDelta: number;
  stressScoreDelta: number;
}

/** Single-turn counterfactual: same persisted path, alternate inputs overlay. */
export function computeMacroCounterfactualDelta(
  baseInputs: MacroEconomyInputs,
  overlay: Partial<MacroEconomyInputs>,
  persisted: Parameters<typeof computeNationalMacroEconomy>[1],
  prev: NationalMacroEconomyState | null
): MacroCounterfactualDelta {
  const baseline = computeNationalMacroEconomy(baseInputs, persisted, prev).state;
  const stressed = computeNationalMacroEconomy({ ...baseInputs, ...overlay, turn: baseInputs.turn }, persisted, prev)
    .state;
  return {
    baselineTurn: baseInputs.turn,
    cycleScoreDelta: stressed.cycleMomentum - baseline.cycleMomentum,
    investmentScoreDelta: stressed.grossInvestmentIndex - baseline.grossInvestmentIndex,
    productivityScoreDelta: stressed.productivityIndex - baseline.productivityIndex,
    outputIndexDelta: stressed.accounting.grossOutputIndex - baseline.accounting.grossOutputIndex,
    stressScoreDelta: stressed.stressIndex.score - baseline.stressIndex.score
  };
}
