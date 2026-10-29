export const CONTINGENCY_OUTLOOK_INTEGRITY_BRIDGE_SCHEMA =
  'op10m-agent07-contingency-outlook-integrity-bridge-v1';

export interface ContingencyOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ContingencyOutlookIntegrityBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: ContingencyOutlookCheck[];
  bridgeGapPoints: number;
  withinContingencyOutlookBand: boolean;
  alignedWithForwardIntegrity: boolean;
  narrative: string;
  warnings: string[];
}
