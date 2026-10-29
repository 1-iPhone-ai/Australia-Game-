import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type HousingMortgageEssentialBand = 'subdued' | 'firming' | 'elevated' | 'services_shock';

export interface HousingMortgageEssentialInflationAssessment {
  essentialBand: HousingMortgageEssentialBand;
  servicesIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Mortgage servicing and essential wellbeing services in CPI metadata (Agent 14 housing). */
export function assessHousingMortgageEssentialInflation(input: {
  mortgageStressBand: 'low' | 'elevated' | 'severe';
  wellbeingCostBand: 'stable' | 'strained' | 'critical';
  essentialServicesInflationFlag: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): HousingMortgageEssentialInflationAssessment {
  let pressure = 0;
  if (input.mortgageStressBand === 'severe') {
    pressure += 0.32;
  } else if (input.mortgageStressBand === 'elevated') {
    pressure += 0.16;
  }

  if (input.wellbeingCostBand === 'critical') {
    pressure += 0.28;
  } else if (input.wellbeingCostBand === 'strained') {
    pressure += 0.14;
  }

  if (input.essentialServicesInflationFlag) {
    pressure += 0.18;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.0042, 0, 1.05);
  const servicesIndex = finRound(100 + pressure * 17, 1);

  let essentialBand: HousingMortgageEssentialBand = 'subdued';
  if (pressure >= 0.56) essentialBand = 'services_shock';
  else if (pressure >= 0.36) essentialBand = 'elevated';
  else if (pressure >= 0.19) essentialBand = 'firming';

  const inflationScoreNudge =
    essentialBand === 'services_shock'
      ? 0.085
      : essentialBand === 'elevated'
        ? 0.055
        : essentialBand === 'firming'
          ? 0.028
          : 0;

  const narrative =
    essentialBand === 'services_shock' || essentialBand === 'elevated'
      ? 'Mortgage servicing and essential wellbeing services are lifting CPI through household stress.'
      : essentialBand === 'firming'
        ? 'Essential services inflation firming as mortgage and wellbeing costs tighten.'
        : 'Housing mortgage and essential services pass-through subdued versus headline.';

  return { essentialBand, servicesIndex, inflationScoreNudge, narrative };
}

export function housingMortgageEssentialInflationScoreAdjustment(band: HousingMortgageEssentialBand): number {
  if (band === 'services_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}
