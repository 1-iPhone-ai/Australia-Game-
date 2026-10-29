import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only fiscal snapshot from Agent 07 public finance (contract only). */
export interface Agent07FiscalSnapshot {
  turn: number;
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  revenueMomentum: 'weak' | 'steady' | 'strong';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  /** Round 20: fiscal anchor breach feeding indexed charges CPI. */
  fiscalAnchorBreached?: boolean;
  /** Round 20: government indexed charges pass-through active. */
  indexedChargesInflationPassThrough?: boolean;
}

export function mergeAgent07IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent07FiscalSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let fiscalPressure = base.fiscalPressure;
  if (snapshot.consolidatedDeficitBand === 'large_deficit') {
    if (snapshot.debtServicePressure === 'critical' || fiscalPressure === 'strained') {
      fiscalPressure = 'critical';
    } else if (fiscalPressure === 'healthy') {
      fiscalPressure = 'strained';
    } else if (fiscalPressure === 'tight') {
      fiscalPressure = 'critical';
    }
  } else if (snapshot.consolidatedDeficitBand === 'moderate_deficit' && fiscalPressure === 'healthy') {
    fiscalPressure = 'tight';
  }

  let sovereignDebtPressure = base.sovereignDebtPressure;
  if (snapshot.debtServicePressure === 'critical') {
    sovereignDebtPressure = 'critical';
  } else if (snapshot.debtServicePressure === 'elevated' && sovereignDebtPressure === 'manageable') {
    sovereignDebtPressure = 'elevated';
  }

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.revenueMomentum === 'weak' && snapshot.debtServicePressure !== 'low') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let fiscalSustainability = base.fiscalSustainability;
  if (snapshot.debtServicePressure === 'critical') {
    fiscalSustainability = 'vulnerable';
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.fiscalAnchorBreached && snapshot.indexedChargesInflationPassThrough) {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.fiscalAnchorBreached) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    fiscalPressure,
    sovereignDebtPressure,
    fiscalSustainability,
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent07FiscalBridgeIntegrationNote(): string {
  return 'Agent 07 fiscal snapshot adjusts fiscal pressure and debt bands only; no direct commodity price writes.';
}
