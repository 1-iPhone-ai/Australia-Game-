export const SOVEREIGN_CONTINGENT_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-sovereign-contingent-outlook-coherence-v1';

export interface SovereignContingentOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface SovereignContingentOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: SovereignContingentOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinSovereignContingentOutlookBand: boolean;
  alignedWithContingentBufferOutlook: boolean;
  narrative: string;
  warnings: string[];
}
