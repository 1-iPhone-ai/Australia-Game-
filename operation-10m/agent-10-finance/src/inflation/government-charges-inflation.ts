import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type GovernmentChargesPressureBand = 'flat' | 'creeping' | 'elevated' | 'step_up';

export interface GovernmentChargesInflationAssessment {
  pressureBand: GovernmentChargesPressureBand;
  chargesIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Indexed fees, levies, and regulatory charges in macro CPI metadata. */
export function assessGovernmentChargesInflation(input: {
  feeIndexationBand: 'below_cpi' | 'at_cpi' | 'above_cpi';
  newLevyStackActive: boolean;
  localGovernmentPressure: 'low' | 'medium' | 'high';
  inflationBand: InflationConditionsBand;
  turn: number;
}): GovernmentChargesInflationAssessment {
  let pressure = 0;
  if (input.feeIndexationBand === 'above_cpi') pressure += 0.32;
  else if (input.feeIndexationBand === 'at_cpi') pressure += 0.18;

  if (input.newLevyStackActive) pressure += 0.24;
  if (input.localGovernmentPressure === 'high') pressure += 0.2;
  else if (input.localGovernmentPressure === 'medium') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const chargesIndex = finRound(100 + pressure * 12, 1);

  let pressureBand: GovernmentChargesPressureBand = 'flat';
  if (pressure >= 0.58) pressureBand = 'step_up';
  else if (pressure >= 0.38) pressureBand = 'elevated';
  else if (pressure >= 0.18) pressureBand = 'creeping';

  const inflationScoreNudge =
    pressureBand === 'step_up'
      ? 0.07
      : pressureBand === 'elevated'
        ? 0.04
        : pressureBand === 'creeping'
          ? 0.02
          : 0;

  const narrative =
    pressureBand === 'step_up' || pressureBand === 'elevated'
      ? 'Government charges and indexed fees are adding to headline CPI stickiness.'
      : pressureBand === 'creeping'
        ? 'Government charges creeping higher — watch levy and local fee stacks.'
        : 'Government charges inflation flat versus services basket.';

  return { pressureBand, chargesIndex, inflationScoreNudge, narrative };
}

export function governmentChargesInflationScoreAdjustment(band: GovernmentChargesPressureBand): number {
  if (band === 'step_up') return 4;
  if (band === 'elevated') return 3;
  if (band === 'creeping') return 2;
  return 0;
}
