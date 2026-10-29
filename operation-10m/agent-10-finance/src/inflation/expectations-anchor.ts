import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';
import { compareInflationBands } from './pass-through.js';

export interface InflationExpectationsState {
  /** 0–100; higher = better anchored */
  anchoringScore: number;
  /** Expected inflation band one turn ahead (deterministic) */
  expectedBand: InflationConditionsBand;
  deanchoringRisk: 'low' | 'moderate' | 'high';
  revisionFromPrior: number;
}

export interface ExpectationsStepInputs {
  currentBand: InflationConditionsBand;
  priorAnchoringScore: number;
  fiscalPressure: 'healthy' | 'tight' | 'strained' | 'critical' | null | undefined;
  highInflationScenario?: boolean;
  turn: number;
}

const BAND_FORWARD: Record<InflationConditionsBand, InflationConditionsBand> = {
  disinflation: 'disinflation',
  anchored: 'anchored',
  elevated: 'elevated',
  high: 'high',
  scenario_runaway: 'scenario_runaway',
};

/** One-step expectations update — persisted separately in Agent 25 merge. */
export function stepInflationExpectations(inputs: ExpectationsStepInputs): InflationExpectationsState {
  let score = finClamp(inputs.priorAnchoringScore || 72, 0, 100);

  if (compareInflationBands(inputs.currentBand, 'elevated') >= 0) {
    score -= 4.5;
  } else if (compareInflationBands(inputs.currentBand, 'anchored') <= 0) {
    score += 1.2;
  }

  if (inputs.highInflationScenario) {
    score -= 6;
  }
  if (inputs.fiscalPressure === 'critical') {
    score -= 2.5;
  } else if (inputs.fiscalPressure === 'healthy') {
    score += 0.8;
  }

  if (inputs.turn % 4 === 0) {
    score += 0.5;
  }

  score = finClamp(score, 15, 98);
  const revisionFromPrior = finRound(score - (inputs.priorAnchoringScore || 72), 2);

  let expectedBand = BAND_FORWARD[inputs.currentBand];
  if (score < 45 && compareInflationBands(inputs.currentBand, 'elevated') >= 0) {
    expectedBand = 'high';
  }
  if (score < 30) {
    expectedBand = 'scenario_runaway';
  }

  const deanchoringRisk: InflationExpectationsState['deanchoringRisk'] =
    score >= 62 ? 'low' : score >= 45 ? 'moderate' : 'high';

  return {
    anchoringScore: finRound(score, 2),
    expectedBand,
    deanchoringRisk,
    revisionFromPrior,
  };
}

export function initialInflationAnchoringScore(): number {
  return 72;
}
