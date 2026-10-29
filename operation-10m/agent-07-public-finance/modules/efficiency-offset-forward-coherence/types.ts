export const EFFICIENCY_OFFSET_FORWARD_COHERENCE_SCHEMA =
  'op10m-agent07-efficiency-offset-forward-coherence-v1';

export interface EfficiencyOffsetForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface EfficiencyOffsetForwardCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: EfficiencyOffsetForwardCheck[];
  aggregateCoherenceGapPoints: number;
  withinEfficiencyOffsetForwardBand: boolean;
  alignedWithRevenueForward: boolean;
  narrative: string;
  warnings: string[];
}
