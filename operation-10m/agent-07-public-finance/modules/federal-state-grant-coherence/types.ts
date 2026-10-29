export const FEDERAL_STATE_GRANT_COHERENCE_SCHEMA =
  'op10m-agent07-federal-state-grant-coherence-v1';

export interface FederalGrantCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface FederalStateGrantCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: FederalGrantCheck[];
  aggregateCoherenceGapPoints: number;
  withinFederalGrantBand: boolean;
  alignedWithClawbackForward: boolean;
  narrative: string;
  warnings: string[];
}
