export const LAPSE_CARRY_WARRANT_COHERENCE_SCHEMA =
  'op10m-agent07-lapse-carry-warrant-coherence-v1';

export interface LapseCarryCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface LapseCarryWarrantCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: LapseCarryCheck[];
  aggregateCoherenceGapPoints: number;
  withinLapseCarryBand: boolean;
  alignedWithWarrantLedger: boolean;
  narrative: string;
  warnings: string[];
}
