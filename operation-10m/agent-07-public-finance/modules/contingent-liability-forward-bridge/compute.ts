import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ContingentLiabilityAssessment } from '../contingent-liabilities/types';
import type { FiscalStressResilienceBridgeReport } from '../fiscal-stress-resilience-bridge/types';
import type { ForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/types';
import type { ContingentForwardCheck, ContingentLiabilityForwardBridgeReport } from './types';
import { CONTINGENT_LIABILITY_FORWARD_BRIDGE_SCHEMA } from './types';

const EXPOSURE_GAP_TOLERANCE = 5.8;

export function buildContingentLiabilityForwardBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  contingent: ContingentLiabilityAssessment,
  forwardIntegrity: ForwardEstimatesIntegrityReport,
  stressBridge: FiscalStressResilienceBridgeReport
): ContingentLiabilityForwardBridgeReport {
  const forwardStressGap = Math.abs(
    contingent.expectedLossPoints - forwardIntegrity.bandDriftPoints * 0.42
  );
  const stressBridgeGap = Math.abs(contingent.tailRiskPoints * 0.35 - stressBridge.bridgeStressPoints);
  const bridgeExposureGapPoints =
    Math.round((forwardStressGap + stressBridgeGap) * 10) / 20;

  const checks: ContingentForwardCheck[] = [
    {
      id: 'CLFB01',
      label: 'Contingent expected loss within soft cap',
      passed: contingent.withinSoftCap || v1012.pressure === 'critical',
      detail: `expected=${contingent.expectedLossPoints}, tail=${contingent.tailRiskPoints}`
    },
    {
      id: 'CLFB02',
      label: 'Forward drift vs contingent exposure',
      passed:
        forwardStressGap <= EXPOSURE_GAP_TOLERANCE + 2 ||
        forwardIntegrity.allPassed ||
        v1012.pressure === 'critical',
      detail: `drift=${forwardIntegrity.bandDriftPoints}, expected=${contingent.expectedLossPoints}`
    },
    {
      id: 'CLFB03',
      label: 'Tail risk vs stress resilience bridge',
      passed:
        stressBridgeGap <= EXPOSURE_GAP_TOLERANCE + 1.5 ||
        stressBridge.withinResilienceBridge ||
        v1012.pressure === 'critical',
      detail: `bridge=${stressBridge.bridgeStressPoints}, tail=${contingent.tailRiskPoints}`
    }
  ];

  const withinContingentForwardBand =
    checks.every(c => c.passed) ||
    (contingent.withinSoftCap && bridgeExposureGapPoints <= EXPOSURE_GAP_TOLERANCE + 1) ||
    v1012.pressure === 'critical';

  const alignedWithStressBridge =
    stressBridge.alignedWithDebtCoupling &&
    (bridgeExposureGapPoints <= stressBridge.bridgeStressPoints + 2.4 ||
      stressBridge.withinResilienceBridge ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinContingentForwardBand) {
    warnings.push(`Contingent forward bridge gap ${bridgeExposureGapPoints}.`);
  }
  if (!alignedWithStressBridge) {
    warnings.push('Contingent forward bridge diverges from stress resilience bridge.');
  }

  const narrative = withinContingentForwardBand
    ? `Contingent forward bridge gap ${bridgeExposureGapPoints} within tolerance.`
    : `Contingent forward alert: gap ${bridgeExposureGapPoints}.`;

  return {
    schemaVersion: CONTINGENT_LIABILITY_FORWARD_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeExposureGapPoints,
    withinContingentForwardBand,
    alignedWithStressBridge,
    narrative,
    warnings
  };
}
