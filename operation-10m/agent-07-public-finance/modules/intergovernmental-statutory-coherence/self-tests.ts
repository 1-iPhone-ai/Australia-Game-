import { reconcileFederalStateTransfers } from '../federal-state/reconcile';
import { allocateIntergovernmentalGrants } from '../intergovernmental-grants/compute';
import { buildStatutoryBalancesReport } from '../statutory-balances/compute';
import { buildIntergovernmentalStatutoryCoherenceReport } from './compute';
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

export function runIntergovernmentalStatutoryCoherenceSelfTests(): {
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
  const igr = reconcileFederalStateTransfers(9, v);
  const grants = allocateIntergovernmentalGrants(9, v);
  const statutory = buildStatutoryBalancesReport(9, v);
  const healthy = buildIntergovernmentalStatutoryCoherenceReport(9, v, igr, statutory, grants);

  record('IGSC-T01', 'Three IGR statutory checks', healthy.checks.length === 3, 'ok');
  record(
    'IGSC-T02',
    'Within IGR statutory band',
    healthy.withinIgrStatutoryBand,
    `gap=${healthy.aggregateCoherenceGapPoints}`
  );
  record(
    'IGSC-T03',
    'Aligned with grant pool',
    healthy.alignedWithGrantPool,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
