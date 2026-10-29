import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only guardian co-pilot snapshot from Agent 16 (contract only). */
export interface Agent16GuardianSnapshot {
  turn: number;
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  narrativeShockSeverity: 'low' | 'medium' | 'high';
}

export function mergeAgent16IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent16GuardianSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.inflationGuardrailTripped) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  }
  if (snapshot.narrativeShockSeverity === 'high') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  let publicStability = base.publicStability;
  if (snapshot.stabilityInterventionBand === 'urgent') {
    publicStability = Math.max(0, publicStability - 8);
  } else if (snapshot.stabilityInterventionBand === 'advisory') {
    publicStability = Math.max(0, publicStability - 4);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.inflationGuardrailTripped && snapshot.stabilityInterventionBand === 'urgent') {
    highInflationScenario = true;
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    publicStability,
    highInflationScenario,
  };
}

export function agent16GuardianBridgeIntegrationNote(): string {
  return 'Agent 16 guardian snapshot reflects inflation guardrail state; no co-pilot action writes.';
}
