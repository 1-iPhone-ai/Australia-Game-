import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type MetroCapacityRentInflationLatchBand = 'subdued' | 'tightening' | 'surging' | 'capacity_crisis';

export interface MetroCapacityRentInflationLatchAssessment {
  latchBand: MetroCapacityRentInflationLatchBand;
  capacityIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Metro capacity rent inflation latch (Agent 11). */
export function assessMetroCapacityRentInflationLatch(input: {
  vacancyBand: 'loose' | 'balanced' | 'tight' | 'critical';
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  wave40UrbanRentLatch: boolean;
  metroCapacityStressBand: 'aligned' | 'strained' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MetroCapacityRentInflationLatchAssessment {
  let pressure = 0;
  if (input.vacancyBand === 'critical') pressure += 0.24;
  else if (input.vacancyBand === 'tight') pressure += 0.12;
  if (input.rentGrowthBand === 'surging') pressure += 0.2;
  else if (input.rentGrowthBand === 'strong') pressure += 0.1;
  if (input.wave40UrbanRentLatch) pressure += 0.13;
  if (input.metroCapacityStressBand === 'critical') pressure += 0.21;
  else if (input.metroCapacityStressBand === 'strained') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const capacityIndex = finRound(100 + pressure * 17, 1);

  let latchBand: MetroCapacityRentInflationLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'capacity_crisis';
  else if (pressure >= 0.39) latchBand = 'surging';
  else if (pressure >= 0.18) latchBand = 'tightening';

  const inflationScoreNudge =
    latchBand === 'capacity_crisis'
      ? 0.093
      : latchBand === 'surging'
        ? 0.059
        : latchBand === 'tightening'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'capacity_crisis' || latchBand === 'surging'
      ? 'Metro capacity rent latch elevating CPI shelter metadata.'
      : latchBand === 'tightening'
        ? 'Urban rent latch building under vacancy stress.'
        : 'Metro capacity rent latch subdued versus headline CPI.';

  return { latchBand, capacityIndex, inflationScoreNudge, narrative };
}

export function metroCapacityRentInflationLatchScoreAdjustment(band: MetroCapacityRentInflationLatchBand): number {
  if (band === 'capacity_crisis') return 4;
  if (band === 'surging') return 3;
  if (band === 'tightening') return 2;
  return 0;
}
