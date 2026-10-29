import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type CorporateSurvivalPricingInflationLatchBand = 'contained' | 'building' | 'dominant' | 'survival_runaway';

export interface CorporateSurvivalPricingInflationLatchAssessment {
  latchBand: CorporateSurvivalPricingInflationLatchBand;
  pricingIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Corporate survival pricing inflation latch (Agent 08). */
export function assessCorporateSurvivalPricingInflationLatch(input: {
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  passThroughIntent: 'absorb' | 'partial' | 'full';
  marginCompression: 'none' | 'mild' | 'severe';
  wave39SurvivalPricingLatch: boolean;
  corporateMarkupEscalationBand: 'contained' | 'building' | 'dominant';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CorporateSurvivalPricingInflationLatchAssessment {
  let pressure = 0;
  if (input.pricingPowerBand === 'dominant') pressure += 0.22;
  else if (input.pricingPowerBand === 'strong') pressure += 0.12;
  if (input.passThroughIntent === 'full') pressure += 0.16;
  else if (input.passThroughIntent === 'partial') pressure += 0.08;
  if (input.marginCompression === 'severe') pressure += 0.1;
  if (input.wave39SurvivalPricingLatch) pressure += 0.13;
  if (input.corporateMarkupEscalationBand === 'dominant') pressure += 0.2;
  else if (input.corporateMarkupEscalationBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const pricingIndex = finRound(100 + pressure * 17, 1);

  let latchBand: CorporateSurvivalPricingInflationLatchBand = 'contained';
  if (pressure >= 0.58) latchBand = 'survival_runaway';
  else if (pressure >= 0.39) latchBand = 'dominant';
  else if (pressure >= 0.18) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'survival_runaway'
      ? 0.094
      : latchBand === 'dominant'
        ? 0.06
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'survival_runaway' || latchBand === 'dominant'
      ? 'Corporate survival pricing latch elevating CPI markup metadata.'
      : latchBand === 'building'
        ? 'Pass-through intent building markup escalation band.'
        : 'Corporate pricing latch contained versus headline CPI.';

  return { latchBand, pricingIndex, inflationScoreNudge, narrative };
}

export function corporateSurvivalPricingInflationLatchScoreAdjustment(
  band: CorporateSurvivalPricingInflationLatchBand,
): number {
  if (band === 'survival_runaway') return 4;
  if (band === 'dominant') return 3;
  if (band === 'building') return 2;
  return 0;
}
