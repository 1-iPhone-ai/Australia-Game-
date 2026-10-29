export const RECONCILIATION_RESILIENCE_BRIDGE_SCHEMA =
  'op10m-agent07-reconciliation-resilience-bridge-v1';

export interface ReconciliationResilienceCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface ReconciliationResilienceBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: ReconciliationResilienceCheck[];
  bridgeGapPoints: number;
  withinReconciliationResilienceBand: boolean;
  alignedWithRiskStressCoherence: boolean;
  narrative: string;
  warnings: string[];
}
