import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only corporate sector snapshot from Agent 08 (contract only). */
export interface Agent08CorporateSnapshot {
  turn: number;
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  marginCompression: 'none' | 'mild' | 'severe';
  passThroughIntent: 'absorb' | 'partial' | 'full';
  /** Round 22: production capacity strain feeding markup CPI. */
  productionCapacityStrainInflationFlag?: boolean;
  /** Round 22: corporate markup cascade band. */
  corporateMarkupCascadeBand?: 'none' | 'building' | 'active';
  /** Round 31: corporate pricing inflation latch. */
  corporatePricingInflationLatch?: boolean;
  /** Round 31: markup pass-through cascade band. */
  markupPassThroughCascadeBand?: 'absorbed' | 'partial' | 'full';
  /** Round 39: survival pricing inflation latch. */
  wave39SurvivalPricingLatch?: boolean;
  /** Round 39: corporate markup escalation band. */
  corporateMarkupEscalationBand?: 'contained' | 'building' | 'dominant';
  /** Round 47: corporate capacity inflation latch. */
  wave47CorporateCapacityLatch?: boolean;
  /** Round 47: capacity markup surge band. */
  capacityMarkupSurgeBand?: 'contained' | 'building' | 'ruptured';
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

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.corporateMarkupCascadeBand === 'active' || snapshot.productionCapacityStrainInflationFlag) {
    highInflationScenario = highInflationScenario || snapshot.corporateMarkupCascadeBand === 'active';
    if (snapshot.corporateMarkupCascadeBand === 'active') {
      inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
    }
  }

  if (snapshot.corporatePricingInflationLatch && snapshot.markupPassThroughCascadeBand === 'full') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.markupPassThroughCascadeBand === 'partial' && snapshot.pricingPowerBand === 'strong') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave39SurvivalPricingLatch && snapshot.corporateMarkupEscalationBand === 'dominant') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.corporateMarkupEscalationBand === 'building' && snapshot.passThroughIntent === 'full') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave47CorporateCapacityLatch && snapshot.capacityMarkupSurgeBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.capacityMarkupSurgeBand === 'building' && snapshot.pricingPowerBand === 'dominant') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    actorCreditStressIndex,
    highInflationScenario,
  };
}

export function agent08CorporateBridgeIntegrationNote(): string {
  return 'Agent 08 corporate snapshot adjusts pricing-power inflation flags; no company equity writes.';
}
