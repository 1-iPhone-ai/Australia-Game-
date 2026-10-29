import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type CommandCenterInflationAlertPressureLatchBand = 'subdued' | 'building' | 'latched' | 'alert_crisis';

export interface CommandCenterInflationAlertPressureLatchAssessment {
  latchBand: CommandCenterInflationAlertPressureLatchBand;
  alertIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Command center inflation alert pressure latch (Agent 17, round 44). */
export function assessCommandCenterInflationAlertPressureLatch(input: {
  macroAlertLevel: 'green' | 'amber' | 'red';
  inflationFusionScore: number;
  wave44CommandAlertLatch: boolean;
  commandAlertPressureBand: 'contained' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CommandCenterInflationAlertPressureLatchAssessment {
  let pressure = 0;
  if (input.macroAlertLevel === 'red') pressure += 0.21;
  else if (input.macroAlertLevel === 'amber') pressure += 0.1;
  pressure += finClamp(input.inflationFusionScore, 0, 1) * 0.19;
  if (input.wave44CommandAlertLatch) pressure += 0.14;
  if (input.commandAlertPressureBand === 'critical') pressure += 0.23;
  else if (input.commandAlertPressureBand === 'elevated') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const alertIndex = finRound(100 + pressure * 16, 1);

  let latchBand: CommandCenterInflationAlertPressureLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'alert_crisis';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'alert_crisis'
      ? 0.092
      : latchBand === 'latched'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'alert_crisis' || latchBand === 'latched'
      ? 'Command alert pressure latch elevating CPI fusion metadata.'
      : latchBand === 'building'
        ? 'Command center alert latch building under fusion score.'
        : 'Command alert pressure latch subdued versus headline CPI.';

  return { latchBand, alertIndex, inflationScoreNudge, narrative };
}

export function commandCenterInflationAlertPressureLatchScoreAdjustment(
  band: CommandCenterInflationAlertPressureLatchBand,
): number {
  if (band === 'alert_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}
