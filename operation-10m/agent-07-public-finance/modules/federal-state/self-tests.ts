import { reconcileFederalStateTransfers, sumTransfersByState } from './reconcile';
import { STATE_FISCAL_PROFILES } from './catalog/state-profiles';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export interface FederalStateSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 6,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 9,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 3,
    debtLevel: partial.debtLevel ?? 10,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runFederalStateReconciliationSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: FederalStateSelfTestResult[];
} {
  const results: FederalStateSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const report = reconcileFederalStateTransfers(6, snap({}));
  record(
    'FS01',
    'IGR reconciliation closes within tolerance',
    report.reconciled,
    `residual=${report.residualFederal}, pool=${report.federalRevenuePool}`
  );

  record(
    'FS02',
    'Eight states × five instruments',
    report.transfers.length === STATE_FISCAL_PROFILES.length * 5,
    `transfers=${report.transfers.length}`
  );

  const nt = sumTransfersByState(report, 'NT');
  const act = sumTransfersByState(report, 'ACT');
  record('FS03', 'Remote NT load exceeds ACT total net', nt > act, `NT=${nt}, ACT=${act}`);

  const waGst = report.transfers.find(t => t.stateCode === 'WA' && t.instrument === 'gst_igr');
  record(
    'FS04',
    'High-capacity WA GST adjustment non-positive',
    (waGst?.adjustmentPoints ?? 0) <= 0,
    `adj=${waGst?.adjustmentPoints}`
  );

  const tas = report.transfers.find(t => t.stateCode === 'TAS' && t.instrument === 'general_purpose');
  record(
    'FS05',
    'Low-capacity TAS receives positive equalization uplift',
    (tas?.adjustmentPoints ?? 0) >= 0 && (tas?.netPoints ?? 0) > 0,
    `net=${tas?.netPoints}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
