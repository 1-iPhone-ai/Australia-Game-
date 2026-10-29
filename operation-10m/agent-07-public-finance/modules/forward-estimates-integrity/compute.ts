import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { MultiYearExpenditureFramework } from '../multi-year-framework/types';
import type { SupplementaryEstimatesReport } from '../supplementary-estimates/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { ForwardEstimatesIntegrityReport, ForwardIntegrityCheck } from './types';
import { FORWARD_ESTIMATES_INTEGRITY_SCHEMA } from './types';

export function buildForwardEstimatesIntegrityReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  myefo: MultiYearExpenditureFramework,
  supplementary: SupplementaryEstimatesReport,
  outlook: MediumTermFiscalOutlook
): ForwardEstimatesIntegrityReport {
  const checks: ForwardIntegrityCheck[] = [];

  const bandDriftPoints =
    Math.round(
      myefo.forwardBands.reduce(
        (s, b) => s + Math.max(0, b.recurringLoad + b.capitalPipeline - b.envelopeCapacity * 0.94),
        0
      ) * 10
    ) / 10;

  const aggregateRevisionGap =
    Math.round(Math.abs(supplementary.netRevisionPoints - bandDriftPoints * 0.4) * 10) / 10;

  checks.push({
    id: 'FEI01',
    label: 'Forward bands remain within ceiling under non-critical pressure',
    passed: myefo.forwardBands.every(b => b.withinCeiling) || v1012.pressure === 'critical',
    detail: `bands=${myefo.forwardBands.length}, binding=${myefo.aggregateCeilingBinding}`
  });

  checks.push({
    id: 'FEI02',
    label: 'Outlook worst pressure not below MYEFO baseline without override',
    passed:
      outlook.worstPressure !== 'critical' ||
      v1012.pressure === 'critical' ||
      myefo.forwardBands.some(b => !b.withinCeiling),
    detail: `worst=${outlook.worstPressure}, now=${v1012.pressure}`
  });

  checks.push({
    id: 'FEI03',
    label: 'Supplementary revision gap bounded',
    passed: aggregateRevisionGap <= 5.5 || supplementary.netRevisionPoints <= 0 || v1012.pressure === 'critical',
    detail: `gap=${aggregateRevisionGap}, netRev=${supplementary.netRevisionPoints}`
  });

  checks.push({
    id: 'FEI04',
    label: 'Band drift points bounded',
    passed: bandDriftPoints <= 8 || v1012.pressure === 'critical',
    detail: `drift=${bandDriftPoints}`
  });

  const coherentWithSupplementary =
    aggregateRevisionGap <= 4.2 ||
    supplementary.withinRevisionTolerance ||
    v1012.pressure === 'critical';

  const allPassed = checks.every(c => c.passed) && coherentWithSupplementary;

  const warnings: string[] = [];
  if (!coherentWithSupplementary) {
    warnings.push(`Revision gap ${aggregateRevisionGap} diverges from forward band drift ${bandDriftPoints}.`);
  }
  if (!allPassed) {
    warnings.push('Forward estimates integrity check failures present.');
  }

  const narrative = allPassed
    ? `Forward estimates integrity OK: drift ${bandDriftPoints}, revision gap ${aggregateRevisionGap}.`
    : `Forward estimates integrity review required (gap ${aggregateRevisionGap}).`;

  return {
    schemaVersion: FORWARD_ESTIMATES_INTEGRITY_SCHEMA,
    turn,
    checks,
    allPassed,
    aggregateRevisionGap,
    bandDriftPoints,
    coherentWithSupplementary,
    narrative,
    warnings
  };
}
