import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalTransparencyIndex } from '../fiscal-transparency/types';
import type { ForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/types';
import type { RevenueIntegrityForwardBridgeReport } from '../revenue-integrity-forward-bridge/types';
import type { TransparencyForwardCheck, TransparencyForwardCoherenceReport } from './types';
import { TRANSPARENCY_FORWARD_COHERENCE_SCHEMA } from './types';

const COHERENCE_TOLERANCE = 6.2;

export function buildTransparencyForwardCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  transparency: FiscalTransparencyIndex,
  forwardIntegrity: ForwardEstimatesIntegrityReport,
  integrityBridge: RevenueIntegrityForwardBridgeReport
): TransparencyForwardCoherenceReport {
  const tierScore =
    transparency.compositeTier === 'leading' ? 3 : transparency.compositeTier === 'enhanced' ? 2 : 1;
  const forwardGap = Math.abs(forwardIntegrity.bandDriftPoints - transparency.compositeScore * 0.08);
  const bridgeGap = Math.abs(integrityBridge.bridgeGapPoints - forwardIntegrity.aggregateRevisionGap * 0.35);
  const aggregateCoherenceGapPoints =
    Math.round((forwardGap + bridgeGap + Math.max(0, 3 - tierScore)) * 10) / 30;

  const checks: TransparencyForwardCheck[] = [
    {
      id: 'TFC01',
      label: 'Transparency tier supports forward integrity',
      passed:
        transparency.compositeTier !== 'basic' ||
        forwardIntegrity.allPassed ||
        v1012.pressure === 'critical',
      observed: transparency.compositeScore,
      tolerance: 42
    },
    {
      id: 'TFC02',
      label: 'Forward drift vs transparency score',
      passed:
        forwardGap <= COHERENCE_TOLERANCE + 2 ||
        forwardIntegrity.coherentWithSupplementary ||
        v1012.pressure === 'critical',
      observed: forwardGap,
      tolerance: COHERENCE_TOLERANCE + 2
    },
    {
      id: 'TFC03',
      label: 'Integrity bridge vs revision gap',
      passed:
        bridgeGap <= COHERENCE_TOLERANCE + 1.5 ||
        integrityBridge.withinIntegrityForwardBand ||
        v1012.pressure === 'critical',
      observed: bridgeGap,
      tolerance: COHERENCE_TOLERANCE + 1.5
    }
  ];

  const withinTransparencyForwardBand =
    checks.every(c => c.passed) ||
    (transparency.openDataReady && forwardIntegrity.allPassed) ||
    v1012.pressure === 'critical';

  const alignedWithIntegrityBridge =
    integrityBridge.alignedWithRevenueAnchor &&
    (aggregateCoherenceGapPoints <= integrityBridge.bridgeGapPoints + 2.6 ||
      integrityBridge.withinIntegrityForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinTransparencyForwardBand) {
    warnings.push(`Transparency forward coherence gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithIntegrityBridge) {
    warnings.push('Transparency forward diverges from integrity bridge.');
  }

  const narrative = withinTransparencyForwardBand
    ? `Transparency forward coherence gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Transparency forward alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: TRANSPARENCY_FORWARD_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinTransparencyForwardBand,
    alignedWithIntegrityBridge,
    narrative,
    warnings
  };
}
