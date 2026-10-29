import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type AgriculturalFarmgatePressureBand = 'soft' | 'firming' | 'sharp' | 'harvest_crisis';

export interface AgriculturalFarmgateInflationAssessment {
  pressureBand: AgriculturalFarmgatePressureBand;
  farmgateIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Farmgate and agricultural supply-chain CPI (household food pipeline — not export commodity boundary). */
export function assessAgriculturalFarmgateInflation(input: {
  harvestStressBand: 'normal' | 'weak' | 'severe';
  transportToMarketBand: 'smooth' | 'strained' | 'critical';
  inputCostPassThrough: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): AgriculturalFarmgateInflationAssessment {
  let pressure = 0;
  if (input.harvestStressBand === 'severe') pressure += 0.4;
  else if (input.harvestStressBand === 'weak') pressure += 0.22;

  if (input.transportToMarketBand === 'critical') pressure += 0.28;
  else if (input.transportToMarketBand === 'strained') pressure += 0.14;

  if (input.inputCostPassThrough) pressure += 0.16;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const farmgateIndex = finRound(100 + pressure * 17, 1);

  let pressureBand: AgriculturalFarmgatePressureBand = 'soft';
  if (pressure >= 0.6) pressureBand = 'harvest_crisis';
  else if (pressure >= 0.38) pressureBand = 'sharp';
  else if (pressure >= 0.2) pressureBand = 'firming';

  const inflationScoreNudge =
    pressureBand === 'harvest_crisis'
      ? 0.09
      : pressureBand === 'sharp'
        ? 0.06
        : pressureBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'harvest_crisis' || pressureBand === 'sharp'
      ? 'Farmgate prices are feeding grocery CPI through harvest stress and logistics.'
      : pressureBand === 'firming'
        ? 'Agricultural farmgate inflation firming on input and freight pass-through.'
        : 'Farmgate inflation soft relative to food services basket.';

  return { pressureBand, farmgateIndex, inflationScoreNudge, narrative };
}

export function agriculturalFarmgateInflationScoreAdjustment(band: AgriculturalFarmgatePressureBand): number {
  if (band === 'harvest_crisis') return 4;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}
