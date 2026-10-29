export const INFRASTRUCTURE_ENVELOPE_COHERENCE_SCHEMA =
  'op10m-agent07-infrastructure-envelope-coherence-v1';

export interface InfraEnvelopeCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface InfrastructureEnvelopeCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: InfraEnvelopeCheck[];
  aggregateCoherenceGapPoints: number;
  withinEnvelopeCoherence: boolean;
  alignedWithGrantForward: boolean;
  narrative: string;
  warnings: string[];
}
