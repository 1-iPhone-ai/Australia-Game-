export const DEBT_SERVICE_FORWARD_COHERENCE_SCHEMA =
  'op10m-agent07-debt-service-forward-coherence-v1';

export interface DebtServiceForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface DebtServiceForwardCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: DebtServiceForwardCheck[];
  aggregateCoherenceGapPoints: number;
  withinDebtServiceForwardBand: boolean;
  alignedWithForwardReconciliation: boolean;
  narrative: string;
  warnings: string[];
}
