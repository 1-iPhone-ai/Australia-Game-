export const FORWARD_ESTIMATES_INTEGRITY_SCHEMA = 'op10m-agent07-forward-estimates-integrity-v1';

export interface ForwardIntegrityCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ForwardEstimatesIntegrityReport {
  schemaVersion: string;
  turn: number;
  checks: ForwardIntegrityCheck[];
  allPassed: boolean;
  aggregateRevisionGap: number;
  bandDriftPoints: number;
  coherentWithSupplementary: boolean;
  narrative: string;
  warnings: string[];
}
