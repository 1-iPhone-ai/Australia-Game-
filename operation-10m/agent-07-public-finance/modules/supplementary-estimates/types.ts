export const SUPPLEMENTARY_ESTIMATES_SCHEMA = 'op10m-agent07-supplementary-estimates-v1';

export type SupplementaryEstimateKind = 'myefo' | 'additional_estimates' | 'decision_variation';

export interface SupplementaryEstimateLine {
  id: string;
  kind: SupplementaryEstimateKind;
  portfolioId: string;
  label: string;
  baselinePoints: number;
  revisionPoints: number;
  netDeltaPoints: number;
  withinForwardBand: boolean;
}

export interface SupplementaryEstimatesReport {
  schemaVersion: string;
  turn: number;
  lines: SupplementaryEstimateLine[];
  aggregateUpwardRevision: number;
  aggregateDownwardRevision: number;
  netRevisionPoints: number;
  withinRevisionTolerance: boolean;
  narrative: string;
  warnings: string[];
}
