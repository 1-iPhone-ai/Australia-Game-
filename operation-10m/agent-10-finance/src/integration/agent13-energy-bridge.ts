import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only energy / environment snapshot from Agent 13 (contract only). */
export interface Agent13EnergySnapshot {
  turn: number;
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  retailTariffShock: boolean;
  gridReliabilityBand: 'stable' | 'strained' | 'fragile';
  emissionsTransitionCostBand: 'low' | 'medium' | 'high';
  /** Round 21: renewable shortfall feeding wholesale CPI metadata. */
  renewableShortfallInflationFlag?: boolean;
  /** Round 21: wholesale price cascade band. */
  wholesaleCascadeBand?: 'none' | 'stressed' | 'cascade';
  /** Round 32: grid tariff inflation latch. */
  gridTariffInflationLatch?: boolean;
  /** Round 32: wholesale stress cascade band. */
  wholesaleStressCascadeBand?: 'stable' | 'stressed' | 'cascade';
  /** Round 40: grid tariff inflation latch. */
  wave40GridTariffLatch?: boolean;
  /** Round 40: wholesale tariff cascade band. */
  wholesaleTariffCascadeBand?: 'stable' | 'stressed' | 'cascade';
  /** Round 49: grid transition surge latch. */
  wave49GridTransitionSurgeLatch?: boolean;
  /** Round 49: grid transition stress band. */
  gridTransitionStressBand?: 'stable' | 'stressed' | 'ruptured';
}

export function mergeAgent13IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent13EnergySnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.wholesaleEnergyStress === 'crisis' || snapshot.wholesaleEnergyStress === 'severe') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.1, 0.85, 1.45);
  } else if (snapshot.wholesaleEnergyStress === 'elevated') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.retailTariffShock) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.gridReliabilityBand === 'fragile') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }
  if (snapshot.emissionsTransitionCostBand === 'high') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.wholesaleEnergyStress === 'crisis' &&
    (snapshot.retailTariffShock || snapshot.gridReliabilityBand === 'fragile')
  ) {
    highInflationScenario = true;
  }
  if (snapshot.wholesaleCascadeBand === 'cascade' || snapshot.renewableShortfallInflationFlag) {
    highInflationScenario = true;
  }
  if (snapshot.wholesaleCascadeBand === 'cascade') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.gridTariffInflationLatch && snapshot.wholesaleStressCascadeBand === 'cascade') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.wholesaleStressCascadeBand === 'stressed' && snapshot.retailTariffShock) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave40GridTariffLatch && snapshot.wholesaleTariffCascadeBand === 'cascade') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.wholesaleTariffCascadeBand === 'stressed' && snapshot.wholesaleEnergyStress === 'crisis') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave49GridTransitionSurgeLatch && snapshot.gridTransitionStressBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.gridTransitionStressBand === 'stressed' && snapshot.wholesaleEnergyStress === 'crisis') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent13EnergyBridgeIntegrationNote(): string {
  return 'Agent 13 energy snapshot adjusts utility-side inflation multiplier flags; no emissions ledger writes.';
}
