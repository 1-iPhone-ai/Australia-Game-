import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only corporate sector snapshot from Agent 08 (contract only). */
export interface Agent08CorporateSnapshot {
  turn: number;
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  marginCompression: 'none' | 'mild' | 'severe';
  passThroughIntent: 'absorb' | 'partial' | 'full';
}

export function mergeAgent08IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent08CorporateSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.pricingPowerBand === 'dominant' || snapshot.pricingPowerBand === 'strong') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  }
  if (snapshot.passThroughIntent === 'full' && snapshot.marginCompression !== 'severe') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }
  if (snapshot.marginCompression === 'severe' && snapshot.pricingPowerBand === 'weak') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  let actorCreditStressIndex = base.actorCreditStressIndex ?? 0.35;
  if (snapshot.marginCompression === 'severe') {
    actorCreditStressIndex = finClamp(actorCreditStressIndex + 0.05, 0, 1);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    actorCreditStressIndex,
  };
}

export function agent08CorporateBridgeIntegrationNote(): string {
  return 'Agent 08 corporate snapshot adjusts pricing-power inflation flags; no company equity writes.';
}
