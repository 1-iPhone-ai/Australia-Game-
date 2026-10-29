/** Rules separating commodity resource quotes from macro inflation (V10.14 boundary). */

export function isCommodityPriceDomain(field: 'resourcePrices' | 'macroInflation' | 'autoModeHandicap'): boolean {
  return field === 'resourcePrices';
}

export function macroInflationMayUseCommodityPrices(): false {
  return false;
}

export function integrationNoteNonCpiBoundary(): string {
  return 'Resource market commodity prices are excluded from macro CPI aggregation (V10.13/V10.14 boundary).';
}

export const RESOURCE_MARKET_PRICES_BY_CATEGORY: Record<string, number> = {
  minerals: 150,
  agricultural: 100,
  industrial: 120,
  luxury: 500,
  energy: 200,
};

export function baseResourceMarketPrice(category: string): number {
  return RESOURCE_MARKET_PRICES_BY_CATEGORY[category] ?? 120;
}

/** Bounded daily pressure applied to commodity quotes (±6% of base) — not macro CPI. */
export function clampResourcePricePressure(pressure: number | undefined | null): number {
  return Math.max(-0.06, Math.min(0.06, Number(pressure) || 0));
}

export function applyResourcePricePressure(basePrice: number, pressureFraction: number): number {
  const p = clampResourcePricePressure(pressureFraction);
  return Math.max(1, Math.round(basePrice * (1 + p)));
}
