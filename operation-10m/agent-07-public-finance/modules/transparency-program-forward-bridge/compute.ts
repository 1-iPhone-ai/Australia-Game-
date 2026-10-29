import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalTransparencyIndex } from '../fiscal-transparency/types';
import type { ProgramPerformanceReview } from '../program-performance/types';
import type { TransparencyForwardCoherenceReport } from '../transparency-forward-coherence/types';
import type {
  TransparencyProgramCheck,
  TransparencyProgramForwardBridgeReport
} from './types';
import { TRANSPARENCY_PROGRAM_FORWARD_BRIDGE_SCHEMA } from './types';

const PROGRAM_FORWARD_TOLERANCE = 6.6;

export function buildTransparencyProgramForwardBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  transparency: FiscalTransparencyIndex,
  programReview: ProgramPerformanceReview,
  transparencyForward: TransparencyForwardCoherenceReport
): TransparencyProgramForwardBridgeReport {
  const feedbackGap = Math.abs(
    programReview.aggregateFeedbackPoints - transparency.compositeScore * 0.11
  );
  const forwardGap = Math.abs(
    transparencyForward.aggregateCoherenceGapPoints - feedbackGap * 0.47
  );
  const bridgeGapPoints = Math.round((feedbackGap + forwardGap) * 10) / 20;

  const checks: TransparencyProgramCheck[] = [
    {
      id: 'TPFB01',
      label: 'Transparency composite supports program review',
      passed:
        transparency.compositeTier !== 'basic' ||
        programReview.programsAtRisk <= 2 ||
        v1012.pressure === 'critical',
      observed: transparency.compositeScore,
      tolerance: 40
    },
    {
      id: 'TPFB02',
      label: 'Program feedback within fiscal tolerance',
      passed:
        programReview.aggregateFeedbackPoints >= -8 ||
        programReview.programsAtRisk === 0 ||
        v1012.pressure === 'critical',
      observed: programReview.aggregateFeedbackPoints,
      tolerance: -8
    },
    {
      id: 'TPFB03',
      label: 'Feedback gap vs transparency forward',
      passed:
        forwardGap <= PROGRAM_FORWARD_TOLERANCE + 2 ||
        transparencyForward.withinTransparencyForwardBand ||
        v1012.pressure === 'critical',
      observed: forwardGap,
      tolerance: PROGRAM_FORWARD_TOLERANCE + 2
    }
  ];

  const withinTransparencyProgramBand =
    checks.every(c => c.passed) ||
    (transparency.compositeTier !== 'basic' && transparencyForward.withinTransparencyForwardBand) ||
    v1012.pressure === 'critical';

  const alignedWithForwardCoherence =
    transparencyForward.alignedWithIntegrityBridge &&
    (bridgeGapPoints <= transparencyForward.aggregateCoherenceGapPoints + 2.3 ||
      transparencyForward.withinTransparencyForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinTransparencyProgramBand) {
    warnings.push(`Transparency program forward bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithForwardCoherence) {
    warnings.push('Transparency program bridge diverges from forward coherence.');
  }

  const narrative = withinTransparencyProgramBand
    ? `Transparency program forward bridge gap ${bridgeGapPoints} within tolerance.`
    : `Transparency program forward alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: TRANSPARENCY_PROGRAM_FORWARD_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinTransparencyProgramBand,
    alignedWithForwardCoherence,
    narrative,
    warnings
  };
}
