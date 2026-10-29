import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type MetroUrbanRentInflationSurgeBand = 'subdued' | 'building' | 'surging' | 'critical';

export interface MetroUrbanRentInflationSurgeAssessment {
  surgeBand: MetroUrbanRentInflationSurgeBand;
  metroIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Metro urban rent and vacancy inflation surge (Agent 11). */
export function assessMetroUrbanRentInflationSurge(input: {
  vacancyBand: 'loose' | 'balanced' | 'tight' | 'critical';
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  urbanizationPressure: 'low' | 'medium' | 'high';
  urbanRentInflationLatch: boolean;
  metroDispersionStressBand: 'aligned' | 'widening' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MetroUrbanRentInflationSurgeAssessment {
  let pressure = 0;
  if (input.vacancyBand === 'critical') pressure += 0.22;
  else if (input.vacancyBand === 'tight') pressure += 0.11;
  if (input.rentGrowthBand === 'surging') pressure += 0.24;
  else if (input.rentGrowthBand === 'strong') pressure += 0.12;
  if (input.urbanizationPressure === 'high') pressure += 0.1;
  if (input.urbanRentInflationLatch) pressure += 0.13;
  if (input.metroDispersionStressBand === 'critical') pressure += 0.2;
  else if (input.metroDispersionStressBand === 'widening') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const metroIndex = finRound(100 + pressure * 16, 1);

  let surgeBand: MetroUrbanRentInflationSurgeBand = 'subdued';
  if (pressure >= 0.55) surgeBand = 'critical';
  else if (pressure >= 0.35) surgeBand = 'surging';
  else if (pressure >= 0.15) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'critical' ? 0.09 : surgeBand === 'surging' ? 0.057 : surgeBand === 'building' ? 0.027 : 0;

  const narrative =
    surgeBand === 'critical' || surgeBand === 'surging'
      ? 'Metro urban rent surge lifting shelter-side CPI metadata.'
      : surgeBand === 'building'
        ? 'Urban rent inflation latch building across vacancy bands.'
        : 'Metro rent surge subdued versus headline CPI.';

  return { surgeBand, metroIndex, inflationScoreNudge, narrative };
}

export function metroUrbanRentInflationSurgeScoreAdjustment(band: MetroUrbanRentInflationSurgeBand): number {
  if (band === 'critical') return 4;
  if (band === 'surging') return 3;
  if (band === 'building') return 2;
  return 0;
}
