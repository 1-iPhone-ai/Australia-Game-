export const FISCAL_RISK_REGISTER_SCHEMA = 'op10m-agent07-fiscal-risk-register-v1';

export type FiscalRiskCategory =
  | 'revenue_volatility'
  | 'debt_rollover'
  | 'demand_pressure'
  | 'commodity_exposure'
  | 'policy_reversal'
  | 'intergovernmental_clawback';

export interface FiscalRiskEntry {
  id: string;
  category: FiscalRiskCategory;
  label: string;
  likelihood: number;
  impactPoints: number;
  mitigationReady: boolean;
  warnOnly: boolean;
}

export interface FiscalRiskRegisterReport {
  schemaVersion: string;
  turn: number;
  entries: FiscalRiskEntry[];
  aggregateHeat: number;
  highImpactCount: number;
  unmitigatedCount: number;
  withinRiskAppetite: boolean;
  tier: 'low' | 'elevated' | 'severe';
  narrative: string;
  warnings: string[];
}
