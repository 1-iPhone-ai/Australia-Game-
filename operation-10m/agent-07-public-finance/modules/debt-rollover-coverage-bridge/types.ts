export const DEBT_ROLLOVER_COVERAGE_BRIDGE_SCHEMA =
  'op10m-agent07-debt-rollover-coverage-bridge-v1';

export interface RolloverCoverageCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface DebtRolloverCoverageBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: RolloverCoverageCheck[];
  bridgeGapPoints: number;
  withinRolloverCoverageBand: boolean;
  alignedWithIssuanceCoupling: boolean;
  narrative: string;
  warnings: string[];
}
