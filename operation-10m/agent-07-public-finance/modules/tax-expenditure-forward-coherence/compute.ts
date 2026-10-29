import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { RevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/types';
import type { RevenueIntegrityForwardBridgeReport } from '../revenue-integrity-forward-bridge/types';
import type { TaxExpenditureStatement } from '../tax-expenditure/types';
import type { TaxExpenditureForwardCheck, TaxExpenditureForwardCoherenceReport } from './types';
import { TAX_EXPENDITURE_FORWARD_COHERENCE_SCHEMA } from './types';

const FORWARD_TOLERANCE = 5.4;

export function buildTaxExpenditureForwardCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  taxExp: TaxExpenditureStatement,
  revenueForward: RevenueForwardReconciliationReport,
  integrityForward: RevenueIntegrityForwardBridgeReport
): TaxExpenditureForwardCoherenceReport {
  const capacityGap = Math.abs(taxExp.netStructuralCapacity - taxExp.grossStructuralCapacity + taxExp.totalForgone);
  const forwardGap = Math.abs(revenueForward.aggregateGapPoints - taxExp.totalForgone * 0.14);
  const integrityGap = Math.abs(integrityForward.bridgeGapPoints - forwardGap * 0.42);
  const aggregateCoherenceGapPoints = Math.round((capacityGap + forwardGap + integrityGap) * 10) / 30;

  const checks: TaxExpenditureForwardCheck[] = [
    {
      id: 'TEFC01',
      label: 'Tax expenditure net within gross capacity',
      passed:
        taxExp.netStructuralCapacity <= taxExp.grossStructuralCapacity ||
        v1012.pressure === 'critical',
      detail: `net=${taxExp.netStructuralCapacity}, gross=${taxExp.grossStructuralCapacity}`
    },
    {
      id: 'TEFC02',
      label: 'Revenue forward reconciles tax forgone',
      passed:
        revenueForward.allPassed ||
        forwardGap <= FORWARD_TOLERANCE + 2 ||
        v1012.pressure === 'critical',
      detail: `forgone=${taxExp.totalForgone}, forwardGap=${revenueForward.aggregateGapPoints}`
    },
    {
      id: 'TEFC03',
      label: 'Forward gap vs integrity bridge',
      passed:
        integrityGap <= FORWARD_TOLERANCE + 1.5 ||
        integrityForward.withinIntegrityForwardBand ||
        v1012.pressure === 'critical',
      detail: `integrity=${integrityForward.bridgeGapPoints}, forward=${revenueForward.aggregateGapPoints}`
    }
  ];

  const withinTaxExpenditureForwardBand =
    checks.every(c => c.passed) ||
    (taxExp.netStructuralCapacity <= taxExp.grossStructuralCapacity && revenueForward.allPassed) ||
    v1012.pressure === 'critical';

  const alignedWithIntegrityForwardBridge =
    integrityForward.alignedWithRevenueAnchor &&
    (aggregateCoherenceGapPoints <= integrityForward.bridgeGapPoints + 2.2 ||
      integrityForward.withinIntegrityForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinTaxExpenditureForwardBand) {
    warnings.push(`Tax expenditure forward gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithIntegrityForwardBridge) {
    warnings.push('Tax expenditure forward diverges from integrity bridge.');
  }

  const narrative = withinTaxExpenditureForwardBand
    ? `Tax expenditure forward gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Tax expenditure forward alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: TAX_EXPENDITURE_FORWARD_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinTaxExpenditureForwardBand,
    alignedWithIntegrityForwardBridge,
    narrative,
    warnings
  };
}
