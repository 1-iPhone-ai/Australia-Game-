export const SOVEREIGN_CREDIT_OUTLOOK_SCHEMA = 'op10m-agent07-sovereign-credit-outlook-v1';

export type CreditOutlookBand = 'stable' | 'negative_watch' | 'pressure' | 'distress';

export interface SovereignCreditOutlookReport {
  schemaVersion: string;
  turn: number;
  impliedSpreadBps: number;
  ratingBand: CreditOutlookBand;
  headroomToDistress: number;
  withinOutlookBand: boolean;
  coherentWithDebtGovernance: boolean;
  narrative: string;
  warnings: string[];
}
