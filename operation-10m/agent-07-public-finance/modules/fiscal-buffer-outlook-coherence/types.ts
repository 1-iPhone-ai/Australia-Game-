export const FISCAL_BUFFER_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-fiscal-buffer-outlook-coherence-v1';

export interface FiscalBufferOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface FiscalBufferOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: FiscalBufferOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinBufferOutlookBand: boolean;
  alignedWithRiskOutlook: boolean;
  narrative: string;
  warnings: string[];
}
