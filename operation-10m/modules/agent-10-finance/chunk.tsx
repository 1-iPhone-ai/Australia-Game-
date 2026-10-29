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

export type V1014_FINSTAB_QueryTopic =
  | 'overview'
  | 'inflation'
  | 'credit'
  | 'stability'
  | 'stance'
  | 'cost_pressure'
  | 'loan_conditions'
  | 'investment_climate_link'
  | 'fiscal_spillover'
  | 'regional_spread';

export interface MacroFinancialQuery {
  topic: V1014_FINSTAB_QueryTopic;
  regionId: string | null;
  rawQuestion: string;
}

export interface MacroFinancialWorldRootEvent {
  id: string;
  turn: number;
  day: number;
  sourceSystem: string;
  sourceEventId: string;
  kind: string;
  significance: 'minor' | 'meaningful' | 'major' | 'critical';
  visibility: 'public' | 'diagnostic';
  summary: string;
  title: string;
  affectedDomains: string[];
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


// --- source: prices/market-dynamics.ts ---
export type ResourceMarketTrend = 'stable' | 'rising' | 'falling' | 'volatile';

export interface DeterministicMarketStepInput {
  resource: string;
  basePrice: number;
  currentPrice: number;
  trend: ResourceMarketTrend;
  /** Deterministic driver in [-1, 1] — stand-in for seeded gameplay RNG in canonical market update. */
  randCentered: number;
  pressureFraction?: number;
}

export interface DeterministicMarketStepResult {
  nextPrice: number;
  meanReversionComponent: number;
  trendDelta: number;
  pressureComponent: number;
}

const TREND_BIAS: Record<ResourceMarketTrend, number> = {
  stable: 0,
  rising: 0.5,
  falling: -0.5,
  volatile: 0,
};

const TREND_VARIANCE: Record<ResourceMarketTrend, number> = {
  stable: 0.5,
  rising: 1,
  falling: 1,
  volatile: 1.5,
};

/** Deterministic subset of V9.4 computeDailyMarketUpdate price step (commodity layer only). */
export function stepResourceMarketPriceDeterministic(input: DeterministicMarketStepInput): DeterministicMarketStepResult {
  const { basePrice, currentPrice, trend, randCentered } = input;
  const meanReversionComponent = 0.12 * (basePrice - currentPrice);
  const baseVariance = 0.15 * basePrice;
  const bias = TREND_BIAS[trend];
  const varianceScale = TREND_VARIANCE[trend];
  const centered = Math.max(-1, Math.min(1, randCentered));
  const trendDelta = (centered + bias) * baseVariance * varianceScale;
  const p = Math.max(-0.06, Math.min(0.06, Number(input.pressureFraction) || 0));
  const pressureComponent = p * basePrice;
  const nextPrice = Math.max(1, Math.round(currentPrice + meanReversionComponent + trendDelta + pressureComponent));
  return { nextPrice, meanReversionComponent, trendDelta, pressureComponent };
}

export function cycleMarketTrendDeterministic(day: number, previous: ResourceMarketTrend | '', randUnit: number): ResourceMarketTrend {
  if (previous && (day - 1) % 3 !== 0) return previous as ResourceMarketTrend;
  const r = Math.max(0, Math.min(1, randUnit));
  if (r < 0.4) return 'stable';
  if (r < 0.65) return 'rising';
  if (r < 0.9) return 'falling';
  return 'volatile';
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


// --- source: shocks/scenario-runner.ts ---

export interface ShockSequenceResult {
  scores: { inflation: number; credit: number; stability: number };
  creditShockActive: boolean;
  appliedShockIds: string[];
  skippedShockIds: string[];
}

/** Applies shock catalog entries in order with score clamping — simulation helper only. */
export function runFinancialShockSequence(
  initial: { inflation: number; credit: number; stability: number },
  shockIds: string[],
): ShockSequenceResult {
  let scores = { ...initial };
  let creditShockActive = false;
  const appliedShockIds: string[] = [];
  const skippedShockIds: string[] = [];
  for (const id of shockIds) {
    const shock = getShockById(id);
    if (!shock) {
      skippedShockIds.push(id);
      continue;
    }
    const next = applyShockDeltasToScores(scores, shock);
    scores = {
      inflation: finClamp(next.inflation, 0, 100),
      credit: finClamp(next.credit, 0, 100),
      stability: finClamp(next.stability, 0, 100),
    };
    creditShockActive = creditShockActive || next.creditShockActive;
    appliedShockIds.push(id);
  }
  return { scores, creditShockActive, appliedShockIds, skippedShockIds };
}


// --- source: inflation/pass-through.ts ---

/** Applies macro cost-of-living multiplier to non-commodity economy/travel presentation costs. */
export function applyMacroCostOfLivingToEconomyLayer(baseCost: number, multiplier: number, min = 0.92, max = 1.45): number {
  const m = finClamp(multiplier, min, max);
  return Math.max(0, Math.round(baseCost * m));
}

/** Auto-mode handicap category — must not alter resource market quotes or macro CPI scores. */
export function autoModePriceInflationHandicapFactor(enabled: boolean, categoryActive: boolean): number {
  if (!enabled || !categoryActive) return 1;
  return 1.08;
}

export function inflationBandSeverityRank(band: InflationConditionsBand): number {
  const order: InflationConditionsBand[] = ['disinflation', 'anchored', 'elevated', 'high', 'scenario_runaway'];
  return order.indexOf(band);
}

export function compareInflationBands(a: InflationConditionsBand, b: InflationConditionsBand): number {
  return inflationBandSeverityRank(a) - inflationBandSeverityRank(b);
}

export function serviceCostPassThroughFromAffordability(
  affordability: 'healthy' | 'strained' | 'severe_pressure' | null | undefined,
): number {
  if (affordability === 'severe_pressure') return 0.12;
  if (affordability === 'strained') return 0.07;
  return 0;
}


// --- source: inflation/wage-price-spiral.ts ---

export interface WagePriceSpiralInputs {
  inflationBand: InflationConditionsBand;
  householdAffordability: 'healthy' | 'strained' | 'severe_pressure' | null | undefined;
  fiscalPressure: 'healthy' | 'tight' | 'strained' | 'critical' | null | undefined;
  /** 0–100 nominal wage growth pressure from labor module (read-only). */
  wageGrowthPressureScore?: number;
  turn: number;
}

export interface WagePriceSpiralAssessment {
  spiralRisk: 'low' | 'moderate' | 'elevated' | 'critical';
  wagePassThroughFraction: number;
  impliedInflationScoreDelta: number;
  narrative: string;
  dampeningFactors: string[];
}

const BAND_BASE_RISK: Record<InflationConditionsBand, number> = {
  disinflation: 0.05,
  anchored: 0.12,
  elevated: 0.28,
  high: 0.45,
  scenario_runaway: 0.72,
};

/** Deterministic wage–price feedback — does not mutate commodity resource prices. */
export function assessWagePriceSpiral(inputs: WagePriceSpiralInputs): WagePriceSpiralAssessment {
  const dampeningFactors: string[] = [];
  let risk = BAND_BASE_RISK[inputs.inflationBand];

  const wage = finClamp(inputs.wageGrowthPressureScore ?? 40, 0, 100);
  risk += (wage - 40) * 0.004;

  if (inputs.householdAffordability === 'severe_pressure') {
    risk += 0.12;
    dampeningFactors.push('household_affordability_cap');
  } else if (inputs.householdAffordability === 'strained') {
    risk += 0.05;
  }

  if (inputs.fiscalPressure === 'critical') {
    risk += 0.08;
    dampeningFactors.push('fiscal_austerity_dampener');
  } else if (inputs.fiscalPressure === 'strained') {
    risk += 0.03;
  }

  if (inflationBandSeverityRank(inputs.inflationBand) <= inflationBandSeverityRank('anchored')) {
    risk *= 0.65;
    dampeningFactors.push('anchored_inflation_band');
  }

  // Even turns slightly dampen narrative spiral (contractual lag)
  if (inputs.turn % 2 === 0) {
    risk *= 0.97;
  }

  const clampedRisk = finClamp(risk, 0, 1);
  const spiralRisk: WagePriceSpiralAssessment['spiralRisk'] =
    clampedRisk >= 0.62 ? 'critical' : clampedRisk >= 0.42 ? 'elevated' : clampedRisk >= 0.22 ? 'moderate' : 'low';

  const wagePassThroughFraction = finRound(finClamp(clampedRisk * 0.35, 0, 0.28), 3);
  const impliedInflationScoreDelta = finRound(wagePassThroughFraction * 100 * 0.55, 2);

  const narrative =
    spiralRisk === 'critical'
      ? 'Wage settlements and service prices are reinforcing — macro CPI channel only.'
      : spiralRisk === 'elevated'
        ? 'Second-round wage pressure is building in services.'
        : spiralRisk === 'moderate'
          ? 'Mild wage pass-through; inflation expectations still manageable.'
          : 'Wage–price loop contained.';

  return {
    spiralRisk,
    wagePassThroughFraction,
    impliedInflationScoreDelta,
    narrative,
    dampeningFactors,
  };
}

export function wageSpiralInflationScoreAdjustment(assessment: WagePriceSpiralAssessment): number {
  if (assessment.spiralRisk === 'low') return 0;
  return finRound(assessment.impliedInflationScoreDelta, 2);
}


// --- source: inflation/cpi-basket.ts ---

export interface CpiBasketCategory {
  id: string;
  label: string;
  weight: number;
  /** Excluded from macro CPI if true (commodity-linked). */
  commodityLinked: boolean;
}

/** Non-commodity macro CPI weights (must sum to 1 for non-commodity slice). */
export const MACRO_CPI_BASKET: readonly CpiBasketCategory[] = [
  { id: 'housing_services', label: 'Housing services', weight: 0.22, commodityLinked: false },
  { id: 'utilities', label: 'Utilities', weight: 0.08, commodityLinked: false },
  { id: 'food_at_home', label: 'Food at home', weight: 0.11, commodityLinked: false },
  { id: 'transport_services', label: 'Transport services', weight: 0.14, commodityLinked: false },
  { id: 'health_education', label: 'Health & education', weight: 0.18, commodityLinked: false },
  { id: 'recreation', label: 'Recreation', weight: 0.09, commodityLinked: false },
  { id: 'other_services', label: 'Other services', weight: 0.18, commodityLinked: false },
] as const;

export interface CategoryInflationContribution {
  categoryId: string;
  label: string;
  contribution: number;
  band: InflationConditionsBand;
}

export interface CpiBasketDecomposition {
  headlineIndex: number;
  servicesShare: number;
  goodsShare: number;
  categories: CategoryInflationContribution[];
  excludesCommodityQuotes: true;
}

const BAND_INDEX: Record<InflationConditionsBand, number> = {
  disinflation: 96,
  anchored: 100,
  elevated: 106,
  high: 114,
  scenario_runaway: 128,
};

function categoryBand(base: InflationConditionsBand, categoryId: string, turn: number): InflationConditionsBand {
  const jitter = (categoryId.charCodeAt(0) + turn) % 3;
  const order: InflationConditionsBand[] = ['disinflation', 'anchored', 'elevated', 'high', 'scenario_runaway'];
  const idx = finClamp(order.indexOf(base) + (jitter === 0 ? 0 : jitter === 1 ? 1 : -1), 0, order.length - 1);
  return order[idx];
}

/** Builds a presentation-only CPI decomposition; resource market prices stay out of basket. */
export function decomposeMacroCpiBasket(
  inflationBand: InflationConditionsBand,
  turn: number,
  serviceCostPassThrough = 0,
): CpiBasketDecomposition {
  const categories: CategoryInflationContribution[] = [];
  let headline = 0;
  let services = 0;

  for (const cat of MACRO_CPI_BASKET) {
    if (cat.commodityLinked) continue;
    const band = categoryBand(inflationBand, cat.id, turn);
    let idx = BAND_INDEX[band];
    if (cat.id.includes('services') || cat.id === 'other_services') {
      idx += serviceCostPassThrough * 100;
      services += cat.weight;
    }
    const contribution = finRound(idx * cat.weight, 3);
    headline += contribution;
    categories.push({
      categoryId: cat.id,
      label: cat.label,
      contribution,
      band,
    });
  }

  const goodsShare = finRound(1 - services, 3);
  return {
    headlineIndex: finRound(headline, 2),
    servicesShare: finRound(services, 3),
    goodsShare,
    categories,
    excludesCommodityQuotes: true,
  };
}

export function macroCpiBasketWeightSum(): number {
  return finRound(
    MACRO_CPI_BASKET.filter((c) => !c.commodityLinked).reduce((s, c) => s + c.weight, 0),
    4,
  );
}


// --- source: inflation/expectations-anchor.ts ---

export interface InflationExpectationsState {
  /** 0–100; higher = better anchored */
  anchoringScore: number;
  /** Expected inflation band one turn ahead (deterministic) */
  expectedBand: InflationConditionsBand;
  deanchoringRisk: 'low' | 'moderate' | 'high';
  revisionFromPrior: number;
}

export interface ExpectationsStepInputs {
  currentBand: InflationConditionsBand;
  priorAnchoringScore: number;
  fiscalPressure: 'healthy' | 'tight' | 'strained' | 'critical' | null | undefined;
  highInflationScenario?: boolean;
  turn: number;
}

const BAND_FORWARD: Record<InflationConditionsBand, InflationConditionsBand> = {
  disinflation: 'disinflation',
  anchored: 'anchored',
  elevated: 'elevated',
  high: 'high',
  scenario_runaway: 'scenario_runaway',
};

/** One-step expectations update — persisted separately in Agent 25 merge. */
export function stepInflationExpectations(inputs: ExpectationsStepInputs): InflationExpectationsState {
  let score = finClamp(inputs.priorAnchoringScore || 72, 0, 100);

  if (compareInflationBands(inputs.currentBand, 'elevated') >= 0) {
    score -= 4.5;
  } else if (compareInflationBands(inputs.currentBand, 'anchored') <= 0) {
    score += 1.2;
  }

  if (inputs.highInflationScenario) {
    score -= 6;
  }
  if (inputs.fiscalPressure === 'critical') {
    score -= 2.5;
  } else if (inputs.fiscalPressure === 'healthy') {
    score += 0.8;
  }

  if (inputs.turn % 4 === 0) {
    score += 0.5;
  }

  score = finClamp(score, 15, 98);
  const revisionFromPrior = finRound(score - (inputs.priorAnchoringScore || 72), 2);

  let expectedBand = BAND_FORWARD[inputs.currentBand];
  if (score < 45 && compareInflationBands(inputs.currentBand, 'elevated') >= 0) {
    expectedBand = 'high';
  }
  if (score < 30) {
    expectedBand = 'scenario_runaway';
  }

  const deanchoringRisk: InflationExpectationsState['deanchoringRisk'] =
    score >= 62 ? 'low' : score >= 45 ? 'moderate' : 'high';

  return {
    anchoringScore: finRound(score, 2),
    expectedBand,
    deanchoringRisk,
    revisionFromPrior,
  };
}

export function initialInflationAnchoringScore(): number {
  return 72;
}


// --- source: inflation/phillips-slack.ts ---

export interface PhillipsSlackAssessment {
  slackBand: 'deep_slack' | 'moderate_slack' | 'balanced' | 'overheated';
  impliedInflationScoreDelta: number;
  unemploymentContribution: number;
  outputGapContribution: number;
  narrative: string;
}

function unemploymentSlack(unemploymentBand: Agent06MacroSnapshot['unemploymentBand']): number {
  switch (unemploymentBand) {
    case 'low':
      return -0.06;
    case 'moderate':
      return 0;
    case 'elevated':
      return 0.05;
    case 'severe':
      return 0.11;
    default:
      return 0;
  }
}

/** Deterministic Phillips-style slack read — macro CPI score channel only. */
export function assessPhillipsSlack(
  inflationBand: InflationConditionsBand,
  snapshot: Agent06MacroSnapshot | null | undefined,
): PhillipsSlackAssessment {
  const gap = finClamp(snapshot?.outputGap ?? 0, -0.08, 0.08);
  const demand = finClamp(snapshot?.nominalDemandPressure ?? 0, -1, 1);

  const outputGapContribution = finRound(gap * 4.2 + demand * 0.04, 3);
  const unemploymentContribution = finRound(unemploymentSlack(snapshot?.unemploymentBand ?? 'moderate'), 3);

  let combined = outputGapContribution + unemploymentContribution;
  if (inflationBandSeverityRank(inflationBand) >= inflationBandSeverityRank('elevated')) {
    combined += 0.04;
  }

  const slackBand: PhillipsSlackAssessment['slackBand'] =
    combined <= -0.05
      ? 'deep_slack'
      : combined <= 0.02
        ? 'moderate_slack'
        : combined <= 0.08
          ? 'balanced'
          : 'overheated';

  const impliedInflationScoreDelta = finRound(finClamp(combined * 18, -4, 9), 2);

  const narrative =
    slackBand === 'overheated'
      ? 'Labor market tightness and positive output gap are adding demand-side inflation pressure.'
      : slackBand === 'balanced'
        ? 'Slack roughly balanced — inflation driven mainly by other channels.'
        : slackBand === 'moderate_slack'
          ? 'Some economic slack is dampening price pressures.'
          : 'Deep slack is disinflationary in the macro CPI channel.';

  return {
    slackBand,
    impliedInflationScoreDelta,
    unemploymentContribution,
    outputGapContribution,
    narrative,
  };
}

export function phillipsSlackInflationScoreAdjustment(assessment: PhillipsSlackAssessment): number {
  if (assessment.slackBand === 'deep_slack') return finRound(Math.min(assessment.impliedInflationScoreDelta, 0), 2);
  if (assessment.slackBand === 'overheated') return finRound(Math.max(assessment.impliedInflationScoreDelta, 0), 2);
  return finRound(assessment.impliedInflationScoreDelta * 0.5, 2);
}


// --- source: inflation/core-headline-spread.ts ---

export interface CoreHeadlineSpread {
  headlineIndex: number;
  coreIndex: number;
  spreadPoints: number;
  volatileShare: number;
  interpretation: 'aligned' | 'headline_above_core' | 'core_sticky_elevated';
}

const VOLATILE_CATEGORY_IDS = new Set(['food_at_home', 'utilities', 'transport_services']);

/** Separates sticky core services from volatile basket lines (still non-commodity macro CPI). */
export function computeCoreHeadlineSpread(
  inflationBand: InflationConditionsBand,
  turn: number,
  serviceCostPassThrough = 0,
): CoreHeadlineSpread {
  const basket = decomposeMacroCpiBasket(inflationBand, turn, serviceCostPassThrough);
  let coreSum = 0;
  let coreWeight = 0;
  let volatileSum = 0;
  let volatileWeight = 0;

  for (const cat of basket.categories) {
    const meta = MACRO_CPI_BASKET.find((m) => m.id === cat.categoryId);
    const w = meta?.weight ?? 0;
    if (VOLATILE_CATEGORY_IDS.has(cat.categoryId)) {
      volatileSum += cat.contribution;
      volatileWeight += w;
    } else {
      coreSum += cat.contribution;
      coreWeight += w;
    }
  }

  const headlineIndex = basket.headlineIndex;
  const coreIndex = coreWeight > 0 ? finRound(coreSum / coreWeight, 2) : headlineIndex;
  const spreadPoints = finRound(headlineIndex - coreIndex, 2);
  const volatileShare = finRound(finClamp(volatileWeight, 0, 1), 3);

  const interpretation: CoreHeadlineSpread['interpretation'] =
    Math.abs(spreadPoints) < 1.5
      ? 'aligned'
      : spreadPoints > 1.5
        ? 'headline_above_core'
        : 'core_sticky_elevated';

  return {
    headlineIndex,
    coreIndex,
    spreadPoints,
    volatileShare,
    interpretation,
  };
}


// --- source: inflation/supply-demand-shock.ts ---

export type InflationShockDriver = 'demand_pull' | 'cost_push' | 'mixed' | 'disinflationary';

export interface InflationShockClassification {
  driver: InflationShockDriver;
  demandScore: number;
  supplyScore: number;
  confidence: 'low' | 'medium' | 'high';
  summary: string;
}

export function classifyInflationShockDrivers(
  inflationBand: InflationConditionsBand,
  inputs: MacroFinancialSystemInputs,
  agent06: Agent06MacroSnapshot | null | undefined,
): InflationShockClassification {
  const phillips = assessPhillipsSlack(inflationBand, agent06);
  const spiral = assessWagePriceSpiral({
    inflationBand,
    householdAffordability: inputs.householdAffordability,
    fiscalPressure: inputs.fiscalPressure,
    wageGrowthPressureScore: 45 + (inputs.inflationSettingMultiplier ?? 1) * 12,
    turn: inputs.turn,
  });

  let demandScore = 0;
  let supplyScore = 0;

  if (phillips.slackBand === 'overheated') demandScore += 0.35;
  if ((inputs.inflationSettingMultiplier ?? 1) > 1.15) demandScore += 0.22;
  if (inputs.highInflationScenario) demandScore += 0.12;

  if (spiral.spiralRisk === 'critical' || spiral.spiralRisk === 'elevated') supplyScore += 0.28;
  if (inputs.householdAffordability === 'severe_pressure') supplyScore += 0.18;
  if (inputs.fiscalPressure === 'critical') supplyScore += 0.1;

  if (phillips.slackBand === 'deep_slack') {
    demandScore -= 0.2;
    supplyScore -= 0.05;
  }

  demandScore = finRound(Math.max(0, demandScore), 3);
  supplyScore = finRound(Math.max(0, supplyScore), 3);

  const margin = Math.abs(demandScore - supplyScore);
  const confidence: InflationShockClassification['confidence'] =
    margin >= 0.2 ? 'high' : margin >= 0.08 ? 'medium' : 'low';

  let driver: InflationShockDriver = 'mixed';
  if (demandScore < 0.08 && supplyScore < 0.08 && phillips.slackBand === 'deep_slack') {
    driver = 'disinflationary';
  } else if (demandScore > supplyScore + 0.08) {
    driver = 'demand_pull';
  } else if (supplyScore > demandScore + 0.08) {
    driver = 'cost_push';
  }

  const summary =
    driver === 'demand_pull'
      ? 'Inflation looks demand-led (slack/overheat channel).'
      : driver === 'cost_push'
        ? 'Inflation looks cost-push (services/wage/fiscal spillover).'
        : driver === 'disinflationary'
          ? 'Slack dominates — disinflationary bias in macro CPI scoring.'
          : 'Mixed demand and supply contributions — monitor both channels.';

  return { driver, demandScore, supplyScore, confidence, summary };
}


// --- source: rates/monetary-reaction.ts ---

export interface MonetaryReactionInputs {
  inflationBand: InflationConditionsBand;
  creditBand: CreditConditionsBand;
  inflationScore: number;
  creditScore: number;
  creditShockActive?: boolean;
  targetInflationScore?: number;
}

export interface MonetaryReactionRecommendation {
  recommendedStance: MonetaryPolicyStance;
  inflationGap: number;
  policyTightnessIndex: number;
  rationale: string;
  lagTurns: number;
}

const STANCE_ORDER: MonetaryPolicyStance[] = [
  'emergency_easing',
  'accommodative',
  'neutral',
  'tightening',
  'restrictive',
];

function stanceIndex(s: MonetaryPolicyStance): number {
  return STANCE_ORDER.indexOf(s);
}

function indexToStance(i: number): MonetaryPolicyStance {
  return STANCE_ORDER[finClamp(Math.round(i), 0, STANCE_ORDER.length - 1)];
}

/** Simplified Taylor-style reaction — metadata for UI / co-pilot; does not execute trades. */
export function recommendMonetaryStance(inputs: MonetaryReactionInputs): MonetaryReactionRecommendation {
  const target = inputs.targetInflationScore ?? 45;
  const inflationGap = finRound(inputs.inflationScore - target, 2);
  let tightness = 2 + inflationGap * 0.035;

  if (inflationBandSeverityRank(inputs.inflationBand) >= inflationBandSeverityRank('high')) {
    tightness += 0.85;
  } else if (inflationBandSeverityRank(inputs.inflationBand) >= inflationBandSeverityRank('elevated')) {
    tightness += 0.35;
  }

  if (inputs.creditScore < 42 || inputs.creditBand === 'frozen') {
    tightness -= 0.5;
  }
  if (inputs.creditShockActive) {
    tightness += 0.25;
  }

  if (inputs.creditBand === 'accommodative' && inflationGap < 5) {
    tightness -= 0.2;
  }

  tightness = finClamp(tightness, 0, STANCE_ORDER.length - 1);
  const recommendedStance = indexToStance(tightness);

  const lagTurns = inputs.creditShockActive ? 2 : 1;
  const rationale =
    inflationGap > 12
      ? 'Inflation materially above target — tightening bias.'
      : inflationGap < -8
        ? 'Below-target inflation — easing bias.'
        : 'Near target — neutral stance.';

  return {
    recommendedStance,
    inflationGap,
    policyTightnessIndex: finRound(tightness / (STANCE_ORDER.length - 1), 3),
    rationale,
    lagTurns,
  };
}

export function stanceDriftTowardRecommendation(
  current: MonetaryPolicyStance,
  recommended: MonetaryPolicyStance,
  turnsElapsed: number,
): MonetaryPolicyStance {
  const cur = stanceIndex(current);
  const rec = stanceIndex(recommended);
  if (cur === rec) return current;
  const step = turnsElapsed >= 2 ? 1 : 0;
  if (step === 0) return current;
  return rec > cur ? indexToStance(cur + 1) : indexToStance(cur - 1);
}


// --- source: rates/inflation-target-breach.ts ---

export interface InflationTargetBand {
  lower: number;
  upper: number;
  midpoint: number;
}

export const DEFAULT_INFLATION_TARGET_BAND: InflationTargetBand = {
  lower: 2,
  upper: 3,
  midpoint: 2.5,
};

export type TargetBreachSide = 'below' | 'within' | 'above';

export interface InflationTargetBreach {
  side: TargetBreachSide;
  deviationFromMidpoint: number;
  breachSeverity: 'none' | 'watch' | 'material' | 'severe';
  policyUrgencyScore: number;
}

/** Maps macro inflation score (0–100) to implicit annualized target metaphor for dashboards. */
export function inflationScoreToImpliedTargetPercent(inflationScore: number): number {
  const s = finClamp(inflationScore, 0, 100);
  return finRound(0.5 + (s / 100) * 7.5, 2);
}

export function assessInflationTargetBreach(
  inflationScore: number,
  band: InflationTargetBand = DEFAULT_INFLATION_TARGET_BAND,
): InflationTargetBreach {
  const implied = inflationScoreToImpliedTargetPercent(inflationScore);
  const deviationFromMidpoint = finRound(implied - band.midpoint, 2);

  let side: TargetBreachSide = 'within';
  if (implied < band.lower) side = 'below';
  else if (implied > band.upper) side = 'above';

  const distance =
    side === 'within'
      ? 0
      : side === 'below'
        ? band.lower - implied
        : implied - band.upper;

  const breachSeverity: InflationTargetBreach['breachSeverity'] =
    distance <= 0
      ? 'none'
      : distance < 0.8
        ? 'watch'
        : distance < 1.8
          ? 'material'
          : 'severe';

  const policyUrgencyScore = finRound(
    finClamp((side === 'above' ? distance * 22 : side === 'below' ? distance * 8 : 0) + (breachSeverity === 'severe' ? 25 : 0), 0, 100),
    1,
  );

  return { side, deviationFromMidpoint, breachSeverity, policyUrgencyScore };
}


// --- source: rates/real-rate-gap.ts ---

export interface RealRateGapAssessment {
  nominalPolicyRatePercent: number;
  impliedInflationPercent: number;
  realRatePercent: number;
  gapBand: 'deeply_negative' | 'negative' | 'neutral' | 'positive' | 'restrictive';
  inflationScore: number;
  narrative: string;
}

/** Real rate = nominal policy minus implied CPI — metadata for co-pilot / dashboards. */
export function assessRealRateGap(
  inflationScore: number,
  stance: MonetaryPolicyStance,
  inflationBand: InflationConditionsBand,
): RealRateGapAssessment {
  const nominalPolicyRatePercent = referencePolicyRate(stance, 'neutral') * 100;
  const impliedInflationPercent = inflationScoreToImpliedTargetPercent(inflationScore);
  const realRatePercent = finRound(nominalPolicyRatePercent - impliedInflationPercent, 2);

  let gapBand: RealRateGapAssessment['gapBand'] = 'neutral';
  if (realRatePercent <= -2.5) gapBand = 'deeply_negative';
  else if (realRatePercent < -0.35) gapBand = 'negative';
  else if (realRatePercent <= 1.2) gapBand = 'neutral';
  else if (realRatePercent <= 3.5) gapBand = 'positive';
  else gapBand = 'restrictive';

  if (inflationBand === 'scenario_runaway' && gapBand === 'neutral') {
    gapBand = 'negative';
  }

  const narrative =
    gapBand === 'deeply_negative' || gapBand === 'negative'
      ? 'Real rates are accommodative — inflation may persist unless stance tightens.'
      : gapBand === 'restrictive' || gapBand === 'positive'
        ? 'Real rates are firm — disinflation channel active in metadata layer.'
        : 'Real rates near neutral relative to implied inflation.';

  return {
    nominalPolicyRatePercent: finRound(nominalPolicyRatePercent, 2),
    impliedInflationPercent: finRound(impliedInflationPercent, 2),
    realRatePercent: finClamp(realRatePercent, -8, 8),
    gapBand,
    inflationScore: finRound(inflationScore, 1),
    narrative,
  };
}

export function realRateGapTighteningBias(gap: RealRateGapAssessment): number {
  if (gap.gapBand === 'deeply_negative') return 0.35;
  if (gap.gapBand === 'negative') return 0.18;
  if (gap.gapBand === 'restrictive') return -0.12;
  return 0;
}


// --- source: rates/term-premium-inflation-signal.ts ---

export type TermPremiumSignalBand = 'anchored' | 'creeping' | 'unanchored' | 'stress';

export interface TermPremiumInflationSignal {
  signalBand: TermPremiumSignalBand;
  premiumBps: number;
  narrative: string;
}

/** Long-end term premium as inflation-expectations stress metaphor (deterministic). */
export function assessTermPremiumInflationSignal(input: {
  inflationBand: InflationConditionsBand;
  fiscalPressure: FiscalPressureBand;
  sovereignDebtPressure: SovereignDebtPressureBand;
  highInflationScenario: boolean;
}): TermPremiumInflationSignal {
  let premiumBps = 45;
  if (input.inflationBand === 'elevated') premiumBps += 35;
  if (input.inflationBand === 'high') premiumBps += 75;
  if (input.inflationBand === 'scenario_runaway') premiumBps += 120;

  if (input.fiscalPressure === 'strained') premiumBps += 25;
  if (input.fiscalPressure === 'critical') premiumBps += 55;

  if (input.sovereignDebtPressure === 'elevated') premiumBps += 30;
  if (input.sovereignDebtPressure === 'high' || input.sovereignDebtPressure === 'critical') {
    premiumBps += 50;
  }

  if (input.highInflationScenario) premiumBps += 20;

  premiumBps = finClamp(premiumBps, 15, 420);

  let signalBand: TermPremiumSignalBand = 'anchored';
  if (premiumBps >= 280) signalBand = 'stress';
  else if (premiumBps >= 175) signalBand = 'unanchored';
  else if (premiumBps >= 95) signalBand = 'creeping';

  const narrative =
    signalBand === 'stress'
      ? 'Term premium elevated — long-run inflation expectations under stress in metadata.'
      : signalBand === 'unanchored'
        ? 'Term premium creeping up — fiscal and inflation mix unanchoring long rates.'
        : signalBand === 'creeping'
          ? 'Mild term premium drift — monitor fiscal and CPI bands.'
          : 'Term premium consistent with anchored inflation expectations.';

  return { signalBand, premiumBps: finRound(premiumBps, 0), narrative };
}

export function termPremiumTighteningBias(signal: TermPremiumInflationSignal): number {
  if (signal.signalBand === 'stress') return 0.22;
  if (signal.signalBand === 'unanchored') return 0.12;
  if (signal.signalBand === 'creeping') return 0.05;
  return 0;
}


// --- source: fiscal/fiscal-dominance.ts ---

export type FiscalDominanceBand = 'contained' | 'elevated' | 'dominant';

export interface FiscalDominanceAssessment {
  band: FiscalDominanceBand;
  dominanceScore: number;
  monetaryPolicyOffset: number;
  narrative: string;
  dampensAnchoring: boolean;
}

/** When fiscal stress overwhelms nominal anchor — metadata for guardian / debrief only. */
export function assessFiscalDominance(inputs: MacroFinancialSystemInputs): FiscalDominanceAssessment {
  let score = 0.12;

  if (inputs.fiscalPressure === 'critical') score += 0.38;
  else if (inputs.fiscalPressure === 'strained') score += 0.22;
  else if (inputs.fiscalPressure === 'tight') score += 0.08;

  if (inputs.sovereignDebtPressure === 'high') score += 0.18;
  if (inputs.fiscalSustainability === 'vulnerable') score += 0.12;
  if ((inputs.activeCrises ?? 0) >= 2) score += 0.08;
  if (inputs.highInflationScenario) score += 0.06;

  const clamped = finClamp(score, 0, 1);
  const band: FiscalDominanceBand =
    clamped >= 0.62 ? 'dominant' : clamped >= 0.35 ? 'elevated' : 'contained';

  const monetaryPolicyOffset = finRound(finClamp(1 - clamped * 0.45, 0.55, 1), 3);
  const dampensAnchoring = band !== 'contained';

  const narrative =
    band === 'dominant'
      ? 'Fiscal imperatives are dominating — monetary anchor effectiveness reduced (macro CPI channel).'
      : band === 'elevated'
        ? 'Fiscal pressure is bleeding into inflation expectations.'
        : 'Fiscal dominance contained; monetary transmission nominal.';

  return {
    band,
    dominanceScore: finRound(clamped, 3),
    monetaryPolicyOffset,
    narrative,
    dampensAnchoring,
  };
}


// --- source: credit/credit-inflation-feedback.ts ---

export interface CreditInflationFeedbackAssessment {
  feedbackLoop: 'dampening' | 'neutral' | 'amplifying' | 'vicious';
  creditInflationCoupling: number;
  creditScoreNudge: number;
  inflationScoreNudge: number;
  summary: string;
}

const CREDIT_RANK: Record<CreditConditionsBand, number> = {
  frozen: 0,
  restricted: 1,
  tight: 1.5,
  neutral: 2,
  accommodative: 3,
};

/** Two-way credit–inflation coupling read for macro financial layer. */
export function assessCreditInflationFeedback(
  inflationBand: InflationConditionsBand,
  creditBand: CreditConditionsBand,
  creditShockActive: boolean,
): CreditInflationFeedbackAssessment {
  const inflRank = inflationBandSeverityRank(inflationBand);
  const credRank = CREDIT_RANK[creditBand];

  let coupling = finRound((inflRank - 2) * 0.18 + (2 - credRank) * 0.12, 3);
  if (creditShockActive) coupling += 0.15;
  coupling = finClamp(coupling, -0.5, 0.85);

  let feedbackLoop: CreditInflationFeedbackAssessment['feedbackLoop'] = 'neutral';
  if (inflRank >= 4 && credRank <= 1) {
    feedbackLoop = creditShockActive ? 'vicious' : 'amplifying';
  } else if (inflRank <= 2 && credRank >= 2) {
    feedbackLoop = 'dampening';
  } else if (coupling > 0.35) {
    feedbackLoop = 'amplifying';
  } else if (coupling < -0.1) {
    feedbackLoop = 'dampening';
  }

  const inflationScoreNudge =
    feedbackLoop === 'vicious' ? 1.8 : feedbackLoop === 'amplifying' ? 0.9 : feedbackLoop === 'dampening' ? -0.6 : 0;
  const creditScoreNudge =
    feedbackLoop === 'vicious' ? -2.2 : feedbackLoop === 'amplifying' ? -1.1 : feedbackLoop === 'dampening' ? 0.4 : 0;

  const summary =
    feedbackLoop === 'vicious'
      ? 'Credit stress and high inflation reinforce each other in the macro channel.'
      : feedbackLoop === 'amplifying'
        ? 'Tight credit is not yet breaking the inflation loop.'
        : feedbackLoop === 'dampening'
          ? 'Credit conditions are helping contain inflation pressures.'
          : 'Credit and inflation moving largely independently.';

  return {
    feedbackLoop,
    creditInflationCoupling: coupling,
    creditScoreNudge: finRound(creditScoreNudge, 2),
    inflationScoreNudge: finRound(inflationScoreNudge, 2),
    summary,
  };
}


// --- source: inflation/inflation-momentum.ts ---

export interface InflationMomentumSnapshot {
  turn: number;
  momentumScore: number;
  direction: 'disinflating' | 'stable' | 'accelerating' | 'runaway';
  bandDelta: number;
  streakTurns: number;
}

export interface InflationMomentumState {
  priorBand: InflationConditionsBand | null;
  streakTurns: number;
  lastMomentumScore: number;
}

export function createInitialInflationMomentumState(): InflationMomentumState {
  return { priorBand: null, streakTurns: 0, lastMomentumScore: 50 };
}

/** Deterministic band-to-band momentum — macro CPI channel only. */
export function stepInflationMomentum(
  state: InflationMomentumState,
  turn: number,
  currentBand: InflationConditionsBand,
): { state: InflationMomentumState; snapshot: InflationMomentumSnapshot } {
  const curRank = inflationBandSeverityRank(currentBand);
  const priorRank = state.priorBand ? inflationBandSeverityRank(state.priorBand) : curRank;
  const bandDelta = curRank - priorRank;

  let streakTurns = state.streakTurns;
  if (state.priorBand === currentBand) {
    streakTurns += 1;
  } else {
    streakTurns = 1;
  }

  let momentumScore = state.lastMomentumScore + bandDelta * 9;
  if (currentBand === 'scenario_runaway') {
    momentumScore += 6;
  } else if (bandDelta < 0) {
    momentumScore -= 2;
  }
  momentumScore = finClamp(momentumScore, 0, 100);

  let direction: InflationMomentumSnapshot['direction'] = 'stable';
  if (currentBand === 'scenario_runaway' || momentumScore >= 78) {
    direction = 'runaway';
  } else if (bandDelta > 0 || momentumScore >= 58) {
    direction = 'accelerating';
  } else if (bandDelta < 0 || momentumScore <= 38) {
    direction = 'disinflating';
  }

  const snapshot: InflationMomentumSnapshot = {
    turn,
    momentumScore: finRound(momentumScore, 1),
    direction,
    bandDelta,
    streakTurns,
  };

  return {
    state: {
      priorBand: currentBand,
      streakTurns,
      lastMomentumScore: momentumScore,
    },
    snapshot,
  };
}

export function inflationMomentumInflationScoreNudge(snapshot: InflationMomentumSnapshot): number {
  if (snapshot.direction === 'runaway') return 2.5;
  if (snapshot.direction === 'accelerating') return finRound(snapshot.bandDelta * 1.2 + 0.8, 2);
  if (snapshot.direction === 'disinflating') return finRound(Math.min(snapshot.bandDelta * 1.5, -0.5), 2);
  return 0;
}


// --- source: inflation/disinflation-sacrifice.ts ---

export interface DisinflationSacrificeEstimate {
  sacrificeRatio: number;
  outputCostBand: 'low' | 'moderate' | 'high' | 'severe';
  turnsToAnchor: number;
  narrative: string;
}

/** Okun-style sacrifice ratio metaphor for disinflation paths (metadata only). */
export function estimateDisinflationSacrifice(
  inflationBand: InflationConditionsBand,
  inflationScore: number,
  momentum: InflationMomentumSnapshot | null,
): DisinflationSacrificeEstimate {
  const rank = inflationBandSeverityRank(inflationBand);
  const scoreGap = finClamp(inflationScore - 45, 0, 55);
  let sacrificeRatio = finRound(0.35 + rank * 0.22 + scoreGap * 0.012, 2);
  if (momentum?.direction === 'accelerating' || momentum?.direction === 'runaway') {
    sacrificeRatio = finRound(sacrificeRatio + 0.25, 2);
  }
  sacrificeRatio = finClamp(sacrificeRatio, 0.2, 3.5);

  const outputCostBand: DisinflationSacrificeEstimate['outputCostBand'] =
    sacrificeRatio >= 2.4
      ? 'severe'
      : sacrificeRatio >= 1.6
        ? 'high'
        : sacrificeRatio >= 0.9
          ? 'moderate'
          : 'low';

  const turnsToAnchor = Math.round(finClamp(2 + rank * 1.5 + scoreGap * 0.08 + (momentum?.streakTurns ?? 0) * 0.3, 2, 14));

  const narrative =
    outputCostBand === 'severe' || outputCostBand === 'high'
      ? 'Disinflation likely requires sustained tight financial conditions and fiscal restraint.'
      : 'Moderate sacrifice ratio — anchoring achievable with coordinated policy.';

  return { sacrificeRatio, outputCostBand, turnsToAnchor, narrative };
}


// --- source: inflation/import-price-pass-through.ts ---

export type ImportPassThroughBand = 'muted' | 'moderate' | 'strong' | 'surge';

export interface ImportPricePassThroughAssessment {
  passThroughBand: ImportPassThroughBand;
  inflationScoreNudge: number;
  importCostIndex: number;
  narrative: string;
}

/** Trade-weighted import price channel into macro CPI metadata (no commodity resourcePrices). */
export function assessImportPricePassThrough(input: {
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  commodityImportShare: number;
  inflationBand: InflationConditionsBand;
  turn: number;
}): ImportPricePassThroughAssessment {
  const share = finClamp(input.commodityImportShare, 0, 1);
  let pressureScore = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') pressureScore += 0.55;
  else if (input.exchangeRatePressure === 'depreciation') pressureScore += 0.32;
  else if (input.exchangeRatePressure === 'appreciation') pressureScore -= 0.18;

  if (input.tradeOpennessBand === 'open') pressureScore += 0.22;
  else if (input.tradeOpennessBand === 'mixed') pressureScore += 0.1;

  pressureScore += share * 0.35;
  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressureScore += 0.12;
  }

  pressureScore = finClamp(pressureScore + input.turn * 0.008, -0.2, 1.1);
  const importCostIndex = finRound(100 + pressureScore * 18, 1);

  let passThroughBand: ImportPassThroughBand = 'muted';
  if (pressureScore >= 0.72) passThroughBand = 'surge';
  else if (pressureScore >= 0.45) passThroughBand = 'strong';
  else if (pressureScore >= 0.2) passThroughBand = 'moderate';

  const inflationScoreNudge =
    passThroughBand === 'surge'
      ? 0.14
      : passThroughBand === 'strong'
        ? 0.09
        : passThroughBand === 'moderate'
          ? 0.04
          : 0;

  const narrative =
    passThroughBand === 'surge' || passThroughBand === 'strong'
      ? 'Import prices are feeding through to macro CPI pressure in the trade channel.'
      : passThroughBand === 'moderate'
        ? 'Moderate import pass-through — watch exchange and openness.'
        : 'Import pass-through muted relative to domestic drivers.';

  return { passThroughBand, inflationScoreNudge, importCostIndex, narrative };
}

export function importPassThroughInflationScoreAdjustment(band: ImportPassThroughBand): number {
  if (band === 'surge') return 6;
  if (band === 'strong') return 4;
  if (band === 'moderate') return 2;
  return 0;
}


// --- source: inflation/energy-price-pass-through.ts ---

export type EnergyPassThroughBand = 'subdued' | 'firming' | 'sharp' | 'crisis';

export interface EnergyPricePassThroughAssessment {
  passThroughBand: EnergyPassThroughBand;
  energyCostIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Utility and transport fuel channel into macro CPI metadata (not commodity resourcePrices). */
export function assessEnergyPricePassThrough(input: {
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  retailTariffShock: boolean;
  gridReliabilityBand: 'stable' | 'strained' | 'fragile';
  inflationBand: InflationConditionsBand;
  turn: number;
}): EnergyPricePassThroughAssessment {
  let pressure = 0;
  if (input.wholesaleEnergyStress === 'crisis') pressure += 0.62;
  else if (input.wholesaleEnergyStress === 'severe') pressure += 0.4;
  else if (input.wholesaleEnergyStress === 'elevated') pressure += 0.22;

  if (input.retailTariffShock) pressure += 0.18;
  if (input.gridReliabilityBand === 'fragile') pressure += 0.14;
  else if (input.gridReliabilityBand === 'strained') pressure += 0.08;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.1;
  }

  pressure = finClamp(pressure + input.turn * 0.006, 0, 1.05);
  const energyCostIndex = finRound(100 + pressure * 22, 1);

  let passThroughBand: EnergyPassThroughBand = 'subdued';
  if (pressure >= 0.68) passThroughBand = 'crisis';
  else if (pressure >= 0.42) passThroughBand = 'sharp';
  else if (pressure >= 0.2) passThroughBand = 'firming';

  const inflationScoreNudge =
    passThroughBand === 'crisis'
      ? 0.12
      : passThroughBand === 'sharp'
        ? 0.08
        : passThroughBand === 'firming'
          ? 0.04
          : 0;

  const narrative =
    passThroughBand === 'crisis' || passThroughBand === 'sharp'
      ? 'Energy costs are pushing macro CPI through utilities and transport fuel.'
      : passThroughBand === 'firming'
        ? 'Energy pass-through firming — monitor wholesale and grid stress.'
        : 'Energy pass-through subdued relative to domestic services.';

  return { passThroughBand, energyCostIndex, inflationScoreNudge, narrative };
}

export function energyPassThroughInflationScoreAdjustment(band: EnergyPassThroughBand): number {
  if (band === 'crisis') return 5;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/shelter-rent-inflation.ts ---

export type ShelterRentPressureBand = 'soft' | 'building' | 'hot' | 'overheated';

export interface ShelterRentInflationAssessment {
  pressureBand: ShelterRentPressureBand;
  shelterIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Shelter and rent share of macro CPI basket (metadata; not housing asset prices). */
export function assessShelterRentInflation(input: {
  vacancyBand: 'loose' | 'balanced' | 'tight' | 'critical';
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  urbanizationPressure: 'low' | 'medium' | 'high';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ShelterRentInflationAssessment {
  let pressure = 0;
  if (input.vacancyBand === 'critical') pressure += 0.38;
  else if (input.vacancyBand === 'tight') pressure += 0.24;
  else if (input.vacancyBand === 'balanced') pressure += 0.08;

  if (input.rentGrowthBand === 'surging') pressure += 0.35;
  else if (input.rentGrowthBand === 'strong') pressure += 0.22;
  else if (input.rentGrowthBand === 'moderate') pressure += 0.1;

  if (input.urbanizationPressure === 'high') pressure += 0.12;
  else if (input.urbanizationPressure === 'medium') pressure += 0.06;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.08;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1);
  const shelterIndex = finRound(100 + pressure * 16, 1);

  let pressureBand: ShelterRentPressureBand = 'soft';
  if (pressure >= 0.62) pressureBand = 'overheated';
  else if (pressure >= 0.4) pressureBand = 'hot';
  else if (pressure >= 0.22) pressureBand = 'building';

  const inflationScoreNudge =
    pressureBand === 'overheated'
      ? 0.11
      : pressureBand === 'hot'
        ? 0.07
        : pressureBand === 'building'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'overheated' || pressureBand === 'hot'
      ? 'Shelter and rent are a dominant macro CPI contributor in urban markets.'
      : pressureBand === 'building'
        ? 'Shelter inflation building — vacancy and rent growth elevated.'
        : 'Shelter rent pressure soft relative to services basket.';

  return { pressureBand, shelterIndex, inflationScoreNudge, narrative };
}

export function shelterRentInflationScoreAdjustment(band: ShelterRentPressureBand): number {
  if (band === 'overheated') return 5;
  if (band === 'hot') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/food-grocery-pass-through.ts ---

export type FoodGroceryPassThroughBand = 'stable' | 'firming' | 'sharp' | 'supply_shock';

export interface FoodGroceryPassThroughAssessment {
  passThroughBand: FoodGroceryPassThroughBand;
  groceryIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Staples and grocery channel into macro CPI metadata (not commodity resourcePrices). */
export function assessFoodGroceryPassThrough(input: {
  harvestStressBand: 'normal' | 'weak' | 'severe';
  retailMarginPressure: 'low' | 'medium' | 'high';
  supplyChainDisruption: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): FoodGroceryPassThroughAssessment {
  let pressure = 0;
  if (input.harvestStressBand === 'severe') pressure += 0.45;
  else if (input.harvestStressBand === 'weak') pressure += 0.24;

  if (input.retailMarginPressure === 'high') pressure += 0.2;
  else if (input.retailMarginPressure === 'medium') pressure += 0.1;

  if (input.supplyChainDisruption) pressure += 0.22;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.09;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const groceryIndex = finRound(100 + pressure * 18, 1);

  let passThroughBand: FoodGroceryPassThroughBand = 'stable';
  if (pressure >= 0.68) passThroughBand = 'supply_shock';
  else if (pressure >= 0.42) passThroughBand = 'sharp';
  else if (pressure >= 0.2) passThroughBand = 'firming';

  const inflationScoreNudge =
    passThroughBand === 'supply_shock'
      ? 0.1
      : passThroughBand === 'sharp'
        ? 0.07
        : passThroughBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    passThroughBand === 'supply_shock' || passThroughBand === 'sharp'
      ? 'Grocery and staples are lifting headline CPI through food basket pass-through.'
      : passThroughBand === 'firming'
        ? 'Food pass-through firming — watch harvest and supply chain stress.'
        : 'Food grocery pass-through stable relative to domestic services.';

  return { passThroughBand, groceryIndex, inflationScoreNudge, narrative };
}

export function foodGroceryPassThroughInflationScoreAdjustment(band: FoodGroceryPassThroughBand): number {
  if (band === 'supply_shock') return 5;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/transport-logistics-inflation.ts ---

export type TransportLogisticsPressureBand = 'smooth' | 'congested' | 'bottleneck' | 'crisis';

export interface TransportLogisticsInflationAssessment {
  pressureBand: TransportLogisticsPressureBand;
  freightIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Freight and logistics channel into macro CPI (fuel-linked services, not resource board). */
export function assessTransportLogisticsInflation(input: {
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  portBacklogBand: 'clear' | 'moderate' | 'severe';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TransportLogisticsInflationAssessment {
  let pressure = 0;
  if (input.freightCapacityBand === 'critical') pressure += 0.4;
  else if (input.freightCapacityBand === 'tight') pressure += 0.26;
  else if (input.freightCapacityBand === 'balanced') pressure += 0.08;

  if (input.fuelSurchargeActive) pressure += 0.18;
  if (input.portBacklogBand === 'severe') pressure += 0.24;
  else if (input.portBacklogBand === 'moderate') pressure += 0.12;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.006, 0, 1.05);
  const freightIndex = finRound(100 + pressure * 20, 1);

  let pressureBand: TransportLogisticsPressureBand = 'smooth';
  if (pressure >= 0.65) pressureBand = 'crisis';
  else if (pressure >= 0.42) pressureBand = 'bottleneck';
  else if (pressure >= 0.22) pressureBand = 'congested';

  const inflationScoreNudge =
    pressureBand === 'crisis'
      ? 0.11
      : pressureBand === 'bottleneck'
        ? 0.08
        : pressureBand === 'congested'
          ? 0.04
          : 0;

  const narrative =
    pressureBand === 'crisis' || pressureBand === 'bottleneck'
      ? 'Transport and logistics bottlenecks are feeding goods inflation and delivery surcharges.'
      : pressureBand === 'congested'
        ? 'Freight congestion building — fuel surcharges and backlog risk elevated.'
        : 'Transport logistics inflation smooth relative to domestic demand.';

  return { pressureBand, freightIndex, inflationScoreNudge, narrative };
}

export function transportLogisticsInflationScoreAdjustment(band: TransportLogisticsPressureBand): number {
  if (band === 'crisis') return 5;
  if (band === 'bottleneck') return 3;
  if (band === 'congested') return 2;
  return 0;
}


// --- source: inflation/healthcare-services-inflation.ts ---

export type HealthcareServicesPressureBand = 'contained' | 'elevated' | 'stressed' | 'crisis';

export interface HealthcareServicesInflationAssessment {
  pressureBand: HealthcareServicesPressureBand;
  servicesIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Non-insurance healthcare and aged-care services in macro CPI metadata. */
export function assessHealthcareServicesInflation(input: {
  wagePressureBand: 'low' | 'moderate' | 'high' | 'acute';
  demandSurgeActive: boolean;
  workforceShortageBand: 'none' | 'moderate' | 'severe';
  inflationBand: InflationConditionsBand;
  turn: number;
}): HealthcareServicesInflationAssessment {
  let pressure = 0;
  if (input.wagePressureBand === 'acute') pressure += 0.42;
  else if (input.wagePressureBand === 'high') pressure += 0.28;
  else if (input.wagePressureBand === 'moderate') pressure += 0.12;

  if (input.demandSurgeActive) pressure += 0.2;
  if (input.workforceShortageBand === 'severe') pressure += 0.26;
  else if (input.workforceShortageBand === 'moderate') pressure += 0.14;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.08;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const servicesIndex = finRound(100 + pressure * 17, 1);

  let pressureBand: HealthcareServicesPressureBand = 'contained';
  if (pressure >= 0.65) pressureBand = 'crisis';
  else if (pressure >= 0.42) pressureBand = 'stressed';
  else if (pressure >= 0.22) pressureBand = 'elevated';

  const inflationScoreNudge =
    pressureBand === 'crisis'
      ? 0.1
      : pressureBand === 'stressed'
        ? 0.07
        : pressureBand === 'elevated'
          ? 0.04
          : 0;

  const narrative =
    pressureBand === 'crisis' || pressureBand === 'stressed'
      ? 'Healthcare services are lifting core CPI through wage and capacity constraints.'
      : pressureBand === 'elevated'
        ? 'Healthcare services inflation elevated — workforce and demand pressure building.'
        : 'Healthcare services inflation contained relative to goods basket.';

  return { pressureBand, servicesIndex, inflationScoreNudge, narrative };
}

export function healthcareServicesInflationScoreAdjustment(band: HealthcareServicesPressureBand): number {
  if (band === 'crisis') return 5;
  if (band === 'stressed') return 3;
  if (band === 'elevated') return 2;
  return 0;
}


// --- source: inflation/insurance-premium-pass-through.ts ---

export type InsurancePremiumPassThroughBand = 'stable' | 'firming' | 'sharp' | 'hard_market';

export interface InsurancePremiumPassThroughAssessment {
  passThroughBand: InsurancePremiumPassThroughBand;
  premiumIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** General insurance premiums channel into macro CPI (metadata only). */
export function assessInsurancePremiumPassThrough(input: {
  claimsInflationBand: 'low' | 'moderate' | 'high' | 'extreme';
  reinsuranceStress: boolean;
  catastropheLoadActive: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): InsurancePremiumPassThroughAssessment {
  let pressure = 0;
  if (input.claimsInflationBand === 'extreme') pressure += 0.48;
  else if (input.claimsInflationBand === 'high') pressure += 0.3;
  else if (input.claimsInflationBand === 'moderate') pressure += 0.14;

  if (input.reinsuranceStress) pressure += 0.22;
  if (input.catastropheLoadActive) pressure += 0.2;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const premiumIndex = finRound(100 + pressure * 19, 1);

  let passThroughBand: InsurancePremiumPassThroughBand = 'stable';
  if (pressure >= 0.68) passThroughBand = 'hard_market';
  else if (pressure >= 0.42) passThroughBand = 'sharp';
  else if (pressure >= 0.2) passThroughBand = 'firming';

  const inflationScoreNudge =
    passThroughBand === 'hard_market'
      ? 0.09
      : passThroughBand === 'sharp'
        ? 0.06
        : passThroughBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    passThroughBand === 'hard_market' || passThroughBand === 'sharp'
      ? 'Insurance premiums are feeding household cost-of-living and CPI insurance sub-basket.'
      : passThroughBand === 'firming'
        ? 'Insurance pass-through firming — claims and reinsurance costs elevated.'
        : 'Insurance premium pass-through stable relative to macro services.';

  return { passThroughBand, premiumIndex, inflationScoreNudge, narrative };
}

export function insurancePremiumPassThroughInflationScoreAdjustment(
  band: InsurancePremiumPassThroughBand,
): number {
  if (band === 'hard_market') return 5;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/education-tuition-inflation.ts ---

export type EducationTuitionPressureBand = 'stable' | 'rising' | 'sharp' | 'crisis';

export interface EducationTuitionInflationAssessment {
  pressureBand: EducationTuitionPressureBand;
  tuitionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Education and training fees in macro CPI metadata (not student loan ledger). */
export function assessEducationTuitionInflation(input: {
  enrollmentPressureBand: 'low' | 'moderate' | 'high';
  subsidyCutActive: boolean;
  wageIndexationBand: 'muted' | 'normal' | 'strong';
  inflationBand: InflationConditionsBand;
  turn: number;
}): EducationTuitionInflationAssessment {
  let pressure = 0;
  if (input.enrollmentPressureBand === 'high') pressure += 0.28;
  else if (input.enrollmentPressureBand === 'moderate') pressure += 0.14;

  if (input.subsidyCutActive) pressure += 0.24;
  if (input.wageIndexationBand === 'strong') pressure += 0.22;
  else if (input.wageIndexationBand === 'normal') pressure += 0.1;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const tuitionIndex = finRound(100 + pressure * 15, 1);

  let pressureBand: EducationTuitionPressureBand = 'stable';
  if (pressure >= 0.62) pressureBand = 'crisis';
  else if (pressure >= 0.4) pressureBand = 'sharp';
  else if (pressure >= 0.2) pressureBand = 'rising';

  const inflationScoreNudge =
    pressureBand === 'crisis'
      ? 0.08
      : pressureBand === 'sharp'
        ? 0.05
        : pressureBand === 'rising'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'crisis' || pressureBand === 'sharp'
      ? 'Education fees are contributing to services CPI through indexation and subsidy pressure.'
      : pressureBand === 'rising'
        ? 'Tuition inflation rising — enrollment and wage indexation in play.'
        : 'Education tuition inflation stable relative to headline basket.';

  return { pressureBand, tuitionIndex, inflationScoreNudge, narrative };
}

export function educationTuitionInflationScoreAdjustment(band: EducationTuitionPressureBand): number {
  if (band === 'crisis') return 4;
  if (band === 'sharp') return 3;
  if (band === 'rising') return 2;
  return 0;
}


// --- source: inflation/communications-services-inflation.ts ---

export type CommunicationsServicesPressureBand = 'soft' | 'firming' | 'elevated' | 'spike';

export interface CommunicationsServicesInflationAssessment {
  pressureBand: CommunicationsServicesPressureBand;
  commsIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Telecom and digital subscription services in macro CPI metadata. */
export function assessCommunicationsServicesInflation(input: {
  bandwidthDemandBand: 'normal' | 'surge' | 'extreme';
  regulatedTariffShock: boolean;
  platformFeePassThrough: 'low' | 'medium' | 'high';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CommunicationsServicesInflationAssessment {
  let pressure = 0;
  if (input.bandwidthDemandBand === 'extreme') pressure += 0.36;
  else if (input.bandwidthDemandBand === 'surge') pressure += 0.22;

  if (input.regulatedTariffShock) pressure += 0.2;
  if (input.platformFeePassThrough === 'high') pressure += 0.18;
  else if (input.platformFeePassThrough === 'medium') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const commsIndex = finRound(100 + pressure * 16, 1);

  let pressureBand: CommunicationsServicesPressureBand = 'soft';
  if (pressure >= 0.6) pressureBand = 'spike';
  else if (pressure >= 0.38) pressureBand = 'elevated';
  else if (pressure >= 0.18) pressureBand = 'firming';

  const inflationScoreNudge =
    pressureBand === 'spike'
      ? 0.07
      : pressureBand === 'elevated'
        ? 0.05
        : pressureBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'spike' || pressureBand === 'elevated'
      ? 'Communications and digital services are lifting core services CPI.'
      : pressureBand === 'firming'
        ? 'Comms inflation firming — tariff and platform pass-through building.'
        : 'Communications services inflation soft versus goods channels.';

  return { pressureBand, commsIndex, inflationScoreNudge, narrative };
}

export function communicationsServicesInflationScoreAdjustment(band: CommunicationsServicesPressureBand): number {
  if (band === 'spike') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/recreation-leisure-inflation.ts ---

export type RecreationLeisurePressureBand = 'soft' | 'firming' | 'hot' | 'boom';

export interface RecreationLeisureInflationAssessment {
  pressureBand: RecreationLeisurePressureBand;
  leisureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Recreation, dining-out, and leisure services in macro CPI metadata. */
export function assessRecreationLeisureInflation(input: {
  tourismDemandBand: 'weak' | 'normal' | 'strong' | 'surge';
  laborCostPassThrough: 'low' | 'medium' | 'high';
  discretionarySpendPressure: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): RecreationLeisureInflationAssessment {
  let pressure = 0;
  if (input.tourismDemandBand === 'surge') pressure += 0.38;
  else if (input.tourismDemandBand === 'strong') pressure += 0.24;
  else if (input.tourismDemandBand === 'normal') pressure += 0.08;

  if (input.laborCostPassThrough === 'high') pressure += 0.22;
  else if (input.laborCostPassThrough === 'medium') pressure += 0.12;

  if (input.discretionarySpendPressure) pressure += 0.16;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const leisureIndex = finRound(100 + pressure * 14, 1);

  let pressureBand: RecreationLeisurePressureBand = 'soft';
  if (pressure >= 0.58) pressureBand = 'boom';
  else if (pressure >= 0.38) pressureBand = 'hot';
  else if (pressure >= 0.2) pressureBand = 'firming';

  const inflationScoreNudge =
    pressureBand === 'boom'
      ? 0.07
      : pressureBand === 'hot'
        ? 0.05
        : pressureBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'boom' || pressureBand === 'hot'
      ? 'Recreation and leisure services are adding to discretionary CPI momentum.'
      : pressureBand === 'firming'
        ? 'Leisure inflation firming — tourism and labor pass-through elevated.'
        : 'Recreation leisure inflation soft versus headline goods.';

  return { pressureBand, leisureIndex, inflationScoreNudge, narrative };
}

export function recreationLeisureInflationScoreAdjustment(band: RecreationLeisurePressureBand): number {
  if (band === 'boom') return 4;
  if (band === 'hot') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/professional-services-fee-inflation.ts ---

export type ProfessionalServicesFeeBand = 'stable' | 'rising' | 'sharp' | 'squeeze';

export interface ProfessionalServicesFeeInflationAssessment {
  feeBand: ProfessionalServicesFeeBand;
  feeIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Legal, accounting, and consulting fee pass-through in macro CPI metadata. */
export function assessProfessionalServicesFeeInflation(input: {
  billingRatePressure: 'muted' | 'normal' | 'elevated' | 'extreme';
  complianceCostStack: boolean;
  corporateDemandBand: 'soft' | 'steady' | 'strong';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ProfessionalServicesFeeInflationAssessment {
  let pressure = 0;
  if (input.billingRatePressure === 'extreme') pressure += 0.44;
  else if (input.billingRatePressure === 'elevated') pressure += 0.28;
  else if (input.billingRatePressure === 'normal') pressure += 0.1;

  if (input.complianceCostStack) pressure += 0.2;
  if (input.corporateDemandBand === 'strong') pressure += 0.14;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const feeIndex = finRound(100 + pressure * 13, 1);

  let feeBand: ProfessionalServicesFeeBand = 'stable';
  if (pressure >= 0.62) feeBand = 'squeeze';
  else if (pressure >= 0.4) feeBand = 'sharp';
  else if (pressure >= 0.22) feeBand = 'rising';

  const inflationScoreNudge =
    feeBand === 'squeeze'
      ? 0.08
      : feeBand === 'sharp'
        ? 0.05
        : feeBand === 'rising'
          ? 0.03
          : 0;

  const narrative =
    feeBand === 'squeeze' || feeBand === 'sharp'
      ? 'Professional services fees are lifting core services CPI through billing and compliance stacks.'
      : feeBand === 'rising'
        ? 'Professional fee inflation rising — corporate demand and rate pressure building.'
        : 'Professional services fee inflation stable relative to goods basket.';

  return { feeBand, feeIndex, inflationScoreNudge, narrative };
}

export function professionalServicesFeeInflationScoreAdjustment(band: ProfessionalServicesFeeBand): number {
  if (band === 'squeeze') return 4;
  if (band === 'sharp') return 3;
  if (band === 'rising') return 2;
  return 0;
}


// --- source: inflation/childcare-services-inflation.ts ---

export type ChildcareServicesPressureBand = 'stable' | 'rising' | 'sharp' | 'crisis';

export interface ChildcareServicesInflationAssessment {
  pressureBand: ChildcareServicesPressureBand;
  childcareIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Early childhood and care services in macro CPI metadata. */
export function assessChildcareServicesInflation(input: {
  capacityShortageBand: 'none' | 'moderate' | 'severe';
  wageAwardPassThrough: 'muted' | 'normal' | 'strong';
  subsidyIndexationLag: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): ChildcareServicesInflationAssessment {
  let pressure = 0;
  if (input.capacityShortageBand === 'severe') pressure += 0.4;
  else if (input.capacityShortageBand === 'moderate') pressure += 0.22;

  if (input.wageAwardPassThrough === 'strong') pressure += 0.26;
  else if (input.wageAwardPassThrough === 'normal') pressure += 0.12;

  if (input.subsidyIndexationLag) pressure += 0.18;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const childcareIndex = finRound(100 + pressure * 15, 1);

  let pressureBand: ChildcareServicesPressureBand = 'stable';
  if (pressure >= 0.62) pressureBand = 'crisis';
  else if (pressure >= 0.4) pressureBand = 'sharp';
  else if (pressure >= 0.2) pressureBand = 'rising';

  const inflationScoreNudge =
    pressureBand === 'crisis'
      ? 0.08
      : pressureBand === 'sharp'
        ? 0.05
        : pressureBand === 'rising'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'crisis' || pressureBand === 'sharp'
      ? 'Childcare fees are lifting household cost-of-living and services CPI.'
      : pressureBand === 'rising'
        ? 'Childcare inflation rising — capacity and award pass-through in play.'
        : 'Childcare services inflation stable relative to headline basket.';

  return { pressureBand, childcareIndex, inflationScoreNudge, narrative };
}

export function childcareServicesInflationScoreAdjustment(band: ChildcareServicesPressureBand): number {
  if (band === 'crisis') return 4;
  if (band === 'sharp') return 3;
  if (band === 'rising') return 2;
  return 0;
}


// --- source: inflation/government-charges-inflation.ts ---

export type GovernmentChargesPressureBand = 'flat' | 'creeping' | 'elevated' | 'step_up';

export interface GovernmentChargesInflationAssessment {
  pressureBand: GovernmentChargesPressureBand;
  chargesIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Indexed fees, levies, and regulatory charges in macro CPI metadata. */
export function assessGovernmentChargesInflation(input: {
  feeIndexationBand: 'below_cpi' | 'at_cpi' | 'above_cpi';
  newLevyStackActive: boolean;
  localGovernmentPressure: 'low' | 'medium' | 'high';
  inflationBand: InflationConditionsBand;
  turn: number;
}): GovernmentChargesInflationAssessment {
  let pressure = 0;
  if (input.feeIndexationBand === 'above_cpi') pressure += 0.32;
  else if (input.feeIndexationBand === 'at_cpi') pressure += 0.18;

  if (input.newLevyStackActive) pressure += 0.24;
  if (input.localGovernmentPressure === 'high') pressure += 0.2;
  else if (input.localGovernmentPressure === 'medium') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const chargesIndex = finRound(100 + pressure * 12, 1);

  let pressureBand: GovernmentChargesPressureBand = 'flat';
  if (pressure >= 0.58) pressureBand = 'step_up';
  else if (pressure >= 0.38) pressureBand = 'elevated';
  else if (pressure >= 0.18) pressureBand = 'creeping';

  const inflationScoreNudge =
    pressureBand === 'step_up'
      ? 0.07
      : pressureBand === 'elevated'
        ? 0.04
        : pressureBand === 'creeping'
          ? 0.02
          : 0;

  const narrative =
    pressureBand === 'step_up' || pressureBand === 'elevated'
      ? 'Government charges and indexed fees are adding to headline CPI stickiness.'
      : pressureBand === 'creeping'
        ? 'Government charges creeping higher — watch levy and local fee stacks.'
        : 'Government charges inflation flat versus services basket.';

  return { pressureBand, chargesIndex, inflationScoreNudge, narrative };
}

export function governmentChargesInflationScoreAdjustment(band: GovernmentChargesPressureBand): number {
  if (band === 'step_up') return 4;
  if (band === 'elevated') return 3;
  if (band === 'creeping') return 2;
  return 0;
}


// --- source: inflation/water-utilities-inflation.ts ---

export type WaterUtilitiesPressureBand = 'stable' | 'firming' | 'sharp' | 'drought_crisis';

export interface WaterUtilitiesInflationAssessment {
  pressureBand: WaterUtilitiesPressureBand;
  utilitiesIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Water and sewer utilities in macro CPI metadata (distinct from energy utilities). */
export function assessWaterUtilitiesInflation(input: {
  droughtStressBand: 'none' | 'moderate' | 'severe';
  infrastructureTariffShock: boolean;
  recyclingCostPassThrough: 'low' | 'medium' | 'high';
  inflationBand: InflationConditionsBand;
  turn: number;
}): WaterUtilitiesInflationAssessment {
  let pressure = 0;
  if (input.droughtStressBand === 'severe') pressure += 0.46;
  else if (input.droughtStressBand === 'moderate') pressure += 0.24;

  if (input.infrastructureTariffShock) pressure += 0.2;
  if (input.recyclingCostPassThrough === 'high') pressure += 0.16;
  else if (input.recyclingCostPassThrough === 'medium') pressure += 0.08;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const utilitiesIndex = finRound(100 + pressure * 17, 1);

  let pressureBand: WaterUtilitiesPressureBand = 'stable';
  if (pressure >= 0.65) pressureBand = 'drought_crisis';
  else if (pressure >= 0.42) pressureBand = 'sharp';
  else if (pressure >= 0.2) pressureBand = 'firming';

  const inflationScoreNudge =
    pressureBand === 'drought_crisis'
      ? 0.09
      : pressureBand === 'sharp'
        ? 0.06
        : pressureBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'drought_crisis' || pressureBand === 'sharp'
      ? 'Water utilities are lifting regulated-charge CPI through drought and tariff stacks.'
      : pressureBand === 'firming'
        ? 'Water pass-through firming — infrastructure and recycling costs elevated.'
        : 'Water utilities inflation stable relative to energy basket.';

  return { pressureBand, utilitiesIndex, inflationScoreNudge, narrative };
}

export function waterUtilitiesInflationScoreAdjustment(band: WaterUtilitiesPressureBand): number {
  if (band === 'drought_crisis') return 4;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/domestic-travel-inflation.ts ---

export type DomesticTravelPressureBand = 'subdued' | 'recovering' | 'hot' | 'overheated';

export interface DomesticTravelInflationAssessment {
  pressureBand: DomesticTravelPressureBand;
  travelIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Domestic air, rail, and accommodation services in macro CPI metadata. */
export function assessDomesticTravelInflation(input: {
  routeCapacityBand: 'ample' | 'balanced' | 'constrained';
  fuelSurchargePassThrough: boolean;
  accommodationOccupancyBand: 'low' | 'normal' | 'full';
  inflationBand: InflationConditionsBand;
  turn: number;
}): DomesticTravelInflationAssessment {
  let pressure = 0;
  if (input.routeCapacityBand === 'constrained') pressure += 0.34;
  else if (input.routeCapacityBand === 'balanced') pressure += 0.12;

  if (input.fuelSurchargePassThrough) pressure += 0.18;
  if (input.accommodationOccupancyBand === 'full') pressure += 0.22;
  else if (input.accommodationOccupancyBand === 'normal') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const travelIndex = finRound(100 + pressure * 16, 1);

  let pressureBand: DomesticTravelPressureBand = 'subdued';
  if (pressure >= 0.58) pressureBand = 'overheated';
  else if (pressure >= 0.38) pressureBand = 'hot';
  else if (pressure >= 0.2) pressureBand = 'recovering';

  const inflationScoreNudge =
    pressureBand === 'overheated'
      ? 0.08
      : pressureBand === 'hot'
        ? 0.05
        : pressureBand === 'recovering'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'overheated' || pressureBand === 'hot'
      ? 'Domestic travel and accommodation are feeding discretionary CPI momentum.'
      : pressureBand === 'recovering'
        ? 'Travel inflation recovering — capacity and fuel surcharges building.'
        : 'Domestic travel inflation subdued versus services headline.';

  return { pressureBand, travelIndex, inflationScoreNudge, narrative };
}

export function domesticTravelInflationScoreAdjustment(band: DomesticTravelPressureBand): number {
  if (band === 'overheated') return 4;
  if (band === 'hot') return 3;
  if (band === 'recovering') return 2;
  return 0;
}


// --- source: inflation/construction-materials-inflation.ts ---

export type ConstructionMaterialsPressureBand = 'soft' | 'firming' | 'sharp' | 'supply_crunch';

export interface ConstructionMaterialsInflationAssessment {
  pressureBand: ConstructionMaterialsPressureBand;
  materialsIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Building materials and construction inputs in macro CPI metadata (not asset prices). */
export function assessConstructionMaterialsInflation(input: {
  supplyChainStressBand: 'normal' | 'elevated' | 'severe';
  laborShortagePassThrough: boolean;
  importContentShare: number;
  inflationBand: InflationConditionsBand;
  turn: number;
}): ConstructionMaterialsInflationAssessment {
  let pressure = 0;
  if (input.supplyChainStressBand === 'severe') pressure += 0.42;
  else if (input.supplyChainStressBand === 'elevated') pressure += 0.26;

  if (input.laborShortagePassThrough) pressure += 0.2;
  pressure += finClamp(input.importContentShare, 0, 0.5) * 0.35;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.08;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const materialsIndex = finRound(100 + pressure * 18, 1);

  let pressureBand: ConstructionMaterialsPressureBand = 'soft';
  if (pressure >= 0.62) pressureBand = 'supply_crunch';
  else if (pressure >= 0.4) pressureBand = 'sharp';
  else if (pressure >= 0.2) pressureBand = 'firming';

  const inflationScoreNudge =
    pressureBand === 'supply_crunch'
      ? 0.09
      : pressureBand === 'sharp'
        ? 0.06
        : pressureBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'supply_crunch' || pressureBand === 'sharp'
      ? 'Construction materials are lifting investment-sensitive CPI through supply and import pass-through.'
      : pressureBand === 'firming'
        ? 'Materials inflation firming — labor and supply stress building.'
        : 'Construction materials inflation soft versus goods headline.';

  return { pressureBand, materialsIndex, inflationScoreNudge, narrative };
}

export function constructionMaterialsInflationScoreAdjustment(band: ConstructionMaterialsPressureBand): number {
  if (band === 'supply_crunch') return 4;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/retail-trade-margin-inflation.ts ---

export type RetailTradeMarginBand = 'compressed' | 'stable' | 'expanding' | 'price_led';

export interface RetailTradeMarginInflationAssessment {
  marginBand: RetailTradeMarginBand;
  retailIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Retail trade margin and shelf-price pass-through in macro CPI metadata. */
export function assessRetailTradeMarginInflation(input: {
  discountingIntensity: 'heavy' | 'moderate' | 'light';
  inventoryClearanceActive: boolean;
  wageBillPressure: 'low' | 'medium' | 'high';
  inflationBand: InflationConditionsBand;
  turn: number;
}): RetailTradeMarginInflationAssessment {
  let pressure = 0;
  if (input.wageBillPressure === 'high') pressure += 0.32;
  else if (input.wageBillPressure === 'medium') pressure += 0.16;

  if (input.discountingIntensity === 'light') pressure += 0.18;
  else if (input.discountingIntensity === 'moderate') pressure += 0.08;

  if (input.inventoryClearanceActive) pressure -= 0.12;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const retailIndex = finRound(100 + pressure * 15, 1);

  let marginBand: RetailTradeMarginBand = 'stable';
  if (pressure >= 0.55) marginBand = 'price_led';
  else if (pressure >= 0.35) marginBand = 'expanding';
  else if (pressure < 0.12) marginBand = 'compressed';

  const inflationScoreNudge =
    marginBand === 'price_led'
      ? 0.08
      : marginBand === 'expanding'
        ? 0.05
        : marginBand === 'compressed'
          ? -0.02
          : 0;

  const narrative =
    marginBand === 'price_led' || marginBand === 'expanding'
      ? 'Retail margins are passing wage and input costs into shelf-price CPI.'
      : marginBand === 'compressed'
        ? 'Retail discounting compressing margins — partial CPI offset.'
        : 'Retail trade margin inflation stable versus services basket.';

  return { marginBand, retailIndex, inflationScoreNudge, narrative };
}

export function retailTradeMarginInflationScoreAdjustment(band: RetailTradeMarginBand): number {
  if (band === 'price_led') return 4;
  if (band === 'expanding') return 3;
  if (band === 'compressed') return 0;
  return 1;
}


// --- source: inflation/financial-services-fee-inflation.ts ---

export type FinancialServicesFeeBand = 'subdued' | 'firming' | 'elevated' | 'fee_shock';

export interface FinancialServicesFeeInflationAssessment {
  feeBand: FinancialServicesFeeBand;
  servicesIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Banking, mortgage servicing, and payment fees in macro CPI metadata (not asset prices). */
export function assessFinancialServicesFeeInflation(input: {
  fundingCostPassThrough: 'low' | 'medium' | 'high';
  complianceCostStackActive: boolean;
  depositRateCompetitionBand: 'weak' | 'normal' | 'intense';
  inflationBand: InflationConditionsBand;
  turn: number;
}): FinancialServicesFeeInflationAssessment {
  let pressure = 0;
  if (input.fundingCostPassThrough === 'high') pressure += 0.36;
  else if (input.fundingCostPassThrough === 'medium') pressure += 0.18;

  if (input.complianceCostStackActive) pressure += 0.14;
  if (input.depositRateCompetitionBand === 'intense') pressure += 0.12;
  else if (input.depositRateCompetitionBand === 'weak') pressure += 0.06;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.09;
  }

  pressure = finClamp(pressure + input.turn * 0.0045, 0, 1.05);
  const servicesIndex = finRound(100 + pressure * 16, 1);

  let feeBand: FinancialServicesFeeBand = 'subdued';
  if (pressure >= 0.58) feeBand = 'fee_shock';
  else if (pressure >= 0.38) feeBand = 'elevated';
  else if (pressure >= 0.18) feeBand = 'firming';

  const inflationScoreNudge =
    feeBand === 'fee_shock'
      ? 0.08
      : feeBand === 'elevated'
        ? 0.05
        : feeBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    feeBand === 'fee_shock' || feeBand === 'elevated'
      ? 'Financial services fees are lifting CPI through funding and compliance pass-through.'
      : feeBand === 'firming'
        ? 'Fee inflation firming as deposit competition and funding costs bite.'
        : 'Financial services fee inflation subdued versus headline.';

  return { feeBand, servicesIndex, inflationScoreNudge, narrative };
}

export function financialServicesFeeInflationScoreAdjustment(band: FinancialServicesFeeBand): number {
  if (band === 'fee_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/agricultural-farmgate-inflation.ts ---

export type AgriculturalFarmgatePressureBand = 'soft' | 'firming' | 'sharp' | 'harvest_crisis';

export interface AgriculturalFarmgateInflationAssessment {
  pressureBand: AgriculturalFarmgatePressureBand;
  farmgateIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Farmgate and agricultural supply-chain CPI (household food pipeline — not export commodity boundary). */
export function assessAgriculturalFarmgateInflation(input: {
  harvestStressBand: 'normal' | 'weak' | 'severe';
  transportToMarketBand: 'smooth' | 'strained' | 'critical';
  inputCostPassThrough: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): AgriculturalFarmgateInflationAssessment {
  let pressure = 0;
  if (input.harvestStressBand === 'severe') pressure += 0.4;
  else if (input.harvestStressBand === 'weak') pressure += 0.22;

  if (input.transportToMarketBand === 'critical') pressure += 0.28;
  else if (input.transportToMarketBand === 'strained') pressure += 0.14;

  if (input.inputCostPassThrough) pressure += 0.16;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const farmgateIndex = finRound(100 + pressure * 17, 1);

  let pressureBand: AgriculturalFarmgatePressureBand = 'soft';
  if (pressure >= 0.6) pressureBand = 'harvest_crisis';
  else if (pressure >= 0.38) pressureBand = 'sharp';
  else if (pressure >= 0.2) pressureBand = 'firming';

  const inflationScoreNudge =
    pressureBand === 'harvest_crisis'
      ? 0.09
      : pressureBand === 'sharp'
        ? 0.06
        : pressureBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'harvest_crisis' || pressureBand === 'sharp'
      ? 'Farmgate prices are feeding grocery CPI through harvest stress and logistics.'
      : pressureBand === 'firming'
        ? 'Agricultural farmgate inflation firming on input and freight pass-through.'
        : 'Farmgate inflation soft relative to food services basket.';

  return { pressureBand, farmgateIndex, inflationScoreNudge, narrative };
}

export function agriculturalFarmgateInflationScoreAdjustment(band: AgriculturalFarmgatePressureBand): number {
  if (band === 'harvest_crisis') return 4;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/public-utilities-grid-tariff-inflation.ts ---

export type PublicUtilitiesGridTariffBand = 'subdued' | 'firming' | 'elevated' | 'grid_shock';

export interface PublicUtilitiesGridTariffInflationAssessment {
  tariffBand: PublicUtilitiesGridTariffBand;
  gridIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Electricity and gas grid tariffs in macro CPI metadata (V10.12 utilities — distinct from water). */
export function assessPublicUtilitiesGridTariffInflation(input: {
  serviceReliabilityBand: 'robust' | 'strained' | 'fragile' | 'critical';
  outageRiskBand: 'clear' | 'moderate' | 'rolling' | 'severe';
  capacityMarginBand: 'surplus' | 'balanced' | 'thin' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): PublicUtilitiesGridTariffInflationAssessment {
  let pressure = 0;
  if (input.serviceReliabilityBand === 'critical' || input.serviceReliabilityBand === 'fragile') {
    pressure += 0.34;
  } else if (input.serviceReliabilityBand === 'strained') {
    pressure += 0.18;
  }

  if (input.outageRiskBand === 'severe' || input.outageRiskBand === 'rolling') {
    pressure += 0.28;
  } else if (input.outageRiskBand === 'moderate') {
    pressure += 0.12;
  }

  if (input.capacityMarginBand === 'critical' || input.capacityMarginBand === 'thin') {
    pressure += 0.22;
  } else if (input.capacityMarginBand === 'balanced') {
    pressure += 0.06;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.08;
  }

  pressure = finClamp(pressure + input.turn * 0.0048, 0, 1.05);
  const gridIndex = finRound(100 + pressure * 18, 1);

  let tariffBand: PublicUtilitiesGridTariffBand = 'subdued';
  if (pressure >= 0.58) tariffBand = 'grid_shock';
  else if (pressure >= 0.38) tariffBand = 'elevated';
  else if (pressure >= 0.2) tariffBand = 'firming';

  const inflationScoreNudge =
    tariffBand === 'grid_shock'
      ? 0.09
      : tariffBand === 'elevated'
        ? 0.06
        : tariffBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    tariffBand === 'grid_shock' || tariffBand === 'elevated'
      ? 'Public utilities grid tariffs are lifting CPI through reliability stress and thin capacity margins.'
      : tariffBand === 'firming'
        ? 'Grid tariff inflation firming as outage risk and reserve margins tighten.'
        : 'Electricity and gas grid tariff pass-through subdued versus headline.';

  return { tariffBand, gridIndex, inflationScoreNudge, narrative };
}

export function publicUtilitiesGridTariffInflationScoreAdjustment(band: PublicUtilitiesGridTariffBand): number {
  if (band === 'grid_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/ui-inflation-salience-pass-through.ts ---

export type UiInflationSalienceBand = 'muted' | 'elevated' | 'salient' | 'attention_shock';

export interface UiInflationSaliencePassThroughAssessment {
  salienceBand: UiInflationSalienceBand;
  presentationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Player-facing UI / dashboard inflation salience (expectations channel — not commodity prices). */
export function assessUiInflationSaliencePassThrough(input: {
  dashboardStressHighlight: boolean;
  playerAttentionBand: 'low' | 'medium' | 'high';
  uiExpectationsNudgeUp: boolean;
  phaseShellCoachActive: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): UiInflationSaliencePassThroughAssessment {
  let pressure = 0;
  if (input.dashboardStressHighlight) pressure += 0.22;
  if (input.playerAttentionBand === 'high') pressure += 0.28;
  else if (input.playerAttentionBand === 'medium') pressure += 0.12;

  if (input.uiExpectationsNudgeUp) pressure += 0.18;
  if (input.phaseShellCoachActive) pressure += 0.14;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const presentationIndex = finRound(100 + pressure * 14, 1);

  let salienceBand: UiInflationSalienceBand = 'muted';
  if (pressure >= 0.62) salienceBand = 'attention_shock';
  else if (pressure >= 0.4) salienceBand = 'salient';
  else if (pressure >= 0.22) salienceBand = 'elevated';

  const inflationScoreNudge =
    salienceBand === 'attention_shock'
      ? 0.07
      : salienceBand === 'salient'
        ? 0.05
        : salienceBand === 'elevated'
          ? 0.03
          : 0;

  const narrative =
    salienceBand === 'attention_shock' || salienceBand === 'salient'
      ? 'UI inflation salience is reinforcing expectations through dashboard stress and player attention.'
      : salienceBand === 'elevated'
        ? 'Presentation-layer inflation cues firming — cost-of-living visibility elevated.'
        : 'UI inflation salience muted relative to macro bands.';

  return { salienceBand, presentationIndex, inflationScoreNudge, narrative };
}

export function uiInflationSaliencePassThroughScoreAdjustment(band: UiInflationSalienceBand): number {
  if (band === 'attention_shock') return 3;
  if (band === 'salient') return 3;
  if (band === 'elevated') return 2;
  return 0;
}


// --- source: inflation/housing-mortgage-essential-inflation.ts ---

export type HousingMortgageEssentialBand = 'subdued' | 'firming' | 'elevated' | 'services_shock';

export interface HousingMortgageEssentialInflationAssessment {
  essentialBand: HousingMortgageEssentialBand;
  servicesIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Mortgage servicing and essential wellbeing services in CPI metadata (Agent 14 housing). */
export function assessHousingMortgageEssentialInflation(input: {
  mortgageStressBand: 'low' | 'elevated' | 'severe';
  wellbeingCostBand: 'stable' | 'strained' | 'critical';
  essentialServicesInflationFlag: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): HousingMortgageEssentialInflationAssessment {
  let pressure = 0;
  if (input.mortgageStressBand === 'severe') {
    pressure += 0.32;
  } else if (input.mortgageStressBand === 'elevated') {
    pressure += 0.16;
  }

  if (input.wellbeingCostBand === 'critical') {
    pressure += 0.28;
  } else if (input.wellbeingCostBand === 'strained') {
    pressure += 0.14;
  }

  if (input.essentialServicesInflationFlag) {
    pressure += 0.18;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.0042, 0, 1.05);
  const servicesIndex = finRound(100 + pressure * 17, 1);

  let essentialBand: HousingMortgageEssentialBand = 'subdued';
  if (pressure >= 0.56) essentialBand = 'services_shock';
  else if (pressure >= 0.36) essentialBand = 'elevated';
  else if (pressure >= 0.19) essentialBand = 'firming';

  const inflationScoreNudge =
    essentialBand === 'services_shock'
      ? 0.085
      : essentialBand === 'elevated'
        ? 0.055
        : essentialBand === 'firming'
          ? 0.028
          : 0;

  const narrative =
    essentialBand === 'services_shock' || essentialBand === 'elevated'
      ? 'Mortgage servicing and essential wellbeing services are lifting CPI through household stress.'
      : essentialBand === 'firming'
        ? 'Essential services inflation firming as mortgage and wellbeing costs tighten.'
        : 'Housing mortgage and essential services pass-through subdued versus headline.';

  return { essentialBand, servicesIndex, inflationScoreNudge, narrative };
}

export function housingMortgageEssentialInflationScoreAdjustment(band: HousingMortgageEssentialBand): number {
  if (band === 'services_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/macro-transmission-merge-inflation.ts ---

export type MacroTransmissionMergeBand = 'coherent' | 'drifting' | 'fragile' | 'inline_blocked';

export interface MacroTransmissionMergeInflationAssessment {
  mergeBand: MacroTransmissionMergeBand;
  transmissionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Macro transmission disagreement and inline merge readiness feeding CPI metadata (Agent 06). */
export function assessMacroTransmissionMergeInflation(input: {
  transmissionStabilityFragile: boolean;
  macroRecoveryRankStressActive: boolean;
  outputGap: number;
  nominalDemandPressure: number;
  inflationBand: InflationConditionsBand;
  turn: number;
}): MacroTransmissionMergeInflationAssessment {
  let pressure = 0;
  if (input.transmissionStabilityFragile) {
    pressure += 0.3;
  }
  if (input.macroRecoveryRankStressActive) {
    pressure += 0.22;
  }

  if (input.outputGap > 0.25) {
    pressure += 0.12;
  } else if (input.outputGap < -0.2) {
    pressure += 0.08;
  }

  if (input.nominalDemandPressure > 0.4) {
    pressure += 0.14;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const transmissionIndex = finRound(100 + pressure * 16, 1);

  let mergeBand: MacroTransmissionMergeBand = 'coherent';
  if (pressure >= 0.55) mergeBand = 'inline_blocked';
  else if (pressure >= 0.38) mergeBand = 'fragile';
  else if (pressure >= 0.2) mergeBand = 'drifting';

  const inflationScoreNudge =
    mergeBand === 'inline_blocked'
      ? 0.088
      : mergeBand === 'fragile'
        ? 0.058
        : mergeBand === 'drifting'
          ? 0.026
          : 0;

  const narrative =
    mergeBand === 'inline_blocked' || mergeBand === 'fragile'
      ? 'Macro transmission merge stress is passing through to CPI via fragile stability layers.'
      : mergeBand === 'drifting'
        ? 'Transmission layers drifting — modest CPI nudge from recovery rank stress.'
        : 'Macro transmission merge coherent; inline merge pass-through subdued.';

  return { mergeBand, transmissionIndex, inflationScoreNudge, narrative };
}

export function macroTransmissionMergeInflationScoreAdjustment(band: MacroTransmissionMergeBand): number {
  if (band === 'inline_blocked') return 4;
  if (band === 'fragile') return 3;
  if (band === 'drifting') return 2;
  return 0;
}


// --- source: inflation/dynamic-events-inflation-spillover.ts ---

export type DynamicEventsInflationSpilloverBand = 'muted' | 'building' | 'active' | 'cascade';

export interface DynamicEventsInflationSpilloverAssessment {
  spilloverBand: DynamicEventsInflationSpilloverBand;
  eventIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Dynamic narrative events spilling into macro CPI metadata (Agent 05). */
export function assessDynamicEventsInflationSpillover(input: {
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  confidenceShockBand: 'calm' | 'uneasy' | 'severe';
  stagedEventCostShockBand: 'none' | 'emerging' | 'active' | 'cascade';
  inflationBand: InflationConditionsBand;
  turn: number;
}): DynamicEventsInflationSpilloverAssessment {
  let pressure = 0;
  if (input.inflationShockEventActive) {
    pressure += 0.26;
  }
  if (input.supplyDisruptionSeverity === 'national') {
    pressure += 0.24;
  } else if (input.supplyDisruptionSeverity === 'localized') {
    pressure += 0.11;
  }
  if (input.confidenceShockBand === 'severe') {
    pressure += 0.2;
  } else if (input.confidenceShockBand === 'uneasy') {
    pressure += 0.09;
  }
  if (input.stagedEventCostShockBand === 'cascade') {
    pressure += 0.22;
  } else if (input.stagedEventCostShockBand === 'active') {
    pressure += 0.14;
  } else if (input.stagedEventCostShockBand === 'emerging') {
    pressure += 0.07;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const eventIndex = finRound(100 + pressure * 19, 1);

  let spilloverBand: DynamicEventsInflationSpilloverBand = 'muted';
  if (pressure >= 0.58) spilloverBand = 'cascade';
  else if (pressure >= 0.38) spilloverBand = 'active';
  else if (pressure >= 0.19) spilloverBand = 'building';

  const inflationScoreNudge =
    spilloverBand === 'cascade'
      ? 0.09
      : spilloverBand === 'active'
        ? 0.06
        : spilloverBand === 'building'
          ? 0.03
          : 0;

  const narrative =
    spilloverBand === 'cascade' || spilloverBand === 'active'
      ? 'Dynamic events are spilling into CPI through staged cost shocks and supply disruption.'
      : spilloverBand === 'building'
        ? 'Event-driven inflation spillover building as confidence and supply flags tighten.'
        : 'Dynamic events inflation spillover muted versus headline.';

  return { spilloverBand, eventIndex, inflationScoreNudge, narrative };
}

export function dynamicEventsInflationSpilloverScoreAdjustment(band: DynamicEventsInflationSpilloverBand): number {
  if (band === 'cascade') return 4;
  if (band === 'active') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/dashboard-map-inflation-overlay.ts ---

export type DashboardMapInflationOverlayBand = 'routine' | 'highlighted' | 'severe' | 'map_critical';

export interface DashboardMapInflationOverlayAssessment {
  overlayBand: DashboardMapInflationOverlayBand;
  presentationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Regional dashboards and map layers elevating inflation presentation (Agent 23). */
export function assessDashboardMapInflationOverlay(input: {
  regionalHeatmapInflationAlert: boolean;
  mapLayerCostPressureScore: number;
  dashboardRefreshUrgency: 'routine' | 'elevated' | 'critical';
  dashboardInflationHeatmapSevere: boolean;
  mapLayerCostOfLivingStressActive: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): DashboardMapInflationOverlayAssessment {
  let pressure = 0;
  if (input.regionalHeatmapInflationAlert) {
    pressure += 0.2;
  }
  if (input.dashboardInflationHeatmapSevere) {
    pressure += 0.24;
  }
  if (input.mapLayerCostOfLivingStressActive) {
    pressure += 0.18;
  }
  pressure += finClamp(input.mapLayerCostPressureScore, 0, 1) * 0.22;

  if (input.dashboardRefreshUrgency === 'critical') {
    pressure += 0.16;
  } else if (input.dashboardRefreshUrgency === 'elevated') {
    pressure += 0.08;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const presentationIndex = finRound(100 + pressure * 15, 1);

  let overlayBand: DashboardMapInflationOverlayBand = 'routine';
  if (pressure >= 0.55) overlayBand = 'map_critical';
  else if (pressure >= 0.36) overlayBand = 'severe';
  else if (pressure >= 0.18) overlayBand = 'highlighted';

  const inflationScoreNudge =
    overlayBand === 'map_critical'
      ? 0.082
      : overlayBand === 'severe'
        ? 0.054
        : overlayBand === 'highlighted'
          ? 0.025
          : 0;

  const narrative =
    overlayBand === 'map_critical' || overlayBand === 'severe'
      ? 'Dashboard and map overlays are amplifying perceived inflation pressure across regions.'
      : overlayBand === 'highlighted'
        ? 'Regional heatmaps highlighting cost-of-living stress on CPI presentation layers.'
        : 'Dashboard map inflation overlay routine versus headline CPI.';

  return { overlayBand, presentationIndex, inflationScoreNudge, narrative };
}

export function dashboardMapInflationOverlayScoreAdjustment(band: DashboardMapInflationOverlayBand): number {
  if (band === 'map_critical') return 4;
  if (band === 'severe') return 3;
  if (band === 'highlighted') return 2;
  return 0;
}


// --- source: inflation/public-finance-debt-service-inflation.ts ---

export type PublicFinanceDebtServiceBand = 'anchored' | 'firming' | 'elevated' | 'dominance_risk';

export interface PublicFinanceDebtServiceInflationAssessment {
  debtServiceBand: PublicFinanceDebtServiceBand;
  fiscalIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Consolidated fiscal and debt-service pass-through into CPI metadata (Agent 07). */
export function assessPublicFinanceDebtServiceInflation(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  fiscalAnchorBreached: boolean;
  indexedChargesInflationPassThrough: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): PublicFinanceDebtServiceInflationAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') {
    pressure += 0.28;
  } else if (input.consolidatedDeficitBand === 'moderate_deficit') {
    pressure += 0.12;
  }
  if (input.debtServicePressure === 'critical') {
    pressure += 0.26;
  } else if (input.debtServicePressure === 'elevated') {
    pressure += 0.14;
  }
  if (input.fiscalAnchorBreached) {
    pressure += 0.2;
  }
  if (input.indexedChargesInflationPassThrough) {
    pressure += 0.11;
  }
  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const fiscalIndex = finRound(100 + pressure * 17, 1);

  let debtServiceBand: PublicFinanceDebtServiceBand = 'anchored';
  if (pressure >= 0.56) debtServiceBand = 'dominance_risk';
  else if (pressure >= 0.36) debtServiceBand = 'elevated';
  else if (pressure >= 0.18) debtServiceBand = 'firming';

  const inflationScoreNudge =
    debtServiceBand === 'dominance_risk'
      ? 0.088
      : debtServiceBand === 'elevated'
        ? 0.057
        : debtServiceBand === 'firming'
          ? 0.027
          : 0;

  const narrative =
    debtServiceBand === 'dominance_risk' || debtServiceBand === 'elevated'
      ? 'Public finance debt service and indexed charges are lifting CPI through fiscal pressure.'
      : debtServiceBand === 'firming'
        ? 'Fiscal debt-service pass-through firming as deficit and anchor bands tighten.'
        : 'Public finance debt-service CPI contribution anchored versus headline.';

  return { debtServiceBand, fiscalIndex, inflationScoreNudge, narrative };
}

export function publicFinanceDebtServiceInflationScoreAdjustment(band: PublicFinanceDebtServiceBand): number {
  if (band === 'dominance_risk') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/population-labor-wage-inflation.ts ---

export type PopulationLaborWageBand = 'subdued' | 'building' | 'elevated' | 'wage_spiral';

export interface PopulationLaborWageInflationAssessment {
  wageBand: PopulationLaborWageBand;
  laborIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Population, labor slack, and wage growth feeding CPI metadata (Agent 09). */
export function assessPopulationLaborWageInflation(input: {
  laborParticipationBand: 'weak' | 'steady' | 'strong';
  wageGrowthBand: 'subdued' | 'moderate' | 'elevated' | 'surge';
  costOfLivingStress: 'low' | 'moderate' | 'high' | 'extreme';
  participationSlackInflationBand: 'tight' | 'balanced' | 'slack' | 'severe_slack';
  householdExpectationsDeanchoring: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): PopulationLaborWageInflationAssessment {
  let pressure = 0;
  if (input.wageGrowthBand === 'surge') {
    pressure += 0.3;
  } else if (input.wageGrowthBand === 'elevated') {
    pressure += 0.16;
  } else if (input.wageGrowthBand === 'moderate') {
    pressure += 0.06;
  }
  if (input.costOfLivingStress === 'extreme') {
    pressure += 0.22;
  } else if (input.costOfLivingStress === 'high') {
    pressure += 0.11;
  }
  if (input.participationSlackInflationBand === 'severe_slack') {
    pressure += 0.18;
  } else if (input.participationSlackInflationBand === 'slack') {
    pressure += 0.09;
  } else if (input.participationSlackInflationBand === 'tight') {
    pressure += 0.07;
  }
  if (input.householdExpectationsDeanchoring) {
    pressure += 0.15;
  }
  if (input.laborParticipationBand === 'weak' && input.wageGrowthBand !== 'subdued') {
    pressure += 0.08;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0042, 0, 1.05);
  const laborIndex = finRound(100 + pressure * 18, 1);

  let wageBand: PopulationLaborWageBand = 'subdued';
  if (pressure >= 0.58) wageBand = 'wage_spiral';
  else if (pressure >= 0.38) wageBand = 'elevated';
  else if (pressure >= 0.19) wageBand = 'building';

  const inflationScoreNudge =
    wageBand === 'wage_spiral'
      ? 0.09
      : wageBand === 'elevated'
        ? 0.06
        : wageBand === 'building'
          ? 0.03
          : 0;

  const narrative =
    wageBand === 'wage_spiral' || wageBand === 'elevated'
      ? 'Population and labor markets are passing wage pressure into CPI with de-anchored expectations.'
      : wageBand === 'building'
        ? 'Labor slack and wage bands building inflation through household cost stress.'
        : 'Population labor wage pass-through subdued versus headline CPI.';

  return { wageBand, laborIndex, inflationScoreNudge, narrative };
}

export function populationLaborWageInflationScoreAdjustment(band: PopulationLaborWageBand): number {
  if (band === 'wage_spiral') return 4;
  if (band === 'elevated') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/wholesale-energy-transition-inflation.ts ---

export type WholesaleEnergyTransitionBand = 'stable' | 'firming' | 'elevated' | 'transition_shock';

export interface WholesaleEnergyTransitionInflationAssessment {
  transitionBand: WholesaleEnergyTransitionBand;
  energyIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Wholesale energy stress and transition costs in CPI metadata (Agent 13). */
export function assessWholesaleEnergyTransitionInflation(input: {
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  retailTariffShock: boolean;
  gridReliabilityBand: 'stable' | 'strained' | 'fragile';
  emissionsTransitionCostBand: 'low' | 'medium' | 'high';
  renewableShortfallInflationFlag: boolean;
  wholesaleCascadeBand: 'none' | 'stressed' | 'cascade';
  inflationBand: InflationConditionsBand;
  turn: number;
}): WholesaleEnergyTransitionInflationAssessment {
  let pressure = 0;
  if (input.wholesaleEnergyStress === 'crisis') {
    pressure += 0.32;
  } else if (input.wholesaleEnergyStress === 'severe') {
    pressure += 0.2;
  } else if (input.wholesaleEnergyStress === 'elevated') {
    pressure += 0.1;
  }
  if (input.retailTariffShock) {
    pressure += 0.16;
  }
  if (input.gridReliabilityBand === 'fragile') {
    pressure += 0.14;
  } else if (input.gridReliabilityBand === 'strained') {
    pressure += 0.07;
  }
  if (input.emissionsTransitionCostBand === 'high') {
    pressure += 0.12;
  }
  if (input.renewableShortfallInflationFlag) {
    pressure += 0.15;
  }
  if (input.wholesaleCascadeBand === 'cascade') {
    pressure += 0.2;
  } else if (input.wholesaleCascadeBand === 'stressed') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const energyIndex = finRound(100 + pressure * 18, 1);

  let transitionBand: WholesaleEnergyTransitionBand = 'stable';
  if (pressure >= 0.57) transitionBand = 'transition_shock';
  else if (pressure >= 0.37) transitionBand = 'elevated';
  else if (pressure >= 0.18) transitionBand = 'firming';

  const inflationScoreNudge =
    transitionBand === 'transition_shock'
      ? 0.09
      : transitionBand === 'elevated'
        ? 0.058
        : transitionBand === 'firming'
          ? 0.028
          : 0;

  const narrative =
    transitionBand === 'transition_shock' || transitionBand === 'elevated'
      ? 'Wholesale energy and transition costs are lifting CPI through grid and cascade stress.'
      : transitionBand === 'firming'
        ? 'Energy transition pass-through firming as tariffs and reliability bands tighten.'
        : 'Wholesale energy transition CPI contribution stable versus headline.';

  return { transitionBand, energyIndex, inflationScoreNudge, narrative };
}

export function wholesaleEnergyTransitionInflationScoreAdjustment(band: WholesaleEnergyTransitionBand): number {
  if (band === 'transition_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/urban-rent-dispersion-inflation.ts ---

export type UrbanRentDispersionBand = 'aligned' | 'dispersing' | 'elevated' | 'metro_shock';

export interface UrbanRentDispersionInflationAssessment {
  dispersionBand: UrbanRentDispersionBand;
  urbanIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Urban rent growth and regional dispersion in CPI metadata (Agent 11 cities). */
export function assessUrbanRentDispersionInflation(input: {
  vacancyBand: 'loose' | 'balanced' | 'tight' | 'critical';
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  urbanizationPressure: 'low' | 'medium' | 'high';
  regionalDispersionScore: number;
  metroRentDispersionCritical: boolean;
  regionalHousingInflationSync: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): UrbanRentDispersionInflationAssessment {
  let pressure = 0;
  if (input.vacancyBand === 'critical') {
    pressure += 0.26;
  } else if (input.vacancyBand === 'tight') {
    pressure += 0.12;
  }
  if (input.rentGrowthBand === 'surging') {
    pressure += 0.28;
  } else if (input.rentGrowthBand === 'strong') {
    pressure += 0.14;
  }
  if (input.urbanizationPressure === 'high') {
    pressure += 0.1;
  }
  pressure += finClamp(input.regionalDispersionScore, 0, 1) * 0.18;
  if (input.metroRentDispersionCritical) {
    pressure += 0.2;
  }
  if (input.regionalHousingInflationSync) {
    pressure += 0.12;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const urbanIndex = finRound(100 + pressure * 17, 1);

  let dispersionBand: UrbanRentDispersionBand = 'aligned';
  if (pressure >= 0.56) dispersionBand = 'metro_shock';
  else if (pressure >= 0.36) dispersionBand = 'elevated';
  else if (pressure >= 0.17) dispersionBand = 'dispersing';

  const inflationScoreNudge =
    dispersionBand === 'metro_shock'
      ? 0.088
      : dispersionBand === 'elevated'
        ? 0.056
        : dispersionBand === 'dispersing'
          ? 0.026
          : 0;

  const narrative =
    dispersionBand === 'metro_shock' || dispersionBand === 'elevated'
      ? 'Urban rent dispersion is passing through to CPI across metro and regional markets.'
      : dispersionBand === 'dispersing'
        ? 'Regional housing inflation sync dispersing rent pressure into headline CPI.'
        : 'Urban rent dispersion aligned; shelter CPI pass-through subdued.';

  return { dispersionBand, urbanIndex, inflationScoreNudge, narrative };
}

export function urbanRentDispersionInflationScoreAdjustment(band: UrbanRentDispersionBand): number {
  if (band === 'metro_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'dispersing') return 2;
  return 0;
}


// --- source: inflation/corporate-pricing-pass-through-inflation.ts ---

export type CorporatePricingPassThroughBand = 'absorbed' | 'partial' | 'elevated' | 'markup_cascade';

export interface CorporatePricingPassThroughInflationAssessment {
  passThroughBand: CorporatePricingPassThroughBand;
  corporateIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Corporate pricing power and markup pass-through in CPI metadata (Agent 08). */
export function assessCorporatePricingPassThroughInflation(input: {
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  marginCompression: 'none' | 'mild' | 'severe';
  passThroughIntent: 'absorb' | 'partial' | 'full';
  productionCapacityStrainInflationFlag: boolean;
  corporateMarkupCascadeBand: 'none' | 'building' | 'active';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CorporatePricingPassThroughInflationAssessment {
  let pressure = 0;
  if (input.pricingPowerBand === 'dominant') {
    pressure += 0.28;
  } else if (input.pricingPowerBand === 'strong') {
    pressure += 0.16;
  }
  if (input.passThroughIntent === 'full') {
    pressure += 0.18;
  } else if (input.passThroughIntent === 'partial') {
    pressure += 0.08;
  }
  if (input.marginCompression === 'mild' && input.passThroughIntent !== 'absorb') {
    pressure += 0.06;
  }
  if (input.productionCapacityStrainInflationFlag) {
    pressure += 0.14;
  }
  if (input.corporateMarkupCascadeBand === 'active') {
    pressure += 0.2;
  } else if (input.corporateMarkupCascadeBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const corporateIndex = finRound(100 + pressure * 16, 1);

  let passThroughBand: CorporatePricingPassThroughBand = 'absorbed';
  if (pressure >= 0.55) passThroughBand = 'markup_cascade';
  else if (pressure >= 0.35) passThroughBand = 'elevated';
  else if (pressure >= 0.17) passThroughBand = 'partial';

  const inflationScoreNudge =
    passThroughBand === 'markup_cascade'
      ? 0.087
      : passThroughBand === 'elevated'
        ? 0.055
        : passThroughBand === 'partial'
          ? 0.025
          : 0;

  const narrative =
    passThroughBand === 'markup_cascade' || passThroughBand === 'elevated'
      ? 'Corporate pricing power is cascading markups into CPI through production strain.'
      : passThroughBand === 'partial'
        ? 'Partial corporate pass-through firming as pricing intent shifts.'
        : 'Corporate markup pass-through absorbed versus headline CPI.';

  return { passThroughBand, corporateIndex, inflationScoreNudge, narrative };
}

export function corporatePricingPassThroughInflationScoreAdjustment(band: CorporatePricingPassThroughBand): number {
  if (band === 'markup_cascade') return 4;
  if (band === 'elevated') return 3;
  if (band === 'partial') return 2;
  return 0;
}


// --- source: inflation/trade-exchange-import-inflation.ts ---

export type TradeExchangeImportBand = 'anchored' | 'import_pressure' | 'elevated' | 'fx_shock';

export interface TradeExchangeImportInflationAssessment {
  importBand: TradeExchangeImportBand;
  tradeIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Trade openness, FX, and import pipeline fragility in CPI metadata (Agent 15). */
export function assessTradeExchangeImportInflation(input: {
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  commodityImportShare: number;
  tariffShockInflationActive: boolean;
  importPipelineFragileBand: 'stable' | 'strained' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TradeExchangeImportInflationAssessment {
  let pressure = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') {
    pressure += 0.3;
  } else if (input.exchangeRatePressure === 'depreciation') {
    pressure += 0.16;
  }
  if (input.tradeOpennessBand === 'open') {
    pressure += finClamp(input.commodityImportShare, 0, 1) * 0.22;
  }
  if (input.tariffShockInflationActive) {
    pressure += 0.18;
  }
  if (input.importPipelineFragileBand === 'critical') {
    pressure += 0.2;
  } else if (input.importPipelineFragileBand === 'strained') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const tradeIndex = finRound(100 + pressure * 17, 1);

  let importBand: TradeExchangeImportBand = 'anchored';
  if (pressure >= 0.56) importBand = 'fx_shock';
  else if (pressure >= 0.36) importBand = 'elevated';
  else if (pressure >= 0.18) importBand = 'import_pressure';

  const inflationScoreNudge =
    importBand === 'fx_shock'
      ? 0.09
      : importBand === 'elevated'
        ? 0.058
        : importBand === 'import_pressure'
          ? 0.028
          : 0;

  const narrative =
    importBand === 'fx_shock' || importBand === 'elevated'
      ? 'Trade and FX channels are lifting CPI through import pipeline fragility.'
      : importBand === 'import_pressure'
        ? 'Import-side inflation pressure building from openness and commodity share.'
        : 'Trade exchange import pass-through anchored versus headline.';

  return { importBand, tradeIndex, inflationScoreNudge, narrative };
}

export function tradeExchangeImportInflationScoreAdjustment(band: TradeExchangeImportBand): number {
  if (band === 'fx_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'import_pressure') return 2;
  return 0;
}


// --- source: inflation/guardian-inflation-intervention-inflation.ts ---

export type GuardianInflationInterventionBand = 'calm' | 'advisory' | 'urgent' | 'guardrail_cascade';

export interface GuardianInflationInterventionAssessment {
  interventionBand: GuardianInflationInterventionBand;
  guardrailIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Guardian co-pilot inflation guardrails and narrative intervention (Agent 16). */
export function assessGuardianInflationInterventionInflation(input: {
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  narrativeShockSeverity: 'low' | 'medium' | 'high';
  copilotInflationEscalationActive: boolean;
  guardrailNarrativeCascadeBand: 'none' | 'building' | 'urgent';
  inflationBand: InflationConditionsBand;
  turn: number;
}): GuardianInflationInterventionAssessment {
  let pressure = 0;
  if (input.inflationGuardrailTripped) {
    pressure += 0.24;
  }
  if (input.stabilityInterventionBand === 'urgent') {
    pressure += 0.22;
  } else if (input.stabilityInterventionBand === 'advisory') {
    pressure += 0.1;
  }
  if (input.narrativeShockSeverity === 'high') {
    pressure += 0.18;
  } else if (input.narrativeShockSeverity === 'medium') {
    pressure += 0.08;
  }
  if (input.copilotInflationEscalationActive) {
    pressure += 0.16;
  }
  if (input.guardrailNarrativeCascadeBand === 'urgent') {
    pressure += 0.2;
  } else if (input.guardrailNarrativeCascadeBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const guardrailIndex = finRound(100 + pressure * 16, 1);

  let interventionBand: GuardianInflationInterventionBand = 'calm';
  if (pressure >= 0.55) interventionBand = 'guardrail_cascade';
  else if (pressure >= 0.35) interventionBand = 'urgent';
  else if (pressure >= 0.17) interventionBand = 'advisory';

  const inflationScoreNudge =
    interventionBand === 'guardrail_cascade'
      ? 0.086
      : interventionBand === 'urgent'
        ? 0.054
        : interventionBand === 'advisory'
          ? 0.024
          : 0;

  const narrative =
    interventionBand === 'guardrail_cascade' || interventionBand === 'urgent'
      ? 'Guardian guardrails are reflecting elevated inflation intervention in CPI metadata.'
      : interventionBand === 'advisory'
        ? 'Co-pilot advisory band nudging inflation presentation layers.'
        : 'Guardian inflation intervention calm versus headline CPI.';

  return { interventionBand, guardrailIndex, inflationScoreNudge, narrative };
}

export function guardianInflationInterventionScoreAdjustment(band: GuardianInflationInterventionBand): number {
  if (band === 'guardrail_cascade') return 4;
  if (band === 'urgent') return 3;
  if (band === 'advisory') return 2;
  return 0;
}


// --- source: inflation/team-intelligence-consensus-inflation.ts ---

export type TeamIntelligenceConsensusBand = 'anchored' | 'drifting' | 'reacceleration' | 'consensus_shock';

export interface TeamIntelligenceConsensusInflationAssessment {
  consensusBand: TeamIntelligenceConsensusBand;
  briefingIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Team intelligence consensus and briefing salience in CPI metadata (Agent 18). */
export function assessTeamIntelligenceConsensusInflation(input: {
  consensusInflationOutlook: 'disinflation' | 'stable' | 'reacceleration' | 'upside_risk';
  briefingUrgencyBand: 'routine' | 'elevated' | 'critical';
  crossDomainStressScore: number;
  teamForecastDeanchoringFlag: boolean;
  briefingInflationSalienceBand: 'muted' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TeamIntelligenceConsensusInflationAssessment {
  let pressure = 0;
  if (input.consensusInflationOutlook === 'upside_risk') {
    pressure += 0.28;
  } else if (input.consensusInflationOutlook === 'reacceleration') {
    pressure += 0.16;
  }
  if (input.briefingUrgencyBand === 'critical') {
    pressure += 0.2;
  } else if (input.briefingUrgencyBand === 'elevated') {
    pressure += 0.1;
  }
  pressure += finClamp(input.crossDomainStressScore, 0, 1) * 0.2;
  if (input.teamForecastDeanchoringFlag) {
    pressure += 0.14;
  }
  if (input.briefingInflationSalienceBand === 'critical') {
    pressure += 0.18;
  } else if (input.briefingInflationSalienceBand === 'elevated') {
    pressure += 0.09;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const briefingIndex = finRound(100 + pressure * 15, 1);

  let consensusBand: TeamIntelligenceConsensusBand = 'anchored';
  if (pressure >= 0.56) consensusBand = 'consensus_shock';
  else if (pressure >= 0.36) consensusBand = 'reacceleration';
  else if (pressure >= 0.18) consensusBand = 'drifting';

  const inflationScoreNudge =
    consensusBand === 'consensus_shock'
      ? 0.088
      : consensusBand === 'reacceleration'
        ? 0.056
        : consensusBand === 'drifting'
          ? 0.026
          : 0;

  const narrative =
    consensusBand === 'consensus_shock' || consensusBand === 'reacceleration'
      ? 'Team intelligence consensus is lifting inflation outlook salience across briefings.'
      : consensusBand === 'drifting'
        ? 'Cross-domain stress drifting team inflation consensus upward.'
        : 'Team consensus inflation outlook anchored versus headline.';

  return { consensusBand, briefingIndex, inflationScoreNudge, narrative };
}

export function teamIntelligenceConsensusInflationScoreAdjustment(band: TeamIntelligenceConsensusBand): number {
  if (band === 'consensus_shock') return 4;
  if (band === 'reacceleration') return 3;
  if (band === 'drifting') return 2;
  return 0;
}


// --- source: inflation/strategic-geopolitical-inflation-premium.ts ---

export type StrategicGeopoliticalPremiumBand = 'contained' | 'firming' | 'elevated' | 'geopolitical_shock';

export interface StrategicGeopoliticalInflationPremiumAssessment {
  premiumBand: StrategicGeopoliticalPremiumBand;
  strategicIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** National strategic priority and geopolitical risk premium in CPI metadata (Agent 01). */
export function assessStrategicGeopoliticalInflationPremium(input: {
  nationalPriorityInflationBias: 'containment' | 'neutral' | 'expansionary';
  strategicStockpileStress: boolean;
  geopoliticalRiskPremium: number;
  expansionaryPriorityCascadeActive: boolean;
  strategicInflationRiskBand: 'low' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): StrategicGeopoliticalInflationPremiumAssessment {
  let pressure = 0;
  if (input.nationalPriorityInflationBias === 'expansionary') {
    pressure += 0.22;
  }
  if (input.strategicStockpileStress) {
    pressure += 0.18;
  }
  pressure += finClamp(input.geopoliticalRiskPremium, 0, 1) * 0.24;
  if (input.expansionaryPriorityCascadeActive) {
    pressure += 0.16;
  }
  if (input.strategicInflationRiskBand === 'critical') {
    pressure += 0.22;
  } else if (input.strategicInflationRiskBand === 'elevated') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const strategicIndex = finRound(100 + pressure * 17, 1);

  let premiumBand: StrategicGeopoliticalPremiumBand = 'contained';
  if (pressure >= 0.56) premiumBand = 'geopolitical_shock';
  else if (pressure >= 0.36) premiumBand = 'elevated';
  else if (pressure >= 0.17) premiumBand = 'firming';

  const inflationScoreNudge =
    premiumBand === 'geopolitical_shock'
      ? 0.09
      : premiumBand === 'elevated'
        ? 0.057
        : premiumBand === 'firming'
          ? 0.027
          : 0;

  const narrative =
    premiumBand === 'geopolitical_shock' || premiumBand === 'elevated'
      ? 'Strategic priorities and geopolitical risk are lifting CPI through premium channels.'
      : premiumBand === 'firming'
        ? 'National inflation bias firming with stockpile and risk pass-through.'
        : 'Strategic geopolitical premium contained versus headline CPI.';

  return { premiumBand, strategicIndex, inflationScoreNudge, narrative };
}

export function strategicGeopoliticalInflationPremiumScoreAdjustment(band: StrategicGeopoliticalPremiumBand): number {
  if (band === 'geopolitical_shock') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}


// --- source: inflation/ai-memory-inflation-recall-inflation.ts ---

export type AiMemoryInflationRecallBand = 'anchored' | 'drifting' | 'recall_elevated' | 'memory_shock';

export interface AiMemoryInflationRecallAssessment {
  recallBand: AiMemoryInflationRecallBand;
  memoryIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** AI memory recall and explainability salience in CPI metadata (Agent 19). */
export function assessAiMemoryInflationRecallInflation(input: {
  recalledInflationRegimeConfidence: number;
  narrativeDriftTowardHigherInflation: boolean;
  explainabilityAlertActive: boolean;
  memoryInflationRecallCascade: boolean;
  explainabilityInflationSalienceBand: 'muted' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): AiMemoryInflationRecallAssessment {
  let pressure = 0;
  if (input.narrativeDriftTowardHigherInflation) {
    pressure += 0.22;
  }
  pressure += finClamp(input.recalledInflationRegimeConfidence, 0, 1) * 0.2;
  if (input.explainabilityAlertActive) {
    pressure += 0.14;
  }
  if (input.memoryInflationRecallCascade) {
    pressure += 0.18;
  }
  if (input.explainabilityInflationSalienceBand === 'critical') {
    pressure += 0.2;
  } else if (input.explainabilityInflationSalienceBand === 'elevated') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const memoryIndex = finRound(100 + pressure * 16, 1);

  let recallBand: AiMemoryInflationRecallBand = 'anchored';
  if (pressure >= 0.55) recallBand = 'memory_shock';
  else if (pressure >= 0.35) recallBand = 'recall_elevated';
  else if (pressure >= 0.16) recallBand = 'drifting';

  const inflationScoreNudge =
    recallBand === 'memory_shock'
      ? 0.088
      : recallBand === 'recall_elevated'
        ? 0.055
        : recallBand === 'drifting'
          ? 0.024
          : 0;

  const narrative =
    recallBand === 'memory_shock' || recallBand === 'recall_elevated'
      ? 'AI memory recall is elevating inflation regime confidence in CPI presentation layers.'
      : recallBand === 'drifting'
        ? 'Narrative drift toward higher inflation in memory-backed explainability.'
        : 'AI memory inflation recall anchored versus headline.';

  return { recallBand, memoryIndex, inflationScoreNudge, narrative };
}

export function aiMemoryInflationRecallScoreAdjustment(band: AiMemoryInflationRecallBand): number {
  if (band === 'memory_shock') return 4;
  if (band === 'recall_elevated') return 3;
  if (band === 'drifting') return 2;
  return 0;
}


// --- source: inflation/calendar-season-inflation-carryover.ts ---

export type CalendarSeasonInflationCarryoverBand = 'off_season' | 'normal' | 'peak' | 'carryover_shock';

export interface CalendarSeasonInflationCarryoverAssessment {
  carryoverBand: CalendarSeasonInflationCarryoverBand;
  calendarIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Calendar season and multi-turn inflation carryover (Agent 02). */
export function assessCalendarSeasonInflationCarryover(input: {
  calendarSeasonBand: 'off_peak' | 'normal' | 'peak_demand';
  policyReviewWindowOpen: boolean;
  multiTurnInflationCarryover: number;
  fiscalCalendarInflationLatch: boolean;
  multiTurnCarryoverBand: 'muted' | 'building' | 'persistent';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CalendarSeasonInflationCarryoverAssessment {
  let pressure = 0;
  if (input.calendarSeasonBand === 'peak_demand') {
    pressure += 0.2;
  } else if (input.calendarSeasonBand === 'normal') {
    pressure += 0.06;
  }
  pressure += finClamp(input.multiTurnInflationCarryover, 0, 1) * 0.28;
  if (input.policyReviewWindowOpen && input.calendarSeasonBand === 'peak_demand') {
    pressure += 0.1;
  }
  if (input.fiscalCalendarInflationLatch) {
    pressure += 0.14;
  }
  if (input.multiTurnCarryoverBand === 'persistent') {
    pressure += 0.2;
  } else if (input.multiTurnCarryoverBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const calendarIndex = finRound(100 + pressure * 15, 1);

  let carryoverBand: CalendarSeasonInflationCarryoverBand = 'off_season';
  if (pressure >= 0.54) carryoverBand = 'carryover_shock';
  else if (pressure >= 0.34) carryoverBand = 'peak';
  else if (pressure >= 0.15) carryoverBand = 'normal';

  const inflationScoreNudge =
    carryoverBand === 'carryover_shock'
      ? 0.086
      : carryoverBand === 'peak'
        ? 0.054
        : carryoverBand === 'normal'
          ? 0.024
          : 0;

  const narrative =
    carryoverBand === 'carryover_shock' || carryoverBand === 'peak'
      ? 'Calendar season and multi-turn carryover lifting CPI through peak demand windows.'
      : carryoverBand === 'normal'
        ? 'Seasonal inflation carryover building across turn boundaries.'
        : 'Calendar carryover subdued versus headline CPI.';

  return { carryoverBand, calendarIndex, inflationScoreNudge, narrative };
}

export function calendarSeasonInflationCarryoverScoreAdjustment(band: CalendarSeasonInflationCarryoverBand): number {
  if (band === 'carryover_shock') return 4;
  if (band === 'peak') return 3;
  if (band === 'normal') return 2;
  return 0;
}


// --- source: inflation/automation-autopilot-inflation-drift.ts ---

export type AutomationAutopilotInflationDriftBand = 'neutral' | 'biased' | 'elevated' | 'autopilot_runaway';

export interface AutomationAutopilotInflationDriftAssessment {
  driftBand: AutomationAutopilotInflationDriftBand;
  autopilotIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Idle automation autopilot bias and unattended shock drift (Agent 20). */
export function assessAutomationAutopilotInflationDrift(input: {
  macroAutopilotInflationBias: 'deflate' | 'neutral' | 'inflate';
  unattendedShockDriftActive: boolean;
  automationConfidenceScore: number;
  idleMacroInflationEscalation: boolean;
  autopilotDriftCascadeBand: 'none' | 'drifting' | 'runaway';
  inflationBand: InflationConditionsBand;
  turn: number;
}): AutomationAutopilotInflationDriftAssessment {
  let pressure = 0;
  if (input.macroAutopilotInflationBias === 'inflate') {
    pressure += 0.22;
  }
  if (input.unattendedShockDriftActive) {
    pressure += 0.18;
  }
  if (input.automationConfidenceScore < 0.45) {
    pressure += 0.16;
  } else if (input.automationConfidenceScore < 0.6) {
    pressure += 0.08;
  }
  if (input.idleMacroInflationEscalation) {
    pressure += 0.14;
  }
  if (input.autopilotDriftCascadeBand === 'runaway') {
    pressure += 0.22;
  } else if (input.autopilotDriftCascadeBand === 'drifting') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const autopilotIndex = finRound(100 + pressure * 16, 1);

  let driftBand: AutomationAutopilotInflationDriftBand = 'neutral';
  if (pressure >= 0.56) driftBand = 'autopilot_runaway';
  else if (pressure >= 0.36) driftBand = 'elevated';
  else if (pressure >= 0.17) driftBand = 'biased';

  const inflationScoreNudge =
    driftBand === 'autopilot_runaway'
      ? 0.09
      : driftBand === 'elevated'
        ? 0.058
        : driftBand === 'biased'
          ? 0.027
          : 0;

  const narrative =
    driftBand === 'autopilot_runaway' || driftBand === 'elevated'
      ? 'Automation autopilot drift is passing inflation bias into CPI metadata.'
      : driftBand === 'biased'
        ? 'Idle macro inflation escalation biasing unattended shock drift.'
        : 'Automation autopilot inflation drift neutral versus headline.';

  return { driftBand, autopilotIndex, inflationScoreNudge, narrative };
}

export function automationAutopilotInflationDriftScoreAdjustment(band: AutomationAutopilotInflationDriftBand): number {
  if (band === 'autopilot_runaway') return 4;
  if (band === 'elevated') return 3;
  if (band === 'biased') return 2;
  return 0;
}


// --- source: inflation/research-productivity-inflation-offset.ts ---

export type ResearchProductivityInflationOffsetBand = 'strong_relief' | 'moderate_relief' | 'neutral' | 'offset_failing';

export interface ResearchProductivityInflationOffsetAssessment {
  offsetBand: ResearchProductivityInflationOffsetBand;
  productivityIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Research productivity and supply-side inflation offset (Agent 03). */
export function assessResearchProductivityInflationOffset(input: {
  productivityGainBand: 'flat' | 'moderate' | 'strong';
  supplySideReliefActive: boolean;
  innovationInflationOffsetScore: number;
  techTreeInflationLatch: boolean;
  supplySideOffsetBand: 'weak' | 'building' | 'strong';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ResearchProductivityInflationOffsetAssessment {
  let relief = 0;
  if (input.productivityGainBand === 'strong' && input.supplySideReliefActive) {
    relief += 0.28;
  } else if (input.productivityGainBand === 'moderate') {
    relief += 0.14;
  } else if (input.productivityGainBand === 'flat') {
    relief -= 0.12;
  }
  relief += finClamp(input.innovationInflationOffsetScore, 0, 1) * 0.22;
  if (input.techTreeInflationLatch && input.supplySideOffsetBand === 'strong') {
    relief += 0.16;
  } else if (input.supplySideOffsetBand === 'building') {
    relief += 0.08;
  } else if (input.supplySideOffsetBand === 'weak') {
    relief -= 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    relief -= 0.06;
  }

  relief = finClamp(relief + input.turn * 0.0025, -0.35, 0.85);
  const productivityIndex = finRound(100 + relief * 18, 1);

  let offsetBand: ResearchProductivityInflationOffsetBand = 'neutral';
  if (relief >= 0.42) offsetBand = 'strong_relief';
  else if (relief >= 0.2) offsetBand = 'moderate_relief';
  else if (relief <= -0.08) offsetBand = 'offset_failing';

  const inflationScoreNudge =
    offsetBand === 'offset_failing'
      ? 0.062
      : offsetBand === 'neutral'
        ? 0.018
        : offsetBand === 'moderate_relief'
          ? -0.022
          : -0.048;

  const narrative =
    offsetBand === 'strong_relief' || offsetBand === 'moderate_relief'
      ? 'Research productivity offset is easing CPI through supply-side relief.'
      : offsetBand === 'offset_failing'
        ? 'Flat productivity and weak offset band failing to contain inflation.'
        : 'Innovation inflation offset neutral versus headline CPI.';

  return { offsetBand, productivityIndex, inflationScoreNudge, narrative };
}

export function researchProductivityInflationOffsetScoreAdjustment(
  band: ResearchProductivityInflationOffsetBand,
): number {
  if (band === 'offset_failing') return 3;
  if (band === 'neutral') return 1;
  if (band === 'moderate_relief') return -1;
  return -2;
}


// --- source: inflation/scenario-sandbox-inflation-bias.ts ---

export type ScenarioSandboxInflationBiasBand = 'disinflationary' | 'neutral' | 'inflationary' | 'extreme_stress';

export interface ScenarioSandboxInflationBiasAssessment {
  biasBand: ScenarioSandboxInflationBiasBand;
  scenarioIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Scenario modes and sandbox stress inflation bias (Agent 04). */
export function assessScenarioSandboxInflationBias(input: {
  scenarioInflationBias: 'disinflationary' | 'neutral' | 'inflationary' | 'extreme';
  sandboxStressModeActive: boolean;
  difficultyCostMultiplier: number;
  difficultyInflationCascade: boolean;
  sandboxStressInflationBand: 'routine' | 'stressed' | 'extreme';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ScenarioSandboxInflationBiasAssessment {
  let pressure = 0;
  if (input.scenarioInflationBias === 'extreme') {
    pressure += 0.32;
  } else if (input.scenarioInflationBias === 'inflationary') {
    pressure += 0.18;
  } else if (input.scenarioInflationBias === 'disinflationary') {
    pressure -= 0.12;
  }
  if (input.sandboxStressModeActive) {
    pressure += finClamp(input.difficultyCostMultiplier - 1, 0, 0.35) * 0.55;
  }
  if (input.difficultyInflationCascade) {
    pressure += 0.14;
  }
  if (input.sandboxStressInflationBand === 'extreme') {
    pressure += 0.2;
  } else if (input.sandboxStressInflationBand === 'stressed') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, -0.2, 1.05);
  const scenarioIndex = finRound(100 + pressure * 17, 1);

  let biasBand: ScenarioSandboxInflationBiasBand = 'neutral';
  if (pressure >= 0.52) biasBand = 'extreme_stress';
  else if (pressure >= 0.28) biasBand = 'inflationary';
  else if (pressure <= -0.06) biasBand = 'disinflationary';

  const inflationScoreNudge =
    biasBand === 'extreme_stress'
      ? 0.088
      : biasBand === 'inflationary'
        ? 0.052
        : biasBand === 'disinflationary'
          ? -0.028
          : 0;

  const narrative =
    biasBand === 'extreme_stress' || biasBand === 'inflationary'
      ? 'Scenario sandbox stress is biasing CPI metadata toward higher inflation.'
      : biasBand === 'disinflationary'
        ? 'Disinflationary scenario bias offsetting headline pressure.'
        : 'Scenario inflation bias neutral versus headline CPI.';

  return { biasBand, scenarioIndex, inflationScoreNudge, narrative };
}

export function scenarioSandboxInflationBiasScoreAdjustment(band: ScenarioSandboxInflationBiasBand): number {
  if (band === 'extreme_stress') return 4;
  if (band === 'inflationary') return 3;
  if (band === 'disinflationary') return -1;
  return 0;
}


// --- source: inflation/events-narrative-inflation-persistence.ts ---

export type EventsNarrativeInflationPersistenceBand = 'muted' | 'building' | 'active' | 'entrenched';

export interface EventsNarrativeInflationPersistenceAssessment {
  persistenceBand: EventsNarrativeInflationPersistenceBand;
  eventsIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Dynamic events and supply shock inflation persistence (Agent 05). */
export function assessEventsNarrativeInflationPersistence(input: {
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  confidenceShockBand: 'calm' | 'uneasy' | 'severe';
  dynamicEventInflationLatch: boolean;
  supplyShockPersistenceBand: 'none' | 'building' | 'entrenched';
  inflationBand: InflationConditionsBand;
  turn: number;
}): EventsNarrativeInflationPersistenceAssessment {
  let pressure = 0;
  if (input.inflationShockEventActive) {
    pressure += 0.2;
  }
  if (input.supplyDisruptionSeverity === 'national') {
    pressure += 0.18;
  } else if (input.supplyDisruptionSeverity === 'localized') {
    pressure += 0.09;
  }
  if (input.confidenceShockBand === 'severe') {
    pressure += 0.16;
  } else if (input.confidenceShockBand === 'uneasy') {
    pressure += 0.08;
  }
  if (input.dynamicEventInflationLatch) {
    pressure += 0.14;
  }
  if (input.supplyShockPersistenceBand === 'entrenched') {
    pressure += 0.22;
  } else if (input.supplyShockPersistenceBand === 'building') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const eventsIndex = finRound(100 + pressure * 16, 1);

  let persistenceBand: EventsNarrativeInflationPersistenceBand = 'muted';
  if (pressure >= 0.55) persistenceBand = 'entrenched';
  else if (pressure >= 0.35) persistenceBand = 'active';
  else if (pressure >= 0.16) persistenceBand = 'building';

  const inflationScoreNudge =
    persistenceBand === 'entrenched'
      ? 0.09
      : persistenceBand === 'active'
        ? 0.056
        : persistenceBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    persistenceBand === 'entrenched' || persistenceBand === 'active'
      ? 'Event narrative supply shocks persisting into CPI metadata.'
      : persistenceBand === 'building'
        ? 'Dynamic event inflation latch building across turns.'
        : 'Events inflation persistence muted versus headline CPI.';

  return { persistenceBand, eventsIndex, inflationScoreNudge, narrative };
}

export function eventsNarrativeInflationPersistenceScoreAdjustment(
  band: EventsNarrativeInflationPersistenceBand,
): number {
  if (band === 'entrenched') return 4;
  if (band === 'active') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/macro-demand-overheat-inflation-slippage.ts ---

export type MacroDemandOverheatInflationSlippageBand = 'anchored' | 'warming' | 'overheating' | 'dislocated';

export interface MacroDemandOverheatInflationSlippageAssessment {
  slippageBand: MacroDemandOverheatInflationSlippageBand;
  macroIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Macro demand overheat and transmission inflation slippage (Agent 06). */
export function assessMacroDemandOverheatInflationSlippage(input: {
  gdpGrowthBand: 'contraction' | 'slow' | 'steady' | 'strong';
  nominalDemandPressure: number;
  outputGap: number;
  macroDemandOverheatLatch: boolean;
  transmissionSlippageBand: 'stable' | 'slipping' | 'dislocated';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MacroDemandOverheatInflationSlippageAssessment {
  let pressure = 0;
  if (input.gdpGrowthBand === 'strong') {
    pressure += 0.16;
  } else if (input.gdpGrowthBand === 'steady') {
    pressure += 0.07;
  }
  pressure += finClamp(input.nominalDemandPressure, -0.5, 1) * 0.24;
  if (input.outputGap > 0.25) {
    pressure += input.outputGap * 0.35;
  }
  if (input.macroDemandOverheatLatch) {
    pressure += 0.15;
  }
  if (input.transmissionSlippageBand === 'dislocated') {
    pressure += 0.24;
  } else if (input.transmissionSlippageBand === 'slipping') {
    pressure += 0.12;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const macroIndex = finRound(100 + pressure * 15, 1);

  let slippageBand: MacroDemandOverheatInflationSlippageBand = 'anchored';
  if (pressure >= 0.54) slippageBand = 'dislocated';
  else if (pressure >= 0.34) slippageBand = 'overheating';
  else if (pressure >= 0.15) slippageBand = 'warming';

  const inflationScoreNudge =
    slippageBand === 'dislocated'
      ? 0.087
      : slippageBand === 'overheating'
        ? 0.055
        : slippageBand === 'warming'
          ? 0.026
          : 0;

  const narrative =
    slippageBand === 'dislocated' || slippageBand === 'overheating'
      ? 'Macro demand overheat is slipping inflation through transmission channels.'
      : slippageBand === 'warming'
        ? 'Nominal demand pressure warming CPI metadata.'
        : 'Macro transmission slippage anchored versus headline CPI.';

  return { slippageBand, macroIndex, inflationScoreNudge, narrative };
}

export function macroDemandOverheatInflationSlippageScoreAdjustment(
  band: MacroDemandOverheatInflationSlippageBand,
): number {
  if (band === 'dislocated') return 4;
  if (band === 'overheating') return 3;
  if (band === 'warming') return 2;
  return 0;
}


// --- source: inflation/freight-logistics-inflation-congestion.ts ---

export type FreightLogisticsInflationCongestionBand = 'clear' | 'building' | 'congested' | 'gridlocked';

export interface FreightLogisticsInflationCongestionAssessment {
  congestionBand: FreightLogisticsInflationCongestionBand;
  logisticsIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Freight capacity and port backlog inflation congestion (Agent 12). */
export function assessFreightLogisticsInflationCongestion(input: {
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  portBacklogBand: 'clear' | 'moderate' | 'severe';
  logisticsInflationLatch: boolean;
  freightCongestionBand: 'clear' | 'building' | 'gridlocked';
  inflationBand: InflationConditionsBand;
  turn: number;
}): FreightLogisticsInflationCongestionAssessment {
  let pressure = 0;
  if (input.freightCapacityBand === 'critical') {
    pressure += 0.24;
  } else if (input.freightCapacityBand === 'tight') {
    pressure += 0.14;
  } else if (input.freightCapacityBand === 'balanced') {
    pressure += 0.05;
  }
  if (input.fuelSurchargeActive) {
    pressure += 0.12;
  }
  if (input.portBacklogBand === 'severe') {
    pressure += 0.18;
  } else if (input.portBacklogBand === 'moderate') {
    pressure += 0.08;
  }
  if (input.logisticsInflationLatch) {
    pressure += 0.13;
  }
  if (input.freightCongestionBand === 'gridlocked') {
    pressure += 0.22;
  } else if (input.freightCongestionBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const logisticsIndex = finRound(100 + pressure * 16, 1);

  let congestionBand: FreightLogisticsInflationCongestionBand = 'clear';
  if (pressure >= 0.56) congestionBand = 'gridlocked';
  else if (pressure >= 0.36) congestionBand = 'congested';
  else if (pressure >= 0.16) congestionBand = 'building';

  const inflationScoreNudge =
    congestionBand === 'gridlocked'
      ? 0.091
      : congestionBand === 'congested'
        ? 0.057
        : congestionBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    congestionBand === 'gridlocked' || congestionBand === 'congested'
      ? 'Freight and port congestion lifting logistics-side CPI metadata.'
      : congestionBand === 'building'
        ? 'Logistics inflation latch building across transport capacity bands.'
        : 'Freight logistics congestion clear versus headline CPI.';

  return { congestionBand, logisticsIndex, inflationScoreNudge, narrative };
}

export function freightLogisticsInflationCongestionScoreAdjustment(
  band: FreightLogisticsInflationCongestionBand,
): number {
  if (band === 'gridlocked') return 4;
  if (band === 'congested') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/housing-wellbeing-inflation-essential-stress.ts ---

export type HousingWellbeingInflationEssentialStressBand = 'stable' | 'strained' | 'critical' | 'acute';

export interface HousingWellbeingInflationEssentialStressAssessment {
  stressBand: HousingWellbeingInflationEssentialStressBand;
  shelterIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Housing mortgage and wellbeing essential inflation stress (Agent 14). */
export function assessHousingWellbeingInflationEssentialStress(input: {
  mortgageStressBand: 'low' | 'elevated' | 'severe';
  wellbeingCostBand: 'stable' | 'strained' | 'critical';
  essentialServicesInflationFlag: boolean;
  shelterEssentialInflationLatch: boolean;
  mortgageWellbeingStressBand: 'stable' | 'strained' | 'acute';
  inflationBand: InflationConditionsBand;
  turn: number;
}): HousingWellbeingInflationEssentialStressAssessment {
  let pressure = 0;
  if (input.mortgageStressBand === 'severe') {
    pressure += 0.2;
  } else if (input.mortgageStressBand === 'elevated') {
    pressure += 0.1;
  }
  if (input.wellbeingCostBand === 'critical') {
    pressure += 0.18;
  } else if (input.wellbeingCostBand === 'strained') {
    pressure += 0.09;
  }
  if (input.essentialServicesInflationFlag) {
    pressure += 0.12;
  }
  if (input.shelterEssentialInflationLatch) {
    pressure += 0.14;
  }
  if (input.mortgageWellbeingStressBand === 'acute') {
    pressure += 0.22;
  } else if (input.mortgageWellbeingStressBand === 'strained') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const shelterIndex = finRound(100 + pressure * 15, 1);

  let stressBand: HousingWellbeingInflationEssentialStressBand = 'stable';
  if (pressure >= 0.55) stressBand = 'acute';
  else if (pressure >= 0.35) stressBand = 'critical';
  else if (pressure >= 0.16) stressBand = 'strained';

  const inflationScoreNudge =
    stressBand === 'acute'
      ? 0.089
      : stressBand === 'critical'
        ? 0.056
        : stressBand === 'strained'
          ? 0.027
          : 0;

  const narrative =
    stressBand === 'acute' || stressBand === 'critical'
      ? 'Mortgage and wellbeing essential stress feeding shelter CPI metadata.'
      : stressBand === 'strained'
        ? 'Shelter essential inflation latch building under mortgage pressure.'
        : 'Housing wellbeing essential stress stable versus headline CPI.';

  return { stressBand, shelterIndex, inflationScoreNudge, narrative };
}

export function housingWellbeingInflationEssentialStressScoreAdjustment(
  band: HousingWellbeingInflationEssentialStressBand,
): number {
  if (band === 'acute') return 4;
  if (band === 'critical') return 3;
  if (band === 'strained') return 2;
  return 0;
}


// --- source: inflation/command-center-inflation-fusion-escalation.ts ---

export type CommandCenterInflationFusionEscalationBand = 'calm' | 'elevated' | 'critical' | 'fusion_runaway';

export interface CommandCenterInflationFusionEscalationAssessment {
  escalationBand: CommandCenterInflationFusionEscalationBand;
  fusionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** AI command center inflation fusion escalation (Agent 17). */
export function assessCommandCenterInflationFusionEscalation(input: {
  macroAlertLevel: 'green' | 'amber' | 'red';
  inflationFusionScore: number;
  coordinatedTighteningSuggested: boolean;
  macroInflationFusionLatch: boolean;
  commandAlertCascadeBand: 'stable' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CommandCenterInflationFusionEscalationAssessment {
  let pressure = 0;
  if (input.macroAlertLevel === 'red') {
    pressure += 0.24;
  } else if (input.macroAlertLevel === 'amber') {
    pressure += 0.11;
  }
  pressure += finClamp(input.inflationFusionScore, 0, 1) * 0.28;
  if (input.coordinatedTighteningSuggested) {
    pressure += 0.08;
  }
  if (input.macroInflationFusionLatch) {
    pressure += 0.14;
  }
  if (input.commandAlertCascadeBand === 'critical') {
    pressure += 0.2;
  } else if (input.commandAlertCascadeBand === 'elevated') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const fusionIndex = finRound(100 + pressure * 16, 1);

  let escalationBand: CommandCenterInflationFusionEscalationBand = 'calm';
  if (pressure >= 0.58) escalationBand = 'fusion_runaway';
  else if (pressure >= 0.38) escalationBand = 'critical';
  else if (pressure >= 0.18) escalationBand = 'elevated';

  const inflationScoreNudge =
    escalationBand === 'fusion_runaway'
      ? 0.092
      : escalationBand === 'critical'
        ? 0.058
        : escalationBand === 'elevated'
          ? 0.028
          : 0;

  const narrative =
    escalationBand === 'fusion_runaway' || escalationBand === 'critical'
      ? 'Command center inflation fusion escalating CPI metadata alerts.'
      : escalationBand === 'elevated'
        ? 'Macro inflation fusion latch building under amber alert.'
        : 'Command fusion escalation calm versus headline CPI.';

  return { escalationBand, fusionIndex, inflationScoreNudge, narrative };
}

export function commandCenterInflationFusionEscalationScoreAdjustment(
  band: CommandCenterInflationFusionEscalationBand,
): number {
  if (band === 'fusion_runaway') return 4;
  if (band === 'critical') return 3;
  if (band === 'elevated') return 2;
  return 0;
}


// --- source: inflation/ui-player-inflation-salience-nudge.ts ---

export type UiPlayerInflationSalienceNudgeBand = 'muted' | 'building' | 'elevated' | 'sharp';

export interface UiPlayerInflationSalienceNudgeAssessment {
  nudgeBand: UiPlayerInflationSalienceNudgeBand;
  salienceIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Player UI inflation salience and expectations nudge (Agent 22). */
export function assessUiPlayerInflationSalienceNudge(input: {
  inflationDashboardStressHighlight: boolean;
  playerAttentionOnCostOfLiving: 'low' | 'medium' | 'high';
  uiNudgeInflationExpectationsUp: boolean;
  playerInflationSalienceLatch: boolean;
  uiExpectationsNudgeBand: 'muted' | 'building' | 'sharp';
  inflationBand: InflationConditionsBand;
  turn: number;
}): UiPlayerInflationSalienceNudgeAssessment {
  let pressure = 0;
  if (input.inflationDashboardStressHighlight) {
    pressure += 0.14;
  }
  if (input.playerAttentionOnCostOfLiving === 'high') {
    pressure += 0.2;
  } else if (input.playerAttentionOnCostOfLiving === 'medium') {
    pressure += 0.09;
  }
  if (input.uiNudgeInflationExpectationsUp) {
    pressure += 0.16;
  }
  if (input.playerInflationSalienceLatch) {
    pressure += 0.13;
  }
  if (input.uiExpectationsNudgeBand === 'sharp') {
    pressure += 0.22;
  } else if (input.uiExpectationsNudgeBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const salienceIndex = finRound(100 + pressure * 15, 1);

  let nudgeBand: UiPlayerInflationSalienceNudgeBand = 'muted';
  if (pressure >= 0.55) nudgeBand = 'sharp';
  else if (pressure >= 0.34) nudgeBand = 'elevated';
  else if (pressure >= 0.15) nudgeBand = 'building';

  const inflationScoreNudge =
    nudgeBand === 'sharp'
      ? 0.088
      : nudgeBand === 'elevated'
        ? 0.054
        : nudgeBand === 'building'
          ? 0.025
          : 0;

  const narrative =
    nudgeBand === 'sharp' || nudgeBand === 'elevated'
      ? 'UI player salience nudging inflation expectations in CPI metadata.'
      : nudgeBand === 'building'
        ? 'Dashboard stress highlight building cost-of-living attention.'
        : 'UI inflation salience nudge muted versus headline CPI.';

  return { nudgeBand, salienceIndex, inflationScoreNudge, narrative };
}

export function uiPlayerInflationSalienceNudgeScoreAdjustment(band: UiPlayerInflationSalienceNudgeBand): number {
  if (band === 'sharp') return 4;
  if (band === 'elevated') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/fiscal-indexation-inflation-anchor-breach.ts ---

export type FiscalIndexationInflationAnchorBreachBand = 'anchored' | 'strained' | 'breached' | 'cascade';

export interface FiscalIndexationInflationAnchorBreachAssessment {
  breachBand: FiscalIndexationInflationAnchorBreachBand;
  fiscalIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Fiscal indexation and anchor breach inflation pressure (Agent 07). */
export function assessFiscalIndexationInflationAnchorBreach(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  fiscalAnchorBreached: boolean;
  debtIndexationInflationLatch: boolean;
  fiscalPassThroughCascadeBand: 'muted' | 'building' | 'runaway';
  inflationBand: InflationConditionsBand;
  turn: number;
}): FiscalIndexationInflationAnchorBreachAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') {
    pressure += 0.18;
  } else if (input.consolidatedDeficitBand === 'moderate_deficit') {
    pressure += 0.08;
  }
  if (input.debtServicePressure === 'critical') {
    pressure += 0.22;
  } else if (input.debtServicePressure === 'elevated') {
    pressure += 0.11;
  }
  if (input.fiscalAnchorBreached) {
    pressure += 0.16;
  }
  if (input.debtIndexationInflationLatch) {
    pressure += 0.13;
  }
  if (input.fiscalPassThroughCascadeBand === 'runaway') {
    pressure += 0.21;
  } else if (input.fiscalPassThroughCascadeBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const fiscalIndex = finRound(100 + pressure * 15, 1);

  let breachBand: FiscalIndexationInflationAnchorBreachBand = 'anchored';
  if (pressure >= 0.54) breachBand = 'cascade';
  else if (pressure >= 0.34) breachBand = 'breached';
  else if (pressure >= 0.15) breachBand = 'strained';

  const inflationScoreNudge =
    breachBand === 'cascade'
      ? 0.09
      : breachBand === 'breached'
        ? 0.056
        : breachBand === 'strained'
          ? 0.026
          : 0;

  const narrative =
    breachBand === 'cascade' || breachBand === 'breached'
      ? 'Fiscal indexation anchor breach feeding indexed-charge CPI metadata.'
      : breachBand === 'strained'
        ? 'Debt indexation latch building fiscal pass-through pressure.'
        : 'Fiscal indexation anchor held versus headline CPI.';

  return { breachBand, fiscalIndex, inflationScoreNudge, narrative };
}

export function fiscalIndexationInflationAnchorBreachScoreAdjustment(
  band: FiscalIndexationInflationAnchorBreachBand,
): number {
  if (band === 'cascade') return 4;
  if (band === 'breached') return 3;
  if (band === 'strained') return 2;
  return 0;
}


// --- source: inflation/household-wage-inflation-deanchoring.ts ---

export type HouseholdWageInflationDeanchoringBand = 'anchored' | 'drifting' | 'deanchored' | 'spiral';

export interface HouseholdWageInflationDeanchoringAssessment {
  deanchoringBand: HouseholdWageInflationDeanchoringBand;
  householdIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Household wage growth and expectations de-anchoring (Agent 09). */
export function assessHouseholdWageInflationDeanchoring(input: {
  wageGrowthBand: 'subdued' | 'moderate' | 'elevated' | 'surge';
  costOfLivingStress: 'low' | 'moderate' | 'high' | 'extreme';
  householdExpectationsDeanchoring: boolean;
  wagePriceSpiralLatch: boolean;
  householdDeanchoringBand: 'anchored' | 'drifting' | 'unmoored';
  inflationBand: InflationConditionsBand;
  turn: number;
}): HouseholdWageInflationDeanchoringAssessment {
  let pressure = 0;
  if (input.wageGrowthBand === 'surge') {
    pressure += 0.24;
  } else if (input.wageGrowthBand === 'elevated') {
    pressure += 0.13;
  }
  if (input.costOfLivingStress === 'extreme') {
    pressure += 0.2;
  } else if (input.costOfLivingStress === 'high') {
    pressure += 0.1;
  }
  if (input.householdExpectationsDeanchoring) {
    pressure += 0.16;
  }
  if (input.wagePriceSpiralLatch) {
    pressure += 0.14;
  }
  if (input.householdDeanchoringBand === 'unmoored') {
    pressure += 0.22;
  } else if (input.householdDeanchoringBand === 'drifting') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const householdIndex = finRound(100 + pressure * 16, 1);

  let deanchoringBand: HouseholdWageInflationDeanchoringBand = 'anchored';
  if (pressure >= 0.56) deanchoringBand = 'spiral';
  else if (pressure >= 0.36) deanchoringBand = 'deanchored';
  else if (pressure >= 0.16) deanchoringBand = 'drifting';

  const inflationScoreNudge =
    deanchoringBand === 'spiral'
      ? 0.091
      : deanchoringBand === 'deanchored'
        ? 0.058
        : deanchoringBand === 'drifting'
          ? 0.027
          : 0;

  const narrative =
    deanchoringBand === 'spiral' || deanchoringBand === 'deanchored'
      ? 'Household wage expectations de-anchoring lifting CPI metadata.'
      : deanchoringBand === 'drifting'
        ? 'Wage-price spiral latch building under cost-of-living stress.'
        : 'Household wage inflation expectations anchored versus headline.';

  return { deanchoringBand, householdIndex, inflationScoreNudge, narrative };
}

export function householdWageInflationDeanchoringScoreAdjustment(
  band: HouseholdWageInflationDeanchoringBand,
): number {
  if (band === 'spiral') return 4;
  if (band === 'deanchored') return 3;
  if (band === 'drifting') return 2;
  return 0;
}


// --- source: inflation/corporate-markup-inflation-cascade.ts ---

export type CorporateMarkupInflationCascadeBand = 'absorbed' | 'partial' | 'active' | 'dominant';

export interface CorporateMarkupInflationCascadeAssessment {
  cascadeBand: CorporateMarkupInflationCascadeBand;
  markupIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Corporate pricing power and markup pass-through cascade (Agent 08). */
export function assessCorporateMarkupInflationCascade(input: {
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  passThroughIntent: 'absorb' | 'partial' | 'full';
  marginCompression: 'none' | 'mild' | 'severe';
  corporatePricingInflationLatch: boolean;
  markupPassThroughCascadeBand: 'absorbed' | 'partial' | 'full';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CorporateMarkupInflationCascadeAssessment {
  let pressure = 0;
  if (input.pricingPowerBand === 'dominant') {
    pressure += 0.24;
  } else if (input.pricingPowerBand === 'strong') {
    pressure += 0.14;
  }
  if (input.passThroughIntent === 'full') {
    pressure += 0.16;
  } else if (input.passThroughIntent === 'partial') {
    pressure += 0.08;
  }
  if (input.marginCompression === 'severe') {
    pressure -= 0.06;
  }
  if (input.corporatePricingInflationLatch) {
    pressure += 0.13;
  }
  if (input.markupPassThroughCascadeBand === 'full') {
    pressure += 0.2;
  } else if (input.markupPassThroughCascadeBand === 'partial') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const markupIndex = finRound(100 + pressure * 16, 1);

  let cascadeBand: CorporateMarkupInflationCascadeBand = 'absorbed';
  if (pressure >= 0.55) cascadeBand = 'dominant';
  else if (pressure >= 0.35) cascadeBand = 'active';
  else if (pressure >= 0.16) cascadeBand = 'partial';

  const inflationScoreNudge =
    cascadeBand === 'dominant'
      ? 0.09
      : cascadeBand === 'active'
        ? 0.056
        : cascadeBand === 'partial'
          ? 0.027
          : 0;

  const narrative =
    cascadeBand === 'dominant' || cascadeBand === 'active'
      ? 'Corporate markup cascade passing pricing power into CPI metadata.'
      : cascadeBand === 'partial'
        ? 'Corporate pricing inflation latch building markup pass-through.'
        : 'Corporate markup cascade absorbed versus headline CPI.';

  return { cascadeBand, markupIndex, inflationScoreNudge, narrative };
}

export function corporateMarkupInflationCascadeScoreAdjustment(band: CorporateMarkupInflationCascadeBand): number {
  if (band === 'dominant') return 4;
  if (band === 'active') return 3;
  if (band === 'partial') return 2;
  return 0;
}


// --- source: inflation/trade-tariff-import-inflation-pipeline.ts ---

export type TradeTariffImportInflationPipelineBand = 'anchored' | 'stressed' | 'fragile' | 'ruptured';

export interface TradeTariffImportInflationPipelineAssessment {
  pipelineBand: TradeTariffImportInflationPipelineBand;
  tradeIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Trade tariff and import pipeline inflation stress (Agent 15). */
export function assessTradeTariffImportInflationPipeline(input: {
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  commodityImportShare: number;
  importTariffInflationLatch: boolean;
  exchangePipelineStressBand: 'stable' | 'stressed' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TradeTariffImportInflationPipelineAssessment {
  let pressure = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') {
    pressure += 0.22;
  } else if (input.exchangeRatePressure === 'depreciation') {
    pressure += 0.12;
  }
  if (input.tradeOpennessBand === 'open') {
    pressure += finClamp(input.commodityImportShare, 0, 1) * 0.2;
  }
  if (input.importTariffInflationLatch) {
    pressure += 0.14;
  }
  if (input.exchangePipelineStressBand === 'ruptured') {
    pressure += 0.22;
  } else if (input.exchangePipelineStressBand === 'stressed') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const tradeIndex = finRound(100 + pressure * 15, 1);

  let pipelineBand: TradeTariffImportInflationPipelineBand = 'anchored';
  if (pressure >= 0.54) pipelineBand = 'ruptured';
  else if (pressure >= 0.34) pipelineBand = 'fragile';
  else if (pressure >= 0.15) pipelineBand = 'stressed';

  const inflationScoreNudge =
    pipelineBand === 'ruptured'
      ? 0.088
      : pipelineBand === 'fragile'
        ? 0.055
        : pipelineBand === 'stressed'
          ? 0.026
          : 0;

  const narrative =
    pipelineBand === 'ruptured' || pipelineBand === 'fragile'
      ? 'Trade tariff and import pipeline stress lifting CPI metadata.'
      : pipelineBand === 'stressed'
        ? 'Import tariff inflation latch building exchange pipeline pressure.'
        : 'Trade import pipeline anchored versus headline CPI.';

  return { pipelineBand, tradeIndex, inflationScoreNudge, narrative };
}

export function tradeTariffImportInflationPipelineScoreAdjustment(
  band: TradeTariffImportInflationPipelineBand,
): number {
  if (band === 'ruptured') return 4;
  if (band === 'fragile') return 3;
  if (band === 'stressed') return 2;
  return 0;
}


// --- source: inflation/metro-urban-rent-inflation-surge.ts ---

export type MetroUrbanRentInflationSurgeBand = 'subdued' | 'building' | 'surging' | 'critical';

export interface MetroUrbanRentInflationSurgeAssessment {
  surgeBand: MetroUrbanRentInflationSurgeBand;
  metroIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Metro urban rent and vacancy inflation surge (Agent 11). */
export function assessMetroUrbanRentInflationSurge(input: {
  vacancyBand: 'loose' | 'balanced' | 'tight' | 'critical';
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  urbanizationPressure: 'low' | 'medium' | 'high';
  urbanRentInflationLatch: boolean;
  metroDispersionStressBand: 'aligned' | 'widening' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MetroUrbanRentInflationSurgeAssessment {
  let pressure = 0;
  if (input.vacancyBand === 'critical') pressure += 0.22;
  else if (input.vacancyBand === 'tight') pressure += 0.11;
  if (input.rentGrowthBand === 'surging') pressure += 0.24;
  else if (input.rentGrowthBand === 'strong') pressure += 0.12;
  if (input.urbanizationPressure === 'high') pressure += 0.1;
  if (input.urbanRentInflationLatch) pressure += 0.13;
  if (input.metroDispersionStressBand === 'critical') pressure += 0.2;
  else if (input.metroDispersionStressBand === 'widening') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const metroIndex = finRound(100 + pressure * 16, 1);

  let surgeBand: MetroUrbanRentInflationSurgeBand = 'subdued';
  if (pressure >= 0.55) surgeBand = 'critical';
  else if (pressure >= 0.35) surgeBand = 'surging';
  else if (pressure >= 0.15) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'critical' ? 0.09 : surgeBand === 'surging' ? 0.057 : surgeBand === 'building' ? 0.027 : 0;

  const narrative =
    surgeBand === 'critical' || surgeBand === 'surging'
      ? 'Metro urban rent surge lifting shelter-side CPI metadata.'
      : surgeBand === 'building'
        ? 'Urban rent inflation latch building across vacancy bands.'
        : 'Metro rent surge subdued versus headline CPI.';

  return { surgeBand, metroIndex, inflationScoreNudge, narrative };
}

export function metroUrbanRentInflationSurgeScoreAdjustment(band: MetroUrbanRentInflationSurgeBand): number {
  if (band === 'critical') return 4;
  if (band === 'surging') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/wholesale-grid-energy-inflation-cascade.ts ---

export type WholesaleGridEnergyInflationCascadeBand = 'stable' | 'stressed' | 'fragile' | 'crisis';

export interface WholesaleGridEnergyInflationCascadeAssessment {
  cascadeBand: WholesaleGridEnergyInflationCascadeBand;
  energyIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Wholesale grid and tariff energy inflation cascade (Agent 13). */
export function assessWholesaleGridEnergyInflationCascade(input: {
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  retailTariffShock: boolean;
  gridReliabilityBand: 'stable' | 'strained' | 'fragile';
  gridTariffInflationLatch: boolean;
  wholesaleStressCascadeBand: 'stable' | 'stressed' | 'cascade';
  inflationBand: InflationConditionsBand;
  turn: number;
}): WholesaleGridEnergyInflationCascadeAssessment {
  let pressure = 0;
  if (input.wholesaleEnergyStress === 'crisis') pressure += 0.24;
  else if (input.wholesaleEnergyStress === 'severe') pressure += 0.14;
  else if (input.wholesaleEnergyStress === 'elevated') pressure += 0.07;
  if (input.retailTariffShock) pressure += 0.14;
  if (input.gridReliabilityBand === 'fragile') pressure += 0.12;
  else if (input.gridReliabilityBand === 'strained') pressure += 0.06;
  if (input.gridTariffInflationLatch) pressure += 0.13;
  if (input.wholesaleStressCascadeBand === 'cascade') pressure += 0.21;
  else if (input.wholesaleStressCascadeBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const energyIndex = finRound(100 + pressure * 15, 1);

  let cascadeBand: WholesaleGridEnergyInflationCascadeBand = 'stable';
  if (pressure >= 0.54) cascadeBand = 'crisis';
  else if (pressure >= 0.34) cascadeBand = 'fragile';
  else if (pressure >= 0.15) cascadeBand = 'stressed';

  const inflationScoreNudge =
    cascadeBand === 'crisis' ? 0.088 : cascadeBand === 'fragile' ? 0.055 : cascadeBand === 'stressed' ? 0.026 : 0;

  const narrative =
    cascadeBand === 'crisis' || cascadeBand === 'fragile'
      ? 'Wholesale grid energy cascade passing into utility CPI metadata.'
      : cascadeBand === 'stressed'
        ? 'Grid tariff inflation latch building under wholesale stress.'
        : 'Wholesale grid cascade stable versus headline CPI.';

  return { cascadeBand, energyIndex, inflationScoreNudge, narrative };
}

export function wholesaleGridEnergyInflationCascadeScoreAdjustment(band: WholesaleGridEnergyInflationCascadeBand): number {
  if (band === 'crisis') return 4;
  if (band === 'fragile') return 3;
  if (band === 'stressed') return 2;
  return 0;
}


// --- source: inflation/guardian-guardrail-inflation-escalation.ts ---

export type GuardianGuardrailInflationEscalationBand = 'calm' | 'elevated' | 'urgent' | 'critical';

export interface GuardianGuardrailInflationEscalationAssessment {
  escalationBand: GuardianGuardrailInflationEscalationBand;
  guardrailIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Guardian guardrail and co-pilot inflation escalation (Agent 16). */
export function assessGuardianGuardrailInflationEscalation(input: {
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  narrativeShockSeverity: 'low' | 'medium' | 'high';
  guardrailInflationLatch: boolean;
  copilotEscalationBand: 'calm' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): GuardianGuardrailInflationEscalationAssessment {
  let pressure = 0;
  if (input.inflationGuardrailTripped) pressure += 0.2;
  if (input.stabilityInterventionBand === 'urgent') pressure += 0.18;
  else if (input.stabilityInterventionBand === 'advisory') pressure += 0.08;
  if (input.narrativeShockSeverity === 'high') pressure += 0.14;
  else if (input.narrativeShockSeverity === 'medium') pressure += 0.07;
  if (input.guardrailInflationLatch) pressure += 0.13;
  if (input.copilotEscalationBand === 'critical') pressure += 0.22;
  else if (input.copilotEscalationBand === 'elevated') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const guardrailIndex = finRound(100 + pressure * 15, 1);

  let escalationBand: GuardianGuardrailInflationEscalationBand = 'calm';
  if (pressure >= 0.55) escalationBand = 'critical';
  else if (pressure >= 0.35) escalationBand = 'urgent';
  else if (pressure >= 0.15) escalationBand = 'elevated';

  const inflationScoreNudge =
    escalationBand === 'critical'
      ? 0.09
      : escalationBand === 'urgent'
        ? 0.056
        : escalationBand === 'elevated'
          ? 0.027
          : 0;

  const narrative =
    escalationBand === 'critical' || escalationBand === 'urgent'
      ? 'Guardian guardrail escalation feeding CPI metadata alerts.'
      : escalationBand === 'elevated'
        ? 'Co-pilot inflation latch building under guardrail trip.'
        : 'Guardian inflation escalation calm versus headline CPI.';

  return { escalationBand, guardrailIndex, inflationScoreNudge, narrative };
}

export function guardianGuardrailInflationEscalationScoreAdjustment(
  band: GuardianGuardrailInflationEscalationBand,
): number {
  if (band === 'critical') return 4;
  if (band === 'urgent') return 3;
  if (band === 'elevated') return 2;
  return 0;
}


// --- source: inflation/team-consensus-inflation-briefing-drift.ts ---

export type TeamConsensusInflationBriefingDriftBand = 'anchored' | 'drifting' | 'deanchored' | 'consensus_shock';

export interface TeamConsensusInflationBriefingDriftAssessment {
  driftBand: TeamConsensusInflationBriefingDriftBand;
  briefingIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Team consensus and briefing inflation drift (Agent 18). */
export function assessTeamConsensusInflationBriefingDrift(input: {
  consensusInflationOutlook: 'disinflation' | 'stable' | 'reacceleration' | 'upside_risk';
  briefingUrgencyBand: 'routine' | 'elevated' | 'critical';
  crossDomainStressScore: number;
  teamBriefingInflationLatch: boolean;
  consensusDriftBand: 'anchored' | 'drifting' | 'unmoored';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TeamConsensusInflationBriefingDriftAssessment {
  let pressure = 0;
  if (input.consensusInflationOutlook === 'upside_risk') pressure += 0.22;
  else if (input.consensusInflationOutlook === 'reacceleration') pressure += 0.12;
  if (input.briefingUrgencyBand === 'critical') pressure += 0.18;
  else if (input.briefingUrgencyBand === 'elevated') pressure += 0.09;
  pressure += finClamp(input.crossDomainStressScore, 0, 1) * 0.2;
  if (input.teamBriefingInflationLatch) pressure += 0.13;
  if (input.consensusDriftBand === 'unmoored') pressure += 0.21;
  else if (input.consensusDriftBand === 'drifting') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const briefingIndex = finRound(100 + pressure * 16, 1);

  let driftBand: TeamConsensusInflationBriefingDriftBand = 'anchored';
  if (pressure >= 0.56) driftBand = 'consensus_shock';
  else if (pressure >= 0.36) driftBand = 'deanchored';
  else if (pressure >= 0.16) driftBand = 'drifting';

  const inflationScoreNudge =
    driftBand === 'consensus_shock'
      ? 0.091
      : driftBand === 'deanchored'
        ? 0.058
        : driftBand === 'drifting'
          ? 0.027
          : 0;

  const narrative =
    driftBand === 'consensus_shock' || driftBand === 'deanchored'
      ? 'Team briefing consensus drifting higher in CPI metadata.'
      : driftBand === 'drifting'
        ? 'Briefing inflation latch building under cross-domain stress.'
        : 'Team consensus inflation briefing anchored versus headline.';

  return { driftBand, briefingIndex, inflationScoreNudge, narrative };
}

export function teamConsensusInflationBriefingDriftScoreAdjustment(
  band: TeamConsensusInflationBriefingDriftBand,
): number {
  if (band === 'consensus_shock') return 4;
  if (band === 'deanchored') return 3;
  if (band === 'drifting') return 2;
  return 0;
}


// --- source: inflation/memory-commonwealth-inflation-recall-gate.ts ---

export type MemoryCommonwealthInflationRecallGateBand =
  | 'anchored'
  | 'stressed'
  | 'breached'
  | 'commonwealth_shock';

export interface MemoryCommonwealthInflationRecallGateAssessment {
  gateBand: MemoryCommonwealthInflationRecallGateBand;
  recallIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** AI memory commonwealth inflation recall gate (Agent 19). */
export function assessMemoryCommonwealthInflationRecallGate(input: {
  recalledInflationRegimeConfidence: number;
  narrativeDriftTowardHigherInflation: boolean;
  explainabilityAlertActive: boolean;
  memoryCommonwealthInflationLatch: boolean;
  realmRecallGateBand: 'sealed' | 'opening' | 'breached';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MemoryCommonwealthInflationRecallGateAssessment {
  let pressure = 0;
  if (input.narrativeDriftTowardHigherInflation) pressure += 0.16;
  if (input.explainabilityAlertActive) pressure += 0.1;
  pressure += finClamp(input.recalledInflationRegimeConfidence, 0, 1) * 0.22;
  if (input.memoryCommonwealthInflationLatch) pressure += 0.14;
  if (input.realmRecallGateBand === 'breached') pressure += 0.24;
  else if (input.realmRecallGateBand === 'opening') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0034, 0, 1.05);
  const recallIndex = finRound(100 + pressure * 17, 1);

  let gateBand: MemoryCommonwealthInflationRecallGateBand = 'anchored';
  if (pressure >= 0.57) gateBand = 'commonwealth_shock';
  else if (pressure >= 0.38) gateBand = 'breached';
  else if (pressure >= 0.17) gateBand = 'stressed';

  const inflationScoreNudge =
    gateBand === 'commonwealth_shock'
      ? 0.092
      : gateBand === 'breached'
        ? 0.059
        : gateBand === 'stressed'
          ? 0.028
          : 0;

  const narrative =
    gateBand === 'commonwealth_shock' || gateBand === 'breached'
      ? 'Commonwealth memory recall gate feeding CPI metadata alerts.'
      : gateBand === 'stressed'
        ? 'Realm recall latch building under explainability drift.'
        : 'Memory commonwealth inflation recall gate calm versus headline CPI.';

  return { gateBand, recallIndex, inflationScoreNudge, narrative };
}

export function memoryCommonwealthInflationRecallGateScoreAdjustment(
  band: MemoryCommonwealthInflationRecallGateBand,
): number {
  if (band === 'commonwealth_shock') return 4;
  if (band === 'breached') return 3;
  if (band === 'stressed') return 2;
  return 0;
}


// --- source: inflation/automation-synthesis-inflation-cascade-drift.ts ---

export type AutomationSynthesisInflationCascadeDriftBand =
  | 'neutral'
  | 'drifting'
  | 'stacking'
  | 'runaway';

export interface AutomationSynthesisInflationCascadeDriftAssessment {
  driftBand: AutomationSynthesisInflationCascadeDriftBand;
  synthesisIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Idle automation synthesis inflation cascade drift (Agent 20). */
export function assessAutomationSynthesisInflationCascadeDrift(input: {
  macroAutopilotInflationBias: 'deflate' | 'neutral' | 'inflate';
  unattendedShockDriftActive: boolean;
  automationConfidenceScore: number;
  synthesisAutopilotInflationLatch: boolean;
  cascadeStackDriftBand: 'stable' | 'stacking' | 'runaway';
  inflationBand: InflationConditionsBand;
  turn: number;
}): AutomationSynthesisInflationCascadeDriftAssessment {
  let pressure = 0;
  if (input.macroAutopilotInflationBias === 'inflate') pressure += 0.18;
  if (input.unattendedShockDriftActive) pressure += 0.14;
  if (input.automationConfidenceScore < 0.4) pressure += 0.12;
  else if (input.automationConfidenceScore < 0.55) pressure += 0.06;
  if (input.synthesisAutopilotInflationLatch) pressure += 0.13;
  if (input.cascadeStackDriftBand === 'runaway') pressure += 0.23;
  else if (input.cascadeStackDriftBand === 'stacking') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const synthesisIndex = finRound(100 + pressure * 16, 1);

  let driftBand: AutomationSynthesisInflationCascadeDriftBand = 'neutral';
  if (pressure >= 0.56) driftBand = 'runaway';
  else if (pressure >= 0.36) driftBand = 'stacking';
  else if (pressure >= 0.15) driftBand = 'drifting';

  const inflationScoreNudge =
    driftBand === 'runaway'
      ? 0.09
      : driftBand === 'stacking'
        ? 0.057
        : driftBand === 'drifting'
          ? 0.026
          : 0;

  const narrative =
    driftBand === 'runaway' || driftBand === 'stacking'
      ? 'Automation synthesis cascade stacking higher in CPI metadata.'
      : driftBand === 'drifting'
        ? 'Autopilot inflation latch building under unattended shock drift.'
        : 'Automation synthesis inflation cascade drift neutral versus headline.';

  return { driftBand, synthesisIndex, inflationScoreNudge, narrative };
}

export function automationSynthesisInflationCascadeDriftScoreAdjustment(
  band: AutomationSynthesisInflationCascadeDriftBand,
): number {
  if (band === 'runaway') return 4;
  if (band === 'stacking') return 3;
  if (band === 'drifting') return 2;
  return 0;
}


// --- source: inflation/ui-shell-inflation-salience-escalation.ts ---

export type UiShellInflationSalienceEscalationBand = 'muted' | 'building' | 'sharp' | 'shell_critical';

export interface UiShellInflationSalienceEscalationAssessment {
  escalationBand: UiShellInflationSalienceEscalationBand;
  salienceIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** UI shell player inflation salience escalation (Agent 22). */
export function assessUiShellInflationSalienceEscalation(input: {
  inflationDashboardStressHighlight: boolean;
  playerAttentionOnCostOfLiving: 'low' | 'medium' | 'high';
  uiNudgeInflationExpectationsUp: boolean;
  wave35SalienceEscalationLatch: boolean;
  shellExpectationsEscalationBand: 'muted' | 'building' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): UiShellInflationSalienceEscalationAssessment {
  let pressure = 0;
  if (input.inflationDashboardStressHighlight) pressure += 0.12;
  if (input.playerAttentionOnCostOfLiving === 'high') pressure += 0.2;
  else if (input.playerAttentionOnCostOfLiving === 'medium') pressure += 0.08;
  if (input.uiNudgeInflationExpectationsUp) pressure += 0.14;
  if (input.wave35SalienceEscalationLatch) pressure += 0.13;
  if (input.shellExpectationsEscalationBand === 'critical') pressure += 0.22;
  else if (input.shellExpectationsEscalationBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const salienceIndex = finRound(100 + pressure * 16, 1);

  let escalationBand: UiShellInflationSalienceEscalationBand = 'muted';
  if (pressure >= 0.56) escalationBand = 'shell_critical';
  else if (pressure >= 0.36) escalationBand = 'sharp';
  else if (pressure >= 0.16) escalationBand = 'building';

  const inflationScoreNudge =
    escalationBand === 'shell_critical'
      ? 0.09
      : escalationBand === 'sharp'
        ? 0.057
        : escalationBand === 'building'
          ? 0.026
          : 0;

  const narrative =
    escalationBand === 'shell_critical' || escalationBand === 'sharp'
      ? 'UI shell salience escalation feeding CPI player-expectations metadata.'
      : escalationBand === 'building'
        ? 'Phase-shell inflation latch building under dashboard stress.'
        : 'UI shell inflation salience muted versus headline CPI.';

  return { escalationBand, salienceIndex, inflationScoreNudge, narrative };
}

export function uiShellInflationSalienceEscalationScoreAdjustment(
  band: UiShellInflationSalienceEscalationBand,
): number {
  if (band === 'shell_critical') return 4;
  if (band === 'sharp') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/dashboard-heatmap-inflation-overlay-cascade.ts ---

export type DashboardHeatmapInflationOverlayCascadeBand =
  | 'routine'
  | 'widening'
  | 'critical'
  | 'overlay_cascade';

export interface DashboardHeatmapInflationOverlayCascadeAssessment {
  cascadeBand: DashboardHeatmapInflationOverlayCascadeBand;
  overlayIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Dashboard regional heatmap inflation overlay cascade (Agent 23). */
export function assessDashboardHeatmapInflationOverlayCascade(input: {
  regionalHeatmapInflationAlert: boolean;
  mapLayerCostPressureScore: number;
  dashboardRefreshUrgency: 'routine' | 'elevated' | 'critical';
  regionalInflationOverlayLatch: boolean;
  heatmapOverlayCascadeBand: 'routine' | 'widening' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): DashboardHeatmapInflationOverlayCascadeAssessment {
  let pressure = 0;
  if (input.regionalHeatmapInflationAlert) pressure += 0.18;
  pressure += finClamp(input.mapLayerCostPressureScore, 0, 1) * 0.22;
  if (input.dashboardRefreshUrgency === 'critical') pressure += 0.2;
  else if (input.dashboardRefreshUrgency === 'elevated') pressure += 0.1;
  if (input.regionalInflationOverlayLatch) pressure += 0.12;
  if (input.heatmapOverlayCascadeBand === 'critical') pressure += 0.21;
  else if (input.heatmapOverlayCascadeBand === 'widening') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const overlayIndex = finRound(100 + pressure * 17, 1);

  let cascadeBand: DashboardHeatmapInflationOverlayCascadeBand = 'routine';
  if (pressure >= 0.58) cascadeBand = 'overlay_cascade';
  else if (pressure >= 0.39) cascadeBand = 'critical';
  else if (pressure >= 0.18) cascadeBand = 'widening';

  const inflationScoreNudge =
    cascadeBand === 'overlay_cascade'
      ? 0.091
      : cascadeBand === 'critical'
        ? 0.058
        : cascadeBand === 'widening'
          ? 0.027
          : 0;

  const narrative =
    cascadeBand === 'overlay_cascade' || cascadeBand === 'critical'
      ? 'Regional heatmap overlay cascade elevating CPI map-layer metadata.'
      : cascadeBand === 'widening'
        ? 'Dashboard refresh urgency building inflation overlay latch.'
        : 'Heatmap inflation overlay routine versus headline CPI.';

  return { cascadeBand, overlayIndex, inflationScoreNudge, narrative };
}

export function dashboardHeatmapInflationOverlayCascadeScoreAdjustment(
  band: DashboardHeatmapInflationOverlayCascadeBand,
): number {
  if (band === 'overlay_cascade') return 4;
  if (band === 'critical') return 3;
  if (band === 'widening') return 2;
  return 0;
}


// --- source: inflation/command-center-inflation-fusion-latch.ts ---

export type CommandCenterInflationFusionLatchBand = 'stable' | 'elevated' | 'critical' | 'fusion_runaway';

export interface CommandCenterInflationFusionLatchAssessment {
  latchBand: CommandCenterInflationFusionLatchBand;
  fusionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Command center macro inflation fusion latch escalation (Agent 17). */
export function assessCommandCenterInflationFusionLatch(input: {
  macroAlertLevel: 'green' | 'amber' | 'red';
  inflationFusionScore: number;
  coordinatedTighteningSuggested: boolean;
  wave36FusionLatch: boolean;
  commandInflationEscalationBand: 'stable' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CommandCenterInflationFusionLatchAssessment {
  let pressure = 0;
  if (input.macroAlertLevel === 'red') pressure += 0.22;
  else if (input.macroAlertLevel === 'amber') pressure += 0.1;
  pressure += finClamp(input.inflationFusionScore, 0, 1) * 0.24;
  if (input.coordinatedTighteningSuggested) pressure += 0.08;
  if (input.wave36FusionLatch) pressure += 0.14;
  if (input.commandInflationEscalationBand === 'critical') pressure += 0.2;
  else if (input.commandInflationEscalationBand === 'elevated') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const fusionIndex = finRound(100 + pressure * 17, 1);

  let latchBand: CommandCenterInflationFusionLatchBand = 'stable';
  if (pressure >= 0.58) latchBand = 'fusion_runaway';
  else if (pressure >= 0.39) latchBand = 'critical';
  else if (pressure >= 0.18) latchBand = 'elevated';

  const inflationScoreNudge =
    latchBand === 'fusion_runaway'
      ? 0.093
      : latchBand === 'critical'
        ? 0.059
        : latchBand === 'elevated'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'fusion_runaway' || latchBand === 'critical'
      ? 'Command fusion latch escalation feeding CPI macro-alert metadata.'
      : latchBand === 'elevated'
        ? 'Coordinated tightening suggestion building fusion inflation latch.'
        : 'Command center fusion latch stable versus headline CPI.';

  return { latchBand, fusionIndex, inflationScoreNudge, narrative };
}

export function commandCenterInflationFusionLatchScoreAdjustment(
  band: CommandCenterInflationFusionLatchBand,
): number {
  if (band === 'fusion_runaway') return 4;
  if (band === 'critical') return 3;
  if (band === 'elevated') return 2;
  return 0;
}


// --- source: inflation/transport-freight-inflation-congestion-cascade.ts ---

export type TransportFreightInflationCongestionCascadeBand =
  | 'clear'
  | 'building'
  | 'gridlocked'
  | 'logistics_rupture';

export interface TransportFreightInflationCongestionCascadeAssessment {
  cascadeBand: TransportFreightInflationCongestionCascadeBand;
  congestionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Transport freight inflation congestion cascade (Agent 12). */
export function assessTransportFreightInflationCongestionCascade(input: {
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  portBacklogBand: 'clear' | 'moderate' | 'severe';
  wave36LogisticsInflationLatch: boolean;
  freightCascadeCongestionBand: 'clear' | 'building' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TransportFreightInflationCongestionCascadeAssessment {
  let pressure = 0;
  if (input.freightCapacityBand === 'critical') pressure += 0.24;
  else if (input.freightCapacityBand === 'tight') pressure += 0.14;
  if (input.fuelSurchargeActive) pressure += 0.12;
  if (input.portBacklogBand === 'severe') pressure += 0.18;
  else if (input.portBacklogBand === 'moderate') pressure += 0.08;
  if (input.wave36LogisticsInflationLatch) pressure += 0.13;
  if (input.freightCascadeCongestionBand === 'ruptured') pressure += 0.22;
  else if (input.freightCascadeCongestionBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const congestionIndex = finRound(100 + pressure * 16, 1);

  let cascadeBand: TransportFreightInflationCongestionCascadeBand = 'clear';
  if (pressure >= 0.57) cascadeBand = 'logistics_rupture';
  else if (pressure >= 0.38) cascadeBand = 'gridlocked';
  else if (pressure >= 0.17) cascadeBand = 'building';

  const inflationScoreNudge =
    cascadeBand === 'logistics_rupture'
      ? 0.091
      : cascadeBand === 'gridlocked'
        ? 0.058
        : cascadeBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    cascadeBand === 'logistics_rupture' || cascadeBand === 'gridlocked'
      ? 'Freight congestion cascade elevating CPI logistics metadata.'
      : cascadeBand === 'building'
        ? 'Port backlog building logistics inflation latch.'
        : 'Transport freight congestion clear versus headline CPI.';

  return { cascadeBand, congestionIndex, inflationScoreNudge, narrative };
}

export function transportFreightInflationCongestionCascadeScoreAdjustment(
  band: TransportFreightInflationCongestionCascadeBand,
): number {
  if (band === 'logistics_rupture') return 4;
  if (band === 'gridlocked') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/events-staged-inflation-shock-persistence.ts ---

export type EventsStagedInflationShockPersistenceBand =
  | 'muted'
  | 'building'
  | 'entrenched'
  | 'narrative_cascade';

export interface EventsStagedInflationShockPersistenceAssessment {
  persistenceBand: EventsStagedInflationShockPersistenceBand;
  shockIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Staged dynamic events inflation shock persistence (Agent 05). */
export function assessEventsStagedInflationShockPersistence(input: {
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  confidenceShockBand: 'calm' | 'uneasy' | 'severe';
  wave37EventInflationLatch: boolean;
  stagedShockPersistenceBand: 'none' | 'building' | 'entrenched';
  inflationBand: InflationConditionsBand;
  turn: number;
}): EventsStagedInflationShockPersistenceAssessment {
  let pressure = 0;
  if (input.inflationShockEventActive) pressure += 0.2;
  if (input.supplyDisruptionSeverity === 'national') pressure += 0.18;
  else if (input.supplyDisruptionSeverity === 'localized') pressure += 0.09;
  if (input.confidenceShockBand === 'severe') pressure += 0.16;
  else if (input.confidenceShockBand === 'uneasy') pressure += 0.08;
  if (input.wave37EventInflationLatch) pressure += 0.12;
  if (input.stagedShockPersistenceBand === 'entrenched') pressure += 0.22;
  else if (input.stagedShockPersistenceBand === 'building') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const shockIndex = finRound(100 + pressure * 17, 1);

  let persistenceBand: EventsStagedInflationShockPersistenceBand = 'muted';
  if (pressure >= 0.58) persistenceBand = 'narrative_cascade';
  else if (pressure >= 0.38) persistenceBand = 'entrenched';
  else if (pressure >= 0.17) persistenceBand = 'building';

  const inflationScoreNudge =
    persistenceBand === 'narrative_cascade'
      ? 0.092
      : persistenceBand === 'entrenched'
        ? 0.058
        : persistenceBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    persistenceBand === 'narrative_cascade' || persistenceBand === 'entrenched'
      ? 'Staged event shock persistence feeding CPI narrative metadata.'
      : persistenceBand === 'building'
        ? 'Dynamic event inflation latch building under supply disruption.'
        : 'Events shock persistence muted versus headline CPI.';

  return { persistenceBand, shockIndex, inflationScoreNudge, narrative };
}

export function eventsStagedInflationShockPersistenceScoreAdjustment(
  band: EventsStagedInflationShockPersistenceBand,
): number {
  if (band === 'narrative_cascade') return 4;
  if (band === 'entrenched') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/modes-sandbox-inflation-stress-cascade.ts ---

export type ModesSandboxInflationStressCascadeBand = 'routine' | 'stressed' | 'extreme' | 'bias_runaway';

export interface ModesSandboxInflationStressCascadeAssessment {
  cascadeBand: ModesSandboxInflationStressCascadeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Modes sandbox inflation stress cascade (Agent 04). */
export function assessModesSandboxInflationStressCascade(input: {
  scenarioInflationBias: 'disinflationary' | 'neutral' | 'inflationary' | 'extreme';
  sandboxStressModeActive: boolean;
  difficultyCostMultiplier: number;
  wave37SandboxInflationLatch: boolean;
  scenarioBiasCascadeBand: 'routine' | 'stressed' | 'runaway';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ModesSandboxInflationStressCascadeAssessment {
  let pressure = 0;
  if (input.scenarioInflationBias === 'extreme') pressure += 0.24;
  else if (input.scenarioInflationBias === 'inflationary') pressure += 0.14;
  if (input.sandboxStressModeActive) pressure += 0.12;
  pressure += finClamp(input.difficultyCostMultiplier - 1, 0, 0.25) * 0.4;
  if (input.wave37SandboxInflationLatch) pressure += 0.13;
  if (input.scenarioBiasCascadeBand === 'runaway') pressure += 0.21;
  else if (input.scenarioBiasCascadeBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 16, 1);

  let cascadeBand: ModesSandboxInflationStressCascadeBand = 'routine';
  if (pressure >= 0.57) cascadeBand = 'bias_runaway';
  else if (pressure >= 0.38) cascadeBand = 'extreme';
  else if (pressure >= 0.17) cascadeBand = 'stressed';

  const inflationScoreNudge =
    cascadeBand === 'bias_runaway'
      ? 0.09
      : cascadeBand === 'extreme'
        ? 0.057
        : cascadeBand === 'stressed'
          ? 0.026
          : 0;

  const narrative =
    cascadeBand === 'bias_runaway' || cascadeBand === 'extreme'
      ? 'Sandbox stress cascade elevating CPI scenario-bias metadata.'
      : cascadeBand === 'stressed'
        ? 'Difficulty inflation latch building under sandbox stress.'
        : 'Modes sandbox inflation stress routine versus headline CPI.';

  return { cascadeBand, stressIndex, inflationScoreNudge, narrative };
}

export function modesSandboxInflationStressCascadeScoreAdjustment(
  band: ModesSandboxInflationStressCascadeBand,
): number {
  if (band === 'bias_runaway') return 4;
  if (band === 'extreme') return 3;
  if (band === 'stressed') return 2;
  return 0;
}


// --- source: inflation/fiscal-appropriation-inflation-pressure-latch.ts ---

export type FiscalAppropriationInflationPressureLatchBand = 'stable' | 'elevated' | 'critical' | 'appropriation_runaway';

export interface FiscalAppropriationInflationPressureLatchAssessment {
  latchBand: FiscalAppropriationInflationPressureLatchBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Fiscal appropriation inflation pressure latch (Agent 07). */
export function assessFiscalAppropriationInflationPressureLatch(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  wave38AppropriationInflationLatch: boolean;
  fiscalPressureEscalationBand: 'stable' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): FiscalAppropriationInflationPressureLatchAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') pressure += 0.22;
  else if (input.consolidatedDeficitBand === 'moderate_deficit') pressure += 0.1;
  if (input.debtServicePressure === 'critical') pressure += 0.2;
  else if (input.debtServicePressure === 'elevated') pressure += 0.1;
  if (input.wave38AppropriationInflationLatch) pressure += 0.14;
  if (input.fiscalPressureEscalationBand === 'critical') pressure += 0.21;
  else if (input.fiscalPressureEscalationBand === 'elevated') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 17, 1);

  let latchBand: FiscalAppropriationInflationPressureLatchBand = 'stable';
  if (pressure >= 0.58) latchBand = 'appropriation_runaway';
  else if (pressure >= 0.39) latchBand = 'critical';
  else if (pressure >= 0.18) latchBand = 'elevated';

  const inflationScoreNudge =
    latchBand === 'appropriation_runaway'
      ? 0.093
      : latchBand === 'critical'
        ? 0.059
        : latchBand === 'elevated'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'appropriation_runaway' || latchBand === 'critical'
      ? 'Fiscal appropriation latch elevating CPI debt-service metadata.'
      : latchBand === 'elevated'
        ? 'Deficit pressure building appropriation inflation latch.'
        : 'Fiscal appropriation pressure stable versus headline CPI.';

  return { latchBand, pressureIndex, inflationScoreNudge, narrative };
}

export function fiscalAppropriationInflationPressureLatchScoreAdjustment(
  band: FiscalAppropriationInflationPressureLatchBand,
): number {
  if (band === 'appropriation_runaway') return 4;
  if (band === 'critical') return 3;
  if (band === 'elevated') return 2;
  return 0;
}


// --- source: inflation/household-budget-inflation-stress-cascade.ts ---

export type HouseholdBudgetInflationStressCascadeBand = 'contained' | 'building' | 'ruptured' | 'budget_collapse';

export interface HouseholdBudgetInflationStressCascadeAssessment {
  cascadeBand: HouseholdBudgetInflationStressCascadeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Household budget inflation stress cascade (Agent 09). */
export function assessHouseholdBudgetInflationStressCascade(input: {
  wageGrowthBand: 'subdued' | 'moderate' | 'elevated' | 'surge';
  costOfLivingStress: 'low' | 'moderate' | 'high' | 'extreme';
  wave38BudgetInflationLatch: boolean;
  householdStressCascadeBand: 'contained' | 'building' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): HouseholdBudgetInflationStressCascadeAssessment {
  let pressure = 0;
  if (input.wageGrowthBand === 'surge') pressure += 0.2;
  else if (input.wageGrowthBand === 'elevated') pressure += 0.11;
  if (input.costOfLivingStress === 'extreme') pressure += 0.22;
  else if (input.costOfLivingStress === 'high') pressure += 0.12;
  if (input.wave38BudgetInflationLatch) pressure += 0.13;
  if (input.householdStressCascadeBand === 'ruptured') pressure += 0.21;
  else if (input.householdStressCascadeBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 16, 1);

  let cascadeBand: HouseholdBudgetInflationStressCascadeBand = 'contained';
  if (pressure >= 0.57) cascadeBand = 'budget_collapse';
  else if (pressure >= 0.38) cascadeBand = 'ruptured';
  else if (pressure >= 0.17) cascadeBand = 'building';

  const inflationScoreNudge =
    cascadeBand === 'budget_collapse'
      ? 0.091
      : cascadeBand === 'ruptured'
        ? 0.058
        : cascadeBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    cascadeBand === 'budget_collapse' || cascadeBand === 'ruptured'
      ? 'Household budget stress cascade feeding CPI wage-cost metadata.'
      : cascadeBand === 'building'
        ? 'Cost-of-living latch building under wage growth stress.'
        : 'Household budget inflation stress contained versus headline CPI.';

  return { cascadeBand, stressIndex, inflationScoreNudge, narrative };
}

export function householdBudgetInflationStressCascadeScoreAdjustment(
  band: HouseholdBudgetInflationStressCascadeBand,
): number {
  if (band === 'budget_collapse') return 4;
  if (band === 'ruptured') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/corporate-survival-pricing-inflation-latch.ts ---

export type CorporateSurvivalPricingInflationLatchBand = 'contained' | 'building' | 'dominant' | 'survival_runaway';

export interface CorporateSurvivalPricingInflationLatchAssessment {
  latchBand: CorporateSurvivalPricingInflationLatchBand;
  pricingIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Corporate survival pricing inflation latch (Agent 08). */
export function assessCorporateSurvivalPricingInflationLatch(input: {
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  passThroughIntent: 'absorb' | 'partial' | 'full';
  marginCompression: 'none' | 'mild' | 'severe';
  wave39SurvivalPricingLatch: boolean;
  corporateMarkupEscalationBand: 'contained' | 'building' | 'dominant';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CorporateSurvivalPricingInflationLatchAssessment {
  let pressure = 0;
  if (input.pricingPowerBand === 'dominant') pressure += 0.22;
  else if (input.pricingPowerBand === 'strong') pressure += 0.12;
  if (input.passThroughIntent === 'full') pressure += 0.16;
  else if (input.passThroughIntent === 'partial') pressure += 0.08;
  if (input.marginCompression === 'severe') pressure += 0.1;
  if (input.wave39SurvivalPricingLatch) pressure += 0.13;
  if (input.corporateMarkupEscalationBand === 'dominant') pressure += 0.2;
  else if (input.corporateMarkupEscalationBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const pricingIndex = finRound(100 + pressure * 17, 1);

  let latchBand: CorporateSurvivalPricingInflationLatchBand = 'contained';
  if (pressure >= 0.58) latchBand = 'survival_runaway';
  else if (pressure >= 0.39) latchBand = 'dominant';
  else if (pressure >= 0.18) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'survival_runaway'
      ? 0.094
      : latchBand === 'dominant'
        ? 0.06
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'survival_runaway' || latchBand === 'dominant'
      ? 'Corporate survival pricing latch elevating CPI markup metadata.'
      : latchBand === 'building'
        ? 'Pass-through intent building markup escalation band.'
        : 'Corporate pricing latch contained versus headline CPI.';

  return { latchBand, pricingIndex, inflationScoreNudge, narrative };
}

export function corporateSurvivalPricingInflationLatchScoreAdjustment(
  band: CorporateSurvivalPricingInflationLatchBand,
): number {
  if (band === 'survival_runaway') return 4;
  if (band === 'dominant') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/trade-tariff-exchange-inflation-escalation.ts ---

export type TradeTariffExchangeInflationEscalationBand = 'stable' | 'stressed' | 'ruptured' | 'exchange_crisis';

export interface TradeTariffExchangeInflationEscalationAssessment {
  escalationBand: TradeTariffExchangeInflationEscalationBand;
  exchangeIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Trade tariff and exchange inflation escalation (Agent 15). */
export function assessTradeTariffExchangeInflationEscalation(input: {
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  commodityImportShare: number;
  wave39TariffExchangeLatch: boolean;
  importExchangeEscalationBand: 'stable' | 'stressed' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TradeTariffExchangeInflationEscalationAssessment {
  let pressure = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') pressure += 0.24;
  else if (input.exchangeRatePressure === 'depreciation') pressure += 0.12;
  if (input.tradeOpennessBand === 'open') pressure += 0.1;
  pressure += finClamp(input.commodityImportShare, 0, 1) * 0.18;
  if (input.wave39TariffExchangeLatch) pressure += 0.12;
  if (input.importExchangeEscalationBand === 'ruptured') pressure += 0.21;
  else if (input.importExchangeEscalationBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const exchangeIndex = finRound(100 + pressure * 16, 1);

  let escalationBand: TradeTariffExchangeInflationEscalationBand = 'stable';
  if (pressure >= 0.57) escalationBand = 'exchange_crisis';
  else if (pressure >= 0.38) escalationBand = 'ruptured';
  else if (pressure >= 0.17) escalationBand = 'stressed';

  const inflationScoreNudge =
    escalationBand === 'exchange_crisis'
      ? 0.092
      : escalationBand === 'ruptured'
        ? 0.059
        : escalationBand === 'stressed'
          ? 0.027
          : 0;

  const narrative =
    escalationBand === 'exchange_crisis' || escalationBand === 'ruptured'
      ? 'Tariff exchange escalation feeding CPI import-pipeline metadata.'
      : escalationBand === 'stressed'
        ? 'Import exchange latch building under depreciation stress.'
        : 'Trade tariff exchange escalation stable versus headline CPI.';

  return { escalationBand, exchangeIndex, inflationScoreNudge, narrative };
}

export function tradeTariffExchangeInflationEscalationScoreAdjustment(
  band: TradeTariffExchangeInflationEscalationBand,
): number {
  if (band === 'exchange_crisis') return 4;
  if (band === 'ruptured') return 3;
  if (band === 'stressed') return 2;
  return 0;
}


// --- source: inflation/metro-capacity-rent-inflation-latch.ts ---

export type MetroCapacityRentInflationLatchBand = 'subdued' | 'tightening' | 'surging' | 'capacity_crisis';

export interface MetroCapacityRentInflationLatchAssessment {
  latchBand: MetroCapacityRentInflationLatchBand;
  capacityIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Metro capacity rent inflation latch (Agent 11). */
export function assessMetroCapacityRentInflationLatch(input: {
  vacancyBand: 'loose' | 'balanced' | 'tight' | 'critical';
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  wave40UrbanRentLatch: boolean;
  metroCapacityStressBand: 'aligned' | 'strained' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MetroCapacityRentInflationLatchAssessment {
  let pressure = 0;
  if (input.vacancyBand === 'critical') pressure += 0.24;
  else if (input.vacancyBand === 'tight') pressure += 0.12;
  if (input.rentGrowthBand === 'surging') pressure += 0.2;
  else if (input.rentGrowthBand === 'strong') pressure += 0.1;
  if (input.wave40UrbanRentLatch) pressure += 0.13;
  if (input.metroCapacityStressBand === 'critical') pressure += 0.21;
  else if (input.metroCapacityStressBand === 'strained') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const capacityIndex = finRound(100 + pressure * 17, 1);

  let latchBand: MetroCapacityRentInflationLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'capacity_crisis';
  else if (pressure >= 0.39) latchBand = 'surging';
  else if (pressure >= 0.18) latchBand = 'tightening';

  const inflationScoreNudge =
    latchBand === 'capacity_crisis'
      ? 0.093
      : latchBand === 'surging'
        ? 0.059
        : latchBand === 'tightening'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'capacity_crisis' || latchBand === 'surging'
      ? 'Metro capacity rent latch elevating CPI shelter metadata.'
      : latchBand === 'tightening'
        ? 'Urban rent latch building under vacancy stress.'
        : 'Metro capacity rent latch subdued versus headline CPI.';

  return { latchBand, capacityIndex, inflationScoreNudge, narrative };
}

export function metroCapacityRentInflationLatchScoreAdjustment(band: MetroCapacityRentInflationLatchBand): number {
  if (band === 'capacity_crisis') return 4;
  if (band === 'surging') return 3;
  if (band === 'tightening') return 2;
  return 0;
}


// --- source: inflation/grid-wholesale-tariff-inflation-surge.ts ---

export type GridWholesaleTariffInflationSurgeBand = 'stable' | 'stressed' | 'cascade' | 'grid_crisis';

export interface GridWholesaleTariffInflationSurgeAssessment {
  surgeBand: GridWholesaleTariffInflationSurgeBand;
  tariffIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Grid wholesale tariff inflation surge (Agent 13). */
export function assessGridWholesaleTariffInflationSurge(input: {
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  retailTariffShock: boolean;
  wave40GridTariffLatch: boolean;
  wholesaleTariffCascadeBand: 'stable' | 'stressed' | 'cascade';
  inflationBand: InflationConditionsBand;
  turn: number;
}): GridWholesaleTariffInflationSurgeAssessment {
  let pressure = 0;
  if (input.wholesaleEnergyStress === 'crisis') pressure += 0.25;
  else if (input.wholesaleEnergyStress === 'severe') pressure += 0.14;
  else if (input.wholesaleEnergyStress === 'elevated') pressure += 0.08;
  if (input.retailTariffShock) pressure += 0.14;
  if (input.wave40GridTariffLatch) pressure += 0.12;
  if (input.wholesaleTariffCascadeBand === 'cascade') pressure += 0.22;
  else if (input.wholesaleTariffCascadeBand === 'stressed') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const tariffIndex = finRound(100 + pressure * 16, 1);

  let surgeBand: GridWholesaleTariffInflationSurgeBand = 'stable';
  if (pressure >= 0.57) surgeBand = 'grid_crisis';
  else if (pressure >= 0.38) surgeBand = 'cascade';
  else if (pressure >= 0.17) surgeBand = 'stressed';

  const inflationScoreNudge =
    surgeBand === 'grid_crisis'
      ? 0.091
      : surgeBand === 'cascade'
        ? 0.058
        : surgeBand === 'stressed'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'grid_crisis' || surgeBand === 'cascade'
      ? 'Wholesale tariff surge feeding CPI grid metadata.'
      : surgeBand === 'stressed'
        ? 'Grid tariff latch building under wholesale stress.'
        : 'Grid wholesale tariff surge stable versus headline CPI.';

  return { surgeBand, tariffIndex, inflationScoreNudge, narrative };
}

export function gridWholesaleTariffInflationSurgeScoreAdjustment(band: GridWholesaleTariffInflationSurgeBand): number {
  if (band === 'grid_crisis') return 4;
  if (band === 'cascade') return 3;
  if (band === 'stressed') return 2;
  return 0;
}


// --- source: inflation/guardian-copilot-inflation-pressure-latch.ts ---

export type GuardianCopilotInflationPressureLatchBand = 'subdued' | 'building' | 'latched' | 'runaway';

export interface GuardianCopilotInflationPressureLatchAssessment {
  latchBand: GuardianCopilotInflationPressureLatchBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Guardian co-pilot inflation pressure latch (Agent 16, round 41). */
export function assessGuardianCopilotInflationPressureLatch(input: {
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  wave41GuardianPressureLatch: boolean;
  copilotPressureEscalationBand: 'contained' | 'elevated' | 'runaway';
  inflationBand: InflationConditionsBand;
  turn: number;
}): GuardianCopilotInflationPressureLatchAssessment {
  let pressure = 0;
  if (input.inflationGuardrailTripped) pressure += 0.19;
  if (input.stabilityInterventionBand === 'urgent') pressure += 0.17;
  else if (input.stabilityInterventionBand === 'advisory') pressure += 0.08;
  if (input.wave41GuardianPressureLatch) pressure += 0.14;
  if (input.copilotPressureEscalationBand === 'runaway') pressure += 0.23;
  else if (input.copilotPressureEscalationBand === 'elevated') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 16, 1);

  let latchBand: GuardianCopilotInflationPressureLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'runaway';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'runaway'
      ? 0.092
      : latchBand === 'latched'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'runaway' || latchBand === 'latched'
      ? 'Guardian co-pilot pressure latch elevating CPI alert metadata.'
      : latchBand === 'building'
        ? 'Co-pilot pressure latch building under guardrail trip.'
        : 'Guardian co-pilot pressure latch subdued versus headline CPI.';

  return { latchBand, pressureIndex, inflationScoreNudge, narrative };
}

export function guardianCopilotInflationPressureLatchScoreAdjustment(
  band: GuardianCopilotInflationPressureLatchBand,
): number {
  if (band === 'runaway') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/team-briefing-consensus-inflation-unmooring.ts ---

export type TeamBriefingConsensusInflationUnmooringBand = 'stable' | 'drifting' | 'unmoored' | 'consensus_rupture';

export interface TeamBriefingConsensusInflationUnmooringAssessment {
  unmooringBand: TeamBriefingConsensusInflationUnmooringBand;
  consensusIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Team briefing consensus inflation unmooring (Agent 18, round 41). */
export function assessTeamBriefingConsensusInflationUnmooring(input: {
  consensusInflationOutlook: 'disinflation' | 'stable' | 'reacceleration' | 'upside_risk';
  briefingUrgencyBand: 'routine' | 'elevated' | 'critical';
  wave41TeamConsensusLatch: boolean;
  briefingConsensusUnmoorBand: 'anchored' | 'drifting' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TeamBriefingConsensusInflationUnmooringAssessment {
  let pressure = 0;
  if (input.consensusInflationOutlook === 'upside_risk') pressure += 0.21;
  else if (input.consensusInflationOutlook === 'reacceleration') pressure += 0.11;
  if (input.briefingUrgencyBand === 'critical') pressure += 0.17;
  else if (input.briefingUrgencyBand === 'elevated') pressure += 0.08;
  if (input.wave41TeamConsensusLatch) pressure += 0.13;
  if (input.briefingConsensusUnmoorBand === 'ruptured') pressure += 0.22;
  else if (input.briefingConsensusUnmoorBand === 'drifting') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const consensusIndex = finRound(100 + pressure * 15, 1);

  let unmooringBand: TeamBriefingConsensusInflationUnmooringBand = 'stable';
  if (pressure >= 0.57) unmooringBand = 'consensus_rupture';
  else if (pressure >= 0.37) unmooringBand = 'unmoored';
  else if (pressure >= 0.16) unmooringBand = 'drifting';

  const inflationScoreNudge =
    unmooringBand === 'consensus_rupture'
      ? 0.09
      : unmooringBand === 'unmoored'
        ? 0.057
        : unmooringBand === 'drifting'
          ? 0.026
          : 0;

  const narrative =
    unmooringBand === 'consensus_rupture' || unmooringBand === 'unmoored'
      ? 'Team briefing consensus unmooring feeding CPI metadata drift.'
      : unmooringBand === 'drifting'
        ? 'Briefing consensus latch building under urgency stress.'
        : 'Team briefing consensus stable versus headline CPI.';

  return { unmooringBand, consensusIndex, inflationScoreNudge, narrative };
}

export function teamBriefingConsensusInflationUnmooringScoreAdjustment(
  band: TeamBriefingConsensusInflationUnmooringBand,
): number {
  if (band === 'consensus_rupture') return 4;
  if (band === 'unmoored') return 3;
  if (band === 'drifting') return 2;
  return 0;
}


// --- source: inflation/memory-realm-inflation-persistence-latch.ts ---

export type MemoryRealmInflationPersistenceLatchBand = 'subdued' | 'building' | 'latched' | 'realm_rupture';

export interface MemoryRealmInflationPersistenceLatchAssessment {
  latchBand: MemoryRealmInflationPersistenceLatchBand;
  persistenceIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Memory realm inflation persistence latch (Agent 19, round 42). */
export function assessMemoryRealmInflationPersistenceLatch(input: {
  recalledInflationRegimeConfidence: number;
  narrativeDriftTowardHigherInflation: boolean;
  wave42MemoryRecallLatch: boolean;
  realmPersistenceGateBand: 'anchored' | 'slipping' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MemoryRealmInflationPersistenceLatchAssessment {
  let pressure = 0;
  if (input.narrativeDriftTowardHigherInflation) pressure += 0.18;
  pressure += finClamp(input.recalledInflationRegimeConfidence, 0, 1) * 0.2;
  if (input.wave42MemoryRecallLatch) pressure += 0.14;
  if (input.realmPersistenceGateBand === 'ruptured') pressure += 0.23;
  else if (input.realmPersistenceGateBand === 'slipping') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const persistenceIndex = finRound(100 + pressure * 16, 1);

  let latchBand: MemoryRealmInflationPersistenceLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'realm_rupture';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'realm_rupture'
      ? 0.093
      : latchBand === 'latched'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'realm_rupture' || latchBand === 'latched'
      ? 'Memory realm persistence latch elevating CPI recall metadata.'
      : latchBand === 'building'
        ? 'Realm recall latch building under narrative drift.'
        : 'Memory realm persistence latch subdued versus headline CPI.';

  return { latchBand, persistenceIndex, inflationScoreNudge, narrative };
}

export function memoryRealmInflationPersistenceLatchScoreAdjustment(
  band: MemoryRealmInflationPersistenceLatchBand,
): number {
  if (band === 'realm_rupture') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/automation-synthesis-inflation-cascade-surge.ts ---

export type AutomationSynthesisInflationCascadeSurgeBand = 'stable' | 'stacking' | 'surge' | 'autopilot_runaway';

export interface AutomationSynthesisInflationCascadeSurgeAssessment {
  surgeBand: AutomationSynthesisInflationCascadeSurgeBand;
  cascadeIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Automation synthesis inflation cascade surge (Agent 20, round 42). */
export function assessAutomationSynthesisInflationCascadeSurge(input: {
  macroAutopilotInflationBias: 'deflate' | 'neutral' | 'inflate';
  unattendedShockDriftActive: boolean;
  wave42SynthesisCascadeLatch: boolean;
  autopilotStackSurgeBand: 'stable' | 'stacking' | 'surge';
  inflationBand: InflationConditionsBand;
  turn: number;
}): AutomationSynthesisInflationCascadeSurgeAssessment {
  let pressure = 0;
  if (input.macroAutopilotInflationBias === 'inflate') pressure += 0.19;
  else if (input.macroAutopilotInflationBias === 'neutral') pressure += 0.05;
  if (input.unattendedShockDriftActive) pressure += 0.16;
  if (input.wave42SynthesisCascadeLatch) pressure += 0.13;
  if (input.autopilotStackSurgeBand === 'surge') pressure += 0.22;
  else if (input.autopilotStackSurgeBand === 'stacking') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const cascadeIndex = finRound(100 + pressure * 15, 1);

  let surgeBand: AutomationSynthesisInflationCascadeSurgeBand = 'stable';
  if (pressure >= 0.57) surgeBand = 'autopilot_runaway';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'stacking';

  const inflationScoreNudge =
    surgeBand === 'autopilot_runaway'
      ? 0.091
      : surgeBand === 'surge'
        ? 0.058
        : surgeBand === 'stacking'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'autopilot_runaway' || surgeBand === 'surge'
      ? 'Automation synthesis cascade surge feeding CPI autopilot metadata.'
      : surgeBand === 'stacking'
        ? 'Synthesis cascade latch building under shock drift.'
        : 'Automation synthesis cascade stable versus headline CPI.';

  return { surgeBand, cascadeIndex, inflationScoreNudge, narrative };
}

export function automationSynthesisInflationCascadeSurgeScoreAdjustment(
  band: AutomationSynthesisInflationCascadeSurgeBand,
): number {
  if (band === 'autopilot_runaway') return 4;
  if (band === 'surge') return 3;
  if (band === 'stacking') return 2;
  return 0;
}


// --- source: inflation/ui-shell-inflation-attention-latch.ts ---

export type UiShellInflationAttentionLatchBand = 'muted' | 'building' | 'latched' | 'attention_crisis';

export interface UiShellInflationAttentionLatchAssessment {
  latchBand: UiShellInflationAttentionLatchBand;
  attentionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** UI shell inflation attention latch (Agent 22, round 43). */
export function assessUiShellInflationAttentionLatch(input: {
  inflationDashboardStressHighlight: boolean;
  playerAttentionOnCostOfLiving: 'low' | 'medium' | 'high';
  wave43ShellAttentionLatch: boolean;
  playerSaliencePressureBand: 'muted' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): UiShellInflationAttentionLatchAssessment {
  let pressure = 0;
  if (input.inflationDashboardStressHighlight) pressure += 0.17;
  if (input.playerAttentionOnCostOfLiving === 'high') pressure += 0.2;
  else if (input.playerAttentionOnCostOfLiving === 'medium') pressure += 0.09;
  if (input.wave43ShellAttentionLatch) pressure += 0.14;
  if (input.playerSaliencePressureBand === 'critical') pressure += 0.22;
  else if (input.playerSaliencePressureBand === 'elevated') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const attentionIndex = finRound(100 + pressure * 15, 1);

  let latchBand: UiShellInflationAttentionLatchBand = 'muted';
  if (pressure >= 0.57) latchBand = 'attention_crisis';
  else if (pressure >= 0.37) latchBand = 'latched';
  else if (pressure >= 0.16) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'attention_crisis'
      ? 0.09
      : latchBand === 'latched'
        ? 0.057
        : latchBand === 'building'
          ? 0.026
          : 0;

  const narrative =
    latchBand === 'attention_crisis' || latchBand === 'latched'
      ? 'UI shell attention latch elevating CPI salience metadata.'
      : latchBand === 'building'
        ? 'Player salience pressure building under dashboard stress.'
        : 'UI shell inflation attention latch muted versus headline CPI.';

  return { latchBand, attentionIndex, inflationScoreNudge, narrative };
}

export function uiShellInflationAttentionLatchScoreAdjustment(band: UiShellInflationAttentionLatchBand): number {
  if (band === 'attention_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/dashboard-regional-inflation-overlay-surge.ts ---

export type DashboardRegionalInflationOverlaySurgeBand = 'routine' | 'widening' | 'surge' | 'heatmap_crisis';

export interface DashboardRegionalInflationOverlaySurgeAssessment {
  surgeBand: DashboardRegionalInflationOverlaySurgeBand;
  overlayIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Dashboard regional inflation overlay surge (Agent 23, round 43). */
export function assessDashboardRegionalInflationOverlaySurge(input: {
  regionalHeatmapInflationAlert: boolean;
  mapLayerCostPressureScore: number;
  wave43HeatmapOverlayLatch: boolean;
  regionalOverlaySurgeBand: 'routine' | 'widening' | 'surge';
  inflationBand: InflationConditionsBand;
  turn: number;
}): DashboardRegionalInflationOverlaySurgeAssessment {
  let pressure = 0;
  if (input.regionalHeatmapInflationAlert) pressure += 0.19;
  pressure += finClamp(input.mapLayerCostPressureScore, 0, 1) * 0.21;
  if (input.wave43HeatmapOverlayLatch) pressure += 0.13;
  if (input.regionalOverlaySurgeBand === 'surge') pressure += 0.22;
  else if (input.regionalOverlaySurgeBand === 'widening') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const overlayIndex = finRound(100 + pressure * 16, 1);

  let surgeBand: DashboardRegionalInflationOverlaySurgeBand = 'routine';
  if (pressure >= 0.58) surgeBand = 'heatmap_crisis';
  else if (pressure >= 0.38) surgeBand = 'surge';
  else if (pressure >= 0.17) surgeBand = 'widening';

  const inflationScoreNudge =
    surgeBand === 'heatmap_crisis'
      ? 0.092
      : surgeBand === 'surge'
        ? 0.058
        : surgeBand === 'widening'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'heatmap_crisis' || surgeBand === 'surge'
      ? 'Regional overlay surge feeding CPI dashboard metadata.'
      : surgeBand === 'widening'
        ? 'Heatmap overlay latch building under map pressure.'
        : 'Dashboard regional overlay surge routine versus headline CPI.';

  return { surgeBand, overlayIndex, inflationScoreNudge, narrative };
}

export function dashboardRegionalInflationOverlaySurgeScoreAdjustment(
  band: DashboardRegionalInflationOverlaySurgeBand,
): number {
  if (band === 'heatmap_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'widening') return 2;
  return 0;
}


// --- source: inflation/command-center-inflation-alert-pressure-latch.ts ---

export type CommandCenterInflationAlertPressureLatchBand = 'subdued' | 'building' | 'latched' | 'alert_crisis';

export interface CommandCenterInflationAlertPressureLatchAssessment {
  latchBand: CommandCenterInflationAlertPressureLatchBand;
  alertIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Command center inflation alert pressure latch (Agent 17, round 44). */
export function assessCommandCenterInflationAlertPressureLatch(input: {
  macroAlertLevel: 'green' | 'amber' | 'red';
  inflationFusionScore: number;
  wave44CommandAlertLatch: boolean;
  commandAlertPressureBand: 'contained' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CommandCenterInflationAlertPressureLatchAssessment {
  let pressure = 0;
  if (input.macroAlertLevel === 'red') pressure += 0.21;
  else if (input.macroAlertLevel === 'amber') pressure += 0.1;
  pressure += finClamp(input.inflationFusionScore, 0, 1) * 0.19;
  if (input.wave44CommandAlertLatch) pressure += 0.14;
  if (input.commandAlertPressureBand === 'critical') pressure += 0.23;
  else if (input.commandAlertPressureBand === 'elevated') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const alertIndex = finRound(100 + pressure * 16, 1);

  let latchBand: CommandCenterInflationAlertPressureLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'alert_crisis';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'alert_crisis'
      ? 0.092
      : latchBand === 'latched'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'alert_crisis' || latchBand === 'latched'
      ? 'Command alert pressure latch elevating CPI fusion metadata.'
      : latchBand === 'building'
        ? 'Command center alert latch building under fusion score.'
        : 'Command alert pressure latch subdued versus headline CPI.';

  return { latchBand, alertIndex, inflationScoreNudge, narrative };
}

export function commandCenterInflationAlertPressureLatchScoreAdjustment(
  band: CommandCenterInflationAlertPressureLatchBand,
): number {
  if (band === 'alert_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/transport-freight-inflation-gridlock-surge.ts ---

export type TransportFreightInflationGridlockSurgeBand = 'clear' | 'building' | 'surge' | 'gridlock_crisis';

export interface TransportFreightInflationGridlockSurgeAssessment {
  surgeBand: TransportFreightInflationGridlockSurgeBand;
  gridlockIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Transport freight inflation gridlock surge (Agent 12, round 44). */
export function assessTransportFreightInflationGridlockSurge(input: {
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  wave44FreightGridlockLatch: boolean;
  freightGridlockSurgeBand: 'clear' | 'building' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TransportFreightInflationGridlockSurgeAssessment {
  let pressure = 0;
  if (input.freightCapacityBand === 'critical') pressure += 0.22;
  else if (input.freightCapacityBand === 'tight') pressure += 0.12;
  if (input.fuelSurchargeActive) pressure += 0.15;
  if (input.wave44FreightGridlockLatch) pressure += 0.13;
  if (input.freightGridlockSurgeBand === 'ruptured') pressure += 0.21;
  else if (input.freightGridlockSurgeBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const gridlockIndex = finRound(100 + pressure * 15, 1);

  let surgeBand: TransportFreightInflationGridlockSurgeBand = 'clear';
  if (pressure >= 0.57) surgeBand = 'gridlock_crisis';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'gridlock_crisis'
      ? 0.091
      : surgeBand === 'surge'
        ? 0.058
        : surgeBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'gridlock_crisis' || surgeBand === 'surge'
      ? 'Freight gridlock surge feeding CPI logistics metadata.'
      : surgeBand === 'building'
        ? 'Freight gridlock latch building under capacity stress.'
        : 'Transport freight gridlock surge clear versus headline CPI.';

  return { surgeBand, gridlockIndex, inflationScoreNudge, narrative };
}

export function transportFreightInflationGridlockSurgeScoreAdjustment(
  band: TransportFreightInflationGridlockSurgeBand,
): number {
  if (band === 'gridlock_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/events-narrative-inflation-shock-latch.ts ---

export type EventsNarrativeInflationShockLatchBand = 'muted' | 'building' | 'latched' | 'shock_crisis';

export interface EventsNarrativeInflationShockLatchAssessment {
  latchBand: EventsNarrativeInflationShockLatchBand;
  shockIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Events narrative inflation shock latch (Agent 05, round 45). */
export function assessEventsNarrativeInflationShockLatch(input: {
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  wave45EventShockLatch: boolean;
  narrativeShockEntrenchBand: 'none' | 'building' | 'entrenched';
  inflationBand: InflationConditionsBand;
  turn: number;
}): EventsNarrativeInflationShockLatchAssessment {
  let pressure = 0;
  if (input.inflationShockEventActive) pressure += 0.2;
  if (input.supplyDisruptionSeverity === 'national') pressure += 0.18;
  else if (input.supplyDisruptionSeverity === 'localized') pressure += 0.09;
  if (input.wave45EventShockLatch) pressure += 0.14;
  if (input.narrativeShockEntrenchBand === 'entrenched') pressure += 0.22;
  else if (input.narrativeShockEntrenchBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const shockIndex = finRound(100 + pressure * 16, 1);

  let latchBand: EventsNarrativeInflationShockLatchBand = 'muted';
  if (pressure >= 0.58) latchBand = 'shock_crisis';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'shock_crisis'
      ? 0.093
      : latchBand === 'latched'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'shock_crisis' || latchBand === 'latched'
      ? 'Events narrative shock latch elevating CPI metadata persistence.'
      : latchBand === 'building'
        ? 'Staged shock latch building under supply disruption.'
        : 'Events narrative shock latch muted versus headline CPI.';

  return { latchBand, shockIndex, inflationScoreNudge, narrative };
}

export function eventsNarrativeInflationShockLatchScoreAdjustment(
  band: EventsNarrativeInflationShockLatchBand,
): number {
  if (band === 'shock_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/modes-sandbox-inflation-pressure-surge.ts ---

export type ModesSandboxInflationPressureSurgeBand = 'routine' | 'stressed' | 'surge' | 'sandbox_crisis';

export interface ModesSandboxInflationPressureSurgeAssessment {
  surgeBand: ModesSandboxInflationPressureSurgeBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Modes sandbox inflation pressure surge (Agent 04, round 45). */
export function assessModesSandboxInflationPressureSurge(input: {
  scenarioInflationBias: 'disinflationary' | 'neutral' | 'inflationary' | 'extreme';
  sandboxStressModeActive: boolean;
  wave45SandboxPressureLatch: boolean;
  scenarioStressSurgeBand: 'routine' | 'stressed' | 'surge';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ModesSandboxInflationPressureSurgeAssessment {
  let pressure = 0;
  if (input.scenarioInflationBias === 'extreme') pressure += 0.22;
  else if (input.scenarioInflationBias === 'inflationary') pressure += 0.11;
  if (input.sandboxStressModeActive) pressure += 0.14;
  if (input.wave45SandboxPressureLatch) pressure += 0.13;
  if (input.scenarioStressSurgeBand === 'surge') pressure += 0.21;
  else if (input.scenarioStressSurgeBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 15, 1);

  let surgeBand: ModesSandboxInflationPressureSurgeBand = 'routine';
  if (pressure >= 0.57) surgeBand = 'sandbox_crisis';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'stressed';

  const inflationScoreNudge =
    surgeBand === 'sandbox_crisis'
      ? 0.091
      : surgeBand === 'surge'
        ? 0.058
        : surgeBand === 'stressed'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'sandbox_crisis' || surgeBand === 'surge'
      ? 'Sandbox pressure surge feeding CPI scenario metadata.'
      : surgeBand === 'stressed'
        ? 'Modes pressure latch building under stress mode.'
        : 'Modes sandbox pressure surge routine versus headline CPI.';

  return { surgeBand, pressureIndex, inflationScoreNudge, narrative };
}

export function modesSandboxInflationPressureSurgeScoreAdjustment(
  band: ModesSandboxInflationPressureSurgeBand,
): number {
  if (band === 'sandbox_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'stressed') return 2;
  return 0;
}


// --- source: inflation/fiscal-consolidated-inflation-pressure-latch.ts ---

export type FiscalConsolidatedInflationPressureLatchBand = 'subdued' | 'building' | 'latched' | 'fiscal_crisis';

export interface FiscalConsolidatedInflationPressureLatchAssessment {
  latchBand: FiscalConsolidatedInflationPressureLatchBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Fiscal consolidated inflation pressure latch (Agent 07, round 46). */
export function assessFiscalConsolidatedInflationPressureLatch(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  wave46FiscalPressureLatch: boolean;
  consolidatedDeficitEscalationBand: 'stable' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): FiscalConsolidatedInflationPressureLatchAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') pressure += 0.2;
  else if (input.consolidatedDeficitBand === 'moderate_deficit') pressure += 0.1;
  if (input.debtServicePressure === 'critical') pressure += 0.21;
  else if (input.debtServicePressure === 'elevated') pressure += 0.11;
  if (input.wave46FiscalPressureLatch) pressure += 0.14;
  if (input.consolidatedDeficitEscalationBand === 'critical') pressure += 0.22;
  else if (input.consolidatedDeficitEscalationBand === 'elevated') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 16, 1);

  let latchBand: FiscalConsolidatedInflationPressureLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'fiscal_crisis';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'fiscal_crisis'
      ? 0.093
      : latchBand === 'latched'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'fiscal_crisis' || latchBand === 'latched'
      ? 'Fiscal consolidated pressure latch elevating CPI debt-service metadata.'
      : latchBand === 'building'
        ? 'Deficit escalation latch building under debt service stress.'
        : 'Fiscal consolidated pressure latch subdued versus headline CPI.';

  return { latchBand, pressureIndex, inflationScoreNudge, narrative };
}

export function fiscalConsolidatedInflationPressureLatchScoreAdjustment(
  band: FiscalConsolidatedInflationPressureLatchBand,
): number {
  if (band === 'fiscal_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/household-wage-inflation-stress-surge.ts ---

export type HouseholdWageInflationStressSurgeBand = 'contained' | 'building' | 'surge' | 'wage_crisis';

export interface HouseholdWageInflationStressSurgeAssessment {
  surgeBand: HouseholdWageInflationStressSurgeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Household wage inflation stress surge (Agent 09, round 46). */
export function assessHouseholdWageInflationStressSurge(input: {
  wageGrowthBand: 'subdued' | 'moderate' | 'elevated' | 'surge';
  costOfLivingStress: 'low' | 'moderate' | 'high' | 'extreme';
  wave46HouseholdStressLatch: boolean;
  wageStressSurgeBand: 'contained' | 'building' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): HouseholdWageInflationStressSurgeAssessment {
  let pressure = 0;
  if (input.wageGrowthBand === 'surge') pressure += 0.21;
  else if (input.wageGrowthBand === 'elevated') pressure += 0.11;
  if (input.costOfLivingStress === 'extreme') pressure += 0.19;
  else if (input.costOfLivingStress === 'high') pressure += 0.09;
  if (input.wave46HouseholdStressLatch) pressure += 0.13;
  if (input.wageStressSurgeBand === 'ruptured') pressure += 0.22;
  else if (input.wageStressSurgeBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 15, 1);

  let surgeBand: HouseholdWageInflationStressSurgeBand = 'contained';
  if (pressure >= 0.57) surgeBand = 'wage_crisis';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'wage_crisis'
      ? 0.091
      : surgeBand === 'surge'
        ? 0.058
        : surgeBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'wage_crisis' || surgeBand === 'surge'
      ? 'Household wage stress surge feeding CPI essential metadata.'
      : surgeBand === 'building'
        ? 'Wage stress latch building under cost-of-living pressure.'
        : 'Household wage stress surge contained versus headline CPI.';

  return { surgeBand, stressIndex, inflationScoreNudge, narrative };
}

export function householdWageInflationStressSurgeScoreAdjustment(
  band: HouseholdWageInflationStressSurgeBand,
): number {
  if (band === 'wage_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/macro-output-gap-inflation-pressure-latch.ts ---

export type MacroOutputGapInflationPressureLatchBand = 'subdued' | 'building' | 'latched' | 'overheat_crisis';

export interface MacroOutputGapInflationPressureLatchAssessment {
  latchBand: MacroOutputGapInflationPressureLatchBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Macro output-gap inflation pressure latch (Agent 06, round 47). */
export function assessMacroOutputGapInflationPressureLatch(input: {
  gdpGrowthBand: 'contraction' | 'slow' | 'steady' | 'strong';
  outputGap: number;
  wave47MacroOutputGapLatch: boolean;
  outputGapEscalationBand: 'stable' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MacroOutputGapInflationPressureLatchAssessment {
  let pressure = 0;
  if (input.gdpGrowthBand === 'strong') pressure += 0.18;
  else if (input.gdpGrowthBand === 'steady' && input.outputGap > 0.2) pressure += 0.1;
  if (input.outputGap > 0.45) pressure += 0.2;
  else if (input.outputGap > 0.25) pressure += 0.11;
  if (input.wave47MacroOutputGapLatch) pressure += 0.14;
  if (input.outputGapEscalationBand === 'critical') pressure += 0.22;
  else if (input.outputGapEscalationBand === 'elevated') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 16.5, 1);

  let latchBand: MacroOutputGapInflationPressureLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'overheat_crisis';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'overheat_crisis'
      ? 0.094
      : latchBand === 'latched'
        ? 0.06
        : latchBand === 'building'
          ? 0.029
          : 0;

  const narrative =
    latchBand === 'overheat_crisis' || latchBand === 'latched'
      ? 'Macro output-gap latch elevating CPI demand-side metadata.'
      : latchBand === 'building'
        ? 'Output-gap escalation latch building under nominal demand pressure.'
        : 'Macro output-gap pressure latch subdued versus headline CPI.';

  return { latchBand, pressureIndex, inflationScoreNudge, narrative };
}

export function macroOutputGapInflationPressureLatchScoreAdjustment(
  band: MacroOutputGapInflationPressureLatchBand,
): number {
  if (band === 'overheat_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/corporate-capacity-markup-inflation-surge.ts ---

export type CorporateCapacityMarkupInflationSurgeBand = 'contained' | 'building' | 'surge' | 'capacity_crisis';

export interface CorporateCapacityMarkupInflationSurgeAssessment {
  surgeBand: CorporateCapacityMarkupInflationSurgeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Corporate capacity markup inflation surge (Agent 08, round 47). */
export function assessCorporateCapacityMarkupInflationSurge(input: {
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  marginCompression: 'none' | 'mild' | 'severe';
  wave47CorporateCapacityLatch: boolean;
  capacityMarkupSurgeBand: 'contained' | 'building' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CorporateCapacityMarkupInflationSurgeAssessment {
  let pressure = 0;
  if (input.pricingPowerBand === 'dominant') pressure += 0.2;
  else if (input.pricingPowerBand === 'strong') pressure += 0.11;
  if (input.marginCompression === 'none' && input.pricingPowerBand !== 'weak') pressure += 0.08;
  if (input.wave47CorporateCapacityLatch) pressure += 0.13;
  if (input.capacityMarkupSurgeBand === 'ruptured') pressure += 0.22;
  else if (input.capacityMarkupSurgeBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 15.5, 1);

  let surgeBand: CorporateCapacityMarkupInflationSurgeBand = 'contained';
  if (pressure >= 0.57) surgeBand = 'capacity_crisis';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'capacity_crisis'
      ? 0.092
      : surgeBand === 'surge'
        ? 0.059
        : surgeBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    surgeBand === 'capacity_crisis' || surgeBand === 'surge'
      ? 'Corporate capacity markup surge feeding CPI pass-through metadata.'
      : surgeBand === 'building'
        ? 'Capacity constraint latch building under pricing power.'
        : 'Corporate capacity markup surge contained versus headline CPI.';

  return { surgeBand, stressIndex, inflationScoreNudge, narrative };
}

export function corporateCapacityMarkupInflationSurgeScoreAdjustment(
  band: CorporateCapacityMarkupInflationSurgeBand,
): number {
  if (band === 'capacity_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/research-breakthrough-supply-side-inflation-latch.ts ---

export type ResearchBreakthroughSupplySideInflationLatchBand =
  | 'offset'
  | 'neutral'
  | 'building'
  | 'breakthrough_failure';

export interface ResearchBreakthroughSupplySideInflationLatchAssessment {
  latchBand: ResearchBreakthroughSupplySideInflationLatchBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Research breakthrough supply-side inflation latch (Agent 03, round 48). */
export function assessResearchBreakthroughSupplySideInflationLatch(input: {
  productivityGainBand: 'flat' | 'moderate' | 'strong';
  supplySideReliefActive: boolean;
  wave48ResearchBreakthroughLatch: boolean;
  researchSupplySideFailureBand: 'contained' | 'building' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ResearchBreakthroughSupplySideInflationLatchAssessment {
  let pressure = 0;
  if (input.productivityGainBand === 'flat' && !input.supplySideReliefActive) pressure += 0.16;
  else if (input.productivityGainBand === 'moderate' && !input.supplySideReliefActive) pressure += 0.08;
  if (input.wave48ResearchBreakthroughLatch) pressure += 0.14;
  if (input.researchSupplySideFailureBand === 'critical') pressure += 0.22;
  else if (input.researchSupplySideFailureBand === 'building') pressure += 0.1;

  if (input.productivityGainBand === 'strong' && input.supplySideReliefActive) pressure -= 0.12;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 15.8, 1);

  let latchBand: ResearchBreakthroughSupplySideInflationLatchBand = 'neutral';
  if (pressure >= 0.56) latchBand = 'breakthrough_failure';
  else if (pressure >= 0.36) latchBand = 'building';
  else if (pressure <= 0.12 && input.productivityGainBand === 'strong') latchBand = 'offset';

  const inflationScoreNudge =
    latchBand === 'breakthrough_failure'
      ? 0.091
      : latchBand === 'building'
        ? 0.057
        : latchBand === 'offset'
          ? -0.02
          : 0;

  const narrative =
    latchBand === 'breakthrough_failure' || latchBand === 'building'
      ? 'Research breakthrough latch failing to offset CPI via supply-side relief.'
      : latchBand === 'offset'
        ? 'Strong innovation offset holding headline CPI metadata anchored.'
        : 'Research supply-side latch neutral versus headline CPI.';

  return { latchBand, pressureIndex, inflationScoreNudge, narrative };
}

export function researchBreakthroughSupplySideInflationLatchScoreAdjustment(
  band: ResearchBreakthroughSupplySideInflationLatchBand,
): number {
  if (band === 'breakthrough_failure') return 4;
  if (band === 'building') return 3;
  if (band === 'offset') return -1;
  return 0;
}


// --- source: inflation/trade-import-exchange-inflation-pipeline-surge.ts ---

export type TradeImportExchangeInflationPipelineSurgeBand =
  | 'anchored'
  | 'building'
  | 'surge'
  | 'pipeline_crisis';

export interface TradeImportExchangeInflationPipelineSurgeAssessment {
  surgeBand: TradeImportExchangeInflationPipelineSurgeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Trade import exchange inflation pipeline surge (Agent 15, round 48). */
export function assessTradeImportExchangeInflationPipelineSurge(input: {
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  wave48TradeImportPipelineLatch: boolean;
  importExchangePipelineSurgeBand: 'stable' | 'stressed' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TradeImportExchangeInflationPipelineSurgeAssessment {
  let pressure = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') pressure += 0.2;
  else if (input.exchangeRatePressure === 'depreciation') pressure += 0.11;
  if (input.tradeOpennessBand === 'open') pressure += 0.09;
  if (input.wave48TradeImportPipelineLatch) pressure += 0.13;
  if (input.importExchangePipelineSurgeBand === 'ruptured') pressure += 0.22;
  else if (input.importExchangePipelineSurgeBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 16.2, 1);

  let surgeBand: TradeImportExchangeInflationPipelineSurgeBand = 'anchored';
  if (pressure >= 0.58) surgeBand = 'pipeline_crisis';
  else if (pressure >= 0.38) surgeBand = 'surge';
  else if (pressure >= 0.17) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'pipeline_crisis'
      ? 0.093
      : surgeBand === 'surge'
        ? 0.06
        : surgeBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    surgeBand === 'pipeline_crisis' || surgeBand === 'surge'
      ? 'Trade import exchange pipeline surge feeding CPI pass-through metadata.'
      : surgeBand === 'building'
        ? 'Import pipeline latch building under exchange stress.'
        : 'Trade import exchange pipeline surge anchored versus headline CPI.';

  return { surgeBand, stressIndex, inflationScoreNudge, narrative };
}

export function tradeImportExchangeInflationPipelineSurgeScoreAdjustment(
  band: TradeImportExchangeInflationPipelineSurgeBand,
): number {
  if (band === 'pipeline_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/metro-regional-rent-inflation-escalation-latch.ts ---

export type MetroRegionalRentInflationEscalationLatchBand =
  | 'subdued'
  | 'building'
  | 'escalated'
  | 'regional_crisis';

export interface MetroRegionalRentInflationEscalationLatchAssessment {
  latchBand: MetroRegionalRentInflationEscalationLatchBand;
  escalationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Metro regional rent inflation escalation latch (Agent 11, round 49). */
export function assessMetroRegionalRentInflationEscalationLatch(input: {
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  regionalDispersionScore: number;
  wave49MetroRegionalRentLatch: boolean;
  regionalRentEscalationBand: 'contained' | 'building' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MetroRegionalRentInflationEscalationLatchAssessment {
  let pressure = 0;
  if (input.rentGrowthBand === 'surging') pressure += 0.19;
  else if (input.rentGrowthBand === 'strong') pressure += 0.1;
  if (input.regionalDispersionScore > 0.55) pressure += 0.12;
  else if (input.regionalDispersionScore > 0.35) pressure += 0.06;
  if (input.wave49MetroRegionalRentLatch) pressure += 0.14;
  if (input.regionalRentEscalationBand === 'critical') pressure += 0.22;
  else if (input.regionalRentEscalationBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const escalationIndex = finRound(100 + pressure * 16.4, 1);

  let latchBand: MetroRegionalRentInflationEscalationLatchBand = 'subdued';
  if (pressure >= 0.57) latchBand = 'regional_crisis';
  else if (pressure >= 0.38) latchBand = 'escalated';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'regional_crisis'
      ? 0.092
      : latchBand === 'escalated'
        ? 0.058
        : latchBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    latchBand === 'regional_crisis' || latchBand === 'escalated'
      ? 'Metro regional rent escalation latch elevating CPI shelter metadata.'
      : latchBand === 'building'
        ? 'Regional rent dispersion latch building under metro stress.'
        : 'Metro regional rent escalation latch subdued versus headline CPI.';

  return { latchBand, escalationIndex, inflationScoreNudge, narrative };
}

export function metroRegionalRentInflationEscalationLatchScoreAdjustment(
  band: MetroRegionalRentInflationEscalationLatchBand,
): number {
  if (band === 'regional_crisis') return 4;
  if (band === 'escalated') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/wholesale-grid-transition-inflation-surge.ts ---

export type WholesaleGridTransitionInflationSurgeBand =
  | 'stable'
  | 'building'
  | 'surge'
  | 'transition_crisis';

export interface WholesaleGridTransitionInflationSurgeAssessment {
  surgeBand: WholesaleGridTransitionInflationSurgeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Wholesale grid transition inflation surge (Agent 13, round 49). */
export function assessWholesaleGridTransitionInflationSurge(input: {
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  emissionsTransitionCostBand: 'low' | 'medium' | 'high';
  wave49GridTransitionSurgeLatch: boolean;
  gridTransitionStressBand: 'stable' | 'stressed' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): WholesaleGridTransitionInflationSurgeAssessment {
  let pressure = 0;
  if (input.wholesaleEnergyStress === 'crisis') pressure += 0.21;
  else if (input.wholesaleEnergyStress === 'severe') pressure += 0.12;
  if (input.emissionsTransitionCostBand === 'high') pressure += 0.1;
  else if (input.emissionsTransitionCostBand === 'medium') pressure += 0.05;
  if (input.wave49GridTransitionSurgeLatch) pressure += 0.13;
  if (input.gridTransitionStressBand === 'ruptured') pressure += 0.22;
  else if (input.gridTransitionStressBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 15.9, 1);

  let surgeBand: WholesaleGridTransitionInflationSurgeBand = 'stable';
  if (pressure >= 0.58) surgeBand = 'transition_crisis';
  else if (pressure >= 0.38) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'transition_crisis'
      ? 0.094
      : surgeBand === 'surge'
        ? 0.06
        : surgeBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    surgeBand === 'transition_crisis' || surgeBand === 'surge'
      ? 'Wholesale grid transition surge feeding CPI utility metadata.'
      : surgeBand === 'building'
        ? 'Grid transition latch building under wholesale stress.'
        : 'Wholesale grid transition surge stable versus headline CPI.';

  return { surgeBand, stressIndex, inflationScoreNudge, narrative };
}

export function wholesaleGridTransitionInflationSurgeScoreAdjustment(
  band: WholesaleGridTransitionInflationSurgeBand,
): number {
  if (band === 'transition_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/trade-cleared-forward-arc-inflation-handoff-latch.ts ---

export type TradeClearedForwardArcInflationHandoffLatchBand =
  | 'anchored'
  | 'building'
  | 'handoff_stress'
  | 'continuity_rupture';

export interface TradeClearedForwardArcInflationHandoffLatchAssessment {
  latchBand: TradeClearedForwardArcInflationHandoffLatchBand;
  continuityIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Trade cleared forward-arc inflation handoff latch (Agent 15, round 49). */
export function assessTradeClearedForwardArcInflationHandoffLatch(input: {
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  wave49ClearedForwardArcHandoffLatch: boolean;
  clearedForwardArcHandoffContinuityBand: 'stable' | 'strained' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TradeClearedForwardArcInflationHandoffLatchAssessment {
  let pressure = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') pressure += 0.19;
  else if (input.exchangeRatePressure === 'depreciation') pressure += 0.1;
  if (input.tradeOpennessBand === 'open') pressure += 0.08;
  if (input.wave49ClearedForwardArcHandoffLatch) pressure += 0.14;
  if (input.clearedForwardArcHandoffContinuityBand === 'ruptured') pressure += 0.21;
  else if (input.clearedForwardArcHandoffContinuityBand === 'strained') pressure += 0.09;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const continuityIndex = finRound(100 + pressure * 16.4, 1);

  let latchBand: TradeClearedForwardArcInflationHandoffLatchBand = 'anchored';
  if (pressure >= 0.57) latchBand = 'continuity_rupture';
  else if (pressure >= 0.37) latchBand = 'handoff_stress';
  else if (pressure >= 0.16) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'continuity_rupture'
      ? 0.094
      : latchBand === 'handoff_stress'
        ? 0.061
        : latchBand === 'building'
          ? 0.029
          : 0;

  const narrative =
    latchBand === 'continuity_rupture' || latchBand === 'handoff_stress'
      ? 'Cleared forward-arc handoff failing to anchor import-side CPI metadata.'
      : latchBand === 'building'
        ? 'Forward-arc handoff continuity building under trade stress.'
        : 'Trade cleared forward-arc handoff latch anchored versus headline CPI.';

  return { latchBand, continuityIndex, inflationScoreNudge, narrative };
}

export function tradeClearedForwardArcInflationHandoffLatchScoreAdjustment(
  band: TradeClearedForwardArcInflationHandoffLatchBand,
): number {
  if (band === 'continuity_rupture') return 4;
  if (band === 'handoff_stress') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/guardian-entrustment-envelope-inflation-pressure-surge.ts ---

export type GuardianEntrustmentEnvelopeInflationPressureSurgeBand =
  | 'contained'
  | 'building'
  | 'surge'
  | 'envelope_rupture';

export interface GuardianEntrustmentEnvelopeInflationPressureSurgeAssessment {
  surgeBand: GuardianEntrustmentEnvelopeInflationPressureSurgeBand;
  strainIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Guardian entrustment envelope inflation pressure surge (Agent 16, round 49). */
export function assessGuardianEntrustmentEnvelopeInflationPressureSurge(input: {
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  wave49EntrustmentEnvelopeLatch: boolean;
  entrustmentEnvelopePressureBand: 'contained' | 'elevated' | 'ruptured';
  entrustmentStrainIndex: number;
  inflationBand: InflationConditionsBand;
  turn: number;
}): GuardianEntrustmentEnvelopeInflationPressureSurgeAssessment {
  let pressure = 0;
  if (input.inflationGuardrailTripped) pressure += 0.15;
  if (input.stabilityInterventionBand === 'urgent') pressure += 0.12;
  else if (input.stabilityInterventionBand === 'advisory') pressure += 0.06;
  if (input.wave49EntrustmentEnvelopeLatch) pressure += 0.13;
  if (input.entrustmentEnvelopePressureBand === 'ruptured') pressure += 0.2;
  else if (input.entrustmentEnvelopePressureBand === 'elevated') pressure += 0.09;
  if (input.entrustmentStrainIndex >= 0.72) pressure += 0.08;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const strainIndex = finRound(100 + pressure * 15.6, 1);

  let surgeBand: GuardianEntrustmentEnvelopeInflationPressureSurgeBand = 'contained';
  if (pressure >= 0.58) surgeBand = 'envelope_rupture';
  else if (pressure >= 0.38) surgeBand = 'surge';
  else if (pressure >= 0.17) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'envelope_rupture'
      ? 0.092
      : surgeBand === 'surge'
        ? 0.059
        : surgeBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'envelope_rupture' || surgeBand === 'surge'
      ? 'Guardian entrustment envelope strain feeding CPI escalation metadata.'
      : surgeBand === 'building'
        ? 'Entrustment envelope pressure building under guardrail stress.'
        : 'Guardian entrustment envelope pressure contained versus headline CPI.';

  return { surgeBand, strainIndex, inflationScoreNudge, narrative };
}

export function guardianEntrustmentEnvelopeInflationPressureSurgeScoreAdjustment(
  band: GuardianEntrustmentEnvelopeInflationPressureSurgeBand,
): number {
  if (band === 'envelope_rupture') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/housing-wellbeing-mortgage-inflation-escalation-latch.ts ---

export type HousingWellbeingMortgageInflationEscalationLatchBand =
  | 'subdued'
  | 'building'
  | 'escalated'
  | 'essential_crisis';

export interface HousingWellbeingMortgageInflationEscalationLatchAssessment {
  latchBand: HousingWellbeingMortgageInflationEscalationLatchBand;
  escalationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Housing wellbeing mortgage inflation escalation latch (Agent 14, round 50). */
export function assessHousingWellbeingMortgageInflationEscalationLatch(input: {
  mortgageStressBand: 'low' | 'elevated' | 'severe';
  wellbeingCostBand: 'stable' | 'strained' | 'critical';
  wave50HousingWellbeingEscalationLatch: boolean;
  mortgageWellbeingEscalationBand: 'contained' | 'building' | 'acute';
  essentialServicesInflationFlag: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): HousingWellbeingMortgageInflationEscalationLatchAssessment {
  let pressure = 0;
  if (input.mortgageStressBand === 'severe') pressure += 0.2;
  else if (input.mortgageStressBand === 'elevated') pressure += 0.11;
  if (input.wellbeingCostBand === 'critical') pressure += 0.18;
  else if (input.wellbeingCostBand === 'strained') pressure += 0.09;
  if (input.wave50HousingWellbeingEscalationLatch) pressure += 0.14;
  if (input.mortgageWellbeingEscalationBand === 'acute') pressure += 0.21;
  else if (input.mortgageWellbeingEscalationBand === 'building') pressure += 0.1;
  if (input.essentialServicesInflationFlag) pressure += 0.08;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const escalationIndex = finRound(100 + pressure * 16.2, 1);

  let latchBand: HousingWellbeingMortgageInflationEscalationLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'essential_crisis';
  else if (pressure >= 0.38) latchBand = 'escalated';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'essential_crisis'
      ? 0.093
      : latchBand === 'escalated'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'essential_crisis' || latchBand === 'escalated'
      ? 'Housing wellbeing mortgage escalation latch elevating shelter CPI metadata.'
      : latchBand === 'building'
        ? 'Mortgage wellbeing escalation latch building under essential stress.'
        : 'Housing wellbeing mortgage escalation latch subdued versus headline CPI.';

  return { latchBand, escalationIndex, inflationScoreNudge, narrative };
}

export function housingWellbeingMortgageInflationEscalationLatchScoreAdjustment(
  band: HousingWellbeingMortgageInflationEscalationLatchBand,
): number {
  if (band === 'essential_crisis') return 4;
  if (band === 'escalated') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: inflation/transport-corridor-freight-inflation-surge-latch.ts ---

export type TransportCorridorFreightInflationSurgeLatchBand =
  | 'clear'
  | 'building'
  | 'surge'
  | 'corridor_rupture';

export interface TransportCorridorFreightInflationSurgeLatchAssessment {
  surgeBand: TransportCorridorFreightInflationSurgeLatchBand;
  corridorIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Transport corridor freight inflation surge latch (Agent 12, round 50). */
export function assessTransportCorridorFreightInflationSurgeLatch(input: {
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  wave50FreightCorridorSurgeLatch: boolean;
  corridorFreightSurgeBand: 'clear' | 'building' | 'ruptured';
  portBacklogBand: 'clear' | 'moderate' | 'severe';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TransportCorridorFreightInflationSurgeLatchAssessment {
  let pressure = 0;
  if (input.freightCapacityBand === 'critical') pressure += 0.21;
  else if (input.freightCapacityBand === 'tight') pressure += 0.12;
  if (input.fuelSurchargeActive) pressure += 0.14;
  if (input.wave50FreightCorridorSurgeLatch) pressure += 0.13;
  if (input.corridorFreightSurgeBand === 'ruptured') pressure += 0.22;
  else if (input.corridorFreightSurgeBand === 'building') pressure += 0.1;
  if (input.portBacklogBand === 'severe') pressure += 0.11;
  else if (input.portBacklogBand === 'moderate') pressure += 0.05;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const corridorIndex = finRound(100 + pressure * 15.8, 1);

  let surgeBand: TransportCorridorFreightInflationSurgeLatchBand = 'clear';
  if (pressure >= 0.57) surgeBand = 'corridor_rupture';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'corridor_rupture'
      ? 0.092
      : surgeBand === 'surge'
        ? 0.059
        : surgeBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    surgeBand === 'corridor_rupture' || surgeBand === 'surge'
      ? 'Transport corridor freight surge latch feeding CPI logistics metadata.'
      : surgeBand === 'building'
        ? 'Corridor freight surge latch building under capacity stress.'
        : 'Transport corridor freight surge latch clear versus headline CPI.';

  return { surgeBand, corridorIndex, inflationScoreNudge, narrative };
}

export function transportCorridorFreightInflationSurgeLatchScoreAdjustment(
  band: TransportCorridorFreightInflationSurgeLatchBand,
): number {
  if (band === 'corridor_rupture') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}


// --- source: credit/loan-pricing.ts ---

export interface LoanPricingQuote {
  baseRate: number;
  spreadMultiplier: number;
  regionalPremium: number;
  effectiveRate: number;
  affordabilityNote: string;
}

export function quoteAdvancedLoanPricing(
  baseRate: number,
  spreadMultiplier: number,
  credit: CreditConditionsBand,
  loanAffordabilityIndex: number,
  regionalPremium = 1,
): LoanPricingQuote {
  const effectiveRate = advancedLoanEffectiveRate(baseRate, spreadMultiplier * regionalPremium);
  let affordabilityNote = 'Macro loan conditions are neutral.';
  if (credit === 'frozen' || credit === 'restricted') {
    affordabilityNote = 'Restricted macro credit — spreads elevated (metadata only).';
  } else if (credit === 'accommodative' && loanAffordabilityIndex >= 60) {
    affordabilityNote = 'Accommodative credit supports prudent borrowing.';
  } else if (loanAffordabilityIndex < 40) {
    affordabilityNote = 'Low loan affordability index — consider deleveraging first.';
  }
  return {
    baseRate,
    spreadMultiplier: finClamp(spreadMultiplier * regionalPremium, 0.88, 1.85),
    regionalPremium,
    effectiveRate,
    affordabilityNote,
  };
}

export function refinanceTimingSignal(
  credit: CreditConditionsBand,
  actorStress: number,
): 'favorable' | 'neutral' | 'defer' {
  if (credit === 'frozen' || credit === 'restricted' || actorStress > 0.75) return 'defer';
  if (credit === 'accommodative' && actorStress < 0.45) return 'favorable';
  return 'neutral';
}


// --- source: investment/climate-link.ts ---

export type InvestmentClimateBand =
  | 'crisis_defensive'
  | 'cautious'
  | 'selective'
  | 'expansionary'
  | 'transformative';

export interface InvestmentClimateLinkAssessment {
  climate: InvestmentClimateBand;
  credit: CreditConditionsBand;
  inflation: InflationConditionsBand;
  readinessScore: number;
  deferMegaproject: boolean;
  rationale: string;
}

const CLIMATE_BASE: Record<InvestmentClimateBand, number> = {
  crisis_defensive: 25,
  cautious: 40,
  selective: 55,
  expansionary: 72,
  transformative: 85,
};

export function assessInvestmentClimateLink(
  climate: InvestmentClimateBand,
  credit: CreditConditionsBand,
  inflation: InflationConditionsBand,
): InvestmentClimateLinkAssessment {
  let score = CLIMATE_BASE[climate];
  if (credit === 'accommodative') score += 8;
  if (credit === 'tight' || credit === 'restricted') score -= 10;
  if (credit === 'frozen') score -= 18;
  if (inflation === 'high' || inflation === 'scenario_runaway') score -= 12;
  if (inflation === 'disinflation') score += 4;
  score = finClamp(score, 0, 100);
  const deferMegaproject =
    score < 45 || credit === 'frozen' || inflation === 'scenario_runaway' || climate === 'crisis_defensive';
  let rationale = 'Investment climate aligns with macro credit and inflation bands.';
  if (deferMegaproject) rationale = 'Defer discretionary megaproject capex until stability and credit normalize.';
  else if (score >= 70) rationale = 'Expansionary window — megaproject readiness elevated (metadata only).';
  return { climate, credit, inflation, readinessScore: score, deferMegaproject, rationale };
}


// --- source: transmission/channels.ts ---

export interface TransmissionChannelHit {
  id: string;
  sourceDomain: string;
  targetDomain: string;
  weight: number;
  explanation: string;
  active: boolean;
  activationReason: string;
}

export function evaluatePolicyTransmissionChannels(
  inputs: MacroFinancialSystemInputs,
): TransmissionChannelHit[] {
  return V1014_FINSTAB_POLICY_TRANSMISSION_CHANNELS.map((ch) => {
    let active = false;
    let activationReason = 'inactive';
    switch (ch.id) {
      case 'fiscal_strain_tightens_credit':
        active = inputs.fiscalPressure === 'strained' || inputs.fiscalPressure === 'critical';
        activationReason = active ? `fiscalPressure=${inputs.fiscalPressure}` : activationReason;
        break;
      case 'debt_service_crowds_lending':
        active = inputs.sovereignDebtPressure === 'high' || inputs.sovereignDebtPressure === 'critical';
        activationReason = active ? `debt=${inputs.sovereignDebtPressure}` : activationReason;
        break;
      case 'capital_flexibility_eases_investment':
        active = inputs.capitalFlexibility === 'high' || inputs.capitalFlexibility === 'very_high';
        activationReason = active ? 'strong capital flexibility' : activationReason;
        break;
      case 'capital_squeeze_freezes_projects':
        active = inputs.capitalFlexibility === 'very_low' || inputs.capitalFlexibility === 'critical';
        activationReason = active ? 'capital squeeze' : activationReason;
        break;
      case 'household_strain_feeds_inflation':
        active =
          inputs.householdAffordability === 'strained' || inputs.householdAffordability === 'severe_pressure';
        activationReason = active ? `affordability=${inputs.householdAffordability}` : activationReason;
        break;
      case 'scenario_inflation_anchor_break':
        active = inputs.highInflationScenario;
        activationReason = active ? 'high inflation scenario' : activationReason;
        break;
      case 'liquidity_shock_stability':
        active = inputs.systemicLiquidityBand === 'strained' || inputs.systemicLiquidityBand === 'critical';
        activationReason = active ? `liquidity=${inputs.systemicLiquidityBand}` : activationReason;
        break;
      case 'public_stability_buffer':
        active = inputs.publicStability >= 55;
        activationReason = active ? `publicStability=${inputs.publicStability}` : activationReason;
        break;
      case 'actor_leverage_warning':
        active = inputs.actorCreditStressIndex > 0.55;
        activationReason = active ? `stress=${inputs.actorCreditStressIndex}` : activationReason;
        break;
      case 'crisis_stack_amplification':
        active = inputs.activeCrises >= 2;
        activationReason = active ? `crises=${inputs.activeCrises}` : activationReason;
        break;
      default:
        break;
    }
    return { ...ch, active, activationReason };
  });
}

export function sumActiveTransmissionWeight(hits: TransmissionChannelHit[], targetDomain: string): number {
  return hits
    .filter((h) => h.active && h.targetDomain === targetDomain)
    .reduce((s, h) => s + h.weight, 0);
}


// --- source: persistence/validate-state.ts ---

export interface MacroFinancialValidationIssue {
  code: string;
  severity: 'warning' | 'error';
  message: string;
}

export function validateNationalMacroFinancialState(state: NationalMacroFinancialState | null | undefined): MacroFinancialValidationIssue[] {
  const issues: MacroFinancialValidationIssue[] = [];
  if (!state) {
    issues.push({ code: 'missing_state', severity: 'error', message: 'State is null' });
    return issues;
  }
  if (state.schemaVersion.length < 3) {
    issues.push({ code: 'schema', severity: 'error', message: 'Invalid schemaVersion' });
  }
  const m = state.modifiers;
  if (m.costOfLivingMultiplier < V1014_FINSTAB_LIMITS.minCostMultiplier - 1e-6) {
    issues.push({ code: 'cost_mult_low', severity: 'error', message: 'costOfLivingMultiplier below min' });
  }
  if (m.costOfLivingMultiplier > V1014_FINSTAB_LIMITS.maxCostMultiplier + 1e-6) {
    issues.push({ code: 'cost_mult_high', severity: 'error', message: 'costOfLivingMultiplier above max' });
  }
  if (m.creditSpreadMultiplier < V1014_FINSTAB_LIMITS.minCreditSpreadMultiplier - 1e-6) {
    issues.push({ code: 'spread_low', severity: 'error', message: 'creditSpreadMultiplier below min' });
  }
  if (m.creditSpreadMultiplier > V1014_FINSTAB_LIMITS.maxCreditSpreadMultiplier + 1e-6) {
    issues.push({ code: 'spread_high', severity: 'error', message: 'creditSpreadMultiplier above max' });
  }
  if (m.loanAffordabilityIndex < 0 || m.loanAffordabilityIndex > 100) {
    issues.push({ code: 'affordability_range', severity: 'error', message: 'loanAffordabilityIndex out of 0-100' });
  }
  if (state.evidence.length > V1014_FINSTAB_LIMITS.maxEvidence) {
    issues.push({ code: 'evidence_cap', severity: 'error', message: 'evidence exceeds maxEvidence' });
  }
  if (state.pressures.length > V1014_FINSTAB_LIMITS.maxPressures) {
    issues.push({ code: 'pressure_cap', severity: 'error', message: 'pressures exceeds maxPressures' });
  }
  if (!state.summary.trim()) {
    issues.push({ code: 'summary_empty', severity: 'warning', message: 'summary is empty' });
  }
  return issues;
}

export function dedupeMacroFinancialEvidence(evidence: MacroFinancialEvidence[]): MacroFinancialEvidence[] {
  const seen = new Set<string>();
  const out: MacroFinancialEvidence[] = [];
  for (const e of evidence) {
    const key = `${e.sourceSystem}:${e.sourceId}:${e.factor}:${e.contribution}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

export function auditModifierIntegrity(state: NationalMacroFinancialState): boolean {
  const m = state.modifiers;
  return (
    finClamp(m.costOfLivingMultiplier, V1014_FINSTAB_LIMITS.minCostMultiplier, V1014_FINSTAB_LIMITS.maxCostMultiplier) ===
      m.costOfLivingMultiplier &&
    finClamp(m.creditSpreadMultiplier, V1014_FINSTAB_LIMITS.minCreditSpreadMultiplier, V1014_FINSTAB_LIMITS.maxCreditSpreadMultiplier) ===
      m.creditSpreadMultiplier &&
    m.investmentRiskPremium >= 0 &&
    m.investmentRiskPremium <= 0.35
  );
}


// --- source: catalog/fiscal-inflation-scenarios.ts ---

export interface MacroFinancialScenarioPreset {
  id: string;
  label: string;
  description: string;
  patch: Partial<MacroFinancialSystemInputs>;
  tags: string[];
}

export const MACRO_FINANCIAL_SCENARIO_PRESETS: readonly MacroFinancialScenarioPreset[] = [
  {
    id: 'baseline_balanced',
    label: 'Balanced baseline',
    description: 'Neutral fiscal, credit, and inflation inputs for regression default.',
    patch: {},
    tags: ['baseline', 'regression'],
  },
  {
    id: 'high_inflation_pass_through',
    label: 'High inflation pass-through',
    description: 'Scenario + multiplier without touching commodity prices.',
    patch: { highInflationScenario: true, inflationSettingMultiplier: 1.25 },
    tags: ['inflation', 'scenario'],
  },
  {
    id: 'credit_shock_stack',
    label: 'Credit shock stack',
    description: 'Active credit shock with strained fiscal spillover.',
    patch: { creditShockActive: true, fiscalPressure: 'strained', actorCreditStressIndex: 0.65 },
    tags: ['credit', 'shock'],
  },
  {
    id: 'liquidity_crisis',
    label: 'Liquidity stress',
    description: 'Systemic liquidity critical with multiple active crises.',
    patch: { systemicLiquidityBand: 'critical', activeCrises: 3, publicStability: 35 },
    tags: ['stability', 'liquidity'],
  },
  {
    id: 'household_cost_wave',
    label: 'Household cost wave',
    description: 'Affordability strain feeding service-cost inflation channel.',
    patch: { householdAffordability: 'severe_pressure', householdInflationScenarioActive: true },
    tags: ['inflation', 'household'],
  },
  {
    id: 'sovereign_risk_tight',
    label: 'Sovereign risk + tight credit',
    description: 'Debt overhang with capital squeeze.',
    patch: {
      sovereignDebtPressure: 'high',
      fiscalSustainability: 'vulnerable',
      capitalFlexibility: 'very_low',
    },
    tags: ['fiscal', 'credit'],
  },
  {
    id: 'wage_spiral_services',
    label: 'Wage–price spiral (services)',
    description: 'Elevated inflation with severe household affordability — macro CPI channel only.',
    patch: {
      highInflationScenario: true,
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.18,
    },
    tags: ['inflation', 'wage', 'round4'],
  },
  {
    id: 'deanchoring_stress',
    label: 'Expectations de-anchoring',
    description: 'Runaway scenario flag with critical fiscal spillover.',
    patch: {
      highInflationScenario: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.35,
      publicStability: 30,
    },
    tags: ['inflation', 'expectations', 'round4'],
  },
  {
    id: 'macro06_demand_overheat',
    label: 'Macro demand overheat (Agent 06 bridge)',
    description: 'Simulates merged Agent 06 demand pressure via multiplier stress.',
    patch: {
      inflationSettingMultiplier: 1.22,
      actorCreditStressIndex: 0.55,
      fiscalPressure: 'strained',
    },
    tags: ['integration', 'agent06', 'round4'],
  },
  {
    id: 'phillips_overheat_stack',
    label: 'Phillips overheat stack',
    description: 'Demand-side overheating with strained fiscal backdrop (Agent 06 merge in sim).',
    patch: {
      inflationSettingMultiplier: 1.28,
      fiscalPressure: 'strained',
      actorCreditStressIndex: 0.48,
      highInflationScenario: true,
    },
    tags: ['inflation', 'phillips', 'round5'],
  },
  {
    id: 'fiscal_dominance_inflation',
    label: 'Fiscal dominance inflation',
    description: 'Critical fiscal pressure with sovereign vulnerability — anchoring stress.',
    patch: {
      fiscalPressure: 'critical',
      sovereignDebtPressure: 'high',
      fiscalSustainability: 'vulnerable',
      highInflationScenario: true,
      inflationSettingMultiplier: 1.2,
    },
    tags: ['fiscal', 'inflation', 'round5'],
  },
  {
    id: 'stagflation_risk_blend',
    label: 'Stagflation risk blend',
    description: 'Elevated inflation with credit restriction and household strain.',
    patch: {
      creditShockActive: true,
      householdAffordability: 'severe_pressure',
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.15,
    },
    tags: ['inflation', 'credit', 'round5'],
  },
  {
    id: 'real_rate_accommodative_stack',
    label: 'Real rate accommodative stack',
    description: 'High inflation score with accommodative credit — negative real rate gap stress.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.32,
      creditShockActive: false,
      actorCreditStressIndex: 0.42,
    },
    tags: ['inflation', 'rates', 'round6'],
  },
  {
    id: 'disinflation_sacrifice_path',
    label: 'Disinflation sacrifice path',
    description: 'Elevated inflation with improving fiscal consolidation metaphor.',
    patch: {
      highInflationScenario: true,
      fiscalPressure: 'strained',
      inflationSettingMultiplier: 1.1,
      publicStability: 55,
    },
    tags: ['inflation', 'disinflation', 'round6'],
  },
  {
    id: 'credit_inflation_vicious_loop',
    label: 'Credit–inflation vicious loop',
    description: 'Credit shock with household extreme stress — amplifying feedback.',
    patch: {
      creditShockActive: true,
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.24,
    },
    tags: ['inflation', 'credit', 'round6'],
  },
  {
    id: 'import_shock_pass_through',
    label: 'Import shock pass-through',
    description: 'Open economy with sharp FX depreciation — import CPI channel.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.28,
      householdAffordability: 'strained',
    },
    tags: ['inflation', 'trade', 'round7'],
  },
  {
    id: 'term_premium_fiscal_stress',
    label: 'Term premium fiscal stress',
    description: 'Critical fiscal and sovereign debt — long-rate inflation signal.',
    patch: {
      fiscalPressure: 'critical',
      sovereignDebtPressure: 'critical',
      fiscalSustainability: 'vulnerable',
      highInflationScenario: true,
      inflationSettingMultiplier: 1.18,
    },
    tags: ['inflation', 'rates', 'round7'],
  },
  {
    id: 'corporate_pricing_power_spike',
    label: 'Corporate pricing power spike',
    description: 'Strong corporate pass-through intent with elevated inflation multiplier.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.35,
      actorCreditStressIndex: 0.52,
      publicStability: 48,
    },
    tags: ['inflation', 'corporate', 'round7'],
  },
  {
    id: 'energy_grid_crisis_pass_through',
    label: 'Energy grid crisis pass-through',
    description: 'Wholesale energy crisis with fragile grid — utility CPI channel.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.26,
      systemicLiquidityBand: 'critical',
      fiscalPressure: 'strained',
    },
    tags: ['inflation', 'energy', 'round8'],
  },
  {
    id: 'urban_shelter_rent_overheat',
    label: 'Urban shelter rent overheat',
    description: 'Critical vacancy with surging rents — shelter CPI dominance.',
    patch: {
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.22,
      highInflationScenario: true,
    },
    tags: ['inflation', 'cities', 'round8'],
  },
  {
    id: 'energy_transition_cost_stack',
    label: 'Energy transition cost stack',
    description: 'Elevated transition costs with tariff shock and fiscal strain.',
    patch: {
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.19,
      highInflationScenario: true,
      publicStability: 42,
    },
    tags: ['inflation', 'energy', 'round8'],
  },
  {
    id: 'food_supply_chain_shock',
    label: 'Food supply chain shock',
    description: 'Harvest stress with supply disruption — grocery CPI pass-through.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.24,
      fiscalPressure: 'strained',
      creditShockActive: true,
    },
    tags: ['inflation', 'food', 'round9'],
  },
  {
    id: 'transport_freight_bottleneck',
    label: 'Transport freight bottleneck',
    description: 'Critical freight capacity with strained liquidity — logistics inflation.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.21,
      systemicLiquidityBand: 'critical',
      fiscalPressure: 'critical',
    },
    tags: ['inflation', 'transport', 'round9'],
  },
  {
    id: 'housing_wellbeing_cost_stack',
    label: 'Housing wellbeing cost stack',
    description: 'Mortgage and essential-services pressure — household inflation flags.',
    patch: {
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.2,
      publicStability: 44,
    },
    tags: ['inflation', 'housing', 'round9'],
  },
  {
    id: 'healthcare_workforce_crisis',
    label: 'Healthcare workforce crisis',
    description: 'Acute wage and capacity pressure in healthcare services CPI.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.23,
      fiscalPressure: 'critical',
      activeCrises: 2,
    },
    tags: ['inflation', 'healthcare', 'round10'],
  },
  {
    id: 'insurance_hard_market_stack',
    label: 'Insurance hard market stack',
    description: 'Claims inflation with reinsurance stress — premium pass-through.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.25,
      creditShockActive: true,
      publicStability: 40,
    },
    tags: ['inflation', 'insurance', 'round10'],
  },
  {
    id: 'research_offset_vs_event_shock',
    label: 'Research offset vs event shock',
    description: 'Productivity relief overwhelmed by national supply disruption.',
    patch: {
      inflationSettingMultiplier: 1.28,
      highInflationScenario: true,
      fiscalPressure: 'strained',
      activeCrises: 1,
    },
    tags: ['inflation', 'events', 'round10'],
  },
  {
    id: 'education_subsidy_cut_stack',
    label: 'Education subsidy cut stack',
    description: 'Fiscal strain with tuition indexation — education CPI pressure.',
    patch: {
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.22,
      highInflationScenario: true,
      householdInflationScenarioActive: true,
    },
    tags: ['inflation', 'education', 'round11'],
  },
  {
    id: 'comms_tariff_platform_spike',
    label: 'Comms tariff platform spike',
    description: 'Regulated tariff shock with liquidity strain — digital services CPI.',
    patch: {
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.2,
      highInflationScenario: true,
    },
    tags: ['inflation', 'comms', 'round11'],
  },
  {
    id: 'modes_extreme_inflation_sandbox',
    label: 'Modes extreme inflation sandbox',
    description: 'Scenario bias extreme with stability erosion — mode-driven inflation.',
    patch: {
      inflationSettingMultiplier: 1.32,
      highInflationScenario: true,
      publicStability: 38,
      activeCrises: 1,
    },
    tags: ['inflation', 'modes', 'round11'],
  },
  {
    id: 'tourism_leisure_boom_pass_through',
    label: 'Tourism leisure boom pass-through',
    description: 'Surging tourism with discretionary pressure — recreation CPI.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.23,
      householdInflationScenarioActive: true,
      publicStability: 46,
    },
    tags: ['inflation', 'leisure', 'round12'],
  },
  {
    id: 'professional_fee_compliance_stack',
    label: 'Professional fee compliance stack',
    description: 'Elevated billing and compliance — professional services CPI.',
    patch: {
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.26,
      creditShockActive: true,
      highInflationScenario: true,
    },
    tags: ['inflation', 'professional', 'round12'],
  },
  {
    id: 'command_team_upside_risk_brief',
    label: 'Command team upside risk brief',
    description: 'Fused macro alert with team upside consensus — inflation flags.',
    patch: {
      inflationSettingMultiplier: 1.3,
      highInflationScenario: true,
      publicStability: 36,
      activeCrises: 2,
    },
    tags: ['inflation', 'command', 'round12'],
  },
  {
    id: 'childcare_capacity_award_stack',
    label: 'Childcare capacity award stack',
    description: 'Severe capacity with award pass-through — childcare CPI.',
    patch: {
      householdAffordability: 'severe_pressure',
      inflationSettingMultiplier: 1.22,
      highInflationScenario: true,
      fiscalPressure: 'strained',
    },
    tags: ['inflation', 'childcare', 'round13'],
  },
  {
    id: 'government_levy_indexation_step',
    label: 'Government levy indexation step',
    description: 'Above-CPI fee indexation with fiscal critical — charges CPI.',
    patch: {
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.24,
      highInflationScenario: true,
      publicStability: 41,
    },
    tags: ['inflation', 'government', 'round13'],
  },
  {
    id: 'turns_automation_inflation_drift',
    label: 'Turns automation inflation drift',
    description: 'Peak season carryover with unattended autopilot drift.',
    patch: {
      inflationSettingMultiplier: 1.27,
      highInflationScenario: true,
      creditShockActive: true,
      activeCrises: 1,
    },
    tags: ['inflation', 'automation', 'round13'],
  },
  {
    id: 'water_drought_utility_crisis',
    label: 'Water drought utility crisis',
    description: 'Severe drought with tariff shock — water utilities CPI.',
    patch: {
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.23,
      highInflationScenario: true,
      fiscalPressure: 'critical',
    },
    tags: ['inflation', 'water', 'round14'],
  },
  {
    id: 'domestic_travel_capacity_overheat',
    label: 'Domestic travel capacity overheat',
    description: 'Constrained routes with full accommodation — travel CPI.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.21,
      publicStability: 43,
    },
    tags: ['inflation', 'travel', 'round14'],
  },
  {
    id: 'strategic_memory_inflation_drift',
    label: 'Strategic memory inflation drift',
    description: 'Expansionary strategic bias with recalled high-inflation regime.',
    patch: {
      inflationSettingMultiplier: 1.29,
      highInflationScenario: true,
      creditShockActive: true,
      activeCrises: 1,
    },
    tags: ['inflation', 'strategic', 'round14'],
  },
  {
    id: 'construction_materials_supply_crunch',
    label: 'Construction materials supply crunch',
    description: 'Severe supply chain with labor pass-through — materials CPI.',
    patch: {
      creditShockActive: true,
      inflationSettingMultiplier: 1.25,
      highInflationScenario: true,
      fiscalPressure: 'critical',
    },
    tags: ['inflation', 'construction', 'round15'],
  },
  {
    id: 'retail_margin_price_led_shelf',
    label: 'Retail margin price-led shelf',
    description: 'Light discounting with high wage bill — retail CPI pass-through.',
    patch: {
      householdAffordability: 'severe_pressure',
      inflationSettingMultiplier: 1.22,
      highInflationScenario: true,
      householdInflationScenarioActive: true,
    },
    tags: ['inflation', 'retail', 'round15'],
  },
  {
    id: 'dashboard_regional_heatmap_alert',
    label: 'Dashboard regional heatmap alert',
    description: 'Critical dashboard urgency with regional inflation alert.',
    patch: {
      inflationSettingMultiplier: 1.26,
      highInflationScenario: true,
      systemicLiquidityBand: 'strained',
      publicStability: 40,
    },
    tags: ['inflation', 'dashboard', 'round15'],
  },
  {
    id: 'financial_services_fee_shock',
    label: 'Financial services fee shock',
    description: 'Funding and compliance stack lifts financial-services CPI.',
    patch: {
      creditShockActive: true,
      inflationSettingMultiplier: 1.24,
      highInflationScenario: true,
      fiscalPressure: 'strained',
    },
    tags: ['inflation', 'finance', 'round16'],
  },
  {
    id: 'agricultural_farmgate_harvest_stress',
    label: 'Agricultural farmgate harvest stress',
    description: 'Severe harvest with strained logistics — farmgate CPI.',
    patch: {
      systemicLiquidityBand: 'critical',
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.23,
      householdAffordability: 'strained',
    },
    tags: ['inflation', 'farmgate', 'round16'],
  },
  {
    id: 'command_fusion_red_farmgate_alert',
    label: 'Command fusion red farmgate alert',
    description: 'Red macro alert with farmgate supply warning.',
    patch: {
      inflationSettingMultiplier: 1.27,
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      publicStability: 38,
    },
    tags: ['inflation', 'command', 'round16'],
  },
  {
    id: 'public_utilities_grid_tariff_stack',
    label: 'Public utilities grid tariff stack',
    description: 'Thin grid margins with rolling outages — electricity/gas CPI.',
    patch: {
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.24,
      highInflationScenario: true,
      creditShockActive: true,
    },
    tags: ['inflation', 'utilities', 'round17'],
  },
  {
    id: 'ui_inflation_salience_stress',
    label: 'UI inflation salience stress',
    description: 'Dashboard stress with high player attention on cost of living.',
    patch: {
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.21,
      highInflationScenario: true,
    },
    tags: ['inflation', 'ui', 'round17'],
  },
  {
    id: 'ui_utilities_fusion_stress',
    label: 'UI & utilities fusion stress',
    description: 'Aligned with macro ui_utilities_stress — grid + presentation salience.',
    patch: {
      inflationSettingMultiplier: 1.28,
      highInflationScenario: true,
      systemicLiquidityBand: 'strained',
      publicStability: 42,
      householdInflationScenarioActive: true,
    },
    tags: ['inflation', 'ui', 'utilities', 'round17'],
  },
  {
    id: 'housing_mortgage_essential_stack',
    label: 'Housing mortgage essential stack',
    description: 'Severe mortgage stress with essential services inflation flag.',
    patch: {
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.22,
      publicStability: 44,
    },
    tags: ['inflation', 'housing', 'round18'],
  },
  {
    id: 'macro_transmission_merge_stress',
    label: 'Macro transmission merge stress',
    description: 'Fragile transmission with recovery rank stress — merge CPI metadata.',
    patch: {
      systemicLiquidityBand: 'strained',
      creditShockActive: true,
      inflationSettingMultiplier: 1.25,
      highInflationScenario: true,
    },
    tags: ['inflation', 'macro', 'round18'],
  },
  {
    id: 'housing_macro_merge_fusion_stress',
    label: 'Housing & macro merge fusion stress',
    description: 'Aligned with Agent 14 inline merge + Agent 06 transmission fragile bands.',
    patch: {
      inflationSettingMultiplier: 1.29,
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      systemicLiquidityBand: 'critical',
      publicStability: 36,
    },
    tags: ['inflation', 'housing', 'macro', 'round18'],
  },
  {
    id: 'dynamic_events_inflation_spillover_stack',
    label: 'Dynamic events inflation spillover stack',
    description: 'National supply disruption with cascade staged cost shock.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.26,
      publicStability: 40,
    },
    tags: ['inflation', 'events', 'round19'],
  },
  {
    id: 'dashboard_map_inflation_overlay_stress',
    label: 'Dashboard map inflation overlay stress',
    description: 'Critical dashboard refresh with regional heatmap alert.',
    patch: {
      householdInflationScenarioActive: true,
      householdAffordability: 'severe_pressure',
      inflationSettingMultiplier: 1.23,
      publicStability: 38,
    },
    tags: ['inflation', 'dashboards', 'round19'],
  },
  {
    id: 'events_dashboard_fusion_stress',
    label: 'Events & dashboard fusion stress',
    description: 'Aligned with Agent 05 spillover + Agent 23 map overlay severe bands.',
    patch: {
      inflationSettingMultiplier: 1.3,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      publicStability: 35,
    },
    tags: ['inflation', 'events', 'dashboards', 'round19'],
  },
  {
    id: 'public_finance_debt_service_stack',
    label: 'Public finance debt service stack',
    description: 'Large deficit with critical debt service and anchor breach.',
    patch: {
      fiscalPressure: 'critical',
      sovereignDebtPressure: 'critical',
      fiscalSustainability: 'vulnerable',
      inflationSettingMultiplier: 1.24,
    },
    tags: ['inflation', 'fiscal', 'round20'],
  },
  {
    id: 'population_labor_wage_stress',
    label: 'Population labor wage stress',
    description: 'Wage surge with extreme cost-of-living stress.',
    patch: {
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      highInflationScenario: true,
      inflationSettingMultiplier: 1.22,
    },
    tags: ['inflation', 'labor', 'round20'],
  },
  {
    id: 'fiscal_labor_fusion_stress',
    label: 'Fiscal & labor fusion stress',
    description: 'Aligned Agent 07 anchor breach + Agent 09 wage de-anchoring.',
    patch: {
      inflationSettingMultiplier: 1.31,
      highInflationScenario: true,
      fiscalPressure: 'critical',
      householdInflationScenarioActive: true,
      householdAffordability: 'severe_pressure',
    },
    tags: ['inflation', 'fiscal', 'labor', 'round20'],
  },
  {
    id: 'wholesale_energy_transition_stack',
    label: 'Wholesale energy transition stack',
    description: 'Energy crisis with cascade wholesale band and tariff shock.',
    patch: {
      systemicLiquidityBand: 'critical',
      highInflationScenario: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.27,
    },
    tags: ['inflation', 'energy', 'round21'],
  },
  {
    id: 'urban_rent_dispersion_stress',
    label: 'Urban rent dispersion stress',
    description: 'Critical vacancy with surging rent growth and dispersion.',
    patch: {
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.24,
      publicStability: 43,
    },
    tags: ['inflation', 'cities', 'round21'],
  },
  {
    id: 'energy_cities_fusion_stress',
    label: 'Energy & cities fusion stress',
    description: 'Aligned Agent 13 cascade + Agent 11 metro dispersion critical.',
    patch: {
      inflationSettingMultiplier: 1.32,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      householdAffordability: 'severe_pressure',
      systemicLiquidityBand: 'critical',
    },
    tags: ['inflation', 'energy', 'cities', 'round21'],
  },
  {
    id: 'corporate_markup_cascade_stack',
    label: 'Corporate markup cascade stack',
    description: 'Active markup cascade with production capacity strain.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'strained',
      inflationSettingMultiplier: 1.28,
    },
    tags: ['inflation', 'corporate', 'round22'],
  },
  {
    id: 'trade_fx_import_pipeline_stress',
    label: 'Trade FX import pipeline stress',
    description: 'Sharp depreciation with critical import pipeline fragility.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.26,
      fiscalPressure: 'critical',
    },
    tags: ['inflation', 'trade', 'round22'],
  },
  {
    id: 'corporate_trade_fusion_stress',
    label: 'Corporate & trade fusion stress',
    description: 'Aligned Agent 08 markup cascade + Agent 15 tariff import shock.',
    patch: {
      inflationSettingMultiplier: 1.33,
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      fiscalPressure: 'critical',
    },
    tags: ['inflation', 'corporate', 'trade', 'round22'],
  },
  {
    id: 'guardian_inflation_intervention_stack',
    label: 'Guardian inflation intervention stack',
    description: 'Tripped guardrail with urgent narrative cascade.',
    patch: {
      highInflationScenario: true,
      publicStability: 36,
      creditShockActive: true,
      inflationSettingMultiplier: 1.27,
    },
    tags: ['inflation', 'guardian', 'round23'],
  },
  {
    id: 'team_consensus_briefing_stress',
    label: 'Team consensus briefing stress',
    description: 'Upside risk outlook with critical briefing urgency.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      actorCreditStressIndex: 0.72,
      inflationSettingMultiplier: 1.25,
    },
    tags: ['inflation', 'team', 'round23'],
  },
  {
    id: 'guardian_team_fusion_stress',
    label: 'Guardian & team fusion stress',
    description: 'Aligned Agent 16 cascade + Agent 18 de-anchoring salience.',
    patch: {
      inflationSettingMultiplier: 1.34,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      publicStability: 34,
    },
    tags: ['inflation', 'guardian', 'team', 'round23'],
  },
  {
    id: 'strategic_geopolitical_premium_stack',
    label: 'Strategic geopolitical premium stack',
    description: 'Expansionary bias with critical strategic inflation risk.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.28,
    },
    tags: ['inflation', 'strategic', 'round24'],
  },
  {
    id: 'ai_memory_recall_salience_stress',
    label: 'AI memory recall salience stress',
    description: 'High regime recall confidence with explainability alert.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      publicStability: 39,
      inflationSettingMultiplier: 1.26,
    },
    tags: ['inflation', 'memory', 'round24'],
  },
  {
    id: 'strategic_memory_fusion_stress',
    label: 'Strategic & memory fusion stress',
    description: 'Aligned Agent 01 cascade + Agent 19 recall salience critical.',
    patch: {
      inflationSettingMultiplier: 1.35,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      publicStability: 33,
      systemicLiquidityBand: 'critical',
    },
    tags: ['inflation', 'strategic', 'memory', 'round24'],
  },
  {
    id: 'calendar_season_carryover_stack',
    label: 'Calendar season carryover stack',
    description: 'Peak demand with persistent multi-turn carryover latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.29,
    },
    tags: ['inflation', 'turns', 'round25'],
  },
  {
    id: 'automation_autopilot_drift_stress',
    label: 'Automation autopilot drift stress',
    description: 'Inflate bias with unattended shock drift and low confidence.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.27,
    },
    tags: ['inflation', 'automation', 'round25'],
  },
  {
    id: 'turns_automation_fusion_stress',
    label: 'Turns & automation fusion stress',
    description: 'Aligned Agent 02 persistent carryover + Agent 20 runaway drift.',
    patch: {
      inflationSettingMultiplier: 1.36,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      publicStability: 32,
    },
    tags: ['inflation', 'turns', 'automation', 'round25'],
  },
  {
    id: 'research_productivity_offset_stack',
    label: 'Research productivity offset stack',
    description: 'Strong supply-side relief with tech-tree latch and building offset band.',
    patch: {
      highInflationScenario: false,
      creditShockActive: false,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 0.94,
    },
    tags: ['inflation', 'research', 'round26'],
  },
  {
    id: 'scenario_sandbox_bias_stress',
    label: 'Scenario sandbox bias stress',
    description: 'Extreme scenario bias with sandbox stress and difficulty cascade.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.31,
      publicStability: 36,
    },
    tags: ['inflation', 'modes', 'round26'],
  },
  {
    id: 'research_modes_fusion_stress',
    label: 'Research & modes fusion stress',
    description: 'Weak research offset colliding with extreme sandbox inflation bias.',
    patch: {
      inflationSettingMultiplier: 1.37,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      publicStability: 34,
    },
    tags: ['inflation', 'research', 'modes', 'round26'],
  },
  {
    id: 'events_supply_persistence_stack',
    label: 'Events supply persistence stack',
    description: 'National supply disruption with entrenched shock persistence latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.28,
    },
    tags: ['inflation', 'events', 'round27'],
  },
  {
    id: 'macro_transmission_slippage_stress',
    label: 'Macro transmission slippage stress',
    description: 'Strong demand with dislocated transmission slippage under liquidity strain.',
    patch: {
      highInflationScenario: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'strained',
      inflationSettingMultiplier: 1.3,
    },
    tags: ['inflation', 'macro', 'round27'],
  },
  {
    id: 'events_macro_fusion_stress',
    label: 'Events & macro fusion stress',
    description: 'Entrenched event persistence colliding with dislocated macro slippage.',
    patch: {
      inflationSettingMultiplier: 1.38,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 33,
    },
    tags: ['inflation', 'events', 'macro', 'round27'],
  },
  {
    id: 'freight_logistics_congestion_stack',
    label: 'Freight logistics congestion stack',
    description: 'Critical freight with gridlocked congestion and fuel surcharges.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'strained',
      inflationSettingMultiplier: 1.29,
    },
    tags: ['inflation', 'transport', 'round28'],
  },
  {
    id: 'housing_wellbeing_essential_stress',
    label: 'Housing wellbeing essential stress',
    description: 'Acute mortgage wellbeing stress with essential services inflation.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.32,
      publicStability: 38,
    },
    tags: ['inflation', 'housing', 'round28'],
  },
  {
    id: 'transport_housing_fusion_stress',
    label: 'Transport & housing fusion stress',
    description: 'Gridlocked logistics colliding with acute shelter essential stress.',
    patch: {
      inflationSettingMultiplier: 1.39,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 32,
    },
    tags: ['inflation', 'transport', 'housing', 'round28'],
  },
  {
    id: 'command_fusion_alert_stack',
    label: 'Command fusion alert stack',
    description: 'Red macro alert with critical command cascade and fusion latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.33,
    },
    tags: ['inflation', 'command', 'round29'],
  },
  {
    id: 'ui_salience_expectations_stress',
    label: 'UI salience expectations stress',
    description: 'Sharp UI expectations nudge with household inflation scenario.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      publicStability: 37,
      inflationSettingMultiplier: 1.3,
    },
    tags: ['inflation', 'ui', 'round29'],
  },
  {
    id: 'command_ui_fusion_stress',
    label: 'Command & UI fusion stress',
    description: 'Critical command fusion colliding with sharp UI salience nudge.',
    patch: {
      inflationSettingMultiplier: 1.4,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 31,
    },
    tags: ['inflation', 'command', 'ui', 'round29'],
  },
  {
    id: 'fiscal_indexation_anchor_breach_stack',
    label: 'Fiscal indexation anchor breach stack',
    description: 'Large deficit with runaway fiscal pass-through cascade latch.',
    patch: {
      highInflationScenario: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.34,
    },
    tags: ['inflation', 'fiscal', 'round30'],
  },
  {
    id: 'household_wage_deanchoring_stress',
    label: 'Household wage de-anchoring stress',
    description: 'Surge wages with unmoored household expectations under COL stress.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.31,
      publicStability: 36,
    },
    tags: ['inflation', 'household', 'round30'],
  },
  {
    id: 'fiscal_household_fusion_stress',
    label: 'Fiscal & household fusion stress',
    description: 'Fiscal indexation cascade colliding with wage-price spiral de-anchoring.',
    patch: {
      inflationSettingMultiplier: 1.41,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 30,
    },
    tags: ['inflation', 'fiscal', 'household', 'round30'],
  },
  {
    id: 'corporate_markup_pass_through_stack',
    label: 'Corporate markup pass-through stack',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.35,
    },
    tags: ['inflation', 'corporate', 'round31'],
  },
  {
    id: 'trade_tariff_pipeline_stress',
    label: 'Trade tariff pipeline stress',
    description: 'Sharp FX depreciation with ruptured exchange pipeline latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.32,
    },
    tags: ['inflation', 'trade', 'round31'],
  },
  {
    id: 'markup_tariff_fusion_stress',
    label: 'Markup & tariff fusion stress',
    description: 'Full corporate markup cascade colliding with ruptured import pipeline.',
    patch: {
      inflationSettingMultiplier: 1.42,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
    },
    tags: ['inflation', 'corporate', 'trade', 'round31'],
  },
  {
    id: 'metro_urban_rent_surge_stack',
    label: 'Metro urban rent surge stack',
    description: 'Critical vacancy with surging rent and metro dispersion latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.36,
      publicStability: 39,
    },
    tags: ['inflation', 'cities', 'round32'],
  },
  {
    id: 'wholesale_grid_tariff_cascade_stress',
    label: 'Wholesale grid tariff cascade stress',
    description: 'Energy crisis with grid tariff latch and cascade band.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.33,
    },
    tags: ['inflation', 'energy', 'round32'],
  },
  {
    id: 'metro_grid_fusion_stress',
    label: 'Metro & grid fusion stress',
    description: 'Critical metro rent surge colliding with wholesale grid crisis.',
    patch: {
      inflationSettingMultiplier: 1.43,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 29,
    },
    tags: ['inflation', 'cities', 'energy', 'round32'],
  },
  {
    id: 'guardian_guardrail_escalation_stack',
    label: 'Guardian guardrail escalation stack',
    description: 'Tripped guardrail with critical co-pilot escalation latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.37,
      publicStability: 38,
    },
    tags: ['inflation', 'guardian', 'round33'],
  },
  {
    id: 'team_briefing_consensus_drift_stress',
    label: 'Team briefing consensus drift stress',
    description: 'Upside consensus with unmoored drift under critical briefings.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.34,
      publicStability: 35,
    },
    tags: ['inflation', 'team', 'round33'],
  },
  {
    id: 'guardian_team_briefing_fusion_stress',
    label: 'Guardian & team briefing fusion stress',
    description: 'Critical guardrail escalation colliding with consensus shock drift.',
    patch: {
      inflationSettingMultiplier: 1.44,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 28,
    },
    tags: ['inflation', 'guardian', 'team', 'round33'],
  },
  {
    id: 'memory_commonwealth_recall_gate_stack',
    label: 'Memory commonwealth recall gate stack',
    description: 'Breached realm recall with commonwealth inflation latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.38,
      publicStability: 37,
    },
    tags: ['inflation', 'memory', 'round34'],
  },
  {
    id: 'automation_synthesis_cascade_drift_stress',
    label: 'Automation synthesis cascade drift stress',
    description: 'Runaway cascade stack under unattended autopilot shock drift.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.35,
      publicStability: 36,
    },
    tags: ['inflation', 'automation', 'round34'],
  },
  {
    id: 'memory_automation_commonwealth_fusion_stress',
    label: 'Memory & automation commonwealth fusion stress',
    description: 'Commonwealth recall gate colliding with synthesis runaway cascade.',
    patch: {
      inflationSettingMultiplier: 1.45,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 27,
    },
    tags: ['inflation', 'memory', 'automation', 'round34'],
  },
  {
    id: 'ui_shell_salience_escalation_stack',
    label: 'UI shell salience escalation stack',
    description: 'Critical shell expectations under dashboard stress highlight.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.39,
      publicStability: 38,
    },
    tags: ['inflation', 'ui', 'round35'],
  },
  {
    id: 'dashboard_heatmap_overlay_cascade_stress',
    label: 'Dashboard heatmap overlay cascade stress',
    description: 'Critical overlay cascade with regional inflation latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.36,
      publicStability: 35,
    },
    tags: ['inflation', 'dashboard', 'round35'],
  },
  {
    id: 'ui_dashboard_wave35_fusion_stress',
    label: 'UI & dashboard wave 35 fusion stress',
    description: 'Shell-critical salience colliding with heatmap overlay cascade.',
    patch: {
      inflationSettingMultiplier: 1.46,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 26,
    },
    tags: ['inflation', 'ui', 'dashboard', 'round35'],
  },
  {
    id: 'command_fusion_latch_escalation_stack',
    label: 'Command fusion latch escalation stack',
    description: 'Critical command inflation escalation with wave fusion latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.4,
      publicStability: 37,
    },
    tags: ['inflation', 'command', 'round36'],
  },
  {
    id: 'transport_freight_congestion_cascade_stress',
    label: 'Transport freight congestion cascade stress',
    description: 'Ruptured freight cascade with logistics inflation latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.37,
      publicStability: 34,
    },
    tags: ['inflation', 'transport', 'round36'],
  },
  {
    id: 'command_transport_wave36_fusion_stress',
    label: 'Command & transport wave 36 fusion stress',
    description: 'Fusion runaway latch colliding with logistics rupture cascade.',
    patch: {
      inflationSettingMultiplier: 1.47,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 25,
    },
    tags: ['inflation', 'command', 'transport', 'round36'],
  },
  {
    id: 'events_staged_shock_persistence_stack',
    label: 'Events staged shock persistence stack',
    description: 'Entrenched staged shock with wave event inflation latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.41,
      publicStability: 36,
    },
    tags: ['inflation', 'events', 'round37'],
  },
  {
    id: 'modes_sandbox_stress_cascade_stress',
    label: 'Modes sandbox stress cascade stress',
    description: 'Runaway scenario bias under sandbox stress latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.38,
      publicStability: 34,
    },
    tags: ['inflation', 'modes', 'round37'],
  },
  {
    id: 'events_modes_wave37_fusion_stress',
    label: 'Events & modes wave 37 fusion stress',
    description: 'Narrative cascade persistence colliding with bias runaway sandbox.',
    patch: {
      inflationSettingMultiplier: 1.48,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 24,
    },
    tags: ['inflation', 'events', 'modes', 'round37'],
  },
  {
    id: 'fiscal_appropriation_pressure_latch_stack',
    label: 'Fiscal appropriation pressure latch stack',
    description: 'Critical fiscal escalation with appropriation inflation latch.',
    patch: {
      highInflationScenario: true,
      fiscalPressure: 'critical',
      creditShockActive: true,
      inflationSettingMultiplier: 1.42,
      publicStability: 35,
    },
    tags: ['inflation', 'fiscal', 'round38'],
  },
  {
    id: 'household_budget_stress_cascade_stress',
    label: 'Household budget stress cascade stress',
    description: 'Ruptured household stress cascade with budget latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.39,
      publicStability: 33,
    },
    tags: ['inflation', 'household', 'round38'],
  },
  {
    id: 'fiscal_household_wave38_fusion_stress',
    label: 'Fiscal & household wave 38 fusion stress',
    description: 'Appropriation runaway latch colliding with budget collapse cascade.',
    patch: {
      inflationSettingMultiplier: 1.49,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 23,
    },
    tags: ['inflation', 'fiscal', 'household', 'round38'],
  },
  {
    id: 'corporate_survival_pricing_latch_stack',
    label: 'Corporate survival pricing latch stack',
    description: 'Dominant markup escalation with survival pricing latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.43,
      publicStability: 36,
    },
    tags: ['inflation', 'corporate', 'round39'],
  },
  {
    id: 'trade_tariff_exchange_escalation_stress',
    label: 'Trade tariff exchange escalation stress',
    description: 'Ruptured import exchange under tariff latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.4,
      publicStability: 32,
    },
    tags: ['inflation', 'trade', 'round39'],
  },
  {
    id: 'corporate_trade_wave39_fusion_stress',
    label: 'Corporate & trade wave 39 fusion stress',
    description: 'Survival runaway pricing colliding with exchange crisis escalation.',
    patch: {
      inflationSettingMultiplier: 1.5,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 22,
    },
    tags: ['inflation', 'corporate', 'trade', 'round39'],
  },
  {
    id: 'metro_capacity_rent_latch_stack',
    label: 'Metro capacity rent latch stack',
    description: 'Critical vacancy with urban rent latch under capacity stress.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.44,
      publicStability: 35,
    },
    tags: ['inflation', 'cities', 'round40'],
  },
  {
    id: 'grid_wholesale_tariff_surge_stress',
    label: 'Grid wholesale tariff surge stress',
    description: 'Wholesale cascade under grid tariff latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.41,
      publicStability: 31,
    },
    tags: ['inflation', 'energy', 'round40'],
  },
  {
    id: 'cities_energy_wave40_fusion_stress',
    label: 'Cities & energy wave 40 fusion stress',
    description: 'Capacity crisis rent latch colliding with grid tariff surge.',
    patch: {
      inflationSettingMultiplier: 1.51,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 21,
    },
    tags: ['inflation', 'cities', 'energy', 'round40'],
  },
  {
    id: 'guardian_copilot_pressure_latch_stack',
    label: 'Guardian co-pilot pressure latch stack',
    description: 'Runaway co-pilot escalation with guardian pressure latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.45,
      publicStability: 34,
    },
    tags: ['inflation', 'guardian', 'round41'],
  },
  {
    id: 'team_briefing_consensus_unmoor_stress',
    label: 'Team briefing consensus unmoor stress',
    description: 'Ruptured briefing consensus under team latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.42,
      publicStability: 30,
    },
    tags: ['inflation', 'team', 'round41'],
  },
  {
    id: 'guardian_team_wave41_fusion_stress',
    label: 'Guardian & team wave 41 fusion stress',
    description: 'Runaway guardian latch colliding with consensus rupture.',
    patch: {
      inflationSettingMultiplier: 1.52,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 20,
    },
    tags: ['inflation', 'guardian', 'team', 'round41'],
  },
  {
    id: 'memory_realm_persistence_latch_stack',
    label: 'Memory realm persistence latch stack',
    description: 'Ruptured realm gate with memory recall latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.46,
      publicStability: 33,
    },
    tags: ['inflation', 'memory', 'round42'],
  },
  {
    id: 'automation_synthesis_cascade_surge_stress',
    label: 'Automation synthesis cascade surge stress',
    description: 'Autopilot surge under synthesis cascade latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.43,
      publicStability: 29,
    },
    tags: ['inflation', 'automation', 'round42'],
  },
  {
    id: 'memory_automation_wave42_fusion_stress',
    label: 'Memory & automation wave 42 fusion stress',
    description: 'Realm rupture latch colliding with autopilot runaway surge.',
    patch: {
      inflationSettingMultiplier: 1.53,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 19,
    },
    tags: ['inflation', 'memory', 'automation', 'round42'],
  },
  {
    id: 'ui_shell_attention_latch_stack',
    label: 'UI shell attention latch stack',
    description: 'Critical player salience under shell attention latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.47,
      publicStability: 32,
    },
    tags: ['inflation', 'ui', 'round43'],
  },
  {
    id: 'dashboard_regional_overlay_surge_stress',
    label: 'Dashboard regional overlay surge stress',
    description: 'Regional overlay surge under heatmap latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.44,
      publicStability: 28,
    },
    tags: ['inflation', 'dashboard', 'round43'],
  },
  {
    id: 'ui_dashboard_wave43_fusion_stress',
    label: 'UI & dashboard wave 43 fusion stress',
    description: 'Attention crisis latch colliding with heatmap overlay surge.',
    patch: {
      inflationSettingMultiplier: 1.54,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 18,
    },
    tags: ['inflation', 'ui', 'dashboard', 'round43'],
  },
  {
    id: 'command_alert_pressure_latch_stack',
    label: 'Command alert pressure latch stack',
    description: 'Critical command alert pressure under fusion latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.48,
      publicStability: 31,
    },
    tags: ['inflation', 'command', 'round44'],
  },
  {
    id: 'transport_freight_gridlock_surge_stress',
    label: 'Transport freight gridlock surge stress',
    description: 'Ruptured freight gridlock under logistics latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.45,
      publicStability: 27,
    },
    tags: ['inflation', 'transport', 'round44'],
  },
  {
    id: 'command_transport_wave44_fusion_stress',
    label: 'Command & transport wave 44 fusion stress',
    description: 'Alert crisis latch colliding with freight gridlock surge.',
    patch: {
      inflationSettingMultiplier: 1.55,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 17,
    },
    tags: ['inflation', 'command', 'transport', 'round44'],
  },
  {
    id: 'events_narrative_shock_latch_stack',
    label: 'Events narrative shock latch stack',
    description: 'Entrenched narrative shock under event latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.49,
      publicStability: 30,
    },
    tags: ['inflation', 'events', 'round45'],
  },
  {
    id: 'modes_sandbox_pressure_surge_stress',
    label: 'Modes sandbox pressure surge stress',
    description: 'Scenario surge under sandbox pressure latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.46,
      publicStability: 26,
    },
    tags: ['inflation', 'modes', 'round45'],
  },
  {
    id: 'events_modes_wave45_fusion_stress',
    label: 'Events & modes wave 45 fusion stress',
    description: 'Shock crisis latch colliding with sandbox pressure surge.',
    patch: {
      inflationSettingMultiplier: 1.56,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 16,
    },
    tags: ['inflation', 'events', 'modes', 'round45'],
  },
  {
    id: 'fiscal_consolidated_pressure_latch_stack',
    label: 'Fiscal consolidated pressure latch stack',
    description: 'Consolidated deficit escalation under fiscal pressure latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.5,
      publicStability: 28,
    },
    tags: ['inflation', 'fiscal', 'round46'],
  },
  {
    id: 'household_wage_stress_surge_stress',
    label: 'Household wage stress surge stress',
    description: 'Wage stress surge under household inflation latch.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.47,
      publicStability: 24,
    },
    tags: ['inflation', 'household', 'round46'],
  },
  {
    id: 'fiscal_household_wave46_fusion_stress',
    label: 'Fiscal & household wave 46 fusion stress',
    description: 'Fiscal crisis latch colliding with wage stress surge.',
    patch: {
      inflationSettingMultiplier: 1.57,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 15,
    },
    tags: ['inflation', 'fiscal', 'household', 'round46'],
  },
  {
    id: 'macro_output_gap_latch_stack',
    label: 'Macro output-gap latch stack',
    description: 'Output-gap escalation under macro demand latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.51,
      publicStability: 26,
    },
    tags: ['inflation', 'macro', 'round47'],
  },
  {
    id: 'corporate_capacity_markup_surge_stress',
    label: 'Corporate capacity markup surge stress',
    description: 'Capacity constraint markup surge under pricing power.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.48,
      publicStability: 22,
    },
    tags: ['inflation', 'corporate', 'round47'],
  },
  {
    id: 'macro_corporate_wave47_fusion_stress',
    label: 'Macro & corporate wave 47 fusion stress',
    description: 'Output-gap latch colliding with capacity markup surge.',
    patch: {
      inflationSettingMultiplier: 1.58,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 14,
    },
    tags: ['inflation', 'macro', 'corporate', 'round47'],
  },
  {
    id: 'research_breakthrough_supply_latch_stack',
    label: 'Research breakthrough supply-side latch stack',
    description: 'Innovation latch failing under supply-side stress.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.52,
      publicStability: 27,
    },
    tags: ['inflation', 'research', 'round48'],
  },
  {
    id: 'trade_import_exchange_pipeline_surge_stress',
    label: 'Trade import exchange pipeline surge stress',
    description: 'Import pipeline surge under exchange depreciation.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.49,
      publicStability: 23,
    },
    tags: ['inflation', 'trade', 'round48'],
  },
  {
    id: 'research_trade_wave48_fusion_stress',
    label: 'Research & trade wave 48 fusion stress',
    description: 'Breakthrough latch colliding with import pipeline surge.',
    patch: {
      inflationSettingMultiplier: 1.59,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 13,
    },
    tags: ['inflation', 'research', 'trade', 'round48'],
  },
  {
    id: 'metro_regional_rent_escalation_latch_stack',
    label: 'Metro regional rent escalation latch stack',
    description: 'Regional rent escalation under metro dispersion latch.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      creditShockActive: true,
      inflationSettingMultiplier: 1.53,
      publicStability: 25,
    },
    tags: ['inflation', 'cities', 'round49'],
  },
  {
    id: 'wholesale_grid_transition_surge_stress',
    label: 'Wholesale grid transition surge stress',
    description: 'Grid transition surge under wholesale energy crisis.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.5,
      publicStability: 21,
    },
    tags: ['inflation', 'energy', 'round49'],
  },
  {
    id: 'metro_grid_wave49_fusion_stress',
    label: 'Metro & grid wave 49 fusion stress',
    description: 'Regional rent escalation colliding with grid transition surge.',
    patch: {
      inflationSettingMultiplier: 1.6,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 12,
    },
    tags: ['inflation', 'cities', 'energy', 'round49'],
  },
  {
    id: 'trade_cleared_forward_arc_handoff_stack',
    label: 'Trade cleared forward-arc handoff stack',
    description: 'Forward-arc handoff continuity failing under import stress.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.53,
      publicStability: 28,
    },
    tags: ['inflation', 'trade', 'round49'],
  },
  {
    id: 'guardian_entrustment_envelope_surge_stress',
    label: 'Guardian entrustment envelope surge stress',
    description: 'Entrustment envelope rupture under guardrail trip.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.5,
      publicStability: 24,
    },
    tags: ['inflation', 'guardian', 'round49'],
  },
  {
    id: 'trade_guardian_wave49_fusion_stress',
    label: 'Trade & guardian wave 49 fusion stress',
    description: 'Cleared forward-arc handoff colliding with entrustment envelope surge.',
    patch: {
      inflationSettingMultiplier: 1.61,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 11,
    },
    tags: ['inflation', 'trade', 'guardian', 'round49'],
  },
  {
    id: 'housing_wellbeing_mortgage_escalation_latch_stack',
    label: 'Housing wellbeing mortgage escalation latch stack',
    description: 'Mortgage wellbeing escalation under essential services stress.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.54,
      fiscalPressure: 'critical',
      publicStability: 24,
    },
    tags: ['inflation', 'housing', 'round50'],
  },
  {
    id: 'transport_corridor_freight_surge_stress',
    label: 'Transport corridor freight surge stress',
    description: 'Corridor freight surge under critical capacity and fuel surcharge.',
    patch: {
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.51,
      publicStability: 22,
    },
    tags: ['inflation', 'transport', 'round50'],
  },
  {
    id: 'housing_transport_wave50_fusion_stress',
    label: 'Housing & transport wave 50 fusion stress',
    description: 'Mortgage wellbeing escalation colliding with corridor freight surge.',
    patch: {
      inflationSettingMultiplier: 1.61,
      highInflationScenario: true,
      creditShockActive: true,
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      systemicLiquidityBand: 'critical',
      publicStability: 10,
    },
    tags: ['inflation', 'housing', 'transport', 'round50'],
  },
] as const;

export function getMacroFinancialScenarioPreset(id: string): MacroFinancialScenarioPreset | undefined {
  return MACRO_FINANCIAL_SCENARIO_PRESETS.find((p) => p.id === id);
}

export function applyMacroFinancialScenarioPreset(
  base: MacroFinancialSystemInputs,
  presetId: string,
): MacroFinancialSystemInputs | null {
  const preset = getMacroFinancialScenarioPreset(presetId);
  if (!preset) return null;
  return {
    ...base,
    ...preset.patch,
    regions: { ...base.regions, ...(preset.patch.regions || {}) },
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


// --- source: integration/query-co-pilot.ts ---
  MacroFinancialComputeResult,
  MacroFinancialQuery,
  MacroFinancialWorldRootEvent,
  NationalMacroFinancialState,
  V1014_FINSTAB_QueryTopic,
} from '../definitions/types.js';

export function macroFinancialActionAlignment(
  state: NationalMacroFinancialState | null | undefined,
  candidate: { kind?: string; category?: string; programId?: string },
): { scoreDelta: number; rationale: string } | null {
  if (!state) return null;
  const text = `${candidate.kind || ''} ${candidate.category || ''} ${candidate.programId || ''}`.toLowerCase();
  let delta = 0;
  let rationale = 'Neutral macro-financial alignment.';
  if (text.includes('loan') || text.includes('credit') || text.includes('borrow')) {
    if (state.credit === 'frozen' || state.credit === 'restricted') {
      delta -= 4;
      rationale = 'Restricted macro credit conditions — borrowing is poorly timed.';
    } else if (state.credit === 'accommodative') {
      delta += 1.5;
      rationale = 'Accommodative credit conditions support prudent leverage.';
    }
  }
  if (text.includes('invest') || text.includes('infrastructure') || text.includes('megaproject')) {
    if (state.stability === 'crisis' || state.stability === 'stressed') {
      delta -= 3;
      rationale = 'Financial stability under stress — major capital calls face higher risk premium.';
    }
    if (state.stance === 'restrictive' && state.inflation === 'high') {
      delta -= 2;
      rationale = 'Restrictive macro stance during high inflation — defer discretionary capex.';
    }
  }
  return { scoreDelta: finClamp(delta, -6, 6), rationale };
}

export function macroFinancialGuardianWarning(
  state: NationalMacroFinancialState | null | undefined,
  ctx: { actionLabel?: string; category?: string },
): string | null {
  if (!state) return null;
  const cat = String(ctx.category || '').toLowerCase();
  if ((cat.includes('loan') || cat.includes('credit')) && (state.credit === 'frozen' || state.credit === 'restricted')) {
    return `Macro credit conditions are ${V1014_FINSTAB_CREDIT_LABEL[state.credit]} — new borrowing may face punitive spreads (metadata warning only).`;
  }
  if (state.stability === 'crisis') {
    return 'National financial stability is in crisis band — consider liquidity preservation (warning only).';
  }
  return null;
}

export function detectMacroFinancialQuery(raw: string): MacroFinancialQuery | null {
  const q = ` ${String(raw || '').toLowerCase()} `;
  const regionId = V1014_FINSTAB_CORE_REGIONS.find((r) => q.includes(` ${r.toLowerCase()} `)) || null;
  const mk = (topic: V1014_FINSTAB_QueryTopic): MacroFinancialQuery => ({ topic, regionId, rawQuestion: raw });
  if (/\b(financial stability|systemic risk|macro stability)\b/.test(q)) return mk('stability');
  if (/\b(credit conditions|tight credit|loan conditions|borrowing conditions)\b/.test(q)) return mk('credit');
  if (/\b(inflation|cost of living|price pressure)\b/.test(q) && !/\bcommodity\b/.test(q)) return mk('inflation');
  if (/\b(monetary policy|policy stance|interest rate stance)\b/.test(q)) return mk('stance');
  if (/\b(fiscal spillover|budget.*credit|debt.*credit)\b/.test(q)) return mk('fiscal_spillover');
  if (/\b(investment climate|capital allocation).*\b(credit|stability)\b/.test(q)) return mk('investment_climate_link');
  if (regionId && /\b(spread|regional credit)\b/.test(q)) return mk('regional_spread');
  if (/\b(macro financial|monetary conditions|v10\.14)\b/.test(q)) return mk('overview');
  return null;
}

export function answerMacroFinancialQuestion(
  state: NationalMacroFinancialState | null | undefined,
  question: string,
): {
  fact: string;
  calculated: string;
  inference: string;
  projection: string;
} {
  if (!state) {
    return {
      fact: 'Macro financial stability layer is not active.',
      calculated: 'No modifiers applied.',
      inference: 'Enable national systems and macro financial stability in settings.',
      projection: 'Neutral macro path assumed.',
    };
  }
  const q = detectMacroFinancialQuery(question);
  const m = state.modifiers;
  const fact = `${state.summary} Policy stance: ${state.stance.replace(/_/g, ' ')}.`;
  const calculated = `Cost-of-living multiplier ${m.costOfLivingMultiplier.toFixed(2)}; credit spread ${m.creditSpreadMultiplier.toFixed(2)}; stability index ${m.financialStabilityIndex.toFixed(0)}/100.`;
  let inference = 'Conditions are broadly consistent with current fiscal and capital signals.';
  if (state.stability === 'watch' || state.stability === 'stressed') {
    inference = 'Financial stability warrants caution on concurrent large loans and megaproject commitments.';
  }
  if (state.inflation === 'high' || state.inflation === 'scenario_runaway') {
    inference = 'Inflation pass-through elevates service/travel costs without rewriting commodity market prices.';
  }
  let projection = 'If fiscal and capital inputs stabilize, credit conditions may normalize within a few turns.';
  if (q?.topic === 'credit' && state.credit === 'tight') {
    projection = 'Credit may remain tight until fiscal pressure eases or capital flexibility improves (V10.9/V10.12).';
  }
  return { fact, calculated, inference, projection };
}

export function macroFinancialWorldRoots(
  enabled: boolean,
  events: MacroFinancialComputeResult['events'],
  day = 1,
): MacroFinancialWorldRootEvent[] {
  if (!enabled || !events?.length) return [];
  return events.map((e) => ({
    id: `swr_${e.id}`,
    turn: e.turn,
    day,
    sourceSystem: 'macro_financial',
    sourceEventId: e.id,
    kind: e.kind,
    significance: e.significance,
    visibility: 'public' as const,
    summary: e.summary,
    title: e.title,
    affectedDomains: ['economy', 'finance'],
  }));
}


// --- source: integration/regression-harness.ts ---

export interface MacroFinancialTurnSimulationRow {
  turn: number;
  inflation: NationalMacroFinancialState['inflation'];
  credit: NationalMacroFinancialState['credit'];
  stability: NationalMacroFinancialState['stability'];
  costMult: number;
  spreadMult: number;
  eventCount: number;
}

export interface MacroFinancialTurnSimulationResult {
  rows: MacroFinancialTurnSimulationRow[];
  finalPersisted: MacroFinancialPersisted;
  finalState: NationalMacroFinancialState;
}

/** Multi-turn deterministic harness for regression / Agent 25 smoke (no wallet mutation). */
export function simulateMacroFinancialTurns(
  turnCount: number,
  mutate?: (turn: number, base: ReturnType<typeof makeDefaultMacroFinancialTestInputs>) => ReturnType<typeof makeDefaultMacroFinancialTestInputs>,
): MacroFinancialTurnSimulationResult {
  const rows: MacroFinancialTurnSimulationRow[] = [];
  let persisted: MacroFinancialPersisted | null = null;
  let prev: NationalMacroFinancialState | null = null;
  for (let t = 1; t <= turnCount; t++) {
    let inputs = makeDefaultMacroFinancialTestInputs({ turn: t });
    if (mutate) inputs = mutate(t, inputs);
    const r = computeNationalMacroFinancialConditions(inputs, persisted, prev);
    persisted = r.persisted;
    prev = r.state;
    rows.push({
      turn: t,
      inflation: r.state.inflation,
      credit: r.state.credit,
      stability: r.state.stability,
      costMult: r.state.modifiers.costOfLivingMultiplier,
      spreadMult: r.state.modifiers.creditSpreadMultiplier,
      eventCount: r.events.length,
    });
  }
  return { rows, finalPersisted: persisted!, finalState: prev! };
}

export function detectSimulationStressSpiral(rows: MacroFinancialTurnSimulationRow[]): boolean {
  if (rows.length < 3) return false;
  const spreads = rows.map((r) => r.spreadMult);
  return spreads[spreads.length - 1] > spreads[0] + 0.08;
}


// --- source: integration/save-bridge.ts ---

export interface MacroFinancialSaveBridge {
  schemaVersion: string;
  persisted: MacroFinancialPersisted;
  snapshot?: Pick<
    NationalMacroFinancialState,
    'inflation' | 'credit' | 'stability' | 'stance' | 'modifiers' | 'turn'
  >;
}

export function exportMacroFinancialSaveBridge(
  persisted: MacroFinancialPersisted,
  state?: NationalMacroFinancialState | null,
): MacroFinancialSaveBridge {
  return {
    schemaVersion: V1014_FINSTAB_SCHEMA_VERSION,
    persisted,
    snapshot: state
      ? {
          turn: state.turn,
          inflation: state.inflation,
          credit: state.credit,
          stability: state.stability,
          stance: state.stance,
          modifiers: { ...state.modifiers },
        }
      : undefined,
  };
}

export function importMacroFinancialSaveBridge(raw: unknown, turn = 1): MacroFinancialSaveBridge | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const persisted = sanitizeMacroFinancialPersisted(r.persisted ?? r, turn);
  if (!persisted) return null;
  return {
    schemaVersion: String(r.schemaVersion || V1014_FINSTAB_SCHEMA_VERSION),
    persisted,
    snapshot: undefined,
  };
}

export function saveBridgeJsonSize(bridge: MacroFinancialSaveBridge): number {
  return JSON.stringify(bridge).length;
}


// --- source: integration/agent06-macro-bridge.ts ---

/** Read-only snapshot shape from Agent 06 macroeconomy module (contract only). */
export interface Agent06MacroSnapshot {
  turn: number;
  gdpGrowthBand: 'contraction' | 'slow' | 'steady' | 'strong';
  unemploymentBand: 'low' | 'moderate' | 'elevated' | 'severe';
  outputGap: number;
  nominalDemandPressure: number;
  /** Round 18: fragile macro transmission stability layer (Agent 06 round 17). */
  transmissionStabilityFragile?: boolean;
  /** Round 18: recovery-oriented scenario rank under stress. */
  macroRecoveryRankStressActive?: boolean;
  /** Round 27: macro demand overheat inflation latch. */
  macroDemandOverheatLatch?: boolean;
  /** Round 27: transmission slippage band. */
  transmissionSlippageBand?: 'stable' | 'slipping' | 'dislocated';
  /** Round 47: macro output-gap inflation latch. */
  wave47MacroOutputGapLatch?: boolean;
  /** Round 47: output-gap escalation band. */
  outputGapEscalationBand?: 'stable' | 'elevated' | 'critical';
}

export function mergeAgent06IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent06MacroSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;
  const demand = finClamp(snapshot.nominalDemandPressure, -1, 1);
  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (demand > 0.35) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + demand * 0.08, 0.85, 1.45);
  }

  let actorCreditStressIndex = base.actorCreditStressIndex ?? 0.35;
  if (snapshot.unemploymentBand === 'severe') {
    actorCreditStressIndex = finClamp(actorCreditStressIndex + 0.12, 0, 1);
  }

  let fiscalPressure = base.fiscalPressure;
  if (snapshot.gdpGrowthBand === 'contraction' && fiscalPressure === 'healthy') {
    fiscalPressure = 'tight';
  }

  if (snapshot.transmissionStabilityFragile) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }
  if (snapshot.macroRecoveryRankStressActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.macroDemandOverheatLatch && snapshot.transmissionSlippageBand === 'dislocated') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.transmissionSlippageBand === 'slipping' && demand > 0.25) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  let highInflationScenario =
    base.highInflationScenario ||
    snapshot.transmissionStabilityFragile === true ||
    snapshot.macroRecoveryRankStressActive === true;

  if (snapshot.wave47MacroOutputGapLatch && snapshot.outputGapEscalationBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.outputGapEscalationBand === 'elevated' && snapshot.outputGap > 0.35) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    actorCreditStressIndex,
    fiscalPressure,
    highInflationScenario,
    systemicLiquidityBand:
      snapshot.transmissionStabilityFragile &&
      base.systemicLiquidityBand !== 'critical' &&
      base.systemicLiquidityBand !== 'strained'
        ? 'strained'
        : base.systemicLiquidityBand,
  };
}

export function agent06BridgeIntegrationNote(): string {
  return 'Agent 06 macro snapshot adjusts inflation multiplier and credit stress only; commodity resourcePrices unchanged.';
}


// --- source: integration/agent07-fiscal-bridge.ts ---

/** Read-only fiscal snapshot from Agent 07 public finance (contract only). */
export interface Agent07FiscalSnapshot {
  turn: number;
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  revenueMomentum: 'weak' | 'steady' | 'strong';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  /** Round 20: fiscal anchor breach feeding indexed charges CPI. */
  fiscalAnchorBreached?: boolean;
  /** Round 20: government indexed charges pass-through active. */
  indexedChargesInflationPassThrough?: boolean;
  /** Round 30: debt indexation inflation latch. */
  debtIndexationInflationLatch?: boolean;
  /** Round 30: fiscal pass-through cascade band. */
  fiscalPassThroughCascadeBand?: 'muted' | 'building' | 'runaway';
  /** Round 38: appropriation inflation latch. */
  wave38AppropriationInflationLatch?: boolean;
  /** Round 38: fiscal pressure escalation band. */
  fiscalPressureEscalationBand?: 'stable' | 'elevated' | 'critical';
  /** Round 46: fiscal pressure inflation latch. */
  wave46FiscalPressureLatch?: boolean;
  /** Round 46: consolidated deficit escalation band. */
  consolidatedDeficitEscalationBand?: 'stable' | 'elevated' | 'critical';
}

export function mergeAgent07IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent07FiscalSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let fiscalPressure = base.fiscalPressure;
  if (snapshot.consolidatedDeficitBand === 'large_deficit') {
    if (snapshot.debtServicePressure === 'critical' || fiscalPressure === 'strained') {
      fiscalPressure = 'critical';
    } else if (fiscalPressure === 'healthy') {
      fiscalPressure = 'strained';
    } else if (fiscalPressure === 'tight') {
      fiscalPressure = 'critical';
    }
  } else if (snapshot.consolidatedDeficitBand === 'moderate_deficit' && fiscalPressure === 'healthy') {
    fiscalPressure = 'tight';
  }

  let sovereignDebtPressure = base.sovereignDebtPressure;
  if (snapshot.debtServicePressure === 'critical') {
    sovereignDebtPressure = 'critical';
  } else if (snapshot.debtServicePressure === 'elevated' && sovereignDebtPressure === 'manageable') {
    sovereignDebtPressure = 'elevated';
  }

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.revenueMomentum === 'weak' && snapshot.debtServicePressure !== 'low') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let fiscalSustainability = base.fiscalSustainability;
  if (snapshot.debtServicePressure === 'critical') {
    fiscalSustainability = 'vulnerable';
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.fiscalAnchorBreached && snapshot.indexedChargesInflationPassThrough) {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.fiscalAnchorBreached) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.debtIndexationInflationLatch && snapshot.fiscalPassThroughCascadeBand === 'runaway') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.fiscalPassThroughCascadeBand === 'building' && snapshot.debtServicePressure === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave38AppropriationInflationLatch && snapshot.fiscalPressureEscalationBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.fiscalPressureEscalationBand === 'elevated' && snapshot.consolidatedDeficitBand === 'large_deficit') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave46FiscalPressureLatch && snapshot.consolidatedDeficitEscalationBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.consolidatedDeficitEscalationBand === 'elevated' && snapshot.debtServicePressure === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    fiscalPressure,
    sovereignDebtPressure,
    fiscalSustainability,
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent07FiscalBridgeIntegrationNote(): string {
  return 'Agent 07 fiscal snapshot adjusts fiscal pressure and debt bands only; no direct commodity price writes.';
}


// --- source: integration/agent09-household-bridge.ts ---

/** Read-only household economy snapshot from Agent 09 (contract only). */
export interface Agent09HouseholdSnapshot {
  turn: number;
  laborParticipationBand: 'weak' | 'steady' | 'strong';
  wageGrowthBand: 'subdued' | 'moderate' | 'elevated' | 'surge';
  costOfLivingStress: 'low' | 'moderate' | 'high' | 'extreme';
  /** Round 20: labor market slack band for wage-price pass-through. */
  participationSlackInflationBand?: 'tight' | 'balanced' | 'slack' | 'severe_slack';
  /** Round 20: household inflation expectations de-anchoring flag. */
  householdExpectationsDeanchoring?: boolean;
  /** Round 30: wage-price spiral inflation latch. */
  wagePriceSpiralLatch?: boolean;
  /** Round 30: household de-anchoring band. */
  householdDeanchoringBand?: 'anchored' | 'drifting' | 'unmoored';
  /** Round 38: budget inflation latch. */
  wave38BudgetInflationLatch?: boolean;
  /** Round 38: household stress cascade band. */
  householdStressCascadeBand?: 'contained' | 'building' | 'ruptured';
  /** Round 46: household stress inflation latch. */
  wave46HouseholdStressLatch?: boolean;
  /** Round 46: wage stress surge band. */
  wageStressSurgeBand?: 'contained' | 'building' | 'ruptured';
}

export function mergeAgent09IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent09HouseholdSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let householdAffordability = base.householdAffordability;
  if (snapshot.costOfLivingStress === 'extreme') {
    householdAffordability = 'severe_pressure';
  } else if (snapshot.costOfLivingStress === 'high' && householdAffordability === 'healthy') {
    householdAffordability = 'strained';
  }

  let householdInflationScenarioActive = base.householdInflationScenarioActive;
  if (snapshot.wageGrowthBand === 'surge' || snapshot.costOfLivingStress === 'extreme') {
    householdInflationScenarioActive = true;
  }

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.wageGrowthBand === 'elevated' || snapshot.wageGrowthBand === 'surge') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }

  let actorCreditStressIndex = base.actorCreditStressIndex ?? 0.35;
  if (snapshot.costOfLivingStress === 'extreme') {
    actorCreditStressIndex = finClamp(actorCreditStressIndex + 0.08, 0, 1);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.householdExpectationsDeanchoring) {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }
  if (snapshot.participationSlackInflationBand === 'severe_slack' && snapshot.wageGrowthBand !== 'subdued') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wagePriceSpiralLatch && snapshot.householdDeanchoringBand === 'unmoored') {
    highInflationScenario = true;
    householdInflationScenarioActive = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.householdDeanchoringBand === 'drifting' && snapshot.householdExpectationsDeanchoring) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave38BudgetInflationLatch && snapshot.householdStressCascadeBand === 'ruptured') {
    highInflationScenario = true;
    householdInflationScenarioActive = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.householdStressCascadeBand === 'building' && snapshot.costOfLivingStress === 'extreme') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave46HouseholdStressLatch && snapshot.wageStressSurgeBand === 'ruptured') {
    highInflationScenario = true;
    householdInflationScenarioActive = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.wageStressSurgeBand === 'building' && snapshot.wageGrowthBand === 'surge') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    householdAffordability,
    householdInflationScenarioActive,
    inflationSettingMultiplier,
    actorCreditStressIndex,
    highInflationScenario,
  };
}

export function agent09HouseholdBridgeIntegrationNote(): string {
  return 'Agent 09 household snapshot adjusts affordability and service-cost inflation flags; macro CPI only.';
}


// --- source: integration/agent15-trade-bridge.ts ---

/** Read-only trade snapshot from Agent 15 (contract only). */
export interface Agent15TradeSnapshot {
  turn: number;
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  commodityImportShare: number;
  /** Round 22: tariff shock inflation latch. */
  tariffShockInflationActive?: boolean;
  /** Round 22: import pipeline fragility band. */
  importPipelineFragileBand?: 'stable' | 'strained' | 'critical';
  /** Round 31: import tariff inflation latch. */
  importTariffInflationLatch?: boolean;
  /** Round 31: exchange pipeline stress band. */
  exchangePipelineStressBand?: 'stable' | 'stressed' | 'ruptured';
  /** Round 39: tariff exchange inflation latch. */
  wave39TariffExchangeLatch?: boolean;
  /** Round 39: import exchange escalation band. */
  importExchangeEscalationBand?: 'stable' | 'stressed' | 'ruptured';
  /** Round 48: trade import pipeline inflation latch. */
  wave48TradeImportPipelineLatch?: boolean;
  /** Round 48: import exchange pipeline surge band. */
  importExchangePipelineSurgeBand?: 'stable' | 'stressed' | 'ruptured';
  /** Round 49: cleared forward-arc handoff inflation latch. */
  wave49ClearedForwardArcHandoffLatch?: boolean;
  /** Round 49: cleared forward-arc handoff continuity band. */
  clearedForwardArcHandoffContinuityBand?: 'stable' | 'strained' | 'ruptured';
}

export function mergeAgent15IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent15TradeSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (
    snapshot.exchangeRatePressure === 'sharp_depreciation' ||
    snapshot.exchangeRatePressure === 'depreciation'
  ) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  }
  if (snapshot.tradeOpennessBand === 'open' && snapshot.commodityImportShare > 0.35) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.exchangeRatePressure === 'sharp_depreciation' && snapshot.tradeOpennessBand === 'open') {
    highInflationScenario = true;
  }
  if (snapshot.tariffShockInflationActive && snapshot.importPipelineFragileBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.importTariffInflationLatch && snapshot.exchangePipelineStressBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.exchangePipelineStressBand === 'stressed' && snapshot.exchangeRatePressure === 'sharp_depreciation') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave39TariffExchangeLatch && snapshot.importExchangeEscalationBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.importExchangeEscalationBand === 'stressed' && snapshot.exchangeRatePressure === 'sharp_depreciation') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave48TradeImportPipelineLatch && snapshot.importExchangePipelineSurgeBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.importExchangePipelineSurgeBand === 'stressed' && snapshot.exchangeRatePressure === 'sharp_depreciation') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave49ClearedForwardArcHandoffLatch && snapshot.clearedForwardArcHandoffContinuityBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.clearedForwardArcHandoffContinuityBand === 'strained' && snapshot.exchangeRatePressure === 'sharp_depreciation') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent15TradeBridgeIntegrationNote(): string {
  return 'Agent 15 trade snapshot adjusts import-side inflation multiplier flags; macro CPI only.';
}


// --- source: integration/agent08-corporate-bridge.ts ---

/** Read-only corporate sector snapshot from Agent 08 (contract only). */
export interface Agent08CorporateSnapshot {
  turn: number;
  pricingPowerBand: 'weak' | 'moderate' | 'strong' | 'dominant';
  marginCompression: 'none' | 'mild' | 'severe';
  passThroughIntent: 'absorb' | 'partial' | 'full';
  /** Round 22: production capacity strain feeding markup CPI. */
  productionCapacityStrainInflationFlag?: boolean;
  /** Round 22: corporate markup cascade band. */
  corporateMarkupCascadeBand?: 'none' | 'building' | 'active';
  /** Round 31: corporate pricing inflation latch. */
  corporatePricingInflationLatch?: boolean;
  /** Round 31: markup pass-through cascade band. */
  markupPassThroughCascadeBand?: 'absorbed' | 'partial' | 'full';
  /** Round 39: survival pricing inflation latch. */
  wave39SurvivalPricingLatch?: boolean;
  /** Round 39: corporate markup escalation band. */
  corporateMarkupEscalationBand?: 'contained' | 'building' | 'dominant';
  /** Round 47: corporate capacity inflation latch. */
  wave47CorporateCapacityLatch?: boolean;
  /** Round 47: capacity markup surge band. */
  capacityMarkupSurgeBand?: 'contained' | 'building' | 'ruptured';
}

export function mergeAgent08IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent08CorporateSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.pricingPowerBand === 'dominant' || snapshot.pricingPowerBand === 'strong') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  }
  if (snapshot.passThroughIntent === 'full' && snapshot.marginCompression !== 'severe') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }
  if (snapshot.marginCompression === 'severe' && snapshot.pricingPowerBand === 'weak') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  let actorCreditStressIndex = base.actorCreditStressIndex ?? 0.35;
  if (snapshot.marginCompression === 'severe') {
    actorCreditStressIndex = finClamp(actorCreditStressIndex + 0.05, 0, 1);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.corporateMarkupCascadeBand === 'active' || snapshot.productionCapacityStrainInflationFlag) {
    highInflationScenario = highInflationScenario || snapshot.corporateMarkupCascadeBand === 'active';
    if (snapshot.corporateMarkupCascadeBand === 'active') {
      inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
    }
  }

  if (snapshot.corporatePricingInflationLatch && snapshot.markupPassThroughCascadeBand === 'full') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.markupPassThroughCascadeBand === 'partial' && snapshot.pricingPowerBand === 'strong') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave39SurvivalPricingLatch && snapshot.corporateMarkupEscalationBand === 'dominant') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.corporateMarkupEscalationBand === 'building' && snapshot.passThroughIntent === 'full') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave47CorporateCapacityLatch && snapshot.capacityMarkupSurgeBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.capacityMarkupSurgeBand === 'building' && snapshot.pricingPowerBand === 'dominant') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    actorCreditStressIndex,
    highInflationScenario,
  };
}

export function agent08CorporateBridgeIntegrationNote(): string {
  return 'Agent 08 corporate snapshot adjusts pricing-power inflation flags; no company equity writes.';
}


// --- source: integration/agent11-cities-bridge.ts ---

/** Read-only cities / regions snapshot from Agent 11 (contract only). */
export interface Agent11CitiesSnapshot {
  turn: number;
  vacancyBand: 'loose' | 'balanced' | 'tight' | 'critical';
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  urbanizationPressure: 'low' | 'medium' | 'high';
  regionalDispersionScore: number;
  /** Round 21: critical metro rent dispersion band. */
  metroRentDispersionCritical?: boolean;
  /** Round 21: regional markets syncing housing inflation. */
  regionalHousingInflationSync?: boolean;
  /** Round 32: urban rent inflation latch. */
  urbanRentInflationLatch?: boolean;
  /** Round 32: metro dispersion stress band. */
  metroDispersionStressBand?: 'aligned' | 'widening' | 'critical';
  /** Round 40: urban rent inflation latch. */
  wave40UrbanRentLatch?: boolean;
  /** Round 40: metro capacity stress band. */
  metroCapacityStressBand?: 'aligned' | 'strained' | 'critical';
  /** Round 49: metro regional rent escalation latch. */
  wave49MetroRegionalRentLatch?: boolean;
  /** Round 49: regional rent escalation band. */
  regionalRentEscalationBand?: 'contained' | 'building' | 'critical';
}

export function mergeAgent11IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent11CitiesSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.vacancyBand === 'critical' || snapshot.rentGrowthBand === 'surging') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.09, 0.85, 1.45);
  } else if (snapshot.vacancyBand === 'tight' || snapshot.rentGrowthBand === 'strong') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.urbanizationPressure === 'high' && snapshot.regionalDispersionScore > 0.55) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let householdAffordability = base.householdAffordability;
  if (snapshot.vacancyBand === 'critical' && snapshot.rentGrowthBand !== 'subdued') {
    householdAffordability = 'severe_pressure';
  } else if (snapshot.rentGrowthBand === 'strong' || snapshot.rentGrowthBand === 'surging') {
    householdAffordability = householdAffordability === 'healthy' ? 'strained' : householdAffordability;
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.metroRentDispersionCritical && snapshot.regionalHousingInflationSync) {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.urbanRentInflationLatch && snapshot.metroDispersionStressBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.metroDispersionStressBand === 'widening' && snapshot.rentGrowthBand === 'surging') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave40UrbanRentLatch && snapshot.metroCapacityStressBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.metroCapacityStressBand === 'strained' && snapshot.vacancyBand === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave49MetroRegionalRentLatch && snapshot.regionalRentEscalationBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.regionalRentEscalationBand === 'building' && snapshot.rentGrowthBand === 'surging') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    householdAffordability,
    highInflationScenario,
    householdInflationScenarioActive:
      base.householdInflationScenarioActive ||
      snapshot.rentGrowthBand === 'surging' ||
      snapshot.vacancyBand === 'critical',
  };
}

export function agent11CitiesBridgeIntegrationNote(): string {
  return 'Agent 11 cities snapshot adjusts shelter-side inflation and affordability flags; no land price writes.';
}


// --- source: integration/agent13-energy-bridge.ts ---

/** Read-only energy / environment snapshot from Agent 13 (contract only). */
export interface Agent13EnergySnapshot {
  turn: number;
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  retailTariffShock: boolean;
  gridReliabilityBand: 'stable' | 'strained' | 'fragile';
  emissionsTransitionCostBand: 'low' | 'medium' | 'high';
  /** Round 21: renewable shortfall feeding wholesale CPI metadata. */
  renewableShortfallInflationFlag?: boolean;
  /** Round 21: wholesale price cascade band. */
  wholesaleCascadeBand?: 'none' | 'stressed' | 'cascade';
  /** Round 32: grid tariff inflation latch. */
  gridTariffInflationLatch?: boolean;
  /** Round 32: wholesale stress cascade band. */
  wholesaleStressCascadeBand?: 'stable' | 'stressed' | 'cascade';
  /** Round 40: grid tariff inflation latch. */
  wave40GridTariffLatch?: boolean;
  /** Round 40: wholesale tariff cascade band. */
  wholesaleTariffCascadeBand?: 'stable' | 'stressed' | 'cascade';
  /** Round 49: grid transition surge latch. */
  wave49GridTransitionSurgeLatch?: boolean;
  /** Round 49: grid transition stress band. */
  gridTransitionStressBand?: 'stable' | 'stressed' | 'ruptured';
}

export function mergeAgent13IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent13EnergySnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.wholesaleEnergyStress === 'crisis' || snapshot.wholesaleEnergyStress === 'severe') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.1, 0.85, 1.45);
  } else if (snapshot.wholesaleEnergyStress === 'elevated') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.retailTariffShock) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.gridReliabilityBand === 'fragile') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }
  if (snapshot.emissionsTransitionCostBand === 'high') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.wholesaleEnergyStress === 'crisis' &&
    (snapshot.retailTariffShock || snapshot.gridReliabilityBand === 'fragile')
  ) {
    highInflationScenario = true;
  }
  if (snapshot.wholesaleCascadeBand === 'cascade' || snapshot.renewableShortfallInflationFlag) {
    highInflationScenario = true;
  }
  if (snapshot.wholesaleCascadeBand === 'cascade') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.gridTariffInflationLatch && snapshot.wholesaleStressCascadeBand === 'cascade') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.wholesaleStressCascadeBand === 'stressed' && snapshot.retailTariffShock) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave40GridTariffLatch && snapshot.wholesaleTariffCascadeBand === 'cascade') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.wholesaleTariffCascadeBand === 'stressed' && snapshot.wholesaleEnergyStress === 'crisis') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave49GridTransitionSurgeLatch && snapshot.gridTransitionStressBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.gridTransitionStressBand === 'stressed' && snapshot.wholesaleEnergyStress === 'crisis') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent13EnergyBridgeIntegrationNote(): string {
  return 'Agent 13 energy snapshot adjusts utility-side inflation multiplier flags; no emissions ledger writes.';
}


// --- source: integration/agent14-housing-bridge.ts ---

/** Read-only housing / wellbeing snapshot from Agent 14 (contract only). */
export interface Agent14HousingSnapshot {
  turn: number;
  mortgageStressBand: 'low' | 'elevated' | 'severe';
  wellbeingCostBand: 'stable' | 'strained' | 'critical';
  essentialServicesInflationFlag: boolean;
  /** Round 18: inline merge trajectory band from Agent 14 wellbeing module. */
  inlineMergeTrajectoryBand?: 'on_track' | 'lagging' | 'blocked';
  /** Round 18: turn-boundary inline activation monitor in critical band. */
  inlineActivationBoundaryCritical?: boolean;
  /** Round 28: shelter essential inflation latch. */
  shelterEssentialInflationLatch?: boolean;
  /** Round 28: mortgage wellbeing stress band. */
  mortgageWellbeingStressBand?: 'stable' | 'strained' | 'acute';
  /** Round 50: housing wellbeing mortgage escalation latch. */
  wave50HousingWellbeingEscalationLatch?: boolean;
  /** Round 50: mortgage wellbeing escalation band. */
  mortgageWellbeingEscalationBand?: 'contained' | 'building' | 'acute';
}

export function mergeAgent14IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent14HousingSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.mortgageStressBand === 'severe') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  } else if (snapshot.mortgageStressBand === 'elevated') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.wellbeingCostBand === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  } else if (snapshot.wellbeingCostBand === 'strained') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.essentialServicesInflationFlag) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.inlineMergeTrajectoryBand === 'blocked') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.inlineMergeTrajectoryBand === 'lagging') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.shelterEssentialInflationLatch && snapshot.mortgageWellbeingStressBand === 'acute') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.mortgageWellbeingStressBand === 'strained' && snapshot.essentialServicesInflationFlag) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave50HousingWellbeingEscalationLatch && snapshot.mortgageWellbeingEscalationBand === 'acute') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.mortgageWellbeingEscalationBand === 'building' && snapshot.wellbeingCostBand === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  let householdAffordability = base.householdAffordability;
  if (
    snapshot.mortgageStressBand === 'severe' &&
    (snapshot.wellbeingCostBand === 'critical' || snapshot.wellbeingCostBand === 'strained')
  ) {
    householdAffordability = 'severe_pressure';
  } else if (snapshot.mortgageStressBand === 'elevated' && householdAffordability === 'healthy') {
    householdAffordability = 'strained';
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    householdAffordability,
    householdInflationScenarioActive:
      base.householdInflationScenarioActive ||
      snapshot.essentialServicesInflationFlag ||
      snapshot.wellbeingCostBand === 'critical' ||
      snapshot.inlineActivationBoundaryCritical === true,
    highInflationScenario:
      base.highInflationScenario ||
      snapshot.inlineMergeTrajectoryBand === 'blocked' ||
      snapshot.inlineActivationBoundaryCritical === true ||
      snapshot.mortgageWellbeingStressBand === 'acute' ||
      (snapshot.wave50HousingWellbeingEscalationLatch === true &&
        snapshot.mortgageWellbeingEscalationBand === 'acute'),
  };
}

export function agent14HousingBridgeIntegrationNote(): string {
  return 'Agent 14 housing snapshot adjusts wellbeing-side inflation multipliers; no mortgage ledger writes.';
}


// --- source: integration/agent12-transport-bridge.ts ---

/** Read-only transport infrastructure snapshot from Agent 12 (contract only). */
export interface Agent12TransportSnapshot {
  turn: number;
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  portBacklogBand: 'clear' | 'moderate' | 'severe';
  logisticsInflationScenarioActive: boolean;
  /** Round 28: logistics inflation latch across freight cycles. */
  logisticsInflationLatch?: boolean;
  /** Round 28: freight congestion band. */
  freightCongestionBand?: 'clear' | 'building' | 'gridlocked';
  /** Round 17: V10.12 utilities grid thin capacity margin (distinct from freight). */
  utilitiesGridCapacityMarginThin?: boolean;
  /** Round 17: severe rolling utility outages feeding tariff CPI metadata. */
  utilitiesOutageBandSevere?: boolean;
  /** Round 36: wave logistics inflation latch. */
  wave36LogisticsInflationLatch?: boolean;
  /** Round 36: freight cascade congestion band. */
  freightCascadeCongestionBand?: 'clear' | 'building' | 'ruptured';
  /** Round 44: freight gridlock inflation latch. */
  wave44FreightGridlockLatch?: boolean;
  /** Round 44: freight gridlock surge band. */
  freightGridlockSurgeBand?: 'clear' | 'building' | 'ruptured';
  /** Round 50: corridor freight surge latch. */
  wave50FreightCorridorSurgeLatch?: boolean;
  /** Round 50: corridor freight surge band. */
  corridorFreightSurgeBand?: 'clear' | 'building' | 'ruptured';
}

export function mergeAgent12IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent12TransportSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.freightCapacityBand === 'critical' || snapshot.freightCapacityBand === 'tight') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.09, 0.85, 1.45);
  } else if (snapshot.freightCapacityBand === 'balanced') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.fuelSurchargeActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.portBacklogBand === 'severe') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  } else if (snapshot.portBacklogBand === 'moderate') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }
  if (snapshot.utilitiesGridCapacityMarginThin) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  }
  if (snapshot.utilitiesOutageBandSevere) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.09, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.logisticsInflationScenarioActive ||
    (snapshot.freightCapacityBand === 'critical' && snapshot.portBacklogBand === 'severe')
  ) {
    highInflationScenario = true;
  }
  if (snapshot.utilitiesOutageBandSevere) {
    highInflationScenario = true;
  }
  if (snapshot.logisticsInflationLatch && snapshot.freightCongestionBand === 'gridlocked') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.freightCongestionBand === 'building' && snapshot.fuelSurchargeActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave36LogisticsInflationLatch && snapshot.freightCascadeCongestionBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.freightCascadeCongestionBand === 'building' && snapshot.freightCapacityBand === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave44FreightGridlockLatch && snapshot.freightGridlockSurgeBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.freightGridlockSurgeBand === 'building' && snapshot.freightCapacityBand === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave50FreightCorridorSurgeLatch && snapshot.corridorFreightSurgeBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.corridorFreightSurgeBand === 'building' && snapshot.freightCapacityBand === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  let systemicLiquidityBand = base.systemicLiquidityBand;
  if (snapshot.freightCapacityBand === 'critical' && snapshot.portBacklogBand !== 'clear') {
    systemicLiquidityBand = systemicLiquidityBand === 'critical' ? 'critical' : 'strained';
  }
  if (snapshot.utilitiesGridCapacityMarginThin || snapshot.utilitiesOutageBandSevere) {
    systemicLiquidityBand = snapshot.utilitiesOutageBandSevere ? 'critical' : systemicLiquidityBand === 'critical' ? 'critical' : 'strained';
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
    systemicLiquidityBand,
  };
}

export function agent12TransportBridgeIntegrationNote(): string {
  return 'Agent 12 transport snapshot adjusts logistics-side inflation flags; no infrastructure ledger writes.';
}


// --- source: integration/agent03-research-bridge.ts ---

/** Read-only research / tech snapshot from Agent 03 (contract only). */
export interface Agent03ResearchSnapshot {
  turn: number;
  productivityGainBand: 'flat' | 'moderate' | 'strong';
  supplySideReliefActive: boolean;
  innovationInflationOffsetScore: number;
  /** Round 26: tech-tree inflation latch feeding supply-side CPI metadata. */
  techTreeInflationLatch?: boolean;
  /** Round 26: supply-side inflation offset band. */
  supplySideOffsetBand?: 'weak' | 'building' | 'strong';
  /** Round 48: research breakthrough supply-side inflation latch. */
  wave48ResearchBreakthroughLatch?: boolean;
  /** Round 48: research supply-side failure band. */
  researchSupplySideFailureBand?: 'contained' | 'building' | 'critical';
}

export function mergeAgent03IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent03ResearchSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.productivityGainBand === 'strong' && snapshot.supplySideReliefActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.06, 0.85, 1.45);
  } else if (snapshot.productivityGainBand === 'moderate' && snapshot.innovationInflationOffsetScore > 0.45) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.03, 0.85, 1.45);
  } else if (snapshot.productivityGainBand === 'flat' && !snapshot.supplySideReliefActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.techTreeInflationLatch && snapshot.supplySideOffsetBand === 'weak') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.supplySideOffsetBand === 'strong' && snapshot.supplySideReliefActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.wave48ResearchBreakthroughLatch && snapshot.researchSupplySideFailureBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.researchSupplySideFailureBand === 'building' && snapshot.productivityGainBand === 'flat') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent03ResearchBridgeIntegrationNote(): string {
  return 'Agent 03 research snapshot adjusts supply-side inflation offset; no tech tree writes.';
}


// --- source: integration/agent05-events-bridge.ts ---

/** Read-only dynamic events snapshot from Agent 05 (contract only). */
export interface Agent05EventsSnapshot {
  turn: number;
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  confidenceShockBand: 'calm' | 'uneasy' | 'severe';
  /** Round 19: staged narrative event cost shock band. */
  stagedEventCostShockBand?: 'none' | 'emerging' | 'active' | 'cascade';
  /** Round 19: macro inflation spillover latch from event queue. */
  macroEventInflationSpilloverActive?: boolean;
  /** Round 27: dynamic event inflation latch across narrative queue. */
  dynamicEventInflationLatch?: boolean;
  /** Round 27: supply shock persistence band. */
  supplyShockPersistenceBand?: 'none' | 'building' | 'entrenched';
  /** Round 37: wave event inflation latch. */
  wave37EventInflationLatch?: boolean;
  /** Round 37: staged shock persistence band. */
  stagedShockPersistenceBand?: 'none' | 'building' | 'entrenched';
  /** Round 45: event shock inflation latch. */
  wave45EventShockLatch?: boolean;
  /** Round 45: narrative shock entrench band. */
  narrativeShockEntrenchBand?: 'none' | 'building' | 'entrenched';
}

export function mergeAgent05IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent05EventsSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.inflationShockEventActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.12, 0.85, 1.45);
  }
  if (snapshot.supplyDisruptionSeverity === 'national') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  } else if (snapshot.supplyDisruptionSeverity === 'localized') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.inflationShockEventActive &&
    (snapshot.supplyDisruptionSeverity === 'national' || snapshot.confidenceShockBand === 'severe')
  ) {
    highInflationScenario = true;
  }

  let publicStability = base.publicStability;
  if (snapshot.confidenceShockBand === 'severe') {
    publicStability = Math.max(0, publicStability - 6);
  } else if (snapshot.confidenceShockBand === 'uneasy') {
    publicStability = Math.max(0, publicStability - 3);
  }

  if (snapshot.stagedEventCostShockBand === 'cascade') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  } else if (snapshot.stagedEventCostShockBand === 'active') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.dynamicEventInflationLatch && snapshot.supplyShockPersistenceBand === 'entrenched') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.supplyShockPersistenceBand === 'building' && snapshot.inflationShockEventActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave37EventInflationLatch && snapshot.stagedShockPersistenceBand === 'entrenched') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.stagedShockPersistenceBand === 'building' && snapshot.supplyDisruptionSeverity === 'national') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave45EventShockLatch && snapshot.narrativeShockEntrenchBand === 'entrenched') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.narrativeShockEntrenchBand === 'building' && snapshot.inflationShockEventActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario:
      highInflationScenario ||
      snapshot.macroEventInflationSpilloverActive === true ||
      snapshot.stagedEventCostShockBand === 'cascade',
    publicStability,
    creditShockActive: base.creditShockActive || snapshot.stagedEventCostShockBand === 'cascade',
  };
}

export function agent05EventsBridgeIntegrationNote(): string {
  return 'Agent 05 events snapshot adjusts inflation shock flags from narrative events; no event queue writes.';
}


// --- source: integration/agent04-modes-bridge.ts ---

/** Read-only modes / scenarios snapshot from Agent 04 (contract only). */
export interface Agent04ModesSnapshot {
  turn: number;
  scenarioInflationBias: 'disinflationary' | 'neutral' | 'inflationary' | 'extreme';
  sandboxStressModeActive: boolean;
  difficultyCostMultiplier: number;
  /** Round 26: difficulty setting inflation cascade active. */
  difficultyInflationCascade?: boolean;
  /** Round 26: sandbox stress inflation band. */
  sandboxStressInflationBand?: 'routine' | 'stressed' | 'extreme';
  /** Round 37: wave sandbox inflation latch. */
  wave37SandboxInflationLatch?: boolean;
  /** Round 37: scenario bias cascade band. */
  scenarioBiasCascadeBand?: 'routine' | 'stressed' | 'runaway';
  /** Round 45: sandbox pressure inflation latch. */
  wave45SandboxPressureLatch?: boolean;
  /** Round 45: scenario stress surge band. */
  scenarioStressSurgeBand?: 'routine' | 'stressed' | 'surge';
}

export function mergeAgent04IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent04ModesSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.scenarioInflationBias === 'extreme' || snapshot.scenarioInflationBias === 'inflationary') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.1, 0.85, 1.45);
  } else if (snapshot.scenarioInflationBias === 'disinflationary') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.05, 0.85, 1.45);
  }

  if (snapshot.sandboxStressModeActive) {
    inflationSettingMultiplier = finClamp(
      inflationSettingMultiplier * finClamp(snapshot.difficultyCostMultiplier, 1, 1.25),
      0.85,
      1.45,
    );
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.scenarioInflationBias === 'extreme') {
    highInflationScenario = true;
  }
  if (snapshot.difficultyInflationCascade && snapshot.sandboxStressInflationBand === 'extreme') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.sandboxStressInflationBand === 'stressed' && snapshot.sandboxStressModeActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave37SandboxInflationLatch && snapshot.scenarioBiasCascadeBand === 'runaway') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.scenarioBiasCascadeBand === 'stressed' && snapshot.scenarioInflationBias === 'extreme') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave45SandboxPressureLatch && snapshot.scenarioStressSurgeBand === 'surge') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.scenarioStressSurgeBand === 'stressed' && snapshot.sandboxStressModeActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent04ModesBridgeIntegrationNote(): string {
  return 'Agent 04 modes snapshot adjusts scenario inflation bias; no mode save writes.';
}


// --- source: integration/agent16-guardian-bridge.ts ---

/** Read-only guardian co-pilot snapshot from Agent 16 (contract only). */
export interface Agent16GuardianSnapshot {
  turn: number;
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  narrativeShockSeverity: 'low' | 'medium' | 'high';
  /** Round 16: guardian flags financial-services fee shock feeding CPI metadata. */
  financialServicesFeeShockActive?: boolean;
  /** Round 23: co-pilot inflation escalation latch. */
  copilotInflationEscalationActive?: boolean;
  /** Round 23: guardrail narrative cascade band. */
  guardrailNarrativeCascadeBand?: 'none' | 'building' | 'urgent';
  /** Round 33: guardrail inflation latch. */
  guardrailInflationLatch?: boolean;
  /** Round 33: co-pilot escalation band. */
  copilotEscalationBand?: 'calm' | 'elevated' | 'critical';
  /** Round 41: guardian pressure inflation latch. */
  wave41GuardianPressureLatch?: boolean;
  /** Round 41: co-pilot pressure escalation band. */
  copilotPressureEscalationBand?: 'contained' | 'elevated' | 'runaway';
  /** Round 49: entrustment envelope inflation latch. */
  wave49EntrustmentEnvelopeLatch?: boolean;
  /** Round 49: entrustment envelope pressure band. */
  entrustmentEnvelopePressureBand?: 'contained' | 'elevated' | 'ruptured';
  /** Round 49: entrustment strain index (0–1). */
  entrustmentStrainIndex?: number;
}

export function mergeAgent16IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent16GuardianSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.inflationGuardrailTripped) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  }
  if (snapshot.financialServicesFeeShockActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.narrativeShockSeverity === 'high') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  let publicStability = base.publicStability;
  if (snapshot.stabilityInterventionBand === 'urgent') {
    publicStability = Math.max(0, publicStability - 8);
  } else if (snapshot.stabilityInterventionBand === 'advisory') {
    publicStability = Math.max(0, publicStability - 4);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    (snapshot.inflationGuardrailTripped && snapshot.stabilityInterventionBand === 'urgent') ||
    snapshot.financialServicesFeeShockActive
  ) {
    highInflationScenario = true;
  }

  let creditShockActive = base.creditShockActive;
  if (snapshot.financialServicesFeeShockActive) {
    creditShockActive = true;
  }
  if (snapshot.copilotInflationEscalationActive || snapshot.guardrailNarrativeCascadeBand === 'urgent') {
    highInflationScenario = true;
  }
  if (snapshot.guardrailNarrativeCascadeBand === 'urgent') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.guardrailInflationLatch && snapshot.copilotEscalationBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.copilotEscalationBand === 'elevated' && snapshot.inflationGuardrailTripped) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave41GuardianPressureLatch && snapshot.copilotPressureEscalationBand === 'runaway') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.copilotPressureEscalationBand === 'elevated' && snapshot.inflationGuardrailTripped) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave49EntrustmentEnvelopeLatch && snapshot.entrustmentEnvelopePressureBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (
    snapshot.entrustmentEnvelopePressureBand === 'elevated' &&
    (snapshot.entrustmentStrainIndex ?? 0) >= 0.7
  ) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    publicStability,
    highInflationScenario,
    creditShockActive,
  };
}

export function agent16GuardianBridgeIntegrationNote(): string {
  return 'Agent 16 guardian snapshot reflects inflation guardrail state; no co-pilot action writes.';
}


// --- source: integration/agent17-command-bridge.ts ---

/** Read-only AI command center snapshot from Agent 17 (contract only). */
export interface Agent17CommandSnapshot {
  turn: number;
  macroAlertLevel: 'green' | 'amber' | 'red';
  inflationFusionScore: number;
  coordinatedTighteningSuggested: boolean;
  /** Round 16: command center farmgate / food-supply alert. */
  farmgateSupplyAlertActive?: boolean;
  /** Round 29: macro inflation fusion latch from command center. */
  macroInflationFusionLatch?: boolean;
  /** Round 29: command alert cascade band. */
  commandAlertCascadeBand?: 'stable' | 'elevated' | 'critical';
  /** Round 36: wave fusion latch. */
  wave36FusionLatch?: boolean;
  /** Round 36: command inflation escalation band. */
  commandInflationEscalationBand?: 'stable' | 'elevated' | 'critical';
  /** Round 44: command alert inflation latch. */
  wave44CommandAlertLatch?: boolean;
  /** Round 44: command alert pressure band. */
  commandAlertPressureBand?: 'contained' | 'elevated' | 'critical';
}

export function mergeAgent17IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent17CommandSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.macroAlertLevel === 'red') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.11, 0.85, 1.45);
  } else if (snapshot.macroAlertLevel === 'amber') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.inflationFusionScore > 0.72) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }
  if (snapshot.farmgateSupplyAlertActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    (snapshot.macroAlertLevel === 'red' && snapshot.inflationFusionScore > 0.65) ||
    snapshot.farmgateSupplyAlertActive
  ) {
    highInflationScenario = true;
  }

  let householdInflationScenarioActive = base.householdInflationScenarioActive;
  if (snapshot.farmgateSupplyAlertActive) {
    householdInflationScenarioActive = true;
  }

  if (snapshot.macroInflationFusionLatch && snapshot.commandAlertCascadeBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.commandAlertCascadeBand === 'elevated' && snapshot.macroAlertLevel === 'red') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave36FusionLatch && snapshot.commandInflationEscalationBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.commandInflationEscalationBand === 'elevated' && snapshot.macroAlertLevel === 'red') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave44CommandAlertLatch && snapshot.commandAlertPressureBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.commandAlertPressureBand === 'elevated' && snapshot.macroAlertLevel === 'red') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
    householdInflationScenarioActive,
  };
}

export function agent17CommandBridgeIntegrationNote(): string {
  return 'Agent 17 command snapshot reflects fused macro alert state; no command queue writes.';
}


// --- source: integration/agent18-team-bridge.ts ---

/** Read-only team intelligence snapshot from Agent 18 (contract only). */
export interface Agent18TeamSnapshot {
  turn: number;
  consensusInflationOutlook: 'disinflation' | 'stable' | 'reacceleration' | 'upside_risk';
  briefingUrgencyBand: 'routine' | 'elevated' | 'critical';
  crossDomainStressScore: number;
  /** Round 23: team forecast de-anchoring from briefings. */
  teamForecastDeanchoringFlag?: boolean;
  /** Round 23: briefing inflation salience band. */
  briefingInflationSalienceBand?: 'muted' | 'elevated' | 'critical';
  /** Round 33: team briefing inflation latch. */
  teamBriefingInflationLatch?: boolean;
  /** Round 33: consensus drift band. */
  consensusDriftBand?: 'anchored' | 'drifting' | 'unmoored';
  /** Round 41: team consensus inflation latch. */
  wave41TeamConsensusLatch?: boolean;
  /** Round 41: briefing consensus unmoor band. */
  briefingConsensusUnmoorBand?: 'anchored' | 'drifting' | 'ruptured';
}

export function mergeAgent18IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent18TeamSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.consensusInflationOutlook === 'upside_risk' || snapshot.consensusInflationOutlook === 'reacceleration') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  } else if (snapshot.consensusInflationOutlook === 'disinflation') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  if (snapshot.crossDomainStressScore > 0.7) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.consensusInflationOutlook === 'upside_risk' &&
    snapshot.briefingUrgencyBand === 'critical'
  ) {
    highInflationScenario = true;
  }
  if (snapshot.teamForecastDeanchoringFlag && snapshot.briefingInflationSalienceBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.teamBriefingInflationLatch && snapshot.consensusDriftBand === 'unmoored') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.consensusDriftBand === 'drifting' && snapshot.briefingUrgencyBand === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave41TeamConsensusLatch && snapshot.briefingConsensusUnmoorBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.briefingConsensusUnmoorBand === 'drifting' && snapshot.briefingUrgencyBand === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent18TeamBridgeIntegrationNote(): string {
  return 'Agent 18 team snapshot adjusts consensus inflation outlook flags; no briefing ledger writes.';
}


// --- source: integration/agent02-turns-bridge.ts ---

/** Read-only turns / time snapshot from Agent 02 (contract only). */
export interface Agent02TurnsSnapshot {
  turn: number;
  calendarSeasonBand: 'off_peak' | 'normal' | 'peak_demand';
  policyReviewWindowOpen: boolean;
  multiTurnInflationCarryover: number;
  /** Round 25: fiscal calendar inflation latch across turns. */
  fiscalCalendarInflationLatch?: boolean;
  /** Round 25: multi-turn carryover persistence band. */
  multiTurnCarryoverBand?: 'muted' | 'building' | 'persistent';
}

export function mergeAgent02IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent02TurnsSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.calendarSeasonBand === 'peak_demand') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }

  if (snapshot.multiTurnInflationCarryover > 0.15) {
    inflationSettingMultiplier = finClamp(
      inflationSettingMultiplier + snapshot.multiTurnInflationCarryover * 0.25,
      0.85,
      1.45,
    );
  }

  if (snapshot.policyReviewWindowOpen && snapshot.calendarSeasonBand === 'peak_demand') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.fiscalCalendarInflationLatch && snapshot.multiTurnCarryoverBand === 'persistent') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent02TurnsBridgeIntegrationNote(): string {
  return 'Agent 02 turns snapshot adjusts seasonal inflation carryover; no calendar save writes.';
}


// --- source: integration/agent20-automation-bridge.ts ---

/** Read-only idle automation snapshot from Agent 20 (contract only). */
export interface Agent20AutomationSnapshot {
  turn: number;
  macroAutopilotInflationBias: 'deflate' | 'neutral' | 'inflate';
  unattendedShockDriftActive: boolean;
  automationConfidenceScore: number;
  /** Round 25: idle macro inflation escalation under autopilot. */
  idleMacroInflationEscalation?: boolean;
  /** Round 25: autopilot drift cascade band. */
  autopilotDriftCascadeBand?: 'none' | 'drifting' | 'runaway';
  /** Round 34: synthesis autopilot inflation latch. */
  synthesisAutopilotInflationLatch?: boolean;
  /** Round 34: cascade stack drift band. */
  cascadeStackDriftBand?: 'stable' | 'stacking' | 'runaway';
  /** Round 42: synthesis cascade inflation latch. */
  wave42SynthesisCascadeLatch?: boolean;
  /** Round 42: autopilot stack surge band. */
  autopilotStackSurgeBand?: 'stable' | 'stacking' | 'surge';
}

export function mergeAgent20IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent20AutomationSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.macroAutopilotInflationBias === 'inflate') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  } else if (snapshot.macroAutopilotInflationBias === 'deflate') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  if (snapshot.unattendedShockDriftActive && snapshot.automationConfidenceScore < 0.45) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.09, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.macroAutopilotInflationBias === 'inflate' && snapshot.unattendedShockDriftActive) {
    highInflationScenario = true;
  }
  if (snapshot.autopilotDriftCascadeBand === 'runaway' || snapshot.idleMacroInflationEscalation) {
    highInflationScenario = highInflationScenario || snapshot.autopilotDriftCascadeBand === 'runaway';
  }

  if (snapshot.synthesisAutopilotInflationLatch && snapshot.cascadeStackDriftBand === 'runaway') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.cascadeStackDriftBand === 'stacking' && snapshot.unattendedShockDriftActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave42SynthesisCascadeLatch && snapshot.autopilotStackSurgeBand === 'surge') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.autopilotStackSurgeBand === 'stacking' && snapshot.unattendedShockDriftActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent20AutomationBridgeIntegrationNote(): string {
  return 'Agent 20 automation snapshot adjusts autopilot inflation bias flags; no automation queue writes.';
}


// --- source: integration/agent01-strategic-bridge.ts ---

/** Read-only strategic gameplay snapshot from Agent 01 (contract only). */
export interface Agent01StrategicSnapshot {
  turn: number;
  nationalPriorityInflationBias: 'containment' | 'neutral' | 'expansionary';
  strategicStockpileStress: boolean;
  geopoliticalRiskPremium: number;
  /** Round 24: expansionary priority cascade feeding CPI metadata. */
  expansionaryPriorityCascadeActive?: boolean;
  /** Round 24: strategic inflation risk band. */
  strategicInflationRiskBand?: 'low' | 'elevated' | 'critical';
}

export function mergeAgent01IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent01StrategicSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.nationalPriorityInflationBias === 'expansionary') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  } else if (snapshot.nationalPriorityInflationBias === 'containment') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  if (snapshot.strategicStockpileStress) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.geopoliticalRiskPremium > 0.55) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + snapshot.geopoliticalRiskPremium * 0.08, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.strategicStockpileStress && snapshot.nationalPriorityInflationBias === 'expansionary') {
    highInflationScenario = true;
  }
  if (snapshot.expansionaryPriorityCascadeActive || snapshot.strategicInflationRiskBand === 'critical') {
    highInflationScenario = true;
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent01StrategicBridgeIntegrationNote(): string {
  return 'Agent 01 strategic snapshot adjusts national inflation bias flags; no strategy ledger writes.';
}


// --- source: integration/agent19-memory-bridge.ts ---

/** Read-only AI memory / explainability snapshot from Agent 19 (contract only). */
export interface Agent19MemorySnapshot {
  turn: number;
  recalledInflationRegimeConfidence: number;
  narrativeDriftTowardHigherInflation: boolean;
  explainabilityAlertActive: boolean;
  /** Round 24: memory recall cascade into inflation presentation. */
  memoryInflationRecallCascade?: boolean;
  /** Round 24: explainability inflation salience band. */
  explainabilityInflationSalienceBand?: 'muted' | 'elevated' | 'critical';
  /** Round 34: commonwealth inflation recall latch. */
  memoryCommonwealthInflationLatch?: boolean;
  /** Round 34: realm recall gate band. */
  realmRecallGateBand?: 'sealed' | 'opening' | 'breached';
  /** Round 42: memory recall inflation latch. */
  wave42MemoryRecallLatch?: boolean;
  /** Round 42: realm persistence gate band. */
  realmPersistenceGateBand?: 'anchored' | 'slipping' | 'ruptured';
}

export function mergeAgent19IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent19MemorySnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.narrativeDriftTowardHigherInflation) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }
  if (snapshot.recalledInflationRegimeConfidence > 0.75 && snapshot.explainabilityAlertActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.narrativeDriftTowardHigherInflation &&
    snapshot.recalledInflationRegimeConfidence > 0.7
  ) {
    highInflationScenario = true;
  }
  if (snapshot.memoryInflationRecallCascade && snapshot.explainabilityInflationSalienceBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.memoryCommonwealthInflationLatch && snapshot.realmRecallGateBand === 'breached') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.realmRecallGateBand === 'opening' && snapshot.explainabilityAlertActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave42MemoryRecallLatch && snapshot.realmPersistenceGateBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.realmPersistenceGateBand === 'slipping' && snapshot.narrativeDriftTowardHigherInflation) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent19MemoryBridgeIntegrationNote(): string {
  return 'Agent 19 memory snapshot adjusts recalled inflation regime flags; no memory store writes.';
}


// --- source: integration/agent22-ui-bridge.ts ---

/** Read-only evolving UI snapshot from Agent 22 (contract only). */
export interface Agent22UiSnapshot {
  turn: number;
  inflationDashboardStressHighlight: boolean;
  playerAttentionOnCostOfLiving: 'low' | 'medium' | 'high';
  uiNudgeInflationExpectationsUp: boolean;
  /** Round 17: utilities stress banner visible in UI shell. */
  utilitiesStressBannerActive?: boolean;
  /** Round 17: phase-shell cost-of-living coach elevating inflation salience. */
  phaseShellCostOfLivingCoachActive?: boolean;
  /** Round 29: player inflation salience latch in UI shell. */
  playerInflationSalienceLatch?: boolean;
  /** Round 29: UI expectations nudge band. */
  uiExpectationsNudgeBand?: 'muted' | 'building' | 'sharp';
  /** Round 35: wave salience escalation latch. */
  wave35SalienceEscalationLatch?: boolean;
  /** Round 35: shell expectations escalation band. */
  shellExpectationsEscalationBand?: 'muted' | 'building' | 'critical';
  /** Round 43: shell attention inflation latch. */
  wave43ShellAttentionLatch?: boolean;
  /** Round 43: player salience pressure band. */
  playerSaliencePressureBand?: 'muted' | 'elevated' | 'critical';
}

export function mergeAgent22IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent22UiSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.inflationDashboardStressHighlight && snapshot.playerAttentionOnCostOfLiving === 'high') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }
  if (snapshot.uiNudgeInflationExpectationsUp) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }
  if (snapshot.utilitiesStressBannerActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.phaseShellCostOfLivingCoachActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let householdInflationScenarioActive = base.householdInflationScenarioActive;
  if (snapshot.playerAttentionOnCostOfLiving === 'high') {
    householdInflationScenarioActive = true;
  }
  if (snapshot.phaseShellCostOfLivingCoachActive && snapshot.utilitiesStressBannerActive) {
    householdInflationScenarioActive = true;
  }

  if (snapshot.playerInflationSalienceLatch && snapshot.uiExpectationsNudgeBand === 'sharp') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
    householdInflationScenarioActive = true;
  } else if (snapshot.uiExpectationsNudgeBand === 'building' && snapshot.uiNudgeInflationExpectationsUp) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.wave35SalienceEscalationLatch && snapshot.shellExpectationsEscalationBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.shellExpectationsEscalationBand === 'building' && snapshot.inflationDashboardStressHighlight) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave43ShellAttentionLatch && snapshot.playerSaliencePressureBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.playerSaliencePressureBand === 'elevated' && snapshot.playerAttentionOnCostOfLiving === 'high') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    householdInflationScenarioActive,
    highInflationScenario,
  };
}

export function agent22UiBridgeIntegrationNote(): string {
  return 'Agent 22 UI snapshot reflects player-facing inflation stress flags; no UI state writes.';
}


// --- source: integration/agent23-dashboards-bridge.ts ---

/** Read-only dashboards / maps snapshot from Agent 23 (contract only). */
export interface Agent23DashboardsSnapshot {
  turn: number;
  regionalHeatmapInflationAlert: boolean;
  mapLayerCostPressureScore: number;
  dashboardRefreshUrgency: 'routine' | 'elevated' | 'critical';
  /** Round 19: severe regional inflation heatmap band. */
  dashboardInflationHeatmapSevere?: boolean;
  /** Round 19: map layer cost-of-living stress active. */
  mapLayerCostOfLivingStressActive?: boolean;
  /** Round 35: regional inflation overlay latch. */
  regionalInflationOverlayLatch?: boolean;
  /** Round 35: heatmap overlay cascade band. */
  heatmapOverlayCascadeBand?: 'routine' | 'widening' | 'critical';
  /** Round 43: heatmap overlay inflation latch. */
  wave43HeatmapOverlayLatch?: boolean;
  /** Round 43: regional overlay surge band. */
  regionalOverlaySurgeBand?: 'routine' | 'widening' | 'surge';
}

export function mergeAgent23IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent23DashboardsSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.regionalHeatmapInflationAlert) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.mapLayerCostPressureScore > 0.65) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }
  if (snapshot.dashboardRefreshUrgency === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.regionalHeatmapInflationAlert && snapshot.dashboardRefreshUrgency === 'critical') {
    highInflationScenario = true;
  }
  if (snapshot.dashboardInflationHeatmapSevere && snapshot.mapLayerCostOfLivingStressActive) {
    highInflationScenario = true;
  }

  let householdInflationScenarioActive = base.householdInflationScenarioActive;
  if (snapshot.mapLayerCostOfLivingStressActive) {
    householdInflationScenarioActive = true;
  }

  if (snapshot.regionalInflationOverlayLatch && snapshot.heatmapOverlayCascadeBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.heatmapOverlayCascadeBand === 'widening' && snapshot.regionalHeatmapInflationAlert) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave43HeatmapOverlayLatch && snapshot.regionalOverlaySurgeBand === 'surge') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.regionalOverlaySurgeBand === 'widening' && snapshot.dashboardRefreshUrgency === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
    householdInflationScenarioActive,
  };
}

export function agent23DashboardsBridgeIntegrationNote(): string {
  return 'Agent 23 dashboards snapshot adjusts regional inflation alert flags; no map tile writes.';
}


// --- source: integration/inflation-forecast.ts ---
  stepInflationRegimeTracker,
  createInitialInflationRegimeTracker,
  type InflationRegimeLabel,
} from './inflation-regime-tracker.js';
  createInitialInflationMomentumState,
  stepInflationMomentum,
  type InflationMomentumSnapshot,
} from '../inflation/inflation-momentum.js';
  assessImportPricePassThrough,
  type ImportPassThroughBand,
} from '../inflation/import-price-pass-through.js';
  assessTermPremiumInflationSignal,
  type TermPremiumSignalBand,
} from '../rates/term-premium-inflation-signal.js';
  assessEnergyPricePassThrough,
  type EnergyPassThroughBand,
} from '../inflation/energy-price-pass-through.js';
  assessShelterRentInflation,
  type ShelterRentPressureBand,
} from '../inflation/shelter-rent-inflation.js';
  assessFoodGroceryPassThrough,
  type FoodGroceryPassThroughBand,
} from '../inflation/food-grocery-pass-through.js';
  assessTransportLogisticsInflation,
  type TransportLogisticsPressureBand,
} from '../inflation/transport-logistics-inflation.js';
  assessHealthcareServicesInflation,
  type HealthcareServicesPressureBand,
} from '../inflation/healthcare-services-inflation.js';
  assessInsurancePremiumPassThrough,
  type InsurancePremiumPassThroughBand,
} from '../inflation/insurance-premium-pass-through.js';
  assessEducationTuitionInflation,
  type EducationTuitionPressureBand,
} from '../inflation/education-tuition-inflation.js';
  assessCommunicationsServicesInflation,
  type CommunicationsServicesPressureBand,
} from '../inflation/communications-services-inflation.js';
  assessRecreationLeisureInflation,
  type RecreationLeisurePressureBand,
} from '../inflation/recreation-leisure-inflation.js';
  assessProfessionalServicesFeeInflation,
  type ProfessionalServicesFeeBand,
} from '../inflation/professional-services-fee-inflation.js';
  assessChildcareServicesInflation,
  type ChildcareServicesPressureBand,
} from '../inflation/childcare-services-inflation.js';
  assessGovernmentChargesInflation,
  type GovernmentChargesPressureBand,
} from '../inflation/government-charges-inflation.js';
  assessWaterUtilitiesInflation,
  type WaterUtilitiesPressureBand,
} from '../inflation/water-utilities-inflation.js';
  assessDomesticTravelInflation,
  type DomesticTravelPressureBand,
} from '../inflation/domestic-travel-inflation.js';
  assessConstructionMaterialsInflation,
  type ConstructionMaterialsPressureBand,
} from '../inflation/construction-materials-inflation.js';
  assessRetailTradeMarginInflation,
  type RetailTradeMarginBand,
} from '../inflation/retail-trade-margin-inflation.js';
  assessFinancialServicesFeeInflation,
  type FinancialServicesFeeBand,
} from '../inflation/financial-services-fee-inflation.js';
  assessAgriculturalFarmgateInflation,
  type AgriculturalFarmgatePressureBand,
} from '../inflation/agricultural-farmgate-inflation.js';
  assessPublicUtilitiesGridTariffInflation,
  type PublicUtilitiesGridTariffBand,
} from '../inflation/public-utilities-grid-tariff-inflation.js';
  assessUiInflationSaliencePassThrough,
  type UiInflationSalienceBand,
} from '../inflation/ui-inflation-salience-pass-through.js';
  assessHousingMortgageEssentialInflation,
  type HousingMortgageEssentialBand,
} from '../inflation/housing-mortgage-essential-inflation.js';
  assessMacroTransmissionMergeInflation,
  type MacroTransmissionMergeBand,
} from '../inflation/macro-transmission-merge-inflation.js';
  assessDynamicEventsInflationSpillover,
  type DynamicEventsInflationSpilloverBand,
} from '../inflation/dynamic-events-inflation-spillover.js';
  assessDashboardMapInflationOverlay,
  type DashboardMapInflationOverlayBand,
} from '../inflation/dashboard-map-inflation-overlay.js';
  assessPublicFinanceDebtServiceInflation,
  type PublicFinanceDebtServiceBand,
} from '../inflation/public-finance-debt-service-inflation.js';
  assessPopulationLaborWageInflation,
  type PopulationLaborWageBand,
} from '../inflation/population-labor-wage-inflation.js';
  assessWholesaleEnergyTransitionInflation,
  type WholesaleEnergyTransitionBand,
} from '../inflation/wholesale-energy-transition-inflation.js';
  assessUrbanRentDispersionInflation,
  type UrbanRentDispersionBand,
} from '../inflation/urban-rent-dispersion-inflation.js';
  assessCorporatePricingPassThroughInflation,
  type CorporatePricingPassThroughBand,
} from '../inflation/corporate-pricing-pass-through-inflation.js';
  assessTradeExchangeImportInflation,
  type TradeExchangeImportBand,
} from '../inflation/trade-exchange-import-inflation.js';
  assessGuardianInflationInterventionInflation,
  type GuardianInflationInterventionBand,
} from '../inflation/guardian-inflation-intervention-inflation.js';
  assessTeamIntelligenceConsensusInflation,
  type TeamIntelligenceConsensusBand,
} from '../inflation/team-intelligence-consensus-inflation.js';
  assessStrategicGeopoliticalInflationPremium,
  type StrategicGeopoliticalPremiumBand,
} from '../inflation/strategic-geopolitical-inflation-premium.js';
  assessAiMemoryInflationRecallInflation,
  type AiMemoryInflationRecallBand,
} from '../inflation/ai-memory-inflation-recall-inflation.js';
  assessCalendarSeasonInflationCarryover,
  type CalendarSeasonInflationCarryoverBand,
} from '../inflation/calendar-season-inflation-carryover.js';
  assessAutomationAutopilotInflationDrift,
  type AutomationAutopilotInflationDriftBand,
} from '../inflation/automation-autopilot-inflation-drift.js';
  assessResearchProductivityInflationOffset,
  type ResearchProductivityInflationOffsetBand,
} from '../inflation/research-productivity-inflation-offset.js';
  assessScenarioSandboxInflationBias,
  type ScenarioSandboxInflationBiasBand,
} from '../inflation/scenario-sandbox-inflation-bias.js';
  assessEventsNarrativeInflationPersistence,
  type EventsNarrativeInflationPersistenceBand,
} from '../inflation/events-narrative-inflation-persistence.js';
  assessMacroDemandOverheatInflationSlippage,
  type MacroDemandOverheatInflationSlippageBand,
} from '../inflation/macro-demand-overheat-inflation-slippage.js';
  assessFreightLogisticsInflationCongestion,
  type FreightLogisticsInflationCongestionBand,
} from '../inflation/freight-logistics-inflation-congestion.js';
  assessHousingWellbeingInflationEssentialStress,
  type HousingWellbeingInflationEssentialStressBand,
} from '../inflation/housing-wellbeing-inflation-essential-stress.js';
  assessCommandCenterInflationFusionEscalation,
  type CommandCenterInflationFusionEscalationBand,
} from '../inflation/command-center-inflation-fusion-escalation.js';
  assessUiPlayerInflationSalienceNudge,
  type UiPlayerInflationSalienceNudgeBand,
} from '../inflation/ui-player-inflation-salience-nudge.js';
  assessFiscalIndexationInflationAnchorBreach,
  type FiscalIndexationInflationAnchorBreachBand,
} from '../inflation/fiscal-indexation-inflation-anchor-breach.js';
  assessHouseholdWageInflationDeanchoring,
  type HouseholdWageInflationDeanchoringBand,
} from '../inflation/household-wage-inflation-deanchoring.js';
  assessCorporateMarkupInflationCascade,
  type CorporateMarkupInflationCascadeBand,
} from '../inflation/corporate-markup-inflation-cascade.js';
  assessTradeTariffImportInflationPipeline,
  type TradeTariffImportInflationPipelineBand,
} from '../inflation/trade-tariff-import-inflation-pipeline.js';
  assessMetroUrbanRentInflationSurge,
  type MetroUrbanRentInflationSurgeBand,
} from '../inflation/metro-urban-rent-inflation-surge.js';
  assessWholesaleGridEnergyInflationCascade,
  type WholesaleGridEnergyInflationCascadeBand,
} from '../inflation/wholesale-grid-energy-inflation-cascade.js';
  assessGuardianGuardrailInflationEscalation,
  type GuardianGuardrailInflationEscalationBand,
} from '../inflation/guardian-guardrail-inflation-escalation.js';
  assessTeamConsensusInflationBriefingDrift,
  type TeamConsensusInflationBriefingDriftBand,
} from '../inflation/team-consensus-inflation-briefing-drift.js';
  assessMemoryCommonwealthInflationRecallGate,
  type MemoryCommonwealthInflationRecallGateBand,
} from '../inflation/memory-commonwealth-inflation-recall-gate.js';
  assessAutomationSynthesisInflationCascadeDrift,
  type AutomationSynthesisInflationCascadeDriftBand,
} from '../inflation/automation-synthesis-inflation-cascade-drift.js';
  assessUiShellInflationSalienceEscalation,
  type UiShellInflationSalienceEscalationBand,
} from '../inflation/ui-shell-inflation-salience-escalation.js';
  assessDashboardHeatmapInflationOverlayCascade,
  type DashboardHeatmapInflationOverlayCascadeBand,
} from '../inflation/dashboard-heatmap-inflation-overlay-cascade.js';
  assessCommandCenterInflationFusionLatch,
  type CommandCenterInflationFusionLatchBand,
} from '../inflation/command-center-inflation-fusion-latch.js';
  assessTransportFreightInflationCongestionCascade,
  type TransportFreightInflationCongestionCascadeBand,
} from '../inflation/transport-freight-inflation-congestion-cascade.js';
  assessEventsStagedInflationShockPersistence,
  type EventsStagedInflationShockPersistenceBand,
} from '../inflation/events-staged-inflation-shock-persistence.js';
  assessModesSandboxInflationStressCascade,
  type ModesSandboxInflationStressCascadeBand,
} from '../inflation/modes-sandbox-inflation-stress-cascade.js';
  assessFiscalAppropriationInflationPressureLatch,
  type FiscalAppropriationInflationPressureLatchBand,
} from '../inflation/fiscal-appropriation-inflation-pressure-latch.js';
  assessHouseholdBudgetInflationStressCascade,
  type HouseholdBudgetInflationStressCascadeBand,
} from '../inflation/household-budget-inflation-stress-cascade.js';
  assessCorporateSurvivalPricingInflationLatch,
  type CorporateSurvivalPricingInflationLatchBand,
} from '../inflation/corporate-survival-pricing-inflation-latch.js';
  assessTradeTariffExchangeInflationEscalation,
  type TradeTariffExchangeInflationEscalationBand,
} from '../inflation/trade-tariff-exchange-inflation-escalation.js';
  assessMetroCapacityRentInflationLatch,
  type MetroCapacityRentInflationLatchBand,
} from '../inflation/metro-capacity-rent-inflation-latch.js';
  assessGridWholesaleTariffInflationSurge,
  type GridWholesaleTariffInflationSurgeBand,
} from '../inflation/grid-wholesale-tariff-inflation-surge.js';
  assessGuardianCopilotInflationPressureLatch,
  type GuardianCopilotInflationPressureLatchBand,
} from '../inflation/guardian-copilot-inflation-pressure-latch.js';
  assessTeamBriefingConsensusInflationUnmooring,
  type TeamBriefingConsensusInflationUnmooringBand,
} from '../inflation/team-briefing-consensus-inflation-unmooring.js';
  assessMemoryRealmInflationPersistenceLatch,
  type MemoryRealmInflationPersistenceLatchBand,
} from '../inflation/memory-realm-inflation-persistence-latch.js';
  assessAutomationSynthesisInflationCascadeSurge,
  type AutomationSynthesisInflationCascadeSurgeBand,
} from '../inflation/automation-synthesis-inflation-cascade-surge.js';
  assessUiShellInflationAttentionLatch,
  type UiShellInflationAttentionLatchBand,
} from '../inflation/ui-shell-inflation-attention-latch.js';
  assessDashboardRegionalInflationOverlaySurge,
  type DashboardRegionalInflationOverlaySurgeBand,
} from '../inflation/dashboard-regional-inflation-overlay-surge.js';
  assessCommandCenterInflationAlertPressureLatch,
  type CommandCenterInflationAlertPressureLatchBand,
} from '../inflation/command-center-inflation-alert-pressure-latch.js';
  assessTransportFreightInflationGridlockSurge,
  type TransportFreightInflationGridlockSurgeBand,
} from '../inflation/transport-freight-inflation-gridlock-surge.js';
  assessEventsNarrativeInflationShockLatch,
  type EventsNarrativeInflationShockLatchBand,
} from '../inflation/events-narrative-inflation-shock-latch.js';
  assessModesSandboxInflationPressureSurge,
  type ModesSandboxInflationPressureSurgeBand,
} from '../inflation/modes-sandbox-inflation-pressure-surge.js';
  assessFiscalConsolidatedInflationPressureLatch,
  type FiscalConsolidatedInflationPressureLatchBand,
} from '../inflation/fiscal-consolidated-inflation-pressure-latch.js';
  assessHouseholdWageInflationStressSurge,
  type HouseholdWageInflationStressSurgeBand,
} from '../inflation/household-wage-inflation-stress-surge.js';
  assessMacroOutputGapInflationPressureLatch,
  type MacroOutputGapInflationPressureLatchBand,
} from '../inflation/macro-output-gap-inflation-pressure-latch.js';
  assessCorporateCapacityMarkupInflationSurge,
  type CorporateCapacityMarkupInflationSurgeBand,
} from '../inflation/corporate-capacity-markup-inflation-surge.js';
  assessResearchBreakthroughSupplySideInflationLatch,
  type ResearchBreakthroughSupplySideInflationLatchBand,
} from '../inflation/research-breakthrough-supply-side-inflation-latch.js';
  assessTradeImportExchangeInflationPipelineSurge,
  type TradeImportExchangeInflationPipelineSurgeBand,
} from '../inflation/trade-import-exchange-inflation-pipeline-surge.js';
  assessMetroRegionalRentInflationEscalationLatch,
  type MetroRegionalRentInflationEscalationLatchBand,
} from '../inflation/metro-regional-rent-inflation-escalation-latch.js';
  assessWholesaleGridTransitionInflationSurge,
  type WholesaleGridTransitionInflationSurgeBand,
} from '../inflation/wholesale-grid-transition-inflation-surge.js';
  assessTradeClearedForwardArcInflationHandoffLatch,
  type TradeClearedForwardArcInflationHandoffLatchBand,
} from '../inflation/trade-cleared-forward-arc-inflation-handoff-latch.js';
  assessGuardianEntrustmentEnvelopeInflationPressureSurge,
  type GuardianEntrustmentEnvelopeInflationPressureSurgeBand,
} from '../inflation/guardian-entrustment-envelope-inflation-pressure-surge.js';
  assessHousingWellbeingMortgageInflationEscalationLatch,
  type HousingWellbeingMortgageInflationEscalationLatchBand,
} from '../inflation/housing-wellbeing-mortgage-inflation-escalation-latch.js';
  assessTransportCorridorFreightInflationSurgeLatch,
  type TransportCorridorFreightInflationSurgeLatchBand,
} from '../inflation/transport-corridor-freight-inflation-surge-latch.js';

export interface InflationForecastPoint {
  turn: number;
  inflationBand: InflationConditionsBand;
  costMultiplier: number;
  anchoringScore: number;
  spiralRisk: ReturnType<typeof assessWagePriceSpiral>['spiralRisk'];
  headlineCpiIndex: number;
  coreCpiIndex: number;
  regime: InflationRegimeLabel;
  momentumScore: number;
  momentumDirection: InflationMomentumSnapshot['direction'];
  importPassThroughBand: ImportPassThroughBand;
  termPremiumSignalBand: TermPremiumSignalBand;
  energyPassThroughBand: EnergyPassThroughBand;
  shelterRentPressureBand: ShelterRentPressureBand;
  foodGroceryPassThroughBand: FoodGroceryPassThroughBand;
  transportLogisticsPressureBand: TransportLogisticsPressureBand;
  healthcareServicesPressureBand: HealthcareServicesPressureBand;
  insurancePremiumPassThroughBand: InsurancePremiumPassThroughBand;
  educationTuitionPressureBand: EducationTuitionPressureBand;
  communicationsServicesPressureBand: CommunicationsServicesPressureBand;
  recreationLeisurePressureBand: RecreationLeisurePressureBand;
  professionalServicesFeeBand: ProfessionalServicesFeeBand;
  childcareServicesPressureBand: ChildcareServicesPressureBand;
  governmentChargesPressureBand: GovernmentChargesPressureBand;
  waterUtilitiesPressureBand: WaterUtilitiesPressureBand;
  domesticTravelPressureBand: DomesticTravelPressureBand;
  constructionMaterialsPressureBand: ConstructionMaterialsPressureBand;
  retailTradeMarginBand: RetailTradeMarginBand;
  financialServicesFeeBand: FinancialServicesFeeBand;
  agriculturalFarmgatePressureBand: AgriculturalFarmgatePressureBand;
  publicUtilitiesGridTariffBand: PublicUtilitiesGridTariffBand;
  uiInflationSalienceBand: UiInflationSalienceBand;
  housingMortgageEssentialBand: HousingMortgageEssentialBand;
  macroTransmissionMergeBand: MacroTransmissionMergeBand;
  dynamicEventsInflationSpilloverBand: DynamicEventsInflationSpilloverBand;
  dashboardMapInflationOverlayBand: DashboardMapInflationOverlayBand;
  publicFinanceDebtServiceBand: PublicFinanceDebtServiceBand;
  populationLaborWageBand: PopulationLaborWageBand;
  wholesaleEnergyTransitionBand: WholesaleEnergyTransitionBand;
  urbanRentDispersionBand: UrbanRentDispersionBand;
  corporatePricingPassThroughBand: CorporatePricingPassThroughBand;
  tradeExchangeImportBand: TradeExchangeImportBand;
  guardianInflationInterventionBand: GuardianInflationInterventionBand;
  teamIntelligenceConsensusBand: TeamIntelligenceConsensusBand;
  strategicGeopoliticalPremiumBand: StrategicGeopoliticalPremiumBand;
  aiMemoryInflationRecallBand: AiMemoryInflationRecallBand;
  calendarSeasonInflationCarryoverBand: CalendarSeasonInflationCarryoverBand;
  automationAutopilotInflationDriftBand: AutomationAutopilotInflationDriftBand;
  researchProductivityInflationOffsetBand: ResearchProductivityInflationOffsetBand;
  scenarioSandboxInflationBiasBand: ScenarioSandboxInflationBiasBand;
  eventsNarrativeInflationPersistenceBand: EventsNarrativeInflationPersistenceBand;
  macroDemandOverheatInflationSlippageBand: MacroDemandOverheatInflationSlippageBand;
  freightLogisticsInflationCongestionBand: FreightLogisticsInflationCongestionBand;
  housingWellbeingInflationEssentialStressBand: HousingWellbeingInflationEssentialStressBand;
  commandCenterInflationFusionEscalationBand: CommandCenterInflationFusionEscalationBand;
  uiPlayerInflationSalienceNudgeBand: UiPlayerInflationSalienceNudgeBand;
  fiscalIndexationInflationAnchorBreachBand: FiscalIndexationInflationAnchorBreachBand;
  householdWageInflationDeanchoringBand: HouseholdWageInflationDeanchoringBand;
  corporateMarkupInflationCascadeBand: CorporateMarkupInflationCascadeBand;
  tradeTariffImportInflationPipelineBand: TradeTariffImportInflationPipelineBand;
  metroUrbanRentInflationSurgeBand: MetroUrbanRentInflationSurgeBand;
  wholesaleGridEnergyInflationCascadeBand: WholesaleGridEnergyInflationCascadeBand;
  guardianGuardrailInflationEscalationBand: GuardianGuardrailInflationEscalationBand;
  teamConsensusInflationBriefingDriftBand: TeamConsensusInflationBriefingDriftBand;
  memoryCommonwealthInflationRecallGateBand: MemoryCommonwealthInflationRecallGateBand;
  automationSynthesisInflationCascadeDriftBand: AutomationSynthesisInflationCascadeDriftBand;
  uiShellInflationSalienceEscalationBand: UiShellInflationSalienceEscalationBand;
  dashboardHeatmapInflationOverlayCascadeBand: DashboardHeatmapInflationOverlayCascadeBand;
  commandCenterInflationFusionLatchBand: CommandCenterInflationFusionLatchBand;
  transportFreightInflationCongestionCascadeBand: TransportFreightInflationCongestionCascadeBand;
  eventsStagedInflationShockPersistenceBand: EventsStagedInflationShockPersistenceBand;
  modesSandboxInflationStressCascadeBand: ModesSandboxInflationStressCascadeBand;
  fiscalAppropriationInflationPressureLatchBand: FiscalAppropriationInflationPressureLatchBand;
  householdBudgetInflationStressCascadeBand: HouseholdBudgetInflationStressCascadeBand;
  corporateSurvivalPricingInflationLatchBand: CorporateSurvivalPricingInflationLatchBand;
  tradeTariffExchangeInflationEscalationBand: TradeTariffExchangeInflationEscalationBand;
  metroCapacityRentInflationLatchBand: MetroCapacityRentInflationLatchBand;
  gridWholesaleTariffInflationSurgeBand: GridWholesaleTariffInflationSurgeBand;
  guardianCopilotInflationPressureLatchBand: GuardianCopilotInflationPressureLatchBand;
  teamBriefingConsensusInflationUnmooringBand: TeamBriefingConsensusInflationUnmooringBand;
  memoryRealmInflationPersistenceLatchBand: MemoryRealmInflationPersistenceLatchBand;
  automationSynthesisInflationCascadeSurgeBand: AutomationSynthesisInflationCascadeSurgeBand;
  uiShellInflationAttentionLatchBand: UiShellInflationAttentionLatchBand;
  dashboardRegionalInflationOverlaySurgeBand: DashboardRegionalInflationOverlaySurgeBand;
  commandCenterInflationAlertPressureLatchBand: CommandCenterInflationAlertPressureLatchBand;
  transportFreightInflationGridlockSurgeBand: TransportFreightInflationGridlockSurgeBand;
  eventsNarrativeInflationShockLatchBand: EventsNarrativeInflationShockLatchBand;
  modesSandboxInflationPressureSurgeBand: ModesSandboxInflationPressureSurgeBand;
  fiscalConsolidatedInflationPressureLatchBand: FiscalConsolidatedInflationPressureLatchBand;
  householdWageInflationStressSurgeBand: HouseholdWageInflationStressSurgeBand;
  macroOutputGapInflationPressureLatchBand: MacroOutputGapInflationPressureLatchBand;
  corporateCapacityMarkupInflationSurgeBand: CorporateCapacityMarkupInflationSurgeBand;
  researchBreakthroughSupplySideInflationLatchBand: ResearchBreakthroughSupplySideInflationLatchBand;
  tradeImportExchangeInflationPipelineSurgeBand: TradeImportExchangeInflationPipelineSurgeBand;
  metroRegionalRentInflationEscalationLatchBand: MetroRegionalRentInflationEscalationLatchBand;
  wholesaleGridTransitionInflationSurgeBand: WholesaleGridTransitionInflationSurgeBand;
  tradeClearedForwardArcInflationHandoffLatchBand: TradeClearedForwardArcInflationHandoffLatchBand;
  guardianEntrustmentEnvelopeInflationPressureSurgeBand: GuardianEntrustmentEnvelopeInflationPressureSurgeBand;
  housingWellbeingMortgageInflationEscalationLatchBand: HousingWellbeingMortgageInflationEscalationLatchBand;
  transportCorridorFreightInflationSurgeLatchBand: TransportCorridorFreightInflationSurgeLatchBand;
}

export interface InflationForecastPath {
  points: InflationForecastPoint[];
  terminalBand: InflationConditionsBand;
  maxCostMultiplier: number;
}

/** Deterministic forward path for dashboards / Agent 21 hooks (no RNG). */
export function projectInflationForecastPath(
  horizonTurns: number,
  seedInputs?: ReturnType<typeof makeDefaultMacroFinancialTestInputs>,
): InflationForecastPath {
  const points: InflationForecastPoint[] = [];
  let anchoring = initialInflationAnchoringScore();
  let maxCost = 1;
  let regimeState = createInitialInflationRegimeTracker();
  let momentumState = createInitialInflationMomentumState();

  for (let t = 1; t <= horizonTurns; t++) {
    const inputs = { ...(seedInputs ?? makeDefaultMacroFinancialTestInputs()), turn: t };
    const r = computeNationalMacroFinancialConditions(inputs, null, null);
    const pass = serviceCostPassThroughFromAffordability(inputs.householdAffordability);
    const spiral = assessWagePriceSpiral({
      inflationBand: r.state.inflation,
      householdAffordability: inputs.householdAffordability,
      fiscalPressure: inputs.fiscalPressure,
      wageGrowthPressureScore: 40 + t * 2,
      turn: t,
    });
    const exp = stepInflationExpectations({
      currentBand: r.state.inflation,
      priorAnchoringScore: anchoring,
      fiscalPressure: inputs.fiscalPressure,
      highInflationScenario: inputs.highInflationScenario,
      turn: t,
    });
    anchoring = exp.anchoringScore;
    const cpi = decomposeMacroCpiBasket(r.state.inflation, t, pass);
    const coreSpread = computeCoreHeadlineSpread(r.state.inflation, t, pass);
    regimeState = stepInflationRegimeTracker(regimeState, t, r.state.inflation, {
      creditStressed: r.state.credit === 'restricted' || r.state.credit === 'frozen',
      fiscalCritical: inputs.fiscalPressure === 'critical',
    });
    const regimeSnap = regimeState.history[regimeState.history.length - 1];
    const mom = stepInflationMomentum(momentumState, t, r.state.inflation);
    momentumState = mom.state;
    const importPass = assessImportPricePassThrough({
      tradeOpennessBand: 'mixed',
      exchangeRatePressure: inputs.highInflationScenario ? 'depreciation' : 'stable',
      commodityImportShare: 0.3,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const termPrem = assessTermPremiumInflationSignal({
      inflationBand: r.state.inflation,
      fiscalPressure: inputs.fiscalPressure,
      sovereignDebtPressure: inputs.sovereignDebtPressure,
      highInflationScenario: inputs.highInflationScenario,
    });
    const energyPass = assessEnergyPricePassThrough({
      wholesaleEnergyStress: inputs.highInflationScenario ? 'severe' : 'elevated',
      retailTariffShock: inputs.fiscalPressure === 'critical',
      gridReliabilityBand: inputs.systemicLiquidityBand === 'critical' ? 'fragile' : 'strained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const shelterRent = assessShelterRentInflation({
      vacancyBand:
        inputs.householdAffordability === 'severe_pressure'
          ? 'critical'
          : inputs.householdAffordability === 'strained'
            ? 'tight'
            : 'balanced',
      rentGrowthBand: inputs.householdInflationScenarioActive ? 'strong' : 'moderate',
      urbanizationPressure: inputs.highInflationScenario ? 'high' : 'medium',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const foodGrocery = assessFoodGroceryPassThrough({
      harvestStressBand: inputs.fiscalPressure === 'critical' ? 'severe' : inputs.highInflationScenario ? 'weak' : 'normal',
      retailMarginPressure: inputs.householdAffordability === 'severe_pressure' ? 'high' : 'medium',
      supplyChainDisruption: inputs.systemicLiquidityBand === 'critical' || inputs.creditShockActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const transportLog = assessTransportLogisticsInflation({
      freightCapacityBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'critical'
          : inputs.systemicLiquidityBand === 'strained'
            ? 'tight'
            : 'balanced',
      fuelSurchargeActive: inputs.highInflationScenario,
      portBacklogBand: inputs.fiscalPressure === 'critical' ? 'severe' : 'moderate',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const healthcare = assessHealthcareServicesInflation({
      wagePressureBand:
        inputs.fiscalPressure === 'critical' || inputs.highInflationScenario ? 'high' : 'moderate',
      demandSurgeActive: inputs.creditShockActive || inputs.activeCrises > 0,
      workforceShortageBand: inputs.householdAffordability === 'severe_pressure' ? 'severe' : 'moderate',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const insurancePrem = assessInsurancePremiumPassThrough({
      claimsInflationBand: inputs.highInflationScenario ? 'high' : 'moderate',
      reinsuranceStress: inputs.fiscalPressure === 'critical',
      catastropheLoadActive: inputs.activeCrises > 1,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const educationTuition = assessEducationTuitionInflation({
      enrollmentPressureBand: inputs.highInflationScenario ? 'high' : 'moderate',
      subsidyCutActive: inputs.fiscalPressure === 'critical' || inputs.fiscalPressure === 'strained',
      wageIndexationBand: inputs.householdInflationScenarioActive ? 'strong' : 'normal',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const commsServices = assessCommunicationsServicesInflation({
      bandwidthDemandBand: inputs.creditShockActive ? 'surge' : 'normal',
      regulatedTariffShock: inputs.systemicLiquidityBand === 'critical',
      platformFeePassThrough: inputs.highInflationScenario ? 'high' : 'medium',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const recreation = assessRecreationLeisureInflation({
      tourismDemandBand: inputs.highInflationScenario ? 'surge' : 'normal',
      laborCostPassThrough: inputs.fiscalPressure === 'critical' ? 'high' : 'medium',
      discretionarySpendPressure: inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const professionalFees = assessProfessionalServicesFeeInflation({
      billingRatePressure: inputs.highInflationScenario ? 'elevated' : 'normal',
      complianceCostStack: inputs.fiscalPressure === 'critical' || inputs.creditShockActive,
      corporateDemandBand: inputs.capitalPressure === 'high' || inputs.capitalPressure === 'critical' ? 'strong' : 'steady',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const childcare = assessChildcareServicesInflation({
      capacityShortageBand: inputs.householdAffordability === 'severe_pressure' ? 'severe' : 'moderate',
      wageAwardPassThrough: inputs.highInflationScenario ? 'strong' : 'normal',
      subsidyIndexationLag: inputs.fiscalPressure === 'critical' || inputs.fiscalPressure === 'strained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const govCharges = assessGovernmentChargesInflation({
      feeIndexationBand: inputs.highInflationScenario ? 'above_cpi' : 'at_cpi',
      newLevyStackActive: inputs.fiscalPressure === 'critical',
      localGovernmentPressure: inputs.publicStability < 45 ? 'high' : 'medium',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const waterUtils = assessWaterUtilitiesInflation({
      droughtStressBand: inputs.systemicLiquidityBand === 'critical' ? 'severe' : 'moderate',
      infrastructureTariffShock: inputs.fiscalPressure === 'critical',
      recyclingCostPassThrough: inputs.creditShockActive ? 'high' : 'medium',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const domesticTravel = assessDomesticTravelInflation({
      routeCapacityBand: inputs.highInflationScenario ? 'constrained' : 'balanced',
      fuelSurchargePassThrough: inputs.highInflationScenario,
      accommodationOccupancyBand: inputs.householdInflationScenarioActive ? 'full' : 'normal',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const constructionMaterials = assessConstructionMaterialsInflation({
      supplyChainStressBand: inputs.creditShockActive ? 'severe' : inputs.systemicLiquidityBand === 'strained' ? 'elevated' : 'normal',
      laborShortagePassThrough: inputs.fiscalPressure === 'critical',
      importContentShare: 0.25,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const retailMargin = assessRetailTradeMarginInflation({
      discountingIntensity: inputs.householdAffordability === 'severe_pressure' ? 'light' : 'moderate',
      inventoryClearanceActive: inputs.publicStability > 55,
      wageBillPressure: inputs.highInflationScenario ? 'high' : 'medium',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const financialFees = assessFinancialServicesFeeInflation({
      fundingCostPassThrough: inputs.creditShockActive ? 'high' : inputs.fiscalPressure === 'critical' ? 'medium' : 'low',
      complianceCostStackActive: inputs.fiscalPressure === 'critical' || inputs.activeCrises > 0,
      depositRateCompetitionBand: inputs.highInflationScenario ? 'intense' : 'normal',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const farmgate = assessAgriculturalFarmgateInflation({
      harvestStressBand: inputs.systemicLiquidityBand === 'critical' ? 'severe' : inputs.highInflationScenario ? 'weak' : 'normal',
      transportToMarketBand: inputs.systemicLiquidityBand === 'strained' || inputs.systemicLiquidityBand === 'critical' ? 'strained' : 'smooth',
      inputCostPassThrough: inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const publicGrid = assessPublicUtilitiesGridTariffInflation({
      serviceReliabilityBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'critical'
          : inputs.systemicLiquidityBand === 'strained'
            ? 'fragile'
            : 'strained',
      outageRiskBand: inputs.creditShockActive ? 'rolling' : inputs.fiscalPressure === 'critical' ? 'moderate' : 'clear',
      capacityMarginBand:
        inputs.systemicLiquidityBand === 'critical' || inputs.systemicLiquidityBand === 'strained' ? 'thin' : 'balanced',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const uiSalience = assessUiInflationSaliencePassThrough({
      dashboardStressHighlight: inputs.householdInflationScenarioActive,
      playerAttentionBand:
        inputs.householdAffordability === 'severe_pressure'
          ? 'high'
          : inputs.householdAffordability === 'strained'
            ? 'medium'
            : 'low',
      uiExpectationsNudgeUp: inputs.highInflationScenario,
      phaseShellCoachActive: inputs.householdInflationScenarioActive && inputs.publicStability < 50,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const housingEssential = assessHousingMortgageEssentialInflation({
      mortgageStressBand:
        inputs.householdAffordability === 'severe_pressure'
          ? 'severe'
          : inputs.householdAffordability === 'strained'
            ? 'elevated'
            : 'low',
      wellbeingCostBand:
        inputs.householdInflationScenarioActive && inputs.publicStability < 45
          ? 'critical'
          : inputs.householdInflationScenarioActive
            ? 'strained'
            : 'stable',
      essentialServicesInflationFlag: inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const macroMerge = assessMacroTransmissionMergeInflation({
      transmissionStabilityFragile:
        inputs.systemicLiquidityBand === 'strained' || inputs.systemicLiquidityBand === 'critical',
      macroRecoveryRankStressActive: inputs.creditShockActive || inputs.fiscalPressure === 'critical',
      outputGap: inputs.highInflationScenario ? 0.28 : -0.04,
      nominalDemandPressure: finClamp((inputs.inflationSettingMultiplier ?? 1) - 1, -0.2, 0.6),
      inflationBand: r.state.inflation,
      turn: t,
    });
    const eventsSpillover = assessDynamicEventsInflationSpillover({
      inflationShockEventActive: inputs.highInflationScenario,
      supplyDisruptionSeverity: inputs.creditShockActive ? 'national' : inputs.fiscalPressure === 'critical' ? 'localized' : 'none',
      confidenceShockBand: inputs.publicStability < 42 ? 'severe' : inputs.publicStability < 52 ? 'uneasy' : 'calm',
      stagedEventCostShockBand: inputs.creditShockActive ? 'cascade' : inputs.highInflationScenario ? 'active' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const dashboardOverlay = assessDashboardMapInflationOverlay({
      regionalHeatmapInflationAlert: inputs.householdInflationScenarioActive,
      mapLayerCostPressureScore: inputs.householdAffordability === 'severe_pressure' ? 0.72 : 0.38,
      dashboardRefreshUrgency:
        inputs.publicStability < 40 ? 'critical' : inputs.highInflationScenario ? 'elevated' : 'routine',
      dashboardInflationHeatmapSevere: inputs.householdInflationScenarioActive && inputs.publicStability < 48,
      mapLayerCostOfLivingStressActive: inputs.householdAffordability === 'severe_pressure',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const publicFinanceDebt = assessPublicFinanceDebtServiceInflation({
      consolidatedDeficitBand:
        inputs.fiscalPressure === 'critical' ? 'large_deficit' : inputs.fiscalPressure === 'strained' ? 'moderate_deficit' : 'balanced',
      debtServicePressure:
        inputs.sovereignDebtPressure === 'critical'
          ? 'critical'
          : inputs.sovereignDebtPressure === 'elevated'
            ? 'elevated'
            : 'moderate',
      fiscalAnchorBreached: inputs.fiscalPressure === 'critical' || inputs.fiscalSustainability === 'vulnerable',
      indexedChargesInflationPassThrough: inputs.fiscalPressure !== 'healthy',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const populationLabor = assessPopulationLaborWageInflation({
      laborParticipationBand: inputs.actorCreditStressIndex > 0.55 ? 'weak' : 'steady',
      wageGrowthBand:
        inputs.highInflationScenario && inputs.householdInflationScenarioActive
          ? 'surge'
          : inputs.householdInflationScenarioActive
            ? 'elevated'
            : 'moderate',
      costOfLivingStress:
        inputs.householdAffordability === 'severe_pressure'
          ? 'extreme'
          : inputs.householdAffordability === 'strained'
            ? 'high'
            : 'moderate',
      participationSlackInflationBand:
        inputs.householdAffordability === 'severe_pressure' ? 'severe_slack' : inputs.householdInflationScenarioActive ? 'slack' : 'balanced',
      householdExpectationsDeanchoring: inputs.highInflationScenario && inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const wholesaleEnergy = assessWholesaleEnergyTransitionInflation({
      wholesaleEnergyStress:
        inputs.systemicLiquidityBand === 'critical' ? 'crisis' : inputs.highInflationScenario ? 'severe' : 'elevated',
      retailTariffShock: inputs.highInflationScenario,
      gridReliabilityBand:
        inputs.systemicLiquidityBand === 'strained' || inputs.systemicLiquidityBand === 'critical' ? 'fragile' : 'strained',
      emissionsTransitionCostBand: inputs.fiscalPressure === 'critical' ? 'high' : 'medium',
      renewableShortfallInflationFlag: inputs.creditShockActive,
      wholesaleCascadeBand: inputs.creditShockActive ? 'cascade' : inputs.fiscalPressure === 'critical' ? 'stressed' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const urbanRent = assessUrbanRentDispersionInflation({
      vacancyBand: inputs.householdAffordability === 'severe_pressure' ? 'critical' : 'tight',
      rentGrowthBand: inputs.householdInflationScenarioActive ? 'surging' : 'strong',
      urbanizationPressure: inputs.publicStability < 50 ? 'high' : 'medium',
      regionalDispersionScore: inputs.householdAffordability === 'severe_pressure' ? 0.7 : 0.45,
      metroRentDispersionCritical: inputs.householdAffordability === 'severe_pressure',
      regionalHousingInflationSync: inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const corporatePricing = assessCorporatePricingPassThroughInflation({
      pricingPowerBand: inputs.highInflationScenario ? 'strong' : 'moderate',
      marginCompression: inputs.actorCreditStressIndex > 0.55 ? 'severe' : 'mild',
      passThroughIntent: inputs.fiscalPressure === 'critical' ? 'full' : 'partial',
      productionCapacityStrainInflationFlag: inputs.systemicLiquidityBand === 'strained' || inputs.systemicLiquidityBand === 'critical',
      corporateMarkupCascadeBand: inputs.creditShockActive ? 'active' : inputs.highInflationScenario ? 'building' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const tradeImport = assessTradeExchangeImportInflation({
      tradeOpennessBand: 'open',
      exchangeRatePressure: inputs.highInflationScenario ? 'sharp_depreciation' : 'stable',
      commodityImportShare: 0.38,
      tariffShockInflationActive: inputs.creditShockActive,
      importPipelineFragileBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'strained' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const guardianIntervention = assessGuardianInflationInterventionInflation({
      inflationGuardrailTripped: inputs.highInflationScenario,
      stabilityInterventionBand:
        inputs.publicStability < 40 ? 'urgent' : inputs.fiscalPressure === 'critical' ? 'advisory' : 'none',
      narrativeShockSeverity: inputs.publicStability < 45 ? 'high' : inputs.publicStability < 55 ? 'medium' : 'low',
      copilotInflationEscalationActive: inputs.householdInflationScenarioActive,
      guardrailNarrativeCascadeBand: inputs.creditShockActive ? 'urgent' : inputs.highInflationScenario ? 'building' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const teamConsensus = assessTeamIntelligenceConsensusInflation({
      consensusInflationOutlook: inputs.highInflationScenario ? 'upside_risk' : 'reacceleration',
      briefingUrgencyBand: inputs.publicStability < 42 ? 'critical' : inputs.householdInflationScenarioActive ? 'elevated' : 'routine',
      crossDomainStressScore: inputs.actorCreditStressIndex ?? 0.35,
      teamForecastDeanchoringFlag: inputs.highInflationScenario && inputs.householdInflationScenarioActive,
      briefingInflationSalienceBand: inputs.publicStability < 38 ? 'critical' : inputs.publicStability < 48 ? 'elevated' : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const strategicPremium = assessStrategicGeopoliticalInflationPremium({
      nationalPriorityInflationBias: inputs.highInflationScenario ? 'expansionary' : 'neutral',
      strategicStockpileStress: inputs.creditShockActive,
      geopoliticalRiskPremium: inputs.fiscalPressure === 'critical' ? 0.68 : 0.4,
      expansionaryPriorityCascadeActive: inputs.highInflationScenario && inputs.creditShockActive,
      strategicInflationRiskBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'elevated' : 'low',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const memoryRecall = assessAiMemoryInflationRecallInflation({
      recalledInflationRegimeConfidence: inputs.highInflationScenario ? 0.8 : 0.52,
      narrativeDriftTowardHigherInflation: inputs.householdInflationScenarioActive,
      explainabilityAlertActive: inputs.publicStability < 45,
      memoryInflationRecallCascade: inputs.highInflationScenario && inputs.householdInflationScenarioActive,
      explainabilityInflationSalienceBand: inputs.publicStability < 40 ? 'critical' : inputs.publicStability < 50 ? 'elevated' : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const calendarCarryover = assessCalendarSeasonInflationCarryover({
      calendarSeasonBand: inputs.highInflationScenario ? 'peak_demand' : 'normal',
      policyReviewWindowOpen: inputs.fiscalPressure === 'critical',
      multiTurnInflationCarryover: inputs.householdInflationScenarioActive ? 0.28 : 0.1,
      fiscalCalendarInflationLatch: inputs.creditShockActive,
      multiTurnCarryoverBand: inputs.highInflationScenario ? 'persistent' : 'building',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const automationDrift = assessAutomationAutopilotInflationDrift({
      macroAutopilotInflationBias: inputs.highInflationScenario ? 'inflate' : 'neutral',
      unattendedShockDriftActive: inputs.creditShockActive,
      automationConfidenceScore: inputs.publicStability < 45 ? 0.4 : 0.65,
      idleMacroInflationEscalation: inputs.householdInflationScenarioActive,
      autopilotDriftCascadeBand: inputs.fiscalPressure === 'critical' ? 'runaway' : inputs.creditShockActive ? 'drifting' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const researchOffset = assessResearchProductivityInflationOffset({
      productivityGainBand: inputs.highInflationScenario ? 'flat' : inputs.creditShockActive ? 'moderate' : 'strong',
      supplySideReliefActive: !inputs.creditShockActive || inputs.householdInflationScenarioActive,
      innovationInflationOffsetScore: inputs.highInflationScenario ? 0.38 : 0.62,
      techTreeInflationLatch: inputs.creditShockActive,
      supplySideOffsetBand:
        inputs.fiscalPressure === 'critical' ? 'weak' : inputs.householdInflationScenarioActive ? 'building' : 'strong',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const scenarioBias = assessScenarioSandboxInflationBias({
      scenarioInflationBias: inputs.highInflationScenario ? 'extreme' : inputs.creditShockActive ? 'inflationary' : 'neutral',
      sandboxStressModeActive: inputs.creditShockActive || inputs.fiscalPressure === 'critical',
      difficultyCostMultiplier: inputs.fiscalPressure === 'critical' ? 1.2 : 1.05,
      difficultyInflationCascade: inputs.householdInflationScenarioActive,
      sandboxStressInflationBand: inputs.publicStability < 40 ? 'extreme' : inputs.publicStability < 50 ? 'stressed' : 'routine',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const eventsPersistence = assessEventsNarrativeInflationPersistence({
      inflationShockEventActive: inputs.creditShockActive || inputs.highInflationScenario,
      supplyDisruptionSeverity: inputs.highInflationScenario ? 'national' : inputs.creditShockActive ? 'localized' : 'none',
      confidenceShockBand: inputs.publicStability < 40 ? 'severe' : inputs.publicStability < 50 ? 'uneasy' : 'calm',
      dynamicEventInflationLatch: inputs.householdInflationScenarioActive,
      supplyShockPersistenceBand:
        inputs.fiscalPressure === 'critical' ? 'entrenched' : inputs.creditShockActive ? 'building' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const macroSlippage = assessMacroDemandOverheatInflationSlippage({
      gdpGrowthBand: inputs.highInflationScenario ? 'strong' : inputs.creditShockActive ? 'steady' : 'slow',
      nominalDemandPressure: inputs.highInflationScenario ? 0.72 : inputs.creditShockActive ? 0.48 : 0.22,
      outputGap: inputs.highInflationScenario ? 0.38 : 0.1,
      macroDemandOverheatLatch: inputs.highInflationScenario && inputs.householdInflationScenarioActive,
      transmissionSlippageBand:
        inputs.systemicLiquidityBand === 'critical' ? 'dislocated' : inputs.fiscalPressure === 'critical' ? 'slipping' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const freightCongestion = assessFreightLogisticsInflationCongestion({
      freightCapacityBand: inputs.creditShockActive ? 'critical' : inputs.highInflationScenario ? 'tight' : 'balanced',
      fuelSurchargeActive: inputs.highInflationScenario,
      portBacklogBand: inputs.fiscalPressure === 'critical' ? 'severe' : inputs.creditShockActive ? 'moderate' : 'clear',
      logisticsInflationLatch: inputs.householdInflationScenarioActive,
      freightCongestionBand:
        inputs.systemicLiquidityBand === 'critical' ? 'gridlocked' : inputs.creditShockActive ? 'building' : 'clear',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const housingStress = assessHousingWellbeingInflationEssentialStress({
      mortgageStressBand: inputs.householdInflationScenarioActive ? 'severe' : inputs.creditShockActive ? 'elevated' : 'low',
      wellbeingCostBand: inputs.publicStability < 42 ? 'critical' : inputs.publicStability < 52 ? 'strained' : 'stable',
      essentialServicesInflationFlag: inputs.householdInflationScenarioActive,
      shelterEssentialInflationLatch: inputs.creditShockActive,
      mortgageWellbeingStressBand:
        inputs.fiscalPressure === 'critical' ? 'acute' : inputs.householdInflationScenarioActive ? 'strained' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const commandFusion = assessCommandCenterInflationFusionEscalation({
      macroAlertLevel: inputs.highInflationScenario ? 'red' : inputs.creditShockActive ? 'amber' : 'green',
      inflationFusionScore: inputs.highInflationScenario ? 0.8 : inputs.fiscalPressure === 'critical' ? 0.68 : 0.45,
      coordinatedTighteningSuggested: inputs.fiscalPressure === 'critical',
      macroInflationFusionLatch: inputs.householdInflationScenarioActive,
      commandAlertCascadeBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.creditShockActive ? 'elevated' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const uiSalienceNudge = assessUiPlayerInflationSalienceNudge({
      inflationDashboardStressHighlight: inputs.highInflationScenario,
      playerAttentionOnCostOfLiving: inputs.publicStability < 44 ? 'high' : inputs.householdInflationScenarioActive ? 'medium' : 'low',
      uiNudgeInflationExpectationsUp: inputs.householdInflationScenarioActive,
      playerInflationSalienceLatch: inputs.creditShockActive,
      uiExpectationsNudgeBand: inputs.publicStability < 40 ? 'sharp' : inputs.fiscalPressure === 'critical' ? 'building' : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const fiscalBreach = assessFiscalIndexationInflationAnchorBreach({
      consolidatedDeficitBand: inputs.fiscalPressure === 'critical' ? 'large_deficit' : 'moderate_deficit',
      debtServicePressure: inputs.fiscalPressure === 'critical' ? 'critical' : inputs.sovereignDebtPressure === 'elevated' ? 'elevated' : 'moderate',
      fiscalAnchorBreached: inputs.highInflationScenario,
      debtIndexationInflationLatch: inputs.householdInflationScenarioActive,
      fiscalPassThroughCascadeBand:
        inputs.systemicLiquidityBand === 'critical' ? 'runaway' : inputs.creditShockActive ? 'building' : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const householdDeanchoring = assessHouseholdWageInflationDeanchoring({
      wageGrowthBand: inputs.highInflationScenario ? 'surge' : inputs.householdInflationScenarioActive ? 'elevated' : 'moderate',
      costOfLivingStress: inputs.publicStability < 40 ? 'extreme' : inputs.publicStability < 50 ? 'high' : 'moderate',
      householdExpectationsDeanchoring: inputs.householdInflationScenarioActive,
      wagePriceSpiralLatch: inputs.creditShockActive,
      householdDeanchoringBand:
        inputs.fiscalPressure === 'critical' ? 'unmoored' : inputs.highInflationScenario ? 'drifting' : 'anchored',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const markupCascade = assessCorporateMarkupInflationCascade({
      pricingPowerBand: inputs.highInflationScenario ? 'dominant' : inputs.creditShockActive ? 'strong' : 'moderate',
      passThroughIntent: inputs.highInflationScenario ? 'full' : 'partial',
      marginCompression: inputs.fiscalPressure === 'critical' ? 'severe' : 'mild',
      corporatePricingInflationLatch: inputs.householdInflationScenarioActive,
      markupPassThroughCascadeBand:
        inputs.systemicLiquidityBand === 'critical' ? 'full' : inputs.creditShockActive ? 'partial' : 'absorbed',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const tariffPipeline = assessTradeTariffImportInflationPipeline({
      tradeOpennessBand: 'open',
      exchangeRatePressure: inputs.creditShockActive ? 'sharp_depreciation' : inputs.highInflationScenario ? 'depreciation' : 'stable',
      commodityImportShare: 0.4,
      importTariffInflationLatch: inputs.creditShockActive,
      exchangePipelineStressBand:
        inputs.systemicLiquidityBand === 'critical' ? 'ruptured' : inputs.fiscalPressure === 'critical' ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const metroSurge = assessMetroUrbanRentInflationSurge({
      vacancyBand: inputs.highInflationScenario ? 'critical' : inputs.creditShockActive ? 'tight' : 'balanced',
      rentGrowthBand: inputs.householdInflationScenarioActive ? 'surging' : inputs.highInflationScenario ? 'strong' : 'moderate',
      urbanizationPressure: inputs.fiscalPressure === 'critical' ? 'high' : 'medium',
      urbanRentInflationLatch: inputs.creditShockActive,
      metroDispersionStressBand:
        inputs.publicStability < 42 ? 'critical' : inputs.householdInflationScenarioActive ? 'widening' : 'aligned',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const gridCascade = assessWholesaleGridEnergyInflationCascade({
      wholesaleEnergyStress: inputs.highInflationScenario ? 'crisis' : inputs.creditShockActive ? 'severe' : 'elevated',
      retailTariffShock: inputs.creditShockActive,
      gridReliabilityBand: inputs.systemicLiquidityBand === 'critical' ? 'fragile' : 'stable',
      gridTariffInflationLatch: inputs.householdInflationScenarioActive,
      wholesaleStressCascadeBand: inputs.fiscalPressure === 'critical' ? 'cascade' : inputs.creditShockActive ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const guardianEscalation = assessGuardianGuardrailInflationEscalation({
      inflationGuardrailTripped: inputs.highInflationScenario,
      stabilityInterventionBand: inputs.publicStability < 40 ? 'urgent' : inputs.fiscalPressure === 'critical' ? 'advisory' : 'none',
      narrativeShockSeverity: inputs.publicStability < 45 ? 'high' : inputs.creditShockActive ? 'medium' : 'low',
      guardrailInflationLatch: inputs.householdInflationScenarioActive,
      copilotEscalationBand: inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.creditShockActive ? 'elevated' : 'calm',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const briefingDrift = assessTeamConsensusInflationBriefingDrift({
      consensusInflationOutlook: inputs.highInflationScenario ? 'upside_risk' : inputs.creditShockActive ? 'reacceleration' : 'stable',
      briefingUrgencyBand: inputs.publicStability < 42 ? 'critical' : inputs.householdInflationScenarioActive ? 'elevated' : 'routine',
      crossDomainStressScore: inputs.actorCreditStressIndex ?? 0.4,
      teamBriefingInflationLatch: inputs.creditShockActive,
      consensusDriftBand: inputs.fiscalPressure === 'critical' ? 'unmoored' : inputs.highInflationScenario ? 'drifting' : 'anchored',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const memoryRecallGate = assessMemoryCommonwealthInflationRecallGate({
      recalledInflationRegimeConfidence: inputs.highInflationScenario ? 0.78 : 0.42,
      narrativeDriftTowardHigherInflation: inputs.creditShockActive,
      explainabilityAlertActive: inputs.householdInflationScenarioActive,
      memoryCommonwealthInflationLatch: inputs.highInflationScenario,
      realmRecallGateBand: inputs.fiscalPressure === 'critical' ? 'breached' : inputs.creditShockActive ? 'opening' : 'sealed',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const synthesisCascade = assessAutomationSynthesisInflationCascadeDrift({
      macroAutopilotInflationBias: inputs.highInflationScenario ? 'inflate' : 'neutral',
      unattendedShockDriftActive: inputs.creditShockActive,
      automationConfidenceScore: inputs.publicStability < 38 ? 0.32 : 0.58,
      synthesisAutopilotInflationLatch: inputs.householdInflationScenarioActive,
      cascadeStackDriftBand: inputs.systemicLiquidityBand === 'critical' ? 'runaway' : inputs.fiscalPressure === 'critical' ? 'stacking' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const uiSalienceEscalation = assessUiShellInflationSalienceEscalation({
      inflationDashboardStressHighlight: inputs.highInflationScenario,
      playerAttentionOnCostOfLiving: inputs.householdInflationScenarioActive ? 'high' : inputs.creditShockActive ? 'medium' : 'low',
      uiNudgeInflationExpectationsUp: inputs.creditShockActive,
      wave35SalienceEscalationLatch: inputs.householdInflationScenarioActive,
      shellExpectationsEscalationBand:
        inputs.fiscalPressure === 'critical' ? 'critical' : inputs.highInflationScenario ? 'building' : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const heatmapOverlay = assessDashboardHeatmapInflationOverlayCascade({
      regionalHeatmapInflationAlert: inputs.highInflationScenario,
      mapLayerCostPressureScore: inputs.actorCreditStressIndex ?? 0.45,
      dashboardRefreshUrgency: inputs.publicStability < 42 ? 'critical' : inputs.creditShockActive ? 'elevated' : 'routine',
      regionalInflationOverlayLatch: inputs.creditShockActive,
      heatmapOverlayCascadeBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'widening' : 'routine',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const commandFusionLatch = assessCommandCenterInflationFusionLatch({
      macroAlertLevel: inputs.highInflationScenario ? 'red' : inputs.creditShockActive ? 'amber' : 'green',
      inflationFusionScore: inputs.actorCreditStressIndex ?? 0.42,
      coordinatedTighteningSuggested: inputs.creditShockActive,
      wave36FusionLatch: inputs.householdInflationScenarioActive,
      commandInflationEscalationBand:
        inputs.fiscalPressure === 'critical' ? 'critical' : inputs.highInflationScenario ? 'elevated' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const freightCascade = assessTransportFreightInflationCongestionCascade({
      freightCapacityBand: inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.creditShockActive ? 'tight' : 'balanced',
      fuelSurchargeActive: inputs.creditShockActive,
      portBacklogBand: inputs.publicStability < 40 ? 'severe' : inputs.fiscalPressure === 'critical' ? 'moderate' : 'clear',
      wave36LogisticsInflationLatch: inputs.householdInflationScenarioActive,
      freightCascadeCongestionBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.highInflationScenario ? 'building' : 'clear',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const eventShockPersistence = assessEventsStagedInflationShockPersistence({
      inflationShockEventActive: inputs.highInflationScenario,
      supplyDisruptionSeverity: inputs.creditShockActive ? 'national' : inputs.fiscalPressure === 'critical' ? 'localized' : 'none',
      confidenceShockBand: inputs.publicStability < 42 ? 'severe' : inputs.creditShockActive ? 'uneasy' : 'calm',
      wave37EventInflationLatch: inputs.creditShockActive,
      stagedShockPersistenceBand:
        inputs.fiscalPressure === 'critical' ? 'entrenched' : inputs.highInflationScenario ? 'building' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const sandboxStressCascade = assessModesSandboxInflationStressCascade({
      scenarioInflationBias: inputs.highInflationScenario ? 'extreme' : inputs.householdInflationScenarioActive ? 'inflationary' : 'neutral',
      sandboxStressModeActive: inputs.householdInflationScenarioActive,
      difficultyCostMultiplier: inputs.inflationSettingMultiplier ?? 1,
      wave37SandboxInflationLatch: inputs.householdInflationScenarioActive,
      scenarioBiasCascadeBand:
        inputs.fiscalPressure === 'critical' ? 'runaway' : inputs.creditShockActive ? 'stressed' : 'routine',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const appropriationLatch = assessFiscalAppropriationInflationPressureLatch({
      consolidatedDeficitBand: inputs.fiscalPressure === 'critical' ? 'large_deficit' : inputs.creditShockActive ? 'moderate_deficit' : 'balanced',
      debtServicePressure: inputs.fiscalPressure === 'critical' ? 'critical' : inputs.creditShockActive ? 'elevated' : 'moderate',
      wave38AppropriationInflationLatch: inputs.highInflationScenario,
      fiscalPressureEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'elevated' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const budgetStressCascade = assessHouseholdBudgetInflationStressCascade({
      wageGrowthBand: inputs.householdInflationScenarioActive ? 'surge' : inputs.highInflationScenario ? 'elevated' : 'moderate',
      costOfLivingStress: inputs.publicStability < 42 ? 'extreme' : inputs.publicStability < 50 ? 'high' : 'moderate',
      wave38BudgetInflationLatch: inputs.householdInflationScenarioActive,
      householdStressCascadeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.creditShockActive ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const survivalPricing = assessCorporateSurvivalPricingInflationLatch({
      pricingPowerBand: inputs.highInflationScenario ? 'dominant' : inputs.creditShockActive ? 'strong' : 'moderate',
      passThroughIntent: inputs.fiscalPressure === 'critical' ? 'full' : inputs.householdInflationScenarioActive ? 'partial' : 'absorb',
      marginCompression: inputs.creditShockActive ? 'severe' : 'mild',
      wave39SurvivalPricingLatch: inputs.householdInflationScenarioActive,
      corporateMarkupEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'dominant' : inputs.highInflationScenario ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const tariffExchange = assessTradeTariffExchangeInflationEscalation({
      exchangeRatePressure: inputs.creditShockActive ? 'sharp_depreciation' : inputs.highInflationScenario ? 'depreciation' : 'stable',
      tradeOpennessBand: 'open',
      commodityImportShare: 0.4,
      wave39TariffExchangeLatch: inputs.creditShockActive,
      importExchangeEscalationBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const metroCapacityRent = assessMetroCapacityRentInflationLatch({
      vacancyBand: inputs.householdInflationScenarioActive
        ? 'critical'
        : inputs.highInflationScenario
          ? 'tight'
          : 'balanced',
      rentGrowthBand: inputs.highInflationScenario ? 'surging' : inputs.householdInflationScenarioActive ? 'strong' : 'moderate',
      wave40UrbanRentLatch: inputs.householdInflationScenarioActive,
      metroCapacityStressBand:
        inputs.fiscalPressure === 'critical' ? 'critical' : inputs.creditShockActive ? 'strained' : 'aligned',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const gridWholesaleTariff = assessGridWholesaleTariffInflationSurge({
      wholesaleEnergyStress:
        inputs.systemicLiquidityBand === 'critical'
          ? 'crisis'
          : inputs.creditShockActive
            ? 'severe'
            : inputs.highInflationScenario
              ? 'elevated'
              : 'calm',
      retailTariffShock: inputs.creditShockActive,
      wave40GridTariffLatch: inputs.creditShockActive,
      wholesaleTariffCascadeBand:
        inputs.fiscalPressure === 'critical' ? 'cascade' : inputs.systemicLiquidityBand === 'critical' ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const guardianCopilotPressure = assessGuardianCopilotInflationPressureLatch({
      inflationGuardrailTripped: inputs.highInflationScenario || inputs.creditShockActive,
      stabilityInterventionBand:
        inputs.fiscalPressure === 'critical' ? 'urgent' : inputs.publicStability < 45 ? 'advisory' : 'none',
      wave41GuardianPressureLatch: inputs.householdInflationScenarioActive,
      copilotPressureEscalationBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'runaway'
          : inputs.highInflationScenario
            ? 'elevated'
            : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const teamBriefingUnmooring = assessTeamBriefingConsensusInflationUnmooring({
      consensusInflationOutlook: inputs.highInflationScenario ? 'upside_risk' : inputs.creditShockActive ? 'reacceleration' : 'stable',
      briefingUrgencyBand: inputs.creditShockActive ? 'critical' : inputs.householdInflationScenarioActive ? 'elevated' : 'routine',
      wave41TeamConsensusLatch: inputs.creditShockActive,
      briefingConsensusUnmoorBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'drifting' : 'anchored',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const memoryRealmPersistence = assessMemoryRealmInflationPersistenceLatch({
      recalledInflationRegimeConfidence: inputs.highInflationScenario ? 0.8 : 0.5,
      narrativeDriftTowardHigherInflation: inputs.highInflationScenario,
      wave42MemoryRecallLatch: inputs.householdInflationScenarioActive,
      realmPersistenceGateBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.creditShockActive ? 'slipping' : 'anchored',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const automationCascadeSurge = assessAutomationSynthesisInflationCascadeSurge({
      macroAutopilotInflationBias: inputs.highInflationScenario ? 'inflate' : inputs.creditShockActive ? 'neutral' : 'deflate',
      unattendedShockDriftActive: inputs.creditShockActive,
      wave42SynthesisCascadeLatch: inputs.creditShockActive,
      autopilotStackSurgeBand:
        inputs.systemicLiquidityBand === 'critical' ? 'surge' : inputs.fiscalPressure === 'critical' ? 'stacking' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const uiShellAttention = assessUiShellInflationAttentionLatch({
      inflationDashboardStressHighlight: inputs.highInflationScenario,
      playerAttentionOnCostOfLiving: inputs.householdInflationScenarioActive
        ? 'high'
        : inputs.creditShockActive
          ? 'medium'
          : 'low',
      wave43ShellAttentionLatch: inputs.householdInflationScenarioActive,
      playerSaliencePressureBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'critical'
          : inputs.highInflationScenario
            ? 'elevated'
            : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const dashboardOverlaySurge = assessDashboardRegionalInflationOverlaySurge({
      regionalHeatmapInflationAlert: inputs.highInflationScenario || inputs.creditShockActive,
      mapLayerCostPressureScore: inputs.fiscalPressure === 'critical' ? 0.75 : 0.45,
      wave43HeatmapOverlayLatch: inputs.creditShockActive,
      regionalOverlaySurgeBand:
        inputs.fiscalPressure === 'critical' ? 'surge' : inputs.systemicLiquidityBand === 'critical' ? 'widening' : 'routine',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const commandAlertPressure = assessCommandCenterInflationAlertPressureLatch({
      macroAlertLevel: inputs.highInflationScenario ? 'red' : inputs.creditShockActive ? 'amber' : 'green',
      inflationFusionScore: inputs.fiscalPressure === 'critical' ? 0.8 : 0.5,
      wave44CommandAlertLatch: inputs.householdInflationScenarioActive,
      commandAlertPressureBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'critical'
          : inputs.highInflationScenario
            ? 'elevated'
            : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const freightGridlockSurge = assessTransportFreightInflationGridlockSurge({
      freightCapacityBand: inputs.fiscalPressure === 'critical' ? 'critical' : inputs.creditShockActive ? 'tight' : 'balanced',
      fuelSurchargeActive: inputs.creditShockActive,
      wave44FreightGridlockLatch: inputs.creditShockActive,
      freightGridlockSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'building' : 'clear',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const eventsNarrativeShock = assessEventsNarrativeInflationShockLatch({
      inflationShockEventActive: inputs.highInflationScenario || inputs.creditShockActive,
      supplyDisruptionSeverity:
        inputs.fiscalPressure === 'critical' ? 'national' : inputs.creditShockActive ? 'localized' : 'none',
      wave45EventShockLatch: inputs.householdInflationScenarioActive,
      narrativeShockEntrenchBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'entrenched'
          : inputs.fiscalPressure === 'critical'
            ? 'building'
            : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const modesSandboxPressure = assessModesSandboxInflationPressureSurge({
      scenarioInflationBias: inputs.highInflationScenario ? 'extreme' : inputs.householdInflationScenarioActive ? 'inflationary' : 'neutral',
      sandboxStressModeActive: inputs.householdInflationScenarioActive,
      wave45SandboxPressureLatch: inputs.creditShockActive,
      scenarioStressSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'surge' : inputs.systemicLiquidityBand === 'critical' ? 'stressed' : 'routine',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const fiscalConsolidatedPressure = assessFiscalConsolidatedInflationPressureLatch({
      consolidatedDeficitBand:
        inputs.fiscalPressure === 'critical' ? 'large_deficit' : inputs.creditShockActive ? 'moderate_deficit' : 'balanced',
      debtServicePressure:
        inputs.fiscalPressure === 'critical' ? 'critical' : inputs.systemicLiquidityBand === 'critical' ? 'elevated' : 'moderate',
      wave46FiscalPressureLatch: inputs.householdInflationScenarioActive,
      consolidatedDeficitEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.highInflationScenario ? 'elevated' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const householdWageStress = assessHouseholdWageInflationStressSurge({
      wageGrowthBand: inputs.householdInflationScenarioActive ? 'surge' : inputs.highInflationScenario ? 'elevated' : 'moderate',
      costOfLivingStress: inputs.publicStability < 42 ? 'extreme' : inputs.publicStability < 50 ? 'high' : 'moderate',
      wave46HouseholdStressLatch: inputs.creditShockActive,
      wageStressSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const macroOutputGapLatch = assessMacroOutputGapInflationPressureLatch({
      gdpGrowthBand: inputs.highInflationScenario ? 'strong' : inputs.creditShockActive ? 'steady' : 'slow',
      outputGap: inputs.householdInflationScenarioActive ? 0.48 : inputs.highInflationScenario ? 0.32 : 0.08,
      wave47MacroOutputGapLatch: inputs.householdInflationScenarioActive,
      outputGapEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'elevated' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const corporateCapacitySurge = assessCorporateCapacityMarkupInflationSurge({
      pricingPowerBand: inputs.highInflationScenario ? 'dominant' : inputs.creditShockActive ? 'strong' : 'moderate',
      marginCompression: inputs.fiscalPressure === 'critical' ? 'mild' : 'none',
      wave47CorporateCapacityLatch: inputs.creditShockActive,
      capacityMarkupSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const researchBreakthroughLatch = assessResearchBreakthroughSupplySideInflationLatch({
      productivityGainBand: inputs.highInflationScenario ? 'flat' : inputs.householdInflationScenarioActive ? 'moderate' : 'strong',
      supplySideReliefActive: !inputs.householdInflationScenarioActive,
      wave48ResearchBreakthroughLatch: inputs.householdInflationScenarioActive,
      researchSupplySideFailureBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const tradeImportPipelineSurge = assessTradeImportExchangeInflationPipelineSurge({
      tradeOpennessBand: inputs.highInflationScenario ? 'open' : 'mixed',
      exchangeRatePressure: inputs.creditShockActive ? 'sharp_depreciation' : inputs.householdInflationScenarioActive ? 'depreciation' : 'stable',
      wave48TradeImportPipelineLatch: inputs.creditShockActive,
      importExchangePipelineSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const metroRegionalRentEscalation = assessMetroRegionalRentInflationEscalationLatch({
      rentGrowthBand: inputs.householdInflationScenarioActive ? 'surging' : inputs.highInflationScenario ? 'strong' : 'moderate',
      regionalDispersionScore: inputs.householdInflationScenarioActive ? 0.58 : inputs.highInflationScenario ? 0.42 : 0.22,
      wave49MetroRegionalRentLatch: inputs.householdInflationScenarioActive,
      regionalRentEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const wholesaleGridTransitionSurge = assessWholesaleGridTransitionInflationSurge({
      wholesaleEnergyStress: inputs.systemicLiquidityBand === 'critical' ? 'crisis' : inputs.creditShockActive ? 'severe' : 'elevated',
      emissionsTransitionCostBand: inputs.fiscalPressure === 'critical' ? 'high' : 'medium',
      wave49GridTransitionSurgeLatch: inputs.creditShockActive,
      gridTransitionStressBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const tradeClearedForwardArcHandoff = assessTradeClearedForwardArcInflationHandoffLatch({
      tradeOpennessBand: inputs.highInflationScenario ? 'open' : 'mixed',
      exchangeRatePressure: inputs.creditShockActive ? 'sharp_depreciation' : inputs.householdInflationScenarioActive ? 'depreciation' : 'stable',
      wave49ClearedForwardArcHandoffLatch: inputs.creditShockActive,
      clearedForwardArcHandoffContinuityBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'strained' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const guardianEntrustmentEnvelope = assessGuardianEntrustmentEnvelopeInflationPressureSurge({
      inflationGuardrailTripped: inputs.highInflationScenario,
      stabilityInterventionBand:
        inputs.publicStability < 38 ? 'urgent' : inputs.fiscalPressure === 'critical' ? 'advisory' : 'none',
      wave49EntrustmentEnvelopeLatch: inputs.householdInflationScenarioActive,
      entrustmentEnvelopePressureBand:
        inputs.systemicLiquidityBand === 'critical' ? 'ruptured' : inputs.publicStability < 45 ? 'elevated' : 'contained',
      entrustmentStrainIndex: inputs.publicStability < 42 ? 0.76 : 0.48,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const housingWellbeingMortgageEscalation = assessHousingWellbeingMortgageInflationEscalationLatch({
      mortgageStressBand:
        inputs.householdInflationScenarioActive ? 'severe' : inputs.highInflationScenario ? 'elevated' : 'low',
      wellbeingCostBand:
        inputs.fiscalPressure === 'critical' ? 'critical' : inputs.householdInflationScenarioActive ? 'strained' : 'stable',
      wave50HousingWellbeingEscalationLatch: inputs.householdInflationScenarioActive,
      mortgageWellbeingEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'acute' : inputs.fiscalPressure === 'critical' ? 'building' : 'contained',
      essentialServicesInflationFlag: inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const transportCorridorFreightSurge = assessTransportCorridorFreightInflationSurgeLatch({
      freightCapacityBand: inputs.creditShockActive ? 'critical' : inputs.highInflationScenario ? 'tight' : 'balanced',
      fuelSurchargeActive: inputs.creditShockActive,
      wave50FreightCorridorSurgeLatch: inputs.creditShockActive,
      corridorFreightSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'building' : 'clear',
      portBacklogBand:
        inputs.systemicLiquidityBand === 'critical' ? 'severe' : inputs.creditShockActive ? 'moderate' : 'clear',
      inflationBand: r.state.inflation,
      turn: t,
    });
    maxCost = Math.max(maxCost, r.state.modifiers.costOfLivingMultiplier);
    points.push({
      turn: t,
      inflationBand: r.state.inflation,
      costMultiplier: r.state.modifiers.costOfLivingMultiplier,
      anchoringScore: anchoring,
      spiralRisk: spiral.spiralRisk,
      headlineCpiIndex: cpi.headlineIndex,
      coreCpiIndex: coreSpread.coreIndex,
      regime: regimeSnap?.regime ?? 'anchored_soft',
      momentumScore: mom.snapshot.momentumScore,
      momentumDirection: mom.snapshot.direction,
      importPassThroughBand: importPass.passThroughBand,
      termPremiumSignalBand: termPrem.signalBand,
      energyPassThroughBand: energyPass.passThroughBand,
      shelterRentPressureBand: shelterRent.pressureBand,
      foodGroceryPassThroughBand: foodGrocery.passThroughBand,
      transportLogisticsPressureBand: transportLog.pressureBand,
      healthcareServicesPressureBand: healthcare.pressureBand,
      insurancePremiumPassThroughBand: insurancePrem.passThroughBand,
      educationTuitionPressureBand: educationTuition.pressureBand,
      communicationsServicesPressureBand: commsServices.pressureBand,
      recreationLeisurePressureBand: recreation.pressureBand,
      professionalServicesFeeBand: professionalFees.feeBand,
      childcareServicesPressureBand: childcare.pressureBand,
      governmentChargesPressureBand: govCharges.pressureBand,
      waterUtilitiesPressureBand: waterUtils.pressureBand,
      domesticTravelPressureBand: domesticTravel.pressureBand,
      constructionMaterialsPressureBand: constructionMaterials.pressureBand,
      retailTradeMarginBand: retailMargin.marginBand,
      financialServicesFeeBand: financialFees.feeBand,
      agriculturalFarmgatePressureBand: farmgate.pressureBand,
      publicUtilitiesGridTariffBand: publicGrid.tariffBand,
      uiInflationSalienceBand: uiSalience.salienceBand,
      housingMortgageEssentialBand: housingEssential.essentialBand,
      macroTransmissionMergeBand: macroMerge.mergeBand,
      dynamicEventsInflationSpilloverBand: eventsSpillover.spilloverBand,
      dashboardMapInflationOverlayBand: dashboardOverlay.overlayBand,
      publicFinanceDebtServiceBand: publicFinanceDebt.debtServiceBand,
      populationLaborWageBand: populationLabor.wageBand,
      wholesaleEnergyTransitionBand: wholesaleEnergy.transitionBand,
      urbanRentDispersionBand: urbanRent.dispersionBand,
      corporatePricingPassThroughBand: corporatePricing.passThroughBand,
      tradeExchangeImportBand: tradeImport.importBand,
      guardianInflationInterventionBand: guardianIntervention.interventionBand,
      teamIntelligenceConsensusBand: teamConsensus.consensusBand,
      strategicGeopoliticalPremiumBand: strategicPremium.premiumBand,
      aiMemoryInflationRecallBand: memoryRecall.recallBand,
      calendarSeasonInflationCarryoverBand: calendarCarryover.carryoverBand,
      automationAutopilotInflationDriftBand: automationDrift.driftBand,
      researchProductivityInflationOffsetBand: researchOffset.offsetBand,
      scenarioSandboxInflationBiasBand: scenarioBias.biasBand,
      eventsNarrativeInflationPersistenceBand: eventsPersistence.persistenceBand,
      macroDemandOverheatInflationSlippageBand: macroSlippage.slippageBand,
      freightLogisticsInflationCongestionBand: freightCongestion.congestionBand,
      housingWellbeingInflationEssentialStressBand: housingStress.stressBand,
      commandCenterInflationFusionEscalationBand: commandFusion.escalationBand,
      uiPlayerInflationSalienceNudgeBand: uiSalienceNudge.nudgeBand,
      fiscalIndexationInflationAnchorBreachBand: fiscalBreach.breachBand,
      householdWageInflationDeanchoringBand: householdDeanchoring.deanchoringBand,
      corporateMarkupInflationCascadeBand: markupCascade.cascadeBand,
      tradeTariffImportInflationPipelineBand: tariffPipeline.pipelineBand,
      metroUrbanRentInflationSurgeBand: metroSurge.surgeBand,
      wholesaleGridEnergyInflationCascadeBand: gridCascade.cascadeBand,
      guardianGuardrailInflationEscalationBand: guardianEscalation.escalationBand,
      teamConsensusInflationBriefingDriftBand: briefingDrift.driftBand,
      memoryCommonwealthInflationRecallGateBand: memoryRecallGate.gateBand,
      automationSynthesisInflationCascadeDriftBand: synthesisCascade.driftBand,
      uiShellInflationSalienceEscalationBand: uiSalienceEscalation.escalationBand,
      dashboardHeatmapInflationOverlayCascadeBand: heatmapOverlay.cascadeBand,
      commandCenterInflationFusionLatchBand: commandFusionLatch.latchBand,
      transportFreightInflationCongestionCascadeBand: freightCascade.cascadeBand,
      eventsStagedInflationShockPersistenceBand: eventShockPersistence.persistenceBand,
      modesSandboxInflationStressCascadeBand: sandboxStressCascade.cascadeBand,
      fiscalAppropriationInflationPressureLatchBand: appropriationLatch.latchBand,
      householdBudgetInflationStressCascadeBand: budgetStressCascade.cascadeBand,
      corporateSurvivalPricingInflationLatchBand: survivalPricing.latchBand,
      tradeTariffExchangeInflationEscalationBand: tariffExchange.escalationBand,
      metroCapacityRentInflationLatchBand: metroCapacityRent.latchBand,
      gridWholesaleTariffInflationSurgeBand: gridWholesaleTariff.surgeBand,
      guardianCopilotInflationPressureLatchBand: guardianCopilotPressure.latchBand,
      teamBriefingConsensusInflationUnmooringBand: teamBriefingUnmooring.unmooringBand,
      memoryRealmInflationPersistenceLatchBand: memoryRealmPersistence.latchBand,
      automationSynthesisInflationCascadeSurgeBand: automationCascadeSurge.surgeBand,
      uiShellInflationAttentionLatchBand: uiShellAttention.latchBand,
      dashboardRegionalInflationOverlaySurgeBand: dashboardOverlaySurge.surgeBand,
      commandCenterInflationAlertPressureLatchBand: commandAlertPressure.latchBand,
      transportFreightInflationGridlockSurgeBand: freightGridlockSurge.surgeBand,
      eventsNarrativeInflationShockLatchBand: eventsNarrativeShock.latchBand,
      modesSandboxInflationPressureSurgeBand: modesSandboxPressure.surgeBand,
      fiscalConsolidatedInflationPressureLatchBand: fiscalConsolidatedPressure.latchBand,
      householdWageInflationStressSurgeBand: householdWageStress.surgeBand,
      macroOutputGapInflationPressureLatchBand: macroOutputGapLatch.latchBand,
      corporateCapacityMarkupInflationSurgeBand: corporateCapacitySurge.surgeBand,
      researchBreakthroughSupplySideInflationLatchBand: researchBreakthroughLatch.latchBand,
      tradeImportExchangeInflationPipelineSurgeBand: tradeImportPipelineSurge.surgeBand,
      metroRegionalRentInflationEscalationLatchBand: metroRegionalRentEscalation.latchBand,
      wholesaleGridTransitionInflationSurgeBand: wholesaleGridTransitionSurge.surgeBand,
      tradeClearedForwardArcInflationHandoffLatchBand: tradeClearedForwardArcHandoff.latchBand,
      guardianEntrustmentEnvelopeInflationPressureSurgeBand: guardianEntrustmentEnvelope.surgeBand,
      housingWellbeingMortgageInflationEscalationLatchBand: housingWellbeingMortgageEscalation.latchBand,
      transportCorridorFreightInflationSurgeLatchBand: transportCorridorFreightSurge.surgeBand,
    });
  }

  return {
    points,
    terminalBand: points[points.length - 1]?.inflationBand ?? 'anchored',
    maxCostMultiplier: maxCost,
  };
}


// --- source: integration/inflation-regime-tracker.ts ---

export type InflationRegimeLabel =
  | 'disinflationary'
  | 'anchored_soft'
  | 'reflation'
  | 'overheat'
  | 'stagflation_risk';

export interface InflationRegimeSnapshot {
  turn: number;
  regime: InflationRegimeLabel;
  persistenceScore: number;
  bandStreak: number;
  priorBand: InflationConditionsBand | null;
}

export interface InflationRegimeTrackerState {
  lastBand: InflationConditionsBand | null;
  bandStreak: number;
  persistenceScore: number;
  history: InflationRegimeSnapshot[];
}

export function createInitialInflationRegimeTracker(): InflationRegimeTrackerState {
  return {
    lastBand: null,
    bandStreak: 0,
    persistenceScore: 50,
    history: [],
  };
}

function labelFromBands(
  band: InflationConditionsBand,
  creditStressed: boolean,
  fiscalCritical: boolean,
): InflationRegimeLabel {
  const rank = inflationBandSeverityRank(band);
  if (rank <= inflationBandSeverityRank('disinflation')) return 'disinflationary';
  if (creditStressed && fiscalCritical && rank >= inflationBandSeverityRank('elevated')) {
    return 'stagflation_risk';
  }
  if (rank >= inflationBandSeverityRank('high')) return 'overheat';
  if (rank >= inflationBandSeverityRank('elevated')) return 'reflation';
  return 'anchored_soft';
}

/** Deterministic regime memory for multi-turn dashboards (max 24 snapshots). */
export function stepInflationRegimeTracker(
  state: InflationRegimeTrackerState,
  turn: number,
  band: InflationConditionsBand,
  opts?: { creditStressed?: boolean; fiscalCritical?: boolean },
): InflationRegimeTrackerState {
  const creditStressed = opts?.creditStressed ?? false;
  const fiscalCritical = opts?.fiscalCritical ?? false;

  const bandStreak = state.lastBand === band ? state.bandStreak + 1 : 1;
  const rankDelta =
    state.lastBand != null ? inflationBandSeverityRank(band) - inflationBandSeverityRank(state.lastBand) : 0;

  let persistenceScore = state.persistenceScore;
  if (bandStreak >= 3) persistenceScore += 4;
  if (Math.abs(rankDelta) >= 2) persistenceScore -= 6;
  persistenceScore = finClamp(persistenceScore, 5, 95);

  const regime = labelFromBands(band, creditStressed, fiscalCritical);
  const snapshot: InflationRegimeSnapshot = {
    turn,
    regime,
    persistenceScore: finRound(persistenceScore, 1),
    bandStreak,
    priorBand: state.lastBand,
  };

  return {
    lastBand: band,
    bandStreak,
    persistenceScore: finRound(persistenceScore, 1),
    history: [...state.history, snapshot].slice(-24),
  };
}

export function inflationRegimePersistenceHalfLifeTurns(persistenceScore: number): number {
  const s = finClamp(persistenceScore, 0, 100);
  return finRound(2 + (s / 100) * 10, 1);
}


// --- source: integration/agent21-forecast-bridge.ts ---

/** Contract surface for Agent 21 forecasting fusion (read-only bundle). */
export interface Agent21InflationForecastBundle {
  schemaVersion: '10.14.agent10.r50';
  horizonTurns: number;
  terminalBand: InflationForecastPath['terminalBand'];
  maxCostMultiplier: number;
  meanAnchoringScore: number;
  terminalMomentumDirection: InflationMomentumSnapshot['direction'];
  realRateGapBand: RealRateGapAssessment['gapBand'];
  creditInflationFeedback: CreditInflationFeedbackAssessment['feedbackLoop'];
  terminalImportPassThrough: ImportPassThroughBand;
  terminalTermPremiumSignal: TermPremiumSignalBand;
  terminalEnergyPassThrough: EnergyPassThroughBand;
  terminalShelterRentPressure: ShelterRentPressureBand;
  terminalFoodGroceryPassThrough: FoodGroceryPassThroughBand;
  terminalTransportLogisticsPressure: TransportLogisticsPressureBand;
  terminalHealthcareServicesPressure: HealthcareServicesPressureBand;
  terminalInsurancePremiumPassThrough: InsurancePremiumPassThroughBand;
  terminalEducationTuitionPressure: EducationTuitionPressureBand;
  terminalCommunicationsServicesPressure: CommunicationsServicesPressureBand;
  terminalRecreationLeisurePressure: RecreationLeisurePressureBand;
  terminalProfessionalServicesFee: ProfessionalServicesFeeBand;
  terminalChildcareServicesPressure: ChildcareServicesPressureBand;
  terminalGovernmentChargesPressure: GovernmentChargesPressureBand;
  terminalWaterUtilitiesPressure: WaterUtilitiesPressureBand;
  terminalDomesticTravelPressure: DomesticTravelPressureBand;
  terminalConstructionMaterialsPressure: ConstructionMaterialsPressureBand;
  terminalRetailTradeMargin: RetailTradeMarginBand;
  terminalFinancialServicesFee: FinancialServicesFeeBand;
  terminalAgriculturalFarmgatePressure: AgriculturalFarmgatePressureBand;
  terminalPublicUtilitiesGridTariff: PublicUtilitiesGridTariffBand;
  terminalUiInflationSalience: UiInflationSalienceBand;
  terminalHousingMortgageEssential: HousingMortgageEssentialBand;
  terminalMacroTransmissionMerge: MacroTransmissionMergeBand;
  terminalDynamicEventsInflationSpillover: DynamicEventsInflationSpilloverBand;
  terminalDashboardMapInflationOverlay: DashboardMapInflationOverlayBand;
  terminalPublicFinanceDebtService: PublicFinanceDebtServiceBand;
  terminalPopulationLaborWage: PopulationLaborWageBand;
  terminalWholesaleEnergyTransition: WholesaleEnergyTransitionBand;
  terminalUrbanRentDispersion: UrbanRentDispersionBand;
  terminalCorporatePricingPassThrough: CorporatePricingPassThroughBand;
  terminalTradeExchangeImport: TradeExchangeImportBand;
  terminalGuardianInflationIntervention: GuardianInflationInterventionBand;
  terminalTeamIntelligenceConsensus: TeamIntelligenceConsensusBand;
  terminalStrategicGeopoliticalPremium: StrategicGeopoliticalPremiumBand;
  terminalAiMemoryInflationRecall: AiMemoryInflationRecallBand;
  terminalCalendarSeasonInflationCarryover: CalendarSeasonInflationCarryoverBand;
  terminalAutomationAutopilotInflationDrift: AutomationAutopilotInflationDriftBand;
  terminalResearchProductivityInflationOffset: ResearchProductivityInflationOffsetBand;
  terminalScenarioSandboxInflationBias: ScenarioSandboxInflationBiasBand;
  terminalEventsNarrativeInflationPersistence: EventsNarrativeInflationPersistenceBand;
  terminalMacroDemandOverheatInflationSlippage: MacroDemandOverheatInflationSlippageBand;
  terminalFreightLogisticsInflationCongestion: FreightLogisticsInflationCongestionBand;
  terminalHousingWellbeingInflationEssentialStress: HousingWellbeingInflationEssentialStressBand;
  terminalCommandCenterInflationFusionEscalation: CommandCenterInflationFusionEscalationBand;
  terminalUiPlayerInflationSalienceNudge: UiPlayerInflationSalienceNudgeBand;
  terminalFiscalIndexationInflationAnchorBreach: FiscalIndexationInflationAnchorBreachBand;
  terminalHouseholdWageInflationDeanchoring: HouseholdWageInflationDeanchoringBand;
  terminalCorporateMarkupInflationCascade: CorporateMarkupInflationCascadeBand;
  terminalTradeTariffImportInflationPipeline: TradeTariffImportInflationPipelineBand;
  terminalMetroUrbanRentInflationSurge: MetroUrbanRentInflationSurgeBand;
  terminalWholesaleGridEnergyInflationCascade: WholesaleGridEnergyInflationCascadeBand;
  terminalGuardianGuardrailInflationEscalation: GuardianGuardrailInflationEscalationBand;
  terminalTeamConsensusInflationBriefingDrift: TeamConsensusInflationBriefingDriftBand;
  terminalMemoryCommonwealthInflationRecallGate: MemoryCommonwealthInflationRecallGateBand;
  terminalAutomationSynthesisInflationCascadeDrift: AutomationSynthesisInflationCascadeDriftBand;
  terminalUiShellInflationSalienceEscalation: UiShellInflationSalienceEscalationBand;
  terminalDashboardHeatmapInflationOverlayCascade: DashboardHeatmapInflationOverlayCascadeBand;
  terminalCommandCenterInflationFusionLatch: CommandCenterInflationFusionLatchBand;
  terminalTransportFreightInflationCongestionCascade: TransportFreightInflationCongestionCascadeBand;
  terminalEventsStagedInflationShockPersistence: EventsStagedInflationShockPersistenceBand;
  terminalModesSandboxInflationStressCascade: ModesSandboxInflationStressCascadeBand;
  terminalFiscalAppropriationInflationPressureLatch: FiscalAppropriationInflationPressureLatchBand;
  terminalHouseholdBudgetInflationStressCascade: HouseholdBudgetInflationStressCascadeBand;
  terminalCorporateSurvivalPricingInflationLatch: CorporateSurvivalPricingInflationLatchBand;
  terminalTradeTariffExchangeInflationEscalation: TradeTariffExchangeInflationEscalationBand;
  terminalMetroCapacityRentInflationLatch: MetroCapacityRentInflationLatchBand;
  terminalGridWholesaleTariffInflationSurge: GridWholesaleTariffInflationSurgeBand;
  terminalGuardianCopilotInflationPressureLatch: GuardianCopilotInflationPressureLatchBand;
  terminalTeamBriefingConsensusInflationUnmooring: TeamBriefingConsensusInflationUnmooringBand;
  terminalMemoryRealmInflationPersistenceLatch: MemoryRealmInflationPersistenceLatchBand;
  terminalAutomationSynthesisInflationCascadeSurge: AutomationSynthesisInflationCascadeSurgeBand;
  terminalUiShellInflationAttentionLatch: UiShellInflationAttentionLatchBand;
  terminalDashboardRegionalInflationOverlaySurge: DashboardRegionalInflationOverlaySurgeBand;
  terminalCommandCenterInflationAlertPressureLatch: CommandCenterInflationAlertPressureLatchBand;
  terminalTransportFreightInflationGridlockSurge: TransportFreightInflationGridlockSurgeBand;
  terminalEventsNarrativeInflationShockLatch: EventsNarrativeInflationShockLatchBand;
  terminalModesSandboxInflationPressureSurge: ModesSandboxInflationPressureSurgeBand;
  terminalFiscalConsolidatedInflationPressureLatch: FiscalConsolidatedInflationPressureLatchBand;
  terminalHouseholdWageInflationStressSurge: HouseholdWageInflationStressSurgeBand;
  terminalMacroOutputGapInflationPressureLatch: MacroOutputGapInflationPressureLatchBand;
  terminalCorporateCapacityMarkupInflationSurge: CorporateCapacityMarkupInflationSurgeBand;
  terminalResearchBreakthroughSupplySideInflationLatch: ResearchBreakthroughSupplySideInflationLatchBand;
  terminalTradeImportExchangeInflationPipelineSurge: TradeImportExchangeInflationPipelineSurgeBand;
  terminalMetroRegionalRentInflationEscalationLatch: MetroRegionalRentInflationEscalationLatchBand;
  terminalWholesaleGridTransitionInflationSurge: WholesaleGridTransitionInflationSurgeBand;
  terminalTradeClearedForwardArcInflationHandoffLatch: TradeClearedForwardArcInflationHandoffLatchBand;
  terminalGuardianEntrustmentEnvelopeInflationPressureSurge: GuardianEntrustmentEnvelopeInflationPressureSurgeBand;
  terminalHousingWellbeingMortgageInflationEscalationLatch: HousingWellbeingMortgageInflationEscalationLatchBand;
  terminalTransportCorridorFreightInflationSurgeLatch: TransportCorridorFreightInflationSurgeLatchBand;
  regime: InflationRegimeSnapshot | null;
  shockDriver: InflationShockClassification['driver'];
  fiscalDominanceBand: FiscalDominanceAssessment['band'];
  targetBreachSeverity: InflationTargetBreach['breachSeverity'];
  integrationNote: string;
}

export function buildAgent21InflationForecastBundle(input: {
  path: InflationForecastPath;
  regime: InflationRegimeSnapshot | null;
  shock: InflationShockClassification;
  fiscalDominance: FiscalDominanceAssessment;
  targetBreach: InflationTargetBreach;
  momentum?: InflationMomentumSnapshot | null;
  realRateGap?: RealRateGapAssessment | null;
  creditFeedback?: CreditInflationFeedbackAssessment | null;
}): Agent21InflationForecastBundle {
  const meanAnchoring =
    input.path.points.length === 0
      ? 0
      : finRound(
          input.path.points.reduce((s, p) => s + p.anchoringScore, 0) / input.path.points.length,
          1,
        );

  const lastPoint = input.path.points[input.path.points.length - 1];

  return {
    schemaVersion: '10.14.agent10.r50',
    horizonTurns: input.path.points.length,
    terminalBand: input.path.terminalBand,
    maxCostMultiplier: input.path.maxCostMultiplier,
    meanAnchoringScore: meanAnchoring,
    terminalMomentumDirection: input.momentum?.direction ?? lastPoint?.momentumDirection ?? 'stable',
    realRateGapBand: input.realRateGap?.gapBand ?? 'neutral',
    creditInflationFeedback: input.creditFeedback?.feedbackLoop ?? 'neutral',
    terminalImportPassThrough: lastPoint?.importPassThroughBand ?? 'muted',
    terminalTermPremiumSignal: lastPoint?.termPremiumSignalBand ?? 'anchored',
    terminalEnergyPassThrough: lastPoint?.energyPassThroughBand ?? 'subdued',
    terminalShelterRentPressure: lastPoint?.shelterRentPressureBand ?? 'soft',
    terminalFoodGroceryPassThrough: lastPoint?.foodGroceryPassThroughBand ?? 'stable',
    terminalTransportLogisticsPressure: lastPoint?.transportLogisticsPressureBand ?? 'smooth',
    terminalHealthcareServicesPressure: lastPoint?.healthcareServicesPressureBand ?? 'contained',
    terminalInsurancePremiumPassThrough: lastPoint?.insurancePremiumPassThroughBand ?? 'stable',
    terminalEducationTuitionPressure: lastPoint?.educationTuitionPressureBand ?? 'stable',
    terminalCommunicationsServicesPressure: lastPoint?.communicationsServicesPressureBand ?? 'soft',
    terminalRecreationLeisurePressure: lastPoint?.recreationLeisurePressureBand ?? 'soft',
    terminalProfessionalServicesFee: lastPoint?.professionalServicesFeeBand ?? 'stable',
    terminalChildcareServicesPressure: lastPoint?.childcareServicesPressureBand ?? 'stable',
    terminalGovernmentChargesPressure: lastPoint?.governmentChargesPressureBand ?? 'flat',
    terminalWaterUtilitiesPressure: lastPoint?.waterUtilitiesPressureBand ?? 'stable',
    terminalDomesticTravelPressure: lastPoint?.domesticTravelPressureBand ?? 'subdued',
    terminalConstructionMaterialsPressure: lastPoint?.constructionMaterialsPressureBand ?? 'soft',
    terminalRetailTradeMargin: lastPoint?.retailTradeMarginBand ?? 'stable',
    terminalFinancialServicesFee: lastPoint?.financialServicesFeeBand ?? 'subdued',
    terminalAgriculturalFarmgatePressure: lastPoint?.agriculturalFarmgatePressureBand ?? 'soft',
    terminalPublicUtilitiesGridTariff: lastPoint?.publicUtilitiesGridTariffBand ?? 'subdued',
    terminalUiInflationSalience: lastPoint?.uiInflationSalienceBand ?? 'muted',
    terminalHousingMortgageEssential: lastPoint?.housingMortgageEssentialBand ?? 'subdued',
    terminalMacroTransmissionMerge: lastPoint?.macroTransmissionMergeBand ?? 'coherent',
    terminalDynamicEventsInflationSpillover: lastPoint?.dynamicEventsInflationSpilloverBand ?? 'muted',
    terminalDashboardMapInflationOverlay: lastPoint?.dashboardMapInflationOverlayBand ?? 'routine',
    terminalPublicFinanceDebtService: lastPoint?.publicFinanceDebtServiceBand ?? 'anchored',
    terminalPopulationLaborWage: lastPoint?.populationLaborWageBand ?? 'subdued',
    terminalWholesaleEnergyTransition: lastPoint?.wholesaleEnergyTransitionBand ?? 'stable',
    terminalUrbanRentDispersion: lastPoint?.urbanRentDispersionBand ?? 'aligned',
    terminalCorporatePricingPassThrough: lastPoint?.corporatePricingPassThroughBand ?? 'absorbed',
    terminalTradeExchangeImport: lastPoint?.tradeExchangeImportBand ?? 'anchored',
    terminalGuardianInflationIntervention: lastPoint?.guardianInflationInterventionBand ?? 'calm',
    terminalTeamIntelligenceConsensus: lastPoint?.teamIntelligenceConsensusBand ?? 'anchored',
    terminalStrategicGeopoliticalPremium: lastPoint?.strategicGeopoliticalPremiumBand ?? 'contained',
    terminalAiMemoryInflationRecall: lastPoint?.aiMemoryInflationRecallBand ?? 'anchored',
    terminalCalendarSeasonInflationCarryover: lastPoint?.calendarSeasonInflationCarryoverBand ?? 'off_season',
    terminalAutomationAutopilotInflationDrift: lastPoint?.automationAutopilotInflationDriftBand ?? 'neutral',
    terminalResearchProductivityInflationOffset: lastPoint?.researchProductivityInflationOffsetBand ?? 'neutral',
    terminalScenarioSandboxInflationBias: lastPoint?.scenarioSandboxInflationBiasBand ?? 'neutral',
    terminalEventsNarrativeInflationPersistence: lastPoint?.eventsNarrativeInflationPersistenceBand ?? 'muted',
    terminalMacroDemandOverheatInflationSlippage: lastPoint?.macroDemandOverheatInflationSlippageBand ?? 'anchored',
    terminalFreightLogisticsInflationCongestion: lastPoint?.freightLogisticsInflationCongestionBand ?? 'clear',
    terminalHousingWellbeingInflationEssentialStress: lastPoint?.housingWellbeingInflationEssentialStressBand ?? 'stable',
    terminalCommandCenterInflationFusionEscalation: lastPoint?.commandCenterInflationFusionEscalationBand ?? 'calm',
    terminalUiPlayerInflationSalienceNudge: lastPoint?.uiPlayerInflationSalienceNudgeBand ?? 'muted',
    terminalFiscalIndexationInflationAnchorBreach: lastPoint?.fiscalIndexationInflationAnchorBreachBand ?? 'anchored',
    terminalHouseholdWageInflationDeanchoring: lastPoint?.householdWageInflationDeanchoringBand ?? 'anchored',
    terminalCorporateMarkupInflationCascade: lastPoint?.corporateMarkupInflationCascadeBand ?? 'absorbed',
    terminalTradeTariffImportInflationPipeline: lastPoint?.tradeTariffImportInflationPipelineBand ?? 'anchored',
    terminalMetroUrbanRentInflationSurge: lastPoint?.metroUrbanRentInflationSurgeBand ?? 'subdued',
    terminalWholesaleGridEnergyInflationCascade: lastPoint?.wholesaleGridEnergyInflationCascadeBand ?? 'stable',
    terminalGuardianGuardrailInflationEscalation: lastPoint?.guardianGuardrailInflationEscalationBand ?? 'calm',
    terminalTeamConsensusInflationBriefingDrift: lastPoint?.teamConsensusInflationBriefingDriftBand ?? 'anchored',
    terminalMemoryCommonwealthInflationRecallGate: lastPoint?.memoryCommonwealthInflationRecallGateBand ?? 'anchored',
    terminalAutomationSynthesisInflationCascadeDrift: lastPoint?.automationSynthesisInflationCascadeDriftBand ?? 'neutral',
    terminalUiShellInflationSalienceEscalation: lastPoint?.uiShellInflationSalienceEscalationBand ?? 'muted',
    terminalDashboardHeatmapInflationOverlayCascade: lastPoint?.dashboardHeatmapInflationOverlayCascadeBand ?? 'routine',
    terminalCommandCenterInflationFusionLatch: lastPoint?.commandCenterInflationFusionLatchBand ?? 'stable',
    terminalTransportFreightInflationCongestionCascade:
      lastPoint?.transportFreightInflationCongestionCascadeBand ?? 'clear',
    terminalEventsStagedInflationShockPersistence: lastPoint?.eventsStagedInflationShockPersistenceBand ?? 'muted',
    terminalModesSandboxInflationStressCascade: lastPoint?.modesSandboxInflationStressCascadeBand ?? 'routine',
    terminalFiscalAppropriationInflationPressureLatch:
      lastPoint?.fiscalAppropriationInflationPressureLatchBand ?? 'stable',
    terminalHouseholdBudgetInflationStressCascade: lastPoint?.householdBudgetInflationStressCascadeBand ?? 'contained',
    terminalCorporateSurvivalPricingInflationLatch: lastPoint?.corporateSurvivalPricingInflationLatchBand ?? 'contained',
    terminalTradeTariffExchangeInflationEscalation: lastPoint?.tradeTariffExchangeInflationEscalationBand ?? 'stable',
    terminalMetroCapacityRentInflationLatch: lastPoint?.metroCapacityRentInflationLatchBand ?? 'subdued',
    terminalGridWholesaleTariffInflationSurge: lastPoint?.gridWholesaleTariffInflationSurgeBand ?? 'stable',
    terminalGuardianCopilotInflationPressureLatch: lastPoint?.guardianCopilotInflationPressureLatchBand ?? 'subdued',
    terminalTeamBriefingConsensusInflationUnmooring: lastPoint?.teamBriefingConsensusInflationUnmooringBand ?? 'stable',
    terminalMemoryRealmInflationPersistenceLatch: lastPoint?.memoryRealmInflationPersistenceLatchBand ?? 'subdued',
    terminalAutomationSynthesisInflationCascadeSurge: lastPoint?.automationSynthesisInflationCascadeSurgeBand ?? 'stable',
    terminalUiShellInflationAttentionLatch: lastPoint?.uiShellInflationAttentionLatchBand ?? 'muted',
    terminalDashboardRegionalInflationOverlaySurge: lastPoint?.dashboardRegionalInflationOverlaySurgeBand ?? 'routine',
    terminalCommandCenterInflationAlertPressureLatch: lastPoint?.commandCenterInflationAlertPressureLatchBand ?? 'subdued',
    terminalTransportFreightInflationGridlockSurge: lastPoint?.transportFreightInflationGridlockSurgeBand ?? 'clear',
    terminalEventsNarrativeInflationShockLatch: lastPoint?.eventsNarrativeInflationShockLatchBand ?? 'muted',
    terminalModesSandboxInflationPressureSurge: lastPoint?.modesSandboxInflationPressureSurgeBand ?? 'routine',
    terminalFiscalConsolidatedInflationPressureLatch: lastPoint?.fiscalConsolidatedInflationPressureLatchBand ?? 'subdued',
    terminalHouseholdWageInflationStressSurge: lastPoint?.householdWageInflationStressSurgeBand ?? 'contained',
    terminalMacroOutputGapInflationPressureLatch: lastPoint?.macroOutputGapInflationPressureLatchBand ?? 'subdued',
    terminalCorporateCapacityMarkupInflationSurge: lastPoint?.corporateCapacityMarkupInflationSurgeBand ?? 'contained',
    terminalResearchBreakthroughSupplySideInflationLatch:
      lastPoint?.researchBreakthroughSupplySideInflationLatchBand ?? 'neutral',
    terminalTradeImportExchangeInflationPipelineSurge:
      lastPoint?.tradeImportExchangeInflationPipelineSurgeBand ?? 'anchored',
    terminalMetroRegionalRentInflationEscalationLatch:
      lastPoint?.metroRegionalRentInflationEscalationLatchBand ?? 'subdued',
    terminalWholesaleGridTransitionInflationSurge:
      lastPoint?.wholesaleGridTransitionInflationSurgeBand ?? 'stable',
    terminalTradeClearedForwardArcInflationHandoffLatch:
      lastPoint?.tradeClearedForwardArcInflationHandoffLatchBand ?? 'anchored',
    terminalGuardianEntrustmentEnvelopeInflationPressureSurge:
      lastPoint?.guardianEntrustmentEnvelopeInflationPressureSurgeBand ?? 'contained',
    terminalHousingWellbeingMortgageInflationEscalationLatch:
      lastPoint?.housingWellbeingMortgageInflationEscalationLatchBand ?? 'subdued',
    terminalTransportCorridorFreightInflationSurgeLatch:
      lastPoint?.transportCorridorFreightInflationSurgeLatchBand ?? 'clear',
    regime: input.regime,
    shockDriver: input.shock.driver,
    fiscalDominanceBand: input.fiscalDominance.band,
    targetBreachSeverity: input.targetBreach.breachSeverity,
    integrationNote: 'Agent 10 macro CPI bundle — commodity resourcePrices excluded.',
  };
}

export function agent21ForecastBridgeIntegrationNote(): string {
  return 'Agent 21 may consume Agent21InflationForecastBundle for inflation fusion; no RNG.';
}


// --- source: credit/tier-spreads.ts ---

export type AdvancedLoanTierId = 'starter' | 'standard' | 'growth' | 'distressed';

export interface LoanTierSpreadProfile {
  tierId: AdvancedLoanTierId;
  baseSpreadAdd: number;
  maxEffectiveRate: number;
  label: string;
}

export const ADVANCED_LOAN_TIER_SPREADS: readonly LoanTierSpreadProfile[] = [
  { tierId: 'starter', baseSpreadAdd: 0.02, maxEffectiveRate: 0.35, label: 'Starter facility' },
  { tierId: 'standard', baseSpreadAdd: 0.04, maxEffectiveRate: 0.45, label: 'Standard facility' },
  { tierId: 'growth', baseSpreadAdd: 0.06, maxEffectiveRate: 0.55, label: 'Growth facility' },
  { tierId: 'distressed', baseSpreadAdd: 0.12, maxEffectiveRate: 0.75, label: 'Distressed facility' },
] as const;

export function effectiveTierLoanRate(
  tierId: AdvancedLoanTierId,
  baseRate: number,
  macroSpreadMultiplier: number,
  credit: CreditConditionsBand,
): number {
  const tier = ADVANCED_LOAN_TIER_SPREADS.find((t) => t.tierId === tierId) ?? ADVANCED_LOAN_TIER_SPREADS[1];
  let creditAdd = 0;
  if (credit === 'tight') creditAdd = 0.02;
  if (credit === 'restricted') creditAdd = 0.05;
  if (credit === 'frozen') creditAdd = 0.1;
  const raw = baseRate * macroSpreadMultiplier + tier.baseSpreadAdd + creditAdd;
  return finClamp(raw, 0, tier.maxEffectiveRate);
}


// --- source: self-tests.ts ---
  computeNationalMacroFinancialConditions,
  createInitialMacroFinancialPersisted,
  macroFinancialEconomyCostMultiplier,
  macroFinancialInputHash,
  macroFinancialLoanSpreadMultiplier,
  makeDefaultMacroFinancialTestInputs,
  sanitizeMacroFinancialPersisted,
  buildMacroFinancialInputs,
} from './compute/national-macro-financial.js';
  detectMacroFinancialQuery,
  macroFinancialActionAlignment,
  macroFinancialGuardianWarning,
  macroFinancialWorldRoots,
  answerMacroFinancialQuestion,
} from './integration/query-co-pilot.js';
  validateNationalMacroFinancialState,
  auditModifierIntegrity,
  dedupeMacroFinancialEvidence,
} from './persistence/validate-state.js';
  applyMacroFinancialScenarioPreset,
  getMacroFinancialScenarioPreset,
  MACRO_FINANCIAL_SCENARIO_PRESETS,
} from './catalog/fiscal-inflation-scenarios.js';
  stepInflationRegimeTracker,
  createInitialInflationRegimeTracker,
  inflationRegimePersistenceHalfLifeTurns,
} from './integration/inflation-regime-tracker.js';
  createInitialInflationMomentumState,
  stepInflationMomentum,
  inflationMomentumInflationScoreNudge,
} from './inflation/inflation-momentum.js';
  mergeAgent07IntoMacroFinancialInputs,
  agent07FiscalBridgeIntegrationNote,
} from './integration/agent07-fiscal-bridge.js';
  mergeAgent09IntoMacroFinancialInputs,
  agent09HouseholdBridgeIntegrationNote,
} from './integration/agent09-household-bridge.js';
  assessImportPricePassThrough,
  importPassThroughInflationScoreAdjustment,
} from './inflation/import-price-pass-through.js';
  assessTermPremiumInflationSignal,
  termPremiumTighteningBias,
} from './rates/term-premium-inflation-signal.js';
  assessEnergyPricePassThrough,
  energyPassThroughInflationScoreAdjustment,
} from './inflation/energy-price-pass-through.js';
  assessShelterRentInflation,
  shelterRentInflationScoreAdjustment,
} from './inflation/shelter-rent-inflation.js';
  mergeAgent15IntoMacroFinancialInputs,
  agent15TradeBridgeIntegrationNote,
} from './integration/agent15-trade-bridge.js';
  mergeAgent08IntoMacroFinancialInputs,
  agent08CorporateBridgeIntegrationNote,
} from './integration/agent08-corporate-bridge.js';
  mergeAgent11IntoMacroFinancialInputs,
  agent11CitiesBridgeIntegrationNote,
} from './integration/agent11-cities-bridge.js';
  mergeAgent13IntoMacroFinancialInputs,
  agent13EnergyBridgeIntegrationNote,
} from './integration/agent13-energy-bridge.js';
  assessFoodGroceryPassThrough,
  foodGroceryPassThroughInflationScoreAdjustment,
} from './inflation/food-grocery-pass-through.js';
  assessTransportLogisticsInflation,
  transportLogisticsInflationScoreAdjustment,
} from './inflation/transport-logistics-inflation.js';
  mergeAgent14IntoMacroFinancialInputs,
  agent14HousingBridgeIntegrationNote,
} from './integration/agent14-housing-bridge.js';
  mergeAgent12IntoMacroFinancialInputs,
  agent12TransportBridgeIntegrationNote,
} from './integration/agent12-transport-bridge.js';
  assessHealthcareServicesInflation,
  healthcareServicesInflationScoreAdjustment,
} from './inflation/healthcare-services-inflation.js';
  assessInsurancePremiumPassThrough,
  insurancePremiumPassThroughInflationScoreAdjustment,
} from './inflation/insurance-premium-pass-through.js';
  mergeAgent03IntoMacroFinancialInputs,
  agent03ResearchBridgeIntegrationNote,
} from './integration/agent03-research-bridge.js';
  mergeAgent05IntoMacroFinancialInputs,
  agent05EventsBridgeIntegrationNote,
} from './integration/agent05-events-bridge.js';
  assessEducationTuitionInflation,
  educationTuitionInflationScoreAdjustment,
} from './inflation/education-tuition-inflation.js';
  assessCommunicationsServicesInflation,
  communicationsServicesInflationScoreAdjustment,
} from './inflation/communications-services-inflation.js';
  mergeAgent04IntoMacroFinancialInputs,
  agent04ModesBridgeIntegrationNote,
} from './integration/agent04-modes-bridge.js';
  mergeAgent16IntoMacroFinancialInputs,
  agent16GuardianBridgeIntegrationNote,
} from './integration/agent16-guardian-bridge.js';
  assessRecreationLeisureInflation,
  recreationLeisureInflationScoreAdjustment,
} from './inflation/recreation-leisure-inflation.js';
  assessProfessionalServicesFeeInflation,
  professionalServicesFeeInflationScoreAdjustment,
} from './inflation/professional-services-fee-inflation.js';
  mergeAgent17IntoMacroFinancialInputs,
  agent17CommandBridgeIntegrationNote,
} from './integration/agent17-command-bridge.js';
  mergeAgent18IntoMacroFinancialInputs,
  agent18TeamBridgeIntegrationNote,
} from './integration/agent18-team-bridge.js';
  assessChildcareServicesInflation,
  childcareServicesInflationScoreAdjustment,
} from './inflation/childcare-services-inflation.js';
  assessGovernmentChargesInflation,
  governmentChargesInflationScoreAdjustment,
} from './inflation/government-charges-inflation.js';
  mergeAgent02IntoMacroFinancialInputs,
  agent02TurnsBridgeIntegrationNote,
} from './integration/agent02-turns-bridge.js';
  mergeAgent20IntoMacroFinancialInputs,
  agent20AutomationBridgeIntegrationNote,
} from './integration/agent20-automation-bridge.js';
  assessWaterUtilitiesInflation,
  waterUtilitiesInflationScoreAdjustment,
} from './inflation/water-utilities-inflation.js';
  assessDomesticTravelInflation,
  domesticTravelInflationScoreAdjustment,
} from './inflation/domestic-travel-inflation.js';
  mergeAgent01IntoMacroFinancialInputs,
  agent01StrategicBridgeIntegrationNote,
} from './integration/agent01-strategic-bridge.js';
  mergeAgent19IntoMacroFinancialInputs,
  agent19MemoryBridgeIntegrationNote,
} from './integration/agent19-memory-bridge.js';
  assessConstructionMaterialsInflation,
  constructionMaterialsInflationScoreAdjustment,
} from './inflation/construction-materials-inflation.js';
  assessRetailTradeMarginInflation,
  retailTradeMarginInflationScoreAdjustment,
} from './inflation/retail-trade-margin-inflation.js';
  assessFinancialServicesFeeInflation,
  financialServicesFeeInflationScoreAdjustment,
} from './inflation/financial-services-fee-inflation.js';
  assessAgriculturalFarmgateInflation,
  agriculturalFarmgateInflationScoreAdjustment,
} from './inflation/agricultural-farmgate-inflation.js';
  assessPublicUtilitiesGridTariffInflation,
  publicUtilitiesGridTariffInflationScoreAdjustment,
} from './inflation/public-utilities-grid-tariff-inflation.js';
  assessUiInflationSaliencePassThrough,
  uiInflationSaliencePassThroughScoreAdjustment,
} from './inflation/ui-inflation-salience-pass-through.js';
  assessHousingMortgageEssentialInflation,
  housingMortgageEssentialInflationScoreAdjustment,
} from './inflation/housing-mortgage-essential-inflation.js';
  assessMacroTransmissionMergeInflation,
  macroTransmissionMergeInflationScoreAdjustment,
} from './inflation/macro-transmission-merge-inflation.js';
  assessDynamicEventsInflationSpillover,
  dynamicEventsInflationSpilloverScoreAdjustment,
} from './inflation/dynamic-events-inflation-spillover.js';
  assessDashboardMapInflationOverlay,
  dashboardMapInflationOverlayScoreAdjustment,
} from './inflation/dashboard-map-inflation-overlay.js';
  assessPublicFinanceDebtServiceInflation,
  publicFinanceDebtServiceInflationScoreAdjustment,
} from './inflation/public-finance-debt-service-inflation.js';
  assessPopulationLaborWageInflation,
  populationLaborWageInflationScoreAdjustment,
} from './inflation/population-labor-wage-inflation.js';
  assessWholesaleEnergyTransitionInflation,
  wholesaleEnergyTransitionInflationScoreAdjustment,
} from './inflation/wholesale-energy-transition-inflation.js';
  assessUrbanRentDispersionInflation,
  urbanRentDispersionInflationScoreAdjustment,
} from './inflation/urban-rent-dispersion-inflation.js';
  assessCorporatePricingPassThroughInflation,
  corporatePricingPassThroughInflationScoreAdjustment,
} from './inflation/corporate-pricing-pass-through-inflation.js';
  assessTradeExchangeImportInflation,
  tradeExchangeImportInflationScoreAdjustment,
} from './inflation/trade-exchange-import-inflation.js';
  assessGuardianInflationInterventionInflation,
  guardianInflationInterventionScoreAdjustment,
} from './inflation/guardian-inflation-intervention-inflation.js';
  assessTeamIntelligenceConsensusInflation,
  teamIntelligenceConsensusInflationScoreAdjustment,
} from './inflation/team-intelligence-consensus-inflation.js';
  assessStrategicGeopoliticalInflationPremium,
  strategicGeopoliticalInflationPremiumScoreAdjustment,
} from './inflation/strategic-geopolitical-inflation-premium.js';
  assessAiMemoryInflationRecallInflation,
  aiMemoryInflationRecallScoreAdjustment,
} from './inflation/ai-memory-inflation-recall-inflation.js';
  assessCalendarSeasonInflationCarryover,
  calendarSeasonInflationCarryoverScoreAdjustment,
} from './inflation/calendar-season-inflation-carryover.js';
  assessAutomationAutopilotInflationDrift,
  automationAutopilotInflationDriftScoreAdjustment,
} from './inflation/automation-autopilot-inflation-drift.js';
  assessResearchProductivityInflationOffset,
  researchProductivityInflationOffsetScoreAdjustment,
} from './inflation/research-productivity-inflation-offset.js';
  assessScenarioSandboxInflationBias,
  scenarioSandboxInflationBiasScoreAdjustment,
} from './inflation/scenario-sandbox-inflation-bias.js';
  assessEventsNarrativeInflationPersistence,
  eventsNarrativeInflationPersistenceScoreAdjustment,
} from './inflation/events-narrative-inflation-persistence.js';
  assessMacroDemandOverheatInflationSlippage,
  macroDemandOverheatInflationSlippageScoreAdjustment,
} from './inflation/macro-demand-overheat-inflation-slippage.js';
  assessFreightLogisticsInflationCongestion,
  freightLogisticsInflationCongestionScoreAdjustment,
} from './inflation/freight-logistics-inflation-congestion.js';
  assessHousingWellbeingInflationEssentialStress,
  housingWellbeingInflationEssentialStressScoreAdjustment,
} from './inflation/housing-wellbeing-inflation-essential-stress.js';
  assessCommandCenterInflationFusionEscalation,
  commandCenterInflationFusionEscalationScoreAdjustment,
} from './inflation/command-center-inflation-fusion-escalation.js';
  assessUiPlayerInflationSalienceNudge,
  uiPlayerInflationSalienceNudgeScoreAdjustment,
} from './inflation/ui-player-inflation-salience-nudge.js';
  assessFiscalIndexationInflationAnchorBreach,
  fiscalIndexationInflationAnchorBreachScoreAdjustment,
} from './inflation/fiscal-indexation-inflation-anchor-breach.js';
  assessHouseholdWageInflationDeanchoring,
  householdWageInflationDeanchoringScoreAdjustment,
} from './inflation/household-wage-inflation-deanchoring.js';
  assessCorporateMarkupInflationCascade,
  corporateMarkupInflationCascadeScoreAdjustment,
} from './inflation/corporate-markup-inflation-cascade.js';
  assessTradeTariffImportInflationPipeline,
  tradeTariffImportInflationPipelineScoreAdjustment,
} from './inflation/trade-tariff-import-inflation-pipeline.js';
  assessMetroUrbanRentInflationSurge,
  metroUrbanRentInflationSurgeScoreAdjustment,
} from './inflation/metro-urban-rent-inflation-surge.js';
  assessWholesaleGridEnergyInflationCascade,
  wholesaleGridEnergyInflationCascadeScoreAdjustment,
} from './inflation/wholesale-grid-energy-inflation-cascade.js';
  assessGuardianGuardrailInflationEscalation,
  guardianGuardrailInflationEscalationScoreAdjustment,
} from './inflation/guardian-guardrail-inflation-escalation.js';
  assessTeamConsensusInflationBriefingDrift,
  teamConsensusInflationBriefingDriftScoreAdjustment,
} from './inflation/team-consensus-inflation-briefing-drift.js';
  assessMemoryCommonwealthInflationRecallGate,
  memoryCommonwealthInflationRecallGateScoreAdjustment,
} from './inflation/memory-commonwealth-inflation-recall-gate.js';
  assessAutomationSynthesisInflationCascadeDrift,
  automationSynthesisInflationCascadeDriftScoreAdjustment,
} from './inflation/automation-synthesis-inflation-cascade-drift.js';
  assessUiShellInflationSalienceEscalation,
  uiShellInflationSalienceEscalationScoreAdjustment,
} from './inflation/ui-shell-inflation-salience-escalation.js';
  assessDashboardHeatmapInflationOverlayCascade,
  dashboardHeatmapInflationOverlayCascadeScoreAdjustment,
} from './inflation/dashboard-heatmap-inflation-overlay-cascade.js';
  assessCommandCenterInflationFusionLatch,
  commandCenterInflationFusionLatchScoreAdjustment,
} from './inflation/command-center-inflation-fusion-latch.js';
  assessTransportFreightInflationCongestionCascade,
  transportFreightInflationCongestionCascadeScoreAdjustment,
} from './inflation/transport-freight-inflation-congestion-cascade.js';
  assessEventsStagedInflationShockPersistence,
  eventsStagedInflationShockPersistenceScoreAdjustment,
} from './inflation/events-staged-inflation-shock-persistence.js';
  assessModesSandboxInflationStressCascade,
  modesSandboxInflationStressCascadeScoreAdjustment,
} from './inflation/modes-sandbox-inflation-stress-cascade.js';
  assessFiscalAppropriationInflationPressureLatch,
  fiscalAppropriationInflationPressureLatchScoreAdjustment,
} from './inflation/fiscal-appropriation-inflation-pressure-latch.js';
  assessHouseholdBudgetInflationStressCascade,
  householdBudgetInflationStressCascadeScoreAdjustment,
} from './inflation/household-budget-inflation-stress-cascade.js';
  assessCorporateSurvivalPricingInflationLatch,
  corporateSurvivalPricingInflationLatchScoreAdjustment,
} from './inflation/corporate-survival-pricing-inflation-latch.js';
  assessTradeTariffExchangeInflationEscalation,
  tradeTariffExchangeInflationEscalationScoreAdjustment,
} from './inflation/trade-tariff-exchange-inflation-escalation.js';
  assessMetroCapacityRentInflationLatch,
  metroCapacityRentInflationLatchScoreAdjustment,
} from './inflation/metro-capacity-rent-inflation-latch.js';
  assessGridWholesaleTariffInflationSurge,
  gridWholesaleTariffInflationSurgeScoreAdjustment,
} from './inflation/grid-wholesale-tariff-inflation-surge.js';
  assessGuardianCopilotInflationPressureLatch,
  guardianCopilotInflationPressureLatchScoreAdjustment,
} from './inflation/guardian-copilot-inflation-pressure-latch.js';
  assessTeamBriefingConsensusInflationUnmooring,
  teamBriefingConsensusInflationUnmooringScoreAdjustment,
} from './inflation/team-briefing-consensus-inflation-unmooring.js';
  assessMemoryRealmInflationPersistenceLatch,
  memoryRealmInflationPersistenceLatchScoreAdjustment,
} from './inflation/memory-realm-inflation-persistence-latch.js';
  assessAutomationSynthesisInflationCascadeSurge,
  automationSynthesisInflationCascadeSurgeScoreAdjustment,
} from './inflation/automation-synthesis-inflation-cascade-surge.js';
  assessUiShellInflationAttentionLatch,
  uiShellInflationAttentionLatchScoreAdjustment,
} from './inflation/ui-shell-inflation-attention-latch.js';
  assessDashboardRegionalInflationOverlaySurge,
  dashboardRegionalInflationOverlaySurgeScoreAdjustment,
} from './inflation/dashboard-regional-inflation-overlay-surge.js';
  assessCommandCenterInflationAlertPressureLatch,
  commandCenterInflationAlertPressureLatchScoreAdjustment,
} from './inflation/command-center-inflation-alert-pressure-latch.js';
  assessTransportFreightInflationGridlockSurge,
  transportFreightInflationGridlockSurgeScoreAdjustment,
} from './inflation/transport-freight-inflation-gridlock-surge.js';
  assessEventsNarrativeInflationShockLatch,
  eventsNarrativeInflationShockLatchScoreAdjustment,
} from './inflation/events-narrative-inflation-shock-latch.js';
  assessModesSandboxInflationPressureSurge,
  modesSandboxInflationPressureSurgeScoreAdjustment,
} from './inflation/modes-sandbox-inflation-pressure-surge.js';
  assessFiscalConsolidatedInflationPressureLatch,
  fiscalConsolidatedInflationPressureLatchScoreAdjustment,
} from './inflation/fiscal-consolidated-inflation-pressure-latch.js';
  assessHouseholdWageInflationStressSurge,
  householdWageInflationStressSurgeScoreAdjustment,
} from './inflation/household-wage-inflation-stress-surge.js';
  assessMacroOutputGapInflationPressureLatch,
  macroOutputGapInflationPressureLatchScoreAdjustment,
} from './inflation/macro-output-gap-inflation-pressure-latch.js';
  assessCorporateCapacityMarkupInflationSurge,
  corporateCapacityMarkupInflationSurgeScoreAdjustment,
} from './inflation/corporate-capacity-markup-inflation-surge.js';
  assessResearchBreakthroughSupplySideInflationLatch,
  researchBreakthroughSupplySideInflationLatchScoreAdjustment,
} from './inflation/research-breakthrough-supply-side-inflation-latch.js';
  assessTradeImportExchangeInflationPipelineSurge,
  tradeImportExchangeInflationPipelineSurgeScoreAdjustment,
} from './inflation/trade-import-exchange-inflation-pipeline-surge.js';
  assessMetroRegionalRentInflationEscalationLatch,
  metroRegionalRentInflationEscalationLatchScoreAdjustment,
} from './inflation/metro-regional-rent-inflation-escalation-latch.js';
  assessWholesaleGridTransitionInflationSurge,
  wholesaleGridTransitionInflationSurgeScoreAdjustment,
} from './inflation/wholesale-grid-transition-inflation-surge.js';
  assessTradeClearedForwardArcInflationHandoffLatch,
  tradeClearedForwardArcInflationHandoffLatchScoreAdjustment,
} from './inflation/trade-cleared-forward-arc-inflation-handoff-latch.js';
  assessGuardianEntrustmentEnvelopeInflationPressureSurge,
  guardianEntrustmentEnvelopeInflationPressureSurgeScoreAdjustment,
} from './inflation/guardian-entrustment-envelope-inflation-pressure-surge.js';
  assessHousingWellbeingMortgageInflationEscalationLatch,
  housingWellbeingMortgageInflationEscalationLatchScoreAdjustment,
} from './inflation/housing-wellbeing-mortgage-inflation-escalation-latch.js';
  assessTransportCorridorFreightInflationSurgeLatch,
  transportCorridorFreightInflationSurgeLatchScoreAdjustment,
} from './inflation/transport-corridor-freight-inflation-surge-latch.js';
  mergeAgent22IntoMacroFinancialInputs,
  agent22UiBridgeIntegrationNote,
} from './integration/agent22-ui-bridge.js';
  mergeAgent23IntoMacroFinancialInputs,
  agent23DashboardsBridgeIntegrationNote,
} from './integration/agent23-dashboards-bridge.js';

export function runAgent10FinanceSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const check = (id: string, name: string, ok: boolean, detail = 'ok') =>
    results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });

  check('a10_t01', 'schema version', createInitialMacroFinancialPersisted().schemaVersion === V1014_FINSTAB_SCHEMA_VERSION);
  check('a10_t02', 'sanitize null', sanitizeMacroFinancialPersisted(null) === null);
  check(
    'a10_t03',
    'default compute',
    !!computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state,
  );
  check(
    'a10_t04',
    'high inflation cost mult',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs({ highInflationScenario: true }), null, null)
      .state.modifiers.costOfLivingMultiplier > 1.1,
  );
  check(
    'a10_t05',
    'credit shock spread',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs({ creditShockActive: true }), null, null)
      .state.modifiers.creditSpreadMultiplier > 1.05,
  );
  check(
    'a10_t06',
    'hash stable',
    macroFinancialInputHash(makeDefaultMacroFinancialTestInputs()) ===
      macroFinancialInputHash(makeDefaultMacroFinancialTestInputs()),
  );
  check(
    'a10_t07',
    'hash turn delta',
    macroFinancialInputHash(makeDefaultMacroFinancialTestInputs({ turn: 1 })) !==
      macroFinancialInputHash(makeDefaultMacroFinancialTestInputs({ turn: 2 })),
  );
  check('a10_t08', 'economy mult off', macroFinancialEconomyCostMultiplier(null) === 1);
  check('a10_t09', 'loan spread off', macroFinancialLoanSpreadMultiplier(undefined) === 1);
  check('a10_t10', 'detect stability', detectMacroFinancialQuery('How is financial stability?')?.topic === 'stability');
  check('a10_t11', 'detect credit', detectMacroFinancialQuery('Are credit conditions tight?')?.topic === 'credit');
  check(
    'a10_t12',
    'detect inflation not commodity',
    detectMacroFinancialQuery('inflation and cost of living')?.topic === 'inflation',
  );
  check(
    'a10_t13',
    'commodity query excluded',
    detectMacroFinancialQuery('commodity inflation prices')?.topic !== 'inflation' ||
      detectMacroFinancialQuery('commodity inflation prices') === null,
  );

  const frozenState = {
    ...computeNationalMacroFinancialConditions(
      makeDefaultMacroFinancialTestInputs({ creditShockActive: true, fiscalPressure: 'critical', actorCreditStressIndex: 0.9 }),
      null,
      null,
    ).state,
    credit: 'frozen' as const,
  };
  check(
    'a10_t14',
    'alignment loans frozen',
    (macroFinancialActionAlignment(frozenState, { category: 'loans_and_credit' })?.scoreDelta ?? 0) <= 0,
  );
  check(
    'a10_t15',
    'guardian frozen credit',
    !!macroFinancialGuardianWarning(frozenState, { category: 'loans_and_credit' }),
  );
  check(
    'a10_t16',
    'world roots disabled',
    macroFinancialWorldRoots(false, [{ id: 'x', turn: 1, kind: 'k', significance: 'minor', title: 't', summary: 's', dedupeKey: 'd' }])
      .length === 0,
  );
  check(
    'a10_t17',
    'world roots enabled',
    macroFinancialWorldRoots(true, [{ id: 'x', turn: 1, kind: 'k', significance: 'minor', title: 't', summary: 's', dedupeKey: 'd' }])
      .length === 1,
  );
  check(
    'a10_t18',
    'scenario id inflation',
    buildMacroFinancialInputs({ turn: 3, gameSettings: { selectedScenarioId: 'high_inflation' } }).highInflationScenario === true,
  );
  check(
    'a10_t19',
    'non-CPI note',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state.integrationNotes.some((n) =>
      n.includes('commodity'),
    ),
  );
  check(
    'a10_t20',
    'regional spreads count',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state.regionalSpreads.length ===
      V1014_FINSTAB_CORE_REGIONS.length,
  );

  const hits = evaluatePolicyTransmissionChannels(makeDefaultMacroFinancialTestInputs({ fiscalPressure: 'critical' }));
  check('a10_t21', 'transmission fiscal active', hits.some((h) => h.id === 'fiscal_strain_tightens_credit' && h.active));
  check(
    'a10_t22',
    'transmission credit weight',
    sumActiveTransmissionWeight(hits, 'credit') >= 1,
  );

  check(
    'a10_t23',
    'economy layer cost apply',
    applyMacroCostOfLivingToEconomyLayer(100, 1.2) === 120,
  );
  check(
    'a10_t24',
    'inflation band order',
    compareInflationBands('elevated', 'anchored') > 0,
  );

  const st = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state;
  const quote = quoteAdvancedLoanPricing(0.1, st.modifiers.creditSpreadMultiplier, st.credit, st.modifiers.loanAffordabilityIndex);
  check('a10_t25', 'loan quote effective', quote.effectiveRate > 0 && quote.effectiveRate <= 1);

  check('a10_t26', 'refinance defer frozen', refinanceTimingSignal('frozen', 0.2) === 'defer');
  check('a10_t27', 'refinance favorable', refinanceTimingSignal('accommodative', 0.3) === 'favorable');

  const seq = runFinancialShockSequence({ inflation: 50, credit: 55, stability: 60 }, [
    'shock_credit_tightening',
    'shock_household_cost_surge',
    'bogus_id',
  ]);
  check('a10_t28', 'shock sequence applied', seq.appliedShockIds.length === 2);
  check('a10_t29', 'shock sequence skip', seq.skippedShockIds.includes('bogus_id'));
  check('a10_t30', 'shock sequence flag', seq.creditShockActive === true);

  check(
    'a10_t31',
    'reference rate tight > easy',
    referencePolicyRate('tightening', 'restricted') > referencePolicyRate('neutral', 'accommodative'),
  );

  check(
    'a10_t32',
    'answer shapes',
    !!answerMacroFinancialQuestion(st, 'macro financial overview').fact,
  );

  check(
    'a10_t33',
    'evidence bounded',
    computeNationalMacroFinancialConditions(
      makeDefaultMacroFinancialTestInputs({ highInflationScenario: true, creditShockActive: true, fiscalPressure: 'critical' }),
      null,
      null,
    ).state.evidence.length <= V1014_FINSTAB_LIMITS.maxEvidence,
  );

  check(
    'a10_t34',
    'investment risk cap',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state.modifiers.investmentRiskPremium <=
      0.35,
  );

  check(
    'a10_t35',
    'cached hash reuse',
    (() => {
      const p = createInitialMacroFinancialPersisted();
      const inp = makeDefaultMacroFinancialTestInputs();
      p.lastInputHash = macroFinancialInputHash(inp);
      const prev = computeNationalMacroFinancialConditions(inp, p, null).state;
      const r = computeNationalMacroFinancialConditions(inp, p, prev);
      return r.state === prev;
    })(),
  );

  for (let i = 0; i < 15; i++) {
    const turn = i + 1;
    const r = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs({ turn }), null, null);
    check(
      `a10_t${36 + i}`,
      `turn ${turn} revision`,
      r.state.revision >= 1 && r.state.turn === turn,
    );
  }

  // --- Round 3 scale wave ---
  {
    const step = stepResourceMarketPriceDeterministic({
      resource: 'Gold',
      basePrice: 150,
      currentPrice: 180,
      trend: 'falling',
      randCentered: 0,
    });
    check('a10_r3_01', 'market step mean reversion', step.nextPrice < 180);
  }
  check(
    'a10_r3_02',
    'trend cycle deterministic',
    cycleMarketTrendDeterministic(4, 'stable', 0.5) === 'stable' || cycleMarketTrendDeterministic(4, '', 0.5) === 'rising',
  );
  {
    const link = assessInvestmentClimateLink('expansionary', 'accommodative', 'anchored');
    check('a10_r3_03', 'investment link ready', link.readinessScore >= 70 && !link.deferMegaproject);
  }
  {
    const link = assessInvestmentClimateLink('crisis_defensive', 'frozen', 'scenario_runaway');
    check('a10_r3_04', 'investment link defer', link.deferMegaproject);
  }
  {
    const st = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state;
    check('a10_r3_05', 'validate clean state', validateNationalMacroFinancialState(st).every((i) => i.severity !== 'error'));
    check('a10_r3_06', 'audit modifiers', auditModifierIntegrity(st));
  }
  {
    const sim = simulateMacroFinancialTurns(12, (turn, base) =>
      turn >= 8 ? { ...base, creditShockActive: true, fiscalPressure: 'critical' } : base,
    );
    check('a10_r3_07', 'simulation rows', sim.rows.length === 12);
    check('a10_r3_08', 'stress spiral detect', detectSimulationStressSpiral(sim.rows));
  }
  {
    const st = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state;
    const duped = dedupeMacroFinancialEvidence([...st.evidence, ...st.evidence]);
    check('a10_r3_09', 'evidence dedupe', duped.length <= st.evidence.length);
  }
  check(
    'a10_r3_10',
    'regional spread NSW',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state.regionalSpreads.some((r) => r.regionId === 'NSW'),
  );

  check('a10_r3b_01', 'scenario preset count', MACRO_FINANCIAL_SCENARIO_PRESETS.length >= 9);
  check(
    'a10_r3b_02',
    'apply credit shock preset',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'credit_shock_stack');
      return inp?.creditShockActive === true && inp.fiscalPressure === 'strained';
    })(),
  );
  check('a10_r3b_03', 'unknown preset null', applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'nope') === null);
  check(
    'a10_r3b_04',
    'high infl preset raises cost',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'high_inflation_pass_through');
      if (!inp) return false;
      const r = computeNationalMacroFinancialConditions(inp, null, null);
      return r.state.modifiers.costOfLivingMultiplier > 1.05;
    })(),
  );
  {
    const p = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).persisted;
    const bridge = exportMacroFinancialSaveBridge(p);
    const back = importMacroFinancialSaveBridge(bridge);
    check('a10_r3b_05', 'save bridge round-trip', back?.persisted.lastCreditBand === p.lastCreditBand);
  }
  check(
    'a10_r3b_06',
    'tier rate frozen credit',
    effectiveTierLoanRate('standard', 0.1, 1.2, 'frozen') > effectiveTierLoanRate('standard', 0.1, 1.2, 'accommodative'),
  );
  check('a10_r3b_07', 'get preset by id', getMacroFinancialScenarioPreset('liquidity_crisis')?.tags.includes('liquidity'));

  // --- Round 4 scale wave ---
  check('a10_r4_01', 'CPI basket weights sum', Math.abs(macroCpiBasketWeightSum() - 1) < 0.001);
  {
    const cpi = decomposeMacroCpiBasket('elevated', 5, 0.07);
    check('a10_r4_02', 'CPI decompose excludes commodity', cpi.excludesCommodityQuotes === true && cpi.headlineIndex > 100);
  }
  {
    const spiral = assessWagePriceSpiral({
      inflationBand: 'high',
      householdAffordability: 'severe_pressure',
      fiscalPressure: 'critical',
      wageGrowthPressureScore: 70,
      turn: 3,
    });
    check('a10_r4_03', 'wage spiral elevated+', spiral.spiralRisk === 'elevated' || spiral.spiralRisk === 'critical');
    check('a10_r4_04', 'wage spiral delta', wageSpiralInflationScoreAdjustment(spiral) > 0);
  }
  {
    const rec = recommendMonetaryStance({
      inflationBand: 'high',
      creditBand: 'tight',
      inflationScore: 78,
      creditScore: 48,
    });
    check('a10_r4_05', 'monetary reaction tighten', rec.recommendedStance === 'tightening' || rec.recommendedStance === 'restrictive');
    check(
      'a10_r4_06',
      'stance drift',
      stanceDriftTowardRecommendation('neutral', rec.recommendedStance, 2) !== 'neutral' ||
        rec.recommendedStance === 'neutral',
    );
  }
  {
    const exp = stepInflationExpectations({
      currentBand: 'high',
      priorAnchoringScore: initialInflationAnchoringScore(),
      fiscalPressure: 'critical',
      highInflationScenario: true,
      turn: 2,
    });
    check('a10_r4_07', 'expectations deanchor risk', exp.deanchoringRisk !== 'low');
  }
  {
    const merged = mergeAgent06IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 4,
      gdpGrowthBand: 'contraction',
      unemploymentBand: 'severe',
      outputGap: -0.04,
      nominalDemandPressure: 0.5,
    });
    check('a10_r4_08', 'agent06 bridge merge', (merged.inflationSettingMultiplier ?? 1) > 1 && merged.fiscalPressure !== 'healthy');
    check('a10_r4_09', 'agent06 bridge note', agent06BridgeIntegrationNote().includes('commodity'));
  }
  {
    const path = projectInflationForecastPath(8);
    check('a10_r4_10', 'forecast path rows', path.points.length === 8);
    check('a10_r4_11', 'forecast max cost', path.maxCostMultiplier >= 1);
  }
  check(
    'a10_r4_12',
    'round4 preset wage',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'wage_spiral_services');
      return inp?.householdAffordability === 'severe_pressure' && inp.highInflationScenario === true;
    })(),
  );

  // --- Round 5 scale wave ---
  {
    const ph = assessPhillipsSlack('elevated', {
      turn: 2,
      gdpGrowthBand: 'strong',
      unemploymentBand: 'low',
      outputGap: 0.05,
      nominalDemandPressure: 0.55,
    });
    check('a10_r5_01', 'phillips overheated', ph.slackBand === 'overheated');
    check('a10_r5_02', 'phillips delta positive', phillipsSlackInflationScoreAdjustment(ph) > 0);
  }
  {
    const spread = computeCoreHeadlineSpread('high', 4, 0.05);
    check('a10_r5_03', 'core headline spread', spread.headlineIndex > 0 && spread.coreIndex > 0);
  }
  {
    const shock = classifyInflationShockDrivers(
      'high',
      makeDefaultMacroFinancialTestInputs({ highInflationScenario: true, inflationSettingMultiplier: 1.3 }),
      {
        turn: 1,
        gdpGrowthBand: 'strong',
        unemploymentBand: 'low',
        outputGap: 0.04,
        nominalDemandPressure: 0.6,
      },
    );
    check('a10_r5_04', 'shock driver demand or mixed', shock.driver === 'demand_pull' || shock.driver === 'mixed');
  }
  {
    const dom = assessFiscalDominance(makeDefaultMacroFinancialTestInputs({ fiscalPressure: 'critical', sovereignDebtPressure: 'high' }));
    check('a10_r5_05', 'fiscal dominance elevated+', dom.band === 'elevated' || dom.band === 'dominant');
  }
  {
    const breach = assessInflationTargetBreach(82);
    check('a10_r5_06', 'target breach above', breach.side === 'above' && breach.breachSeverity !== 'none');
    check('a10_r5_07', 'implied target percent', inflationScoreToImpliedTargetPercent(50) > 2);
  }
  {
    let reg = createInitialInflationRegimeTracker();
    reg = stepInflationRegimeTracker(reg, 1, 'elevated');
    reg = stepInflationRegimeTracker(reg, 2, 'elevated');
    reg = stepInflationRegimeTracker(reg, 3, 'elevated');
    check('a10_r5_08', 'regime streak', reg.bandStreak === 3);
    check('a10_r5_09', 'persistence half life', inflationRegimePersistenceHalfLifeTurns(reg.persistenceScore) >= 2);
  }
  {
    const path = projectInflationForecastPath(4);
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('anchored', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(52),
    });
    check('a10_r5_10', 'agent21 bundle schema', bundle.schemaVersion === '10.14.agent10.r50');
    check('a10_r5_11', 'forecast core index', path.points.every((p) => p.coreCpiIndex > 0));
  }
  check(
    'a10_r5_12',
    'round5 preset fiscal dominance',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'fiscal_dominance_inflation');
      return inp?.fiscalPressure === 'critical' && inp.sovereignDebtPressure === 'high';
    })(),
  );
  check('a10_r5_13', 'agent21 bridge note', agent21ForecastBridgeIntegrationNote().includes('Agent 21'));

  // --- Round 6 scale wave ---
  {
    const gap = assessRealRateGap(82, 'accommodative', 'high');
    check('a10_r6_01', 'real rate gap negative when hot', gap.gapBand === 'negative' || gap.gapBand === 'deeply_negative');
    check('a10_r6_02', 'real rate tightening bias', realRateGapTighteningBias(gap) > 0);
  }
  {
    let mom = createInitialInflationMomentumState();
    let snap = stepInflationMomentum(mom, 1, 'anchored').snapshot;
    const stepped = stepInflationMomentum(stepInflationMomentum(mom, 1, 'anchored').state, 2, 'elevated');
    snap = stepped.snapshot;
    check('a10_r6_03', 'momentum accelerating', snap.direction === 'accelerating' || snap.bandDelta > 0);
    check('a10_r6_04', 'momentum nudge', inflationMomentumInflationScoreNudge(snap) >= 0);
  }
  {
    const sacrifice = estimateDisinflationSacrifice('high', 78, null);
    check('a10_r6_05', 'disinflation sacrifice ratio', sacrifice.sacrificeRatio >= 0.5);
    check('a10_r6_06', 'turns to anchor', sacrifice.turnsToAnchor >= 2);
  }
  {
    const fb = assessCreditInflationFeedback('high', 'restricted', true);
    check('a10_r6_07', 'credit inflation vicious or amplifying', fb.feedbackLoop === 'vicious' || fb.feedbackLoop === 'amplifying');
  }
  {
    const merged07 = mergeAgent07IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      consolidatedDeficitBand: 'large_deficit',
      revenueMomentum: 'weak',
      debtServicePressure: 'critical',
    });
    check('a10_r6_08', 'agent07 fiscal merge', merged07.fiscalPressure === 'critical');
    check('a10_r6_09', 'agent07 bridge note', agent07FiscalBridgeIntegrationNote().includes('Agent 07'));
  }
  {
    const merged09 = mergeAgent09IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      laborParticipationBand: 'steady',
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
    });
    check('a10_r6_10', 'agent09 household merge', merged09.householdAffordability === 'severe_pressure');
    check('a10_r6_11', 'agent09 bridge note', agent09HouseholdBridgeIntegrationNote().includes('Agent 09'));
  }
  {
    const path = projectInflationForecastPath(4);
    check('a10_r6_12', 'forecast momentum fields', path.points.every((p) => p.momentumScore >= 0 && !!p.momentumDirection));
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(60),
      momentum: path.points[path.points.length - 1]
        ? {
            turn: path.points[path.points.length - 1].turn,
            momentumScore: path.points[path.points.length - 1].momentumScore,
            direction: path.points[path.points.length - 1].momentumDirection,
            bandDelta: 0,
            streakTurns: 1,
          }
        : null,
      realRateGap: assessRealRateGap(60, 'neutral', 'elevated'),
      creditFeedback: assessCreditInflationFeedback('elevated', 'neutral', false),
    });
    check('a10_r6_13', 'agent21 r6 fields', bundle.realRateGapBand !== undefined && bundle.creditInflationFeedback !== undefined);
  }
  check(
    'a10_r6_14',
    'round6 preset vicious loop',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'credit_inflation_vicious_loop');
      return inp?.creditShockActive === true && inp.householdInflationScenarioActive === true;
    })(),
  );

  // --- Round 7 scale wave ---
  {
    const imp = assessImportPricePassThrough({
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.5,
      inflationBand: 'high',
      turn: 3,
    });
    check('a10_r7_01', 'import pass-through strong or surge', imp.passThroughBand === 'strong' || imp.passThroughBand === 'surge');
    check('a10_r7_02', 'import score adj', importPassThroughInflationScoreAdjustment(imp.passThroughBand) >= 4);
  }
  {
    const term = assessTermPremiumInflationSignal({
      inflationBand: 'scenario_runaway',
      fiscalPressure: 'critical',
      sovereignDebtPressure: 'critical',
      highInflationScenario: true,
    });
    check('a10_r7_03', 'term premium stress', term.signalBand === 'stress' || term.signalBand === 'unanchored');
    check('a10_r7_04', 'term tightening bias', termPremiumTighteningBias(term) > 0);
  }
  {
    const merged15 = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.42,
    });
    check('a10_r7_05', 'agent15 trade merge', merged15.highInflationScenario === true);
    check('a10_r7_06', 'agent15 bridge note', agent15TradeBridgeIntegrationNote().includes('Agent 15'));
  }
  {
    const merged08 = mergeAgent08IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      pricingPowerBand: 'dominant',
      marginCompression: 'none',
      passThroughIntent: 'full',
    });
    check('a10_r7_07', 'agent08 corporate merge', (merged08.inflationSettingMultiplier ?? 1) > 1.05);
    check('a10_r7_08', 'agent08 bridge note', agent08CorporateBridgeIntegrationNote().includes('Agent 08'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r7_09',
      'forecast import and term fields',
      path.points.every((p) => !!p.importPassThroughBand && !!p.termPremiumSignalBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r7_10',
      'agent21 r7 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalImportPassThrough !== undefined &&
        bundle.terminalTermPremiumSignal !== undefined,
    );
  }
  check(
    'a10_r7_11',
    'round7 preset import shock',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'import_shock_pass_through');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.2;
    })(),
  );
  check(
    'a10_r7_12',
    'round7 preset term premium',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'term_premium_fiscal_stress');
      return inp?.fiscalPressure === 'critical' && inp.sovereignDebtPressure === 'critical';
    })(),
  );
  check(
    'a10_r7_13',
    'round7 preset corporate pricing',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'corporate_pricing_power_spike');
      return (inp?.inflationSettingMultiplier ?? 1) > 1.3;
    })(),
  );

  // --- Round 8 scale wave ---
  {
    const energy = assessEnergyPricePassThrough({
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r8_01', 'energy pass-through sharp or crisis', energy.passThroughBand === 'sharp' || energy.passThroughBand === 'crisis');
    check('a10_r8_02', 'energy score adj', energyPassThroughInflationScoreAdjustment(energy.passThroughBand) >= 3);
  }
  {
    const shelter = assessShelterRentInflation({
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r8_03', 'shelter rent hot or overheated', shelter.pressureBand === 'hot' || shelter.pressureBand === 'overheated');
    check('a10_r8_04', 'shelter score adj', shelterRentInflationScoreAdjustment(shelter.pressureBand) >= 3);
  }
  {
    const merged11 = mergeAgent11IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.62,
    });
    check('a10_r8_05', 'agent11 cities merge', merged11.householdInflationScenarioActive === true);
    check('a10_r8_06', 'agent11 bridge note', agent11CitiesBridgeIntegrationNote().includes('Agent 11'));
  }
  {
    const merged13 = mergeAgent13IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'high',
    });
    check('a10_r8_07', 'agent13 energy merge', merged13.highInflationScenario === true);
    check('a10_r8_08', 'agent13 bridge note', agent13EnergyBridgeIntegrationNote().includes('Agent 13'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r8_09',
      'forecast energy and shelter fields',
      path.points.every((p) => !!p.energyPassThroughBand && !!p.shelterRentPressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r8_10',
      'agent21 r8 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalEnergyPassThrough !== undefined &&
        bundle.terminalShelterRentPressure !== undefined,
    );
  }
  check(
    'a10_r8_11',
    'round8 preset energy grid crisis',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'energy_grid_crisis_pass_through');
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r8_12',
    'round8 preset urban shelter',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'urban_shelter_rent_overheat');
      return inp?.householdAffordability === 'severe_pressure' && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r8_13',
    'round8 preset energy transition',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'energy_transition_cost_stack');
      return inp?.fiscalPressure === 'critical' && (inp.inflationSettingMultiplier ?? 1) > 1.15;
    })(),
  );

  // --- Round 9 scale wave ---
  {
    const food = assessFoodGroceryPassThrough({
      harvestStressBand: 'severe',
      retailMarginPressure: 'high',
      supplyChainDisruption: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r9_01',
      'food grocery sharp or supply shock',
      food.passThroughBand === 'sharp' || food.passThroughBand === 'supply_shock',
    );
    check('a10_r9_02', 'food score adj', foodGroceryPassThroughInflationScoreAdjustment(food.passThroughBand) >= 3);
  }
  {
    const transport = assessTransportLogisticsInflation({
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      inflationBand: 'elevated',
      turn: 3,
    });
    check(
      'a10_r9_03',
      'transport bottleneck or crisis',
      transport.pressureBand === 'bottleneck' || transport.pressureBand === 'crisis',
    );
    check('a10_r9_04', 'transport score adj', transportLogisticsInflationScoreAdjustment(transport.pressureBand) >= 3);
  }
  {
    const merged14 = mergeAgent14IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      mortgageStressBand: 'severe',
      wellbeingCostBand: 'critical',
      essentialServicesInflationFlag: true,
    });
    check('a10_r9_05', 'agent14 housing merge', merged14.householdInflationScenarioActive === true);
    check('a10_r9_06', 'agent14 bridge note', agent14HousingBridgeIntegrationNote().includes('Agent 14'));
  }
  {
    const merged12 = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      logisticsInflationScenarioActive: true,
    });
    check('a10_r9_07', 'agent12 transport merge', merged12.highInflationScenario === true);
    check('a10_r9_08', 'agent12 bridge note', agent12TransportBridgeIntegrationNote().includes('Agent 12'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r9_09',
      'forecast food and transport fields',
      path.points.every((p) => !!p.foodGroceryPassThroughBand && !!p.transportLogisticsPressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r9_10',
      'agent21 r9 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalFoodGroceryPassThrough !== undefined &&
        bundle.terminalTransportLogisticsPressure !== undefined,
    );
  }
  check(
    'a10_r9_11',
    'round9 preset food supply chain',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'food_supply_chain_shock');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r9_12',
    'round9 preset transport freight',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'transport_freight_bottleneck');
      return inp?.systemicLiquidityBand === 'critical' && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r9_13',
    'round9 preset housing wellbeing',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'housing_wellbeing_cost_stack');
      return inp?.householdAffordability === 'severe_pressure' && inp.householdInflationScenarioActive === true;
    })(),
  );

  // --- Round 10 scale wave ---
  {
    const healthcare = assessHealthcareServicesInflation({
      wagePressureBand: 'acute',
      demandSurgeActive: true,
      workforceShortageBand: 'severe',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r10_01',
      'healthcare stressed or crisis',
      healthcare.pressureBand === 'stressed' || healthcare.pressureBand === 'crisis',
    );
    check('a10_r10_02', 'healthcare score adj', healthcareServicesInflationScoreAdjustment(healthcare.pressureBand) >= 3);
  }
  {
    const insurance = assessInsurancePremiumPassThrough({
      claimsInflationBand: 'extreme',
      reinsuranceStress: true,
      catastropheLoadActive: true,
      inflationBand: 'elevated',
      turn: 3,
    });
    check(
      'a10_r10_03',
      'insurance sharp or hard market',
      insurance.passThroughBand === 'sharp' || insurance.passThroughBand === 'hard_market',
    );
    check('a10_r10_04', 'insurance score adj', insurancePremiumPassThroughInflationScoreAdjustment(insurance.passThroughBand) >= 3);
  }
  {
    const merged03 = mergeAgent03IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      productivityGainBand: 'strong',
      supplySideReliefActive: true,
      innovationInflationOffsetScore: 0.62,
    });
    check('a10_r10_05', 'agent03 research merge offset', (merged03.inflationSettingMultiplier ?? 1) < 1);
    check('a10_r10_06', 'agent03 bridge note', agent03ResearchBridgeIntegrationNote().includes('Agent 03'));
  }
  {
    const merged05 = mergeAgent05IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
    });
    check('a10_r10_07', 'agent05 events merge', merged05.highInflationScenario === true);
    check('a10_r10_08', 'agent05 bridge note', agent05EventsBridgeIntegrationNote().includes('Agent 05'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r10_09',
      'forecast healthcare and insurance fields',
      path.points.every((p) => !!p.healthcareServicesPressureBand && !!p.insurancePremiumPassThroughBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r10_10',
      'agent21 r10 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalHealthcareServicesPressure !== undefined &&
        bundle.terminalInsurancePremiumPassThrough !== undefined,
    );
  }
  check(
    'a10_r10_11',
    'round10 preset healthcare workforce',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'healthcare_workforce_crisis');
      return inp?.fiscalPressure === 'critical' && (inp.activeCrises ?? 0) >= 2;
    })(),
  );
  check(
    'a10_r10_12',
    'round10 preset insurance hard market',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'insurance_hard_market_stack');
      return inp?.creditShockActive === true && (inp.inflationSettingMultiplier ?? 1) > 1.2;
    })(),
  );
  check(
    'a10_r10_13',
    'round10 preset research vs event shock',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'research_offset_vs_event_shock');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.25;
    })(),
  );

  // --- Round 11 scale wave ---
  {
    const education = assessEducationTuitionInflation({
      enrollmentPressureBand: 'high',
      subsidyCutActive: true,
      wageIndexationBand: 'strong',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r11_01',
      'education sharp or crisis',
      education.pressureBand === 'sharp' || education.pressureBand === 'crisis',
    );
    check('a10_r11_02', 'education score adj', educationTuitionInflationScoreAdjustment(education.pressureBand) >= 3);
  }
  {
    const comms = assessCommunicationsServicesInflation({
      bandwidthDemandBand: 'extreme',
      regulatedTariffShock: true,
      platformFeePassThrough: 'high',
      inflationBand: 'elevated',
      turn: 3,
    });
    check(
      'a10_r11_03',
      'comms elevated or spike',
      comms.pressureBand === 'elevated' || comms.pressureBand === 'spike',
    );
    check('a10_r11_04', 'comms score adj', communicationsServicesInflationScoreAdjustment(comms.pressureBand) >= 3);
  }
  {
    const merged04 = mergeAgent04IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      scenarioInflationBias: 'extreme',
      sandboxStressModeActive: true,
      difficultyCostMultiplier: 1.15,
    });
    check('a10_r11_05', 'agent04 modes merge', merged04.highInflationScenario === true);
    check('a10_r11_06', 'agent04 bridge note', agent04ModesBridgeIntegrationNote().includes('Agent 04'));
  }
  {
    const merged16 = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
    });
    check('a10_r11_07', 'agent16 guardian merge', merged16.highInflationScenario === true);
    check('a10_r11_08', 'agent16 bridge note', agent16GuardianBridgeIntegrationNote().includes('Agent 16'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r11_09',
      'forecast education and comms fields',
      path.points.every((p) => !!p.educationTuitionPressureBand && !!p.communicationsServicesPressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r11_10',
      'agent21 r11 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalEducationTuitionPressure !== undefined &&
        bundle.terminalCommunicationsServicesPressure !== undefined,
    );
  }
  check(
    'a10_r11_11',
    'round11 preset education subsidy',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'education_subsidy_cut_stack');
      return inp?.fiscalPressure === 'critical' && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r11_12',
    'round11 preset comms tariff',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'comms_tariff_platform_spike');
      return inp?.systemicLiquidityBand === 'critical' && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r11_13',
    'round11 preset modes extreme',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'modes_extreme_inflation_sandbox');
      return (inp?.inflationSettingMultiplier ?? 1) > 1.3 && inp.publicStability === 38;
    })(),
  );

  // --- Round 12 scale wave ---
  {
    const leisure = assessRecreationLeisureInflation({
      tourismDemandBand: 'surge',
      laborCostPassThrough: 'high',
      discretionarySpendPressure: true,
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r12_01', 'recreation hot or boom', leisure.pressureBand === 'hot' || leisure.pressureBand === 'boom');
    check('a10_r12_02', 'recreation score adj', recreationLeisureInflationScoreAdjustment(leisure.pressureBand) >= 3);
  }
  {
    const prof = assessProfessionalServicesFeeInflation({
      billingRatePressure: 'extreme',
      complianceCostStack: true,
      corporateDemandBand: 'strong',
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r12_03', 'professional sharp or squeeze', prof.feeBand === 'sharp' || prof.feeBand === 'squeeze');
    check('a10_r12_04', 'professional score adj', professionalServicesFeeInflationScoreAdjustment(prof.feeBand) >= 3);
  }
  {
    const merged17 = mergeAgent17IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      macroAlertLevel: 'red',
      inflationFusionScore: 0.78,
      coordinatedTighteningSuggested: true,
    });
    check('a10_r12_05', 'agent17 command merge', merged17.highInflationScenario === true);
    check('a10_r12_06', 'agent17 bridge note', agent17CommandBridgeIntegrationNote().includes('Agent 17'));
  }
  {
    const merged18 = mergeAgent18IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      crossDomainStressScore: 0.82,
    });
    check('a10_r12_07', 'agent18 team merge', merged18.highInflationScenario === true);
    check('a10_r12_08', 'agent18 bridge note', agent18TeamBridgeIntegrationNote().includes('Agent 18'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r12_09',
      'forecast recreation and professional fields',
      path.points.every((p) => !!p.recreationLeisurePressureBand && !!p.professionalServicesFeeBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r12_10',
      'agent21 r12 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalRecreationLeisurePressure !== undefined &&
        bundle.terminalProfessionalServicesFee !== undefined,
    );
  }
  check(
    'a10_r12_11',
    'round12 preset tourism leisure',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'tourism_leisure_boom_pass_through');
      return inp?.householdInflationScenarioActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r12_12',
    'round12 preset professional fees',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'professional_fee_compliance_stack');
      return inp?.fiscalPressure === 'critical' && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r12_13',
    'round12 preset command team brief',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'command_team_upside_risk_brief');
      return (inp?.inflationSettingMultiplier ?? 1) > 1.28 && (inp.activeCrises ?? 0) >= 2;
    })(),
  );

  // --- Round 13 scale wave ---
  {
    const childcare = assessChildcareServicesInflation({
      capacityShortageBand: 'severe',
      wageAwardPassThrough: 'strong',
      subsidyIndexationLag: true,
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r13_01', 'childcare sharp or crisis', childcare.pressureBand === 'sharp' || childcare.pressureBand === 'crisis');
    check('a10_r13_02', 'childcare score adj', childcareServicesInflationScoreAdjustment(childcare.pressureBand) >= 3);
  }
  {
    const gov = assessGovernmentChargesInflation({
      feeIndexationBand: 'above_cpi',
      newLevyStackActive: true,
      localGovernmentPressure: 'high',
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r13_03', 'gov charges elevated or step_up', gov.pressureBand === 'elevated' || gov.pressureBand === 'step_up');
    check('a10_r13_04', 'gov score adj', governmentChargesInflationScoreAdjustment(gov.pressureBand) >= 3);
  }
  {
    const merged02 = mergeAgent02IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      calendarSeasonBand: 'peak_demand',
      policyReviewWindowOpen: true,
      multiTurnInflationCarryover: 0.22,
    });
    check('a10_r13_05', 'agent02 turns merge', (merged02.inflationSettingMultiplier ?? 1) > 1.05);
    check('a10_r13_06', 'agent02 bridge note', agent02TurnsBridgeIntegrationNote().includes('Agent 02'));
  }
  {
    const merged20 = mergeAgent20IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.3,
    });
    check('a10_r13_07', 'agent20 automation merge', merged20.highInflationScenario === true);
    check('a10_r13_08', 'agent20 bridge note', agent20AutomationBridgeIntegrationNote().includes('Agent 20'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r13_09',
      'forecast childcare and gov fields',
      path.points.every((p) => !!p.childcareServicesPressureBand && !!p.governmentChargesPressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r13_10',
      'agent21 r13 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalChildcareServicesPressure !== undefined &&
        bundle.terminalGovernmentChargesPressure !== undefined,
    );
  }
  check(
    'a10_r13_11',
    'round13 preset childcare capacity',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'childcare_capacity_award_stack');
      return inp?.householdAffordability === 'severe_pressure' && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r13_12',
    'round13 preset gov levy step',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'government_levy_indexation_step');
      return inp?.fiscalPressure === 'critical' && (inp.inflationSettingMultiplier ?? 1) > 1.2;
    })(),
  );
  check(
    'a10_r13_13',
    'round13 preset turns automation drift',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'turns_automation_inflation_drift');
      return inp?.creditShockActive === true && (inp.inflationSettingMultiplier ?? 1) > 1.25;
    })(),
  );

  // --- Round 14 scale wave ---
  {
    const water = assessWaterUtilitiesInflation({
      droughtStressBand: 'severe',
      infrastructureTariffShock: true,
      recyclingCostPassThrough: 'high',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r14_01', 'water sharp or drought crisis', water.pressureBand === 'sharp' || water.pressureBand === 'drought_crisis');
    check('a10_r14_02', 'water score adj', waterUtilitiesInflationScoreAdjustment(water.pressureBand) >= 3);
  }
  {
    const travel = assessDomesticTravelInflation({
      routeCapacityBand: 'constrained',
      fuelSurchargePassThrough: true,
      accommodationOccupancyBand: 'full',
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r14_03', 'travel hot or overheated', travel.pressureBand === 'hot' || travel.pressureBand === 'overheated');
    check('a10_r14_04', 'travel score adj', domesticTravelInflationScoreAdjustment(travel.pressureBand) >= 3);
  }
  {
    const merged01 = mergeAgent01IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      nationalPriorityInflationBias: 'expansionary',
      strategicStockpileStress: true,
      geopoliticalRiskPremium: 0.72,
    });
    check('a10_r14_05', 'agent01 strategic merge', merged01.highInflationScenario === true);
    check('a10_r14_06', 'agent01 bridge note', agent01StrategicBridgeIntegrationNote().includes('Agent 01'));
  }
  {
    const merged19 = mergeAgent19IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      recalledInflationRegimeConfidence: 0.82,
      narrativeDriftTowardHigherInflation: true,
      explainabilityAlertActive: true,
    });
    check('a10_r14_07', 'agent19 memory merge', merged19.highInflationScenario === true);
    check('a10_r14_08', 'agent19 bridge note', agent19MemoryBridgeIntegrationNote().includes('Agent 19'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r14_09',
      'forecast water and travel fields',
      path.points.every((p) => !!p.waterUtilitiesPressureBand && !!p.domesticTravelPressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r14_10',
      'agent21 r14 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalWaterUtilitiesPressure !== undefined &&
        bundle.terminalDomesticTravelPressure !== undefined,
    );
  }
  check(
    'a10_r14_11',
    'round14 preset water drought',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'water_drought_utility_crisis');
      return inp?.systemicLiquidityBand === 'critical' && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r14_12',
    'round14 preset domestic travel',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'domestic_travel_capacity_overheat');
      return inp?.householdInflationScenarioActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r14_13',
    'round14 preset strategic memory drift',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'strategic_memory_inflation_drift');
      return (inp?.inflationSettingMultiplier ?? 1) > 1.28 && inp.creditShockActive === true;
    })(),
  );

  // --- Round 15 scale wave ---
  {
    const materials = assessConstructionMaterialsInflation({
      supplyChainStressBand: 'severe',
      laborShortagePassThrough: true,
      importContentShare: 0.35,
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r15_01', 'materials sharp or supply crunch', materials.pressureBand === 'sharp' || materials.pressureBand === 'supply_crunch');
    check('a10_r15_02', 'materials score adj', constructionMaterialsInflationScoreAdjustment(materials.pressureBand) >= 3);
  }
  {
    const retail = assessRetailTradeMarginInflation({
      discountingIntensity: 'light',
      inventoryClearanceActive: false,
      wageBillPressure: 'high',
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r15_03', 'retail expanding or price_led', retail.marginBand === 'expanding' || retail.marginBand === 'price_led');
    check('a10_r15_04', 'retail score adj', retailTradeMarginInflationScoreAdjustment(retail.marginBand) >= 3);
  }
  {
    const merged22 = mergeAgent22IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      uiNudgeInflationExpectationsUp: true,
    });
    check('a10_r15_05', 'agent22 ui merge', merged22.householdInflationScenarioActive === true);
    check('a10_r15_06', 'agent22 bridge note', agent22UiBridgeIntegrationNote().includes('Agent 22'));
  }
  {
    const merged23 = mergeAgent23IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.78,
      dashboardRefreshUrgency: 'critical',
    });
    check('a10_r15_07', 'agent23 dashboards merge', merged23.highInflationScenario === true);
    check('a10_r15_08', 'agent23 bridge note', agent23DashboardsBridgeIntegrationNote().includes('Agent 23'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r15_09',
      'forecast construction and retail fields',
      path.points.every((p) => !!p.constructionMaterialsPressureBand && !!p.retailTradeMarginBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r15_10',
      'agent21 r15 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalConstructionMaterialsPressure !== undefined &&
        bundle.terminalRetailTradeMargin !== undefined,
    );
  }
  check(
    'a10_r15_11',
    'round15 preset construction crunch',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'construction_materials_supply_crunch');
      return inp?.creditShockActive === true && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r15_12',
    'round15 preset retail price led',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'retail_margin_price_led_shelf');
      return inp?.householdAffordability === 'severe_pressure' && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r15_13',
    'round15 preset dashboard heatmap',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'dashboard_regional_heatmap_alert');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.25;
    })(),
  );

  // --- Round 16 scale wave ---
  {
    const fees = assessFinancialServicesFeeInflation({
      fundingCostPassThrough: 'high',
      complianceCostStackActive: true,
      depositRateCompetitionBand: 'intense',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r16_01', 'financial fees elevated or shock', fees.feeBand === 'elevated' || fees.feeBand === 'fee_shock');
    check('a10_r16_02', 'financial fees score adj', financialServicesFeeInflationScoreAdjustment(fees.feeBand) >= 3);
  }
  {
    const farmgate = assessAgriculturalFarmgateInflation({
      harvestStressBand: 'severe',
      transportToMarketBand: 'critical',
      inputCostPassThrough: true,
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r16_03', 'farmgate sharp or harvest crisis', farmgate.pressureBand === 'sharp' || farmgate.pressureBand === 'harvest_crisis');
    check('a10_r16_04', 'farmgate score adj', agriculturalFarmgateInflationScoreAdjustment(farmgate.pressureBand) >= 3);
  }
  {
    const merged16 = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'advisory',
      narrativeShockSeverity: 'medium',
      financialServicesFeeShockActive: true,
    });
    check('a10_r16_05', 'agent16 fee shock merge', merged16.creditShockActive === true && merged16.highInflationScenario === true);
    check('a10_r16_06', 'agent16 bridge note', agent16GuardianBridgeIntegrationNote().includes('Agent 16'));
  }
  {
    const merged17 = mergeAgent17IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAlertLevel: 'red',
      inflationFusionScore: 0.8,
      coordinatedTighteningSuggested: true,
      farmgateSupplyAlertActive: true,
    });
    check('a10_r16_07', 'agent17 farmgate merge', merged17.householdInflationScenarioActive === true);
    check('a10_r16_08', 'agent17 bridge note', agent17CommandBridgeIntegrationNote().includes('Agent 17'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r16_09',
      'forecast financial and farmgate fields',
      path.points.every((p) => !!p.financialServicesFeeBand && !!p.agriculturalFarmgatePressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r16_10',
      'agent21 r16 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalFinancialServicesFee !== undefined &&
        bundle.terminalAgriculturalFarmgatePressure !== undefined,
    );
  }
  check(
    'a10_r16_11',
    'round16 preset financial fee shock',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'financial_services_fee_shock');
      return inp?.creditShockActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r16_12',
    'round16 preset farmgate harvest',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'agricultural_farmgate_harvest_stress');
      return inp?.householdInflationScenarioActive === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r16_13',
    'round16 preset command red alert',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'command_fusion_red_farmgate_alert');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.25;
    })(),
  );

  // --- Round 17 scale wave ---
  {
    const grid = assessPublicUtilitiesGridTariffInflation({
      serviceReliabilityBand: 'fragile',
      outageRiskBand: 'rolling',
      capacityMarginBand: 'thin',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r17_01', 'grid elevated or shock', grid.tariffBand === 'elevated' || grid.tariffBand === 'grid_shock');
    check('a10_r17_02', 'grid score adj', publicUtilitiesGridTariffInflationScoreAdjustment(grid.tariffBand) >= 3);
  }
  {
    const salience = assessUiInflationSaliencePassThrough({
      dashboardStressHighlight: true,
      playerAttentionBand: 'high',
      uiExpectationsNudgeUp: true,
      phaseShellCoachActive: true,
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r17_03', 'ui salient or shock', salience.salienceBand === 'salient' || salience.salienceBand === 'attention_shock');
    check('a10_r17_04', 'ui score adj', uiInflationSaliencePassThroughScoreAdjustment(salience.salienceBand) >= 3);
  }
  {
    const merged12 = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      freightCapacityBand: 'tight',
      fuelSurchargeActive: false,
      portBacklogBand: 'moderate',
      logisticsInflationScenarioActive: false,
      utilitiesGridCapacityMarginThin: true,
      utilitiesOutageBandSevere: true,
    });
    check('a10_r17_05', 'agent12 utilities merge', merged12.highInflationScenario === true && merged12.systemicLiquidityBand === 'critical');
    check('a10_r17_06', 'agent12 bridge note', agent12TransportBridgeIntegrationNote().includes('Agent 12'));
  }
  {
    const merged22 = mergeAgent22IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      uiNudgeInflationExpectationsUp: true,
      utilitiesStressBannerActive: true,
      phaseShellCostOfLivingCoachActive: true,
    });
    check('a10_r17_07', 'agent22 ui utilities merge', merged22.householdInflationScenarioActive === true);
    check('a10_r17_08', 'agent22 bridge note', agent22UiBridgeIntegrationNote().includes('Agent 22'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r17_09',
      'forecast grid and ui salience fields',
      path.points.every((p) => !!p.publicUtilitiesGridTariffBand && !!p.uiInflationSalienceBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r17_10',
      'agent21 r17 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalPublicUtilitiesGridTariff !== undefined &&
        bundle.terminalUiInflationSalience !== undefined,
    );
  }
  check(
    'a10_r17_11',
    'round17 preset grid tariff stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'public_utilities_grid_tariff_stack');
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r17_12',
    'round17 preset ui salience',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'ui_inflation_salience_stress');
      return inp?.householdInflationScenarioActive === true && inp.householdAffordability === 'severe_pressure';
    })(),
  );
  check(
    'a10_r17_13',
    'round17 preset ui utilities fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'ui_utilities_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.25;
    })(),
  );

  // --- Round 18 scale wave ---
  {
    const essential = assessHousingMortgageEssentialInflation({
      mortgageStressBand: 'severe',
      wellbeingCostBand: 'critical',
      essentialServicesInflationFlag: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r18_01',
      'housing essential elevated or shock',
      essential.essentialBand === 'elevated' || essential.essentialBand === 'services_shock',
    );
    check('a10_r18_02', 'housing essential score adj', housingMortgageEssentialInflationScoreAdjustment(essential.essentialBand) >= 3);
  }
  {
    const merge = assessMacroTransmissionMergeInflation({
      transmissionStabilityFragile: true,
      macroRecoveryRankStressActive: true,
      outputGap: 0.35,
      nominalDemandPressure: 0.45,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r18_03',
      'macro merge fragile or blocked',
      merge.mergeBand === 'fragile' || merge.mergeBand === 'inline_blocked',
    );
    check('a10_r18_04', 'macro merge score adj', macroTransmissionMergeInflationScoreAdjustment(merge.mergeBand) >= 3);
  }
  {
    const merged14 = mergeAgent14IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      mortgageStressBand: 'elevated',
      wellbeingCostBand: 'strained',
      essentialServicesInflationFlag: true,
      inlineMergeTrajectoryBand: 'blocked',
      inlineActivationBoundaryCritical: true,
    });
    check('a10_r18_05', 'agent14 inline merge merge', merged14.highInflationScenario === true && merged14.householdInflationScenarioActive === true);
    check('a10_r18_06', 'agent14 bridge note', agent14HousingBridgeIntegrationNote().includes('Agent 14'));
  }
  {
    const merged06 = mergeAgent06IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      gdpGrowthBand: 'slow',
      unemploymentBand: 'moderate',
      outputGap: 0.1,
      nominalDemandPressure: 0.2,
      transmissionStabilityFragile: true,
      macroRecoveryRankStressActive: true,
    });
    check('a10_r18_07', 'agent06 transmission merge', merged06.highInflationScenario === true && merged06.systemicLiquidityBand === 'strained');
    check('a10_r18_08', 'agent06 bridge note', agent06BridgeIntegrationNote().includes('Agent 06'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r18_09',
      'forecast housing essential and macro merge fields',
      path.points.every((p) => !!p.housingMortgageEssentialBand && !!p.macroTransmissionMergeBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r18_10',
      'agent21 r18 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalHousingMortgageEssential !== undefined &&
        bundle.terminalMacroTransmissionMerge !== undefined,
    );
  }
  check(
    'a10_r18_11',
    'round18 preset housing essential stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'housing_mortgage_essential_stack');
      return inp?.householdAffordability === 'severe_pressure' && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r18_12',
    'round18 preset macro transmission merge',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'macro_transmission_merge_stress');
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'strained';
    })(),
  );
  check(
    'a10_r18_13',
    'round18 preset housing macro fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'housing_macro_merge_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.28;
    })(),
  );

  // --- Round 19 scale wave ---
  {
    const spillover = assessDynamicEventsInflationSpillover({
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      stagedEventCostShockBand: 'cascade',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r19_01',
      'events spillover active or cascade',
      spillover.spilloverBand === 'active' || spillover.spilloverBand === 'cascade',
    );
    check('a10_r19_02', 'events spillover score adj', dynamicEventsInflationSpilloverScoreAdjustment(spillover.spilloverBand) >= 3);
  }
  {
    const overlay = assessDashboardMapInflationOverlay({
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.75,
      dashboardRefreshUrgency: 'critical',
      dashboardInflationHeatmapSevere: true,
      mapLayerCostOfLivingStressActive: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r19_03',
      'dashboard overlay severe or map critical',
      overlay.overlayBand === 'severe' || overlay.overlayBand === 'map_critical',
    );
    check('a10_r19_04', 'dashboard overlay score adj', dashboardMapInflationOverlayScoreAdjustment(overlay.overlayBand) >= 3);
  }
  {
    const merged05 = mergeAgent05IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      stagedEventCostShockBand: 'cascade',
      macroEventInflationSpilloverActive: true,
    });
    check('a10_r19_05', 'agent05 events spillover merge', merged05.highInflationScenario === true && merged05.creditShockActive === true);
    check('a10_r19_06', 'agent05 bridge note', agent05EventsBridgeIntegrationNote().includes('Agent 05'));
  }
  {
    const merged23 = mergeAgent23IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.7,
      dashboardRefreshUrgency: 'critical',
      dashboardInflationHeatmapSevere: true,
      mapLayerCostOfLivingStressActive: true,
    });
    check('a10_r19_07', 'agent23 dashboard merge', merged23.highInflationScenario === true && merged23.householdInflationScenarioActive === true);
    check('a10_r19_08', 'agent23 bridge note', agent23DashboardsBridgeIntegrationNote().includes('Agent 23'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r19_09',
      'forecast events spillover and dashboard overlay fields',
      path.points.every((p) => !!p.dynamicEventsInflationSpilloverBand && !!p.dashboardMapInflationOverlayBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r19_10',
      'agent21 r19 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalDynamicEventsInflationSpillover !== undefined &&
        bundle.terminalDashboardMapInflationOverlay !== undefined,
    );
  }
  check(
    'a10_r19_11',
    'round19 preset events spillover stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'dynamic_events_inflation_spillover_stack');
      return inp?.creditShockActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r19_12',
    'round19 preset dashboard overlay stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'dashboard_map_inflation_overlay_stress');
      return inp?.householdInflationScenarioActive === true && inp.householdAffordability === 'severe_pressure';
    })(),
  );
  check(
    'a10_r19_13',
    'round19 preset events dashboard fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'events_dashboard_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.29;
    })(),
  );

  // --- Round 20 scale wave ---
  {
    const fiscal = assessPublicFinanceDebtServiceInflation({
      consolidatedDeficitBand: 'large_deficit',
      debtServicePressure: 'critical',
      fiscalAnchorBreached: true,
      indexedChargesInflationPassThrough: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r20_01',
      'public finance elevated or dominance',
      fiscal.debtServiceBand === 'elevated' || fiscal.debtServiceBand === 'dominance_risk',
    );
    check('a10_r20_02', 'public finance score adj', publicFinanceDebtServiceInflationScoreAdjustment(fiscal.debtServiceBand) >= 3);
  }
  {
    const labor = assessPopulationLaborWageInflation({
      laborParticipationBand: 'weak',
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      participationSlackInflationBand: 'severe_slack',
      householdExpectationsDeanchoring: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r20_03',
      'population labor elevated or spiral',
      labor.wageBand === 'elevated' || labor.wageBand === 'wage_spiral',
    );
    check('a10_r20_04', 'population labor score adj', populationLaborWageInflationScoreAdjustment(labor.wageBand) >= 3);
  }
  {
    const merged07 = mergeAgent07IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      consolidatedDeficitBand: 'large_deficit',
      revenueMomentum: 'weak',
      debtServicePressure: 'critical',
      fiscalAnchorBreached: true,
      indexedChargesInflationPassThrough: true,
    });
    check('a10_r20_05', 'agent07 fiscal merge', merged07.highInflationScenario === true && merged07.fiscalPressure === 'critical');
    check('a10_r20_06', 'agent07 bridge note', agent07FiscalBridgeIntegrationNote().includes('Agent 07'));
  }
  {
    const merged09 = mergeAgent09IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      laborParticipationBand: 'steady',
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      participationSlackInflationBand: 'severe_slack',
      householdExpectationsDeanchoring: true,
    });
    check('a10_r20_07', 'agent09 labor merge', merged09.highInflationScenario === true && merged09.householdInflationScenarioActive === true);
    check('a10_r20_08', 'agent09 bridge note', agent09HouseholdBridgeIntegrationNote().includes('Agent 09'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r20_09',
      'forecast fiscal debt and labor wage fields',
      path.points.every((p) => !!p.publicFinanceDebtServiceBand && !!p.populationLaborWageBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r20_10',
      'agent21 r20 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalPublicFinanceDebtService !== undefined &&
        bundle.terminalPopulationLaborWage !== undefined,
    );
  }
  check(
    'a10_r20_11',
    'round20 preset public finance debt stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'public_finance_debt_service_stack');
      return inp?.fiscalPressure === 'critical' && inp.sovereignDebtPressure === 'critical';
    })(),
  );
  check(
    'a10_r20_12',
    'round20 preset population labor wage',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'population_labor_wage_stress');
      return inp?.highInflationScenario === true && inp.householdAffordability === 'severe_pressure';
    })(),
  );
  check(
    'a10_r20_13',
    'round20 preset fiscal labor fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'fiscal_labor_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.3;
    })(),
  );

  // --- Round 21 scale wave ---
  {
    const energy = assessWholesaleEnergyTransitionInflation({
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'high',
      renewableShortfallInflationFlag: true,
      wholesaleCascadeBand: 'cascade',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r21_01',
      'wholesale energy elevated or shock',
      energy.transitionBand === 'elevated' || energy.transitionBand === 'transition_shock',
    );
    check('a10_r21_02', 'wholesale energy score adj', wholesaleEnergyTransitionInflationScoreAdjustment(energy.transitionBand) >= 3);
  }
  {
    const urban = assessUrbanRentDispersionInflation({
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.75,
      metroRentDispersionCritical: true,
      regionalHousingInflationSync: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r21_03',
      'urban rent elevated or metro shock',
      urban.dispersionBand === 'elevated' || urban.dispersionBand === 'metro_shock',
    );
    check('a10_r21_04', 'urban rent score adj', urbanRentDispersionInflationScoreAdjustment(urban.dispersionBand) >= 3);
  }
  {
    const merged13 = mergeAgent13IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'high',
      renewableShortfallInflationFlag: true,
      wholesaleCascadeBand: 'cascade',
    });
    check('a10_r21_05', 'agent13 energy merge', merged13.highInflationScenario === true);
    check('a10_r21_06', 'agent13 bridge note', agent13EnergyBridgeIntegrationNote().includes('Agent 13'));
  }
  {
    const merged11 = mergeAgent11IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.68,
      metroRentDispersionCritical: true,
      regionalHousingInflationSync: true,
    });
    check('a10_r21_07', 'agent11 cities merge', merged11.highInflationScenario === true && merged11.householdInflationScenarioActive === true);
    check('a10_r21_08', 'agent11 bridge note', agent11CitiesBridgeIntegrationNote().includes('Agent 11'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r21_09',
      'forecast energy transition and urban rent fields',
      path.points.every((p) => !!p.wholesaleEnergyTransitionBand && !!p.urbanRentDispersionBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r21_10',
      'agent21 r21 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalWholesaleEnergyTransition !== undefined &&
        bundle.terminalUrbanRentDispersion !== undefined,
    );
  }
  check(
    'a10_r21_11',
    'round21 preset wholesale energy stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'wholesale_energy_transition_stack');
      return inp?.systemicLiquidityBand === 'critical' && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r21_12',
    'round21 preset urban rent dispersion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'urban_rent_dispersion_stress');
      return inp?.householdAffordability === 'severe_pressure' && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r21_13',
    'round21 preset energy cities fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'energy_cities_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.31;
    })(),
  );

  // --- Round 22 scale wave ---
  {
    const corporate = assessCorporatePricingPassThroughInflation({
      pricingPowerBand: 'dominant',
      marginCompression: 'mild',
      passThroughIntent: 'full',
      productionCapacityStrainInflationFlag: true,
      corporateMarkupCascadeBand: 'active',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r22_01',
      'corporate elevated or cascade',
      corporate.passThroughBand === 'elevated' || corporate.passThroughBand === 'markup_cascade',
    );
    check('a10_r22_02', 'corporate score adj', corporatePricingPassThroughInflationScoreAdjustment(corporate.passThroughBand) >= 3);
  }
  {
    const trade = assessTradeExchangeImportInflation({
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.45,
      tariffShockInflationActive: true,
      importPipelineFragileBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r22_03', 'trade elevated or fx shock', trade.importBand === 'elevated' || trade.importBand === 'fx_shock');
    check('a10_r22_04', 'trade score adj', tradeExchangeImportInflationScoreAdjustment(trade.importBand) >= 3);
  }
  {
    const merged08 = mergeAgent08IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      pricingPowerBand: 'strong',
      marginCompression: 'mild',
      passThroughIntent: 'full',
      productionCapacityStrainInflationFlag: true,
      corporateMarkupCascadeBand: 'active',
    });
    check('a10_r22_05', 'agent08 corporate merge', merged08.highInflationScenario === true);
    check('a10_r22_06', 'agent08 bridge note', agent08CorporateBridgeIntegrationNote().includes('Agent 08'));
  }
  {
    const merged15 = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.5,
      tariffShockInflationActive: true,
      importPipelineFragileBand: 'critical',
    });
    check('a10_r22_07', 'agent15 trade merge', merged15.highInflationScenario === true);
    check('a10_r22_08', 'agent15 bridge note', agent15TradeBridgeIntegrationNote().includes('Agent 15'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r22_09',
      'forecast corporate and trade import fields',
      path.points.every((p) => !!p.corporatePricingPassThroughBand && !!p.tradeExchangeImportBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r22_10',
      'agent21 r22 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalCorporatePricingPassThrough !== undefined &&
        bundle.terminalTradeExchangeImport !== undefined,
    );
  }
  check(
    'a10_r22_11',
    'round22 preset corporate markup stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'corporate_markup_cascade_stack');
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'strained';
    })(),
  );
  check(
    'a10_r22_12',
    'round22 preset trade import stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'trade_fx_import_pipeline_stress');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r22_13',
    'round22 preset corporate trade fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'corporate_trade_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.32;
    })(),
  );

  // --- Round 23 scale wave ---
  {
    const guardian = assessGuardianInflationInterventionInflation({
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
      copilotInflationEscalationActive: true,
      guardrailNarrativeCascadeBand: 'urgent',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r23_01',
      'guardian urgent or cascade',
      guardian.interventionBand === 'urgent' || guardian.interventionBand === 'guardrail_cascade',
    );
    check('a10_r23_02', 'guardian score adj', guardianInflationInterventionScoreAdjustment(guardian.interventionBand) >= 3);
  }
  {
    const team = assessTeamIntelligenceConsensusInflation({
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      crossDomainStressScore: 0.78,
      teamForecastDeanchoringFlag: true,
      briefingInflationSalienceBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r23_03',
      'team reacceleration or shock',
      team.consensusBand === 'reacceleration' || team.consensusBand === 'consensus_shock',
    );
    check('a10_r23_04', 'team score adj', teamIntelligenceConsensusInflationScoreAdjustment(team.consensusBand) >= 3);
  }
  {
    const merged16 = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
      copilotInflationEscalationActive: true,
      guardrailNarrativeCascadeBand: 'urgent',
    });
    check('a10_r23_05', 'agent16 guardian merge', merged16.highInflationScenario === true);
    check('a10_r23_06', 'agent16 bridge note', agent16GuardianBridgeIntegrationNote().includes('Agent 16'));
  }
  {
    const merged18 = mergeAgent18IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      crossDomainStressScore: 0.75,
      teamForecastDeanchoringFlag: true,
      briefingInflationSalienceBand: 'critical',
    });
    check('a10_r23_07', 'agent18 team merge', merged18.highInflationScenario === true);
    check('a10_r23_08', 'agent18 bridge note', agent18TeamBridgeIntegrationNote().includes('Agent 18'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r23_09',
      'forecast guardian and team consensus fields',
      path.points.every((p) => !!p.guardianInflationInterventionBand && !!p.teamIntelligenceConsensusBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r23_10',
      'agent21 r23 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalGuardianInflationIntervention !== undefined &&
        bundle.terminalTeamIntelligenceConsensus !== undefined,
    );
  }
  check(
    'a10_r23_11',
    'round23 preset guardian intervention stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'guardian_inflation_intervention_stack');
      return inp?.creditShockActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r23_12',
    'round23 preset team consensus stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'team_consensus_briefing_stress');
      return inp?.highInflationScenario === true && (inp.actorCreditStressIndex ?? 0) > 0.7;
    })(),
  );
  check(
    'a10_r23_13',
    'round23 preset guardian team fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'guardian_team_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.33;
    })(),
  );

  // --- Round 24 scale wave ---
  {
    const strategic = assessStrategicGeopoliticalInflationPremium({
      nationalPriorityInflationBias: 'expansionary',
      strategicStockpileStress: true,
      geopoliticalRiskPremium: 0.7,
      expansionaryPriorityCascadeActive: true,
      strategicInflationRiskBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r24_01',
      'strategic elevated or shock',
      strategic.premiumBand === 'elevated' || strategic.premiumBand === 'geopolitical_shock',
    );
    check('a10_r24_02', 'strategic score adj', strategicGeopoliticalInflationPremiumScoreAdjustment(strategic.premiumBand) >= 3);
  }
  {
    const memory = assessAiMemoryInflationRecallInflation({
      recalledInflationRegimeConfidence: 0.85,
      narrativeDriftTowardHigherInflation: true,
      explainabilityAlertActive: true,
      memoryInflationRecallCascade: true,
      explainabilityInflationSalienceBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r24_03',
      'memory recall elevated or shock',
      memory.recallBand === 'recall_elevated' || memory.recallBand === 'memory_shock',
    );
    check('a10_r24_04', 'memory score adj', aiMemoryInflationRecallScoreAdjustment(memory.recallBand) >= 3);
  }
  {
    const merged01 = mergeAgent01IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      nationalPriorityInflationBias: 'expansionary',
      strategicStockpileStress: true,
      geopoliticalRiskPremium: 0.65,
      expansionaryPriorityCascadeActive: true,
      strategicInflationRiskBand: 'critical',
    });
    check('a10_r24_05', 'agent01 strategic merge', merged01.highInflationScenario === true);
    check('a10_r24_06', 'agent01 bridge note', agent01StrategicBridgeIntegrationNote().includes('Agent 01'));
  }
  {
    const merged19 = mergeAgent19IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      recalledInflationRegimeConfidence: 0.82,
      narrativeDriftTowardHigherInflation: true,
      explainabilityAlertActive: true,
      memoryInflationRecallCascade: true,
      explainabilityInflationSalienceBand: 'critical',
    });
    check('a10_r24_07', 'agent19 memory merge', merged19.highInflationScenario === true);
    check('a10_r24_08', 'agent19 bridge note', agent19MemoryBridgeIntegrationNote().includes('Agent 19'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r24_09',
      'forecast strategic premium and memory recall fields',
      path.points.every((p) => !!p.strategicGeopoliticalPremiumBand && !!p.aiMemoryInflationRecallBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r24_10',
      'agent21 r24 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalStrategicGeopoliticalPremium !== undefined &&
        bundle.terminalAiMemoryInflationRecall !== undefined,
    );
  }
  check(
    'a10_r24_11',
    'round24 preset strategic premium stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'strategic_geopolitical_premium_stack');
      return inp?.systemicLiquidityBand === 'critical' && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r24_12',
    'round24 preset memory recall stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'ai_memory_recall_salience_stress');
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r24_13',
    'round24 preset strategic memory fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'strategic_memory_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.34;
    })(),
  );

  // --- Round 25 scale wave ---
  {
    const calendar = assessCalendarSeasonInflationCarryover({
      calendarSeasonBand: 'peak_demand',
      policyReviewWindowOpen: true,
      multiTurnInflationCarryover: 0.35,
      fiscalCalendarInflationLatch: true,
      multiTurnCarryoverBand: 'persistent',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r25_01',
      'calendar peak or shock',
      calendar.carryoverBand === 'peak' || calendar.carryoverBand === 'carryover_shock',
    );
    check('a10_r25_02', 'calendar score adj', calendarSeasonInflationCarryoverScoreAdjustment(calendar.carryoverBand) >= 3);
  }
  {
    const autopilot = assessAutomationAutopilotInflationDrift({
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.35,
      idleMacroInflationEscalation: true,
      autopilotDriftCascadeBand: 'runaway',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r25_03',
      'autopilot elevated or runaway',
      autopilot.driftBand === 'elevated' || autopilot.driftBand === 'autopilot_runaway',
    );
    check('a10_r25_04', 'autopilot score adj', automationAutopilotInflationDriftScoreAdjustment(autopilot.driftBand) >= 3);
  }
  {
    const merged02 = mergeAgent02IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      calendarSeasonBand: 'peak_demand',
      policyReviewWindowOpen: true,
      multiTurnInflationCarryover: 0.3,
      fiscalCalendarInflationLatch: true,
      multiTurnCarryoverBand: 'persistent',
    });
    check('a10_r25_05', 'agent02 turns merge', merged02.highInflationScenario === true);
    check('a10_r25_06', 'agent02 bridge note', agent02TurnsBridgeIntegrationNote().includes('Agent 02'));
  }
  {
    const merged20 = mergeAgent20IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.4,
      idleMacroInflationEscalation: true,
      autopilotDriftCascadeBand: 'runaway',
    });
    check('a10_r25_07', 'agent20 automation merge', merged20.highInflationScenario === true);
    check('a10_r25_08', 'agent20 bridge note', agent20AutomationBridgeIntegrationNote().includes('Agent 20'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r25_09',
      'forecast calendar carryover and automation drift fields',
      path.points.every((p) => !!p.calendarSeasonInflationCarryoverBand && !!p.automationAutopilotInflationDriftBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r25_10',
      'agent21 r25 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalCalendarSeasonInflationCarryover !== undefined &&
        bundle.terminalAutomationAutopilotInflationDrift !== undefined,
    );
  }
  check(
    'a10_r25_11',
    'round25 preset calendar carryover stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'calendar_season_carryover_stack');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r25_12',
    'round25 preset automation drift stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'automation_autopilot_drift_stress');
      return inp?.fiscalPressure === 'critical' && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r25_13',
    'round25 preset turns automation fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'turns_automation_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.35;
    })(),
  );

  // --- Round 26 scale wave ---
  {
    const offset = assessResearchProductivityInflationOffset({
      productivityGainBand: 'strong',
      supplySideReliefActive: true,
      innovationInflationOffsetScore: 0.72,
      techTreeInflationLatch: true,
      supplySideOffsetBand: 'strong',
      inflationBand: 'elevated',
      turn: 2,
    });
    check(
      'a10_r26_01',
      'research strong or moderate relief',
      offset.offsetBand === 'strong_relief' || offset.offsetBand === 'moderate_relief',
    );
    check(
      'a10_r26_02',
      'research score adj relief',
      researchProductivityInflationOffsetScoreAdjustment(offset.offsetBand) <= 0,
    );
  }
  {
    const bias = assessScenarioSandboxInflationBias({
      scenarioInflationBias: 'extreme',
      sandboxStressModeActive: true,
      difficultyCostMultiplier: 1.22,
      difficultyInflationCascade: true,
      sandboxStressInflationBand: 'extreme',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r26_03',
      'scenario extreme or inflationary',
      bias.biasBand === 'extreme_stress' || bias.biasBand === 'inflationary',
    );
    check('a10_r26_04', 'scenario score adj', scenarioSandboxInflationBiasScoreAdjustment(bias.biasBand) >= 3);
  }
  {
    const merged03 = mergeAgent03IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      productivityGainBand: 'flat',
      supplySideReliefActive: false,
      innovationInflationOffsetScore: 0.2,
      techTreeInflationLatch: true,
      supplySideOffsetBand: 'weak',
    });
    check(
      'a10_r26_05',
      'agent03 latch weak merge',
      (merged03.inflationSettingMultiplier ?? 1) > (makeDefaultMacroFinancialTestInputs().inflationSettingMultiplier ?? 1),
    );
    check('a10_r26_06', 'agent03 bridge note', agent03ResearchBridgeIntegrationNote().includes('Agent 03'));
  }
  {
    const merged04 = mergeAgent04IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      scenarioInflationBias: 'inflationary',
      sandboxStressModeActive: true,
      difficultyCostMultiplier: 1.15,
      difficultyInflationCascade: true,
      sandboxStressInflationBand: 'extreme',
    });
    check('a10_r26_07', 'agent04 cascade merge', merged04.highInflationScenario === true);
    check('a10_r26_08', 'agent04 bridge note', agent04ModesBridgeIntegrationNote().includes('Agent 04'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r26_09',
      'forecast research offset and scenario bias fields',
      path.points.every(
        (p) => !!p.researchProductivityInflationOffsetBand && !!p.scenarioSandboxInflationBiasBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r26_10',
      'agent21 r26 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalResearchProductivityInflationOffset !== undefined &&
        bundle.terminalScenarioSandboxInflationBias !== undefined,
    );
  }
  check(
    'a10_r26_11',
    'round26 preset research offset stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'research_productivity_offset_stack');
      return inp?.householdInflationScenarioActive === true && (inp.inflationSettingMultiplier ?? 1) < 1;
    })(),
  );
  check(
    'a10_r26_12',
    'round26 preset sandbox bias stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'scenario_sandbox_bias_stress');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r26_13',
    'round26 preset research modes fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'research_modes_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.36;
    })(),
  );

  // --- Round 27 scale wave ---
  {
    const persistence = assessEventsNarrativeInflationPersistence({
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      dynamicEventInflationLatch: true,
      supplyShockPersistenceBand: 'entrenched',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r27_01',
      'events active or entrenched',
      persistence.persistenceBand === 'active' || persistence.persistenceBand === 'entrenched',
    );
    check('a10_r27_02', 'events score adj', eventsNarrativeInflationPersistenceScoreAdjustment(persistence.persistenceBand) >= 3);
  }
  {
    const slippage = assessMacroDemandOverheatInflationSlippage({
      gdpGrowthBand: 'strong',
      nominalDemandPressure: 0.75,
      outputGap: 0.4,
      macroDemandOverheatLatch: true,
      transmissionSlippageBand: 'dislocated',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r27_03',
      'macro overheating or dislocated',
      slippage.slippageBand === 'overheating' || slippage.slippageBand === 'dislocated',
    );
    check('a10_r27_04', 'macro score adj', macroDemandOverheatInflationSlippageScoreAdjustment(slippage.slippageBand) >= 3);
  }
  {
    const merged05 = mergeAgent05IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      dynamicEventInflationLatch: true,
      supplyShockPersistenceBand: 'entrenched',
    });
    check('a10_r27_05', 'agent05 latch entrenched merge', merged05.highInflationScenario === true);
    check('a10_r27_06', 'agent05 bridge note', agent05EventsBridgeIntegrationNote().includes('Agent 05'));
  }
  {
    const merged06 = mergeAgent06IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      gdpGrowthBand: 'strong',
      unemploymentBand: 'moderate',
      outputGap: 0.35,
      nominalDemandPressure: 0.6,
      macroDemandOverheatLatch: true,
      transmissionSlippageBand: 'dislocated',
    });
    check(
      'a10_r27_07',
      'agent06 slippage merge',
      (merged06.inflationSettingMultiplier ?? 1) > (makeDefaultMacroFinancialTestInputs().inflationSettingMultiplier ?? 1),
    );
    check('a10_r27_08', 'agent06 bridge note', agent06BridgeIntegrationNote().includes('Agent 06'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r27_09',
      'forecast events persistence and macro slippage fields',
      path.points.every(
        (p) => !!p.eventsNarrativeInflationPersistenceBand && !!p.macroDemandOverheatInflationSlippageBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r27_10',
      'agent21 r27 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalEventsNarrativeInflationPersistence !== undefined &&
        bundle.terminalMacroDemandOverheatInflationSlippage !== undefined,
    );
  }
  check(
    'a10_r27_11',
    'round27 preset events persistence stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'events_supply_persistence_stack');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r27_12',
    'round27 preset macro slippage stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'macro_transmission_slippage_stress');
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'strained';
    })(),
  );
  check(
    'a10_r27_13',
    'round27 preset events macro fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'events_macro_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.37;
    })(),
  );

  // --- Round 28 scale wave ---
  {
    const congestion = assessFreightLogisticsInflationCongestion({
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      logisticsInflationLatch: true,
      freightCongestionBand: 'gridlocked',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r28_01',
      'freight congested or gridlocked',
      congestion.congestionBand === 'congested' || congestion.congestionBand === 'gridlocked',
    );
    check('a10_r28_02', 'freight score adj', freightLogisticsInflationCongestionScoreAdjustment(congestion.congestionBand) >= 3);
  }
  {
    const stress = assessHousingWellbeingInflationEssentialStress({
      mortgageStressBand: 'severe',
      wellbeingCostBand: 'critical',
      essentialServicesInflationFlag: true,
      shelterEssentialInflationLatch: true,
      mortgageWellbeingStressBand: 'acute',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r28_03',
      'housing critical or acute',
      stress.stressBand === 'critical' || stress.stressBand === 'acute',
    );
    check('a10_r28_04', 'housing score adj', housingWellbeingInflationEssentialStressScoreAdjustment(stress.stressBand) >= 3);
  }
  {
    const merged12 = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      freightCapacityBand: 'tight',
      fuelSurchargeActive: true,
      portBacklogBand: 'moderate',
      logisticsInflationScenarioActive: false,
      logisticsInflationLatch: true,
      freightCongestionBand: 'gridlocked',
    });
    check('a10_r28_05', 'agent12 gridlock merge', merged12.highInflationScenario === true);
    check('a10_r28_06', 'agent12 bridge note', agent12TransportBridgeIntegrationNote().includes('Agent 12'));
  }
  {
    const merged14 = mergeAgent14IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      mortgageStressBand: 'elevated',
      wellbeingCostBand: 'strained',
      essentialServicesInflationFlag: true,
      shelterEssentialInflationLatch: true,
      mortgageWellbeingStressBand: 'acute',
    });
    check('a10_r28_07', 'agent14 acute merge', merged14.highInflationScenario === true);
    check('a10_r28_08', 'agent14 bridge note', agent14HousingBridgeIntegrationNote().includes('Agent 14'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r28_09',
      'forecast freight congestion and housing stress fields',
      path.points.every(
        (p) => !!p.freightLogisticsInflationCongestionBand && !!p.housingWellbeingInflationEssentialStressBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r28_10',
      'agent21 r28 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalFreightLogisticsInflationCongestion !== undefined &&
        bundle.terminalHousingWellbeingInflationEssentialStress !== undefined,
    );
  }
  check(
    'a10_r28_11',
    'round28 preset freight congestion stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'freight_logistics_congestion_stack');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r28_12',
    'round28 preset housing wellbeing stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'housing_wellbeing_essential_stress');
      return inp?.householdInflationScenarioActive === true && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r28_13',
    'round28 preset transport housing fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'transport_housing_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.38;
    })(),
  );

  // --- Round 29 scale wave ---
  {
    const fusion = assessCommandCenterInflationFusionEscalation({
      macroAlertLevel: 'red',
      inflationFusionScore: 0.82,
      coordinatedTighteningSuggested: true,
      macroInflationFusionLatch: true,
      commandAlertCascadeBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r29_01',
      'command critical or runaway',
      fusion.escalationBand === 'critical' || fusion.escalationBand === 'fusion_runaway',
    );
    check('a10_r29_02', 'command score adj', commandCenterInflationFusionEscalationScoreAdjustment(fusion.escalationBand) >= 3);
  }
  {
    const nudge = assessUiPlayerInflationSalienceNudge({
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      uiNudgeInflationExpectationsUp: true,
      playerInflationSalienceLatch: true,
      uiExpectationsNudgeBand: 'sharp',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r29_03', 'ui sharp or elevated', nudge.nudgeBand === 'sharp' || nudge.nudgeBand === 'elevated');
    check('a10_r29_04', 'ui score adj', uiPlayerInflationSalienceNudgeScoreAdjustment(nudge.nudgeBand) >= 3);
  }
  {
    const merged17 = mergeAgent17IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAlertLevel: 'amber',
      inflationFusionScore: 0.5,
      coordinatedTighteningSuggested: false,
      macroInflationFusionLatch: true,
      commandAlertCascadeBand: 'critical',
    });
    check('a10_r29_05', 'agent17 cascade merge', merged17.highInflationScenario === true);
    check('a10_r29_06', 'agent17 bridge note', agent17CommandBridgeIntegrationNote().includes('Agent 17'));
  }
  {
    const merged22 = mergeAgent22IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'medium',
      uiNudgeInflationExpectationsUp: true,
      playerInflationSalienceLatch: true,
      uiExpectationsNudgeBand: 'sharp',
    });
    check('a10_r29_07', 'agent22 sharp merge', merged22.householdInflationScenarioActive === true);
    check('a10_r29_08', 'agent22 bridge note', agent22UiBridgeIntegrationNote().includes('Agent 22'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r29_09',
      'forecast command fusion and ui nudge fields',
      path.points.every(
        (p) => !!p.commandCenterInflationFusionEscalationBand && !!p.uiPlayerInflationSalienceNudgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r29_10',
      'agent21 r29 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalCommandCenterInflationFusionEscalation !== undefined &&
        bundle.terminalUiPlayerInflationSalienceNudge !== undefined,
    );
  }
  check(
    'a10_r29_11',
    'round29 preset command fusion stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'command_fusion_alert_stack');
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r29_12',
    'round29 preset ui salience stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'ui_salience_expectations_stress');
      return inp?.householdInflationScenarioActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r29_13',
    'round29 preset command ui fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'command_ui_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.39;
    })(),
  );

  // --- Round 30 scale wave ---
  {
    const breach = assessFiscalIndexationInflationAnchorBreach({
      consolidatedDeficitBand: 'large_deficit',
      debtServicePressure: 'critical',
      fiscalAnchorBreached: true,
      debtIndexationInflationLatch: true,
      fiscalPassThroughCascadeBand: 'runaway',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r30_01',
      'fiscal breached or cascade',
      breach.breachBand === 'breached' || breach.breachBand === 'cascade',
    );
    check('a10_r30_02', 'fiscal score adj', fiscalIndexationInflationAnchorBreachScoreAdjustment(breach.breachBand) >= 3);
  }
  {
    const deanchoring = assessHouseholdWageInflationDeanchoring({
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      householdExpectationsDeanchoring: true,
      wagePriceSpiralLatch: true,
      householdDeanchoringBand: 'unmoored',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r30_03',
      'household deanchored or spiral',
      deanchoring.deanchoringBand === 'deanchored' || deanchoring.deanchoringBand === 'spiral',
    );
    check('a10_r30_04', 'household score adj', householdWageInflationDeanchoringScoreAdjustment(deanchoring.deanchoringBand) >= 3);
  }
  {
    const merged07 = mergeAgent07IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consolidatedDeficitBand: 'moderate_deficit',
      revenueMomentum: 'weak',
      debtServicePressure: 'critical',
      debtIndexationInflationLatch: true,
      fiscalPassThroughCascadeBand: 'runaway',
    });
    check('a10_r30_05', 'agent07 runaway merge', merged07.highInflationScenario === true);
    check('a10_r30_06', 'agent07 bridge note', agent07FiscalBridgeIntegrationNote().includes('Agent 07'));
  }
  {
    const merged09 = mergeAgent09IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      laborParticipationBand: 'steady',
      wageGrowthBand: 'moderate',
      costOfLivingStress: 'moderate',
      wagePriceSpiralLatch: true,
      householdDeanchoringBand: 'unmoored',
    });
    check('a10_r30_07', 'agent09 unmoored merge', merged09.highInflationScenario === true);
    check('a10_r30_08', 'agent09 bridge note', agent09HouseholdBridgeIntegrationNote().includes('Agent 09'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r30_09',
      'forecast fiscal breach and household deanchoring fields',
      path.points.every(
        (p) => !!p.fiscalIndexationInflationAnchorBreachBand && !!p.householdWageInflationDeanchoringBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r30_10',
      'agent21 r30 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalFiscalIndexationInflationAnchorBreach !== undefined &&
        bundle.terminalHouseholdWageInflationDeanchoring !== undefined,
    );
  }
  check(
    'a10_r30_11',
    'round30 preset fiscal indexation stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'fiscal_indexation_anchor_breach_stack');
      return inp?.fiscalPressure === 'critical' && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r30_12',
    'round30 preset household deanchoring stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'household_wage_deanchoring_stress');
      return inp?.householdInflationScenarioActive === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r30_13',
    'round30 preset fiscal household fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'fiscal_household_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.4;
    })(),
  );

  // --- Round 31 scale wave ---
  {
    const markup = assessCorporateMarkupInflationCascade({
      pricingPowerBand: 'dominant',
      passThroughIntent: 'full',
      marginCompression: 'none',
      corporatePricingInflationLatch: true,
      markupPassThroughCascadeBand: 'full',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r31_01',
      'markup active or dominant',
      markup.cascadeBand === 'active' || markup.cascadeBand === 'dominant',
    );
    check('a10_r31_02', 'markup score adj', corporateMarkupInflationCascadeScoreAdjustment(markup.cascadeBand) >= 3);
  }
  {
    const pipeline = assessTradeTariffImportInflationPipeline({
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.45,
      importTariffInflationLatch: true,
      exchangePipelineStressBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r31_03',
      'trade fragile or ruptured',
      pipeline.pipelineBand === 'fragile' || pipeline.pipelineBand === 'ruptured',
    );
    check('a10_r31_04', 'trade score adj', tradeTariffImportInflationPipelineScoreAdjustment(pipeline.pipelineBand) >= 3);
  }
  {
    const merged08 = mergeAgent08IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      pricingPowerBand: 'moderate',
      marginCompression: 'none',
      passThroughIntent: 'partial',
      corporatePricingInflationLatch: true,
      markupPassThroughCascadeBand: 'full',
    });
    check('a10_r31_05', 'agent08 full cascade merge', merged08.highInflationScenario === true);
    check('a10_r31_06', 'agent08 bridge note', agent08CorporateBridgeIntegrationNote().includes('Agent 08'));
  }
  {
    const merged15 = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'stable',
      commodityImportShare: 0.3,
      importTariffInflationLatch: true,
      exchangePipelineStressBand: 'ruptured',
    });
    check('a10_r31_07', 'agent15 ruptured merge', merged15.highInflationScenario === true);
    check('a10_r31_08', 'agent15 bridge note', agent15TradeBridgeIntegrationNote().includes('Agent 15'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r31_09',
      'forecast markup cascade and tariff pipeline fields',
      path.points.every(
        (p) => !!p.corporateMarkupInflationCascadeBand && !!p.tradeTariffImportInflationPipelineBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r31_10',
      'agent21 r31 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalCorporateMarkupInflationCascade !== undefined &&
        bundle.terminalTradeTariffImportInflationPipeline !== undefined,
    );
  }
  check(
    'a10_r31_11',
    'round31 preset corporate markup stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'corporate_markup_pass_through_stack');
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r31_12',
    'round31 preset trade tariff stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'trade_tariff_pipeline_stress');
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r31_13',
    'round31 preset markup tariff fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'markup_tariff_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.41;
    })(),
  );

  // --- Round 32 scale wave ---
  {
    const surge = assessMetroUrbanRentInflationSurge({
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      urbanRentInflationLatch: true,
      metroDispersionStressBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r32_01',
      'metro surging or critical',
      surge.surgeBand === 'surging' || surge.surgeBand === 'critical',
    );
    check('a10_r32_02', 'metro score adj', metroUrbanRentInflationSurgeScoreAdjustment(surge.surgeBand) >= 3);
  }
  {
    const grid = assessWholesaleGridEnergyInflationCascade({
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      gridTariffInflationLatch: true,
      wholesaleStressCascadeBand: 'cascade',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r32_03',
      'grid fragile or crisis',
      grid.cascadeBand === 'fragile' || grid.cascadeBand === 'crisis',
    );
    check('a10_r32_04', 'grid score adj', wholesaleGridEnergyInflationCascadeScoreAdjustment(grid.cascadeBand) >= 3);
  }
  {
    const merged11 = mergeAgent11IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      vacancyBand: 'tight',
      rentGrowthBand: 'moderate',
      urbanizationPressure: 'medium',
      regionalDispersionScore: 0.4,
      urbanRentInflationLatch: true,
      metroDispersionStressBand: 'critical',
    });
    check('a10_r32_05', 'agent11 critical merge', merged11.highInflationScenario === true);
    check('a10_r32_06', 'agent11 bridge note', agent11CitiesBridgeIntegrationNote().includes('Agent 11'));
  }
  {
    const merged13 = mergeAgent13IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      wholesaleEnergyStress: 'elevated',
      retailTariffShock: false,
      gridReliabilityBand: 'stable',
      emissionsTransitionCostBand: 'low',
      gridTariffInflationLatch: true,
      wholesaleStressCascadeBand: 'cascade',
    });
    check('a10_r32_07', 'agent13 cascade merge', merged13.highInflationScenario === true);
    check('a10_r32_08', 'agent13 bridge note', agent13EnergyBridgeIntegrationNote().includes('Agent 13'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r32_09',
      'forecast metro surge and grid cascade fields',
      path.points.every(
        (p) => !!p.metroUrbanRentInflationSurgeBand && !!p.wholesaleGridEnergyInflationCascadeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r32_10',
      'agent21 r32 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalMetroUrbanRentInflationSurge !== undefined &&
        bundle.terminalWholesaleGridEnergyInflationCascade !== undefined,
    );
  }
  check(
    'a10_r32_11',
    'round32 preset metro rent surge stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'metro_urban_rent_surge_stack');
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r32_12',
    'round32 preset grid cascade stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'wholesale_grid_tariff_cascade_stress');
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r32_13',
    'round32 preset metro grid fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'metro_grid_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.42;
    })(),
  );
  {
    const escalation = assessGuardianGuardrailInflationEscalation({
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
      guardrailInflationLatch: true,
      copilotEscalationBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r33_01',
      'guardian urgent or critical',
      escalation.escalationBand === 'urgent' || escalation.escalationBand === 'critical',
    );
    check(
      'a10_r33_02',
      'guardian score adj',
      guardianGuardrailInflationEscalationScoreAdjustment(escalation.escalationBand) >= 3,
    );
  }
  {
    const drift = assessTeamConsensusInflationBriefingDrift({
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      crossDomainStressScore: 0.85,
      teamBriefingInflationLatch: true,
      consensusDriftBand: 'unmoored',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r33_03',
      'team deanchored or consensus shock',
      drift.driftBand === 'deanchored' || drift.driftBand === 'consensus_shock',
    );
    check(
      'a10_r33_04',
      'team score adj',
      teamConsensusInflationBriefingDriftScoreAdjustment(drift.driftBand) >= 3,
    );
  }
  {
    const merged16 = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'advisory',
      narrativeShockSeverity: 'medium',
      guardrailInflationLatch: true,
      copilotEscalationBand: 'critical',
    });
    check('a10_r33_05', 'agent16 critical latch merge', merged16.highInflationScenario === true);
    check('a10_r33_06', 'agent16 bridge note', agent16GuardianBridgeIntegrationNote().includes('Agent 16'));
  }
  {
    const merged18 = mergeAgent18IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consensusInflationOutlook: 'stable',
      briefingUrgencyBand: 'routine',
      crossDomainStressScore: 0.2,
      teamBriefingInflationLatch: true,
      consensusDriftBand: 'unmoored',
    });
    check('a10_r33_07', 'agent18 unmoored merge', merged18.highInflationScenario === true);
    check('a10_r33_08', 'agent18 bridge note', agent18TeamBridgeIntegrationNote().includes('Agent 18'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r33_09',
      'forecast guardian escalation and team briefing drift fields',
      path.points.every(
        (p) => !!p.guardianGuardrailInflationEscalationBand && !!p.teamConsensusInflationBriefingDriftBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r33_10',
      'agent21 r33 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalGuardianGuardrailInflationEscalation !== undefined &&
        bundle.terminalTeamConsensusInflationBriefingDrift !== undefined,
    );
  }
  check(
    'a10_r33_11',
    'round33 preset guardian guardrail stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'guardian_guardrail_escalation_stack',
      );
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r33_12',
    'round33 preset team briefing drift stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'team_briefing_consensus_drift_stress',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r33_13',
    'round33 preset guardian team fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'guardian_team_briefing_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.43;
    })(),
  );
  {
    const recallGate = assessMemoryCommonwealthInflationRecallGate({
      recalledInflationRegimeConfidence: 0.88,
      narrativeDriftTowardHigherInflation: true,
      explainabilityAlertActive: true,
      memoryCommonwealthInflationLatch: true,
      realmRecallGateBand: 'breached',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r34_01',
      'memory breached or commonwealth shock',
      recallGate.gateBand === 'breached' || recallGate.gateBand === 'commonwealth_shock',
    );
    check(
      'a10_r34_02',
      'memory score adj',
      memoryCommonwealthInflationRecallGateScoreAdjustment(recallGate.gateBand) >= 3,
    );
  }
  {
    const cascade = assessAutomationSynthesisInflationCascadeDrift({
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.32,
      synthesisAutopilotInflationLatch: true,
      cascadeStackDriftBand: 'runaway',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r34_03',
      'automation stacking or runaway',
      cascade.driftBand === 'stacking' || cascade.driftBand === 'runaway',
    );
    check(
      'a10_r34_04',
      'automation score adj',
      automationSynthesisInflationCascadeDriftScoreAdjustment(cascade.driftBand) >= 3,
    );
  }
  {
    const merged19 = mergeAgent19IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      recalledInflationRegimeConfidence: 0.5,
      narrativeDriftTowardHigherInflation: false,
      explainabilityAlertActive: false,
      memoryCommonwealthInflationLatch: true,
      realmRecallGateBand: 'breached',
    });
    check('a10_r34_05', 'agent19 breached merge', merged19.highInflationScenario === true);
    check('a10_r34_06', 'agent19 bridge note', agent19MemoryBridgeIntegrationNote().includes('Agent 19'));
  }
  {
    const merged20 = mergeAgent20IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAutopilotInflationBias: 'neutral',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.5,
      synthesisAutopilotInflationLatch: true,
      cascadeStackDriftBand: 'runaway',
    });
    check('a10_r34_07', 'agent20 runaway merge', merged20.highInflationScenario === true);
    check('a10_r34_08', 'agent20 bridge note', agent20AutomationBridgeIntegrationNote().includes('Agent 20'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r34_09',
      'forecast memory recall gate and synthesis cascade fields',
      path.points.every(
        (p) => !!p.memoryCommonwealthInflationRecallGateBand && !!p.automationSynthesisInflationCascadeDriftBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r34_10',
      'agent21 r34 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalMemoryCommonwealthInflationRecallGate !== undefined &&
        bundle.terminalAutomationSynthesisInflationCascadeDrift !== undefined,
    );
  }
  check(
    'a10_r34_11',
    'round34 preset memory commonwealth stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'memory_commonwealth_recall_gate_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r34_12',
    'round34 preset automation synthesis stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'automation_synthesis_cascade_drift_stress',
      );
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r34_13',
    'round34 preset memory automation fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'memory_automation_commonwealth_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.44;
    })(),
  );

  {
    const salience = assessUiShellInflationSalienceEscalation({
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      uiNudgeInflationExpectationsUp: true,
      wave35SalienceEscalationLatch: true,
      shellExpectationsEscalationBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r35_01',
      'ui sharp or shell critical',
      salience.escalationBand === 'sharp' || salience.escalationBand === 'shell_critical',
    );
    check(
      'a10_r35_02',
      'ui score adj',
      uiShellInflationSalienceEscalationScoreAdjustment(salience.escalationBand) >= 3,
    );
  }
  {
    const overlay = assessDashboardHeatmapInflationOverlayCascade({
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.82,
      dashboardRefreshUrgency: 'critical',
      regionalInflationOverlayLatch: true,
      heatmapOverlayCascadeBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r35_03',
      'dashboard critical or overlay cascade',
      overlay.cascadeBand === 'critical' || overlay.cascadeBand === 'overlay_cascade',
    );
    check(
      'a10_r35_04',
      'dashboard score adj',
      dashboardHeatmapInflationOverlayCascadeScoreAdjustment(overlay.cascadeBand) >= 3,
    );
  }
  {
    const merged22 = mergeAgent22IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      uiNudgeInflationExpectationsUp: true,
      wave35SalienceEscalationLatch: true,
      shellExpectationsEscalationBand: 'critical',
    });
    check('a10_r35_05', 'agent22 critical shell merge', merged22.highInflationScenario === true);
    check('a10_r35_06', 'agent22 bridge note', agent22UiBridgeIntegrationNote().includes('Agent 22'));
  }
  {
    const merged23 = mergeAgent23IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.7,
      dashboardRefreshUrgency: 'critical',
      regionalInflationOverlayLatch: true,
      heatmapOverlayCascadeBand: 'critical',
    });
    check('a10_r35_07', 'agent23 overlay cascade merge', merged23.highInflationScenario === true);
    check('a10_r35_08', 'agent23 bridge note', agent23DashboardsBridgeIntegrationNote().includes('Agent 23'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r35_09',
      'forecast ui salience and heatmap overlay fields',
      path.points.every(
        (p) => !!p.uiShellInflationSalienceEscalationBand && !!p.dashboardHeatmapInflationOverlayCascadeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r35_10',
      'agent21 r35 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalUiShellInflationSalienceEscalation !== undefined &&
        bundle.terminalDashboardHeatmapInflationOverlayCascade !== undefined,
    );
  }
  check(
    'a10_r35_11',
    'round35 preset ui salience stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'ui_shell_salience_escalation_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r35_12',
    'round35 preset dashboard overlay stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'dashboard_heatmap_overlay_cascade_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r35_13',
    'round35 preset ui dashboard fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'ui_dashboard_wave35_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.45;
    })(),
  );

  {
    const fusion = assessCommandCenterInflationFusionLatch({
      macroAlertLevel: 'red',
      inflationFusionScore: 0.82,
      coordinatedTighteningSuggested: true,
      wave36FusionLatch: true,
      commandInflationEscalationBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r36_01',
      'command critical or fusion runaway',
      fusion.latchBand === 'critical' || fusion.latchBand === 'fusion_runaway',
    );
    check(
      'a10_r36_02',
      'command score adj',
      commandCenterInflationFusionLatchScoreAdjustment(fusion.latchBand) >= 3,
    );
  }
  {
    const freight = assessTransportFreightInflationCongestionCascade({
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      wave36LogisticsInflationLatch: true,
      freightCascadeCongestionBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r36_03',
      'freight gridlocked or rupture',
      freight.cascadeBand === 'gridlocked' || freight.cascadeBand === 'logistics_rupture',
    );
    check(
      'a10_r36_04',
      'freight score adj',
      transportFreightInflationCongestionCascadeScoreAdjustment(freight.cascadeBand) >= 3,
    );
  }
  {
    const merged17 = mergeAgent17IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAlertLevel: 'red',
      inflationFusionScore: 0.7,
      coordinatedTighteningSuggested: true,
      wave36FusionLatch: true,
      commandInflationEscalationBand: 'critical',
    });
    check('a10_r36_05', 'agent17 critical fusion merge', merged17.highInflationScenario === true);
    check('a10_r36_06', 'agent17 bridge note', agent17CommandBridgeIntegrationNote().includes('Agent 17'));
  }
  {
    const merged12 = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      logisticsInflationScenarioActive: true,
      wave36LogisticsInflationLatch: true,
      freightCascadeCongestionBand: 'ruptured',
    });
    check('a10_r36_07', 'agent12 ruptured cascade merge', merged12.highInflationScenario === true);
    check('a10_r36_08', 'agent12 bridge note', agent12TransportBridgeIntegrationNote().includes('Agent 12'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r36_09',
      'forecast command fusion and freight cascade fields',
      path.points.every(
        (p) =>
          !!p.commandCenterInflationFusionLatchBand && !!p.transportFreightInflationCongestionCascadeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r36_10',
      'agent21 r36 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalCommandCenterInflationFusionLatch !== undefined &&
        bundle.terminalTransportFreightInflationCongestionCascade !== undefined,
    );
  }
  check(
    'a10_r36_11',
    'round36 preset command fusion stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'command_fusion_latch_escalation_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r36_12',
    'round36 preset transport congestion stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'transport_freight_congestion_cascade_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r36_13',
    'round36 preset command transport fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'command_transport_wave36_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.46;
    })(),
  );

  {
    const persistence = assessEventsStagedInflationShockPersistence({
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      wave37EventInflationLatch: true,
      stagedShockPersistenceBand: 'entrenched',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r37_01',
      'events entrenched or narrative cascade',
      persistence.persistenceBand === 'entrenched' || persistence.persistenceBand === 'narrative_cascade',
    );
    check(
      'a10_r37_02',
      'events score adj',
      eventsStagedInflationShockPersistenceScoreAdjustment(persistence.persistenceBand) >= 3,
    );
  }
  {
    const sandbox = assessModesSandboxInflationStressCascade({
      scenarioInflationBias: 'extreme',
      sandboxStressModeActive: true,
      difficultyCostMultiplier: 1.2,
      wave37SandboxInflationLatch: true,
      scenarioBiasCascadeBand: 'runaway',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r37_03',
      'modes extreme or bias runaway',
      sandbox.cascadeBand === 'extreme' || sandbox.cascadeBand === 'bias_runaway',
    );
    check(
      'a10_r37_04',
      'modes score adj',
      modesSandboxInflationStressCascadeScoreAdjustment(sandbox.cascadeBand) >= 3,
    );
  }
  {
    const merged05 = mergeAgent05IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      wave37EventInflationLatch: true,
      stagedShockPersistenceBand: 'entrenched',
    });
    check('a10_r37_05', 'agent05 entrenched merge', merged05.highInflationScenario === true);
    check('a10_r37_06', 'agent05 bridge note', agent05EventsBridgeIntegrationNote().includes('Agent 05'));
  }
  {
    const merged04 = mergeAgent04IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      scenarioInflationBias: 'extreme',
      sandboxStressModeActive: true,
      difficultyCostMultiplier: 1.15,
      wave37SandboxInflationLatch: true,
      scenarioBiasCascadeBand: 'runaway',
    });
    check('a10_r37_07', 'agent04 runaway merge', merged04.highInflationScenario === true);
    check('a10_r37_08', 'agent04 bridge note', agent04ModesBridgeIntegrationNote().includes('Agent 04'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r37_09',
      'forecast events persistence and modes cascade fields',
      path.points.every(
        (p) => !!p.eventsStagedInflationShockPersistenceBand && !!p.modesSandboxInflationStressCascadeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r37_10',
      'agent21 r37 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalEventsStagedInflationShockPersistence !== undefined &&
        bundle.terminalModesSandboxInflationStressCascade !== undefined,
    );
  }
  check(
    'a10_r37_11',
    'round37 preset events shock stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'events_staged_shock_persistence_stack',
      );
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r37_12',
    'round37 preset modes sandbox stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'modes_sandbox_stress_cascade_stress',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r37_13',
    'round37 preset events modes fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'events_modes_wave37_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.47;
    })(),
  );

  {
    const latch = assessFiscalAppropriationInflationPressureLatch({
      consolidatedDeficitBand: 'large_deficit',
      debtServicePressure: 'critical',
      wave38AppropriationInflationLatch: true,
      fiscalPressureEscalationBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r38_01',
      'fiscal critical or appropriation runaway',
      latch.latchBand === 'critical' || latch.latchBand === 'appropriation_runaway',
    );
    check(
      'a10_r38_02',
      'fiscal score adj',
      fiscalAppropriationInflationPressureLatchScoreAdjustment(latch.latchBand) >= 3,
    );
  }
  {
    const budget = assessHouseholdBudgetInflationStressCascade({
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      wave38BudgetInflationLatch: true,
      householdStressCascadeBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r38_03',
      'household ruptured or budget collapse',
      budget.cascadeBand === 'ruptured' || budget.cascadeBand === 'budget_collapse',
    );
    check(
      'a10_r38_04',
      'household score adj',
      householdBudgetInflationStressCascadeScoreAdjustment(budget.cascadeBand) >= 3,
    );
  }
  {
    const merged07 = mergeAgent07IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consolidatedDeficitBand: 'large_deficit',
      revenueMomentum: 'weak',
      debtServicePressure: 'critical',
      wave38AppropriationInflationLatch: true,
      fiscalPressureEscalationBand: 'critical',
    });
    check('a10_r38_05', 'agent07 critical latch merge', merged07.highInflationScenario === true);
    check('a10_r38_06', 'agent07 bridge note', agent07FiscalBridgeIntegrationNote().includes('Agent 07'));
  }
  {
    const merged09 = mergeAgent09IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      laborParticipationBand: 'steady',
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      wave38BudgetInflationLatch: true,
      householdStressCascadeBand: 'ruptured',
    });
    check('a10_r38_07', 'agent09 ruptured merge', merged09.highInflationScenario === true);
    check('a10_r38_08', 'agent09 bridge note', agent09HouseholdBridgeIntegrationNote().includes('Agent 09'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r38_09',
      'forecast appropriation latch and budget cascade fields',
      path.points.every(
        (p) =>
          !!p.fiscalAppropriationInflationPressureLatchBand && !!p.householdBudgetInflationStressCascadeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r38_10',
      'agent21 r38 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalFiscalAppropriationInflationPressureLatch !== undefined &&
        bundle.terminalHouseholdBudgetInflationStressCascade !== undefined,
    );
  }
  check(
    'a10_r38_11',
    'round38 preset fiscal appropriation stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'fiscal_appropriation_pressure_latch_stack',
      );
      return inp?.highInflationScenario === true && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r38_12',
    'round38 preset household budget stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'household_budget_stress_cascade_stress',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r38_13',
    'round38 preset fiscal household fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'fiscal_household_wave38_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.48;
    })(),
  );

  {
    const pricing = assessCorporateSurvivalPricingInflationLatch({
      pricingPowerBand: 'dominant',
      passThroughIntent: 'full',
      marginCompression: 'severe',
      wave39SurvivalPricingLatch: true,
      corporateMarkupEscalationBand: 'dominant',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r39_01',
      'corporate dominant or survival runaway',
      pricing.latchBand === 'dominant' || pricing.latchBand === 'survival_runaway',
    );
    check(
      'a10_r39_02',
      'corporate score adj',
      corporateSurvivalPricingInflationLatchScoreAdjustment(pricing.latchBand) >= 3,
    );
  }
  {
    const exchange = assessTradeTariffExchangeInflationEscalation({
      exchangeRatePressure: 'sharp_depreciation',
      tradeOpennessBand: 'open',
      commodityImportShare: 0.5,
      wave39TariffExchangeLatch: true,
      importExchangeEscalationBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r39_03',
      'trade ruptured or exchange crisis',
      exchange.escalationBand === 'ruptured' || exchange.escalationBand === 'exchange_crisis',
    );
    check(
      'a10_r39_04',
      'trade score adj',
      tradeTariffExchangeInflationEscalationScoreAdjustment(exchange.escalationBand) >= 3,
    );
  }
  {
    const merged08 = mergeAgent08IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      pricingPowerBand: 'dominant',
      marginCompression: 'mild',
      passThroughIntent: 'full',
      wave39SurvivalPricingLatch: true,
      corporateMarkupEscalationBand: 'dominant',
    });
    check('a10_r39_05', 'agent08 dominant latch merge', merged08.highInflationScenario === true);
    check('a10_r39_06', 'agent08 bridge note', agent08CorporateBridgeIntegrationNote().includes('Agent 08'));
  }
  {
    const merged15 = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.45,
      wave39TariffExchangeLatch: true,
      importExchangeEscalationBand: 'ruptured',
    });
    check('a10_r39_07', 'agent15 ruptured merge', merged15.highInflationScenario === true);
    check('a10_r39_08', 'agent15 bridge note', agent15TradeBridgeIntegrationNote().includes('Agent 15'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r39_09',
      'forecast survival pricing and tariff exchange fields',
      path.points.every(
        (p) => !!p.corporateSurvivalPricingInflationLatchBand && !!p.tradeTariffExchangeInflationEscalationBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r39_10',
      'agent21 r39 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalCorporateSurvivalPricingInflationLatch !== undefined &&
        bundle.terminalTradeTariffExchangeInflationEscalation !== undefined,
    );
  }
  check(
    'a10_r39_11',
    'round39 preset corporate survival stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'corporate_survival_pricing_latch_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r39_12',
    'round39 preset trade exchange stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'trade_tariff_exchange_escalation_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r39_13',
    'round39 preset corporate trade fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'corporate_trade_wave39_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.49;
    })(),
  );

  {
    const metro = assessMetroCapacityRentInflationLatch({
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      wave40UrbanRentLatch: true,
      metroCapacityStressBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r40_01',
      'metro surging or capacity crisis',
      metro.latchBand === 'surging' || metro.latchBand === 'capacity_crisis',
    );
    check(
      'a10_r40_02',
      'metro score adj',
      metroCapacityRentInflationLatchScoreAdjustment(metro.latchBand) >= 3,
    );
  }
  {
    const grid = assessGridWholesaleTariffInflationSurge({
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      wave40GridTariffLatch: true,
      wholesaleTariffCascadeBand: 'cascade',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r40_03',
      'grid cascade or grid crisis',
      grid.surgeBand === 'cascade' || grid.surgeBand === 'grid_crisis',
    );
    check(
      'a10_r40_04',
      'grid score adj',
      gridWholesaleTariffInflationSurgeScoreAdjustment(grid.surgeBand) >= 3,
    );
  }
  {
    const merged11 = mergeAgent11IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.6,
      wave40UrbanRentLatch: true,
      metroCapacityStressBand: 'critical',
    });
    check('a10_r40_05', 'agent11 critical latch merge', merged11.highInflationScenario === true);
    check('a10_r40_06', 'agent11 bridge note', agent11CitiesBridgeIntegrationNote().includes('Agent 11'));
  }
  {
    const merged13 = mergeAgent13IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'high',
      wave40GridTariffLatch: true,
      wholesaleTariffCascadeBand: 'cascade',
    });
    check('a10_r40_07', 'agent13 cascade merge', merged13.highInflationScenario === true);
    check('a10_r40_08', 'agent13 bridge note', agent13EnergyBridgeIntegrationNote().includes('Agent 13'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r40_09',
      'forecast metro capacity and grid tariff fields',
      path.points.every(
        (p) => !!p.metroCapacityRentInflationLatchBand && !!p.gridWholesaleTariffInflationSurgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r40_10',
      'agent21 r40 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalMetroCapacityRentInflationLatch !== undefined &&
        bundle.terminalGridWholesaleTariffInflationSurge !== undefined,
    );
  }
  check(
    'a10_r40_11',
    'round40 preset metro capacity stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'metro_capacity_rent_latch_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r40_12',
    'round40 preset grid tariff surge stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'grid_wholesale_tariff_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r40_13',
    'round40 preset cities energy fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'cities_energy_wave40_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.5;
    })(),
  );

  {
    const pressure = assessGuardianCopilotInflationPressureLatch({
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      wave41GuardianPressureLatch: true,
      copilotPressureEscalationBand: 'runaway',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r41_01',
      'guardian latched or runaway',
      pressure.latchBand === 'latched' || pressure.latchBand === 'runaway',
    );
    check(
      'a10_r41_02',
      'guardian pressure score adj',
      guardianCopilotInflationPressureLatchScoreAdjustment(pressure.latchBand) >= 3,
    );
  }
  {
    const unmooring = assessTeamBriefingConsensusInflationUnmooring({
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      wave41TeamConsensusLatch: true,
      briefingConsensusUnmoorBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r41_03',
      'team unmoored or consensus rupture',
      unmooring.unmooringBand === 'unmoored' || unmooring.unmooringBand === 'consensus_rupture',
    );
    check(
      'a10_r41_04',
      'team unmoor score adj',
      teamBriefingConsensusInflationUnmooringScoreAdjustment(unmooring.unmooringBand) >= 3,
    );
  }
  {
    const merged16 = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
      wave41GuardianPressureLatch: true,
      copilotPressureEscalationBand: 'runaway',
    });
    check('a10_r41_05', 'agent16 runaway latch merge', merged16.highInflationScenario === true);
    check('a10_r41_06', 'agent16 bridge note', agent16GuardianBridgeIntegrationNote().includes('Agent 16'));
  }
  {
    const merged18 = mergeAgent18IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      crossDomainStressScore: 0.75,
      wave41TeamConsensusLatch: true,
      briefingConsensusUnmoorBand: 'ruptured',
    });
    check('a10_r41_07', 'agent18 ruptured merge', merged18.highInflationScenario === true);
    check('a10_r41_08', 'agent18 bridge note', agent18TeamBridgeIntegrationNote().includes('Agent 18'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r41_09',
      'forecast guardian pressure and team unmooring fields',
      path.points.every(
        (p) => !!p.guardianCopilotInflationPressureLatchBand && !!p.teamBriefingConsensusInflationUnmooringBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r41_10',
      'agent21 r41 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalGuardianCopilotInflationPressureLatch !== undefined &&
        bundle.terminalTeamBriefingConsensusInflationUnmooring !== undefined,
    );
  }
  check(
    'a10_r41_11',
    'round41 preset guardian copilot stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'guardian_copilot_pressure_latch_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r41_12',
    'round41 preset team consensus unmoor stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'team_briefing_consensus_unmoor_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r41_13',
    'round41 preset guardian team fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'guardian_team_wave41_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.51;
    })(),
  );

  {
    const realm = assessMemoryRealmInflationPersistenceLatch({
      recalledInflationRegimeConfidence: 0.85,
      narrativeDriftTowardHigherInflation: true,
      wave42MemoryRecallLatch: true,
      realmPersistenceGateBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r42_01',
      'memory latched or realm rupture',
      realm.latchBand === 'latched' || realm.latchBand === 'realm_rupture',
    );
    check(
      'a10_r42_02',
      'memory persistence score adj',
      memoryRealmInflationPersistenceLatchScoreAdjustment(realm.latchBand) >= 3,
    );
  }
  {
    const cascade = assessAutomationSynthesisInflationCascadeSurge({
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      wave42SynthesisCascadeLatch: true,
      autopilotStackSurgeBand: 'surge',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r42_03',
      'automation surge or runaway',
      cascade.surgeBand === 'surge' || cascade.surgeBand === 'autopilot_runaway',
    );
    check(
      'a10_r42_04',
      'automation surge score adj',
      automationSynthesisInflationCascadeSurgeScoreAdjustment(cascade.surgeBand) >= 3,
    );
  }
  {
    const merged19 = mergeAgent19IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      recalledInflationRegimeConfidence: 0.8,
      narrativeDriftTowardHigherInflation: true,
      explainabilityAlertActive: true,
      wave42MemoryRecallLatch: true,
      realmPersistenceGateBand: 'ruptured',
    });
    check('a10_r42_05', 'agent19 ruptured latch merge', merged19.highInflationScenario === true);
    check('a10_r42_06', 'agent19 bridge note', agent19MemoryBridgeIntegrationNote().includes('Agent 19'));
  }
  {
    const merged20 = mergeAgent20IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.35,
      wave42SynthesisCascadeLatch: true,
      autopilotStackSurgeBand: 'surge',
    });
    check('a10_r42_07', 'agent20 surge merge', merged20.highInflationScenario === true);
    check('a10_r42_08', 'agent20 bridge note', agent20AutomationBridgeIntegrationNote().includes('Agent 20'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r42_09',
      'forecast memory persistence and automation surge fields',
      path.points.every(
        (p) => !!p.memoryRealmInflationPersistenceLatchBand && !!p.automationSynthesisInflationCascadeSurgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r42_10',
      'agent21 r42 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalMemoryRealmInflationPersistenceLatch !== undefined &&
        bundle.terminalAutomationSynthesisInflationCascadeSurge !== undefined,
    );
  }
  check(
    'a10_r42_11',
    'round42 preset memory realm stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'memory_realm_persistence_latch_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r42_12',
    'round42 preset automation cascade surge stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'automation_synthesis_cascade_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r42_13',
    'round42 preset memory automation fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'memory_automation_wave42_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.52;
    })(),
  );

  {
    const attention = assessUiShellInflationAttentionLatch({
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      wave43ShellAttentionLatch: true,
      playerSaliencePressureBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r43_01',
      'ui latched or attention crisis',
      attention.latchBand === 'latched' || attention.latchBand === 'attention_crisis',
    );
    check(
      'a10_r43_02',
      'ui attention score adj',
      uiShellInflationAttentionLatchScoreAdjustment(attention.latchBand) >= 3,
    );
  }
  {
    const overlay = assessDashboardRegionalInflationOverlaySurge({
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.72,
      wave43HeatmapOverlayLatch: true,
      regionalOverlaySurgeBand: 'surge',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r43_03',
      'dashboard surge or heatmap crisis',
      overlay.surgeBand === 'surge' || overlay.surgeBand === 'heatmap_crisis',
    );
    check(
      'a10_r43_04',
      'dashboard overlay score adj',
      dashboardRegionalInflationOverlaySurgeScoreAdjustment(overlay.surgeBand) >= 3,
    );
  }
  {
    const merged22 = mergeAgent22IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      uiNudgeInflationExpectationsUp: true,
      wave43ShellAttentionLatch: true,
      playerSaliencePressureBand: 'critical',
    });
    check('a10_r43_05', 'agent22 critical latch merge', merged22.highInflationScenario === true);
    check('a10_r43_06', 'agent22 bridge note', agent22UiBridgeIntegrationNote().includes('Agent 22'));
  }
  {
    const merged23 = mergeAgent23IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.7,
      dashboardRefreshUrgency: 'critical',
      wave43HeatmapOverlayLatch: true,
      regionalOverlaySurgeBand: 'surge',
    });
    check('a10_r43_07', 'agent23 surge merge', merged23.highInflationScenario === true);
    check('a10_r43_08', 'agent23 bridge note', agent23DashboardsBridgeIntegrationNote().includes('Agent 23'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r43_09',
      'forecast ui attention and dashboard overlay fields',
      path.points.every(
        (p) => !!p.uiShellInflationAttentionLatchBand && !!p.dashboardRegionalInflationOverlaySurgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r43_10',
      'agent21 r43 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalUiShellInflationAttentionLatch !== undefined &&
        bundle.terminalDashboardRegionalInflationOverlaySurge !== undefined,
    );
  }
  check(
    'a10_r43_11',
    'round43 preset ui shell attention stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'ui_shell_attention_latch_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r43_12',
    'round43 preset dashboard overlay surge stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'dashboard_regional_overlay_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r43_13',
    'round43 preset ui dashboard fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'ui_dashboard_wave43_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.53;
    })(),
  );

  {
    const alert = assessCommandCenterInflationAlertPressureLatch({
      macroAlertLevel: 'red',
      inflationFusionScore: 0.78,
      wave44CommandAlertLatch: true,
      commandAlertPressureBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r44_01',
      'command latched or alert crisis',
      alert.latchBand === 'latched' || alert.latchBand === 'alert_crisis',
    );
    check(
      'a10_r44_02',
      'command alert score adj',
      commandCenterInflationAlertPressureLatchScoreAdjustment(alert.latchBand) >= 3,
    );
  }
  {
    const gridlock = assessTransportFreightInflationGridlockSurge({
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      wave44FreightGridlockLatch: true,
      freightGridlockSurgeBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r44_03',
      'freight surge or gridlock crisis',
      gridlock.surgeBand === 'surge' || gridlock.surgeBand === 'gridlock_crisis',
    );
    check(
      'a10_r44_04',
      'freight gridlock score adj',
      transportFreightInflationGridlockSurgeScoreAdjustment(gridlock.surgeBand) >= 3,
    );
  }
  {
    const merged17 = mergeAgent17IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAlertLevel: 'red',
      inflationFusionScore: 0.75,
      coordinatedTighteningSuggested: true,
      wave44CommandAlertLatch: true,
      commandAlertPressureBand: 'critical',
    });
    check('a10_r44_05', 'agent17 critical latch merge', merged17.highInflationScenario === true);
    check('a10_r44_06', 'agent17 bridge note', agent17CommandBridgeIntegrationNote().includes('Agent 17'));
  }
  {
    const merged12 = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      logisticsInflationScenarioActive: true,
      wave44FreightGridlockLatch: true,
      freightGridlockSurgeBand: 'ruptured',
    });
    check('a10_r44_07', 'agent12 ruptured merge', merged12.highInflationScenario === true);
    check('a10_r44_08', 'agent12 bridge note', agent12TransportBridgeIntegrationNote().includes('Agent 12'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r44_09',
      'forecast command alert and freight gridlock fields',
      path.points.every(
        (p) => !!p.commandCenterInflationAlertPressureLatchBand && !!p.transportFreightInflationGridlockSurgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r44_10',
      'agent21 r44 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalCommandCenterInflationAlertPressureLatch !== undefined &&
        bundle.terminalTransportFreightInflationGridlockSurge !== undefined,
    );
  }
  check(
    'a10_r44_11',
    'round44 preset command alert stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'command_alert_pressure_latch_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r44_12',
    'round44 preset freight gridlock surge stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'transport_freight_gridlock_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r44_13',
    'round44 preset command transport fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'command_transport_wave44_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.54;
    })(),
  );

  {
    const shock = assessEventsNarrativeInflationShockLatch({
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      wave45EventShockLatch: true,
      narrativeShockEntrenchBand: 'entrenched',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r45_01',
      'events latched or shock crisis',
      shock.latchBand === 'latched' || shock.latchBand === 'shock_crisis',
    );
    check(
      'a10_r45_02',
      'events shock score adj',
      eventsNarrativeInflationShockLatchScoreAdjustment(shock.latchBand) >= 3,
    );
  }
  {
    const surge = assessModesSandboxInflationPressureSurge({
      scenarioInflationBias: 'extreme',
      sandboxStressModeActive: true,
      wave45SandboxPressureLatch: true,
      scenarioStressSurgeBand: 'surge',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r45_03',
      'modes surge or sandbox crisis',
      surge.surgeBand === 'surge' || surge.surgeBand === 'sandbox_crisis',
    );
    check(
      'a10_r45_04',
      'modes pressure score adj',
      modesSandboxInflationPressureSurgeScoreAdjustment(surge.surgeBand) >= 3,
    );
  }
  {
    const merged05 = mergeAgent05IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      wave45EventShockLatch: true,
      narrativeShockEntrenchBand: 'entrenched',
    });
    check('a10_r45_05', 'agent05 entrenched merge', merged05.highInflationScenario === true);
    check('a10_r45_06', 'agent05 bridge note', agent05EventsBridgeIntegrationNote().includes('Agent 05'));
  }
  {
    const merged04 = mergeAgent04IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      scenarioInflationBias: 'extreme',
      sandboxStressModeActive: true,
      difficultyCostMultiplier: 1.15,
      wave45SandboxPressureLatch: true,
      scenarioStressSurgeBand: 'surge',
    });
    check('a10_r45_07', 'agent04 surge merge', merged04.highInflationScenario === true);
    check('a10_r45_08', 'agent04 bridge note', agent04ModesBridgeIntegrationNote().includes('Agent 04'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r45_09',
      'forecast events shock and modes pressure fields',
      path.points.every(
        (p) => !!p.eventsNarrativeInflationShockLatchBand && !!p.modesSandboxInflationPressureSurgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r45_10',
      'agent21 r45 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalEventsNarrativeInflationShockLatch !== undefined &&
        bundle.terminalModesSandboxInflationPressureSurge !== undefined,
    );
  }
  check(
    'a10_r45_11',
    'round45 preset events narrative stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'events_narrative_shock_latch_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r45_12',
    'round45 preset modes pressure surge stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'modes_sandbox_pressure_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r45_13',
    'round45 preset events modes fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'events_modes_wave45_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.55;
    })(),
  );

  {
    const pressure = assessFiscalConsolidatedInflationPressureLatch({
      consolidatedDeficitBand: 'large_deficit',
      debtServicePressure: 'critical',
      wave46FiscalPressureLatch: true,
      consolidatedDeficitEscalationBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r46_01',
      'fiscal latched or fiscal crisis',
      pressure.latchBand === 'latched' || pressure.latchBand === 'fiscal_crisis',
    );
    check(
      'a10_r46_02',
      'fiscal consolidated score adj',
      fiscalConsolidatedInflationPressureLatchScoreAdjustment(pressure.latchBand) >= 3,
    );
  }
  {
    const surge = assessHouseholdWageInflationStressSurge({
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      wave46HouseholdStressLatch: true,
      wageStressSurgeBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r46_03',
      'household surge or wage crisis',
      surge.surgeBand === 'surge' || surge.surgeBand === 'wage_crisis',
    );
    check(
      'a10_r46_04',
      'household wage score adj',
      householdWageInflationStressSurgeScoreAdjustment(surge.surgeBand) >= 3,
    );
  }
  {
    const merged07 = mergeAgent07IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consolidatedDeficitBand: 'large_deficit',
      revenueMomentum: 'weak',
      debtServicePressure: 'critical',
      wave46FiscalPressureLatch: true,
      consolidatedDeficitEscalationBand: 'critical',
    });
    check('a10_r46_05', 'agent07 critical latch merge', merged07.highInflationScenario === true);
    check('a10_r46_06', 'agent07 bridge note', agent07FiscalBridgeIntegrationNote().includes('Agent 07'));
  }
  {
    const merged09 = mergeAgent09IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      laborParticipationBand: 'steady',
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      wave46HouseholdStressLatch: true,
      wageStressSurgeBand: 'ruptured',
    });
    check('a10_r46_07', 'agent09 ruptured merge', merged09.highInflationScenario === true);
    check('a10_r46_08', 'agent09 bridge note', agent09HouseholdBridgeIntegrationNote().includes('Agent 09'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r46_09',
      'forecast fiscal consolidated and household wage fields',
      path.points.every(
        (p) =>
          !!p.fiscalConsolidatedInflationPressureLatchBand && !!p.householdWageInflationStressSurgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r46_10',
      'agent21 r46 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalFiscalConsolidatedInflationPressureLatch !== undefined &&
        bundle.terminalHouseholdWageInflationStressSurge !== undefined,
    );
  }
  check(
    'a10_r46_11',
    'round46 preset fiscal consolidated stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'fiscal_consolidated_pressure_latch_stack',
      );
      return inp?.highInflationScenario === true && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r46_12',
    'round46 preset household wage stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'household_wage_stress_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r46_13',
    'round46 preset fiscal household fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'fiscal_household_wave46_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.56;
    })(),
  );

  {
    const latch = assessMacroOutputGapInflationPressureLatch({
      gdpGrowthBand: 'strong',
      outputGap: 0.5,
      wave47MacroOutputGapLatch: true,
      outputGapEscalationBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r47_01',
      'macro latched or overheat crisis',
      latch.latchBand === 'latched' || latch.latchBand === 'overheat_crisis',
    );
    check(
      'a10_r47_02',
      'macro output gap score adj',
      macroOutputGapInflationPressureLatchScoreAdjustment(latch.latchBand) >= 3,
    );
  }
  {
    const surge = assessCorporateCapacityMarkupInflationSurge({
      pricingPowerBand: 'dominant',
      marginCompression: 'none',
      wave47CorporateCapacityLatch: true,
      capacityMarkupSurgeBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r47_03',
      'corporate surge or capacity crisis',
      surge.surgeBand === 'surge' || surge.surgeBand === 'capacity_crisis',
    );
    check(
      'a10_r47_04',
      'corporate capacity score adj',
      corporateCapacityMarkupInflationSurgeScoreAdjustment(surge.surgeBand) >= 3,
    );
  }
  {
    const merged06 = mergeAgent06IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      gdpGrowthBand: 'strong',
      unemploymentBand: 'moderate',
      outputGap: 0.5,
      nominalDemandPressure: 0.6,
      wave47MacroOutputGapLatch: true,
      outputGapEscalationBand: 'critical',
    });
    check('a10_r47_05', 'agent06 critical latch merge', merged06.highInflationScenario === true);
    check('a10_r47_06', 'agent06 bridge note', agent06BridgeIntegrationNote().includes('Agent 06'));
  }
  {
    const merged08 = mergeAgent08IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      pricingPowerBand: 'dominant',
      marginCompression: 'none',
      passThroughIntent: 'full',
      wave47CorporateCapacityLatch: true,
      capacityMarkupSurgeBand: 'ruptured',
    });
    check('a10_r47_07', 'agent08 ruptured merge', merged08.highInflationScenario === true);
    check('a10_r47_08', 'agent08 bridge note', agent08CorporateBridgeIntegrationNote().includes('Agent 08'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r47_09',
      'forecast macro output gap and corporate capacity fields',
      path.points.every(
        (p) =>
          !!p.macroOutputGapInflationPressureLatchBand && !!p.corporateCapacityMarkupInflationSurgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r47_10',
      'agent21 r47 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalMacroOutputGapInflationPressureLatch !== undefined &&
        bundle.terminalCorporateCapacityMarkupInflationSurge !== undefined,
    );
  }
  check(
    'a10_r47_11',
    'round47 preset macro output gap stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'macro_output_gap_latch_stack',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.5;
    })(),
  );
  check(
    'a10_r47_12',
    'round47 preset corporate capacity stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'corporate_capacity_markup_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r47_13',
    'round47 preset macro corporate fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'macro_corporate_wave47_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.57;
    })(),
  );

  {
    const latch = assessResearchBreakthroughSupplySideInflationLatch({
      productivityGainBand: 'flat',
      supplySideReliefActive: false,
      wave48ResearchBreakthroughLatch: true,
      researchSupplySideFailureBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r48_01',
      'research building or breakthrough failure',
      latch.latchBand === 'building' || latch.latchBand === 'breakthrough_failure',
    );
    check(
      'a10_r48_02',
      'research breakthrough score adj',
      researchBreakthroughSupplySideInflationLatchScoreAdjustment(latch.latchBand) >= 3,
    );
  }
  {
    const surge = assessTradeImportExchangeInflationPipelineSurge({
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      wave48TradeImportPipelineLatch: true,
      importExchangePipelineSurgeBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r48_03',
      'trade surge or pipeline crisis',
      surge.surgeBand === 'surge' || surge.surgeBand === 'pipeline_crisis',
    );
    check(
      'a10_r48_04',
      'trade import pipeline score adj',
      tradeImportExchangeInflationPipelineSurgeScoreAdjustment(surge.surgeBand) >= 3,
    );
  }
  {
    const merged03 = mergeAgent03IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      productivityGainBand: 'flat',
      supplySideReliefActive: false,
      innovationInflationOffsetScore: 0.2,
      wave48ResearchBreakthroughLatch: true,
      researchSupplySideFailureBand: 'critical',
    });
    check('a10_r48_05', 'agent03 critical latch merge', merged03.highInflationScenario === true);
    check('a10_r48_06', 'agent03 bridge note', agent03ResearchBridgeIntegrationNote().includes('Agent 03'));
  }
  {
    const merged15 = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.5,
      wave48TradeImportPipelineLatch: true,
      importExchangePipelineSurgeBand: 'ruptured',
    });
    check('a10_r48_07', 'agent15 ruptured merge', merged15.highInflationScenario === true);
    check('a10_r48_08', 'agent15 bridge note', agent15TradeBridgeIntegrationNote().includes('Agent 15'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r48_09',
      'forecast research breakthrough and trade pipeline fields',
      path.points.every(
        (p) =>
          !!p.researchBreakthroughSupplySideInflationLatchBand &&
          !!p.tradeImportExchangeInflationPipelineSurgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r48_10',
      'agent21 r48 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalResearchBreakthroughSupplySideInflationLatch !== undefined &&
        bundle.terminalTradeImportExchangeInflationPipelineSurge !== undefined,
    );
  }
  check(
    'a10_r48_11',
    'round48 preset research breakthrough stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'research_breakthrough_supply_latch_stack',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.51;
    })(),
  );
  check(
    'a10_r48_12',
    'round48 preset trade import pipeline stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'trade_import_exchange_pipeline_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r48_13',
    'round48 preset research trade fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'research_trade_wave48_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.58;
    })(),
  );

  {
    const latch = assessMetroRegionalRentInflationEscalationLatch({
      rentGrowthBand: 'surging',
      regionalDispersionScore: 0.62,
      wave49MetroRegionalRentLatch: true,
      regionalRentEscalationBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r49_01',
      'metro escalated or regional crisis',
      latch.latchBand === 'escalated' || latch.latchBand === 'regional_crisis',
    );
    check(
      'a10_r49_02',
      'metro regional rent score adj',
      metroRegionalRentInflationEscalationLatchScoreAdjustment(latch.latchBand) >= 3,
    );
  }
  {
    const surge = assessWholesaleGridTransitionInflationSurge({
      wholesaleEnergyStress: 'crisis',
      emissionsTransitionCostBand: 'high',
      wave49GridTransitionSurgeLatch: true,
      gridTransitionStressBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r49_03',
      'grid surge or transition crisis',
      surge.surgeBand === 'surge' || surge.surgeBand === 'transition_crisis',
    );
    check(
      'a10_r49_04',
      'wholesale grid transition score adj',
      wholesaleGridTransitionInflationSurgeScoreAdjustment(surge.surgeBand) >= 3,
    );
  }
  {
    const merged11 = mergeAgent11IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.65,
      wave49MetroRegionalRentLatch: true,
      regionalRentEscalationBand: 'critical',
    });
    check('a10_r49_05', 'agent11 critical latch merge', merged11.highInflationScenario === true);
    check('a10_r49_06', 'agent11 bridge note', agent11CitiesBridgeIntegrationNote().includes('Agent 11'));
  }
  {
    const merged13 = mergeAgent13IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'high',
      wave49GridTransitionSurgeLatch: true,
      gridTransitionStressBand: 'ruptured',
    });
    check('a10_r49_07', 'agent13 ruptured merge', merged13.highInflationScenario === true);
    check('a10_r49_08', 'agent13 bridge note', agent13EnergyBridgeIntegrationNote().includes('Agent 13'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r49_09',
      'forecast metro regional and grid transition fields',
      path.points.every(
        (p) =>
          !!p.metroRegionalRentInflationEscalationLatchBand &&
          !!p.wholesaleGridTransitionInflationSurgeBand &&
          !!p.tradeClearedForwardArcInflationHandoffLatchBand &&
          !!p.guardianEntrustmentEnvelopeInflationPressureSurgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r49_10',
      'agent21 r49 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalMetroRegionalRentInflationEscalationLatch !== undefined &&
        bundle.terminalWholesaleGridTransitionInflationSurge !== undefined &&
        bundle.terminalTradeClearedForwardArcInflationHandoffLatch !== undefined &&
        bundle.terminalGuardianEntrustmentEnvelopeInflationPressureSurge !== undefined,
    );
  }
  {
    const handoff = assessTradeClearedForwardArcInflationHandoffLatch({
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      wave49ClearedForwardArcHandoffLatch: true,
      clearedForwardArcHandoffContinuityBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r49_14',
      'trade handoff stress or continuity rupture',
      handoff.latchBand === 'handoff_stress' || handoff.latchBand === 'continuity_rupture',
    );
    check(
      'a10_r49_15',
      'trade cleared forward-arc score adj',
      tradeClearedForwardArcInflationHandoffLatchScoreAdjustment(handoff.latchBand) >= 3,
    );
  }
  {
    const envelope = assessGuardianEntrustmentEnvelopeInflationPressureSurge({
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      wave49EntrustmentEnvelopeLatch: true,
      entrustmentEnvelopePressureBand: 'ruptured',
      entrustmentStrainIndex: 0.8,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r49_16',
      'guardian surge or envelope rupture',
      envelope.surgeBand === 'surge' || envelope.surgeBand === 'envelope_rupture',
    );
    check(
      'a10_r49_17',
      'guardian entrustment envelope score adj',
      guardianEntrustmentEnvelopeInflationPressureSurgeScoreAdjustment(envelope.surgeBand) >= 3,
    );
  }
  {
    const merged15 = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.5,
      wave49ClearedForwardArcHandoffLatch: true,
      clearedForwardArcHandoffContinuityBand: 'ruptured',
    });
    check('a10_r49_18', 'agent15 ruptured handoff merge', merged15.highInflationScenario === true);
    check('a10_r49_19', 'agent15 bridge note r49', agent15TradeBridgeIntegrationNote().includes('Agent 15'));
  }
  {
    const merged16 = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
      wave49EntrustmentEnvelopeLatch: true,
      entrustmentEnvelopePressureBand: 'ruptured',
      entrustmentStrainIndex: 0.75,
    });
    check('a10_r49_20', 'agent16 ruptured envelope merge', merged16.highInflationScenario === true);
    check('a10_r49_21', 'agent16 bridge note r49', agent16GuardianBridgeIntegrationNote().includes('Agent 16'));
  }
  check(
    'a10_r49_22',
    'round49 preset trade cleared forward-arc stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'trade_cleared_forward_arc_handoff_stack',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.52;
    })(),
  );
  check(
    'a10_r49_23',
    'round49 preset guardian entrustment stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'guardian_entrustment_envelope_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r49_24',
    'round49 preset trade guardian fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'trade_guardian_wave49_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.6;
    })(),
  );
  check(
    'a10_r49_11',
    'round49 preset metro regional rent stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'metro_regional_rent_escalation_latch_stack',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.52;
    })(),
  );
  check(
    'a10_r49_12',
    'round49 preset wholesale grid transition stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'wholesale_grid_transition_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r49_13',
    'round49 preset metro grid fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'metro_grid_wave49_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.59;
    })(),
  );

  {
    const latch = assessHousingWellbeingMortgageInflationEscalationLatch({
      mortgageStressBand: 'severe',
      wellbeingCostBand: 'critical',
      wave50HousingWellbeingEscalationLatch: true,
      mortgageWellbeingEscalationBand: 'acute',
      essentialServicesInflationFlag: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r50_01',
      'housing escalated or essential crisis',
      latch.latchBand === 'escalated' || latch.latchBand === 'essential_crisis',
    );
    check(
      'a10_r50_02',
      'housing wellbeing mortgage score adj',
      housingWellbeingMortgageInflationEscalationLatchScoreAdjustment(latch.latchBand) >= 3,
    );
  }
  {
    const surge = assessTransportCorridorFreightInflationSurgeLatch({
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      wave50FreightCorridorSurgeLatch: true,
      corridorFreightSurgeBand: 'ruptured',
      portBacklogBand: 'severe',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r50_03',
      'corridor surge or rupture',
      surge.surgeBand === 'surge' || surge.surgeBand === 'corridor_rupture',
    );
    check(
      'a10_r50_04',
      'transport corridor freight score adj',
      transportCorridorFreightInflationSurgeLatchScoreAdjustment(surge.surgeBand) >= 3,
    );
  }
  {
    const merged14 = mergeAgent14IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      mortgageStressBand: 'severe',
      wellbeingCostBand: 'critical',
      essentialServicesInflationFlag: true,
      wave50HousingWellbeingEscalationLatch: true,
      mortgageWellbeingEscalationBand: 'acute',
    });
    check('a10_r50_05', 'agent14 acute latch merge', merged14.highInflationScenario === true);
    check('a10_r50_06', 'agent14 bridge note r50', agent14HousingBridgeIntegrationNote().includes('Agent 14'));
  }
  {
    const merged12 = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      logisticsInflationScenarioActive: true,
      wave50FreightCorridorSurgeLatch: true,
      corridorFreightSurgeBand: 'ruptured',
    });
    check('a10_r50_07', 'agent12 ruptured corridor merge', merged12.highInflationScenario === true);
    check('a10_r50_08', 'agent12 bridge note r50', agent12TransportBridgeIntegrationNote().includes('Agent 12'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r50_09',
      'forecast housing mortgage and corridor freight fields',
      path.points.every(
        (p) =>
          !!p.housingWellbeingMortgageInflationEscalationLatchBand &&
          !!p.transportCorridorFreightInflationSurgeLatchBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r50_10',
      'agent21 r50 fields',
      bundle.schemaVersion === '10.14.agent10.r50' &&
        bundle.terminalHousingWellbeingMortgageInflationEscalationLatch !== undefined &&
        bundle.terminalTransportCorridorFreightInflationSurgeLatch !== undefined,
    );
  }
  check(
    'a10_r50_11',
    'round50 preset housing wellbeing mortgage stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'housing_wellbeing_mortgage_escalation_latch_stack',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.53;
    })(),
  );
  check(
    'a10_r50_12',
    'round50 preset transport corridor freight stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'transport_corridor_freight_surge_stress',
      );
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r50_13',
    'round50 preset housing transport fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'housing_transport_wave50_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.6;
    })(),
  );

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, results };
}


// --- source: react/FinanceConditionsLab.tsx ---

export interface FinanceConditionsLabProps {
  state: NationalMacroFinancialState | null;
  title?: string;
}

/** Lightweight inspector panel for macro-financial bands (Agent 10 / Operation 10M). */
export function FinanceConditionsLab(props: FinanceConditionsLabProps) {
  const { state, title = 'Macro financial conditions' } = props;
  if (!state) {
    return (
      <div className="op10m-finance-lab op10m-finance-lab--empty" data-testid="finance-conditions-lab">
        <h4>{title}</h4>
        <p>Macro financial layer inactive.</p>
      </div>
    );
  }
  const m = state.modifiers;
  return (
    <div className="op10m-finance-lab" data-testid="finance-conditions-lab">
      <h4>{title}</h4>
      <p>{state.summary}</p>
      <ul>
        <li>Inflation: {V1014_FINSTAB_INFLATION_LABEL[state.inflation]}</li>
        <li>Credit: {V1014_FINSTAB_CREDIT_LABEL[state.credit]}</li>
        <li>Stability: {V1014_FINSTAB_STABILITY_LABEL[state.stability]}</li>
        <li>Stance: {state.stance.replace(/_/g, ' ')}</li>
        <li>Cost-of-living ×{m.costOfLivingMultiplier.toFixed(2)}</li>
        <li>Credit spread ×{m.creditSpreadMultiplier.toFixed(2)}</li>
        <li>Loan affordability {m.loanAffordabilityIndex.toFixed(0)}/100</li>
      </ul>
      {state.pressures.length > 0 && (
        <section>
          <strong>Pressures</strong>
          <ul>
            {state.pressures.map((p) => (
              <li key={p.id}>
                {p.domain}: {p.explanation}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}


// --- source: react/FinanceTransmissionPanel.tsx ---

export interface FinanceTransmissionPanelProps {
  inputs: MacroFinancialSystemInputs;
  title?: string;
}

export function FinanceTransmissionPanel(props: FinanceTransmissionPanelProps) {
  const { inputs, title = 'Policy transmission' } = props;
  const hits = evaluatePolicyTransmissionChannels(inputs);
  const active = hits.filter((h) => h.active);
  return (
    <div className="op10m-finance-transmission" data-testid="finance-transmission-panel">
      <h4>{title}</h4>
      <p>
        {active.length} / {hits.length} channels active
      </p>
      <ul>
        {active.slice(0, 8).map((h) => (
          <li key={h.id}>
            {h.sourceDomain} → {h.targetDomain} (w={h.weight.toFixed(2)}): {h.activationReason}
          </li>
        ))}
      </ul>
    </div>
  );
}


// --- source: react/InflationDiagnosticsPanel.tsx ---

export interface InflationDiagnosticsPanelProps {
  state: NationalMacroFinancialState;
  inflationScore: number;
  creditScore: number;
  turn: number;
  householdAffordability?: 'healthy' | 'strained' | 'severe_pressure' | null;
  fiscalPressure?: 'healthy' | 'tight' | 'strained' | 'critical' | null;
}

export function InflationDiagnosticsPanel(props: InflationDiagnosticsPanelProps) {
  const { state, inflationScore, creditScore, turn } = props;
  const cpi = decomposeMacroCpiBasket(state.inflation, turn, 0);
  const spiral = assessWagePriceSpiral({
    inflationBand: state.inflation,
    householdAffordability: props.householdAffordability,
    fiscalPressure: props.fiscalPressure,
    turn,
  });
  const stance = recommendMonetaryStance({
    inflationBand: state.inflation,
    creditBand: state.credit,
    inflationScore,
    creditScore,
  });
  const expectations = stepInflationExpectations({
    currentBand: state.inflation,
    priorAnchoringScore: initialInflationAnchoringScore(),
    fiscalPressure: props.fiscalPressure,
    turn,
  });

  return (
    <div className="op10m-inflation-diagnostics" data-testid="inflation-diagnostics-panel">
      <h4>Inflation diagnostics (macro CPI)</h4>
      <p>
        Headline index {cpi.headlineIndex.toFixed(1)} · services {Math.round(cpi.servicesShare * 100)}% · spiral{' '}
        {spiral.spiralRisk}
      </p>
      <p>
        Recommended stance {stance.recommendedStance} · anchoring {expectations.anchoringScore.toFixed(0)} (
        {expectations.deanchoringRisk})
      </p>
      <ul>
        {cpi.categories.slice(0, 4).map((c) => (
          <li key={c.categoryId}>
            {c.label}: {c.contribution.toFixed(2)} ({c.band})
          </li>
        ))}
      </ul>
    </div>
  );
}


// --- source: react/InflationRegimePanel.tsx ---
  stepInflationRegimeTracker,
  createInitialInflationRegimeTracker,
  inflationRegimePersistenceHalfLifeTurns,
} from '../integration/inflation-regime-tracker.js';

export interface InflationRegimePanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  inflationScore: number;
  agent06?: Agent06MacroSnapshot | null;
}

export function InflationRegimePanel(props: InflationRegimePanelProps) {
  const tracker = stepInflationRegimeTracker(createInitialInflationRegimeTracker(), props.inputs.turn, props.state.inflation, {
    creditStressed: props.state.credit === 'restricted' || props.state.credit === 'frozen',
    fiscalCritical: props.inputs.fiscalPressure === 'critical',
  });
  const snap = tracker.history[tracker.history.length - 1];
  const shock = classifyInflationShockDrivers(props.state.inflation, props.inputs, props.agent06 ?? null);
  const fiscal = assessFiscalDominance(props.inputs);
  const target = assessInflationTargetBreach(props.inflationScore);
  const halfLife = inflationRegimePersistenceHalfLifeTurns(tracker.persistenceScore);

  return (
    <div className="op10m-inflation-regime" data-testid="inflation-regime-panel">
      <h4>Inflation regime (round 5)</h4>
      <p>
        Regime {snap?.regime ?? 'anchored_soft'} · persistence {tracker.persistenceScore.toFixed(0)} · half-life ~
        {halfLife.toFixed(1)} turns
      </p>
      <p>
        Driver {shock.driver} ({shock.confidence}) · fiscal dominance {fiscal.band} · target breach{' '}
        {target.breachSeverity}
      </p>
      <p>{shock.summary}</p>
    </div>
  );
}


// --- source: react/InflationMomentumPanel.tsx ---
  createInitialInflationMomentumState,
  stepInflationMomentum,
} from '../inflation/inflation-momentum.js';

export interface InflationMomentumPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  inflationScore: number;
  agent07?: Agent07FiscalSnapshot | null;
  agent09?: Agent09HouseholdSnapshot | null;
}

export function InflationMomentumPanel(props: InflationMomentumPanelProps) {
  const { snapshot } = stepInflationMomentum(
    createInitialInflationMomentumState(),
    props.inputs.turn,
    props.state.inflation,
  );
  const sacrifice = estimateDisinflationSacrifice(props.state.inflation, props.inflationScore, snapshot);
  const realGap = assessRealRateGap(props.inflationScore, props.state.stance, props.state.inflation);
  const feedback = assessCreditInflationFeedback(
    props.state.inflation,
    props.state.credit,
    props.inputs.creditShockActive,
  );

  return (
    <div className="op10m-inflation-momentum" data-testid="inflation-momentum-panel">
      <h4>Inflation momentum (round 6)</h4>
      <p>
        Momentum {snapshot.momentumScore.toFixed(0)} · {snapshot.direction} · real rate gap {realGap.gapBand}
      </p>
      <p>
        Credit–inflation {feedback.feedbackLoop} · sacrifice ratio {sacrifice.sacrificeRatio.toFixed(2)} (
        {sacrifice.outputCostBand})
      </p>
      <p>{realGap.narrative}</p>
      {(props.agent07 || props.agent09) && (
        <p data-testid="inflation-momentum-bridges">
          Bridges: {props.agent07 ? 'Agent07 fiscal' : ''}
          {props.agent07 && props.agent09 ? ' · ' : ''}
          {props.agent09 ? 'Agent09 household' : ''}
        </p>
      )}
    </div>
  );
}


// --- source: react/ImportInflationPanel.tsx ---
  assessImportPricePassThrough,
  importPassThroughInflationScoreAdjustment,
} from '../inflation/import-price-pass-through.js';

export interface ImportInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent15?: Agent15TradeSnapshot | null;
  agent08?: Agent08CorporateSnapshot | null;
}

export function ImportInflationPanel(props: ImportInflationPanelProps) {
  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'mixed' as const,
    exchangeRatePressure: 'stable' as const,
    commodityImportShare: 0.28,
  };

  const imports = assessImportPricePassThrough({
    tradeOpennessBand: trade.tradeOpennessBand,
    exchangeRatePressure: trade.exchangeRatePressure,
    commodityImportShare: trade.commodityImportShare,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const term = assessTermPremiumInflationSignal({
    inflationBand: props.state.inflation,
    fiscalPressure: props.inputs.fiscalPressure,
    sovereignDebtPressure: props.inputs.sovereignDebtPressure,
    highInflationScenario: props.inputs.highInflationScenario,
  });

  const corpNote =
    props.agent08?.pricingPowerBand === 'dominant' || props.agent08?.passThroughIntent === 'full'
      ? 'Corporate pass-through elevated'
      : 'Corporate pass-through moderate';

  return (
    <div className="op10m-import-inflation" data-testid="import-inflation-panel">
      <h4>Import & term premium (round 7)</h4>
      <p>
        Import pass-through {imports.passThroughBand} · index {imports.importCostIndex.toFixed(0)} · score adj{' '}
        {importPassThroughInflationScoreAdjustment(imports.passThroughBand)}
      </p>
      <p>
        Term premium {term.premiumBps} bps · {term.signalBand}
      </p>
      <p>{imports.narrative}</p>
      <p data-testid="import-inflation-corp">{corpNote}</p>
    </div>
  );
}


// --- source: react/UrbanEnergyInflationPanel.tsx ---
  assessEnergyPricePassThrough,
  energyPassThroughInflationScoreAdjustment,
} from '../inflation/energy-price-pass-through.js';
  assessShelterRentInflation,
  shelterRentInflationScoreAdjustment,
} from '../inflation/shelter-rent-inflation.js';

export interface UrbanEnergyInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent11?: Agent11CitiesSnapshot | null;
  agent13?: Agent13EnergySnapshot | null;
}

export function UrbanEnergyInflationPanel(props: UrbanEnergyInflationPanelProps) {
  const cities = props.agent11 ?? {
    turn: props.inputs.turn,
    vacancyBand: 'tight' as const,
    rentGrowthBand: 'moderate' as const,
    urbanizationPressure: 'medium' as const,
    regionalDispersionScore: 0.4,
  };

  const energy = props.agent13 ?? {
    turn: props.inputs.turn,
    wholesaleEnergyStress: 'elevated' as const,
    retailTariffShock: props.inputs.fiscalPressure === 'critical',
    gridReliabilityBand: 'strained' as const,
    emissionsTransitionCostBand: 'medium' as const,
  };

  const shelter = assessShelterRentInflation({
    vacancyBand: cities.vacancyBand,
    rentGrowthBand: cities.rentGrowthBand,
    urbanizationPressure: cities.urbanizationPressure,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const energyPass = assessEnergyPricePassThrough({
    wholesaleEnergyStress: energy.wholesaleEnergyStress,
    retailTariffShock: energy.retailTariffShock,
    gridReliabilityBand: energy.gridReliabilityBand,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-urban-energy-inflation" data-testid="urban-energy-inflation-panel">
      <h4>Urban shelter & energy (round 8)</h4>
      <p>
        Shelter {shelter.pressureBand} · index {shelter.shelterIndex.toFixed(0)} · score adj{' '}
        {shelterRentInflationScoreAdjustment(shelter.pressureBand)}
      </p>
      <p>
        Energy {energyPass.passThroughBand} · index {energyPass.energyCostIndex.toFixed(0)} · score adj{' '}
        {energyPassThroughInflationScoreAdjustment(energyPass.passThroughBand)}
      </p>
      <p>{shelter.narrative}</p>
      <p data-testid="urban-energy-energy-note">{energyPass.narrative}</p>
    </div>
  );
}


// --- source: react/TransportFoodInflationPanel.tsx ---
  assessFoodGroceryPassThrough,
  foodGroceryPassThroughInflationScoreAdjustment,
} from '../inflation/food-grocery-pass-through.js';
  assessTransportLogisticsInflation,
  transportLogisticsInflationScoreAdjustment,
} from '../inflation/transport-logistics-inflation.js';

export interface TransportFoodInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent14?: Agent14HousingSnapshot | null;
  agent12?: Agent12TransportSnapshot | null;
}

export function TransportFoodInflationPanel(props: TransportFoodInflationPanelProps) {
  const housing = props.agent14 ?? {
    turn: props.inputs.turn,
    mortgageStressBand: 'elevated' as const,
    wellbeingCostBand: 'strained' as const,
    essentialServicesInflationFlag: props.inputs.householdInflationScenarioActive,
  };

  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: 'tight' as const,
    fuelSurchargeActive: props.inputs.highInflationScenario,
    portBacklogBand: 'moderate' as const,
    logisticsInflationScenarioActive: props.inputs.highInflationScenario,
  };

  const food = assessFoodGroceryPassThrough({
    harvestStressBand: props.inputs.fiscalPressure === 'critical' ? 'severe' : 'weak',
    retailMarginPressure: housing.wellbeingCostBand === 'critical' ? 'high' : 'medium',
    supplyChainDisruption: transport.portBacklogBand === 'severe' || transport.freightCapacityBand === 'critical',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const logistics = assessTransportLogisticsInflation({
    freightCapacityBand: transport.freightCapacityBand,
    fuelSurchargeActive: transport.fuelSurchargeActive,
    portBacklogBand: transport.portBacklogBand,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-transport-food-inflation" data-testid="transport-food-inflation-panel">
      <h4>Food, transport & wellbeing (round 9)</h4>
      <p>
        Grocery {food.passThroughBand} · index {food.groceryIndex.toFixed(0)} · score adj{' '}
        {foodGroceryPassThroughInflationScoreAdjustment(food.passThroughBand)}
      </p>
      <p>
        Logistics {logistics.pressureBand} · index {logistics.freightIndex.toFixed(0)} · score adj{' '}
        {transportLogisticsInflationScoreAdjustment(logistics.pressureBand)}
      </p>
      <p data-testid="transport-food-food-note">{food.narrative}</p>
      <p>{logistics.narrative}</p>
    </div>
  );
}


// --- source: react/HealthcareInsuranceInflationPanel.tsx ---
  assessHealthcareServicesInflation,
  healthcareServicesInflationScoreAdjustment,
} from '../inflation/healthcare-services-inflation.js';
  assessInsurancePremiumPassThrough,
  insurancePremiumPassThroughInflationScoreAdjustment,
} from '../inflation/insurance-premium-pass-through.js';

export interface HealthcareInsuranceInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent03?: Agent03ResearchSnapshot | null;
  agent05?: Agent05EventsSnapshot | null;
}

export function HealthcareInsuranceInflationPanel(props: HealthcareInsuranceInflationPanelProps) {
  const research = props.agent03 ?? {
    turn: props.inputs.turn,
    productivityGainBand: 'moderate' as const,
    supplySideReliefActive: !props.inputs.highInflationScenario,
    innovationInflationOffsetScore: 0.35,
  };

  const events = props.agent05 ?? {
    turn: props.inputs.turn,
    inflationShockEventActive: props.inputs.highInflationScenario,
    supplyDisruptionSeverity: props.inputs.creditShockActive ? ('national' as const) : ('localized' as const),
    confidenceShockBand: props.inputs.publicStability < 45 ? ('severe' as const) : ('uneasy' as const),
  };

  const healthcare = assessHealthcareServicesInflation({
    wagePressureBand:
      events.inflationShockEventActive && events.supplyDisruptionSeverity === 'national'
        ? 'acute'
        : props.inputs.fiscalPressure === 'critical'
          ? 'high'
          : 'moderate',
    demandSurgeActive: events.inflationShockEventActive,
    workforceShortageBand: research.productivityGainBand === 'flat' ? 'severe' : 'moderate',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const insurance = assessInsurancePremiumPassThrough({
    claimsInflationBand: events.supplyDisruptionSeverity === 'national' ? 'extreme' : 'high',
    reinsuranceStress: props.inputs.fiscalPressure === 'critical',
    catastropheLoadActive: events.confidenceShockBand === 'severe',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-healthcare-insurance-inflation" data-testid="healthcare-insurance-inflation-panel">
      <h4>Healthcare, insurance & events (round 10)</h4>
      <p>
        Healthcare {healthcare.pressureBand} · index {healthcare.servicesIndex.toFixed(0)} · score adj{' '}
        {healthcareServicesInflationScoreAdjustment(healthcare.pressureBand)}
      </p>
      <p>
        Insurance {insurance.passThroughBand} · index {insurance.premiumIndex.toFixed(0)} · score adj{' '}
        {insurancePremiumPassThroughInflationScoreAdjustment(insurance.passThroughBand)}
      </p>
      <p data-testid="healthcare-insurance-care-note">{healthcare.narrative}</p>
      <p>{insurance.narrative}</p>
    </div>
  );
}


// --- source: react/EducationCommunicationsInflationPanel.tsx ---
  assessEducationTuitionInflation,
  educationTuitionInflationScoreAdjustment,
} from '../inflation/education-tuition-inflation.js';
  assessCommunicationsServicesInflation,
  communicationsServicesInflationScoreAdjustment,
} from '../inflation/communications-services-inflation.js';

export interface EducationCommunicationsInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent04?: Agent04ModesSnapshot | null;
  agent16?: Agent16GuardianSnapshot | null;
}

export function EducationCommunicationsInflationPanel(props: EducationCommunicationsInflationPanelProps) {
  const modes = props.agent04 ?? {
    turn: props.inputs.turn,
    scenarioInflationBias: props.inputs.highInflationScenario ? ('inflationary' as const) : ('neutral' as const),
    sandboxStressModeActive: false,
    difficultyCostMultiplier: 1.05,
  };

  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand: props.inputs.publicStability < 42 ? ('urgent' as const) : ('advisory' as const),
    narrativeShockSeverity: props.inputs.fiscalPressure === 'critical' ? ('high' as const) : ('medium' as const),
  };

  const education = assessEducationTuitionInflation({
    enrollmentPressureBand: modes.scenarioInflationBias === 'extreme' ? 'high' : 'moderate',
    subsidyCutActive: props.inputs.fiscalPressure === 'critical',
    wageIndexationBand: guardian.inflationGuardrailTripped ? 'strong' : 'normal',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const comms = assessCommunicationsServicesInflation({
    bandwidthDemandBand: modes.sandboxStressModeActive ? 'surge' : 'normal',
    regulatedTariffShock: guardian.stabilityInterventionBand === 'urgent',
    platformFeePassThrough: modes.scenarioInflationBias === 'inflationary' ? 'high' : 'medium',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-education-comms-inflation" data-testid="education-comms-inflation-panel">
      <h4>Education, comms & modes (round 11)</h4>
      <p>
        Education {education.pressureBand} · index {education.tuitionIndex.toFixed(0)} · score adj{' '}
        {educationTuitionInflationScoreAdjustment(education.pressureBand)}
      </p>
      <p>
        Comms {comms.pressureBand} · index {comms.commsIndex.toFixed(0)} · score adj{' '}
        {communicationsServicesInflationScoreAdjustment(comms.pressureBand)}
      </p>
      <p data-testid="education-comms-edu-note">{education.narrative}</p>
      <p>{comms.narrative}</p>
    </div>
  );
}


// --- source: react/RecreationProfessionalInflationPanel.tsx ---
  assessRecreationLeisureInflation,
  recreationLeisureInflationScoreAdjustment,
} from '../inflation/recreation-leisure-inflation.js';
  assessProfessionalServicesFeeInflation,
  professionalServicesFeeInflationScoreAdjustment,
} from '../inflation/professional-services-fee-inflation.js';

export interface RecreationProfessionalInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent17?: Agent17CommandSnapshot | null;
  agent18?: Agent18TeamSnapshot | null;
}

export function RecreationProfessionalInflationPanel(props: RecreationProfessionalInflationPanelProps) {
  const command = props.agent17 ?? {
    turn: props.inputs.turn,
    macroAlertLevel: props.inputs.highInflationScenario ? ('red' as const) : ('amber' as const),
    inflationFusionScore: 0.55,
    coordinatedTighteningSuggested: props.inputs.fiscalPressure === 'critical',
  };

  const team = props.agent18 ?? {
    turn: props.inputs.turn,
    consensusInflationOutlook: props.inputs.highInflationScenario ? ('reacceleration' as const) : ('stable' as const),
    briefingUrgencyBand: props.inputs.publicStability < 45 ? ('critical' as const) : ('elevated' as const),
    crossDomainStressScore: 0.5,
  };

  const leisure = assessRecreationLeisureInflation({
    tourismDemandBand: command.macroAlertLevel === 'red' ? 'surge' : 'strong',
    laborCostPassThrough: team.briefingUrgencyBand === 'critical' ? 'high' : 'medium',
    discretionarySpendPressure: props.inputs.householdInflationScenarioActive,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const professional = assessProfessionalServicesFeeInflation({
    billingRatePressure: team.consensusInflationOutlook === 'upside_risk' ? 'extreme' : 'elevated',
    complianceCostStack: command.coordinatedTighteningSuggested,
    corporateDemandBand: props.inputs.highInflationScenario ? 'strong' : 'steady',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-recreation-professional-inflation" data-testid="recreation-professional-inflation-panel">
      <h4>Recreation, professional fees & command (round 12)</h4>
      <p>
        Leisure {leisure.pressureBand} · index {leisure.leisureIndex.toFixed(0)} · score adj{' '}
        {recreationLeisureInflationScoreAdjustment(leisure.pressureBand)}
      </p>
      <p>
        Professional {professional.feeBand} · index {professional.feeIndex.toFixed(0)} · score adj{' '}
        {professionalServicesFeeInflationScoreAdjustment(professional.feeBand)}
      </p>
      <p data-testid="recreation-prof-leisure-note">{leisure.narrative}</p>
      <p>{professional.narrative}</p>
    </div>
  );
}


// --- source: react/ChildcareGovernmentInflationPanel.tsx ---
  assessChildcareServicesInflation,
  childcareServicesInflationScoreAdjustment,
} from '../inflation/childcare-services-inflation.js';
  assessGovernmentChargesInflation,
  governmentChargesInflationScoreAdjustment,
} from '../inflation/government-charges-inflation.js';

export interface ChildcareGovernmentInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent02?: Agent02TurnsSnapshot | null;
  agent20?: Agent20AutomationSnapshot | null;
}

export function ChildcareGovernmentInflationPanel(props: ChildcareGovernmentInflationPanelProps) {
  const turns = props.agent02 ?? {
    turn: props.inputs.turn,
    calendarSeasonBand: props.inputs.highInflationScenario ? ('peak_demand' as const) : ('normal' as const),
    policyReviewWindowOpen: props.inputs.fiscalPressure === 'critical',
    multiTurnInflationCarryover: 0.12,
  };

  const automation = props.agent20 ?? {
    turn: props.inputs.turn,
    macroAutopilotInflationBias: props.inputs.highInflationScenario ? ('inflate' as const) : ('neutral' as const),
    unattendedShockDriftActive: props.inputs.creditShockActive,
    automationConfidenceScore: 0.5,
  };

  const childcare = assessChildcareServicesInflation({
    capacityShortageBand: turns.calendarSeasonBand === 'peak_demand' ? 'severe' : 'moderate',
    wageAwardPassThrough: automation.macroAutopilotInflationBias === 'inflate' ? 'strong' : 'normal',
    subsidyIndexationLag: props.inputs.fiscalPressure === 'critical',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const govCharges = assessGovernmentChargesInflation({
    feeIndexationBand: props.inputs.highInflationScenario ? 'above_cpi' : 'at_cpi',
    newLevyStackActive: turns.policyReviewWindowOpen,
    localGovernmentPressure: automation.unattendedShockDriftActive ? 'high' : 'medium',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-childcare-government-inflation" data-testid="childcare-government-inflation-panel">
      <h4>Childcare, government charges & time (round 13)</h4>
      <p>
        Childcare {childcare.pressureBand} · index {childcare.childcareIndex.toFixed(0)} · score adj{' '}
        {childcareServicesInflationScoreAdjustment(childcare.pressureBand)}
      </p>
      <p>
        Gov charges {govCharges.pressureBand} · index {govCharges.chargesIndex.toFixed(0)} · score adj{' '}
        {governmentChargesInflationScoreAdjustment(govCharges.pressureBand)}
      </p>
      <p data-testid="childcare-gov-care-note">{childcare.narrative}</p>
      <p>{govCharges.narrative}</p>
    </div>
  );
}


// --- source: react/WaterTravelStrategicInflationPanel.tsx ---
  assessWaterUtilitiesInflation,
  waterUtilitiesInflationScoreAdjustment,
} from '../inflation/water-utilities-inflation.js';
  assessDomesticTravelInflation,
  domesticTravelInflationScoreAdjustment,
} from '../inflation/domestic-travel-inflation.js';

export interface WaterTravelStrategicInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent01?: Agent01StrategicSnapshot | null;
  agent19?: Agent19MemorySnapshot | null;
}

export function WaterTravelStrategicInflationPanel(props: WaterTravelStrategicInflationPanelProps) {
  const strategic = props.agent01 ?? {
    turn: props.inputs.turn,
    nationalPriorityInflationBias: props.inputs.highInflationScenario ? ('expansionary' as const) : ('neutral' as const),
    strategicStockpileStress: props.inputs.creditShockActive,
    geopoliticalRiskPremium: 0.45,
  };

  const memory = props.agent19 ?? {
    turn: props.inputs.turn,
    recalledInflationRegimeConfidence: 0.6,
    narrativeDriftTowardHigherInflation: props.inputs.highInflationScenario,
    explainabilityAlertActive: props.inputs.fiscalPressure === 'critical',
  };

  const water = assessWaterUtilitiesInflation({
    droughtStressBand: strategic.strategicStockpileStress ? 'severe' : 'moderate',
    infrastructureTariffShock: props.inputs.systemicLiquidityBand === 'critical',
    recyclingCostPassThrough: memory.explainabilityAlertActive ? 'high' : 'medium',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const travel = assessDomesticTravelInflation({
    routeCapacityBand: strategic.nationalPriorityInflationBias === 'expansionary' ? 'constrained' : 'balanced',
    fuelSurchargePassThrough: props.inputs.highInflationScenario,
    accommodationOccupancyBand: memory.narrativeDriftTowardHigherInflation ? 'full' : 'normal',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-water-travel-strategic-inflation" data-testid="water-travel-strategic-inflation-panel">
      <h4>Water, travel & strategic memory (round 14)</h4>
      <p>
        Water {water.pressureBand} · index {water.utilitiesIndex.toFixed(0)} · score adj{' '}
        {waterUtilitiesInflationScoreAdjustment(water.pressureBand)}
      </p>
      <p>
        Travel {travel.pressureBand} · index {travel.travelIndex.toFixed(0)} · score adj{' '}
        {domesticTravelInflationScoreAdjustment(travel.pressureBand)}
      </p>
      <p data-testid="water-travel-water-note">{water.narrative}</p>
      <p>{travel.narrative}</p>
    </div>
  );
}


// --- source: react/ConstructionRetailDashboardInflationPanel.tsx ---
  assessConstructionMaterialsInflation,
  constructionMaterialsInflationScoreAdjustment,
} from '../inflation/construction-materials-inflation.js';
  assessRetailTradeMarginInflation,
  retailTradeMarginInflationScoreAdjustment,
} from '../inflation/retail-trade-margin-inflation.js';

export interface ConstructionRetailDashboardInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent22?: Agent22UiSnapshot | null;
  agent23?: Agent23DashboardsSnapshot | null;
}

export function ConstructionRetailDashboardInflationPanel(props: ConstructionRetailDashboardInflationPanelProps) {
  const ui = props.agent22 ?? {
    turn: props.inputs.turn,
    inflationDashboardStressHighlight: props.inputs.highInflationScenario,
    playerAttentionOnCostOfLiving: props.inputs.householdAffordability === 'severe_pressure' ? ('high' as const) : ('medium' as const),
    uiNudgeInflationExpectationsUp: props.inputs.householdInflationScenarioActive,
  };

  const dashboards = props.agent23 ?? {
    turn: props.inputs.turn,
    regionalHeatmapInflationAlert: props.inputs.highInflationScenario,
    mapLayerCostPressureScore: 0.58,
    dashboardRefreshUrgency: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const materials = assessConstructionMaterialsInflation({
    supplyChainStressBand: dashboards.regionalHeatmapInflationAlert ? 'severe' : 'elevated',
    laborShortagePassThrough: props.inputs.fiscalPressure === 'critical',
    importContentShare: 0.28,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const retail = assessRetailTradeMarginInflation({
    discountingIntensity: ui.playerAttentionOnCostOfLiving === 'high' ? 'light' : 'moderate',
    inventoryClearanceActive: false,
    wageBillPressure: dashboards.dashboardRefreshUrgency === 'critical' ? 'high' : 'medium',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-construction-retail-dashboard-inflation" data-testid="construction-retail-dashboard-inflation-panel">
      <h4>Construction, retail & dashboards (round 15)</h4>
      <p>
        Materials {materials.pressureBand} · index {materials.materialsIndex.toFixed(0)} · score adj{' '}
        {constructionMaterialsInflationScoreAdjustment(materials.pressureBand)}
      </p>
      <p>
        Retail {retail.marginBand} · index {retail.retailIndex.toFixed(0)} · score adj{' '}
        {retailTradeMarginInflationScoreAdjustment(retail.marginBand)}
      </p>
      <p data-testid="construction-retail-materials-note">{materials.narrative}</p>
      <p>{retail.narrative}</p>
    </div>
  );
}


// --- source: react/FinancialServicesFarmgateCommandInflationPanel.tsx ---
  assessFinancialServicesFeeInflation,
  financialServicesFeeInflationScoreAdjustment,
} from '../inflation/financial-services-fee-inflation.js';
  assessAgriculturalFarmgateInflation,
  agriculturalFarmgateInflationScoreAdjustment,
} from '../inflation/agricultural-farmgate-inflation.js';

export interface FinancialServicesFarmgateCommandInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent16?: Agent16GuardianSnapshot | null;
  agent17?: Agent17CommandSnapshot | null;
}

export function FinancialServicesFarmgateCommandInflationPanel(props: FinancialServicesFarmgateCommandInflationPanelProps) {
  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand: props.inputs.fiscalPressure === 'critical' ? ('urgent' as const) : ('advisory' as const),
    narrativeShockSeverity: props.inputs.creditShockActive ? ('high' as const) : ('medium' as const),
    financialServicesFeeShockActive: props.inputs.creditShockActive,
  };

  const command = props.agent17 ?? {
    turn: props.inputs.turn,
    macroAlertLevel: props.inputs.highInflationScenario ? ('red' as const) : ('amber' as const),
    inflationFusionScore: props.inputs.householdInflationScenarioActive ? 0.78 : 0.52,
    coordinatedTighteningSuggested: props.inputs.fiscalPressure === 'critical',
    farmgateSupplyAlertActive: props.inputs.systemicLiquidityBand === 'critical',
  };

  const fees = assessFinancialServicesFeeInflation({
    fundingCostPassThrough: guardian.financialServicesFeeShockActive ? 'high' : props.inputs.creditShockActive ? 'medium' : 'low',
    complianceCostStackActive: guardian.inflationGuardrailTripped,
    depositRateCompetitionBand: command.coordinatedTighteningSuggested ? 'intense' : 'normal',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const farmgate = assessAgriculturalFarmgateInflation({
    harvestStressBand: command.farmgateSupplyAlertActive ? 'severe' : props.inputs.fiscalPressure === 'critical' ? 'weak' : 'normal',
    transportToMarketBand: props.inputs.systemicLiquidityBand === 'critical' ? 'critical' : 'strained',
    inputCostPassThrough: guardian.narrativeShockSeverity === 'high',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-financial-farmgate-command-inflation" data-testid="financial-farmgate-command-inflation-panel">
      <h4>Financial services, farmgate & command (round 16)</h4>
      <p>
        Fees {fees.feeBand} · index {fees.servicesIndex.toFixed(0)} · score adj{' '}
        {financialServicesFeeInflationScoreAdjustment(fees.feeBand)}
      </p>
      <p>
        Farmgate {farmgate.pressureBand} · index {farmgate.farmgateIndex.toFixed(0)} · score adj{' '}
        {agriculturalFarmgateInflationScoreAdjustment(farmgate.pressureBand)}
      </p>
      <p data-testid="financial-farmgate-fees-note">{fees.narrative}</p>
      <p>{farmgate.narrative}</p>
    </div>
  );
}


// --- source: react/UiUtilitiesGridInflationPanel.tsx ---
  assessPublicUtilitiesGridTariffInflation,
  publicUtilitiesGridTariffInflationScoreAdjustment,
} from '../inflation/public-utilities-grid-tariff-inflation.js';
  assessUiInflationSaliencePassThrough,
  uiInflationSaliencePassThroughScoreAdjustment,
} from '../inflation/ui-inflation-salience-pass-through.js';

export interface UiUtilitiesGridInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent12?: Agent12TransportSnapshot | null;
  agent22?: Agent22UiSnapshot | null;
}

export function UiUtilitiesGridInflationPanel(props: UiUtilitiesGridInflationPanelProps) {
  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('tight' as const),
    fuelSurchargeActive: props.inputs.highInflationScenario,
    portBacklogBand: props.inputs.fiscalPressure === 'critical' ? ('severe' as const) : ('moderate' as const),
    logisticsInflationScenarioActive: props.inputs.creditShockActive,
    utilitiesGridCapacityMarginThin: props.inputs.systemicLiquidityBand === 'strained',
    utilitiesOutageBandSevere: props.inputs.systemicLiquidityBand === 'critical',
  };

  const ui = props.agent22 ?? {
    turn: props.inputs.turn,
    inflationDashboardStressHighlight: props.inputs.householdInflationScenarioActive,
    playerAttentionOnCostOfLiving: props.inputs.householdAffordability === 'severe_pressure' ? ('high' as const) : ('medium' as const),
    uiNudgeInflationExpectationsUp: props.inputs.highInflationScenario,
    utilitiesStressBannerActive: props.inputs.fiscalPressure === 'critical',
    phaseShellCostOfLivingCoachActive: props.inputs.householdInflationScenarioActive,
  };

  const grid = assessPublicUtilitiesGridTariffInflation({
    serviceReliabilityBand:
      transport.utilitiesOutageBandSevere ? 'critical' : transport.utilitiesGridCapacityMarginThin ? 'fragile' : 'strained',
    outageRiskBand: transport.utilitiesOutageBandSevere ? 'severe' : transport.portBacklogBand === 'severe' ? 'rolling' : 'moderate',
    capacityMarginBand: transport.utilitiesGridCapacityMarginThin ? 'thin' : 'balanced',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const salience = assessUiInflationSaliencePassThrough({
    dashboardStressHighlight: ui.inflationDashboardStressHighlight || ui.utilitiesStressBannerActive === true,
    playerAttentionBand: ui.playerAttentionOnCostOfLiving,
    uiExpectationsNudgeUp: ui.uiNudgeInflationExpectationsUp,
    phaseShellCoachActive: ui.phaseShellCostOfLivingCoachActive === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-ui-utilities-grid-inflation" data-testid="ui-utilities-grid-inflation-panel">
      <h4>UI salience & utilities grid (round 17)</h4>
      <p>
        Grid {grid.tariffBand} · index {grid.gridIndex.toFixed(0)} · score adj{' '}
        {publicUtilitiesGridTariffInflationScoreAdjustment(grid.tariffBand)}
      </p>
      <p>
        UI salience {salience.salienceBand} · index {salience.presentationIndex.toFixed(0)} · score adj{' '}
        {uiInflationSaliencePassThroughScoreAdjustment(salience.salienceBand)}
      </p>
      <p data-testid="ui-utilities-grid-note">{grid.narrative}</p>
      <p>{salience.narrative}</p>
    </div>
  );
}


// --- source: react/HousingMacroMergeInflationPanel.tsx ---
  assessHousingMortgageEssentialInflation,
  housingMortgageEssentialInflationScoreAdjustment,
} from '../inflation/housing-mortgage-essential-inflation.js';
  assessMacroTransmissionMergeInflation,
  macroTransmissionMergeInflationScoreAdjustment,
} from '../inflation/macro-transmission-merge-inflation.js';

export interface HousingMacroMergeInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent14?: Agent14HousingSnapshot | null;
  agent06?: Agent06MacroSnapshot | null;
}

export function HousingMacroMergeInflationPanel(props: HousingMacroMergeInflationPanelProps) {
  const housing = props.agent14 ?? {
    turn: props.inputs.turn,
    mortgageStressBand:
      props.inputs.householdAffordability === 'severe_pressure'
        ? ('severe' as const)
        : props.inputs.householdAffordability === 'strained'
          ? ('elevated' as const)
          : ('low' as const),
    wellbeingCostBand:
      props.inputs.householdInflationScenarioActive && props.inputs.publicStability < 45
        ? ('critical' as const)
        : props.inputs.householdInflationScenarioActive
          ? ('strained' as const)
          : ('stable' as const),
    essentialServicesInflationFlag: props.inputs.householdInflationScenarioActive,
    inlineMergeTrajectoryBand: props.inputs.fiscalPressure === 'critical' ? ('blocked' as const) : ('lagging' as const),
    inlineActivationBoundaryCritical: props.inputs.publicStability < 40,
  };

  const macro = props.agent06 ?? {
    turn: props.inputs.turn,
    gdpGrowthBand: props.inputs.fiscalPressure === 'critical' ? ('contraction' as const) : ('slow' as const),
    unemploymentBand: props.inputs.actorCreditStressIndex > 0.55 ? ('elevated' as const) : ('moderate' as const),
    outputGap: props.inputs.highInflationScenario ? 0.3 : -0.05,
    nominalDemandPressure: props.inputs.inflationSettingMultiplier ? props.inputs.inflationSettingMultiplier - 1 : 0.1,
    transmissionStabilityFragile: props.inputs.systemicLiquidityBand === 'strained',
    macroRecoveryRankStressActive: props.inputs.creditShockActive,
  };

  const essential = assessHousingMortgageEssentialInflation({
    mortgageStressBand: housing.mortgageStressBand,
    wellbeingCostBand: housing.wellbeingCostBand,
    essentialServicesInflationFlag: housing.essentialServicesInflationFlag,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const merge = assessMacroTransmissionMergeInflation({
    transmissionStabilityFragile: macro.transmissionStabilityFragile === true,
    macroRecoveryRankStressActive: macro.macroRecoveryRankStressActive === true,
    outputGap: macro.outputGap,
    nominalDemandPressure: macro.nominalDemandPressure,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-housing-macro-merge-inflation" data-testid="housing-macro-merge-inflation-panel">
      <h4>Housing essential & macro merge (round 18)</h4>
      <p>
        Essential {essential.essentialBand} · index {essential.servicesIndex.toFixed(0)} · score adj{' '}
        {housingMortgageEssentialInflationScoreAdjustment(essential.essentialBand)}
      </p>
      <p>
        Merge {merge.mergeBand} · index {merge.transmissionIndex.toFixed(0)} · score adj{' '}
        {macroTransmissionMergeInflationScoreAdjustment(merge.mergeBand)}
      </p>
      <p data-testid="housing-macro-merge-note">{essential.narrative}</p>
      <p>{merge.narrative}</p>
    </div>
  );
}


// --- source: react/EventsDashboardInflationPanel.tsx ---
  assessDynamicEventsInflationSpillover,
  dynamicEventsInflationSpilloverScoreAdjustment,
} from '../inflation/dynamic-events-inflation-spillover.js';
  assessDashboardMapInflationOverlay,
  dashboardMapInflationOverlayScoreAdjustment,
} from '../inflation/dashboard-map-inflation-overlay.js';

export interface EventsDashboardInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent05?: Agent05EventsSnapshot | null;
  agent23?: Agent23DashboardsSnapshot | null;
}

export function EventsDashboardInflationPanel(props: EventsDashboardInflationPanelProps) {
  const events = props.agent05 ?? {
    turn: props.inputs.turn,
    inflationShockEventActive: props.inputs.highInflationScenario,
    supplyDisruptionSeverity: props.inputs.creditShockActive ? ('national' as const) : ('localized' as const),
    confidenceShockBand: props.inputs.publicStability < 42 ? ('severe' as const) : ('uneasy' as const),
    stagedEventCostShockBand: props.inputs.fiscalPressure === 'critical' ? ('cascade' as const) : ('active' as const),
    macroEventInflationSpilloverActive: props.inputs.highInflationScenario,
  };

  const dashboards = props.agent23 ?? {
    turn: props.inputs.turn,
    regionalHeatmapInflationAlert: props.inputs.householdInflationScenarioActive,
    mapLayerCostPressureScore: props.inputs.householdAffordability === 'severe_pressure' ? 0.78 : 0.45,
    dashboardRefreshUrgency:
      props.inputs.publicStability < 40 ? ('critical' as const) : props.inputs.highInflationScenario ? ('elevated' as const) : ('routine' as const),
    dashboardInflationHeatmapSevere: props.inputs.householdInflationScenarioActive && props.inputs.publicStability < 48,
    mapLayerCostOfLivingStressActive: props.inputs.householdAffordability === 'severe_pressure',
  };

  const spillover = assessDynamicEventsInflationSpillover({
    inflationShockEventActive: events.inflationShockEventActive,
    supplyDisruptionSeverity: events.supplyDisruptionSeverity,
    confidenceShockBand: events.confidenceShockBand,
    stagedEventCostShockBand: events.stagedEventCostShockBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const overlay = assessDashboardMapInflationOverlay({
    regionalHeatmapInflationAlert: dashboards.regionalHeatmapInflationAlert,
    mapLayerCostPressureScore: dashboards.mapLayerCostPressureScore,
    dashboardRefreshUrgency: dashboards.dashboardRefreshUrgency,
    dashboardInflationHeatmapSevere: dashboards.dashboardInflationHeatmapSevere === true,
    mapLayerCostOfLivingStressActive: dashboards.mapLayerCostOfLivingStressActive === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-events-dashboard-inflation" data-testid="events-dashboard-inflation-panel">
      <h4>Events spillover & dashboard map (round 19)</h4>
      <p>
        Events {spillover.spilloverBand} · index {spillover.eventIndex.toFixed(0)} · score adj{' '}
        {dynamicEventsInflationSpilloverScoreAdjustment(spillover.spilloverBand)}
      </p>
      <p>
        Map overlay {overlay.overlayBand} · index {overlay.presentationIndex.toFixed(0)} · score adj{' '}
        {dashboardMapInflationOverlayScoreAdjustment(overlay.overlayBand)}
      </p>
      <p data-testid="events-dashboard-note">{spillover.narrative}</p>
      <p>{overlay.narrative}</p>
    </div>
  );
}


// --- source: react/FiscalLaborInflationPanel.tsx ---
  assessPublicFinanceDebtServiceInflation,
  publicFinanceDebtServiceInflationScoreAdjustment,
} from '../inflation/public-finance-debt-service-inflation.js';
  assessPopulationLaborWageInflation,
  populationLaborWageInflationScoreAdjustment,
} from '../inflation/population-labor-wage-inflation.js';

export interface FiscalLaborInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent07?: Agent07FiscalSnapshot | null;
  agent09?: Agent09HouseholdSnapshot | null;
}

export function FiscalLaborInflationPanel(props: FiscalLaborInflationPanelProps) {
  const fiscal = props.agent07 ?? {
    turn: props.inputs.turn,
    consolidatedDeficitBand:
      props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const),
    revenueMomentum: props.inputs.fiscalSustainability === 'vulnerable' ? ('weak' as const) : ('steady' as const),
    debtServicePressure:
      props.inputs.sovereignDebtPressure === 'critical'
        ? ('critical' as const)
        : props.inputs.sovereignDebtPressure === 'elevated'
          ? ('elevated' as const)
          : ('moderate' as const),
    fiscalAnchorBreached: props.inputs.fiscalPressure === 'critical',
    indexedChargesInflationPassThrough: props.inputs.fiscalPressure !== 'healthy',
  };

  const household = props.agent09 ?? {
    turn: props.inputs.turn,
    laborParticipationBand: props.inputs.actorCreditStressIndex > 0.5 ? ('weak' as const) : ('steady' as const),
    wageGrowthBand:
      props.inputs.highInflationScenario && props.inputs.householdInflationScenarioActive
        ? ('surge' as const)
        : props.inputs.householdInflationScenarioActive
          ? ('elevated' as const)
          : ('moderate' as const),
    costOfLivingStress:
      props.inputs.householdAffordability === 'severe_pressure'
        ? ('extreme' as const)
        : props.inputs.householdAffordability === 'strained'
          ? ('high' as const)
          : ('moderate' as const),
    participationSlackInflationBand:
      props.inputs.householdAffordability === 'severe_pressure' ? ('severe_slack' as const) : ('slack' as const),
    householdExpectationsDeanchoring: props.inputs.highInflationScenario && props.inputs.householdInflationScenarioActive,
  };

  const debtService = assessPublicFinanceDebtServiceInflation({
    consolidatedDeficitBand: fiscal.consolidatedDeficitBand,
    debtServicePressure: fiscal.debtServicePressure,
    fiscalAnchorBreached: fiscal.fiscalAnchorBreached === true,
    indexedChargesInflationPassThrough: fiscal.indexedChargesInflationPassThrough === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const laborWage = assessPopulationLaborWageInflation({
    laborParticipationBand: household.laborParticipationBand,
    wageGrowthBand: household.wageGrowthBand,
    costOfLivingStress: household.costOfLivingStress,
    participationSlackInflationBand: household.participationSlackInflationBand ?? 'balanced',
    householdExpectationsDeanchoring: household.householdExpectationsDeanchoring === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-fiscal-labor-inflation" data-testid="fiscal-labor-inflation-panel">
      <h4>Public finance debt service & labor wage (round 20)</h4>
      <p>
        Fiscal {debtService.debtServiceBand} · index {debtService.fiscalIndex.toFixed(0)} · score adj{' '}
        {publicFinanceDebtServiceInflationScoreAdjustment(debtService.debtServiceBand)}
      </p>
      <p>
        Labor wage {laborWage.wageBand} · index {laborWage.laborIndex.toFixed(0)} · score adj{' '}
        {populationLaborWageInflationScoreAdjustment(laborWage.wageBand)}
      </p>
      <p data-testid="fiscal-labor-note">{debtService.narrative}</p>
      <p>{laborWage.narrative}</p>
    </div>
  );
}


// --- source: react/EnergyCitiesInflationPanel.tsx ---
  assessWholesaleEnergyTransitionInflation,
  wholesaleEnergyTransitionInflationScoreAdjustment,
} from '../inflation/wholesale-energy-transition-inflation.js';
  assessUrbanRentDispersionInflation,
  urbanRentDispersionInflationScoreAdjustment,
} from '../inflation/urban-rent-dispersion-inflation.js';

export interface EnergyCitiesInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent13?: Agent13EnergySnapshot | null;
  agent11?: Agent11CitiesSnapshot | null;
}

export function EnergyCitiesInflationPanel(props: EnergyCitiesInflationPanelProps) {
  const energy = props.agent13 ?? {
    turn: props.inputs.turn,
    wholesaleEnergyStress: props.inputs.systemicLiquidityBand === 'critical' ? ('crisis' as const) : ('severe' as const),
    retailTariffShock: props.inputs.highInflationScenario,
    gridReliabilityBand: props.inputs.systemicLiquidityBand === 'strained' ? ('fragile' as const) : ('strained' as const),
    emissionsTransitionCostBand: props.inputs.fiscalPressure === 'critical' ? ('high' as const) : ('medium' as const),
    renewableShortfallInflationFlag: props.inputs.creditShockActive,
    wholesaleCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('cascade' as const) : ('stressed' as const),
  };

  const cities = props.agent11 ?? {
    turn: props.inputs.turn,
    vacancyBand: props.inputs.householdAffordability === 'severe_pressure' ? ('critical' as const) : ('tight' as const),
    rentGrowthBand: props.inputs.householdInflationScenarioActive ? ('surging' as const) : ('strong' as const),
    urbanizationPressure: props.inputs.publicStability < 50 ? ('high' as const) : ('medium' as const),
    regionalDispersionScore: props.inputs.householdAffordability === 'severe_pressure' ? 0.72 : 0.48,
    metroRentDispersionCritical: props.inputs.householdAffordability === 'severe_pressure',
    regionalHousingInflationSync: props.inputs.householdInflationScenarioActive,
  };

  const transition = assessWholesaleEnergyTransitionInflation({
    wholesaleEnergyStress: energy.wholesaleEnergyStress,
    retailTariffShock: energy.retailTariffShock,
    gridReliabilityBand: energy.gridReliabilityBand,
    emissionsTransitionCostBand: energy.emissionsTransitionCostBand,
    renewableShortfallInflationFlag: energy.renewableShortfallInflationFlag === true,
    wholesaleCascadeBand: energy.wholesaleCascadeBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const dispersion = assessUrbanRentDispersionInflation({
    vacancyBand: cities.vacancyBand,
    rentGrowthBand: cities.rentGrowthBand,
    urbanizationPressure: cities.urbanizationPressure,
    regionalDispersionScore: cities.regionalDispersionScore,
    metroRentDispersionCritical: cities.metroRentDispersionCritical === true,
    regionalHousingInflationSync: cities.regionalHousingInflationSync === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-energy-cities-inflation" data-testid="energy-cities-inflation-panel">
      <h4>Energy transition & urban rent dispersion (round 21)</h4>
      <p>
        Energy {transition.transitionBand} · index {transition.energyIndex.toFixed(0)} · score adj{' '}
        {wholesaleEnergyTransitionInflationScoreAdjustment(transition.transitionBand)}
      </p>
      <p>
        Urban {dispersion.dispersionBand} · index {dispersion.urbanIndex.toFixed(0)} · score adj{' '}
        {urbanRentDispersionInflationScoreAdjustment(dispersion.dispersionBand)}
      </p>
      <p data-testid="energy-cities-note">{transition.narrative}</p>
      <p>{dispersion.narrative}</p>
    </div>
  );
}


// --- source: react/CorporateTradeInflationPanel.tsx ---
  assessCorporatePricingPassThroughInflation,
  corporatePricingPassThroughInflationScoreAdjustment,
} from '../inflation/corporate-pricing-pass-through-inflation.js';
  assessTradeExchangeImportInflation,
  tradeExchangeImportInflationScoreAdjustment,
} from '../inflation/trade-exchange-import-inflation.js';

export interface CorporateTradeInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent08?: Agent08CorporateSnapshot | null;
  agent15?: Agent15TradeSnapshot | null;
}

export function CorporateTradeInflationPanel(props: CorporateTradeInflationPanelProps) {
  const corporate = props.agent08 ?? {
    turn: props.inputs.turn,
    pricingPowerBand: props.inputs.highInflationScenario ? ('strong' as const) : ('moderate' as const),
    marginCompression: props.inputs.actorCreditStressIndex > 0.55 ? ('severe' as const) : ('mild' as const),
    passThroughIntent: props.inputs.fiscalPressure === 'critical' ? ('full' as const) : ('partial' as const),
    productionCapacityStrainInflationFlag: props.inputs.systemicLiquidityBand === 'strained',
    corporateMarkupCascadeBand: props.inputs.creditShockActive ? ('active' as const) : ('building' as const),
  };

  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'open' as const,
    exchangeRatePressure: props.inputs.highInflationScenario ? ('sharp_depreciation' as const) : ('depreciation' as const),
    commodityImportShare: 0.42,
    tariffShockInflationActive: props.inputs.creditShockActive,
    importPipelineFragileBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('strained' as const),
  };

  const pricing = assessCorporatePricingPassThroughInflation({
    pricingPowerBand: corporate.pricingPowerBand,
    marginCompression: corporate.marginCompression,
    passThroughIntent: corporate.passThroughIntent,
    productionCapacityStrainInflationFlag: corporate.productionCapacityStrainInflationFlag === true,
    corporateMarkupCascadeBand: corporate.corporateMarkupCascadeBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const imports = assessTradeExchangeImportInflation({
    tradeOpennessBand: trade.tradeOpennessBand,
    exchangeRatePressure: trade.exchangeRatePressure,
    commodityImportShare: trade.commodityImportShare,
    tariffShockInflationActive: trade.tariffShockInflationActive === true,
    importPipelineFragileBand: trade.importPipelineFragileBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-corporate-trade-inflation" data-testid="corporate-trade-inflation-panel">
      <h4>Corporate pricing & trade import (round 22)</h4>
      <p>
        Corporate {pricing.passThroughBand} · index {pricing.corporateIndex.toFixed(0)} · score adj{' '}
        {corporatePricingPassThroughInflationScoreAdjustment(pricing.passThroughBand)}
      </p>
      <p>
        Trade {imports.importBand} · index {imports.tradeIndex.toFixed(0)} · score adj{' '}
        {tradeExchangeImportInflationScoreAdjustment(imports.importBand)}
      </p>
      <p data-testid="corporate-trade-note">{pricing.narrative}</p>
      <p>{imports.narrative}</p>
    </div>
  );
}


// --- source: react/GuardianTeamInflationPanel.tsx ---
  assessGuardianInflationInterventionInflation,
  guardianInflationInterventionScoreAdjustment,
} from '../inflation/guardian-inflation-intervention-inflation.js';
  assessTeamIntelligenceConsensusInflation,
  teamIntelligenceConsensusInflationScoreAdjustment,
} from '../inflation/team-intelligence-consensus-inflation.js';

export interface GuardianTeamInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent16?: Agent16GuardianSnapshot | null;
  agent18?: Agent18TeamSnapshot | null;
}

export function GuardianTeamInflationPanel(props: GuardianTeamInflationPanelProps) {
  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand:
      props.inputs.publicStability < 40 ? ('urgent' as const) : props.inputs.fiscalPressure === 'critical' ? ('advisory' as const) : ('none' as const),
    narrativeShockSeverity: props.inputs.publicStability < 45 ? ('high' as const) : ('medium' as const),
    copilotInflationEscalationActive: props.inputs.householdInflationScenarioActive,
    guardrailNarrativeCascadeBand: props.inputs.creditShockActive ? ('urgent' as const) : ('building' as const),
  };

  const team = props.agent18 ?? {
    turn: props.inputs.turn,
    consensusInflationOutlook: props.inputs.highInflationScenario ? ('upside_risk' as const) : ('reacceleration' as const),
    briefingUrgencyBand: props.inputs.publicStability < 42 ? ('critical' as const) : ('elevated' as const),
    crossDomainStressScore: props.inputs.actorCreditStressIndex,
    teamForecastDeanchoringFlag: props.inputs.householdInflationScenarioActive && props.inputs.highInflationScenario,
    briefingInflationSalienceBand: props.inputs.publicStability < 38 ? ('critical' as const) : ('elevated' as const),
  };

  const intervention = assessGuardianInflationInterventionInflation({
    inflationGuardrailTripped: guardian.inflationGuardrailTripped,
    stabilityInterventionBand: guardian.stabilityInterventionBand,
    narrativeShockSeverity: guardian.narrativeShockSeverity,
    copilotInflationEscalationActive: guardian.copilotInflationEscalationActive === true,
    guardrailNarrativeCascadeBand: guardian.guardrailNarrativeCascadeBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const consensus = assessTeamIntelligenceConsensusInflation({
    consensusInflationOutlook: team.consensusInflationOutlook,
    briefingUrgencyBand: team.briefingUrgencyBand,
    crossDomainStressScore: team.crossDomainStressScore,
    teamForecastDeanchoringFlag: team.teamForecastDeanchoringFlag === true,
    briefingInflationSalienceBand: team.briefingInflationSalienceBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-guardian-team-inflation" data-testid="guardian-team-inflation-panel">
      <h4>Guardian intervention & team consensus (round 23)</h4>
      <p>
        Guardian {intervention.interventionBand} · index {intervention.guardrailIndex.toFixed(0)} · score adj{' '}
        {guardianInflationInterventionScoreAdjustment(intervention.interventionBand)}
      </p>
      <p>
        Team {consensus.consensusBand} · index {consensus.briefingIndex.toFixed(0)} · score adj{' '}
        {teamIntelligenceConsensusInflationScoreAdjustment(consensus.consensusBand)}
      </p>
      <p data-testid="guardian-team-note">{intervention.narrative}</p>
      <p>{consensus.narrative}</p>
    </div>
  );
}


// --- source: react/StrategicMemoryInflationPanel.tsx ---
  assessStrategicGeopoliticalInflationPremium,
  strategicGeopoliticalInflationPremiumScoreAdjustment,
} from '../inflation/strategic-geopolitical-inflation-premium.js';
  assessAiMemoryInflationRecallInflation,
  aiMemoryInflationRecallScoreAdjustment,
} from '../inflation/ai-memory-inflation-recall-inflation.js';

export interface StrategicMemoryInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent01?: Agent01StrategicSnapshot | null;
  agent19?: Agent19MemorySnapshot | null;
}

export function StrategicMemoryInflationPanel(props: StrategicMemoryInflationPanelProps) {
  const strategic = props.agent01 ?? {
    turn: props.inputs.turn,
    nationalPriorityInflationBias: props.inputs.highInflationScenario ? ('expansionary' as const) : ('neutral' as const),
    strategicStockpileStress: props.inputs.creditShockActive,
    geopoliticalRiskPremium: props.inputs.fiscalPressure === 'critical' ? 0.72 : 0.45,
    expansionaryPriorityCascadeActive: props.inputs.highInflationScenario && props.inputs.creditShockActive,
    strategicInflationRiskBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const memory = props.agent19 ?? {
    turn: props.inputs.turn,
    recalledInflationRegimeConfidence: props.inputs.highInflationScenario ? 0.82 : 0.55,
    narrativeDriftTowardHigherInflation: props.inputs.householdInflationScenarioActive,
    explainabilityAlertActive: props.inputs.publicStability < 45,
    memoryInflationRecallCascade: props.inputs.highInflationScenario && props.inputs.householdInflationScenarioActive,
    explainabilityInflationSalienceBand: props.inputs.publicStability < 40 ? ('critical' as const) : ('elevated' as const),
  };

  const premium = assessStrategicGeopoliticalInflationPremium({
    nationalPriorityInflationBias: strategic.nationalPriorityInflationBias,
    strategicStockpileStress: strategic.strategicStockpileStress,
    geopoliticalRiskPremium: strategic.geopoliticalRiskPremium,
    expansionaryPriorityCascadeActive: strategic.expansionaryPriorityCascadeActive === true,
    strategicInflationRiskBand: strategic.strategicInflationRiskBand ?? 'low',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const recall = assessAiMemoryInflationRecallInflation({
    recalledInflationRegimeConfidence: memory.recalledInflationRegimeConfidence,
    narrativeDriftTowardHigherInflation: memory.narrativeDriftTowardHigherInflation,
    explainabilityAlertActive: memory.explainabilityAlertActive,
    memoryInflationRecallCascade: memory.memoryInflationRecallCascade === true,
    explainabilityInflationSalienceBand: memory.explainabilityInflationSalienceBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-strategic-memory-inflation" data-testid="strategic-memory-inflation-panel">
      <h4>Strategic premium & AI memory recall (round 24)</h4>
      <p>
        Strategic {premium.premiumBand} · index {premium.strategicIndex.toFixed(0)} · score adj{' '}
        {strategicGeopoliticalInflationPremiumScoreAdjustment(premium.premiumBand)}
      </p>
      <p>
        Memory {recall.recallBand} · index {recall.memoryIndex.toFixed(0)} · score adj{' '}
        {aiMemoryInflationRecallScoreAdjustment(recall.recallBand)}
      </p>
      <p data-testid="strategic-memory-note">{premium.narrative}</p>
      <p>{recall.narrative}</p>
    </div>
  );
}


// --- source: react/TurnsAutomationInflationPanel.tsx ---
  assessCalendarSeasonInflationCarryover,
  calendarSeasonInflationCarryoverScoreAdjustment,
} from '../inflation/calendar-season-inflation-carryover.js';
  assessAutomationAutopilotInflationDrift,
  automationAutopilotInflationDriftScoreAdjustment,
} from '../inflation/automation-autopilot-inflation-drift.js';

export interface TurnsAutomationInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent02?: Agent02TurnsSnapshot | null;
  agent20?: Agent20AutomationSnapshot | null;
}

export function TurnsAutomationInflationPanel(props: TurnsAutomationInflationPanelProps) {
  const turns = props.agent02 ?? {
    turn: props.inputs.turn,
    calendarSeasonBand: props.inputs.highInflationScenario ? ('peak_demand' as const) : ('normal' as const),
    policyReviewWindowOpen: props.inputs.fiscalPressure === 'critical',
    multiTurnInflationCarryover: props.inputs.householdInflationScenarioActive ? 0.32 : 0.12,
    fiscalCalendarInflationLatch: props.inputs.creditShockActive,
    multiTurnCarryoverBand: props.inputs.highInflationScenario ? ('persistent' as const) : ('building' as const),
  };

  const automation = props.agent20 ?? {
    turn: props.inputs.turn,
    macroAutopilotInflationBias: props.inputs.highInflationScenario ? ('inflate' as const) : ('neutral' as const),
    unattendedShockDriftActive: props.inputs.creditShockActive,
    automationConfidenceScore: props.inputs.publicStability < 45 ? 0.38 : 0.62,
    idleMacroInflationEscalation: props.inputs.householdInflationScenarioActive,
    autopilotDriftCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('runaway' as const) : ('drifting' as const),
  };

  const calendar = assessCalendarSeasonInflationCarryover({
    calendarSeasonBand: turns.calendarSeasonBand,
    policyReviewWindowOpen: turns.policyReviewWindowOpen,
    multiTurnInflationCarryover: turns.multiTurnInflationCarryover,
    fiscalCalendarInflationLatch: turns.fiscalCalendarInflationLatch === true,
    multiTurnCarryoverBand: turns.multiTurnCarryoverBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const drift = assessAutomationAutopilotInflationDrift({
    macroAutopilotInflationBias: automation.macroAutopilotInflationBias,
    unattendedShockDriftActive: automation.unattendedShockDriftActive,
    automationConfidenceScore: automation.automationConfidenceScore,
    idleMacroInflationEscalation: automation.idleMacroInflationEscalation === true,
    autopilotDriftCascadeBand: automation.autopilotDriftCascadeBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-turns-automation-inflation" data-testid="turns-automation-inflation-panel">
      <h4>Calendar carryover & automation drift (round 25)</h4>
      <p>
        Calendar {calendar.carryoverBand} · index {calendar.calendarIndex.toFixed(0)} · score adj{' '}
        {calendarSeasonInflationCarryoverScoreAdjustment(calendar.carryoverBand)}
      </p>
      <p>
        Autopilot {drift.driftBand} · index {drift.autopilotIndex.toFixed(0)} · score adj{' '}
        {automationAutopilotInflationDriftScoreAdjustment(drift.driftBand)}
      </p>
      <p data-testid="turns-automation-note">{calendar.narrative}</p>
      <p>{drift.narrative}</p>
    </div>
  );
}


// --- source: react/ResearchModesInflationPanel.tsx ---
  assessResearchProductivityInflationOffset,
  researchProductivityInflationOffsetScoreAdjustment,
} from '../inflation/research-productivity-inflation-offset.js';
  assessScenarioSandboxInflationBias,
  scenarioSandboxInflationBiasScoreAdjustment,
} from '../inflation/scenario-sandbox-inflation-bias.js';

export interface ResearchModesInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent03?: Agent03ResearchSnapshot | null;
  agent04?: Agent04ModesSnapshot | null;
}

export function ResearchModesInflationPanel(props: ResearchModesInflationPanelProps) {
  const research = props.agent03 ?? {
    turn: props.inputs.turn,
    productivityGainBand: props.inputs.highInflationScenario ? ('flat' as const) : ('moderate' as const),
    supplySideReliefActive: !props.inputs.creditShockActive,
    innovationInflationOffsetScore: props.inputs.householdInflationScenarioActive ? 0.35 : 0.58,
    techTreeInflationLatch: props.inputs.creditShockActive,
    supplySideOffsetBand: props.inputs.fiscalPressure === 'critical' ? ('weak' as const) : ('building' as const),
  };

  const modes = props.agent04 ?? {
    turn: props.inputs.turn,
    scenarioInflationBias: props.inputs.highInflationScenario ? ('extreme' as const) : ('inflationary' as const),
    sandboxStressModeActive: props.inputs.creditShockActive,
    difficultyCostMultiplier: props.inputs.fiscalPressure === 'critical' ? 1.22 : 1.08,
    difficultyInflationCascade: props.inputs.householdInflationScenarioActive,
    sandboxStressInflationBand: props.inputs.publicStability < 42 ? ('extreme' as const) : ('stressed' as const),
  };

  const offset = assessResearchProductivityInflationOffset({
    productivityGainBand: research.productivityGainBand,
    supplySideReliefActive: research.supplySideReliefActive,
    innovationInflationOffsetScore: research.innovationInflationOffsetScore,
    techTreeInflationLatch: research.techTreeInflationLatch === true,
    supplySideOffsetBand: research.supplySideOffsetBand ?? 'building',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const bias = assessScenarioSandboxInflationBias({
    scenarioInflationBias: modes.scenarioInflationBias,
    sandboxStressModeActive: modes.sandboxStressModeActive,
    difficultyCostMultiplier: modes.difficultyCostMultiplier,
    difficultyInflationCascade: modes.difficultyInflationCascade === true,
    sandboxStressInflationBand: modes.sandboxStressInflationBand ?? 'routine',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-research-modes-inflation" data-testid="research-modes-inflation-panel">
      <h4>Research offset & scenario bias (round 26)</h4>
      <p>
        Productivity {offset.offsetBand} · index {offset.productivityIndex.toFixed(0)} · score adj{' '}
        {researchProductivityInflationOffsetScoreAdjustment(offset.offsetBand)}
      </p>
      <p>
        Scenario {bias.biasBand} · index {bias.scenarioIndex.toFixed(0)} · score adj{' '}
        {scenarioSandboxInflationBiasScoreAdjustment(bias.biasBand)}
      </p>
      <p data-testid="research-modes-note">{offset.narrative}</p>
      <p>{bias.narrative}</p>
    </div>
  );
}


// --- source: react/EventsMacroInflationPanel.tsx ---
  assessEventsNarrativeInflationPersistence,
  eventsNarrativeInflationPersistenceScoreAdjustment,
} from '../inflation/events-narrative-inflation-persistence.js';
  assessMacroDemandOverheatInflationSlippage,
  macroDemandOverheatInflationSlippageScoreAdjustment,
} from '../inflation/macro-demand-overheat-inflation-slippage.js';

export interface EventsMacroInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent05?: Agent05EventsSnapshot | null;
  agent06?: Agent06MacroSnapshot | null;
}

export function EventsMacroInflationPanel(props: EventsMacroInflationPanelProps) {
  const events = props.agent05 ?? {
    turn: props.inputs.turn,
    inflationShockEventActive: props.inputs.creditShockActive,
    supplyDisruptionSeverity: props.inputs.highInflationScenario ? ('national' as const) : ('localized' as const),
    confidenceShockBand: props.inputs.publicStability < 42 ? ('severe' as const) : ('uneasy' as const),
    dynamicEventInflationLatch: props.inputs.householdInflationScenarioActive,
    supplyShockPersistenceBand: props.inputs.fiscalPressure === 'critical' ? ('entrenched' as const) : ('building' as const),
  };

  const macro = props.agent06 ?? {
    turn: props.inputs.turn,
    gdpGrowthBand: props.inputs.highInflationScenario ? ('strong' as const) : ('steady' as const),
    unemploymentBand: 'moderate' as const,
    outputGap: props.inputs.highInflationScenario ? 0.42 : 0.12,
    nominalDemandPressure: props.inputs.creditShockActive ? 0.68 : 0.35,
    transmissionStabilityFragile: props.inputs.creditShockActive,
    macroRecoveryRankStressActive: false,
    macroDemandOverheatLatch: props.inputs.highInflationScenario,
    transmissionSlippageBand: props.inputs.fiscalPressure === 'critical' ? ('dislocated' as const) : ('slipping' as const),
  };

  const persistence = assessEventsNarrativeInflationPersistence({
    inflationShockEventActive: events.inflationShockEventActive,
    supplyDisruptionSeverity: events.supplyDisruptionSeverity,
    confidenceShockBand: events.confidenceShockBand,
    dynamicEventInflationLatch: events.dynamicEventInflationLatch === true,
    supplyShockPersistenceBand: events.supplyShockPersistenceBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const slippage = assessMacroDemandOverheatInflationSlippage({
    gdpGrowthBand: macro.gdpGrowthBand,
    nominalDemandPressure: macro.nominalDemandPressure,
    outputGap: macro.outputGap,
    macroDemandOverheatLatch: macro.macroDemandOverheatLatch === true,
    transmissionSlippageBand: macro.transmissionSlippageBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-events-macro-inflation" data-testid="events-macro-inflation-panel">
      <h4>Events persistence & macro slippage (round 27)</h4>
      <p>
        Events {persistence.persistenceBand} · index {persistence.eventsIndex.toFixed(0)} · score adj{' '}
        {eventsNarrativeInflationPersistenceScoreAdjustment(persistence.persistenceBand)}
      </p>
      <p>
        Macro {slippage.slippageBand} · index {slippage.macroIndex.toFixed(0)} · score adj{' '}
        {macroDemandOverheatInflationSlippageScoreAdjustment(slippage.slippageBand)}
      </p>
      <p data-testid="events-macro-note">{persistence.narrative}</p>
      <p>{slippage.narrative}</p>
    </div>
  );
}


// --- source: react/TransportHousingInflationPanel.tsx ---
  assessFreightLogisticsInflationCongestion,
  freightLogisticsInflationCongestionScoreAdjustment,
} from '../inflation/freight-logistics-inflation-congestion.js';
  assessHousingWellbeingInflationEssentialStress,
  housingWellbeingInflationEssentialStressScoreAdjustment,
} from '../inflation/housing-wellbeing-inflation-essential-stress.js';

export interface TransportHousingInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent12?: Agent12TransportSnapshot | null;
  agent14?: Agent14HousingSnapshot | null;
}

export function TransportHousingInflationPanel(props: TransportHousingInflationPanelProps) {
  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: props.inputs.creditShockActive ? ('critical' as const) : ('tight' as const),
    fuelSurchargeActive: props.inputs.highInflationScenario,
    portBacklogBand: props.inputs.fiscalPressure === 'critical' ? ('severe' as const) : ('moderate' as const),
    logisticsInflationScenarioActive: props.inputs.highInflationScenario,
    logisticsInflationLatch: props.inputs.creditShockActive,
    freightCongestionBand: props.inputs.systemicLiquidityBand === 'critical' ? ('gridlocked' as const) : ('building' as const),
  };

  const housing = props.agent14 ?? {
    turn: props.inputs.turn,
    mortgageStressBand: props.inputs.householdInflationScenarioActive ? ('severe' as const) : ('elevated' as const),
    wellbeingCostBand: props.inputs.publicStability < 45 ? ('critical' as const) : ('strained' as const),
    essentialServicesInflationFlag: props.inputs.householdInflationScenarioActive,
    shelterEssentialInflationLatch: props.inputs.creditShockActive,
    mortgageWellbeingStressBand: props.inputs.fiscalPressure === 'critical' ? ('acute' as const) : ('strained' as const),
  };

  const congestion = assessFreightLogisticsInflationCongestion({
    freightCapacityBand: transport.freightCapacityBand,
    fuelSurchargeActive: transport.fuelSurchargeActive,
    portBacklogBand: transport.portBacklogBand,
    logisticsInflationLatch: transport.logisticsInflationLatch === true,
    freightCongestionBand: transport.freightCongestionBand ?? 'clear',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const stress = assessHousingWellbeingInflationEssentialStress({
    mortgageStressBand: housing.mortgageStressBand,
    wellbeingCostBand: housing.wellbeingCostBand,
    essentialServicesInflationFlag: housing.essentialServicesInflationFlag,
    shelterEssentialInflationLatch: housing.shelterEssentialInflationLatch === true,
    mortgageWellbeingStressBand: housing.mortgageWellbeingStressBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-transport-housing-inflation" data-testid="transport-housing-inflation-panel">
      <h4>Freight congestion & housing essential stress (round 28)</h4>
      <p>
        Logistics {congestion.congestionBand} · index {congestion.logisticsIndex.toFixed(0)} · score adj{' '}
        {freightLogisticsInflationCongestionScoreAdjustment(congestion.congestionBand)}
      </p>
      <p>
        Shelter {stress.stressBand} · index {stress.shelterIndex.toFixed(0)} · score adj{' '}
        {housingWellbeingInflationEssentialStressScoreAdjustment(stress.stressBand)}
      </p>
      <p data-testid="transport-housing-note">{congestion.narrative}</p>
      <p>{stress.narrative}</p>
    </div>
  );
}


// --- source: react/CommandUiInflationPanel.tsx ---
  assessCommandCenterInflationFusionEscalation,
  commandCenterInflationFusionEscalationScoreAdjustment,
} from '../inflation/command-center-inflation-fusion-escalation.js';
  assessUiPlayerInflationSalienceNudge,
  uiPlayerInflationSalienceNudgeScoreAdjustment,
} from '../inflation/ui-player-inflation-salience-nudge.js';

export interface CommandUiInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent17?: Agent17CommandSnapshot | null;
  agent22?: Agent22UiSnapshot | null;
}

export function CommandUiInflationPanel(props: CommandUiInflationPanelProps) {
  const command = props.agent17 ?? {
    turn: props.inputs.turn,
    macroAlertLevel: props.inputs.highInflationScenario ? ('red' as const) : ('amber' as const),
    inflationFusionScore: props.inputs.creditShockActive ? 0.78 : 0.55,
    coordinatedTighteningSuggested: props.inputs.fiscalPressure === 'critical',
    macroInflationFusionLatch: props.inputs.householdInflationScenarioActive,
    commandAlertCascadeBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const ui = props.agent22 ?? {
    turn: props.inputs.turn,
    inflationDashboardStressHighlight: props.inputs.highInflationScenario,
    playerAttentionOnCostOfLiving: props.inputs.publicStability < 45 ? ('high' as const) : ('medium' as const),
    uiNudgeInflationExpectationsUp: props.inputs.householdInflationScenarioActive,
    playerInflationSalienceLatch: props.inputs.creditShockActive,
    uiExpectationsNudgeBand: props.inputs.fiscalPressure === 'critical' ? ('sharp' as const) : ('building' as const),
  };

  const fusion = assessCommandCenterInflationFusionEscalation({
    macroAlertLevel: command.macroAlertLevel,
    inflationFusionScore: command.inflationFusionScore,
    coordinatedTighteningSuggested: command.coordinatedTighteningSuggested,
    macroInflationFusionLatch: command.macroInflationFusionLatch === true,
    commandAlertCascadeBand: command.commandAlertCascadeBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const nudge = assessUiPlayerInflationSalienceNudge({
    inflationDashboardStressHighlight: ui.inflationDashboardStressHighlight,
    playerAttentionOnCostOfLiving: ui.playerAttentionOnCostOfLiving,
    uiNudgeInflationExpectationsUp: ui.uiNudgeInflationExpectationsUp,
    playerInflationSalienceLatch: ui.playerInflationSalienceLatch === true,
    uiExpectationsNudgeBand: ui.uiExpectationsNudgeBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-command-ui-inflation" data-testid="command-ui-inflation-panel">
      <h4>Command fusion & UI salience (round 29)</h4>
      <p>
        Fusion {fusion.escalationBand} · index {fusion.fusionIndex.toFixed(0)} · score adj{' '}
        {commandCenterInflationFusionEscalationScoreAdjustment(fusion.escalationBand)}
      </p>
      <p>
        UI nudge {nudge.nudgeBand} · index {nudge.salienceIndex.toFixed(0)} · score adj{' '}
        {uiPlayerInflationSalienceNudgeScoreAdjustment(nudge.nudgeBand)}
      </p>
      <p data-testid="command-ui-note">{fusion.narrative}</p>
      <p>{nudge.narrative}</p>
    </div>
  );
}


// --- source: react/FiscalHouseholdInflationPanel.tsx ---
  assessFiscalIndexationInflationAnchorBreach,
  fiscalIndexationInflationAnchorBreachScoreAdjustment,
} from '../inflation/fiscal-indexation-inflation-anchor-breach.js';
  assessHouseholdWageInflationDeanchoring,
  householdWageInflationDeanchoringScoreAdjustment,
} from '../inflation/household-wage-inflation-deanchoring.js';

export interface FiscalHouseholdInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent07?: Agent07FiscalSnapshot | null;
  agent09?: Agent09HouseholdSnapshot | null;
}

export function FiscalHouseholdInflationPanel(props: FiscalHouseholdInflationPanelProps) {
  const fiscal = props.agent07 ?? {
    turn: props.inputs.turn,
    consolidatedDeficitBand: props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const),
    revenueMomentum: 'weak' as const,
    debtServicePressure: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
    fiscalAnchorBreached: props.inputs.highInflationScenario,
    indexedChargesInflationPassThrough: props.inputs.creditShockActive,
    debtIndexationInflationLatch: props.inputs.householdInflationScenarioActive,
    fiscalPassThroughCascadeBand: props.inputs.systemicLiquidityBand === 'critical' ? ('runaway' as const) : ('building' as const),
  };

  const household = props.agent09 ?? {
    turn: props.inputs.turn,
    laborParticipationBand: 'steady' as const,
    wageGrowthBand: props.inputs.highInflationScenario ? ('surge' as const) : ('elevated' as const),
    costOfLivingStress: props.inputs.publicStability < 42 ? ('extreme' as const) : ('high' as const),
    householdExpectationsDeanchoring: props.inputs.householdInflationScenarioActive,
    wagePriceSpiralLatch: props.inputs.creditShockActive,
    householdDeanchoringBand: props.inputs.fiscalPressure === 'critical' ? ('unmoored' as const) : ('drifting' as const),
  };

  const breach = assessFiscalIndexationInflationAnchorBreach({
    consolidatedDeficitBand: fiscal.consolidatedDeficitBand,
    debtServicePressure: fiscal.debtServicePressure,
    fiscalAnchorBreached: fiscal.fiscalAnchorBreached === true,
    debtIndexationInflationLatch: fiscal.debtIndexationInflationLatch === true,
    fiscalPassThroughCascadeBand: fiscal.fiscalPassThroughCascadeBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const deanchoring = assessHouseholdWageInflationDeanchoring({
    wageGrowthBand: household.wageGrowthBand,
    costOfLivingStress: household.costOfLivingStress,
    householdExpectationsDeanchoring: household.householdExpectationsDeanchoring === true,
    wagePriceSpiralLatch: household.wagePriceSpiralLatch === true,
    householdDeanchoringBand: household.householdDeanchoringBand ?? 'anchored',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-fiscal-household-inflation" data-testid="fiscal-household-inflation-panel">
      <h4>Fiscal indexation & household de-anchoring (round 30)</h4>
      <p>
        Fiscal {breach.breachBand} · index {breach.fiscalIndex.toFixed(0)} · score adj{' '}
        {fiscalIndexationInflationAnchorBreachScoreAdjustment(breach.breachBand)}
      </p>
      <p>
        Household {deanchoring.deanchoringBand} · index {deanchoring.householdIndex.toFixed(0)} · score adj{' '}
        {householdWageInflationDeanchoringScoreAdjustment(deanchoring.deanchoringBand)}
      </p>
      <p data-testid="fiscal-household-note">{breach.narrative}</p>
      <p>{deanchoring.narrative}</p>
    </div>
  );
}


// --- source: react/MarkupTariffInflationPanel.tsx ---
  assessCorporateMarkupInflationCascade,
  corporateMarkupInflationCascadeScoreAdjustment,
} from '../inflation/corporate-markup-inflation-cascade.js';
  assessTradeTariffImportInflationPipeline,
  tradeTariffImportInflationPipelineScoreAdjustment,
} from '../inflation/trade-tariff-import-inflation-pipeline.js';

export interface MarkupTariffInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent08?: Agent08CorporateSnapshot | null;
  agent15?: Agent15TradeSnapshot | null;
}

export function MarkupTariffInflationPanel(props: MarkupTariffInflationPanelProps) {
  const corporate = props.agent08 ?? {
    turn: props.inputs.turn,
    pricingPowerBand: props.inputs.highInflationScenario ? ('dominant' as const) : ('strong' as const),
    marginCompression: props.inputs.creditShockActive ? ('mild' as const) : ('none' as const),
    passThroughIntent: props.inputs.highInflationScenario ? ('full' as const) : ('partial' as const),
    corporatePricingInflationLatch: props.inputs.householdInflationScenarioActive,
    markupPassThroughCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('full' as const) : ('partial' as const),
  };

  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'open' as const,
    exchangeRatePressure: props.inputs.creditShockActive ? ('sharp_depreciation' as const) : ('depreciation' as const),
    commodityImportShare: 0.42,
    importTariffInflationLatch: props.inputs.creditShockActive,
    exchangePipelineStressBand: props.inputs.systemicLiquidityBand === 'critical' ? ('ruptured' as const) : ('stressed' as const),
  };

  const markup = assessCorporateMarkupInflationCascade({
    pricingPowerBand: corporate.pricingPowerBand,
    passThroughIntent: corporate.passThroughIntent,
    marginCompression: corporate.marginCompression,
    corporatePricingInflationLatch: corporate.corporatePricingInflationLatch === true,
    markupPassThroughCascadeBand: corporate.markupPassThroughCascadeBand ?? 'absorbed',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const pipeline = assessTradeTariffImportInflationPipeline({
    tradeOpennessBand: trade.tradeOpennessBand,
    exchangeRatePressure: trade.exchangeRatePressure,
    commodityImportShare: trade.commodityImportShare,
    importTariffInflationLatch: trade.importTariffInflationLatch === true,
    exchangePipelineStressBand: trade.exchangePipelineStressBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-markup-tariff-inflation" data-testid="markup-tariff-inflation-panel">
      <h4>Corporate markup & trade tariff pipeline (round 31)</h4>
      <p>
        Markup {markup.cascadeBand} · index {markup.markupIndex.toFixed(0)} · score adj{' '}
        {corporateMarkupInflationCascadeScoreAdjustment(markup.cascadeBand)}
      </p>
      <p>
        Trade {pipeline.pipelineBand} · index {pipeline.tradeIndex.toFixed(0)} · score adj{' '}
        {tradeTariffImportInflationPipelineScoreAdjustment(pipeline.pipelineBand)}
      </p>
      <p data-testid="markup-tariff-note">{markup.narrative}</p>
      <p>{pipeline.narrative}</p>
    </div>
  );
}


// --- source: react/MetroGridInflationPanel.tsx ---
  assessMetroUrbanRentInflationSurge,
  metroUrbanRentInflationSurgeScoreAdjustment,
} from '../inflation/metro-urban-rent-inflation-surge.js';
  assessWholesaleGridEnergyInflationCascade,
  wholesaleGridEnergyInflationCascadeScoreAdjustment,
} from '../inflation/wholesale-grid-energy-inflation-cascade.js';

export interface MetroGridInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent11?: Agent11CitiesSnapshot | null;
  agent13?: Agent13EnergySnapshot | null;
}

export function MetroGridInflationPanel(props: MetroGridInflationPanelProps) {
  const cities = props.agent11 ?? {
    turn: props.inputs.turn,
    vacancyBand: props.inputs.highInflationScenario ? ('critical' as const) : ('tight' as const),
    rentGrowthBand: props.inputs.householdInflationScenarioActive ? ('surging' as const) : ('strong' as const),
    urbanizationPressure: 'high' as const,
    regionalDispersionScore: 0.62,
    urbanRentInflationLatch: props.inputs.creditShockActive,
    metroDispersionStressBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('widening' as const),
  };

  const energy = props.agent13 ?? {
    turn: props.inputs.turn,
    wholesaleEnergyStress: props.inputs.highInflationScenario ? ('crisis' as const) : ('severe' as const),
    retailTariffShock: props.inputs.creditShockActive,
    gridReliabilityBand: props.inputs.systemicLiquidityBand === 'critical' ? ('fragile' as const) : ('strained' as const),
    emissionsTransitionCostBand: 'medium' as const,
    gridTariffInflationLatch: props.inputs.householdInflationScenarioActive,
    wholesaleStressCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('cascade' as const) : ('stressed' as const),
  };

  const surge = assessMetroUrbanRentInflationSurge({
    vacancyBand: cities.vacancyBand,
    rentGrowthBand: cities.rentGrowthBand,
    urbanizationPressure: cities.urbanizationPressure,
    urbanRentInflationLatch: cities.urbanRentInflationLatch === true,
    metroDispersionStressBand: cities.metroDispersionStressBand ?? 'aligned',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const cascade = assessWholesaleGridEnergyInflationCascade({
    wholesaleEnergyStress: energy.wholesaleEnergyStress,
    retailTariffShock: energy.retailTariffShock,
    gridReliabilityBand: energy.gridReliabilityBand,
    gridTariffInflationLatch: energy.gridTariffInflationLatch === true,
    wholesaleStressCascadeBand: energy.wholesaleStressCascadeBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-metro-grid-inflation" data-testid="metro-grid-inflation-panel">
      <h4>Metro rent surge & grid energy cascade (round 32)</h4>
      <p>
        Metro {surge.surgeBand} · index {surge.metroIndex.toFixed(0)} · score adj{' '}
        {metroUrbanRentInflationSurgeScoreAdjustment(surge.surgeBand)}
      </p>
      <p>
        Grid {cascade.cascadeBand} · index {cascade.energyIndex.toFixed(0)} · score adj{' '}
        {wholesaleGridEnergyInflationCascadeScoreAdjustment(cascade.cascadeBand)}
      </p>
      <p data-testid="metro-grid-note">{surge.narrative}</p>
      <p>{cascade.narrative}</p>
    </div>
  );
}


// --- source: react/GuardianBriefingInflationPanel.tsx ---
  assessGuardianGuardrailInflationEscalation,
  guardianGuardrailInflationEscalationScoreAdjustment,
} from '../inflation/guardian-guardrail-inflation-escalation.js';
  assessTeamConsensusInflationBriefingDrift,
  teamConsensusInflationBriefingDriftScoreAdjustment,
} from '../inflation/team-consensus-inflation-briefing-drift.js';

export interface GuardianBriefingInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent16?: Agent16GuardianSnapshot | null;
  agent18?: Agent18TeamSnapshot | null;
}

export function GuardianBriefingInflationPanel(props: GuardianBriefingInflationPanelProps) {
  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand: props.inputs.publicStability < 42 ? ('urgent' as const) : ('advisory' as const),
    narrativeShockSeverity: props.inputs.creditShockActive ? ('high' as const) : ('medium' as const),
    guardrailInflationLatch: props.inputs.householdInflationScenarioActive,
    copilotEscalationBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const team = props.agent18 ?? {
    turn: props.inputs.turn,
    consensusInflationOutlook: props.inputs.highInflationScenario ? ('upside_risk' as const) : ('reacceleration' as const),
    briefingUrgencyBand: props.inputs.publicStability < 40 ? ('critical' as const) : ('elevated' as const),
    crossDomainStressScore: props.inputs.actorCreditStressIndex ?? 0.55,
    teamBriefingInflationLatch: props.inputs.creditShockActive,
    consensusDriftBand: props.inputs.fiscalPressure === 'critical' ? ('unmoored' as const) : ('drifting' as const),
  };

  const escalation = assessGuardianGuardrailInflationEscalation({
    inflationGuardrailTripped: guardian.inflationGuardrailTripped,
    stabilityInterventionBand: guardian.stabilityInterventionBand,
    narrativeShockSeverity: guardian.narrativeShockSeverity,
    guardrailInflationLatch: guardian.guardrailInflationLatch === true,
    copilotEscalationBand: guardian.copilotEscalationBand ?? 'calm',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const drift = assessTeamConsensusInflationBriefingDrift({
    consensusInflationOutlook: team.consensusInflationOutlook,
    briefingUrgencyBand: team.briefingUrgencyBand,
    crossDomainStressScore: team.crossDomainStressScore,
    teamBriefingInflationLatch: team.teamBriefingInflationLatch === true,
    consensusDriftBand: team.consensusDriftBand ?? 'anchored',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-guardian-briefing-inflation" data-testid="guardian-briefing-inflation-panel">
      <h4>Guardrail escalation & briefing drift (round 33)</h4>
      <p>
        Guardian {escalation.escalationBand} · index {escalation.guardrailIndex.toFixed(0)} · score adj{' '}
        {guardianGuardrailInflationEscalationScoreAdjustment(escalation.escalationBand)}
      </p>
      <p>
        Team {drift.driftBand} · index {drift.briefingIndex.toFixed(0)} · score adj{' '}
        {teamConsensusInflationBriefingDriftScoreAdjustment(drift.driftBand)}
      </p>
      <p data-testid="guardian-briefing-note">{escalation.narrative}</p>
      <p>{drift.narrative}</p>
    </div>
  );
}


// --- source: react/MemoryAutomationInflationPanel.tsx ---
  assessMemoryCommonwealthInflationRecallGate,
  memoryCommonwealthInflationRecallGateScoreAdjustment,
} from '../inflation/memory-commonwealth-inflation-recall-gate.js';
  assessAutomationSynthesisInflationCascadeDrift,
  automationSynthesisInflationCascadeDriftScoreAdjustment,
} from '../inflation/automation-synthesis-inflation-cascade-drift.js';

export interface MemoryAutomationInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent19?: Agent19MemorySnapshot | null;
  agent20?: Agent20AutomationSnapshot | null;
}

export function MemoryAutomationInflationPanel(props: MemoryAutomationInflationPanelProps) {
  const memory = props.agent19 ?? {
    turn: props.inputs.turn,
    recalledInflationRegimeConfidence: props.inputs.highInflationScenario ? 0.82 : 0.45,
    narrativeDriftTowardHigherInflation: props.inputs.creditShockActive,
    explainabilityAlertActive: props.inputs.householdInflationScenarioActive,
    memoryCommonwealthInflationLatch: props.inputs.highInflationScenario,
    realmRecallGateBand: props.inputs.fiscalPressure === 'critical' ? ('breached' as const) : ('opening' as const),
  };

  const automation = props.agent20 ?? {
    turn: props.inputs.turn,
    macroAutopilotInflationBias: props.inputs.highInflationScenario ? ('inflate' as const) : ('neutral' as const),
    unattendedShockDriftActive: props.inputs.creditShockActive,
    automationConfidenceScore: props.inputs.publicStability < 40 ? 0.35 : 0.6,
    synthesisAutopilotInflationLatch: props.inputs.householdInflationScenarioActive,
    cascadeStackDriftBand: props.inputs.systemicLiquidityBand === 'critical' ? ('runaway' as const) : ('stacking' as const),
  };

  const recallGate = assessMemoryCommonwealthInflationRecallGate({
    recalledInflationRegimeConfidence: memory.recalledInflationRegimeConfidence,
    narrativeDriftTowardHigherInflation: memory.narrativeDriftTowardHigherInflation,
    explainabilityAlertActive: memory.explainabilityAlertActive,
    memoryCommonwealthInflationLatch: memory.memoryCommonwealthInflationLatch === true,
    realmRecallGateBand: memory.realmRecallGateBand ?? 'sealed',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const cascadeDrift = assessAutomationSynthesisInflationCascadeDrift({
    macroAutopilotInflationBias: automation.macroAutopilotInflationBias,
    unattendedShockDriftActive: automation.unattendedShockDriftActive,
    automationConfidenceScore: automation.automationConfidenceScore,
    synthesisAutopilotInflationLatch: automation.synthesisAutopilotInflationLatch === true,
    cascadeStackDriftBand: automation.cascadeStackDriftBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-memory-automation-inflation" data-testid="memory-automation-inflation-panel">
      <h4>Commonwealth recall gate & synthesis cascade (round 34)</h4>
      <p>
        Memory {recallGate.gateBand} · index {recallGate.recallIndex.toFixed(0)} · score adj{' '}
        {memoryCommonwealthInflationRecallGateScoreAdjustment(recallGate.gateBand)}
      </p>
      <p>
        Automation {cascadeDrift.driftBand} · index {cascadeDrift.synthesisIndex.toFixed(0)} · score adj{' '}
        {automationSynthesisInflationCascadeDriftScoreAdjustment(cascadeDrift.driftBand)}
      </p>
      <p data-testid="memory-automation-note">{recallGate.narrative}</p>
      <p>{cascadeDrift.narrative}</p>
    </div>
  );
}


// --- source: react/UiDashboardInflationPanel.tsx ---
  assessUiShellInflationSalienceEscalation,
  uiShellInflationSalienceEscalationScoreAdjustment,
} from '../inflation/ui-shell-inflation-salience-escalation.js';
  assessDashboardHeatmapInflationOverlayCascade,
  dashboardHeatmapInflationOverlayCascadeScoreAdjustment,
} from '../inflation/dashboard-heatmap-inflation-overlay-cascade.js';

export interface UiDashboardInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent22?: Agent22UiSnapshot | null;
  agent23?: Agent23DashboardsSnapshot | null;
}

export function UiDashboardInflationPanel(props: UiDashboardInflationPanelProps) {
  const ui = props.agent22 ?? {
    turn: props.inputs.turn,
    inflationDashboardStressHighlight: props.inputs.highInflationScenario,
    playerAttentionOnCostOfLiving: props.inputs.householdInflationScenarioActive ? ('high' as const) : ('medium' as const),
    uiNudgeInflationExpectationsUp: props.inputs.creditShockActive,
    wave35SalienceEscalationLatch: props.inputs.householdInflationScenarioActive,
    shellExpectationsEscalationBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('building' as const),
  };

  const dashboards = props.agent23 ?? {
    turn: props.inputs.turn,
    regionalHeatmapInflationAlert: props.inputs.highInflationScenario,
    mapLayerCostPressureScore: props.inputs.actorCreditStressIndex ?? 0.55,
    dashboardRefreshUrgency: props.inputs.publicStability < 42 ? ('critical' as const) : ('elevated' as const),
    regionalInflationOverlayLatch: props.inputs.creditShockActive,
    heatmapOverlayCascadeBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('widening' as const),
  };

  const salience = assessUiShellInflationSalienceEscalation({
    inflationDashboardStressHighlight: ui.inflationDashboardStressHighlight,
    playerAttentionOnCostOfLiving: ui.playerAttentionOnCostOfLiving,
    uiNudgeInflationExpectationsUp: ui.uiNudgeInflationExpectationsUp,
    wave35SalienceEscalationLatch: ui.wave35SalienceEscalationLatch === true,
    shellExpectationsEscalationBand: ui.shellExpectationsEscalationBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const overlay = assessDashboardHeatmapInflationOverlayCascade({
    regionalHeatmapInflationAlert: dashboards.regionalHeatmapInflationAlert,
    mapLayerCostPressureScore: dashboards.mapLayerCostPressureScore,
    dashboardRefreshUrgency: dashboards.dashboardRefreshUrgency,
    regionalInflationOverlayLatch: dashboards.regionalInflationOverlayLatch === true,
    heatmapOverlayCascadeBand: dashboards.heatmapOverlayCascadeBand ?? 'routine',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-ui-dashboard-inflation" data-testid="ui-dashboard-inflation-panel">
      <h4>UI salience escalation & heatmap overlay (round 35)</h4>
      <p>
        UI {salience.escalationBand} · index {salience.salienceIndex.toFixed(0)} · score adj{' '}
        {uiShellInflationSalienceEscalationScoreAdjustment(salience.escalationBand)}
      </p>
      <p>
        Dashboard {overlay.cascadeBand} · index {overlay.overlayIndex.toFixed(0)} · score adj{' '}
        {dashboardHeatmapInflationOverlayCascadeScoreAdjustment(overlay.cascadeBand)}
      </p>
      <p data-testid="ui-dashboard-note">{salience.narrative}</p>
      <p>{overlay.narrative}</p>
    </div>
  );
}


// --- source: react/CommandTransportInflationPanel.tsx ---
  assessCommandCenterInflationFusionLatch,
  commandCenterInflationFusionLatchScoreAdjustment,
} from '../inflation/command-center-inflation-fusion-latch.js';
  assessTransportFreightInflationCongestionCascade,
  transportFreightInflationCongestionCascadeScoreAdjustment,
} from '../inflation/transport-freight-inflation-congestion-cascade.js';

export interface CommandTransportInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent17?: Agent17CommandSnapshot | null;
  agent12?: Agent12TransportSnapshot | null;
}

export function CommandTransportInflationPanel(props: CommandTransportInflationPanelProps) {
  const command = props.agent17 ?? {
    turn: props.inputs.turn,
    macroAlertLevel: props.inputs.highInflationScenario ? ('red' as const) : ('amber' as const),
    inflationFusionScore: props.inputs.actorCreditStressIndex ?? 0.55,
    coordinatedTighteningSuggested: props.inputs.creditShockActive,
    wave36FusionLatch: props.inputs.householdInflationScenarioActive,
    commandInflationEscalationBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('tight' as const),
    fuelSurchargeActive: props.inputs.creditShockActive,
    portBacklogBand: props.inputs.publicStability < 42 ? ('severe' as const) : ('moderate' as const),
    logisticsInflationScenarioActive: props.inputs.highInflationScenario,
    wave36LogisticsInflationLatch: props.inputs.householdInflationScenarioActive,
    freightCascadeCongestionBand: props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const fusion = assessCommandCenterInflationFusionLatch({
    macroAlertLevel: command.macroAlertLevel,
    inflationFusionScore: command.inflationFusionScore,
    coordinatedTighteningSuggested: command.coordinatedTighteningSuggested,
    wave36FusionLatch: command.wave36FusionLatch === true,
    commandInflationEscalationBand: command.commandInflationEscalationBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const cascade = assessTransportFreightInflationCongestionCascade({
    freightCapacityBand: transport.freightCapacityBand,
    fuelSurchargeActive: transport.fuelSurchargeActive,
    portBacklogBand: transport.portBacklogBand,
    wave36LogisticsInflationLatch: transport.wave36LogisticsInflationLatch === true,
    freightCascadeCongestionBand: transport.freightCascadeCongestionBand ?? 'clear',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-command-transport-inflation" data-testid="command-transport-inflation-panel">
      <h4>Command fusion latch & freight congestion (round 36)</h4>
      <p>
        Command {fusion.latchBand} · index {fusion.fusionIndex.toFixed(0)} · score adj{' '}
        {commandCenterInflationFusionLatchScoreAdjustment(fusion.latchBand)}
      </p>
      <p>
        Transport {cascade.cascadeBand} · index {cascade.congestionIndex.toFixed(0)} · score adj{' '}
        {transportFreightInflationCongestionCascadeScoreAdjustment(cascade.cascadeBand)}
      </p>
      <p data-testid="command-transport-note">{fusion.narrative}</p>
      <p>{cascade.narrative}</p>
    </div>
  );
}


// --- source: react/EventsModesInflationPanel.tsx ---
  assessEventsStagedInflationShockPersistence,
  eventsStagedInflationShockPersistenceScoreAdjustment,
} from '../inflation/events-staged-inflation-shock-persistence.js';
  assessModesSandboxInflationStressCascade,
  modesSandboxInflationStressCascadeScoreAdjustment,
} from '../inflation/modes-sandbox-inflation-stress-cascade.js';

export interface EventsModesInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent05?: Agent05EventsSnapshot | null;
  agent04?: Agent04ModesSnapshot | null;
}

export function EventsModesInflationPanel(props: EventsModesInflationPanelProps) {
  const events = props.agent05 ?? {
    turn: props.inputs.turn,
    inflationShockEventActive: props.inputs.highInflationScenario,
    supplyDisruptionSeverity: props.inputs.creditShockActive ? ('national' as const) : ('localized' as const),
    confidenceShockBand: props.inputs.publicStability < 42 ? ('severe' as const) : ('uneasy' as const),
    wave37EventInflationLatch: props.inputs.creditShockActive,
    stagedShockPersistenceBand: props.inputs.fiscalPressure === 'critical' ? ('entrenched' as const) : ('building' as const),
  };

  const modes = props.agent04 ?? {
    turn: props.inputs.turn,
    scenarioInflationBias: props.inputs.highInflationScenario ? ('extreme' as const) : ('inflationary' as const),
    sandboxStressModeActive: props.inputs.householdInflationScenarioActive,
    difficultyCostMultiplier: props.inputs.inflationSettingMultiplier ?? 1.1,
    wave37SandboxInflationLatch: props.inputs.householdInflationScenarioActive,
    scenarioBiasCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('runaway' as const) : ('stressed' as const),
  };

  const persistence = assessEventsStagedInflationShockPersistence({
    inflationShockEventActive: events.inflationShockEventActive,
    supplyDisruptionSeverity: events.supplyDisruptionSeverity,
    confidenceShockBand: events.confidenceShockBand,
    wave37EventInflationLatch: events.wave37EventInflationLatch === true,
    stagedShockPersistenceBand: events.stagedShockPersistenceBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const cascade = assessModesSandboxInflationStressCascade({
    scenarioInflationBias: modes.scenarioInflationBias,
    sandboxStressModeActive: modes.sandboxStressModeActive,
    difficultyCostMultiplier: modes.difficultyCostMultiplier,
    wave37SandboxInflationLatch: modes.wave37SandboxInflationLatch === true,
    scenarioBiasCascadeBand: modes.scenarioBiasCascadeBand ?? 'routine',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-events-modes-inflation" data-testid="events-modes-inflation-panel">
      <h4>Event shock persistence & sandbox stress (round 37)</h4>
      <p>
        Events {persistence.persistenceBand} · index {persistence.shockIndex.toFixed(0)} · score adj{' '}
        {eventsStagedInflationShockPersistenceScoreAdjustment(persistence.persistenceBand)}
      </p>
      <p>
        Modes {cascade.cascadeBand} · index {cascade.stressIndex.toFixed(0)} · score adj{' '}
        {modesSandboxInflationStressCascadeScoreAdjustment(cascade.cascadeBand)}
      </p>
      <p data-testid="events-modes-note">{persistence.narrative}</p>
      <p>{cascade.narrative}</p>
    </div>
  );
}


// --- source: react/FiscalHouseholdBudgetInflationPanel.tsx ---
  assessFiscalAppropriationInflationPressureLatch,
  fiscalAppropriationInflationPressureLatchScoreAdjustment,
} from '../inflation/fiscal-appropriation-inflation-pressure-latch.js';
  assessHouseholdBudgetInflationStressCascade,
  householdBudgetInflationStressCascadeScoreAdjustment,
} from '../inflation/household-budget-inflation-stress-cascade.js';

export interface FiscalHouseholdBudgetInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent07?: Agent07FiscalSnapshot | null;
  agent09?: Agent09HouseholdSnapshot | null;
}

export function FiscalHouseholdBudgetInflationPanel(props: FiscalHouseholdBudgetInflationPanelProps) {
  const fiscal = props.agent07 ?? {
    turn: props.inputs.turn,
    consolidatedDeficitBand: props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const),
    revenueMomentum: props.inputs.creditShockActive ? ('weak' as const) : ('steady' as const),
    debtServicePressure: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
    wave38AppropriationInflationLatch: props.inputs.highInflationScenario,
    fiscalPressureEscalationBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const household = props.agent09 ?? {
    turn: props.inputs.turn,
    laborParticipationBand: 'steady' as const,
    wageGrowthBand: props.inputs.householdInflationScenarioActive ? ('surge' as const) : ('elevated' as const),
    costOfLivingStress: props.inputs.publicStability < 42 ? ('extreme' as const) : ('high' as const),
    wave38BudgetInflationLatch: props.inputs.householdInflationScenarioActive,
    householdStressCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const appropriation = assessFiscalAppropriationInflationPressureLatch({
    consolidatedDeficitBand: fiscal.consolidatedDeficitBand,
    debtServicePressure: fiscal.debtServicePressure,
    wave38AppropriationInflationLatch: fiscal.wave38AppropriationInflationLatch === true,
    fiscalPressureEscalationBand: fiscal.fiscalPressureEscalationBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const budget = assessHouseholdBudgetInflationStressCascade({
    wageGrowthBand: household.wageGrowthBand,
    costOfLivingStress: household.costOfLivingStress,
    wave38BudgetInflationLatch: household.wave38BudgetInflationLatch === true,
    householdStressCascadeBand: household.householdStressCascadeBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-fiscal-household-budget-inflation" data-testid="fiscal-household-budget-inflation-panel">
      <h4>Appropriation latch & budget stress (round 38)</h4>
      <p>
        Fiscal {appropriation.latchBand} · index {appropriation.pressureIndex.toFixed(0)} · score adj{' '}
        {fiscalAppropriationInflationPressureLatchScoreAdjustment(appropriation.latchBand)}
      </p>
      <p>
        Household {budget.cascadeBand} · index {budget.stressIndex.toFixed(0)} · score adj{' '}
        {householdBudgetInflationStressCascadeScoreAdjustment(budget.cascadeBand)}
      </p>
      <p data-testid="fiscal-household-budget-note">{appropriation.narrative}</p>
      <p>{budget.narrative}</p>
    </div>
  );
}


// --- source: react/CorporateTradeWaveInflationPanel.tsx ---
  assessCorporateSurvivalPricingInflationLatch,
  corporateSurvivalPricingInflationLatchScoreAdjustment,
} from '../inflation/corporate-survival-pricing-inflation-latch.js';
  assessTradeTariffExchangeInflationEscalation,
  tradeTariffExchangeInflationEscalationScoreAdjustment,
} from '../inflation/trade-tariff-exchange-inflation-escalation.js';

export interface CorporateTradeWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent08?: Agent08CorporateSnapshot | null;
  agent15?: Agent15TradeSnapshot | null;
}

export function CorporateTradeWaveInflationPanel(props: CorporateTradeWaveInflationPanelProps) {
  const corporate = props.agent08 ?? {
    turn: props.inputs.turn,
    pricingPowerBand: props.inputs.highInflationScenario ? ('dominant' as const) : ('strong' as const),
    marginCompression: props.inputs.creditShockActive ? ('severe' as const) : ('mild' as const),
    passThroughIntent: props.inputs.fiscalPressure === 'critical' ? ('full' as const) : ('partial' as const),
    wave39SurvivalPricingLatch: props.inputs.householdInflationScenarioActive,
    corporateMarkupEscalationBand: props.inputs.systemicLiquidityBand === 'critical' ? ('dominant' as const) : ('building' as const),
  };

  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'open' as const,
    exchangeRatePressure: props.inputs.creditShockActive ? ('sharp_depreciation' as const) : ('depreciation' as const),
    commodityImportShare: 0.42,
    wave39TariffExchangeLatch: props.inputs.creditShockActive,
    importExchangeEscalationBand: props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('stressed' as const),
  };

  const pricing = assessCorporateSurvivalPricingInflationLatch({
    pricingPowerBand: corporate.pricingPowerBand,
    passThroughIntent: corporate.passThroughIntent,
    marginCompression: corporate.marginCompression,
    wave39SurvivalPricingLatch: corporate.wave39SurvivalPricingLatch === true,
    corporateMarkupEscalationBand: corporate.corporateMarkupEscalationBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const exchange = assessTradeTariffExchangeInflationEscalation({
    exchangeRatePressure: trade.exchangeRatePressure,
    tradeOpennessBand: trade.tradeOpennessBand,
    commodityImportShare: trade.commodityImportShare,
    wave39TariffExchangeLatch: trade.wave39TariffExchangeLatch === true,
    importExchangeEscalationBand: trade.importExchangeEscalationBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-corporate-trade-wave-inflation" data-testid="corporate-trade-wave-inflation-panel">
      <h4>Survival pricing latch & tariff exchange (round 39)</h4>
      <p>
        Corporate {pricing.latchBand} · index {pricing.pricingIndex.toFixed(0)} · score adj{' '}
        {corporateSurvivalPricingInflationLatchScoreAdjustment(pricing.latchBand)}
      </p>
      <p>
        Trade {exchange.escalationBand} · index {exchange.exchangeIndex.toFixed(0)} · score adj{' '}
        {tradeTariffExchangeInflationEscalationScoreAdjustment(exchange.escalationBand)}
      </p>
      <p data-testid="corporate-trade-wave-note">{pricing.narrative}</p>
      <p>{exchange.narrative}</p>
    </div>
  );
}


// --- source: react/CitiesEnergyWaveInflationPanel.tsx ---
  assessMetroCapacityRentInflationLatch,
  metroCapacityRentInflationLatchScoreAdjustment,
} from '../inflation/metro-capacity-rent-inflation-latch.js';
  assessGridWholesaleTariffInflationSurge,
  gridWholesaleTariffInflationSurgeScoreAdjustment,
} from '../inflation/grid-wholesale-tariff-inflation-surge.js';

export interface CitiesEnergyWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent11?: Agent11CitiesSnapshot | null;
  agent13?: Agent13EnergySnapshot | null;
}

export function CitiesEnergyWaveInflationPanel(props: CitiesEnergyWaveInflationPanelProps) {
  const cities = props.agent11 ?? {
    turn: props.inputs.turn,
    vacancyBand: props.inputs.householdInflationScenarioActive ? ('critical' as const) : ('tight' as const),
    rentGrowthBand: props.inputs.highInflationScenario ? ('surging' as const) : ('strong' as const),
    urbanizationPressure: 'high' as const,
    regionalDispersionScore: 0.6,
    wave40UrbanRentLatch: props.inputs.householdInflationScenarioActive,
    metroCapacityStressBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('strained' as const),
  };

  const energy = props.agent13 ?? {
    turn: props.inputs.turn,
    wholesaleEnergyStress: props.inputs.systemicLiquidityBand === 'critical' ? ('crisis' as const) : ('severe' as const),
    retailTariffShock: props.inputs.creditShockActive,
    gridReliabilityBand: props.inputs.publicStability < 40 ? ('fragile' as const) : ('strained' as const),
    emissionsTransitionCostBand: 'medium' as const,
    wave40GridTariffLatch: props.inputs.creditShockActive,
    wholesaleTariffCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('cascade' as const) : ('stressed' as const),
  };

  const metro = assessMetroCapacityRentInflationLatch({
    vacancyBand: cities.vacancyBand,
    rentGrowthBand: cities.rentGrowthBand,
    wave40UrbanRentLatch: cities.wave40UrbanRentLatch === true,
    metroCapacityStressBand: cities.metroCapacityStressBand ?? 'aligned',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const grid = assessGridWholesaleTariffInflationSurge({
    wholesaleEnergyStress: energy.wholesaleEnergyStress,
    retailTariffShock: energy.retailTariffShock,
    wave40GridTariffLatch: energy.wave40GridTariffLatch === true,
    wholesaleTariffCascadeBand: energy.wholesaleTariffCascadeBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-cities-energy-wave-inflation" data-testid="cities-energy-wave-inflation-panel">
      <h4>Metro capacity latch & grid tariff surge (round 40)</h4>
      <p>
        Metro {metro.latchBand} · index {metro.capacityIndex.toFixed(0)} · score adj{' '}
        {metroCapacityRentInflationLatchScoreAdjustment(metro.latchBand)}
      </p>
      <p>
        Grid {grid.surgeBand} · index {grid.tariffIndex.toFixed(0)} · score adj{' '}
        {gridWholesaleTariffInflationSurgeScoreAdjustment(grid.surgeBand)}
      </p>
      <p data-testid="cities-energy-wave-note">{metro.narrative}</p>
      <p>{grid.narrative}</p>
    </div>
  );
}


// --- source: react/GuardianTeamWaveInflationPanel.tsx ---
  assessGuardianCopilotInflationPressureLatch,
  guardianCopilotInflationPressureLatchScoreAdjustment,
} from '../inflation/guardian-copilot-inflation-pressure-latch.js';
  assessTeamBriefingConsensusInflationUnmooring,
  teamBriefingConsensusInflationUnmooringScoreAdjustment,
} from '../inflation/team-briefing-consensus-inflation-unmooring.js';

export interface GuardianTeamWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent16?: Agent16GuardianSnapshot | null;
  agent18?: Agent18TeamSnapshot | null;
}

export function GuardianTeamWaveInflationPanel(props: GuardianTeamWaveInflationPanelProps) {
  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand: props.inputs.fiscalPressure === 'critical' ? ('urgent' as const) : ('advisory' as const),
    narrativeShockSeverity: props.inputs.publicStability < 40 ? ('high' as const) : ('medium' as const),
    wave41GuardianPressureLatch: props.inputs.householdInflationScenarioActive,
    copilotPressureEscalationBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('runaway' as const) : ('elevated' as const),
  };

  const team = props.agent18 ?? {
    turn: props.inputs.turn,
    consensusInflationOutlook: props.inputs.highInflationScenario ? ('upside_risk' as const) : ('reacceleration' as const),
    briefingUrgencyBand: props.inputs.creditShockActive ? ('critical' as const) : ('elevated' as const),
    crossDomainStressScore: 0.65,
    wave41TeamConsensusLatch: props.inputs.creditShockActive,
    briefingConsensusUnmoorBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('drifting' as const),
  };

  const pressure = assessGuardianCopilotInflationPressureLatch({
    inflationGuardrailTripped: guardian.inflationGuardrailTripped,
    stabilityInterventionBand: guardian.stabilityInterventionBand,
    wave41GuardianPressureLatch: guardian.wave41GuardianPressureLatch === true,
    copilotPressureEscalationBand: guardian.copilotPressureEscalationBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const unmooring = assessTeamBriefingConsensusInflationUnmooring({
    consensusInflationOutlook: team.consensusInflationOutlook,
    briefingUrgencyBand: team.briefingUrgencyBand,
    wave41TeamConsensusLatch: team.wave41TeamConsensusLatch === true,
    briefingConsensusUnmoorBand: team.briefingConsensusUnmoorBand ?? 'anchored',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-guardian-team-wave-inflation" data-testid="guardian-team-wave-inflation-panel">
      <h4>Guardian co-pilot latch & team consensus unmooring (round 41)</h4>
      <p>
        Guardian {pressure.latchBand} · index {pressure.pressureIndex.toFixed(0)} · score adj{' '}
        {guardianCopilotInflationPressureLatchScoreAdjustment(pressure.latchBand)}
      </p>
      <p>
        Team {unmooring.unmooringBand} · index {unmooring.consensusIndex.toFixed(0)} · score adj{' '}
        {teamBriefingConsensusInflationUnmooringScoreAdjustment(unmooring.unmooringBand)}
      </p>
      <p data-testid="guardian-team-wave-note">{pressure.narrative}</p>
      <p>{unmooring.narrative}</p>
    </div>
  );
}


// --- source: react/MemoryAutomationWaveInflationPanel.tsx ---
  assessMemoryRealmInflationPersistenceLatch,
  memoryRealmInflationPersistenceLatchScoreAdjustment,
} from '../inflation/memory-realm-inflation-persistence-latch.js';
  assessAutomationSynthesisInflationCascadeSurge,
  automationSynthesisInflationCascadeSurgeScoreAdjustment,
} from '../inflation/automation-synthesis-inflation-cascade-surge.js';

export interface MemoryAutomationWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent19?: Agent19MemorySnapshot | null;
  agent20?: Agent20AutomationSnapshot | null;
}

export function MemoryAutomationWaveInflationPanel(props: MemoryAutomationWaveInflationPanelProps) {
  const memory = props.agent19 ?? {
    turn: props.inputs.turn,
    recalledInflationRegimeConfidence: props.inputs.highInflationScenario ? 0.82 : 0.55,
    narrativeDriftTowardHigherInflation: props.inputs.highInflationScenario,
    explainabilityAlertActive: props.inputs.creditShockActive,
    wave42MemoryRecallLatch: props.inputs.householdInflationScenarioActive,
    realmPersistenceGateBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('slipping' as const),
  };

  const automation = props.agent20 ?? {
    turn: props.inputs.turn,
    macroAutopilotInflationBias: props.inputs.highInflationScenario ? ('inflate' as const) : ('neutral' as const),
    unattendedShockDriftActive: props.inputs.creditShockActive,
    automationConfidenceScore: 0.4,
    wave42SynthesisCascadeLatch: props.inputs.creditShockActive,
    autopilotStackSurgeBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('surge' as const) : ('stacking' as const),
  };

  const realm = assessMemoryRealmInflationPersistenceLatch({
    recalledInflationRegimeConfidence: memory.recalledInflationRegimeConfidence,
    narrativeDriftTowardHigherInflation: memory.narrativeDriftTowardHigherInflation,
    wave42MemoryRecallLatch: memory.wave42MemoryRecallLatch === true,
    realmPersistenceGateBand: memory.realmPersistenceGateBand ?? 'anchored',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const cascade = assessAutomationSynthesisInflationCascadeSurge({
    macroAutopilotInflationBias: automation.macroAutopilotInflationBias,
    unattendedShockDriftActive: automation.unattendedShockDriftActive,
    wave42SynthesisCascadeLatch: automation.wave42SynthesisCascadeLatch === true,
    autopilotStackSurgeBand: automation.autopilotStackSurgeBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-memory-automation-wave-inflation" data-testid="memory-automation-wave-inflation-panel">
      <h4>Memory realm latch & automation cascade surge (round 42)</h4>
      <p>
        Memory {realm.latchBand} · index {realm.persistenceIndex.toFixed(0)} · score adj{' '}
        {memoryRealmInflationPersistenceLatchScoreAdjustment(realm.latchBand)}
      </p>
      <p>
        Automation {cascade.surgeBand} · index {cascade.cascadeIndex.toFixed(0)} · score adj{' '}
        {automationSynthesisInflationCascadeSurgeScoreAdjustment(cascade.surgeBand)}
      </p>
      <p data-testid="memory-automation-wave-note">{realm.narrative}</p>
      <p>{cascade.narrative}</p>
    </div>
  );
}


// --- source: react/UiDashboardWaveInflationPanel.tsx ---
  assessUiShellInflationAttentionLatch,
  uiShellInflationAttentionLatchScoreAdjustment,
} from '../inflation/ui-shell-inflation-attention-latch.js';
  assessDashboardRegionalInflationOverlaySurge,
  dashboardRegionalInflationOverlaySurgeScoreAdjustment,
} from '../inflation/dashboard-regional-inflation-overlay-surge.js';

export interface UiDashboardWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent22?: Agent22UiSnapshot | null;
  agent23?: Agent23DashboardsSnapshot | null;
}

export function UiDashboardWaveInflationPanel(props: UiDashboardWaveInflationPanelProps) {
  const ui = props.agent22 ?? {
    turn: props.inputs.turn,
    inflationDashboardStressHighlight: props.inputs.highInflationScenario,
    playerAttentionOnCostOfLiving: props.inputs.householdInflationScenarioActive ? ('high' as const) : ('medium' as const),
    uiNudgeInflationExpectationsUp: props.inputs.creditShockActive,
    wave43ShellAttentionLatch: props.inputs.householdInflationScenarioActive,
    playerSaliencePressureBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const dashboards = props.agent23 ?? {
    turn: props.inputs.turn,
    regionalHeatmapInflationAlert: props.inputs.highInflationScenario,
    mapLayerCostPressureScore: 0.7,
    dashboardRefreshUrgency: props.inputs.creditShockActive ? ('critical' as const) : ('elevated' as const),
    wave43HeatmapOverlayLatch: props.inputs.creditShockActive,
    regionalOverlaySurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('surge' as const) : ('widening' as const),
  };

  const attention = assessUiShellInflationAttentionLatch({
    inflationDashboardStressHighlight: ui.inflationDashboardStressHighlight,
    playerAttentionOnCostOfLiving: ui.playerAttentionOnCostOfLiving,
    wave43ShellAttentionLatch: ui.wave43ShellAttentionLatch === true,
    playerSaliencePressureBand: ui.playerSaliencePressureBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const overlay = assessDashboardRegionalInflationOverlaySurge({
    regionalHeatmapInflationAlert: dashboards.regionalHeatmapInflationAlert,
    mapLayerCostPressureScore: dashboards.mapLayerCostPressureScore,
    wave43HeatmapOverlayLatch: dashboards.wave43HeatmapOverlayLatch === true,
    regionalOverlaySurgeBand: dashboards.regionalOverlaySurgeBand ?? 'routine',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-ui-dashboard-wave-inflation" data-testid="ui-dashboard-wave-inflation-panel">
      <h4>UI shell attention latch & regional overlay surge (round 43)</h4>
      <p>
        UI {attention.latchBand} · index {attention.attentionIndex.toFixed(0)} · score adj{' '}
        {uiShellInflationAttentionLatchScoreAdjustment(attention.latchBand)}
      </p>
      <p>
        Dashboard {overlay.surgeBand} · index {overlay.overlayIndex.toFixed(0)} · score adj{' '}
        {dashboardRegionalInflationOverlaySurgeScoreAdjustment(overlay.surgeBand)}
      </p>
      <p data-testid="ui-dashboard-wave-note">{attention.narrative}</p>
      <p>{overlay.narrative}</p>
    </div>
  );
}


// --- source: react/CommandTransportWaveInflationPanel.tsx ---
  assessCommandCenterInflationAlertPressureLatch,
  commandCenterInflationAlertPressureLatchScoreAdjustment,
} from '../inflation/command-center-inflation-alert-pressure-latch.js';
  assessTransportFreightInflationGridlockSurge,
  transportFreightInflationGridlockSurgeScoreAdjustment,
} from '../inflation/transport-freight-inflation-gridlock-surge.js';

export interface CommandTransportWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent17?: Agent17CommandSnapshot | null;
  agent12?: Agent12TransportSnapshot | null;
}

export function CommandTransportWaveInflationPanel(props: CommandTransportWaveInflationPanelProps) {
  const command = props.agent17 ?? {
    turn: props.inputs.turn,
    macroAlertLevel: props.inputs.highInflationScenario ? ('red' as const) : ('amber' as const),
    inflationFusionScore: 0.75,
    coordinatedTighteningSuggested: props.inputs.creditShockActive,
    wave44CommandAlertLatch: props.inputs.householdInflationScenarioActive,
    commandAlertPressureBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('tight' as const),
    fuelSurchargeActive: props.inputs.creditShockActive,
    portBacklogBand: props.inputs.highInflationScenario ? ('severe' as const) : ('moderate' as const),
    logisticsInflationScenarioActive: props.inputs.highInflationScenario,
    wave44FreightGridlockLatch: props.inputs.creditShockActive,
    freightGridlockSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const alert = assessCommandCenterInflationAlertPressureLatch({
    macroAlertLevel: command.macroAlertLevel,
    inflationFusionScore: command.inflationFusionScore,
    wave44CommandAlertLatch: command.wave44CommandAlertLatch === true,
    commandAlertPressureBand: command.commandAlertPressureBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const gridlock = assessTransportFreightInflationGridlockSurge({
    freightCapacityBand: transport.freightCapacityBand,
    fuelSurchargeActive: transport.fuelSurchargeActive,
    wave44FreightGridlockLatch: transport.wave44FreightGridlockLatch === true,
    freightGridlockSurgeBand: transport.freightGridlockSurgeBand ?? 'clear',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-command-transport-wave-inflation" data-testid="command-transport-wave-inflation-panel">
      <h4>Command alert latch & freight gridlock surge (round 44)</h4>
      <p>
        Command {alert.latchBand} · index {alert.alertIndex.toFixed(0)} · score adj{' '}
        {commandCenterInflationAlertPressureLatchScoreAdjustment(alert.latchBand)}
      </p>
      <p>
        Freight {gridlock.surgeBand} · index {gridlock.gridlockIndex.toFixed(0)} · score adj{' '}
        {transportFreightInflationGridlockSurgeScoreAdjustment(gridlock.surgeBand)}
      </p>
      <p data-testid="command-transport-wave-note">{alert.narrative}</p>
      <p>{gridlock.narrative}</p>
    </div>
  );
}


// --- source: react/EventsModesWaveInflationPanel.tsx ---
  assessEventsNarrativeInflationShockLatch,
  eventsNarrativeInflationShockLatchScoreAdjustment,
} from '../inflation/events-narrative-inflation-shock-latch.js';
  assessModesSandboxInflationPressureSurge,
  modesSandboxInflationPressureSurgeScoreAdjustment,
} from '../inflation/modes-sandbox-inflation-pressure-surge.js';

export interface EventsModesWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent05?: Agent05EventsSnapshot | null;
  agent04?: Agent04ModesSnapshot | null;
}

export function EventsModesWaveInflationPanel(props: EventsModesWaveInflationPanelProps) {
  const events = props.agent05 ?? {
    turn: props.inputs.turn,
    inflationShockEventActive: props.inputs.highInflationScenario,
    supplyDisruptionSeverity: props.inputs.fiscalPressure === 'critical' ? ('national' as const) : ('localized' as const),
    confidenceShockBand: props.inputs.creditShockActive ? ('severe' as const) : ('uneasy' as const),
    wave45EventShockLatch: props.inputs.householdInflationScenarioActive,
    narrativeShockEntrenchBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('entrenched' as const) : ('building' as const),
  };

  const modes = props.agent04 ?? {
    turn: props.inputs.turn,
    scenarioInflationBias: props.inputs.highInflationScenario ? ('extreme' as const) : ('inflationary' as const),
    sandboxStressModeActive: props.inputs.householdInflationScenarioActive,
    difficultyCostMultiplier: props.inputs.inflationSettingMultiplier ?? 1.1,
    wave45SandboxPressureLatch: props.inputs.creditShockActive,
    scenarioStressSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('surge' as const) : ('stressed' as const),
  };

  const shock = assessEventsNarrativeInflationShockLatch({
    inflationShockEventActive: events.inflationShockEventActive,
    supplyDisruptionSeverity: events.supplyDisruptionSeverity,
    wave45EventShockLatch: events.wave45EventShockLatch === true,
    narrativeShockEntrenchBand: events.narrativeShockEntrenchBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const pressure = assessModesSandboxInflationPressureSurge({
    scenarioInflationBias: modes.scenarioInflationBias,
    sandboxStressModeActive: modes.sandboxStressModeActive,
    wave45SandboxPressureLatch: modes.wave45SandboxPressureLatch === true,
    scenarioStressSurgeBand: modes.scenarioStressSurgeBand ?? 'routine',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-events-modes-wave-inflation" data-testid="events-modes-wave-inflation-panel">
      <h4>Events shock latch & modes pressure surge (round 45)</h4>
      <p>
        Events {shock.latchBand} · index {shock.shockIndex.toFixed(0)} · score adj{' '}
        {eventsNarrativeInflationShockLatchScoreAdjustment(shock.latchBand)}
      </p>
      <p>
        Modes {pressure.surgeBand} · index {pressure.pressureIndex.toFixed(0)} · score adj{' '}
        {modesSandboxInflationPressureSurgeScoreAdjustment(pressure.surgeBand)}
      </p>
      <p data-testid="events-modes-wave-note">{shock.narrative}</p>
      <p>{pressure.narrative}</p>
    </div>
  );
}


// --- source: react/FiscalHouseholdWaveInflationPanel.tsx ---
  assessFiscalConsolidatedInflationPressureLatch,
  fiscalConsolidatedInflationPressureLatchScoreAdjustment,
} from '../inflation/fiscal-consolidated-inflation-pressure-latch.js';
  assessHouseholdWageInflationStressSurge,
  householdWageInflationStressSurgeScoreAdjustment,
} from '../inflation/household-wage-inflation-stress-surge.js';

export interface FiscalHouseholdWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent07?: Agent07FiscalSnapshot | null;
  agent09?: Agent09HouseholdSnapshot | null;
}

export function FiscalHouseholdWaveInflationPanel(props: FiscalHouseholdWaveInflationPanelProps) {
  const fiscal = props.agent07 ?? {
    turn: props.inputs.turn,
    consolidatedDeficitBand: props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const),
    revenueMomentum: 'weak' as const,
    debtServicePressure: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
    wave46FiscalPressureLatch: props.inputs.householdInflationScenarioActive,
    consolidatedDeficitEscalationBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const household = props.agent09 ?? {
    turn: props.inputs.turn,
    laborParticipationBand: 'steady' as const,
    wageGrowthBand: props.inputs.highInflationScenario ? ('surge' as const) : ('elevated' as const),
    costOfLivingStress: props.inputs.publicStability < 40 ? ('extreme' as const) : ('high' as const),
    wave46HouseholdStressLatch: props.inputs.creditShockActive,
    wageStressSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const pressure = assessFiscalConsolidatedInflationPressureLatch({
    consolidatedDeficitBand: fiscal.consolidatedDeficitBand,
    debtServicePressure: fiscal.debtServicePressure,
    wave46FiscalPressureLatch: fiscal.wave46FiscalPressureLatch === true,
    consolidatedDeficitEscalationBand: fiscal.consolidatedDeficitEscalationBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const surge = assessHouseholdWageInflationStressSurge({
    wageGrowthBand: household.wageGrowthBand,
    costOfLivingStress: household.costOfLivingStress,
    wave46HouseholdStressLatch: household.wave46HouseholdStressLatch === true,
    wageStressSurgeBand: household.wageStressSurgeBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-fiscal-household-wave-inflation" data-testid="fiscal-household-wave-inflation-panel">
      <h4>Fiscal pressure latch & household wage stress surge (round 46)</h4>
      <p>
        Fiscal {pressure.latchBand} · index {pressure.pressureIndex.toFixed(0)} · score adj{' '}
        {fiscalConsolidatedInflationPressureLatchScoreAdjustment(pressure.latchBand)}
      </p>
      <p>
        Household {surge.surgeBand} · index {surge.stressIndex.toFixed(0)} · score adj{' '}
        {householdWageInflationStressSurgeScoreAdjustment(surge.surgeBand)}
      </p>
      <p data-testid="fiscal-household-wave-note">{pressure.narrative}</p>
      <p>{surge.narrative}</p>
    </div>
  );
}


// --- source: react/MacroCorporateWaveInflationPanel.tsx ---
  assessMacroOutputGapInflationPressureLatch,
  macroOutputGapInflationPressureLatchScoreAdjustment,
} from '../inflation/macro-output-gap-inflation-pressure-latch.js';
  assessCorporateCapacityMarkupInflationSurge,
  corporateCapacityMarkupInflationSurgeScoreAdjustment,
} from '../inflation/corporate-capacity-markup-inflation-surge.js';

export interface MacroCorporateWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent06?: Agent06MacroSnapshot | null;
  agent08?: Agent08CorporateSnapshot | null;
}

export function MacroCorporateWaveInflationPanel(props: MacroCorporateWaveInflationPanelProps) {
  const macro = props.agent06 ?? {
    turn: props.inputs.turn,
    gdpGrowthBand: props.inputs.highInflationScenario ? ('strong' as const) : ('steady' as const),
    unemploymentBand: 'moderate' as const,
    outputGap: props.inputs.highInflationScenario ? 0.42 : 0.12,
    nominalDemandPressure: props.inputs.householdInflationScenarioActive ? 0.55 : 0.2,
    wave47MacroOutputGapLatch: props.inputs.householdInflationScenarioActive,
    outputGapEscalationBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const corporate = props.agent08 ?? {
    turn: props.inputs.turn,
    pricingPowerBand: props.inputs.highInflationScenario ? ('dominant' as const) : ('strong' as const),
    marginCompression: 'none' as const,
    passThroughIntent: props.inputs.creditShockActive ? ('full' as const) : ('partial' as const),
    wave47CorporateCapacityLatch: props.inputs.creditShockActive,
    capacityMarkupSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const latch = assessMacroOutputGapInflationPressureLatch({
    gdpGrowthBand: macro.gdpGrowthBand,
    outputGap: macro.outputGap,
    wave47MacroOutputGapLatch: macro.wave47MacroOutputGapLatch === true,
    outputGapEscalationBand: macro.outputGapEscalationBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const surge = assessCorporateCapacityMarkupInflationSurge({
    pricingPowerBand: corporate.pricingPowerBand,
    marginCompression: corporate.marginCompression,
    wave47CorporateCapacityLatch: corporate.wave47CorporateCapacityLatch === true,
    capacityMarkupSurgeBand: corporate.capacityMarkupSurgeBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-macro-corporate-wave-inflation" data-testid="macro-corporate-wave-inflation-panel">
      <h4>Macro output-gap latch & corporate capacity markup surge (round 47)</h4>
      <p>
        Macro {latch.latchBand} · index {latch.pressureIndex.toFixed(0)} · score adj{' '}
        {macroOutputGapInflationPressureLatchScoreAdjustment(latch.latchBand)}
      </p>
      <p>
        Corporate {surge.surgeBand} · index {surge.stressIndex.toFixed(0)} · score adj{' '}
        {corporateCapacityMarkupInflationSurgeScoreAdjustment(surge.surgeBand)}
      </p>
      <p data-testid="macro-corporate-wave-note">{latch.narrative}</p>
      <p>{surge.narrative}</p>
    </div>
  );
}


// --- source: react/ResearchTradeWaveInflationPanel.tsx ---
  assessResearchBreakthroughSupplySideInflationLatch,
  researchBreakthroughSupplySideInflationLatchScoreAdjustment,
} from '../inflation/research-breakthrough-supply-side-inflation-latch.js';
  assessTradeImportExchangeInflationPipelineSurge,
  tradeImportExchangeInflationPipelineSurgeScoreAdjustment,
} from '../inflation/trade-import-exchange-inflation-pipeline-surge.js';

export interface ResearchTradeWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent03?: Agent03ResearchSnapshot | null;
  agent15?: Agent15TradeSnapshot | null;
}

export function ResearchTradeWaveInflationPanel(props: ResearchTradeWaveInflationPanelProps) {
  const research = props.agent03 ?? {
    turn: props.inputs.turn,
    productivityGainBand: props.inputs.highInflationScenario ? ('flat' as const) : ('moderate' as const),
    supplySideReliefActive: !props.inputs.householdInflationScenarioActive,
    innovationInflationOffsetScore: props.inputs.householdInflationScenarioActive ? 0.2 : 0.55,
    wave48ResearchBreakthroughLatch: props.inputs.householdInflationScenarioActive,
    researchSupplySideFailureBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('building' as const),
  };

  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'open' as const,
    exchangeRatePressure: props.inputs.creditShockActive ? ('sharp_depreciation' as const) : ('depreciation' as const),
    commodityImportShare: props.inputs.highInflationScenario ? 0.42 : 0.28,
    wave48TradeImportPipelineLatch: props.inputs.creditShockActive,
    importExchangePipelineSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('stressed' as const),
  };

  const latch = assessResearchBreakthroughSupplySideInflationLatch({
    productivityGainBand: research.productivityGainBand,
    supplySideReliefActive: research.supplySideReliefActive,
    wave48ResearchBreakthroughLatch: research.wave48ResearchBreakthroughLatch === true,
    researchSupplySideFailureBand: research.researchSupplySideFailureBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const surge = assessTradeImportExchangeInflationPipelineSurge({
    tradeOpennessBand: trade.tradeOpennessBand,
    exchangeRatePressure: trade.exchangeRatePressure,
    wave48TradeImportPipelineLatch: trade.wave48TradeImportPipelineLatch === true,
    importExchangePipelineSurgeBand: trade.importExchangePipelineSurgeBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-research-trade-wave-inflation" data-testid="research-trade-wave-inflation-panel">
      <h4>Research breakthrough latch & trade import pipeline surge (round 48)</h4>
      <p>
        Research {latch.latchBand} · index {latch.pressureIndex.toFixed(0)} · score adj{' '}
        {researchBreakthroughSupplySideInflationLatchScoreAdjustment(latch.latchBand)}
      </p>
      <p>
        Trade {surge.surgeBand} · index {surge.stressIndex.toFixed(0)} · score adj{' '}
        {tradeImportExchangeInflationPipelineSurgeScoreAdjustment(surge.surgeBand)}
      </p>
      <p data-testid="research-trade-wave-note">{latch.narrative}</p>
      <p>{surge.narrative}</p>
    </div>
  );
}


// --- source: react/TradeGuardianWaveInflationPanel.tsx ---
  assessTradeClearedForwardArcInflationHandoffLatch,
  tradeClearedForwardArcInflationHandoffLatchScoreAdjustment,
} from '../inflation/trade-cleared-forward-arc-inflation-handoff-latch.js';
  assessGuardianEntrustmentEnvelopeInflationPressureSurge,
  guardianEntrustmentEnvelopeInflationPressureSurgeScoreAdjustment,
} from '../inflation/guardian-entrustment-envelope-inflation-pressure-surge.js';

export interface TradeGuardianWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent15?: Agent15TradeSnapshot | null;
  agent16?: Agent16GuardianSnapshot | null;
}

export function TradeGuardianWaveInflationPanel(props: TradeGuardianWaveInflationPanelProps) {
  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'open' as const,
    exchangeRatePressure: props.inputs.creditShockActive ? ('sharp_depreciation' as const) : ('depreciation' as const),
    commodityImportShare: props.inputs.highInflationScenario ? 0.44 : 0.3,
    wave49ClearedForwardArcHandoffLatch: props.inputs.creditShockActive,
    clearedForwardArcHandoffContinuityBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('strained' as const),
  };

  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand:
      props.inputs.publicStability < 35 ? ('urgent' as const) : props.inputs.fiscalPressure === 'critical' ? ('advisory' as const) : ('none' as const),
    narrativeShockSeverity: props.inputs.systemicLiquidityBand === 'critical' ? ('high' as const) : ('medium' as const),
    wave49EntrustmentEnvelopeLatch: props.inputs.householdInflationScenarioActive,
    entrustmentEnvelopePressureBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('ruptured' as const) : ('elevated' as const),
    entrustmentStrainIndex: props.inputs.publicStability < 40 ? 0.78 : 0.52,
  };

  const handoff = assessTradeClearedForwardArcInflationHandoffLatch({
    tradeOpennessBand: trade.tradeOpennessBand,
    exchangeRatePressure: trade.exchangeRatePressure,
    wave49ClearedForwardArcHandoffLatch: trade.wave49ClearedForwardArcHandoffLatch === true,
    clearedForwardArcHandoffContinuityBand: trade.clearedForwardArcHandoffContinuityBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const envelope = assessGuardianEntrustmentEnvelopeInflationPressureSurge({
    inflationGuardrailTripped: guardian.inflationGuardrailTripped,
    stabilityInterventionBand: guardian.stabilityInterventionBand,
    wave49EntrustmentEnvelopeLatch: guardian.wave49EntrustmentEnvelopeLatch === true,
    entrustmentEnvelopePressureBand: guardian.entrustmentEnvelopePressureBand ?? 'contained',
    entrustmentStrainIndex: guardian.entrustmentStrainIndex ?? 0.4,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-trade-guardian-wave-inflation" data-testid="trade-guardian-wave-inflation-panel">
      <h4>Trade cleared forward-arc handoff & guardian entrustment envelope (round 49)</h4>
      <p>
        Handoff {handoff.latchBand} · index {handoff.continuityIndex.toFixed(0)} · score adj{' '}
        {tradeClearedForwardArcInflationHandoffLatchScoreAdjustment(handoff.latchBand)}
      </p>
      <p>
        Envelope {envelope.surgeBand} · index {envelope.strainIndex.toFixed(0)} · score adj{' '}
        {guardianEntrustmentEnvelopeInflationPressureSurgeScoreAdjustment(envelope.surgeBand)}
      </p>
      <p data-testid="trade-guardian-wave-note">{handoff.narrative}</p>
      <p>{envelope.narrative}</p>
    </div>
  );
}


// --- source: react/HousingTransportWave50InflationPanel.tsx ---
  assessHousingWellbeingMortgageInflationEscalationLatch,
  housingWellbeingMortgageInflationEscalationLatchScoreAdjustment,
} from '../inflation/housing-wellbeing-mortgage-inflation-escalation-latch.js';
  assessTransportCorridorFreightInflationSurgeLatch,
  transportCorridorFreightInflationSurgeLatchScoreAdjustment,
} from '../inflation/transport-corridor-freight-inflation-surge-latch.js';

export interface HousingTransportWave50InflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent14?: Agent14HousingSnapshot | null;
  agent12?: Agent12TransportSnapshot | null;
}

export function HousingTransportWave50InflationPanel(props: HousingTransportWave50InflationPanelProps) {
  const housing = props.agent14 ?? {
    turn: props.inputs.turn,
    mortgageStressBand: props.inputs.householdInflationScenarioActive ? ('severe' as const) : ('elevated' as const),
    wellbeingCostBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('strained' as const),
    essentialServicesInflationFlag: props.inputs.householdInflationScenarioActive,
    wave50HousingWellbeingEscalationLatch: props.inputs.householdInflationScenarioActive,
    mortgageWellbeingEscalationBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('acute' as const) : ('building' as const),
  };

  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: props.inputs.creditShockActive ? ('critical' as const) : ('tight' as const),
    fuelSurchargeActive: props.inputs.creditShockActive,
    portBacklogBand: props.inputs.systemicLiquidityBand === 'critical' ? ('severe' as const) : ('moderate' as const),
    logisticsInflationScenarioActive: props.inputs.highInflationScenario,
    wave50FreightCorridorSurgeLatch: props.inputs.creditShockActive,
    corridorFreightSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const wellbeing = assessHousingWellbeingMortgageInflationEscalationLatch({
    mortgageStressBand: housing.mortgageStressBand,
    wellbeingCostBand: housing.wellbeingCostBand,
    wave50HousingWellbeingEscalationLatch: housing.wave50HousingWellbeingEscalationLatch === true,
    mortgageWellbeingEscalationBand: housing.mortgageWellbeingEscalationBand ?? 'contained',
    essentialServicesInflationFlag: housing.essentialServicesInflationFlag,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const corridor = assessTransportCorridorFreightInflationSurgeLatch({
    freightCapacityBand: transport.freightCapacityBand,
    fuelSurchargeActive: transport.fuelSurchargeActive,
    wave50FreightCorridorSurgeLatch: transport.wave50FreightCorridorSurgeLatch === true,
    corridorFreightSurgeBand: transport.corridorFreightSurgeBand ?? 'clear',
    portBacklogBand: transport.portBacklogBand,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-housing-transport-wave50-inflation" data-testid="housing-transport-wave50-inflation-panel">
      <h4>Housing wellbeing mortgage escalation & transport corridor freight surge (round 50)</h4>
      <p>
        Housing {wellbeing.latchBand} · index {wellbeing.escalationIndex.toFixed(0)} · score adj{' '}
        {housingWellbeingMortgageInflationEscalationLatchScoreAdjustment(wellbeing.latchBand)}
      </p>
      <p>
        Corridor {corridor.surgeBand} · index {corridor.corridorIndex.toFixed(0)} · score adj{' '}
        {transportCorridorFreightInflationSurgeLatchScoreAdjustment(corridor.surgeBand)}
      </p>
      <p data-testid="housing-transport-wave50-note">{wellbeing.narrative}</p>
      <p>{corridor.narrative}</p>
    </div>
  );
}


// OP10M_MODULE_END agent-10-finance
