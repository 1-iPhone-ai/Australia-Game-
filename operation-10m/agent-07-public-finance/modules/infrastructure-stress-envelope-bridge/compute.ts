import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalStressScenariosReport } from '../fiscal-stress-scenarios/types';
import type { InfrastructureEnvelopeCoherenceReport } from '../infrastructure-envelope-coherence/types';
import type { InfrastructureFiscalLoadReport } from '../infrastructure-fiscal-load/types';
import type {
  InfraStressEnvelopeCheck,
  InfrastructureStressEnvelopeBridgeReport
} from './types';
import { INFRASTRUCTURE_STRESS_ENVELOPE_BRIDGE_SCHEMA } from './types';

const STRESS_ENVELOPE_TOLERANCE = 6.8;

export function buildInfrastructureStressEnvelopeBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  infraLoad: InfrastructureFiscalLoadReport,
  envelopeCoherence: InfrastructureEnvelopeCoherenceReport,
  fiscalStress: FiscalStressScenariosReport
): InfrastructureStressEnvelopeBridgeReport {
  const loadStress = Math.abs(fiscalStress.worstHeadroomDelta) * infraLoad.loadToCapacityRatio * 0.12;
  const envelopeGap = Math.abs(envelopeCoherence.aggregateCoherenceGapPoints - loadStress * 0.44);
  const bridgeGapPoints = Math.round((loadStress + envelopeGap) * 10) / 20;

  const checks: InfraStressEnvelopeCheck[] = [
    {
      id: 'ISEB01',
      label: 'Infrastructure load within portfolio cap',
      passed: infraLoad.withinPortfolioLoadCap || v1012.pressure === 'critical',
      observed: infraLoad.loadToCapacityRatio,
      tolerance: 1.15
    },
    {
      id: 'ISEB02',
      label: 'Stress scenarios within appetite',
      passed: fiscalStress.withinStressAppetite || v1012.pressure === 'critical',
      observed: Math.abs(fiscalStress.worstHeadroomDelta),
      tolerance: 14
    },
    {
      id: 'ISEB03',
      label: 'Load stress vs envelope coherence',
      passed:
        envelopeGap <= STRESS_ENVELOPE_TOLERANCE + 2 ||
        envelopeCoherence.withinEnvelopeCoherence ||
        v1012.pressure === 'critical',
      observed: envelopeGap,
      tolerance: STRESS_ENVELOPE_TOLERANCE + 2
    }
  ];

  const withinInfraStressEnvelopeBand =
    checks.every(c => c.passed) ||
    (infraLoad.feasibleUnderEnvelope && fiscalStress.withinStressAppetite) ||
    v1012.pressure === 'critical';

  const alignedWithEnvelopeCoherence =
    envelopeCoherence.alignedWithGrantForward &&
    (bridgeGapPoints <= envelopeCoherence.aggregateCoherenceGapPoints + 2.5 ||
      envelopeCoherence.withinEnvelopeCoherence ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinInfraStressEnvelopeBand) {
    warnings.push(`Infrastructure stress envelope bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithEnvelopeCoherence) {
    warnings.push('Infra stress bridge diverges from envelope coherence.');
  }

  const narrative = withinInfraStressEnvelopeBand
    ? `Infrastructure stress envelope bridge gap ${bridgeGapPoints} within tolerance.`
    : `Infrastructure stress envelope alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: INFRASTRUCTURE_STRESS_ENVELOPE_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinInfraStressEnvelopeBand,
    alignedWithEnvelopeCoherence,
    narrative,
    warnings
  };
}
