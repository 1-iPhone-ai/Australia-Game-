export const APPROPRIATION_CARRY_FORWARD_SCHEMA = 'op10m-agent07-appropriation-carry-forward-v1';

export interface CarryForwardLine {
  id: string;
  portfolio: string;
  carryForwardPoints: number;
  sourceLapsePoints: number;
  envelopeShare: number;
  withinLineCap: boolean;
}

export interface AppropriationCarryForwardReport {
  schemaVersion: string;
  turn: number;
  lines: CarryForwardLine[];
  aggregateCarryForwardPoints: number;
  aggregateSourceLapsePoints: number;
  carryToEnvelopeRatio: number;
  withinPortfolioCarryCap: boolean;
  alignedWithLapseRegister: boolean;
  narrative: string;
  warnings: string[];
}
