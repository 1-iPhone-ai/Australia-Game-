import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type HealthcareServicesPressureBand = 'contained' | 'elevated' | 'stressed' | 'crisis';

export interface HealthcareServicesInflationAssessment {
  pressureBand: HealthcareServicesPressureBand;
  servicesIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Non-insurance healthcare and aged-care services in macro CPI metadata. */
export function assessHealthcareServicesInflation(input: {
  wagePressureBand: 'low' | 'moderate' | 'high' | 'acute';
  demandSurgeActive: boolean;
  workforceShortageBand: 'none' | 'moderate' | 'severe';
  inflationBand: InflationConditionsBand;
  turn: number;
}): HealthcareServicesInflationAssessment {
  let pressure = 0;
  if (input.wagePressureBand === 'acute') pressure += 0.42;
  else if (input.wagePressureBand === 'high') pressure += 0.28;
  else if (input.wagePressureBand === 'moderate') pressure += 0.12;

  if (input.demandSurgeActive) pressure += 0.2;
  if (input.workforceShortageBand === 'severe') pressure += 0.26;
  else if (input.workforceShortageBand === 'moderate') pressure += 0.14;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.08;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const servicesIndex = finRound(100 + pressure * 17, 1);

  let pressureBand: HealthcareServicesPressureBand = 'contained';
  if (pressure >= 0.65) pressureBand = 'crisis';
  else if (pressure >= 0.42) pressureBand = 'stressed';
  else if (pressure >= 0.22) pressureBand = 'elevated';

  const inflationScoreNudge =
    pressureBand === 'crisis'
      ? 0.1
      : pressureBand === 'stressed'
        ? 0.07
        : pressureBand === 'elevated'
          ? 0.04
          : 0;

  const narrative =
    pressureBand === 'crisis' || pressureBand === 'stressed'
      ? 'Healthcare services are lifting core CPI through wage and capacity constraints.'
      : pressureBand === 'elevated'
        ? 'Healthcare services inflation elevated — workforce and demand pressure building.'
        : 'Healthcare services inflation contained relative to goods basket.';

  return { pressureBand, servicesIndex, inflationScoreNudge, narrative };
}

export function healthcareServicesInflationScoreAdjustment(band: HealthcareServicesPressureBand): number {
  if (band === 'crisis') return 5;
  if (band === 'stressed') return 3;
  if (band === 'elevated') return 2;
  return 0;
}
