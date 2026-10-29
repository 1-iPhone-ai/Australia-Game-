import type { InflationConditionsBand } from '../definitions/types.js';
import { decomposeMacroCpiBasket } from './cpi-basket.js';
import { MACRO_CPI_BASKET } from './cpi-basket.js';
import { finClamp, finRound } from '../compute/math.js';

export interface CoreHeadlineSpread {
  headlineIndex: number;
  coreIndex: number;
  spreadPoints: number;
  volatileShare: number;
  interpretation: 'aligned' | 'headline_above_core' | 'core_sticky_elevated';
}

const VOLATILE_CATEGORY_IDS = new Set(['food_at_home', 'utilities', 'transport_services']);

/** Separates sticky core services from volatile basket lines (still non-commodity macro CPI). */
export function computeCoreHeadlineSpread(
  inflationBand: InflationConditionsBand,
  turn: number,
  serviceCostPassThrough = 0,
): CoreHeadlineSpread {
  const basket = decomposeMacroCpiBasket(inflationBand, turn, serviceCostPassThrough);
  let coreSum = 0;
  let coreWeight = 0;
  let volatileSum = 0;
  let volatileWeight = 0;

  for (const cat of basket.categories) {
    const meta = MACRO_CPI_BASKET.find((m) => m.id === cat.categoryId);
    const w = meta?.weight ?? 0;
    if (VOLATILE_CATEGORY_IDS.has(cat.categoryId)) {
      volatileSum += cat.contribution;
      volatileWeight += w;
    } else {
      coreSum += cat.contribution;
      coreWeight += w;
    }
  }

  const headlineIndex = basket.headlineIndex;
  const coreIndex = coreWeight > 0 ? finRound(coreSum / coreWeight, 2) : headlineIndex;
  const spreadPoints = finRound(headlineIndex - coreIndex, 2);
  const volatileShare = finRound(finClamp(volatileWeight, 0, 1), 3);

  const interpretation: CoreHeadlineSpread['interpretation'] =
    Math.abs(spreadPoints) < 1.5
      ? 'aligned'
      : spreadPoints > 1.5
        ? 'headline_above_core'
        : 'core_sticky_elevated';

  return {
    headlineIndex,
    coreIndex,
    spreadPoints,
    volatileShare,
    interpretation,
  };
}
