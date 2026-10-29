export const MEDIUM_TERM_ANCHOR_INTEGRITY_COHERENCE_SCHEMA =
  'op10m-agent07-medium-term-anchor-integrity-coherence-v1';

export interface AnchorIntegrityCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface MediumTermAnchorIntegrityCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: AnchorIntegrityCheck[];
  aggregateCoherenceGapPoints: number;
  withinAnchorIntegrityBand: boolean;
  alignedWithIntegrityForwardBridge: boolean;
  narrative: string;
  warnings: string[];
}
