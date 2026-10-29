export const DEBT_ROLLOVER_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-debt-rollover-outlook-bridge-v1';

export interface DebtRolloverOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface DebtRolloverOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: DebtRolloverOutlookCheck[];
  bridgeGapPoints: number;
  withinDebtRolloverOutlookBand: boolean;
  alignedWithRolloverCoverage: boolean;
  narrative: string;
  warnings: string[];
}
