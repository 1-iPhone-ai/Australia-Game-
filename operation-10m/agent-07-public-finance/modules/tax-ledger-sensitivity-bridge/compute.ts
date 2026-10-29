import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { NationalRevenueLedger } from '../revenue-ledger/types';
import type { TaxExpenditureStatement } from '../tax-expenditure/types';
import type { TaxPolicySensitivityReport } from '../tax-policy-sensitivity/types';
import type { TaxLedgerCheck, TaxLedgerSensitivityBridgeReport } from './types';
import { TAX_LEDGER_SENSITIVITY_BRIDGE_SCHEMA } from './types';

const TAX_LEDGER_TOLERANCE = 6.5;

export function buildTaxLedgerSensitivityBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  taxExp: TaxExpenditureStatement,
  ledger: NationalRevenueLedger,
  taxSensitivity: TaxPolicySensitivityReport
): TaxLedgerSensitivityBridgeReport {
  const forgoneGap = Math.abs(taxExp.totalForgone - ledger.structuralCapacity * 0.06);
  const sensitivityGap = Math.abs(taxSensitivity.aggregateMarginalPoints - forgoneGap * 0.44);
  const bridgeGapPoints = Math.round((forgoneGap + sensitivityGap) * 10) / 20;

  const checks: TaxLedgerCheck[] = [
    {
      id: 'TLSB01',
      label: 'Tax expenditure net within gross capacity',
      passed:
        taxExp.netStructuralCapacity <= taxExp.grossStructuralCapacity ||
        v1012.pressure === 'critical',
      observed: taxExp.totalForgone,
      tolerance: taxExp.grossStructuralCapacity
    },
    {
      id: 'TLSB02',
      label: 'Ledger reconciled to structural capacity',
      passed: ledger.reconciledToV1012 || v1012.pressure === 'critical',
      observed: ledger.currentCapacity,
      tolerance: ledger.structuralCapacity + 2
    },
    {
      id: 'TLSB03',
      label: 'Forgone vs tax sensitivity marginal',
      passed:
        sensitivityGap <= TAX_LEDGER_TOLERANCE + 2 ||
        taxSensitivity.withinAggregateBand ||
        v1012.pressure === 'critical',
      observed: sensitivityGap,
      tolerance: TAX_LEDGER_TOLERANCE + 2
    }
  ];

  const withinTaxLedgerBand =
    checks.every(c => c.passed) ||
    (taxExp.netStructuralCapacity <= taxExp.grossStructuralCapacity && ledger.reconciledToV1012) ||
    v1012.pressure === 'critical';

  const alignedWithTaxSensitivity =
    taxSensitivity.coherentWithLedgerDelta &&
    (bridgeGapPoints <= taxSensitivity.modeledUpliftPoints + 2.4 ||
      taxSensitivity.withinAggregateBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinTaxLedgerBand) {
    warnings.push(`Tax ledger sensitivity bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithTaxSensitivity) {
    warnings.push('Tax ledger bridge diverges from sensitivity model.');
  }

  const narrative = withinTaxLedgerBand
    ? `Tax ledger sensitivity bridge gap ${bridgeGapPoints} within tolerance.`
    : `Tax ledger sensitivity alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: TAX_LEDGER_SENSITIVITY_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinTaxLedgerBand,
    alignedWithTaxSensitivity,
    narrative,
    warnings
  };
}
