import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Applies macro cost-of-living multiplier to non-commodity economy/travel presentation costs. */
export function applyMacroCostOfLivingToEconomyLayer(baseCost: number, multiplier: number, min = 0.92, max = 1.45): number {
  const m = finClamp(multiplier, min, max);
  return Math.max(0, Math.round(baseCost * m));
}

/** Auto-mode handicap category — must not alter resource market quotes or macro CPI scores. */
export function autoModePriceInflationHandicapFactor(enabled: boolean, categoryActive: boolean): number {
  if (!enabled || !categoryActive) return 1;
  return 1.08;
}

export function inflationBandSeverityRank(band: InflationConditionsBand): number {
  const order: InflationConditionsBand[] = ['disinflation', 'anchored', 'elevated', 'high', 'scenario_runaway'];
  return order.indexOf(band);
}

export function compareInflationBands(a: InflationConditionsBand, b: InflationConditionsBand): number {
  return inflationBandSeverityRank(a) - inflationBandSeverityRank(b);
}

export function serviceCostPassThroughFromAffordability(
  affordability: 'healthy' | 'strained' | 'severe_pressure' | null | undefined,
): number {
  if (affordability === 'severe_pressure') return 0.12;
  if (affordability === 'strained') return 0.07;
  return 0;
}
