import { GTEL_BASE_COMMODITY_INDEX, GTEL_COMMODITIES } from './constants.ts';
import type {
  GTELCommodityQuote,
  GTELImportDependencySnapshot,
  GTELPersisted,
  GTELTermsOfTradeSnapshot,
  GTELTradeBalanceSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTermsOfTradeBand = GTELTermsOfTradeSnapshot['band'];

const EXPORT_WEIGHT: Partial<Record<(typeof GTEL_COMMODITIES)[number], number>> = {
  iron_ore: 1.15,
  coal: 0.95,
  lng: 1.05,
  wheat: 0.75,
  beef: 0.7,
  aluminium: 0.85,
  services: 0.55,
  manufacturing: 0.45,
};

const IMPORT_BASKET_WEIGHT: Partial<Record<(typeof GTEL_COMMODITIES)[number], number>> = {
  manufacturing: 1.2,
  services: 0.65,
  aluminium: 0.55,
  lng: 0.35,
  coal: 0.2,
  iron_ore: 0.15,
  wheat: 0.25,
  beef: 0.18,
};

function termsBand(index: number): GTELTermsOfTradeBand {
  if (index >= 1.06) return 'favorable';
  if (index >= 0.98) return 'neutral';
  if (index >= 0.88) return 'unfavorable';
  return 'severely_unfavorable';
}

export function sanitizeTermsOfTradeSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 1), 0.72, 1.28);
}

export function createEmptyTermsOfTradeSnapshot(): GTELTermsOfTradeSnapshot {
  return {
    index: 1,
    band: 'neutral',
    exportBasketIndex: 100,
    importBasketIndex: 100,
    summary: 'Export and import price baskets are in rough parity.',
  };
}

function weightedBasketIndex(
  commodities: GTELCommodityQuote[],
  weights: Partial<Record<(typeof GTEL_COMMODITIES)[number], number>>,
): number {
  let sum = 0;
  let wSum = 0;
  GTEL_COMMODITIES.forEach(c => {
    const w = gtelNum(weights[c], 0.5);
    const quote = commodities.find(q => q.commodity === c);
    const idx = quote?.effectiveIndex ?? GTEL_BASE_COMMODITY_INDEX[c];
    sum += idx * w;
    wSum += w;
  });
  return wSum > 0 ? sum / wSum : 100;
}

export function advanceTermsOfTradeSmoothing(persisted: GTELPersisted, rawIndex: number): GTELPersisted {
  const prev = sanitizeTermsOfTradeSmoothing(persisted.termsOfTradeSmoothing);
  const next = gtelClamp(prev * 0.78 + gtelClamp(rawIndex, 0.75, 1.25) * 0.22, 0.72, 1.28);
  return { ...persisted, termsOfTradeSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTermsOfTradeSnapshot(input: {
  commodities: GTELCommodityQuote[];
  tradeBalance: GTELTradeBalanceSnapshot;
  importDependency: GTELImportDependencySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTermsOfTradeSnapshot; persisted: GTELPersisted } {
  const exportBasketIndex = Math.round(weightedBasketIndex(input.commodities, EXPORT_WEIGHT) * 10) / 10;
  const importBasketIndex = Math.round(
    (weightedBasketIndex(input.commodities, IMPORT_BASKET_WEIGHT) +
      input.tradeBalance.importPressureIndex * 0.08 +
      input.importDependency.aggregateRisk * 12) *
      10,
  ) / 10;
  const rawIndex = gtelClamp(exportBasketIndex / Math.max(72, importBasketIndex), 0.76, 1.22);
  const balanceLift =
    input.tradeBalance.currentAccountTone === 'surplus' || input.tradeBalance.currentAccountTone === 'mild_surplus'
      ? 0.025
      : input.tradeBalance.currentAccountTone === 'deficit'
        ? -0.035
        : 0;
  const adjustedRaw = gtelClamp(rawIndex + balanceLift, 0.75, 1.25);
  const persisted = advanceTermsOfTradeSmoothing(input.persisted, adjustedRaw);
  const index = sanitizeTermsOfTradeSmoothing(persisted.termsOfTradeSmoothing);
  const band = termsBand(index);
  const summary =
    band === 'favorable'
      ? 'Export commodity prices are outpacing import-linked costs — terms of trade are working in your favour.'
      : band === 'severely_unfavorable'
        ? 'Import basket inflation is eroding export purchasing power; terms of trade are sharply adverse.'
        : band === 'unfavorable'
          ? 'Import-side price pressure is nibbling at export-led income gains.'
          : 'Terms of trade are broadly neutral this turn.';

  return {
    snapshot: {
      index: Math.round(index * 1000) / 1000,
      band,
      exportBasketIndex,
      importBasketIndex,
      summary,
    },
    persisted,
  };
}

/** Household offset modifier from terms-of-trade (negative = tighter household room). */
export function termsOfTradeHouseholdModifier(snapshot: GTELTermsOfTradeSnapshot | null | undefined): number {
  if (!snapshot) return 0;
  if (snapshot.band === 'favorable') return 0.04;
  if (snapshot.band === 'severely_unfavorable') return -0.08;
  if (snapshot.band === 'unfavorable') return -0.035;
  return 0;
}

export function termsOfTradeWorldEvent(
  snapshot: GTELTermsOfTradeSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'severely_unfavorable') return null;
  return {
    id: `gtel_terms_of_trade_${turn}`,
    turn,
    kind: 'trade',
    title: 'Adverse terms of trade shock',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'QLD'],
  };
}

export function termsOfTradeGiNotes(terms: GTELTermsOfTradeSnapshot | null | undefined): string[] {
  if (!terms) return [];
  return [
    `Terms of trade: ${terms.band.replace(/_/g, ' ')} (index ${terms.index.toFixed(2)}).`,
    terms.summary,
  ];
}
