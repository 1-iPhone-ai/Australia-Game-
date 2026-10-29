export const DEBT_FISCAL_COUPLING_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-debt-fiscal-coupling-outlook-bridge-v1';

export interface DebtFiscalCouplingOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface DebtFiscalCouplingOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: DebtFiscalCouplingOutlookCheck[];
  bridgeGapPoints: number;
  withinCouplingOutlookBand: boolean;
  alignedWithDebtServiceForward: boolean;
  narrative: string;
  warnings: string[];
}
