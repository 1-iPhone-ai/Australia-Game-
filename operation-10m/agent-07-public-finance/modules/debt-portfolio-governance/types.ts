export const DEBT_PORTFOLIO_GOVERNANCE_SCHEMA = 'op10m-agent07-debt-portfolio-governance-v1';

export type DurationBand = 'short' | 'neutral' | 'long';

export interface DebtPortfolioTranche {
  id: string;
  tenorYears: number;
  weightShare: number;
  rolloverTurns: number;
  concentrationFlag: boolean;
}

export interface DebtPortfolioGovernanceReport {
  schemaVersion: string;
  turn: number;
  tranches: DebtPortfolioTranche[];
  weightedAverageDurationYears: number;
  durationBand: DurationBand;
  maxTrancheShare: number;
  rolloverStressAligned: boolean;
  withinGovernanceTargets: boolean;
  narrative: string;
  warnings: string[];
}
