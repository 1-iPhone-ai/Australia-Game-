import type { BudgetEnvelopeCategory } from '../fiscal-outcomes/types';

export const RECURRING_COMMITMENTS_SCHEMA = 'op10m-agent07-recurring-commitments-v1';

export type RecurringCommitmentCadence = 'every_turn' | 'every_2_turns' | 'annual';

export type RecurringCommitmentKind =
  | 'core_services'
  | 'maintenance_contract'
  | 'subsidy_program'
  | 'debt_coupon'
  | 'indexed_transfer';

export interface RecurringCommitmentDefinition {
  id: string;
  title: string;
  kind: RecurringCommitmentKind;
  cadence: RecurringCommitmentCadence;
  loadPointsPerPulse: number;
  envelopeCategory: BudgetEnvelopeCategory;
  mandatory: boolean;
  expiryTurn: number | null;
  regionIds: string[];
}

export interface RecurringCommitmentPulse {
  commitmentId: string;
  turn: number;
  loadPoints: number;
  envelopeCategory: BudgetEnvelopeCategory;
  skipped: boolean;
  explanation: string;
}

export interface RecurringCommitmentsSchedule {
  schemaVersion: string;
  turn: number;
  pulses: RecurringCommitmentPulse[];
  totalLoadThisTurn: number;
  mandatoryLoad: number;
  discretionaryLoad: number;
  overlapsEnvelopeCommitted: boolean;
  warnings: string[];
}
