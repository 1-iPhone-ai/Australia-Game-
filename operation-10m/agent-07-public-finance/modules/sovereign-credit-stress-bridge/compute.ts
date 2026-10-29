import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtFiscalCouplingRegisterReport } from '../debt-fiscal-coupling-register/types';
import type { FiscalStressScenariosReport } from '../fiscal-stress-scenarios/types';
import type { SovereignCreditOutlookReport } from '../sovereign-credit-outlook/types';
import type { CreditStressCheck, SovereignCreditStressBridgeReport } from './types';
import { SOVEREIGN_CREDIT_STRESS_BRIDGE_SCHEMA } from './types';

const CREDIT_STRESS_TOLERANCE = 6.5;

export function buildSovereignCreditStressBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  sovereignCredit: SovereignCreditOutlookReport,
  fiscalStress: FiscalStressScenariosReport,
  debtCoupling: DebtFiscalCouplingRegisterReport
): SovereignCreditStressBridgeReport {
  const stressSpread = Math.abs(fiscalStress.worstHeadroomDelta) * 0.35 + fiscalStress.aggregateBreaches * 1.2;
  const spreadGap = Math.abs(sovereignCredit.impliedSpreadBps * 0.01 - stressSpread * 0.22);
  const couplingGap = Math.abs(debtCoupling.couplingStressPoints - spreadGap * 0.48);
  const bridgeGapPoints = Math.round((spreadGap + couplingGap) * 10) / 20;

  const checks: CreditStressCheck[] = [
    {
      id: 'SCSB01',
      label: 'Sovereign credit within outlook band',
      passed: sovereignCredit.withinOutlookBand || !v1012.debtEnabled || v1012.pressure === 'critical',
      observed: sovereignCredit.impliedSpreadBps,
      tolerance: 220
    },
    {
      id: 'SCSB02',
      label: 'Fiscal stress within appetite',
      passed: fiscalStress.withinStressAppetite || v1012.pressure === 'critical',
      observed: Math.abs(fiscalStress.worstHeadroomDelta),
      tolerance: 14
    },
    {
      id: 'SCSB03',
      label: 'Spread gap vs debt coupling',
      passed:
        couplingGap <= CREDIT_STRESS_TOLERANCE + 2 ||
        debtCoupling.withinCouplingBand ||
        v1012.pressure === 'critical',
      observed: couplingGap,
      tolerance: CREDIT_STRESS_TOLERANCE + 2
    }
  ];

  const withinCreditStressBand =
    checks.every(c => c.passed) ||
    (sovereignCredit.withinOutlookBand && fiscalStress.withinStressAppetite) ||
    v1012.pressure === 'critical';

  const alignedWithDebtCoupling =
    debtCoupling.alignedWithFiscalBuffer &&
    (bridgeGapPoints <= debtCoupling.couplingStressPoints + 2.4 ||
      debtCoupling.withinCouplingBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinCreditStressBand) {
    warnings.push(`Sovereign credit stress bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithDebtCoupling) {
    warnings.push('Credit stress bridge diverges from debt coupling.');
  }

  const narrative = withinCreditStressBand
    ? `Sovereign credit stress bridge gap ${bridgeGapPoints} within tolerance.`
    : `Sovereign credit stress alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: SOVEREIGN_CREDIT_STRESS_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinCreditStressBand,
    alignedWithDebtCoupling,
    narrative,
    warnings
  };
}
