export const PORTFOLIO_REPRIORITISATION_LEDGER_SCHEMA =
  'op10m-agent07-portfolio-reprioritisation-ledger-v1';

export interface ReprioritisationLine {
  id: string;
  label: string;
  plannedShiftPoints: number;
  realizedShiftPoints: number;
  withinLineEnvelope: boolean;
}

export interface PortfolioReprioritisationLedgerReport {
  schemaVersion: string;
  turn: number;
  lines: ReprioritisationLine[];
  aggregatePlannedPoints: number;
  aggregateRealizedPoints: number;
  withinPortfolioEnvelope: boolean;
  alignedWithEfficiencyDividend: boolean;
  narrative: string;
  warnings: string[];
}
