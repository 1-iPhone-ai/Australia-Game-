export const TAX_POLICY_SENSITIVITY_SCHEMA = 'op10m-agent07-tax-policy-sensitivity-v1';

export type TaxPolicyLever = 'personal_income' | 'company_tax' | 'consumption_base' | 'resource_rent';

export interface TaxPolicySensitivityLine {
  id: string;
  lever: TaxPolicyLever;
  label: string;
  marginalRevenuePoints: number;
  elasticity: number;
  withinSensitivityBand: boolean;
}

export interface TaxPolicySensitivityReport {
  schemaVersion: string;
  turn: number;
  lines: TaxPolicySensitivityLine[];
  aggregateMarginalPoints: number;
  modeledUpliftPoints: number;
  withinAggregateBand: boolean;
  coherentWithLedgerDelta: boolean;
  narrative: string;
  warnings: string[];
}
