export const TAX_SENSITIVITY_INTEGRITY_COHERENCE_SCHEMA =
  'op10m-agent07-tax-sensitivity-integrity-coherence-v1';

export interface TaxSensitivityIntegrityCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface TaxSensitivityIntegrityCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: TaxSensitivityIntegrityCheck[];
  aggregateCoherenceGapPoints: number;
  withinTaxSensitivityIntegrityBand: boolean;
  alignedWithIntegrityAudit: boolean;
  narrative: string;
  warnings: string[];
}
