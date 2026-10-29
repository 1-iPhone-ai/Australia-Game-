export const SOVEREIGN_ISSUANCE_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-sovereign-issuance-outlook-coherence-v1';

export interface SovereignIssuanceOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface SovereignIssuanceOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: SovereignIssuanceOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinIssuanceOutlookBand: boolean;
  alignedWithIssuanceCoupling: boolean;
  narrative: string;
  warnings: string[];
}
