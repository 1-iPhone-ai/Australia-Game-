import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type RecreationLeisurePressureBand = 'soft' | 'firming' | 'hot' | 'boom';

export interface RecreationLeisureInflationAssessment {
  pressureBand: RecreationLeisurePressureBand;
  leisureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Recreation, dining-out, and leisure services in macro CPI metadata. */
export function assessRecreationLeisureInflation(input: {
  tourismDemandBand: 'weak' | 'normal' | 'strong' | 'surge';
  laborCostPassThrough: 'low' | 'medium' | 'high';
  discretionarySpendPressure: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): RecreationLeisureInflationAssessment {
  let pressure = 0;
  if (input.tourismDemandBand === 'surge') pressure += 0.38;
  else if (input.tourismDemandBand === 'strong') pressure += 0.24;
  else if (input.tourismDemandBand === 'normal') pressure += 0.08;

  if (input.laborCostPassThrough === 'high') pressure += 0.22;
  else if (input.laborCostPassThrough === 'medium') pressure += 0.12;

  if (input.discretionarySpendPressure) pressure += 0.16;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const leisureIndex = finRound(100 + pressure * 14, 1);

  let pressureBand: RecreationLeisurePressureBand = 'soft';
  if (pressure >= 0.58) pressureBand = 'boom';
  else if (pressure >= 0.38) pressureBand = 'hot';
  else if (pressure >= 0.2) pressureBand = 'firming';

  const inflationScoreNudge =
    pressureBand === 'boom'
      ? 0.07
      : pressureBand === 'hot'
        ? 0.05
        : pressureBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'boom' || pressureBand === 'hot'
      ? 'Recreation and leisure services are adding to discretionary CPI momentum.'
      : pressureBand === 'firming'
        ? 'Leisure inflation firming — tourism and labor pass-through elevated.'
        : 'Recreation leisure inflation soft versus headline goods.';

  return { pressureBand, leisureIndex, inflationScoreNudge, narrative };
}

export function recreationLeisureInflationScoreAdjustment(band: RecreationLeisurePressureBand): number {
  if (band === 'boom') return 4;
  if (band === 'hot') return 3;
  if (band === 'firming') return 2;
  return 0;
}
