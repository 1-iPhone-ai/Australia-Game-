import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only snapshot shape from Agent 06 macroeconomy module (contract only). */
export interface Agent06MacroSnapshot {
  turn: number;
  gdpGrowthBand: 'contraction' | 'slow' | 'steady' | 'strong';
  unemploymentBand: 'low' | 'moderate' | 'elevated' | 'severe';
  outputGap: number;
  nominalDemandPressure: number;
}

export function mergeAgent06IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent06MacroSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;
  const demand = finClamp(snapshot.nominalDemandPressure, -1, 1);
  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (demand > 0.35) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + demand * 0.08, 0.85, 1.45);
  }

  let actorCreditStressIndex = base.actorCreditStressIndex ?? 0.35;
  if (snapshot.unemploymentBand === 'severe') {
    actorCreditStressIndex = finClamp(actorCreditStressIndex + 0.12, 0, 1);
  }

  let fiscalPressure = base.fiscalPressure;
  if (snapshot.gdpGrowthBand === 'contraction' && fiscalPressure === 'healthy') {
    fiscalPressure = 'tight';
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    actorCreditStressIndex,
    fiscalPressure,
  };
}

export function agent06BridgeIntegrationNote(): string {
  return 'Agent 06 macro snapshot adjusts inflation multiplier and credit stress only; commodity resourcePrices unchanged.';
}
