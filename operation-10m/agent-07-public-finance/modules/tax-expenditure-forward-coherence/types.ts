export const TAX_EXPENDITURE_FORWARD_COHERENCE_SCHEMA =
  'op10m-agent07-tax-expenditure-forward-coherence-v1';

export interface TaxExpenditureForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface TaxExpenditureForwardCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: TaxExpenditureForwardCheck[];
  aggregateCoherenceGapPoints: number;
  withinTaxExpenditureForwardBand: boolean;
  alignedWithIntegrityForwardBridge: boolean;
  narrative: string;
  warnings: string[];
}
