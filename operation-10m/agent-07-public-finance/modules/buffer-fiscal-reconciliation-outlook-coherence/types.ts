export const BUFFER_FISCAL_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-buffer-fiscal-reconciliation-outlook-coherence-v1';

export interface BufferFiscalReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface BufferFiscalReconciliationOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: BufferFiscalReconciliationOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinBufferFiscalReconciliationOutlookBand: boolean;
  alignedWithGrantSovereignReconciliationBridge: boolean;
  narrative: string;
  warnings: string[];
}
