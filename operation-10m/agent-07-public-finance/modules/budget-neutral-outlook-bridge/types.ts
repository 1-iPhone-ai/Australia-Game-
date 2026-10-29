export const BUDGET_NEUTRAL_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-budget-neutral-outlook-bridge-v1';

export interface BudgetNeutralOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface BudgetNeutralOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: BudgetNeutralOutlookCheck[];
  bridgeGapPoints: number;
  withinBudgetNeutralOutlookBand: boolean;
  alignedWithNeutralForwardCoherence: boolean;
  narrative: string;
  warnings: string[];
}
