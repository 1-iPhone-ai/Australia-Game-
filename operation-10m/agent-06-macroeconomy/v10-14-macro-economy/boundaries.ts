/**
 * Architectural boundaries for Agent 06 modular macro layer (mirrors Section 20AG invariants).
 */
export const AGENT06_MACRO_BOUNDARIES = {
  authoritativeElsewhere: [
    'actor_money',
    'actor_loans',
    'team_treasury',
    'resource_market_prices',
    'v10_9_strategic_capital',
    'v10_12_public_finance',
    'v10_13_households'
  ],
  owns: [
    'business_cycle_phase',
    'national_productivity_band',
    'gross_investment_climate',
    'regional_output_contribution_shares',
    'national_accounting_identity_checks'
  ],
  invariants: {
    regionalSharesSum: '1.0 ± accountingTolerance',
    noPlayerCashMutation: true,
    fiscalCrossCheckWarnOnly: true
  }
} as const;
