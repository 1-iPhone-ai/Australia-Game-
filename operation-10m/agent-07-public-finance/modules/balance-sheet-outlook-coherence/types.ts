export const BALANCE_SHEET_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-balance-sheet-outlook-coherence-v1';

export interface BalanceSheetOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface BalanceSheetOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: BalanceSheetOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinBalanceSheetOutlookBand: boolean;
  alignedWithBalanceFiscalCoherence: boolean;
  narrative: string;
  warnings: string[];
}
