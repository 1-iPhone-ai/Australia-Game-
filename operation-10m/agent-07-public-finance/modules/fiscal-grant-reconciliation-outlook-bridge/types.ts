export const FISCAL_GRANT_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-fiscal-grant-reconciliation-outlook-bridge-v1';

export interface FiscalGrantReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface FiscalGrantReconciliationOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: FiscalGrantReconciliationOutlookCheck[];
  bridgeGapPoints: number;
  withinFiscalGrantReconciliationOutlookBand: boolean;
  alignedWithBufferFiscalReconciliationCoherence: boolean;
  narrative: string;
  warnings: string[];
}
