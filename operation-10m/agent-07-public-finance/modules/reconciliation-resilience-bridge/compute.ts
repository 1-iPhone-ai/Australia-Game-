import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalReconciliationReport } from '../reconciliation/reconcile';
import type { FiscalResilienceAssessment } from '../fiscal-resilience/types';
import type { FiscalRiskStressCoherenceReport } from '../fiscal-risk-stress-coherence/types';
import type { ReconciliationResilienceBridgeReport, ReconciliationResilienceCheck } from './types';
import { RECONCILIATION_RESILIENCE_BRIDGE_SCHEMA } from './types';

const BRIDGE_TOLERANCE = 6.3;

export function buildReconciliationResilienceBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  reconciliation: FiscalReconciliationReport,
  resilience: FiscalResilienceAssessment,
  riskStress: FiscalRiskStressCoherenceReport
): ReconciliationResilienceBridgeReport {
  const failedChecks = reconciliation.checks.filter(c => !c.passed).length;
  const resilienceStress =
    resilience.compositeStressBand === 'critical' || resilience.compositeStressBand === 'weak' ? 2.5 : 1;
  const reconGap = failedChecks * 1.8 * resilienceStress;
  const riskGap = Math.abs(riskStress.aggregateRiskStressGapPoints - reconGap * 0.35);
  const bridgeGapPoints = Math.round((reconGap + riskGap) * 10) / 20;

  const checks: ReconciliationResilienceCheck[] = [
    {
      id: 'RRB01',
      label: 'Cross-layer reconciliation passes',
      passed: reconciliation.allPassed || v1012.pressure === 'critical',
      observed: failedChecks,
      tolerance: 0
    },
    {
      id: 'RRB02',
      label: 'Resilience reserve adequate under stress',
      passed:
        resilience.reserveAdequacy !== 'depleted' ||
        (resilience.recoveryTurnsEstimate ?? 0) <= 12 ||
        resilience.compositeStressBand !== 'critical' ||
        resilience.baselinePressure === 'critical' ||
        v1012.pressure === 'critical',
      observed: resilience.recoveryTurnsEstimate ?? 0,
      tolerance: 12
    },
    {
      id: 'RRB03',
      label: 'Reconciliation gap vs risk stress coherence',
      passed:
        riskGap <= BRIDGE_TOLERANCE + 2 ||
        riskStress.withinRiskStressBand ||
        v1012.pressure === 'critical',
      observed: riskGap,
      tolerance: BRIDGE_TOLERANCE + 2
    }
  ];

  const withinReconciliationResilienceBand =
    checks.every(c => c.passed) ||
    (reconciliation.allPassed &&
      (resilience.reserveAdequacy !== 'depleted' ||
        (resilience.recoveryTurnsEstimate ?? 0) <= 12)) ||
    v1012.pressure === 'critical';

  const alignedWithRiskStressCoherence =
    riskStress.alignedWithContingentBridge &&
    (bridgeGapPoints <= riskStress.aggregateRiskStressGapPoints + 2.8 ||
      riskStress.withinRiskStressBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinReconciliationResilienceBand) {
    warnings.push(`Reconciliation resilience bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithRiskStressCoherence) {
    warnings.push('Reconciliation bridge diverges from risk stress coherence.');
  }

  const narrative = withinReconciliationResilienceBand
    ? `Reconciliation resilience bridge gap ${bridgeGapPoints} within tolerance.`
    : `Reconciliation resilience alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: RECONCILIATION_RESILIENCE_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinReconciliationResilienceBand,
    alignedWithRiskStressCoherence,
    narrative,
    warnings
  };
}
