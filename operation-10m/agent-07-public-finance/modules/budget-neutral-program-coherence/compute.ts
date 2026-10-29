import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { BudgetNeutralForwardCoherenceReport } from '../budget-neutral-forward-coherence/types';
import type { BudgetNeutralPackagesReport } from '../budget-neutral-packages/types';
import type { ProgramPerformanceFiscalBridgeReport } from '../program-performance-fiscal-bridge/types';
import type {
  BudgetNeutralProgramCoherenceReport,
  NeutralProgramCheck
} from './types';
import { BUDGET_NEUTRAL_PROGRAM_COHERENCE_SCHEMA } from './types';

const NEUTRAL_PROGRAM_TOLERANCE = 5.8;

export function buildBudgetNeutralProgramCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  neutralPackages: BudgetNeutralPackagesReport,
  neutralForward: BudgetNeutralForwardCoherenceReport,
  programBridge: ProgramPerformanceFiscalBridgeReport
): BudgetNeutralProgramCoherenceReport {
  const netGap = Math.abs(neutralPackages.aggregateNetPoints - programBridge.bridgeFeedbackGapPoints * 0.18);
  const forwardGap = Math.abs(neutralForward.aggregateNeutralGapPoints - netGap * 0.62);
  const aggregateCoherenceGapPoints = Math.round((netGap + forwardGap) * 10) / 20;

  const checks: NeutralProgramCheck[] = [
    {
      id: 'BNPC01',
      label: 'Budget neutral packages within portfolio',
      passed: neutralPackages.withinPortfolioNeutrality || v1012.pressure === 'critical',
      detail: `net=${neutralPackages.aggregateNetPoints}, new=${neutralPackages.aggregateNewSpending}`
    },
    {
      id: 'BNPC02',
      label: 'Neutral forward coherence within band',
      passed: neutralForward.withinNeutralForwardBand || v1012.pressure === 'critical',
      detail: `gap=${neutralForward.aggregateNeutralGapPoints}, checks=${neutralForward.checks.filter(c => c.passed).length}/${neutralForward.checks.length}`
    },
    {
      id: 'BNPC03',
      label: 'Net neutrality vs program fiscal bridge',
      passed:
        netGap <= NEUTRAL_PROGRAM_TOLERANCE + 2 ||
        programBridge.withinPerformanceFiscalBand ||
        v1012.pressure === 'critical',
      detail: `netGap=${netGap}, feedback=${programBridge.bridgeFeedbackGapPoints}`
    }
  ];

  const withinNeutralProgramBand =
    checks.every(c => c.passed) ||
    (neutralPackages.withinPortfolioNeutrality && neutralForward.withinNeutralForwardBand) ||
    v1012.pressure === 'critical';

  const alignedWithPerformanceFiscalBridge =
    programBridge.alignedWithSpendingOffsets &&
    (aggregateCoherenceGapPoints <= programBridge.bridgeFeedbackGapPoints + 2.2 ||
      programBridge.withinPerformanceFiscalBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinNeutralProgramBand) {
    warnings.push(`Budget neutral program gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithPerformanceFiscalBridge) {
    warnings.push('Neutral program coherence diverges from performance fiscal bridge.');
  }

  const narrative = withinNeutralProgramBand
    ? `Budget neutral program gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Budget neutral program alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: BUDGET_NEUTRAL_PROGRAM_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinNeutralProgramBand,
    alignedWithPerformanceFiscalBridge,
    narrative,
    warnings
  };
}
