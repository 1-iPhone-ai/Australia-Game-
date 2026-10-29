import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { CostRecoveryStatement } from '../cost-recovery-pricing/types';
import type { NationalRevenueLedger } from '../revenue-ledger/types';
import type { RevenueIntegrityForwardBridgeReport } from '../revenue-integrity-forward-bridge/types';
import type { CostRecoveryCoherenceCheck, CostRecoveryRevenueCoherenceReport } from './types';
import { COST_RECOVERY_REVENUE_COHERENCE_SCHEMA } from './types';

const RECOVERY_GAP_TOLERANCE = 5.3;

export function buildCostRecoveryRevenueCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  costRecovery: CostRecoveryStatement,
  ledger: NationalRevenueLedger,
  integrityBridge: RevenueIntegrityForwardBridgeReport
): CostRecoveryRevenueCoherenceReport {
  const recoveredShare = costRecovery.aggregateRecovered / Math.max(1, ledger.currentCapacity);
  const ledgerGap = Math.abs(recoveredShare * 100 - costRecovery.weightedRecoveryRatio * 12);
  const bridgeGap = Math.abs(integrityBridge.bridgeGapPoints - ledgerGap * 0.28);
  const aggregateCoherenceGapPoints =
    Math.round((ledgerGap + bridgeGap) * 10) / 20;

  const checks: CostRecoveryCoherenceCheck[] = [
    {
      id: 'CRRC01',
      label: 'Cost recovery within portfolio target',
      passed: costRecovery.withinPortfolioTarget || v1012.pressure === 'critical',
      observed: costRecovery.weightedRecoveryRatio,
      tolerance: 0.72
    },
    {
      id: 'CRRC02',
      label: 'Recovered charges vs ledger capacity',
      passed:
        ledgerGap <= RECOVERY_GAP_TOLERANCE + 2 ||
        ledger.reconciledToV1012 ||
        v1012.pressure === 'critical',
      observed: ledgerGap,
      tolerance: RECOVERY_GAP_TOLERANCE + 2
    },
    {
      id: 'CRRC03',
      label: 'Integrity bridge vs recovery gap',
      passed:
        bridgeGap <= RECOVERY_GAP_TOLERANCE + 1.5 ||
        integrityBridge.withinIntegrityForwardBand ||
        v1012.pressure === 'critical',
      observed: bridgeGap,
      tolerance: RECOVERY_GAP_TOLERANCE + 1.5
    }
  ];

  const withinRecoveryRevenueBand =
    checks.every(c => c.passed) ||
    (costRecovery.withinPortfolioTarget && aggregateCoherenceGapPoints <= RECOVERY_GAP_TOLERANCE + 1) ||
    v1012.pressure === 'critical';

  const alignedWithIntegrityBridge =
    integrityBridge.alignedWithRevenueAnchor &&
    (aggregateCoherenceGapPoints <= integrityBridge.bridgeGapPoints + 2.2 ||
      integrityBridge.withinIntegrityForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinRecoveryRevenueBand) {
    warnings.push(`Cost recovery revenue gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithIntegrityBridge) {
    warnings.push('Cost recovery coherence diverges from integrity forward bridge.');
  }

  const narrative = withinRecoveryRevenueBand
    ? `Cost recovery revenue gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Cost recovery revenue alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: COST_RECOVERY_REVENUE_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinRecoveryRevenueBand,
    alignedWithIntegrityBridge,
    narrative,
    warnings
  };
}
