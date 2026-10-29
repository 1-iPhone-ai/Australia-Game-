export const CONTINGENT_LIABILITIES_SCHEMA = 'op10m-agent07-contingent-liabilities-v1';

export type ContingentExposureKind =
  | 'state_guarantee'
  | 'ppp_minimum_revenue'
  | 'disaster_reinsurance'
  | 'infrastructure_warranty'
  | 'financial_sector_backstop';

export interface ContingentExposureLine {
  id: string;
  kind: ContingentExposureKind;
  label: string;
  notionalPoints: number;
  probabilityWeight: number;
  warnOnly: boolean;
}

export interface ContingentLiabilityAssessment {
  schemaVersion: string;
  turn: number;
  exposures: ContingentExposureLine[];
  expectedLossPoints: number;
  tailRiskPoints: number;
  offBalanceSheetShare: number;
  stressMultiplier: number;
  withinSoftCap: boolean;
  disclosures: string[];
  warnings: string[];
}
