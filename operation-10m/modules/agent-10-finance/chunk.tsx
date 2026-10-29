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

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    actorCreditStressIndex,
    fiscalPressure,
    highInflationScenario:
      base.highInflationScenario ||
      snapshot.transmissionStabilityFragile === true ||
      snapshot.macroRecoveryRankStressActive === true,
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
      snapshot.inlineActivationBoundaryCritical === true,
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
  /** Round 17: V10.12 utilities grid thin capacity margin (distinct from freight). */
  utilitiesGridCapacityMarginThin?: boolean;
  /** Round 17: severe rolling utility outages feeding tariff CPI metadata. */
  utilitiesOutageBandSevere?: boolean;
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

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
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

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    householdInflationScenarioActive,
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
  schemaVersion: '10.14.agent10.r26';
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
    schemaVersion: '10.14.agent10.r26',
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
    check('a10_r5_10', 'agent21 bundle schema', bundle.schemaVersion === '10.14.agent10.r26');
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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
      bundle.schemaVersion === '10.14.agent10.r26' &&
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


// OP10M_MODULE_END agent-10-finance
