import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type GuardianInflationInterventionBand = 'calm' | 'advisory' | 'urgent' | 'guardrail_cascade';

export interface GuardianInflationInterventionAssessment {
  interventionBand: GuardianInflationInterventionBand;
  guardrailIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Guardian co-pilot inflation guardrails and narrative intervention (Agent 16). */
export function assessGuardianInflationInterventionInflation(input: {
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  narrativeShockSeverity: 'low' | 'medium' | 'high';
  copilotInflationEscalationActive: boolean;
  guardrailNarrativeCascadeBand: 'none' | 'building' | 'urgent';
  inflationBand: InflationConditionsBand;
  turn: number;
}): GuardianInflationInterventionAssessment {
  let pressure = 0;
  if (input.inflationGuardrailTripped) {
    pressure += 0.24;
  }
  if (input.stabilityInterventionBand === 'urgent') {
    pressure += 0.22;
  } else if (input.stabilityInterventionBand === 'advisory') {
    pressure += 0.1;
  }
  if (input.narrativeShockSeverity === 'high') {
    pressure += 0.18;
  } else if (input.narrativeShockSeverity === 'medium') {
    pressure += 0.08;
  }
  if (input.copilotInflationEscalationActive) {
    pressure += 0.16;
  }
  if (input.guardrailNarrativeCascadeBand === 'urgent') {
    pressure += 0.2;
  } else if (input.guardrailNarrativeCascadeBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const guardrailIndex = finRound(100 + pressure * 16, 1);

  let interventionBand: GuardianInflationInterventionBand = 'calm';
  if (pressure >= 0.55) interventionBand = 'guardrail_cascade';
  else if (pressure >= 0.35) interventionBand = 'urgent';
  else if (pressure >= 0.17) interventionBand = 'advisory';

  const inflationScoreNudge =
    interventionBand === 'guardrail_cascade'
      ? 0.086
      : interventionBand === 'urgent'
        ? 0.054
        : interventionBand === 'advisory'
          ? 0.024
          : 0;

  const narrative =
    interventionBand === 'guardrail_cascade' || interventionBand === 'urgent'
      ? 'Guardian guardrails are reflecting elevated inflation intervention in CPI metadata.'
      : interventionBand === 'advisory'
        ? 'Co-pilot advisory band nudging inflation presentation layers.'
        : 'Guardian inflation intervention calm versus headline CPI.';

  return { interventionBand, guardrailIndex, inflationScoreNudge, narrative };
}

export function guardianInflationInterventionScoreAdjustment(band: GuardianInflationInterventionBand): number {
  if (band === 'guardrail_cascade') return 4;
  if (band === 'urgent') return 3;
  if (band === 'advisory') return 2;
  return 0;
}
