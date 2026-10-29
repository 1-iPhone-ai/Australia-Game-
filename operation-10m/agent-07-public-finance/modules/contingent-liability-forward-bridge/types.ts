export const CONTINGENT_LIABILITY_FORWARD_BRIDGE_SCHEMA =
  'op10m-agent07-contingent-liability-forward-bridge-v1';

export interface ContingentForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ContingentLiabilityForwardBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: ContingentForwardCheck[];
  bridgeExposureGapPoints: number;
  withinContingentForwardBand: boolean;
  alignedWithStressBridge: boolean;
  narrative: string;
  warnings: string[];
}
