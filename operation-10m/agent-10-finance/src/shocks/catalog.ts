import type { FinancialShockDefinition } from '../definitions/types.js';

export const FINANCIAL_SHOCK_CATALOG: readonly FinancialShockDefinition[] = [
  {
    id: 'shock_credit_tightening',
    kind: 'credit_tightening',
    label: 'Credit tightening shock',
    creditScoreDelta: -14,
    inflationScoreDelta: 0,
    stabilityScoreDelta: -4,
    setsCreditShockFlag: true,
    temporary: true,
    explanation: 'Banks pull back lending; mirrors creditShockActive driver in macro-financial compute.',
  },
  {
    id: 'shock_liquidity_strain',
    kind: 'liquidity_strain',
    label: 'Systemic liquidity strain',
    creditScoreDelta: -6,
    inflationScoreDelta: 0,
    stabilityScoreDelta: -12,
    setsCreditShockFlag: false,
    temporary: true,
    explanation: 'Funding markets stressed; stability score hit matches systemicLiquidityBand strained/critical.',
  },
  {
    id: 'shock_commodity_spike',
    kind: 'commodity_spike',
    label: 'Commodity price spike (market only)',
    creditScoreDelta: 0,
    inflationScoreDelta: 0,
    stabilityScoreDelta: 0,
    setsCreditShockFlag: false,
    temporary: true,
    explanation: 'Affects resourcePrices via market update — intentionally zero macro CPI delta.',
  },
  {
    id: 'shock_commodity_crash',
    kind: 'commodity_crash',
    label: 'Commodity price crash (market only)',
    creditScoreDelta: 0,
    inflationScoreDelta: 0,
    stabilityScoreDelta: -2,
    setsCreditShockFlag: false,
    temporary: true,
    explanation: 'Trade revenue volatility; small stability read-through, no CPI mixing.',
  },
  {
    id: 'shock_household_cost_surge',
    kind: 'household_cost_surge',
    label: 'Household cost surge',
    creditScoreDelta: -2,
    inflationScoreDelta: 8,
    stabilityScoreDelta: -3,
    setsCreditShockFlag: false,
    temporary: false,
    explanation: 'Service-cost pass-through aligned with household affordability strain driver.',
  },
  {
    id: 'shock_sovereign_risk',
    kind: 'sovereign_risk',
    label: 'Sovereign risk repricing',
    creditScoreDelta: -10,
    inflationScoreDelta: 2,
    stabilityScoreDelta: -8,
    setsCreditShockFlag: false,
    temporary: false,
    explanation: 'Sovereign debt overhang tightens credit and stability without wallet mutation.',
  },
] as const;

export function getShockById(id: string): FinancialShockDefinition | undefined {
  return FINANCIAL_SHOCK_CATALOG.find((s) => s.id === id);
}

export function applyShockDeltasToScores(
  scores: { inflation: number; credit: number; stability: number },
  shock: FinancialShockDefinition,
): { inflation: number; credit: number; stability: number; creditShockActive: boolean } {
  return {
    inflation: scores.inflation + shock.inflationScoreDelta,
    credit: scores.credit + shock.creditScoreDelta,
    stability: scores.stability + shock.stabilityScoreDelta,
    creditShockActive: shock.setsCreditShockFlag,
  };
}
