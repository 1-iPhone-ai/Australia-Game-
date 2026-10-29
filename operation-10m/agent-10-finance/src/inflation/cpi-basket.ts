import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export interface CpiBasketCategory {
  id: string;
  label: string;
  weight: number;
  /** Excluded from macro CPI if true (commodity-linked). */
  commodityLinked: boolean;
}

/** Non-commodity macro CPI weights (must sum to 1 for non-commodity slice). */
export const MACRO_CPI_BASKET: readonly CpiBasketCategory[] = [
  { id: 'housing_services', label: 'Housing services', weight: 0.22, commodityLinked: false },
  { id: 'utilities', label: 'Utilities', weight: 0.08, commodityLinked: false },
  { id: 'food_at_home', label: 'Food at home', weight: 0.11, commodityLinked: false },
  { id: 'transport_services', label: 'Transport services', weight: 0.14, commodityLinked: false },
  { id: 'health_education', label: 'Health & education', weight: 0.18, commodityLinked: false },
  { id: 'recreation', label: 'Recreation', weight: 0.09, commodityLinked: false },
  { id: 'other_services', label: 'Other services', weight: 0.18, commodityLinked: false },
] as const;

export interface CategoryInflationContribution {
  categoryId: string;
  label: string;
  contribution: number;
  band: InflationConditionsBand;
}

export interface CpiBasketDecomposition {
  headlineIndex: number;
  servicesShare: number;
  goodsShare: number;
  categories: CategoryInflationContribution[];
  excludesCommodityQuotes: true;
}

const BAND_INDEX: Record<InflationConditionsBand, number> = {
  disinflation: 96,
  anchored: 100,
  elevated: 106,
  high: 114,
  scenario_runaway: 128,
};

function categoryBand(base: InflationConditionsBand, categoryId: string, turn: number): InflationConditionsBand {
  const jitter = (categoryId.charCodeAt(0) + turn) % 3;
  const order: InflationConditionsBand[] = ['disinflation', 'anchored', 'elevated', 'high', 'scenario_runaway'];
  const idx = finClamp(order.indexOf(base) + (jitter === 0 ? 0 : jitter === 1 ? 1 : -1), 0, order.length - 1);
  return order[idx];
}

/** Builds a presentation-only CPI decomposition; resource market prices stay out of basket. */
export function decomposeMacroCpiBasket(
  inflationBand: InflationConditionsBand,
  turn: number,
  serviceCostPassThrough = 0,
): CpiBasketDecomposition {
  const categories: CategoryInflationContribution[] = [];
  let headline = 0;
  let services = 0;

  for (const cat of MACRO_CPI_BASKET) {
    if (cat.commodityLinked) continue;
    const band = categoryBand(inflationBand, cat.id, turn);
    let idx = BAND_INDEX[band];
    if (cat.id.includes('services') || cat.id === 'other_services') {
      idx += serviceCostPassThrough * 100;
      services += cat.weight;
    }
    const contribution = finRound(idx * cat.weight, 3);
    headline += contribution;
    categories.push({
      categoryId: cat.id,
      label: cat.label,
      contribution,
      band,
    });
  }

  const goodsShare = finRound(1 - services, 3);
  return {
    headlineIndex: finRound(headline, 2),
    servicesShare: finRound(services, 3),
    goodsShare,
    categories,
    excludesCommodityQuotes: true,
  };
}

export function macroCpiBasketWeightSum(): number {
  return finRound(
    MACRO_CPI_BASKET.filter((c) => !c.commodityLinked).reduce((s, c) => s + c.weight, 0),
    4,
  );
}
