import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalTransparencyIndex } from '../fiscal-transparency/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { TransparencyForwardCoherenceReport } from '../transparency-forward-coherence/types';
import type { TransparencyOutlookBridgeReport, TransparencyOutlookCheck } from './types';
import { TRANSPARENCY_OUTLOOK_BRIDGE_SCHEMA } from './types';

const TRANSPARENCY_OUTLOOK_TOLERANCE = 6.1;

export function buildTransparencyOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  transparency: FiscalTransparencyIndex,
  transparencyForward: TransparencyForwardCoherenceReport,
  outlook: MediumTermFiscalOutlook
): TransparencyOutlookBridgeReport {
  const scoreGap = Math.abs(transparency.compositeScore - outlook.averageHeadroom * 1.4);
  const forwardGap = Math.abs(transparencyForward.aggregateCoherenceGapPoints - scoreGap * 0.09);
  const bridgeGapPoints = Math.round((scoreGap + forwardGap) * 10) / 20;

  const checks: TransparencyOutlookCheck[] = [
    {
      id: 'TOB01',
      label: 'Transparency composite at enhanced tier or above',
      passed:
        transparency.compositeTier !== 'basic' ||
        transparency.openDataReady ||
        v1012.pressure === 'critical',
      detail: `score=${transparency.compositeScore}, tier=${transparency.compositeTier}`
    },
    {
      id: 'TOB02',
      label: 'Transparency forward coherence within band',
      passed: transparencyForward.withinTransparencyForwardBand || v1012.pressure === 'critical',
      detail: `gap=${transparencyForward.aggregateCoherenceGapPoints}, checks=${transparencyForward.checks.filter(c => c.passed).length}/${transparencyForward.checks.length}`
    },
    {
      id: 'TOB03',
      label: 'Composite score vs outlook headroom',
      passed:
        scoreGap <= TRANSPARENCY_OUTLOOK_TOLERANCE * 4 + 8 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `scoreGap=${scoreGap}, headroom=${outlook.averageHeadroom}`
    }
  ];

  const withinTransparencyOutlookBand =
    checks.every(c => c.passed) ||
    (transparency.compositeTier !== 'basic' && transparencyForward.withinTransparencyForwardBand) ||
    transparencyForward.withinTransparencyForwardBand ||
    v1012.pressure === 'critical';

  const alignedWithTransparencyForward =
    transparencyForward.alignedWithIntegrityBridge &&
    (bridgeGapPoints <= transparencyForward.aggregateCoherenceGapPoints + 2.5 ||
      transparencyForward.withinTransparencyForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinTransparencyOutlookBand) {
    warnings.push(`Transparency outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithTransparencyForward) {
    warnings.push('Transparency outlook diverges from forward coherence.');
  }

  const narrative = withinTransparencyOutlookBand
    ? `Transparency outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Transparency outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: TRANSPARENCY_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinTransparencyOutlookBand,
    alignedWithTransparencyForward,
    narrative,
    warnings
  };
}
