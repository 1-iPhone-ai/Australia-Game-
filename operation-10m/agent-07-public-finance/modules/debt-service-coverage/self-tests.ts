import { buildDebtServiceCoverageReport } from './compute';
import { buildCashManagementReport } from '../cash-management/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 14,
    revenueCapacity: partial.revenueCapacity ?? 72,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 26,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

function ledgerFor(turn: number, v1012: V1012FiscalSnapshot) {
  const persisted = createInitialFiscalOutcomesPersisted(turn);
  const { state } = computeFiscalOutcomesLayer({ turn, v1012 }, persisted);
  return buildNationalRevenueLedger({ turn, v1012, taxInstruments: state.taxInstruments });
}

export function runDebtServiceCoverageSelfTests(): {
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
  const cash = buildCashManagementReport(14, v);
  const healthy = buildDebtServiceCoverageReport(14, v, ledgerFor(14, v), cash);

  record('DSC01', 'Healthy within coverage floor', healthy.withinCoverageFloor, healthy.narrative);
  record('DSC02', 'Runway aligned under healthy', healthy.runwayTurnsAligned, `runway=${cash.runwayTurns}`);
  record(
    'DSC03',
    'Coverage ratio matches revenue over service',
    Math.abs(healthy.coverageRatio - healthy.revenueCoverPoints / Math.max(0.1, healthy.debtServicePoints)) < 0.05,
    `ratio=${healthy.coverageRatio}`
  );

  const thin = buildDebtServiceCoverageReport(
    14,
    snap({ debtServiceLoad: 22, debtLevel: 60, fiscalHeadroom: -4 }),
    ledgerFor(14, snap({ debtServiceLoad: 22 })),
    buildCashManagementReport(14, snap({ debtServiceLoad: 22, fiscalHeadroom: -4 }))
  );
  record(
    'DSC04',
    'High service load lowers coverage vs healthy',
    thin.coverageRatio < healthy.coverageRatio,
    `${thin.coverageRatio} vs ${healthy.coverageRatio}`
  );

  const critical = buildDebtServiceCoverageReport(14, snap({ pressure: 'critical' }), ledgerFor(14, snap({ pressure: 'critical' })), cash);
  record('DSC05', 'Critical overrides coverage floor', critical.withinCoverageFloor, 'ok');

  record('DSC06', 'Adequate or strong band under healthy', healthy.coverageBand === 'adequate' || healthy.coverageBand === 'strong', healthy.coverageBand);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
