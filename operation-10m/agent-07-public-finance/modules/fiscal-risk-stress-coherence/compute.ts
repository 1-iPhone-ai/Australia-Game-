import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ContingentLiabilityForwardBridgeReport } from '../contingent-liability-forward-bridge/types';
import type { FiscalRiskRegisterReport } from '../fiscal-risk-register/types';
import type { FiscalStressScenariosReport } from '../fiscal-stress-scenarios/types';
import type { FiscalRiskStressCoherenceReport, RiskStressCheck } from './types';
import { FISCAL_RISK_STRESS_COHERENCE_SCHEMA } from './types';

const RISK_STRESS_TOLERANCE = 6.4;

export function buildFiscalRiskStressCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  riskRegister: FiscalRiskRegisterReport,
  fiscalStress: FiscalStressScenariosReport,
  contingentBridge: ContingentLiabilityForwardBridgeReport
): FiscalRiskStressCoherenceReport {
  const stressHeatGap = Math.abs(
    fiscalStress.worstHeadroomDelta + riskRegister.aggregateHeat * 0.42
  );
  const contingentGap = Math.abs(
    contingentBridge.bridgeExposureGapPoints - riskRegister.aggregateHeat * 0.18
  );
  const aggregateRiskStressGapPoints =
    Math.round((stressHeatGap + contingentGap) * 10) / 20;

  const checks: RiskStressCheck[] = [
    {
      id: 'FRSC01',
      label: 'Risk register within appetite',
      passed: riskRegister.withinRiskAppetite || v1012.pressure === 'critical',
      detail: `heat=${riskRegister.aggregateHeat}, tier=${riskRegister.tier}`
    },
    {
      id: 'FRSC02',
      label: 'Stress worst delta vs risk heat',
      passed:
        stressHeatGap <= RISK_STRESS_TOLERANCE + 3 ||
        fiscalStress.withinStressAppetite ||
        v1012.pressure === 'critical',
      detail: `worstDelta=${fiscalStress.worstHeadroomDelta}, heat=${riskRegister.aggregateHeat}`
    },
    {
      id: 'FRSC03',
      label: 'Contingent bridge vs risk heat',
      passed:
        contingentGap <= RISK_STRESS_TOLERANCE + 2 ||
        contingentBridge.withinContingentForwardBand ||
        v1012.pressure === 'critical',
      detail: `bridge=${contingentBridge.bridgeExposureGapPoints}, heat=${riskRegister.aggregateHeat}`
    }
  ];

  const withinRiskStressBand =
    checks.every(c => c.passed) ||
    (riskRegister.withinRiskAppetite && fiscalStress.withinStressAppetite) ||
    v1012.pressure === 'critical';

  const alignedWithContingentBridge =
    contingentBridge.alignedWithStressBridge &&
    (aggregateRiskStressGapPoints <= contingentBridge.bridgeExposureGapPoints + 2.5 ||
      contingentBridge.withinContingentForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinRiskStressBand) {
    warnings.push(`Fiscal risk stress gap ${aggregateRiskStressGapPoints}.`);
  }
  if (!alignedWithContingentBridge) {
    warnings.push('Risk stress coherence diverges from contingent forward bridge.');
  }

  const narrative = withinRiskStressBand
    ? `Fiscal risk stress gap ${aggregateRiskStressGapPoints} within tolerance.`
    : `Fiscal risk stress alert: gap ${aggregateRiskStressGapPoints}.`;

  return {
    schemaVersion: FISCAL_RISK_STRESS_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateRiskStressGapPoints,
    withinRiskStressBand,
    alignedWithContingentBridge,
    narrative,
    warnings
  };
}
