import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only idle automation snapshot from Agent 20 (contract only). */
export interface Agent20AutomationSnapshot {
  turn: number;
  macroAutopilotInflationBias: 'deflate' | 'neutral' | 'inflate';
  unattendedShockDriftActive: boolean;
  automationConfidenceScore: number;
}

export function mergeAgent20IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent20AutomationSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.macroAutopilotInflationBias === 'inflate') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  } else if (snapshot.macroAutopilotInflationBias === 'deflate') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  if (snapshot.unattendedShockDriftActive && snapshot.automationConfidenceScore < 0.45) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.09, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.macroAutopilotInflationBias === 'inflate' && snapshot.unattendedShockDriftActive) {
    highInflationScenario = true;
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent20AutomationBridgeIntegrationNote(): string {
  return 'Agent 20 automation snapshot adjusts autopilot inflation bias flags; no automation queue writes.';
}
