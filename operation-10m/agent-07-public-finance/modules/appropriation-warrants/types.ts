export const APPROPRIATION_WARRANTS_SCHEMA = 'op10m-agent07-appropriation-warrants-v1';

export type WarrantStatus = 'open' | 'partially_lapsed' | 'fully_lapsed' | 'reallocated';

export interface AppropriationWarrantLine {
  warrantId: string;
  portfolio: string;
  appropriationPoints: number;
  warrantIssuedPoints: number;
  warrantRemainingPoints: number;
  lapseRiskPoints: number;
  status: WarrantStatus;
  withinTolerance: boolean;
}

export interface AppropriationWarrantLedger {
  schemaVersion: string;
  turn: number;
  lines: AppropriationWarrantLine[];
  aggregateAppropriation: number;
  aggregateRemaining: number;
  aggregateLapseRisk: number;
  lapseWithinTolerance: boolean;
  reallocationCount: number;
  narrative: string;
  warnings: string[];
}
