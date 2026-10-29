import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type ResearchProductivityInflationOffsetBand = 'strong_relief' | 'moderate_relief' | 'neutral' | 'offset_failing';

export interface ResearchProductivityInflationOffsetAssessment {
  offsetBand: ResearchProductivityInflationOffsetBand;
  productivityIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Research productivity and supply-side inflation offset (Agent 03). */
export function assessResearchProductivityInflationOffset(input: {
  productivityGainBand: 'flat' | 'moderate' | 'strong';
  supplySideReliefActive: boolean;
  innovationInflationOffsetScore: number;
  techTreeInflationLatch: boolean;
  supplySideOffsetBand: 'weak' | 'building' | 'strong';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ResearchProductivityInflationOffsetAssessment {
  let relief = 0;
  if (input.productivityGainBand === 'strong' && input.supplySideReliefActive) {
    relief += 0.28;
  } else if (input.productivityGainBand === 'moderate') {
    relief += 0.14;
  } else if (input.productivityGainBand === 'flat') {
    relief -= 0.12;
  }
  relief += finClamp(input.innovationInflationOffsetScore, 0, 1) * 0.22;
  if (input.techTreeInflationLatch && input.supplySideOffsetBand === 'strong') {
    relief += 0.16;
  } else if (input.supplySideOffsetBand === 'building') {
    relief += 0.08;
  } else if (input.supplySideOffsetBand === 'weak') {
    relief -= 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    relief -= 0.06;
  }

  relief = finClamp(relief + input.turn * 0.0025, -0.35, 0.85);
  const productivityIndex = finRound(100 + relief * 18, 1);

  let offsetBand: ResearchProductivityInflationOffsetBand = 'neutral';
  if (relief >= 0.42) offsetBand = 'strong_relief';
  else if (relief >= 0.2) offsetBand = 'moderate_relief';
  else if (relief <= -0.08) offsetBand = 'offset_failing';

  const inflationScoreNudge =
    offsetBand === 'offset_failing'
      ? 0.062
      : offsetBand === 'neutral'
        ? 0.018
        : offsetBand === 'moderate_relief'
          ? -0.022
          : -0.048;

  const narrative =
    offsetBand === 'strong_relief' || offsetBand === 'moderate_relief'
      ? 'Research productivity offset is easing CPI through supply-side relief.'
      : offsetBand === 'offset_failing'
        ? 'Flat productivity and weak offset band failing to contain inflation.'
        : 'Innovation inflation offset neutral versus headline CPI.';

  return { offsetBand, productivityIndex, inflationScoreNudge, narrative };
}

export function researchProductivityInflationOffsetScoreAdjustment(
  band: ResearchProductivityInflationOffsetBand,
): number {
  if (band === 'offset_failing') return 3;
  if (band === 'neutral') return 1;
  if (band === 'moderate_relief') return -1;
  return -2;
}
