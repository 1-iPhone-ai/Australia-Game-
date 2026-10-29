import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type UiPlayerInflationSalienceNudgeBand = 'muted' | 'building' | 'elevated' | 'sharp';

export interface UiPlayerInflationSalienceNudgeAssessment {
  nudgeBand: UiPlayerInflationSalienceNudgeBand;
  salienceIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Player UI inflation salience and expectations nudge (Agent 22). */
export function assessUiPlayerInflationSalienceNudge(input: {
  inflationDashboardStressHighlight: boolean;
  playerAttentionOnCostOfLiving: 'low' | 'medium' | 'high';
  uiNudgeInflationExpectationsUp: boolean;
  playerInflationSalienceLatch: boolean;
  uiExpectationsNudgeBand: 'muted' | 'building' | 'sharp';
  inflationBand: InflationConditionsBand;
  turn: number;
}): UiPlayerInflationSalienceNudgeAssessment {
  let pressure = 0;
  if (input.inflationDashboardStressHighlight) {
    pressure += 0.14;
  }
  if (input.playerAttentionOnCostOfLiving === 'high') {
    pressure += 0.2;
  } else if (input.playerAttentionOnCostOfLiving === 'medium') {
    pressure += 0.09;
  }
  if (input.uiNudgeInflationExpectationsUp) {
    pressure += 0.16;
  }
  if (input.playerInflationSalienceLatch) {
    pressure += 0.13;
  }
  if (input.uiExpectationsNudgeBand === 'sharp') {
    pressure += 0.22;
  } else if (input.uiExpectationsNudgeBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const salienceIndex = finRound(100 + pressure * 15, 1);

  let nudgeBand: UiPlayerInflationSalienceNudgeBand = 'muted';
  if (pressure >= 0.55) nudgeBand = 'sharp';
  else if (pressure >= 0.34) nudgeBand = 'elevated';
  else if (pressure >= 0.15) nudgeBand = 'building';

  const inflationScoreNudge =
    nudgeBand === 'sharp'
      ? 0.088
      : nudgeBand === 'elevated'
        ? 0.054
        : nudgeBand === 'building'
          ? 0.025
          : 0;

  const narrative =
    nudgeBand === 'sharp' || nudgeBand === 'elevated'
      ? 'UI player salience nudging inflation expectations in CPI metadata.'
      : nudgeBand === 'building'
        ? 'Dashboard stress highlight building cost-of-living attention.'
        : 'UI inflation salience nudge muted versus headline CPI.';

  return { nudgeBand, salienceIndex, inflationScoreNudge, narrative };
}

export function uiPlayerInflationSalienceNudgeScoreAdjustment(band: UiPlayerInflationSalienceNudgeBand): number {
  if (band === 'sharp') return 4;
  if (band === 'elevated') return 3;
  if (band === 'building') return 2;
  return 0;
}
