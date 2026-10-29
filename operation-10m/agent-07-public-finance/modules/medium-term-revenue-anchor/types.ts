export const MEDIUM_TERM_REVENUE_ANCHOR_SCHEMA = 'op10m-agent07-medium-term-revenue-anchor-v1';

export interface RevenueAnchorCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface MediumTermRevenueAnchorReport {
  schemaVersion: string;
  turn: number;
  checks: RevenueAnchorCheck[];
  anchorDriftPoints: number;
  withinAnchorBand: boolean;
  alignedWithForwardReconciliation: boolean;
  narrative: string;
  warnings: string[];
}
