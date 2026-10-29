export const REVENUE_INTEGRITY_AUDIT_SCHEMA = 'op10m-agent07-revenue-integrity-audit-v1';

export interface RevenueIntegrityFinding {
  id: string;
  label: string;
  severity: 'info' | 'caution' | 'major';
  passed: boolean;
  detail: string;
}

export interface RevenueIntegrityAuditReport {
  schemaVersion: string;
  turn: number;
  findings: RevenueIntegrityFinding[];
  allPassed: boolean;
  aggregateDeltaGap: number;
  coherentWithTaxSensitivity: boolean;
  narrative: string;
  warnings: string[];
}
