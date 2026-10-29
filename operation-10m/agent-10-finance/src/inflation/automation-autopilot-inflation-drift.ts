import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type AutomationAutopilotInflationDriftBand = 'neutral' | 'biased' | 'elevated' | 'autopilot_runaway';

export interface AutomationAutopilotInflationDriftAssessment {
  driftBand: AutomationAutopilotInflationDriftBand;
  autopilotIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Idle automation autopilot bias and unattended shock drift (Agent 20). */
export function assessAutomationAutopilotInflationDrift(input: {
  macroAutopilotInflationBias: 'deflate' | 'neutral' | 'inflate';
  unattendedShockDriftActive: boolean;
  automationConfidenceScore: number;
  idleMacroInflationEscalation: boolean;
  autopilotDriftCascadeBand: 'none' | 'drifting' | 'runaway';
  inflationBand: InflationConditionsBand;
  turn: number;
}): AutomationAutopilotInflationDriftAssessment {
  let pressure = 0;
  if (input.macroAutopilotInflationBias === 'inflate') {
    pressure += 0.22;
  }
  if (input.unattendedShockDriftActive) {
    pressure += 0.18;
  }
  if (input.automationConfidenceScore < 0.45) {
    pressure += 0.16;
  } else if (input.automationConfidenceScore < 0.6) {
    pressure += 0.08;
  }
  if (input.idleMacroInflationEscalation) {
    pressure += 0.14;
  }
  if (input.autopilotDriftCascadeBand === 'runaway') {
    pressure += 0.22;
  } else if (input.autopilotDriftCascadeBand === 'drifting') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const autopilotIndex = finRound(100 + pressure * 16, 1);

  let driftBand: AutomationAutopilotInflationDriftBand = 'neutral';
  if (pressure >= 0.56) driftBand = 'autopilot_runaway';
  else if (pressure >= 0.36) driftBand = 'elevated';
  else if (pressure >= 0.17) driftBand = 'biased';

  const inflationScoreNudge =
    driftBand === 'autopilot_runaway'
      ? 0.09
      : driftBand === 'elevated'
        ? 0.058
        : driftBand === 'biased'
          ? 0.027
          : 0;

  const narrative =
    driftBand === 'autopilot_runaway' || driftBand === 'elevated'
      ? 'Automation autopilot drift is passing inflation bias into CPI metadata.'
      : driftBand === 'biased'
        ? 'Idle macro inflation escalation biasing unattended shock drift.'
        : 'Automation autopilot inflation drift neutral versus headline.';

  return { driftBand, autopilotIndex, inflationScoreNudge, narrative };
}

export function automationAutopilotInflationDriftScoreAdjustment(band: AutomationAutopilotInflationDriftBand): number {
  if (band === 'autopilot_runaway') return 4;
  if (band === 'elevated') return 3;
  if (band === 'biased') return 2;
  return 0;
}
