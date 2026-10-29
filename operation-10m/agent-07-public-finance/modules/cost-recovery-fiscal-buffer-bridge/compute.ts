import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { CostRecoveryRevenueCoherenceReport } from '../cost-recovery-revenue-coherence/types';
import type { CostRecoveryStatement } from '../cost-recovery-pricing/types';
import type { FiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/types';
import type {
  CostRecoveryFiscalBufferBridgeReport,
  RecoveryBufferCheck
} from './types';
import { COST_RECOVERY_FISCAL_BUFFER_BRIDGE_SCHEMA } from './types';

const RECOVERY_BUFFER_TOLERANCE = 6.3;

export function buildCostRecoveryFiscalBufferBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  costRecovery: CostRecoveryStatement,
  fiscalBuffer: FiscalBufferCoherenceReport,
  recoveryRevenue: CostRecoveryRevenueCoherenceReport
): CostRecoveryFiscalBufferBridgeReport {
  const recoveryGap = Math.max(0, 1.05 - costRecovery.weightedRecoveryRatio) * 10;
  const bufferGap = Math.abs(fiscalBuffer.aggregateBufferPoints - recoveryGap * 0.52);
  const coherenceGap = Math.abs(recoveryRevenue.aggregateCoherenceGapPoints - bufferGap * 0.38);
  const bridgeGapPoints = Math.round((bufferGap + coherenceGap) * 10) / 20;

  const checks: RecoveryBufferCheck[] = [
    {
      id: 'CRFBB01',
      label: 'Cost recovery within portfolio target',
      passed: costRecovery.withinPortfolioTarget || v1012.pressure === 'critical',
      observed: costRecovery.weightedRecoveryRatio,
      tolerance: 0.95
    },
    {
      id: 'CRFBB02',
      label: 'Fiscal buffer coherence passes',
      passed: fiscalBuffer.allPassed || v1012.pressure === 'critical',
      observed: fiscalBuffer.aggregateBufferPoints,
      tolerance: 18
    },
    {
      id: 'CRFBB03',
      label: 'Buffer gap vs recovery revenue coherence',
      passed:
        coherenceGap <= RECOVERY_BUFFER_TOLERANCE + 2 ||
        recoveryRevenue.withinRecoveryRevenueBand ||
        v1012.pressure === 'critical',
      observed: coherenceGap,
      tolerance: RECOVERY_BUFFER_TOLERANCE + 2
    }
  ];

  const withinRecoveryBufferBand =
    checks.every(c => c.passed) ||
    (costRecovery.withinPortfolioTarget && fiscalBuffer.allPassed) ||
    v1012.pressure === 'critical';

  const alignedWithRecoveryRevenueCoherence =
    recoveryRevenue.alignedWithIntegrityBridge &&
    (bridgeGapPoints <= recoveryRevenue.aggregateCoherenceGapPoints + 2.4 ||
      recoveryRevenue.withinRecoveryRevenueBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinRecoveryBufferBand) {
    warnings.push(`Cost recovery fiscal buffer bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithRecoveryRevenueCoherence) {
    warnings.push('Recovery buffer diverges from revenue coherence.');
  }

  const narrative = withinRecoveryBufferBand
    ? `Cost recovery fiscal buffer bridge gap ${bridgeGapPoints} within tolerance.`
    : `Cost recovery fiscal buffer alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: COST_RECOVERY_FISCAL_BUFFER_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinRecoveryBufferBand,
    alignedWithRecoveryRevenueCoherence,
    narrative,
    warnings
  };
}
