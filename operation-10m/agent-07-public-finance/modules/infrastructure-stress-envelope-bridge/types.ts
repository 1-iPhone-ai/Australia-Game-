export const INFRASTRUCTURE_STRESS_ENVELOPE_BRIDGE_SCHEMA =
  'op10m-agent07-infrastructure-stress-envelope-bridge-v1';

export interface InfraStressEnvelopeCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface InfrastructureStressEnvelopeBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: InfraStressEnvelopeCheck[];
  bridgeGapPoints: number;
  withinInfraStressEnvelopeBand: boolean;
  alignedWithEnvelopeCoherence: boolean;
  narrative: string;
  warnings: string[];
}
