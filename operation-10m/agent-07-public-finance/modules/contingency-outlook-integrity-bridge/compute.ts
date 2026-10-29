import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ContingencyDrawdownRegisterReport } from '../contingency-drawdown/types';
import type { ForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  ContingencyOutlookCheck,
  ContingencyOutlookIntegrityBridgeReport
} from './types';
import { CONTINGENCY_OUTLOOK_INTEGRITY_BRIDGE_SCHEMA } from './types';

const CONTINGENCY_OUTLOOK_TOLERANCE = 6.1;

export function buildContingencyOutlookIntegrityBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  contingencyDrawdown: ContingencyDrawdownRegisterReport,
  forwardIntegrity: ForwardEstimatesIntegrityReport,
  outlook: MediumTermFiscalOutlook
): ContingencyOutlookIntegrityBridgeReport {
  const flexGap = Math.abs(contingencyDrawdown.closingFlexPoints - outlook.averageHeadroom * 0.42);
  const revisionGap = Math.abs(forwardIntegrity.aggregateRevisionGap - flexGap * 0.38);
  const bridgeGapPoints = Math.round((flexGap + revisionGap) * 10) / 20;

  const checks: ContingencyOutlookCheck[] = [
    {
      id: 'COIB01',
      label: 'Contingency drawdown within cap',
      passed: contingencyDrawdown.withinDrawdownCap || v1012.pressure === 'critical',
      detail: `closing=${contingencyDrawdown.closingFlexPoints}, ratio=${contingencyDrawdown.drawdownToOpeningRatio}`
    },
    {
      id: 'COIB02',
      label: 'Forward estimates integrity passes',
      passed: forwardIntegrity.allPassed || v1012.pressure === 'critical',
      detail: `revision=${forwardIntegrity.aggregateRevisionGap}, drift=${forwardIntegrity.bandDriftPoints}`
    },
    {
      id: 'COIB03',
      label: 'Flex vs outlook headroom',
      passed:
        flexGap <= CONTINGENCY_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `flexGap=${flexGap}, avgHeadroom=${outlook.averageHeadroom}`
    }
  ];

  const withinContingencyOutlookBand =
    checks.every(c => c.passed) ||
    (contingencyDrawdown.withinDrawdownCap && forwardIntegrity.allPassed) ||
    forwardIntegrity.allPassed ||
    v1012.pressure === 'critical';

  const alignedWithForwardIntegrity =
    forwardIntegrity.coherentWithSupplementary &&
    (bridgeGapPoints <= forwardIntegrity.aggregateRevisionGap + 2.5 ||
      forwardIntegrity.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinContingencyOutlookBand) {
    warnings.push(`Contingency outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithForwardIntegrity) {
    warnings.push('Contingency outlook diverges from forward integrity.');
  }

  const narrative = withinContingencyOutlookBand
    ? `Contingency outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Contingency outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: CONTINGENCY_OUTLOOK_INTEGRITY_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinContingencyOutlookBand,
    alignedWithForwardIntegrity,
    narrative,
    warnings
  };
}
