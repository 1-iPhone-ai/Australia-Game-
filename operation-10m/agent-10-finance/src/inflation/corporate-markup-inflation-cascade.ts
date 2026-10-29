import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type CorporateMarkupInflationCascadeBand = 'absorbed' | 'partial' | 'active' | 'dominant';

export interface CorporateMarkupInflationCascadeAssessment {
  cascadeBand: CorporateMarkupInflationCascadeBand;
  markupIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Corporate pricing power and markup pass-through cascade (Agent 08). */
export function assessCorporateMarkupInflationCascade(input: {
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  passThroughIntent: 'absorb' | 'partial' | 'full';
  marginCompression: 'none' | 'mild' | 'severe';
  corporatePricingInflationLatch: boolean;
  markupPassThroughCascadeBand: 'absorbed' | 'partial' | 'full';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CorporateMarkupInflationCascadeAssessment {
  let pressure = 0;
  if (input.pricingPowerBand === 'dominant') {
    pressure += 0.24;
  } else if (input.pricingPowerBand === 'strong') {
    pressure += 0.14;
  }
  if (input.passThroughIntent === 'full') {
    pressure += 0.16;
  } else if (input.passThroughIntent === 'partial') {
    pressure += 0.08;
  }
  if (input.marginCompression === 'severe') {
    pressure -= 0.06;
  }
  if (input.corporatePricingInflationLatch) {
    pressure += 0.13;
  }
  if (input.markupPassThroughCascadeBand === 'full') {
    pressure += 0.2;
  } else if (input.markupPassThroughCascadeBand === 'partial') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const markupIndex = finRound(100 + pressure * 16, 1);

  let cascadeBand: CorporateMarkupInflationCascadeBand = 'absorbed';
  if (pressure >= 0.55) cascadeBand = 'dominant';
  else if (pressure >= 0.35) cascadeBand = 'active';
  else if (pressure >= 0.16) cascadeBand = 'partial';

  const inflationScoreNudge =
    cascadeBand === 'dominant'
      ? 0.09
      : cascadeBand === 'active'
        ? 0.056
        : cascadeBand === 'partial'
          ? 0.027
          : 0;

  const narrative =
    cascadeBand === 'dominant' || cascadeBand === 'active'
      ? 'Corporate markup cascade passing pricing power into CPI metadata.'
      : cascadeBand === 'partial'
        ? 'Corporate pricing inflation latch building markup pass-through.'
        : 'Corporate markup cascade absorbed versus headline CPI.';

  return { cascadeBand, markupIndex, inflationScoreNudge, narrative };
}

export function corporateMarkupInflationCascadeScoreAdjustment(band: CorporateMarkupInflationCascadeBand): number {
  if (band === 'dominant') return 4;
  if (band === 'active') return 3;
  if (band === 'partial') return 2;
  return 0;
}
