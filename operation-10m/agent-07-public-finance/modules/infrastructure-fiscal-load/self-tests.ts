import { summarizeInfrastructureFinancing } from '../infrastructure-financing/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildInfrastructureFiscalLoadReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 67,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

const SAMPLE_PROJECT = {
  projectId: 'ifl_sample',
  title: 'Sample corridor',
  regionIds: ['national'],
  capitalPoints: 12,
  maintenancePointsPerTurn: 1.2,
  strategicWeight: 0.6,
  preferredVehicle: 'sovereign_bond_series' as const
};

export function runInfrastructureFiscalLoadSelfTests(): {
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
  const persisted = createInitialFiscalOutcomesPersisted(8);
  const { state } = computeFiscalOutcomesLayer({ turn: 8, v1012: v }, persisted);
  const infra = summarizeInfrastructureFinancing(8, [SAMPLE_PROJECT], v, state.budget);
  const healthy = buildInfrastructureFiscalLoadReport(8, v, infra, state.budget);

  record('IFL01', 'At least one infra load line', healthy.lines.length >= 1, 'ok');
  record('IFL02', 'Healthy within portfolio load cap', healthy.withinPortfolioLoadCap, healthy.narrative);
  record('IFL03', 'Feasible under envelope', healthy.feasibleUnderEnvelope, 'ok');

  const heavy = buildInfrastructureFiscalLoadReport(
    8,
    snap({ maintenanceLoad: 18, fiscalHeadroom: -5 }),
    summarizeInfrastructureFinancing(
      8,
      [{ ...SAMPLE_PROJECT, capitalPoints: 28, maintenancePointsPerTurn: 3.5 }],
      snap({ maintenanceLoad: 18 }),
      computeFiscalOutcomesLayer({ turn: 8, v1012: snap({ maintenanceLoad: 18 }) }, createInitialFiscalOutcomesPersisted(8)).state.budget
    ),
    computeFiscalOutcomesLayer({ turn: 8, v1012: snap({ maintenanceLoad: 18 }) }, createInitialFiscalOutcomesPersisted(8)).state.budget
  );
  record(
    'IFL04',
    'Heavier project raises load ratio vs healthy',
    heavy.loadToCapacityRatio >= healthy.loadToCapacityRatio,
    `${heavy.loadToCapacityRatio} vs ${healthy.loadToCapacityRatio}`
  );

  const critical = buildInfrastructureFiscalLoadReport(8, snap({ pressure: 'critical' }), infra, state.budget);
  record('IFL05', 'Critical overrides load cap', critical.withinPortfolioLoadCap, 'ok');

  record(
    'IFL06',
    'Envelope capacity positive',
    healthy.envelopeCapacityPoints > 0,
    `cap=${healthy.envelopeCapacityPoints}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
