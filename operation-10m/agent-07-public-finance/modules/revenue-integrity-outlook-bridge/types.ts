export const REVENUE_INTEGRITY_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-revenue-integrity-outlook-bridge-v1';

export interface RevenueIntegrityOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface RevenueIntegrityOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: RevenueIntegrityOutlookCheck[];
  bridgeGapPoints: number;
  withinRevenueIntegrityOutlookBand: boolean;
  alignedWithRevenueAnchor: boolean;
  narrative: string;
  warnings: string[];
}
