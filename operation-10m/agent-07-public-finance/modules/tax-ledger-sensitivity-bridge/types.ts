export const TAX_LEDGER_SENSITIVITY_BRIDGE_SCHEMA =
  'op10m-agent07-tax-ledger-sensitivity-bridge-v1';

export interface TaxLedgerCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface TaxLedgerSensitivityBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: TaxLedgerCheck[];
  bridgeGapPoints: number;
  withinTaxLedgerBand: boolean;
  alignedWithTaxSensitivity: boolean;
  narrative: string;
  warnings: string[];
}
