import type { InflationConditionsBand } from '../definitions/types.js';
import type { Agent06MacroSnapshot } from '../integration/agent06-macro-bridge.js';
import { finClamp, finRound } from '../compute/math.js';
import { inflationBandSeverityRank } from './pass-through.js';

export interface PhillipsSlackAssessment {
  slackBand: 'deep_slack' | 'moderate_slack' | 'balanced' | 'overheated';
  impliedInflationScoreDelta: number;
  unemploymentContribution: number;
  outputGapContribution: number;
  narrative: string;
}

function unemploymentSlack(unemploymentBand: Agent06MacroSnapshot['unemploymentBand']): number {
  switch (unemploymentBand) {
    case 'low':
      return -0.06;
    case 'moderate':
      return 0;
    case 'elevated':
      return 0.05;
    case 'severe':
      return 0.11;
    default:
      return 0;
  }
}

/** Deterministic Phillips-style slack read — macro CPI score channel only. */
export function assessPhillipsSlack(
  inflationBand: InflationConditionsBand,
  snapshot: Agent06MacroSnapshot | null | undefined,
): PhillipsSlackAssessment {
  const gap = finClamp(snapshot?.outputGap ?? 0, -0.08, 0.08);
  const demand = finClamp(snapshot?.nominalDemandPressure ?? 0, -1, 1);

  const outputGapContribution = finRound(gap * 4.2 + demand * 0.04, 3);
  const unemploymentContribution = finRound(unemploymentSlack(snapshot?.unemploymentBand ?? 'moderate'), 3);

  let combined = outputGapContribution + unemploymentContribution;
  if (inflationBandSeverityRank(inflationBand) >= inflationBandSeverityRank('elevated')) {
    combined += 0.04;
  }

  const slackBand: PhillipsSlackAssessment['slackBand'] =
    combined <= -0.05
      ? 'deep_slack'
      : combined <= 0.02
        ? 'moderate_slack'
        : combined <= 0.08
          ? 'balanced'
          : 'overheated';

  const impliedInflationScoreDelta = finRound(finClamp(combined * 18, -4, 9), 2);

  const narrative =
    slackBand === 'overheated'
      ? 'Labor market tightness and positive output gap are adding demand-side inflation pressure.'
      : slackBand === 'balanced'
        ? 'Slack roughly balanced — inflation driven mainly by other channels.'
        : slackBand === 'moderate_slack'
          ? 'Some economic slack is dampening price pressures.'
          : 'Deep slack is disinflationary in the macro CPI channel.';

  return {
    slackBand,
    impliedInflationScoreDelta,
    unemploymentContribution,
    outputGapContribution,
    narrative,
  };
}

export function phillipsSlackInflationScoreAdjustment(assessment: PhillipsSlackAssessment): number {
  if (assessment.slackBand === 'deep_slack') return finRound(Math.min(assessment.impliedInflationScoreDelta, 0), 2);
  if (assessment.slackBand === 'overheated') return finRound(Math.max(assessment.impliedInflationScoreDelta, 0), 2);
  return finRound(assessment.impliedInflationScoreDelta * 0.5, 2);
}
