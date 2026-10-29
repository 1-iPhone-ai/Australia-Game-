import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type CorporatePricingPassThroughBand = 'absorbed' | 'partial' | 'elevated' | 'markup_cascade';

export interface CorporatePricingPassThroughInflationAssessment {
  passThroughBand: CorporatePricingPassThroughBand;
  corporateIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Corporate pricing power and markup pass-through in CPI metadata (Agent 08). */
export function assessCorporatePricingPassThroughInflation(input: {
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  marginCompression: 'none' | 'mild' | 'severe';
  passThroughIntent: 'absorb' | 'partial' | 'full';
  productionCapacityStrainInflationFlag: boolean;
  corporateMarkupCascadeBand: 'none' | 'building' | 'active';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CorporatePricingPassThroughInflationAssessment {
  let pressure = 0;
  if (input.pricingPowerBand === 'dominant') {
    pressure += 0.28;
  } else if (input.pricingPowerBand === 'strong') {
    pressure += 0.16;
  }
  if (input.passThroughIntent === 'full') {
    pressure += 0.18;
  } else if (input.passThroughIntent === 'partial') {
    pressure += 0.08;
  }
  if (input.marginCompression === 'mild' && input.passThroughIntent !== 'absorb') {
    pressure += 0.06;
  }
  if (input.productionCapacityStrainInflationFlag) {
    pressure += 0.14;
  }
  if (input.corporateMarkupCascadeBand === 'active') {
    pressure += 0.2;
  } else if (input.corporateMarkupCascadeBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const corporateIndex = finRound(100 + pressure * 16, 1);

  let passThroughBand: CorporatePricingPassThroughBand = 'absorbed';
  if (pressure >= 0.55) passThroughBand = 'markup_cascade';
  else if (pressure >= 0.35) passThroughBand = 'elevated';
  else if (pressure >= 0.17) passThroughBand = 'partial';

  const inflationScoreNudge =
    passThroughBand === 'markup_cascade'
      ? 0.087
      : passThroughBand === 'elevated'
        ? 0.055
        : passThroughBand === 'partial'
          ? 0.025
          : 0;

  const narrative =
    passThroughBand === 'markup_cascade' || passThroughBand === 'elevated'
      ? 'Corporate pricing power is cascading markups into CPI through production strain.'
      : passThroughBand === 'partial'
        ? 'Partial corporate pass-through firming as pricing intent shifts.'
        : 'Corporate markup pass-through absorbed versus headline CPI.';

  return { passThroughBand, corporateIndex, inflationScoreNudge, narrative };
}

export function corporatePricingPassThroughInflationScoreAdjustment(band: CorporatePricingPassThroughBand): number {
  if (band === 'markup_cascade') return 4;
  if (band === 'elevated') return 3;
  if (band === 'partial') return 2;
  return 0;
}
