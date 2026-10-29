export const FISCAL_SOVEREIGN_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-fiscal-sovereign-reconciliation-outlook-bridge-v1';

export interface FiscalSovereignReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface FiscalSovereignReconciliationOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: FiscalSovereignReconciliationOutlookCheck[];
  bridgeGapPoints: number;
  withinFiscalSovereignReconciliationOutlookBand: boolean;
  alignedWithGrantFiscalReconciliationCoherence: boolean;
  narrative: string;
  warnings: string[];
}
