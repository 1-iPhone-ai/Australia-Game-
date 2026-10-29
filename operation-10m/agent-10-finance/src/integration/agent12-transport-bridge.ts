import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only transport infrastructure snapshot from Agent 12 (contract only). */
export interface Agent12TransportSnapshot {
  turn: number;
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  portBacklogBand: 'clear' | 'moderate' | 'severe';
  logisticsInflationScenarioActive: boolean;
  /** Round 28: logistics inflation latch across freight cycles. */
  logisticsInflationLatch?: boolean;
  /** Round 28: freight congestion band. */
  freightCongestionBand?: 'clear' | 'building' | 'gridlocked';
  /** Round 17: V10.12 utilities grid thin capacity margin (distinct from freight). */
  utilitiesGridCapacityMarginThin?: boolean;
  /** Round 17: severe rolling utility outages feeding tariff CPI metadata. */
  utilitiesOutageBandSevere?: boolean;
}

export function mergeAgent12IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent12TransportSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.freightCapacityBand === 'critical' || snapshot.freightCapacityBand === 'tight') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.09, 0.85, 1.45);
  } else if (snapshot.freightCapacityBand === 'balanced') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.fuelSurchargeActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.portBacklogBand === 'severe') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  } else if (snapshot.portBacklogBand === 'moderate') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }
  if (snapshot.utilitiesGridCapacityMarginThin) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  }
  if (snapshot.utilitiesOutageBandSevere) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.09, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.logisticsInflationScenarioActive ||
    (snapshot.freightCapacityBand === 'critical' && snapshot.portBacklogBand === 'severe')
  ) {
    highInflationScenario = true;
  }
  if (snapshot.utilitiesOutageBandSevere) {
    highInflationScenario = true;
  }
  if (snapshot.logisticsInflationLatch && snapshot.freightCongestionBand === 'gridlocked') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.freightCongestionBand === 'building' && snapshot.fuelSurchargeActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  let systemicLiquidityBand = base.systemicLiquidityBand;
  if (snapshot.freightCapacityBand === 'critical' && snapshot.portBacklogBand !== 'clear') {
    systemicLiquidityBand = systemicLiquidityBand === 'critical' ? 'critical' : 'strained';
  }
  if (snapshot.utilitiesGridCapacityMarginThin || snapshot.utilitiesOutageBandSevere) {
    systemicLiquidityBand = snapshot.utilitiesOutageBandSevere ? 'critical' : systemicLiquidityBand === 'critical' ? 'critical' : 'strained';
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
    systemicLiquidityBand,
  };
}

export function agent12TransportBridgeIntegrationNote(): string {
  return 'Agent 12 transport snapshot adjusts logistics-side inflation flags; no infrastructure ledger writes.';
}
