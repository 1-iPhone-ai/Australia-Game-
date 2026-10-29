import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only AI command center snapshot from Agent 17 (contract only). */
export interface Agent17CommandSnapshot {
  turn: number;
  macroAlertLevel: 'green' | 'amber' | 'red';
  inflationFusionScore: number;
  coordinatedTighteningSuggested: boolean;
}

export function mergeAgent17IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent17CommandSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.macroAlertLevel === 'red') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.11, 0.85, 1.45);
  } else if (snapshot.macroAlertLevel === 'amber') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.inflationFusionScore > 0.72) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.macroAlertLevel === 'red' && snapshot.inflationFusionScore > 0.65) {
    highInflationScenario = true;
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent17CommandBridgeIntegrationNote(): string {
  return 'Agent 17 command snapshot reflects fused macro alert state; no command queue writes.';
}
