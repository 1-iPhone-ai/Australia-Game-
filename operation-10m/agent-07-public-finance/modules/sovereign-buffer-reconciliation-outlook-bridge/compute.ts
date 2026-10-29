import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalBufferReconciliationOutlookBridgeReport } from '../fiscal-buffer-reconciliation-outlook-bridge/types';
import type { SovereignGrantOutlookCoherenceReport } from '../sovereign-grant-outlook-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  SovereignBufferReconciliationOutlookBridgeReport,
  SovereignBufferReconciliationOutlookCheck
} from './types';
import { SOVEREIGN_BUFFER_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA } from './types';

const SOVEREIGN_BUFFER_RECONCILIATION_TOLERANCE = 7.2;

export function buildSovereignBufferReconciliationOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  fiscalBufferReconciliation: FiscalBufferReconciliationOutlookBridgeReport,
  sovereignGrant: SovereignGrantOutlookCoherenceReport,
  outlook: MediumTermFiscalOutlook
): SovereignBufferReconciliationOutlookBridgeReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const bufferGap = Math.abs(fiscalBufferReconciliation.bridgeGapPoints - outlookHeadroom * 0.12);
  const sovereignGap = Math.abs(sovereignGrant.aggregateCoherenceGapPoints - bufferGap * 0.43);
  const bridgeGapPoints = Math.round((bufferGap + sovereignGap) * 10) / 20;

  const checks: SovereignBufferReconciliationOutlookCheck[] = [
    {
      id: 'SBROB01',
      label: 'Fiscal buffer reconciliation outlook bridge within band',
      passed:
        fiscalBufferReconciliation.withinFiscalBufferReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      observed: fiscalBufferReconciliation.bridgeGapPoints,
      tolerance: 7.9
    },
    {
      id: 'SBROB02',
      label: 'Sovereign grant outlook coherence within band',
      passed: sovereignGrant.withinSovereignGrantOutlookBand || v1012.pressure === 'critical',
      observed: sovereignGrant.aggregateCoherenceGapPoints,
      tolerance: 8.5
    },
    {
      id: 'SBROB03',
      label: 'Buffer gap vs sovereign grant outlook',
      passed:
        sovereignGap <= SOVEREIGN_BUFFER_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: sovereignGap,
      tolerance: SOVEREIGN_BUFFER_RECONCILIATION_TOLERANCE + 2
    }
  ];

  const withinSovereignBufferReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (fiscalBufferReconciliation.withinFiscalBufferReconciliationOutlookBand &&
      sovereignGrant.withinSovereignGrantOutlookBand) ||
    sovereignGrant.withinSovereignGrantOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithFiscalBufferReconciliationBridge =
    fiscalBufferReconciliation.alignedWithGrantReconciliationBridge &&
    sovereignGrant.alignedWithGrantReconciliationOutlook &&
    (bridgeGapPoints <= fiscalBufferReconciliation.bridgeGapPoints + 2.7 ||
      fiscalBufferReconciliation.withinFiscalBufferReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinSovereignBufferReconciliationOutlookBand) {
    warnings.push(`Sovereign–buffer reconciliation outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithFiscalBufferReconciliationBridge) {
    warnings.push('Sovereign buffer reconciliation outlook diverges from fiscal buffer reconciliation bridge.');
  }

  const narrative = withinSovereignBufferReconciliationOutlookBand
    ? `Sovereign–buffer reconciliation outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Sovereign–buffer reconciliation outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: SOVEREIGN_BUFFER_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinSovereignBufferReconciliationOutlookBand,
    alignedWithFiscalBufferReconciliationBridge,
    narrative,
    warnings
  };
}
