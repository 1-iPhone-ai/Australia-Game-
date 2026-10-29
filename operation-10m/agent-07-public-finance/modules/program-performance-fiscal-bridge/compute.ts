import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalRulesFrameworkReport } from '../fiscal-rules/types';
import type { ProgramPerformanceReview } from '../program-performance/types';
import type { SpendingOffsetsReport } from '../spending-offsets/types';
import type { PerformanceFiscalCheck, ProgramPerformanceFiscalBridgeReport } from './types';
import { PROGRAM_PERFORMANCE_FISCAL_BRIDGE_SCHEMA } from './types';

const FEEDBACK_GAP_TOLERANCE = 5.5;

export function buildProgramPerformanceFiscalBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  programPerf: ProgramPerformanceReview,
  fiscalRules: FiscalRulesFrameworkReport,
  spendingOffsets: SpendingOffsetsReport
): ProgramPerformanceFiscalBridgeReport {
  const rulesStress = fiscalRules.breachCount * 1.8 + (fiscalRules.allCompliant ? 0 : 2.2);
  const feedbackToOffsetsGap = Math.abs(
    programPerf.aggregateFeedbackPoints - spendingOffsets.aggregateOffsets * 0.08
  );
  const bridgeFeedbackGapPoints =
    Math.round((feedbackToOffsetsGap + rulesStress + programPerf.programsAtRisk * 0.9) * 10) / 30;

  const checks: PerformanceFiscalCheck[] = [
    {
      id: 'PPFB01',
      label: 'Program feedback within fiscal tolerance',
      passed:
        programPerf.aggregateFeedbackPoints >= -8 ||
        programPerf.programsAtRisk <= 3 ||
        v1012.pressure === 'critical',
      detail: `feedback=${programPerf.aggregateFeedbackPoints}, atRisk=${programPerf.programsAtRisk}`
    },
    {
      id: 'PPFB02',
      label: 'Fiscal rules vs program at-risk count',
      passed:
        fiscalRules.allCompliant ||
        programPerf.programsAtRisk <= fiscalRules.breachCount + 2 ||
        v1012.pressure === 'critical',
      detail: `breaches=${fiscalRules.breachCount}, atRisk=${programPerf.programsAtRisk}`
    },
    {
      id: 'PPFB03',
      label: 'Feedback gap vs spending offsets',
      passed:
        feedbackToOffsetsGap <= FEEDBACK_GAP_TOLERANCE + 2 ||
        spendingOffsets.withinPortfolioTarget ||
        v1012.pressure === 'critical',
      detail: `gap=${feedbackToOffsetsGap}, offsets=${spendingOffsets.aggregateOffsets}`
    }
  ];

  const withinPerformanceFiscalBand =
    checks.every(c => c.passed) ||
    (programPerf.aggregateFeedbackPoints >= -5 && fiscalRules.allCompliant) ||
    v1012.pressure === 'critical';

  const alignedWithSpendingOffsets =
    spendingOffsets.withinPortfolioTarget &&
    (bridgeFeedbackGapPoints <= spendingOffsets.portfolioCoverageRatio + 1.5 ||
      feedbackToOffsetsGap <= FEEDBACK_GAP_TOLERANCE ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinPerformanceFiscalBand) {
    warnings.push(`Program performance fiscal bridge gap ${bridgeFeedbackGapPoints}.`);
  }
  if (!alignedWithSpendingOffsets) {
    warnings.push('Program performance bridge diverges from spending offsets.');
  }

  const narrative = withinPerformanceFiscalBand
    ? `Program performance fiscal bridge gap ${bridgeFeedbackGapPoints} within tolerance.`
    : `Program performance fiscal alert: gap ${bridgeFeedbackGapPoints}.`;

  return {
    schemaVersion: PROGRAM_PERFORMANCE_FISCAL_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeFeedbackGapPoints,
    withinPerformanceFiscalBand,
    alignedWithSpendingOffsets,
    narrative,
    warnings
  };
}
