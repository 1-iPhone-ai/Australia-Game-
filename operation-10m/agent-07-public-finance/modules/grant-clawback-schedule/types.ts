export const GRANT_CLAWBACK_SCHEDULE_SCHEMA = 'op10m-agent07-grant-clawback-schedule-v1';

export interface GrantClawbackTranche {
  id: string;
  grantProgramId: string;
  label: string;
  scheduledPoints: number;
  performanceGatePassed: boolean;
  withinScheduleBand: boolean;
}

export interface GrantClawbackScheduleReport {
  schemaVersion: string;
  turn: number;
  tranches: GrantClawbackTranche[];
  aggregateScheduledPoints: number;
  aggregateClawbackPoints: number;
  scheduleToClawbackRatio: number;
  withinScheduleTolerance: boolean;
  alignedWithIgrPool: boolean;
  narrative: string;
  warnings: string[];
}
