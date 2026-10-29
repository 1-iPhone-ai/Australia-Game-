export const INFRASTRUCTURE_LOAD_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-infrastructure-load-outlook-bridge-v1';

export interface InfraLoadOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface InfrastructureLoadOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: InfraLoadOutlookCheck[];
  bridgeGapPoints: number;
  withinInfraLoadOutlookBand: boolean;
  alignedWithEnvelopeCoherence: boolean;
  narrative: string;
  warnings: string[];
}
