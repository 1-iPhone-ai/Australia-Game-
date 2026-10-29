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

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    actorCreditStressIndex,
    fiscalPressure,
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

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    fiscalPressure,
    sovereignDebtPressure,
    fiscalSustainability,
    inflationSettingMultiplier,
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

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    householdAffordability,
    householdInflationScenarioActive,
    inflationSettingMultiplier,
    actorCreditStressIndex,
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

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    actorCreditStressIndex,
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

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    householdAffordability,
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
      snapshot.wellbeingCostBand === 'critical',
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

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.logisticsInflationScenarioActive ||
    (snapshot.freightCapacityBand === 'critical' && snapshot.portBacklogBand === 'severe')
  ) {
    highInflationScenario = true;
  }

  let systemicLiquidityBand = base.systemicLiquidityBand;
  if (snapshot.freightCapacityBand === 'critical' && snapshot.portBacklogBand !== 'clear') {
    systemicLiquidityBand = systemicLiquidityBand === 'critical' ? 'critical' : 'strained';
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

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
    publicStability,
  };
}

export function agent05EventsBridgeIntegrationNote(): string {
  return 'Agent 05 events snapshot adjusts inflation shock flags from narrative events; no event queue writes.';
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
  schemaVersion: '10.14.agent10.r10';
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
    schemaVersion: '10.14.agent10.r10',
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
    check('a10_r5_10', 'agent21 bundle schema', bundle.schemaVersion === '10.14.agent10.r10');
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
      bundle.schemaVersion === '10.14.agent10.r10' &&
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
      bundle.schemaVersion === '10.14.agent10.r10' &&
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
      bundle.schemaVersion === '10.14.agent10.r10' &&
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
      bundle.schemaVersion === '10.14.agent10.r10' &&
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


// OP10M_MODULE_END agent-10-finance
