export const FISCAL_GRANT_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-fiscal-grant-reconciliation-outlook-coherence-v1';

export interface FiscalGrantReconciliationOutlookCoherenceCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface FiscalGrantReconciliationOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: FiscalGrantReconciliationOutlookCoherenceCheck[];
  aggregateCoherenceGapPoints: number;
  withinFiscalGrantReconciliationOutlookCoherenceBand: boolean;
  alignedWithBufferSovereignReconciliationBridge: boolean;
  narrative: string;
  warnings: string[];
}
