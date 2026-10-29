import type { DebtOutcomeTrajectory, V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export const DEBT_ROLLOVER_SCHEMA = 'op10m-agent07-debt-rollover-v1';

export type DebtInstrumentTenor = 'short' | 'medium' | 'long';

export interface MaturityTranche {
  id: string;
  tenor: DebtInstrumentTenor;
  principalPoints: number;
  couponLoad: number;
  maturityTurn: number;
  rolledCount: number;
}

export type RolloverOutcome =
  | 'rolled_at_market'
  | 'rolled_with_penalty'
  | 'partially_retired'
  | 'failed_liquidity'
  | 'not_due';

export interface DebtRolloverEvent {
  trancheId: string;
  turn: number;
  outcome: RolloverOutcome;
  principalBefore: number;
  principalAfter: number;
  serviceLoadBefore: number;
  serviceLoadAfter: number;
  headroomDelta: number;
  explanation: string;
}

export interface DebtRolloverPlan {
  schemaVersion: string;
  turn: number;
  events: DebtRolloverEvent[];
  trajectoryAfter: DebtOutcomeTrajectory | null;
  liquidityStress: boolean;
  warnings: string[];
}

export interface DebtRolloverInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  tranches: MaturityTranche[];
  computeTrajectory: (snap: V1012FiscalSnapshot) => DebtOutcomeTrajectory;
}
