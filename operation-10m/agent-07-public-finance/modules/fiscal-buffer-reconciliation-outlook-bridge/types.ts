export const FISCAL_BUFFER_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-fiscal-buffer-reconciliation-outlook-bridge-v1';

export interface FiscalBufferReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface FiscalBufferReconciliationOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: FiscalBufferReconciliationOutlookCheck[];
  bridgeGapPoints: number;
  withinFiscalBufferReconciliationOutlookBand: boolean;
  alignedWithGrantReconciliationBridge: boolean;
  narrative: string;
  warnings: string[];
}
