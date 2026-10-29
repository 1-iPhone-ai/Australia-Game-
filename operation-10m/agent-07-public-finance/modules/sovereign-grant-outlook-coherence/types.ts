export const SOVEREIGN_GRANT_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-sovereign-grant-outlook-coherence-v1';

export interface SovereignGrantOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface SovereignGrantOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: SovereignGrantOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinSovereignGrantOutlookBand: boolean;
  alignedWithGrantReconciliationOutlook: boolean;
  narrative: string;
  warnings: string[];
}
