export const CONTINGENT_BUFFER_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-contingent-buffer-outlook-coherence-v1';

export interface ContingentBufferOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ContingentBufferOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: ContingentBufferOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinContingentBufferOutlookBand: boolean;
  alignedWithBufferOutlook: boolean;
  narrative: string;
  warnings: string[];
}
