import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type FiscalAppropriationInflationPressureLatchBand = 'stable' | 'elevated' | 'critical' | 'appropriation_runaway';

export interface FiscalAppropriationInflationPressureLatchAssessment {
  latchBand: FiscalAppropriationInflationPressureLatchBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Fiscal appropriation inflation pressure latch (Agent 07). */
export function assessFiscalAppropriationInflationPressureLatch(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  wave38AppropriationInflationLatch: boolean;
  fiscalPressureEscalationBand: 'stable' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): FiscalAppropriationInflationPressureLatchAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') pressure += 0.22;
  else if (input.consolidatedDeficitBand === 'moderate_deficit') pressure += 0.1;
  if (input.debtServicePressure === 'critical') pressure += 0.2;
  else if (input.debtServicePressure === 'elevated') pressure += 0.1;
  if (input.wave38AppropriationInflationLatch) pressure += 0.14;
  if (input.fiscalPressureEscalationBand === 'critical') pressure += 0.21;
  else if (input.fiscalPressureEscalationBand === 'elevated') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 17, 1);

  let latchBand: FiscalAppropriationInflationPressureLatchBand = 'stable';
  if (pressure >= 0.58) latchBand = 'appropriation_runaway';
  else if (pressure >= 0.39) latchBand = 'critical';
  else if (pressure >= 0.18) latchBand = 'elevated';

  const inflationScoreNudge =
    latchBand === 'appropriation_runaway'
      ? 0.093
      : latchBand === 'critical'
        ? 0.059
        : latchBand === 'elevated'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'appropriation_runaway' || latchBand === 'critical'
      ? 'Fiscal appropriation latch elevating CPI debt-service metadata.'
      : latchBand === 'elevated'
        ? 'Deficit pressure building appropriation inflation latch.'
        : 'Fiscal appropriation pressure stable versus headline CPI.';

  return { latchBand, pressureIndex, inflationScoreNudge, narrative };
}

export function fiscalAppropriationInflationPressureLatchScoreAdjustment(
  band: FiscalAppropriationInflationPressureLatchBand,
): number {
  if (band === 'appropriation_runaway') return 4;
  if (band === 'critical') return 3;
  if (band === 'elevated') return 2;
  return 0;
}
