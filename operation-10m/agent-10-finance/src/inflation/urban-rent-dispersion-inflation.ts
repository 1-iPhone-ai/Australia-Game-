import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type UrbanRentDispersionBand = 'aligned' | 'dispersing' | 'elevated' | 'metro_shock';

export interface UrbanRentDispersionInflationAssessment {
  dispersionBand: UrbanRentDispersionBand;
  urbanIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Urban rent growth and regional dispersion in CPI metadata (Agent 11 cities). */
export function assessUrbanRentDispersionInflation(input: {
  vacancyBand: 'loose' | 'balanced' | 'tight' | 'critical';
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  urbanizationPressure: 'low' | 'medium' | 'high';
  regionalDispersionScore: number;
  metroRentDispersionCritical: boolean;
  regionalHousingInflationSync: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): UrbanRentDispersionInflationAssessment {
  let pressure = 0;
  if (input.vacancyBand === 'critical') {
    pressure += 0.26;
  } else if (input.vacancyBand === 'tight') {
    pressure += 0.12;
  }
  if (input.rentGrowthBand === 'surging') {
    pressure += 0.28;
  } else if (input.rentGrowthBand === 'strong') {
    pressure += 0.14;
  }
  if (input.urbanizationPressure === 'high') {
    pressure += 0.1;
  }
  pressure += finClamp(input.regionalDispersionScore, 0, 1) * 0.18;
  if (input.metroRentDispersionCritical) {
    pressure += 0.2;
  }
  if (input.regionalHousingInflationSync) {
    pressure += 0.12;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const urbanIndex = finRound(100 + pressure * 17, 1);

  let dispersionBand: UrbanRentDispersionBand = 'aligned';
  if (pressure >= 0.56) dispersionBand = 'metro_shock';
  else if (pressure >= 0.36) dispersionBand = 'elevated';
  else if (pressure >= 0.17) dispersionBand = 'dispersing';

  const inflationScoreNudge =
    dispersionBand === 'metro_shock'
      ? 0.088
      : dispersionBand === 'elevated'
        ? 0.056
        : dispersionBand === 'dispersing'
          ? 0.026
          : 0;

  const narrative =
    dispersionBand === 'metro_shock' || dispersionBand === 'elevated'
      ? 'Urban rent dispersion is passing through to CPI across metro and regional markets.'
      : dispersionBand === 'dispersing'
        ? 'Regional housing inflation sync dispersing rent pressure into headline CPI.'
        : 'Urban rent dispersion aligned; shelter CPI pass-through subdued.';

  return { dispersionBand, urbanIndex, inflationScoreNudge, narrative };
}

export function urbanRentDispersionInflationScoreAdjustment(band: UrbanRentDispersionBand): number {
  if (band === 'metro_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'dispersing') return 2;
  return 0;
}
