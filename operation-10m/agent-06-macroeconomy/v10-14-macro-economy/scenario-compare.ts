import { computeMacroCounterfactualDelta, type MacroCounterfactualDelta } from './counterfactual-delta.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import type { MacroEconomyInputs, NationalMacroEconomyState } from './types.ts';

export interface MacroScenarioCompareRow {
  scenarioId: string;
  delta: MacroCounterfactualDelta;
  stressScore: number;
  capacityIndex: number;
}

/** Compare baseline against named input overlays (single turn, shared persisted path). */
export function compareMacroEconomyScenarios(
  baseInputs: MacroEconomyInputs,
  scenarios: Array<{ id: string; overlay: Partial<MacroEconomyInputs> }>,
  persisted: Parameters<typeof computeNationalMacroEconomy>[1],
  prev: NationalMacroEconomyState | null
): MacroScenarioCompareRow[] {
  return scenarios.map(({ id, overlay }) => {
    const delta = computeMacroCounterfactualDelta(baseInputs, overlay, persisted, prev);
    const stressed = computeNationalMacroEconomy({ ...baseInputs, ...overlay, turn: baseInputs.turn }, persisted, prev)
      .state;
    return {
      scenarioId: id,
      delta,
      stressScore: stressed.stressIndex.score,
      capacityIndex: stressed.capacitySnapshot.index
    };
  });
}
