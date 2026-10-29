import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { InfrastructureEnvelopeCoherenceReport } from '../infrastructure-envelope-coherence/types';
import type { InfrastructureFiscalLoadReport } from '../infrastructure-fiscal-load/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { InfraLoadOutlookCheck, InfrastructureLoadOutlookBridgeReport } from './types';
import { INFRASTRUCTURE_LOAD_OUTLOOK_BRIDGE_SCHEMA } from './types';

const INFRA_OUTLOOK_TOLERANCE = 6.7;

export function buildInfrastructureLoadOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  infraLoad: InfrastructureFiscalLoadReport,
  envelopeCoherence: InfrastructureEnvelopeCoherenceReport,
  outlook: MediumTermFiscalOutlook
): InfrastructureLoadOutlookBridgeReport {
  const outlookCapacity = outlook.projections[0]?.envelopeCapacity ?? v1012.revenueCapacity * 0.88;
  const loadGap = Math.abs(infraLoad.loadToCapacityRatio - outlookCapacity * 0.0012);
  const envelopeGap = Math.abs(envelopeCoherence.aggregateCoherenceGapPoints - loadGap * 8.5);
  const bridgeGapPoints = Math.round((loadGap + envelopeGap) * 10) / 20;

  const checks: InfraLoadOutlookCheck[] = [
    {
      id: 'ILOB01',
      label: 'Infrastructure load within portfolio cap',
      passed: infraLoad.withinPortfolioLoadCap || v1012.pressure === 'critical',
      observed: infraLoad.loadToCapacityRatio,
      tolerance: 0.52
    },
    {
      id: 'ILOB02',
      label: 'Envelope coherence within band',
      passed: envelopeCoherence.withinEnvelopeCoherence || v1012.pressure === 'critical',
      observed: envelopeCoherence.aggregateCoherenceGapPoints,
      tolerance: 7
    },
    {
      id: 'ILOB03',
      label: 'Load vs outlook envelope capacity',
      passed:
        loadGap <= INFRA_OUTLOOK_TOLERANCE * 0.15 + 0.04 ||
        infraLoad.feasibleUnderEnvelope ||
        v1012.pressure === 'critical',
      observed: loadGap,
      tolerance: INFRA_OUTLOOK_TOLERANCE * 0.15 + 0.04
    }
  ];

  const withinInfraLoadOutlookBand =
    checks.every(c => c.passed) ||
    (infraLoad.withinPortfolioLoadCap && envelopeCoherence.withinEnvelopeCoherence) ||
    infraLoad.feasibleUnderEnvelope ||
    v1012.pressure === 'critical';

  const alignedWithEnvelopeCoherence =
    envelopeCoherence.alignedWithGrantForward &&
    (bridgeGapPoints <= envelopeCoherence.aggregateCoherenceGapPoints + 2.5 ||
      envelopeCoherence.withinEnvelopeCoherence ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinInfraLoadOutlookBand) {
    warnings.push(`Infrastructure load outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithEnvelopeCoherence) {
    warnings.push('Infrastructure load outlook diverges from envelope coherence.');
  }

  const narrative = withinInfraLoadOutlookBand
    ? `Infrastructure load outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Infrastructure load outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: INFRASTRUCTURE_LOAD_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinInfraLoadOutlookBand,
    alignedWithEnvelopeCoherence,
    narrative,
    warnings
  };
}
