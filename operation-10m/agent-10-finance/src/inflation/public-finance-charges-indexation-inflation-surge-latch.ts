import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type PublicFinanceChargesIndexationInflationSurgeLatchBand =
  | 'contained'
  | 'building'
  | 'surge'
  | 'indexation_rupture';

export interface PublicFinanceChargesIndexationInflationSurgeLatchAssessment {
  surgeBand: PublicFinanceChargesIndexationInflationSurgeLatchBand;
  indexationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Public finance charges indexation inflation surge latch (Agent 07, round 51). */
export function assessPublicFinanceChargesIndexationInflationSurgeLatch(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  wave51PublicFinanceIndexationSurgeLatch: boolean;
  chargesIndexationSurgeBand: 'contained' | 'building' | 'ruptured';
  indexedChargesInflationPassThrough: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): PublicFinanceChargesIndexationInflationSurgeLatchAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') pressure += 0.19;
  else if (input.consolidatedDeficitBand === 'moderate_deficit') pressure += 0.1;
  if (input.debtServicePressure === 'critical') pressure += 0.2;
  else if (input.debtServicePressure === 'elevated') pressure += 0.11;
  if (input.wave51PublicFinanceIndexationSurgeLatch) pressure += 0.13;
  if (input.chargesIndexationSurgeBand === 'ruptured') pressure += 0.22;
  else if (input.chargesIndexationSurgeBand === 'building') pressure += 0.1;
  if (input.indexedChargesInflationPassThrough) pressure += 0.09;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const indexationIndex = finRound(100 + pressure * 15.9, 1);

  let surgeBand: PublicFinanceChargesIndexationInflationSurgeLatchBand = 'contained';
  if (pressure >= 0.57) surgeBand = 'indexation_rupture';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'indexation_rupture'
      ? 0.093
      : surgeBand === 'surge'
        ? 0.059
        : surgeBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    surgeBand === 'indexation_rupture' || surgeBand === 'surge'
      ? 'Public finance charges indexation surge latch feeding CPI government-charges metadata.'
      : surgeBand === 'building'
        ? 'Charges indexation surge latch building under debt-service stress.'
        : 'Public finance indexation surge latch contained versus headline CPI.';

  return { surgeBand, indexationIndex, inflationScoreNudge, narrative };
}

export function publicFinanceChargesIndexationInflationSurgeLatchScoreAdjustment(
  band: PublicFinanceChargesIndexationInflationSurgeLatchBand,
): number {
  if (band === 'indexation_rupture') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}
