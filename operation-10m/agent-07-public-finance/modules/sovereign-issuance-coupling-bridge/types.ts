export const SOVEREIGN_ISSUANCE_COUPLING_BRIDGE_SCHEMA =
  'op10m-agent07-sovereign-issuance-coupling-bridge-v1';

export interface IssuanceCouplingCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface SovereignIssuanceCouplingBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: IssuanceCouplingCheck[];
  bridgeCouplingGapPoints: number;
  withinIssuanceCouplingBand: boolean;
  alignedWithDebtService: boolean;
  narrative: string;
  warnings: string[];
}
