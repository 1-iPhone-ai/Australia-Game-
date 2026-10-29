export const BALANCE_SHEET_FISCAL_COHERENCE_SCHEMA =
  'op10m-agent07-balance-sheet-fiscal-coherence-v1';

export interface BalanceSheetFiscalCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface BalanceSheetFiscalCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: BalanceSheetFiscalCheck[];
  aggregateCoherenceGapPoints: number;
  withinBalanceFiscalBand: boolean;
  alignedWithStatutoryBalances: boolean;
  narrative: string;
  warnings: string[];
}
