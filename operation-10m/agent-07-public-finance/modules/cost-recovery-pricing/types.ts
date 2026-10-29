export const COST_RECOVERY_SCHEMA = 'op10m-agent07-cost-recovery-v1';

export type UserChargeCategory =
  | 'water_sewerage'
  | 'road_tolling'
  | 'regulatory_licensing'
  | 'hospital_copayment'
  | 'university_contribution';

export interface CostRecoveryLine {
  category: UserChargeCategory;
  label: string;
  fullCostPoints: number;
  recoveredPoints: number;
  recoveryRatio: number;
  policyTargetRatio: number;
  withinTarget: boolean;
}

export interface CostRecoveryStatement {
  schemaVersion: string;
  turn: number;
  lines: CostRecoveryLine[];
  aggregateFullCost: number;
  aggregateRecovered: number;
  weightedRecoveryRatio: number;
  withinPortfolioTarget: boolean;
  underRecoveryCount: number;
  narrative: string;
  warnings: string[];
}
