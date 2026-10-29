export const GRANT_CLAWBACK_FORWARD_COHERENCE_SCHEMA =
  'op10m-agent07-grant-clawback-forward-coherence-v1';

export interface ClawbackForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface GrantClawbackForwardCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: ClawbackForwardCheck[];
  aggregateClawbackGapPoints: number;
  withinClawbackForwardBand: boolean;
  alignedWithGrantForward: boolean;
  narrative: string;
  warnings: string[];
}
