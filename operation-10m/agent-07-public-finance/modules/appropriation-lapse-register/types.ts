export const APPROPRIATION_LAPSE_REGISTER_SCHEMA = 'op10m-agent07-appropriation-lapse-register-v1';

export type LapseDisposition = 'returned_to_reserve' | 'reallocated' | 'pending_review' | 'lapsed';

export interface AppropriationLapseEntry {
  id: string;
  portfolio: string;
  warrantRemainingPoints: number;
  lapsePoints: number;
  disposition: LapseDisposition;
  withinEntryTolerance: boolean;
}

export interface AppropriationLapseRegisterReport {
  schemaVersion: string;
  turn: number;
  entries: AppropriationLapseEntry[];
  aggregateLapsePoints: number;
  aggregateRemainingPoints: number;
  lapseToRemainingRatio: number;
  withinRegisterTolerance: boolean;
  alignedWithWarrantLedger: boolean;
  narrative: string;
  warnings: string[];
}
