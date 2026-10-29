import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type ProfessionalServicesFeeBand = 'stable' | 'rising' | 'sharp' | 'squeeze';

export interface ProfessionalServicesFeeInflationAssessment {
  feeBand: ProfessionalServicesFeeBand;
  feeIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Legal, accounting, and consulting fee pass-through in macro CPI metadata. */
export function assessProfessionalServicesFeeInflation(input: {
  billingRatePressure: 'muted' | 'normal' | 'elevated' | 'extreme';
  complianceCostStack: boolean;
  corporateDemandBand: 'soft' | 'steady' | 'strong';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ProfessionalServicesFeeInflationAssessment {
  let pressure = 0;
  if (input.billingRatePressure === 'extreme') pressure += 0.44;
  else if (input.billingRatePressure === 'elevated') pressure += 0.28;
  else if (input.billingRatePressure === 'normal') pressure += 0.1;

  if (input.complianceCostStack) pressure += 0.2;
  if (input.corporateDemandBand === 'strong') pressure += 0.14;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const feeIndex = finRound(100 + pressure * 13, 1);

  let feeBand: ProfessionalServicesFeeBand = 'stable';
  if (pressure >= 0.62) feeBand = 'squeeze';
  else if (pressure >= 0.4) feeBand = 'sharp';
  else if (pressure >= 0.22) feeBand = 'rising';

  const inflationScoreNudge =
    feeBand === 'squeeze'
      ? 0.08
      : feeBand === 'sharp'
        ? 0.05
        : feeBand === 'rising'
          ? 0.03
          : 0;

  const narrative =
    feeBand === 'squeeze' || feeBand === 'sharp'
      ? 'Professional services fees are lifting core services CPI through billing and compliance stacks.'
      : feeBand === 'rising'
        ? 'Professional fee inflation rising — corporate demand and rate pressure building.'
        : 'Professional services fee inflation stable relative to goods basket.';

  return { feeBand, feeIndex, inflationScoreNudge, narrative };
}

export function professionalServicesFeeInflationScoreAdjustment(band: ProfessionalServicesFeeBand): number {
  if (band === 'squeeze') return 4;
  if (band === 'sharp') return 3;
  if (band === 'rising') return 2;
  return 0;
}
