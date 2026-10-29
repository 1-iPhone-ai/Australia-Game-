export const GRANT_SOVEREIGN_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-grant-sovereign-reconciliation-outlook-bridge-v1';

export interface GrantSovereignReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface GrantSovereignReconciliationOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: GrantSovereignReconciliationOutlookCheck[];
  bridgeGapPoints: number;
  withinGrantSovereignReconciliationOutlookBand: boolean;
  alignedWithBufferGrantReconciliationCoherence: boolean;
  narrative: string;
  warnings: string[];
}
