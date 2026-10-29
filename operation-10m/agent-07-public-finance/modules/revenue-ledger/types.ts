import type { ActiveTaxInstrument, V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export const REVENUE_LEDGER_SCHEMA = 'op10m-agent07-revenue-ledger-v1';

export type RevenueStreamKind =
  | 'tax_instrument'
  | 'resource_volatility'
  | 'carbon_market'
  | 'policy_dividend'
  | 'transfers_in'
  | 'one_off_receipt';

export interface RevenueStreamLine {
  id: string;
  kind: RevenueStreamKind;
  label: string;
  baseCapacityPoints: number;
  deltaPoints: number;
  volatilityBand: 'low' | 'medium' | 'high';
  sourceInstrumentId: string | null;
  explanation: string;
}

export interface NationalRevenueLedger {
  schemaVersion: string;
  turn: number;
  structuralCapacity: number;
  currentCapacity: number;
  streams: RevenueStreamLine[];
  totalDelta: number;
  reconciledToV1012: boolean;
  reconciliationNotes: string[];
}

export interface RevenueLedgerInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  taxInstruments: ActiveTaxInstrument[];
}
