import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type AutomationSynthesisInflationCascadeSurgeBand = 'stable' | 'stacking' | 'surge' | 'autopilot_runaway';

export interface AutomationSynthesisInflationCascadeSurgeAssessment {
  surgeBand: AutomationSynthesisInflationCascadeSurgeBand;
  cascadeIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Automation synthesis inflation cascade surge (Agent 20, round 42). */
export function assessAutomationSynthesisInflationCascadeSurge(input: {
  macroAutopilotInflationBias: 'deflate' | 'neutral' | 'inflate';
  unattendedShockDriftActive: boolean;
  wave42SynthesisCascadeLatch: boolean;
  autopilotStackSurgeBand: 'stable' | 'stacking' | 'surge';
  inflationBand: InflationConditionsBand;
  turn: number;
}): AutomationSynthesisInflationCascadeSurgeAssessment {
  let pressure = 0;
  if (input.macroAutopilotInflationBias === 'inflate') pressure += 0.19;
  else if (input.macroAutopilotInflationBias === 'neutral') pressure += 0.05;
  if (input.unattendedShockDriftActive) pressure += 0.16;
  if (input.wave42SynthesisCascadeLatch) pressure += 0.13;
  if (input.autopilotStackSurgeBand === 'surge') pressure += 0.22;
  else if (input.autopilotStackSurgeBand === 'stacking') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const cascadeIndex = finRound(100 + pressure * 15, 1);

  let surgeBand: AutomationSynthesisInflationCascadeSurgeBand = 'stable';
  if (pressure >= 0.57) surgeBand = 'autopilot_runaway';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'stacking';

  const inflationScoreNudge =
    surgeBand === 'autopilot_runaway'
      ? 0.091
      : surgeBand === 'surge'
        ? 0.058
        : surgeBand === 'stacking'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'autopilot_runaway' || surgeBand === 'surge'
      ? 'Automation synthesis cascade surge feeding CPI autopilot metadata.'
      : surgeBand === 'stacking'
        ? 'Synthesis cascade latch building under shock drift.'
        : 'Automation synthesis cascade stable versus headline CPI.';

  return { surgeBand, cascadeIndex, inflationScoreNudge, narrative };
}

export function automationSynthesisInflationCascadeSurgeScoreAdjustment(
  band: AutomationSynthesisInflationCascadeSurgeBand,
): number {
  if (band === 'autopilot_runaway') return 4;
  if (band === 'surge') return 3;
  if (band === 'stacking') return 2;
  return 0;
}
