export const RECURRING_FORWARD_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-recurring-forward-outlook-coherence-v1';

export interface RecurringForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface RecurringForwardOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: RecurringForwardCheck[];
  aggregateCoherenceGapPoints: number;
  withinRecurringForwardBand: boolean;
  alignedWithOutlookTrajectory: boolean;
  narrative: string;
  warnings: string[];
}
