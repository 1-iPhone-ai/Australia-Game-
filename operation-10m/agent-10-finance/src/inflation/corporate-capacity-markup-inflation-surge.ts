import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type CorporateCapacityMarkupInflationSurgeBand = 'contained' | 'building' | 'surge' | 'capacity_crisis';

export interface CorporateCapacityMarkupInflationSurgeAssessment {
  surgeBand: CorporateCapacityMarkupInflationSurgeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Corporate capacity markup inflation surge (Agent 08, round 47). */
export function assessCorporateCapacityMarkupInflationSurge(input: {
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  marginCompression: 'none' | 'mild' | 'severe';
  wave47CorporateCapacityLatch: boolean;
  capacityMarkupSurgeBand: 'contained' | 'building' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CorporateCapacityMarkupInflationSurgeAssessment {
  let pressure = 0;
  if (input.pricingPowerBand === 'dominant') pressure += 0.2;
  else if (input.pricingPowerBand === 'strong') pressure += 0.11;
  if (input.marginCompression === 'none' && input.pricingPowerBand !== 'weak') pressure += 0.08;
  if (input.wave47CorporateCapacityLatch) pressure += 0.13;
  if (input.capacityMarkupSurgeBand === 'ruptured') pressure += 0.22;
  else if (input.capacityMarkupSurgeBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 15.5, 1);

  let surgeBand: CorporateCapacityMarkupInflationSurgeBand = 'contained';
  if (pressure >= 0.57) surgeBand = 'capacity_crisis';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'capacity_crisis'
      ? 0.092
      : surgeBand === 'surge'
        ? 0.059
        : surgeBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    surgeBand === 'capacity_crisis' || surgeBand === 'surge'
      ? 'Corporate capacity markup surge feeding CPI pass-through metadata.'
      : surgeBand === 'building'
        ? 'Capacity constraint latch building under pricing power.'
        : 'Corporate capacity markup surge contained versus headline CPI.';

  return { surgeBand, stressIndex, inflationScoreNudge, narrative };
}

export function corporateCapacityMarkupInflationSurgeScoreAdjustment(
  band: CorporateCapacityMarkupInflationSurgeBand,
): number {
  if (band === 'capacity_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}
