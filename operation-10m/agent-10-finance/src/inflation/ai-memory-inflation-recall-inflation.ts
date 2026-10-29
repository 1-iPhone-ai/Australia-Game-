import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type AiMemoryInflationRecallBand = 'anchored' | 'drifting' | 'recall_elevated' | 'memory_shock';

export interface AiMemoryInflationRecallAssessment {
  recallBand: AiMemoryInflationRecallBand;
  memoryIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** AI memory recall and explainability salience in CPI metadata (Agent 19). */
export function assessAiMemoryInflationRecallInflation(input: {
  recalledInflationRegimeConfidence: number;
  narrativeDriftTowardHigherInflation: boolean;
  explainabilityAlertActive: boolean;
  memoryInflationRecallCascade: boolean;
  explainabilityInflationSalienceBand: 'muted' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): AiMemoryInflationRecallAssessment {
  let pressure = 0;
  if (input.narrativeDriftTowardHigherInflation) {
    pressure += 0.22;
  }
  pressure += finClamp(input.recalledInflationRegimeConfidence, 0, 1) * 0.2;
  if (input.explainabilityAlertActive) {
    pressure += 0.14;
  }
  if (input.memoryInflationRecallCascade) {
    pressure += 0.18;
  }
  if (input.explainabilityInflationSalienceBand === 'critical') {
    pressure += 0.2;
  } else if (input.explainabilityInflationSalienceBand === 'elevated') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const memoryIndex = finRound(100 + pressure * 16, 1);

  let recallBand: AiMemoryInflationRecallBand = 'anchored';
  if (pressure >= 0.55) recallBand = 'memory_shock';
  else if (pressure >= 0.35) recallBand = 'recall_elevated';
  else if (pressure >= 0.16) recallBand = 'drifting';

  const inflationScoreNudge =
    recallBand === 'memory_shock'
      ? 0.088
      : recallBand === 'recall_elevated'
        ? 0.055
        : recallBand === 'drifting'
          ? 0.024
          : 0;

  const narrative =
    recallBand === 'memory_shock' || recallBand === 'recall_elevated'
      ? 'AI memory recall is elevating inflation regime confidence in CPI presentation layers.'
      : recallBand === 'drifting'
        ? 'Narrative drift toward higher inflation in memory-backed explainability.'
        : 'AI memory inflation recall anchored versus headline.';

  return { recallBand, memoryIndex, inflationScoreNudge, narrative };
}

export function aiMemoryInflationRecallScoreAdjustment(band: AiMemoryInflationRecallBand): number {
  if (band === 'memory_shock') return 4;
  if (band === 'recall_elevated') return 3;
  if (band === 'drifting') return 2;
  return 0;
}
