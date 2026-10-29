import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ContingentExposureLine, ContingentLiabilityAssessment } from './types';
import { CONTINGENT_LIABILITIES_SCHEMA } from './types';

export const DEFAULT_CONTINGENT_EXPOSURES: Omit<ContingentExposureLine, 'id'>[] = [
  {
    kind: 'state_guarantee',
    label: 'State borrowing facility guarantees',
    notionalPoints: 22,
    probabilityWeight: 0.08,
    warnOnly: true
  },
  {
    kind: 'ppp_minimum_revenue',
    label: 'PPP availability payment floors',
    notionalPoints: 14,
    probabilityWeight: 0.12,
    warnOnly: true
  },
  {
    kind: 'disaster_reinsurance',
    label: 'National disaster reinsurance layer',
    notionalPoints: 18,
    probabilityWeight: 0.05,
    warnOnly: false
  },
  {
    kind: 'infrastructure_warranty',
    label: 'Megaproject delivery warranties',
    notionalPoints: 9,
    probabilityWeight: 0.15,
    warnOnly: true
  },
  {
    kind: 'financial_sector_backstop',
    label: 'Systemic backstop envelope (latent)',
    notionalPoints: 35,
    probabilityWeight: 0.02,
    warnOnly: true
  }
];

export function catalogContingentExposures(turn: number): ContingentExposureLine[] {
  return DEFAULT_CONTINGENT_EXPOSURES.map((row, idx) => ({
    id: `cl_${turn}_${idx}_${row.kind}`,
    ...row
  }));
}

export function assessContingentLiabilities(
  turn: number,
  v1012: V1012FiscalSnapshot,
  exposures: ContingentExposureLine[] = catalogContingentExposures(turn)
): ContingentLiabilityAssessment {
  const stressMultiplier =
    v1012.pressure === 'critical' ? 1.45 : v1012.pressure === 'strained' ? 1.2 : v1012.pressure === 'tight' ? 1.08 : 1;
  const expectedLossPoints = Math.round(
    exposures.reduce((s, e) => s + e.notionalPoints * e.probabilityWeight, 0) * stressMultiplier * 10
  ) / 10;
  const tailRiskPoints = Math.round(
    exposures.reduce((s, e) => s + e.notionalPoints * Math.min(0.35, e.probabilityWeight * 2.5), 0) * 10
  ) / 10;
  const totalNotional = exposures.reduce((s, e) => s + e.notionalPoints, 0);
  const offBalanceSheetShare =
    totalNotional > 0
      ? Math.round((tailRiskPoints / Math.max(v1012.debtLevel, 1)) * 100) / 100
      : 0;

  const softCap = 22 + Math.max(0, v1012.fiscalHeadroom * 0.5);
  const withinSoftCap = expectedLossPoints <= softCap;

  const warnings: string[] = [];
  const disclosures: string[] = [];

  if (!withinSoftCap) {
    warnings.push(`Expected contingent loss ${expectedLossPoints} exceeds soft cap ${softCap.toFixed(1)}.`);
  }
  if (offBalanceSheetShare > 1.2) {
    warnings.push('Off-balance-sheet tail risk elevated relative to recorded debt level.');
  }
  exposures.forEach(e => {
    disclosures.push(`${e.label}: notional ${e.notionalPoints} pts @ weight ${e.probabilityWeight}.`);
  });

  return {
    schemaVersion: CONTINGENT_LIABILITIES_SCHEMA,
    turn,
    exposures,
    expectedLossPoints,
    tailRiskPoints,
    offBalanceSheetShare,
    stressMultiplier,
    withinSoftCap,
    disclosures,
    warnings
  };
}
