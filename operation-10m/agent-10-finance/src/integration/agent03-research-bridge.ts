import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only research / tech snapshot from Agent 03 (contract only). */
export interface Agent03ResearchSnapshot {
  turn: number;
  productivityGainBand: 'flat' | 'moderate' | 'strong';
  supplySideReliefActive: boolean;
  innovationInflationOffsetScore: number;
}

export function mergeAgent03IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent03ResearchSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.productivityGainBand === 'strong' && snapshot.supplySideReliefActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.06, 0.85, 1.45);
  } else if (snapshot.productivityGainBand === 'moderate' && snapshot.innovationInflationOffsetScore > 0.45) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.03, 0.85, 1.45);
  } else if (snapshot.productivityGainBand === 'flat' && !snapshot.supplySideReliefActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
  };
}

export function agent03ResearchBridgeIntegrationNote(): string {
  return 'Agent 03 research snapshot adjusts supply-side inflation offset; no tech tree writes.';
}
