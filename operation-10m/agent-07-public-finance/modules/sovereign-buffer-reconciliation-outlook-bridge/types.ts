export const SOVEREIGN_BUFFER_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-sovereign-buffer-reconciliation-outlook-bridge-v1';

export interface SovereignBufferReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface SovereignBufferReconciliationOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: SovereignBufferReconciliationOutlookCheck[];
  bridgeGapPoints: number;
  withinSovereignBufferReconciliationOutlookBand: boolean;
  alignedWithFiscalBufferReconciliationBridge: boolean;
  narrative: string;
  warnings: string[];
}
