export const CONTINGENT_LIABILITY_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-contingent-liability-outlook-coherence-v1';

export interface ContingentOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface ContingentLiabilityOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: ContingentOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinContingentOutlookBand: boolean;
  alignedWithContingentForwardBridge: boolean;
  narrative: string;
  warnings: string[];
}
