export const RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-reconciliation-outlook-bridge-v1';

export interface ReconciliationOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ReconciliationOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: ReconciliationOutlookCheck[];
  bridgeGapPoints: number;
  withinReconciliationOutlookBand: boolean;
  alignedWithResilienceBridge: boolean;
  narrative: string;
  warnings: string[];
}
