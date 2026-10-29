import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/types';
import type { MediumTermRevenueAnchorReport } from '../medium-term-revenue-anchor/types';
import type { RevenueIntegrityForwardBridgeReport } from '../revenue-integrity-forward-bridge/types';
import type {
  AnchorIntegrityCheck,
  MediumTermAnchorIntegrityCoherenceReport
} from './types';
import { MEDIUM_TERM_ANCHOR_INTEGRITY_COHERENCE_SCHEMA } from './types';

const ANCHOR_INTEGRITY_TOLERANCE = 5.7;

export function buildMediumTermAnchorIntegrityCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  revenueAnchor: MediumTermRevenueAnchorReport,
  forwardIntegrity: ForwardEstimatesIntegrityReport,
  integrityForward: RevenueIntegrityForwardBridgeReport
): MediumTermAnchorIntegrityCoherenceReport {
  const revisionGap = Math.abs(forwardIntegrity.aggregateRevisionGap - revenueAnchor.anchorDriftPoints * 0.36);
  const bridgeGap = Math.abs(integrityForward.bridgeGapPoints - revisionGap * 0.51);
  const aggregateCoherenceGapPoints = Math.round((revisionGap + bridgeGap) * 10) / 20;

  const checks: AnchorIntegrityCheck[] = [
    {
      id: 'MTAIC01',
      label: 'Revenue anchor within band',
      passed: revenueAnchor.withinAnchorBand || v1012.pressure === 'critical',
      detail: `drift=${revenueAnchor.anchorDriftPoints}, checks=${revenueAnchor.checks.filter(c => c.passed).length}/${revenueAnchor.checks.length}`
    },
    {
      id: 'MTAIC02',
      label: 'Forward estimates integrity holds',
      passed:
        forwardIntegrity.allPassed ||
        revisionGap <= ANCHOR_INTEGRITY_TOLERANCE + 2 ||
        v1012.pressure === 'critical',
      detail: `revision=${forwardIntegrity.aggregateRevisionGap}, drift=${revenueAnchor.anchorDriftPoints}`
    },
    {
      id: 'MTAIC03',
      label: 'Revision gap vs integrity forward bridge',
      passed:
        bridgeGap <= ANCHOR_INTEGRITY_TOLERANCE + 1.6 ||
        integrityForward.withinIntegrityForwardBand ||
        v1012.pressure === 'critical',
      detail: `bridge=${integrityForward.bridgeGapPoints}, revisionGap=${revisionGap}`
    }
  ];

  const withinAnchorIntegrityBand =
    checks.every(c => c.passed) ||
    (revenueAnchor.withinAnchorBand && forwardIntegrity.allPassed) ||
    v1012.pressure === 'critical';

  const alignedWithIntegrityForwardBridge =
    integrityForward.alignedWithRevenueAnchor &&
    (aggregateCoherenceGapPoints <= integrityForward.bridgeGapPoints + 2.3 ||
      integrityForward.withinIntegrityForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinAnchorIntegrityBand) {
    warnings.push(`Medium-term anchor integrity gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithIntegrityForwardBridge) {
    warnings.push('Anchor integrity diverges from forward bridge.');
  }

  const narrative = withinAnchorIntegrityBand
    ? `Medium-term anchor integrity gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Medium-term anchor integrity alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: MEDIUM_TERM_ANCHOR_INTEGRITY_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinAnchorIntegrityBand,
    alignedWithIntegrityForwardBridge,
    narrative,
    warnings
  };
}
