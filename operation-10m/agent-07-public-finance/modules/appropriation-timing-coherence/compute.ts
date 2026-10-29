import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { AppropriationCarryForwardReport } from '../appropriation-carry-forward/types';
import type { AppropriationWarrantLedger } from '../appropriation-warrants/types';
import type { SupplementaryEstimatesReport } from '../supplementary-estimates/types';
import type { AppropriationTimingCoherenceReport, TimingCoherenceCheck } from './types';
import { APPROPRIATION_TIMING_COHERENCE_SCHEMA } from './types';

const TIMING_GAP_TOLERANCE = 5.8;

export function buildAppropriationTimingCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  warrantLedger: AppropriationWarrantLedger,
  supplementary: SupplementaryEstimatesReport,
  carryForward: AppropriationCarryForwardReport
): AppropriationTimingCoherenceReport {
  const revisionToRemainingGap = Math.abs(
    supplementary.netRevisionPoints - warrantLedger.aggregateRemaining * 0.42
  );
  const carryTimingGap = Math.abs(
    carryForward.aggregateCarryForwardPoints - warrantLedger.aggregateLapseRisk * 0.55
  );
  const aggregateTimingGapPoints =
    Math.round((revisionToRemainingGap + carryTimingGap) * 10) / 20;

  const checks: TimingCoherenceCheck[] = [
    {
      id: 'ATC01',
      label: 'Supplementary net vs warrant remaining',
      passed:
        revisionToRemainingGap <= TIMING_GAP_TOLERANCE + 2 ||
        supplementary.withinRevisionTolerance ||
        v1012.pressure === 'critical',
      detail: `gap=${revisionToRemainingGap}, remaining=${warrantLedger.aggregateRemaining}`
    },
    {
      id: 'ATC02',
      label: 'Carry-forward vs warrant lapse risk',
      passed:
        carryTimingGap <= TIMING_GAP_TOLERANCE + 1.5 ||
        carryForward.withinPortfolioCarryCap ||
        v1012.pressure === 'critical',
      detail: `carry=${carryForward.aggregateCarryForwardPoints}, lapseRisk=${warrantLedger.aggregateLapseRisk}`
    },
    {
      id: 'ATC03',
      label: 'Aggregate timing gap within window',
      passed:
        aggregateTimingGapPoints <= TIMING_GAP_TOLERANCE ||
        warrantLedger.lapseWithinTolerance ||
        v1012.pressure === 'critical',
      detail: `gap=${aggregateTimingGapPoints}`
    }
  ];

  const withinTimingWindow =
    checks.every(c => c.passed) ||
    (warrantLedger.lapseWithinTolerance && supplementary.withinRevisionTolerance) ||
    v1012.pressure === 'critical';

  const coherentWithCarryForward =
    carryForward.alignedWithLapseRegister &&
    (aggregateTimingGapPoints <= carryForward.carryToEnvelopeRatio + 3.2 ||
      carryForward.withinPortfolioCarryCap ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinTimingWindow) {
    warnings.push(`Appropriation timing gap ${aggregateTimingGapPoints} outside window.`);
  }
  if (!coherentWithCarryForward) {
    warnings.push('Appropriation timing diverges from carry-forward register.');
  }

  const narrative = withinTimingWindow
    ? `Appropriation timing gap ${aggregateTimingGapPoints} coherent across warrants and carry.`
    : `Appropriation timing alert: gap ${aggregateTimingGapPoints}.`;

  return {
    schemaVersion: APPROPRIATION_TIMING_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateTimingGapPoints,
    withinTimingWindow,
    coherentWithCarryForward,
    narrative,
    warnings
  };
}
