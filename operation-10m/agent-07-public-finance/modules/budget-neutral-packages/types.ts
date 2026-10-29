export const BUDGET_NEUTRAL_PACKAGES_SCHEMA = 'op10m-agent07-budget-neutral-packages-v1';

export interface BudgetNeutralPackageLine {
  id: string;
  title: string;
  newSpendingPoints: number;
  offsetPoints: number;
  netPoints: number;
  withinNeutralityBand: boolean;
}

export interface BudgetNeutralPackagesReport {
  schemaVersion: string;
  turn: number;
  packages: BudgetNeutralPackageLine[];
  aggregateNewSpending: number;
  aggregateOffsets: number;
  aggregateNetPoints: number;
  withinPortfolioNeutrality: boolean;
  coherentWithSpendingOffsets: boolean;
  narrative: string;
  warnings: string[];
}
