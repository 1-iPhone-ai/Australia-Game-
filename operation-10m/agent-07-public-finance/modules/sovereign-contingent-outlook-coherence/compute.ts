import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { SovereignIssuanceOutlookCoherenceReport } from '../sovereign-issuance-outlook-coherence/types';
import type { ContingentBufferOutlookCoherenceReport } from '../contingent-buffer-outlook-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  SovereignContingentOutlookCheck,
  SovereignContingentOutlookCoherenceReport
} from './types';
import { SOVEREIGN_CONTINGENT_OUTLOOK_COHERENCE_SCHEMA } from './types';

const SOVEREIGN_CONTINGENT_TOLERANCE = 6.9;

export function buildSovereignContingentOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  sovereignOutlook: SovereignIssuanceOutlookCoherenceReport,
  contingentBuffer: ContingentBufferOutlookCoherenceReport,
  outlook: MediumTermFiscalOutlook
): SovereignContingentOutlookCoherenceReport {
  const sovereignGap = Math.abs(
    sovereignOutlook.aggregateCoherenceGapPoints - outlook.averageHeadroom * 0.15
  );
  const contingentGap = Math.abs(contingentBuffer.aggregateCoherenceGapPoints - sovereignGap * 0.37);
  const aggregateCoherenceGapPoints = Math.round((sovereignGap + contingentGap) * 10) / 20;

  const checks: SovereignContingentOutlookCheck[] = [
    {
      id: 'SCOC01',
      label: 'Sovereign issuance outlook coherence within band',
      passed: sovereignOutlook.withinIssuanceOutlookBand || v1012.pressure === 'critical',
      detail: `gap=${sovereignOutlook.aggregateCoherenceGapPoints}, checks=${sovereignOutlook.checks.filter(c => c.passed).length}/${sovereignOutlook.checks.length}`
    },
    {
      id: 'SCOC02',
      label: 'Contingent buffer outlook coherence within band',
      passed: contingentBuffer.withinContingentBufferOutlookBand || v1012.pressure === 'critical',
      detail: `gap=${contingentBuffer.aggregateCoherenceGapPoints}, checks=${contingentBuffer.checks.filter(c => c.passed).length}/${contingentBuffer.checks.length}`
    },
    {
      id: 'SCOC03',
      label: 'Sovereign gap vs contingent buffer outlook',
      passed:
        contingentGap <= SOVEREIGN_CONTINGENT_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `contingentGap=${contingentGap}, headroom=${outlook.averageHeadroom}`
    }
  ];

  const withinSovereignContingentOutlookBand =
    checks.every(c => c.passed) ||
    (sovereignOutlook.withinIssuanceOutlookBand && contingentBuffer.withinContingentBufferOutlookBand) ||
    contingentBuffer.withinContingentBufferOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithContingentBufferOutlook =
    contingentBuffer.alignedWithBufferOutlook &&
    sovereignOutlook.alignedWithIssuanceCoupling &&
    (aggregateCoherenceGapPoints <= contingentBuffer.aggregateCoherenceGapPoints + 2.4 ||
      contingentBuffer.withinContingentBufferOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinSovereignContingentOutlookBand) {
    warnings.push(`Sovereign–contingent outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithContingentBufferOutlook) {
    warnings.push('Sovereign contingent outlook diverges from contingent buffer outlook coherence.');
  }

  const narrative = withinSovereignContingentOutlookBand
    ? `Sovereign–contingent outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Sovereign–contingent outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: SOVEREIGN_CONTINGENT_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinSovereignContingentOutlookBand,
    alignedWithContingentBufferOutlook,
    narrative,
    warnings
  };
}
