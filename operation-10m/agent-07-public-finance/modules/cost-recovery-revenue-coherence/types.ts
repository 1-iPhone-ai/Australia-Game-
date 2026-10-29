export const COST_RECOVERY_REVENUE_COHERENCE_SCHEMA =
  'op10m-agent07-cost-recovery-revenue-coherence-v1';

export interface CostRecoveryCoherenceCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface CostRecoveryRevenueCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: CostRecoveryCoherenceCheck[];
  aggregateCoherenceGapPoints: number;
  withinRecoveryRevenueBand: boolean;
  alignedWithIntegrityBridge: boolean;
  narrative: string;
  warnings: string[];
}
