import type {
  GTELExportInsuranceStackSnapshot,
  GTELPersisted,
  GTELTradeBalanceSnapshot,
  GTELTradeBalanceStabilizationSnapshot,
  GTELTradeFxHedgingSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTermsOfTradeSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeBalanceStabilizationBand = GTELTradeBalanceStabilizationSnapshot['band'];

function stabilizationBand(index: number): GTELTradeBalanceStabilizationBand {
  if (index >= 0.72) return 'anchored';
  if (index >= 0.52) return 'steady';
  if (index >= 0.34) return 'volatile';
  return 'unstable';
}

export function sanitizeTradeBalanceStabilizationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.2, 0.9);
}

export function createEmptyTradeBalanceStabilizationSnapshot(): GTELTradeBalanceStabilizationSnapshot {
  return {
    index: 0.52,
    band: 'steady',
    surplusSupport: 0.08,
    volatilityDampening: 0.12,
    summary: 'Trade balance adjustments are proceeding at a steady pace.',
  };
}

export function advanceTradeBalanceStabilizationSmoothing(
  persisted: GTELPersisted,
  rawIndex: number,
): GTELPersisted {
  const prev = sanitizeTradeBalanceStabilizationSmoothing(persisted.tradeBalanceStabilizationSmoothing);
  const next = gtelClamp(prev * 0.73 + gtelClamp(rawIndex, 0.2, 0.9) * 0.27, 0.2, 0.9);
  return { ...persisted, tradeBalanceStabilizationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeBalanceStabilizationSnapshot(input: {
  tradeBalance: GTELTradeBalanceSnapshot;
  termsOfTrade: GTELTermsOfTradeSnapshot;
  tradeFxHedging: GTELTradeFxHedgingSnapshot;
  exportInsuranceStack: GTELExportInsuranceStackSnapshot;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeBalanceStabilizationSnapshot; persisted: GTELPersisted } {
  const surplusLift =
    input.tradeBalance.currentAccountTone === 'surplus' || input.tradeBalance.currentAccountTone === 'mild_surplus'
      ? 0.16
      : input.tradeBalance.currentAccountTone === 'deficit'
        ? -0.1
        : 0.04;
  const termsLift =
    input.termsOfTrade.band === 'favorable'
      ? 0.1
      : input.termsOfTrade.band === 'severely_unfavorable'
        ? -0.08
        : 0;
  const hedgingLift = gtelClamp((input.tradeFxHedging.effectiveness - 0.5) * 0.2, -0.06, 0.1);
  const insuranceLift =
    input.exportInsuranceStack.band === 'robust'
      ? 0.08
      : input.exportInsuranceStack.band === 'impaired'
        ? -0.1
        : 0.02;
  const reconciliationLift =
    input.tradeReconciliation.band === 'settled'
      ? 0.08
      : input.tradeReconciliation.band === 'substantive'
        ? 0.05
        : 0;
  const rawIndex = gtelClamp(
    0.46 + surplusLift + termsLift + hedgingLift + insuranceLift + reconciliationLift,
    0.2,
    0.9,
  );
  const persisted = advanceTradeBalanceStabilizationSmoothing(input.persisted, rawIndex);
  const index = sanitizeTradeBalanceStabilizationSmoothing(persisted.tradeBalanceStabilizationSmoothing);
  const band = stabilizationBand(index);
  const surplusSupport = gtelClamp(
    (input.tradeBalance.netExportPulse > 0.08 ? 0.1 : 0.04) + surplusLift * 0.5,
    0.02,
    0.18,
  );
  const volatilityDampening = gtelClamp(
    index * 0.15 + input.tradeFxHedging.passThroughBuffer * 0.35 + reconciliationLift,
    0.04,
    0.28,
  );

  const summary =
    band === 'anchored'
      ? 'Trade balance stabilizers are anchoring the current account despite external shocks.'
      : band === 'unstable'
        ? 'Trade balance swings are outpacing hedging and reconciliation buffers.'
        : band === 'volatile'
          ? 'External terms and finance stress are making trade balance outcomes harder to predict.'
          : 'Trade balance adjustments are proceeding at a steady pace.';

  return {
    snapshot: {
      index: Math.round(index * 1000) / 1000,
      band,
      surplusSupport: Math.round(surplusSupport * 1000) / 1000,
      volatilityDampening: Math.round(volatilityDampening * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeBalanceStabilizationExportScale(snapshot: GTELTradeBalanceStabilizationSnapshot): number {
  if (snapshot.band === 'anchored') return gtelClamp(1 + snapshot.surplusSupport * 0.15, 1, 1.04);
  if (snapshot.band === 'unstable') return gtelClamp(0.88 + snapshot.index * 0.08, 0.84, 0.92);
  if (snapshot.band === 'volatile') return gtelClamp(0.92 + snapshot.index * 0.06, 0.88, 0.96);
  return gtelClamp(0.97 + snapshot.index * 0.03, 0.94, 1.02);
}

export function tradeBalanceStabilizationDomesticStress(snapshot: GTELTradeBalanceStabilizationSnapshot): number {
  if (snapshot.band === 'unstable') return gtelClamp((0.5 - snapshot.index) * 0.12, 0.03, 0.08);
  if (snapshot.band === 'volatile') return gtelClamp((0.48 - snapshot.index) * 0.08, 0, 0.05);
  return 0;
}

export function tradeBalanceStabilizationWorldEvent(
  snapshot: GTELTradeBalanceStabilizationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'volatile' && snapshot.band !== 'unstable') return null;
  if (snapshot.index > 0.42) return null;
  return {
    id: `gtel_balance_stab_${turn}`,
    turn,
    kind: 'trade',
    title: 'Trade balance volatility',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'WA'],
  };
}

export function tradeBalanceStabilizationGiNotes(
  stabilization: GTELTradeBalanceStabilizationSnapshot | null | undefined,
): string[] {
  if (!stabilization) return [];
  return [
    `Trade balance stabilization: ${stabilization.band} (${Math.round(stabilization.index * 100)}% index).`,
    stabilization.summary,
  ];
}
