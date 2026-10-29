import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { SovereignFiscalReconciliationOutlookCoherenceReport } from '../sovereign-fiscal-reconciliation-outlook-coherence/types';
import type { SovereignBufferReconciliationOutlookBridgeReport } from '../sovereign-buffer-reconciliation-outlook-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  BufferSovereignReconciliationOutlookBridgeReport,
  BufferSovereignReconciliationOutlookCheck
} from './types';
import { BUFFER_SOVEREIGN_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA } from './types';

const BUFFER_SOVEREIGN_RECONCILIATION_TOLERANCE = 7.8;

export function buildBufferSovereignReconciliationOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  sovereignFiscalReconciliation: SovereignFiscalReconciliationOutlookCoherenceReport,
  sovereignBufferReconciliation: SovereignBufferReconciliationOutlookBridgeReport,
  outlook: MediumTermFiscalOutlook
): BufferSovereignReconciliationOutlookBridgeReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const fiscalGap = Math.abs(
    sovereignFiscalReconciliation.aggregateCoherenceGapPoints - outlookHeadroom * 0.17
  );
  const bufferGap = Math.abs(sovereignBufferReconciliation.bridgeGapPoints - fiscalGap * 0.45);
  const bridgeGapPoints = Math.round((fiscalGap + bufferGap) * 10) / 20;

  const checks: BufferSovereignReconciliationOutlookCheck[] = [
    {
      id: 'BSROB01',
      label: 'Sovereign–fiscal reconciliation outlook coherence within band',
      passed:
        sovereignFiscalReconciliation.withinSovereignFiscalReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      observed: sovereignFiscalReconciliation.aggregateCoherenceGapPoints,
      tolerance: 8.2
    },
    {
      id: 'BSROB02',
      label: 'Sovereign–buffer reconciliation outlook bridge within band',
      passed:
        sovereignBufferReconciliation.withinSovereignBufferReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      observed: sovereignBufferReconciliation.bridgeGapPoints,
      tolerance: 8.8
    },
    {
      id: 'BSROB03',
      label: 'Fiscal gap vs sovereign buffer reconciliation outlook',
      passed:
        bufferGap <= BUFFER_SOVEREIGN_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: bufferGap,
      tolerance: BUFFER_SOVEREIGN_RECONCILIATION_TOLERANCE + 2
    }
  ];

  const withinBufferSovereignReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (sovereignFiscalReconciliation.withinSovereignFiscalReconciliationOutlookBand &&
      sovereignBufferReconciliation.withinSovereignBufferReconciliationOutlookBand) ||
    sovereignBufferReconciliation.withinSovereignBufferReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithSovereignFiscalReconciliationCoherence =
    sovereignFiscalReconciliation.alignedWithFiscalGrantReconciliationBridge &&
    sovereignBufferReconciliation.alignedWithFiscalBufferReconciliationBridge &&
    (bridgeGapPoints <= sovereignFiscalReconciliation.aggregateCoherenceGapPoints + 2.8 ||
      sovereignFiscalReconciliation.withinSovereignFiscalReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinBufferSovereignReconciliationOutlookBand) {
    warnings.push(`Buffer–sovereign reconciliation outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithSovereignFiscalReconciliationCoherence) {
    warnings.push('Buffer sovereign reconciliation outlook diverges from sovereign fiscal coherence.');
  }

  const narrative = withinBufferSovereignReconciliationOutlookBand
    ? `Buffer–sovereign reconciliation outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Buffer–sovereign reconciliation outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: BUFFER_SOVEREIGN_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinBufferSovereignReconciliationOutlookBand,
    alignedWithSovereignFiscalReconciliationCoherence,
    narrative,
    warnings
  };
}
