export type ResourceMarketTrend = 'stable' | 'rising' | 'falling' | 'volatile';

export interface DeterministicMarketStepInput {
  resource: string;
  basePrice: number;
  currentPrice: number;
  trend: ResourceMarketTrend;
  /** Deterministic driver in [-1, 1] — stand-in for seeded gameplay RNG in canonical market update. */
  randCentered: number;
  pressureFraction?: number;
}

export interface DeterministicMarketStepResult {
  nextPrice: number;
  meanReversionComponent: number;
  trendDelta: number;
  pressureComponent: number;
}

const TREND_BIAS: Record<ResourceMarketTrend, number> = {
  stable: 0,
  rising: 0.5,
  falling: -0.5,
  volatile: 0,
};

const TREND_VARIANCE: Record<ResourceMarketTrend, number> = {
  stable: 0.5,
  rising: 1,
  falling: 1,
  volatile: 1.5,
};

/** Deterministic subset of V9.4 computeDailyMarketUpdate price step (commodity layer only). */
export function stepResourceMarketPriceDeterministic(input: DeterministicMarketStepInput): DeterministicMarketStepResult {
  const { basePrice, currentPrice, trend, randCentered } = input;
  const meanReversionComponent = 0.12 * (basePrice - currentPrice);
  const baseVariance = 0.15 * basePrice;
  const bias = TREND_BIAS[trend];
  const varianceScale = TREND_VARIANCE[trend];
  const centered = Math.max(-1, Math.min(1, randCentered));
  const trendDelta = (centered + bias) * baseVariance * varianceScale;
  const p = Math.max(-0.06, Math.min(0.06, Number(input.pressureFraction) || 0));
  const pressureComponent = p * basePrice;
  const nextPrice = Math.max(1, Math.round(currentPrice + meanReversionComponent + trendDelta + pressureComponent));
  return { nextPrice, meanReversionComponent, trendDelta, pressureComponent };
}

export function cycleMarketTrendDeterministic(day: number, previous: ResourceMarketTrend | '', randUnit: number): ResourceMarketTrend {
  if (previous && (day - 1) % 3 !== 0) return previous as ResourceMarketTrend;
  const r = Math.max(0, Math.min(1, randUnit));
  if (r < 0.4) return 'stable';
  if (r < 0.65) return 'rising';
  if (r < 0.9) return 'falling';
  return 'volatile';
}
