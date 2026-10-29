import type { FiscalOutcomeBand, V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export const FISCAL_RESILIENCE_SCHEMA = 'op10m-agent07-fiscal-resilience-v1';

export type FiscalShockKind =
  | 'commodity_revenue_drop'
  | 'disaster_recovery_surge'
  | 'rate_shock_debt_service'
  | 'migration_dividend'
  | 'trade_terms_improvement';

export interface FiscalShockDefinition {
  id: string;
  kind: FiscalShockKind;
  label: string;
  /** Normalized impact on revenue capacity (negative = loss). */
  revenueCapacityDelta: number;
  /** Normalized impact on fiscal headroom. */
  headroomDelta: number;
  /** Extra maintenance / recovery load. */
  maintenanceLoadDelta: number;
  durationTurns: number;
  warnOnly: boolean;
}

export interface AppliedFiscalShock {
  shockId: string;
  turnApplied: number;
  turnsRemaining: number;
  adjustedSnapshot: V1012FiscalSnapshot;
  pressureAfter: V1012FiscalSnapshot['pressure'];
  narrative: string;
}

export interface FiscalResilienceAssessment {
  schemaVersion: string;
  turn: number;
  baselinePressure: V1012FiscalSnapshot['pressure'];
  shocksApplied: AppliedFiscalShock[];
  compositeStressBand: FiscalOutcomeBand;
  reserveAdequacy: 'strong' | 'adequate' | 'thin' | 'depleted';
  recoveryTurnsEstimate: number | null;
  warnings: string[];
}
