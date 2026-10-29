import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type PublicFinanceDebtServiceBand = 'anchored' | 'firming' | 'elevated' | 'dominance_risk';

export interface PublicFinanceDebtServiceInflationAssessment {
  debtServiceBand: PublicFinanceDebtServiceBand;
  fiscalIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Consolidated fiscal and debt-service pass-through into CPI metadata (Agent 07). */
export function assessPublicFinanceDebtServiceInflation(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  fiscalAnchorBreached: boolean;
  indexedChargesInflationPassThrough: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): PublicFinanceDebtServiceInflationAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') {
    pressure += 0.28;
  } else if (input.consolidatedDeficitBand === 'moderate_deficit') {
    pressure += 0.12;
  }
  if (input.debtServicePressure === 'critical') {
    pressure += 0.26;
  } else if (input.debtServicePressure === 'elevated') {
    pressure += 0.14;
  }
  if (input.fiscalAnchorBreached) {
    pressure += 0.2;
  }
  if (input.indexedChargesInflationPassThrough) {
    pressure += 0.11;
  }
  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const fiscalIndex = finRound(100 + pressure * 17, 1);

  let debtServiceBand: PublicFinanceDebtServiceBand = 'anchored';
  if (pressure >= 0.56) debtServiceBand = 'dominance_risk';
  else if (pressure >= 0.36) debtServiceBand = 'elevated';
  else if (pressure >= 0.18) debtServiceBand = 'firming';

  const inflationScoreNudge =
    debtServiceBand === 'dominance_risk'
      ? 0.088
      : debtServiceBand === 'elevated'
        ? 0.057
        : debtServiceBand === 'firming'
          ? 0.027
          : 0;

  const narrative =
    debtServiceBand === 'dominance_risk' || debtServiceBand === 'elevated'
      ? 'Public finance debt service and indexed charges are lifting CPI through fiscal pressure.'
      : debtServiceBand === 'firming'
        ? 'Fiscal debt-service pass-through firming as deficit and anchor bands tighten.'
        : 'Public finance debt-service CPI contribution anchored versus headline.';

  return { debtServiceBand, fiscalIndex, inflationScoreNudge, narrative };
}

export function publicFinanceDebtServiceInflationScoreAdjustment(band: PublicFinanceDebtServiceBand): number {
  if (band === 'dominance_risk') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}
