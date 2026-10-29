export const FISCAL_RISK_OUTLOOK_COHERENCE_SCHEMA =
  'op10m-agent07-fiscal-risk-outlook-coherence-v1';

export interface RiskOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface FiscalRiskOutlookCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: RiskOutlookCheck[];
  aggregateCoherenceGapPoints: number;
  withinRiskOutlookBand: boolean;
  alignedWithStressScenarios: boolean;
  narrative: string;
  warnings: string[];
}
