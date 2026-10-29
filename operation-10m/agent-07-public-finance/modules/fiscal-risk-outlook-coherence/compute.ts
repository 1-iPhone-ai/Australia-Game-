import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalRiskRegisterReport } from '../fiscal-risk-register/types';
import type { FiscalStressScenariosReport } from '../fiscal-stress-scenarios/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { FiscalRiskOutlookCoherenceReport, RiskOutlookCheck } from './types';
import { FISCAL_RISK_OUTLOOK_COHERENCE_SCHEMA } from './types';

const RISK_OUTLOOK_TOLERANCE = 6.0;

export function buildFiscalRiskOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  riskRegister: FiscalRiskRegisterReport,
  outlook: MediumTermFiscalOutlook,
  fiscalStress: FiscalStressScenariosReport
): FiscalRiskOutlookCoherenceReport {
  const headroomGap = Math.abs(outlook.averageHeadroom - v1012.fiscalHeadroom * 0.92);
  const heatGap = Math.abs(riskRegister.aggregateHeat - Math.abs(fiscalStress.worstHeadroomDelta) * 0.18);
  const outlookStressGap = Math.abs(headroomGap - heatGap * 0.41);
  const aggregateCoherenceGapPoints = Math.round((heatGap + outlookStressGap) * 10) / 20;

  const checks: RiskOutlookCheck[] = [
    {
      id: 'FROC01',
      label: 'Risk register within appetite',
      passed: riskRegister.withinRiskAppetite || v1012.pressure === 'critical',
      detail: `heat=${riskRegister.aggregateHeat}, tier=${riskRegister.tier}`
    },
    {
      id: 'FROC02',
      label: 'Outlook headroom coherent with base',
      passed:
        headroomGap <= RISK_OUTLOOK_TOLERANCE + 3 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `avg=${outlook.averageHeadroom}, base=${v1012.fiscalHeadroom}`
    },
    {
      id: 'FROC03',
      label: 'Risk heat vs stress worst case',
      passed:
        heatGap <= RISK_OUTLOOK_TOLERANCE + 2 ||
        fiscalStress.withinStressAppetite ||
        v1012.pressure === 'critical',
      detail: `heat=${riskRegister.aggregateHeat}, stress=${fiscalStress.worstHeadroomDelta}`
    }
  ];

  const withinRiskOutlookBand =
    checks.every(c => c.passed) ||
    (riskRegister.withinRiskAppetite && fiscalStress.withinStressAppetite) ||
    v1012.pressure === 'critical';

  const alignedWithStressScenarios =
    fiscalStress.withinStressAppetite &&
    (aggregateCoherenceGapPoints <= Math.abs(fiscalStress.worstHeadroomDelta) + 2.6 ||
      riskRegister.withinRiskAppetite ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinRiskOutlookBand) {
    warnings.push(`Fiscal risk outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithStressScenarios) {
    warnings.push('Risk outlook diverges from stress scenarios.');
  }

  const narrative = withinRiskOutlookBand
    ? `Fiscal risk outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Fiscal risk outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: FISCAL_RISK_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinRiskOutlookBand,
    alignedWithStressScenarios,
    narrative,
    warnings
  };
}
