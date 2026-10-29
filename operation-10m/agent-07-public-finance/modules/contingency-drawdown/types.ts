export const CONTINGENCY_DRAWDOWN_REGISTER_SCHEMA = 'op10m-agent07-contingency-drawdown-v1';

export type DrawdownReason = 'shock_response' | 'program_overrun' | 'disaster_relief' | 'policy_top_up';

export interface ContingencyDrawdownEntry {
  id: string;
  reason: DrawdownReason;
  label: string;
  drawdownPoints: number;
  remainingFlexPoints: number;
  withinEntryCap: boolean;
}

export interface ContingencyDrawdownRegisterReport {
  schemaVersion: string;
  turn: number;
  entries: ContingencyDrawdownEntry[];
  openingFlexPoints: number;
  aggregateDrawdownPoints: number;
  closingFlexPoints: number;
  drawdownToOpeningRatio: number;
  withinDrawdownCap: boolean;
  coherentWithFiscalRules: boolean;
  narrative: string;
  warnings: string[];
}
