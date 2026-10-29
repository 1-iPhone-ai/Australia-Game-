import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type ResearchBreakthroughSupplySideInflationLatchBand =
  | 'offset'
  | 'neutral'
  | 'building'
  | 'breakthrough_failure';

export interface ResearchBreakthroughSupplySideInflationLatchAssessment {
  latchBand: ResearchBreakthroughSupplySideInflationLatchBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Research breakthrough supply-side inflation latch (Agent 03, round 48). */
export function assessResearchBreakthroughSupplySideInflationLatch(input: {
  productivityGainBand: 'flat' | 'moderate' | 'strong';
  supplySideReliefActive: boolean;
  wave48ResearchBreakthroughLatch: boolean;
  researchSupplySideFailureBand: 'contained' | 'building' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ResearchBreakthroughSupplySideInflationLatchAssessment {
  let pressure = 0;
  if (input.productivityGainBand === 'flat' && !input.supplySideReliefActive) pressure += 0.16;
  else if (input.productivityGainBand === 'moderate' && !input.supplySideReliefActive) pressure += 0.08;
  if (input.wave48ResearchBreakthroughLatch) pressure += 0.14;
  if (input.researchSupplySideFailureBand === 'critical') pressure += 0.22;
  else if (input.researchSupplySideFailureBand === 'building') pressure += 0.1;

  if (input.productivityGainBand === 'strong' && input.supplySideReliefActive) pressure -= 0.12;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 15.8, 1);

  let latchBand: ResearchBreakthroughSupplySideInflationLatchBand = 'neutral';
  if (pressure >= 0.56) latchBand = 'breakthrough_failure';
  else if (pressure >= 0.36) latchBand = 'building';
  else if (pressure <= 0.12 && input.productivityGainBand === 'strong') latchBand = 'offset';

  const inflationScoreNudge =
    latchBand === 'breakthrough_failure'
      ? 0.091
      : latchBand === 'building'
        ? 0.057
        : latchBand === 'offset'
          ? -0.02
          : 0;

  const narrative =
    latchBand === 'breakthrough_failure' || latchBand === 'building'
      ? 'Research breakthrough latch failing to offset CPI via supply-side relief.'
      : latchBand === 'offset'
        ? 'Strong innovation offset holding headline CPI metadata anchored.'
        : 'Research supply-side latch neutral versus headline CPI.';

  return { latchBand, pressureIndex, inflationScoreNudge, narrative };
}

export function researchBreakthroughSupplySideInflationLatchScoreAdjustment(
  band: ResearchBreakthroughSupplySideInflationLatchBand,
): number {
  if (band === 'breakthrough_failure') return 4;
  if (band === 'building') return 3;
  if (band === 'offset') return -1;
  return 0;
}
