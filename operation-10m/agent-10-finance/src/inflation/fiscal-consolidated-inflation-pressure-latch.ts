import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type FiscalConsolidatedInflationPressureLatchBand = 'subdued' | 'building' | 'latched' | 'fiscal_crisis';

export interface FiscalConsolidatedInflationPressureLatchAssessment {
  latchBand: FiscalConsolidatedInflationPressureLatchBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Fiscal consolidated inflation pressure latch (Agent 07, round 46). */
export function assessFiscalConsolidatedInflationPressureLatch(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  wave46FiscalPressureLatch: boolean;
  consolidatedDeficitEscalationBand: 'stable' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): FiscalConsolidatedInflationPressureLatchAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') pressure += 0.2;
  else if (input.consolidatedDeficitBand === 'moderate_deficit') pressure += 0.1;
  if (input.debtServicePressure === 'critical') pressure += 0.21;
  else if (input.debtServicePressure === 'elevated') pressure += 0.11;
  if (input.wave46FiscalPressureLatch) pressure += 0.14;
  if (input.consolidatedDeficitEscalationBand === 'critical') pressure += 0.22;
  else if (input.consolidatedDeficitEscalationBand === 'elevated') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 16, 1);

  let latchBand: FiscalConsolidatedInflationPressureLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'fiscal_crisis';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'fiscal_crisis'
      ? 0.093
      : latchBand === 'latched'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'fiscal_crisis' || latchBand === 'latched'
      ? 'Fiscal consolidated pressure latch elevating CPI debt-service metadata.'
      : latchBand === 'building'
        ? 'Deficit escalation latch building under debt service stress.'
        : 'Fiscal consolidated pressure latch subdued versus headline CPI.';

  return { latchBand, pressureIndex, inflationScoreNudge, narrative };
}

export function fiscalConsolidatedInflationPressureLatchScoreAdjustment(
  band: FiscalConsolidatedInflationPressureLatchBand,
): number {
  if (band === 'fiscal_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}
