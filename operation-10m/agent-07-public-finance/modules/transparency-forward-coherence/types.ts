export const TRANSPARENCY_FORWARD_COHERENCE_SCHEMA =
  'op10m-agent07-transparency-forward-coherence-v1';

export interface TransparencyForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface TransparencyForwardCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: TransparencyForwardCheck[];
  aggregateCoherenceGapPoints: number;
  withinTransparencyForwardBand: boolean;
  alignedWithIntegrityBridge: boolean;
  narrative: string;
  warnings: string[];
}
