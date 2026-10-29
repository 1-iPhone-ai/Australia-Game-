import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only strategic gameplay snapshot from Agent 01 (contract only). */
export interface Agent01StrategicSnapshot {
  turn: number;
  nationalPriorityInflationBias: 'containment' | 'neutral' | 'expansionary';
  strategicStockpileStress: boolean;
  geopoliticalRiskPremium: number;
  /** Round 24: expansionary priority cascade feeding CPI metadata. */
  expansionaryPriorityCascadeActive?: boolean;
  /** Round 24: strategic inflation risk band. */
  strategicInflationRiskBand?: 'low' | 'elevated' | 'critical';
}

export function mergeAgent01IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent01StrategicSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.nationalPriorityInflationBias === 'expansionary') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  } else if (snapshot.nationalPriorityInflationBias === 'containment') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  if (snapshot.strategicStockpileStress) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.geopoliticalRiskPremium > 0.55) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + snapshot.geopoliticalRiskPremium * 0.08, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.strategicStockpileStress && snapshot.nationalPriorityInflationBias === 'expansionary') {
    highInflationScenario = true;
  }
  if (snapshot.expansionaryPriorityCascadeActive || snapshot.strategicInflationRiskBand === 'critical') {
    highInflationScenario = true;
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent01StrategicBridgeIntegrationNote(): string {
  return 'Agent 01 strategic snapshot adjusts national inflation bias flags; no strategy ledger writes.';
}
