import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only turns / time snapshot from Agent 02 (contract only). */
export interface Agent02TurnsSnapshot {
  turn: number;
  calendarSeasonBand: 'off_peak' | 'normal' | 'peak_demand';
  policyReviewWindowOpen: boolean;
  multiTurnInflationCarryover: number;
}

export function mergeAgent02IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent02TurnsSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.calendarSeasonBand === 'peak_demand') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }

  if (snapshot.multiTurnInflationCarryover > 0.15) {
    inflationSettingMultiplier = finClamp(
      inflationSettingMultiplier + snapshot.multiTurnInflationCarryover * 0.25,
      0.85,
      1.45,
    );
  }

  if (snapshot.policyReviewWindowOpen && snapshot.calendarSeasonBand === 'peak_demand') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
  };
}

export function agent02TurnsBridgeIntegrationNote(): string {
  return 'Agent 02 turns snapshot adjusts seasonal inflation carryover; no calendar save writes.';
}
