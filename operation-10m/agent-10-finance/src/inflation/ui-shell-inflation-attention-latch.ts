import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type UiShellInflationAttentionLatchBand = 'muted' | 'building' | 'latched' | 'attention_crisis';

export interface UiShellInflationAttentionLatchAssessment {
  latchBand: UiShellInflationAttentionLatchBand;
  attentionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** UI shell inflation attention latch (Agent 22, round 43). */
export function assessUiShellInflationAttentionLatch(input: {
  inflationDashboardStressHighlight: boolean;
  playerAttentionOnCostOfLiving: 'low' | 'medium' | 'high';
  wave43ShellAttentionLatch: boolean;
  playerSaliencePressureBand: 'muted' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): UiShellInflationAttentionLatchAssessment {
  let pressure = 0;
  if (input.inflationDashboardStressHighlight) pressure += 0.17;
  if (input.playerAttentionOnCostOfLiving === 'high') pressure += 0.2;
  else if (input.playerAttentionOnCostOfLiving === 'medium') pressure += 0.09;
  if (input.wave43ShellAttentionLatch) pressure += 0.14;
  if (input.playerSaliencePressureBand === 'critical') pressure += 0.22;
  else if (input.playerSaliencePressureBand === 'elevated') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const attentionIndex = finRound(100 + pressure * 15, 1);

  let latchBand: UiShellInflationAttentionLatchBand = 'muted';
  if (pressure >= 0.57) latchBand = 'attention_crisis';
  else if (pressure >= 0.37) latchBand = 'latched';
  else if (pressure >= 0.16) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'attention_crisis'
      ? 0.09
      : latchBand === 'latched'
        ? 0.057
        : latchBand === 'building'
          ? 0.026
          : 0;

  const narrative =
    latchBand === 'attention_crisis' || latchBand === 'latched'
      ? 'UI shell attention latch elevating CPI salience metadata.'
      : latchBand === 'building'
        ? 'Player salience pressure building under dashboard stress.'
        : 'UI shell inflation attention latch muted versus headline CPI.';

  return { latchBand, attentionIndex, inflationScoreNudge, narrative };
}

export function uiShellInflationAttentionLatchScoreAdjustment(band: UiShellInflationAttentionLatchBand): number {
  if (band === 'attention_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}
