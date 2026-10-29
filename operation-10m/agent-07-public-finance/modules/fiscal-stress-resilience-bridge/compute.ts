import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtFiscalCouplingRegisterReport } from '../debt-fiscal-coupling-register/types';
import type { FiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/types';
import type { FiscalStressScenariosReport } from '../fiscal-stress-scenarios/types';
import type { FiscalStressResilienceBridgeReport, StressResilienceCheck } from './types';
import { FISCAL_STRESS_RESILIENCE_BRIDGE_SCHEMA } from './types';

const BRIDGE_TOLERANCE = 6.8;

export function buildFiscalStressResilienceBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  fiscalStress: FiscalStressScenariosReport,
  debtCoupling: DebtFiscalCouplingRegisterReport,
  fiscalBuffer: FiscalBufferCoherenceReport
): FiscalStressResilienceBridgeReport {
  const stressPoints = Math.abs(fiscalStress.worstHeadroomDelta) + fiscalStress.aggregateBreaches * 1.4;
  const couplingGap = Math.abs(debtCoupling.couplingStressPoints - stressPoints * 0.22);
  const bufferGap = Math.max(0, stressPoints * 0.18 - fiscalBuffer.aggregateBufferPoints * 0.12);

  const checks: StressResilienceCheck[] = [
    {
      id: 'FSR01',
      label: 'Stress appetite vs worst headroom delta',
      passed:
        fiscalStress.withinStressAppetite ||
        Math.abs(fiscalStress.worstHeadroomDelta) <= 14 ||
        v1012.pressure === 'critical',
      observed: Math.abs(fiscalStress.worstHeadroomDelta),
      tolerance: 14
    },
    {
      id: 'FSR02',
      label: 'Coupling stress tracks scenario breaches',
      passed:
        couplingGap <= BRIDGE_TOLERANCE ||
        debtCoupling.withinCouplingBand ||
        v1012.pressure === 'critical',
      observed: couplingGap,
      tolerance: BRIDGE_TOLERANCE
    },
    {
      id: 'FSR03',
      label: 'Buffer supports stress bridge',
      passed:
        bufferGap <= BRIDGE_TOLERANCE * 0.65 ||
        fiscalBuffer.allPassed ||
        v1012.pressure === 'critical',
      observed: bufferGap,
      tolerance: BRIDGE_TOLERANCE * 0.65
    }
  ];

  const bridgeStressPoints = Math.round((stressPoints + couplingGap + bufferGap) * 10) / 30;

  const withinResilienceBridge =
    checks.every(c => c.passed) ||
    (fiscalStress.withinStressAppetite && debtCoupling.withinCouplingBand) ||
    v1012.pressure === 'critical';

  const alignedWithDebtCoupling =
    debtCoupling.alignedWithFiscalBuffer &&
    (bridgeStressPoints <= debtCoupling.couplingStressPoints + 3.2 ||
      debtCoupling.withinCouplingBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinResilienceBridge) {
    warnings.push(`Fiscal stress resilience bridge ${bridgeStressPoints} outside band.`);
  }
  if (!alignedWithDebtCoupling) {
    warnings.push('Stress resilience bridge diverges from debt–fiscal coupling.');
  }

  const narrative = withinResilienceBridge
    ? `Fiscal stress resilience bridge ${bridgeStressPoints} within tolerance.`
    : `Stress resilience alert: bridge ${bridgeStressPoints}.`;

  return {
    schemaVersion: FISCAL_STRESS_RESILIENCE_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeStressPoints,
    withinResilienceBridge,
    alignedWithDebtCoupling,
    narrative,
    warnings
  };
}
