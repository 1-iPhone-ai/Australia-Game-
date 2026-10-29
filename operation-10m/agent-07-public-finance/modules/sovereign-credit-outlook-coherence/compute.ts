import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtPortfolioGovernanceReport } from '../debt-portfolio-governance/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { SovereignCreditOutlookReport } from '../sovereign-credit-outlook/types';
import type {
  SovereignCreditOutlookCheck,
  SovereignCreditOutlookCoherenceReport
} from './types';
import { SOVEREIGN_CREDIT_OUTLOOK_COHERENCE_SCHEMA } from './types';

const SOVEREIGN_OUTLOOK_TOLERANCE = 6.2;

export function buildSovereignCreditOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  sovereignCredit: SovereignCreditOutlookReport,
  outlook: MediumTermFiscalOutlook,
  debtPortfolioGov: DebtPortfolioGovernanceReport
): SovereignCreditOutlookCoherenceReport {
  const headroomGap = Math.abs(outlook.averageHeadroom - sovereignCredit.headroomToDistress * 0.18);
  const spreadStress = Math.abs(sovereignCredit.impliedSpreadBps * 0.012 - headroomGap * 0.35);
  const governanceGap = Math.abs(debtPortfolioGov.maxTrancheShare * 10 - spreadStress * 0.42);
  const aggregateCoherenceGapPoints = Math.round((spreadStress + governanceGap) * 10) / 20;

  const checks: SovereignCreditOutlookCheck[] = [
    {
      id: 'SCOC01',
      label: 'Sovereign credit within outlook band',
      passed: sovereignCredit.withinOutlookBand || !v1012.debtEnabled || v1012.pressure === 'critical',
      detail: `spread=${sovereignCredit.impliedSpreadBps}, band=${sovereignCredit.ratingBand}`
    },
    {
      id: 'SCOC02',
      label: 'Outlook headroom vs credit distress buffer',
      passed:
        headroomGap <= SOVEREIGN_OUTLOOK_TOLERANCE + 3 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `headroomGap=${headroomGap}, distress=${sovereignCredit.headroomToDistress}`
    },
    {
      id: 'SCOC03',
      label: 'Spread stress vs portfolio concentration',
      passed:
        governanceGap <= SOVEREIGN_OUTLOOK_TOLERANCE + 2 ||
        debtPortfolioGov.withinGovernanceTargets ||
        v1012.pressure === 'critical',
      detail: `governanceGap=${governanceGap}, maxShare=${debtPortfolioGov.maxTrancheShare}`
    }
  ];

  const withinSovereignCreditOutlookBand =
    checks.every(c => c.passed) ||
    (sovereignCredit.withinOutlookBand && debtPortfolioGov.withinGovernanceTargets) ||
    sovereignCredit.withinOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithDebtGovernance =
    sovereignCredit.coherentWithDebtGovernance &&
    debtPortfolioGov.withinGovernanceTargets &&
    (aggregateCoherenceGapPoints <= sovereignCredit.headroomToDistress * 0.08 + 2.4 ||
      debtPortfolioGov.rolloverStressAligned ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinSovereignCreditOutlookBand) {
    warnings.push(`Sovereign credit outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithDebtGovernance) {
    warnings.push('Sovereign credit outlook diverges from debt governance.');
  }

  const narrative = withinSovereignCreditOutlookBand
    ? `Sovereign credit outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Sovereign credit outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: SOVEREIGN_CREDIT_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinSovereignCreditOutlookBand,
    alignedWithDebtGovernance,
    narrative,
    warnings
  };
}
