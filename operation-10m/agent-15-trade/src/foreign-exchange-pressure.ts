import type {
  GTELForeignExchangeSnapshot,
  GTELPersisted,
  GTELTermsOfTradeSnapshot,
  GTELTradeBalanceSnapshot,
  GTELTradeFinanceSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELForeignExchangeBand = GTELForeignExchangeSnapshot['band'];

function fxBand(pressureIndex: number): GTELForeignExchangeBand {
  if (pressureIndex >= 1.045) return 'supportive';
  if (pressureIndex >= 0.96) return 'neutral';
  if (pressureIndex >= 0.88) return 'stress';
  return 'crisis';
}

export function sanitizeForeignExchangeSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 1), 0.78, 1.22);
}

export function createEmptyForeignExchangeSnapshot(): GTELForeignExchangeSnapshot {
  return {
    pressureIndex: 1,
    band: 'neutral',
    passThroughToImports: 0.12,
    exportCompetitiveness: 0.5,
    summary: 'Trade-weighted FX pass-through is near neutral.',
  };
}

export function advanceForeignExchangeSmoothing(
  persisted: GTELPersisted,
  rawPressure: number,
): GTELPersisted {
  const prev = sanitizeForeignExchangeSmoothing(persisted.foreignExchangeSmoothing);
  const next = gtelClamp(prev * 0.76 + gtelClamp(rawPressure, 0.8, 1.18) * 0.24, 0.78, 1.22);
  return { ...persisted, foreignExchangeSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeForeignExchangeSnapshot(input: {
  termsOfTrade: GTELTermsOfTradeSnapshot;
  tradeBalance: GTELTradeBalanceSnapshot;
  tradeFinance: GTELTradeFinanceSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELForeignExchangeSnapshot; persisted: GTELPersisted } {
  const termsLift = gtelClamp((input.termsOfTrade.index - 1) * 0.35, -0.08, 0.1);
  const balanceLift =
    input.tradeBalance.currentAccountTone === 'surplus' || input.tradeBalance.currentAccountTone === 'mild_surplus'
      ? 0.035
      : input.tradeBalance.currentAccountTone === 'deficit'
        ? -0.045
        : 0;
  const financeDrag =
    input.tradeFinance.band === 'frozen'
      ? -0.06
      : input.tradeFinance.band === 'tight'
        ? -0.035
        : input.tradeFinance.band === 'fluid'
          ? 0.025
          : 0;
  const rawPressure = gtelClamp(1 + termsLift + balanceLift + financeDrag, 0.82, 1.16);
  const persisted = advanceForeignExchangeSmoothing(input.persisted, rawPressure);
  const pressureIndex = sanitizeForeignExchangeSmoothing(persisted.foreignExchangeSmoothing);
  const band = fxBand(pressureIndex);
  const passThroughToImports = gtelClamp(0.08 + (1.02 - pressureIndex) * 0.22, 0.04, 0.28);
  const exportCompetitiveness = gtelClamp((pressureIndex - 0.88) / 0.34, 0, 1);

  const summary =
    band === 'supportive'
      ? 'Commodity-linked FX is easing import costs while keeping export quotes competitive.'
      : band === 'crisis'
        ? 'FX pass-through is amplifying import inflation faster than export receipts can offset.'
        : band === 'stress'
          ? 'Currency pressure is feeding through to import prices and squeezing household budgets.'
          : 'Trade-weighted exchange pass-through is broadly balanced this turn.';

  return {
    snapshot: {
      pressureIndex: Math.round(pressureIndex * 1000) / 1000,
      band,
      passThroughToImports: Math.round(passThroughToImports * 1000) / 1000,
      exportCompetitiveness: Math.round(exportCompetitiveness * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function foreignExchangeExportScale(
  snapshot: GTELForeignExchangeSnapshot | null | undefined,
): number {
  if (!snapshot) return 1;
  return gtelClamp(0.88 + snapshot.exportCompetitiveness * 0.16, 0.86, 1.06);
}

export function foreignExchangeHouseholdModifier(
  snapshot: GTELForeignExchangeSnapshot | null | undefined,
): number {
  if (!snapshot) return 0;
  return gtelClamp((1 - snapshot.pressureIndex) * 0.18 - snapshot.passThroughToImports * 0.12, -0.12, 0.08);
}

export function foreignExchangeDomesticStress(
  snapshot: GTELForeignExchangeSnapshot | null | undefined,
): number {
  if (!snapshot) return 0;
  return gtelClamp(snapshot.passThroughToImports * 0.14 + (snapshot.band === 'crisis' ? 0.04 : 0), 0, 0.1);
}

export function foreignExchangeWorldEvent(
  snapshot: GTELForeignExchangeSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'crisis') return null;
  return {
    id: `gtel_fx_crisis_${turn}`,
    turn,
    kind: 'trade',
    title: 'Trade-weighted FX stress',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'QLD'],
  };
}

export function foreignExchangeGiNotes(
  fx: GTELForeignExchangeSnapshot | null | undefined,
): string[] {
  if (!fx) return [];
  return [
    `FX pass-through: ${fx.band.replace(/_/g, ' ')} (index ${Math.round(fx.pressureIndex * 100) / 100}).`,
    fx.summary,
  ];
}
