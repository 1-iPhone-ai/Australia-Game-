export const BUDGET_NEUTRAL_PROGRAM_COHERENCE_SCHEMA =
  'op10m-agent07-budget-neutral-program-coherence-v1';

export interface NeutralProgramCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface BudgetNeutralProgramCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: NeutralProgramCheck[];
  aggregateCoherenceGapPoints: number;
  withinNeutralProgramBand: boolean;
  alignedWithPerformanceFiscalBridge: boolean;
  narrative: string;
  warnings: string[];
}
