import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type CommandCenterInflationFusionEscalationBand = 'calm' | 'elevated' | 'critical' | 'fusion_runaway';

export interface CommandCenterInflationFusionEscalationAssessment {
  escalationBand: CommandCenterInflationFusionEscalationBand;
  fusionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** AI command center inflation fusion escalation (Agent 17). */
export function assessCommandCenterInflationFusionEscalation(input: {
  macroAlertLevel: 'green' | 'amber' | 'red';
  inflationFusionScore: number;
  coordinatedTighteningSuggested: boolean;
  macroInflationFusionLatch: boolean;
  commandAlertCascadeBand: 'stable' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CommandCenterInflationFusionEscalationAssessment {
  let pressure = 0;
  if (input.macroAlertLevel === 'red') {
    pressure += 0.24;
  } else if (input.macroAlertLevel === 'amber') {
    pressure += 0.11;
  }
  pressure += finClamp(input.inflationFusionScore, 0, 1) * 0.28;
  if (input.coordinatedTighteningSuggested) {
    pressure += 0.08;
  }
  if (input.macroInflationFusionLatch) {
    pressure += 0.14;
  }
  if (input.commandAlertCascadeBand === 'critical') {
    pressure += 0.2;
  } else if (input.commandAlertCascadeBand === 'elevated') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const fusionIndex = finRound(100 + pressure * 16, 1);

  let escalationBand: CommandCenterInflationFusionEscalationBand = 'calm';
  if (pressure >= 0.58) escalationBand = 'fusion_runaway';
  else if (pressure >= 0.38) escalationBand = 'critical';
  else if (pressure >= 0.18) escalationBand = 'elevated';

  const inflationScoreNudge =
    escalationBand === 'fusion_runaway'
      ? 0.092
      : escalationBand === 'critical'
        ? 0.058
        : escalationBand === 'elevated'
          ? 0.028
          : 0;

  const narrative =
    escalationBand === 'fusion_runaway' || escalationBand === 'critical'
      ? 'Command center inflation fusion escalating CPI metadata alerts.'
      : escalationBand === 'elevated'
        ? 'Macro inflation fusion latch building under amber alert.'
        : 'Command fusion escalation calm versus headline CPI.';

  return { escalationBand, fusionIndex, inflationScoreNudge, narrative };
}

export function commandCenterInflationFusionEscalationScoreAdjustment(
  band: CommandCenterInflationFusionEscalationBand,
): number {
  if (band === 'fusion_runaway') return 4;
  if (band === 'critical') return 3;
  if (band === 'elevated') return 2;
  return 0;
}
