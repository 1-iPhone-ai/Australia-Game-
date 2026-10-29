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

  check('a10_r3b_01', 'scenario preset count', MACRO_FINANCIAL_SCENARIO_PRESETS.length >= 6);
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


// OP10M_MODULE_END agent-10-finance
