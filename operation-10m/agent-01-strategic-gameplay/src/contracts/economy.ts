/**
 * Agent 01 — integration contracts (economy slice).
 * Canonical V9.4 adapters implement these shapes; this module consumes snapshots and emits patches.
 */

export type EconomyDomainId =
  | 'treasury'
  | 'markets'
  | 'investments'
  | 'trade'
  | 'households';

export interface EconomySnapshot {
  day: number;
  cashOnHand: number;
  treasuryReserve: number;
  debtOutstanding: number;
  inflationIndex: number;
  priceMultiplier: number;
  investmentLockout: boolean;
  netWorthEstimate: number;
}

export interface EconomyPatch {
  cashDelta?: number;
  treasuryDelta?: number;
  debtDelta?: number;
  inflationDelta?: number;
  priceMultiplierFactor?: number;
  investmentLockout?: boolean;
  netWorthMultiplier?: number;
  domainsTouched?: EconomyDomainId[];
  ledgerNote?: string;
}

export interface EconomyContract {
  readonly moduleId: 'agent-01-economy';
  snapshot(): EconomySnapshot;
  applyPatch(patch: EconomyPatch): EconomySnapshot;
  canAfford(cashCost: number, treasuryCost?: number): boolean;
}
