export const REVENUE_INTEGRITY_FORWARD_BRIDGE_SCHEMA =
  'op10m-agent07-revenue-integrity-forward-bridge-v1';

export interface IntegrityForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface RevenueIntegrityForwardBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: IntegrityForwardCheck[];
  bridgeGapPoints: number;
  withinIntegrityForwardBand: boolean;
  alignedWithRevenueAnchor: boolean;
  narrative: string;
  warnings: string[];
}
