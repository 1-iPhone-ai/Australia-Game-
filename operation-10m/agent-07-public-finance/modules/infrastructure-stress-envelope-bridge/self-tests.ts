import { buildExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/compute';
import { buildFiscalStressScenariosReport } from '../fiscal-stress-scenarios/compute';
import { buildForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/compute';
import { buildGrantForwardAlignmentReport } from '../grant-forward-alignment/compute';
import { allocateIntergovernmentalGrants } from '../intergovernmental-grants/compute';
import { buildInfrastructureEnvelopeCoherenceReport } from '../infrastructure-envelope-coherence/compute';
import { buildInfrastructureFiscalLoadReport } from '../infrastructure-fiscal-load/compute';
import { summarizeInfrastructureFinancing } from '../infrastructure-financing/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildMultiYearExpenditureFramework } from '../multi-year-framework/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { scheduleRecurringCommitments } from '../recurring-commitments/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import { buildInfrastructureStressEnvelopeBridgeReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

const SAMPLE_PROJECT = {
  projectId: 'iseb_sample',
  title: 'Stress envelope probe',
  regionIds: ['national'],
  capitalPoints: 11,
  maintenancePointsPerTurn: 1.1,
  strategicWeight: 0.55,
  preferredVehicle: 'sovereign_bond_series' as const
};

export function runInfrastructureStressEnvelopeBridgeSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const persisted = createInitialFiscalOutcomesPersisted(9);
  const { state } = computeFiscalOutcomesLayer({ turn: 9, v1012: v }, persisted);
  const infraSummary = summarizeInfrastructureFinancing(9, [SAMPLE_PROJECT], v, state.budget);
  const infraLoad = buildInfrastructureFiscalLoadReport(9, v, infraSummary, state.budget);
  const fiscalStress = buildFiscalStressScenariosReport(9, v);
  const myefo = buildMultiYearExpenditureFramework(v, 3);
  const recurring = scheduleRecurringCommitments(9, v, state.budget);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const supplementary = buildSupplementaryEstimatesReport(9, v);
  const forwardIntegrity = buildForwardEstimatesIntegrityReport(9, v, myefo, supplementary, outlook);
  const growth = buildExpenditureGrowthBenchmarkReport(9, v, myefo, recurring, forwardIntegrity);
  const grants = allocateIntergovernmentalGrants(9, v);
  const grantForward = buildGrantForwardAlignmentReport(9, v, grants, myefo, forwardIntegrity, growth);
  const envelopeCoherence = buildInfrastructureEnvelopeCoherenceReport(9, v, infraLoad, infraSummary, grantForward);
  const healthy = buildInfrastructureStressEnvelopeBridgeReport(9, v, infraLoad, envelopeCoherence, fiscalStress);

  record('ISEB-T01', 'Three infra stress envelope checks', healthy.checks.length === 3, 'ok');
  record(
    'ISEB-T02',
    'Within infra stress envelope band',
    healthy.withinInfraStressEnvelopeBand,
    `gap=${healthy.bridgeGapPoints}`
  );
  record(
    'ISEB-T03',
    'Aligned with envelope coherence',
    healthy.alignedWithEnvelopeCoherence,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
