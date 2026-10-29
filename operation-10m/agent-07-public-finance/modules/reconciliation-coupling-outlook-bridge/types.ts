export const RECONCILIATION_COUPLING_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-reconciliation-coupling-outlook-bridge-v1';

export interface ReconciliationCouplingOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface ReconciliationCouplingOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: ReconciliationCouplingOutlookCheck[];
  bridgeGapPoints: number;
  withinReconciliationCouplingOutlookBand: boolean;
  alignedWithCouplingOutlookBridge: boolean;
  narrative: string;
  warnings: string[];
}
