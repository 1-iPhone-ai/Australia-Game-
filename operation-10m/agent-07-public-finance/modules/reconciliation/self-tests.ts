import {
  computeFiscalOutcomesLayer,
  createInitialFiscalOutcomesPersisted
} from '../fiscal-outcomes/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { summarizeInfrastructureFinancing } from '../infrastructure-financing/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import { runFiscalReconciliation } from './reconcile';

export interface ReconciliationSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 1,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 8,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 3,
    debtLevel: partial.debtLevel ?? 12,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runAgent07ReconciliationSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: ReconciliationSelfTestResult[];
} {
  const results: ReconciliationSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const persisted = createInitialFiscalOutcomesPersisted();
  const inputs = { turn: 4, v1012: snap({ debtEnabled: true, fiscalHeadroom: 5 }) };
  const { state } = computeFiscalOutcomesLayer(inputs, persisted);
  const ledger = buildNationalRevenueLedger({
    turn: inputs.turn,
    v1012: inputs.v1012,
    taxInstruments: state.taxInstruments
  });
  const infra = summarizeInfrastructureFinancing(
    inputs.turn,
    [
      {
        projectId: 'mp_western_rail',
        title: 'Western Rail Upgrade',
        regionIds: ['WA'],
        capitalPoints: 24,
        maintenancePointsPerTurn: 2,
        strategicWeight: 0.8,
        preferredVehicle: 'debt_funded_acceleration'
      }
    ],
    inputs.v1012,
    state.budget
  );

  const report = runFiscalReconciliation({
    turn: inputs.turn,
    v1012: inputs.v1012,
    envelope: state.budget,
    revenueLedger: ledger,
    infraSummary: infra,
    actorCashProbe: 999_999
  });

  record('RC01', 'Full stack reconciliation allPassed', report.allPassed, `${report.checks.length} checks`);
  record(
    'RC02',
    'Infrastructure plan feasible under healthy pressure',
    infra.plans[0]?.feasible === true,
    `warnings=${infra.plans[0]?.warnings.length ?? 0}`
  );

  const critical = computeFiscalOutcomesLayer(
    { turn: 2, v1012: snap({ pressure: 'critical', fiscalHeadroom: -10 }) },
    persisted
  ).state;
  const criticalReport = runFiscalReconciliation({
    turn: 2,
    v1012: snap({ pressure: 'critical', fiscalHeadroom: -10 }),
    envelope: critical.budget,
    revenueLedger: buildNationalRevenueLedger({
      turn: 2,
      v1012: snap({ pressure: 'critical', fiscalHeadroom: -10 }),
      taxInstruments: critical.taxInstruments
    }),
    infraSummary: null
  });
  record(
    'RC03',
    'Critical headroom fails rebalance check intentionally',
    criticalReport.checks.find(c => c.id === 'R02')?.passed === true,
    criticalReport.checks.find(c => c.id === 'R02')?.detail ?? ''
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
