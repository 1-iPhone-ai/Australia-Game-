export const APPROPRIATION_TIMING_COHERENCE_SCHEMA = 'op10m-agent07-appropriation-timing-coherence-v1';

export interface TimingCoherenceCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface AppropriationTimingCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: TimingCoherenceCheck[];
  aggregateTimingGapPoints: number;
  withinTimingWindow: boolean;
  coherentWithCarryForward: boolean;
  narrative: string;
  warnings: string[];
}
