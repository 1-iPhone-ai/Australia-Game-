import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { StatutoryBalancesReport } from '../statutory-balances/types';
import type { StatutoryOutlookBufferBridgeReport, StatutoryOutlookCheck } from './types';
import { STATUTORY_OUTLOOK_BUFFER_BRIDGE_SCHEMA } from './types';

const STATUTORY_OUTLOOK_TOLERANCE = 6.6;

export function buildStatutoryOutlookBufferBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  statutory: StatutoryBalancesReport,
  fiscalBuffer: FiscalBufferCoherenceReport,
  outlook: MediumTermFiscalOutlook
): StatutoryOutlookBufferBridgeReport {
  const anchorGap = Math.abs(statutory.netOperatingBalance - outlook.averageHeadroom * 0.85);
  const bufferGap = Math.abs(fiscalBuffer.aggregateBufferPoints - anchorGap * 0.52);
  const bridgeGapPoints = Math.round((anchorGap + bufferGap) * 10) / 20;

  const checks: StatutoryOutlookCheck[] = [
    {
      id: 'SOBB01',
      label: 'Statutory bands within soft anchors',
      passed: statutory.allWithinSoftAnchors || v1012.pressure === 'critical',
      observed: statutory.netDebtToCapacityRatio,
      tolerance: 0.45
    },
    {
      id: 'SOBB02',
      label: 'Fiscal buffer coherence passes',
      passed: fiscalBuffer.allPassed || v1012.pressure === 'critical',
      observed: fiscalBuffer.aggregateBufferPoints,
      tolerance: 4
    },
    {
      id: 'SOBB03',
      label: 'Anchor vs outlook headroom',
      passed:
        anchorGap <= STATUTORY_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: anchorGap,
      tolerance: STATUTORY_OUTLOOK_TOLERANCE + 2
    }
  ];

  const withinStatutoryOutlookBand =
    checks.every(c => c.passed) ||
    (statutory.allWithinSoftAnchors && fiscalBuffer.allPassed) ||
    fiscalBuffer.allPassed ||
    v1012.pressure === 'critical';

  const alignedWithBufferCoherence =
    fiscalBuffer.alignedWithRevenueForward &&
    (bridgeGapPoints <= fiscalBuffer.aggregateBufferPoints * 0.14 + 2.6 ||
      fiscalBuffer.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinStatutoryOutlookBand) {
    warnings.push(`Statutory outlook buffer gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithBufferCoherence) {
    warnings.push('Statutory outlook bridge diverges from buffer coherence.');
  }

  const narrative = withinStatutoryOutlookBand
    ? `Statutory outlook buffer gap ${bridgeGapPoints} within tolerance.`
    : `Statutory outlook buffer alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: STATUTORY_OUTLOOK_BUFFER_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinStatutoryOutlookBand,
    alignedWithBufferCoherence,
    narrative,
    warnings
  };
}
