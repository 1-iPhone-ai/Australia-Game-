import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type EducationTuitionPressureBand = 'stable' | 'rising' | 'sharp' | 'crisis';

export interface EducationTuitionInflationAssessment {
  pressureBand: EducationTuitionPressureBand;
  tuitionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Education and training fees in macro CPI metadata (not student loan ledger). */
export function assessEducationTuitionInflation(input: {
  enrollmentPressureBand: 'low' | 'moderate' | 'high';
  subsidyCutActive: boolean;
  wageIndexationBand: 'muted' | 'normal' | 'strong';
  inflationBand: InflationConditionsBand;
  turn: number;
}): EducationTuitionInflationAssessment {
  let pressure = 0;
  if (input.enrollmentPressureBand === 'high') pressure += 0.28;
  else if (input.enrollmentPressureBand === 'moderate') pressure += 0.14;

  if (input.subsidyCutActive) pressure += 0.24;
  if (input.wageIndexationBand === 'strong') pressure += 0.22;
  else if (input.wageIndexationBand === 'normal') pressure += 0.1;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const tuitionIndex = finRound(100 + pressure * 15, 1);

  let pressureBand: EducationTuitionPressureBand = 'stable';
  if (pressure >= 0.62) pressureBand = 'crisis';
  else if (pressure >= 0.4) pressureBand = 'sharp';
  else if (pressure >= 0.2) pressureBand = 'rising';

  const inflationScoreNudge =
    pressureBand === 'crisis'
      ? 0.08
      : pressureBand === 'sharp'
        ? 0.05
        : pressureBand === 'rising'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'crisis' || pressureBand === 'sharp'
      ? 'Education fees are contributing to services CPI through indexation and subsidy pressure.'
      : pressureBand === 'rising'
        ? 'Tuition inflation rising — enrollment and wage indexation in play.'
        : 'Education tuition inflation stable relative to headline basket.';

  return { pressureBand, tuitionIndex, inflationScoreNudge, narrative };
}

export function educationTuitionInflationScoreAdjustment(band: EducationTuitionPressureBand): number {
  if (band === 'crisis') return 4;
  if (band === 'sharp') return 3;
  if (band === 'rising') return 2;
  return 0;
}
