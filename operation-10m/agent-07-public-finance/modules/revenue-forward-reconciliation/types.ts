export const REVENUE_FORWARD_RECONCILIATION_SCHEMA = 'op10m-agent07-revenue-forward-reconciliation-v1';

export interface RevenueForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface RevenueForwardReconciliationReport {
  schemaVersion: string;
  turn: number;
  checks: RevenueForwardCheck[];
  aggregateGapPoints: number;
  allPassed: boolean;
  alignedWithGrowthBenchmark: boolean;
  narrative: string;
  warnings: string[];
}
