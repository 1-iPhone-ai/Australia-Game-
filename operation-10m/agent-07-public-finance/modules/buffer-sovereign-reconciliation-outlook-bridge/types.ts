export const BUFFER_SOVEREIGN_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-buffer-sovereign-reconciliation-outlook-bridge-v1';

export interface BufferSovereignReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface BufferSovereignReconciliationOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: BufferSovereignReconciliationOutlookCheck[];
  bridgeGapPoints: number;
  withinBufferSovereignReconciliationOutlookBand: boolean;
  alignedWithSovereignFiscalReconciliationCoherence: boolean;
  narrative: string;
  warnings: string[];
}
