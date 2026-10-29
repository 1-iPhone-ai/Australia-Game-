export const SOVEREIGN_FISCAL_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-sovereign-fiscal-reconciliation-outlook-coherence-v1';

export interface SovereignFiscalReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface SovereignFiscalReconciliationOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: SovereignFiscalReconciliationOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinSovereignFiscalReconciliationOutlookBand: boolean;
  alignedWithFiscalGrantReconciliationBridge: boolean;
  narrative: string;
  warnings: string[];
}
