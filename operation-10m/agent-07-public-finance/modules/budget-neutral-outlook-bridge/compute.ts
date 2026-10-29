import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { BudgetNeutralForwardCoherenceReport } from '../budget-neutral-forward-coherence/types';
import type { BudgetNeutralPackagesReport } from '../budget-neutral-packages/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { BudgetNeutralOutlookBridgeReport, BudgetNeutralOutlookCheck } from './types';
import { BUDGET_NEUTRAL_OUTLOOK_BRIDGE_SCHEMA } from './types';

const NEUTRAL_OUTLOOK_TOLERANCE = 6.3;

export function buildBudgetNeutralOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  neutralPackages: BudgetNeutralPackagesReport,
  neutralForward: BudgetNeutralForwardCoherenceReport,
  outlook: MediumTermFiscalOutlook
): BudgetNeutralOutlookBridgeReport {
  const netGap = Math.abs(neutralPackages.aggregateNetPoints - outlook.averageHeadroom * 0.12);
  const forwardGap = Math.abs(neutralForward.aggregateNeutralGapPoints - netGap * 0.44);
  const bridgeGapPoints = Math.round((netGap + forwardGap) * 10) / 20;

  const checks: BudgetNeutralOutlookCheck[] = [
    {
      id: 'BNOB01',
      label: 'Budget-neutral packages within portfolio neutrality',
      passed: neutralPackages.withinPortfolioNeutrality || v1012.pressure === 'critical',
      detail: `net=${neutralPackages.aggregateNetPoints}, offsets=${neutralPackages.aggregateOffsets}`
    },
    {
      id: 'BNOB02',
      label: 'Neutral forward coherence within band',
      passed: neutralForward.withinNeutralForwardBand || v1012.pressure === 'critical',
      detail: `gap=${neutralForward.aggregateNeutralGapPoints}, checks=${neutralForward.checks.filter(c => c.passed).length}/${neutralForward.checks.length}`
    },
    {
      id: 'BNOB03',
      label: 'Net spending vs outlook headroom',
      passed:
        netGap <= NEUTRAL_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `netGap=${netGap}, headroom=${outlook.averageHeadroom}`
    }
  ];

  const withinBudgetNeutralOutlookBand =
    checks.every(c => c.passed) ||
    (neutralPackages.withinPortfolioNeutrality && neutralForward.withinNeutralForwardBand) ||
    neutralForward.withinNeutralForwardBand ||
    v1012.pressure === 'critical';

  const alignedWithNeutralForwardCoherence =
    neutralForward.alignedWithGrantForward &&
    (bridgeGapPoints <= neutralForward.aggregateNeutralGapPoints + 2.6 ||
      neutralForward.withinNeutralForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinBudgetNeutralOutlookBand) {
    warnings.push(`Budget neutral outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithNeutralForwardCoherence) {
    warnings.push('Budget neutral outlook diverges from forward coherence.');
  }

  const narrative = withinBudgetNeutralOutlookBand
    ? `Budget neutral outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Budget neutral outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: BUDGET_NEUTRAL_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinBudgetNeutralOutlookBand,
    alignedWithNeutralForwardCoherence,
    narrative,
    warnings
  };
}
