import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { RevenueIntegrityAuditReport } from '../revenue-integrity-audit/types';
import type { TaxPolicySensitivityReport } from '../tax-policy-sensitivity/types';
import type {
  TaxSensitivityIntegrityCheck,
  TaxSensitivityIntegrityCoherenceReport
} from './types';
import { TAX_SENSITIVITY_INTEGRITY_COHERENCE_SCHEMA } from './types';

const SENSITIVITY_TOLERANCE = 5.5;

export function buildTaxSensitivityIntegrityCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  taxSensitivity: TaxPolicySensitivityReport,
  integrityAudit: RevenueIntegrityAuditReport
): TaxSensitivityIntegrityCoherenceReport {
  const upliftGap = Math.abs(taxSensitivity.modeledUpliftPoints - integrityAudit.aggregateDeltaGap * 0.28);
  const marginalGap = Math.abs(
    taxSensitivity.aggregateMarginalPoints - integrityAudit.aggregateDeltaGap * 0.52
  );
  const aggregateCoherenceGapPoints = Math.round((upliftGap + marginalGap) * 10) / 20;

  const checks: TaxSensitivityIntegrityCheck[] = [
    {
      id: 'TSIC01',
      label: 'Tax sensitivity within aggregate band',
      passed: taxSensitivity.withinAggregateBand || v1012.pressure === 'critical',
      detail: `uplift=${taxSensitivity.modeledUpliftPoints}, marginal=${taxSensitivity.aggregateMarginalPoints}`
    },
    {
      id: 'TSIC02',
      label: 'Revenue integrity audit passes',
      passed: integrityAudit.allPassed || v1012.pressure === 'critical',
      detail: `deltaGap=${integrityAudit.aggregateDeltaGap}, findings=${integrityAudit.findings.length}`
    },
    {
      id: 'TSIC03',
      label: 'Sensitivity uplift vs audit delta gap',
      passed:
        upliftGap <= SENSITIVITY_TOLERANCE + 2 ||
        taxSensitivity.coherentWithLedgerDelta ||
        v1012.pressure === 'critical',
      detail: `upliftGap=${upliftGap}, auditGap=${integrityAudit.aggregateDeltaGap}`
    }
  ];

  const withinTaxSensitivityIntegrityBand =
    checks.every(c => c.passed) ||
    (taxSensitivity.withinAggregateBand && integrityAudit.allPassed) ||
    v1012.pressure === 'critical';

  const alignedWithIntegrityAudit =
    integrityAudit.coherentWithTaxSensitivity &&
    (aggregateCoherenceGapPoints <= integrityAudit.aggregateDeltaGap + 2.2 ||
      integrityAudit.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinTaxSensitivityIntegrityBand) {
    warnings.push(`Tax sensitivity integrity gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithIntegrityAudit) {
    warnings.push('Tax sensitivity diverges from integrity audit.');
  }

  const narrative = withinTaxSensitivityIntegrityBand
    ? `Tax sensitivity integrity gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Tax sensitivity integrity alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: TAX_SENSITIVITY_INTEGRITY_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinTaxSensitivityIntegrityBand,
    alignedWithIntegrityAudit,
    narrative,
    warnings
  };
}
