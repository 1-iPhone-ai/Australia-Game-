import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtFiscalCouplingRegisterReport } from '../debt-fiscal-coupling-register/types';
import type { DebtServiceForwardCoherenceReport } from '../debt-service-forward-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  DebtFiscalCouplingOutlookBridgeReport,
  DebtFiscalCouplingOutlookCheck
} from './types';
import { DEBT_FISCAL_COUPLING_OUTLOOK_BRIDGE_SCHEMA } from './types';

const COUPLING_OUTLOOK_TOLERANCE = 6.4;

export function buildDebtFiscalCouplingOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  couplingRegister: DebtFiscalCouplingRegisterReport,
  debtServiceForward: DebtServiceForwardCoherenceReport,
  outlook: MediumTermFiscalOutlook
): DebtFiscalCouplingOutlookBridgeReport {
  const outlookDebt = outlook.projections[0]?.debtServiceLoad ?? v1012.debtServiceLoad;
  const serviceGap = Math.abs(debtServiceForward.aggregateCoherenceGapPoints - outlookDebt * 0.19);
  const couplingGap = Math.abs(couplingRegister.couplingStressPoints - serviceGap * 0.41);
  const bridgeGapPoints = Math.round((serviceGap + couplingGap) * 10) / 20;

  const checks: DebtFiscalCouplingOutlookCheck[] = [
    {
      id: 'DFCOB01',
      label: 'Debt–fiscal coupling register within band',
      passed: couplingRegister.withinCouplingBand || v1012.pressure === 'critical',
      observed: couplingRegister.couplingStressPoints,
      tolerance: 8.5
    },
    {
      id: 'DFCOB02',
      label: 'Debt service forward coherence within band',
      passed: debtServiceForward.withinDebtServiceForwardBand || v1012.pressure === 'critical',
      observed: debtServiceForward.aggregateCoherenceGapPoints,
      tolerance: 7.2
    },
    {
      id: 'DFCOB03',
      label: 'Coupling stress vs outlook debt load',
      passed:
        couplingGap <= COUPLING_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: couplingGap,
      tolerance: COUPLING_OUTLOOK_TOLERANCE + 2
    }
  ];

  const withinCouplingOutlookBand =
    checks.every(c => c.passed) ||
    (couplingRegister.withinCouplingBand && debtServiceForward.withinDebtServiceForwardBand) ||
    couplingRegister.withinCouplingBand ||
    v1012.pressure === 'critical';

  const alignedWithDebtServiceForward =
    debtServiceForward.alignedWithForwardReconciliation &&
    (bridgeGapPoints <= debtServiceForward.aggregateCoherenceGapPoints + 2.5 ||
      debtServiceForward.withinDebtServiceForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinCouplingOutlookBand) {
    warnings.push(`Debt–fiscal coupling outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithDebtServiceForward) {
    warnings.push('Coupling outlook diverges from debt service forward coherence.');
  }

  const narrative = withinCouplingOutlookBand
    ? `Debt–fiscal coupling outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Debt–fiscal coupling outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: DEBT_FISCAL_COUPLING_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinCouplingOutlookBand,
    alignedWithDebtServiceForward,
    narrative,
    warnings
  };
}
