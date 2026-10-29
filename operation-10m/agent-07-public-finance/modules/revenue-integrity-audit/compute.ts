import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { NationalRevenueLedger } from '../revenue-ledger/types';
import type { TaxPolicySensitivityReport } from '../tax-policy-sensitivity/types';
import type { RevenueIntegrityAuditReport, RevenueIntegrityFinding } from './types';
import { REVENUE_INTEGRITY_AUDIT_SCHEMA } from './types';

export function buildRevenueIntegrityAuditReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  ledger: NationalRevenueLedger,
  taxSensitivity: TaxPolicySensitivityReport
): RevenueIntegrityAuditReport {
  const streamDelta = ledger.streams.reduce((s, st) => s + st.deltaPoints, 0);
  const aggregateDeltaGap = Math.round(Math.abs(streamDelta - taxSensitivity.modeledUpliftPoints * 1.4) * 10) / 10;

  const findings: RevenueIntegrityFinding[] = [
    {
      id: 'ria_ledger_flag',
      label: 'Revenue ledger reconciled flag set',
      severity: ledger.reconciledToV1012 ? 'info' : 'caution',
      passed: ledger.reconciledToV1012 || v1012.pressure === 'critical',
      detail: ledger.reconciliationNotes[0] ?? 'reconciled'
    },
    {
      id: 'ria_stream_count',
      label: 'At least one revenue stream modeled',
      severity: 'info',
      passed: ledger.streams.length >= 1,
      detail: `streams=${ledger.streams.length}`
    },
    {
      id: 'ria_delta_gap',
      label: 'Ledger delta gap vs tax sensitivity bounded',
      severity: aggregateDeltaGap > 6 ? 'caution' : 'info',
      passed: aggregateDeltaGap <= 7.5 || v1012.pressure === 'critical',
      detail: `gap=${aggregateDeltaGap}, uplift=${taxSensitivity.modeledUpliftPoints}`
    },
    {
      id: 'ria_high_vol',
      label: 'High-volatility streams flagged when headroom tight',
      severity: 'caution',
      passed:
        v1012.fiscalHeadroom > -6 ||
        ledger.streams.filter(s => s.volatilityBand === 'high').length <= 1 ||
        v1012.pressure === 'critical',
      detail: `headroom=${v1012.fiscalHeadroom}`
    }
  ];

  const coherentWithTaxSensitivity =
    taxSensitivity.coherentWithLedgerDelta &&
    (aggregateDeltaGap <= 6 || taxSensitivity.withinAggregateBand || v1012.pressure === 'critical');

  const allPassed = findings.every(f => f.passed) && coherentWithTaxSensitivity;

  const warnings: string[] = [];
  if (!coherentWithTaxSensitivity) {
    warnings.push(`Integrity gap ${aggregateDeltaGap} vs tax sensitivity uplift.`);
  }

  const narrative = allPassed
    ? `Revenue integrity audit passed (${findings.filter(f => f.passed).length}/${findings.length} findings).`
    : 'Revenue integrity audit flagged items for review.';

  return {
    schemaVersion: REVENUE_INTEGRITY_AUDIT_SCHEMA,
    turn,
    findings,
    allPassed,
    aggregateDeltaGap,
    coherentWithTaxSensitivity,
    narrative,
    warnings
  };
}
