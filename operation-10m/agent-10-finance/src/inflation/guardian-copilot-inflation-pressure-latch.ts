import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type GuardianCopilotInflationPressureLatchBand = 'subdued' | 'building' | 'latched' | 'runaway';

export interface GuardianCopilotInflationPressureLatchAssessment {
  latchBand: GuardianCopilotInflationPressureLatchBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Guardian co-pilot inflation pressure latch (Agent 16, round 41). */
export function assessGuardianCopilotInflationPressureLatch(input: {
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  wave41GuardianPressureLatch: boolean;
  copilotPressureEscalationBand: 'contained' | 'elevated' | 'runaway';
  inflationBand: InflationConditionsBand;
  turn: number;
}): GuardianCopilotInflationPressureLatchAssessment {
  let pressure = 0;
  if (input.inflationGuardrailTripped) pressure += 0.19;
  if (input.stabilityInterventionBand === 'urgent') pressure += 0.17;
  else if (input.stabilityInterventionBand === 'advisory') pressure += 0.08;
  if (input.wave41GuardianPressureLatch) pressure += 0.14;
  if (input.copilotPressureEscalationBand === 'runaway') pressure += 0.23;
  else if (input.copilotPressureEscalationBand === 'elevated') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 16, 1);

  let latchBand: GuardianCopilotInflationPressureLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'runaway';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'runaway'
      ? 0.092
      : latchBand === 'latched'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'runaway' || latchBand === 'latched'
      ? 'Guardian co-pilot pressure latch elevating CPI alert metadata.'
      : latchBand === 'building'
        ? 'Co-pilot pressure latch building under guardrail trip.'
        : 'Guardian co-pilot pressure latch subdued versus headline CPI.';

  return { latchBand, pressureIndex, inflationScoreNudge, narrative };
}

export function guardianCopilotInflationPressureLatchScoreAdjustment(
  band: GuardianCopilotInflationPressureLatchBand,
): number {
  if (band === 'runaway') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}
