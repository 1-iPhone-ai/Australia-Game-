export const FISCAL_RISK_STRESS_COHERENCE_SCHEMA = 'op10m-agent07-fiscal-risk-stress-coherence-v1';

export interface RiskStressCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface FiscalRiskStressCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: RiskStressCheck[];
  aggregateRiskStressGapPoints: number;
  withinRiskStressBand: boolean;
  alignedWithContingentBridge: boolean;
  narrative: string;
  warnings: string[];
}
