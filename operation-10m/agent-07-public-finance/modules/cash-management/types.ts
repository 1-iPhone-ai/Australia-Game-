export const CASH_MANAGEMENT_SCHEMA = 'op10m-agent07-cash-management-v1';

export type CashRunwayBand = 'comfortable' | 'watch' | 'squeeze' | 'critical';

export interface CashManagementLine {
  id: string;
  label: string;
  openingBalancePoints: number;
  inflowPoints: number;
  outflowPoints: number;
  closingBalancePoints: number;
}

export interface CashManagementReport {
  schemaVersion: string;
  turn: number;
  lines: CashManagementLine[];
  aggregateClosingBalance: number;
  runwayTurns: number;
  runwayBand: CashRunwayBand;
  withinDrawdownLimit: boolean;
  endOfYearSqueeze: boolean;
  narrative: string;
  warnings: string[];
}
