import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only team intelligence snapshot from Agent 18 (contract only). */
export interface Agent18TeamSnapshot {
  turn: number;
  consensusInflationOutlook: 'disinflation' | 'stable' | 'reacceleration' | 'upside_risk';
  briefingUrgencyBand: 'routine' | 'elevated' | 'critical';
  crossDomainStressScore: number;
}

export function mergeAgent18IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent18TeamSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.consensusInflationOutlook === 'upside_risk' || snapshot.consensusInflationOutlook === 'reacceleration') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  } else if (snapshot.consensusInflationOutlook === 'disinflation') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  if (snapshot.crossDomainStressScore > 0.7) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.consensusInflationOutlook === 'upside_risk' &&
    snapshot.briefingUrgencyBand === 'critical'
  ) {
    highInflationScenario = true;
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent18TeamBridgeIntegrationNote(): string {
  return 'Agent 18 team snapshot adjusts consensus inflation outlook flags; no briefing ledger writes.';
}
