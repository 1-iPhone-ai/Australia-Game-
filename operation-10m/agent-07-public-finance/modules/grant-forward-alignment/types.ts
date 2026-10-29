export const GRANT_FORWARD_ALIGNMENT_SCHEMA = 'op10m-agent07-grant-forward-alignment-v1';

export interface GrantForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface GrantForwardAlignmentReport {
  schemaVersion: string;
  turn: number;
  checks: GrantForwardCheck[];
  aggregateAlignmentGapPoints: number;
  withinGrantForwardBand: boolean;
  alignedWithExpenditureFramework: boolean;
  narrative: string;
  warnings: string[];
}
