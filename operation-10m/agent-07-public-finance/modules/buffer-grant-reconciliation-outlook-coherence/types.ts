export const BUFFER_GRANT_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-buffer-grant-reconciliation-outlook-coherence-v1';

export interface BufferGrantReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface BufferGrantReconciliationOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: BufferGrantReconciliationOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinBufferGrantReconciliationOutlookBand: boolean;
  alignedWithSovereignBufferReconciliationBridge: boolean;
  narrative: string;
  warnings: string[];
}
