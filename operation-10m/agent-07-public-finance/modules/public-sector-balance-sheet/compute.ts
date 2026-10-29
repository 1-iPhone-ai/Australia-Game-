import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { BalanceSheetLine, PublicSectorBalanceSheetReport } from './types';
import { PUBLIC_SECTOR_BALANCE_SHEET_SCHEMA } from './types';

const NET_WORTH_RATIO_FLOOR = 0.18;

export function buildPublicSectorBalanceSheetReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  opts?: { cashClosingBalance?: number }
): PublicSectorBalanceSheetReport {
  const financialAssets =
    Math.round((42 + v1012.revenueCapacity * 0.35 + Math.max(0, v1012.fiscalHeadroom) * 0.8) * 10) / 10;
  const nonFinancial =
    Math.round((88 + v1012.debtLevel * 0.45 + v1012.maintenanceLoad * 1.2) * 10) / 10;
  const grossDebt = v1012.debtEnabled
    ? Math.round((v1012.debtLevel * 1.05 + v1012.debtServiceLoad * 0.9) * 10) / 10
    : Math.round(v1012.debtLevel * 0.2 * 10) / 10;
  const otherLiabilities = Math.round((18 + v1012.commitmentCount * 1.4 + v1012.maintenanceLoad * 0.35) * 10) / 10;

  const totalAssetsPoints = Math.round((financialAssets + nonFinancial) * 10) / 10;
  const totalLiabilitiesPoints = Math.round((grossDebt + otherLiabilities) * 10) / 10;
  const netWorthPoints = Math.round((totalAssetsPoints - totalLiabilitiesPoints) * 10) / 10;
  const netWorthRatio =
    totalAssetsPoints <= 0 ? 0 : Math.round((netWorthPoints / totalAssetsPoints) * 1000) / 1000;

  const liquidAssetSlice = Math.round((financialAssets * 0.22 + (opts?.cashClosingBalance ?? 0) * 0.15) * 10) / 10;
  const cashRef = opts?.cashClosingBalance ?? 12 + v1012.fiscalHeadroom * 0.3;
  const liquidSliceCoherentWithCash =
    liquidAssetSlice >= cashRef * 0.35 ||
    v1012.pressure === 'critical' ||
    !v1012.debtEnabled;

  const withinNetWorthFloor =
    netWorthRatio >= NET_WORTH_RATIO_FLOOR ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && netWorthRatio >= NET_WORTH_RATIO_FLOOR * 0.88);

  const mkLine = (
    id: string,
    category: BalanceSheetLine['category'],
    label: string,
    points: number,
    total: number
  ): BalanceSheetLine => ({
    id,
    category,
    label,
    points,
    shareOfTotal: total <= 0 ? 0 : Math.round((points / total) * 1000) / 1000
  });

  const lines: BalanceSheetLine[] = [
    mkLine('bs_fin', 'financial_asset', 'Financial assets', financialAssets, totalAssetsPoints),
    mkLine('bs_nfa', 'non_financial_asset', 'Non-financial assets', nonFinancial, totalAssetsPoints),
    mkLine('bs_debt', 'liability', 'Interest-bearing liabilities', grossDebt, totalLiabilitiesPoints),
    mkLine('bs_other', 'liability', 'Other liabilities', otherLiabilities, totalLiabilitiesPoints),
    mkLine('bs_nw', 'net_worth', 'Net worth', netWorthPoints, totalAssetsPoints)
  ];

  const warnings: string[] = [];
  if (!withinNetWorthFloor) {
    warnings.push(`Net worth ratio ${netWorthRatio} below floor ${NET_WORTH_RATIO_FLOOR}.`);
  }
  if (!liquidSliceCoherentWithCash) {
    warnings.push(`Liquid slice ${liquidAssetSlice} misaligned with cash closing ${cashRef}.`);
  }

  const narrative = withinNetWorthFloor
    ? `Public sector net worth ${netWorthPoints} (${(netWorthRatio * 100).toFixed(1)}% of assets).`
    : `Balance sheet alert: net worth ratio ${netWorthRatio}, liabilities ${totalLiabilitiesPoints}.`;

  return {
    schemaVersion: PUBLIC_SECTOR_BALANCE_SHEET_SCHEMA,
    turn,
    lines,
    totalAssetsPoints,
    totalLiabilitiesPoints,
    netWorthPoints,
    netWorthRatio,
    liquidAssetSlice,
    withinNetWorthFloor,
    liquidSliceCoherentWithCash,
    narrative,
    warnings
  };
}
