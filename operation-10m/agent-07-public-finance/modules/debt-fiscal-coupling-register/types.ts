export const DEBT_FISCAL_COUPLING_REGISTER_SCHEMA = 'op10m-agent07-debt-fiscal-coupling-register-v1';

export interface DebtFiscalCouplingCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface DebtFiscalCouplingRegisterReport {
  schemaVersion: string;
  turn: number;
  checks: DebtFiscalCouplingCheck[];
  couplingStressPoints: number;
  withinCouplingBand: boolean;
  alignedWithFiscalBuffer: boolean;
  narrative: string;
  warnings: string[];
}
