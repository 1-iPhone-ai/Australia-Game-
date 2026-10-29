export const PROGRAM_PERFORMANCE_FISCAL_BRIDGE_SCHEMA =
  'op10m-agent07-program-performance-fiscal-bridge-v1';

export interface PerformanceFiscalCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ProgramPerformanceFiscalBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: PerformanceFiscalCheck[];
  bridgeFeedbackGapPoints: number;
  withinPerformanceFiscalBand: boolean;
  alignedWithSpendingOffsets: boolean;
  narrative: string;
  warnings: string[];
}
