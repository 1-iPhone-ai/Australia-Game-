export const SPENDING_OFFSETS_SCHEMA = 'op10m-agent07-spending-offsets-v1';

export type OffsetMeasureKind = 'efficiency_dividend' | 'program_reprioritisation' | 'revenue_measure' | 'delay_phasing';

export interface SpendingOffsetLine {
  id: string;
  kind: OffsetMeasureKind;
  label: string;
  newSpendingPoints: number;
  offsetPoints: number;
  coverageRatio: number;
  fullyOffset: boolean;
}

export interface SpendingOffsetsReport {
  schemaVersion: string;
  turn: number;
  lines: SpendingOffsetLine[];
  aggregateNewSpending: number;
  aggregateOffsets: number;
  portfolioCoverageRatio: number;
  withinPortfolioTarget: boolean;
  narrative: string;
  warnings: string[];
}
