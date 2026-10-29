export const SOVEREIGN_ISSUANCE_SCHEMA = 'op10m-agent07-sovereign-issuance-v1';

export type IssuanceTenorBucket = 'short' | 'medium' | 'long' | 'index_linked';

export interface IssuanceProgramLine {
  id: string;
  tenor: IssuanceTenorBucket;
  scheduledTurn: number;
  targetVolumePoints: number;
  minimumBidToCover: number;
  actualBidToCover: number | null;
  issuedVolumePoints: number;
  deferred: boolean;
  explanation: string;
}

export interface SovereignIssuanceCalendar {
  schemaVersion: string;
  turn: number;
  lines: IssuanceProgramLine[];
  totalScheduled: number;
  totalIssued: number;
  weightedAverageTenorYears: number;
  liquidityShortfall: boolean;
  warnings: string[];
}
