export const SOVEREIGN_CREDIT_STRESS_BRIDGE_SCHEMA =
  'op10m-agent07-sovereign-credit-stress-bridge-v1';

export interface CreditStressCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface SovereignCreditStressBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: CreditStressCheck[];
  bridgeGapPoints: number;
  withinCreditStressBand: boolean;
  alignedWithDebtCoupling: boolean;
  narrative: string;
  warnings: string[];
}
