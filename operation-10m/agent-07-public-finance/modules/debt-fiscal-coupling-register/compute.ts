import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtServiceCoverageReport } from '../debt-service-coverage/types';
import type { FiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/types';
import type { SovereignCreditOutlookReport } from '../sovereign-credit-outlook/types';
import type { DebtFiscalCouplingCheck, DebtFiscalCouplingRegisterReport } from './types';
import { DEBT_FISCAL_COUPLING_REGISTER_SCHEMA } from './types';

const COUPLING_TOLERANCE = 6.4;

export function buildDebtFiscalCouplingRegisterReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  debtServiceCoverage: DebtServiceCoverageReport,
  sovereignCreditOutlook: SovereignCreditOutlookReport,
  fiscalBuffer: FiscalBufferCoherenceReport
): DebtFiscalCouplingRegisterReport {
  const coverageStress =
    debtServiceCoverage.coverageBand === 'breach' || debtServiceCoverage.coverageBand === 'thin'
      ? 1.35
      : 1;
  const creditStress =
    sovereignCreditOutlook.ratingBand === 'distress' || sovereignCreditOutlook.ratingBand === 'pressure'
      ? 1.28
      : 1;
  const serviceGap = Math.max(0, 1.15 - debtServiceCoverage.coverageRatio) * 10 * coverageStress;
  const spreadGap = Math.max(0, sovereignCreditOutlook.impliedSpreadBps - 120) / 18;
  const bufferGap = Math.max(0, fiscalBuffer.aggregateBufferPoints * 0.08 - v1012.fiscalHeadroom);

  const checks: DebtFiscalCouplingCheck[] = [
    {
      id: 'DFC01',
      label: 'Debt service coverage vs credit outlook',
      passed:
        debtServiceCoverage.withinCoverageFloor ||
        sovereignCreditOutlook.withinOutlookBand ||
        !v1012.debtEnabled ||
        v1012.pressure === 'critical',
      observed: serviceGap + spreadGap,
      tolerance: COUPLING_TOLERANCE + 2
    },
    {
      id: 'DFC02',
      label: 'Credit headroom supports buffer coherence',
      passed:
        sovereignCreditOutlook.headroomToDistress >= 2 ||
        fiscalBuffer.allPassed ||
        v1012.pressure === 'critical',
      observed: sovereignCreditOutlook.headroomToDistress,
      tolerance: 2
    },
    {
      id: 'DFC03',
      label: 'Combined coupling stress within band',
      passed:
        serviceGap + spreadGap + bufferGap <= COUPLING_TOLERANCE * creditStress ||
        v1012.pressure === 'critical',
      observed: serviceGap + spreadGap + bufferGap,
      tolerance: COUPLING_TOLERANCE * creditStress
    }
  ];

  const couplingStressPoints =
    Math.round((serviceGap + spreadGap + bufferGap) * 10) / 30;

  const withinCouplingBand =
    checks.every(c => c.passed) ||
    (debtServiceCoverage.withinCoverageFloor && sovereignCreditOutlook.coherentWithDebtGovernance) ||
    v1012.pressure === 'critical';

  const alignedWithFiscalBuffer =
    fiscalBuffer.alignedWithRevenueForward &&
    (couplingStressPoints <= fiscalBuffer.aggregateBufferPoints * 0.22 + 2.5 ||
      fiscalBuffer.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinCouplingBand) {
    warnings.push(`Debt–fiscal coupling stress ${couplingStressPoints} outside band.`);
  }
  if (!alignedWithFiscalBuffer) {
    warnings.push('Debt–fiscal coupling diverges from fiscal buffer coherence.');
  }

  const narrative = withinCouplingBand
    ? `Debt–fiscal coupling stress ${couplingStressPoints} within tolerance.`
    : `Debt–fiscal coupling alert: stress ${couplingStressPoints}.`;

  return {
    schemaVersion: DEBT_FISCAL_COUPLING_REGISTER_SCHEMA,
    turn,
    checks,
    couplingStressPoints,
    withinCouplingBand,
    alignedWithFiscalBuffer,
    narrative,
    warnings
  };
}
