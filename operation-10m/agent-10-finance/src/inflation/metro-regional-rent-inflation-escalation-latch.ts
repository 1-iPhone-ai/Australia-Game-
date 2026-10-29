import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type MetroRegionalRentInflationEscalationLatchBand =
  | 'subdued'
  | 'building'
  | 'escalated'
  | 'regional_crisis';

export interface MetroRegionalRentInflationEscalationLatchAssessment {
  latchBand: MetroRegionalRentInflationEscalationLatchBand;
  escalationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Metro regional rent inflation escalation latch (Agent 11, round 49). */
export function assessMetroRegionalRentInflationEscalationLatch(input: {
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  regionalDispersionScore: number;
  wave49MetroRegionalRentLatch: boolean;
  regionalRentEscalationBand: 'contained' | 'building' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MetroRegionalRentInflationEscalationLatchAssessment {
  let pressure = 0;
  if (input.rentGrowthBand === 'surging') pressure += 0.19;
  else if (input.rentGrowthBand === 'strong') pressure += 0.1;
  if (input.regionalDispersionScore > 0.55) pressure += 0.12;
  else if (input.regionalDispersionScore > 0.35) pressure += 0.06;
  if (input.wave49MetroRegionalRentLatch) pressure += 0.14;
  if (input.regionalRentEscalationBand === 'critical') pressure += 0.22;
  else if (input.regionalRentEscalationBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const escalationIndex = finRound(100 + pressure * 16.4, 1);

  let latchBand: MetroRegionalRentInflationEscalationLatchBand = 'subdued';
  if (pressure >= 0.57) latchBand = 'regional_crisis';
  else if (pressure >= 0.38) latchBand = 'escalated';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'regional_crisis'
      ? 0.092
      : latchBand === 'escalated'
        ? 0.058
        : latchBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    latchBand === 'regional_crisis' || latchBand === 'escalated'
      ? 'Metro regional rent escalation latch elevating CPI shelter metadata.'
      : latchBand === 'building'
        ? 'Regional rent dispersion latch building under metro stress.'
        : 'Metro regional rent escalation latch subdued versus headline CPI.';

  return { latchBand, escalationIndex, inflationScoreNudge, narrative };
}

export function metroRegionalRentInflationEscalationLatchScoreAdjustment(
  band: MetroRegionalRentInflationEscalationLatchBand,
): number {
  if (band === 'regional_crisis') return 4;
  if (band === 'escalated') return 3;
  if (band === 'building') return 2;
  return 0;
}
