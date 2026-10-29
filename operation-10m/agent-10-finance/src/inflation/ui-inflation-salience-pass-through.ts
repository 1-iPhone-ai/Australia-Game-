import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type UiInflationSalienceBand = 'muted' | 'elevated' | 'salient' | 'attention_shock';

export interface UiInflationSaliencePassThroughAssessment {
  salienceBand: UiInflationSalienceBand;
  presentationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Player-facing UI / dashboard inflation salience (expectations channel — not commodity prices). */
export function assessUiInflationSaliencePassThrough(input: {
  dashboardStressHighlight: boolean;
  playerAttentionBand: 'low' | 'medium' | 'high';
  uiExpectationsNudgeUp: boolean;
  phaseShellCoachActive: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): UiInflationSaliencePassThroughAssessment {
  let pressure = 0;
  if (input.dashboardStressHighlight) pressure += 0.22;
  if (input.playerAttentionBand === 'high') pressure += 0.28;
  else if (input.playerAttentionBand === 'medium') pressure += 0.12;

  if (input.uiExpectationsNudgeUp) pressure += 0.18;
  if (input.phaseShellCoachActive) pressure += 0.14;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const presentationIndex = finRound(100 + pressure * 14, 1);

  let salienceBand: UiInflationSalienceBand = 'muted';
  if (pressure >= 0.62) salienceBand = 'attention_shock';
  else if (pressure >= 0.4) salienceBand = 'salient';
  else if (pressure >= 0.22) salienceBand = 'elevated';

  const inflationScoreNudge =
    salienceBand === 'attention_shock'
      ? 0.07
      : salienceBand === 'salient'
        ? 0.05
        : salienceBand === 'elevated'
          ? 0.03
          : 0;

  const narrative =
    salienceBand === 'attention_shock' || salienceBand === 'salient'
      ? 'UI inflation salience is reinforcing expectations through dashboard stress and player attention.'
      : salienceBand === 'elevated'
        ? 'Presentation-layer inflation cues firming — cost-of-living visibility elevated.'
        : 'UI inflation salience muted relative to macro bands.';

  return { salienceBand, presentationIndex, inflationScoreNudge, narrative };
}

export function uiInflationSaliencePassThroughScoreAdjustment(band: UiInflationSalienceBand): number {
  if (band === 'attention_shock') return 3;
  if (band === 'salient') return 3;
  if (band === 'elevated') return 2;
  return 0;
}
