import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type PopulationLaborWageBand = 'subdued' | 'building' | 'elevated' | 'wage_spiral';

export interface PopulationLaborWageInflationAssessment {
  wageBand: PopulationLaborWageBand;
  laborIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Population, labor slack, and wage growth feeding CPI metadata (Agent 09). */
export function assessPopulationLaborWageInflation(input: {
  laborParticipationBand: 'weak' | 'steady' | 'strong';
  wageGrowthBand: 'subdued' | 'moderate' | 'elevated' | 'surge';
  costOfLivingStress: 'low' | 'moderate' | 'high' | 'extreme';
  participationSlackInflationBand: 'tight' | 'balanced' | 'slack' | 'severe_slack';
  householdExpectationsDeanchoring: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): PopulationLaborWageInflationAssessment {
  let pressure = 0;
  if (input.wageGrowthBand === 'surge') {
    pressure += 0.3;
  } else if (input.wageGrowthBand === 'elevated') {
    pressure += 0.16;
  } else if (input.wageGrowthBand === 'moderate') {
    pressure += 0.06;
  }
  if (input.costOfLivingStress === 'extreme') {
    pressure += 0.22;
  } else if (input.costOfLivingStress === 'high') {
    pressure += 0.11;
  }
  if (input.participationSlackInflationBand === 'severe_slack') {
    pressure += 0.18;
  } else if (input.participationSlackInflationBand === 'slack') {
    pressure += 0.09;
  } else if (input.participationSlackInflationBand === 'tight') {
    pressure += 0.07;
  }
  if (input.householdExpectationsDeanchoring) {
    pressure += 0.15;
  }
  if (input.laborParticipationBand === 'weak' && input.wageGrowthBand !== 'subdued') {
    pressure += 0.08;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0042, 0, 1.05);
  const laborIndex = finRound(100 + pressure * 18, 1);

  let wageBand: PopulationLaborWageBand = 'subdued';
  if (pressure >= 0.58) wageBand = 'wage_spiral';
  else if (pressure >= 0.38) wageBand = 'elevated';
  else if (pressure >= 0.19) wageBand = 'building';

  const inflationScoreNudge =
    wageBand === 'wage_spiral'
      ? 0.09
      : wageBand === 'elevated'
        ? 0.06
        : wageBand === 'building'
          ? 0.03
          : 0;

  const narrative =
    wageBand === 'wage_spiral' || wageBand === 'elevated'
      ? 'Population and labor markets are passing wage pressure into CPI with de-anchored expectations.'
      : wageBand === 'building'
        ? 'Labor slack and wage bands building inflation through household cost stress.'
        : 'Population labor wage pass-through subdued versus headline CPI.';

  return { wageBand, laborIndex, inflationScoreNudge, narrative };
}

export function populationLaborWageInflationScoreAdjustment(band: PopulationLaborWageBand): number {
  if (band === 'wage_spiral') return 4;
  if (band === 'elevated') return 3;
  if (band === 'building') return 2;
  return 0;
}
