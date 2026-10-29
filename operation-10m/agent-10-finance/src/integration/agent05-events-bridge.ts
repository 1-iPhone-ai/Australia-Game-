import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only dynamic events snapshot from Agent 05 (contract only). */
export interface Agent05EventsSnapshot {
  turn: number;
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  confidenceShockBand: 'calm' | 'uneasy' | 'severe';
}

export function mergeAgent05IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent05EventsSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.inflationShockEventActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.12, 0.85, 1.45);
  }
  if (snapshot.supplyDisruptionSeverity === 'national') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  } else if (snapshot.supplyDisruptionSeverity === 'localized') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.inflationShockEventActive &&
    (snapshot.supplyDisruptionSeverity === 'national' || snapshot.confidenceShockBand === 'severe')
  ) {
    highInflationScenario = true;
  }

  let publicStability = base.publicStability;
  if (snapshot.confidenceShockBand === 'severe') {
    publicStability = Math.max(0, publicStability - 6);
  } else if (snapshot.confidenceShockBand === 'uneasy') {
    publicStability = Math.max(0, publicStability - 3);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
    publicStability,
  };
}

export function agent05EventsBridgeIntegrationNote(): string {
  return 'Agent 05 events snapshot adjusts inflation shock flags from narrative events; no event queue writes.';
}
