export const GRANT_CLAWBACK_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-grant-clawback-outlook-bridge-v1';

export interface GrantClawbackOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface GrantClawbackOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: GrantClawbackOutlookCheck[];
  bridgeGapPoints: number;
  withinGrantClawbackOutlookBand: boolean;
  alignedWithClawbackForward: boolean;
  narrative: string;
  warnings: string[];
}
