import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type WholesaleEnergyTransitionBand = 'stable' | 'firming' | 'elevated' | 'transition_shock';

export interface WholesaleEnergyTransitionInflationAssessment {
  transitionBand: WholesaleEnergyTransitionBand;
  energyIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Wholesale energy stress and transition costs in CPI metadata (Agent 13). */
export function assessWholesaleEnergyTransitionInflation(input: {
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  retailTariffShock: boolean;
  gridReliabilityBand: 'stable' | 'strained' | 'fragile';
  emissionsTransitionCostBand: 'low' | 'medium' | 'high';
  renewableShortfallInflationFlag: boolean;
  wholesaleCascadeBand: 'none' | 'stressed' | 'cascade';
  inflationBand: InflationConditionsBand;
  turn: number;
}): WholesaleEnergyTransitionInflationAssessment {
  let pressure = 0;
  if (input.wholesaleEnergyStress === 'crisis') {
    pressure += 0.32;
  } else if (input.wholesaleEnergyStress === 'severe') {
    pressure += 0.2;
  } else if (input.wholesaleEnergyStress === 'elevated') {
    pressure += 0.1;
  }
  if (input.retailTariffShock) {
    pressure += 0.16;
  }
  if (input.gridReliabilityBand === 'fragile') {
    pressure += 0.14;
  } else if (input.gridReliabilityBand === 'strained') {
    pressure += 0.07;
  }
  if (input.emissionsTransitionCostBand === 'high') {
    pressure += 0.12;
  }
  if (input.renewableShortfallInflationFlag) {
    pressure += 0.15;
  }
  if (input.wholesaleCascadeBand === 'cascade') {
    pressure += 0.2;
  } else if (input.wholesaleCascadeBand === 'stressed') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const energyIndex = finRound(100 + pressure * 18, 1);

  let transitionBand: WholesaleEnergyTransitionBand = 'stable';
  if (pressure >= 0.57) transitionBand = 'transition_shock';
  else if (pressure >= 0.37) transitionBand = 'elevated';
  else if (pressure >= 0.18) transitionBand = 'firming';

  const inflationScoreNudge =
    transitionBand === 'transition_shock'
      ? 0.09
      : transitionBand === 'elevated'
        ? 0.058
        : transitionBand === 'firming'
          ? 0.028
          : 0;

  const narrative =
    transitionBand === 'transition_shock' || transitionBand === 'elevated'
      ? 'Wholesale energy and transition costs are lifting CPI through grid and cascade stress.'
      : transitionBand === 'firming'
        ? 'Energy transition pass-through firming as tariffs and reliability bands tighten.'
        : 'Wholesale energy transition CPI contribution stable versus headline.';

  return { transitionBand, energyIndex, inflationScoreNudge, narrative };
}

export function wholesaleEnergyTransitionInflationScoreAdjustment(band: WholesaleEnergyTransitionBand): number {
  if (band === 'transition_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}
