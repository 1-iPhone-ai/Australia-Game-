export const GRANT_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-grant-reconciliation-outlook-bridge-v1';

export interface GrantReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface GrantReconciliationOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: GrantReconciliationOutlookCheck[];
  bridgeGapPoints: number;
  withinGrantReconciliationOutlookBand: boolean;
  alignedWithReconciliationCouplingBridge: boolean;
  narrative: string;
  warnings: string[];
}
