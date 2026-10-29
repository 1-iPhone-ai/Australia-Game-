import { CoordinationReconcileReport } from './coordination-reconcile.ts';

export interface ReconcileDriftReport {
  driftIndex: number;
  notes: string[];
}

/**
 * Score coordination plan drift from reconcile churn and mutex thrashing.
 */
export function computeReconcileDriftIndex(
  report: CoordinationReconcileReport,
  thrashingRegionCount: number,
): ReconcileDriftReport {
  const notes: string[] = [];
  if (!report.stable) {
    notes.push(`Reconcile unstable: ${report.changes.length} change(s) at turn ${report.turn}`);
  }
  if (thrashingRegionCount > 0) {
    notes.push(`Thrashing regions contribute to drift (${thrashingRegionCount})`);
  }

  const changeSignal = Math.min(60, report.changes.length * 12);
  const thrashSignal = Math.min(40, thrashingRegionCount * 15);
  const unstableBoost = report.stable ? 0 : 18;
  const driftIndex = Math.round(Math.min(100, changeSignal + thrashSignal + unstableBoost));

  return { driftIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamReconcileDrift(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
