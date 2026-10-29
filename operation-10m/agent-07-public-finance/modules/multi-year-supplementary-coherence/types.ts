export const MULTI_YEAR_SUPPLEMENTARY_COHERENCE_SCHEMA =
  'op10m-agent07-multi-year-supplementary-coherence-v1';

export interface MyefoSupplementaryCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface MultiYearSupplementaryCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: MyefoSupplementaryCheck[];
  aggregateCoherenceGapPoints: number;
  withinMyefoSupplementaryBand: boolean;
  alignedWithForwardIntegrity: boolean;
  narrative: string;
  warnings: string[];
}
