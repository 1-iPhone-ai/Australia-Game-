export const GRANT_FISCAL_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-grant-fiscal-reconciliation-outlook-coherence-v1';

export interface GrantFiscalReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface GrantFiscalReconciliationOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: GrantFiscalReconciliationOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinGrantFiscalReconciliationOutlookBand: boolean;
  alignedWithSovereignGrantOutlook: boolean;
  narrative: string;
  warnings: string[];
}
