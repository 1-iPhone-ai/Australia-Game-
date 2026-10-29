import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type CommandCenterInflationFusionLatchBand = 'stable' | 'elevated' | 'critical' | 'fusion_runaway';

export interface CommandCenterInflationFusionLatchAssessment {
  latchBand: CommandCenterInflationFusionLatchBand;
  fusionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Command center macro inflation fusion latch escalation (Agent 17). */
export function assessCommandCenterInflationFusionLatch(input: {
  macroAlertLevel: 'green' | 'amber' | 'red';
  inflationFusionScore: number;
  coordinatedTighteningSuggested: boolean;
  wave36FusionLatch: boolean;
  commandInflationEscalationBand: 'stable' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CommandCenterInflationFusionLatchAssessment {
  let pressure = 0;
  if (input.macroAlertLevel === 'red') pressure += 0.22;
  else if (input.macroAlertLevel === 'amber') pressure += 0.1;
  pressure += finClamp(input.inflationFusionScore, 0, 1) * 0.24;
  if (input.coordinatedTighteningSuggested) pressure += 0.08;
  if (input.wave36FusionLatch) pressure += 0.14;
  if (input.commandInflationEscalationBand === 'critical') pressure += 0.2;
  else if (input.commandInflationEscalationBand === 'elevated') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const fusionIndex = finRound(100 + pressure * 17, 1);

  let latchBand: CommandCenterInflationFusionLatchBand = 'stable';
  if (pressure >= 0.58) latchBand = 'fusion_runaway';
  else if (pressure >= 0.39) latchBand = 'critical';
  else if (pressure >= 0.18) latchBand = 'elevated';

  const inflationScoreNudge =
    latchBand === 'fusion_runaway'
      ? 0.093
      : latchBand === 'critical'
        ? 0.059
        : latchBand === 'elevated'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'fusion_runaway' || latchBand === 'critical'
      ? 'Command fusion latch escalation feeding CPI macro-alert metadata.'
      : latchBand === 'elevated'
        ? 'Coordinated tightening suggestion building fusion inflation latch.'
        : 'Command center fusion latch stable versus headline CPI.';

  return { latchBand, fusionIndex, inflationScoreNudge, narrative };
}

export function commandCenterInflationFusionLatchScoreAdjustment(
  band: CommandCenterInflationFusionLatchBand,
): number {
  if (band === 'fusion_runaway') return 4;
  if (band === 'critical') return 3;
  if (band === 'elevated') return 2;
  return 0;
}
