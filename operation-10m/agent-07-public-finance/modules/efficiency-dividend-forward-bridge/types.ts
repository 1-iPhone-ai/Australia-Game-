export const EFFICIENCY_DIVIDEND_FORWARD_BRIDGE_SCHEMA =
  'op10m-agent07-efficiency-dividend-forward-bridge-v1';

export interface EfficiencyDividendForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface EfficiencyDividendForwardBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: EfficiencyDividendForwardCheck[];
  bridgeGapPoints: number;
  withinEfficiencyDividendForwardBand: boolean;
  alignedWithOffsetForwardCoherence: boolean;
  narrative: string;
  warnings: string[];
}
