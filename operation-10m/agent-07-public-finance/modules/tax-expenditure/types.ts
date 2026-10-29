import type { TaxInstrumentKind } from '../fiscal-outcomes/types';

export const TAX_EXPENDITURE_SCHEMA = 'op10m-agent07-tax-expenditure-v1';

export type TaxExpenditureCategory =
  | 'concession'
  | 'exemption'
  | 'deferral'
  | 'credit_offset'
  | 'preferential_rate';

export interface TaxExpenditureMeasure {
  id: string;
  code: string;
  title: string;
  category: TaxExpenditureCategory;
  linkedInstrumentKind: TaxInstrumentKind | null;
  structuralForgonePoints: number;
  /** Share of forgone revenue that reaches households (0..1). */
  householdShare: number;
  sunsetTurn: number | null;
  description: string;
}

export interface TaxExpenditureLine {
  measureId: string;
  code: string;
  forgonePoints: number;
  band: 'material' | 'moderate' | 'minor';
  reviewDue: boolean;
  explanation: string;
}

export interface TaxExpenditureStatement {
  schemaVersion: string;
  turn: number;
  grossStructuralCapacity: number;
  totalForgone: number;
  netStructuralCapacity: number;
  lines: TaxExpenditureLine[];
  materialityThreshold: number;
  warnings: string[];
}
