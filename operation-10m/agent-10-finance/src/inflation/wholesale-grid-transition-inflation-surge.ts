import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type WholesaleGridTransitionInflationSurgeBand =
  | 'stable'
  | 'building'
  | 'surge'
  | 'transition_crisis';

export interface WholesaleGridTransitionInflationSurgeAssessment {
  surgeBand: WholesaleGridTransitionInflationSurgeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Wholesale grid transition inflation surge (Agent 13, round 49). */
export function assessWholesaleGridTransitionInflationSurge(input: {
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  emissionsTransitionCostBand: 'low' | 'medium' | 'high';
  wave49GridTransitionSurgeLatch: boolean;
  gridTransitionStressBand: 'stable' | 'stressed' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): WholesaleGridTransitionInflationSurgeAssessment {
  let pressure = 0;
  if (input.wholesaleEnergyStress === 'crisis') pressure += 0.21;
  else if (input.wholesaleEnergyStress === 'severe') pressure += 0.12;
  if (input.emissionsTransitionCostBand === 'high') pressure += 0.1;
  else if (input.emissionsTransitionCostBand === 'medium') pressure += 0.05;
  if (input.wave49GridTransitionSurgeLatch) pressure += 0.13;
  if (input.gridTransitionStressBand === 'ruptured') pressure += 0.22;
  else if (input.gridTransitionStressBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 15.9, 1);

  let surgeBand: WholesaleGridTransitionInflationSurgeBand = 'stable';
  if (pressure >= 0.58) surgeBand = 'transition_crisis';
  else if (pressure >= 0.38) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'transition_crisis'
      ? 0.094
      : surgeBand === 'surge'
        ? 0.06
        : surgeBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    surgeBand === 'transition_crisis' || surgeBand === 'surge'
      ? 'Wholesale grid transition surge feeding CPI utility metadata.'
      : surgeBand === 'building'
        ? 'Grid transition latch building under wholesale stress.'
        : 'Wholesale grid transition surge stable versus headline CPI.';

  return { surgeBand, stressIndex, inflationScoreNudge, narrative };
}

export function wholesaleGridTransitionInflationSurgeScoreAdjustment(
  band: WholesaleGridTransitionInflationSurgeBand,
): number {
  if (band === 'transition_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}
