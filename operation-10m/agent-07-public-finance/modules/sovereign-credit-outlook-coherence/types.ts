export const SOVEREIGN_CREDIT_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-sovereign-credit-outlook-coherence-v1';

export interface SovereignCreditOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface SovereignCreditOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: SovereignCreditOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinSovereignCreditOutlookBand: boolean;
  alignedWithDebtGovernance: boolean;
  narrative: string;
  warnings: string[];
}
