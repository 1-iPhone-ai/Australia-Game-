export const EFFICIENCY_DIVIDEND_REGISTER_SCHEMA = 'op10m-agent07-efficiency-dividend-register-v1';

export interface EfficiencyDividendLine {
  id: string;
  label: string;
  scheduledPoints: number;
  realizedPoints: number;
  realizationRatio: number;
  withinLineSchedule: boolean;
}

export interface EfficiencyDividendRegisterReport {
  schemaVersion: string;
  turn: number;
  lines: EfficiencyDividendLine[];
  aggregateScheduledPoints: number;
  aggregateRealizedPoints: number;
  scheduleToRealizationRatio: number;
  withinPortfolioSchedule: boolean;
  coherentWithSpendingOffsets: boolean;
  narrative: string;
  warnings: string[];
}
