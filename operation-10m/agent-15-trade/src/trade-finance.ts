import type {
  GTELLogisticsStress,
  GTELPersisted,
  GTELTradeBalanceSnapshot,
  GTELTradeComplianceRecord,
  GTELTradeFinanceSnapshot,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeFinanceBand = GTELTradeFinanceSnapshot['band'];

function financeBand(score: number): GTELTradeFinanceBand {
  if (score >= 0.72) return 'fluid';
  if (score >= 0.52) return 'watch';
  if (score >= 0.32) return 'tight';
  return 'frozen';
}

export function sanitizeTradeFinanceSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.62), 0.12, 0.98);
}

export function createEmptyTradeFinanceSnapshot(): GTELTradeFinanceSnapshot {
  return {
    availabilityScore: 0.62,
    band: 'watch',
    financingPremium: 0.08,
    exportCreditCeiling: 100,
    summary: 'Export credit markets at baseline watch.',
  };
}

export function advanceTradeFinanceSmoothing(
  persisted: GTELPersisted,
  rawAvailability: number,
): GTELPersisted {
  const prev = sanitizeTradeFinanceSmoothing(persisted.tradeFinanceSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawAvailability, 0.08, 0.98) * 0.28, 0.12, 0.98);
  return {
    ...persisted,
    tradeFinanceSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeTradeFinanceSnapshot(input: {
  logistics: GTELLogisticsStress;
  tradeBalance: GTELTradeBalanceSnapshot;
  tradeCompliance: GTELTradeComplianceRecord;
  openDisputeCount: number;
  activeSanctionCount: number;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeFinanceSnapshot; persisted: GTELPersisted } {
  const logisticsPenalty =
    input.logistics.band === 'congested'
      ? 0.22
      : input.logistics.band === 'tight'
        ? 0.14
        : input.logistics.band === 'watch'
          ? 0.06
          : 0;
  const compliancePenalty =
    input.tradeCompliance.band === 'critical'
      ? 0.18
      : input.tradeCompliance.band === 'weak'
        ? 0.1
        : input.tradeCompliance.band === 'adequate'
          ? 0.04
          : 0;
  const disputePenalty = gtelClamp(input.openDisputeCount * 0.05, 0, 0.2);
  const sanctionPenalty = gtelClamp(input.activeSanctionCount * 0.06, 0, 0.24);
  const balanceLift =
    input.tradeBalance.currentAccountTone === 'surplus' || input.tradeBalance.currentAccountTone === 'mild_surplus'
      ? 0.08
      : input.tradeBalance.currentAccountTone === 'deficit'
        ? -0.1
        : 0;

  const rawAvailability = gtelClamp(
    0.68 - logisticsPenalty - compliancePenalty - disputePenalty - sanctionPenalty + balanceLift,
    0.1,
    0.95,
  );
  const persisted = advanceTradeFinanceSmoothing(input.persisted, rawAvailability);
  const availabilityScore = sanitizeTradeFinanceSmoothing(persisted.tradeFinanceSmoothing);
  const band = financeBand(availabilityScore);
  const financingPremium = gtelClamp(1 - availabilityScore + logisticsPenalty * 0.35, 0.04, 0.55);
  const exportCreditCeiling = Math.round((85 + availabilityScore * 35 - financingPremium * 12) * 10) / 10;

  const summary =
    band === 'fluid'
      ? 'Trade finance desks are open; export credit lines roll without friction.'
      : band === 'frozen'
        ? 'Export credit is largely frozen — insurers and banks are pulling exposure.'
        : band === 'tight'
          ? 'Letters of credit and export insurance carry tighter covenants.'
          : 'Export finance remains available but under heightened review.';

  return {
    snapshot: {
      availabilityScore: Math.round(availabilityScore * 1000) / 1000,
      band,
      financingPremium: Math.round(financingPremium * 1000) / 1000,
      exportCreditCeiling,
      summary,
    },
    persisted,
  };
}

/** Scale applied to effective export throughput after logistics. */
export function tradeFinanceExportScale(snapshot: GTELTradeFinanceSnapshot | null | undefined): number {
  if (!snapshot) return 1;
  return gtelClamp(0.78 + snapshot.availabilityScore * 0.28, 0.72, 1.08);
}

export function tradeFinanceDomesticStress(snapshot: GTELTradeFinanceSnapshot | null | undefined): number {
  if (!snapshot) return 0;
  return gtelClamp(snapshot.financingPremium * 0.22, 0, 0.12);
}

export function tradeFinanceGiNotes(finance: GTELTradeFinanceSnapshot | null | undefined): string[] {
  if (!finance) return [];
  return [
    `Export finance: ${finance.band.replace(/_/g, ' ')} (availability ${Math.round(finance.availabilityScore * 100)}%).`,
    finance.summary,
  ];
}
