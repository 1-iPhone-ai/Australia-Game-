import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type HousingWellbeingMortgageInflationEscalationLatchBand =
  | 'subdued'
  | 'building'
  | 'escalated'
  | 'essential_crisis';

export interface HousingWellbeingMortgageInflationEscalationLatchAssessment {
  latchBand: HousingWellbeingMortgageInflationEscalationLatchBand;
  escalationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Housing wellbeing mortgage inflation escalation latch (Agent 14, round 50). */
export function assessHousingWellbeingMortgageInflationEscalationLatch(input: {
  mortgageStressBand: 'low' | 'elevated' | 'severe';
  wellbeingCostBand: 'stable' | 'strained' | 'critical';
  wave50HousingWellbeingEscalationLatch: boolean;
  mortgageWellbeingEscalationBand: 'contained' | 'building' | 'acute';
  essentialServicesInflationFlag: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): HousingWellbeingMortgageInflationEscalationLatchAssessment {
  let pressure = 0;
  if (input.mortgageStressBand === 'severe') pressure += 0.2;
  else if (input.mortgageStressBand === 'elevated') pressure += 0.11;
  if (input.wellbeingCostBand === 'critical') pressure += 0.18;
  else if (input.wellbeingCostBand === 'strained') pressure += 0.09;
  if (input.wave50HousingWellbeingEscalationLatch) pressure += 0.14;
  if (input.mortgageWellbeingEscalationBand === 'acute') pressure += 0.21;
  else if (input.mortgageWellbeingEscalationBand === 'building') pressure += 0.1;
  if (input.essentialServicesInflationFlag) pressure += 0.08;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const escalationIndex = finRound(100 + pressure * 16.2, 1);

  let latchBand: HousingWellbeingMortgageInflationEscalationLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'essential_crisis';
  else if (pressure >= 0.38) latchBand = 'escalated';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'essential_crisis'
      ? 0.093
      : latchBand === 'escalated'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'essential_crisis' || latchBand === 'escalated'
      ? 'Housing wellbeing mortgage escalation latch elevating shelter CPI metadata.'
      : latchBand === 'building'
        ? 'Mortgage wellbeing escalation latch building under essential stress.'
        : 'Housing wellbeing mortgage escalation latch subdued versus headline CPI.';

  return { latchBand, escalationIndex, inflationScoreNudge, narrative };
}

export function housingWellbeingMortgageInflationEscalationLatchScoreAdjustment(
  band: HousingWellbeingMortgageInflationEscalationLatchBand,
): number {
  if (band === 'essential_crisis') return 4;
  if (band === 'escalated') return 3;
  if (band === 'building') return 2;
  return 0;
}
