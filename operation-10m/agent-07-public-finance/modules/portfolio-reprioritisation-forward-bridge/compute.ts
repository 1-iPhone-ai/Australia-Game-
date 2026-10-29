import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { PortfolioOutturnReport } from '../portfolio-outturn/types';
import type { PortfolioReprioritisationLedgerReport } from '../portfolio-reprioritisation-ledger/types';
import type { RevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/types';
import type {
  PortfolioReprioritisationForwardBridgeReport,
  RepriorForwardCheck
} from './types';
import { PORTFOLIO_REPRIORITISATION_FORWARD_BRIDGE_SCHEMA } from './types';

const REPRIOR_FORWARD_TOLERANCE = 6.5;

export function buildPortfolioReprioritisationForwardBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  repriorLedger: PortfolioReprioritisationLedgerReport,
  revenueForward: RevenueForwardReconciliationReport,
  portfolioOutturn: PortfolioOutturnReport
): PortfolioReprioritisationForwardBridgeReport {
  const shiftGap = Math.abs(repriorLedger.aggregateRealizedPoints - portfolioOutturn.aggregateVariancePoints * 0.38);
  const forwardGap = Math.abs(revenueForward.aggregateGapPoints - shiftGap * 0.41);
  const bridgeGapPoints = Math.round((shiftGap + forwardGap) * 10) / 20;

  const checks: RepriorForwardCheck[] = [
    {
      id: 'PRFB01',
      label: 'Reprioritisation within portfolio envelope',
      passed: repriorLedger.withinPortfolioEnvelope || v1012.pressure === 'critical',
      observed: repriorLedger.aggregateRealizedPoints,
      tolerance: repriorLedger.aggregatePlannedPoints + 3
    },
    {
      id: 'PRFB02',
      label: 'Revenue forward reconciliation passes',
      passed: revenueForward.allPassed || v1012.pressure === 'critical',
      observed: revenueForward.aggregateGapPoints,
      tolerance: 8
    },
    {
      id: 'PRFB03',
      label: 'Realized shift vs forward gap',
      passed:
        forwardGap <= REPRIOR_FORWARD_TOLERANCE + 2 ||
        revenueForward.allPassed ||
        v1012.pressure === 'critical',
      observed: forwardGap,
      tolerance: REPRIOR_FORWARD_TOLERANCE + 2
    }
  ];

  const withinRepriorForwardBand =
    checks.every(c => c.passed) ||
    (repriorLedger.withinPortfolioEnvelope && revenueForward.allPassed) ||
    revenueForward.allPassed ||
    v1012.pressure === 'critical';

  const alignedWithPortfolioOutturn =
    portfolioOutturn.withinReconciliationTolerance &&
    (bridgeGapPoints <= Math.abs(portfolioOutturn.aggregateVariancePoints) + 2.4 ||
      repriorLedger.alignedWithEfficiencyDividend ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinRepriorForwardBand) {
    warnings.push(`Portfolio reprior forward bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithPortfolioOutturn) {
    warnings.push('Portfolio reprior forward diverges from outturn reconciliation.');
  }

  const narrative = withinRepriorForwardBand
    ? `Portfolio reprior forward bridge gap ${bridgeGapPoints} within tolerance.`
    : `Portfolio reprior forward alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: PORTFOLIO_REPRIORITISATION_FORWARD_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinRepriorForwardBand,
    alignedWithPortfolioOutturn,
    narrative,
    warnings
  };
}
