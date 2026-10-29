export const DEBT_SERVICE_COVERAGE_SCHEMA = 'op10m-agent07-debt-service-coverage-v1';

export type CoverageBand = 'strong' | 'adequate' | 'thin' | 'breach';

export interface DebtServiceCoverageReport {
  schemaVersion: string;
  turn: number;
  revenueCoverPoints: number;
  debtServicePoints: number;
  coverageRatio: number;
  coverageBand: CoverageBand;
  runwayTurnsAligned: boolean;
  withinCoverageFloor: boolean;
  narrative: string;
  warnings: string[];
}
