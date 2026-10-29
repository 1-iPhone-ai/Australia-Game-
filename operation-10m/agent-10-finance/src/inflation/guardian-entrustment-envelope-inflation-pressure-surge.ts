import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type GuardianEntrustmentEnvelopeInflationPressureSurgeBand =
  | 'contained'
  | 'building'
  | 'surge'
  | 'envelope_rupture';

export interface GuardianEntrustmentEnvelopeInflationPressureSurgeAssessment {
  surgeBand: GuardianEntrustmentEnvelopeInflationPressureSurgeBand;
  strainIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Guardian entrustment envelope inflation pressure surge (Agent 16, round 49). */
export function assessGuardianEntrustmentEnvelopeInflationPressureSurge(input: {
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  wave49EntrustmentEnvelopeLatch: boolean;
  entrustmentEnvelopePressureBand: 'contained' | 'elevated' | 'ruptured';
  entrustmentStrainIndex: number;
  inflationBand: InflationConditionsBand;
  turn: number;
}): GuardianEntrustmentEnvelopeInflationPressureSurgeAssessment {
  let pressure = 0;
  if (input.inflationGuardrailTripped) pressure += 0.15;
  if (input.stabilityInterventionBand === 'urgent') pressure += 0.12;
  else if (input.stabilityInterventionBand === 'advisory') pressure += 0.06;
  if (input.wave49EntrustmentEnvelopeLatch) pressure += 0.13;
  if (input.entrustmentEnvelopePressureBand === 'ruptured') pressure += 0.2;
  else if (input.entrustmentEnvelopePressureBand === 'elevated') pressure += 0.09;
  if (input.entrustmentStrainIndex >= 0.72) pressure += 0.08;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const strainIndex = finRound(100 + pressure * 15.6, 1);

  let surgeBand: GuardianEntrustmentEnvelopeInflationPressureSurgeBand = 'contained';
  if (pressure >= 0.58) surgeBand = 'envelope_rupture';
  else if (pressure >= 0.38) surgeBand = 'surge';
  else if (pressure >= 0.17) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'envelope_rupture'
      ? 0.092
      : surgeBand === 'surge'
        ? 0.059
        : surgeBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'envelope_rupture' || surgeBand === 'surge'
      ? 'Guardian entrustment envelope strain feeding CPI escalation metadata.'
      : surgeBand === 'building'
        ? 'Entrustment envelope pressure building under guardrail stress.'
        : 'Guardian entrustment envelope pressure contained versus headline CPI.';

  return { surgeBand, strainIndex, inflationScoreNudge, narrative };
}

export function guardianEntrustmentEnvelopeInflationPressureSurgeScoreAdjustment(
  band: GuardianEntrustmentEnvelopeInflationPressureSurgeBand,
): number {
  if (band === 'envelope_rupture') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}
