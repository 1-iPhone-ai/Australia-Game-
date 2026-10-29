import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type FiscalIndexationInflationAnchorBreachBand = 'anchored' | 'strained' | 'breached' | 'cascade';

export interface FiscalIndexationInflationAnchorBreachAssessment {
  breachBand: FiscalIndexationInflationAnchorBreachBand;
  fiscalIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Fiscal indexation and anchor breach inflation pressure (Agent 07). */
export function assessFiscalIndexationInflationAnchorBreach(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  fiscalAnchorBreached: boolean;
  debtIndexationInflationLatch: boolean;
  fiscalPassThroughCascadeBand: 'muted' | 'building' | 'runaway';
  inflationBand: InflationConditionsBand;
  turn: number;
}): FiscalIndexationInflationAnchorBreachAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') {
    pressure += 0.18;
  } else if (input.consolidatedDeficitBand === 'moderate_deficit') {
    pressure += 0.08;
  }
  if (input.debtServicePressure === 'critical') {
    pressure += 0.22;
  } else if (input.debtServicePressure === 'elevated') {
    pressure += 0.11;
  }
  if (input.fiscalAnchorBreached) {
    pressure += 0.16;
  }
  if (input.debtIndexationInflationLatch) {
    pressure += 0.13;
  }
  if (input.fiscalPassThroughCascadeBand === 'runaway') {
    pressure += 0.21;
  } else if (input.fiscalPassThroughCascadeBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const fiscalIndex = finRound(100 + pressure * 15, 1);

  let breachBand: FiscalIndexationInflationAnchorBreachBand = 'anchored';
  if (pressure >= 0.54) breachBand = 'cascade';
  else if (pressure >= 0.34) breachBand = 'breached';
  else if (pressure >= 0.15) breachBand = 'strained';

  const inflationScoreNudge =
    breachBand === 'cascade'
      ? 0.09
      : breachBand === 'breached'
        ? 0.056
        : breachBand === 'strained'
          ? 0.026
          : 0;

  const narrative =
    breachBand === 'cascade' || breachBand === 'breached'
      ? 'Fiscal indexation anchor breach feeding indexed-charge CPI metadata.'
      : breachBand === 'strained'
        ? 'Debt indexation latch building fiscal pass-through pressure.'
        : 'Fiscal indexation anchor held versus headline CPI.';

  return { breachBand, fiscalIndex, inflationScoreNudge, narrative };
}

export function fiscalIndexationInflationAnchorBreachScoreAdjustment(
  band: FiscalIndexationInflationAnchorBreachBand,
): number {
  if (band === 'cascade') return 4;
  if (band === 'breached') return 3;
  if (band === 'strained') return 2;
  return 0;
}
