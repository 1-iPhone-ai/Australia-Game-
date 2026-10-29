import type {
  GTELForeignExchangeSnapshot,
  GTELPersisted,
  GTELTermsOfTradeSnapshot,
  GTELTradeFinanceSnapshot,
  GTELTradeFxHedgingSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeFxHedgingBand = GTELTradeFxHedgingSnapshot['band'];

function hedgingBand(effectiveness: number): GTELTradeFxHedgingBand {
  if (effectiveness >= 0.74) return 'well_hedged';
  if (effectiveness >= 0.52) return 'balanced';
  if (effectiveness >= 0.32) return 'exposed';
  return 'unhedged';
}

export function sanitizeTradeFxHedgingSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.5), 0.18, 0.92);
}

export function createEmptyTradeFxHedgingSnapshot(): GTELTradeFxHedgingSnapshot {
  return {
    effectiveness: 0.5,
    band: 'balanced',
    passThroughBuffer: 0.08,
    termsShield: 0.12,
    summary: 'FX and terms hedging are providing moderate pass-through buffers.',
  };
}

export function advanceTradeFxHedgingSmoothing(
  persisted: GTELPersisted,
  rawEffectiveness: number,
): GTELPersisted {
  const prev = sanitizeTradeFxHedgingSmoothing(persisted.tradeFxHedgingSmoothing);
  const next = gtelClamp(prev * 0.73 + gtelClamp(rawEffectiveness, 0.18, 0.92) * 0.27, 0.18, 0.92);
  return { ...persisted, tradeFxHedgingSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeFxHedgingSnapshot(input: {
  foreignExchange: GTELForeignExchangeSnapshot;
  termsOfTrade: GTELTermsOfTradeSnapshot;
  tradeFinance: GTELTradeFinanceSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeFxHedgingSnapshot; persisted: GTELPersisted } {
  const fxLift =
    input.foreignExchange.band === 'supportive'
      ? 0.16
      : input.foreignExchange.band === 'neutral'
        ? 0.08
        : input.foreignExchange.band === 'stress'
          ? -0.06
          : -0.12;
  const termsLift =
    input.termsOfTrade.band === 'favorable'
      ? 0.14
      : input.termsOfTrade.band === 'neutral'
        ? 0.06
        : input.termsOfTrade.band === 'unfavorable'
          ? -0.05
          : -0.1;
  const financeLift = gtelClamp((input.tradeFinance.availabilityScore - 0.55) * 0.22, -0.08, 0.12);
  const rawEffectiveness = gtelClamp(0.42 + fxLift + termsLift + financeLift, 0.18, 0.92);
  const persisted = advanceTradeFxHedgingSmoothing(input.persisted, rawEffectiveness);
  const effectiveness = sanitizeTradeFxHedgingSmoothing(persisted.tradeFxHedgingSmoothing);
  const band = hedgingBand(effectiveness);
  const passThroughBuffer = gtelClamp(
    effectiveness * 0.12 + (input.foreignExchange.band === 'crisis' ? -0.04 : 0.02),
    0.02,
    0.2,
  );
  const termsShield = gtelClamp(effectiveness * 0.14 + (input.termsOfTrade.index > 1 ? 0.03 : -0.02), 0.02, 0.22);

  const summary =
    band === 'well_hedged'
      ? 'Treasury hedges are absorbing FX and terms shocks before they hit export quotes.'
      : band === 'unhedged'
        ? 'Minimal hedging — FX and terms swings are passing straight into export pricing.'
        : band === 'exposed'
          ? 'Hedging books are thin; terms and FX moves are leaking into commodity quotes.'
          : 'FX and terms hedging are providing moderate pass-through buffers.';

  return {
    snapshot: {
      effectiveness: Math.round(effectiveness * 1000) / 1000,
      band,
      passThroughBuffer: Math.round(passThroughBuffer * 1000) / 1000,
      termsShield: Math.round(termsShield * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeFxHedgingHouseholdModifier(snapshot: GTELTradeFxHedgingSnapshot): number {
  if (snapshot.band === 'well_hedged') return gtelClamp(snapshot.passThroughBuffer * 0.15, 0, 0.04);
  if (snapshot.band === 'unhedged') return gtelClamp(-snapshot.passThroughBuffer * 0.2, -0.06, 0);
  if (snapshot.band === 'exposed') return gtelClamp(-snapshot.passThroughBuffer * 0.12, -0.04, 0);
  return 0;
}

export function tradeFxHedgingExportScale(snapshot: GTELTradeFxHedgingSnapshot): number {
  if (snapshot.band === 'well_hedged') return gtelClamp(1 + snapshot.effectiveness * 0.02, 1, 1.03);
  if (snapshot.band === 'unhedged') return gtelClamp(0.94 + snapshot.effectiveness * 0.04, 0.9, 0.98);
  return gtelClamp(0.97 + snapshot.effectiveness * 0.03, 0.93, 1.01);
}

export function tradeFxHedgingWorldEvent(
  snapshot: GTELTradeFxHedgingSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'exposed' && snapshot.band !== 'unhedged') return null;
  if (snapshot.effectiveness > 0.38) return null;
  return {
    id: `gtel_fx_hedge_${turn}`,
    turn,
    kind: 'trade',
    title: 'FX hedging gap widening',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'QLD'],
  };
}

export function tradeFxHedgingGiNotes(hedging: GTELTradeFxHedgingSnapshot | null | undefined): string[] {
  if (!hedging) return [];
  return [
    `Trade FX hedging: ${hedging.band.replace(/_/g, ' ')} (${Math.round(hedging.effectiveness * 100)}% effective).`,
    hedging.summary,
  ];
}
