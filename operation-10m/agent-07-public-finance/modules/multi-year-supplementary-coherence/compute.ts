import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/types';
import type { MultiYearExpenditureFramework } from '../multi-year-framework/types';
import type { SupplementaryEstimatesReport } from '../supplementary-estimates/types';
import type {
  MultiYearSupplementaryCoherenceReport,
  MyefoSupplementaryCheck
} from './types';
import { MULTI_YEAR_SUPPLEMENTARY_COHERENCE_SCHEMA } from './types';

const MYEFO_SUPP_TOLERANCE = 5.9;

export function buildMultiYearSupplementaryCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  myefo: MultiYearExpenditureFramework,
  supplementary: SupplementaryEstimatesReport,
  forwardIntegrity: ForwardEstimatesIntegrityReport
): MultiYearSupplementaryCoherenceReport {
  const ceilingGap = Math.abs(
    (myefo.forwardBands[0]?.envelopeCapacity ?? 0) - Math.abs(supplementary.netRevisionPoints) * 0.42
  );
  const revisionGap = Math.abs(forwardIntegrity.aggregateRevisionGap - Math.abs(supplementary.netRevisionPoints));
  const aggregateCoherenceGapPoints = Math.round((ceilingGap + revisionGap) * 10) / 20;

  const checks: MyefoSupplementaryCheck[] = [
    {
      id: 'MYSC01',
      label: 'MYEFO forward bands within ceiling',
      passed:
        !myefo.aggregateCeilingBinding ||
        myefo.forwardBands.every(b => b.withinCeiling) ||
        v1012.pressure === 'critical',
      detail: `growth=${myefo.parameterSettingsGrowth}, binding=${myefo.aggregateCeilingBinding}`
    },
    {
      id: 'MYSC02',
      label: 'Supplementary within revision tolerance',
      passed: supplementary.withinRevisionTolerance || v1012.pressure === 'critical',
      detail: `net=${supplementary.netRevisionPoints}, up=${supplementary.aggregateUpwardRevision}`
    },
    {
      id: 'MYSC03',
      label: 'Supplementary net vs forward integrity',
      passed:
        revisionGap <= MYEFO_SUPP_TOLERANCE + 2 ||
        forwardIntegrity.allPassed ||
        v1012.pressure === 'critical',
      detail: `revisionGap=${forwardIntegrity.aggregateRevisionGap}, net=${supplementary.netRevisionPoints}`
    }
  ];

  const withinMyefoSupplementaryBand =
    checks.every(c => c.passed) ||
    (supplementary.withinRevisionTolerance && forwardIntegrity.allPassed) ||
    v1012.pressure === 'critical';

  const alignedWithForwardIntegrity =
    forwardIntegrity.coherentWithSupplementary &&
    (aggregateCoherenceGapPoints <= forwardIntegrity.aggregateRevisionGap + 2.2 ||
      forwardIntegrity.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinMyefoSupplementaryBand) {
    warnings.push(`Multi-year supplementary gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithForwardIntegrity) {
    warnings.push('MYEFO supplementary diverges from forward integrity.');
  }

  const narrative = withinMyefoSupplementaryBand
    ? `Multi-year supplementary gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Multi-year supplementary alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: MULTI_YEAR_SUPPLEMENTARY_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinMyefoSupplementaryBand,
    alignedWithForwardIntegrity,
    narrative,
    warnings
  };
}
