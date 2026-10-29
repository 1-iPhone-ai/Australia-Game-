import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type GuardianGuardrailInflationEscalationBand = 'calm' | 'elevated' | 'urgent' | 'critical';

export interface GuardianGuardrailInflationEscalationAssessment {
  escalationBand: GuardianGuardrailInflationEscalationBand;
  guardrailIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Guardian guardrail and co-pilot inflation escalation (Agent 16). */
export function assessGuardianGuardrailInflationEscalation(input: {
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  narrativeShockSeverity: 'low' | 'medium' | 'high';
  guardrailInflationLatch: boolean;
  copilotEscalationBand: 'calm' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): GuardianGuardrailInflationEscalationAssessment {
  let pressure = 0;
  if (input.inflationGuardrailTripped) pressure += 0.2;
  if (input.stabilityInterventionBand === 'urgent') pressure += 0.18;
  else if (input.stabilityInterventionBand === 'advisory') pressure += 0.08;
  if (input.narrativeShockSeverity === 'high') pressure += 0.14;
  else if (input.narrativeShockSeverity === 'medium') pressure += 0.07;
  if (input.guardrailInflationLatch) pressure += 0.13;
  if (input.copilotEscalationBand === 'critical') pressure += 0.22;
  else if (input.copilotEscalationBand === 'elevated') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const guardrailIndex = finRound(100 + pressure * 15, 1);

  let escalationBand: GuardianGuardrailInflationEscalationBand = 'calm';
  if (pressure >= 0.55) escalationBand = 'critical';
  else if (pressure >= 0.35) escalationBand = 'urgent';
  else if (pressure >= 0.15) escalationBand = 'elevated';

  const inflationScoreNudge =
    escalationBand === 'critical'
      ? 0.09
      : escalationBand === 'urgent'
        ? 0.056
        : escalationBand === 'elevated'
          ? 0.027
          : 0;

  const narrative =
    escalationBand === 'critical' || escalationBand === 'urgent'
      ? 'Guardian guardrail escalation feeding CPI metadata alerts.'
      : escalationBand === 'elevated'
        ? 'Co-pilot inflation latch building under guardrail trip.'
        : 'Guardian inflation escalation calm versus headline CPI.';

  return { escalationBand, guardrailIndex, inflationScoreNudge, narrative };
}

export function guardianGuardrailInflationEscalationScoreAdjustment(
  band: GuardianGuardrailInflationEscalationBand,
): number {
  if (band === 'critical') return 4;
  if (band === 'urgent') return 3;
  if (band === 'elevated') return 2;
  return 0;
}
