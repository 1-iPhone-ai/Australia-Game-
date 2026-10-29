export const BUDGET_NEUTRAL_FORWARD_COHERENCE_SCHEMA =
  'op10m-agent07-budget-neutral-forward-coherence-v1';

export interface NeutralForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface BudgetNeutralForwardCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: NeutralForwardCheck[];
  aggregateNeutralGapPoints: number;
  withinNeutralForwardBand: boolean;
  alignedWithGrantForward: boolean;
  narrative: string;
  warnings: string[];
}
