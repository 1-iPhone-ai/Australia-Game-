import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { PortfolioOutturnReport } from '../portfolio-outturn/types';
import type { PortfolioReprioritisationLedgerReport } from '../portfolio-reprioritisation-ledger/types';
import type {
  OutturnRepriorCheck,
  PortfolioOutturnReprioritisationBridgeReport
} from './types';
import { PORTFOLIO_OUTTURN_REPRIORITISATION_BRIDGE_SCHEMA } from './types';

const OUTTURN_TOLERANCE = 6.7;

export function buildPortfolioOutturnReprioritisationBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  portfolioOutturn: PortfolioOutturnReport,
  repriorLedger: PortfolioReprioritisationLedgerReport
): PortfolioOutturnReprioritisationBridgeReport {
  const varianceToShift = Math.abs(
    portfolioOutturn.aggregateVariancePoints - repriorLedger.aggregateRealizedPoints * 0.31
  );
  const planGap = Math.abs(
    repriorLedger.aggregatePlannedPoints - Math.abs(portfolioOutturn.aggregateVarianceRatio) * 8
  );
  const bridgeGapPoints = Math.round((varianceToShift + planGap) * 10) / 20;

  const checks: OutturnRepriorCheck[] = [
    {
      id: 'PORB01',
      label: 'Portfolio outturn within reconciliation tolerance',
      passed: portfolioOutturn.withinReconciliationTolerance || v1012.pressure === 'critical',
      observed: Math.abs(portfolioOutturn.aggregateVariancePoints),
      tolerance: 14
    },
    {
      id: 'PORB02',
      label: 'Reprior ledger within portfolio envelope',
      passed: repriorLedger.withinPortfolioEnvelope || v1012.pressure === 'critical',
      observed: repriorLedger.aggregateRealizedPoints,
      tolerance: repriorLedger.aggregatePlannedPoints + 4
    },
    {
      id: 'PORB03',
      label: 'Outturn variance vs realized reprior shifts',
      passed:
        varianceToShift <= OUTTURN_TOLERANCE + 2 ||
        repriorLedger.alignedWithEfficiencyDividend ||
        v1012.pressure === 'critical',
      observed: varianceToShift,
      tolerance: OUTTURN_TOLERANCE + 2
    }
  ];

  const withinOutturnRepriorBand =
    checks.every(c => c.passed) ||
    (portfolioOutturn.withinReconciliationTolerance && repriorLedger.withinPortfolioEnvelope) ||
    v1012.pressure === 'critical';

  const alignedWithRepriorLedger =
    repriorLedger.alignedWithEfficiencyDividend &&
    (bridgeGapPoints <= Math.abs(portfolioOutturn.aggregateVarianceRatio) + 2.4 ||
      repriorLedger.withinPortfolioEnvelope ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinOutturnRepriorBand) {
    warnings.push(`Portfolio outturn reprior bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithRepriorLedger) {
    warnings.push('Outturn bridge diverges from reprior ledger.');
  }

  const narrative = withinOutturnRepriorBand
    ? `Portfolio outturn reprior bridge gap ${bridgeGapPoints} within tolerance.`
    : `Portfolio outturn reprior alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: PORTFOLIO_OUTTURN_REPRIORITISATION_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinOutturnRepriorBand,
    alignedWithRepriorLedger,
    narrative,
    warnings
  };
}
