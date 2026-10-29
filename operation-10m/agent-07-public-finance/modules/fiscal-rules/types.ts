import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export const FISCAL_RULES_SCHEMA = 'op10m-agent07-fiscal-rules-v1';

export type FiscalRuleId =
  | 'structural_balance_floor'
  | 'spending_growth_anchor'
  | 'debt_service_ceiling'
  | 'contingency_reserve_min'
  | 'tax_to_capacity_cap';

export interface FiscalRuleDefinition {
  id: FiscalRuleId;
  label: string;
  description: string;
  warnOnly: boolean;
  /** Threshold for pass (interpretation varies by rule). */
  threshold: number;
}

export interface FiscalRuleAssessment {
  ruleId: FiscalRuleId;
  label: string;
  compliant: boolean;
  severity: 'info' | 'caution' | 'major';
  observed: number;
  threshold: number;
  detail: string;
}

export interface FiscalRulesFrameworkReport {
  schemaVersion: string;
  turn: number;
  assessments: FiscalRuleAssessment[];
  allCompliant: boolean;
  breachCount: number;
  narrative: string;
}

export interface FiscalRulesInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  envelopeContingencyPoints: number;
  forwardSpendingGrowth: number;
}
