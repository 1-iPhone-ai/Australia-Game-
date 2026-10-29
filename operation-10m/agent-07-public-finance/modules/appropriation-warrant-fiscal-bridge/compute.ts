import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { AppropriationCarryForwardReport } from '../appropriation-carry-forward/types';
import type { AppropriationTimingCoherenceReport } from '../appropriation-timing-coherence/types';
import type { AppropriationWarrantLedger } from '../appropriation-warrants/types';
import type { AppropriationWarrantFiscalBridgeReport, WarrantFiscalCheck } from './types';
import { APPROPRIATION_WARRANT_FISCAL_BRIDGE_SCHEMA } from './types';

const WARRANT_TOLERANCE = 6.4;

export function buildAppropriationWarrantFiscalBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  warrantLedger: AppropriationWarrantLedger,
  timingCoherence: AppropriationTimingCoherenceReport,
  carryForward: AppropriationCarryForwardReport
): AppropriationWarrantFiscalBridgeReport {
  const lapseGap = Math.abs(warrantLedger.aggregateLapseRisk - carryForward.aggregateSourceLapsePoints * 0.22);
  const timingGap = Math.abs(timingCoherence.aggregateTimingGapPoints - lapseGap * 0.41);
  const bridgeGapPoints = Math.round((lapseGap + timingGap) * 10) / 20;

  const checks: WarrantFiscalCheck[] = [
    {
      id: 'AWFB01',
      label: 'Warrant lapse within tolerance',
      passed: warrantLedger.lapseWithinTolerance || v1012.pressure === 'critical',
      observed: warrantLedger.aggregateLapseRisk,
      tolerance: warrantLedger.aggregateAppropriation * 0.12 + 2
    },
    {
      id: 'AWFB02',
      label: 'Timing coherence within window',
      passed: timingCoherence.withinTimingWindow || v1012.pressure === 'critical',
      observed: timingCoherence.aggregateTimingGapPoints,
      tolerance: 9
    },
    {
      id: 'AWFB03',
      label: 'Warrant lapse vs carry forward',
      passed:
        lapseGap <= WARRANT_TOLERANCE + 2 ||
        carryForward.withinPortfolioCarryCap ||
        v1012.pressure === 'critical',
      observed: lapseGap,
      tolerance: WARRANT_TOLERANCE + 2
    }
  ];

  const withinWarrantFiscalBand =
    checks.every(c => c.passed) ||
    (warrantLedger.lapseWithinTolerance && timingCoherence.withinTimingWindow) ||
    v1012.pressure === 'critical';

  const alignedWithTimingCoherence =
    timingCoherence.coherentWithCarryForward &&
    (bridgeGapPoints <= timingCoherence.aggregateTimingGapPoints + 2.3 ||
      timingCoherence.withinTimingWindow ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinWarrantFiscalBand) {
    warnings.push(`Appropriation warrant fiscal bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithTimingCoherence) {
    warnings.push('Warrant fiscal bridge diverges from timing coherence.');
  }

  const narrative = withinWarrantFiscalBand
    ? `Appropriation warrant fiscal bridge gap ${bridgeGapPoints} within tolerance.`
    : `Appropriation warrant fiscal alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: APPROPRIATION_WARRANT_FISCAL_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinWarrantFiscalBand,
    alignedWithTimingCoherence,
    narrative,
    warnings
  };
}
