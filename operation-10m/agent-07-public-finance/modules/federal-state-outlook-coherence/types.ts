export const FEDERAL_STATE_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-federal-state-outlook-coherence-v1';

export interface FederalStateOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface FederalStateOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: FederalStateOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinFederalStateOutlookBand: boolean;
  alignedWithFederalGrantCoherence: boolean;
  narrative: string;
  warnings: string[];
}
