export const CONTINGENCY_FORWARD_COHERENCE_SCHEMA =
  'op10m-agent07-contingency-forward-coherence-v1';

export interface ContingencyForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ContingencyForwardCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: ContingencyForwardCheck[];
  aggregateCoherenceGapPoints: number;
  withinContingencyForwardBand: boolean;
  alignedWithFiscalBuffer: boolean;
  narrative: string;
  warnings: string[];
}
