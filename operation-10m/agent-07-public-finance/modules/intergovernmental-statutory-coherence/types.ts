export const INTERGOVERNMENTAL_STATUTORY_COHERENCE_SCHEMA =
  'op10m-agent07-intergovernmental-statutory-coherence-v1';

export interface IgrStatutoryCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface IntergovernmentalStatutoryCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: IgrStatutoryCheck[];
  aggregateCoherenceGapPoints: number;
  withinIgrStatutoryBand: boolean;
  alignedWithGrantPool: boolean;
  narrative: string;
  warnings: string[];
}
