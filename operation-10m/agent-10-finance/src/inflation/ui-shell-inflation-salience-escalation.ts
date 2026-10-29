import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type UiShellInflationSalienceEscalationBand = 'muted' | 'building' | 'sharp' | 'shell_critical';

export interface UiShellInflationSalienceEscalationAssessment {
  escalationBand: UiShellInflationSalienceEscalationBand;
  salienceIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** UI shell player inflation salience escalation (Agent 22). */
export function assessUiShellInflationSalienceEscalation(input: {
  inflationDashboardStressHighlight: boolean;
  playerAttentionOnCostOfLiving: 'low' | 'medium' | 'high';
  uiNudgeInflationExpectationsUp: boolean;
  wave35SalienceEscalationLatch: boolean;
  shellExpectationsEscalationBand: 'muted' | 'building' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): UiShellInflationSalienceEscalationAssessment {
  let pressure = 0;
  if (input.inflationDashboardStressHighlight) pressure += 0.12;
  if (input.playerAttentionOnCostOfLiving === 'high') pressure += 0.2;
  else if (input.playerAttentionOnCostOfLiving === 'medium') pressure += 0.08;
  if (input.uiNudgeInflationExpectationsUp) pressure += 0.14;
  if (input.wave35SalienceEscalationLatch) pressure += 0.13;
  if (input.shellExpectationsEscalationBand === 'critical') pressure += 0.22;
  else if (input.shellExpectationsEscalationBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const salienceIndex = finRound(100 + pressure * 16, 1);

  let escalationBand: UiShellInflationSalienceEscalationBand = 'muted';
  if (pressure >= 0.56) escalationBand = 'shell_critical';
  else if (pressure >= 0.36) escalationBand = 'sharp';
  else if (pressure >= 0.16) escalationBand = 'building';

  const inflationScoreNudge =
    escalationBand === 'shell_critical'
      ? 0.09
      : escalationBand === 'sharp'
        ? 0.057
        : escalationBand === 'building'
          ? 0.026
          : 0;

  const narrative =
    escalationBand === 'shell_critical' || escalationBand === 'sharp'
      ? 'UI shell salience escalation feeding CPI player-expectations metadata.'
      : escalationBand === 'building'
        ? 'Phase-shell inflation latch building under dashboard stress.'
        : 'UI shell inflation salience muted versus headline CPI.';

  return { escalationBand, salienceIndex, inflationScoreNudge, narrative };
}

export function uiShellInflationSalienceEscalationScoreAdjustment(
  band: UiShellInflationSalienceEscalationBand,
): number {
  if (band === 'shell_critical') return 4;
  if (band === 'sharp') return 3;
  if (band === 'building') return 2;
  return 0;
}
