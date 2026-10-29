import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type AutomationSynthesisInflationCascadeDriftBand =
  | 'neutral'
  | 'drifting'
  | 'stacking'
  | 'runaway';

export interface AutomationSynthesisInflationCascadeDriftAssessment {
  driftBand: AutomationSynthesisInflationCascadeDriftBand;
  synthesisIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Idle automation synthesis inflation cascade drift (Agent 20). */
export function assessAutomationSynthesisInflationCascadeDrift(input: {
  macroAutopilotInflationBias: 'deflate' | 'neutral' | 'inflate';
  unattendedShockDriftActive: boolean;
  automationConfidenceScore: number;
  synthesisAutopilotInflationLatch: boolean;
  cascadeStackDriftBand: 'stable' | 'stacking' | 'runaway';
  inflationBand: InflationConditionsBand;
  turn: number;
}): AutomationSynthesisInflationCascadeDriftAssessment {
  let pressure = 0;
  if (input.macroAutopilotInflationBias === 'inflate') pressure += 0.18;
  if (input.unattendedShockDriftActive) pressure += 0.14;
  if (input.automationConfidenceScore < 0.4) pressure += 0.12;
  else if (input.automationConfidenceScore < 0.55) pressure += 0.06;
  if (input.synthesisAutopilotInflationLatch) pressure += 0.13;
  if (input.cascadeStackDriftBand === 'runaway') pressure += 0.23;
  else if (input.cascadeStackDriftBand === 'stacking') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const synthesisIndex = finRound(100 + pressure * 16, 1);

  let driftBand: AutomationSynthesisInflationCascadeDriftBand = 'neutral';
  if (pressure >= 0.56) driftBand = 'runaway';
  else if (pressure >= 0.36) driftBand = 'stacking';
  else if (pressure >= 0.15) driftBand = 'drifting';

  const inflationScoreNudge =
    driftBand === 'runaway'
      ? 0.09
      : driftBand === 'stacking'
        ? 0.057
        : driftBand === 'drifting'
          ? 0.026
          : 0;

  const narrative =
    driftBand === 'runaway' || driftBand === 'stacking'
      ? 'Automation synthesis cascade stacking higher in CPI metadata.'
      : driftBand === 'drifting'
        ? 'Autopilot inflation latch building under unattended shock drift.'
        : 'Automation synthesis inflation cascade drift neutral versus headline.';

  return { driftBand, synthesisIndex, inflationScoreNudge, narrative };
}

export function automationSynthesisInflationCascadeDriftScoreAdjustment(
  band: AutomationSynthesisInflationCascadeDriftBand,
): number {
  if (band === 'runaway') return 4;
  if (band === 'stacking') return 3;
  if (band === 'drifting') return 2;
  return 0;
}
