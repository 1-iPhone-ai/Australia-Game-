import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type DomesticTravelPressureBand = 'subdued' | 'recovering' | 'hot' | 'overheated';

export interface DomesticTravelInflationAssessment {
  pressureBand: DomesticTravelPressureBand;
  travelIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Domestic air, rail, and accommodation services in macro CPI metadata. */
export function assessDomesticTravelInflation(input: {
  routeCapacityBand: 'ample' | 'balanced' | 'constrained';
  fuelSurchargePassThrough: boolean;
  accommodationOccupancyBand: 'low' | 'normal' | 'full';
  inflationBand: InflationConditionsBand;
  turn: number;
}): DomesticTravelInflationAssessment {
  let pressure = 0;
  if (input.routeCapacityBand === 'constrained') pressure += 0.34;
  else if (input.routeCapacityBand === 'balanced') pressure += 0.12;

  if (input.fuelSurchargePassThrough) pressure += 0.18;
  if (input.accommodationOccupancyBand === 'full') pressure += 0.22;
  else if (input.accommodationOccupancyBand === 'normal') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const travelIndex = finRound(100 + pressure * 16, 1);

  let pressureBand: DomesticTravelPressureBand = 'subdued';
  if (pressure >= 0.58) pressureBand = 'overheated';
  else if (pressure >= 0.38) pressureBand = 'hot';
  else if (pressure >= 0.2) pressureBand = 'recovering';

  const inflationScoreNudge =
    pressureBand === 'overheated'
      ? 0.08
      : pressureBand === 'hot'
        ? 0.05
        : pressureBand === 'recovering'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'overheated' || pressureBand === 'hot'
      ? 'Domestic travel and accommodation are feeding discretionary CPI momentum.'
      : pressureBand === 'recovering'
        ? 'Travel inflation recovering — capacity and fuel surcharges building.'
        : 'Domestic travel inflation subdued versus services headline.';

  return { pressureBand, travelIndex, inflationScoreNudge, narrative };
}

export function domesticTravelInflationScoreAdjustment(band: DomesticTravelPressureBand): number {
  if (band === 'overheated') return 4;
  if (band === 'hot') return 3;
  if (band === 'recovering') return 2;
  return 0;
}
