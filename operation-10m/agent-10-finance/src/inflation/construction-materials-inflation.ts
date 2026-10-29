import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type ConstructionMaterialsPressureBand = 'soft' | 'firming' | 'sharp' | 'supply_crunch';

export interface ConstructionMaterialsInflationAssessment {
  pressureBand: ConstructionMaterialsPressureBand;
  materialsIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Building materials and construction inputs in macro CPI metadata (not asset prices). */
export function assessConstructionMaterialsInflation(input: {
  supplyChainStressBand: 'normal' | 'elevated' | 'severe';
  laborShortagePassThrough: boolean;
  importContentShare: number;
  inflationBand: InflationConditionsBand;
  turn: number;
}): ConstructionMaterialsInflationAssessment {
  let pressure = 0;
  if (input.supplyChainStressBand === 'severe') pressure += 0.42;
  else if (input.supplyChainStressBand === 'elevated') pressure += 0.26;

  if (input.laborShortagePassThrough) pressure += 0.2;
  pressure += finClamp(input.importContentShare, 0, 0.5) * 0.35;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.08;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const materialsIndex = finRound(100 + pressure * 18, 1);

  let pressureBand: ConstructionMaterialsPressureBand = 'soft';
  if (pressure >= 0.62) pressureBand = 'supply_crunch';
  else if (pressure >= 0.4) pressureBand = 'sharp';
  else if (pressure >= 0.2) pressureBand = 'firming';

  const inflationScoreNudge =
    pressureBand === 'supply_crunch'
      ? 0.09
      : pressureBand === 'sharp'
        ? 0.06
        : pressureBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'supply_crunch' || pressureBand === 'sharp'
      ? 'Construction materials are lifting investment-sensitive CPI through supply and import pass-through.'
      : pressureBand === 'firming'
        ? 'Materials inflation firming — labor and supply stress building.'
        : 'Construction materials inflation soft versus goods headline.';

  return { pressureBand, materialsIndex, inflationScoreNudge, narrative };
}

export function constructionMaterialsInflationScoreAdjustment(band: ConstructionMaterialsPressureBand): number {
  if (band === 'supply_crunch') return 4;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}
