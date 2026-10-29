// OP10M_MODULE_BEGIN agent-10-finance
// Agent 10 — V10.14 macro-financial conditions (generated; source: operation-10m/agent-10-finance/src/)

// --- source: definitions/types.ts ---
export type InflationConditionsBand =
  | 'disinflation'
  | 'anchored'
  | 'elevated'
  | 'high'
  | 'scenario_runaway';

export type CreditConditionsBand =
  | 'accommodative'
  | 'neutral'
  | 'tight'
  | 'restricted'
  | 'frozen';

export type FinancialStabilityBand =
  | 'resilient'
  | 'stable'
  | 'watch'
  | 'stressed'
  | 'crisis';

export type MonetaryPolicyStance =
  | 'emergency_easing'
  | 'accommodative'
  | 'neutral'
  | 'tightening'
  | 'restrictive';

/** Mirrors V10.12 fiscal pressure labels consumed as inputs only. */
export type FiscalPressureBand = 'healthy' | 'tight' | 'strained' | 'critical';

export type FiscalSustainabilityBand = 'stable' | 'vulnerable' | 'unsustainable';

export type SovereignDebtPressureBand = 'manageable' | 'elevated' | 'high' | 'critical';

export type CapitalFlexibilityBand =
  | 'very_low'
  | 'low'
  | 'moderate'
  | 'high'
  | 'very_high'
  | 'critical';

export type CapitalPressureBand = 'minimal' | 'elevated' | 'high' | 'critical' | 'balanced';

export type AffordabilityBand = 'healthy' | 'strained' | 'severe_pressure';

export interface MacroFinancialEvidence {
  id: string;
  sourceSystem: string;
  sourceId: string;
  factor: string;
  contribution: number;
  regionIds: string[];
  turn: number;
  visibility: 'public' | 'diagnostic';
}

export interface RegionalCreditSpread {
  regionId: string;
  spreadBand: 'low' | 'moderate' | 'elevated' | 'severe';
  investmentRiskPremium: number;
  householdCreditStress: number;
  explanation: string;
}

export interface MacroFinancialPressure {
  id: string;
  domain: 'inflation' | 'credit' | 'fiscal_spillover' | 'liquidity' | 'household' | 'investment';
  severity: 'minor' | 'meaningful' | 'major' | 'critical';
  temporary: boolean;
  explanation: string;
  evidence: MacroFinancialEvidence[];
}

export interface MacroFinancialTransition {
  id: string;
  turn: number;
  domain: 'inflation' | 'credit' | 'stability' | 'stance';
  fromBand: string;
  toBand: string;
  explanation: string;
}

export interface MacroFinancialModifiers {
  costOfLivingMultiplier: number;
  creditSpreadMultiplier: number;
  investmentRiskPremium: number;
  loanAffordabilityIndex: number;
  financialStabilityIndex: number;
}

export interface NationalMacroFinancialState {
  schemaVersion: string;
  revision: number;
  turn: number;
  inputHash: string;
  enabled: boolean;
  inflation: InflationConditionsBand;
  credit: CreditConditionsBand;
  stability: FinancialStabilityBand;
  stance: MonetaryPolicyStance;
  modifiers: MacroFinancialModifiers;
  regionalSpreads: RegionalCreditSpread[];
  pressures: MacroFinancialPressure[];
  transitions: MacroFinancialTransition[];
  history: Array<{ turn: number; stabilityIndex: number; inflation: InflationConditionsBand; credit: CreditConditionsBand }>;
  evidence: MacroFinancialEvidence[];
  summary: string;
  integrationNotes: string[];
}

export interface MacroFinancialPersisted {
  schemaVersion: string;
  revision: number;
  lastUpdatedTurn: number;
  lastInputHash: string;
  inflationScore: number;
  creditScore: number;
  stabilityScore: number;
  lastInflationBand: InflationConditionsBand;
  lastCreditBand: CreditConditionsBand;
  lastStabilityBand: FinancialStabilityBand;
  lastStance: MonetaryPolicyStance;
  history: NationalMacroFinancialState['history'];
  pinnedConcernIds: string[];
}

export interface MacroFinancialSystemInputs {
  turn: number;
  highInflationScenario: boolean;
  inflationSettingMultiplier: number;
  publicStability: number;
  fiscalPressure: FiscalPressureBand | null;
  fiscalSustainability: FiscalSustainabilityBand | null;
  sovereignDebtPressure: SovereignDebtPressureBand | null;
  capitalFlexibility: CapitalFlexibilityBand | null;
  capitalPressure: CapitalPressureBand | null;
  householdAffordability: AffordabilityBand | null;
  householdInflationScenarioActive: boolean;
  systemicLiquidityBand: 'ample' | 'adequate' | 'strained' | 'critical' | null;
  actorCreditStressIndex: number;
  activeCrises: number;
  creditShockActive: boolean;
  regions: Record<string, { investmentPressure?: string; housingPressure?: string }>;
}

export interface MacroFinancialComputeResult {
  state: NationalMacroFinancialState;
  persisted: MacroFinancialPersisted;
  events: Array<{
    id: string;
    turn: number;
    kind: string;
    significance: 'minor' | 'meaningful' | 'major' | 'critical';
    title: string;
    summary: string;
    dedupeKey: string;
  }>;
}

export type FinancialShockKind =
  | 'credit_tightening'
  | 'liquidity_strain'
  | 'commodity_spike'
  | 'commodity_crash'
  | 'household_cost_surge'
  | 'sovereign_risk';

export interface FinancialShockDefinition {
  id: string;
  kind: FinancialShockKind;
  label: string;
  /** Score deltas applied in macro-financial compute (bounded). */
  creditScoreDelta: number;
  inflationScoreDelta: number;
  stabilityScoreDelta: number;
  setsCreditShockFlag: boolean;
  temporary: boolean;
  explanation: string;
}


// --- source: definitions/constants.ts ---
export const V1014_FINSTAB_SCHEMA_VERSION = '10.14.0';

export const V1014_FINSTAB_CORE_REGIONS: readonly string[] = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT',
] as const;

export const V1014_FINSTAB_LIMITS = {
  maxEvidence: 12,
  maxPressures: 10,
  maxTransitions: 14,
  maxHistory: 20,
  maxRegionalSpreads: 8,
  hysteresisDeadband: 2.0,
  maxCostMultiplier: 1.45,
  minCostMultiplier: 0.92,
  maxCreditSpreadMultiplier: 1.85,
  minCreditSpreadMultiplier: 0.88,
} as const;

export const V1014_FINSTAB_REGION_CREDIT_PROFILE: Record<
  string,
  { baseSpread: number; housingSensitivity: number; miningExposure: number; publicSectorShare: number }
> = {
  NSW: { baseSpread: 1.05, housingSensitivity: 1.1, miningExposure: 0.9, publicSectorShare: 1.0 },
  VIC: { baseSpread: 1.02, housingSensitivity: 1.1, miningExposure: 0.9, publicSectorShare: 1.0 },
  QLD: { baseSpread: 0.98, housingSensitivity: 0.95, miningExposure: 0.9, publicSectorShare: 1.0 },
  WA: { baseSpread: 1.08, housingSensitivity: 0.95, miningExposure: 1.15, publicSectorShare: 1.0 },
  SA: { baseSpread: 0.95, housingSensitivity: 0.95, miningExposure: 0.9, publicSectorShare: 1.0 },
  TAS: { baseSpread: 0.92, housingSensitivity: 0.95, miningExposure: 0.9, publicSectorShare: 1.0 },
  NT: { baseSpread: 1.12, housingSensitivity: 0.95, miningExposure: 0.9, publicSectorShare: 1.0 },
  ACT: { baseSpread: 1.0, housingSensitivity: 0.95, miningExposure: 0.9, publicSectorShare: 1.2 },
};

export const V1014_FINSTAB_POLICY_TRANSMISSION_CHANNELS: ReadonlyArray<{
  id: string;
  sourceDomain: string;
  targetDomain: string;
  weight: number;
  explanation: string;
}> = [
  {
    id: 'fiscal_strain_tightens_credit',
    sourceDomain: 'fiscal',
    targetDomain: 'credit',
    weight: 1.0,
    explanation: 'Strained fiscal capacity reduces room for counter-cyclical support, tightening credit conditions.',
  },
  {
    id: 'debt_service_crowds_lending',
    sourceDomain: 'fiscal',
    targetDomain: 'credit',
    weight: 1.05,
    explanation: 'Elevated sovereign debt service load raises perceived macro risk and bank lending spreads.',
  },
  {
    id: 'capital_flexibility_eases_investment',
    sourceDomain: 'investment',
    targetDomain: 'credit',
    weight: 1.1,
    explanation: 'Strong discretionary capital flexibility supports accommodative private credit for projects.',
  },
  {
    id: 'capital_squeeze_freezes_projects',
    sourceDomain: 'investment',
    targetDomain: 'credit',
    weight: 1.15,
    explanation: 'Critical capital flexibility triggers project deferrals and tighter underwriting.',
  },
  {
    id: 'household_strain_feeds_inflation',
    sourceDomain: 'household',
    targetDomain: 'inflation',
    weight: 1.2,
    explanation: 'Severe affordability pressure raises service-cost pass-through without using commodity CPI.',
  },
  {
    id: 'scenario_inflation_anchor_break',
    sourceDomain: 'inflation',
    targetDomain: 'inflation',
    weight: 1.25,
    explanation: 'High Inflation scenario adds a bounded cost-of-living multiplier with explicit provenance.',
  },
  {
    id: 'liquidity_shock_stability',
    sourceDomain: 'liquidity',
    targetDomain: 'stability',
    weight: 1.3,
    explanation: 'Systemic liquidity fragility lowers financial stability index and raises watch-list status.',
  },
  {
    id: 'public_stability_buffer',
    sourceDomain: 'governance',
    targetDomain: 'stability',
    weight: 1.35,
    explanation: 'Higher public stability cushions financial-stability downgrades during shocks.',
  },
  {
    id: 'actor_leverage_warning',
    sourceDomain: 'private_credit',
    targetDomain: 'credit',
    weight: 1.4,
    explanation: 'Aggregate actor debt stress nudges credit bands tighter (signal only — no wallet changes).',
  },
  {
    id: 'crisis_stack_amplification',
    sourceDomain: 'crisis',
    targetDomain: 'stability',
    weight: 1.45,
    explanation: 'Multiple active crises compound stability penalties with diminishing returns cap.',
  },
] as const;


// --- source: definitions/glossary.ts ---
/**
 * Coherent finance vocabulary for Operation 10M Agent 10.
 * These definitions are normative for modular code and must stay aligned with V9.4 Section 20AO.
 */

/** Commodity quote on the resource market board — supply/demand, not macro CPI. */
export const GLOSSARY_RESOURCE_MARKET_PRICE =
  'Per-resource trade price in gameState.resourcePrices; driven by BASE_MARKET_RESOURCES, trends, and daily market update. Distinct from macro inflation bands.';

/** Macro inflation band — service/cost-of-living pressure without commodity CPI averaging. */
export const GLOSSARY_MACRO_INFLATION_BAND =
  'Qualitative InflationConditionsBand from inflationScore + scenario flags; feeds costOfLivingMultiplier only within V1014_FINSTAB_LIMITS.';

/** Credit conditions band — aggregate lending environment, not a single loan contract. */
export const GLOSSARY_CREDIT_CONDITIONS_BAND =
  'Qualitative CreditConditionsBand from creditScore; informs creditSpreadMultiplier and loan affordability index.';

/** Active credit shock flag — discrete event tightening creditScore; does not auto-default loans. */
export const GLOSSARY_CREDIT_SHOCK =
  'Boolean creditShockActive (or gameSettings) applying a bounded penalty to creditScore in macro-financial compute.';

/** Actor credit stress — aggregate private leverage signal from player/AI loan balances vs cash. */
export const GLOSSARY_ACTOR_CREDIT_STRESS =
  'actorCreditStressIndex in [0,1]; nudges credit tighter when high. Does not mutate wallets.';

/** Reference policy rate — derived metadata from stance + credit band for UI/AI narration. */
export const GLOSSARY_REFERENCE_POLICY_RATE =
  'Normalized annualized rate hint (0–1 fraction) from MonetaryPolicyStance and CreditConditionsBand; not applied to wallets directly.';

/** Price inflation auto-mode — handicap category affecting rewards, not resource market quotes. */
export const GLOSSARY_PRICE_INFLATION_AUTO_MODE =
  'AutoModeCategory price_inflation: gameplay handicap/stimulus layer; must not be conflated with macro inflation bands or commodity prices.';

export const AGENT10_GLOSSARY_ENTRIES: ReadonlyArray<{ term: string; definition: string }> = [
  { term: 'resource_market_price', definition: GLOSSARY_RESOURCE_MARKET_PRICE },
  { term: 'macro_inflation_band', definition: GLOSSARY_MACRO_INFLATION_BAND },
  { term: 'credit_conditions_band', definition: GLOSSARY_CREDIT_CONDITIONS_BAND },
  { term: 'credit_shock', definition: GLOSSARY_CREDIT_SHOCK },
  { term: 'actor_credit_stress', definition: GLOSSARY_ACTOR_CREDIT_STRESS },
  { term: 'reference_policy_rate', definition: GLOSSARY_REFERENCE_POLICY_RATE },
  { term: 'price_inflation_auto_mode', definition: GLOSSARY_PRICE_INFLATION_AUTO_MODE },
];


// --- source: compute/math.ts ---
export function finClamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function finRound(n: number, d = 1): number {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}


// --- source: credit/bands.ts ---
  CreditConditionsBand,
  FinancialStabilityBand,
  InflationConditionsBand,
  MonetaryPolicyStance,
} from '../definitions/types.js';

export function bandInflation(score: number, scenario: boolean): InflationConditionsBand {
  if (scenario && score >= 70) return 'scenario_runaway';
  if (score >= 78) return 'high';
  if (score >= 58) return 'elevated';
  if (score <= 28) return 'disinflation';
  return 'anchored';
}

export function bandCredit(score: number): CreditConditionsBand {
  if (score >= 72) return 'accommodative';
  if (score >= 52) return 'neutral';
  if (score >= 36) return 'tight';
  if (score >= 22) return 'restricted';
  return 'frozen';
}

export function bandStability(score: number): FinancialStabilityBand {
  if (score >= 78) return 'resilient';
  if (score >= 62) return 'stable';
  if (score >= 46) return 'watch';
  if (score >= 30) return 'stressed';
  return 'crisis';
}

export function bandStance(
  infl: InflationConditionsBand,
  credit: CreditConditionsBand,
  stability: FinancialStabilityBand,
): MonetaryPolicyStance {
  if (stability === 'crisis' || credit === 'frozen') return 'emergency_easing';
  if (infl === 'high' || infl === 'scenario_runaway') return 'restrictive';
  if (infl === 'elevated' && credit !== 'accommodative') return 'tightening';
  if (infl === 'disinflation' && (credit === 'restricted' || credit === 'tight')) return 'accommodative';
  return 'neutral';
}

export function applyHysteresis(
  score: number,
  prevBand: string,
  nextBand: string,
  order: string[],
  deadband: number,
): string {
  const pi = order.indexOf(prevBand);
  const ni = order.indexOf(nextBand);
  if (pi < 0 || ni < 0) return nextBand;
  if (Math.abs(ni - pi) <= 1) return nextBand;
  if (ni > pi && score < order.indexOf(nextBand) * 20 - deadband) return prevBand;
  return nextBand;
}


// --- source: credit/actor-leverage.ts ---

/** Aggregate actor leverage signal — mirrors buildMacroFinancialInputs in V9.4. */
export function computeActorCreditStressIndex(
  player: { money?: number; loans?: Array<{ remaining?: number; amount?: number }> } | null | undefined,
  aiPlayer: { money?: number; loans?: Array<{ remaining?: number; amount?: number }> } | null | undefined,
): number {
  const sumDebt = (actor: typeof player) =>
    Number(
      actor?.loans?.reduce?.((s, l) => s + Number(l.remaining ?? l.amount ?? 0), 0) ?? 0,
    );
  const debtPlayer = sumDebt(player);
  const debtAi = sumDebt(aiPlayer);
  const cashPlayer = Number(player?.money ?? 0);
  const cashAi = Number(aiPlayer?.money ?? 0);
  const stressPlayer =
    cashPlayer > 0 ? finClamp(debtPlayer / (cashPlayer + debtPlayer + 1), 0, 1) : debtPlayer > 0 ? 1 : 0;
  const stressAi =
    cashAi > 0 ? finClamp(debtAi / (cashAi + debtAi + 1), 0, 1) : debtAi > 0 ? 1 : 0;
  return finRound((stressPlayer + stressAi) / 2, 3);
}

export function creditSpreadMultiplierFromScore(creditScore: number, min: number, max: number): number {
  return finClamp(1 + (55 - creditScore) / 90, min, max);
}

export function loanAffordabilityIndex(creditScore: number, stabilityScore: number): number {
  return finClamp(creditScore * 0.6 + stabilityScore * 0.4, 0, 100);
}


// --- source: rates/reference-rate.ts ---

/** Narrative reference rate (annualized fraction) — metadata only. */
const STANCE_BASE: Record<MonetaryPolicyStance, number> = {
  emergency_easing: 0.02,
  accommodative: 0.035,
  neutral: 0.05,
  tightening: 0.065,
  restrictive: 0.085,
};

const CREDIT_ADJ: Record<CreditConditionsBand, number> = {
  accommodative: -0.01,
  neutral: 0,
  tight: 0.012,
  restricted: 0.025,
  frozen: 0.04,
};

export function referencePolicyRate(stance: MonetaryPolicyStance, credit: CreditConditionsBand): number {
  const raw = STANCE_BASE[stance] + CREDIT_ADJ[credit];
  return Math.max(0, Math.min(0.15, Math.round(raw * 1000) / 1000));
}

export function advancedLoanEffectiveRate(baseRate: number, spreadMultiplier: number): number {
  return Math.max(0, Math.min(1, baseRate * spreadMultiplier));
}


// --- source: prices/boundary.ts ---
/** Rules separating commodity resource quotes from macro inflation (V10.14 boundary). */

export function isCommodityPriceDomain(field: 'resourcePrices' | 'macroInflation' | 'autoModeHandicap'): boolean {
  return field === 'resourcePrices';
}

export function macroInflationMayUseCommodityPrices(): false {
  return false;
}

export function integrationNoteNonCpiBoundary(): string {
  return 'Resource market commodity prices are excluded from macro CPI aggregation (V10.13/V10.14 boundary).';
}

export const RESOURCE_MARKET_PRICES_BY_CATEGORY: Record<string, number> = {
  minerals: 150,
  agricultural: 100,
  industrial: 120,
  luxury: 500,
  energy: 200,
};

export function baseResourceMarketPrice(category: string): number {
  return RESOURCE_MARKET_PRICES_BY_CATEGORY[category] ?? 120;
}

/** Bounded daily pressure applied to commodity quotes (±6% of base) — not macro CPI. */
export function clampResourcePricePressure(pressure: number | undefined | null): number {
  return Math.max(-0.06, Math.min(0.06, Number(pressure) || 0));
}

export function applyResourcePricePressure(basePrice: number, pressureFraction: number): number {
  const p = clampResourcePricePressure(pressureFraction);
  return Math.max(1, Math.round(basePrice * (1 + p)));
}


// --- source: shocks/catalog.ts ---

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


// --- source: compute/national-macro-financial.ts ---
  V1014_FINSTAB_CORE_REGIONS,
  V1014_FINSTAB_LIMITS,
  V1014_FINSTAB_REGION_CREDIT_PROFILE,
  V1014_FINSTAB_SCHEMA_VERSION,
} from '../definitions/constants.js';
  InflationConditionsBand,
  CreditConditionsBand,
  FinancialStabilityBand,
  MacroFinancialEvidence,
  MacroFinancialPersisted,
  MacroFinancialPressure,
  MacroFinancialSystemInputs,
  MacroFinancialTransition,
  NationalMacroFinancialState,
  MacroFinancialComputeResult,
  RegionalCreditSpread,
} from '../definitions/types.js';
  computeActorCreditStressIndex,
  creditSpreadMultiplierFromScore,
  loanAffordabilityIndex,
} from '../credit/actor-leverage.js';

export const V1014_FINSTAB_INFLATION_LABEL: Record<InflationConditionsBand, string> = {
  disinflation: 'Disinflation',
  anchored: 'Anchored',
  elevated: 'Elevated',
  high: 'High',
  scenario_runaway: 'Scenario Runaway',
};

export const V1014_FINSTAB_CREDIT_LABEL: Record<CreditConditionsBand, string> = {
  accommodative: 'Accommodative',
  neutral: 'Neutral',
  tight: 'Tight',
  restricted: 'Restricted',
  frozen: 'Frozen',
};

export const V1014_FINSTAB_STABILITY_LABEL: Record<FinancialStabilityBand, string> = {
  resilient: 'Resilient',
  stable: 'Stable',
  watch: 'Watch',
  stressed: 'Stressed',
  crisis: 'Crisis',
};

export function createInitialMacroFinancialPersisted(turn = 1): MacroFinancialPersisted {
  return {
    schemaVersion: V1014_FINSTAB_SCHEMA_VERSION,
    revision: 0,
    lastUpdatedTurn: turn,
    lastInputHash: '',
    inflationScore: 42,
    creditScore: 55,
    stabilityScore: 68,
    lastInflationBand: 'anchored',
    lastCreditBand: 'neutral',
    lastStabilityBand: 'stable',
    lastStance: 'neutral',
    history: [],
    pinnedConcernIds: [],
  };
}

export function sanitizeMacroFinancialPersisted(raw: unknown, turn = 1): MacroFinancialPersisted | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const hist = Array.isArray(r.history)
    ? r.history
        .filter((h): h is Record<string, unknown> => !!h && typeof (h as Record<string, unknown>).turn === 'number')
        .slice(-V1014_FINSTAB_LIMITS.maxHistory)
        .map((h) => ({
          turn: Number(h.turn),
          stabilityIndex: Number(h.stabilityIndex || 0),
          inflation: (h.inflation || 'anchored') as InflationConditionsBand,
          credit: (h.credit || 'neutral') as CreditConditionsBand,
        }))
    : [];
  return {
    schemaVersion: V1014_FINSTAB_SCHEMA_VERSION,
    revision: Number(r.revision || 0),
    lastUpdatedTurn: Number(r.lastUpdatedTurn || turn),
    lastInputHash: String(r.lastInputHash || ''),
    inflationScore: finClamp(Number(r.inflationScore ?? 42), 0, 100),
    creditScore: finClamp(Number(r.creditScore ?? 55), 0, 100),
    stabilityScore: finClamp(Number(r.stabilityScore ?? 68), 0, 100),
    lastInflationBand: (r.lastInflationBand || 'anchored') as InflationConditionsBand,
    lastCreditBand: (r.lastCreditBand || 'neutral') as CreditConditionsBand,
    lastStabilityBand: (r.lastStabilityBand || 'stable') as FinancialStabilityBand,
    lastStance: (r.lastStance || 'neutral') as MacroFinancialPersisted['lastStance'],
    history: hist,
    pinnedConcernIds: Array.isArray(r.pinnedConcernIds)
      ? r.pinnedConcernIds.map(String).slice(0, 8)
      : [],
  };
}

export function macroFinancialInputHash(inputs: MacroFinancialSystemInputs): string {
  const reg = V1014_FINSTAB_CORE_REGIONS.map((rid) => {
    const x = inputs.regions[rid] || {};
    return `${rid}:${x.investmentPressure || ''}:${x.housingPressure || ''}`;
  }).join('|');
  return [
    inputs.turn,
    inputs.highInflationScenario ? 1 : 0,
    finRound(inputs.inflationSettingMultiplier, 3),
    inputs.publicStability,
    inputs.fiscalPressure || '',
    inputs.fiscalSustainability || '',
    inputs.sovereignDebtPressure || '',
    inputs.capitalFlexibility || '',
    inputs.capitalPressure || '',
    inputs.householdAffordability || '',
    inputs.householdInflationScenarioActive ? 1 : 0,
    inputs.systemicLiquidityBand || '',
    finRound(inputs.actorCreditStressIndex, 2),
    inputs.activeCrises,
    inputs.creditShockActive ? 1 : 0,
    reg,
  ].join('~');
}

export function makeDefaultMacroFinancialTestInputs(
  overrides: Partial<MacroFinancialSystemInputs> = {},
): MacroFinancialSystemInputs {
  const base: MacroFinancialSystemInputs = {
    turn: 5,
    highInflationScenario: false,
    inflationSettingMultiplier: 1,
    publicStability: 62,
    fiscalPressure: 'healthy',
    fiscalSustainability: 'stable',
    sovereignDebtPressure: 'manageable',
    capitalFlexibility: 'moderate',
    capitalPressure: 'balanced',
    householdAffordability: 'healthy',
    householdInflationScenarioActive: false,
    systemicLiquidityBand: 'adequate',
    actorCreditStressIndex: 0.25,
    activeCrises: 0,
    creditShockActive: false,
    regions: Object.fromEntries(V1014_FINSTAB_CORE_REGIONS.map((r) => [r, {}])),
  };
  return { ...base, ...overrides, regions: { ...base.regions, ...(overrides.regions || {}) } };
}

export function computeNationalMacroFinancialConditions(
  inputs: MacroFinancialSystemInputs,
  persistedIn: MacroFinancialPersisted | null | undefined,
  prevState: NationalMacroFinancialState | null | undefined,
): MacroFinancialComputeResult {
  const persisted = persistedIn ? { ...persistedIn } : createInitialMacroFinancialPersisted(inputs.turn);
  const hash = macroFinancialInputHash(inputs);
  if (prevState && persisted.lastInputHash === hash && prevState.turn === inputs.turn) {
    return { state: prevState, persisted, events: [] };
  }

  let inflScore = persisted.inflationScore;
  let creditScore = persisted.creditScore;
  let stabScore = persisted.stabilityScore;
  const evidence: MacroFinancialEvidence[] = [];
  const pressures: MacroFinancialPressure[] = [];
  const pushEv = (
    sourceSystem: string,
    sourceId: string,
    factor: string,
    contribution: number,
    regionIds: string[] = [],
  ) => {
    evidence.push({
      id: `ev_${sourceSystem}_${sourceId}_${evidence.length}`,
      sourceSystem,
      sourceId,
      factor,
      contribution,
      regionIds,
      turn: inputs.turn,
      visibility: contribution >= 8 ? 'public' : 'diagnostic',
    });
  };

  if (inputs.highInflationScenario) {
    inflScore += 16;
    pushEv('scenario', 'high_inflation', 'Scenario cost pass-through', 16);
  }
  if (inputs.inflationSettingMultiplier > 1.05) {
    const bump = finClamp((inputs.inflationSettingMultiplier - 1) * 40, 0, 12);
    inflScore += bump;
    pushEv('settings', 'inflation_multiplier', 'Configured inflation multiplier', bump);
  }
  if (inputs.householdAffordability === 'severe_pressure' || inputs.householdAffordability === 'strained') {
    inflScore += 8;
    pushEv('v1013', 'affordability', 'Household service-cost pass-through', 8);
  }
  if (inputs.householdInflationScenarioActive) inflScore += 6;

  const fiscalPenalty =
    inputs.fiscalPressure === 'critical'
      ? -18
      : inputs.fiscalPressure === 'strained'
        ? -12
        : inputs.fiscalPressure === 'tight'
          ? -6
          : 0;
  if (fiscalPenalty) {
    creditScore += fiscalPenalty;
    pushEv('v1012', 'fiscal_pressure', 'Fiscal strain tightens credit', fiscalPenalty);
  }
  if (inputs.sovereignDebtPressure === 'critical' || inputs.sovereignDebtPressure === 'high') {
    creditScore -= 10;
    pushEv('v1012', 'debt', 'Sovereign debt overhang', -10);
  }
  if (inputs.capitalFlexibility === 'critical' || inputs.capitalFlexibility === 'very_low') {
    creditScore -= 12;
    pushEv('v109', 'capital_flex', 'Capital squeeze', -12);
  } else if (inputs.capitalFlexibility === 'high' || inputs.capitalFlexibility === 'very_high') {
    creditScore += 6;
    pushEv('v109', 'capital_flex', 'Strong investment climate supports credit', 6);
  }
  if (inputs.actorCreditStressIndex > 0.55) {
    const adj = -finRound((inputs.actorCreditStressIndex - 0.55) * 30, 1);
    creditScore += adj;
    pushEv('actors', 'aggregate_leverage', 'Private leverage signal', adj);
  }
  if (inputs.creditShockActive) {
    creditScore -= 14;
    pushEv('crisis', 'credit_shock', 'Active credit shock', -14);
  }

  stabScore += finClamp((inputs.publicStability - 50) * 0.15, -8, 8);
  pushEv(
    'governance',
    'public_stability',
    'Societal stability buffer',
    finClamp((inputs.publicStability - 50) * 0.15, -8, 8),
  );
  if (inputs.systemicLiquidityBand === 'critical' || inputs.systemicLiquidityBand === 'strained') {
    stabScore -= 12;
    pushEv('v106', 'liquidity', 'Systemic liquidity fragility', -12);
  }
  if (inputs.activeCrises > 0) {
    const cpen = -finClamp(inputs.activeCrises * 5, 0, 18);
    stabScore += cpen;
    pushEv('crisis', 'active', 'Active crisis stack', cpen);
  }
  if (inputs.fiscalSustainability === 'unsustainable' || inputs.fiscalSustainability === 'vulnerable') {
    stabScore -= 8;
    pushEv('v1012', 'sustainability', 'Fiscal sustainability concern', -8);
  }

  inflScore = finClamp(inflScore, 0, 100);
  creditScore = finClamp(creditScore, 0, 100);
  stabScore = finClamp(stabScore, 0, 100);

  let inflation = bandInflation(inflScore, inputs.highInflationScenario);
  let credit = bandCredit(creditScore);
  let stability = bandStability(stabScore);
  inflation = applyHysteresis(
    inflScore,
    persisted.lastInflationBand,
    inflation,
    ['disinflation', 'anchored', 'elevated', 'high', 'scenario_runaway'],
    V1014_FINSTAB_LIMITS.hysteresisDeadband,
  ) as InflationConditionsBand;
  credit = applyHysteresis(
    creditScore,
    persisted.lastCreditBand,
    credit,
    ['frozen', 'restricted', 'tight', 'neutral', 'accommodative'],
    V1014_FINSTAB_LIMITS.hysteresisDeadband,
  ) as CreditConditionsBand;
  stability = applyHysteresis(
    stabScore,
    persisted.lastStabilityBand,
    stability,
    ['crisis', 'stressed', 'watch', 'stable', 'resilient'],
    V1014_FINSTAB_LIMITS.hysteresisDeadband,
  ) as FinancialStabilityBand;
  const stance = bandStance(inflation, credit, stability);

  const costMultBase = 1 + (inflScore - 45) / 200;
  const costOfLivingMultiplier = finClamp(
    inputs.highInflationScenario
      ? Math.max(costMultBase, 1.18) * finClamp(inputs.inflationSettingMultiplier, 1, 1.35)
      : costMultBase,
    V1014_FINSTAB_LIMITS.minCostMultiplier,
    V1014_FINSTAB_LIMITS.maxCostMultiplier,
  );
  const creditSpreadMultiplier = creditSpreadMultiplierFromScore(
    creditScore,
    V1014_FINSTAB_LIMITS.minCreditSpreadMultiplier,
    V1014_FINSTAB_LIMITS.maxCreditSpreadMultiplier,
  );
  const investmentRiskPremium = finClamp(0.04 + (55 - creditScore) / 250 + (inflScore - 50) / 400, 0, 0.35);
  const loanAffordability = loanAffordabilityIndex(creditScore, stabScore);
  const financialStabilityIndex = stabScore;

  const regionalSpreads: RegionalCreditSpread[] = V1014_FINSTAB_CORE_REGIONS.map((rid) => {
    const prof = V1014_FINSTAB_REGION_CREDIT_PROFILE[rid] || {
      baseSpread: 1,
      housingSensitivity: 1,
      miningExposure: 1,
      publicSectorShare: 1,
    };
    const reg = inputs.regions[rid] || {};
    let local = prof.baseSpread;
    if (reg.housingPressure === 'severe' || reg.housingPressure === 'high') local += 0.08 * prof.housingSensitivity;
    if (reg.investmentPressure === 'overheated') local += 0.06 * prof.miningExposure;
    const spreadBand: RegionalCreditSpread['spreadBand'] =
      local >= 1.18 ? 'severe' : local >= 1.08 ? 'elevated' : local >= 1.02 ? 'moderate' : 'low';
    return {
      regionId: rid,
      spreadBand,
      investmentRiskPremium: finRound(investmentRiskPremium * local, 3),
      householdCreditStress: finRound(finClamp(100 - loanAffordability + local * 8, 0, 100), 1),
      explanation: `${rid} spread ${spreadBand} — base ${prof.baseSpread}, housing sens. ${prof.housingSensitivity}.`,
    };
  }).slice(0, V1014_FINSTAB_LIMITS.maxRegionalSpreads);

  if (inflation === 'elevated' || inflation === 'high' || inflation === 'scenario_runaway') {
    pressures.push({
      id: `mp_infl_${inputs.turn}`,
      domain: 'inflation',
      severity: inflation === 'scenario_runaway' ? 'critical' : inflation === 'high' ? 'major' : 'meaningful',
      temporary: inputs.highInflationScenario,
      explanation: `Inflation conditions at ${V1014_FINSTAB_INFLATION_LABEL[inflation]} — cost-of-living multiplier ${costOfLivingMultiplier.toFixed(2)}.`,
      evidence: evidence.filter((e) => e.sourceSystem === 'scenario' || e.sourceSystem === 'v1013').slice(0, 4),
    });
  }
  if (credit === 'tight' || credit === 'restricted' || credit === 'frozen') {
    pressures.push({
      id: `mp_credit_${inputs.turn}`,
      domain: 'credit',
      severity: credit === 'frozen' ? 'critical' : credit === 'restricted' ? 'major' : 'meaningful',
      temporary: inputs.creditShockActive,
      explanation: `Credit conditions ${V1014_FINSTAB_CREDIT_LABEL[credit]} — spread multiplier ${creditSpreadMultiplier.toFixed(2)}.`,
      evidence: evidence.filter((e) => e.sourceSystem === 'v1012' || e.sourceSystem === 'v109').slice(0, 4),
    });
  }

  const transitions: MacroFinancialTransition[] = [...(prevState?.transitions || (persisted.revision ? [] : []))];
  const maybeTrans = (
    domain: MacroFinancialTransition['domain'],
    fromB: string,
    toB: string,
    expl: string,
  ) => {
    if (fromB !== toB)
      transitions.push({
        id: `tr_${domain}_${inputs.turn}_${transitions.length}`,
        turn: inputs.turn,
        domain,
        fromBand: fromB,
        toBand: toB,
        explanation: expl,
      });
  };
  maybeTrans('inflation', persisted.lastInflationBand, inflation, `Inflation band ${persisted.lastInflationBand} → ${inflation}`);
  maybeTrans('credit', persisted.lastCreditBand, credit, `Credit band ${persisted.lastCreditBand} → ${credit}`);
  maybeTrans('stability', persisted.lastStabilityBand, stability, `Stability band ${persisted.lastStabilityBand} → ${stability}`);
  maybeTrans('stance', persisted.lastStance, stance, `Policy stance ${persisted.lastStance} → ${stance}`);

  const history = [
    ...persisted.history,
    { turn: inputs.turn, stabilityIndex: financialStabilityIndex, inflation, credit },
  ].slice(-V1014_FINSTAB_LIMITS.maxHistory);

  const state: NationalMacroFinancialState = {
    schemaVersion: V1014_FINSTAB_SCHEMA_VERSION,
    revision: persisted.revision + 1,
    turn: inputs.turn,
    inputHash: hash,
    enabled: true,
    inflation,
    credit,
    stability,
    stance,
    modifiers: {
      costOfLivingMultiplier,
      creditSpreadMultiplier,
      investmentRiskPremium,
      loanAffordabilityIndex: loanAffordability,
      financialStabilityIndex,
    },
    regionalSpreads,
    pressures: pressures.slice(0, V1014_FINSTAB_LIMITS.maxPressures),
    transitions: transitions.slice(-V1014_FINSTAB_LIMITS.maxTransitions),
    history,
    evidence: evidence.slice(0, V1014_FINSTAB_LIMITS.maxEvidence),
    summary: `Macro financial: ${V1014_FINSTAB_INFLATION_LABEL[inflation]} inflation, ${V1014_FINSTAB_CREDIT_LABEL[credit]} credit, ${V1014_FINSTAB_STABILITY_LABEL[stability]} stability.`,
    integrationNotes: [
      'Cost multiplier applies to economy/travel presentation layers only (bounded).',
      'Credit spread multiplier informs loan pricing metadata — never auto-borrows.',
      'Investment risk premium feeds V10.9 readiness interpretation only.',
      'Resource market commodity prices are excluded from macro CPI aggregation.',
    ],
  };

  const nextPersisted: MacroFinancialPersisted = {
    ...persisted,
    revision: state.revision,
    lastUpdatedTurn: inputs.turn,
    lastInputHash: hash,
    inflationScore: inflScore,
    creditScore,
    stabilityScore: stabScore,
    lastInflationBand: inflation,
    lastCreditBand: credit,
    lastStabilityBand: stability,
    lastStance: stance,
    history,
  };

  const events: MacroFinancialComputeResult['events'] = [];
  transitions.forEach((t) => {
    if (t.domain !== 'stance' && t.fromBand !== t.toBand) {
      events.push({
        id: `mf_${t.id}`,
        turn: inputs.turn,
        kind: `macro_${t.domain}_shift`,
        significance:
          t.domain === 'stability' && (t.toBand === 'crisis' || t.toBand === 'stressed') ? 'major' : 'meaningful',
        title: `Macro ${t.domain} shift`,
        summary: t.explanation,
        dedupeKey: `v1014:${t.domain}:${t.toBand}:${inputs.turn}`,
      });
    }
  });

  return { state, persisted: nextPersisted, events };
}

export function macroFinancialEconomyCostMultiplier(state: NationalMacroFinancialState | null | undefined): number {
  if (!state?.enabled) return 1;
  return finClamp(
    state.modifiers.costOfLivingMultiplier,
    V1014_FINSTAB_LIMITS.minCostMultiplier,
    V1014_FINSTAB_LIMITS.maxCostMultiplier,
  );
}

export function macroFinancialLoanSpreadMultiplier(state: NationalMacroFinancialState | null | undefined): number {
  if (!state?.enabled) return 1;
  return finClamp(
    state.modifiers.creditSpreadMultiplier,
    V1014_FINSTAB_LIMITS.minCreditSpreadMultiplier,
    V1014_FINSTAB_LIMITS.maxCreditSpreadMultiplier,
  );
}

export function buildMacroFinancialInputs(raw: {
  turn: number;
  gameState?: Record<string, unknown>;
  gameSettings?: Record<string, unknown>;
  player?: { money?: number; loans?: Array<{ remaining?: number; amount?: number }> };
  aiPlayer?: { money?: number; loans?: Array<{ remaining?: number; amount?: number }> };
}): MacroFinancialSystemInputs {
  const gs = raw.gameState || {};
  const gset = raw.gameSettings || {};
  const scenarioId = String(gset.selectedScenarioId || gs.selectedScenarioId || '');
  const highInflationScenario =
    Boolean(gset.highInflationScenario || gs.highInflationScenario) ||
    scenarioId.includes('high_inflation') ||
    scenarioId.includes('inflation') ||
    Number(gset.inflationMultiplier || 1) > 1.15;
  const inflMult = Number(gset.inflationMultiplier || gs.inflationMultiplier || 1);
  const regions: MacroFinancialSystemInputs['regions'] = {};
  V1014_FINSTAB_CORE_REGIONS.forEach((rid) => {
    regions[rid] = {};
  });
  const actorCreditStressIndex = computeActorCreditStressIndex(raw.player, raw.aiPlayer);
  return {
    turn: Number(raw.turn || 1),
    highInflationScenario,
    inflationSettingMultiplier: inflMult,
    publicStability: Number(
      (gs.publicStabilityState as { stability?: number } | undefined)?.stability ?? gs.publicStability ?? 60,
    ),
    fiscalPressure: null,
    fiscalSustainability: null,
    sovereignDebtPressure: null,
    capitalFlexibility: null,
    capitalPressure: null,
    householdAffordability: null,
    householdInflationScenarioActive: false,
    systemicLiquidityBand: null,
    actorCreditStressIndex,
    activeCrises: Array.isArray((gs.crisisChainState as { activeCrises?: unknown[] } | undefined)?.activeCrises)
      ? ((gs.crisisChainState as { activeCrises: unknown[] }).activeCrises.length)
      : Number(gs.activeCrises || 0),
    creditShockActive: Boolean(gs.creditShockActive || gset.creditShockActive),
    regions,
  };
}


// OP10M_MODULE_END agent-10-finance
