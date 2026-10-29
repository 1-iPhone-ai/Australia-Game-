export const FISCAL_STRESS_RESILIENCE_BRIDGE_SCHEMA =
  'op10m-agent07-fiscal-stress-resilience-bridge-v1';

export interface StressResilienceCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface FiscalStressResilienceBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: StressResilienceCheck[];
  bridgeStressPoints: number;
  withinResilienceBridge: boolean;
  alignedWithDebtCoupling: boolean;
  narrative: string;
  warnings: string[];
}
